"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { InstagramReelsSection } from "@/components/InstagramReelsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { AboutUsSection } from "@/components/AboutUsSection";
import { CartDrawer } from "@/components/CartDrawer";
import { BuyerDashboard } from "@/components/BuyerDashboard";
import { AdminConsole } from "@/components/AdminConsole";
import { DriverPwa } from "@/components/DriverPwa";
import { 
  ShieldCheck, Truck, Sparkles, Search, 
  CheckCircle2, ChevronRight, Phone, Mail, MapPin, 
  Clock, ArrowRight, Building2, Flame, Award 
} from "lucide-react";

// Master Products With High-Resolution Images & Full Specs
const INITIAL_PRODUCTS = [
  {
    id: "prod-01",
    name: "Sharbati Whole Wheat Atta (Chakki Fresh)",
    name_hindi: "शरबती शुद्ध चक्की आटा",
    slug: "sharbati-whole-wheat-atta",
    brand: "AapnoKhet Pure",
    category_slug: "flour",
    hsn_code: "1101",
    gst_rate: 0.0,
    origin: "Sehore, Madhya Pradesh & Rajasthan",
    grade: "Grade A+ Golden Grain",
    description: "Stone ground chakki atta from hand-sorted golden Sharbati wheat grains. Rotis puff high and remain soft for over 8 hours in commercial kitchen warmers.",
    shelf_life_days: 90,
    is_perishable: false,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
    variants: [
      {
        id: "var-01",
        sku: "AK-ATTA-SHAR-50KG",
        pack_size: "50 kg Bag",
        unit: "Bag",
        base_price: 1850,
        moq: 1,
        available_stock: 230,
        in_stock: true,
        slabs: [
          { min_qty: 1, max_qty: 4, slab_price: 1850 },
          { min_qty: 5, max_qty: 19, slab_price: 1780 },
          { min_qty: 20, max_qty: 100, slab_price: 1720 }
        ]
      },
      {
        id: "var-02",
        sku: "AK-ATTA-SHAR-25KG",
        pack_size: "25 kg Bag",
        unit: "Bag",
        base_price: 950,
        moq: 2,
        available_stock: 120,
        in_stock: true,
        slabs: []
      }
    ]
  },
  {
    id: "prod-02",
    name: "1121 Royal Steam Basmati Rice (2-Year Aged)",
    name_hindi: "1121 रॉयल बासमती चावल (२ वर्ष पुराना)",
    slug: "1121-royal-steam-basmati-rice",
    brand: "AapnoKhet Pure",
    category_slug: "rice",
    hsn_code: "1006",
    gst_rate: 5.0,
    origin: "Taraori, Haryana",
    grade: "Extra Long Grain (8.35mm)",
    description: "Naturally aged 2-year royal steam basmati with exceptional aroma. Elongates 2.5x without clumping. Ideal for dum biryanis and pulao.",
    shelf_life_days: 720,
    is_perishable: false,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop",
    variants: [
      {
        id: "var-03",
        sku: "AK-RICE-BAS1121-25KG",
        pack_size: "25 kg Bag",
        unit: "Bag",
        base_price: 2450,
        moq: 1,
        available_stock: 200,
        in_stock: true,
        slabs: [
          { min_qty: 1, max_qty: 3, slab_price: 2450 },
          { min_qty: 4, max_qty: 15, slab_price: 2350 },
          { min_qty: 16, max_qty: 100, slab_price: 2250 }
        ]
      }
    ]
  },
  {
    id: "prod-03",
    name: "Fresh Commercial Malai Paneer (Cold Chain)",
    name_hindi: "ताज़ा मलाई पनीर (कोल्ड चेन डिलीवरी)",
    slug: "fresh-commercial-malai-paneer",
    brand: "AapnoKhet Dairy Pure",
    category_slug: "dairy",
    hsn_code: "0406",
    gst_rate: 5.0,
    origin: "Jaipur Dairy Farm, Rajasthan",
    grade: "Full Cream Malai (50%+ Fat)",
    description: "Freshly curdled buffalo milk paneer with ultra-soft texture. Delivered in temperature controlled refrigerated vans at 3.5°C before 9 AM.",
    shelf_life_days: 10,
    is_perishable: true,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop",
    variants: [
      {
        id: "var-04",
        sku: "AK-PANEER-MALAI-5KG",
        pack_size: "5 kg Block",
        unit: "Block",
        base_price: 1650,
        moq: 1,
        available_stock: 50,
        in_stock: true,
        slabs: []
      }
    ]
  },
  {
    id: "prod-04",
    name: "Unpolished Desi Toor Dal (Arhar Dal)",
    name_hindi: "देसी अनपॉलिश्ड तुअर / अरहर दाल",
    slug: "unpolished-desi-toor-dal",
    brand: "AapnoKhet Pure",
    category_slug: "pulses",
    hsn_code: "0713",
    gst_rate: 0.0,
    origin: "Gulbarga, Karnataka",
    grade: "Grade A Unpolished",
    description: "Zero oil, water, or color polishing. High natural protein with authentic rich taste and fast boiling time in commercial pressure steamers.",
    shelf_life_days: 180,
    is_perishable: false,
    image_url: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&auto=format&fit=crop",
    variants: [
      {
        id: "var-05",
        sku: "AK-DAL-TOOR-30KG",
        pack_size: "30 kg Bag",
        unit: "Bag",
        base_price: 4350,
        moq: 1,
        available_stock: 120,
        in_stock: true,
        slabs: []
      }
    ]
  },
  {
    id: "prod-05",
    name: "Danedar Pure Cow Ghee (Bilona Method)",
    name_hindi: "दानेदार शुद्ध गाय का देसी घी",
    slug: "danedar-pure-cow-ghee-15kg",
    brand: "AapnoKhet Pure",
    category_slug: "dairy",
    hsn_code: "0405",
    gst_rate: 12.0,
    origin: "Tharparkar Cows, Rajasthan",
    grade: "Pure Bilona Danedar",
    description: "Prepared from curd using traditional wooden churn bilona process. Granular golden texture with rich earthy aroma and zero synthetic adulteration.",
    shelf_life_days: 365,
    is_perishable: false,
    image_url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&auto=format&fit=crop",
    variants: [
      {
        id: "var-06",
        sku: "AK-GHEE-COW-15TIN",
        pack_size: "15 kg Tin",
        unit: "Tin",
        base_price: 9750,
        moq: 1,
        available_stock: 40,
        in_stock: true,
        slabs: []
      }
    ]
  }
];

