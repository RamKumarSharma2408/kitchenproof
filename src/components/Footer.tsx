import Link from "next/link";
import { ShieldCheck, HeartHandshake, FileText, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#143D2B] text-[#DCE9E0] border-t border-[#0F2E1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-xl font-bold font-serif text-white tracking-tight">
                KitchenProof
              </span>
            </div>
            <p className="text-xs text-[#B8D4C2] leading-relaxed">
              Know What&apos;s Cooking Behind Your Order. Bridging the information asymmetry in food delivery through independent, evidence-backed kitchen safety transparency.
            </p>
            <div className="pt-2 text-[11px] text-[#8CBA9D]">
              Operated under India-first food safety transparency protocols adhering to FSSAI Schedule 4 hygiene benchmarks.
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Explore & Understand
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8D4C2]">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Browse Kitchen Profiles
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Scoring Engine & Weights
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              For Food Businesses
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8D4C2]">
              <li>
                <Link href="/for-restaurants" className="hover:text-white transition-colors">
                  Claim Your Kitchen Profile
                </Link>
              </li>
              <li>
                <Link href="/for-restaurants#compliance-toolkit" className="hover:text-white transition-colors">
                  Hygiene Checklist & Toolkit
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Restaurant Owner Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Accredited Inspector Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust, Legal & Statutory Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Regulatory Disclosures
            </h4>
            <div className="space-y-3 text-[11px] text-[#8CBA9D] leading-relaxed">
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
        <div className="mt-12 pt-8 border-t border-[#1E4F32] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8CBA9D]">
          <p>© {new Date().getFullYear()} KitchenProof Technologies India. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about#terms" className="hover:text-white transition-colors">
              Terms of Transparency
            </Link>
            <Link href="/about#privacy" className="hover:text-white transition-colors">
              Data Privacy & Redaction
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Methodology v1.2
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

