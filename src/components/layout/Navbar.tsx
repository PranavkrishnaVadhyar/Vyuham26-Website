"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/about", label: "About", code: "01" },
  { href: "/schedule", label: "Schedule", code: "02" },
  { href: "/events", label: "Events", code: "03" },
  { href: "/gallery", label: "Gallery", code: "04" },
  { href: "/sponsors", label: "Sponsors", code: "05" },
  { href: "/contact", label: "Contact", code: "06" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-40 border-b border-white/[0.07] bg-[#020504]/85 backdrop-blur-xl md:left-12"
      aria-label="Primary navigation"
    >
      {/* =========================================================
          ATMOSPHERIC GLOW
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-20 w-80 -translate-x-1/2 bg-[#c8ff42]/[0.025] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,255,66,.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,255,66,.5) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,.3) 4px)",
          }}
        />
      </div>

      {/* =========================================================
          MAIN NAV
      ========================================================== */}

      <div className="relative mx-auto flex h-[72px] w-[min(1240px,calc(100%-32px))] items-center justify-between md:h-[88px] md:w-[min(1240px,calc(100%-64px))]">

        {/* =======================================================
            BRAND
        ======================================================== */}

        <Link
          href="/"
          className="group relative flex items-center gap-3 font-display font-bold tracking-[-0.06em] text-paper no-underline"
          aria-label="Vyuham 26 home"
          onClick={() => setMobileOpen(false)}
        >
          {/* Logo Core */}
          <div className="relative flex h-11 w-11 items-center justify-center md:h-12 md:w-12">

            {/* Outer energy ring */}
            <motion.div
              animate={{
                opacity: [0.25, 0.5, 0.25],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full border border-[#c8ff42]/20"
            />

            <div className="absolute inset-1 rounded-full border border-white/[0.05]" />

            <Image
              src="/logo.png"
              alt="Vyuham '26 Logo"
              width={48}
              height={48}
              priority
              loading="eager"
              className="relative z-10 h-10 w-10 object-contain drop-shadow-[0_0_16px_rgba(200,255,66,.35)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_24px_rgba(200,255,66,.55)] md:h-11 md:w-11"
            />
          </div>

          {/* Brand name */}
          <div className="hidden sm:block">
            <div className="flex items-center">
              <span className="font-display text-[17px] font-bold tracking-[0.16em]">
                VYUHAM
              </span>

              <span className="font-display text-[17px] font-bold tracking-[0.16em] text-[#c8ff42] [text-shadow:0_0_14px_rgba(200,255,66,.3)]">
                &apos;26
              </span>
            </div>

          </div>
        </Link>

        {/* =======================================================
            DESKTOP NAVIGATION
        ======================================================== */}

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-3.5 py-3 no-underline"
              >
                {/* Active background */}
                {active && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded bg-[#c8ff42]/[0.045]"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                {/* Bottom energy line */}
                <motion.span
                  animate={{
                    scaleX: active ? 1 : 0,
                    opacity: active ? 1 : 0,
                  }}
                  className="absolute bottom-0 left-3 right-3 h-px origin-center bg-[#c8ff42] shadow-[0_0_8px_rgba(200,255,66,.7)]"
                />

                <span className="relative flex items-center gap-2">
                  <span
                    className={`font-mono text-[7px] transition-colors ${
                      active
                        ? "text-[#c8ff42]/60"
                        : "text-white/15 group-hover:text-[#c8ff42]/40"
                    }`}
                  >
                    {link.code}
                  </span>

                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.13em] transition-colors ${
                      active
                        ? "text-[#c8ff42]"
                        : "text-white/45 group-hover:text-paper"
                    }`}
                  >
                    {link.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* =======================================================
            DESKTOP AUTH
        ======================================================== */}

        <div className="hidden items-center gap-4 md:flex">

          {/* Network status */}
          <div className="mr-1 flex items-center gap-2 border-r border-white/[0.07] pr-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c8ff42] opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#c8ff42] shadow-[0_0_8px_#c8ff42]" />
            </span>

            <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/25">
              NETWORK ONLINE
            </span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-2 overflow-hidden border border-[#c8ff42]/40 bg-[#c8ff42]/[0.08] px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#c8ff42] no-underline transition-all duration-300 hover:border-[#c8ff42] hover:bg-[#c8ff42]/[0.16]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff42]" />
                <span className="max-w-[120px] truncate">{user?.name || "OPERATIVE"}</span>
                <span className="text-white/40">// DASHBOARD</span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="cursor-pointer font-mono text-[8px] uppercase tracking-[0.14em] text-white/40 transition-colors hover:text-white"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-white/40 no-underline transition-colors hover:text-[#c8ff42]"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="group relative inline-flex items-center overflow-hidden border border-[#c8ff42]/40 bg-[#c8ff42]/[0.08] px-4 py-2.5 font-mono text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#c8ff42] no-underline transition-all duration-300 hover:border-[#c8ff42]/70 hover:bg-[#c8ff42]/[0.14] hover:shadow-[0_0_25px_rgba(200,255,66,.12)]"
              >
                {/* Button scan */}
                <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-[#c8ff42]/20 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]" />

                <span className="relative">
                  Sign Up
                </span>

                <span className="relative ml-2 text-sm leading-none transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </>
          )}
        </div>

        {/* =======================================================
            MOBILE MENU BUTTON
        ======================================================== */}

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded border border-white/[0.08] bg-white/[0.02] md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <div className="flex w-5 flex-col gap-[5px]">
            <motion.span
              animate={
                mobileOpen
                  ? { rotate: 45, y: 6 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.25 }}
              className="block h-px w-5 origin-center bg-paper"
            />

            <motion.span
              animate={
                mobileOpen
                  ? { opacity: 0, x: 5 }
                  : { opacity: 1, x: 0 }
              }
              transition={{ duration: 0.2 }}
              className="block h-px w-5 bg-paper"
            />

            <motion.span
              animate={
                mobileOpen
                  ? { rotate: -45, y: -6 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.25 }}
              className="block h-px w-5 origin-center bg-paper"
            />
          </div>
        </button>
      </div>

      {/* =========================================================
          MOBILE PANEL
      ========================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-[72px] z-20 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{
                opacity: 0,
                x: "100%",
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: "100%",
              }}
              transition={{
                type: "spring",
                damping: 26,
                stiffness: 190,
              }}
              className="fixed inset-x-0 top-[72px] z-30 h-[calc(100dvh-72px)] overflow-hidden border-t border-white/[0.07] bg-[#020504]/97 backdrop-blur-2xl md:hidden"
            >
              {/* Mobile grid */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(200,255,66,.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(200,255,66,.5) 1px, transparent 1px)
                  `,
                  backgroundSize: "42px 42px",
                }}
              />

              {/* Green atmospheric glow */}
              <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#c8ff42]/[0.04] blur-[100px]" />

              <div className="relative flex h-full flex-col px-6 pb-8 pt-8">

                {/* Mobile header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="mb-8 flex items-center justify-between border-b border-white/[0.07] pb-5"
                >
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8ff42]/60">
                      VYUHAM&apos;26
                    </span>

                    <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.16em] text-white/20">
                      NAVIGATION SYSTEM
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff42] shadow-[0_0_8px_#c8ff42]" />

                    <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">
                      ONLINE
                    </span>
                  </div>
                </motion.div>

                {/* Links */}
                <div className="space-y-1">
                  {navLinks.map((link, i) => {
                    const active = isActive(link.href);

                    return (
                      <motion.div
                        key={link.href}
                        initial={{
                          opacity: 0,
                          x: 30,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: 0.08 + i * 0.045,
                          duration: 0.35,
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`group relative flex items-center justify-between overflow-hidden rounded border px-4 py-4 no-underline transition-all ${
                            active
                              ? "border-[#c8ff42]/25 bg-[#c8ff42]/[0.06]"
                              : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.02]"
                          }`}
                        >
                          <span className="flex items-center gap-4">
                            <span
                              className={`font-mono text-[8px] ${
                                active
                                  ? "text-[#c8ff42]/70"
                                  : "text-white/20"
                              }`}
                            >
                              {link.code}
                            </span>

                            <span
                              className={`font-display text-xl font-semibold ${
                                active
                                  ? "text-[#c8ff42]"
                                  : "text-paper"
                              }`}
                            >
                              {link.label}
                            </span>
                          </span>

                          <span
                            className={`font-mono text-sm transition-transform duration-300 group-hover:translate-x-1 ${
                              active
                                ? "text-[#c8ff42]"
                                : "text-white/20"
                            }`}
                          >
                            →
                          </span>

                          {active && (
                            <span className="absolute bottom-0 left-0 h-px w-full bg-[#c8ff42] shadow-[0_0_10px_rgba(200,255,66,.7)]" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile auth */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.4,
                  }}
                  className="mt-auto"
                >
                  <div className="mb-5 border-t border-white/[0.07] pt-5">
                    <div className="mb-4 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.18em]">
                      <span className="text-white/20">
                        AUTHENTICATION NODE
                      </span>

                      <span className="text-[#c8ff42]/50">
                        READY
                      </span>
                    </div>

                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between rounded border border-[#c8ff42]/40 bg-[#c8ff42]/10 p-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#c8ff42] no-underline"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#c8ff42]" />
                            <span>{user?.name || "OPERATIVE"} // DASHBOARD</span>
                          </div>
                          <span>→</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setMobileOpen(false);
                          }}
                          className="w-full rounded border border-white/10 bg-white/[0.02] py-2.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/50"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href="/login"
                          onClick={() => setMobileOpen(false)}
                          className="inline-flex items-center justify-center rounded border border-white/[0.1] bg-white/[0.02] px-5 py-3.5 font-mono text-[9px] font-extrabold uppercase tracking-[0.15em] text-paper no-underline transition-all hover:border-[#c8ff42]/40 hover:text-[#c8ff42]"
                        >
                          Login
                        </Link>

                        <Link
                          href="/signup"
                          onClick={() => setMobileOpen(false)}
                          className="inline-flex items-center justify-center rounded border border-[#c8ff42]/40 bg-[#c8ff42]/10 px-5 py-3.5 font-mono text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#c8ff42] no-underline transition-all hover:bg-[#c8ff42]/15"
                        >
                          Sign Up
                          <span className="ml-2 text-sm">
                            →
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Bottom telemetry */}
                  <div className="flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.15em] text-white/15">
                    <span>FUTURE AWAITS</span>

                    <span className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-[#c8ff42]/60" />
                      SYSTEM ONLINE
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
