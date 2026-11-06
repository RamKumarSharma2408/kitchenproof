"use client";

import { useState } from "react";
import Link from "next/link";
import { SCORING_CATEGORIES } from "@/lib/scoring";
import { formatDate } from "@/lib/utils";
import {
  ClipboardCheck,
  FileCheck2,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Save,
  Send,
  Building,
} from "lucide-react";

interface InspectorClientProps {
  pendingRequests: any[];
  restaurants: any[];
  pendingDocs: any[];
  recentInspections: any[];
  inspectorName: string;
}

export default function InspectorClient({
  pendingRequests,
  restaurants,
  pendingDocs: initialDocs,
  recentInspections: initialInspections,
  inspectorName,
}: InspectorClientProps) {
  const [activeTab, setActiveTab] = useState<"RECORD" | "REQUESTS" | "DOCS" | "HISTORY">("RECORD");
  const [docs, setDocs] = useState<any[]>(initialDocs);
  const [inspections, setInspections] = useState<any[]>(initialInspections);

  // New Inspection Form State
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(restaurants[0]?.id || "");
  const [inspectionType, setInspectionType] = useState("ROUTINE_HYGIENE");
  const [findingsSummary, setFindingsSummary] = useState("");
  const [criticalViolationsCount, setCriticalViolationsCount] = useState(0);
  const [nonCriticalViolationsCount, setNonCriticalViolationsCount] = useState(0);
  const [correctiveActionsRequired, setCorrectiveActionsRequired] = useState("");

  // Category Scores & Observations
  const [categoryData, setCategoryData] = useState<
    Record<
      string,
      {
        scoreObtained: number;
        verificationStatus:
          | "VERIFIED_COMPLIANT"
          | "MINOR_NON_COMPLIANCE"
          | "CRITICAL_NON_COMPLIANCE"
          | "NOT_OBSERVED";
        observations: string;
      }
    >
  >({
    HYGIENE_SANITATION: {
      scoreObtained: 90,
      verificationStatus: "VERIFIED_COMPLIANT",
      observations: "Prep counters sanitized with chlorine solution; potable water test verified.",
    },
    FOOD_HANDLING: {
      scoreObtained: 85,
      verificationStatus: "VERIFIED_COMPLIANT",
      observations: "Color-coded cutting boards in active use. Form IX certificates on file for all staff.",
    },
    PEST_MANAGEMENT: {
      scoreObtained: 90,
      verificationStatus: "VERIFIED_COMPLIANT",
      observations: "Monthly pest control service logs inspected; fly light units positioned correctly.",
    },
    TEMPERATURE_CONTROL: {
      scoreObtained: 88,
      verificationStatus: "VERIFIED_COMPLIANT",
      observations: "Chiller units maintained at 3.5°C; daily probe records verified.",
    },
    DOCUMENTATION_COMPLIANCE: {
      scoreObtained: 92,
      verificationStatus: "VERIFIED_COMPLIANT",
      observations: "Active state license displayed on Purple Food Safety Display Board; FoSTaC supervisor on-site.",
    },
  });

  const [submittingInspection, setSubmittingInspection] = useState(false);

  const handleCategoryChange = (key: string, field: string, value: any) => {
    setCategoryData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSubmitInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInspection(true);

    try {
      const payload = {
        restaurantId: selectedRestaurantId,
        inspectionType,
        findingsSummary,
        criticalViolationsCount,
        nonCriticalViolationsCount,
        correctiveActionsRequired,
        categories: Object.values(SCORING_CATEGORIES).map((cat) => ({
          categoryKey: cat.key,
          name: cat.name,
          weightPercent: cat.weightPercent,
          scoreObtained: categoryData[cat.key]?.scoreObtained || 80,
          verificationStatus: categoryData[cat.key]?.verificationStatus || "VERIFIED_COMPLIANT",
          observations: categoryData[cat.key]?.observations || "Standard compliant",
        })),
      };

      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        alert(
          `Inspection recorded successfully!\nNew Calculated Safety Score: ${data.calculation.overallScore}/100\nHygiene Rating: ${data.calculation.hygieneRatingSmiles} Smiles`
        );
        // Reset form
        setFindingsSummary("");
        setCriticalViolationsCount(0);
        setNonCriticalViolationsCount(0);
        setCorrectiveActionsRequired("");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to record inspection");
      }
    } catch {
      alert("Network error recording inspection");
    } finally {
      setSubmittingInspection(false);
    }
  };

  const handleDocumentReview = async (documentId: string, status: "VERIFIED" | "REJECTED") => {
    const reason = status === "REJECTED" ? prompt("Enter reason for rejection:") : undefined;
    if (status === "REJECTED" && !reason) return;

    try {
      const res = await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          status,
          rejectionReason: reason,
        }),
      });

      if (res.ok) {
        setDocs((prev) => prev.filter((d) => d.id !== documentId));
        alert(`Document successfully marked as ${status}`);
      } else {
        alert("Failed to review document");
      }
    } catch {
      alert("Error reviewing document");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#E7E7DE] space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("RECORD")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "RECORD"
              ? "border-[#143D2B] text-[#143D2B] font-bold"
              : "border-transparent text-[#5E635D] hover:text-[#161815]"
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Record Inspection Audit</span>
        </button>

        <button
          onClick={() => setActiveTab("DOCS")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "DOCS"
              ? "border-[#143D2B] text-[#143D2B] font-bold"
              : "border-transparent text-[#5E635D] hover:text-[#161815]"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Pending Document Audits ({docs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("REQUESTS")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "REQUESTS"
              ? "border-[#143D2B] text-[#143D2B] font-bold"
              : "border-transparent text-[#5E635D] hover:text-[#161815]"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Verification Requests ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === "HISTORY"
              ? "border-[#143D2B] text-[#143D2B] font-bold"
              : "border-transparent text-[#5E635D] hover:text-[#161815]"
          }`}
        >
          <History className="w-4 h-4" />
          <span>My Audit Log ({inspections.length})</span>
        </button>
      </div>

      {/* TAB 1: RECORD INSPECTION */}
      {activeTab === "RECORD" && (
        <form onSubmit={handleSubmitInspection} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-6 text-xs">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#161815]">
              Conduct On-Site Hygiene Audit
            </h2>
            <p className="text-xs text-[#5E635D] mt-0.5">
              Enter observations against statutory parameters. Scores are weighted by the explainable scoring engine.
            </p>
          </div>

          {/* Target Restaurant and Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                Select Food Business / Kitchen
              </label>
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] bg-[#FBFBF9]"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.locality}, {r.city}) — Current Score: {r.safetyScore}/100
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                Inspection Type
              </label>
              <select
                value={inspectionType}
                onChange={(e) => setInspectionType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] bg-[#FBFBF9]"
              >
                <option value="ROUTINE_HYGIENE">Routine Hygiene Audit (Quarterly)</option>
                <option value="INITIAL_VERIFICATION">Initial Verification Audit</option>
                <option value="SURPRISE_AUDIT">Unannounced / Surprise Audit</option>
                <option value="CONSUMER_COMPLAINT_AUDIT">Consumer Complaint Follow-up</option>
                <option value="REINSPECTION">Reinspection / Rectification Check</option>
              </select>
            </div>
          </div>

          {/* 5 Categories Scoring Cards */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif font-bold text-base text-[#161815] border-b border-[#E7E7DE] pb-2">
              Category Evaluations (Weights Sum to 100%)
            </h3>

            {Object.values(SCORING_CATEGORIES).map((cat) => {
              const current = categoryData[cat.key] || {
                scoreObtained: 80,
                verificationStatus: "VERIFIED_COMPLIANT",
                observations: "",
              };

              return (
                <div key={cat.key} className="p-4 rounded-lg bg-[#FBFBF9] border border-[#E7E7DE] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-sm font-semibold text-[#161815]">
                        {cat.name} ({cat.weightPercent}% weight)
                      </strong>
                      <span className="text-[11px] text-[#5D9C75] block">
                        Basis: {cat.statutoryBasis}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <label className="text-[11px] font-semibold text-[#5E635D]">Score (0-100):</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={current.scoreObtained}
                          onChange={(e) =>
                            handleCategoryChange(cat.key, "scoreObtained", parseInt(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 rounded border border-[#D0D0C3] text-center font-bold text-sm"
                        />
                      </div>

                      <select
                        value={current.verificationStatus}
                        onChange={(e) => handleCategoryChange(cat.key, "verificationStatus", e.target.value)}
                        className="px-2 py-1 rounded border border-[#D0D0C3] text-[11px] bg-white font-medium"
                      >
                        <option value="VERIFIED_COMPLIANT">Verified Compliant</option>
                        <option value="MINOR_NON_COMPLIANCE">Minor Non-Compliance</option>
                        <option value="CRITICAL_NON_COMPLIANCE">Critical Non-Compliance</option>
                        <option value="NOT_OBSERVED">Not Observed / Exempt</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5E635D] mb-1">
                      Inspector Findings & Objective Observations:
                    </label>
                    <input
                      type="text"
                      required
                      value={current.observations}
                      onChange={(e) => handleCategoryChange(cat.key, "observations", e.target.value)}
                      placeholder="e.g., Water testing certificate verified, chlorine levels in rinse water: 2.0 ppm..."
                      className="w-full px-3 py-1.5 rounded border border-[#D0D0C3] text-xs bg-white"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Violations Count and Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                Critical Violations Count (Causes Immediate Flag)
              </label>
              <input
                type="number"
                min="0"
                value={criticalViolationsCount}
                onChange={(e) => setCriticalViolationsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                Non-Critical Violations Count
              </label>
              <input
                type="number"
                min="0"
                value={nonCriticalViolationsCount}
                onChange={(e) => setNonCriticalViolationsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
              Overall Audit Summary & Findings
            </label>
            <textarea
              required
              rows={3}
              value={findingsSummary}
              onChange={(e) => setFindingsSummary(e.target.value)}
              placeholder="Comprehensive summary of facility hygiene, staff medical documentation, and sanitation practices..."
              className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
              Corrective Actions Required (If Any)
            </label>
            <textarea
              rows={2}
              value={correctiveActionsRequired}
              onChange={(e) => setCorrectiveActionsRequired(e.target.value)}
              placeholder="Immediate rectification steps mandated before next scheduled audit..."
              className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submittingInspection}
              className="px-6 py-3 bg-[#143D2B] text-white font-semibold rounded-lg hover:bg-[#1F593F] transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{submittingInspection ? "Calculating & Saving..." : "Publish Inspection Audit"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: PENDING DOCUMENT AUDITS */}
      {activeTab === "DOCS" && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-6 text-xs">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#161815]">
              Uploaded Documentation Pending Verification
            </h2>
            <p className="text-xs text-[#5E635D] mt-0.5">
              Inspect test reports, FSSAI certificates, and medical fitness records uploaded by restaurant operators.
            </p>
          </div>

          {docs.length > 0 ? (
            <div className="divide-y divide-[#E7E7DE] border-y border-[#E7E7DE]">
              {docs.map((doc) => (
                <div key={doc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <strong className="text-sm font-semibold text-[#161815] block">{doc.title}</strong>
                    <p className="text-[#5E635D]">
                      Kitchen: <strong>{doc.restaurant.name}</strong> ({doc.restaurant.locality}, {doc.restaurant.city})
                    </p>
                    <p className="text-[#868A85] text-[11px]">{doc.notes || "Document submitted for verification."}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded border border-[#D0D0C3] text-[#161815] hover:bg-gray-50 flex items-center gap-1"
                    >
                      <span>View PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleDocumentReview(doc.id, "VERIFIED")}
                      className="px-3 py-1.5 rounded bg-brand-50 text-brand-900 border border-brand-300 font-semibold flex items-center gap-1 hover:bg-brand-100"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleDocumentReview(doc.id, "REJECTED")}
                      className="px-3 py-1.5 rounded bg-crimson-50 text-crimson-900 border border-crimson-300 font-semibold flex items-center gap-1 hover:bg-crimson-100"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-[#5E635D]">No documents currently pending audit.</p>
          )}
        </div>
      )}

      {/* TAB 3: VERIFICATION REQUESTS */}
      {activeTab === "REQUESTS" && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-6 text-xs">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#161815]">
              Active Verification Requests Queue
            </h2>
            <p className="text-xs text-[#5E635D] mt-0.5">
              Food businesses that have requested on-site inspection audits.
            </p>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="divide-y divide-[#E7E7DE] border-y border-[#E7E7DE]">
              {pendingRequests.map((req) => (
                <div key={req.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/restaurants/${req.restaurant.slug}`}
                      className="font-bold text-sm text-[#143D2B] hover:underline"
                    >
                      {req.restaurant.name}
                    </Link>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                      {req.status}
                    </span>
                  </div>

                  <p className="text-[#323631]">
                    <strong>Requester Note:</strong> &quot;{req.requestNotes}&quot;
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-[#868A85]">
                    <span>Operator: {req.requester.name} ({req.requester.phone || req.requester.email})</span>
                    <span>Requested: {formatDate(req.requestedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-[#5E635D]">No pending verification requests in queue.</p>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT HISTORY */}
      {activeTab === "HISTORY" && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-6 text-xs">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#161815]">
              Recent Inspections Published
            </h2>
            <p className="text-xs text-[#5E635D] mt-0.5">
              History of hygiene inspection reports logged on the platform.
            </p>
          </div>

          <div className="divide-y divide-[#E7E7DE] border-y border-[#E7E7DE]">
            {inspections.map((insp) => (
              <div key={insp.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#161815]">{insp.restaurant.name}</span>
                  <span className="font-bold text-xs bg-[#F0F6F2] text-[#143D2B] border border-[#B8D4C2] px-2 py-0.5 rounded">
                    Score: {insp.overallScore}/100 ({insp.hygieneRatingSmiles} Smiles)
                  </span>
                </div>
                <p className="text-[#5E635D]">{insp.findingsSummary}</p>
                <div className="text-[10px] text-[#868A85]">
                  Completed on {formatDate(insp.completedDate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
