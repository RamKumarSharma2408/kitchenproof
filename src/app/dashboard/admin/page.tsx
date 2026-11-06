import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  Building,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Users,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // Calculate real metrics directly from the database
  const totalRestaurants = await prisma.restaurant.count();
  const verifiedRestaurants = await prisma.restaurant.count({
    where: { verificationStatus: "VERIFIED" },
  });
  const pendingRequests = await prisma.verificationRequest.count({
    where: { status: "PENDING" },
  });
  const reportedConcerns = await prisma.consumerReport.count({
    where: { status: { in: ["SUBMITTED", "UNDER_INVESTIGATION"] } },
  });
  const totalUsers = await prisma.user.count();
  const totalInspections = await prisma.inspection.count();

  // Expired licenses
  const expiredLicenses = await prisma.restaurant.count({
    where: {
      fssaiValidUntil: { lt: new Date() },
    },
  });

  // Recent audit logs
  const auditLogs = await prisma.auditLog.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    include: {
      actor: { select: { name: true, role: true, email: true } },
    },
  });

  // All restaurants with status
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      locality: true,
      safetyScore: true,
      verificationStatus: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E7E7DE] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
            Platform Governance Portal
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#161815] mt-1">
            KitchenProof National Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#5E635D] mt-1">
            System-wide compliance overview, auditor actions, and transparent metrics calculated live from database.
          </p>
        </div>

        <div className="text-right text-xs text-[#868A85]">
          <span>Logged in as Admin: </span>
          <strong className="text-[#161815]">{session.name}</strong>
        </div>
      </div>

      {/* Real Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-5 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#868A85]">
            Total Kitchens
          </span>
          <strong className="text-3xl font-serif font-bold text-[#161815] block">
            {totalRestaurants}
          </strong>
          <span className="text-[10px] text-[#5E635D]">Across 6 Metros</span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#868A85]">
            Verified Audits
          </span>
          <strong className="text-3xl font-serif font-bold text-[#143D2B] block">
            {verifiedRestaurants}
          </strong>
          <span className="text-[10px] text-emerald-800">
            {((verifiedRestaurants / Math.max(1, totalRestaurants)) * 100).toFixed(0)}% of Directory
          </span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#868A85]">
            Pending Audits
          </span>
          <strong className="text-3xl font-serif font-bold text-[#D97706] block">
            {pendingRequests}
          </strong>
          <span className="text-[10px] text-amber-800">Awaiting Inspector</span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#868A85]">
            Active Concerns
          </span>
          <strong className="text-3xl font-serif font-bold text-[#DC2626] block">
            {reportedConcerns}
          </strong>
          <span className="text-[10px] text-red-800">Community Reports</span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#868A85]">
            Expired Licenses
          </span>
          <strong className="text-3xl font-serif font-bold text-[#DC2626] block">
            {expiredLicenses}
          </strong>
          <span className="text-[10px] text-red-800">Renewal Mandated</span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#868A85]">
            Registered Users
          </span>
          <strong className="text-3xl font-serif font-bold text-[#161815] block">
            {totalUsers}
          </strong>
          <span className="text-[10px] text-[#5E635D]">Consumers & Operators</span>
        </div>
      </div>

      {/* Row 2: Directory Directory Table */}
      <div className="bg-white border border-[#E7E7DE] rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#161815]">
              National Kitchen Profiles Overview
            </h2>
            <p className="text-xs text-[#5E635D] mt-0.5">
              Current compliance scores, audit validity, and geographical presence.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F0] text-[#5E635D] uppercase text-[10px] font-semibold tracking-wider border-b border-[#E7E7DE]">
              <tr>
                <th className="py-3 px-4">Restaurant</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Safety Score</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7DE]">
              {restaurants.map((r) => (
                <tr key={r.id} className="hover:bg-[#FBFBF9] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#161815]">{r.name}</td>
                  <td className="py-3 px-4 text-[#5E635D]">
                    {r.locality}, {r.city}
                  </td>
                  <td className="py-3 px-4 font-bold text-sm">
                    {r.safetyScore > 0 ? `${r.safetyScore}/100` : "Unrated"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        r.verificationStatus === "VERIFIED"
                          ? "bg-brand-50 text-brand-900 border border-brand-200"
                          : r.verificationStatus === "ACTION_REQUIRED"
                          ? "bg-crimson-50 text-crimson-900 border border-crimson-200"
                          : "bg-amber-50 text-amber-900 border border-amber-200"
                      }`}
                    >
                      {r.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/restaurants/${r.slug}`}
                      className="font-semibold text-[#143D2B] hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Live Audit Log Stream */}
      <div className="bg-white border border-[#E7E7DE] rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#161815] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#143D2B]" />
            <span>Immutable Platform Audit Stream</span>
          </h2>
          <p className="text-xs text-[#5E635D] mt-0.5">
            Every critical event (inspections published, documents verified, logins, reports) is immutably logged for regulatory auditability.
          </p>
        </div>

        <div className="divide-y divide-[#E7E7DE] border-y border-[#E7E7DE] max-h-96 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#143D2B] bg-[#F0F6F2] px-1.5 py-0.5 rounded text-[10px]">
                    {log.action}
                  </span>
                  <span className="text-[#161815] font-medium">
                    Entity: {log.entityType} ({log.entityId?.slice(0, 8)}...)
                  </span>
                </div>
                <p className="text-[11px] text-[#5E635D]">
                  Actor: {log.actor?.name || "System"} ({log.actorRole || "Automated System"})
                </p>
              </div>

              <span className="text-[10px] text-[#868A85] flex-shrink-0">
                {formatDateTime(log.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
