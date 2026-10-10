"use client";

import React, { useState, useEffect } from "react";
import { 
  X, ShoppingBag, Plus, Minus, Check, Sparkles, 
  MapPin, ShieldCheck, Clock, Box, Building2, Star 
} from "lucide-react";

interface Variant {
  id: string;
  sku: string;
  pack_size: string;
  unit: string;
  base_price: number;
  moq: number;
  available_stock: number;
  in_stock: boolean;
  slabs: Array<{ min_qty: number; max_qty: number; slab_price: number }>;
}

interface Product {
  id: string;
  name: string;
  name_hindi?: string;
  slug: string;
  brand: string;
  hsn_code: string;
  gst_rate: number;
  origin: string;
  grade: string;
  description: string;
  shelf_life_days: number;
  is_perishable: boolean;
  image_url: string;
  variants: Variant[];
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (variantId: string, qty: number) => void;
  lang: "EN" | "HI";
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  lang
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  // Sync initial MOQ when product or selectedVariant changes
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const currentVar = product.variants[selectedVariantIndex] || product.variants[0];
      if (currentVar) {
        setQty(currentVar.moq || 1);
      }
    }
  }, [product, selectedVariantIndex]);

  // Reset variant index when product changes or opens
  useEffect(() => {
    if (isOpen) {
      setSelectedVariantIndex(0);
      setAdded(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const handleVariantChange = (idx: number) => {
    setSelectedVariantIndex(idx);
    const newVar = product.variants[idx];
    if (newVar && qty < newVar.moq) {
      setQty(newVar.moq);
    }
  };

  const getEffectiveUnitPrice = () => {
    if (!selectedVariant) return 0;
    const matchingSlab = selectedVariant.slabs.find(
      (s) => qty >= s.min_qty && qty <= s.max_qty
    );
    return matchingSlab ? matchingSlab.slab_price : selectedVariant.base_price;
  };

  const effectiveUnitPrice = getEffectiveUnitPrice();
  const totalPrice = effectiveUnitPrice * qty;
  const isBulkDiscountApplied = selectedVariant && effectiveUnitPrice < selectedVariant.base_price;

  const handleAdd = () => {
    if (!selectedVariant) return;
    onAddToCart(selectedVariant.id, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-amber-200/80 overflow-hidden relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-full flex items-center justify-center shadow-md transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image & Badges */}
          <div className="relative bg-gradient-to-b from-amber-50/60 to-emerald-50/40 p-6 flex flex-col items-center justify-center min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-slate-100">
            <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-900/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg shadow-sm">
                  {product.grade}
                </span>
                {product.is_perishable && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-sky-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg shadow-sm">
                    ❄️ Cold-Chain 4°C
                  </span>
                )}
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="mt-5 w-full grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="bg-white/80 p-2 rounded-xl border border-slate-100 text-center font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto mb-0.5" />
                <span>100% Direct Stock</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-slate-100 text-center font-medium">
                <Clock className="w-4 h-4 text-emerald-700 mx-auto mb-0.5" />
                <span>Shelf Life: {product.shelf_life_days}d</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{product.origin}</span>
                <span>&bull;</span>
                <span className="text-slate-500 font-mono">HSN {product.hsn_code}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1 leading-snug">
                {lang === "HI" && product.name_hindi ? product.name_hindi : product.name}
              </h2>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Pack Size Pills */}
              <div className="mt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Available Pack Sizes:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => handleVariantChange(i)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition cursor-pointer ${
                        i === selectedVariantIndex
                          ? "bg-emerald-900 text-white border-emerald-950 shadow-sm"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {v.pack_size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Tier Slabs Box */}
              {selectedVariant && selectedVariant.slabs.length > 0 && (
                <div className="mt-4 bg-amber-50/90 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950">
                  <div className="flex items-center gap-1 font-bold text-xs text-amber-900 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Commercial Wholesale Slabs:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {selectedVariant.slabs.map((s, idx) => (
                      <div key={idx} className="bg-white/90 p-1.5 rounded-lg border border-amber-200/80 font-medium flex justify-between">
                        <span>{s.min_qty}–{s.max_qty} {selectedVariant.unit}s:</span>
                        <strong className="text-emerald-900 font-bold">₹{s.slab_price}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Availability */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                <span className="font-mono text-[11px] text-slate-500">
                  SKU: {selectedVariant?.sku}
                </span>
                <span className={`font-bold ${selectedVariant?.in_stock ? "text-emerald-700" : "text-rose-600"}`}>
                  {selectedVariant?.in_stock ? `✓ In Stock (${selectedVariant.available_stock} packs)` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Price & Add to Cart Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Commercial Rate ({product.gst_rate}% GST extra):
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-950 font-mono">
                      ₹{effectiveUnitPrice.toLocaleString("en-IN")}
                    </span>
                    {isBulkDiscountApplied && (
                      <span className="text-xs line-through text-slate-400">
                        ₹{selectedVariant?.base_price}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">/{selectedVariant?.unit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Order Subtotal</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Counter & Action Button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQty(Math.max(selectedVariant?.moq || 1, qty - 1))}
                    disabled={qty <= (selectedVariant?.moq || 1)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white disabled:opacity-30 transition cursor-pointer text-slate-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3.5 font-black text-sm text-slate-900 font-mono">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white transition cursor-pointer text-slate-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!selectedVariant?.in_stock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
                    added
                      ? "bg-emerald-600 text-white"
                      : selectedVariant?.in_stock
                      ? "bg-emerald-900 hover:bg-emerald-800 text-white active:scale-98"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>{added ? "Added To Cart ✓" : `Add (MOQ: ${selectedVariant?.moq})`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
