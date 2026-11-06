"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, User, ArrowRight, Smartphone, MapPin } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "RESTAURANT_OWNER" ? "RESTAURANT_OWNER" : "CONSUMER";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CONSUMER" | "RESTAURANT_OWNER">(initialRole);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("New Delhi");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          city,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      if (data.user.role === "RESTAURANT_OWNER") {
        router.push("/dashboard/owner");
      } else {
        router.push("/dashboard/consumer");
      }
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E7E7DE] shadow-subtle space-y-4 text-xs">
      {error && (
        <div className="p-3 bg-red-50 text-red-800 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Role toggle */}
      <div>
        <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1.5">
          I Am Registering As:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("CONSUMER")}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              role === "CONSUMER"
                ? "bg-[#F0F6F2] border-[#143D2B] text-[#143D2B] font-semibold"
                : "bg-white border-[#D0D0C3] text-[#5E635D]"
            }`}
          >
            <strong className="block text-xs">Diner / Consumer</strong>
            <span className="text-[10px] text-[#868A85]">Save kitchens & view audits</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("RESTAURANT_OWNER")}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              role === "RESTAURANT_OWNER"
                ? "bg-[#F0F6F2] border-[#143D2B] text-[#143D2B] font-semibold"
                : "bg-white border-[#D0D0C3] text-[#5E635D]"
            }`}
          >
            <strong className="block text-xs">Restaurant Operator</strong>
            <span className="text-[10px] text-[#868A85]">Upload docs & get verified</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 w-4 h-4 text-[#868A85]" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Ananya Deshmukh"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B]"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#868A85]" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ananya@example.com"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B]"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
          Password (min. 6 characters)
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#868A85]" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
            Mobile Number
          </label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-[#868A85]" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B]"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold uppercase tracking-wider text-[#5E635D] mb-1">
            Primary City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#868A85]" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D0D0C3] focus:border-[#143D2B] bg-[#FBFBF9]"
            >
              <option value="New Delhi">New Delhi</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-[#143D2B] text-white text-xs font-semibold hover:bg-[#1F593F] transition-all flex items-center justify-center gap-2 pt-3"
      >
        <span>{loading ? "Creating Account..." : "Complete Registration"}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="text-xs text-[#5E635D] hover:text-[#143D2B] underline"
        >
          Already registered? Sign in here
        </Link>
      </div>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-[#143D2B] text-white flex items-center justify-center font-bold mx-auto shadow-subtle">
          <ShieldCheck className="w-6 h-6 text-emerald-300" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#161815] tracking-tight">
          Create Your KitchenProof Account
        </h1>
        <p className="text-xs text-[#5E635D]">
          Join the food safety transparency ecosystem
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-[#868A85]">Loading registration form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
