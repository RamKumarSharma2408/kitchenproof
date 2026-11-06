import Link from "next/link";
import { ShieldCheck, HeartHandshake, Eye, Award, AlertCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* 1. Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F6F2] border border-[#B8D4C2] text-xs font-semibold text-[#143D2B]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>About KitchenProof</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#161815] tracking-tight">
          Transparency in Every Order.
        </h1>
        <p className="text-base text-[#5E635D] leading-relaxed">
          KitchenProof was built to solve a critical information asymmetry in the modern food delivery ecosystem. We believe that consumers deserve to know the hygienic conditions of the kitchens preparing their meals before placing an order.
        </p>
      </div>

      {/* 2. Core Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#161815]">Our Charter of Transparency</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E7E7DE] p-6 rounded-xl shadow-subtle space-y-2">
            <h3 className="font-serif font-bold text-base text-[#161815] flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-700" />
              Evidence Over Claims
            </h3>
            <p className="text-xs text-[#5E635D] leading-relaxed">
              We never take claims at face value. A restaurant cannot be marked as &quot;Verified&quot; on self-declaration alone. Every score must be grounded in authenticated physical evidence.
            </p>
          </div>

          <div className="bg-white border border-[#E7E7DE] p-6 rounded-xl shadow-subtle space-y-2">
            <h3 className="font-serif font-bold text-base text-[#161815] flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-700" />
              Zero Commercial Influence
            </h3>
            <p className="text-xs text-[#5E635D] leading-relaxed">
              KitchenProof does not sell score upgrades, sponsored hygiene badges, or rating suppression services. Our scoring engine is deterministic, explainable, and neutral.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Statutory & FSSAI Relationship */}
      <div id="fssai-alignment" className="bg-[#F5F5F0] border border-[#E7E7DE] p-8 rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#143D2B] uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          <span>Statutory & Regulatory Relationship Disclosure</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-[#161815]">
          Alignment with the Food Safety and Standards Act (2006)
        </h3>
        <p className="text-xs text-[#5E635D] leading-relaxed">
          KitchenProof is an independent consumer technology platform. We are <strong>not</strong> a government body, nor are we an enforcement wing of the Food Safety and Standards Authority of India (FSSAI).
        </p>
        <p className="text-xs text-[#5E635D] leading-relaxed">
          Our scoring methodology benchmarks are built directly from FSSAI Schedule 4 (General Hygienic and Sanitary Practices), the FoSTaC supervisor guidelines, and IS 10500 potable water standards. We aggregate public registry records, business-provided laboratory certificates, and independent third-party audits to provide public transparency.
        </p>
        <p className="text-xs text-[#868A85]">
          Statutory inspection, seizure, prosecution, and regulatory suspension of food business licenses remain solely under the authority of designated State Food Safety Officers and the FSSAI.
        </p>
      </div>

      {/* 4. Methodology Versioning */}
      <div className="border-t border-[#E7E7DE] pt-8 space-y-3 text-xs text-[#5E635D]">
        <h3 className="font-serif font-bold text-sm text-[#161815]">Methodology Versioning</h3>
        <p>
          Current active engine: <strong>Methodology v1.2.0 (November 2026)</strong>. Revisions to category weightings, microbiological parameters, or statutory criteria are published transparently in our audit changelog.
        </p>
      </div>
    </div>
  );
}

