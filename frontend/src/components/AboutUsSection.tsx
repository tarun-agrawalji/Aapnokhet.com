"use client";

import React from "react";
import { 
  ShieldCheck, Sprout, Truck, Building2, CheckCircle2, 
  MapPin, Clock, Award, Users, ArrowRight 
} from "lucide-react";

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about-us" className="py-16 bg-gradient-to-b from-amber-50/40 via-white to-slate-50 border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            <span>About AapnoKhet &bull; Pure Food Direct Supply</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Built Exclusively For Commercial Kitchens Demanding Genuine Food Purity.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            AapnoKhet operates like a direct supply chain engine for restaurants, hotels, and cloud kitchens. We are not an open marketplace. We own our central warehouse, maintain direct farm mandi sourcing, and deliver pure raw materials before your morning kitchen prep begins.
          </p>
        </div>

        {/* 2-Column Story Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div className="space-y-5">
            <h3 className="text-2xl font-black text-emerald-950 tracking-tight">
              Why 500+ Restaurants Replaced Traditional Wholesalers With AapnoKhet
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              For decades, restaurants relied on disorganized wholesale mandis and phone orders. This resulted in fluctuating grain quality, inconsistent flour milling, unannounced price spikes, and missing tax invoices.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              AapnoKhet digitizes the entire procurement pipeline: from sourcing high-grade golden Sharbati wheat in Sehore to stone-grinding in our central chakki mill and dispatching directly in refrigerated and standard cargo trucks across Jaipur.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-2xl font-black text-emerald-900 font-mono">100%</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Owned Stock</p>
                <p className="text-[11px] text-slate-500">Zero third-party seller tampering</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-2xl font-black text-amber-700 font-mono">06:00 AM</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Morning Delivery</p>
                <p className="text-[11px] text-slate-500">Guaranteed before chef prep slots</p>
              </div>
            </div>
          </div>

          {/* Sourcing Visual Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop"
              alt="Farm sourcing"
              className="w-full h-80 lg:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Central Depot & Sourcing Mandis
              </span>
              <h4 className="text-lg font-bold">From Native Soil to Commercial Ladles</h4>
              <p className="text-xs text-emerald-100 mt-1 line-clamp-2">
                Plot 42, Agro Food Park, RIICO Industrial Area, Mansarovar, Jaipur &bull; Direct farmer procurement clusters across Rajasthan, MP & Haryana.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-emerald-700 transition-all duration-300 shadow-xs hover:shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">1. Sole-Seller Authenticity</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              No open vendor signups. AapnoKhet buys, tests, and owns every single sack of wheat, rice, and spice to eliminate adulteration risks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-emerald-700 transition-all duration-300 shadow-xs hover:shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">2. Strict FEFO Allocation</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Every perishable batch has an unalterable expiry date. Our warehouse management system always ships the earliest expiry lots first.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-emerald-700 transition-all duration-300 shadow-xs hover:shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6 text-sky-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">3. Refrigerated Fleet</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Fresh malai paneer and dairy are strictly transported in refrigerated vans at 2°C–4°C, preventing spoilage in hot Indian weather.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-emerald-700 transition-all duration-300 shadow-xs hover:shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6 text-purple-700" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">4. Transparent B2B Terms</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Net 15 approved credit lines for restaurants, volume bulk slab discounts, and 100% GST compliant sequential tax invoices.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
