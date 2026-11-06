import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEMO_USERS, DEMO_RESTAURANTS } from "@/lib/demoData";
import InspectorClient from "./InspectorClient";

export const dynamic = "force-dynamic";

export default async function InspectorDashboardPage() {
  const realSession = await getSession();
  const isDemoMode = !realSession || (realSession.role !== "INSPECTOR" && realSession.role !== "ADMIN");
  const session = realSession && (realSession.role === "INSPECTOR" || realSession.role === "ADMIN")
    ? realSession
    : DEMO_USERS.inspector;

  let pendingRequests: any[] = [];
  let restaurants: any[] = [];
  let pendingDocs: any[] = [];
  let recentInspections: any[] = [];

  try {
    pendingRequests = await prisma.verificationRequest.findMany({
      where: { status: "PENDING" },
      include: {
        restaurant: {
          include: { kitchenProfile: true, documents: true },
        },
        requester: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { requestedAt: "asc" },
    });

    restaurants = await prisma.restaurant.findMany({
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

    pendingDocs = await prisma.document.findMany({
      where: { verificationStatus: "PENDING_VERIFICATION" },
      include: {
        restaurant: { select: { name: true, locality: true, city: true } },
        uploader: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    recentInspections = await prisma.inspection.findMany({
      where: session.role === "ADMIN" ? {} : { inspectorId: session.userId },
      include: {
        restaurant: { select: { name: true, locality: true, city: true } },
        categories: true,
      },
      orderBy: { completedDate: "desc" },
      take: 10,
    });
  } catch (e) {
    console.warn("Inspector query falling back to demonstration dataset:", e);
  }

  if (!restaurants || restaurants.length === 0) {
    restaurants = DEMO_RESTAURANTS.map((r) => ({
      id: r.id,
      name: r.name,
      locality: r.locality,
      city: r.city,
      safetyScore: r.safetyScore,
      verificationStatus: r.verificationStatus,
      documents: [],
    }));
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    pendingRequests = [
      {
        id: "vreq-1",
        status: "PENDING",
        notes: "Requesting on-site FSSAI Schedule 4 comprehensive hygiene audit for Q4 2026 certification.",
        requestedAt: new Date("2026-10-15T09:30:00Z"),
        restaurant: DEMO_RESTAURANTS[1],
        requester: {
          name: "Priya Sundaram",
          email: "priya.owner@example.com",
          phone: "+91 98450 12345",
        },
      },
    ];
  }

  if (!pendingDocs || pendingDocs.length === 0) {
    pendingDocs = [
      {
        id: "pdoc-1",
        docType: "WATER_TEST_REPORT",
        title: "IS 10500 Potable Water Bacteriological Test (Borewell Post-UV)",
        fileName: "water_test_q4_borewell.pdf",
        fileUrl: "/docs/water_test_sample.pdf",
        verificationStatus: "PENDING_VERIFICATION",
        issueDate: new Date("2026-10-12"),
        notes: "Tested by NABL Accredited Enviro-Labs Bangalore.",
        createdAt: new Date("2026-10-14T11:20:00Z"),
        restaurant: {
          name: DEMO_RESTAURANTS[1].name,
          locality: DEMO_RESTAURANTS[1].locality,
          city: DEMO_RESTAURANTS[1].city,
        },
        uploader: {
          name: "Priya Sundaram",
          email: "priya.owner@example.com",
        },
      },
      {
        id: "pdoc-2",
        docType: "PEST_CONTROL_CONTRACT",
        title: "Commercial Pest Treatment Log Sheet (Sept-Oct 2026)",
        fileName: "pest_service_oct2026.pdf",
        fileUrl: "/docs/pest_control_sample.pdf",
        verificationStatus: "PENDING_VERIFICATION",
        issueDate: new Date("2026-10-02"),
        notes: "Monthly rodent baiting and insect misting record.",
        createdAt: new Date("2026-10-14T11:25:00Z"),
        restaurant: {
          name: DEMO_RESTAURANTS[2].name,
          locality: DEMO_RESTAURANTS[2].locality,
          city: DEMO_RESTAURANTS[2].city,
        },
        uploader: {
          name: "Imran Pasha",
          email: "imran@biryanicloudbox.in",
        },
      },
    ];
  }

  if (!recentInspections || recentInspections.length === 0) {
    recentInspections = [
      {
        id: "rinsp-1",
        certificateNumber: "KP-AUD-2026-10-0081",
        totalScore: 94,
        hygieneRating: 5,
        completedDate: new Date("2026-10-18T14:30:00Z"),
        findingsSummary: "Exemplary adherence to FSSAI Schedule 4 sanitary norms. Potable water test to IS 10500 standards confirmed.",
        restaurant: {
          name: DEMO_RESTAURANTS[0].name,
          locality: DEMO_RESTAURANTS[0].locality,
          city: DEMO_RESTAURANTS[0].city,
        },
        categories: DEMO_RESTAURANTS[0].inspections[0].categories,
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
              <strong>Demonstration Mode (Food Safety Inspector Portal)</strong> — Conducting on-site 5-category scoring rubrics and reviewing verification requests with verified model data.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1 bg-white border border-[#B8D4C2] rounded font-semibold text-[#143D2B] hover:bg-[#DCE9E0]">
              Log In as Auditor
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#E7E7DE] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
            Food Safety Auditor Console
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#161815] mt-1">
            Inspection Management & Scoring Workbench
          </h1>
          <p className="text-xs sm:text-sm text-[#5E635D] mt-1">
            Conduct on-site audits aligned with FSSAI Schedule 4 standards, evaluate laboratory test reports, and attest compliance certificates.
          </p>
        </div>

        <div className="text-right text-xs text-[#868A85]">
          <span>Inspector: </span>
          <strong className="text-[#161815]">{session.name}</strong>
          <span className="block text-[11px] text-[#2B6843]">FSSAI Accredited Lead Auditor</span>
        </div>
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

