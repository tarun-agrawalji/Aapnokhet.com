"use client";

import React from "react";
import { 
  ShoppingBag, ShieldCheck, Truck, Settings, User, 
  MapPin, Globe, Sparkles, Building2, Store
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
      {/* Top info bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            100% Lab-Tested Pure Food Supply Chain
          </span>
          <span className="hidden md:inline text-emerald-300">|</span>
          <span className="hidden md:flex items-center gap-1 text-emerald-200">
            <Building2 className="w-3.5 h-3.5" />
            FSSAI Lic # 12226999000845 &bull; GST Registered
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1 text-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Serving: <strong>Jaipur Metro</strong> (Next Slot: 06:00 AM)</span>
          </div>
          <button
            onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
            className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 px-2 py-0.5 rounded text-amber-300 font-medium transition cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            {lang === "EN" ? "हिन्दी" : "English"}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView("buyer")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-amber-600 flex items-center justify-center text-white shadow-md font-bold text-xl">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-emerald-950">AapnoKhet</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
                B2B Direct
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase">
              Pure Food For Commercial Kitchens
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Demo/Operational Switcher) */}
        <div className="hidden md:flex items-center bg-emerald-50 p-1 rounded-xl border border-emerald-100 shadow-inner">
          <button
            onClick={() => setActiveView("buyer")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeView === "buyer"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Buyer Portal
          </button>
          <button
            onClick={() => setActiveView("admin")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeView === "admin"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-amber-900 hover:bg-amber-100"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Admin & Operations
          </button>
          <button
            onClick={() => setActiveView("driver")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeView === "driver"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Driver App PWA
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {activeView === "buyer" && (
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 text-xs font-black px-2 py-0.5 rounded-full ml-1 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-emerald-100">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              TR
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-emerald-950 leading-none">Rawat Sweets</p>
              <p className="text-[10px] text-emerald-600 leading-tight">Net 15 Approved</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
