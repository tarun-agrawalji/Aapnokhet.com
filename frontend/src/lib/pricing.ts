import type { Variant } from "@/data/products";

export function unitPriceFor(variant: Variant | undefined, qty: number): number {
  if (!variant) return 0;
  const slab = variant.slabs.find((s) => qty >= s.min_qty && qty <= s.max_qty);
  return slab ? slab.slab_price : variant.base_price;
}

/* The next slab that would lower the price, if any. */
export function nextBetterSlab(variant: Variant | undefined, qty: number) {
  if (!variant) return undefined;
  const current = unitPriceFor(variant, qty);
  return variant.slabs
    .filter((s) => s.min_qty > qty && s.slab_price < current)
    .sort((a, b) => a.min_qty - b.min_qty)[0];
}

export function inr(amount: number, fractionDigits = 0): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function unitLabel(unit: string, qty = 1): string {
  const u = unit.toLowerCase();
  return qty === 1 ? u : `${u}s`;
}
