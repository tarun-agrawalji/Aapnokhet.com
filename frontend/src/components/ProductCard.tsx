"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { inr, nextBetterSlab, unitLabel, unitPriceFor } from "@/lib/pricing";

interface ProductCardProps {
  product: Product;
  onAddToCart: (variantId: string, qty: number) => void;
}

/* "Sharbati Whole Wheat Atta (Chakki Fresh)" -> ["Sharbati Whole Wheat Atta", "Chakki Fresh"] */
export function splitName(name: string): [string, string | undefined] {
  const m = name.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? [m[1], m[2]] : [name, undefined];
}

export function QtyStepper({
  qty,
  min,
  onChange,
  label,
}: {
  qty: number;
  min: number;
  onChange: (q: number) => void;
  label: string;
}) {
  return (
    <div className="flex h-11 items-center rounded-full border border-line">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        aria-label={`Fewer ${label}`}
        className="flex h-11 w-10 items-center justify-center rounded-l-full text-ink transition-colors hover:bg-wash disabled:text-line disabled:hover:bg-transparent"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={1.8} />
      </button>
      <span className="tabular w-8 text-center text-[15px]" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label={`More ${label}`}
        className="flex h-11 w-10 items-center justify-center rounded-r-full text-ink transition-colors hover:bg-wash"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
      </button>
    </div>
  );
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex] ?? product.variants[0];
  const [qty, setQty] = useState(variant?.moq || 1);
  const [added, setAdded] = useState(false);

  const [title, qualifier] = splitName(product.name);
  const unitPrice = unitPriceFor(variant, qty);
  const discounted = variant && unitPrice < variant.base_price;
  const nextSlab = nextBetterSlab(variant, qty);
  const href = `/products/${product.slug}`;

  const selectVariant = (i: number) => {
    setVariantIndex(i);
    const v = product.variants[i];
    if (v && qty < v.moq) setQty(v.moq);
  };

  const add = () => {
    if (!variant) return;
    onAddToCart(variant.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="flex flex-col">
      <Link href={href} className="block overflow-hidden rounded-lg bg-wash" tabIndex={-1} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url}
          alt=""
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <Link href={href} className="group">
          <h3 className="font-display text-[21px] leading-[1.2] text-ink decoration-1 underline-offset-4 group-hover:underline">
            {title}
          </h3>
        </Link>
        {product.name_hindi && (
          <p lang="hi" className="font-hindi mt-1 text-[15px] text-muted">
            {product.name_hindi}
          </p>
        )}
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
          {qualifier ? `${qualifier}. ` : ""}
          From {product.origin.split(",")[0]}.
          {product.is_perishable ? " Travels chilled." : ""}
        </p>

        {product.variants.length > 1 && (
          <div role="radiogroup" aria-label="Pack size" className="mt-4 flex flex-wrap gap-1.5">
            {product.variants.map((v, i) => (
              <button
                key={v.id}
                role="radio"
                aria-checked={i === variantIndex}
                onClick={() => selectVariant(i)}
                className={`flex h-9 items-center rounded-full border px-3.5 text-[13px] sm:h-8 sm:px-3 transition-colors ${
                  i === variantIndex ? "border-ink bg-ink text-white" : "border-line text-ink-2 hover:border-ink"
                }`}
              >
                {v.pack_size}
              </button>
            ))}
          </div>
        )}
        {product.variants.length === 1 && variant && (
          <p className="mt-4 flex h-9 items-center text-[13px] text-muted sm:h-8">{variant.pack_size}</p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-between gap-3 border-t border-line pt-4">
            <p className="tabular text-[20px] leading-none">
              <span className={discounted ? "text-royal" : "text-ink"}>{inr(unitPrice)}</span>
              <span className="ml-1.5 text-[14px] text-muted">per {variant ? unitLabel(variant.unit) : "unit"}</span>
            </p>
            {discounted && variant && <s className="tabular text-[14px] text-muted">{inr(variant.base_price)}</s>}
          </div>
          <p className="mt-1.5 min-h-[20px] text-[13px] text-muted">
            {nextSlab && variant
              ? `${inr(nextSlab.slab_price)} each when you order ${nextSlab.min_qty} or more`
              : product.gst_rate > 0
                ? `Plus ${product.gst_rate}% GST`
                : "No GST on this item"}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <QtyStepper
              qty={qty}
              min={variant?.moq || 1}
              onChange={setQty}
              label={variant ? unitLabel(variant.unit, 2) : "units"}
            />
            <button
              onClick={add}
              disabled={!variant?.in_stock}
              className="relative h-11 flex-1 overflow-hidden rounded-full bg-ink px-4 text-[14px] text-white transition-colors hover:bg-ink-2 disabled:bg-line disabled:text-muted"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? "added" : "add"}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  {!variant?.in_stock ? "Out of stock" : added ? `Added ${qty} to order` : `Add ${inr(unitPrice * qty)}`}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
