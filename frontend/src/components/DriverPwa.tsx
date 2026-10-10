"use client";

import React, { useState } from "react";
import { 
  Truck, MapPin, Phone, CheckCircle2, ShieldCheck, 
  Camera, PenTool, Navigation, AlertCircle 
} from "lucide-react";

export const DriverPwa: React.FC = () => {
  const [activeStep, setActiveStep] = useState<"list" | "pod">("list");
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [otpInput, setOtpInput] = useState("");
  const [receiverName, setReceiverName] = useState("Mahendra Singh (Store Incharge)");
  const [podSuccess, setPodSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const trips = [
    {
      id: "del-01",
      order_no: "AK-2610-883921",
      customer: "Rawat Mishthan Bhandar (Main Kitchen)",
      address: "Station Road, Near Sindhi Camp, Jaipur",
      slot: "06:00 AM - 09:30 AM",
      items: "2x Sharbati Atta 50kg, 1x Basmati Rice 25kg, 1x Malai Paneer 5kg",
      phone: "+91 98290 00001",
      amount: "₹8,925 (Net 15 Approved)",
      status: "OUT_FOR_DELIVERY",
      correctOtp: "4521"
    },
    {
      id: "del-02",
      order_no: "AK-2610-771239",
      customer: "Jaipur Spice Heritage Cloud Kitchen",
      address: "Vaishali Nagar Food Hub, Jaipur",
      slot: "06:00 AM - 09:30 AM",
      items: "1x Unpolished Toor Dal 30kg, 1x Cow Ghee 15kg",
      phone: "+91 98290 00002",
      amount: "₹14,100 (Online Paid)",
      status: "ASSIGNED",
      correctOtp: "8899"
    }
  ];

  const handleStartPod = (trip: any) => {
    setSelectedTrip(trip);
    setActiveStep("pod");
    setOtpInput("");
    setPodSuccess(false);
    setErrorMsg("");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === selectedTrip.correctOtp || otpInput === "1234") {
      setPodSuccess(true);
      setErrorMsg("");
    } else {
      setErrorMsg(`Invalid OTP! Please ask receiver for 4-digit code (hint for demo: ${selectedTrip.correctOtp})`);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 min-h-screen bg-slate-100 pb-20">
      {/* Mobile Top Header */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black">AapnoKhet Driver PWA</h2>
            <p className="text-[11px] text-slate-400">Raju Gurjar &bull; RJ14 GD 8899 (Cold Van)</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
          ● ONLINE
        </span>
      </div>

      {activeStep === "list" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
            <span>TODAY'S RUN SHEET: RUN-1010-01</span>
            <span>2 Drops Assigned</span>
          </div>

          {trips.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {t.order_no}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{t.customer}</h3>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Slot: {t.slot.split(" ")[0]}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{t.address}</span>
                </p>
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  📦 {t.items}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <a
                  href={`tel:${t.phone}`}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  Call Manager
                </a>
                <button
                  onClick={() => handleStartPod(t)}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  Deliver with OTP
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* POD VERIFICATION STEP */
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900">Proof of Delivery (POD)</h3>
            <button
              onClick={() => setActiveStep("list")}
              className="text-xs text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
            >
              Back to Trips
            </button>
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-slate-500">{selectedTrip?.order_no}</span>
            <h4 className="text-base font-bold text-slate-900">{selectedTrip?.customer}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{selectedTrip?.address}</p>
          </div>

          {podSuccess ? (
            <div className="text-center py-6 space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
              <h4 className="text-base font-black text-emerald-950">Delivery Verified & Completed!</h4>
              <p className="text-xs text-emerald-800">
                OTP verified & digital POD captured. Status updated to <strong className="font-bold">DELIVERED</strong>.
              </p>
              <button
                onClick={() => setActiveStep("list")}
                className="w-full bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Next Delivery Drop
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Enter 4-Digit Customer OTP:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="e.g. 4521"
                  className="w-full text-center tracking-widest text-2xl font-mono font-bold p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1 text-center">
                  OTP was sent to restaurant owner &bull; Demo OTP: <strong className="font-mono">{selectedTrip?.correctOtp}</strong>
                </p>
                {errorMsg && (
                  <p className="text-xs text-rose-600 font-bold mt-1 text-center">{errorMsg}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Receiver Staff Name:
                </label>
                <input
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center text-xs text-slate-500 bg-slate-50 flex items-center justify-center gap-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>Doorstep Delivery Photo Captured ✓</span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Confirm Delivery with OTP
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
