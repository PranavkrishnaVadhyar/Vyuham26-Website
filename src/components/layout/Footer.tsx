"use client";

import Link from "next/link";
import Image from "next/image";

const exploreLinks = [
  { href: "/about", label: "About" },
  { href: "/schedule", label: "Schedule" },
  { href: "/venue", label: "Venue" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const participateLinks = [
  { href: "/events", label: "Events" },
  { href: "/hackathon", label: "Hackathon" },
  { href: "/gallery", label: "Gallery" },
  { href: "/teams", label: "Teams" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/results", label: "Results" },
];

const accountLinks = [
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/ticket", label: "Ticket" },
  { href: "/certificates", label: "Certificates" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto w-[min(1200px,calc(100%-64px))]">
        {/* Top row */}
        <div className="grid gap-12 border-b border-line py-16 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-3 font-display text-[17px] font-bold tracking-[-0.06em] text-paper no-underline group"
            >
              <Image
                src="/logo.png"
                alt="Vyuham '26 Logo"
                width={44}
                height={44}
                loading="eager"
                className="h-11 w-11 object-contain drop-shadow-[0_0_15px_rgba(200,255,66,0.5)] transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-display font-bold tracking-wider">
                VYUHAM<span className="text-green">&apos;26</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs font-mono text-[10px] leading-relaxed tracking-wider text-muted">
              Digital University Kerala
              <br />
              Technocity, Thiruvananthapuram
            </p>
            <div className="mt-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                Transmission channel
              </p>
              <a
                href="mailto:techfest@duk.ac.in"
                className="mt-2 block font-body text-sm text-paper no-underline transition-colors hover:text-green"
              >
                techfest@duk.ac.in
              </a>
            </div>
          </div>

          {/* Explore column */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-green">
              Explore
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted no-underline transition-colors hover:text-green"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Participate column */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-green">
              Participate
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {participateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted no-underline transition-colors hover:text-green"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account column */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-green">
              Account
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted no-underline transition-colors hover:text-green"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
          <p className="font-mono text-[9px] tracking-widest text-muted">
            © 2026 VYUHAM — Digital University Kerala
          </p>
          <span className="font-mono text-[9px] tracking-widest text-emerald-400/60">
            [ VYUHAM OS v26.4 ]
          </span>
          <p className="font-mono text-[9px] tracking-widest text-muted/50">
            THE FUTURE AWAITS
          </p>
        </div>
      </div>
    </footer>
  );
}

