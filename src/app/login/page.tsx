"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError(data.error || "Login failed");
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

  const setDemoCredentials = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword("KitchenProof@123");
    setError("");
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

      {/* 1-Click Evaluation Credentials for Testing */}
      <div className="bg-[#F5F5F0] p-4 rounded-xl border border-[#E7E7DE] space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#143D2B] flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5" />
          <span>One-Click Demonstration Logins:</span>
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setDemoCredentials("rahul.consumer@example.com", "Consumer")}
            className="p-2 bg-white rounded border border-[#D0D0C3] hover:border-[#143D2B] text-left hover:bg-[#F0F6F2] transition-colors"
          >
            <strong className="block text-[#161815]">Consumer</strong>
            <span className="text-[#868A85] text-[10px]">Rahul Verma</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials("priya.owner@example.com", "Owner")}
            className="p-2 bg-white rounded border border-[#D0D0C3] hover:border-[#143D2B] text-left hover:bg-[#F0F6F2] transition-colors"
          >
            <strong className="block text-[#161815]">Restaurant Owner</strong>
            <span className="text-[#868A85] text-[10px]">Priya Sundaram</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials("dr.anil.inspector@example.com", "Inspector")}
            className="p-2 bg-white rounded border border-[#D0D0C3] hover:border-[#143D2B] text-left hover:bg-[#F0F6F2] transition-colors"
          >
            <strong className="block text-[#161815]">Auditor / Inspector</strong>
            <span className="text-[#868A85] text-[10px]">Dr. Anil Sharma</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials("admin@kitchenproof.in", "Admin")}
            className="p-2 bg-white rounded border border-[#D0D0C3] hover:border-[#143D2B] text-left hover:bg-[#F0F6F2] transition-colors"
          >
            <strong className="block text-[#161815]">Platform Admin</strong>
            <span className="text-[#868A85] text-[10px]">Rajeshwar S.</span>
          </button>
        </div>
        <p className="text-[10px] text-[#868A85] text-center">
          Click any role above to prefill credentials (password: <code>KitchenProof@123</code>).
        </p>
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
              placeholder="name@example.com"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#D0D0C3] focus:border-[#143D2B]"
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
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#D0D0C3] focus:border-[#143D2B]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-[#143D2B] text-white text-xs font-semibold hover:bg-[#1F593F] transition-all flex items-center justify-center gap-2"
        >
          <span>{loading ? "Authenticating..." : "Sign In"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-center pt-2">
          <Link
            href="/register"
            className="text-xs text-[#5E635D] hover:text-[#143D2B] underline"
          >
            Don&apos;t have an account? Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

