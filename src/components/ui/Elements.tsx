import Link from "next/link";
import { type ReactNode } from "react";

/* ─── Primary Button ─── */
interface ButtonProps {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-5 py-[15px] no-underline uppercase tracking-[0.1em] text-[10px] font-extrabold transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-green text-ink hover:shadow-[0_0_38px_rgba(200,255,66,0.35)] hover:-translate-y-0.5",
    outline:
      "border border-line text-paper hover:border-green/40 hover:text-green",
    ghost: "text-paper hover:text-green",
  };

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  const classes = `${base} ${variants[variant]} ${disabledClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

/* ─── Text Link ─── */
interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TextLink({ href, children, className = "" }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={`text-[10px] font-extrabold uppercase tracking-[0.08em] text-paper no-underline transition-colors hover:text-green ${className}`}
    >
      {children}
      <span className="ml-2 text-[17px] text-green" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

/* ─── Section Kicker ─── */
interface KickerProps {
  children: ReactNode;
  className?: string;
}

export function Kicker({ children, className = "" }: KickerProps) {
  return (
    <p
      className={`font-mono text-[10px] uppercase tracking-[0.12em] text-muted ${className}`}
    >
      {children}
    </p>
  );
}

/* ─── Status Chip ─── */
interface ChipProps {
  children: ReactNode;
  variant?: "live" | "upcoming" | "completed";
  className?: string;
}

const chipVariants = {
  live: "border-green/40 text-green shadow-[0_0_8px_rgba(200,255,66,0.2)]",
  upcoming: "border-emerald/40 text-emerald",
  completed: "border-muted/30 text-muted",
};

export function Chip({ children, variant = "upcoming", className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${chipVariants[variant]} ${className}`}
    >
      {variant === "live" && <span className="signal-dot" />}
      {children}
    </span>
  );
}

/* ─── Stream Badge ─── */
interface StreamBadgeProps {
  stream: "tech" | "culture" | "gaming" | "impact";
  className?: string;
}

const streamColors = {
  tech: "bg-green/10 text-green border-green/20",
  culture: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  gaming: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  impact: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const streamLabels = {
  tech: "Technology",
  culture: "Culture",
  gaming: "Gaming",
  impact: "Impact",
};

export function StreamBadge({ stream, className = "" }: StreamBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${streamColors[stream]} ${className}`}
    >
      {streamLabels[stream]}
    </span>
  );
}
