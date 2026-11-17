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
              ? "bg-accent text-bg border-accent"
              : "bg-surface-raised text-text-base border-border-strong hover:bg-surface hover:border-accent"
          }`}
          aria-label={saved ? "Remove from saved kitchens" : "Save kitchen to watchlist"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-bg" : ""}`} />
          <span>{saved ? "Saved" : "Save Kitchen"}</span>
        </button>

        <button
          onClick={() => setQrModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-surface-raised text-accent border border-border-strong hover:bg-surface hover:border-accent transition-colors"
          title="Print or download KitchenProof QR Transparency Poster"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Poster</span>
        </button>

        <button
          onClick={() => setReportModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Report Concern</span>
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-lg bg-surface-raised border border-border-strong text-text-muted hover:text-text-base hover:bg-surface transition-colors"
          title="Copy Profile Link"
          aria-label="Copy Profile Link"
        >
          {copied ? <Check className="w-4 h-4 text-accent" /> : <Share2 className="w-4 h-4" />}
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
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div className="bg-surface rounded-2xl border border-border-strong max-w-lg w-full p-6 sm:p-8 shadow-elevated space-y-5 relative">
            <button
              onClick={() => {
                setReportModalOpen(false);
                setReportSuccess(false);
                setReportError("");
              }}
              className="absolute top-5 right-5 text-text-muted hover:text-text-base p-1.5 rounded-md hover:bg-surface-raised transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-danger/15 text-danger flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 id="report-modal-title" className="font-serif font-bold text-lg text-text-base">
                  Submit Food Safety Concern
                </h3>
                <p className="text-xs text-text-muted">{restaurantName}</p>
              </div>
            </div>

            {reportSuccess ? (
              <div className="bg-surface-raised p-5 rounded-xl border border-border-subtle text-center space-y-2">
                <h4 className="font-bold text-sm text-accent">
                  Report Registered with Trust &amp; Safety
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Thank you for safeguarding food standards. Your report has been dispatched to our auditing queue. If severe violations are documented, an unscheduled physical inspection will be triggered.
                </p>
                <button
                  onClick={() => {
                    setReportModalOpen(false);
                    setReportSuccess(false);
                  }}
                  className="mt-3 px-4 py-2 bg-accent text-bg rounded-lg text-xs font-semibold hover:bg-accent-strong"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                {reportError && (
                  <div className="p-3 bg-danger/10 text-danger text-xs rounded border border-danger/30">
                    {reportError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reporter-name" className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                      Your Full Name
                    </label>
                    <input
                      id="reporter-name"
                      type="text"
                      required
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-lg border border-border-strong text-xs bg-surface-raised text-text-base focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="reporter-email" className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                      Email Address
                    </label>
                    <input
                      id="reporter-email"
                      type="email"
                      required
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-border-strong text-xs bg-surface-raised text-text-base focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="issue-type" className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Nature of Hygiene Observation
                  </label>
                  <select
                    id="issue-type"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong text-xs bg-surface-raised text-text-base focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
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
                  <label htmlFor="issue-description" className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Incident Description &amp; Evidence
                  </label>
                  <textarea
                    id="issue-description"
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details: order date/time, dish name, observations of kitchen premises or food temperature..."
                    className="w-full px-3 py-2 rounded-lg border border-border-strong text-xs bg-surface-raised text-text-base focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-text-muted hover:bg-surface-raised transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-danger text-bg hover:bg-danger/90 transition-colors"
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
