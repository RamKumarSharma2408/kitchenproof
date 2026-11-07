import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Not recorded";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(d);
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "Not recorded";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(d);
}

export function getScoreBadge(score: number): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  if (score >= 85) {
    return {
      label: "Exemplary Hygiene",
      bg: "bg-brand-50",
      text: "text-brand-800",
      border: "border-brand-200",
      dot: "bg-brand-600",
    };
  }
  if (score >= 70) {
    return {
      label: "Standard Compliant",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-600",
    };
  }
  if (score > 0) {
    return {
      label: "Requires Improvement",
      bg: "bg-crimson-50",
      text: "text-crimson-800",
      border: "border-crimson-200",
      dot: "bg-crimson-600",
    };
  }
  return {
    label: "Awaiting Assessment",
    bg: "bg-charcoal-100",
    text: "text-charcoal-700",
    border: "border-charcoal-200",
    dot: "bg-charcoal-400",
  };
}

export function getVerificationStatusBadge(status: string): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case "VERIFIED":
    case "INDEPENDENTLY_VERIFIED":
      return {
        label: "Independently Verified",
        bg: "bg-[#F0F6F2]",
        text: "text-[#143D2B]",
        border: "border-[#B8D4C2]",
        dot: "bg-emerald-600",
      };
    case "UPLOADED_UNVERIFIED":
    case "UPLOADED":
      return {
        label: "Uploaded (Awaiting Audit)",
        bg: "bg-sky-50",
        text: "text-sky-900",
        border: "border-sky-300",
        dot: "bg-sky-600",
      };
    case "PENDING_REVIEW":
    case "PENDING_VERIFICATION":
      return {
        label: "Pending Verification",
        bg: "bg-amber-50",
        text: "text-amber-900",
        border: "border-amber-300",
        dot: "bg-amber-600",
      };
    case "EXPIRED":
    case "EXPIRED_EVIDENCE":
      return {
        label: "Expired Evidence",
        bg: "bg-orange-50",
        text: "text-orange-900",
        border: "border-orange-300",
        dot: "bg-orange-600",
      };
    case "MISSING_INFO":
    case "MISSING_EVIDENCE":
      return {
        label: "Missing Information",
        bg: "bg-rose-50",
        text: "text-rose-900",
        border: "border-rose-300",
        dot: "bg-rose-500",
      };
    case "REJECTED":
    case "REJECTED_EVIDENCE":
    case "ACTION_REQUIRED":
      return {
        label: "Action Required / Rejected",
        bg: "bg-red-50",
        text: "text-red-900",
        border: "border-red-300",
        dot: "bg-red-600",
      };
    case "SELF_REPORTED":
    case "UNVERIFIED":
    default:
      return {
        label: "Self-Reported Claim",
        bg: "bg-[#F5F5F0]",
        text: "text-[#5E635D]",
        border: "border-[#D0D0C3]",
        dot: "bg-gray-400",
      };
  }
}

export function getVerificationStatusDescription(status: string): string {
  switch (status) {
    case "VERIFIED":
    case "INDEPENDENTLY_VERIFIED":
      return "Document or inspection verified on-site by an accredited third-party food safety auditor with verified laboratory accreditation.";
    case "UPLOADED_UNVERIFIED":
    case "UPLOADED":
      return "Compliance evidence has been uploaded by the food business operator and is queued for auditor intake verification.";
    case "PENDING_REVIEW":
    case "PENDING_VERIFICATION":
      return "Auditor has commenced review of submitted logs and evidence; final determination is in progress.";
    case "EXPIRED":
    case "EXPIRED_EVIDENCE":
      return "Certificate or laboratory test has passed its validity threshold. Score confidence is penalised until current renewal is audited.";
    case "MISSING_INFO":
    case "MISSING_EVIDENCE":
      return "Required statutory compliance documentation has not been submitted by the kitchen operator.";
    case "REJECTED":
    case "REJECTED_EVIDENCE":
    case "ACTION_REQUIRED":
      return "Auditor found non-compliance with sanitary standards or evidence was invalid. Corrective action is legally required.";
    case "SELF_REPORTED":
    case "UNVERIFIED":
    default:
      return "Data supplied solely by kitchen operator without independent third-party physical or laboratory audit confirmation.";
  }
}

