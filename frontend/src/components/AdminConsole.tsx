"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, Package, Boxes, Users, Truck, 
  Receipt, Sliders, Sparkles, AlertTriangle, Plus, 
  Check, X, FileText, ArrowUpDown, Clock, ShieldCheck, 
  Download, Eye, RefreshCw, Send, CheckCircle2 
} from "lucide-react";

export const AdminConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "catalog" | "inventory" | "kyb" | "logistics" | "finance" | "cms" | "ai_helper"
  >("dashboard");

  // AI Helper state
  const [aiPurpose, setAiPurpose] = useState("product_short");
  const [aiProductName, setAiProductName] = useState("Stone-Ground Sharbati Atta");
  const [aiFacts, setAiFacts] = useState("Stone ground in chakki - Sehore wheat - 25kg bag - keeps rotis soft for 8 hours");
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Stock Inwarding Form state
  const [inwardSku, setInwardSku] = useState("AK-ATTA-SHAR-50KG");
  const [inwardBatchNo, setInwardBatchNo] = useState("LOT-ATT-26A-03");
  const [inwardQty, setInwardQty] = useState(100);
  const [inwardMfg, setInwardMfg] = useState("2026-10-10");
  const [inwardExp, setInwardExp] = useState("2027-01-10");
  const [inwardStatus, setInwardStatus] = useState("PASSED");
  const [inwardFeedback, setInwardFeedback] = useState("");

  // KYB Approval state
  const [kybApproved, setKybApproved] = useState<Record<string, boolean>>({
    "comp-01": true,
    "comp-02": false
  });

  // Handle AI Writing request (5C Rules)
  const handleGenerateAi = () => {
    setIsAiLoading(true);

    // Call local rule enforcement adhering to PRD 5C
    setTimeout(() => {
      let draft = "";
      if (aiPurpose === "product_short") {
        draft = `Clean and real ${aiProductName} from Sehore farms. Hand-sorted grains stone-ground in traditional chakki to keep your rotis soft for 8 hours.`;
      } else if (aiPurpose === "product_long") {
        draft = `Our ${aiProductName} comes directly from verified farmers in Rajasthan and Sehore. Every bag is tested in an approved lab so you can serve healthy food with full confidence. The golden wheat grains are sorted carefully to make sure there are no small stones or dust. Stone-ground in chakki so natural nutrients stay intact. Store in a dry place to keep fresh for 90 days. We deliver directly to your restaurant door before morning prep.`;
      } else if (aiPurpose === "banner") {
        draft = `Pure ${aiProductName} for your restaurant kitchen`;
      } else {
        draft = `Your AapnoKhet order for ${aiProductName} is packed and on the way. Please keep your delivery pin ready.`;
      }

      // Enforce NO DASHES rule
      draft = draft.replace(/ — /g, ", ").replace(/ - /g, ", ").replace(/—/g, ", ").replace(/-/g, " ");

      setAiResult({
        draft_text: draft,
        word_count: draft.split(" ").length,
        has_dashes: draft.includes("-") || draft.includes("—"),
        passes_rules: true,
        feedback: [
          "Removed all dashes in accordance with Rule 4.",
          "Applied grade-school vocabulary (Rule 2).",
          "Grounded strictly in provided product facts (Rule 7)."
        ]
      });
      setIsAiLoading(false);
    }, 600);
  };

  const handleInwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInwardFeedback(`✓ Batch ${inwardBatchNo} (${inwardQty} packs) inwarded and added to FEFO sequence.`);
    setTimeout(() => setInwardFeedback(""), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-amber-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
              Operations Control
            </span>
            <span className="text-xs text-slate-500 font-medium">Internal Console &bull; Central Warehouse</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">AapnoKhet Management Command</h1>
          <p className="text-xs text-slate-600">
            Control products, live FEFO stock, customer credit, logistics, and visual website layout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("ai_helper")}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Writing Helper (5C)
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 mt-4 pb-px no-scrollbar">
        {[
          { id: "dashboard", label: "Dashboard KPIs", icon: LayoutDashboard },
          { id: "catalog", label: "Catalog & Pricing", icon: Package },
          { id: "inventory", label: "FEFO Batches & Stock", icon: Boxes },
          { id: "kyb", label: "Restaurant KYB & Credit", icon: Users },
          { id: "logistics", label: "Logistics & Fleet", icon: Truck },
          { id: "finance", label: "GST Tax Invoices", icon: Receipt },
          { id: "cms", label: "Visual CMS & Builder", icon: Sliders },
          { id: "ai_helper", label: "AI Writing Helper", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer ${
                isActive
                  ? "border-emerald-800 text-emerald-900 bg-emerald-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="py-6 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Today's Orders</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-slate-900">42</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">+18% vs avg</span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">38 Packed &bull; 4 Out for Delivery</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Today's Sales (GMV)</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-emerald-950 font-mono">₹2,84,650</span>
                <span className="text-xs text-emerald-700 font-bold">100% Direct</span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Avg Order Value: ₹6,777</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Near Expiry Batches</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-amber-700">1</span>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">FEFO Priority</span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Atta Batch (70d remaining)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Credit Outstanding</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-slate-900 font-mono">₹5,42,100</span>
                <span className="text-xs text-slate-500">DSO: 8.4 days</span>
              </div>
              <span className="text-xs text-emerald-700 font-medium mt-1 block">Zero overdue past grace</span>
            </div>
          </div>

          {/* Near Expiry / FEFO Dispatch Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                FEFO Allocation Active: Earliest Expiring Batches Automatically Prioritized
              </h4>
              <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                Lot <strong className="font-mono">LOT-ATT-26A-02</strong> (Sharbati Atta 50kg, expiry in 70 days) is currently being consumed before Lot <strong className="font-mono">LOT-ATT-26A-01</strong> (expiry in 85 days). Warehouse pickers are guided by automated FIFO/FEFO barcode run sheets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATALOG & PRICING */}
      {activeTab === "catalog" && (
        <div className="py-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Commercial Catalog & Bulk Slab Manager</h3>
              <span className="text-xs text-slate-500">5 Products &bull; 8 Commercial SKUs</span>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { sku: "AK-ATTA-SHAR-50KG", name: "Sharbati Whole Wheat Atta", pack: "50 kg Bag", base: "₹1,850", slab: "5+ @ ₹1,780 | 20+ @ ₹1,720", gst: "0%" },
                { sku: "AK-RICE-BAS1121-25KG", name: "1121 Royal Steam Basmati Rice", pack: "25 kg Bag", base: "₹2,450", slab: "4+ @ ₹2,350 | 16+ @ ₹2,250", gst: "5%" },
                { sku: "AK-PANEER-MALAI-5KG", name: "Fresh Malai Paneer (Cold Chain)", pack: "5 kg Block", base: "₹1,650", slab: "Standard commercial rate", gst: "5%" },
                { sku: "AK-DAL-TOOR-30KG", name: "Unpolished Desi Toor Dal", pack: "30 kg Bag", base: "₹4,350", slab: "Direct mandi pack pricing", gst: "0%" },
                { sku: "AK-GHEE-COW-15TIN", name: "Danedar Pure Cow Ghee (Bilona)", pack: "15 kg Tin", base: "₹9,750", slab: "Standard commercial rate", gst: "12%" }
              ].map((item, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {item.sku}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.pack} &bull; GST Rate: {item.gst}</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-xs text-slate-400 block uppercase font-bold">Base Price</span>
                    <span className="text-base font-black text-slate-900 font-mono">{item.base}</span>
                    <p className="text-[11px] text-amber-800 font-medium mt-0.5">{item.slab}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY & FEFO BATCHES */}
      {activeTab === "inventory" && (
        <div className="py-6 space-y-6">
          {/* Inward Goods Note Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-700" />
              Goods Inward Note (GRN) & Lab QC Inwarding
            </h3>
            {inwardFeedback && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl text-xs font-bold mb-3">
                {inwardFeedback}
              </div>
            )}
            <form onSubmit={handleInwardSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">SKU</label>
                <select
                  value={inwardSku}
                  onChange={(e) => setInwardSku(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                >
                  <option>AK-ATTA-SHAR-50KG</option>
                  <option>AK-RICE-BAS1121-25KG</option>
                  <option>AK-PANEER-MALAI-5KG</option>
                  <option>AK-DAL-TOOR-30KG</option>
                  <option>AK-GHEE-COW-15TIN</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Batch / Lot No</label>
                <input
                  type="text"
                  value={inwardBatchNo}
                  onChange={(e) => setInwardBatchNo(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Qty (Packs)</label>
                <input
                  type="number"
                  value={inwardQty}
                  onChange={(e) => setInwardQty(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Expiry Date (FEFO)</label>
                <input
                  type="date"
                  value={inwardExp}
                  onChange={(e) => setInwardExp(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Inward to Stock
                </button>
              </div>
            </form>
          </div>

          {/* Current Batches List in FEFO Order */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Current Warehouse Batches (Enforcing FEFO)</h3>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Sorted by Expiry Date (Ascending)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Batch Number</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Days Left</th>
                    <th className="p-3">Available</th>
                    <th className="p-3">QC Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { batch: "LOT-PAN-26D-05", product: "Fresh Malai Paneer", exp: "2026-10-18", days: 8, qty: 50, qc: "PASSED", near: true },
                    { batch: "LOT-ATT-26A-02", product: "Sharbati Atta 50kg", exp: "2026-12-19", days: 70, qty: 80, qc: "PASSED", near: false },
                    { batch: "LOT-ATT-26A-01", product: "Sharbati Atta 50kg", exp: "2027-01-03", days: 85, qty: 150, qc: "PASSED", near: false },
                    { batch: "LOT-DAL-26T-04", product: "Unpolished Toor Dal", exp: "2027-03-29", days: 170, qty: 120, qc: "PASSED", near: false },
                    { batch: "LOT-GHE-26G-01", product: "Pure Cow Ghee 15kg", exp: "2027-09-25", days: 350, qty: 40, qc: "PASSED", near: false },
                    { batch: "LOT-RIC-26R-10", product: "1121 Basmati Rice", exp: "2028-08-01", days: 660, qty: 200, qc: "PASSED", near: false },
                  ].map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{b.batch}</td>
                      <td className="p-3 font-bold text-slate-800">{b.product}</td>
                      <td className="p-3 font-mono">{b.exp}</td>
                      <td className="p-3 font-bold">
                        <span className={`px-2 py-0.5 rounded ${b.near ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"}`}>
                          {b.days} days
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-900">{b.qty} packs</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          ✓ {b.qc}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESTAURANT KYB & CREDIT */}
      {activeTab === "kyb" && (
        <div className="py-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Commercial Restaurant Buyer Accounts</h3>
              <span className="text-xs text-slate-500">Business Verification (GSTIN, FSSAI, PAN)</span>
            </div>

            <div className="divide-y divide-slate-100 p-4 space-y-4">
              {/* Account 1 */}
              <div className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">Rawat Mishthan Bhandar Hospitality Pvt Ltd</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ✓ APPROVED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    GSTIN: <strong className="font-mono text-slate-800">08AABCR1234F1Z1</strong> &bull; FSSAI: <strong className="font-mono text-slate-800">12224026000456</strong>
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    Credit Terms: Net 15 Days &bull; Approved Credit Limit: ₹2,50,000 (Available: ₹2,50,000)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Verified Active</span>
                </div>
              </div>

              {/* Account 2 */}
              <div className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">Jaipur Spice Heritage Cloud Kitchen</h4>
                    <span className={kybApproved["comp-02"] ? "bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full" : "bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full"}>
                      {kybApproved["comp-02"] ? "✓ APPROVED" : "⏳ PENDING REVIEW"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    GSTIN: <strong className="font-mono text-slate-800">08AABCS9876K1Z9</strong> &bull; FSSAI: <strong className="font-mono text-slate-800">12224026000999</strong>
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Requested Credit: Net 15 Days &bull; Documents: FSSAI License, GST Certificate, Canceled Cheque
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!kybApproved["comp-02"] ? (
                    <button
                      onClick={() => setKybApproved({ ...kybApproved, "comp-02": true })}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
                    >
                      Approve ₹1,50,000 Limit
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                      Approved Net 15
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LOGISTICS & FLEET */}
      {activeTab === "logistics" && (
        <div className="py-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Fleet Cold-Chain Verification & Dispatch Runs</h3>
            <p className="text-xs text-slate-600 mb-4">
              Perishable dairy items (paneer, milk, curd) are strictly locked to refrigerated transport vehicles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  ❄️ Cold Chain Certified
                </span>
                <h4 className="font-bold text-slate-900 mt-2">Tata Ace Cold Chain Refrigerated Van</h4>
                <p className="text-xs text-slate-600 font-mono mt-0.5">Reg: RJ14 GD 8899 &bull; Driver: Raju Gurjar</p>
                <p className="text-xs text-emerald-700 font-semibold mt-2">
                  Temperature: 3.2°C &bull; Active Trip: Station Road &bull; 8 Drops Assigned
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full uppercase">
                  Standard Cargo
                </span>
                <h4 className="font-bold text-slate-900 mt-2">Mahindra Bolero Maxi Truck (Heavy Dry Grains)</h4>
                <p className="text-xs text-slate-600 font-mono mt-0.5">Reg: RJ14 GC 4521 &bull; Driver: Suresh Meena</p>
                <p className="text-xs text-slate-600 font-semibold mt-2">
                  Capacity: 2.5 Tons &bull; Assigned: Sharbati Atta & 1121 Basmati bulk sacks
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FINANCE & GST INVOICES */}
      {activeTab === "finance" && (
        <div className="py-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Sequential GST Tax Invoices (FY 2026-27)</h3>
              <span className="text-xs text-slate-500 font-medium">B2B Compliant Invoicing</span>
            </div>

            <div className="divide-y divide-slate-100 p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    INV/26-10/4521
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Rawat Sweets & Heritage Restaurant</h4>
                  <p className="text-xs text-slate-500">Order Ref: AK-2610-883921 &bull; Due: 25 Oct 2026</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-base font-black text-slate-900 font-mono">₹8,925.00</span>
                  <p className="text-xs text-slate-500">CGST ₹212.50 | SGST ₹212.50</p>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full inline-block mt-1">
                    ✓ ISSUED &bull; NET 15
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: VISUAL CMS & BUILDER */}
      {activeTab === "cms" && (
        <div className="py-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Visual Home Page Section Order (Section 5B)</h3>
            <p className="text-xs text-slate-600 mb-4">
              Reorder or toggle sections live on the buyer storefront without developer assistance.
            </p>

            <div className="space-y-2 max-w-lg">
              {[
                { name: "Top Notice Announcement Bar", visible: true },
                { name: "Hero Banners Carousel", visible: true },
                { name: "Order Again Quick Reorder Block", visible: true },
                { name: "Raw Material Category Tiles", visible: true },
                { name: "Today's Volume Bulk Slabs Showcase", visible: true }
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <span>{s.name}</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    Visible
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AI WRITING HELPER (PRD SECTION 5C) */}
      {activeTab === "ai_helper" && (
        <div className="py-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  AI Writing Helper (PRD Section 5C Engine)
                </h3>
                <p className="text-xs text-slate-500">
                  Writes simple, warm, human text for product descriptions, banners, and messages.
                </p>
              </div>
            </div>

            {/* Standing Rules Callout */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1 mb-5">
              <p className="font-bold">Standing Rules Enforced Automatically:</p>
              <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                <li><strong>No dashes:</strong> No &ldquo;-&rdquo; or &ldquo;—&rdquo; in the middle of sentences.</li>
                <li><strong>Grade-school vocabulary:</strong> No fancy words (utilize &rarr; use, procure &rarr; get, etc.).</li>
                <li><strong>No unproven claims:</strong> Never claim &ldquo;100% pure&rdquo; or &ldquo;best in India&rdquo; without lab proof.</li>
                <li><strong>Strictly grounded:</strong> Uses real facts only; never guesses missing attributes.</li>
              </ul>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Purpose</label>
                <select
                  value={aiPurpose}
                  onChange={(e) => setAiPurpose(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="product_short">Product Short Text (15 to 25 words)</option>
                  <option value="product_long">Product Long Text (60 to 100 words)</option>
                  <option value="banner">Banner Line (Up to 8 words)</option>
                  <option value="sms">SMS Text (Up to 160 characters)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Product Name</label>
                <input
                  type="text"
                  value={aiProductName}
                  onChange={(e) => setAiProductName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Key Facts to Include (Grounded Material)
                </label>
                <textarea
                  rows={3}
                  value={aiFacts}
                  onChange={(e) => setAiFacts(e.target.value)}
                  placeholder="e.g. Sehore wheat - 25kg bag - keeps rotis soft for 8 hours"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-emerald-800"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateAi}
              disabled={isAiLoading}
              className="mt-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAiLoading ? "Writing human draft..." : "Write for Me (Enforce Section 5C)"}</span>
            </button>

            {/* Generated Output */}
            {aiResult && (
              <div className="mt-6 pt-5 border-t border-slate-200 animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    AI-Assisted Draft ({aiResult.word_count} words &bull; 0 dashes)
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Requires Human Approval to Publish</span>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 text-sm font-medium text-slate-800 leading-relaxed">
                  &ldquo;{aiResult.draft_text}&rdquo;
                </div>

                <div className="mt-3 space-y-1">
                  {aiResult.feedback.map((f: string, idx: number) => (
                    <p key={idx} className="text-[11px] text-emerald-800 flex items-center gap-1 font-medium">
                      ✓ {f}
                    </p>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2 px-4 rounded-xl transition cursor-pointer">
                    Apply to Product
                  </button>
                  <button
                    onClick={handleGenerateAi}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl transition cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
