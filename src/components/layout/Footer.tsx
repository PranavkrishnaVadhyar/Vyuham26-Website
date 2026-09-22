"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const exploreLinks = [
  { href: "/about", label: "About", code: "01" },
  { href: "/schedule", label: "Schedule", code: "02" },
  { href: "/venue", label: "Venue", code: "03" },
  { href: "/sponsors", label: "Sponsors", code: "04" },
  { href: "/contact", label: "Contact", code: "05" },
  { href: "/faq", label: "FAQ", code: "06" },
];

const participateLinks = [
  { href: "/events", label: "Events", code: "01" },
  { href: "/hackathon", label: "Hackathon", code: "02" },
  { href: "/gallery", label: "Gallery", code: "03" },
  { href: "/teams", label: "Teams", code: "04" },
  { href: "/leaderboard", label: "Leaderboard", code: "05" },
  { href: "/results", label: "Results", code: "06" },
];

const accountLinks = [
  { href: "/login", label: "Login", code: "01" },
  { href: "/signup", label: "Sign Up", code: "02" },
  { href: "/dashboard", label: "Dashboard", code: "03" },
  { href: "/profile", label: "Profile", code: "04" },
  { href: "/ticket", label: "Ticket", code: "05" },
  { href: "/certificates", label: "Certificates", code: "06" },
];

