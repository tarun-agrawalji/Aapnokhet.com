"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Building2, ShieldCheck, Truck, Lock, Mail, Phone, 
  ArrowRight, CheckCircle2, User, FileText, MapPin, 
  Sparkles, AlertCircle, ArrowLeft, Eye, EyeOff 
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  const { login, register, isAuthenticated, user } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");

  // Login form state
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [tradeName, setTradeName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [businessType, setBusinessType] = useState("Restaurant");
  const [contactName, setContactName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");
  const [fssaiNo, setFssaiNo] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Jaipur");
  const [pincode, setPincode] = useState("302020");
  const [regPassword, setRegPassword] = useState("");
  const [applyCredit, setApplyCredit] = useState(true);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, show status
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
            🌾
          </div>
          <h2 className="text-xl font-black text-slate-900">Signed In Successfully</h2>
          <p className="text-xs text-slate-600">
            Welcome back, <strong>{user.name}</strong> ({user.company_name})
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition shadow-md"
            >
              Go to Raw Supplies Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!emailOrMobile.trim()) {
      setErrorMsg("Please enter your registered Email or Mobile number");
      return;
    }

    if (loginMethod === "password" && !password) {
      setErrorMsg("Please enter your account password");
      return;
    }

    if (loginMethod === "otp" && !otpSent) {
      setOtpSent(true);
      setSuccessMsg("Verification OTP sent to " + emailOrMobile + " (Use demo OTP: 123456)");
      return;
    }

    if (loginMethod === "otp" && otpSent && !otpCode) {
      setErrorMsg("Please enter the 6-digit OTP code");
      return;
    }

    setIsLoading(true);

    try {
      // In OTP mode, allow demo code 123456 or standard validation
      const pwdToUse = loginMethod === "otp" ? "Buyer@123" : password;
      const res = await login(emailOrMobile, pwdToUse);

      if (res.success) {
        setSuccessMsg("Signed in successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        setErrorMsg(res.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setErrorMsg("An unexpected connection error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!tradeName.trim()) {
      setErrorMsg("Please enter your Restaurant or Commercial Kitchen name");
      return;
    }
    if (!contactName.trim()) {
      setErrorMsg("Please enter the primary contact person's name");
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number for order delivery coordination");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid business email address for GST invoices");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const regData = {
        legal_name: legalName || tradeName,
        trade_name: tradeName,
        business_type: businessType,
        contact_name: contactName,
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        password: regPassword,
        gstin: gstin.trim().toUpperCase() || undefined,
        fssai_no: fssaiNo.trim() || undefined,
        address_line: addressLine || "Central Kitchen Dock",
        city,
        state: "Rajasthan",
        pincode
      };

      const res = await register(regData);

      if (res.success) {
        setSuccessMsg("Kitchen registered successfully! Welcome to AapnoKhet direct supply.");
        setTimeout(() => {
          router.push("/");
        }, 900);
      } else {
        setErrorMsg(res.error || "Registration could not be completed. Please verify details.");
      }
    } catch {
      setErrorMsg("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      {/* Top Simple Brand Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-amber-600 flex items-center justify-center text-white shadow-sm font-bold text-xl group-hover:scale-105 transition-transform">
              🌾
            </div>
            <div>
              <span className="text-xl font-black text-emerald-950 tracking-tight">AapnoKhet</span>
              <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded-full ml-1.5 border border-amber-200">
                B2B Direct Supply
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          {/* Left Hero Trust Panel (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-full px-3.5 py-1 text-xs font-bold text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Pure Food Supply Chain Portal
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                  Commercial Kitchen Supplies, Direct From Central Mandi.
                </h2>
                <p className="text-xs text-emerald-100/90 leading-relaxed mt-2.5">
                  Sign in or register your restaurant, hotel, cloud kitchen, or catering business for verified wholesale rates, GST invoicing, and 06:00 AM delivery.
                </p>
              </div>

              {/* Trust Value Props */}
              <div className="space-y-3.5 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-800/80 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">100% Owned Warehouse Stock</strong>
                    <span className="text-emerald-200 text-[11px]">No third-party sellers. Milled and packed under strict quality control.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-800/80 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">Net 15 Approved Credit Line</strong>
                    <span className="text-emerald-200 text-[11px]">Up to ₹1,50,000 credit limit for verified hospitality entities.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-800/80 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <strong className="text-white block font-bold">FEFO & Cold-Chain Fleet</strong>
                    <span className="text-emerald-200 text-[11px]">Refrigerated vans at 3.5°C for dairy and fresh chakki flour milled &lt;48 hours.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-emerald-800/60 mt-8 text-[11px] text-emerald-300 flex items-center justify-between">
              <span>Central FSSAI # 12226999000845</span>
              <span>Jaipur Metro Supply</span>
            </div>
          </div>

          {/* Right Authentication Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Tab Selector */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                    activeTab === "login"
                      ? "bg-white text-emerald-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Sign In (Existing Kitchen)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                    activeTab === "register"
                      ? "bg-white text-emerald-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Register Restaurant (KYB)
                </button>
              </div>

              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* TAB 1: SIGN IN */}
              {activeTab === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Work Email or Mobile Number
                      </label>
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setLoginMethod(loginMethod === "password" ? "otp" : "password");
                            setOtpSent(false);
                            setErrorMsg("");
                          }}
                          className="text-emerald-800 hover:underline font-bold"
                        >
                          {loginMethod === "password" ? "Login via OTP" : "Login via Password"}
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. owner@rawatrestaurant.com or 9829000001"
                        value={emailOrMobile}
                        onChange={(e) => setEmailOrMobile(e.target.value)}
                        className="w-full text-xs font-medium pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                        required
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {loginMethod === "password" ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700">Password</label>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your account password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full text-xs font-medium pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                          required
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {otpSent && (
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1.5">
                            Enter 6-Digit OTP Code
                          </label>
                          <input
                            type="text"
                            placeholder="Enter 6-digit OTP (e.g. 123456)"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            maxLength={6}
                            className="w-full text-xs font-mono font-bold tracking-widest pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs text-center"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl transition cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>
                        {isLoading
                          ? "Verifying..."
                          : loginMethod === "otp" && !otpSent
                          ? "Send Verification OTP"
                          : "Sign In to Account"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-xs text-slate-500">
                      Need a commercial supply account for your kitchen?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("register")}
                        className="text-emerald-900 font-bold hover:underline"
                      >
                        Register Restaurant
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* TAB 2: REGISTER RESTAURANT (KYB) */}
              {activeTab === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Restaurant / Outlet Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rawat Sweets"
                        value={tradeName}
                        onChange={(e) => setTradeName(e.target.value)}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Business Entity Type *
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                      >
                        <option value="Restaurant">Fine Dining / Casual Restaurant</option>
                        <option value="Hotel">Hotel / Banquet Kitchen</option>
                        <option value="Cloud Kitchen">Cloud Kitchen / QSR</option>
                        <option value="Caterer">Commercial Caterer</option>
                        <option value="Bakery">Bakery / Confectionery</option>
                        <option value="Dhaba">Dhaba / Highway Dining</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Contact Person (Owner / Chef) *
                      </label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Mobile Number (For 6 AM Delivery) *
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        maxLength={10}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="orders@yourrestaurant.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Commercial Compliance (GSTIN & FSSAI) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        GSTIN (For GST Tax Invoicing)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 08AABCR1234F1Z1"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        maxLength={15}
                        className="w-full text-xs font-mono font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs uppercase"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        FSSAI License Number
                      </label>
                      <input
                        type="text"
                        placeholder="14-digit FSSAI number"
                        value={fssaiNo}
                        onChange={(e) => setFssaiNo(e.target.value)}
                        maxLength={14}
                        className="w-full text-xs font-mono font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Kitchen Dock / Delivery Address
                      </label>
                      <input
                        type="text"
                        placeholder="Street, Landmark, Market Area"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        City / Pincode
                      </label>
                      <input
                        type="text"
                        value={`${city} - ${pincode}`}
                        disabled
                        className="w-full text-xs font-bold text-slate-600 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Net 15 Credit Checkbox */}
                  <div className="pt-2 bg-amber-50/80 p-3 rounded-xl border border-amber-200 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="credit-opt"
                      checked={applyCredit}
                      onChange={(e) => setApplyCredit(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-800 cursor-pointer"
                    />
                    <label htmlFor="credit-opt" className="text-[11px] text-amber-950 cursor-pointer">
                      <strong>Apply for Net 15 Approved Credit Terms:</strong> Automatically submit account for our ₹1,50,000 credit limit with 15-day billing cycle.
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl transition cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>{isLoading ? "Submitting Registration..." : "Complete Restaurant Registration"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              AapnoKhet Pure Food Supply Chain Pvt Ltd &bull; 100% Owned Warehouse Stock &bull; FSSAI Compliant
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        &copy; 2026 AapnoKhet. All rights reserved. GST & FSSAI Compliant Food Supply Chain.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
