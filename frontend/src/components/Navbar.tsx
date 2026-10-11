"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  ShoppingBag, ShieldCheck, Truck, Settings, User, 
  MapPin, Globe, Sparkles, Building2, Store, Video, 
  HeartHandshake, Info, LogIn, LogOut, ChevronDown, 
  CheckCircle2, Clock, FileText 
} from "lucide-react";

interface NavbarProps {
  cartCount: number;
  openCart: () => void;
  lang: "EN" | "HI";
  setLang: (lang: "EN" | "HI") => void;
  onToggleDashboard?: () => void;
  // Optional legacy props for backwards compatibility
  activeView?: "buyer" | "admin" | "driver";
  setActiveView?: (view: "buyer" | "admin" | "driver") => void;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  openCart,
  lang,
  setLang,
  onToggleDashboard
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "AK";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-amber-600 flex items-center justify-center text-white shadow-md font-bold text-2xl group-hover:scale-105 transition-transform">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-emerald-950">AapnoKhet</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                B2B Direct
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 font-bold tracking-wider uppercase">
              Pure Food For Commercial Kitchens
            </p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold text-slate-700">
          <Link href="/#supplies" className="hover:text-emerald-900 transition flex items-center gap-1">
            <span>Raw Supplies</span>
          </Link>
          <Link href="/#about-us" className="hover:text-emerald-900 transition flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>About Us</span>
          </Link>
          <Link href="/#reels" className="hover:text-emerald-900 transition flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-pink-600" />
            <span>Kitchen Reels</span>
          </Link>
          <Link href="/#testimonials" className="hover:text-emerald-900 transition flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
            <span>Chef Reviews</span>
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer border border-slate-200"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-800" />
            <span>{lang === "EN" ? "हिन्दी" : "English"}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 bg-emerald-950 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md transition transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-amber-400 text-emerald-950 text-xs font-black px-2 py-0.5 rounded-full ml-1">
                {cartCount}
              </span>
            )}
          </button>

          {/* Authentication State */}
          {isAuthenticated && user ? (
            /* Logged In User Capsule & Dropdown */
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-black text-xs shadow-xs">
                  {initials}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black text-slate-900 leading-none truncate max-w-[130px]">
                    {user.company_name || user.name}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold leading-tight mt-0.5">
                    {user.kyb_status === "APPROVED" ? "✓ Verified Kitchen" : "KYB Pending"}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                      <span>Net 15 Approved Credit Line</span>
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    {onToggleDashboard && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onToggleDashboard();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>My Orders & Credit Ledger</span>
                      </button>
                    )}

                    <Link
                      href="/#supplies"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
                    >
                      Browse Kitchen Supplies
                    </Link>

                    {/* ONLY visible if logged in user is actually an Admin */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 hover:bg-amber-50 text-amber-900 font-bold border-t border-slate-100 cursor-pointer"
                      >
                        ⚙️ Internal Admin Console
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out: Clean Sign In & Register Buttons */
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-950 font-bold text-xs px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/login?tab=register"
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl transition shadow-xs whitespace-nowrap"
              >
                Register Kitchen
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
