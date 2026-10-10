"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, Award, Plus, Minus, ShoppingBag, 
  ChevronRight, Sparkles, AlertCircle, Clock
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
  variants: Variant[];
  purity_certificate?: any;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (variantId: string, qty: number) => void;
  onOpenReport: (report: any, name: string) => void;
  lang: "EN" | "HI";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenReport,
  lang
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const [qty, setQty] = useState(selectedVariant?.moq || 1);
  const [added, setAdded] = useState(false);

  // Sync qty with variant MOQ when changing pack size
  const handleVariantChange = (index: number) => {
    setSelectedVariantIndex(index);
    const newVar = product.variants[index];
    if (newVar && qty < newVar.moq) {
      setQty(newVar.moq);
    }
  };

  // Compute live price based on current quantity and bulk slabs
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
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100/80 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Badges */}
        <div className="p-4 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
              {product.grade}
            </span>
            {product.is_perishable && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                ❄️ Cold-Chain
              </span>
            )}
          </div>

          {product.purity_certificate && (
            <button
              onClick={() => onOpenReport(product.purity_certificate, product.name)}
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 transition cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Lab Report</span>
            </button>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4">
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1">
            {product.origin} &bull; HSN {product.hsn_code}
          </p>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition leading-snug">
            {lang === "HI" && product.name_hindi ? product.name_hindi : product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Pack Size Pills */}
          <div className="mt-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select Pack Size:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => handleVariantChange(i)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                    i === selectedVariantIndex
                      ? "bg-emerald-800 text-white border-emerald-900 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {v.pack_size}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Tier Slab Hints */}
          {selectedVariant && selectedVariant.slabs.length > 0 && (
            <div className="mt-3 bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900">
              <span className="font-bold flex items-center gap-1 mb-1 text-amber-950">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Volume Bulk Slabs:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {selectedVariant.slabs.map((s, idx) => (
                  <span key={idx} className="bg-white/80 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                    {s.min_qty}–{s.max_qty} {selectedVariant.unit}s: <strong className="text-emerald-800">₹{s.slab_price}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock & Expiry FEFO info */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Shelf Life: {product.shelf_life_days} days
            </span>
            <span className={`font-bold ${selectedVariant?.in_stock ? "text-emerald-700" : "text-rose-600"}`}>
              {selectedVariant?.in_stock ? `✓ In Stock (${selectedVariant.available_stock} packs)` : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 mt-2">
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Unit Rate ({product.gst_rate}% GST extra):
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-emerald-950">
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
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
            <span className="text-base font-black text-slate-900">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Quantity Controls & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-xs p-1">
            <button
              onClick={() => setQty(Math.max(selectedVariant?.moq || 1, qty - 1))}
              disabled={qty <= (selectedVariant?.moq || 1)}
              className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 text-slate-700" />
            </button>
            <span className="px-3 font-bold text-sm text-slate-900 font-mono">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={!selectedVariant?.in_stock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm ${
              added
                ? "bg-emerald-600 text-white"
                : selectedVariant?.in_stock
                ? "bg-emerald-800 hover:bg-emerald-900 text-white active:scale-98"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>{added ? "Added ✓" : `Add (MOQ: ${selectedVariant?.moq})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
