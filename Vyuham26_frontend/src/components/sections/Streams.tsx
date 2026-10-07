import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { useApp } from "@/lib/store";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
import { FocusIn, MaskReveal } from "@/components/cinematic/Reveal";

/**
 * Rail start points for the 4 streams.
 */
function getRailStart(i: number, isMobile: boolean) {
  if (isMobile) {
    return {
      x: i % 2 === 0 ? 18 : 82,
      y: i < 2 ? 16 : 84,
    };
  }
  return {
    x: i % 2 === 0 ? 16 : 84,
    y: i < 2 ? 18 : 82,
  };
}

/**
 * Calculates the exact point along the quadratic bezier energy rail:
 * M (x0, y0) Q (cx, cy) 50 50
 * at progress p in [0, 1] (0 = start of rail, 1 = centre 50% 50%).
 */
function getRailPoint(i: number, p: number, isMobile: boolean) {
  const { x: x0, y: y0 } = getRailStart(i, isMobile);
  const cx = (x0 + 50) / 2 + (i % 2 === 0 ? -6 : 6);
  const cy = (y0 + 50) / 2 + (i < 2 ? 6 : -6);
  const inv = 1 - p;
  const x = inv * inv * x0 + 2 * inv * p * cx + p * p * 50;
  const y = inv * inv * y0 + 2 * inv * p * cy + p * p * 50;
  return { x, y };
}

/**
 * SECTION 02 — THE FOUR STREAMS
 * Four energy currents suspended on light-rails that move along the rail
 * to the centre across the scrub sequence, collapsing into the VYUHAM'26 core.
 */
