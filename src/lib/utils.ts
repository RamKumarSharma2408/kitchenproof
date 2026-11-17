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
      bg: "bg-accent/15",
      text: "text-accent",
      border: "border-accent/40",
      dot: "bg-accent",
    };
  }
  if (score >= 70) {
    return {
      label: "Standard Compliant",
      bg: "bg-warning/15",
      text: "text-warning",
      border: "border-warning/40",
      dot: "bg-warning",
    };
  }
  if (score > 0) {
    return {
      label: "Requires Improvement",
      bg: "bg-danger/15",
      text: "text-danger",
      border: "border-danger/40",
      dot: "bg-danger",
    };
  }
  return {
    label: "Awaiting Assessment",
    bg: "bg-surface-raised",
    text: "text-text-muted",
    border: "border-border-strong",
    dot: "bg-text-muted",
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
        bg: "bg-accent/15",
        text: "text-accent",
        border: "border-accent/40",
        dot: "bg-accent",
      };
    case "UPLOADED_UNVERIFIED":
    case "UPLOADED":
      return {
        label: "Uploaded (Awaiting Audit)",
        bg: "bg-info/15",
        text: "text-info",
        border: "border-info/40",
        dot: "bg-info",
      };
    case "PENDING_REVIEW":
    case "PENDING_VERIFICATION":
      return {
        label: "Pending Verification",
        bg: "bg-warning/15",
        text: "text-warning",
        border: "border-warning/40",
        dot: "bg-warning",
      };
    case "EXPIRED":
    case "EXPIRED_EVIDENCE":
      return {
        label: "Expired Evidence",
        bg: "bg-danger/15",
        text: "text-danger",
        border: "border-danger/40",
        dot: "bg-danger",
      };
    case "MISSING_INFO":
    case "MISSING_EVIDENCE":
      return {
        label: "Missing Information",
        bg: "bg-danger/15",
        text: "text-danger",
        border: "border-danger/40",
        dot: "bg-danger",
      };
    case "REJECTED":
    case "REJECTED_EVIDENCE":
    case "ACTION_REQUIRED":
      return {
        label: "Action Required / Rejected",
        bg: "bg-danger/15",
        text: "text-danger",
        border: "border-danger/40",
        dot: "bg-danger",
      };
    case "SELF_REPORTED":
    case "UNVERIFIED":
    default:
      return {
        label: "Self-Reported Claim",
        bg: "bg-surface-raised",
        text: "text-text-muted",
        border: "border-border-strong",
        dot: "bg-text-muted",
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

