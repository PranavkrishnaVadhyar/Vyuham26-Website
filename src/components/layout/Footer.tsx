"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* ============================================================================
   FOOTER NAVIGATION DATA
============================================================================ */

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

/* ============================================================================
   FOOTER LINK
============================================================================ */

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
      className="
        group flex items-center gap-3
        font-mono text-[11px]
        uppercase tracking-[0.12em]
        text-white/50
        no-underline
        transition-all duration-300
        hover:translate-x-1
        hover:text-[#2ee59d]
      "
    >
      <span
        className="
          w-5
          text-[8px]
          text-white/20
          transition-colors
          group-hover:text-[#2ee59d]/60
        "
      >
        {code}
      </span>

      <span>{label}</span>

      <span
        className="
          ml-auto
          translate-x-[-4px]
          opacity-0
          transition-all duration-300
          group-hover:translate-x-0
          group-hover:opacity-100
        "
      >
        →
      </span>
    </Link>
  );
}

/* ============================================================================
   FOOTER COLUMN
============================================================================ */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; code: string }[];
}) {
  return (
    <div>
      {/* Column heading */}
      <div className="flex items-center gap-2">
        <span
          className="
            h-1.5 w-1.5 rounded-full
            bg-[#2ee59d]
            shadow-[0_0_8px_rgba(46,229,157,.65)]
          "
        />

        <p
          className="
            font-mono text-[9px]
            font-medium
            uppercase tracking-[0.2em]
            text-[#2ee59d]/75
          "
        >
          {title}
        </p>
      </div>

      {/* Links */}
      <div className="mt-6 flex flex-col gap-4">
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

/* ============================================================================
   FOOTER
============================================================================ */

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#020504] text-paper">

      {/* ======================================================================
          ATMOSPHERIC BACKGROUND
      ====================================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Main glow */}
        <div
          className="
            absolute left-1/2 top-0
            h-[400px] w-[600px]
            -translate-x-1/2
            bg-[#2ee59d]/[0.025]
            blur-[130px]
          "
        />

        {/* Side glows */}
        <div
          className="
            absolute -left-40 bottom-0
            h-72 w-72 rounded-full
            bg-[#2ee59d]/[0.018]
            blur-[100px]
          "
        />

        <div
          className="
            absolute -right-40 bottom-0
            h-72 w-72 rounded-full
            bg-[#2ee59d]/[0.018]
            blur-[100px]
          "
        />

        {/* Technical grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(46,229,157,.45) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(46,229,157,.45) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,.45) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.45) 1px,
                transparent 1px
              )
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
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.5)_100%)]
          "
        />
      </div>

      {/* ======================================================================
          TOP SIGNAL BAR
      ====================================================================== */}

      <div className="relative border-b border-white/[0.06]">
        <div
          className="
            mx-auto flex
            w-[min(1200px,calc(100%-40px))]
            items-center justify-between
            gap-4
            py-4
            md:w-[min(1200px,calc(100%-64px))]
          "
        >
          <div className="flex items-center gap-3">

            {/* Online indicator */}
            <span className="relative flex h-2 w-2">
              <span
                className="
                  absolute
                  inline-flex h-full w-full
                  animate-ping
                  rounded-full
                  bg-[#2ee59d]
                  opacity-40
                "
              />

              <span
                className="
                  relative h-2 w-2
                  rounded-full
                  bg-[#2ee59d]
                  shadow-[0_0_8px_#2ee59d]
                "
              />
            </span>

            <span
              className="
                font-mono text-[8px]
                uppercase tracking-[0.2em]
                text-white/35
              "
            >
              VYUHAM&apos;26 NETWORK
            </span>
          </div>

          <div
            className="
              flex items-center gap-4
              font-mono text-[8px]
              uppercase tracking-[0.18em]
              text-white/25
            "
          >
            <span className="hidden sm:inline">
              TRANSMISSION: SECURE
            </span>

            <span className="text-[#2ee59d]/60">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================================
          MAIN FOOTER
      ====================================================================== */}

      <div
        className="
          relative mx-auto
          w-[min(1200px,calc(100%-40px))]
          md:w-[min(1200px,calc(100%-64px))]
        "
      >
        <div
          className="
            grid gap-12
            border-b border-white/[0.07]
            py-16
            md:grid-cols-[1.35fr_1fr_1fr_1fr]
            md:gap-10
            md:py-20
          "
        >

          {/* ==================================================================
              BRAND / COMMAND NODE
          ================================================================== */}

          <div className="relative">

            {/* Corner marker */}
            <div
              className="
                absolute -left-3 -top-3
                h-7 w-7
                border-l border-t
                border-[#2ee59d]/20
              "
            />

            <Link
              href="/"
              className="
                group inline-flex items-center gap-4
                font-display text-[18px]
                font-bold
                tracking-[-0.05em]
                text-paper
                no-underline
              "
            >

              {/* Logo core */}
              <div className="relative flex h-14 w-14 items-center justify-center">

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
                  className="
                    absolute inset-0
                    rounded-full
                    border border-[#2ee59d]/20
                  "
                />

                <div
                  className="
                    absolute inset-1
                    rounded-full
                    border border-white/[0.05]
                  "
                />

                <Image
                  src="/logo.png"
                  alt="Vyuham '26 Logo"
                  width={48}
                  height={48}
                  loading="eager"
                  className="
                    relative z-10
                    h-11 w-11
                    object-contain
                    drop-shadow-[0_0_15px_rgba(46,229,157,.45)]
                    transition-all duration-300
                    group-hover:scale-105
                    group-hover:drop-shadow-[0_0_24px_rgba(46,229,157,.65)]
                  "
                />
              </div>

              <div>
                <div className="flex items-center">
                  <span className="font-display font-bold tracking-[0.15em]">
                    VYUHAM
                  </span>

                  <span
                    className="
                      font-display font-bold
                      tracking-[0.15em]
                      text-[#2ee59d]
                    "
                  >
                    &apos;26
                  </span>
                </div>

                <span
                  className="
                    mt-1 block
                    font-mono text-[8px]
                    uppercase tracking-[0.2em]
                    text-white/30
                  "
                >
                  FUTURE AWAITS
                </span>
              </div>
            </Link>

            {/* Location */}
            <p
              className="
                mt-7 max-w-xs
                font-mono text-[10px]
                leading-7
                tracking-[0.07em]
                text-white/40
              "
            >
              Digital University Kerala
              <br />
              Technocity, Thiruvananthapuram
            </p>

            {/* Transmission channel */}
            <div
              className="
                mt-8 rounded
                border border-white/[0.06]
                bg-white/[0.015]
                p-4
              "
            >
              <p
                className="
                  font-mono text-[8px]
                  uppercase tracking-[0.2em]
                  text-white/25
                "
              >
                Transmission Channel
              </p>

              <a
                href="mailto:techfest@duk.ac.in"
                className="
                  mt-2 block
                  font-mono text-[11px]
                  text-white/60
                  no-underline
                  transition-colors
                  hover:text-[#2ee59d]
                "
              >
                techfest@duk.ac.in
              </a>

              <div
                className="
                  mt-4 flex items-center gap-2
                  font-mono text-[8px]
                  uppercase tracking-[0.15em]
                  text-[#2ee59d]/50
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#2ee59d]" />
                Channel Active
              </div>
            </div>
          </div>

          {/* ==================================================================
              NAVIGATION COLUMNS
          ================================================================== */}

          <FooterColumn
            title="Explore"
            links={exploreLinks}
          />

          <FooterColumn
            title="Participate"
            links={participateLinks}
          />

          <FooterColumn
            title="Account"
            links={accountLinks}
          />
        </div>

        {/* ====================================================================
            STATUS / BOTTOM ROW
        ===================================================================== */}

        <div
          className="
            relative flex
            flex-col gap-5
            py-7
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div
            className="
              flex flex-col gap-2
              sm:flex-row
              sm:items-center
              sm:gap-5
            "
          >
            <p
              className="
                font-mono text-[9px]
                uppercase tracking-[0.15em]
                text-white/30
              "
            >
              © 2026 VYUHAM — Digital University Kerala
            </p>

            <span
              className="
                hidden h-1 w-1
                rounded-full
                bg-white/20
                sm:block
              "
            />

            <span
              className="
                font-mono text-[9px]
                uppercase tracking-[0.15em]
                text-white/20
              "
            >
              All Systems Reserved
            </span>
          </div>

          {/* OS version */}
          <div className="flex items-center gap-3">
            <span
              className="
                font-mono text-[8px]
                uppercase tracking-[0.18em]
                text-white/25
              "
            >
              VYUHAM OS
            </span>

            <span
              className="
                rounded
                border border-[#2ee59d]/15
                bg-[#2ee59d]/[0.04]
                px-2.5 py-1.5
                font-mono text-[8px]
                tracking-[0.15em]
                text-[#2ee59d]/60
              "
            >
              v26.4
            </span>
          </div>

          <p
            className="
              font-mono text-[9px]
              uppercase tracking-[0.18em]
              text-[#2ee59d]/50
            "
          >
            THE FUTURE AWAITS
          </p>
        </div>

        {/* ====================================================================
            BOTTOM ENERGY LINE
        ===================================================================== */}

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
            className="
              absolute left-0 top-0
              h-px w-1/4
              bg-gradient-to-r
              from-transparent
              via-[#2ee59d]
              to-transparent
              shadow-[0_0_8px_rgba(46,229,157,.7)]
            "
          />
        </div>
      </div>

      {/* ======================================================================
          FINAL FOOTER SIGNAL
      ====================================================================== */}

      <div className="relative border-t border-white/[0.04]">
        <div
          className="
            mx-auto flex
            w-[min(1200px,calc(100%-40px))]
            items-center justify-between
            py-4
            md:w-[min(1200px,calc(100%-64px))]
          "
        >
          <span
            className="
              font-mono text-[7px]
              uppercase tracking-[0.25em]
              text-white/15
            "
          >
            END TRANSMISSION
          </span>

          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#2ee59d]/60" />

            <span
              className="
                font-mono text-[7px]
                uppercase tracking-[0.22em]
                text-white/20
              "
            >
              CONNECTION STABLE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
