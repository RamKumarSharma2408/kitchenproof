import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";
    const status = searchParams.get("status") || "";
    const minScore = searchParams.get("minScore");
    const sortBy = searchParams.get("sortBy") || "safetyScore"; // safetyScore, foodRating, lastInspectedAt

    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { cuisine: { contains: query } },
        { locality: { contains: query } },
        { city: { contains: query } },
        { streetAddress: { contains: query } },
      ];
    }

    if (city && city !== "ALL") {
      whereClause.city = city;
    }

    if (status && status !== "ALL") {
      whereClause.verificationStatus = status;
    }

    if (minScore) {
      const scoreNum = parseInt(minScore, 10);
      if (!isNaN(scoreNum)) {
        whereClause.safetyScore = { gte: scoreNum };
      }
    }

    let orderBy: any = { safetyScore: "desc" };
    if (sortBy === "foodRating") {
      orderBy = { foodRating: "desc" };
    } else if (sortBy === "lastInspectedAt") {
      orderBy = { lastInspectedAt: "desc" };
    } else if (sortBy === "name") {
      orderBy = { name: "asc" };
    }

    const restaurants = await prisma.restaurant.findMany({
      where: whereClause,
      orderBy,
      include: {
        kitchenProfile: true,
        inspections: {
          orderBy: { completedDate: "desc" },
          take: 1,
          include: { categories: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Fetch restaurants error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve restaurant profiles" },
      { status: 500 }
    );
  }
}
