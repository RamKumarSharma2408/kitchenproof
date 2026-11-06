import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RestaurantCard from "@/components/RestaurantCard";
import { formatDate } from "@/lib/utils";
import {
  Bookmark,
  AlertTriangle,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConsumerDashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch saved kitchens
  const saved = await prisma.savedRestaurant.findMany({
    where: { userId: session.userId },
    include: {
      restaurant: {
        include: { kitchenProfile: true },
      },
    },
    orderBy: { savedAt: "desc" },
  });

  // Fetch submitted reports
  const reports = await prisma.consumerReport.findMany({
    where: { reporterId: session.userId },
    include: {
      restaurant: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch notifications
  const notifications = await prisma.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E7DE] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
            Diner Account
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#161815] mt-1">
            Welcome back, {session.name}
          </h1>
          <p className="text-xs text-[#5E635D] mt-1">
            Track your bookmarked kitchens, safety alerts, and submitted hygiene observations.
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#143D2B] text-white text-xs font-semibold hover:bg-[#1F593F] transition-colors self-start sm:self-auto"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Explore More Kitchens</span>
        </Link>
      </div>

      {/* Grid: Saved Kitchens */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-[#161815] flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#143D2B]" />
            <span>Saved Kitchens ({saved.length})</span>
          </h2>
        </div>

        {saved.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((item) => (
              <RestaurantCard key={item.id} restaurant={item.restaurant} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E7E7DE] rounded-xl p-8 text-center max-w-md mx-auto space-y-2">
            <p className="text-xs text-[#5E635D]">You haven&apos;t saved any kitchens yet.</p>
            <Link
              href="/explore"
              className="text-xs font-semibold text-[#143D2B] underline block"
            >
              Browse verified kitchens in your city →
            </Link>
          </div>
        )}
      </div>

      {/* Grid: Reported Concerns Tracking */}
      <div className="bg-white border border-[#E7E7DE] rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#161815] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#B91C1C]" />
            <span>Your Submitted Safety Concerns ({reports.length})</span>
          </h2>
          <p className="text-xs text-[#5E635D] mt-1">
            Community reports are triaged by accredited verification personnel. Status updates are reflected below.
          </p>
        </div>

        {reports.length > 0 ? (
          <div className="divide-y divide-[#E7E7DE] border-y border-[#E7E7DE]">
            {reports.map((report) => (
              <div key={report.id} className="py-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Link
                      href={`/restaurants/${report.restaurant.slug}`}
                      className="font-semibold text-sm text-[#143D2B] hover:underline"
                    >
                      {report.restaurant.name}
                    </Link>
                    <span className="text-xs text-[#868A85] ml-2">
                      • {report.issueType.replace(/_/g, " ")}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border self-start ${
                      report.status === "RESOLVED"
                        ? "bg-brand-50 text-brand-900 border-brand-200"
                        : report.status === "UNDER_INVESTIGATION"
                        ? "bg-amber-50 text-amber-900 border-amber-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {report.status.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="text-xs text-[#323631] leading-relaxed">
                  &quot;{report.description}&quot;
                </p>

                {report.resolutionNotes && (
                  <div className="bg-[#FBFBF9] p-2.5 rounded border border-[#E7E7DE] text-[11px] text-[#5E635D]">
                    <strong>Auditor Investigation Outcome:</strong> {report.resolutionNotes}
                  </div>
                )}

                <div className="text-[10px] text-[#868A85]">
                  Submitted on {formatDate(report.createdAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#5E635D]">No safety concerns reported.</p>
        )}
      </div>
    </div>
  );
}
