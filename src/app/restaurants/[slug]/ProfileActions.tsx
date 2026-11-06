"use client";

import { useState } from "react";
import { Bookmark, AlertTriangle, Share2, Check, X, ShieldAlert } from "lucide-react";

interface ProfileActionsProps {
  restaurantId: string;
  restaurantName: string;
}

export default function ProfileActions({ restaurantId, restaurantName }: ProfileActionsProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

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
        alert("Please log in to save kitchens to your account.");
      }
    } catch {
      alert("Failed to update saved status.");
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
        const data = await res.json();
        setReportError(data.error || "Failed to submit report");
      }
    } catch {
      setReportError("Network error. Please try again.");
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
          <span>{saved ? "Saved to Account" : "Save Kitchen"}</span>
        </button>

        <button
          onClick={() => setReportModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] hover:bg-red-100 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Report Safety Concern</span>
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-lg bg-white border border-[#D0D0C3] text-[#5E635D] hover:bg-[#F5F5F0] transition-colors"
          title="Copy Profile Link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

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
                  Report Registered Successfully
                </h4>
                <p className="text-xs text-[#323631] leading-relaxed">
                  Thank you for contributing to community transparency. Your observation has been forwarded to regional verification personnel and recorded in the audit intake log.
                </p>
                <button
                  onClick={() => {
                    setReportModalOpen(false);
                    setReportSuccess(false);
                  }}
                  className="mt-3 px-4 py-2 bg-[#143D2B] text-white text-xs font-semibold rounded-lg"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                {reportError && (
                  <div className="p-3 bg-red-50 text-red-800 rounded border border-red-200">
                    {reportError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g., Rajesh Sharma"
                    className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                    Your Email (for verification follow-up)
                  </label>
                  <input
                    type="email"
                    required
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="rajesh@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                    Observation Category
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B] bg-[#FBFBF9]"
                  >
                    <option value="POOR_HYGIENE">Poor General Kitchen Hygiene & Cleanliness</option>
                    <option value="UNHYGIENIC_FOOD_HANDLER">Food Handlers Not Wearing Caps / Gloves</option>
                    <option value="PEST_SIGHTING">Pest or Insect Sighting Around Food Area</option>
                    <option value="SICKNESS_SUSPICION">Suspected Foodborne Illness After Consumption</option>
                    <option value="EXPIRED_INGREDIENTS">Stale / Discolored Food or Expired Oil</option>
                    <option value="GENERAL_SAFETY">Other Food Safety or Storage Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                    Description of Observation
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please describe what you observed, order date/time, and specific hygiene issue..."
                    className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B]"
                  />
                </div>

                <p className="text-[11px] text-[#868A85]">
                  Reports are investigated and logged. False or defamatory claims are screened by authorized verification officers.
                </p>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 border border-[#D0D0C3] rounded-lg text-xs font-medium text-[#5E635D] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="px-5 py-2 bg-[#B91C1C] text-white text-xs font-semibold rounded-lg hover:bg-red-800 transition-colors"
                  >
                    {submittingReport ? "Submitting..." : "Submit Concern"}
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
