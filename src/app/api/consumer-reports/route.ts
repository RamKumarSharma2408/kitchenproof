import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const reportSchema = z.object({
  restaurantId: z.string().min(1),
  reporterName: z.string().min(2),
  reporterEmail: z.string().email(),
  issueType: z.enum([
    "POOR_HYGIENE",
    "UNHYGIENIC_FOOD_HANDLER",
    "PEST_SIGHTING",
    "SICKNESS_SUSPICION",
    "EXPIRED_INGREDIENTS",
    "GENERAL_SAFETY",
  ]),
  description: z.string().min(10, "Please provide at least 10 characters describing the incident"),
  incidentDate: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const result = reportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { restaurantId, reporterName, reporterEmail, issueType, description, incidentDate } =
      result.data;

    const report = await prisma.consumerReport.create({
      data: {
        restaurantId,
        reporterId: session?.userId || null,
        reporterName,
        reporterEmail,
        issueType,
        description,
        incidentDate: incidentDate ? new Date(incidentDate) : new Date(),
        status: "SUBMITTED",
      },
    });

    // Notify restaurant owner if one exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true, name: true },
    });

    if (restaurant?.ownerId) {
      await prisma.notification.create({
        data: {
          userId: restaurant.ownerId,
          type: "SAFETY_ALERT",
          title: `New Safety Concern Submitted for ${restaurant.name}`,
          message: `A consumer reported an observation regarding ${issueType.replace(/_/g, " ").toLowerCase()}. Please review and submit corrective documentation.`,
          link: `/dashboard/owner`,
        },
      });
    }

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (error) {
    console.error("Submit report error:", error);
    return NextResponse.json({ error: "Failed to submit safety report" }, { status: 500 });
  }
}

