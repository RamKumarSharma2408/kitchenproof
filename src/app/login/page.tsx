"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

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

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
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
