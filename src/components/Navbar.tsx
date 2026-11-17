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
    <header className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
      {/* Platform Transparency Banner */}
      <div className="bg-[var(--surface-raised)] text-[var(--text)] px-4 py-1.5 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span>Independent Kitchen Safety Transparency • Evidence-Based Hygiene Intelligence</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="KitchenProof">
          <div className="w-9 h-9 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-strong)] text-accent flex items-center justify-center font-bold shadow-subtle group-hover:border-accent transition-colors">
            <svg viewBox="0 0 32 32" className="w-5 h-5 text-accent" fill="none" aria-hidden="true">
              <path d="M11 7.5L15 11.5L23 3" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 21.5C5 13 10 9.5 16 9.5C22 9.5 27 13 27 21.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M3.5 21.5H28.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="15.5" r="1.25" fill="currentColor"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[var(--text)] font-serif leading-none group-hover:text-accent transition-colors">
              KitchenProof
            </span>
            <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase font-sans mt-0.5 font-medium">
              Food Safety &amp; Hygiene Transparency
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
                  ? "text-accent font-semibold border-b-2 border-accent py-5"
                  : "text-[var(--text-muted)] hover:text-accent"
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
                className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-md bg-surface-raised text-accent hover:bg-[var(--surface-raised)] border border-border-strong transition-colors"
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
                className="p-2 text-[var(--text-muted)] hover:text-danger rounded-md hover:bg-surface-raised transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-[var(--text-muted)] hover:text-accent px-3 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-accent text-bg hover:bg-accent-strong shadow-subtle transition-all"
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
          className="md:hidden p-2 text-[var(--text-muted)] hover:text-accent"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg)] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? "bg-surface-raised text-accent font-semibold"
                    : "text-[var(--text-muted)] hover:bg-surface-raised"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-md bg-accent text-bg text-sm font-semibold"
                >
                  Dashboard ({user.name.split(" ")[0]})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 text-sm text-danger hover:bg-surface-raised rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-md border border-border-strong text-sm font-medium text-[var(--text)]"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-md bg-accent text-bg text-sm font-semibold"
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