export default function Home() {
  const [activeView, setActiveView] = useState<"buyer" | "admin" | "driver">("buyer");
  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);

  // Selected Product Modal state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<any[]>([
    {
      id: "item-init-1",
      variant_id: "var-01",
      sku: "AK-ATTA-SHAR-50KG",
      product_name: "Sharbati Whole Wheat Atta",
      pack_size: "50 kg Bag",
      unit: "Bag",
      qty: 2,
      unit_price: 1850,
      subtotal: 3700,
      tax_amount: 0,
      total: 3700
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (variantId: string, qty: number) => {
    for (const p of INITIAL_PRODUCTS) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) {
        const matchingSlab = v.slabs.find((s) => qty >= s.min_qty && qty <= s.max_qty);
        const unit_price = matchingSlab ? matchingSlab.slab_price : v.base_price;
        const itemSub = unit_price * qty;
        const itemTax = (itemSub * p.gst_rate) / 100;

        setCartItems((prev) => {
          const existing = prev.find((item) => item.variant_id === variantId);
          if (existing) {
            return prev.map((item) =>
              item.variant_id === variantId
                ? { ...item, qty: item.qty + qty, subtotal: itemSub, total: itemSub + itemTax }
                : item
            );
          }
          return [
            ...prev,
            {
              id: `item-${Date.now()}`,
              variant_id: v.id,
              sku: v.sku,
              product_name: p.name,
              pack_size: v.pack_size,
              unit: v.unit,
              qty,
              unit_price,
              subtotal: itemSub,
              tax_amount: itemTax,
              total: itemSub + itemTax
            }
          ];
        });
        setIsCartOpen(true);
        break;
      }
    }
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleReorder = (orderId: string) => {
    setCartItems([
      {
        id: `item-${Date.now()}-1`,
        variant_id: "var-01",
        sku: "AK-ATTA-SHAR-50KG",
        product_name: "Sharbati Whole Wheat Atta",
        pack_size: "50 kg Bag",
        unit: "Bag",
        qty: 2,
        unit_price: 1850,
        subtotal: 3700,
        tax_amount: 0,
        total: 3700
      },
      {
        id: `item-${Date.now()}-2`,
        variant_id: "var-03",
        sku: "AK-RICE-BAS1121-25KG",
        product_name: "1121 Royal Steam Basmati Rice",
        pack_size: "25 kg Bag",
        unit: "Bag",
        qty: 1,
        unit_price: 2450,
        subtotal: 2450,
        tax_amount: 122.5,
        total: 2572.5
      }
    ]);
    setShowDashboard(false);
    setIsCartOpen(true);
  };

  // Cart calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const taxTotal = cartItems.reduce((acc, item) => acc + item.tax_amount, 0);
  const grandTotal = subtotal + taxTotal;

  // Filtered Products
  const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
    const matchesCat = activeCategory === "all" || p.category_slug === activeCategory;
    const matchesQuery =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      {/* Top Notice Announcement Bar */}
      <div className="bg-amber-400 text-emerald-950 font-bold text-xs py-2 px-4 text-center border-b border-amber-500/30 flex items-center justify-center gap-2">
        <span>🌾 Fresh Harvest Direct: Sharbati Atta & 1121 Basmati bulk mandi discounts live for verified restaurants!</span>
        <span className="hidden sm:inline bg-emerald-950 text-amber-300 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">
          Orders before 9 PM ship at 6 AM
        </span>
      </div>

      {/* Navbar with Mode Switcher & Navigation Links */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cartItems.length}
        openCart={() => setIsCartOpen(true)}
        lang={lang}
        setLang={setLang}
        userRole="Buyer Owner"
      />

      {/* VIEW 1: ADMIN OPERATIONS CONSOLE */}
      {activeView === "admin" && <AdminConsole />}

      {/* VIEW 2: DRIVER PWA */}
      {activeView === "driver" && <DriverPwa />}

      {/* VIEW 3: BUYER STOREFRONT & ORDERING PORTAL */}
      {activeView === "buyer" && (
        <main className="flex-1">
          {/* Hero Banner Section */}
          <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 overflow-hidden">
            {/* Background Texture elements */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl space-y-5">
                <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/40 rounded-full px-4 py-1.5 text-xs font-bold text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  No Outside Sellers &bull; 100% Owned Warehouse Stock
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Pure Raw Food Supplies For Restaurants & Commercial Kitchens.
                </h1>

                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-normal">
                  Order stone-ground chakki wheat flour, 2-year aged basmati rice, unpolished native dals, and temperature-controlled malai paneer. Direct warehouse dispatch with Net 15 credit terms and GST invoices.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#supplies"
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-xl transition cursor-pointer flex items-center gap-2"
                  >
                    <span>Browse Raw Supplies</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setShowDashboard(!showDashboard)}
                    className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl backdrop-blur-xs transition cursor-pointer"
                  >
                    {showDashboard ? "Close Dashboard" : "My Orders & Credit Ledger"}
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-4 pt-2 text-xs text-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Net 15 Approved Credit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Next Morning 6 AM Slot</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Feature Card */}
              <div className="w-full lg:w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    AapnoKhet Core Standards
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    Direct Mandi
                  </span>
                </div>

                <div className="text-xs space-y-3 text-emerald-100">
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold text-sm">🌾</span>
                    <div>
                      <strong className="text-white block">Stone-Ground Milling:</strong>
                      <span>Milled fresh in our central Jaipur agro park chakki to keep natural wheat germ intact.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold text-sm">❄️</span>
                    <div>
                      <strong className="text-white block">Cold-Chain Fleet:</strong>
                      <span>Fresh paneer transported strictly in refrigerated vans at 3.5°C directly to kitchen docks.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold text-sm">📄</span>
                    <div>
                      <strong className="text-white block">Automated GST Invoicing:</strong>
                      <span>Sequential tax invoices, HSN-wise rate split, and monthly GSTR export summaries.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="supplies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Buyer Account Dashboard (if toggled) */}
            {showDashboard && (
              <BuyerDashboard onReorder={handleReorder} />
            )}

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
                  Wholesale Kitchen Supplies
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                  Commercial Raw Materials Catalog
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Click any product to inspect specifications, bulk slabs, and available pack sizes.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search atta, basmati, dals, paneer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-medium pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex overflow-x-auto gap-2.5 pb-2 mb-8 no-scrollbar">
              {[
                { slug: "all", label: "All Supplies", icon: "🌾" },
                { slug: "flour", label: "Wheat & Flours", icon: "🍞" },
                { slug: "rice", label: "Rice & Grains", icon: "🍚" },
                { slug: "pulses", label: "Pulses & Dals", icon: "🥣" },
                { slug: "dairy", label: "Pure Dairy & Ghee", icon: "🧈" },
              ].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    activeCategory === cat.slug
                      ? "bg-emerald-900 text-white border-emerald-950 shadow-md"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={(prod) => setSelectedProduct(prod)}
                  lang={lang}
                />
              ))}
            </div>
          </div>

          {/* Section: Instagram Reels / Videos */}
          <div id="reels">
            <InstagramReelsSection />
          </div>

          {/* Section: Testimonials & Chef Reviews */}
          <div id="testimonials">
            <TestimonialsSection />
          </div>

          {/* Section: About Us & Our Purity Story */}
          <div id="about-us">
            <AboutUsSection />
          </div>
        </main>
      )}

      {/* Product Detail Modal (On-Click Product Dialog) */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        lang={lang}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        taxTotal={taxTotal}
        grandTotal={grandTotal}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutSuccess={() => {}}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-white pt-16 pb-8 border-t border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900 text-xs">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🌾</span>
              <div>
                <span className="text-2xl font-black text-white">AapnoKhet</span>
                <span className="text-[10px] text-amber-400 block font-bold uppercase tracking-wider">
                  Pure Food Direct Supply
                </span>
              </div>
            </div>
            <p className="text-emerald-300 leading-relaxed font-normal">
              Direct supply of unadulterated Sharbati wheat flour, 2-year aged Basmati rice, unpolished pulses, and cold-chain dairy to restaurants, hotels, and cloud kitchens.
            </p>
            <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-800 text-amber-300 font-bold">
              FSSAI Central Licence # 12226999000845
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Commercial Supplies</h4>
            <ul className="space-y-2 text-emerald-300">
              <li><a href="#supplies" className="hover:text-amber-300 transition">Stone-Ground Sharbati Atta (50kg)</a></li>
              <li><a href="#supplies" className="hover:text-amber-300 transition">1121 Royal Steam Basmati Rice (25kg)</a></li>
              <li><a href="#supplies" className="hover:text-amber-300 transition">Fresh Malai Paneer (Cold Chain 5kg)</a></li>
              <li><a href="#supplies" className="hover:text-amber-300 transition">Unpolished Desi Toor Dal (30kg)</a></li>
              <li><a href="#supplies" className="hover:text-amber-300 transition">Bilona Pure Cow Ghee (15kg Tin)</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Platform & Trust</h4>
            <ul className="space-y-2 text-emerald-300">
              <li><a href="#about-us" className="hover:text-amber-300 transition">About Our Direct Supply Model</a></li>
              <li><a href="#reels" className="hover:text-amber-300 transition">Kitchen Prep Stories & Reels</a></li>
              <li><a href="#testimonials" className="hover:text-amber-300 transition">Chef & Restaurant Reviews</a></li>
              <li><span className="text-slate-400">FEFO Expiry-First Warehouse Protocol</span></li>
              <li><span className="text-slate-400">Net 15 Approved Credit Accounts</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Depot & Orders Desk</h4>
            <p className="text-emerald-300 flex items-start gap-2.5 leading-relaxed">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Plot 42, Agro Food Park, RIICO Industrial Area, Mansarovar, Jaipur - 302020</span>
            </p>
            <p className="text-emerald-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span className="font-mono font-bold">+91 98290 12345 (Orders Desk)</span>
            </p>
            <p className="text-emerald-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>orders@aapnokhet.com</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-emerald-400 gap-2">
          <p>&copy; 2026 AapnoKhet Pure Food Supply Chain Pvt Ltd. All rights reserved.</p>
          <p>GST & FSSAI Compliant B2B Direct Food Supply Chain Platform.</p>
        </div>
      </footer>
    </div>
  );
}
