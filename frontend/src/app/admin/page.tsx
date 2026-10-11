"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AdminConsole } from "@/components/AdminConsole";
import { 
  ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, 
  CheckCircle2, LogOut, ArrowLeft, KeyRound, Building2 
} from "lucide-react";

export default function AdminPage() {
  const { user, isAdmin, isAuthenticated, login, logout } = useAuth();

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await login(adminEmail.trim(), adminPassword);
      if (!res.success) {
        setErrorMsg(res.error || "Invalid administrator credentials. Access denied.");
      } else {
        // If login succeeded but role is not admin
        const stored = localStorage.getItem("aapnokhet_user");
        const parsed = stored ? JSON.parse(stored) : null;
        if (parsed?.role !== "Super Admin" && !parsed?.role?.toLowerCase().includes("admin")) {
          setErrorMsg("Access denied. This account does not have administrative privileges.");
          logout();
        }
      }
    } catch {
      setErrorMsg("Authentication error. Please check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // If authenticated as Admin, show Admin Console
  if (isAuthenticated && isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
        {/* Top Admin Security Strip */}
        <div className="bg-slate-950 text-slate-300 text-xs py-2.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-bold text-slate-100">AapnoKhet Internal Operations Portal</span>
            <span className="hidden sm:inline text-slate-500">&bull;</span>
            <span className="hidden sm:inline text-amber-400 font-mono text-[11px]">
              Session: {user?.email} ({user?.role})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white font-bold transition flex items-center gap-1"
            >
              <span>View Storefront</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={logout}
              className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 text-xs font-bold px-3 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out Admin</span>
            </button>
          </div>
        </div>

        {/* Admin Console View */}
        <div className="flex-1 bg-slate-100">
          <AdminConsole />
        </div>
      </div>
    );
  }

  // Not authenticated as Admin: Show Secure Administrator Login Gate
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans text-white p-4">
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full pt-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AapnoKhet Storefront</span>
        </Link>
        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/80 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
          Restricted Zone
        </span>
      </div>

      {/* Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              AapnoKhet Operations Console
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized Supply Chain, Inventory, and Dispatch Personnel Only.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono">
                Administrator Email ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@aapnokhet.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full text-xs font-mono font-medium pl-10 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-slate-600 shadow-inner"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full text-xs font-mono font-medium pl-10 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-slate-600 shadow-inner"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl transition cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? "Verifying Credentials..." : "Authenticate Admin Access"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-500 text-center leading-relaxed font-mono">
            All unauthorized access attempts are monitored and recorded under Section 43 of the India Information Technology Act.
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="text-center text-[11px] text-slate-600 pb-4">
        &copy; 2026 AapnoKhet Pure Food Supply Chain Pvt Ltd. Internal Operations.
      </footer>
    </div>
  );
}
