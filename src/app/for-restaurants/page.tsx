import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  Award,
  ArrowRight,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

export default function ForRestaurantsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* 1. Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F6F2] border border-[#B8D4C2] text-xs font-semibold text-[#143D2B]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Food Business Operator Program</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#161815] tracking-tight">
          Turn your kitchen hygiene into your greatest competitive advantage.
        </h1>
        <p className="text-base text-[#5E635D] leading-relaxed max-w-3xl">
          You invest in stainless-steel prep counters, commercial water purification, licensed pest control, and staff medical certifications. Don&apos;t let that investment remain invisible to delivery customers.
        </p>
        <div className="pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#143D2B] text-white font-semibold text-sm hover:bg-[#1F593F] transition-colors"
          >
            <span>Register Your Kitchen Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Value proposition cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E7E7DE] p-6 rounded-xl shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#F0F6F2] text-[#143D2B] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#161815]">Stand Out on Delivery Apps</h3>
          <p className="text-xs text-[#5E635D] leading-relaxed">
            Consumers are increasingly cautious about unhygienic cloud kitchens. A verified KitchenProof profile with a 90+ safety rating builds instant consumer trust.
          </p>
        </div>

        <div className="bg-white border border-[#E7E7DE] p-6 rounded-xl shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold">
            <ClipboardList className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#161815]">Free Compliance Vault</h3>
          <p className="text-xs text-[#5E635D] leading-relaxed">
            Track water test renewals, FSSAI licence expiries, and staff Form IX medical health certificates in one centralized dashboard with automated alerts.
          </p>
        </div>

        <div className="bg-white border border-[#E7E7DE] p-6 rounded-xl shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#F0F6F2] text-[#143D2B] flex items-center justify-center font-bold">
            <Award className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#161815]">Accredited Audit Recognition</h3>
          <p className="text-xs text-[#5E635D] leading-relaxed">
            Upload genuine audit reports conducted by FSSAI-recognized hygiene rating agencies and showcase verified 4 or 5 smiles on your public profile.
          </p>
        </div>
      </div>

      {/* 3. Self-Audit Checklist */}
      <div id="compliance-toolkit" className="bg-white border border-[#E7E7DE] rounded-xl p-8 shadow-subtle space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#143D2B]">
            Self-Audit Toolkit
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#161815] mt-1">
            Mandatory Documents for Verification
          </h2>
          <p className="text-xs text-[#5E635D] mt-1">
            Ensure your kitchen has the following documentation ready prior to requesting verification:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE] space-y-1">
            <strong className="text-[#161815] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Valid FSSAI Registration / State License
            </strong>
            <p className="text-[#5E635D] pl-6">
              Active certificate issued through FoSCoS portal with minimum 60 days remaining validity.
            </p>
          </div>

          <div className="p-4 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE] space-y-1">
            <strong className="text-[#161815] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Potable Water Analysis Report (IS 10500)
            </strong>
            <p className="text-[#5E635D] pl-6">
              Microbiological and chemical analysis from an accredited laboratory dated within the last 6 months.
            </p>
          </div>

          <div className="p-4 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE] space-y-1">
            <strong className="text-[#161815] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Annual Medical Fitness Certificates (Form IX)
            </strong>
            <p className="text-[#5E635D] pl-6">
              Medical exam certificates for all food handlers confirming freedom from communicable disease.
            </p>
          </div>

          <div className="p-4 bg-[#FBFBF9] rounded-lg border border-[#E7E7DE] space-y-1">
            <strong className="text-[#161815] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Monthly Pest Eradication Service Records
            </strong>
            <p className="text-[#5E635D] pl-6">
              Service contracts and chemical application logs from a licensed pest control operator.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#143D2B] text-white p-8 sm:p-12 rounded-2xl text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold">
          Ready to showcase your kitchen&apos;s standards?
        </h2>
        <p className="text-xs sm:text-sm text-[#DCE9E0] max-w-xl mx-auto">
          Create your free restaurant operator account, manage compliance records, and request an independent verification inspection today.
        </p>
        <div className="pt-2">
          <Link
            href="/register?role=RESTAURANT_OWNER"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#143D2B] font-semibold text-xs hover:bg-[#F0F6F2] transition-colors"
          >
            <span>Claim Your Restaurant Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

