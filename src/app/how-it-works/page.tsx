import Link from "next/link";
import { SCORING_CATEGORIES } from "@/lib/scoring";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Droplet,
  Thermometer,
  Bug,
  Award,
  Sparkles,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* 1. Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-xs font-semibold text-accent">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>KitchenProof Methodology Whitepaper v1.2</span>
        </div>
        <h1 className="text-text-base">
          How the Kitchen Safety Score is Calculated
        </h1>
        <p className="text-base text-text-muted leading-relaxed max-w-prose">
          Unlike subjective consumer taste reviews, the KitchenProof Safety Index is an explainable, deterministic composite score. Every point awarded or deducted is mapped to physical verification evidence, regulatory licenses, and documented hygiene parameters.
        </p>
      </div>

      {/* 2. Core Pillars */}
      <div className="space-y-6">
        <h2 className="text-text-base">Core Evaluation Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface border border-border-subtle rounded-xl shadow-subtle space-y-3">
            <span className="text-2xl font-serif font-black text-accent">01</span>
            <h3 className="text-text-base">Evidence-Weighted Scoring</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-prose">
              Scores are derived from 5 weighted categories based on FSSAI Schedule 4 sanitary guidelines and international HACCP standards.
            </p>
          </div>

          <div className="p-6 bg-surface border border-border-subtle rounded-xl shadow-subtle space-y-3">
            <span className="text-2xl font-serif font-black text-accent">02</span>
            <h3 className="text-text-base">Separate Confidence Gauge</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-prose">
              A kitchen cannot artificially score 100/100 by submitting one clean photo. Incomplete or expired records automatically reduce the Data Confidence score.
            </p>
          </div>

          <div className="p-6 bg-surface border border-border-subtle rounded-xl shadow-subtle space-y-3">
            <span className="text-2xl font-serif font-black text-accent">03</span>
            <h3 className="text-text-base">Audit Integrity Charter</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-prose">
              Restaurant owners cannot self-certify compliance. Official verification badges require accredited third-party inspector audits.
            </p>
          </div>
        </div>
      </div>

      {/* 3. The 5 Weighted Categories Table */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-accent">
            Mathematical Weights
          </span>
          <h2 className="text-text-base mt-1">
            Category Breakdown &amp; Statutory Criteria
          </h2>
        </div>

        <div className="space-y-6">
          {Object.values(SCORING_CATEGORIES).map((cat) => (
            <div
              key={cat.key}
              className="bg-surface rounded-xl border border-border-subtle p-6 sm:p-8 shadow-subtle space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-raised text-accent flex items-center justify-center font-bold">
                    {cat.weightPercent}%
                  </div>
                  <div>
                    <h3 className="text-text-base">{cat.name}</h3>
                    <span className="text-[11px] text-accent font-semibold font-sans">
                      Statutory Basis: {cat.statutoryBasis}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface-raised text-text-base border border-border-subtle">
                  Weight: {cat.weightPercent} Points Max
                </span>
              </div>

              <p className="text-xs text-text-muted leading-relaxed max-w-prose">{cat.description}</p>

              <div>
                <h4 className="text-xs font-semibold tracking-wider text-text-base mb-2">
                  Verification Audit Checklist:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-base">
                  {cat.defaultCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-surface-raised p-2.5 rounded border border-border-subtle">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Distinction Between Statuses */}
      <div className="bg-surface-raised rounded-xl p-8 border border-border-subtle space-y-6">
        <h2 className="text-text-base">
          Understanding Verification Statuses
        </h2>
        <p className="text-xs text-text-muted leading-relaxed max-w-prose">
          KitchenProof clearly distinguishes between authenticated inspection records and unverified declarations. Never assume an unverified kitchen is certified.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-surface rounded-lg border border-accent/30 space-y-1.5">
            <strong className="text-accent block font-semibold text-sm">
              ✓ Independently Verified (85–100 Score)
            </strong>
            <p className="text-text-muted max-w-prose">
              Physical on-site audit completed within the past 180 days. All statutory documents (water tests, medical forms, pest control logs) validated by an accredited auditor.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-lg border border-warning/30 space-y-1.5">
            <strong className="text-warning block font-semibold text-sm">
              ⏳ Verification Pending (Review in Progress)
            </strong>
            <p className="text-text-muted max-w-prose">
              Documentation has been submitted by the restaurant owner and is queued for auditor review and scheduled physical inspection.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-lg border border-danger/30 space-y-1.5">
            <strong className="text-danger block font-semibold text-sm">
              ⚠ Action Required / Non-Compliance Flagged
            </strong>
            <p className="text-text-muted max-w-prose">
              Critical hygiene or temperature violation detected during audit, or mandatory statutory license has lapsed without verified renewal.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-lg border border-border-subtle space-y-1.5">
            <strong className="text-text-base block font-semibold text-sm">
              ○ Unverified / Self-Reported
            </strong>
            <p className="text-text-muted max-w-prose">
              Business details exist on public registries or were self-reported, but no independent audit evidence has been validated. Data confidence remains low.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-8 border-t border-border-subtle">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-strong transition-colors"
        >
          <span>Explore Verified Kitchens</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
