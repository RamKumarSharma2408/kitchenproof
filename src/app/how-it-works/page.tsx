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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F6F2] border border-[#B8D4C2] text-xs font-semibold text-[#143D2B]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>KitchenProof Methodology Whitepaper v1.2</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#161815] tracking-tight">
          How the Kitchen Safety Score is Calculated
        </h1>
        <p className="text-base text-[#5E635D] leading-relaxed max-w-3xl">
          Unlike subjective consumer taste reviews, the KitchenProof Safety Index is an explainable, deterministic composite score. Every point awarded or deducted is mapped to physical verification evidence, regulatory licenses, and documented hygiene parameters.
        </p>
      </div>

      {/* 2. Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-3">
          <span className="text-2xl font-serif font-black text-[#143D2B]">01</span>
          <h3 className="font-serif font-bold text-base text-[#161815]">Evidence-Weighted Scoring</h3>
          <p className="text-xs text-[#5E635D] leading-relaxed">
            Scores are derived from 5 weighted categories based on FSSAI Schedule 4 sanitary guidelines and international HACCP standards.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-3">
          <span className="text-2xl font-serif font-black text-[#143D2B]">02</span>
          <h3 className="font-serif font-bold text-base text-[#161815]">Separate Confidence Gauge</h3>
          <p className="text-xs text-[#5E635D] leading-relaxed">
            A kitchen cannot artificially score 100/100 by submitting one clean photo. Incomplete or expired records automatically reduce the Data Confidence score.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#E7E7DE] rounded-xl shadow-subtle space-y-3">
          <span className="text-2xl font-serif font-black text-[#143D2B]">03</span>
          <h3 className="font-serif font-bold text-base text-[#161815]">Audit Integrity Charter</h3>
          <p className="text-xs text-[#5E635D] leading-relaxed">
            Restaurant owners cannot self-certify compliance. Official verification badges require accredited third-party inspector audits.
          </p>
        </div>
      </div>

      {/* 3. The 5 Weighted Categories Table */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
            Mathematical Weights
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#161815] mt-1">
            Category Breakdown & Statutory Criteria
          </h2>
        </div>

        <div className="space-y-6">
          {Object.values(SCORING_CATEGORIES).map((cat) => (
            <div
              key={cat.key}
              className="bg-white rounded-xl border border-[#E7E7DE] p-6 sm:p-8 shadow-subtle space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E7DE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F0F6F2] text-[#143D2B] flex items-center justify-center font-bold">
                    {cat.weightPercent}%
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#161815]">{cat.name}</h3>
                    <span className="text-[11px] text-[#5D9C75] font-semibold">
                      Statutory Basis: {cat.statutoryBasis}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F5F5F0] text-[#323631]">
                  Weight: {cat.weightPercent} Points Max
                </span>
              </div>

              <p className="text-xs text-[#5E635D] leading-relaxed">{cat.description}</p>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#161815] mb-2">
                  Verification Audit Checklist:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#323631]">
                  {cat.defaultCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#FBFBF9] p-2.5 rounded border border-[#E7E7DE]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
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
      <div className="bg-[#F5F5F0] rounded-xl p-8 border border-[#E7E7DE] space-y-6">
        <h2 className="text-xl font-serif font-bold text-[#161815]">
          Understanding Verification Statuses
        </h2>
        <p className="text-xs text-[#5E635D] leading-relaxed">
          KitchenProof clearly distinguishes between authenticated inspection records and unverified declarations. Never assume an unverified kitchen is certified.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white rounded-lg border border-brand-200 space-y-1.5">
            <strong className="text-brand-900 block font-semibold text-sm">
              ✓ Independently Verified (85–100 Score)
            </strong>
            <p className="text-[#5E635D]">
              Physical on-site audit completed within the past 180 days. All statutory documents (water tests, medical forms, pest control logs) validated by an accredited auditor.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-amber-200 space-y-1.5">
            <strong className="text-amber-900 block font-semibold text-sm">
              ⏳ Verification Pending (Review in Progress)
            </strong>
            <p className="text-[#5E635D]">
              Documentation has been submitted by the restaurant owner and is queued for auditor review and scheduled physical inspection.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-crimson-200 space-y-1.5">
            <strong className="text-crimson-900 block font-semibold text-sm">
              ⚠ Action Required / Non-Compliance Flagged
            </strong>
            <p className="text-[#5E635D]">
              Critical hygiene or temperature violation detected during audit, or mandatory statutory license has lapsed without verified renewal.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-charcoal-200 space-y-1.5">
            <strong className="text-charcoal-800 block font-semibold text-sm">
              ○ Unverified / Self-Reported
            </strong>
            <p className="text-[#5E635D]">
              Business details exist on public registries or were self-reported, but no independent audit evidence has been validated. Data confidence remains low.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-8 border-t border-[#E7E7DE]">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#143D2B] text-white font-semibold text-sm hover:bg-[#1F593F] transition-colors"
        >
          <span>Explore Verified Kitchens</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

