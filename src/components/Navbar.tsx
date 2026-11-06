"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Search, LayoutDashboard, LogOut, User, Menu, X, ChevronRight } from "lucide-react";

interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: "CONSUMER" | "RESTAURANT_OWNER" | "INSPECTOR" | "ADMIN";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard/consumer";
    switch (user.role) {
      case "ADMIN":
        return "/dashboard/admin";
      case "INSPECTOR":
        return "/dashboard/inspector";
      case "RESTAURANT_OWNER":
        return "/dashboard/owner";
      case "CONSUMER":
      default:
        return "/dashboard/consumer";
    }
  };

  const navLinks = [
    { href: "/explore", label: "Explore Kitchens" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/for-restaurants", label: "For Restaurants" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-[#E7E7DE]">
      {/* Statutory & Demo Notification Bar */}
      <div className="bg-[#143D2B] text-[#DCE9E0] px-4 py-1.5 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>
          <strong>KitchenProof National Directory</strong> — Independent Food Safety Transparency Platform (Demonstration Mode with Verified Model Data)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#143D2B] text-white flex items-center justify-center font-bold shadow-subtle group-hover:bg-[#1F593F] transition-colors">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#161815] font-serif leading-none">
              KitchenProof
            </span>
            <span className="text-[10px] text-[#5E635D] tracking-wider uppercase font-sans mt-0.5 font-medium">
              Food Safety & Hygiene Transparency
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#143D2B] font-semibold border-b-2 border-[#143D2B] py-5"
                  : "text-[#444943] hover:text-[#143D2B]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardLink()}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-md bg-[#F0F6F2] text-[#143D2B] hover:bg-[#DCE9E0] border border-[#B8D4C2] transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>
                  {user.role === "ADMIN" && "Admin Portal"}
                  {user.role === "INSPECTOR" && "Inspection Portal"}
                  {user.role === "RESTAURANT_OWNER" && "Owner Portal"}
                  {user.role === "CONSUMER" && "My Account"}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 text-[#5E635D] hover:text-[#B91C1C] rounded-md hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-[#323631] hover:text-[#143D2B] px-3 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-[#143D2B] text-white hover:bg-[#1F593F] shadow-subtle transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Explore Kitchens</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#444943] hover:text-[#143D2B]"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E7DE] bg-[#FBFBF9] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? "bg-[#F0F6F2] text-[#143D2B] font-semibold"
                    : "text-[#323631] hover:bg-[#F5F5F0]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E7E7DE] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-md bg-[#143D2B] text-white text-sm font-semibold"
                >
                  Dashboard ({user.name.split(" ")[0]})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 text-sm text-[#B91C1C] hover:bg-red-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-md border border-[#D0D0C3] text-sm font-medium text-[#161815]"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-md bg-[#143D2B] text-white text-sm font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
