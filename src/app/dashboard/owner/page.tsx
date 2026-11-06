import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OwnerClient from "./OwnerClient";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const session = await getSession();
  if (!session || (session.role !== "RESTAURANT_OWNER" && session.role !== "ADMIN")) {
    redirect("/login");
  }

  // Fetch restaurants owned by this user
  const restaurants = await prisma.restaurant.findMany({
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
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
