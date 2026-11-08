"use client";

import { useState } from "react";
import { FileText, ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import DocumentViewerModal, { InspectedDocument } from "@/components/DocumentViewerModal";

interface DocumentListProps {
  documents: InspectedDocument[];
  restaurantName: string;
}

export default function DocumentList({ documents, restaurantName }: DocumentListProps) {
  const [selectedDoc, setSelectedDoc] = useState<InspectedDocument | null>(null);

  return (
    <div className="bg-white border border-[#E7E7DE] rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#161815]">
            Verified Documentation & Laboratory Certificates
          </h2>
          <p className="text-xs text-[#5E635D] mt-1">
            Audited physical and statutory documents. Click &quot;Inspect&quot; on any record to view certified parameters.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F0F6F2] text-[#143D2B] border border-[#B8D4C2]">
          {documents.length} Records on File
        </span>
      </div>

      <div className="divide-y divide-[#E7E7DE] border-y border-[#E7E7DE]">
        {documents.map((doc) => {
          const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();

          return (
            <div
              key={doc.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FBFBF9] px-2 rounded-lg transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#143D2B]" />
                  <span className="font-semibold text-sm text-[#161815]">{doc.title}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                      isExpired
                        ? "bg-orange-50 text-orange-900 border-orange-200"
                        : doc.verificationStatus === "VERIFIED"
                        ? "bg-[#F0F6F2] text-[#143D2B] border-[#B8D4C2]"
                        : "bg-amber-50 text-amber-900 border-amber-200"
                    }`}
                  >
                    {isExpired ? "EXPIRED" : doc.verificationStatus.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-xs text-[#5E635D]">
                  {doc.notes || doc.auditorComments || "Statutory audit record certified by accredited laboratory."}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-[#868A85]">
                  {doc.issueDate && <span>Issued: {formatDate(doc.issueDate)}</span>}
                  {doc.expiryDate && (
                    <span className={isExpired ? "text-red-700 font-bold" : ""}>
                      Valid Until: {formatDate(doc.expiryDate)} {isExpired ? "(Overdue)" : ""}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(doc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-[#143D2B] bg-[#F0F6F2] hover:bg-[#DCE9E0] transition-colors border border-[#B8D4C2]"
                >
                  <span>Inspect Certificate</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Modal */}
      <DocumentViewerModal
        document={selectedDoc}
        restaurantName={restaurantName}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
}

