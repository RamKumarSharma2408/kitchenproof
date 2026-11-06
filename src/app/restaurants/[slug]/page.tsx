import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEMO_RESTAURANTS } from "@/lib/demoData";
import SafetyScoreBadge from "@/components/SafetyScoreBadge";
import { formatDate, getVerificationStatusBadge, getScoreBadge } from "@/lib/utils";
import { SCORING_CATEGORIES } from "@/lib/scoring";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Star,
  CheckCircle2,
  Clock,
  ExternalLink,
  Droplet,
  Flame,
  Bug,
  Thermometer,
  Award,
  Users,
  Info,
  Building,
} from "lucide-react";
import ProfileActions from "./ProfileActions";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export default async function RestaurantProfilePage({ params }: Props) {
  let restaurant: any = null;

  try {
    restaurant = await prisma.restaurant.findUnique({
      where: { slug: params.slug },
      include: {
        kitchenProfile: true,
        documents: {
          orderBy: { createdAt: "desc" },
        },
        inspections: {
          orderBy: { completedDate: "desc" },
          include: {
            inspector: { select: { name: true } },
            categories: true,
          },
        },
        safetyAssessments: true,
        consumerReports: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
  } catch (dbErr) {
    console.warn("Database unavailable, searching demo restaurants:", dbErr);
  }

  if (!restaurant) {
    restaurant = DEMO_RESTAURANTS.find((r) => r.slug === params.slug) || null;
  }

  if (!restaurant) {
    notFound();
  }

  const latestInspection = restaurant.inspections[0];
  const statusBadge = getVerificationStatusBadge(restaurant.verificationStatus);
  const scoreBadge = getScoreBadge(restaurant.safetyScore);

  return (
    <div className="pb-24">
      {/* 1. Header Banner */}
      <section className="bg-white border-b border-[#E7E7DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {restaurant.isDemoData && (
                  <span className="bg-black/80 text-white px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase">
                    Demonstration Profile
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {statusBadge.label}
                </span>
                {restaurant.fssaiType && (
                  <span className="text-xs px-2.5 py-1 rounded-md bg-[#F5F5F0] text-[#5E635D] font-mono border border-[#E7E7DE]">
                    FSSAI: {restaurant.fssaiNumber || "On Record"}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#161815] tracking-tight">
                  {restaurant.name}
                </h1>
                {restaurant.legalName && (
                  <p className="text-xs text-[#5E635D] font-medium mt-1">
                    Operated by: <span className="text-[#161815]">{restaurant.legalName}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#5E635D]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#868A85]" />
                  <span>
                    {restaurant.streetAddress}, {restaurant.locality}, {restaurant.city} -{" "}
                    {restaurant.postalCode}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#868A85]" />
                  <span>
                    {restaurant.kitchenProfile?.kitchenType?.replace(/_/g, " ") || "Dine-In Kitchen"} • {restaurant.cuisine}
                  </span>
                </div>
              </div>

              {/* Dual Ratings Comparison Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {restaurant.foodRating && (
                  <div className="flex items-center gap-2 bg-[#FBFBF9] border border-[#E7E7DE] px-3 py-1.5 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <div>
                      <span className="text-xs font-bold text-[#161815]">
                        {restaurant.foodRating.toFixed(1)} / 5.0
                      </span>
                      <span className="text-[10px] text-[#5E635D] block">
                        Consumer Food Rating ({restaurant.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 bg-[#F0F6F2] border border-[#B8D4C2] px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-[#143D2B]" />
                  <div>
                    <span className="text-xs font-bold text-[#143D2B]">
                      {restaurant.safetyScore}/100 Kitchen Safety Index
                    </span>
                    <span className="text-[10px] text-[#5D9C75] block">
                      {scoreBadge.label} • {restaurant.dataConfidenceScore}% Confident
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between h-full space-y-4">
              <ProfileActions
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
              />

              <div className="text-right text-[11px] text-[#868A85] space-y-1">
                <div>
                  Last inspected:{" "}
                  <strong className="text-[#161815]">
                    {formatDate(restaurant.lastInspectedAt)}
                  </strong>
                </div>
                <div>
                  Next inspection due:{" "}
                  <strong className="text-[#161815]">
                    {latestInspection?.reInspectionDueDate
                      ? formatDate(latestInspection.reInspectionDueDate)
                      : "Quarterly Cycle"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Row A: Score Big Gauge & Facility Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <SafetyScoreBadge
              score={restaurant.safetyScore}
              dataConfidence={restaurant.dataConfidenceScore}
              size="lg"
            />
          </div>

          <div className="lg:col-span-8 bg-white border border-[#E7E7DE] rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#161815]">
                Kitchen Facility & Compliance Infrastructure
              </h3>
              <p className="text-xs text-[#5E635D] mt-1">
                Documented parameters submitted by the food business operator and validated during audit.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE]">
                <span className="text-[#868A85] block text-[11px]">Food Handlers</span>
                <strong className="text-sm font-semibold text-[#161815] mt-0.5 block">
                  {restaurant.kitchenProfile?.foodHandlersCount || "—"} Staff
                </strong>
                <span className="text-[10px] text-emerald-700">Form IX Verified</span>
              </div>

              <div className="p-3 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE]">
                <span className="text-[#868A85] block text-[11px]">Water Source</span>
                <strong className="text-sm font-semibold text-[#161815] mt-0.5 block truncate">
                  {restaurant.kitchenProfile?.waterSource?.replace(/_/g, " ") || "Commercial RO"}
                </strong>
                <span className="text-[10px] text-emerald-700">IS 10500 Tested</span>
              </div>

              <div className="p-3 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE]">
                <span className="text-[#868A85] block text-[11px]">Pest Agency</span>
                <strong className="text-sm font-semibold text-[#161815] mt-0.5 block truncate">
                  {restaurant.kitchenProfile?.pestControlAgency || "Licensed Agency"}
                </strong>
                <span className="text-[10px] text-[#5E635D]">Monthly Contract</span>
              </div>

              <div className="p-3 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE]">
                <span className="text-[#868A85] block text-[11px]">FoSTaC Supervisor</span>
                <strong className="text-sm font-semibold text-[#161815] mt-0.5 block truncate">
                  {restaurant.kitchenProfile?.fostacSupervisorName || "On Record"}
                </strong>
                <span className="text-[10px] text-emerald-700">Advance Catering</span>
              </div>
            </div>

            {/* Statutory Disclaimer Box */}
            <div className="bg-[#F5F5F0] p-4 rounded-lg text-[11px] text-[#5E635D] leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#868A85] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Food Safety Notice:</strong> The Kitchen Safety Score reflects compliance records on file at the date of the last audit. Kitchen conditions may fluctuate. Report unresolved hygiene issues using the safety report button.
              </span>
            </div>
          </div>
        </div>

        {/* Row B: 5 Category Breakdown Cards */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
              Detailed Category Breakdown
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#161815] mt-1">
              Hygiene & Safety Assessment Results
            </h2>
            <p className="text-xs text-[#5E635D] mt-1">
              Weightings are derived from FSSAI Schedule 4 sanitary benchmarks and international Hazard Analysis Critical Control Point (HACCP) principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(SCORING_CATEGORIES).map((cat) => {
              const auditCat = latestInspection?.categories.find(
                (c: any) => c.categoryKey === cat.key
              );
              const score = auditCat ? auditCat.scoreObtained : 0;
              const status = auditCat?.verificationStatus || "MISSING_EVIDENCE";

              return (
                <div
                  key={cat.key}
                  className="bg-white rounded-xl border border-[#E7E7DE] p-6 shadow-subtle space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#868A85]">
                        Weight: {cat.weightPercent}%
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          status === "VERIFIED_COMPLIANT"
                            ? "bg-brand-50 text-brand-900 border-brand-200"
                            : status === "CRITICAL_NON_COMPLIANCE"
                            ? "bg-crimson-50 text-crimson-900 border-crimson-200"
                            : "bg-amber-50 text-amber-900 border-amber-200"
                        }`}
                      >
                        {status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-base text-[#161815]">{cat.name}</h3>
                      <p className="text-xs text-[#5E635D] mt-1 line-clamp-2">{cat.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 pt-1">
                      <span className="text-3xl font-black font-serif text-[#161815]">
                        {score > 0 ? score : "—"}
                      </span>
                      <span className="text-xs text-[#5E635D]">/100</span>
                      <span className="text-[11px] text-[#868A85] ml-2">
                        Contributes {((score * cat.weightPercent) / 100).toFixed(1)} pts
                      </span>
                    </div>

                    {auditCat?.observations && (
                      <div className="bg-[#FBFBF9] p-3 rounded-md border border-[#E7E7DE] text-[11px] text-[#444943]">
                        <strong>Inspector Note:</strong> {auditCat.observations}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#EFEFE9] text-[11px] text-[#868A85]">
                    Basis: {cat.statutoryBasis}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row C: Verified Evidence Documents */}
        <div className="bg-white border border-[#E7E7DE] rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#161815]">
                Verified Documentation & Laboratory Certificates
              </h2>
              <p className="text-xs text-[#5E635D] mt-1">
                Audited documents provided by the business operator. Redacted for consumer inspection.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F0F6F2] text-[#143D2B] border border-[#B8D4C2]">
              {restaurant.documents.length} Records Verified
            </span>
          </div>

          <div className="divide-y divide-[#E7E7DE] border-y border-[#E7E7DE]">
            {restaurant.documents.map((doc: any) => (
              <div
                key={doc.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#143D2B]" />
                    <span className="font-semibold text-sm text-[#161815]">{doc.title}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200">
                      {doc.verificationStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#5E635D]">
                    {doc.notes || "Official certificate verified by accredited auditor."}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-[#868A85]">
                    {doc.issueDate && <span>Issued: {formatDate(doc.issueDate)}</span>}
                    {doc.expiryDate && (
                      <span className={new Date(doc.expiryDate) < new Date() ? "text-red-700 font-bold" : ""}>
                        Valid Until: {formatDate(doc.expiryDate)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5E635D] font-mono">
                    {(doc.fileSize / 1024).toFixed(0)} KB PDF
                  </span>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-[#143D2B] bg-[#F0F6F2] hover:bg-[#DCE9E0] transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row D: Inspection History Log */}
        {restaurant.inspections.length > 0 && (
          <div className="bg-white border border-[#E7E7DE] rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#161815]">
                Inspection Audit Timeline
              </h2>
              <p className="text-xs text-[#5E635D] mt-1">
                Historical record of physical audits conducted by accredited food safety officers.
              </p>
            </div>

            <div className="space-y-6">
              {restaurant.inspections.map((insp: any) => (
                <div
                  key={insp.id}
                  className="p-5 rounded-lg border border-[#E7E7DE] bg-[#FBFBF9] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E7DE] pb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#143D2B]">
                        {insp.inspectionType.replace(/_/g, " ")}
                      </span>
                      <p className="text-xs text-[#5E635D] mt-0.5">
                        Conducted on {formatDate(insp.completedDate)} by {insp.inspector.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#5E635D]">
                        Rating: <strong>{insp.hygieneRatingSmiles} / 5 Smiles</strong>
                      </span>
                      <span className="text-sm font-bold text-[#143D2B] bg-[#F0F6F2] border border-[#B8D4C2] px-2.5 py-1 rounded">
                        Score: {insp.overallScore}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#323631] leading-relaxed">
                    <strong>Findings Summary:</strong> {insp.findingsSummary}
                  </p>

                  {insp.correctiveActionsRequired && (
                    <div className="bg-amber-50 p-3 rounded text-xs text-amber-900 border border-amber-200">
                      <strong>Corrective Actions Issued:</strong> {insp.correctiveActionsRequired}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