export default function Streams() {
  const { content } = useApp();
  const streams = content.streams;
  const wrap = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => {
    const el = wrap.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      /* GSAP owns the centering transform so scale tweens can't clobber it */
      gsap.set(".node, .field-glow", { xPercent: -50, yPercent: -50 });

      // Track progress along rail for each node [0, 1]
      const railProgress: Record<string, number> = { p0: 0, p1: 0, p2: 0, p3: 0 };

      const updateNodePos = (i: number, p: number) => {
        const nodeEl = el.querySelector<HTMLElement>(`.node-${i}`);
        if (!nodeEl) return;
        const { x, y } = getRailPoint(i, p, window.innerWidth < 768);
        nodeEl.style.left = `${x}%`;
        nodeEl.style.top = `${y}%`;
      };

      // Initialize all nodes to the start of their rails
      streams.forEach((_, i) => updateNodePos(i, 0));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(".str-intro", { autoAlpha: 1 }, { autoAlpha: 0, yPercent: -30, ease: "none", duration: 0.09 }, 0.06);

      streams.forEach((_, i) => {
        const at = 0.1 + i * 0.15;

        // Node reveals at the outer rail
        tl.fromTo(
          `.node-${i}`,
          { autoAlpha: 0, scale: 0.35, filter: "blur(14px)" },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", ease: "expo.out", duration: 0.08 },
          at,
        );

        // Path draws along the rail
        tl.fromTo(
          `.path-${i}`,
          { strokeDashoffset: 1000, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, ease: "power2.inOut", duration: 0.13 },
          at + 0.02,
        );

        // The stream node MOVES ON THE RAIL toward the centre (from p = 0 to p = 0.40)
        tl.to(
          railProgress,
          {
            [`p${i}`]: 0.4,
            ease: "power2.out",
            duration: 0.12,
            onUpdate: () => updateNodePos(i, railProgress[`p${i}`]),
          },
          at + 0.02,
        );

        // Stream readout text reveals in center
        tl.fromTo(
          `.read-${i}`,
          { autoAlpha: 0, yPercent: 40, filter: "blur(10px)" },
          { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", ease: "expo.out", duration: 0.05 },
          at + 0.03,
        );

        // Stream readout text departs
        tl.to(
          `.read-${i}`,
          { autoAlpha: 0, yPercent: -30, filter: "blur(8px)", ease: "power2.in", duration: 0.045 },
          at + 0.115,
        );

        tl.to(`.node-${i}`, { scale: 0.88, ease: "none", duration: 0.1 }, at + 0.1);
      });

      /* convergence: all 4 streams move ON THE RAIL to the exact centre (p = 1.0 -> 50% 50%) */
      const conv = 0.72;
      streams.forEach((_, i) => {
        tl.to(
          railProgress,
          {
            [`p${i}`]: 1.0,
            ease: "power2.inOut",
            duration: 0.18,
            onUpdate: () => updateNodePos(i, railProgress[`p${i}`]),
          },
          conv,
        );
        tl.to(
          `.node-${i}`,
          {
            scale: 0.12,
            autoAlpha: 0,
            filter: "blur(6px)",
            ease: "power2.inOut",
            duration: 0.18,
          },
          conv,
        );
        tl.to(`.path-${i}`, { opacity: 0.6, strokeWidth: 1.8, ease: "none", duration: 0.08 }, conv);
      });

      // Fade out rails right before final brandmark reveal
      tl.to(
        ".energy-paths, .path-0, .path-1, .path-2, .path-3",
        { autoAlpha: 0, opacity: 0, duration: 0.12, ease: "power2.out" },
        conv + 0.08,
      );

      // Final reveal: Title, Official VYUHAM'26 Logo, and Description
      tl.fromTo(
        ".str-final",
        { autoAlpha: 0, yPercent: 20, filter: "blur(12px)" },
        { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", ease: "expo.out", duration: 0.14 },
        conv + 0.1,
      );
      tl.fromTo(
        ".core",
        { autoAlpha: 0, scale: 0.35 },
        { autoAlpha: 1, scale: 1, ease: "back.out(1.4)", duration: 0.16 },
        conv + 0.1,
      );
      tl.fromTo(
        ".core-ring",
        { scale: 0.35, opacity: 0.75 },
        { scale: 1.85, opacity: 0, ease: "power2.out", duration: 0.22 },
        conv + 0.11,
      );
      tl.to(".field-glow", { opacity: 0.85, scale: 1.25, ease: "none", duration: 0.2 }, conv);
    }, el);
    return () => ctx.revert();
  }, [reduced, streams]);

  /* ---------------- reduced motion accessible composition ---------------- */
  if (reduced) {
    return (
      <section id="streams" className="relative w-full px-5 py-12 sm:py-16 md:py-20">
        <p className="eyebrow">02 — THE FOUR STREAMS</p>
        <h2 className="t-cond mt-4 text-[13vw] sm:text-[48px] md:text-[6vw] leading-[0.86] text-[#f0f9f5]">
          FOUR STREAMS.
          <br />
          <span className="text-[#18c47c]">ONE SIGNAL.</span>
        </h2>
        <div className="relative mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {streams.map((s) => (
            <FocusIn key={s.id} className="relative rounded-xl border border-[rgba(24,196,124,0.18)] bg-[rgba(4,11,8,0.7)] p-5">
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-lg">
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ filter: "saturate(0.4) contrast(1.2) brightness(0.45)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020403] to-transparent" />
              </div>
              <p className="font-mono text-[9px] tracking-[0.3em]" style={{ color: s.accent }}>
                STREAM {s.index}
              </p>
              <h3 className="t-cond mt-1 text-[8vw] sm:text-[32px] leading-none text-[#eaf7f0]">{s.name}</h3>
              <p className="mt-2 text-[14px] text-[#a9c8bb]">{s.line}</p>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#6f8b80]">{s.description}</p>
              <div className="mt-4 flex gap-4">
                {s.stats.map((st) => (
                  <div key={st.label}>
                    <div className="t-mid text-[16px] text-[#dff3e8]">{st.value}</div>
                    <div className="font-mono text-[7.5px] tracking-[0.25em] text-[#557767]">{st.label}</div>
                  </div>
                ))}
              </div>
            </FocusIn>
          ))}
        </div>
      </section>
    );
  }

  /* ---------------- cinematic constellation field (mobile & web view) ---------------- */
  return (
    <div id="streams" ref={wrap} className="relative h-[250vh] sm:h-[280vh] md:h-[320vh] w-full">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* field glow */}
        <div
          className="field-glow pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(16,140,92,0.4), transparent 62%)", filter: "blur(50px)" }}
        />

        {/* energy light rails */}
        <svg
          className="energy-paths pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="flow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(24,196,124,0.05)" />
              <stop offset="50%" stopColor="rgba(111,242,184,0.85)" />
              <stop offset="100%" stopColor="rgba(24,196,124,0.15)" />
            </linearGradient>
          </defs>
          {streams.map((s, i) => {
            const { x: x0, y: y0 } = getRailStart(i, mobile);
            const cx = (x0 + 50) / 2 + (i % 2 === 0 ? -6 : 6);
            const cy = (y0 + 50) / 2 + (i < 2 ? 6 : -6);
            return (
              <path
                key={s.id}
                className={`path-${i}`}
                d={`M ${x0} ${y0} Q ${cx} ${cy} 50 50`}
                fill="none"
                stroke="url(#flow)"
                strokeWidth={1.2}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                opacity="0"
              />
            );
          })}
        </svg>

        {/* nodes riding the rails */}
        {streams.map((s, i) => {
          const { x: posX, y: posY } = getRailPoint(i, 0, mobile);
          return (
            <div
              key={s.id}
              className={`node node-${i} absolute opacity-0 will-change-transform z-10`}
              style={{ left: `${posX}%`, top: `${posY}%` }}
            >
              <div className="relative">
                <div
                  className="relative h-[19vw] max-h-[175px] min-h-[68px] w-[19vw] max-w-[175px] min-w-[68px] sm:h-[15vw] sm:w-[15vw] overflow-hidden rounded-full"
                  style={{ boxShadow: `0 0 50px -10px ${s.glow}, inset 0 0 35px rgba(2,6,4,0.85)` }}
                >
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{ filter: "saturate(0.35) contrast(1.28) brightness(0.52)" }}
                  />
                  <div className="absolute inset-0 rounded-full border" style={{ borderColor: `${s.accent}55` }} />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_40%,rgba(2,6,4,0.85))]" />
                </div>
                <div
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: `${s.accent}30`, animation: "pulseRing 3.4s ease-out infinite" }}
                />
                <p
                  className="mt-1.5 sm:mt-2 text-center font-mono text-[8px] sm:text-[9px] tracking-[0.22em] sm:tracking-[0.3em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                  style={{ color: s.accent }}
                >
                  {s.index} · {s.name}
                </p>
              </div>
            </div>
          );
        })}

        {/* centre intro readout */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <div className="str-intro text-center">
            <p className="eyebrow mb-4 sm:mb-5">02 — THE FOUR STREAMS</p>
            <h2 className="t-cond text-[11vw] sm:text-[8.5vw] md:text-[7vw] leading-[0.86] text-[#f0f9f5]">
              ONE ENVIRONMENT.
              <br />
              <span className="text-[#18c47c]">FOUR CURRENTS.</span>
            </h2>
          </div>
        </div>

        {/* stream readouts */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 md:top-auto md:bottom-[10%] md:translate-y-0 flex justify-center px-5 sm:px-6 z-10">
          <div className="relative h-[250px] sm:h-[230px] md:h-[220px] w-full max-w-[580px]">
            {streams.map((s, i) => (
              <div key={s.id} className={`read-${i} absolute inset-0 flex flex-col items-center justify-center text-center opacity-0`}>
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-0.5 backdrop-blur-md mb-2"
                  style={{
                    borderColor: `${s.accent}40`,
                    backgroundColor: "rgba(2,8,5,0.75)",
                    boxShadow: `0 0 16px -4px ${s.glow}`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.accent }} />
                  <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.32em]" style={{ color: s.accent }}>
                    STREAM {s.index}
                  </p>
                </div>

                <h3 className="t-cond text-[10vw] sm:text-[7vw] md:text-[5.4vw] leading-none text-[#f2fbf6] drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                  {s.name}
                </h3>

                <p className="t-cond-l mt-1.5 sm:mt-2 text-[4.2vw] sm:text-[2.6vw] md:text-[1.5vw] text-[#bcdcce] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  {s.line}
                </p>

                <p className="mx-auto mt-2 sm:mt-3 max-w-[44ch] text-[12px] sm:text-[13px] leading-relaxed text-[#85a596] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  {s.description}
                </p>

                <div className="mt-3 sm:mt-4 flex justify-center gap-3.5 sm:gap-8">
                  {s.stats.map((st) => (
                    <div
                      key={st.label}
                      className="rounded-md border border-[rgba(24,196,124,0.18)] bg-[rgba(2,8,5,0.75)] px-3 py-1.5 backdrop-blur-md"
                      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
                    >
                      <div className="t-mid text-[15px] sm:text-[18px] font-bold text-[#dff3e8]">{st.value}</div>
                      <div className="font-mono text-[7.5px] sm:text-[8px] tracking-[0.28em] text-[#557767]">{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final convergence reveal: Title, VYUHAM'26 Official Logo, and Subtitle */}
        <div className="str-final pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0 z-20">
          <h3 className="t-cond text-[9.5vw] sm:text-[7.5vw] md:text-[6vw] leading-[0.88] text-[#f4fcf8]">
            FOUR STREAMS.
            <br />
            <span className="text-[#18c47c]">ONE SIGNAL.</span>
          </h3>

          <div className="core relative my-4 sm:my-6 md:my-7 flex items-center justify-center">
            <div className="relative flex items-center justify-center h-[20vw] max-h-[140px] min-h-[85px] w-[20vw] max-w-[140px] min-w-[85px] sm:h-[13vw] sm:w-[13vw]">
              <div
                className="absolute inset-[-24%] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(24,196,124,0.45), rgba(16,140,92,0.12) 55%, transparent 70%)",
                  filter: "blur(14px)",
                }}
              />
              <img
                src="/vyuham_logo_md.png"
                alt="VYUHAM'26 Official Logo"
                className="relative z-[2] h-full w-full object-contain drop-shadow-[0_0_24px_rgba(24,196,124,0.7)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/vyuham_logo.png";
                }}
              />
              <div className="core-ring absolute inset-[-15%] rounded-full border border-[rgba(126,255,200,0.45)] shadow-[0_0_20px_rgba(24,196,124,0.4)]" />
            </div>
          </div>

          <MaskReveal delay={0.05}>
            <p className="mx-auto max-w-[52ch] text-[12px] sm:text-[14px] md:text-[15px] leading-relaxed text-[#8caea0]">
              Everything built, performed, played and proven across three days collapses into a single
              current — and that current has a date.
            </p>
          </MaskReveal>
        </div>

        <div className="pointer-events-none absolute inset-0 vignette" />
      </div>
    </div>
  );
}
