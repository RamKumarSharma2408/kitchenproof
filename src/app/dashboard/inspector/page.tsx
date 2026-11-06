import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InspectorClient from "./InspectorClient";

export const dynamic = "force-dynamic";

export default async function InspectorDashboardPage() {
  const session = await getSession();
  if (!session || (session.role !== "INSPECTOR" && session.role !== "ADMIN")) {
    redirect("/login");
  }

  // Fetch pending verification requests
  const pendingRequests = await prisma.verificationRequest.findMany({
    where: { status: "PENDING" },
    include: {
      restaurant: {
        include: { kitchenProfile: true, documents: true },
      },
      requester: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { requestedAt: "asc" },
  });

  // Fetch all restaurants for inspection recording
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      locality: true,
      city: true,
      safetyScore: true,
      verificationStatus: true,
      documents: {
        where: { verificationStatus: "PENDING_VERIFICATION" },
      },
    },
    orderBy: { name: "asc" },
  });

  // Fetch pending documents needing review
  const pendingDocs = await prisma.document.findMany({
    where: { verificationStatus: "PENDING_VERIFICATION" },
    include: {
      restaurant: { select: { name: true, locality: true, city: true } },
      uploader: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch recent inspections conducted by this inspector
  const recentInspections = await prisma.inspection.findMany({
    where: session.role === "ADMIN" ? {} : { inspectorId: session.userId },
    include: {
      restaurant: { select: { name: true, locality: true, city: true } },
      categories: true,
    },
    orderBy: { completedDate: "desc" },
    take: 10,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E7E7DE] pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
          Authorized Verification Officer Portal
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#161815] mt-1">
          Inspection Audits & Evidence Validation
        </h1>
        <p className="text-xs sm:text-sm text-[#5E635D] mt-1">
          Logged in as <strong>{session.name}</strong>. Record physical hygiene inspections, audit laboratory tests, and enforce compliance benchmarks.
        </p>
      </div>

      <InspectorClient
        pendingRequests={pendingRequests}
        restaurants={restaurants}
        pendingDocs={pendingDocs}
        recentInspections={recentInspections}
        inspectorName={session.name}
      />
    </div>
  );
}
