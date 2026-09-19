import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/schedule", label: "Schedule" },
  { href: "/events", label: "Events" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/venue", label: "Venue" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/gallery", label: "Gallery" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto w-[min(1200px,calc(100%-64px))]">
        {/* Top row */}
        <div className="grid gap-12 border-b border-line py-16 md:grid-cols-3">
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
          </div>

          {/* Navigation links */}
          <div className="grid grid-cols-2 gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted no-underline transition-colors hover:text-green"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              Transmission channel
            </p>
            <a
              href="mailto:techfest@duk.ac.in"
              className="mt-3 block font-body text-sm text-paper no-underline transition-colors hover:text-green"
            >
              techfest@duk.ac.in
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-4 py-6 md:flex-row md:items-center">
          <p className="font-mono text-[9px] tracking-[0.1em] text-muted">
            © 2026 VYUHAM — Digital University Kerala
          </p>
          <p className="font-mono text-[9px] tracking-[0.1em] text-muted/50">
            THE FUTURE AWAITS
          </p>
        </div>
      </div>
    </footer>
  );
}
