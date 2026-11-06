import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireAuth();

    let whereClause: any = {};
    if (session.role === "RESTAURANT_OWNER") {
      whereClause.requestedById = session.userId;
    }

    const requests = await prisma.verificationRequest.findMany({
      where: whereClause,
      include: {
        restaurant: {
          include: { kitchenProfile: true },
        },
        requester: {
          select: { name: true, email: true, phone: true },
        },
      },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch verification requests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(["RESTAURANT_OWNER", "ADMIN"]);
    const { restaurantId, requestNotes } = await req.json();

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 });
    }

    // Verify ownership
    if (session.role === "RESTAURANT_OWNER") {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { ownerId: true },
      });
      if (restaurant?.ownerId !== session.userId) {
        return NextResponse.json(
          { error: "You can only request verification for your own restaurants." },
          { status: 403 }
        );
      }
    }

    const request = await prisma.verificationRequest.create({
      data: {
        restaurantId,
        requestedById: session.userId,
        status: "PENDING",
        requestNotes,
      },
    });

    // Update restaurant status to PENDING_REVIEW if unverified
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { verificationStatus: "PENDING_REVIEW" },
    });

    return NextResponse.json({ success: true, request });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create verification request" }, { status: 500 });
  }
}

