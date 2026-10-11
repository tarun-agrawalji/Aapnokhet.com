"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";
import { inr, unitLabel } from "@/lib/pricing";
import { QtyStepper, splitName } from "@/components/ProductCard";

interface OrderResult {
  order_no: string;
  invoice_no: string;
  grand_total: number;
  payment_mode: "CREDIT" | "ONLINE_UPI";
  slot: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  onRemoveItem: (id: string) => void;
  onCheckoutSuccess: (orderInfo: OrderResult) => void;
}

const FREE_DELIVERY_FROM = 3000;
const DELIVERY_FEE = 150;
const SLOTS = [
  { id: "early", label: "6:00 to 9:30 AM", note: "Before breakfast service" },
  { id: "mid", label: "10:00 AM to 1:00 PM", note: "Before lunch service" },
  { id: "late", label: "3:00 to 6:00 PM", note: "Before dinner service" },
];

function Choice({
  name,
  checked,
  onChange,
  title,
  note,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  note: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors ${
        checked ? "border-ink" : "border-line hover:border-ink-2"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="mt-1 accent-[#1f3fd1]" />
      <span>
        <span className="block text-[14px] text-ink">{title}</span>
        <span className="block text-[13px] text-muted">{note}</span>
      </span>
    </label>
  );
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  taxTotal,
  grandTotal,
  onRemoveItem,
  onCheckoutSuccess,
}) => {
  const { updateQty, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"CREDIT" | "ONLINE_UPI">("CREDIT");
  const [slot, setSlot] = useState(SLOTS[0].id);
  const [result, setResult] = useState<OrderResult | null>(null);

  const deliveryFee = subtotal >= FREE_DELIVERY_FROM || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = grandTotal + deliveryFee;
  const slotLabel = SLOTS.find((s) => s.id === slot)?.label ?? "";

  useEffect(() => {
    if (!isOpen) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const close = () => {
    onClose();
    if (result) setTimeout(() => setResult(null), 300);
  };

  // Checkout is still simulated here; the backend /orders/checkout endpoint is not wired in yet.
  const placeOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const r: OrderResult = {
        order_no: `AK-2610-${Math.floor(100000 + Math.random() * 900000)}`,
        invoice_no: `INV/26-10/${Math.floor(1000 + Math.random() * 9000)}`,
        grand_total: total,
        payment_mode: paymentMode,
        slot: slotLabel,
      };
      setResult(r);
      setPlacing(false);
      clearCart();
      onCheckoutSuccess(r);
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your order">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex h-dvh w-full max-w-[440px] flex-col bg-paper"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-6">
              <h2 className="font-display text-[22px]">{result ? "Order placed" : "Your order"}</h2>
              <button onClick={close} aria-label="Close" className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-wash">
                <X className="h-5 w-5" strokeWidth={1.6} />
              </button>
            </div>

            {result ? (
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <p className="text-[15px] leading-relaxed text-ink-2">
                  We have your order. It will reach your kitchen between {result.slot.toLowerCase()} on the delivery day,
                  and the driver will ask for a one-time code when they arrive.
                </p>
                <dl className="mt-8 divide-y divide-line border-y border-line text-[14px]">
                  {[
                    ["Order number", result.order_no],
                    ["Tax invoice", result.invoice_no],
                    ["Payment", result.payment_mode === "CREDIT" ? "On 15-day credit" : "Paid by UPI"],
                    ["Total", inr(result.grand_total, 2)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-3">
                      <dt className="text-muted">{k}</dt>
                      <dd className="tabular text-right text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <button onClick={close} className="mt-8 h-12 w-full rounded-full bg-ink text-[15px] text-white hover:bg-ink-2">
                  Keep browsing
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center px-6 pb-16">
                <p className="font-display text-[26px] leading-tight">Nothing here yet.</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                  Add atta, rice, dal or dairy from the supplies list. Orders placed by 10 PM arrive the next morning.
                </p>
                <Link href="/#supplies" onClick={close} className="mt-6 self-start rounded-full bg-ink px-5 py-3 text-[14px] text-white hover:bg-ink-2">
                  See supplies
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  <ul className="divide-y divide-line">
                    {items.map((it) => {
                      const [title] = splitName(it.product_name);
                      return (
                        <motion.li key={it.id} layout className="py-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[15px] text-ink">{title}</p>
                              <p className="mt-0.5 text-[13px] text-muted">
                                {it.pack_size}, {inr(it.unit_price)} per {unitLabel(it.unit)}
                              </p>
                            </div>
                            <p className="tabular shrink-0 text-[15px]">{inr(it.subtotal)}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <QtyStepper qty={it.qty} min={1} onChange={(q) => updateQty(it.id, q)} label={unitLabel(it.unit, 2)} />
                            <button onClick={() => onRemoveItem(it.id)} className="text-[13px] text-muted underline-offset-4 hover:text-ink hover:underline">
                              Remove
                            </button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>

                  <fieldset className="mt-4 border-t border-line pt-6">
                    <legend className="text-[14px] text-ink">Delivery time</legend>
                    <div className="mt-3 space-y-2">
                      {SLOTS.map((s) => (
                        <Choice key={s.id} name="slot" checked={slot === s.id} onChange={() => setSlot(s.id)} title={s.label} note={s.note} />
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-6 pb-6">
                    <legend className="text-[14px] text-ink">Payment</legend>
                    <div className="mt-3 space-y-2">
                      <Choice
                        name="pay"
                        checked={paymentMode === "CREDIT"}
                        onChange={() => setPaymentMode("CREDIT")}
                        title="Pay in 15 days"
                        note="Added to your credit account, settle by bank transfer"
                      />
                      <Choice
                        name="pay"
                        checked={paymentMode === "ONLINE_UPI"}
                        onChange={() => setPaymentMode("ONLINE_UPI")}
                        title="Pay now by UPI"
                        note="Any UPI app, confirmed instantly"
                      />
                    </div>
                  </fieldset>
                </div>

                <div className="border-t border-line px-6 pb-[calc(24px+env(safe-area-inset-bottom))] pt-4">
                  <dl className="space-y-1.5 text-[14px]">
                    <div className="flex justify-between">
                      <dt className="text-muted">Items</dt>
                      <dd className="tabular">{inr(subtotal, 2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">GST</dt>
                      <dd className="tabular">{inr(taxTotal, 2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Delivery</dt>
                      <dd className="tabular">{deliveryFee ? inr(deliveryFee, 2) : "Free"}</dd>
                    </div>
                    <div className="flex justify-between pt-2 text-[17px]">
                      <dt>Total</dt>
                      <dd className="tabular">{inr(total, 2)}</dd>
                    </div>
                  </dl>
                  {deliveryFee > 0 && (
                    <p className="mt-2 text-[13px] text-royal">
                      Add {inr(FREE_DELIVERY_FROM - subtotal)} more for free delivery.
                    </p>
                  )}
                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="mt-4 h-12 w-full rounded-full bg-ink text-[15px] text-white transition-colors hover:bg-ink-2 disabled:bg-ink-2"
                  >
                    {placing ? "Placing order…" : `Place order, ${inr(total)}`}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
