import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { MEDIA } from "@/data/media";
import { useApp } from "@/lib/store";
import { useIsTablet, useReducedMotion } from "@/lib/hooks";
import { CharReveal, FocusIn } from "@/components/cinematic/Reveal";

const PLATES = [
  { src: MEDIA.lab, cls: "left-[-6%] top-[8%] w-[62vw] md:w-[38vw] aspect-[4/3]", depth: -170, rot: -1.2 },
  { src: MEDIA.roboticsWide, cls: "right-[-8%] top-[26%] w-[56vw] md:w-[30vw] aspect-[3/4]", depth: 230, rot: 1.6 },
  { src: MEDIA.lecture, cls: "left-[14%] bottom-[-8%] w-[70vw] md:w-[34vw] aspect-[16/10]", depth: -300, rot: 0.8 },
  { src: MEDIA.filmCrew, cls: "right-[6%] bottom-[4%] w-[40vw] md:w-[20vw] aspect-square", depth: 140, rot: -2 },
];

export default function Awakening() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const { content } = useApp();
  const hp = content.homepage;
  const reduced = useReducedMotion();
  const tablet = useIsTablet();

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });

      gsap.utils.toArray<HTMLElement>(".plate").forEach((p) => {
        const depth = Number(p.dataset.depth || 0);
        tl.fromTo(
          p,
          { yPercent: 14, opacity: 0.0 },
          { yPercent: -14, opacity: 1, ease: "none", duration: 0.3 },
          0,
        );
        tl.to(p, { y: depth, ease: "none", duration: 1 }, 0);
      });

      // Initial clean state
      gsap.set(".awk-line", { autoAlpha: 0, yPercent: 30, filter: "blur(10px)" });
      gsap.set(".awk-out", { autoAlpha: 0, yPercent: 20 });

      // 1. Headline ("THE FUTURE IS ALREADY HERE.")
      // Smoothly floats up and dissolves out completely before statement lines begin
      tl.fromTo(
        ".awk-head",
        { yPercent: 4, autoAlpha: 1, filter: "blur(0px)" },
        { yPercent: -20, ease: "none", duration: 0.18 },
        0,
      );
      tl.to(
        ".awk-head",
        { autoAlpha: 0, filter: "blur(14px)", ease: "power2.in", duration: 0.09 },
        0.09,
      );

      // 2. Sequential statements: each line enters, holds, and exits cleanly with 0 overlap
      const lines = gsap.utils.toArray<HTMLElement>(".awk-line");
      const lineStart = 0.22;
      const lineEnd = 0.80;
      const slot = (lineEnd - lineStart) / Math.max(lines.length, 1);

      lines.forEach((line, i) => {
        const start = lineStart + i * slot;
        const enterDur = slot * 0.28;
        const holdDur = slot * 0.44;
        const exitDur = slot * 0.28;

        tl.fromTo(
          line,
          { autoAlpha: 0, yPercent: 30, filter: "blur(10px)" },
          { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", ease: "power2.out", duration: enterDur },
          start,
        );
        tl.to(
          line,
          { autoAlpha: 0, yPercent: -30, filter: "blur(10px)", ease: "power2.in", duration: exitDur },
          start + enterDur + holdDur,
        );
      });

      // 3. Outro: stats and support copy fade in cleanly after all statements finish
      tl.fromTo(
        ".awk-out",
        { autoAlpha: 0, yPercent: 20, filter: "blur(8px)" },
        { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.14 },
        0.83,
      );
      tl.fromTo(".awk-glow", { opacity: 0.1 }, { opacity: 0.5, ease: "none", duration: 1 }, 0);
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  /* ---------- reduced motion: a static, fully readable scene ---------- */
  if (reduced) {
    return (
      <section id="awakening" className="relative w-full px-5 py-24 md:px-[10vw]">
        <p className="eyebrow">01 — THE AWAKENING</p>
        <h2 className="t-cond mt-5 max-w-[18ch] text-[12vw] leading-[0.86] text-[#f0f9f5] md:text-[6vw]">
          {hp.awakeningTitle}
        </h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {PLATES.map((p, i) => (
            <img
              key={i}
              src={p.src}
              alt=""
              aria-hidden
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
              style={{ filter: "saturate(0.34) contrast(1.24) brightness(0.42)" }}
            />
          ))}
        </div>
        <div className="mt-12 space-y-4">
          {hp.awakeningLines.map((l) => (
            <p key={l} className="t-cond-l text-[6vw] leading-tight text-[#cfeade] md:text-[2.2vw]">
              {l}
            </p>
          ))}
        </div>
        <p className="mt-10 max-w-[52ch] text-[14px] leading-relaxed text-[#8faea1]">{hp.aboutSupport}</p>
        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
          {hp.stats.map((s) => (
            <div key={s.label}>
              <div className="t-cond text-[9vw] leading-none text-[#e8f7f0] md:text-[3vw]">{s.value}</div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.3em] text-[#5b7b6e]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div id="awakening" ref={wrap} className="relative h-[320vh] w-full">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* depth plates */}
        {PLATES.map((p, i) => (
          <figure
            key={i}
            data-depth={tablet ? p.depth * 0.45 : p.depth}
            className={`plate absolute overflow-hidden will-change-transform ${p.cls}`}
            style={{ transform: `rotate(${p.rot}deg)` }}
          >
            <img
              src={p.src}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.34) contrast(1.24) brightness(0.4)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020403] via-transparent to-[rgba(2,8,6,0.45)]" />
            <div className="absolute inset-0 border border-[rgba(120,160,145,0.1)]" />
          </figure>
        ))}

        {/* green volumetric glow */}
        <div
          className="awk-glow pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(18,120,80,0.35), transparent 62%)", filter: "blur(40px)" }}
        />

        {/* copy */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <div className="awk-head">
            <p className="eyebrow mb-6">01 — THE AWAKENING</p>
            <h2 className="t-cond mx-auto max-w-[18ch] text-[11.5vw] leading-[0.85] text-[#f0f9f5] sm:text-[9vw] md:text-[6.4vw]">
              <CharReveal text={hp.awakeningTitle} stagger={0.018} />
            </h2>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 text-center">
            {hp.awakeningLines.map((l, i) => (
              <p
                key={i}
                className="awk-line t-cond-l absolute mx-auto max-w-[24ch] text-center text-[6.6vw] leading-[1.1] text-[#cfeade] opacity-0 sm:text-[4.2vw] md:text-[2.8vw]"
              >
                {l}
              </p>
            ))}
          </div>

          <div className="awk-out absolute inset-x-0 bottom-[10%] px-5 opacity-0">
            <FocusIn>
              <p className="mx-auto max-w-[46ch] text-[13px] leading-relaxed text-[#8faea1] md:text-[15px]">
                {hp.aboutSupport}
              </p>
            </FocusIn>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {hp.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="t-cond text-[7vw] leading-none text-[#e8f7f0] md:text-[2.6vw]">{s.value}</div>
                  <div className="mt-1 font-mono text-[8px] tracking-[0.3em] text-[#5b7b6e] md:text-[9px]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 vignette" />
      </div>
    </div>
  );
}
