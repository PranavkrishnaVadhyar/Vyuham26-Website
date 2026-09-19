"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { num: "01", label: "HOME", href: "/" },
  { num: "02", label: "ABOUT", href: "/about" },
  { num: "03", label: "EVENTS", href: "/events" },
  { num: "04", label: "SCHEDULE", href: "/schedule" },
  { num: "05", label: "EXPO", href: "/events/tech-expo" },
  { num: "06", label: "VENUE", href: "/venue" },
];

export default function SideNavRail() {
  const [open, setOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  return (
    <>
      <aside
        className="fixed top-0 left-0 z-40 hidden h-screen w-12 flex-col justify-between border-r border-line bg-ink/90 py-4 backdrop-blur-md md:flex"
        aria-label="Side navigation rail"
      >
        {/* Top: Menu toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setOpen(!open)}
            className="flex h-8 w-8 items-center justify-center rounded border border-line text-paper transition hover:border-green hover:text-green"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Middle: Vertical brand text */}
        <div className="flex items-center justify-center">
          <span
            className="font-mono text-[11px] font-bold tracking-[0.45em] text-paper/80 uppercase [writing-mode:vertical-rl] select-none"
            style={{ transform: "rotate(180deg)" }}
          >
            VYUHAM <span className="text-green">&apos;26</span>
          </span>
        </div>

        {/* Bottom: Numbered index indicators */}
        <div className="flex flex-col items-center gap-1.5 font-mono text-[10px]">
          {navItems.map((item) => (
            <Link
              key={item.num}
              href={item.href}
              onMouseEnter={() => setActiveHover(item.num)}
              onMouseLeave={() => setActiveHover(null)}
              className="relative flex h-8 w-full items-center justify-center text-muted transition hover:text-green"
              title={`${item.num} / ${item.label}`}
            >
              <span className="tabular-nums">{item.num}</span>
              {activeHover === item.num && (
                <motion.div
                  layoutId="side-rail-hover"
                  className="absolute left-0 h-full w-[2px] bg-green"
                  transition={{ duration: 0.15 }}
                />
              )}
            </Link>
          ))}
        </div>
      </aside>

      {/* Expanded Full Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 left-12 z-40 hidden h-screen w-72 flex-col justify-between border-r border-line bg-ink/95 p-8 backdrop-blur-xl md:flex"
          >
            <div>
              <div className="mb-8 font-mono text-xs tracking-widest text-green">
                {'/// VYUHAM &apos;26 INDEX'}
              </div>
              <nav className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.num}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 text-paper no-underline transition hover:text-green"
                  >
                    <span className="font-mono text-xs text-muted group-hover:text-green">
                      {item.num}/
                    </span>
                    <span className="font-display text-xl font-bold tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-line pt-4 font-mono text-[10px] text-muted">
              <p>DIGITAL UNIVERSITY KERALA</p>
              <p className="mt-1 text-green">OCT 30 — NOV 01, 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
