import Link from "next/link";
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Transparency & Service | KitchenProof™",
  description: "Terms governing kitchen safety transparency, operator rights, consumer disclosures, and independent verification benchmarks.",
};

export default function TermsPage() {
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
              Legal &amp; Transparency Standards
            </span>
            <span className="text-xs text-text-muted">Methodology v2.0 • November 2026</span>
          </div>
          <h1 className="text-text-base">
            Terms of Use &amp; Transparency Standards
          </h1>
          <p className="text-sm text-text-muted leading-relaxed max-w-prose">
            These terms define the operating principles, consumer protections, and operator rights governing KitchenProof™ — an independent food safety transparency initiative.
          </p>
        </div>
      </section>

      {/* Body Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-sm text-text-base leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <h2 className="text-text-base">
            1. Platform Nature &amp; Statutory Independence
          </h2>
          <p className="max-w-prose text-text-muted">
            KitchenProof is an independent consumer transparency ecosystem benchmarked to Codex Alimentarius hygiene principles and FSSAI Schedule 4 sanitary standards. 
          </p>
          <div className="bg-surface-raised p-4 rounded-lg text-xs text-text-muted border border-border-subtle space-y-1 max-w-prose">
            <strong className="text-text-base">Important Regulatory Demarcation:</strong> KitchenProof is <em>not</em> a statutory food safety authority, government enforcement agency, or licensing body. The issuance, suspension, or cancellation of statutory food business licenses remains under the exclusive jurisdiction of the Food Safety and Standards Authority of India (FSSAI) and respective State Food Safety Commissioners.
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <h2 className="text-text-base">
            2. Evidentiary Tiers &amp; Data Provenance
          </h2>
          <p className="max-w-prose text-text-muted">
            Every data point displayed on KitchenProof is classified into explicit evidentiary tiers:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-text-muted max-w-prose">
            <li>
              <strong className="text-text-base">Independently Verified:</strong> Backed by physical inspection logs or test certificates issued by NABL-accredited testing laboratories and certified food safety auditors.
            </li>
            <li>
              <strong className="text-text-base">Verified at Statutory Source:</strong> Verified directly against official government public registers (e.g., FoSCoS license validation).
            </li>
            <li>
              <strong className="text-text-base">Conditionally Verified / Expired:</strong> Previously valid records that have lapsed their statutory renewal window. Scores reflect automated mathematical expiry penalties.
            </li>
            <li>
              <strong className="text-text-base">Self-Reported Claims:</strong> Information declared by kitchen operators that has not undergone third-party validation. Capped and explicitly marked.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <h2 className="text-text-base">
            3. Food Business Operator (FBO) Rights &amp; Rectification
          </h2>
          <p className="max-w-prose text-text-muted">
            We believe transparency must be accompanied by due process. Kitchen operators possess the absolute right to:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-xs text-text-muted max-w-prose">
            <li>
              <strong className="text-text-base">Submit Updated Records:</strong> Operators may upload renewal certificates, pest management logs, or NABL water reports at any time via the Operator Dashboard.
            </li>
            <li>
              <strong className="text-text-base">Dispute Inaccuracies:</strong> If an inspection note, license expiry date, or address is incorrect, operators can lodge a formal rectification request through our dedicated <Link href="/disputes" className="text-accent underline font-semibold">Dispute &amp; Rectification Portal</Link>.
            </li>
            <li>
              <strong className="text-text-base">Fast-Track Re-Inspection:</strong> Kitchens addressing critical non-compliances may request priority re-audit following verified remediation.
            </li>
          </ol>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <h2 className="text-text-base">
            4. Limitation of Liability
          </h2>
          <p className="text-xs text-text-muted max-w-prose">
            KitchenProof publishes hygiene records on an &quot;as-verified-at-audit-date&quot; basis. Kitchen hygiene is an ongoing operational condition that can fluctuate daily. KitchenProof assumes no liability for immediate operational lapses occurring post-audit. Consumers are advised to exercise personal judgment and report observed infractions.
          </p>
        </section>
      </main>
    </div>
  );
}
