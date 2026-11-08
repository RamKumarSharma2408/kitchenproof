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
  HelpCircle,
} from "lucide-react";
import ProfileActions from "./ProfileActions";
import DocumentList from "./DocumentList";

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
        premises: {
          include: {
            brands: { select: { id: true, name: true, slug: true, cuisine: true } },
          },
        },
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

  const latestInspection = restaurant.inspections?.[0];
  const statusBadge = getVerificationStatusBadge(restaurant.verificationStatus);
  const scoreBadge = getScoreBadge(restaurant.safetyScore);

  // Compute key safety check states
  const hasExpiredDoc =
    restaurant.documents?.some(
      (d: any) => d.verificationStatus === "EXPIRED" || (d.expiryDate && new Date(d.expiryDate) < new Date())
    ) || restaurant.verificationStatus === "EXPIRED";

  const hasCriticalViolation =
    latestInspection?.categories?.some((c: any) => c.verificationStatus === "CRITICAL_NON_COMPLIANCE") ||
    restaurant.verificationStatus === "ACTION_REQUIRED";

  const activeAlertMessage =
    restaurant.activeAlert ||
    (hasCriticalViolation
      ? "CRITICAL SAFETY NON-COMPLIANCE: One or more critical hazard controls failed statutory thresholds. Rectification improvement notice in effect."
      : hasExpiredDoc
      ? "AUDIT DOCUMENTATION EXPIRED: One or more statutory compliance certificates or test reports have lapsed. Safety score reflects automatic expiry penalties."
      : null);

  const sharedPremises = restaurant.premises;

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
                    {restaurant.streetAddress}, {restaurant.locality}, {restaurant.city}
                    {restaurant.postalCode ? ` - ${restaurant.postalCode}` : ""}
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
                      {scoreBadge.label} • {restaurant.dataConfidenceScore}% Evidence Completeness
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
                restaurantSlug={restaurant.slug}
                locality={restaurant.locality}
                city={restaurant.city}
                safetyScore={restaurant.safetyScore}
                verificationStatus={restaurant.verificationStatus}
                fssaiNumber={restaurant.fssaiNumber}
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
                <div className="pt-1">
                  <Link
                    href={`/disputes?restaurantSlug=${restaurant.slug}`}
                    className="text-[10px] text-[#143D2B] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Operator Discrepancy or Dispute?</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Active Alert Notice Banner (If Any) */}
      {activeAlertMessage && (
        <section
          className={`border-b ${
            hasCriticalViolation
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-start gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-semibold block uppercase tracking-wide">
                {hasCriticalViolation ? "Urgent Action Required" : "Statutory Document Status Alert"}
              </strong>
              <p>{activeAlertMessage}</p>
            </div>
          </div>
        </section>
      )}

      {/* 3. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Row A: Score Big Gauge & 3 Key Statutory Checks */}
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
                Three Core Statutory Safety Checks
              </h3>
              <p className="text-xs text-[#5E635D] mt-1">
                Essential hygiene baselines evaluated from audited documentation and physical inspection records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Check 1: Statutory Food License */}
              <div className="p-4 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#868A85] text-[11px] font-medium">1. Statutory License</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>
                <strong className="text-sm font-semibold text-[#161815] block">
                  {restaurant.fssaiType?.replace(/_/g, " ") || "State License"}
                </strong>
                <p className="text-[11px] text-[#5E635D]">
                  No: {restaurant.fssaiNumber} • Valid until {formatDate(restaurant.fssaiValidUntil)}
                </p>
              </div>

              {/* Check 2: Potable Water Safety */}
              <div className="p-4 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#868A85] text-[11px] font-medium">2. Potable Water Safety</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    IS 10500 Tested
                  </span>
                </div>
                <strong className="text-sm font-semibold text-[#161815] block">
                  {restaurant.kitchenProfile?.waterSource?.replace(/_/g, " ") || "Commercial RO"}
                </strong>
                <p className="text-[11px] text-[#5E635D]">
                  Bacteriological laboratory test on file. Coliform negative.
                </p>
              </div>

              {/* Check 3: Commercial Pest Management */}
              <div className="p-4 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#868A85] text-[11px] font-medium">3. Pest Control Log</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      hasExpiredDoc
                        ? "text-orange-800 bg-orange-50 border-orange-200"
                        : "text-emerald-800 bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    {hasExpiredDoc ? "Expired" : "Current"}
                  </span>
                </div>
                <strong className="text-sm font-semibold text-[#161815] block truncate">
                  {restaurant.kitchenProfile?.pestControlAgency || "Licensed Agency"}
                </strong>
                <p className="text-[11px] text-[#5E635D]">
                  {hasExpiredDoc
                    ? "Service log expired on 5 Nov 2026. Renewal pending."
                    : `Last treated: ${formatDate(restaurant.kitchenProfile?.lastPestControlDate)}`}
                </p>
              </div>
            </div>

            {/* Facility specs */}
            <div className="pt-4 border-t border-[#EFEFE9] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#868A85] text-[11px] block">Kitchen Area</span>
                <strong className="text-sm text-[#161815] block mt-0.5">
                  {restaurant.kitchenProfile?.squareFootage ? `${restaurant.kitchenProfile.squareFootage} sq ft` : "—"}
                </strong>
              </div>
              <div>
                <span className="text-[#868A85] text-[11px] block">Food Handlers</span>
                <strong className="text-sm text-[#161815] block mt-0.5">
                  {restaurant.kitchenProfile?.foodHandlersCount || "—"} Handlers
                </strong>
              </div>
              <div>
                <span className="text-[#868A85] text-[11px] block">FoSTaC Supervisor</span>
                <strong className="text-sm text-[#161815] block mt-0.5 truncate">
                  {restaurant.kitchenProfile?.fostacSupervisorName || "On Record"}
                </strong>
              </div>
              <div>
                <span className="text-[#868A85] text-[11px] block">Used Cooking Oil</span>
                <strong className="text-sm text-[#161815] block mt-0.5 truncate">
                  {restaurant.kitchenProfile?.oilDisposalMethod?.replace(/_/g, " ") || "Authorized Recycler"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Row B: Shared Cloud Kitchen Commissary Callout (If Applicable) */}
        {sharedPremises && (
          <div className="bg-[#F0F6F2] border border-[#B8D4C2] rounded-xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B8D4C2]/60 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#143D2B]" />
                <h3 className="font-serif font-bold text-lg text-[#143D2B]">
                  Shared Physical Premises Commissary
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-white text-[#143D2B] border border-[#B8D4C2]">
                Premises Code: {sharedPremises.premisesCode}
              </span>
            </div>

            <p className="text-xs text-[#2A593E] leading-relaxed">
              This brand operates inside <strong>{sharedPremises.facilityName}</strong>, a shared physical cloud kitchen commissary facility located at {sharedPremises.streetAddress}, {sharedPremises.locality}, {sharedPremises.city}. Brands hosted on this premises share core physical infrastructure including <strong>{sharedPremises.waterSupplyType}</strong> and <strong>{sharedPremises.pestControlAgency}</strong>.
            </p>

            {sharedPremises.siblingBrands && sharedPremises.siblingBrands.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-[#143D2B] uppercase tracking-wider block mb-2">
                  Other Virtual Delivery Brands Operating from this Shared Kitchen:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sharedPremises.siblingBrands.map((brand: any) => (
                    <Link
                      key={brand.slug}
                      href={`/restaurants/${brand.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-[#161815] hover:text-[#143D2B] border border-[#B8D4C2] hover:border-[#143D2B] transition-colors"
                    >
                      <Building className="w-3.5 h-3.5 text-[#5D9C75]" />
                      <span>{brand.name}</span>
                      <span className="text-[10px] text-[#868A85]">({brand.cuisine})</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Row C: 5 Category Breakdown Cards */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
              Detailed Category Breakdown
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#161815] mt-1">
              Hygiene & Safety Assessment Results
            </h2>
            <p className="text-xs text-[#5E635D] mt-1">
              Weightings are derived from FSSAI Schedule 4 sanitary benchmarks and Codex Alimentarius Hazard Analysis Critical Control Point (HACCP) principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(SCORING_CATEGORIES).map((cat) => {
              const auditCat = latestInspection?.categories?.find(
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
                            ? "bg-red-50 text-red-900 border-red-200"
                            : status === "EXPIRED_EVIDENCE"
                            ? "bg-orange-50 text-orange-900 border-orange-200"
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

        {/* Row D: Verified Evidence Documents */}
        <DocumentList
          documents={restaurant.documents || []}
          restaurantName={restaurant.name}
        />

        {/* Row E: Inspection History Log */}
        {restaurant.inspections?.length > 0 && (
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
                        Conducted on {formatDate(insp.completedDate)} by {insp.inspector?.name || "Accredited Inspector"}
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

        {/* Statutory Transparency Disclaimer */}
        <div className="bg-[#F5F5F0] border border-[#E7E7DE] rounded-xl p-5 text-xs text-[#5E635D] space-y-2">
          <div className="flex items-center gap-2 text-[#143D2B] font-bold text-xs">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Independent Platform Compliance & Transparency Notice</span>
          </div>
          <p className="leading-relaxed">
            KitchenProof™ is an independent food safety transparency intelligence service benchmarked to FSSAI Schedule 4 sanitary requirements and Codex Alimentarius guidelines. Demonstration profiles reflect standardized compliance models for operational evaluation. KitchenProof does not issue official government registrations; statutory enforcement remains exclusively with municipal and state food authorities.
          </p>
        </div>
      </div>
    </div>
  );
}
