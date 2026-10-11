"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  openCart: () => void;
  onToggleDashboard?: () => void;
}

const LINKS = [
  { href: "/#supplies", label: "Supplies" },
  { href: "/#ordering", label: "How ordering works" },
  { href: "/#quality", label: "Quality" },
];

export function Wordmark({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className={`font-display text-[22px] leading-none tracking-[-0.01em] ${inverted ? "text-white" : "text-ink"}`}>
        AapnoKhet
      </span>
      <span lang="hi" className={`font-hindi hidden text-[13px] leading-none min-[360px]:inline ${inverted ? "text-white/55" : "text-muted"}`}>
        आपणो खेत
      </span>
    </span>
  );
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, openCart, onToggleDashboard }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper/90 backdrop-blur-md transition-[border-color] duration-300 border-b ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Link href="/" aria-label="AapnoKhet home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 text-[14px] text-ink-2 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && user ? (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] text-ink-2 transition-colors hover:bg-wash hover:text-ink"
              >
                <span className="max-w-[160px] truncate">{user.company_name || user.name}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-paper text-[14px] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]"
                  >
                    <div className="border-b border-line px-4 py-3">
                      <p className="font-medium text-ink">{user.name}</p>
                      <p className="truncate text-[13px] text-muted">{user.email}</p>
                      <p className="mt-1.5 text-[13px] text-muted">
                        {user.kyb_status === "APPROVED" ? "Business verified" : "Verification in progress"}
                      </p>
                    </div>
                    <div className="py-1.5">
                      {onToggleDashboard && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onToggleDashboard();
                          }}
                          className="block w-full px-4 py-2 text-left text-ink-2 hover:bg-wash hover:text-ink"
                        >
                          Orders and credit
                        </button>
                      )}
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-ink-2 hover:bg-wash hover:text-ink">
                          Admin console
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="block w-full px-4 py-2 text-left text-ink-2 hover:bg-wash hover:text-ink"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden rounded-full px-3 py-2 text-[14px] text-ink-2 transition-colors hover:text-ink sm:block">
                Sign in
              </Link>
              <Link
                href="/login?tab=register"
                className="hidden rounded-full bg-ink px-4 py-2 text-[14px] text-white transition-colors hover:bg-ink-2 sm:block"
              >
                Open an account
              </Link>
            </>
          )}

          <button
            onClick={openCart}
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            className="relative flex h-10 items-center gap-2 rounded-full border border-line px-3.5 text-[14px] transition-colors hover:border-ink"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
            <span className="tabular">{cartCount}</span>
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.6} /> : <Menu className="h-5 w-5" strokeWidth={1.6} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-paper md:hidden"
          >
            <div className="flex flex-col px-4 py-3 text-[16px]">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="py-2.5 text-ink">
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-line pt-3">
                {isAuthenticated && user ? (
                  <>
                    {onToggleDashboard && (
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          onToggleDashboard();
                        }}
                        className="block py-2.5 text-left text-ink"
                      >
                        Orders and credit
                      </button>
                    )}
                    {isAdmin && (
                      <Link href="/admin" className="block py-2.5 text-ink">
                        Admin console
                      </Link>
                    )}
                    <button onClick={logout} className="block py-2.5 text-left text-muted">
                      Sign out of {user.company_name || user.name}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 py-1">
                    <Link href="/login" className="flex-1 rounded-full border border-line py-2.5 text-center text-ink">
                      Sign in
                    </Link>
                    <Link href="/login?tab=register" className="flex-1 rounded-full bg-ink py-2.5 text-center text-white">
                      Open an account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
