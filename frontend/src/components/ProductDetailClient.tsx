"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard, QtyStepper, splitName } from "@/components/ProductCard";
import { SiteFooter } from "@/components/HomeSections";
import { useCart } from "@/context/CartContext";
import { Product, getRelatedProducts } from "@/data/products";
import { inr, nextBetterSlab, unitLabel, unitPriceFor } from "@/lib/pricing";

interface ProductDetailClientProps {
  product: Product;
}

const CATEGORY_LABEL: Record<string, string> = {
  flour: "Atta and flour",
  rice: "Rice",
  pulses: "Dal",
  dairy: "Dairy and ghee",
};

function shelfLife(days: number) {
  if (days >= 365) return `${Math.round(days / 365)} ${days >= 730 ? "years" : "year"}`;
  if (days >= 60) return `${Math.round(days / 30)} months`;
  return `${days} days`;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const { items, addToCart, removeItem, isCartOpen, setIsCartOpen, subtotal, taxTotal, grandTotal, totalItemCount } = useCart();

  const [variantIndex, setVariantIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(product.variants[0]?.moq || 1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [buyRowVisible, setBuyRowVisible] = useState(true);
  const buyRowRef = useRef<HTMLDivElement>(null);

  // On phones, pin a compact add bar once the main add button scrolls out of view.
  useEffect(() => {
    const el = buyRowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBuyRowVisible(e.isIntersecting || e.boundingClientRect.top > 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variant = product.variants[variantIndex] ?? product.variants[0];
  const [title, qualifier] = splitName(product.name);
  const unitPrice = unitPriceFor(variant, qty);
  const itemsTotal = unitPrice * qty;
  const gst = (itemsTotal * product.gst_rate) / 100;
  const saved = variant ? (variant.base_price - unitPrice) * qty : 0;
  const nextSlab = nextBetterSlab(variant, qty);
  const gallery = product.gallery.length ? product.gallery : [product.image_url];
  const unit = variant ? unitLabel(variant.unit) : "unit";
  const units = variant ? unitLabel(variant.unit, 2) : "units";

  const selectVariant = (i: number) => {
    setVariantIndex(i);
    const v = product.variants[i];
    if (v && qty < v.moq) setQty(v.moq);
  };

  const add = () => {
    if (!variant) return;
    addToCart(variant.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex min-h-screen flex-col bg-paper ${buyRowVisible ? "" : "pb-[76px] lg:pb-0"}`}>
      <Navbar cartCount={totalItemCount} openCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        <div className="mx-auto max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-4 text-[14px] text-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/#supplies" className="hover:text-ink">Supplies</Link>
              </li>
              <li aria-hidden>/</li>
              <li>{CATEGORY_LABEL[product.category_slug] ?? product.category_name}</li>
            </ol>
            <button onClick={copyLink} className="hover:text-ink">
              {copied ? "Link copied" : "Copy link"}
            </button>
          </nav>
        </div>

        <section className="mx-auto grid max-w-[1240px] gap-10 px-4 pb-24 pt-6 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-10">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-lg bg-wash">
              <AnimatePresence mode="wait" initial={false}>
                { }
                <motion.img
                  key={gallery[imageIndex]}
                  src={gallery[imageIndex]}
                  alt={`${title}, photo ${imageIndex + 1} of ${gallery.length}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                />
              </AnimatePresence>
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-3">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setImageIndex(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === imageIndex}
                    className={`overflow-hidden rounded-md transition-opacity ${i === imageIndex ? "opacity-100 ring-1 ring-ink ring-offset-2" : "opacity-60 hover:opacity-100"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h1 className="font-display text-[38px] leading-[1.08] tracking-[-0.015em] sm:text-[46px]">{title}</h1>
              {product.name_hindi && (
                <p lang="hi" className="font-hindi mt-2 text-[18px] text-muted">
                  {product.name_hindi}
                </p>
              )}
              <p className="mt-5 text-[16px] leading-relaxed text-ink-2">{product.description}</p>

              {product.variants.length > 1 && (
                <fieldset className="mt-8">
                  <legend className="text-[14px] text-ink">Pack size</legend>
                  <div role="radiogroup" className="mt-3 flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.id}
                        role="radio"
                        aria-checked={i === variantIndex}
                        onClick={() => selectVariant(i)}
                        className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${
                          i === variantIndex ? "border-ink bg-ink text-white" : "border-line text-ink-2 hover:border-ink"
                        }`}
                      >
                        {v.pack_size}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {variant && variant.slabs.length > 0 && (
                <div className="mt-8">
                  <p className="text-[14px] text-ink">Price per {unit}</p>
                  <table className="mt-3 w-full text-[15px]">
                    <tbody className="divide-y divide-line border-y border-line">
                      {variant.slabs.map((s) => {
                        const active = qty >= s.min_qty && qty <= s.max_qty;
                        return (
                          <tr key={s.min_qty} className="relative">
                            <td className={`py-3 pl-4 transition-colors ${active ? "text-royal" : "text-ink-2"}`}>
                              {active && <motion.span layoutId="slab-marker" className="absolute inset-y-2 left-0 w-[2px] bg-royal" />}
                              {s.min_qty} to {s.max_qty} {unitLabel(variant.unit, 2)}
                            </td>
                            <td className={`tabular py-3 text-right transition-colors ${active ? "text-royal" : "text-ink"}`}>{inr(s.slab_price)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div ref={buyRowRef} className="mt-8 flex items-center gap-3">
                <QtyStepper qty={qty} min={variant?.moq || 1} onChange={setQty} label={units} />
                <button
                  onClick={add}
                  disabled={!variant?.in_stock}
                  className="relative h-11 flex-1 overflow-hidden rounded-full bg-ink px-5 text-[15px] text-white transition-colors hover:bg-ink-2 disabled:bg-line disabled:text-muted"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={added ? "y" : "n"}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="block"
                    >
                      {!variant?.in_stock ? "Out of stock" : added ? "Added to your order" : "Add to order"}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>

              <dl className="mt-5 space-y-1.5 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-muted">
                    {qty} {unitLabel(variant?.unit ?? "unit", qty)} at {inr(unitPrice)}
                  </dt>
                  <dd className="tabular">{inr(itemsTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">GST at {product.gst_rate}%</dt>
                  <dd className="tabular">{inr(gst, 2)}</dd>
                </div>
                <div className="flex justify-between pt-1.5 text-[16px]">
                  <dt>Total</dt>
                  <dd className="tabular">{inr(itemsTotal + gst, 2)}</dd>
                </div>
              </dl>
              <p className="mt-3 min-h-[20px] text-[13px] text-royal">
                {saved > 0
                  ? `You save ${inr(saved)} at this quantity.`
                  : nextSlab
                    ? `Order ${nextSlab.min_qty} or more and each ${unit} drops to ${inr(nextSlab.slab_price)}.`
                    : ""}
              </p>

              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6 text-[14px]">
                <div>
                  <dt className="text-muted">Shelf life</dt>
                  <dd className="mt-1 text-ink">{shelfLife(product.shelf_life_days)}</dd>
                </div>
                <div>
                  <dt className="text-muted">In stock</dt>
                  <dd className="tabular mt-1 text-ink">
                    {variant?.available_stock ?? 0} {units}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">HSN code</dt>
                  <dd className="tabular mt-1 text-ink">{product.hsn_code}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-[1240px] gap-14 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-10">
            <div className="lg:col-span-5">
              <h2 className="font-display text-[30px] leading-[1.15] sm:text-[36px]">
                {qualifier ? `${qualifier}, from ${product.origin.split(",")[0]}` : `From ${product.origin.split(",")[0]}`}
              </h2>
              <p className="mt-6 max-w-[60ch] text-[16px] leading-[1.75] text-ink-2">{product.full_description}</p>

              {product.culinary_uses.length > 0 && (
                <>
                  <h3 className="mt-12 text-[16px] text-ink">Kitchens use it for</h3>
                  <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
                    {product.culinary_uses.map((u) => (
                      <li key={u} className="border-l border-line pl-4">
                        {u}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <h3 className="text-[16px] text-ink">Specifications</h3>
              <dl className="mt-3 divide-y divide-line border-y border-line text-[15px]">
                {product.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-5 gap-4 py-3.5">
                    <dt className="col-span-2 text-muted">{s.label}</dt>
                    <dd className="col-span-3 text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>

              {product.certifications.length > 0 && (
                <>
                  <h3 className="mt-12 text-[16px] text-ink">What we check on every batch</h3>
                  <ul className="mt-3 grid gap-x-6 gap-y-2 text-[15px] text-ink-2 sm:grid-cols-2">
                    {product.certifications.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6 lg:px-10">
            <h2 className="font-display text-[30px] leading-[1.15] sm:text-[36px]">Often ordered with it</h2>
            <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {getRelatedProducts(product.id, 3).map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <AnimatePresence>
        {!buyRowVisible && variant?.in_stock && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] text-ink">{title}</p>
                <p className="tabular text-[13px] text-muted">
                  {qty} × {inr(unitPrice)}, {variant.pack_size}
                </p>
              </div>
              <button onClick={add} className="h-11 shrink-0 rounded-full bg-ink px-5 text-[15px] text-white">
                {added ? "Added" : `Add ${inr(itemsTotal)}`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        subtotal={subtotal}
        taxTotal={taxTotal}
        grandTotal={grandTotal}
        onRemoveItem={removeItem}
        onCheckoutSuccess={() => {}}
      />
    </div>
  );
};
