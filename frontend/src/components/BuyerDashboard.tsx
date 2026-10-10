"use client";

import React, { useState } from "react";
import { 
  Clock, Package, FileText, CheckCircle2, RotateCcw, 
  Download, Building2, CreditCard, ChevronRight 
} from "lucide-react";

interface BuyerDashboardProps {
  onReorder: (orderId: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onReorder }) => {
  const [activeTab, setActiveTab] = useState<"orders" | "ledger" | "invoices">("orders");

  const orders = [
    {
      id: "ord-01",
      order_no: "AK-2610-883921",
      date: "10 Oct 2026",
      slot: "Early Morning (06:00 AM - 09:30 AM)",
      status: "DISPATCHED",
      items: [
        { name: "Sharbati Whole Wheat Atta", pack: "50 kg Bag", qty: 2, price: 3560 },
        { name: "1121 Royal Steam Basmati Rice", pack: "25 kg Bag", qty: 1, price: 2450 },
        { name: "Fresh Malai Paneer (Cold Chain)", pack: "5 kg Block", qty: 1, price: 1650 }
      ],
      grand_total: 8925,
      invoice_no: "INV/26-10/4521",
      payment_mode: "Net 15 Credit Terms"
    },
    {
      id: "ord-02",
      order_no: "AK-2610-771920",
      date: "03 Oct 2026",
      slot: "Early Morning (06:00 AM - 09:30 AM)",
      status: "DELIVERED",
      items: [
        { name: "Unpolished Desi Toor Dal", pack: "30 kg Bag", qty: 1, price: 4350 },
        { name: "Danedar Pure Cow Ghee", pack: "15 kg Tin", qty: 1, price: 9750 }
      ],
      grand_total: 14100,
      invoice_no: "INV/26-10/3811",
      payment_mode: "Net 15 Credit Terms"
    }
  ];

  const ledgerEntries = [
    { date: "10 Oct 2026", desc: "Tax Invoice INV/26-10/4521 for Order AK-2610-883921", debit: 8925, credit: 0, balance: 8925 },
    { date: "05 Oct 2026", desc: "NEFT Bank Transfer Received (Ref: UTR9988221)", debit: 0, credit: 14100, balance: 0 },
    { date: "03 Oct 2026", desc: "Tax Invoice INV/26-10/3811 for Order AK-2610-771920", debit: 14100, credit: 0, balance: 14100 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Account Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Rawat Mishthan Bhandar</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              ✓ KYB Approved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Station Road Outlet &bull; GSTIN: <strong className="font-mono text-slate-700">08AABCR1234F1Z1</strong> &bull; FSSAI: <strong className="font-mono text-slate-700">12224026000456</strong>
          </p>
        </div>

        {/* Credit Card Stat */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-right">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Approved Credit Line (Net 15 Days)
          </span>
          <div className="flex items-baseline justify-end gap-2 mt-0.5">
            <span className="text-lg font-black text-emerald-950 font-mono">₹2,41,075</span>
            <span className="text-xs text-slate-500 font-medium">available of ₹2,50,000</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 mt-4">
        <button
          onClick={() => setActiveTab("orders")}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === "orders" ? "border-emerald-800 text-emerald-900" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Recent Orders & Tracking
        </button>
        <button
          onClick={() => setActiveTab("ledger")}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === "ledger" ? "border-emerald-800 text-emerald-900" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Credit Account & Ledger
        </button>
      </div>

      {/* TAB: ORDERS */}
      {activeTab === "orders" && (
        <div className="py-4 space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="border border-slate-200 rounded-xl p-4 hover:border-amber-200 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {ord.order_no}
                  </span>
                  <span className="text-xs text-slate-500 ml-2 font-medium">Placed: {ord.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ord.status === "DELIVERED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    ● {ord.status.replace("_", " ")}
                  </span>
                  <button
                    onClick={() => onReorder(ord.id)}
                    className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-300" />
                    1-Click Reorder
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="py-3 text-xs divide-y divide-slate-50">
                {ord.items.map((it, i) => (
                  <div key={i} className="py-1.5 flex justify-between text-slate-700">
                    <span>{it.qty} &times; {it.name} ({it.pack})</span>
                    <span className="font-mono font-bold text-slate-900">₹{it.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              {/* Footer info */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                <span>Slot: <strong>{ord.slot}</strong></span>
                <div className="flex items-center gap-3">
                  <span>Grand Total: <strong className="text-slate-900 font-mono text-sm">₹{ord.grand_total.toLocaleString("en-IN")}</strong></span>
                  <span className="text-emerald-700 font-mono font-bold">{ord.invoice_no}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: LEDGER */}
      {activeTab === "ledger" && (
        <div className="py-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Transaction Description</th>
                  <th className="p-3 text-right">Debit (+)</th>
                  <th className="p-3 text-right">Credit (-)</th>
                  <th className="p-3 text-right">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {ledgerEntries.map((e, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 whitespace-nowrap text-slate-500">{e.date}</td>
                    <td className="p-3 text-slate-800">{e.desc}</td>
                    <td className="p-3 text-right font-mono text-rose-700">
                      {e.debit > 0 ? `₹${e.debit.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-700">
                      {e.credit > 0 ? `₹${e.credit.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      ₹{e.balance.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
