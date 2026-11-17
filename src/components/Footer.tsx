import Link from "next/link";
import { ShieldCheck, HeartHandshake, FileText, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] text-[var(--text)] border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group" aria-label="KitchenProof Homepage">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-strong)] text-accent flex items-center justify-center font-bold group-hover:border-accent transition-colors">
                <svg viewBox="0 0 32 32" className="w-4 h-4 text-accent" fill="none" aria-hidden="true">
                  <path d="M11 7.5L15 11.5L23 3" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 21.5C5 13 10 9.5 16 9.5C22 9.5 27 13 27 21.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M3.5 21.5H28.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="16" cy="15.5" r="1.25" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-xl font-bold font-serif text-[var(--text)] tracking-tight group-hover:text-accent transition-colors">
                KitchenProof
              </span>
            </Link>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Know What&apos;s Cooking Behind Your Order. Bridging the information asymmetry in food delivery through independent, evidence-backed kitchen safety transparency.
            </p>
            <div className="pt-2 text-[11px] text-[var(--text-muted)]">
              Operated under India-first food safety transparency protocols adhering to FSSAI Schedule 4 hygiene benchmarks.
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-4">
              Explore &amp; Understand
            </h2>
            <ul className="space-y-2.5 text-xs text-[var(--text-muted)]">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Browse Kitchen Profiles
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Scoring Engine &amp; Weights
                </Link>
              </li>
              <li>
                <Link href="/explore?status=VERIFIED" className="hover:text-white transition-colors">
                  Verified Exemplary Kitchens
                </Link>
              </li>
              <li>
                <Link href="/about#fssai-alignment" className="hover:text-white transition-colors">
                  FSSAI Hygiene Scheme Alignment
                </Link>
              </li>
            </ul>
          </div>

          {/* For Restaurants & Industry */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-4">
              For Food Businesses
            </h2>
            <ul className="space-y-2.5 text-xs text-[var(--text-muted)]">
              <li>
                <Link href="/for-restaurants" className="hover:text-white transition-colors">
                  Claim Your Kitchen Profile
                </Link>
              </li>
              <li>
                <Link href="/disputes" className="hover:text-white transition-colors">
                  Operator Dispute &amp; Rectification Portal
                </Link>
              </li>
              <li>
                <Link href="/for-restaurants#compliance-toolkit" className="hover:text-white transition-colors">
                  Hygiene Checklist &amp; Toolkit
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Operator Login &amp; Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust, Legal & Statutory Disclaimer */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-4">
              Regulatory Disclosures
            </h2>
            <div className="space-y-3 text-[11px] text-[var(--text-muted)] leading-relaxed">
              <p>
                KitchenProof is an independent consumer transparency ecosystem. We are neither a government agency nor a substitute for statutory inspections conducted by the Food Safety and Standards Authority of India (FSSAI) or state health authorities.
              </p>
              <p>
                All data presented is sourced from authenticated business documentation, accredited auditor reports, and public registers. Unverified claims are explicitly demarcated.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} KitchenProof Technologies India. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Transparency
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Data Privacy &amp; Redaction
            </Link>
            <Link href="/methodology" className="hover:text-white transition-colors">
              Methodology v2.0
            </Link>
            <Link href="/disputes" className="hover:text-white transition-colors">
              Disputes Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
