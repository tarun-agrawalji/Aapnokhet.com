"use client";

import React from "react";
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
      {/* Top info bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Pure Food Supply Chain &bull; 100% Owned Warehouse Stock
          </span>
          <span className="hidden md:inline text-emerald-400">|</span>
          <span className="hidden md:flex items-center gap-1 text-emerald-300">
            <Building2 className="w-3.5 h-3.5" />
            FSSAI Lic # 12226999000845 &bull; GST Invoicing
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1 text-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Serving: <strong>Jaipur Metro</strong> (Next Slot: 06:00 AM)</span>
          </div>
          <button
            onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
            className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 px-2.5 py-0.5 rounded-md text-amber-300 font-bold transition cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            {lang === "EN" ? "हिन्दी" : "English"}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView("buyer")}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-amber-600 flex items-center justify-center text-white shadow-md font-bold text-2xl">
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
        </div>

        {/* Center Navigation Links (Buyer View) */}
        {activeView === "buyer" && (
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold text-slate-700">
            <a href="#supplies" className="hover:text-emerald-900 transition flex items-center gap-1">
              <span>Raw Supplies</span>
            </a>
            <a href="#about-us" className="hover:text-emerald-900 transition flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>About Us</span>
            </a>
            <a href="#reels" className="hover:text-emerald-900 transition flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-pink-600" />
              <span>Kitchen Reels</span>
            </a>
            <a href="#testimonials" className="hover:text-emerald-900 transition flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
              <span>Chef Reviews</span>
            </a>
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
