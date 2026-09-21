"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface NavItem {
  num: string;
  label: string;
  href: string;
  altHref?: string;
}

const navItems: NavItem[] = [
  { num: "01", label: "HOME", href: "/" },
  { num: "02", label: "ABOUT", href: "/about" },
  { num: "03", label: "EVENTS", href: "/events" },
  { num: "04", label: "SCHEDULE", href: "/schedule" },
  { num: "05", label: "GALLERY", href: "/gallery" },
  { num: "06", label: "VENUE", href: "/venue" },
  { num: "07", label: "TEAMS", href: "/teams" },
  { num: "08", label: "DASHBOARD", href: "/dashboard" },
  { num: "09", label: "LOGIN / SIGNUP", href: "/login", altHref: "/signup" },
  { num: "10", label: "CONTACT", href: "/contact" },
  { num: "11", label: "SUPPORT", href: "/faq", altHref: "/support" },
];

export default function SideNavRail() {
  const pathname = usePathname();

  if (pathname === "/intro-test" || pathname?.startsWith("/intro-test")) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeItem =
    navItems.find((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname.startsWith(item.href) ||
          (item.altHref && pathname.startsWith(item.altHref))
    )?.num ?? "01";

  return (
    <>
      {/* =========================================================
          NEURAL SPINE
      ========================================================= */}
      <aside
        className="side-nav-rail fixed left-0 top-0 z-50 hidden h-screen w-14.5 md:flex"
        aria-label="VYUHAM neural navigation"
      >
        {/* Deep background */}
        <div className="absolute inset-0 border-r border-emerald-400/10 bg-[#050908]/95 backdrop-blur-xl" />

        {/* =====================================================
            AMBIENT GLOW
        ===================================================== */}
        <motion.div
          animate={{
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-5.75 top-22.5 h-[calc(100%-180px)] w-8 rounded-full bg-emerald-500/10 blur-2xl"
        />

        {/* =====================================================
            TOP VYUHAM CORE
        ===================================================== */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="group absolute left-1/2 top-5 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center"
          aria-label="Open VYUHAM navigation"
        >
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border border-emerald-400/30 border-dashed"
          />

          {/* Second ring */}
          <motion.div
            animate={{
              scale: [0.9, 1.08, 0.9],
              opacity: [0.35, 0.8, 0.35],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-1.25 rounded-full border border-cyan-400/40"
          />

          {/* Core */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 5px rgba(16,185,129,.3)",
                "0 0 18px rgba(16,185,129,.8)",
                "0 0 5px rgba(16,185,129,.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="relative h-3 w-3 rounded-full bg-emerald-400"
          />

          {/* Core crosshair */}
          <span className="absolute -left-1 top-1/2 h-px w-11 -translate-y-1/2 bg-emerald-400/20" />
          <span className="absolute left-1/2 -top-1 h-11 w-px -translate-x-1/2 bg-emerald-400/20" />
        </button>

        {/* =====================================================
            SYSTEM LABEL
        ===================================================== */}
        <div className="absolute left-1/2 top-17.5 -translate-x-1/2">
          <span className="font-mono text-[7px] tracking-[0.25em] text-emerald-400/60 [writing-mode:vertical-rl]">
            VYUHAM
          </span>
        </div>

        {/* =====================================================
            NEURAL SPINE
        ===================================================== */}
        <div className="absolute left-1/2 top-27 bottom-17.5 w-px -translate-x-1/2">
          {/* Main spine */}
          <div className="absolute inset-0 bg-linear-to-b from-emerald-400/10 via-emerald-400/50 to-emerald-400/10" />

          {/* Moving energy */}
          <motion.div
            animate={{
              top: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 h-16 w-0.5 -translate-x-1/2 bg-linear-to-b from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_rgba(34,211,238,.9)]"
          />

          {/* Reverse energy pulse */}
          <motion.div
            animate={{
              top: ["100%", "0%"],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
              delay: 1.2,
            }}
            className="absolute left-1/2 h-10 w-px -translate-x-1/2 bg-linear-to-t from-transparent via-emerald-300 to-transparent"
          />
        </div>

        {/* =====================================================
            NAVIGATION NODES
        ===================================================== */}
        <div className="absolute left-0 top-24 flex w-full flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = activeItem === item.num;
            const isHovered = hovered === item.num;

            return (
              <div
                key={item.num}
                className="relative flex h-9.5 items-center"
                onMouseEnter={() => setHovered(item.num)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Horizontal neural branch */}
                <motion.div
                  animate={{
                    width: isActive || isHovered ? 20 : 9,
                    opacity: isActive || isHovered ? 1 : 0.35,
                  }}
                  className="absolute left-7.25 h-px origin-left bg-linear-to-r from-emerald-400 to-cyan-300"
                />

                {/* Node */}
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className="absolute left-1/2 z-10 -translate-x-1/2"
                >
                  <motion.div
                    animate={{
                      scale: isActive || isHovered ? 1.35 : 1,
                      boxShadow:
                        isActive || isHovered
                          ? "0 0 14px rgba(16,185,129,.9)"
                          : "0 0 0px rgba(16,185,129,0)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    }}
                    className={`relative h-2.25 w-2.25 rounded-full border ${
                      isActive || isHovered
                        ? "border-cyan-300 bg-emerald-400"
                        : "border-emerald-400/40 bg-[#07100c]"
                    }`}
                  >
                    {/* Inner core */}
                    {(isActive || isHovered) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0.5 rounded-full bg-white"
                      />
                    )}

                    {/* Pulse ring */}
                    {isActive && (
                      <motion.span
                        animate={{
                          scale: [1, 2.4],
                          opacity: [0.7, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-full border border-emerald-400"
                      />
                    )}
                  </motion.div>
                </Link>

                {/* =================================================
                    HUD LABEL
                ================================================= */}
                <AnimatePresence>
                  {(isHovered || isActive) && (
                    <motion.div
                      initial={{ opacity: 0, x: -8, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-12 z-30 whitespace-nowrap"
                    >
                      <Link
                        href={item.href}
                        className="group flex items-center gap-2 rounded-sm border border-emerald-400/20 bg-[#07100c]/95 px-2.5 py-1.5 shadow-[0_0_25px_rgba(16,185,129,.08)] backdrop-blur-md"
                      >
                        <span className="font-mono text-[8px] text-emerald-400/60">
                          {item.num}
                        </span>

                        <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-emerald-100">
                          {item.label}
                        </span>

                        <span className="text-[8px] text-cyan-400">
                          →
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Connection particles */}
                {(isHovered || isActive) && (
                  <>
                    <motion.span
                      initial={{ left: 29, opacity: 0 }}
                      animate={{ left: 42, opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                      }}
                      className="absolute h-0.75 w-0.75 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]"
                    />

                    <motion.span
                      initial={{ left: 29, opacity: 0 }}
                      animate={{ left: 39, opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: 0.25,
                      }}
                      className="absolute h-0.5 w-0.5 rounded-full bg-emerald-300"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* =====================================================
            BOTTOM SYSTEM NODE
        ===================================================== */}
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new Event("open-cyber-terminal"));
          }}
          className="group absolute bottom-5 left-1/2 -translate-x-1/2"
          aria-label="System status"
        >
          <motion.div
            whileHover={{ scale: 1.15 }}
            className="relative flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/5"
          >
            <span className="absolute inset-1 rounded-full border border-emerald-400/20" />

            <span className="font-mono text-[9px] font-bold text-emerald-300">
              ◈
            </span>

            <motion.span
              animate={{
                scale: [1, 1.8],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-full border border-emerald-400/40"
            />
          </motion.div>

          {/* System status tooltip */}
          <span className="pointer-events-none absolute bottom-0 left-9 hidden whitespace-nowrap rounded border border-emerald-400/20 bg-[#07100c] px-2 py-1 font-mono text-[8px] text-emerald-300 group-hover:block">
            NEURAL MATRIX // ACTIVE
          </span>
        </button>

        {/* =====================================================
            SIDE STATUS
        ===================================================== */}
        <div className="absolute bottom-1/2 left-1.25 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1">
            <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />

            <span className="font-mono text-[6px] tracking-[0.2em] text-emerald-400/30 [writing-mode:vertical-rl]">
              NEURAL LINK // ONLINE
            </span>
          </div>
        </div>
      </aside>

      {/* =========================================================
          EXPANDED NEURAL HUD
      ========================================================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 hidden bg-black/50 backdrop-blur-[2px] md:block"
            />

            {/* HUD */}
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 24,
              }}
              className="fixed left-14.5 top-1/2 z-50 hidden w-87.5 -translate-y-1/2 overflow-hidden rounded-md border border-emerald-400/20 bg-[#050908]/95 shadow-[0_0_80px_rgba(16,185,129,.12)] backdrop-blur-2xl md:block"
            >
              {/* HUD top line */}
              <div className="flex items-center justify-between border-b border-emerald-400/10 px-5 py-3">
                <div>
                  <div className="font-mono text-[9px] tracking-[0.3em] text-emerald-400">
                    VYUHAM // NEURAL CORE
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                    <span className="font-mono text-[8px] text-muted">
                      SYSTEM ONLINE
                    </span>
                  </div>
                </div>

                <div className="font-mono text-[8px] text-emerald-400/40">
                  N-{String(navItems.length).padStart(2, "0")}
                </div>
              </div>

              {/* Navigation */}
              <div className="p-4">
                <div className="mb-3 font-mono text-[8px] tracking-[0.25em] text-muted">
                  /// NAVIGATION NODES
                </div>

                <div className="max-h-[calc(100vh-220px)] space-y-0.5 overflow-y-auto pr-1">
                  {navItems.map((item) => {
                    const isActive = activeItem === item.num;

                    return (
                      <Link
                        key={item.num}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group relative flex items-center gap-4 overflow-hidden rounded-sm border border-transparent px-3 py-2 transition hover:border-emerald-400/20 hover:bg-emerald-400/5"
                      >
                        {/* Node */}
                        <div className="relative flex h-5 w-5 items-center justify-center">
                          <span
                            className={`absolute h-2 w-2 rounded-full ${
                              isActive
                                ? "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,.9)]"
                                : "bg-emerald-400/20 group-hover:bg-emerald-400"
                            }`}
                          />

                          {isActive && (
                            <motion.span
                              animate={{
                                scale: [1, 2],
                                opacity: [0.6, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                              className="absolute h-3 w-3 rounded-full border border-emerald-400"
                            />
                          )}
                        </div>

                        <span className="font-mono text-[9px] text-muted">
                          {item.num}
                        </span>

                        <span
                          className={`font-display text-sm font-bold tracking-wider ${
                            isActive
                              ? "text-emerald-300"
                              : "text-paper group-hover:text-emerald-300"
                          }`}
                        >
                          {item.label}
                        </span>

                        <span className="ml-auto font-mono text-[8px] text-muted transition group-hover:text-emerald-400">
                          {isActive ? "ACTIVE" : "NODE"}
                        </span>

                        {/* Hover energy */}
                        <motion.div
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.7 }}
                          className="pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-emerald-400/10 to-transparent"
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* System Status / Diagnostics (Replaces terminal hint) */}
                <div className="mt-3 flex w-full items-center justify-between rounded border border-emerald-400/20 bg-emerald-400/5 px-3 py-2.5 font-mono text-[9px] text-emerald-300">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span>[ NEURAL LINK // ACTIVE ]</span>
                  </div>
                  <span className="font-semibold text-emerald-400/60">SYS-26</span>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-emerald-400/10 px-5 py-3">
                <div className="flex items-center justify-between font-mono text-[7px] text-muted">
                  <span>DIGITAL UNIVERSITY KERALA</span>
                  <span className="text-emerald-400/60">
                    OCT 30 — NOV 01
                  </span>
                </div>
              </div>

              {/* Corner decorations */}
              <span className="absolute left-0 top-0 h-8 w-px bg-emerald-400/50" />
              <span className="absolute left-0 top-0 h-px w-8 bg-emerald-400/50" />

              <span className="absolute bottom-0 right-0 h-8 w-px bg-cyan-400/50" />
              <span className="absolute bottom-0 right-0 h-px w-8 bg-cyan-400/50" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

