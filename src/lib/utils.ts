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
} {
  switch (status) {
    case "VERIFIED":
      return {
        label: "Independently Verified",
        bg: "bg-brand-50",
        text: "text-brand-900",
        border: "border-brand-300",
      };
    case "PENDING_REVIEW":
      return {
        label: "Verification Pending",
        bg: "bg-amber-50",
        text: "text-amber-900",
        border: "border-amber-300",
      };
    case "EXPIRED":
      return {
        label: "Inspection Expired",
        bg: "bg-crimson-50",
        text: "text-crimson-900",
        border: "border-crimson-300",
      };
    case "ACTION_REQUIRED":
      return {
        label: "Action Required",
        bg: "bg-crimson-50",
        text: "text-crimson-900",
        border: "border-crimson-300",
      };
    case "UNVERIFIED":
    default:
      return {
        label: "Unverified / Self-Reported",
        bg: "bg-charcoal-100",
        text: "text-charcoal-800",
        border: "border-charcoal-300",
      };
  }
}
