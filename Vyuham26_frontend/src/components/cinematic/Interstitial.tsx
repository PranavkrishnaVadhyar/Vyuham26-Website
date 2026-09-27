import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { useReducedMotion } from "@/lib/hooks";

/**
 * A full-bleed cinematic cut between acts: a single line of dialogue over a
 * slow camera drift. Keeps the scroll rhythm from becoming a list of sections.
 */
export default function Interstitial({
  image,
  line,
  caption,
  align = "center",
  height = "h-[78vh]",
}: {
  image: string;
  line: string;
  caption?: string;
  align?: "center" | "left";
  height?: string;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".itl-bg",
        { yPercent: -12, scale: 1.18 },
        {
          yPercent: 12,
          scale: 1.06,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        ".itl-line",
        { autoAlpha: 0, yPercent: 60, filter: "blur(14px)" },
        {
          autoAlpha: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 72%" },
        },
      );
      gsap.fromTo(
        ".itl-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 72%" },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className={`relative w-full overflow-hidden ${height}`}>
      <div className="itl-bg absolute inset-0 will-change-transform">
        <img
          src={image}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ filter: "saturate(0.3) contrast(1.28) brightness(0.34)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020403] via-[rgba(2,10,7,0.55)] to-[#020403]" />
        <div className="light-leak absolute inset-0 opacity-60" />
      </div>

      <div
        className={`relative z-10 flex h-full flex-col justify-center px-6 md:px-[10vw] ${
          align === "center" ? "items-center text-center" : "items-start text-left"
        }`}
      >
        <div className="itl-rule mb-7 h-px w-[min(340px,50vw)] origin-left bg-gradient-to-r from-[rgba(24,196,124,0.8)] to-transparent" />
        <h3 className="itl-line t-cond-l max-w-[18ch] text-[8.4vw] leading-[1.05] text-[#e2f3ea] md:text-[3.4vw]">
          {line}
        </h3>
        {caption && (
          <p className="mt-6 font-mono text-[9px] tracking-[0.34em] text-[#5f8474] md:text-[10px]">{caption}</p>
        )}
      </div>
    </div>
  );
}
