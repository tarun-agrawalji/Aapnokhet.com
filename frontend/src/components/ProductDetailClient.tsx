"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import { Product, getRelatedProducts } from "@/data/products";
import {
  ShieldCheck, Truck, Sparkles, CheckCircle2, ChevronRight, 
  MapPin, Clock, ArrowRight, Building2, Eye, Star,
  Minus, Plus, ShoppingBag, ArrowLeft, Check, Award,
  Flame, FileText, Share2, Layers, AlertCircle
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const {
    items: cartItems,
    addToCart,
    removeItem,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    taxTotal,
    grandTotal
  } = useCart();

  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [qty, setQty] = useState(product.variants[0]?.moq || 1);
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];

  // Sync quantity with MOQ when variant switches
  const handleVariantSelect = (idx: number) => {
    setSelectedVariantIndex(idx);
    const newVariant = product.variants[idx];
    if (newVariant && qty < newVariant.moq) {
      setQty(newVariant.moq);
    }
  };

  // Compute live slab price based on quantity
  const getEffectiveUnitPrice = () => {
    if (!selectedVariant) return 0;
    const matchingSlab = selectedVariant.slabs.find(
      (s) => qty >= s.min_qty && qty <= s.max_qty
    );
    return matchingSlab ? matchingSlab.slab_price : selectedVariant.base_price;
  };

  const effectiveUnitPrice = getEffectiveUnitPrice();
  const itemSubtotal = effectiveUnitPrice * qty;
  const itemGst = (itemSubtotal * product.gst_rate) / 100;
  const itemGrandTotal = itemSubtotal + itemGst;
  const isDiscounted = selectedVariant && effectiveUnitPrice < selectedVariant.base_price;
  const unitSavings = selectedVariant ? selectedVariant.base_price - effectiveUnitPrice : 0;
  const totalSavings = unitSavings * qty;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(selectedVariant.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addToCart(selectedVariant.id, qty);
    setIsCartOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedProducts = getRelatedProducts(product.id, 3);

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans">
      {/* Navbar with language and cart controls */}
      <Navbar
        activeView="buyer"
        setActiveView={() => {}}
        cartCount={cartItems.length}
        openCart={() => setIsCartOpen(true)}
        lang={lang}
        setLang={setLang}
        userRole="Commercial Buyer"
      />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Navigation Bar */}
        <div className="bg-white border-b border-slate-200/80 sticky top-18 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
              <Link href="/" className="hover:text-emerald-900 flex items-center gap-1 font-bold transition">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Catalog</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <Link href={`/#${product.category_slug}`} className="hover:text-emerald-900 transition font-medium">
                {product.category_name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="font-bold text-slate-900 truncate max-w-[240px] sm:max-w-none">
                {lang === "HI" && product.name_hindi ? product.name_hindi : product.name}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="hidden sm:flex items-center gap-1 text-slate-600 hover:text-emerald-900 font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ml-4"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share Specs"}</span>
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Image Gallery & Quality Badges (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Main Product Showcase Image */}
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-amber-100 shadow-md">
                <img
                  src={product.gallery[activeImageIndex] || product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-emerald-950/90 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md border border-amber-400/30">
                    {product.grade}
                  </span>
                  {product.is_perishable && (
                    <span className="bg-sky-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md border border-white/20">
                      ❄️ Cold-Chain 3.5°C
                    </span>
                  )}
                  <span className="bg-white/95 backdrop-blur-md text-emerald-950 text-xs font-bold px-3 py-1 rounded-xl shadow-md flex items-center gap-1 border border-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    100% Owned Warehouse Stock
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-medium px-3 py-1 rounded-lg">
                  SKU: {selectedVariant?.sku}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {product.gallery.length > 1 && (
                <div className="flex gap-3">
                  {product.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                        activeImageIndex === i
                          ? "border-emerald-800 shadow-md scale-102"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Direct Warehouse Mandi Guarantees Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  AapnoKhet Purity & Dispatch Standard
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Origin Mandi</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{product.origin}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Shelf Life</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{product.shelf_life_days} Days (FEFO)</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Central FSSAI</span>
                    <span className="font-bold text-emerald-800 mt-0.5 block font-mono"># 12226999000845</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Tax Invoicing</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">HSN {product.hsn_code} ({product.gst_rate}% GST)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>Next Morning <strong>06:00 AM Slot</strong></span>
                  </div>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-[11px]">
                    Jaipur Metro Dock Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Bulk Slabs & Order Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Title & Brand Header */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{product.origin}</span>
                    <span>&bull;</span>
                    <span className="text-slate-400 font-mono">HSN {product.hsn_code}</span>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    selectedVariant?.in_stock
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}>
                    {selectedVariant?.in_stock
                      ? `✓ In Stock (${selectedVariant.available_stock} ${selectedVariant.unit}s available)`
                      : "Out of Stock"}
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {lang === "HI" && product.name_hindi ? product.name_hindi : product.name}
                  </h1>
                  <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider mt-1">
                    Direct Commercial Supply By {product.brand}
                  </p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {product.full_description || product.description}
                </p>

                {/* Pack Size Selection */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
                    1. Select Commercial Pack Size:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantSelect(i)}
                        className={`px-4 py-3 rounded-2xl text-xs font-bold border transition cursor-pointer flex flex-col items-start gap-0.5 ${
                          i === selectedVariantIndex
                            ? "bg-emerald-950 text-white border-emerald-950 shadow-md ring-2 ring-emerald-800"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                        }`}
                      >
                        <span className="font-extrabold text-sm">{v.pack_size}</span>
                        <span className={i === selectedVariantIndex ? "text-amber-300 text-[11px]" : "text-slate-500 text-[11px]"}>
                          Base: ₹{v.base_price.toLocaleString("en-IN")} /{v.unit} &bull; MOQ: {v.moq}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wholesale Bulk Tier Pricing Slabs */}
                {selectedVariant && selectedVariant.slabs.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        2. Wholesale Volume Mandi Slabs ({selectedVariant.pack_size}):
                      </label>
                      <span className="text-[11px] text-emerald-800 font-bold">
                        Higher Qty = Lower Bag Rate
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {selectedVariant.slabs.map((slab, idx) => {
                        const isCurrentActiveSlab = qty >= slab.min_qty && qty <= slab.max_qty;
                        const slabDiscount = selectedVariant.base_price - slab.slab_price;

                        return (
                          <div
                            key={idx}
                            onClick={() => setQty(slab.min_qty)}
                            className={`p-3 rounded-2xl border transition cursor-pointer text-xs ${
                              isCurrentActiveSlab
                                ? "bg-amber-100/80 border-amber-400 ring-2 ring-amber-500/50 shadow-sm"
                                : "bg-amber-50/50 hover:bg-amber-100/50 border-amber-200/70"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-700">
                                {slab.min_qty}–{slab.max_qty} {selectedVariant.unit}s
                              </span>
                              {isCurrentActiveSlab && (
                                <span className="bg-emerald-800 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                  Applied ✓
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-baseline gap-1.5">
                              <span className="text-lg font-black text-emerald-950 font-mono">
                                ₹{slab.slab_price}
                              </span>
                              <span className="text-[10px] text-slate-500">/{selectedVariant.unit}</span>
                            </div>
                            {slabDiscount > 0 && (
                              <span className="text-[10px] text-amber-800 font-bold block mt-0.5">
                                Save ₹{slabDiscount} per {selectedVariant.unit}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pricing & Commercial Calculator Box */}
                <div className="pt-6 border-t border-slate-100 bg-slate-50/80 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    {/* Live Unit Rate & Savings */}
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
                        Commercial Rate ({product.gst_rate}% GST extra):
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl sm:text-4xl font-black text-emerald-950 font-mono">
                          ₹{effectiveUnitPrice.toLocaleString("en-IN")}
                        </span>
                        {isDiscounted && (
                          <span className="text-sm line-through text-slate-400 font-mono">
                            ₹{selectedVariant?.base_price}
                          </span>
                        )}
                        <span className="text-sm text-slate-600 font-semibold">/{selectedVariant?.unit}</span>
                      </div>

                      {totalSavings > 0 && (
                        <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-xl text-xs font-bold border border-emerald-200">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Wholesale Bulk Discount: You save ₹{totalSavings.toLocaleString("en-IN")}!</span>
                        </div>
                      )}
                    </div>

                    {/* Order Subtotal Breakdown */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal ({qty} {selectedVariant?.unit}s):</span>
                        <span className="font-mono font-bold text-slate-900">₹{itemSubtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Applicable GST ({product.gst_rate}%):</span>
                        <span className="font-mono font-bold text-slate-900">₹{itemGst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                        <span>Total Payable:</span>
                        <span className="font-mono text-emerald-950 text-base">₹{itemGrandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controller & Add Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-2xl bg-white shadow-xs p-1.5 w-full sm:w-auto justify-between sm:justify-start">
                      <button
                        onClick={() => setQty(Math.max(selectedVariant?.moq || 1, qty - 1))}
                        disabled={qty <= (selectedVariant?.moq || 1)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer text-slate-800"
                        title="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="px-5 text-center">
                        <span className="font-black text-base text-slate-900 font-mono block">
                          {qty}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block -mt-1">
                          MOQ: {selectedVariant?.moq}
                        </span>
                      </div>
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 transition cursor-pointer text-slate-800"
                        title="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedVariant?.in_stock}
                      className={`flex-1 w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                        added
                          ? "bg-emerald-600 text-white"
                          : selectedVariant?.in_stock
                          ? "bg-emerald-950 hover:bg-emerald-900 text-white active:scale-98"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>{added ? "Added To Cart ✓" : `Add To Cart (${qty} ${selectedVariant?.unit}s)`}</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={!selectedVariant?.in_stock}
                      className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl transition cursor-pointer shadow-md whitespace-nowrap active:scale-98"
                    >
                      <span>Order Now</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Technical Specifications & Lab Quality Attributes */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-800" />
                    Technical Food Specifications & Lab Standards
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                    Lab Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-medium">{spec.label}:</span>
                      <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* Culinary Applications for Chefs */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Recommended Kitchen Applications:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {product.culinary_uses.map((useCase, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related / Complementary Wholesale Supplies */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
                    Direct Mandi Supplies
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    Frequently Ordered Together
                  </h3>
                </div>
                <Link
                  href="/#supplies"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition"
                >
                  <span>View All Raw Supplies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => {
                  const relVar = rel.variants[0];
                  return (
                    <Link
                      key={rel.id}
                      href={`/products/${rel.slug}`}
                      className="bg-white rounded-3xl border border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <img
                            src={rel.image_url}
                            alt={rel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950/85 text-white px-2.5 py-1 rounded-lg">
                              {rel.grade}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>{rel.origin}</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-900 transition leading-snug">
                            {lang === "HI" && rel.name_hindi ? rel.name_hindi : rel.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {rel.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Starting from:</span>
                          <span className="text-base font-black text-emerald-950 font-mono">
                            ₹{relVar?.base_price}
                          </span>
                          <span className="text-xs text-slate-500"> /{relVar?.unit}</span>
                        </div>

                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>View Specs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        taxTotal={taxTotal}
        grandTotal={grandTotal}
        onRemoveItem={removeItem}
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
              Direct supply of unadulterated Sharbati wheat flour, 2-year aged Basmati rice, unpolished pulses, and cold-chain dairy to commercial kitchens.
            </p>
            <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-800 text-amber-300 font-bold">
              FSSAI Central Licence # 12226999000845
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Commercial Supplies</h4>
            <ul className="space-y-2 text-emerald-300">
              <li><Link href="/products/sharbati-whole-wheat-atta" className="hover:text-amber-300 transition">Stone-Ground Sharbati Atta (50kg)</Link></li>
              <li><Link href="/products/1121-royal-steam-basmati-rice" className="hover:text-amber-300 transition">1121 Royal Steam Basmati Rice (25kg)</Link></li>
              <li><Link href="/products/fresh-commercial-malai-paneer" className="hover:text-amber-300 transition">Fresh Malai Paneer (Cold Chain 5kg)</Link></li>
              <li><Link href="/products/unpolished-desi-toor-dal" className="hover:text-amber-300 transition">Unpolished Desi Toor Dal (30kg)</Link></li>
              <li><Link href="/products/danedar-pure-cow-ghee-15kg" className="hover:text-amber-300 transition">Bilona Pure Cow Ghee (15kg Tin)</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Platform & Trust</h4>
            <ul className="space-y-2 text-emerald-300">
              <li><Link href="/#about-us" className="hover:text-amber-300 transition">About Our Direct Supply Model</Link></li>
              <li><Link href="/#reels" className="hover:text-amber-300 transition">Kitchen Prep Stories & Reels</Link></li>
              <li><Link href="/#testimonials" className="hover:text-amber-300 transition">Chef & Restaurant Reviews</Link></li>
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
              <span className="font-mono font-bold">+91 98290 12345 (Orders Desk)</span>
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
};
