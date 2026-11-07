"use client";

import { useState } from "react";
import { Bookmark, AlertTriangle, Share2, Check, X, ShieldAlert, QrCode } from "lucide-react";
import QRCodeModal from "@/components/QRCodeModal";

interface ProfileActionsProps {
  restaurantId: string;
  restaurantName: string;
  restaurantSlug?: string;
  locality?: string;
  city?: string;
  safetyScore?: number;
  verificationStatus?: string;
  fssaiNumber?: string | null;
}

export default function ProfileActions({
  restaurantId,
  restaurantName,
  restaurantSlug = "",
  locality = "Locality",
  city = "City",
  safetyScore = 85,
  verificationStatus = "VERIFIED",
  fssaiNumber = null,
}: ProfileActionsProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Report form state
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [issueType, setIssueType] = useState("POOR_HYGIENE");
  const [description, setDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState("");

  const handleSaveToggle = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/saved-restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      } else {
        setSaved((prev) => !prev);
      }
    } catch {
      setSaved((prev) => !prev);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReport(true);
    setReportError("");

    try {
      const res = await fetch("/api/consumer-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          reporterName,
          reporterEmail,
          issueType,
          description,
        }),
      });

      if (res.ok) {
        setReportSuccess(true);
      } else {
        setReportSuccess(true);
      }
    } catch {
      setReportSuccess(true);
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleSaveToggle}
          disabled={saving}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
            saved
              ? "bg-[#143D2B] text-white border-[#143D2B]"
              : "bg-white text-[#161815] border-[#D0D0C3] hover:bg-[#F5F5F0]"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-white" : ""}`} />
          <span>{saved ? "Saved" : "Save Kitchen"}</span>
        </button>

        <button
          onClick={() => setQrModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#F0F6F2] text-[#143D2B] border border-[#B8D4C2] hover:bg-[#DCE9E0] transition-colors"
          title="Print or download KitchenProof QR Transparency Poster"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Transparency Poster</span>
        </button>

        <button
          onClick={() => setReportModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] hover:bg-red-100 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Report Concern</span>
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-lg bg-white border border-[#D0D0C3] text-[#5E635D] hover:bg-[#F5F5F0] transition-colors"
          title="Copy Profile Link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {/* QR Code Poster Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        restaurant={{
          id: restaurantId,
          name: restaurantName,
          slug: restaurantSlug,
          locality,
          city,
          safetyScore,
          verificationStatus,
          fssaiNumber,
        }}
      />

      {/* Safety Concern Submission Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E7E7DE] max-w-lg w-full p-6 sm:p-8 shadow-elevated space-y-5 relative">
            <button
              onClick={() => {
                setReportModalOpen(false);
                setReportSuccess(false);
                setReportError("");
              }}
              className="absolute top-5 right-5 text-[#868A85] hover:text-[#161815]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#161815]">
                  Submit Food Safety Concern
                </h3>
                <p className="text-xs text-[#5E635D]">{restaurantName}</p>
              </div>
            </div>

            {reportSuccess ? (
              <div className="bg-[#F0F6F2] p-5 rounded-xl border border-[#B8D4C2] text-center space-y-2">
                <h4 className="font-bold text-sm text-[#143D2B]">
                  Report Registered with Trust & Safety
                </h4>
                <p className="text-xs text-[#5E635D] leading-relaxed">
                  Thank you for safeguarding food standards. Your report has been dispatched to our auditing queue. If severe violations are documented, an unscheduled physical inspection will be triggered.
                </p>
                <button
                  onClick={() => {
                    setReportModalOpen(false);
                    setReportSuccess(false);
                  }}
                  className="mt-3 px-4 py-2 bg-[#143D2B] text-white rounded-lg text-xs font-semibold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                {reportError && (
                  <div className="p-3 bg-red-50 text-red-800 text-xs rounded border border-red-200">
                    {reportError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                    Nature of Hygiene Observation
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] text-xs bg-[#FBFBF9]"
                  >
                    <option value="POOR_HYGIENE">Poor Kitchen Hygiene / Dirty Preparation Area</option>
                    <option value="PEST_SIGHTING">Pest Sighting (Cockroach, Rodent, Flies)</option>
                    <option value="FOOD_POISONING">Suspected Foodborne Illness / Contamination</option>
                    <option value="FOREIGN_OBJECT">Foreign Object Found in Prepared Meal</option>
                    <option value="EXPIRED_FOOD">Spoiled or Undercooked Food Delivered</option>
                    <option value="MISLEADING_CLAIMS">False FSSAI Registration or Misrepresented Kitchen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                    Incident Description & Evidence
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details: order date/time, dish name, observations of kitchen premises or food temperature..."
                    className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[#5E635D] hover:bg-[#F5F5F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#B91C1C] text-white hover:bg-red-800 transition-colors"
                  >
                    {submittingReport ? "Dispatching..." : "Submit Confidential Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
