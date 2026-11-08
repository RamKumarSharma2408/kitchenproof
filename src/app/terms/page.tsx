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
              Legal & Transparency Standards
            </span>
            <span className="text-xs text-[#868A85]">Methodology v2.0 • November 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#161815] tracking-tight">
            Terms of Use & Transparency Standards
          </h1>
          <p className="text-sm text-[#5E635D] leading-relaxed">
            These terms define the operating principles, consumer protections, and operator rights governing KitchenProof™ — an independent food safety transparency initiative.
          </p>
        </div>
      </section>

      {/* Body Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-sm text-[#323631] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-[#161815]">
            1. Platform Nature & Statutory Independence
          </h2>
          <p>
            KitchenProof is an independent consumer transparency ecosystem benchmarked to Codex Alimentarius hygiene principles and FSSAI Schedule 4 sanitary standards. 
          </p>
          <div className="bg-[#F5F5F0] p-4 rounded-lg text-xs text-[#5E635D] border border-[#E7E7DE] space-y-1">
            <strong>Important Regulatory Demarcation:</strong> KitchenProof is <em>not</em> a statutory food safety authority, government enforcement agency, or licensing body. The issuance, suspension, or cancellation of statutory food business licenses remains under the exclusive jurisdiction of the Food Safety and Standards Authority of India (FSSAI) and respective State Food Safety Commissioners.
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-[#161815]">
            2. Evidentiary Tiers & Data Provenance
          </h2>
          <p>
            Every data point displayed on KitchenProof is classified into explicit evidentiary tiers:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-[#5E635D]">
            <li>
              <strong className="text-[#161815]">Independently Verified:</strong> Backed by physical inspection logs or test certificates issued by NABL-accredited testing laboratories and certified food safety auditors.
            </li>
            <li>
              <strong className="text-[#161815]">Verified at Statutory Source:</strong> Verified directly against official government public registers (e.g., FoSCoS license validation).
            </li>
            <li>
              <strong className="text-[#161815]">Conditionally Verified / Expired:</strong> Previously valid records that have lapsed their statutory renewal window. Scores reflect automated mathematical expiry penalties.
            </li>
            <li>
              <strong className="text-[#161815]">Self-Reported Claims:</strong> Information declared by kitchen operators that has not undergone third-party validation. Capped and explicitly marked.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-[#161815]">
            3. Food Business Operator (FBO) Rights & Rectification
          </h2>
          <p>
            We believe transparency must be accompanied by due process. Kitchen operators possess the absolute right to:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-xs text-[#5E635D]">
            <li>
              <strong className="text-[#161815]">Submit Updated Records:</strong> Operators may upload renewal certificates, pest management logs, or NABL water reports at any time via the Operator Dashboard.
            </li>
            <li>
              <strong className="text-[#161815]">Dispute Inaccuracies:</strong> If an inspection note, license expiry date, or address is incorrect, operators can lodge a formal rectification request through our dedicated <Link href="/disputes" className="text-[#143D2B] underline font-semibold">Dispute & Rectification Portal</Link>.
            </li>
            <li>
              <strong className="text-[#161815]">Fast-Track Re-Inspection:</strong> Kitchens addressing critical non-compliances may request priority re-audit following verified remediation.
            </li>
          </ol>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle">
          <h2 className="text-xl font-serif font-bold text-[#161815]">
            4. Limitation of Liability
          </h2>
          <p className="text-xs text-[#5E635D]">
            KitchenProof publishes hygiene records on an &quot;as-verified-at-audit-date&quot; basis. Kitchen hygiene is an ongoing operational condition that can fluctuate daily. KitchenProof assumes no liability for immediate operational lapses occurring post-audit. Consumers are advised to exercise personal judgment and report observed infractions.
          </p>
        </section>
      </main>
    </div>
  );
}