function FooterLink({
  href,
  label,
  code,
}: {
  href: string;
  label: string;
  code: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-white/35 no-underline transition-all duration-300 hover:translate-x-1 hover:text-[#c8ff42]"
    >
      <span className="w-4 text-[7px] text-white/15 transition-colors group-hover:text-[#c8ff42]/50">
        {code}
      </span>

      <span>{label}</span>

      <span className="ml-auto translate-x-[-4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        →
      </span>
    </Link>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; code: string }[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-[#c8ff42] shadow-[0_0_7px_rgba(200,255,66,.6)]" />

        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8ff42]/65">
          {title}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3.5">
        {links.map((link) => (
          <FooterLink
            key={link.href}
            href={link.href}
            label={link.label}
            code={link.code}
          />
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#020504] text-paper">
      {/* =========================================================
          ATMOSPHERIC BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Main glow */}
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 bg-[#c8ff42]/[0.025] blur-[130px]" />

        <div className="absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-[#c8ff42]/[0.018] blur-[100px]" />

        <div className="absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-[#c8ff42]/[0.018] blur-[100px]" />

        {/* Technical grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,255,66,.45) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,255,66,.45) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)
            `,
            backgroundSize: "12px 12px",
          }}
        />

        {/* Scanlines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,.25) 4px)",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.5)_100%)]" />
      </div>

      {/* =========================================================
          TOP SIGNAL BAR
      ========================================================== */}

      <div className="relative border-b border-white/[0.06]">
        <div className="mx-auto flex w-[min(1200px,calc(100%-40px))] items-center justify-between gap-4 py-3 md:w-[min(1200px,calc(100%-64px))]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c8ff42] opacity-40" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#c8ff42] shadow-[0_0_8px_#c8ff42]" />
            </span>

            <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/25">
              VYUHAM&apos;26 NETWORK
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[7px] uppercase tracking-[0.18em] text-white/20">
            <span className="hidden sm:inline">
              TRANSMISSION: SECURE
            </span>

            <span className="text-[#c8ff42]/45">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN FOOTER
      ========================================================== */}

      <div className="relative mx-auto w-[min(1200px,calc(100%-40px))] md:w-[min(1200px,calc(100%-64px))]">

        <div className="grid gap-12 border-b border-white/[0.07] py-16 md:grid-cols-[1.35fr_1fr_1fr_1fr] md:gap-10 md:py-20">

          {/* =====================================================
              BRAND / COMMAND NODE
          ====================================================== */}

          <div className="relative">
            {/* Corner marker */}
            <div className="absolute -left-3 -top-3 h-7 w-7 border-l border-t border-[#c8ff42]/20" />

            <Link
              href="/"
              className="group inline-flex items-center gap-3 font-display text-[17px] font-bold tracking-[-0.06em] text-paper no-underline"
            >
              {/* Logo Core */}
              <div className="relative flex h-12 w-12 items-center justify-center">
                <motion.div
                  animate={{
                    opacity: [0.2, 0.45, 0.2],
                    scale: [1, 1.06, 1],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full border border-[#c8ff42]/20"
                />

                <div className="absolute inset-1 rounded-full border border-white/[0.05]" />

                <Image
                  src="/logo.png"
                  alt="Vyuham '26 Logo"
                  width={44}
                  height={44}
                  loading="eager"
                  className="relative z-10 h-10 w-10 object-contain drop-shadow-[0_0_15px_rgba(200,255,66,.45)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_24px_rgba(200,255,66,.65)]"
                />
              </div>

              <div>
                <div className="flex items-center">
                  <span className="font-display font-bold tracking-[0.15em]">
                    VYUHAM
                  </span>

                  <span className="font-display font-bold tracking-[0.15em] text-[#c8ff42]">
                    &apos;26
                  </span>
                </div>

                <span className="mt-0.5 block font-mono text-[7px] uppercase tracking-[0.2em] text-white/20">
                  FUTURE AWAITS
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-xs font-mono text-[9px] leading-7 tracking-[0.08em] text-white/30">
              Digital University Kerala
              <br />
              Technocity, Thiruvananthapuram
            </p>

            {/* Transmission */}
            <div className="mt-7 rounded border border-white/[0.06] bg-white/[0.015] p-4">
              <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/20">
                Transmission Channel
              </p>

              <a
                href="mailto:techfest@duk.ac.in"
                className="mt-2 block font-mono text-xs text-white/55 no-underline transition-colors hover:text-[#c8ff42]"
              >
                techfest@duk.ac.in
              </a>

              <div className="mt-3 flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.15em] text-[#c8ff42]/40">
                <span className="h-1 w-1 rounded-full bg-[#c8ff42]" />
                Channel Active
              </div>
            </div>
          </div>

          {/* Explore */}
          <FooterColumn
            title="Explore"
            links={exploreLinks}
          />

          {/* Participate */}
          <FooterColumn
            title="Participate"
            links={participateLinks}
          />

          {/* Account */}
          <FooterColumn
            title="Account"
            links={accountLinks}
          />
        </div>

        {/* =======================================================
            STATUS / BOTTOM ROW
        ======================================================== */}

        <div className="relative flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-white/25">
              © 2026 VYUHAM — Digital University Kerala
            </p>

            <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" />

            <span className="font-mono text-[8px] uppercase tracking-[0.17em] text-white/15">
              All Systems Reserved
            </span>
          </div>

          {/* OS version */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/20">
              VYUHAM OS
            </span>

            <span className="rounded border border-[#c8ff42]/15 bg-[#c8ff42]/[0.04] px-2 py-1 font-mono text-[7px] tracking-[0.15em] text-[#c8ff42]/55">
              v26.4
            </span>
          </div>

          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#c8ff42]/40">
            THE FUTURE AWAITS
          </p>
        </div>

        {/* Bottom energy line */}
        <div className="relative h-px w-full overflow-hidden bg-white/[0.04]">
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-[#c8ff42] to-transparent shadow-[0_0_8px_rgba(200,255,66,.7)]"
          />
        </div>
      </div>

      {/* =========================================================
          FINAL FOOTER SIGNAL
      ========================================================== */}

      <div className="relative border-t border-white/[0.04]">
        <div className="mx-auto flex w-[min(1200px,calc(100%-40px))] items-center justify-between py-3 md:w-[min(1200px,calc(100%-64px))]">
          <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/10">
            END TRANSMISSION
          </span>

          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#c8ff42]/50" />

            <span className="font-mono text-[6px] uppercase tracking-[0.22em] text-white/15">
              CONNECTION STABLE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
