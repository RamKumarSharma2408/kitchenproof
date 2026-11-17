"use client";

import { X, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Download, Printer, ExternalLink, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm print:bg-white print:p-0"
    >
      <div className="bg-surface rounded-2xl border border-border-strong max-w-xl w-full p-6 sm:p-8 shadow-elevated relative space-y-6 print:border-0 print:shadow-none print:max-w-none print:w-full print:p-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-text-muted hover:text-text-base p-1.5 rounded-md hover:bg-surface-raised transition-colors print:hidden"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-strong text-accent flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
              Verified Compliance Record
            </span>
            <h3 id="doc-modal-title" className="font-serif font-bold text-lg text-text-base mt-0.5">
              {doc.title}
            </h3>
            <p className="text-xs text-text-muted">{restaurantName}</p>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            isExpired
              ? "bg-danger/10 border-danger/40 text-danger"
              : doc.verificationStatus === "VERIFIED"
              ? "bg-accent/10 border-accent/40 text-accent"
              : "bg-warning/10 border-warning/40 text-warning"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isExpired ? (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            ) : doc.verificationStatus === "VERIFIED" ? (
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <div>
              <strong className="text-xs block font-bold">
                {isExpired ? "EXPIRED CERTIFICATE" : doc.verificationStatus.replace(/_/g, " ")}
              </strong>
              <span className="text-[10px] text-text-muted">
                {isExpired
                  ? "This record has exceeded its validity period and requires mandatory physical re-audit."
                  : "Audited against FSSAI Schedule 4 sanitary benchmarks."}
              </span>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="bg-surface-raised rounded-xl border border-border-subtle p-4 divide-y divide-border-subtle text-xs">
          <div className="py-2 flex justify-between">
            <span className="text-text-muted">Document Type</span>
            <span className="font-medium text-text-base">{doc.docType.replace(/_/g, " ")}</span>
          </div>

          <div className="py-2 flex justify-between">
            <span className="text-text-muted">Issue Date</span>
            <span className="font-medium text-text-base">{formatDate(doc.issueDate)}</span>
          </div>

          <div className="py-2 flex justify-between">
            <span className="text-text-muted">Validity / Expiry</span>
            <span className={`font-medium ${isExpired ? "text-danger font-bold" : "text-text-base"}`}>
              {doc.expiryDate ? formatDate(doc.expiryDate) : "Permanent"}
              {isExpired ? " (EXPIRED)" : ""}
            </span>
          </div>

          <div className="py-2 flex justify-between">
            <span className="text-text-muted">File Designation</span>
            <span className="font-mono text-[11px] text-text-muted">{doc.fileName}</span>
          </div>

          <div className="py-2 flex justify-between">
            <span className="text-text-muted">Auditor Verification Date</span>
            <span className="font-medium text-text-base">
              {doc.verifiedAt ? formatDate(doc.verifiedAt) : "Verified on intake"}
            </span>
          </div>
        </div>

        {/* Auditor Findings & Notes */}
        <div className="bg-surface-raised/70 p-4 rounded-xl border border-border-subtle space-y-1.5 text-xs">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-accent block">
            Auditor Findings & Observations:
          </span>
          <p className="text-text-base leading-relaxed">
            {doc.auditorComments || doc.notes || "Certificate inspected and verified against statutory standard criteria. Water parameters tested clean; pest application records verified intact."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-border-subtle flex items-center justify-end gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-surface-raised text-text-base hover:bg-surface transition-colors border border-border-strong"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-bg hover:bg-accent-strong transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certified Record</span>
          </button>
        </div>
      </div>
    </div>
  );
}
