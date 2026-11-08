"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Building,
} from "lucide-react";
import { DEMO_RESTAURANTS } from "@/lib/demoData";

function DisputeFormContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("restaurantSlug") || "";

  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [disputeType, setDisputeType] = useState("WRONG_EXPIRY_DATE");
  const [subject, setSubject] = useState("");
  const [explanation, setExplanation] = useState("");
  const [supportingDocName, setSupportingDocName] = useState("");

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSlug) {
      const match = DEMO_RESTAURANTS.find((r) => r.slug === initialSlug);
      if (match) {
        setSelectedRestaurantId(match.id);
        setSubject(`Rectification Request for ${match.name}`);
      }
    } else if (DEMO_RESTAURANTS.length > 0) {
      setSelectedRestaurantId(DEMO_RESTAURANTS[0].id);
    }
  }, [initialSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedRestaurantId,
          disputeType,
          subject,
          explanation,
          supportingDocName: supportingDocName || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmittedRef(data.referenceNumber || "KP-DSP-882194");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (submittedRef) {
    return (
      <div className="bg-white border border-[#B8D4C2] rounded-xl p-8 sm:p-10 shadow-subtle text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F0F6F2] text-[#143D2B] flex items-center justify-center mx-auto border border-[#B8D4C2]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-[#161815]">
            Dispute Lodged Successfully
          </h2>
          <p className="text-sm text-[#5E635D] max-w-lg mx-auto">
            Your rectification request has been assigned to an independent senior food safety auditor for review.
          </p>
        </div>

        <div className="bg-[#FBFBF9] p-4 rounded-lg border border-[#E7E7DE] inline-block text-left text-xs space-y-1">
          <div>
            Case Reference Number:{" "}
            <strong className="text-base text-[#143D2B] font-mono block sm:inline">
              {submittedRef}
            </strong>
          </div>
          <div className="text-[#868A85]">
            Expected Review Window: Within 48 business hours.
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setSubmittedRef(null);
              setExplanation("");
              setSubject("");
            }}
            className="px-4 py-2 text-xs font-semibold text-[#143D2B] bg-[#F0F6F2] hover:bg-[#DCE9E0] rounded-lg border border-[#B8D4C2] transition-colors"
          >
            Submit Another Rectification
          </button>
          <Link
            href="/explore"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#143D2B] hover:bg-[#0F2E1D] rounded-lg transition-colors"
          >
            Return to Kitchen Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form */}
      <div className="lg:col-span-8 bg-white border border-[#E7E7DE] rounded-xl p-6 sm:p-8 shadow-subtle">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Kitchen Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#161815]">
              Select Kitchen Establishment *
            </label>
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7E7DE] focus:outline-none focus:border-[#143D2B] bg-white text-[#161815]"
            >
              {DEMO_RESTAURANTS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.locality}, {r.city})
                </option>
              ))}
            </select>
          </div>

          {/* Dispute Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#161815]">
              Dispute / Rectification Category *
            </label>
            <select
              value={disputeType}
              onChange={(e) => setDisputeType(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7E7DE] focus:outline-none focus:border-[#143D2B] bg-white text-[#161815]"
            >
              <option value="WRONG_EXPIRY_DATE">
                Expired Certificate Renewed / Date Discrepancy
              </option>
              <option value="INCORRECT_INSPECTION_NOTE">
                Contesting Inspector Audit Observation
              </option>
              <option value="LAB_TEST_DISCREPANCY">
                NABL Laboratory Water/Food Test Upload
              </option>
              <option value="UNJUSTIFIED_FLAG">
                Challenging Critical Non-Compliance Penalty
              </option>
              <option value="ADDRESS_OR_LEGAL_NAME_ERROR">
                Premises, Brand, or Legal Entity Correction
              </option>
            </select>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#161815]">
              Subject Summary *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Renewed Rentokil monthly pest control service log for November 2026"
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7E7DE] focus:outline-none focus:border-[#143D2B] text-[#161815]"
            />
          </div>

          {/* Detailed Explanation */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#161815]">
              Detailed Explanation & Corrective Actions Undertaken *
            </label>
            <textarea
              rows={5}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Please explain the factual discrepancy or details of the newly executed corrective action..."
              required
              minLength={20}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7E7DE] focus:outline-none focus:border-[#143D2B] text-[#161815]"
            />
            <span className="text-[11px] text-[#868A85] block">
              Minimum 20 characters. Include certificate serial numbers or applicator names where applicable.
            </span>
          </div>

          {/* Supporting Document Reference */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#161815]">
              Supporting Document Reference / Filename
            </label>
            <input
              type="text"
              value={supportingDocName}
              onChange={(e) => setSupportingDocName(e.target.value)}
              placeholder="e.g. rentokil_service_nov2026_signed.pdf"
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E7E7DE] focus:outline-none focus:border-[#143D2B] text-[#161815]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#143D2B] hover:bg-[#0F2E1D] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Lodging Formal Dispute..." : "Submit Dispute for Auditor Review"}
          </button>
        </form>
      </div>

      {/* Sidebar Guide */}
      <div className="lg:col-span-4 space-y-6 text-xs text-[#5E635D]">
        <div className="bg-[#F5F5F0] border border-[#E7E7DE] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#143D2B] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>The 48-Hour Review Standard</span>
          </div>
          <p className="leading-relaxed">
            Every dispute is assigned to an accredited auditor who was not involved in the original inspection. If documentation validates compliance, scores recalculate automatically.
          </p>
        </div>

        <div className="bg-white border border-[#E7E7DE] rounded-xl p-5 space-y-3 shadow-subtle">
          <h3 className="font-serif font-bold text-sm text-[#161815]">
            Acceptable Evidence Types
          </h3>
          <ul className="space-y-2 list-disc pl-4 text-[11px]">
            <li>NABL accredited laboratory potable water test reports</li>
            <li>Signed monthly commercial pest application log sheets</li>
            <li>Official FoSCoS receipt or renewed registration certificate</li>
            <li>Form IX handler medical fitness certifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DisputesPage() {
  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-white border-b border-[#E7E7DE] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#143D2B] font-semibold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B] bg-[#F0F6F2] px-2.5 py-1 rounded border border-[#B8D4C2]">
              Operator Due Process
            </span>
            <span className="text-xs text-[#868A85]">Guaranteed 48-Hour Independent Review</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#161815] tracking-tight">
            Food Business Operator Dispute & Rectification Portal
          </h1>
          <p className="text-sm text-[#5E635D] leading-relaxed">
            KitchenProof guarantees food business operators the right to contest inaccurate audit observations, submit newly renewed statutory records, or challenge penalty score caps.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-[#868A85]">
              Loading dispute submission form...
            </div>
          }
        >
          <DisputeFormContent />
        </Suspense>
      </main>
    </div>
  );
}
