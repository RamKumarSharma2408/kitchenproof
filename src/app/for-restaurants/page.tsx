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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-xs font-semibold text-accent">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>Food Business Operator Program</span>
        </div>
        <h1 className="text-text-base">
          Turn your kitchen hygiene into your greatest competitive advantage.
        </h1>
        <p className="text-base text-text-muted leading-relaxed max-w-prose">
          You invest in stainless-steel prep counters, commercial water purification, licensed pest control, and staff medical certifications. Don&apos;t let that investment remain invisible to delivery customers.
        </p>
        <div className="pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-strong transition-colors"
          >
            <span>Register Your Kitchen Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Value proposition cards */}
      <div className="space-y-6">
        <h2 className="text-text-base">Benefits for Food Businesses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-border-subtle p-6 rounded-xl shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-lg bg-surface-raised text-accent flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-text-base">Stand Out on Delivery Apps</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-prose">
              Consumers are increasingly cautious about unhygienic cloud kitchens. A verified KitchenProof profile with a 90+ safety rating builds instant consumer trust.
            </p>
          </div>

          <div className="bg-surface border border-border-subtle p-6 rounded-xl shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-lg bg-surface-raised text-warning flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5 text-warning" />
            </div>
            <h3 className="text-text-base">Free Compliance Vault</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-prose">
              Track water test renewals, FSSAI licence expiries, and staff Form IX medical health certificates in one centralized dashboard with automated alerts.
            </p>
          </div>

          <div className="bg-surface border border-border-subtle p-6 rounded-xl shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-lg bg-surface-raised text-accent flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-text-base">Accredited Audit Recognition</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-prose">
              Upload genuine audit reports conducted by FSSAI-recognized hygiene rating agencies and showcase verified 4 or 5 smiles on your public profile.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Self-Audit Checklist */}
      <div id="compliance-toolkit" className="bg-surface border border-border-subtle rounded-xl p-8 shadow-subtle space-y-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-accent">
            Self-Audit Toolkit
          </span>
          <h2 className="text-text-base mt-1">
            Mandatory Documents for Verification
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-prose">
            Ensure your kitchen has the following documentation ready prior to requesting verification:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle space-y-1">
            <strong className="text-text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Valid FSSAI Registration / State License</span>
            </strong>
            <p className="text-text-muted pl-6 max-w-prose">
              Active certificate issued through FoSCoS portal with minimum 60 days remaining validity.
            </p>
          </div>

          <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle space-y-1">
            <strong className="text-text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Potable Water Analysis Report (IS 10500)</span>
            </strong>
            <p className="text-text-muted pl-6 max-w-prose">
              Microbiological and chemical analysis from an accredited laboratory dated within the last 6 months.
            </p>
          </div>

          <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle space-y-1">
            <strong className="text-text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Annual Medical Fitness Certificates (Form IX)</span>
            </strong>
            <p className="text-text-muted pl-6 max-w-prose">
              Medical exam certificates for all food handlers confirming freedom from communicable disease.
            </p>
          </div>

          <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle space-y-1">
            <strong className="text-text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Monthly Pest Eradication Service Records</span>
            </strong>
            <p className="text-text-muted pl-6 max-w-prose">
              Service contracts and chemical application logs from a licensed pest control operator.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-surface-raised border border-border-subtle text-text-base p-8 sm:p-12 rounded-2xl text-center space-y-4">
        <h2 className="text-text-base">
          Ready to showcase your kitchen&apos;s standards?
        </h2>
        <p className="text-xs sm:text-sm text-text-muted max-w-prose mx-auto">
          Create your free restaurant operator account, manage compliance records, and request an independent verification inspection today.
        </p>
        <div className="pt-2">
          <Link
            href="/register?role=RESTAURANT_OWNER"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-bg font-semibold text-xs hover:bg-accent-strong transition-colors"
          >
            <span>Claim Your Restaurant Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
