"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, UserCheck } from "lucide-react";

const DEMO_PRESETS = [
  {
    role: "CONSUMER",
    label: "Citizen Consumer",
    name: "Rahul Verma",
    email: "rahul.consumer@example.com",
    desc: "Watchlist & incident reports",
  },
  {
    role: "RESTAURANT_OWNER",
    label: "Kitchen Owner",
    name: "Priya Sundaram",
    email: "priya.owner@example.com",
    desc: "Doc vault & QR inspection poster",
  },
  {
    role: "INSPECTOR",
    label: "Lead Auditor",
    name: "Dr. Anil K. Sharma",
    email: "dr.anil.inspector@example.com",
    desc: "5-category field audit console",
  },
  {
    role: "ADMIN",
    label: "Platform Admin",
    name: "Rajeshwar Sengupta",
    email: "admin@kitchenproof.in",
    desc: "Governance & immutable audit logs",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const queryError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    queryError === "unauthorized"
      ? "Please sign in to access this dashboard."
      : queryError === "forbidden"
      ? "You do not have permission to view that resource."
      : queryError === "session_expired"
      ? "Your session has expired. Please sign in again."
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [demoRoleLoading, setDemoRoleLoading] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (callbackUrl && callbackUrl.startsWith("/dashboard")) {
        router.push(callbackUrl);
      } else {
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
      }
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = async (demoEmail: string, roleKey: string) => {
    setDemoRoleLoading(roleKey);
    setError("");
    setEmail(demoEmail);
    setPassword("KitchenProof@123");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: demoEmail,
          password: "KitchenProof@123",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication issue");
        return;
      }

      if (callbackUrl && callbackUrl.startsWith("/dashboard")) {
        router.push(callbackUrl);
      } else {
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
      }
      router.refresh();
    } catch {
      setError("Failed to sign in to evaluation portal.");
    } finally {
      setDemoRoleLoading(null);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      {/* Brand icon & title */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-surface-raised text-accent flex items-center justify-center font-bold mx-auto shadow-subtle border border-border-subtle">
          <ShieldCheck className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-text-base">
          Sign In to KitchenProof
        </h1>
        <p className="text-xs text-text-muted max-w-prose mx-auto">
          Access your transparent food safety portal &amp; dashboard
        </p>
      </div>

      {/* 1-Click Role Presets */}
      <div className="bg-surface p-4 sm:p-5 rounded-xl border border-border-subtle shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-text-base">1-Click Demo Presets</span>
          </div>
          <span className="text-[10px] text-text-muted">Password: KitchenProof@123</span>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          Click any role below to instantly log in and test that dashboard:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.role}
              type="button"
              disabled={loading || !!demoRoleLoading}
              onClick={() => handleInstantDemoLogin(preset.email, preset.role)}
              className="p-2.5 rounded-lg border border-border-subtle bg-surface-raised hover:border-accent text-left transition-colors disabled:opacity-50 group"
            >
              <div className="flex items-center justify-between">
                <strong className="text-text-base font-semibold group-hover:text-accent transition-colors">
                  {preset.label}
                </strong>
                {demoRoleLoading === preset.role ? (
                  <span className="text-[10px] text-accent animate-pulse font-bold">...</span>
                ) : (
                  <ArrowRight className="w-3 h-3 text-text-muted group-hover:text-accent transition-colors" />
                )}
              </div>
              <span className="text-text-muted text-[10px] block mt-0.5 truncate">
                {preset.name} ({preset.desc})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Login Form */}
      <form
        onSubmit={handleLogin}
        className="bg-surface p-6 sm:p-8 rounded-xl border border-border-subtle shadow-subtle space-y-4"
      >
        {error && (
          <div className="p-3 bg-surface-raised text-danger text-xs rounded border border-danger/30 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-danger" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold tracking-wider text-text-muted mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border-subtle bg-surface-raised text-xs text-text-base placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wider text-text-muted mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border-subtle bg-surface-raised text-xs text-text-base placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-accent text-bg rounded-lg text-xs font-semibold hover:bg-accent-strong transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Footer link to register */}
      <div className="text-center text-xs text-text-muted">
        <span>Are you a food business operator? </span>
        <Link href="/register" className="font-semibold text-accent underline">
          Register your kitchen
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-16 text-center text-text-muted text-xs">Loading sign-in portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
