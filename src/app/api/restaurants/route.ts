import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEMO_RESTAURANTS } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").toLowerCase();
    const city = searchParams.get("city") || "";
    const status = searchParams.get("status") || "";
    const minScore = searchParams.get("minScore");
    const sortBy = searchParams.get("sortBy") || "safetyScore"; // safetyScore, foodRating, lastInspectedAt

    let restaurants: any[] = [];

    try {
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

      restaurants = await prisma.restaurant.findMany({
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
    } catch (dbError) {
      console.warn("Database unavailable, falling back to demonstration dataset:", dbError);
    }

    // If database returned 0 or threw, filter from DEMO_RESTAURANTS
    if (!restaurants || restaurants.length === 0) {
      restaurants = DEMO_RESTAURANTS.filter((r) => {
        if (query) {
          const matchQuery =
            r.name.toLowerCase().includes(query) ||
            r.cuisine.toLowerCase().includes(query) ||
            r.locality.toLowerCase().includes(query) ||
            r.city.toLowerCase().includes(query) ||
            r.streetAddress.toLowerCase().includes(query);
          if (!matchQuery) return false;
        }
        if (city && city !== "ALL" && r.city !== city) return false;
        if (status && status !== "ALL" && r.verificationStatus !== status) return false;
        if (minScore) {
          const scoreNum = parseInt(minScore, 10);
          if (!isNaN(scoreNum) && r.safetyScore < scoreNum) return false;
        }
        return true;
      });

      restaurants.sort((a, b) => {
        if (sortBy === "foodRating") return b.foodRating - a.foodRating;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return b.safetyScore - a.safetyScore;
      });
    }

    return NextResponse.json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Fetch restaurants error:", error);
    return NextResponse.json({
      success: true,
      count: DEMO_RESTAURANTS.length,
      restaurants: DEMO_RESTAURANTS,
    });
  }
}
