"use client";

import { useState } from "react";
import { FileText, ExternalLink, ShieldCheck, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import DocumentViewerModal, { InspectedDocument } from "@/components/DocumentViewerModal";

interface DocumentListProps {
  documents: InspectedDocument[];
  restaurantName: string;
}

export default function DocumentList({ documents, restaurantName }: DocumentListProps) {
  const [selectedDoc, setSelectedDoc] = useState<InspectedDocument | null>(null);

  const getStatusDisplay = (status: string, isExpired: boolean) => {
    if (isExpired) {
      return {
        label: "EXPIRED",
        icon: AlertTriangle,
        className: "bg-danger/15 text-danger border-danger/40",
      };
    }
    switch (status) {
      case "VERIFIED":
      case "INDEPENDENTLY_VERIFIED":
        return {
          label: "VERIFIED",
          icon: ShieldCheck,
          className: "bg-accent/15 text-accent border-accent/40",
        };
      case "REJECTED":
        return {
          label: "REJECTED",
          icon: AlertCircle,
          className: "bg-danger/15 text-danger border-danger/40",
        };
      case "PENDING_REVIEW":
      case "PENDING_VERIFICATION":
      default:
        return {
          label: "PENDING REVIEW",
          icon: Clock,
          className: "bg-warning/15 text-warning border-warning/40",
        };
    }
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-6 sm:p-8 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border-subtle pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent block">
            Audited Evidence Dossier
          </span>
          <h2 className="text-xl font-serif font-bold text-text-base mt-1">
            Statutory Documents & Laboratory Certificates
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-prose">
            Certified compliance instruments benchmarked against FSSAI Schedule 4 sanitary standards and accredited laboratory test thresholds.
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-surface-raised text-accent border border-border-strong self-start sm:self-auto">
          {documents.length} Records Ledgered
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-10 bg-surface-raised/40 rounded-lg border border-border-subtle">
          <FileText className="w-8 h-8 text-text-muted/60 mx-auto mb-2" />
          <p className="text-sm font-medium text-text-base">No audited documentation uploaded yet.</p>
          <p className="text-xs text-text-muted mt-1">Records are cataloged upon formal audit intake.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-left border-collapse text-xs">
            <caption className="sr-only">Audited Compliance Documents and Laboratory Certificates</caption>
            <thead>
              <tr className="border-b border-border-subtle text-text-muted text-[11px] font-semibold uppercase tracking-wider">
                <th scope="col" className="py-3 px-3">Document Record</th>
                <th scope="col" className="py-3 px-3">Status</th>
                <th scope="col" className="py-3 px-3 hidden md:table-cell">Validity Cycle</th>
                <th scope="col" className="py-3 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {documents.map((doc) => {
                const isExpired = !!(doc.expiryDate && new Date(doc.expiryDate) < new Date());
                const statusInfo = getStatusDisplay(doc.verificationStatus, isExpired);
                const StatusIcon = statusInfo.icon;

                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-surface-raised/60 transition-colors group"
                  >
                    <td className="py-3.5 px-3 align-top">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded bg-surface-raised border border-border-subtle flex items-center justify-center flex-shrink-0 mt-0.5 text-accent">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-text-base block group-hover:text-accent transition-colors">
                            {doc.title}
                          </span>
                          <span className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                            {doc.notes || doc.auditorComments || "Accredited laboratory or municipal certificate record."}
                          </span>
                          <span className="font-mono text-[10px] text-text-muted/70 block md:hidden mt-1">
                            {doc.expiryDate ? `Exp: ${formatDate(doc.expiryDate)}` : "Permanent"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 align-top whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-semibold tracking-wide border ${statusInfo.className}`}
                      >
                        <StatusIcon className="w-3 h-3 flex-shrink-0" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 align-top hidden md:table-cell text-text-muted whitespace-nowrap">
                      <div>
                        {doc.issueDate && <span className="block text-[11px]">Issued: {formatDate(doc.issueDate)}</span>}
                        <span className={`block text-[11px] ${isExpired ? "text-danger font-semibold" : ""}`}>
                          {doc.expiryDate ? `Valid to: ${formatDate(doc.expiryDate)}` : "Permanent Authorization"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 align-top text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedDoc(doc)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-text-base bg-surface-raised hover:bg-accent hover:text-bg transition-colors border border-border-strong"
                        aria-label={`Inspect Certificate for ${doc.title}`}
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Interactive Modal */}
      <DocumentViewerModal
        document={selectedDoc}
        restaurantName={restaurantName}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
}
