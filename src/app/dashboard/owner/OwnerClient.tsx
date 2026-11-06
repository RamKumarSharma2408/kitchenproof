"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate, getScoreBadge, getVerificationStatusBadge } from "@/lib/utils";
import {
  Building,
  ShieldCheck,
  FileText,
  Upload,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Send,
  Plus,
  ExternalLink,
} from "lucide-react";

interface OwnerClientProps {
  initialRestaurants: any[];
  userName: string;
  userEmail: string;
}

export default function OwnerClient({ initialRestaurants, userName, userEmail }: OwnerClientProps) {
  const [restaurants, setRestaurants] = useState<any[]>(initialRestaurants);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(
    initialRestaurants[0]?.id || ""
  );

  // Document upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [docType, setDocType] = useState("WATER_TEST_REPORT");
  const [docTitle, setDocTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  // Verification request state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestNotes, setRequestNotes] = useState("");
  const [requesting, setRequesting] = useState(false);

  const selectedRestaurant = restaurants.find((r) => r.id === selectedRestaurantId);
  const statusBadge = selectedRestaurant
    ? getVerificationStatusBadge(selectedRestaurant.verificationStatus)
    : null;
  const scoreBadge = selectedRestaurant ? getScoreBadge(selectedRestaurant.safetyScore) : null;

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedRestaurantId,
          docType,
          title: docTitle,
          fileName: fileName || `${docType.toLowerCase()}_report.pdf`,
          fileUrl: fileUrl || `/uploads/${docType.toLowerCase()}.pdf`,
          issueDate: issueDate || undefined,
          expiryDate: expiryDate || undefined,
          notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state
        setRestaurants((prev) =>
          prev.map((r) => {
            if (r.id === selectedRestaurantId) {
              return {
                ...r,
                documents: [data.document, ...r.documents],
              };
            }
            return r;
          })
        );
        setUploadModalOpen(false);
        setDocTitle("");
        setFileName("");
        setFileUrl("");
        setNotes("");
        alert("Document submitted successfully. Status: PENDING_VERIFICATION (Awaiting auditor review)");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit document");
      }
    } catch {
      alert("Network error submitting document");
    } finally {
      setUploading(false);
    }
  };

  const handleRequestVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);

    try {
      const res = await fetch("/api/verification-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedRestaurantId,
          requestNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRestaurants((prev) =>
          prev.map((r) => {
            if (r.id === selectedRestaurantId) {
              return {
                ...r,
                verificationStatus: "PENDING_REVIEW",
                verificationRequests: [data.request, ...r.verificationRequests],
              };
            }
            return r;
          })
        );
        setRequestModalOpen(false);
        setRequestNotes("");
        alert("Verification request queued successfully. An accredited auditor will review your documents and schedule an inspection.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit request");
      }
    } catch {
      alert("Network error submitting verification request");
    } finally {
      setRequesting(false);
    }
  };

  if (restaurants.length === 0) {
    return (
      <div className="bg-white border border-[#E7E7DE] rounded-xl p-12 text-center max-w-md mx-auto space-y-3">
        <Building className="w-10 h-10 text-[#868A85] mx-auto" />
        <h2 className="font-serif font-bold text-lg text-[#161815]">No Kitchen Profiles Found</h2>
        <p className="text-xs text-[#5E635D]">
          You have not yet claimed or registered a restaurant profile under your account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Restaurant Selector & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E7E7DE] shadow-subtle">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-[#143D2B]" />
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#868A85]">
              Active Kitchen Profile
            </label>
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="font-serif font-bold text-base text-[#161815] bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.locality}, {r.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedRestaurant && statusBadge && scoreBadge && (
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {statusBadge.label}
            </span>

            <div className="px-3 py-1 bg-[#F0F6F2] border border-[#B8D4C2] rounded-lg text-xs font-bold text-[#143D2B]">
              Score: {selectedRestaurant.safetyScore}/100 ({scoreBadge.label})
            </div>

            <Link
              href={`/restaurants/${selectedRestaurant.slug}`}
              className="text-xs font-semibold text-[#143D2B] underline"
            >
              View Public Profile →
            </Link>
          </div>
        )}
      </div>

      {selectedRestaurant && (
        <div className="space-y-8">
          {/* Statutory Expiry Reminder Banner */}
          {selectedRestaurant.fssaiValidUntil &&
            new Date(selectedRestaurant.fssaiValidUntil) < new Date() && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-900 text-xs">
                <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">FSSAI License Renewal Required</strong>
                  <span>
                    Your registered license expired on {formatDate(selectedRestaurant.fssaiValidUntil)}. Upload the renewed certificate to maintain compliance status.
                  </span>
                </div>
              </div>
            )}

          {/* Verification Request Action Bar */}
          <div className="bg-[#143D2B] text-white p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base">
                Ready for Independent Hygiene Audit?
              </h3>
              <p className="text-xs text-[#DCE9E0]">
                Submit your verification request once water tests, pest logs, and handler medicals are uploaded.
              </p>
            </div>

            <button
              onClick={() => setRequestModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#143D2B] text-xs font-semibold hover:bg-[#F0F6F2] transition-colors self-start sm:self-auto shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Verification Audit</span>
            </button>
          </div>

          {/* Compliance Checklist Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#868A85]">
                FSSAI Registration
              </span>
              <strong className="text-sm font-semibold text-[#161815] block">
                {selectedRestaurant.fssaiNumber || "Not recorded"}
              </strong>
              <span className="text-[11px] text-[#5E635D]">
                Valid until: {formatDate(selectedRestaurant.fssaiValidUntil)}
              </span>
            </div>

            <div className="p-4 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#868A85]">
                Potable Water Test
              </span>
              <strong className="text-sm font-semibold text-[#161815] block">
                {selectedRestaurant.documents.some((d: any) => d.docType === "WATER_TEST_REPORT")
                  ? "Report on File"
                  : "Missing Report"}
              </strong>
              <span className="text-[11px] text-[#5E635D]">IS 10500 standard required</span>
            </div>

            <div className="p-4 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#868A85]">
                Pest Control Contract
              </span>
              <strong className="text-sm font-semibold text-[#161815] block">
                {selectedRestaurant.kitchenProfile?.pestControlAgency || "Not assigned"}
              </strong>
              <span className="text-[11px] text-[#5E635D]">
                Last serviced: {formatDate(selectedRestaurant.kitchenProfile?.lastPestControlDate)}
              </span>
            </div>

            <div className="p-4 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#868A85]">
                FoSTaC Supervisor
              </span>
              <strong className="text-sm font-semibold text-[#161815] block">
                {selectedRestaurant.kitchenProfile?.fostacSupervisorName || "Pending designation"}
              </strong>
              <span className="text-[11px] text-[#5E635D]">
                Cert: {selectedRestaurant.kitchenProfile?.fostacCertNumber || "Pending"}
              </span>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white border border-[#E7E7DE] rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#161815]">
                  Compliance Documentation Vault
                </h3>
                <p className="text-xs text-[#5E635D] mt-0.5">
                  Uploaded laboratory certificates, medical fitness forms, and pest control logs.
                </p>
              </div>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#143D2B] text-white text-xs font-semibold hover:bg-[#1F593F] transition-colors self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>
            </div>

            {selectedRestaurant.documents.length > 0 ? (
              <div className="divide-y divide-[#E7E7DE] border-y border-[#E7E7DE]">
                {selectedRestaurant.documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#143D2B]" />
                        <span className="font-semibold text-sm text-[#161815]">{doc.title}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            doc.verificationStatus === "VERIFIED"
                              ? "bg-brand-50 text-brand-900 border-brand-200"
                              : doc.verificationStatus === "REJECTED"
                              ? "bg-crimson-50 text-crimson-900 border-crimson-200"
                              : "bg-amber-50 text-amber-900 border-amber-200"
                          }`}
                        >
                          {doc.verificationStatus}
                        </span>
                      </div>
                      <p className="text-[#5E635D]">{doc.notes || doc.fileName}</p>
                      <div className="flex items-center gap-4 text-[11px] text-[#868A85]">
                        {doc.issueDate && <span>Issued: {formatDate(doc.issueDate)}</span>}
                        {doc.expiryDate && <span>Expires: {formatDate(doc.expiryDate)}</span>}
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-[#868A85]">
                      Uploaded {formatDate(doc.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#5E635D]">
                No documents uploaded yet. Add your water test and FSSAI certificate to start.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E7E7DE] max-w-lg w-full p-6 sm:p-8 shadow-elevated space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#161815]">
              Upload Compliance Document
            </h3>
            <p className="text-xs text-[#5E635D]">
              Submitted documents will be reviewed by an accredited inspector. You cannot independently mark documents as verified.
            </p>

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3] bg-[#FBFBF9]"
                >
                  <option value="WATER_TEST_REPORT">Potable Water Microbiological Report (IS 10500)</option>
                  <option value="FSSAI_CERTIFICATE">FSSAI License / Registration Certificate</option>
                  <option value="PEST_CONTROL_LOG">Monthly Pest Control Service Certificate</option>
                  <option value="MEDICAL_FITNESS_CERT">Staff Medical Fitness Certificates (Form IX)</option>
                  <option value="TEMPERATURE_LOG">Refrigeration & Cold-Chain Daily Log</option>
                  <option value="CLEANING_SANITATION_LOG">Deep Sanitization & Hood Cleaning Schedule</option>
                  <option value="FOSTAC_CERTIFICATE">FoSTaC Food Safety Supervisor Certificate</option>
                  <option value="AUDIT_REPORT">Accredited Third-Party Hygiene Audit</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g., NABL Water Potability Test Q4 2026"
                  className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                  Testing Agency / Details / Lab Name
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Testing laboratory name, accreditation details, or batch numbers..."
                  className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-[#D0D0C3] rounded-lg text-[#5E635D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-[#143D2B] text-white font-semibold rounded-lg hover:bg-[#1F593F]"
                >
                  {uploading ? "Submitting..." : "Submit to Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E7E7DE] max-w-lg w-full p-6 sm:p-8 shadow-elevated space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#161815]">
              Request Independent Verification Audit
            </h3>
            <p className="text-xs text-[#5E635D]">
              By submitting this request, you agree to an unannounced or scheduled physical inspection of your kitchen premises by an accredited food safety auditor.
            </p>

            <form onSubmit={handleRequestVerification} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
                  Auditor Notes / Preferred Audit Windows
                </label>
                <textarea
                  required
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="e.g., We have updated our cold chain refrigeration and renewed all water tests. Ready for quarterly routine inspection."
                  className="w-full px-3 py-2 rounded-lg border border-[#D0D0C3]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 border border-[#D0D0C3] rounded-lg text-[#5E635D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requesting}
                  className="px-5 py-2 bg-[#143D2B] text-white font-semibold rounded-lg hover:bg-[#1F593F]"
                >
                  {requesting ? "Queueing..." : "Confirm Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
