import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

const documentUploadSchema = z.object({
  restaurantId: z.string().min(1),
  docType: z.enum([
    "FSSAI_CERTIFICATE",
    "PEST_CONTROL_LOG",
    "WATER_TEST_REPORT",
    "MEDICAL_FITNESS_CERT",
    "CLEANING_SANITATION_LOG",
    "TEMPERATURE_LOG",
    "FOSTAC_CERTIFICATE",
    "AUDIT_REPORT",
  ]),
  title: z.string().min(3),
  fileName: z.string().min(3),
  fileUrl: z.string().min(1),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const result = documentUploadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { restaurantId, docType, title, fileName, fileUrl, issueDate, expiryDate, notes } =
      result.data;

    // Check ownership if user is a restaurant owner
    if (session.role === "RESTAURANT_OWNER") {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { ownerId: true },
      });
      if (restaurant?.ownerId !== session.userId) {
        return NextResponse.json(
          { error: "You can only submit documents for restaurants you own." },
          { status: 403 }
        );
      }
    }

    const doc = await prisma.document.create({
      data: {
        restaurantId,
        uploaderId: session.userId,
        docType,
        title,
        fileName,
        fileUrl,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        verificationStatus: "PENDING_VERIFICATION", // Default to unverified on upload
        notes,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        actorRole: session.role,
        action: "DOCUMENT_UPLOADED",
        entityType: "Document",
        entityId: doc.id,
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}

// Verification review endpoint (PATCH) - Inspectors and Admins only!
export async function PATCH(req: Request) {
  try {
    const session = await requireRole(["INSPECTOR", "ADMIN"]);
    const { documentId, status, rejectionReason, notes } = await req.json();

    if (!documentId || !["VERIFIED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid review parameters" }, { status: 400 });
    }

    const doc = await prisma.document.update({
      where: { id: documentId },
      data: {
        verificationStatus: status,
        verifiedById: session.userId,
        verifiedAt: new Date(),
        rejectionReason: status === "REJECTED" ? rejectionReason : null,
        notes: notes || undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.userId,
        actorRole: session.role,
        action: `DOCUMENT_${status}`,
        entityType: "Document",
        entityId: doc.id,
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Only authorized verification personnel may verify or reject documents." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Failed to review document" }, { status: 500 });
  }
}
