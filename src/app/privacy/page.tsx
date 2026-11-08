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
      <section className="bg-white border-b border-[#E7E7DE] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#143D2B] font-semibold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B] bg-[#F0F6F2] px-2.5 py-1 rounded border border-[#B8D4C2]">
              Data Protection & Privacy
            </span>
            <span className="text-xs text-[#868A85]">Digital Personal Data Protection (DPDP) Act Aligned</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#161815] tracking-tight">
            Privacy Policy & Data Redaction Protocol
          </h1>
          <p className="text-sm text-[#5E635D] leading-relaxed">
            How KitchenProof protects consumer privacy, safeguards trade secrets, and sanitizes statutory audit documentation before public display.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-sm text-[#323631] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle">
          <div className="flex items-center gap-2 text-[#143D2B] font-semibold text-base">
            <EyeOff className="w-5 h-5 text-[#143D2B]" />
            <h2 className="text-xl font-serif font-bold text-[#161815]">
              1. Document Redaction & PII Protection
            </h2>
          </div>
          <p>
            Public transparency should never compromise individual personal privacy. When kitchen operators submit statutory certificates, our processing engine enforces strict redaction:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-[#5E635D]">
            <li>
              <strong className="text-[#161815]">Personal Identifiable Information (PII):</strong> Aadhaar numbers, PAN details, bank details, and personal mobile numbers of kitchen staff or individual proprietors are permanently redacted from publicly viewable documents.
            </li>
            <li>
              <strong className="text-[#161815]">Commercial Trade Secrets:</strong> Vendor pricing, ingredient formulations, supplier purchase orders, and proprietary recipes are never requested or stored.
            </li>
            <li>
              <strong className="text-[#161815]">Food Safety Supervisor Credentials:</strong> Only the supervisor name and verifiable FoSTaC certificate identification number are published for statutory verification.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle">
          <div className="flex items-center gap-2 text-[#143D2B] font-semibold text-base">
            <Lock className="w-5 h-5 text-[#143D2B]" />
            <h2 className="text-xl font-serif font-bold text-[#161815]">
              2. Consumer Whistleblower Protection
            </h2>
          </div>
          <p>
            When consumers submit hygiene concerns, photo evidence, or foreign-object sighting reports:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-[#5E635D]">
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
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-[#161815]">
            3. Data Retention & Erasure
          </h2>
          <p className="text-xs text-[#5E635D]">
            Inspection logs and test records are retained for a rolling period of three (3) statutory audit cycles (typically 36 months) to maintain historical compliance records. Upon permanent business cessation or cancellation of FSSAI registration, operators may request archival of their public transparency profile.
          </p>
        </section>
      </main>
    </div>
  );
}
