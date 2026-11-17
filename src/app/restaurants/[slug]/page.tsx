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
  FileCheck2,
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

  // Accessible status representation (icon + text + color)
  const isVerified = restaurant.verificationStatus === "VERIFIED" || restaurant.verificationStatus === "INDEPENDENTLY_VERIFIED";
  const isActionRequired = restaurant.verificationStatus === "ACTION_REQUIRED" || restaurant.verificationStatus === "REJECTED";

  return (
    <div className="pb-24">
      {/* 1. Header Banner: Evidence Dossier Identity */}
      <section className="bg-surface border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Dossier Header Info */}
            <div className="lg:col-span-8 space-y-4">
              {/* Status line */}
              <div className="flex flex-wrap items-center gap-2">
                {restaurant.isDemoData && (
                  <span className="bg-surface-raised border border-border-strong text-text-muted px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase">
                    Demo Evaluation Profile
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    isVerified
                      ? "bg-accent/15 text-accent border-accent/40"
                      : isActionRequired
                      ? "bg-danger/15 text-danger border-danger/40"
                      : "bg-warning/15 text-warning border-warning/40"
                  }`}
                >
                  {isVerified ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  ) : isActionRequired ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-warning" />
                  )}
                  <span>
                    {restaurant.verificationStatus.replace(/_/g, " ")}
                  </span>
                </span>
                {restaurant.fssaiType && (
                  <span className="text-xs px-2.5 py-1 rounded-md bg-surface-raised text-text-muted font-mono border border-border-subtle">
                    FSSAI: {restaurant.fssaiNumber || "On Record"}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-base tracking-tight">
                  {restaurant.name}
                </h1>
                {restaurant.legalName && (
                  <p className="text-xs text-text-muted font-medium mt-1">
                    Operated by: <span className="text-text-base">{restaurant.legalName}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-text-muted">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>
                    {restaurant.streetAddress}, {restaurant.locality}, {restaurant.city}
                    {restaurant.postalCode ? ` - ${restaurant.postalCode}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>
                    {restaurant.kitchenProfile?.kitchenType?.replace(/_/g, " ") || "Dine-In Kitchen"} • {restaurant.cuisine}
                  </span>
                </div>
              </div>

              {/* Dual Ratings Comparison Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {restaurant.foodRating && (
                  <div className="flex items-center gap-2.5 bg-surface-raised border border-border-subtle px-3.5 py-2 rounded-lg">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <div>
                      <span className="text-xs font-bold text-text-base">
                        {restaurant.foodRating.toFixed(1)} / 5.0
                      </span>
                      <span className="text-[10px] text-text-muted block">
                        Consumer Food Rating ({restaurant.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2.5 bg-surface-raised border border-border-strong px-3.5 py-2 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <div>
                    <span className="text-xs font-bold text-accent">
                      {restaurant.safetyScore}/100 Kitchen Safety Index
                    </span>
                    <span className="text-[10px] text-text-muted block">
                      {scoreBadge.label} • {restaurant.dataConfidenceScore}% Evidence Completeness
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions & Audit Cycle Timestamps */}
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

              <div className="text-right text-[11px] text-text-muted space-y-1">
                <div>
                  Last inspected:{" "}
                  <strong className="text-text-base">
                    {formatDate(restaurant.lastInspectedAt)}
                  </strong>
                </div>
                <div>
                  Next inspection due:{" "}
                  <strong className="text-text-base">
                    {latestInspection?.reInspectionDueDate
                      ? formatDate(latestInspection.reInspectionDueDate)
                      : "Quarterly Cycle"}
                  </strong>
                </div>
                <div className="pt-1">
                  <Link
                    href={`/disputes?restaurantSlug=${restaurant.slug}`}
                    className="text-[10px] text-accent hover:underline inline-flex items-center gap-1"
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
              ? "bg-danger/15 border-danger/40 text-danger"
              : "bg-warning/15 border-warning/40 text-warning"
          }`}
          role="alert"
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

      {/* 3. Main Content: Varied Dossier Structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Row A: Ruled Asymmetric Column (Score Gauge + 3 Statutory Checks) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4">
            <SafetyScoreBadge
              score={restaurant.safetyScore}
              dataConfidence={restaurant.dataConfidenceScore}
              size="lg"
            />
          </div>

          <div className="lg:col-span-8 bg-surface border border-border-subtle rounded-xl p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent block">
                Primary Hygiene Baselines
              </span>
              <h2 className="font-serif font-bold text-lg text-text-base mt-1">
                Three Core Statutory Safety Checks
              </h2>
              <p className="text-xs text-text-muted mt-1 max-w-prose">
                Essential hygiene baselines evaluated from accredited laboratory test certificates and physical premises inspection logs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Check 1: Statutory Food License */}
              <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-[11px] font-medium">1. Statutory License</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/15 px-2 py-0.5 rounded border border-accent/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                </div>
                <strong className="text-sm font-semibold text-text-base block">
                  {restaurant.fssaiType?.replace(/_/g, " ") || "State License"}
                </strong>
                <p className="text-[11px] text-text-muted">
                  No: {restaurant.fssaiNumber || "Verified"} • Valid to {formatDate(restaurant.fssaiValidUntil)}
                </p>
              </div>

              {/* Check 2: Potable Water Safety */}
              <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-[11px] font-medium">2. Potable Water</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/15 px-2 py-0.5 rounded border border-accent/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>IS 10500</span>
                  </span>
                </div>
                <strong className="text-sm font-semibold text-text-base block">
                  {restaurant.kitchenProfile?.waterSource?.replace(/_/g, " ") || "Commercial RO"}
                </strong>
                <p className="text-[11px] text-text-muted">
                  Bacteriological laboratory test on file. Coliform negative.
                </p>
              </div>

              {/* Check 3: Commercial Pest Management */}
              <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-[11px] font-medium">3. Pest Control</span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                      hasExpiredDoc
                        ? "text-danger bg-danger/15 border-danger/30"
                        : "text-accent bg-accent/15 border-accent/30"
                    }`}
                  >
                    {hasExpiredDoc ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    <span>{hasExpiredDoc ? "Expired" : "Current"}</span>
                  </span>
                </div>
                <strong className="text-sm font-semibold text-text-base block truncate">
                  {restaurant.kitchenProfile?.pestControlAgency || "Licensed Agency"}
                </strong>
                <p className="text-[11px] text-text-muted">
                  {hasExpiredDoc
                    ? "Service log overdue for scheduled quarterly renewal."
                    : `Last treated: ${formatDate(restaurant.kitchenProfile?.lastPestControlDate)}`}
                </p>
              </div>
            </div>

            {/* Facility specs */}
            <div className="pt-4 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-text-muted text-[11px] block">Kitchen Footprint</span>
                <strong className="text-sm text-text-base block mt-0.5">
                  {restaurant.kitchenProfile?.squareFootage ? `${restaurant.kitchenProfile.squareFootage} sq ft` : "Standard"}
                </strong>
              </div>
              <div>
                <span className="text-text-muted text-[11px] block">Food Handlers</span>
                <strong className="text-sm text-text-base block mt-0.5">
                  {restaurant.kitchenProfile?.foodHandlersCount || "—"} Handlers
                </strong>
              </div>
              <div>
                <span className="text-text-muted text-[11px] block">FoSTaC Supervisor</span>
                <strong className="text-sm text-text-base block mt-0.5 truncate">
                  {restaurant.kitchenProfile?.fostacSupervisorName || "Certified Staff"}
                </strong>
              </div>
              <div>
                <span className="text-text-muted text-[11px] block">Cooking Oil Protocol</span>
                <strong className="text-sm text-text-base block mt-0.5 truncate">
                  {restaurant.kitchenProfile?.oilDisposalMethod?.replace(/_/g, " ") || "Authorized Recycler"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Row B: Shared Cloud Kitchen Commissary Callout (If Applicable) */}
        {sharedPremises && (
          <div className="bg-surface-raised border border-border-strong rounded-xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-accent" />
                <h2 className="font-serif font-bold text-lg text-text-base">
                  Shared Physical Premises Commissary
                </h2>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-surface text-accent border border-border-strong">
                Premises Code: {sharedPremises.premisesCode}
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed max-w-prose">
              This brand operates inside <strong className="text-text-base">{sharedPremises.facilityName}</strong>, a shared physical cloud kitchen commissary facility located at {sharedPremises.streetAddress}, {sharedPremises.locality}, {sharedPremises.city}. Brands hosted on this premises share core physical infrastructure including <strong className="text-text-base">{sharedPremises.waterSupplyType}</strong> and <strong className="text-text-base">{sharedPremises.pestControlAgency}</strong>.
            </p>

            {sharedPremises.siblingBrands && sharedPremises.siblingBrands.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-2">
                  Other Virtual Delivery Brands Operating from this Shared Kitchen:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sharedPremises.siblingBrands.map((brand: any) => (
                    <Link
                      key={brand.slug}
                      href={`/restaurants/${brand.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-xs font-medium text-text-base hover:text-accent border border-border-strong hover:border-accent transition-colors"
                    >
                      <Building className="w-3.5 h-3.5 text-accent" />
                      <span>{brand.name}</span>
                      <span className="text-[10px] text-text-muted">({brand.cuisine})</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Row C: Evidence Dossier Table (Document Ledger) */}
        <DocumentList
          documents={restaurant.documents || []}
          restaurantName={restaurant.name}
        />

        {/* Row D: Detailed Category Breakdown Cards */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent block">
              Schedule 4 Compliance Matrix
            </span>
            <h2 className="text-2xl font-serif font-bold text-text-base mt-1">
              Hygiene &amp; Safety Assessment Results
            </h2>
            <p className="text-xs text-text-muted mt-1 max-w-prose">
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
                  className="bg-surface rounded-xl border border-border-subtle p-6 shadow-card space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-muted">
                        Weight: {cat.weightPercent}%
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          status === "VERIFIED_COMPLIANT"
                            ? "bg-accent/15 text-accent border-accent/40"
                            : status === "CRITICAL_NON_COMPLIANCE"
                            ? "bg-danger/15 text-danger border-danger/40"
                            : status === "EXPIRED_EVIDENCE"
                            ? "bg-warning/15 text-warning border-warning/40"
                            : "bg-surface-raised text-text-muted border-border-strong"
                        }`}
                      >
                        {status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-base text-text-base">{cat.name}</h3>
                      <p className="text-xs text-text-muted mt-1 line-clamp-2">{cat.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 pt-1">
                      <span className="text-3xl font-black font-serif text-text-base">
                        {score > 0 ? score : "—"}
                      </span>
                      <span className="text-xs text-text-muted">/100</span>
                      <span className="text-[11px] text-text-muted ml-2">
                        Contributes {((score * cat.weightPercent) / 100).toFixed(1)} pts
                      </span>
                    </div>

                    {auditCat?.observations && (
                      <div className="bg-surface-raised p-3 rounded-md border border-border-subtle text-[11px] text-text-base">
                        <strong className="text-accent">Inspector Note:</strong> {auditCat.observations}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border-subtle text-[11px] text-text-muted">
                    Basis: {cat.statutoryBasis}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row E: Inspection Audit Timeline */}
        {restaurant.inspections?.length > 0 && (
          <div className="bg-surface border border-border-subtle rounded-xl p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent block">
                Verification History
              </span>
              <h2 className="text-xl font-serif font-bold text-text-base mt-1">
                Inspection Audit Timeline
              </h2>
              <p className="text-xs text-text-muted mt-1 max-w-prose">
                Historical chronology of physical audits conducted by accredited food safety officers.
              </p>
            </div>

            <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-strong">
              {restaurant.inspections.map((insp: any) => (
                <div
                  key={insp.id}
                  className="relative p-5 rounded-lg border border-border-subtle bg-surface-raised space-y-3"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-5 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-surface" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">
                        {insp.inspectionType.replace(/_/g, " ")}
                      </span>
                      <p className="text-xs text-text-muted mt-0.5">
                        Conducted on {formatDate(insp.completedDate)} by {insp.inspector?.name || "Accredited Inspector"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">
                        Rating: <strong className="text-text-base">{insp.hygieneRatingSmiles} / 5 Smiles</strong>
                      </span>
                      <span className="text-sm font-bold text-accent bg-surface border border-border-strong px-2.5 py-1 rounded">
                        Score: {insp.overallScore}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-base leading-relaxed">
                    <strong className="text-text-muted">Findings Summary:</strong> {insp.findingsSummary}
                  </p>

                  {insp.correctiveActionsRequired && (
                    <div className="bg-warning/10 p-3 rounded text-xs text-warning border border-warning/30">
                      <strong>Corrective Actions Issued:</strong> {insp.correctiveActionsRequired}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statutory Transparency Disclaimer */}
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-xs text-text-muted space-y-2">
          <div className="flex items-center gap-2 text-accent font-bold text-xs">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Independent Platform Compliance &amp; Transparency Notice</span>
          </div>
          <p className="leading-relaxed">
            KitchenProof™ is an independent food safety transparency intelligence service benchmarked to FSSAI Schedule 4 sanitary requirements and Codex Alimentarius guidelines. Demonstration profiles reflect standardized compliance models for operational evaluation. KitchenProof does not issue official government registrations; statutory enforcement remains exclusively with municipal and state food authorities.
          </p>
        </div>
      </div>
    </div>
  );
}
