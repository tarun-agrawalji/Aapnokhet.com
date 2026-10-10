"use client";

import React from "react";
import { Star, Quote, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  restaurant: string;
  city: string;
  avatar: string;
  rating: number;
  quote: string;
  volume: string;
  badge: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Tarun Rawat",
    role: "Director & Owner",
    restaurant: "Rawat Mishthan Bhandar Hospitality",
    city: "Station Road, Jaipur",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&auto=format&fit=crop",
    rating: 5,
    quote: "We serve thousands of hot puris and rotis every single morning. AapnoKhet's chakki Sharbati Atta has eliminated all texture inconsistency. The rotis puff high and remain super soft even after 8 hours in banquet warmers. Plus, Net 15 credit billing is hassle free.",
    volume: "Consumes 120 Bags (50kg) Monthly",
    badge: "Heritage Brand &bull; 60+ Years"
  },
  {
    id: "test-2",
    name: "Chef Mahendra Singh",
    role: "Executive Head Chef",
    restaurant: "Heritage Haveli Fine Dine",
    city: "Civil Lines, Jaipur",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop",
    rating: 5,
    quote: "Aged Basmati grain length and aroma is everything for our royal dum biryani. Their 1121 steam rice elongates 2.5 times without breaking or turning mushy. Being able to see batch expiry and direct mandi sourcing gives our kitchen full confidence.",
    volume: "Consumes 60 Bags (25kg) Monthly",
    badge: "Fine Dining Restaurant"
  },
  {
    id: "test-3",
    name: "Pooja Agarwal",
    role: "Procurement Head",
    restaurant: "Spice Cloud Kitchens Hub (8 Outlets)",
    city: "Mansarovar & Vaishali Nagar",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop",
    rating: 5,
    quote: "Dairy deliveries used to be our biggest headache. AapnoKhet's refrigerated delivery vans deliver fresh malai paneer at 3.5°C sharp at 6:30 AM before my line cooks even start chopping. Zero spillage, zero sourness, and clean GST tax invoices every week.",
    volume: "Consumes 180kg Paneer Weekly",
    badge: "Cloud Kitchen Network"
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Trusted By 500+ Commercial Kitchens</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Loved By Chefs, Restaurant Owners & Caterers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Real feedback from commercial kitchens that depend on AapnoKhet pure raw materials for their daily kitchen prep.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {t.badge}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author & Restaurant Details */}
              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-800/30"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-amber-800 font-semibold">{t.role}</p>
                    <p className="text-[10px] text-slate-500">{t.restaurant} &bull; {t.city}</p>
                  </div>
                </div>

                <div className="mt-3 bg-white p-2 rounded-xl border border-slate-200/70 text-[11px] text-emerald-900 font-bold flex items-center justify-between">
                  <span>Commercial Scale:</span>
                  <span className="font-mono text-emerald-800">{t.volume}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
