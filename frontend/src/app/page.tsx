"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { LabReportModal } from "@/components/LabReportModal";
import { CartDrawer } from "@/components/CartDrawer";
import { BuyerDashboard } from "@/components/BuyerDashboard";
import { AdminConsole } from "@/components/AdminConsole";
import { DriverPwa } from "@/components/DriverPwa";
import { 
  ShieldCheck, Award, Truck, Sparkles, Search, 
  Filter, CheckCircle2, ChevronRight, Phone, Mail, MapPin 
} from "lucide-react";

// Default Master Products
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
    description: "Stone ground chakki atta from hand-sorted golden Sharbati wheat grains. Rotis puff high and remain soft for over 8 hours.",
    shelf_life_days: 90,
    is_perishable: false,
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
    ],
    purity_certificate: {
      lab_name: "Rajasthan State Food Testing Laboratory (FSSAI Reg # 1001)",
      report_no: "LAB-RJ-2026-ATT-0491",
      report_url: "https://example.com/reports/atta_sharbati_purity.pdf",
      tested_on: "2026-10-06",
      parameters: {
        "moisture_pct": 10.4,
        "foreign_matter_pct": 0.01,
        "gluten_pct": 11.2,
        "pesticide_residue": "NOT DETECTED",
        "adulteration": "NIL"
      },
      result: "COMPLIANT_PURE"
    }
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
    ],
    purity_certificate: {
      lab_name: "Agri Quality Testing Council (NABL Accredited)",
      report_no: "LAB-HR-2026-RIC-8832",
      report_url: "https://example.com/reports/basmati_1121_lab_report.pdf",
      tested_on: "2026-08-16",
      parameters: {
        "grain_length_avg_mm": 8.38,
        "moisture_pct": 11.8,
        "purity_pct": 99.8,
        "broken_grain_pct": 0.5
      },
      result: "COMPLIANT_PURE"
    }
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
    description: "Freshly curdled buffalo milk paneer with ultra-soft texture. Delivered in temperature controlled refrigerated vans before 9 AM.",
    shelf_life_days: 10,
    is_perishable: true,
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
    description: "Zero oil, water, or color polishing. High natural protein with authentic rich taste and fast cooking.",
    shelf_life_days: 180,
    is_perishable: false,
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
    description: "Prepared from curd using traditional wooden churn bilona process. Granular texture with rich earthy aroma.",
    shelf_life_days: 365,
    is_perishable: false,
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

  // Lab Report Modal state
  const [activeReport, setActiveReport] = useState<any>(null);
  const [reportProductName, setReportProductName] = useState("");

  const handleOpenReport = (report: any, name: string) => {
    setActiveReport(report);
    setReportProductName(name);
  };

  const handleAddToCart = (variantId: string, qty: number) => {
    // Find variant and product
    for (const p of INITIAL_PRODUCTS) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) {
        // Calculate price based on slabs
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
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Dynamic Notice Announcement Bar */}
      <div className="bg-amber-500 text-emerald-950 font-bold text-xs py-1.5 px-4 text-center border-b border-amber-600/30 flex items-center justify-center gap-2">
        <span>🌾 Fresh Harvest Special: Direct Sharbati Atta & 1121 Basmati bulk discounts for registered restaurants!</span>
        <span className="hidden sm:inline bg-emerald-900 text-amber-300 text-[10px] uppercase px-2 py-0.5 rounded-full">
          Orders before 9 PM ship at 6 AM
        </span>
      </div>

      {/* Navbar with Mode Switcher */}
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
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-3 py-1 text-xs font-bold text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  No Outside Sellers &bull; 100% Owned Warehouse Stock
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Pure Food Supplies For Restaurants & Caterers.
                </h1>
                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-normal">
                  Order stone-ground Sharbati atta, aged basmati rice, unpolished dals, and fresh malai paneer directly from AapnoKhet. Lab tested batches with GST tax invoices.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setShowDashboard(!showDashboard)}
                    className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    {showDashboard ? "Browse Catalog" : "My Orders & Credit Ledger"}
                  </button>
                  <div className="flex items-center gap-2 text-xs text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Net 15 Credit Terms Active</span>
                  </div>
                </div>
              </div>

              {/* Quick USP Card */}
              <div className="w-full md:w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                  AapnoKhet Trust Standards
                </h4>
                <div className="text-xs space-y-2 text-emerald-100">
                  <p className="flex items-start gap-2">
                    <span className="text-amber-300 font-bold">✓</span>
                    <span><strong>FEFO Allocation:</strong> Freshest batches shipped first with live batch expiry dates.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-300 font-bold">✓</span>
                    <span><strong>Lab Reports:</strong> Download NABL/FSSAI testing certificates per SKU.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-300 font-bold">✓</span>
                    <span><strong>Refrigerated Fleet:</strong> Dairy kept below 4°C in monitored cold-chain vans.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Buyer Account Dashboard (if toggled) */}
            {showDashboard && (
              <BuyerDashboard onReorder={handleReorder} />
            )}

            {/* Category Filter Pills & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              {/* Category Pills */}
              <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
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
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                      activeCategory === cat.slug
                        ? "bg-emerald-800 text-white border-emerald-900 shadow-md"
                        : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search atta, rice, dals, paneer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  onOpenReport={handleOpenReport}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Lab Report Inspection Modal */}
      <LabReportModal
        isOpen={Boolean(activeReport)}
        onClose={() => setActiveReport(null)}
        report={activeReport}
        productName={reportProductName}
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
      <footer className="bg-emerald-950 text-white pt-12 pb-6 border-t border-amber-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-emerald-900 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <span className="text-xl font-black text-white">AapnoKhet</span>
            </div>
            <p className="text-emerald-300 leading-relaxed">
              Pure Food Supply Chain B2B E-Commerce Platform. Delivering unadulterated wheat flour, aged rice, pulses, and cold-chain dairy to commercial kitchens.
            </p>
            <p className="text-amber-400 font-bold">FSSAI Licence # 12226999000845</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-emerald-300">
              <li><a href="#" className="hover:text-amber-300">Sharbati Chakki Atta</a></li>
              <li><a href="#" className="hover:text-amber-300">1121 Steam Basmati Rice</a></li>
              <li><a href="#" className="hover:text-amber-300">Fresh Malai Paneer</a></li>
              <li><a href="#" className="hover:text-amber-300">Bilona Pure Cow Ghee</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">B2B Standards</h4>
            <ul className="space-y-1.5 text-emerald-300">
              <li>FEFO Batch Traceability</li>
              <li>GST Tax Invoices & E-Way Bills</li>
              <li>Net 15 Approved Credit Lines</li>
              <li>Zero Marketplace / Direct Owned Stock</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">Central Depot Contact</h4>
            <p className="text-emerald-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Plot 42, Agro Food Park, RIICO Industrial Area, Mansarovar, Jaipur - 302020</span>
            </p>
            <p className="text-emerald-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>+91 98290 12345 (Orders Desk)</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-emerald-400 gap-2">
          <p>&copy; 2026 AapnoKhet Pure Food Supply Chain Pvt Ltd. All rights reserved.</p>
          <p>Compliant with FSSAI, GST & India DPDP Act 2023.</p>
        </div>
      </footer>
    </div>
  );
}
