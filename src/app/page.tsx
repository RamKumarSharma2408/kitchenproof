import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEMO_RESTAURANTS } from "@/lib/demoData";
import RestaurantCard from "@/components/RestaurantCard";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  FileCheck2,
  Thermometer,
  Sparkles,
  Bug,
  Award,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredRestaurants: any[] = [];
  try {
    featuredRestaurants = await prisma.restaurant.findMany({
      take: 3,
      orderBy: { safetyScore: "desc" },
    });
  } catch (e) {
    console.warn("HomePage falling back to verified demo data:", e);
  }

  if (!featuredRestaurants || featuredRestaurants.length === 0) {
    featuredRestaurants = DEMO_RESTAURANTS.slice(0, 3);
  }

  return (
    <div className="space-y-24 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-[#E7E7DE] bg-gradient-to-b from-[#F5F5F0]/60 via-[#FBFBF9] to-[#FBFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F6F2] border border-[#B8D4C2] text-xs font-semibold text-[#143D2B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#143D2B]" />
                <span>Independent Kitchen Safety Transparency Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#161815] tracking-tight leading-[1.12]">
                Your food has a rating. <br />
                <span className="text-[#143D2B] italic">But does your kitchen?</span>
              </h1>

              <p className="text-base sm:text-lg text-[#5E635D] leading-relaxed max-w-2xl font-normal">
                Food delivery apps show you appetizing photos, delivery minutes, and taste reviews. But consumers have had no convenient way to verify cold-chain logs, pest control contracts, water potability tests, or official hygiene audit results.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#143D2B] text-white font-semibold text-sm hover:bg-[#1F593F] shadow-card transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Verified Kitchens</span>
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-[#D0D0C3] text-[#161815] font-semibold text-sm hover:bg-[#F5F5F0] transition-colors"
                >
                  <span>How the Score Works</span>
                  <ArrowRight className="w-4 h-4 text-[#5E635D]" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E7E7DE] grid grid-cols-3 gap-4 text-xs text-[#5E635D]">
                <div>
                  <strong className="block text-lg font-serif font-black text-[#161815]">Audited</strong>
                  <span>Laboratory & Test Records</span>
                </div>
                <div>
                  <strong className="block text-lg font-serif font-black text-[#161815]">Codex &amp; FSSAI</strong>
                  <span>Hygiene Benchmarks</span>
                </div>
                <div>
                  <strong className="block text-lg font-serif font-black text-[#161815]">Zero</strong>
                  <span>Commercial Influence</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card (Comparison Graphic) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-[#E7E7DE] p-6 sm:p-8 shadow-elevated relative">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#868A85] mb-4">
                  The Delivery App vs. Kitchen Reality
                </div>

                {/* Simulated Delivery App Card */}
                <div className="rounded-xl border border-[#E7E7DE] p-4 bg-[#FBFBF9] mb-4 space-y-2 opacity-75">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#868A85]">Standard Delivery App View</span>
                    <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[11px]">
                      ★ 4.7 (2,100+ Reviews)
                    </span>
                  </div>
                  <p className="text-xs text-[#5E635D]">
                    &quot;Delicious butter chicken! Arrived in 24 mins hot and fresh.&quot;
                  </p>
                  <div className="text-[11px] text-[#B45309] flex items-center gap-1 font-medium pt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Kitchen location, water test status, and hygiene audit unstated.</span>
                  </div>
                </div>

                {/* KitchenProof Transparent View */}
                <div className="rounded-xl border-2 border-[#143D2B] p-4 bg-[#F0F6F2] space-y-3 shadow-subtle">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#143D2B]">
                      <ShieldCheck className="w-4 h-4 text-[#143D2B]" />
                      <span>KitchenProof Verified Profile</span>
                    </div>
                    <span className="bg-[#143D2B] text-white font-bold text-xs px-2 py-0.5 rounded">
                      92/100 Safety Index
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#323631]">
                    <div className="flex items-center justify-between py-1 border-b border-[#DCE9E0]">
                      <span className="text-[#5E635D]">Potable Water Test (IS 10500)</span>
                      <span className="font-semibold text-emerald-800">✓ Tested 18 Oct 2026</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#DCE9E0]">
                      <span className="text-[#5E635D]">Chiller Temp Control (≤4°C)</span>
                      <span className="font-semibold text-emerald-800">✓ Digital Log Active</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#DCE9E0]">
                      <span className="text-[#5E635D]">Pest Eradication Contract</span>
                      <span className="font-semibold text-emerald-800">✓ Rentokil Monthly</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#5E635D]">FoSTaC Food Safety Supervisor</span>
                      <span className="font-semibold text-emerald-800">✓ Certified On-Site</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#868A85] text-center mt-4">
                  KitchenProof provides public visibility into what goes on beyond the counter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE TRANSPARENCY PROBLEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
            The Information Asymmetry
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#161815] mt-2 tracking-tight">
            Why 5-star ratings don&apos;t tell you whether food was prepared safely.
          </h2>
          <p className="text-sm sm:text-base text-[#5E635D] mt-3 leading-relaxed">
            Consumer taste reviews measure portion sizes, flavor intensity, packaging aesthetics, and delivery speed. They cannot detect bacterial counts in rinse water, temperature dips in meat freezers, or unhygienic handler practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold">
              <Thermometer className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#161815]">Cold-Chain & Storage Gaps</h3>
            <p className="text-xs text-[#5E635D] leading-relaxed">
              When raw dairy, poultry, or batters are stored at ambient Indian kitchen temperatures (32°C+) due to power-saving or overloaded refrigeration, foodborne pathogens multiply exponentially without affecting cooked taste.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F0F6F2] text-[#143D2B] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#161815]">Water Potability Mystery</h3>
            <p className="text-xs text-[#5E635D] leading-relaxed">
              Restaurants use water for salad washing, dough kneading, and utensil sanitization. Without periodic IS 10500 microbiological testing, consumers have no way of knowing whether the water source is safe.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] text-[#991B1B] flex items-center justify-center font-bold">
              <Bug className="w-5 h-5 text-crimson-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#161815]">Ghost Kitchen Anonymity</h3>
            <p className="text-xs text-[#5E635D] leading-relaxed">
              Shared commercial cloud kitchens frequently operate dozens of virtual brands out of a single cramped preparation space. Customers have never seen the kitchen facility where their meal was cooked.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW KITCHENPROOF WORKS */}
      <section className="bg-[#F5F5F0]/80 py-16 sm:py-20 border-y border-[#E7E7DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
              The 4-Step Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#161815] mt-2 tracking-tight">
              How KitchenProof establishes trust.
            </h2>
            <p className="text-sm text-[#5E635D] mt-2">
              A transparent verification pipeline connecting diners, food businesses, and accredited safety inspectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="text-2xl font-black font-serif text-[#143D2B]">01</span>
              <h3 className="font-serif font-bold text-base text-[#161815]">Discover</h3>
              <p className="text-xs text-[#5E635D] leading-relaxed">
                Search any restaurant or delivery kitchen by name, locality, or cuisine across major Indian metropolitan areas.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-2xl font-black font-serif text-[#143D2B]">02</span>
              <h3 className="font-serif font-bold text-base text-[#161815]">Verify</h3>
              <p className="text-xs text-[#5E635D] leading-relaxed">
                Inspect physical audit reports, FSSAI display board registrations, and verified supplier certifications uploaded directly by food businesses.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-2xl font-black font-serif text-[#143D2B]">03</span>
              <h3 className="font-serif font-bold text-base text-[#161815]">Understand</h3>
              <p className="text-xs text-[#5E635D] leading-relaxed">
                View category-by-category score breakdowns: sanitation, temperature controls, food handler medical fitness, and pest management.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-2xl font-black font-serif text-[#143D2B]">04</span>
              <h3 className="font-serif font-bold text-base text-[#161815]">Decide</h3>
              <p className="text-xs text-[#5E635D] leading-relaxed">
                Order with confidence knowing exactly what standard of hygiene was maintained behind your meal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED KITCHEN PROFILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
              Verified Profiles
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#161815] mt-1 tracking-tight">
              Featured Kitchen Safety Audits
            </h2>
            <p className="text-xs text-[#5E635D] mt-1">
              Demonstration profiles with independently audited evidence and live scoring.
            </p>
          </div>

          <Link
            href="/explore"
            className="text-xs font-semibold text-[#143D2B] hover:underline flex items-center gap-1"
          >
            <span>Explore all kitchens</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 5. EXPLAINABLE SCORING ENGINE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#143D2B] text-white rounded-2xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Transparent Methodology v2.0
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
                No black-box algorithms. <br />
                Every point is tied to verified evidence.
              </h2>
              <p className="text-sm text-[#DCE9E0] leading-relaxed max-w-xl">
                KitchenProof does not generate random scores. The 100-point Kitchen Safety Index is mathematically computed across five weighted categories. Unverified claims and expired logs deplete evidence completeness.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div className="bg-[#1F593F]/50 border border-emerald-700/60 p-3 rounded-lg">
                  <strong className="block text-white font-serif text-lg">25%</strong>
                  <span className="text-[#B8D4C2]">Hygiene & Sanitation</span>
                </div>
                <div className="bg-[#1F593F]/50 border border-emerald-700/60 p-3 rounded-lg">
                  <strong className="block text-white font-serif text-lg">25%</strong>
                  <span className="text-[#B8D4C2]">Food Handling & PPE</span>
                </div>
                <div className="bg-[#1F593F]/50 border border-emerald-700/60 p-3 rounded-lg">
                  <strong className="block text-white font-serif text-lg">20%</strong>
                  <span className="text-[#B8D4C2]">FSSAI Compliance</span>
                </div>
                <div className="bg-[#1F593F]/50 border border-emerald-700/60 p-3 rounded-lg">
                  <strong className="block text-white font-serif text-lg">15%</strong>
                  <span className="text-[#B8D4C2]">Pest Management</span>
                </div>
                <div className="bg-[#1F593F]/50 border border-emerald-700/60 p-3 rounded-lg">
                  <strong className="block text-white font-serif text-lg">15%</strong>
                  <span className="text-[#B8D4C2]">Cold Chain (≤4°C)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-[#0F2E1D] border border-emerald-800 rounded-xl p-6 w-full max-w-md space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-emerald-900 pb-3 flex items-center justify-between">
                  <span>Audit Evidence Standards</span>
                  <span className="text-[10px] text-emerald-400">IS 10500 Compliant</span>
                </h3>

                <ul className="space-y-2.5 text-xs text-[#DCE9E0]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>NABL-accredited water test required every 6 months.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Food handler medical fitness (Form IX) renewed annually.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Refrigeration logged twice daily with calibrated probes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Frying oil total polar compounds (TPC) monitored below 25%.</span>
                  </li>
                </ul>

                <Link
                  href="/methodology"
                  className="block text-center w-full py-2.5 bg-white text-[#143D2B] rounded-lg text-xs font-semibold hover:bg-[#F0F6F2] transition-colors"
                >
                  Read Full Scoring Methodology v2.0 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ & STATUTORY DISCLOSURES */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
            Clarity & Transparency
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#161815] mt-1 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E7E7DE] p-6 shadow-subtle">
            <h3 className="font-serif font-bold text-base text-[#161815]">
              Is KitchenProof an official government inspection portal?
            </h3>
            <p className="text-xs text-[#5E635D] mt-2 leading-relaxed">
              No. KitchenProof is an independent consumer transparency platform. Statutory food safety licensing and regulatory enforcement in India are conducted exclusively by the Food Safety and Standards Authority of India (FSSAI) and designated State Food Safety Officers. KitchenProof acts as an open index aggregating verified documentation, third-party accredited audits, and business transparency data for consumer decision-making.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E7E7DE] p-6 shadow-subtle">
            <h3 className="font-serif font-bold text-base text-[#161815]">
              Can restaurants pay KitchenProof to increase their safety score?
            </h3>
            <p className="text-xs text-[#5E635D] mt-2 leading-relaxed">
              Never. The safety scoring algorithm is deterministic and open-source. Scores are calculated solely from verified evidence (valid FSSAI licenses, NABL lab test results, temperature charts, and inspection findings). Paying for score upgrades is strictly prohibited by our charter.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E7E7DE] p-6 shadow-subtle">
            <h3 className="font-serif font-bold text-base text-[#161815]">
              What happens if a restaurant has not submitted documentation?
            </h3>
            <p className="text-xs text-[#5E635D] mt-2 leading-relaxed">
              Restaurants with unverified or self-reported profiles are explicitly marked as &quot;Unverified / Self-Reported&quot; with a low Data Confidence rating. Missing documentation is never assumed to be safe, nor does KitchenProof fabricate violation records without evidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

