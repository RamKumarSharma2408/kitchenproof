import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEMO_USERS, DEMO_RESTAURANTS } from "@/lib/demoData";
import OwnerClient from "./OwnerClient";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const realSession = await getSession();
  const isDemoMode = !realSession || (realSession.role !== "RESTAURANT_OWNER" && realSession.role !== "ADMIN");
  const session = realSession && (realSession.role === "RESTAURANT_OWNER" || realSession.role === "ADMIN")
    ? realSession
    : DEMO_USERS.owner;

  let restaurants: any[] = [];

  try {
    restaurants = await prisma.restaurant.findMany({
      where: session.role === "ADMIN" ? {} : { ownerId: session.userId },
      include: {
        kitchenProfile: true,
        documents: {
          orderBy: { createdAt: "desc" },
        },
        inspections: {
          orderBy: { completedDate: "desc" },
          take: 3,
          include: { categories: true },
        },
        verificationRequests: {
          orderBy: { requestedAt: "desc" },
        },
      },
    });
  } catch (e) {
    console.warn("Owner query falling back to demonstration dataset:", e);
  }

  if (!restaurants || restaurants.length === 0) {
    restaurants = [
      {
        ...DEMO_RESTAURANTS[0],
        verificationRequests: [
          {
            id: "req-1",
            status: "APPROVED",
            notes: "Annual FSSAI Schedule 4 Comprehensive Hygiene Re-Audit",
            requestedAt: new Date("2026-10-10"),
            updatedAt: new Date("2026-10-18"),
          },
        ],
      },
      {
        ...DEMO_RESTAURANTS[1],
        verificationRequests: [],
      },
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Demonstration Banner */}
      {isDemoMode && (
        <div className="bg-[#F0F6F2] border border-[#B8D4C2] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#143D2B]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <strong>Demonstration Mode (Restaurant Owner Portal)</strong> — Managing compliance vault, laboratory reports, and verification requests for Spice Pavilion & Dosa Heritage.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1 bg-white border border-[#B8D4C2] rounded font-semibold text-[#143D2B] hover:bg-[#DCE9E0]">
              Log In as Restaurant Owner
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#E7E7DE] pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
          Food Business Operator Portal
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#161815] mt-1">
          Restaurant Compliance & Kitchen Management
        </h1>
        <p className="text-xs sm:text-sm text-[#5E635D] mt-1">
          Manage your kitchen safety profile, upload statutory laboratory test reports, track license expiries, and request independent verification.
        </p>
      </div>

      <OwnerClient
        initialRestaurants={restaurants}
        userName={session.name}
        userEmail={session.email}
      />
    </div>
  );
}

