"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Wordmark } from "@/components/Navbar";

const BUSINESS_TYPES = [
  { value: "Restaurant", label: "Restaurant" },
  { value: "Hotel", label: "Hotel or banquet kitchen" },
  { value: "Cloud Kitchen", label: "Cloud kitchen" },
  { value: "Caterer", label: "Caterer" },
  { value: "Bakery", label: "Bakery" },
  { value: "Dhaba", label: "Dhaba" },
];

const inputClass =
  "mt-1.5 h-12 w-full rounded-lg border border-line bg-paper px-3.5 text-[16px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[14px] text-ink">{label}</span>
      {hint && <span className="ml-1.5 text-[13px] text-muted">{hint}</span>}
      {children}
    </label>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, isAuthenticated, user } = useAuth();

  const [tab, setTab] = useState<"login" | "register">(searchParams.get("tab") === "register" ? "register" : "login");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
  const [pincode, setPincode] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchTab = (t: "login" | "register") => {
    setTab(t);
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim()) return setError("Enter the email or mobile number you registered with.");
    if (!password) return setError("Enter your password.");

    setLoading(true);
    try {
      const res = await login(identifier, password);
      if (res.success) router.push("/");
      else setError(res.error || "That email or password is not right. Check both and try again.");
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!tradeName.trim()) return setError("Enter your kitchen or restaurant name.");
    if (!contactName.trim()) return setError("Enter the name of the person we should call.");
    if (!/^\d{10}$/.test(mobile.trim())) return setError("Enter a 10-digit mobile number. The driver calls this on delivery.");
    if (!email.includes("@")) return setError("Enter an email address. Invoices are sent here.");
    if (regPassword.length < 6) return setError("Choose a password with at least 6 characters.");

    setLoading(true);
    try {
      const res = await register({
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
        pincode: pincode || "302020",
      });
      if (res.success) router.push("/");
      else setError(res.error || "We could not open the account. Check the details and try again.");
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <Wordmark variant="full" />
        <h1 className="font-display mt-10 text-[36px] leading-tight">You are signed in.</h1>
        <p className="mt-3 text-[16px] text-ink-2">
          Signed in as {user.name}, {user.company_name}.
        </p>
        <Link href="/" className="mt-8 rounded-full bg-ink px-6 py-3.5 text-[15px] text-white hover:bg-ink-2">
          Go to supplies
        </Link>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between border-r border-line p-10 lg:flex">
        <Link href="/" aria-label="AapnoKhet home">
          <Wordmark />
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&auto=format&fit=crop"
          alt="Sharbati wheat grains"
          className="my-10 aspect-[4/3] w-full rounded-lg object-cover"
        />
        <div>
          <p className="font-display max-w-[30ch] text-[24px] leading-snug">With a business account you get</p>
          <ul className="mt-4 space-y-2 text-[15px] text-ink-2">
            <li>15 days to pay, once your GSTIN and FSSAI licence are checked</li>
            <li>Bulk rates applied automatically on every order</li>
            <li>One login for all your outlets and delivery addresses</li>
          </ul>
        </div>
      </aside>

      <main className="flex flex-col px-4 py-8 sm:px-10 lg:px-16 lg:py-10">
        <div className="lg:hidden">
          <Link href="/" aria-label="AapnoKhet home">
            <Wordmark />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[440px] py-8 lg:my-auto lg:py-12">
          <div role="tablist" className="flex gap-7 border-b border-line">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => switchTab(t)}
                className={`relative pb-3.5 text-[15px] transition-colors ${tab === t ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {t === "login" ? "Sign in" : "Open an account"}
                {tab === t && <motion.span layoutId="auth-underline" className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {tab === "login" ? (
              <motion.form
                key="login"
                onSubmit={handleLogin}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="mt-10 space-y-5"
                noValidate
              >
                <h1 className="font-display text-[36px] leading-tight">Welcome back.</h1>
                <Field label="Email or mobile number">
                  <input
                    className={inputClass}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    autoFocus
                  />
                </Field>
                <Field label="Password">
                  <span className="relative block">
                    <input
                      className={`${inputClass} pr-12`}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-1.5 top-[calc(50%+3px)] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-ink"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.6} /> : <Eye className="h-4 w-4" strokeWidth={1.6} />}
                    </button>
                  </span>
                </Field>
                {error && <p role="alert" className="text-[14px] text-danger">{error}</p>}
                <button type="submit" disabled={loading} className="h-12 w-full rounded-full bg-ink text-[15px] text-white transition-colors hover:bg-ink-2 disabled:bg-ink-2">
                  {loading ? "Signing in…" : "Sign in"}
                </button>
                <p className="text-[14px] text-muted">
                  New to AapnoKhet?{" "}
                  <button type="button" onClick={() => switchTab("register")} className="text-ink underline underline-offset-4">
                    Open an account
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                onSubmit={handleRegister}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-10"
                noValidate
              >
                <h1 className="font-display text-[36px] leading-tight">Open a business account.</h1>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                  You can order straight away. We verify your GSTIN and FSSAI licence within a working day, then turn on 15-day credit.
                </p>

                <div className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Kitchen name">
                      <input className={inputClass} value={tradeName} onChange={(e) => setTradeName(e.target.value)} autoComplete="organization" />
                    </Field>
                    <Field label="Type">
                      <select className={inputClass} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                        {BUSINESS_TYPES.map((b) => (
                          <option key={b.value} value={b.value}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Registered company name" hint="if different">
                    <input className={inputClass} value={legalName} onChange={(e) => setLegalName(e.target.value)} />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name">
                      <input className={inputClass} value={contactName} onChange={(e) => setContactName(e.target.value)} autoComplete="name" />
                    </Field>
                    <Field label="Mobile">
                      <input className={inputClass} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" autoComplete="tel-national" />
                    </Field>
                  </div>
                  <Field label="Email" hint="for invoices">
                    <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="GSTIN" hint="optional">
                      <input className={`${inputClass} uppercase`} value={gstin} onChange={(e) => setGstin(e.target.value)} maxLength={15} />
                    </Field>
                    <Field label="FSSAI licence" hint="optional">
                      <input className={inputClass} value={fssaiNo} onChange={(e) => setFssaiNo(e.target.value.replace(/\D/g, ""))} maxLength={14} inputMode="numeric" />
                    </Field>
                  </div>
                  <Field label="Delivery address">
                    <input className={inputClass} value={addressLine} onChange={(e) => setAddressLine(e.target.value)} autoComplete="street-address" />
                  </Field>
                  <div className="grid grid-cols-2 gap-5">
                    <Field label="City">
                      <input className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
                    </Field>
                    <Field label="PIN code">
                      <input className={inputClass} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="postal-code" />
                    </Field>
                  </div>
                  <Field label="Password" hint="6 characters or more">
                    <input className={inputClass} type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} autoComplete="new-password" />
                  </Field>
                </div>

                {error && <p role="alert" className="mt-5 text-[14px] text-danger">{error}</p>}
                <button type="submit" disabled={loading} className="mt-7 h-12 w-full rounded-full bg-ink text-[15px] text-white transition-colors hover:bg-ink-2 disabled:bg-ink-2">
                  {loading ? "Opening account…" : "Open account"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
