"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { BuyerDashboard } from "@/components/BuyerDashboard";
import { TodaysRates } from "@/components/TodaysRates";
import { HowOrdering, QualityReport, Voices, SiteFooter } from "@/components/HomeSections";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "flour", label: "Atta and flour" },
  { slug: "rice", label: "Rice" },
  { slug: "pulses", label: "Dal" },
  { slug: "dairy", label: "Dairy and ghee" },
];

const PROMISES = [
  { title: "Delivered by 6 AM", body: "Order by 10 PM and it reaches your kitchen before prep the next morning." },
  { title: "15 days to pay", body: "A credit account opens once your GSTIN and FSSAI licence are verified." },
  { title: "Lab-tested batches", body: "Moisture, purity and pesticide checks on every lot before it ships." },
  { title: "GST invoice each time", body: "HSN-wise tax split on every order, ready for your accountant." },
];

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Home() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);

  const { items, addToCart, removeItem, isCartOpen, setIsCartOpen, subtotal, taxTotal, grandTotal, totalItemCount } = useCart();

  const handleReorder = () => {
    addToCart("var-01", 2);
    addToCart("var-03", 1);
    setShowDashboard(false);
    setIsCartOpen(true);
  };

  const q = query.trim().toLowerCase();
  const products = PRODUCTS.filter(
    (p) =>
      (category === "all" || p.category_slug === category) &&
      (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.name_hindi ?? "").includes(query.trim()))
  );

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar
        cartCount={totalItemCount}
        openCart={() => setIsCartOpen(true)}
        onToggleDashboard={() => {
          setShowDashboard((v) => !v);
          setTimeout(() => document.getElementById("supplies")?.scrollIntoView(), 50);
        }}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-6">
            <motion.h1
              custom={0}
              initial="hidden"
              animate="show"
              variants={rise}
              className="font-display text-balance text-[44px] leading-[1.03] tracking-[-0.02em] sm:text-[58px] lg:text-[62px]"
            >
              Staples for kitchens that cook every day.
            </motion.h1>
            <motion.p
              custom={1}
              initial="hidden"
              animate="show"
              variants={rise}
              className="mt-7 max-w-[44ch] text-[17px] leading-relaxed text-ink-2"
            >
              Stone-milled atta, aged basmati, unpolished dal and chilled dairy, sent from our Jaipur warehouse to your back door. Every
              batch is lab-tested. Pay in 15 days, with a GST invoice for each order.
            </motion.p>
            <motion.div custom={2} initial="hidden" animate="show" variants={rise} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#supplies" className="rounded-full bg-ink px-6 py-3.5 text-[15px] text-white transition-colors hover:bg-ink-2">
                See today&apos;s prices
              </a>
              <Link href="/login?tab=register" className="text-[15px] text-ink underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:decoration-ink">
                Open a business account
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <TodaysRates />
          </div>
        </section>

        {/* What you can count on */}
        <section aria-label="What you can count on" className="border-y border-line">
          <dl className="mx-auto grid max-w-[1240px] grid-cols-1 divide-y divide-line px-4 sm:grid-cols-2 sm:divide-y-0 sm:px-6 lg:grid-cols-4 lg:divide-x lg:px-10">
            {PROMISES.map((p, i) => (
              <div key={p.title} className={`py-7 sm:py-9 lg:px-7 ${i === 0 ? "lg:pl-0" : ""} ${i === PROMISES.length - 1 ? "lg:pr-0" : ""}`}>
                <dt className="text-[16px] text-ink">{p.title}</dt>
                <dd className="mt-1.5 max-w-[36ch] text-[14px] leading-relaxed text-muted">{p.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Supplies */}
        <section id="supplies" className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
          <AnimatePresence>
            {showDashboard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <BuyerDashboard onReorder={handleReorder} onClose={() => setShowDashboard(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-[34px] leading-[1.1] tracking-[-0.01em] sm:text-[44px]">Supplies</h2>
              <p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">
                Prices are per pack and fall automatically at bulk quantities. Change the pack size or count on any item to see yours.
              </p>
            </div>
            <label className="relative block w-full md:w-80">
              <span className="sr-only">Search supplies</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.6} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search atta, basmati, paneer"
                className="h-11 w-full rounded-full border border-line bg-paper pl-11 pr-4 text-[16px] outline-none transition-colors placeholder:text-muted focus:border-ink"
              />
            </label>
          </div>

          <div role="tablist" aria-label="Categories" className="no-scrollbar -mx-4 mt-10 flex gap-7 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((c) => {
              const active = category === c.slug;
              return (
                <button
                  key={c.slug}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(c.slug)}
                  className={`relative whitespace-nowrap pb-3.5 text-[15px] transition-colors ${active ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {c.label}
                  {active && (
                    <motion.span layoutId="category-underline" className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
                  )}
                </button>
              );
            })}
          </div>

          {products.length > 0 ? (
            <motion.div layout className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {products.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard product={p} onAddToCart={addToCart} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="mt-12 max-w-[48ch]">
              <p className="text-[17px] text-ink">Nothing matches &ldquo;{query}&rdquo;.</p>
              <p className="mt-2 text-[15px] text-ink-2">
                Try a simpler word like atta, rice or ghee, or{" "}
                <button onClick={() => { setQuery(""); setCategory("all"); }} className="underline underline-offset-4">
                  show all supplies
                </button>
                .
              </p>
            </div>
          )}
        </section>

        <HowOrdering />
        <QualityReport />
        <Voices />
      </main>

      <SiteFooter />

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
}
