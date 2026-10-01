/**
 * Optimized Logo Component (Phase 1 — Item #1)
 *
 * The original vyuham_logo.svg is a 1.6MB base64-encoded PNG inside an SVG wrapper.
 * This component serves size-appropriate versions:
 *   - "sm"  → 80×80 PNG  (~8 KB)  — navbar, loading screens, tickets
 *   - "md"  → 200×200 PNG (~41 KB) — hero sections, certificates
 *   - "full" → original PNG (~1.2 MB) — only when high-res is truly needed
 */

interface LogoProps {
  /** Which optimized variant to use */
  size?: "sm" | "md" | "full";
  /** Alt text for accessibility */
  alt?: string;
  /** CSS className for the img element */
  className?: string;
  /** Optional inline style */
  style?: React.CSSProperties;
  /** Error handler override */
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const LOGO_SRCS = {
  sm: "/vyuham_logo_sm.png",
  md: "/vyuham_logo_md.png",
  full: "/vyuham_logo.png",
} as const;

export default function Logo({
  size = "sm",
  alt = "VYUHAM'26 Logo",
  className = "",
  style,
  onError,
}: LogoProps) {
  const src = LOGO_SRCS[size];

  const handleError = onError ?? ((e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback chain: sm → md → full → original SVG
    const img = e.target as HTMLImageElement;
    if (size === "sm") {
      img.src = LOGO_SRCS.md;
    } else if (size === "md") {
      img.src = LOGO_SRCS.full;
    } else {
      img.src = "/vyuham_logo.svg";
    }
  });

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}
