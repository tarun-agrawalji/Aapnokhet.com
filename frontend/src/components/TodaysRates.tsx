"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { PRODUCTS } from "@/data/products";
import { splitName } from "@/components/ProductCard";
import { inr, unitLabel } from "@/lib/pricing";

const noop = () => () => {};
const todayLabel = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long" });

/* The day's price list a kitchen buyer checks before ordering, one row per staple. */
export function TodaysRates() {
  const date = useSyncExternalStore(noop, todayLabel, () => "");

  return (
    <div className="rounded-xl border border-line p-5 sm:p-7">
      <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-4">
        <h2 className="font-display text-[24px] leading-none">Today&apos;s rates</h2>
        <p className="min-h-[20px] text-[14px] text-muted">{date}</p>
      </div>

      <ul className="divide-y divide-line">
        {PRODUCTS.map((p, i) => {
          const v = p.variants[0];
          if (!v) return null;
          const best = [...v.slabs].sort((a, b) => a.slab_price - b.slab_price)[0];
          const [title] = splitName(p.name);
          return (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/products/${p.slug}`} className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 py-4">
                <span className="min-w-0">
                  <span className="block text-[16px] leading-snug text-ink underline-offset-4 group-hover:underline">{title}</span>
                  <span className="mt-0.5 block text-[13px] text-muted">{v.pack_size}</span>
                </span>
                <span className="text-right">
                  <span className="tabular block text-[17px] text-ink">{inr(v.base_price)}</span>
                  {best && best.slab_price < v.base_price && (
                    <span className="tabular mt-0.5 block text-[13px] text-royal">
                      {inr(best.slab_price)} for {best.min_qty}+ {unitLabel(v.unit, 2)}
                    </span>
                  )}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      <p className="border-t border-line pt-4 text-[13px] text-muted">Per pack, before GST. Larger orders get the lower rate automatically.</p>
    </div>
  );
}
