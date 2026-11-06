import { getScoreBadge } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, AlertCircle, Info } from "lucide-react";

interface SafetyScoreBadgeProps {
  score: number;
  dataConfidence?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function SafetyScoreBadge({
  score,
  dataConfidence = 100,
  size = "md",
  showLabel = true,
}: SafetyScoreBadgeProps) {
  const badge = getScoreBadge(score);

  if (size === "sm") {
    return (
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-xs border ${badge.bg} ${badge.text} ${badge.border}`}
        >
          {score > 0 ? `${score}/100` : "Unrated"}
        </span>
        {showLabel && (
          <span className="text-[11px] text-[#5E635D] font-medium hidden sm:inline">
            {badge.label}
          </span>
        )}
      </div>
    );
  }

  if (size === "lg") {
    return (
      <div className="bg-white border border-[#E7E7DE] rounded-xl p-6 shadow-subtle flex flex-col items-center sm:items-start">
        <div className="flex items-center justify-between w-full mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5E635D]">
            Kitchen Safety Index
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
            {badge.label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl font-black tracking-tight text-[#161815] font-serif">
            {score > 0 ? score : "—"}
          </span>
          <span className="text-lg font-medium text-[#5E635D]">/100</span>
        </div>

        {/* Data Confidence Indicator */}
        <div className="w-full mt-4 pt-4 border-t border-[#E7E7DE]">
          <div className="flex items-center justify-between text-xs text-[#5E635D] mb-1.5">
            <span className="font-medium flex items-center gap-1">
              Evidence Completeness
              <span title="Measures what proportion of statutory safety documentation has been verified" className="cursor-help">
                <Info className="w-3.5 h-3.5 text-[#868A85]" />
              </span>
            </span>
            <span className="font-semibold text-[#161815]">{dataConfidence}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#EFEFE9] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                dataConfidence >= 80
                  ? "bg-[#143D2B]"
                  : dataConfidence >= 50
                  ? "bg-[#D97706]"
                  : "bg-[#DC2626]"
              }`}
              style={{ width: `${Math.max(5, dataConfidence)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#868A85] mt-1.5">
            {dataConfidence >= 90
              ? "All critical regulatory & audit records independently verified."
              : dataConfidence >= 60
              ? "Partial verified documentation on file. Some logs pending renewal."
              : "Self-reported profile. Formal physical audit pending."}
          </p>
        </div>
      </div>
    );
  }

  // Medium (Default)
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
      >
        <span>{score > 0 ? `${score}/100` : "Unrated"}</span>
      </div>
      {showLabel && (
        <span className="text-xs text-[#5E635D] font-medium">{badge.label}</span>
      )}
    </div>
  );
}

