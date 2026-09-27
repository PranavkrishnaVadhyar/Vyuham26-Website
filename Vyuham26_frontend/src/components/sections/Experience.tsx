import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { gsap } from "@/lib/anim";
import { useApp } from "@/lib/store";
import { zones } from "@/data/content";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
import { FocusIn, MaskReveal } from "@/components/cinematic/Reveal";
import type { GalleryItem } from "@/data/types";

const spanClass: Record<GalleryItem["span"], string> = {
  wide: "md:col-span-2 aspect-[16/9]",
  tall: "md:row-span-2 aspect-[3/4] md:aspect-auto",
  std: "aspect-[4/3]",
};

export default function Experience() {
  const { content } = useApp();
  const items = content.gallery;
  const [active, setActive] = useState<GalleryItem | null>(null);
  const grid = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => {
    const el = grid.current;
    if (!el || reduced || mobile) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".tile").forEach((t, i) => {
        gsap.fromTo(
          t.querySelector(".tile-media"),
          { yPercent: -8 * (1 + (i % 3) * 0.4), scale: 1.12 },
          {
            yPercent: 8 * (1 + (i % 3) * 0.4),
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: t, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, mobile, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="gallery" data-section="experience" className="relative w-full px-5 py-24 md:px-[6vw] md:py-36">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">05 — THE EXPERIENCE</p>
          <h2 className="t-cond mt-4 text-[13vw] leading-[0.82] text-[#f0f9f5] md:text-[6.4vw]">
            <MaskReveal>INSIDE THE FIELD</MaskReveal>
          </h2>
        </div>
        <p className="max-w-[44ch] text-[13px] leading-relaxed text-[#7d9a8d] md:text-[15px]">
          Six zones, one perimeter. Amphitheatre to arena grid to the night market that never closes — the
          campus becomes a set, and everyone in it is in frame.
        </p>
      </div>

      {/* zone rail */}
      <div className="no-scrollbar mt-10 flex gap-3 overflow-x-auto border-y border-[rgba(120,160,145,0.12)] py-4">
        {zones.map((z) => (
          <div
            key={z.id}
            className="group shrink-0 border border-[rgba(120,160,145,0.16)] px-4 py-3 transition-colors duration-500 hover:border-[rgba(24,196,124,0.5)]"
          >
            <p className="font-mono text-[8px] tracking-[0.3em] text-[#18c47c]">{z.code}</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-[#cfe8dc]">{z.name}</p>
            <p className="mt-[2px] font-mono text-[8px] tracking-[0.22em] text-[#557767]">{z.note}</p>
          </div>
        ))}
      </div>

      {/* gallery */}
      <div ref={grid} className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {items.map((g, i) => (
          <FocusIn key={g.id} delay={Math.min(i * 0.05, 0.35)} y={22} blur={10} className={cn("tile", spanClass[g.span])}>
            <button
              onClick={() => setActive(g)}
              className="group relative block h-full w-full overflow-hidden bg-[#070b09]"
            >
              <div className="tile-media absolute inset-0 will-change-transform">
                {g.type === "video" ? (
                  <img
                    src={g.poster ?? g.src}
                    alt={g.caption}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.06]"
                    style={{ filter: "saturate(0.35) contrast(1.22) brightness(0.45)" }}
                  />
                ) : (
                  <img
                    src={g.src}
                    alt={g.caption}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.06]"
                    style={{ filter: "saturate(0.35) contrast(1.22) brightness(0.45)" }}
                  />
                )}
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(2,6,4,0.92)] via-transparent to-transparent" />
              <div className="light-leak pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div className="text-left">
                  <p className="font-mono text-[8px] tracking-[0.3em] text-[#18c47c]">{g.tag}</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-[#d6ece2]">{g.caption}</p>
                </div>
                {g.type === "video" && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(24,196,124,0.5)] text-[9px] text-[#9fe9c6]">
                    ▶
                  </span>
                )}
              </div>
              <div className="absolute inset-0 border border-[rgba(120,160,145,0.1)] transition-colors duration-700 group-hover:border-[rgba(24,196,124,0.4)]" />
            </button>
          </FocusIn>
        ))}
      </div>

      {/* lightbox */}
      <div
        className={cn(
          "fixed inset-0 z-[140] flex items-center justify-center bg-[rgba(2,4,3,0.95)] p-4 backdrop-blur-xl transition-opacity duration-700",
          active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setActive(null)}
      >
        {active && (
          <figure
            className="relative max-h-[86vh] w-full max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            {active.type === "video" ? (
              <video
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-[78vh] w-full bg-black object-contain"
              />
            ) : (
              <img src={active.src} alt={active.caption} className="max-h-[78vh] w-full object-contain" />
            )}
            <figcaption className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#cfe8dc]">{active.caption}</span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#18c47c]">{active.tag}</span>
            </figcaption>
            <button
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 font-mono text-[10px] tracking-[0.3em] text-[#7d9a8d] hover:text-white"
            >
              CLOSE ✕
            </button>
          </figure>
        )}
      </div>
    </section>
  );
}
