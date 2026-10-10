"use client";

import React, { useState } from "react";
import { Play, Heart, Eye, Volume2, VolumeX, X, Video, Sparkles, ChefHat } from "lucide-react";

interface Reel {
  id: string;
  title: string;
  subtitle: string;
  chef: string;
  restaurant: string;
  views: string;
  likes: string;
  thumbnail: string;
  videoUrl?: string;
  tags: string[];
}

const REELS_DATA: Reel[] = [
  {
    id: "reel-1",
    title: "Chakki Fresh Sharbati Atta Unboxing & Roti Test",
    subtitle: "Notice how soft and puffed the rotis remain after 8 hours in commercial hot-cases.",
    chef: "@chef_mahendra",
    restaurant: "Rawat Sweets Kitchen",
    views: "184K",
    likes: "14.2K",
    thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop",
    tags: ["#SharbatiAtta", "#PureFood", "#RestaurantKitchen"]
  },
  {
    id: "reel-2",
    title: "6:00 AM Cold-Chain Malai Paneer Delivery",
    subtitle: "Freshly curdled buffalo milk paneer arriving at 3.4°C in our refrigerated Bolero van.",
    chef: "@kailash_logistics",
    restaurant: "Heritage Haveli Depot",
    views: "245K",
    likes: "21.8K",
    thumbnail: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop",
    tags: ["#ColdChain", "#FreshPaneer", "#MorningDispatch"]
  },
  {
    id: "reel-3",
    title: "Aged 1121 Basmati Rice Dum Biryani Prep",
    subtitle: "2-year aged grains elongate over 2.4x without breaking. Watch the separate non-sticky grains.",
    chef: "@chef_tanmay",
    restaurant: "Royal Dum Cloud Kitchen",
    views: "310K",
    likes: "28.5K",
    thumbnail: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop",
    tags: ["#BasmatiRice", "#BiryaniChef", "#ZeroAdulteration"]
  },
  {
    id: "reel-4",
    title: "Traditional Bilona Pure Cow Ghee Aroma Test",
    subtitle: "Granular danedar texture churned from whole milk curd in Rajasthan farm mandis.",
    chef: "@pooja_quality",
    restaurant: "Central Mandi Testing",
    views: "128K",
    likes: "11.4K",
    thumbnail: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop",
    tags: ["#DesiGhee", "#Bilona", "#PureDairy"]
  }
];

export const InstagramReelsSection: React.FC = () => {
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="py-14 bg-gradient-to-b from-white to-amber-50/40 border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-300/40 rounded-full px-3 py-1 text-xs font-bold text-pink-700 mb-2">
              <Video className="w-3.5 h-3.5 text-pink-600" />
              <span>Commercial Kitchen Reels &bull; @AapnoKhetSupply</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Watch Real Chefs Cook With AapnoKhet Grains
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
              Behind the scenes videos from verified restaurant prep kitchens, cold-chain trucks, and central wheat chakki mills across Rajasthan.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md hover:opacity-95 transition cursor-pointer self-start md:self-auto"
          >
            <Video className="w-4 h-4" />
            <span>Follow Kitchen Reels</span>
          </a>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REELS_DATA.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="group relative rounded-3xl overflow-hidden aspect-[9/14] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200/80 bg-slate-900"
            >
              {/* Background Thumbnail Image */}
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 group-hover:from-black/95 transition-all" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-13 h-13 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-all duration-300 shadow-xl">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Top Meta info */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-white">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 font-bold">
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>{reel.views}</span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 font-bold text-rose-400">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span className="text-white">{reel.likes}</span>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-1.5 text-white">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>{reel.chef} &bull; {reel.restaurant}</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-200 transition">
                  {reel.title}
                </h4>
                <div className="flex flex-wrap gap-1 pt-1">
                  {reel.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] text-emerald-200 bg-white/10 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player Dialog */}
      {activeReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-w-sm w-full bg-slate-950 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col aspect-[9/15]">
            <button
              onClick={() => setActiveReel(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center cursor-pointer transition border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Preview Viewport */}
            <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
              <img
                src={activeReel.thumbnail}
                alt={activeReel.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

              {/* Simulated Playing Animation */}
              <div className="absolute center flex flex-col items-center gap-2 text-white">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center animate-pulse shadow-xl">
                  <Play className="w-7 h-7 fill-current translate-x-0.5" />
                </div>
                <span className="text-xs font-bold bg-black/60 px-3 py-1 rounded-full text-amber-300">
                  Kitchen Reel Live Preview
                </span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-20 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center border border-white/20 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom Reel Caption Box */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 text-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <ChefHat className="w-4 h-4" />
                  <span>{activeReel.chef} ({activeReel.restaurant})</span>
                </div>
                <span className="text-[11px] text-slate-400">{activeReel.views} views</span>
              </div>
              <h3 className="text-xs font-bold text-white leading-tight">
                {activeReel.title}
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                {activeReel.subtitle}
              </p>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ✓ Verified Commercial Supply
                </span>
                <button
                  onClick={() => setActiveReel(null)}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  Order This Grain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
