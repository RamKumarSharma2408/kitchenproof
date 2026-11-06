import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { calculateSafetyScore, CategoryAssessmentInput } from "@/lib/scoring";

const categorySchema = z.object({
  categoryKey: z.string(),
  name: z.string(),
  weightPercent: z.number(),
  scoreObtained: z.number().min(0).max(100),
  verificationStatus: z.enum([
    "VERIFIED_COMPLIANT",
    "MINOR_NON_COMPLIANCE",
    "CRITICAL_NON_COMPLIANCE",
    "NOT_OBSERVED",
  ]),
  observations: z.string().min(3),
  recommendations: z.string().optional(),
});

const inspectionSchema = z.object({
  restaurantId: z.string().min(1),
  inspectionType: z.enum([
    "INITIAL_VERIFICATION",
    "ROUTINE_HYGIENE",
    "SURPRISE_AUDIT",
    "REINSPECTION",
    "CONSUMER_COMPLAINT_AUDIT",
  ]),
  findingsSummary: z.string().min(10),
  criticalViolationsCount: z.number().default(0),
  nonCriticalViolationsCount: z.number().default(0),
  correctiveActionsRequired: z.string().optional(),
  reInspectionDueDate: z.string().optional(),
  categories: z.array(categorySchema).min(1),
});

export async function POST(req: Request) {
  try {
    const session = await requireRole(["INSPECTOR", "ADMIN"]);
    const body = await req.json();
    const result = inspectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const {
      restaurantId,
      inspectionType,
      findingsSummary,
      criticalViolationsCount,
      nonCriticalViolationsCount,
      correctiveActionsRequired,
      reInspectionDueDate,
      categories,
    } = result.data;

    // Calculate score using Scoring Engine
    const assessmentInputs: CategoryAssessmentInput[] = categories.map((c) => ({
      categoryKey: c.categoryKey,
      scoreObtained: c.scoreObtained,
      verificationStatus: c.verificationStatus as any,
      evidenceCount: 1,
      hasExpiredEvidence: false,
    }));

    const calculation = calculateSafetyScore(assessmentInputs);

    // Get current restaurant state for score history
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const previousScore = restaurant.safetyScore;

    // Determine verification status
    let newVerificationStatus = "VERIFIED";
    if (criticalViolationsCount > 0) {
      newVerificationStatus = "ACTION_REQUIRED";
    } else if (calculation.overallScore < 60) {
      newVerificationStatus = "ACTION_REQUIRED";
    }

    // Save inspection and categories in transaction
    const inspection = await prisma.$transaction(async (tx) => {
      const createdInsp = await tx.inspection.create({
        data: {
          restaurantId,
          inspectorId: session.userId,
          inspectionType,
          status: "COMPLETED",
          completedDate: new Date(),
          overallScore: calculation.overallScore,
          hygieneRatingSmiles: calculation.hygieneRatingSmiles,
          findingsSummary,
          criticalViolationsCount,
          nonCriticalViolationsCount,
          correctiveActionsRequired,
          reInspectionDueDate: reInspectionDueDate ? new Date(reInspectionDueDate) : null,
          categories: {
            create: categories.map((cat) => ({
              categoryKey: cat.categoryKey,
              name: cat.name,
              weightPercent: cat.weightPercent,
              scoreObtained: cat.scoreObtained,
              weightedScore: (cat.scoreObtained * cat.weightPercent) / 100,
              verificationStatus: cat.verificationStatus,
              observations: cat.observations,
              recommendations: cat.recommendations,
            })),
          },
        },
      });

      // Update restaurant's current scores
      await tx.restaurant.update({
        where: { id: restaurantId },
        data: {
          safetyScore: calculation.overallScore,
          dataConfidenceScore: calculation.dataConfidenceScore,
          verificationStatus: newVerificationStatus,
          lastInspectedAt: new Date(),
        },
      });

      // Record score history
      await tx.scoreHistory.create({
        data: {
          restaurantId,
          previousScore,
          newScore: calculation.overallScore,
          triggerEvent: "NEW_INSPECTION",
          notes: `Inspection completed by ${session.name} (${inspectionType})`,
        },
      });

      // Update any pending verification requests
      await tx.verificationRequest.updateMany({
        where: {
          restaurantId,
          status: "PENDING",
        },
        data: {
          status: newVerificationStatus === "VERIFIED" ? "APPROVED" : "NEEDS_MORE_INFO",
          reviewerId: session.userId,
          reviewedAt: new Date(),
          reviewDecisionNotes: findingsSummary,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          actorId: session.userId,
          actorRole: session.role,
          action: "INSPECTION_RECORDED",
          entityType: "Inspection",
          entityId: createdInsp.id,
          previousState: JSON.stringify({ score: previousScore, status: restaurant.verificationStatus }),
          newState: JSON.stringify({ score: calculation.overallScore, status: newVerificationStatus }),
        },
      });

      return createdInsp;
    });

    return NextResponse.json({
      success: true,
      inspectionId: inspection.id,
      calculation,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Only authorized verification personnel may record official inspections." },
        { status: 403 }
      );
    }
    console.error("Record inspection error:", error);
    return NextResponse.json({ error: "Failed to record inspection outcome" }, { status: 500 });
  }
}
