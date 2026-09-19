"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/schedule", label: "Schedule" },
  { href: "/events", label: "Events" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/venue", label: "Venue" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 right-0 left-0 md:left-12 z-40 border-b border-line bg-ink/80 backdrop-blur-lg"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex h-[72px] w-[min(1200px,calc(100%-48px))] items-center justify-between md:h-[92px] md:w-[min(1200px,calc(100%-64px))]">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-[17px] font-bold tracking-[-0.06em] text-paper no-underline group"
          aria-label="Vyuham 26 home"
        >
          <Image
            src="/logo.png"
            alt="Vyuham '26 Logo"
            width={40}
            height={40}
            priority
            loading="eager"
            className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(200,255,66,0.5)] transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display font-bold tracking-wider">
            VYUHAM<span className="text-green">&apos;26</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/events"
          className="hidden border-b border-green pb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper no-underline transition-colors hover:text-green md:block"
        >
          Explore Events{" "}
          <span className="ml-2 text-[17px] text-green" aria-hidden="true">
            ↗
          </span>
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-[1.5px] w-5 bg-paper"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-[1.5px] w-5 bg-paper"
          />
          <motion.span
            animate={
              mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
            }
            className="block h-[1.5px] w-5 bg-paper"
          />
        </button>
      </div>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-[72px] z-30 flex flex-col gap-6 border-t border-line bg-ink/95 px-8 pt-12 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-display text-2xl font-semibold tracking-tight text-paper no-underline transition-colors hover:text-green"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto mb-12"
            >
              <Link
                href="/events"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center bg-green px-5 py-3 font-mono text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink no-underline"
              >
                Explore Events <span className="ml-2 text-base">→</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
