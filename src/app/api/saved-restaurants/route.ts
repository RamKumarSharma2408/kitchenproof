import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireAuth();

    const saved = await prisma.savedRestaurant.findMany({
      where: { userId: session.userId },
      include: {
        restaurant: {
          include: { kitchenProfile: true },
        },
      },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      saved: saved.map((s) => s.restaurant),
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch saved kitchens" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const { restaurantId } = await req.json();

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 });
    }

    const existing = await prisma.savedRestaurant.findUnique({
      where: {
        userId_restaurantId: {
          userId: session.userId,
          restaurantId,
        },
      },
    });

    if (existing) {
      // Toggle: remove if already saved
      await prisma.savedRestaurant.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, saved: false });
    } else {
      await prisma.savedRestaurant.create({
        data: {
          userId: session.userId,
          restaurantId,
        },
      });
      return NextResponse.json({ success: true, saved: true });
    }
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please sign in to save kitchens" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update saved status" }, { status: 500 });
  }
}
