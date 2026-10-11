"use client";

import React from "react";
import Link from "next/link";
import { 
  ShoppingBag, ShieldCheck, Truck, Settings, User, 
  MapPin, Globe, Sparkles, Building2, Store, Video, HeartHandshake, Info 
} from "lucide-react";

interface NavbarProps {
  activeView: "buyer" | "admin" | "driver";
  setActiveView: (view: "buyer" | "admin" | "driver") => void;
  cartCount: number;
  openCart: () => void;
  lang: "EN" | "HI";
  setLang: (lang: "EN" | "HI") => void;
  userRole: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  cartCount,
  openCart,
  lang,
  setLang,
  userRole
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => setActiveView("buyer")}
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

        {/* Center Navigation Links (Buyer View) */}
        {activeView === "buyer" && (
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
        )}

        {/* View Switcher Tabs (Demo/Operational Switcher) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveView("buyer")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeView === "buyer"
                ? "bg-emerald-900 text-white shadow-sm"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buyer Portal</span>
          </button>
          <button
            onClick={() => setActiveView("admin")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeView === "admin"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
          <button
            onClick={() => setActiveView("driver")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeView === "driver"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Driver PWA</span>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer border border-slate-200"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-800" />
            <span>{lang === "EN" ? "हिन्दी" : "English"}</span>
          </button>

          {activeView === "buyer" && (
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md transition transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 text-xs font-black px-2 py-0.5 rounded-full ml-1">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-950 flex items-center justify-center font-bold text-xs border border-amber-200">
              TR
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">Rawat Sweets</p>
              <p className="text-[10px] text-emerald-700 font-semibold leading-tight">Net 15 Approved</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
