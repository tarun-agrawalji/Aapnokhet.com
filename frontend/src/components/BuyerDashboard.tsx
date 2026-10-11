"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { inr } from "@/lib/pricing";

interface BuyerDashboardProps {
  onReorder: (orderId: string) => void;
  onClose?: () => void;
}

const CREDIT_LIMIT = 250000;
const OUTSTANDING = 8925;

const ORDERS = [
  {
    id: "ord-01",
    order_no: "AK-2610-883921",
    date: "10 Oct 2026",
    slot: "6:00 to 9:30 AM",
    status: "On the way",
    items: [
      { name: "Sharbati whole wheat atta", pack: "50 kg bag", qty: 2, price: 3560 },
      { name: "1121 steam basmati rice", pack: "25 kg sack", qty: 1, price: 2450 },
      { name: "Malai paneer", pack: "5 kg block", qty: 1, price: 1650 },
    ],
    grand_total: 8925,
    invoice_no: "INV/26-10/4521",
  },
  {
    id: "ord-02",
    order_no: "AK-2610-771920",
    date: "3 Oct 2026",
    slot: "6:00 to 9:30 AM",
    status: "Delivered",
    items: [
      { name: "Unpolished toor dal", pack: "30 kg bag", qty: 1, price: 4350 },
      { name: "Danedar cow ghee", pack: "15 kg tin", qty: 1, price: 9750 },
    ],
    grand_total: 14100,
    invoice_no: "INV/26-10/3811",
  },
];

const LEDGER = [
  { date: "10 Oct 2026", desc: "Invoice INV/26-10/4521", debit: 8925, credit: 0, balance: 8925 },
  { date: "5 Oct 2026", desc: "Bank transfer received, UTR9988221", debit: 0, credit: 14100, balance: 0 },
  { date: "3 Oct 2026", desc: "Invoice INV/26-10/3811", debit: 14100, credit: 0, balance: 14100 },
];

const TABS = [
  { id: "orders", label: "Recent orders" },
  { id: "ledger", label: "Credit account" },
] as const;

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onReorder, onClose }) => {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("orders");
  const usedPct = (OUTSTANDING / CREDIT_LIMIT) * 100;

  return (
    <div className="mb-20 rounded-xl border border-line p-6 sm:p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="font-display text-[28px] leading-tight">Rawat Mishthan Bhandar</h2>
          <p className="mt-1.5 text-[14px] text-muted">Station Road outlet, GSTIN 08AABCR1234F1Z1</p>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Close orders and credit" className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-wash">
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        )}
      </div>

      <div className="mt-8 max-w-xl">
        <div className="flex items-baseline justify-between text-[14px]">
          <span className="text-ink-2">
            <span className="tabular text-[20px] text-ink">{inr(CREDIT_LIMIT - OUTSTANDING)}</span> available to spend
          </span>
          <span className="tabular text-muted">of {inr(CREDIT_LIMIT)}</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-wash" role="img" aria-label={`${Math.round(usedPct)}% of credit used`}>
          <motion.div
            className="h-full rounded-full bg-ink"
            initial={{ width: 0 }}
            animate={{ width: `${usedPct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>
        <p className="mt-2 text-[13px] text-muted">{inr(OUTSTANDING)} due by 25 October. Payment terms are 15 days from each invoice.</p>
      </div>

      <div role="tablist" className="mt-10 flex gap-7 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`relative pb-3 text-[15px] transition-colors ${tab === t.id ? "text-ink" : "text-muted hover:text-ink"}`}
          >
            {t.label}
            {tab === t.id && <motion.span layoutId="dash-underline" className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" />}
          </button>
        ))}
      </div>

      {tab === "orders" ? (
        <ul className="divide-y divide-line">
          {ORDERS.map((o) => (
            <li key={o.id} className="grid gap-4 py-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="text-[15px] text-ink">{o.date}</p>
                <p className="mt-1 text-[13px] text-muted">
                  {o.order_no}, {o.slot}
                </p>
                <p className={`mt-2 text-[13px] ${o.status === "Delivered" ? "text-muted" : "text-royal"}`}>{o.status}</p>
              </div>
              <ul className="space-y-1 text-[14px] text-ink-2 md:col-span-5">
                {o.items.map((it) => (
                  <li key={it.name} className="flex justify-between gap-4">
                    <span>
                      {it.qty} × {it.name}, {it.pack}
                    </span>
                    <span className="tabular shrink-0">{inr(it.price)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-start justify-between gap-4 md:col-span-3 md:flex-col md:items-end">
                <p className="tabular text-[15px]">{inr(o.grand_total)}</p>
                <button onClick={() => onReorder(o.id)} className="rounded-full border border-line px-4 py-2 text-[14px] transition-colors hover:border-ink">
                  Order again
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead className="text-muted">
              <tr>
                <th scope="col" className="py-4 pr-4 font-normal">Date</th>
                <th scope="col" className="py-4 pr-4 font-normal">Entry</th>
                <th scope="col" className="py-4 pr-4 text-right font-normal">Charged</th>
                <th scope="col" className="py-4 pr-4 text-right font-normal">Paid</th>
                <th scope="col" className="py-4 text-right font-normal">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line border-t border-line">
              {LEDGER.map((e) => (
                <tr key={e.date + e.desc}>
                  <td className="whitespace-nowrap py-3.5 pr-4 text-muted">{e.date}</td>
                  <td className="py-3.5 pr-4 text-ink">{e.desc}</td>
                  <td className="tabular py-3.5 pr-4 text-right">{e.debit ? inr(e.debit) : ""}</td>
                  <td className="tabular py-3.5 pr-4 text-right">{e.credit ? inr(e.credit) : ""}</td>
                  <td className="tabular py-3.5 text-right text-ink">{inr(e.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
