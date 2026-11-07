"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, ChevronDown, ChevronUp } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoRoleLoading, setDemoRoleLoading] = useState<string | null>(null);
  const [showDemoPortals, setShowDemoPortals] = useState(true);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        return;
      }

      // Redirect based on role
      switch (data.user.role) {
        case "ADMIN":
          router.push("/dashboard/admin");
          break;
        case "INSPECTOR":
          router.push("/dashboard/inspector");
          break;
        case "RESTAURANT_OWNER":
          router.push("/dashboard/owner");
          break;
        case "CONSUMER":
        default:
          router.push("/dashboard/consumer");
          break;
      }
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = async (demoEmail: string, roleKey: string) => {
    setDemoRoleLoading(roleKey);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: demoEmail,
          password: "KitchenProof@123", // Injected programmatically for test mode without plain-text display
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Fallback prefill if needed
        setEmail(demoEmail);
        setPassword("KitchenProof@123");
        setError(data.error || "Authentication issue");
        return;
      }

      switch (data.user.role) {
        case "ADMIN":
          router.push("/dashboard/admin");
          break;
        case "INSPECTOR":
          router.push("/dashboard/inspector");
          break;
        case "RESTAURANT_OWNER":
          router.push("/dashboard/owner");
          break;
        case "CONSUMER":
        default:
          router.push("/dashboard/consumer");
          break;
      }
      router.refresh();
    } catch {
      setError("Failed to sign in to evaluation portal.");
    } finally {
      setDemoRoleLoading(null);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      {/* Brand icon & title */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-[#143D2B] text-white flex items-center justify-center font-bold mx-auto shadow-subtle">
          <ShieldCheck className="w-6 h-6 text-emerald-300" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#161815] tracking-tight">
          Sign In to KitchenProof
        </h1>
        <p className="text-xs text-[#5E635D]">
          Access your transparent food safety portal & dashboard
        </p>
      </div>

      {/* Evaluation & Demonstration Portals */}
      <div className="bg-[#F5F5F0] p-4 rounded-xl border border-[#E7E7DE] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#143D2B] flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Interactive Evaluation Portals</span>
          </span>
          <button
            type="button"
            onClick={() => setShowDemoPortals(!showDemoPortals)}
            className="text-[#868A85] hover:text-[#161815] text-[10px] flex items-center gap-0.5"
          >
            {showDemoPortals ? (
              <>
                <span>Hide</span>
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>Show</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {showDemoPortals && (
          <>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                disabled={!!demoRoleLoading}
                onClick={() => handleInstantDemoLogin("rahul.consumer@example.com", "consumer")}
                className="p-2.5 bg-white rounded-lg border border-[#D0D0C3] hover:border-[#143D2B] text-left hover:bg-[#F0F6F2] transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-[#161815]">Consumer</strong>
                  {demoRoleLoading === "consumer" && <span className="text-[10px] text-emerald-700 font-bold">...</span>}
                </div>
                <span className="text-[#868A85] text-[10px] block mt-0.5">Rahul Verma (Watchlist & Reports)</span>
              </button>

              <button
                type="button"
                disabled={!!demoRoleLoading}
                onClick={() => handleInstantDemoLogin("priya.owner@example.com", "owner")}
                className="p-2.5 bg-white rounded-lg border border-[#D0D0C3] hover:border-[#143D2B] text-left hover:bg-[#F0F6F2] transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-[#161815]">Kitchen Owner</strong>
                  {demoRoleLoading === "owner" && <span className="text-[10px] text-emerald-700 font-bold">...</span>}
                </div>
                <span className="text-[#868A85] text-[10px] block mt-0.5">Priya Sundaram (Doc Vault & QR)</span>
              </button>

              <button
                type="button"
                disabled={!!demoRoleLoading}
                onClick={() => handleInstantDemoLogin("dr.anil.inspector@example.com", "inspector")}
                className="p-2.5 bg-white rounded-lg border border-[#D0D0C3] hover:border-[#143D2B] text-left hover:bg-[#F0F6F2] transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-[#161815]">Certified Inspector</strong>
                  {demoRoleLoading === "inspector" && <span className="text-[10px] text-emerald-700 font-bold">...</span>}
                </div>
                <span className="text-[#868A85] text-[10px] block mt-0.5">Dr. Anil Sharma (Audit Scoring)</span>
              </button>

              <button
                type="button"
                disabled={!!demoRoleLoading}
                onClick={() => handleInstantDemoLogin("admin@kitchenproof.in", "admin")}
                className="p-2.5 bg-white rounded-lg border border-[#D0D0C3] hover:border-[#143D2B] text-left hover:bg-[#F0F6F2] transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-[#161815]">Platform Admin</strong>
                  {demoRoleLoading === "admin" && <span className="text-[10px] text-emerald-700 font-bold">...</span>}
                </div>
                <span className="text-[#868A85] text-[10px] block mt-0.5">Rajeshwar S. (Governance & Logs)</span>
              </button>
            </div>
            <p className="text-[10px] text-[#868A85] text-center">
              Click any portal above to sign in instantly with simulated role credentials.
            </p>
          </>
        )}
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleLogin} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-800 text-xs rounded border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#868A85]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D0D0C3] text-xs text-[#161815] placeholder:text-[#868A85] focus:border-[#143D2B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#868A85]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D0D0C3] text-xs text-[#161815] placeholder:text-[#868A85] focus:border-[#143D2B]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#143D2B] text-white rounded-lg text-xs font-semibold hover:bg-[#0D281C] transition-colors flex items-center justify-center gap-1.5"
        >
          <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Footer link to register */}
      <div className="text-center text-xs text-[#5E635D]">
        <span>Are you a food business operator? </span>
        <Link href="/register" className="font-semibold text-[#143D2B] underline">
          Register your kitchen
        </Link>
      </div>
    </div>
  );
}
