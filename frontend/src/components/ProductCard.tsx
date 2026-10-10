"use client";

import React, { useState } from "react";
import { 
  Plus, Minus, ShoppingBag, Sparkles, Clock, 
  MapPin, Eye, CheckCircle2 
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

interface ProductCardProps {
  product: Product;
  onAddToCart: (variantId: string, qty: number) => void;
  onSelectProduct: (product: Product) => void;
  lang: "EN" | "HI";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
  lang
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const [qty, setQty] = useState(selectedVariant?.moq || 1);
  const [added, setAdded] = useState(false);

  // Sync qty with variant MOQ when changing pack size
  const handleVariantChange = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening modal on pill click
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

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedVariant) return;
    onAddToCart(selectedVariant.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-3xl border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        {/* Product Image Container with Badges */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-white text-xs font-bold flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              Click to View Details & Specifications
            </span>
          </div>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg shadow-sm">
              {product.grade}
            </span>
            {product.is_perishable && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg shadow-sm">
                ❄️ Cold-Chain
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
            <MapPin className="w-3 h-3 text-amber-600" />
            <span>{product.origin}</span>
            <span>&bull;</span>
            <span className="text-slate-400 font-mono">HSN {product.hsn_code}</span>
          </div>

          <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-900 transition leading-snug">
            {lang === "HI" && product.name_hindi ? product.name_hindi : product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Pack Size Pills */}
          <div className="mt-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Select Pack Size:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={(e) => handleVariantChange(i, e)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                    i === selectedVariantIndex
                      ? "bg-emerald-900 text-white border-emerald-950 shadow-xs"
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
              <span className="font-bold flex items-center gap-1 mb-1 text-amber-950 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Bulk Tier Discounts:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {selectedVariant.slabs.map((s, idx) => (
                  <span key={idx} className="bg-white/90 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                    {s.min_qty}–{s.max_qty} {selectedVariant.unit}s: <strong className="text-emerald-900">₹{s.slab_price}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock & Expiry FEFO info */}
          <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 font-medium text-[11px]">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Shelf Life: {product.shelf_life_days}d
            </span>
            <span className={`font-bold text-[11px] ${selectedVariant?.in_stock ? "text-emerald-700" : "text-rose-600"}`}>
              {selectedVariant?.in_stock ? `✓ In Stock (${selectedVariant.available_stock})` : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="p-5 bg-slate-50/80 border-t border-slate-100 mt-2">
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-[10px] text-slate-500 font-medium block">
              Unit Rate ({product.gst_rate}% GST extra):
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-emerald-950 font-mono">
                ₹{effectiveUnitPrice.toLocaleString("en-IN")}
              </span>
              {isBulkDiscountApplied && (
                <span className="text-xs line-through text-slate-400 font-mono">
                  ₹{selectedVariant?.base_price}
                </span>
              )}
              <span className="text-xs text-slate-500">/{selectedVariant?.unit}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Subtotal</span>
            <span className="text-base font-black text-slate-900 font-mono">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Quantity Controls & Add Button */}
        <div className="flex items-center gap-2">
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center border border-slate-200 rounded-xl bg-white shadow-xs p-1"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQty(Math.max(selectedVariant?.moq || 1, qty - 1));
              }}
              disabled={qty <= (selectedVariant?.moq || 1)}
              className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 text-slate-700" />
            </button>
            <span className="px-3 font-bold text-sm text-slate-900 font-mono">
              {qty}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQty(qty + 1);
              }}
              className="p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={!selectedVariant?.in_stock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm ${
              added
                ? "bg-emerald-600 text-white"
                : selectedVariant?.in_stock
                ? "bg-emerald-900 hover:bg-emerald-800 text-white active:scale-98"
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
