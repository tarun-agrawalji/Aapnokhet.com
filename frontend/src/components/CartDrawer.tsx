"use client";

import React, { useState } from "react";
import { 
  X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, 
  CreditCard, Truck, AlertCircle, CheckCircle2 
} from "lucide-react";

interface CartItem {
  id: string;
  variant_id: string;
  sku: string;
  product_name: string;
  pack_size: string;
  unit: string;
  qty: number;
  unit_price: number;
  subtotal: number;
  tax_amount: number;
  total: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  onRemoveItem: (id: string) => void;
  onCheckoutSuccess: (orderInfo: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  taxTotal,
  grandTotal,
  onRemoveItem,
  onCheckoutSuccess
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"CREDIT" | "ONLINE_UPI">("CREDIT");
  const [selectedSlot, setSelectedSlot] = useState("Early Morning (06:00 AM - 09:30 AM)");
  const [orderComplete, setOrderComplete] = useState<any>(null);

  if (!isOpen) return null;

  const freeDeliveryThreshold = 3000;
  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 150;
  const finalGrandTotal = grandTotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsCheckingOut(true);
    // Mock API checkout completion
    setTimeout(() => {
      const result = {
        order_no: `AK-2610-${Math.floor(100000 + Math.random() * 900000)}`,
        invoice_no: `INV/26-10/${Math.floor(1000 + Math.random() * 9000)}`,
        grand_total: finalGrandTotal,
        payment_mode: paymentMode,
        slot: selectedSlot
      };
      setOrderComplete(result);
      setIsCheckingOut(false);
      onCheckoutSuccess(result);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-amber-100">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-900 text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <h2 className="text-lg font-black tracking-tight">Your Kitchen Order</h2>
              <span className="text-xs bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                {items.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderComplete ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Order Confirmed!</h3>
                <p className="text-xs text-slate-600">
                  Stock reserved via FEFO and dispatched to warehouse pick-list.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order No:</span>
                    <span className="font-bold text-slate-900 font-mono">{orderComplete.order_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">GST Invoice:</span>
                    <span className="font-bold text-emerald-800 font-mono">{orderComplete.invoice_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment:</span>
                    <span className="font-bold text-amber-800">{orderComplete.payment_mode === "CREDIT" ? "Net 15 Credit Terms" : "UPI Paid"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Slot:</span>
                    <span className="font-bold text-slate-900">{orderComplete.slot}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOrderComplete(null);
                    onClose();
                  }}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-xl">
                  🛒
                </div>
                <h4 className="font-bold text-slate-700">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Add commercial pack sizes of wheat flour, basmati rice, pulses or dairy to start ordering.
                </p>
              </div>
            ) : (
              <>
                {/* Free Delivery Bar */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-medium">
                    <Truck className="w-4 h-4 text-amber-600" />
                    {subtotal >= freeDeliveryThreshold ? (
                      <strong className="text-emerald-800">Free Morning Delivery Unlocked!</strong>
                    ) : (
                      <>Add ₹{(freeDeliveryThreshold - subtotal).toLocaleString("en-IN")} more for Free Delivery</>
                    )}
                  </span>
                </div>

                {/* Items list */}
                <div className="divide-y divide-slate-100">
                  {items.map((it) => (
                    <div key={it.id} className="py-3 flex justify-between items-start gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{it.product_name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {it.pack_size} &bull; Qty: <strong className="text-slate-800">{it.qty}</strong>
                        </p>
                        <p className="text-[11px] font-mono text-emerald-800 font-bold mt-1">
                          ₹{it.unit_price.toLocaleString("en-IN")} &times; {it.qty} = ₹{it.total.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(it.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Checkout Options */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Delivery & Payment Setup:
                  </h4>
                  
                  {/* Outlet */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Delivery Outlet:</span>
                    <strong className="text-slate-900 block mt-0.5">Rawat Mishthan Bhandar (Main Kitchen)</strong>
                    <span className="text-slate-500 text-[11px]">Station Road, Jaipur - 302001 (Serviceable)</span>
                  </div>

                  {/* Slot selector */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Delivery Time Slot:
                    </label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option>Early Morning (06:00 AM - 09:30 AM)</option>
                      <option>Mid-Day Kitchen Prep (11:00 AM - 02:00 PM)</option>
                      <option>Evening Service (04:00 PM - 07:00 PM)</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Payment Mode:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMode("CREDIT")}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                          paymentMode === "CREDIT"
                            ? "bg-emerald-50 border-emerald-800 text-emerald-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <span>🏢 Net 15 Credit</span>
                        <span className="block text-[10px] text-emerald-700 font-normal mt-0.5">Avail: ₹2,50,000</span>
                      </button>
                      <button
                        onClick={() => setPaymentMode("ONLINE_UPI")}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                          paymentMode === "ONLINE_UPI"
                            ? "bg-emerald-50 border-emerald-800 text-emerald-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <span>⚡ Instant UPI</span>
                        <span className="block text-[10px] text-slate-500 font-normal mt-0.5">QR & NetBanking</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Totals & CTA */}
          {!orderComplete && items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (CGST + SGST):</span>
                  <span className="font-mono font-medium">₹{taxTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee:</span>
                  <span className="font-mono font-medium">
                    {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-emerald-900 font-mono text-base">₹{finalGrandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isCheckingOut}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{isCheckingOut ? "Reserving Stock & Generating Invoice..." : `Place Order (₹${finalGrandTotal.toLocaleString("en-IN")})`}</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
