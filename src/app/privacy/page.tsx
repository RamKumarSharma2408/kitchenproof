import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Redaction Protocol | KitchenProof™",
  description: "Privacy policies governing consumer report confidentiality, kitchen operator trade secret protection, and PII redaction standards.",
};

export default function PrivacyPage() {
  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-surface border-b border-border-subtle py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-accent bg-surface-raised px-2.5 py-1 rounded border border-border-subtle">
              Data Protection &amp; Privacy
            </span>
            <span className="text-xs text-text-muted">Digital Personal Data Protection (DPDP) Act Aligned</span>
          </div>
          <h1 className="text-text-base">
            Privacy Policy &amp; Data Redaction Protocol
          </h1>
          <p className="text-sm text-text-muted leading-relaxed max-w-prose">
            How KitchenProof protects consumer privacy, safeguards trade secrets, and sanitizes statutory audit documentation before public display.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-sm text-text-base leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <div className="flex items-center gap-2 text-accent font-semibold text-base">
            <EyeOff className="w-5 h-5 text-accent" />
            <h2 className="text-text-base">
              1. Document Redaction &amp; PII Protection
            </h2>
          </div>
          <p className="max-w-prose text-text-muted">
            Public transparency should never compromise individual personal privacy. When kitchen operators submit statutory certificates, our processing engine enforces strict redaction:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-text-muted max-w-prose">
            <li>
              <strong className="text-text-base">Personal Identifiable Information (PII):</strong> Aadhaar numbers, PAN details, bank details, and personal mobile numbers of kitchen staff or individual proprietors are permanently redacted from publicly viewable documents.
            </li>
            <li>
              <strong className="text-text-base">Commercial Trade Secrets:</strong> Vendor pricing, ingredient formulations, supplier purchase orders, and proprietary recipes are never requested or stored.
            </li>
            <li>
              <strong className="text-text-base">Food Safety Supervisor Credentials:</strong> Only the supervisor name and verifiable FoSTaC certificate identification number are published for statutory verification.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <div className="flex items-center gap-2 text-accent font-semibold text-base">
            <Lock className="w-5 h-5 text-accent" />
            <h2 className="text-text-base">
              2. Consumer Whistleblower Protection
            </h2>
          </div>
          <p className="max-w-prose text-text-muted">
            When consumers submit hygiene concerns, photo evidence, or foreign-object sighting reports:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-text-muted max-w-prose">
            <li>
              Consumer email addresses and personal identity are encrypted and <strong>never revealed</strong> to restaurant owners or public viewers.
            </li>
            <li>
              Reports are reviewed by accredited food safety moderators before being forwarded to kitchen management for formal rectification.
            </li>
            <li>
              Frivolous, extortionary, or competitor-generated bad-faith reports are filtered through algorithmic heuristics and manual inspector review.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <h2 className="text-text-base">
            3. Data Retention &amp; Erasure
          </h2>
          <p className="text-xs text-text-muted max-w-prose">
            Inspection logs and test records are retained for a rolling period of three (3) statutory audit cycles (typically 36 months) to maintain historical compliance records. Upon permanent business cessation or cancellation of FSSAI registration, operators may request archival of their public transparency profile.
          </p>
        </section>
      </main>
    </div>
  );
}
