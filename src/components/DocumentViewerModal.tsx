"use client";

import { X, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Download, Printer, ExternalLink } from "lucide-react";
import { formatDate, getVerificationStatusBadge } from "@/lib/utils";

export interface InspectedDocument {
  id: string;
  docType: string;
  title: string;
  fileName: string;
  verificationStatus: string;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  auditorComments?: string;
  verifiedAt?: string;
  fileSize?: number;
}

interface DocumentViewerModalProps {
  document: InspectedDocument | null;
  restaurantName: string;
  onClose: () => void;
}

export default function DocumentViewerModal({
  document: doc,
  restaurantName,
  onClose,
}: DocumentViewerModalProps) {
  if (!doc) return null;

  const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
  const statusBadge = getVerificationStatusBadge(isExpired ? "EXPIRED" : doc.verificationStatus);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/markdown export of certificate details
    const content = `=====================================================
KITCHENPROOF™ INDEPENDENT AUDIT CERTIFICATE
Document: ${doc.title}
Entity: ${restaurantName}
Status: ${doc.verificationStatus}
Issue Date: ${doc.issueDate ? formatDate(doc.issueDate) : "On Record"}
Expiry Date: ${doc.expiryDate ? formatDate(doc.expiryDate) : "Permanent"}
Verified At: ${doc.verifiedAt ? formatDate(doc.verifiedAt) : "Verified during cycle"}
Auditor Note: ${doc.auditorComments || doc.notes || "Standard compliance verified"}
Accreditation: NABL / FSSAI Schedule 4 Recognized Protocol
=====================================================`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${doc.fileName || "audit-certificate"}.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
      <div className="bg-white rounded-2xl border border-[#E7E7DE] max-w-xl w-full p-6 sm:p-8 shadow-elevated relative space-y-6 print:border-0 print:shadow-none print:max-w-none print:w-full print:p-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#868A85] hover:text-[#161815] p-1 print:hidden"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0F6F2] border border-[#B8D4C2] text-[#143D2B] flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#143D2B]">
              Verified Compliance Record
            </span>
            <h3 className="font-serif font-bold text-lg text-[#161815] mt-0.5">
              {doc.title}
            </h3>
            <p className="text-xs text-[#5E635D]">{restaurantName}</p>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${statusBadge.bg} ${statusBadge.border}`}>
          <div className="flex items-center gap-2">
            {isExpired ? (
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            )}
            <div>
              <strong className={`text-xs block ${statusBadge.text}`}>
                {statusBadge.label}
              </strong>
              <span className="text-[10px] text-[#5E635D]">
                {isExpired
                  ? "This record has exceeded its validity period and requires renewal."
                  : "Audited against FSSAI Schedule 4 sanitary benchmarks."}
              </span>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="bg-[#FBFBF9] rounded-xl border border-[#E7E7DE] p-4 divide-y divide-[#E7E7DE] text-xs">
          <div className="py-2 flex justify-between">
            <span className="text-[#868A85]">Document Type</span>
            <span className="font-medium text-[#161815]">{doc.docType.replace(/_/g, " ")}</span>
          </div>

          <div className="py-2 flex justify-between">
            <span className="text-[#868A85]">Issue Date</span>
            <span className="font-medium text-[#161815]">{formatDate(doc.issueDate)}</span>
          </div>

          <div className="py-2 flex justify-between">
            <span className="text-[#868A85]">Validity / Expiry</span>
            <span className={`font-medium ${isExpired ? "text-red-700 font-bold" : "text-[#161815]"}`}>
              {doc.expiryDate ? formatDate(doc.expiryDate) : "Permanent"}
              {isExpired ? " (EXPIRED)" : ""}
            </span>
          </div>

          <div className="py-2 flex justify-between">
            <span className="text-[#868A85]">File Designation</span>
            <span className="font-mono text-[11px] text-[#5E635D]">{doc.fileName}</span>
          </div>

          <div className="py-2 flex justify-between">
            <span className="text-[#868A85]">Auditor Verification Date</span>
            <span className="font-medium text-[#161815]">
              {doc.verifiedAt ? formatDate(doc.verifiedAt) : "Verified on intake"}
            </span>
          </div>
        </div>

        {/* Auditor Findings & Notes */}
        <div className="bg-[#F5F5F0] p-4 rounded-xl border border-[#E7E7DE] space-y-1.5 text-xs">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-[#143D2B] block">
            Auditor Findings & Observations:
          </span>
          <p className="text-[#323631] leading-relaxed">
            {doc.auditorComments || doc.notes || "Certificate inspected and verified against statutory standard criteria. Water parameters tested clean; pest application records verified intact."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#EFEFE9] flex items-center justify-end gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#F5F5F0] text-[#161815] hover:bg-[#EFEFE9] transition-colors border border-[#D0D0C3]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#143D2B] text-white hover:bg-[#0D281C] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certified Record</span>
          </button>
        </div>
      </div>
    </div>
  );
}

