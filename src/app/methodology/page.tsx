import Link from "next/link";
import { ShieldCheck, Award, AlertTriangle, CheckCircle2, ArrowLeft, Info, HelpCircle } from "lucide-react";
import { SCORING_CATEGORIES } from "@/lib/scoring";

export const metadata = {
  title: "Scoring Methodology v2.0 | KitchenProof™",
  description: "Mathematical formulation, category weight distribution, critical control gates, and evidence completeness standards for KitchenProof™.",
};

export default function MethodologyPage() {
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
              Methodology Specification
            </span>
            <span className="text-xs text-text-muted">Version 2.0.0 • Released November 2026</span>
          </div>
          <h1 className="text-text-base">
            Kitchen Safety Scoring Engine Methodology
          </h1>
          <p className="text-sm text-text-muted leading-relaxed max-w-prose">
            A transparent, deterministic mathematical framework for quantifying physical commercial kitchen hygiene, grounded in Codex Alimentarius principles and FSSAI Schedule 4 statutory benchmarks.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-sm text-text-base leading-relaxed">
        {/* Section 1: The 5 Weighted Categories */}
        <section className="space-y-4 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <div>
            <h2 className="text-text-base">
              1. Five Statutory Weight Categories (Sum = 100%)
            </h2>
            <p className="text-xs text-text-muted mt-1 max-w-prose">
              Safety scores are computed as the sum of weighted category contributions:
              <br />
              <code className="text-accent font-mono font-semibold">
                Overall Safety Score = Σ (Category Score × Category Weight %)
              </code>
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {Object.values(SCORING_CATEGORIES).map((cat) => (
              <div
                key={cat.key}
                className="p-4 rounded-lg bg-surface-raised border border-border-subtle space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <strong className="text-sm font-serif font-bold text-text-base">
                    {cat.name}
                  </strong>
                  <span className="text-xs font-bold text-accent bg-surface px-2.5 py-0.5 rounded border border-border-subtle">
                    Weight: {cat.weightPercent}%
                  </span>
                </div>
                <p className="text-xs text-text-muted max-w-prose">{cat.description}</p>
                <div className="text-[11px] text-text-muted border-t border-border-subtle pt-2">
                  <strong>Statutory Basis:</strong> {cat.statutoryBasis}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Critical Control Gates */}
        <section className="space-y-4 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h2 className="text-text-base">
                2. Critical Control Gates (Threshold Caps)
              </h2>
            </div>
            <p className="text-xs text-text-muted mt-1 max-w-prose">
              A high score in four categories cannot compensate for a lethal failure in a fifth. When any Critical Control Gate is breached, the overall score is mathematically capped:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-lg bg-surface-raised border border-danger/30 space-y-1">
              <strong className="text-danger block font-semibold">
                Missing Statutory Food License
              </strong>
              <p className="text-text-muted">
                Score capped at <strong className="text-text-base">40/100 (Fail)</strong>. 1 Smile rating max. Status becomes <code>ACTION_REQUIRED</code>.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-raised border border-danger/30 space-y-1">
              <strong className="text-danger block font-semibold">
                Active Pest Infestation
              </strong>
              <p className="text-text-muted">
                Score capped at <strong className="text-text-base">45/100 (Fail)</strong>. Live cockroach or rodent activity voids hygiene passing grade.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-raised border border-danger/30 space-y-1">
              <strong className="text-danger block font-semibold">
                Non-Potable Water Supply
              </strong>
              <p className="text-text-muted">
                Score capped at <strong className="text-text-base">40/100 (Fail)</strong>. Coliform contamination or failed IS 10500 test triggers immediate cap.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-raised border border-danger/30 space-y-1">
              <strong className="text-danger block font-semibold">
                Severe Cold Chain Failure
              </strong>
              <p className="text-text-muted">
                Score capped at <strong className="text-text-base">45/100 (Fail)</strong>. Walk-in chiller temperature &gt; 10°C triggers bacterial danger cap.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Evidence Completeness vs AI Confidence */}
        <section className="space-y-4 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <h2 className="text-text-base">
            3. Evidence Completeness Metric
          </h2>
          <p className="text-xs text-text-muted leading-relaxed max-w-prose">
            Unlike opaque &quot;AI confidence scores&quot;, KitchenProof&apos;s <strong>Evidence Completeness</strong> is a deterministic audit metric representing the exact percentage of required statutory items validated by third-party evidence:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-border-subtle">
              <thead className="bg-surface-raised text-text-base font-semibold border-b border-border-subtle">
                <tr>
                  <th className="p-3">Evidence State</th>
                  <th className="p-3">Completeness Credit</th>
                  <th className="p-3">Score Ceiling</th>
                  <th className="p-3">Verification Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-text-base">
                <tr>
                  <td className="p-3 font-semibold text-accent">Independently Verified (NABL/Auditor)</td>
                  <td className="p-3">100%</td>
                  <td className="p-3">100 pts</td>
                  <td className="p-3 font-medium">Fully Verified</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-accent">Verified at Statutory Source (FoSCoS)</td>
                  <td className="p-3">95%</td>
                  <td className="p-3">100 pts</td>
                  <td className="p-3 font-medium">Fully Verified</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-warning">Expired Audit Evidence</td>
                  <td className="p-3">20%</td>
                  <td className="p-3">Capped at 25 pts</td>
                  <td className="p-3 font-medium">Conditionally Verified / Expired</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-warning">Operator Uploaded (Unreviewed)</td>
                  <td className="p-3">35%</td>
                  <td className="p-3">Capped at 30 pts</td>
                  <td className="p-3 font-medium">Self-Reported</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-text-muted">Missing / No Documentation</td>
                  <td className="p-3">0%</td>
                  <td className="p-3">0 pts</td>
                  <td className="p-3 font-medium">Unverified</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Performance Bands */}
        <section className="space-y-4 bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle">
          <h2 className="text-text-base">
            4. Five Standard Performance Bands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-3 bg-surface-raised border border-accent/30 rounded-lg">
              <span className="font-bold text-accent block text-sm">85 - 100</span>
              <strong className="text-text-base block mt-1">Excellent</strong>
              <span className="text-[10px] text-accent font-sans">5 Smiles</span>
            </div>
            <div className="p-3 bg-surface-raised border border-accent/20 rounded-lg">
              <span className="font-bold text-accent block text-sm">70 - 84</span>
              <strong className="text-text-base block mt-1">Good</strong>
              <span className="text-[10px] text-accent font-sans">4 Smiles</span>
            </div>
            <div className="p-3 bg-surface-raised border border-warning/30 rounded-lg">
              <span className="font-bold text-warning block text-sm">55 - 69</span>
              <strong className="text-text-base block mt-1">Moderate</strong>
              <span className="text-[10px] text-warning font-sans">3 Smiles</span>
            </div>
            <div className="p-3 bg-surface-raised border border-warning/40 rounded-lg">
              <span className="font-bold text-warning block text-sm">40 - 54</span>
              <strong className="text-text-base block mt-1">Needs Work</strong>
              <span className="text-[10px] text-warning font-sans">2 Smiles</span>
            </div>
            <div className="p-3 bg-surface-raised border border-danger/30 rounded-lg">
              <span className="font-bold text-danger block text-sm">&lt; 40</span>
              <strong className="text-text-base block mt-1">Critical Risk</strong>
              <span className="text-[10px] text-danger font-sans">1 Smile</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
