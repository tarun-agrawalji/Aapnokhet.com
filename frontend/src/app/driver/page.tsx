"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DriverPwa } from "@/components/DriverPwa";
import { 
  Truck, Lock, Mail, ArrowRight, AlertCircle, 
  CheckCircle2, LogOut, ArrowLeft, KeyRound, ShieldCheck 
} from "lucide-react";

export default function DriverPage() {
  const { user, isDriver, isAdmin, isAuthenticated, login, logout } = useAuth();

  const [driverEmail, setDriverEmail] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDriverLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await login(driverEmail.trim(), driverPassword);
      if (!res.success) {
        setErrorMsg(res.error || "Invalid driver credentials. Access denied.");
      }
    } catch {
      setErrorMsg("Authentication error. Please check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // If authenticated as Driver or Admin, show Driver PWA
  if (isAuthenticated && (isDriver || isAdmin)) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
        {/* Top Driver Security Bar */}
        <div className="bg-slate-950 text-slate-300 text-xs py-2.5 px-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-200">AapnoKhet Driver Dispatch Portal</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-emerald-400 font-mono text-[11px]">{user?.name}</span>
          </div>

          <button
            onClick={logout}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="flex-1 bg-slate-100">
          <DriverPwa />
        </div>
      </div>
    );
  }

  // Not authenticated: Driver Login Form
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans text-white p-4">
      <div className="max-w-md mx-auto w-full pt-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
        <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800">
          Driver Fleet
        </span>
      </div>

      <div className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Truck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-white">Driver Delivery Portal</h1>
            <p className="text-xs text-slate-400">
              Sign in to view your morning 06:00 AM restaurant dispatch run-sheet and capture OTP proofs of delivery.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleDriverLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono">
                Driver Email or Mobile
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="driver@aapnokhet.com"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  className="w-full text-xs font-mono font-medium pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-600"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono">
                Driver Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={driverPassword}
                  onChange={(e) => setDriverPassword(e.target.value)}
                  className="w-full text-xs font-mono font-medium pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-600"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Signing In..." : "Sign In to Driver App"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <footer className="text-center text-[11px] text-slate-600 pb-4">
        &copy; 2026 AapnoKhet Fleet Logistics.
      </footer>
    </div>
  );
}
