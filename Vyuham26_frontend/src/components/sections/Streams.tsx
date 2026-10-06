import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { useApp } from "@/lib/store";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
import { FocusIn, MaskReveal } from "@/components/cinematic/Reveal";

/**
 * SECTION 02 — THE FOUR STREAMS
 * One connected environment: four energy nodes suspended in the dark,
 * joined by drawn light-paths that converge into a single core.
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
      gsap.set(".node, .core, .field-glow", { xPercent: -50, yPercent: -50 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.9 },
      });

      tl.fromTo(".str-intro", { autoAlpha: 1 }, { autoAlpha: 0, yPercent: -30, ease: "none", duration: 0.09 }, 0.06);

      streams.forEach((_, i) => {
        const at = 0.1 + i * 0.15;
        tl.fromTo(
          `.node-${i}`,
          { autoAlpha: 0, scale: 0.35, filter: "blur(14px)" },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", ease: "expo.out", duration: 0.1 },
          at,
        );
        tl.fromTo(
          `.path-${i}`,
          { strokeDashoffset: 1000, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, ease: "power2.inOut", duration: 0.13 },
          at + 0.035,
        );
        tl.fromTo(
          `.read-${i}`,
          { autoAlpha: 0, yPercent: 40, filter: "blur(10px)" },
          { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", ease: "expo.out", duration: 0.05 },
          at + 0.02,
        );
        tl.to(
          `.read-${i}`,
          { autoAlpha: 0, yPercent: -30, filter: "blur(8px)", ease: "power2.in", duration: 0.045 },
          at + 0.115,
        );
        tl.to(`.node-${i}`, { scale: 0.86, ease: "none", duration: 0.12 }, at + 0.1);
      });

      /* convergence */
      const conv = 0.72;
      streams.forEach((s, i) => {
        tl.to(
          `.node-${i}`,
          {
            left: "50%",
            top: "50%",
            scale: 0.16,
            autoAlpha: 0.15,
            filter: "blur(6px)",
            ease: "power2.inOut",
            duration: 0.18,
          },
          conv,
        );
        tl.to(`.path-${i}`, { opacity: 0.85, strokeWidth: 2.2, ease: "none", duration: 0.18 }, conv);
        void s;
      });
      tl.fromTo(
        ".core",
        { autoAlpha: 0, scale: 0.3 },
        { autoAlpha: 1, scale: 1, ease: "expo.out", duration: 0.14 },
        conv + 0.06,
      );
      tl.fromTo(
        ".core-ring",
        { scale: 0.35, opacity: 0.6 },
        { scale: 1.8, opacity: 0, ease: "power2.out", duration: 0.2 },
        conv + 0.08,
      );
      tl.fromTo(
        ".str-final",
        { autoAlpha: 0, yPercent: 40, filter: "blur(16px)" },
        { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", ease: "expo.out", duration: 0.12 },
        conv + 0.14,
      );
      tl.to(".field-glow", { opacity: 0.9, scale: 1.25, ease: "none", duration: 0.2 }, conv);
    }, el);
    return () => ctx.revert();
  }, [reduced, streams]);

  /* ---------------- mobile composition ---------------- */
  if (reduced) {
    return (
      <section id="streams" className="relative w-full px-5 py-24">
        <p className="eyebrow">02 — THE FOUR STREAMS</p>
        <h2 className="t-cond mt-4 text-[13vw] leading-[0.86] text-[#f0f9f5]">
          FOUR STREAMS.
          <br />
          <span className="text-[#18c47c]">ONE SIGNAL.</span>
        </h2>
        <div className="relative mt-12">
          <div className="absolute left-[14px] top-0 h-full w-px bg-gradient-to-b from-transparent via-[rgba(24,196,124,0.45)] to-transparent" />
          {streams.map((s) => (
            <FocusIn key={s.id} className="relative mb-12 pl-12">
              <span
                className="absolute left-[7px] top-2 h-4 w-4 rotate-45 border"
                style={{ borderColor: s.accent, boxShadow: `0 0 18px ${s.glow}` }}
              />
              <div className="relative mb-4 aspect-[16/10] overflow-hidden">
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
                {s.index}
              </p>
              <h3 className="t-cond mt-1 text-[9vw] leading-none text-[#eaf7f0]">{s.name}</h3>
              <p className="mt-2 text-[15px] text-[#a9c8bb]">{s.line}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-[#6f8b80]">{s.description}</p>
            </FocusIn>
          ))}
        </div>
      </section>
    );
  }

  /* ---------------- cinematic desktop field ---------------- */
  return (
    <div id="streams" ref={wrap} className="relative h-[440vh] w-full">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* field glow */}
        <div
          className="field-glow pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(16,140,92,0.4), transparent 62%)", filter: "blur(50px)" }}
        />

        {/* energy paths */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
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
            const x = mobile
              ? (i === 0 ? 22 : i === 1 ? 78 : i === 2 ? 22 : 78)
              : s.node.x * 100;
            const y = mobile
              ? (i === 0 ? 18 : i === 1 ? 18 : i === 2 ? 38 : 38)
              : s.node.y * 100;
            const cx = (x + 50) / 2 + (i % 2 === 0 ? -9 : 9);
            const cy = (y + 50) / 2 + (i < 2 ? 10 : -10);
            return (
              <path
                key={s.id}
                className={`path-${i}`}
                d={`M ${x} ${y} Q ${cx} ${cy} 50 50`}
                fill="none"
                stroke="url(#flow)"
                strokeWidth={1.1}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                opacity="0"
              />
            );
          })}
          <circle cx="50" cy="50" r="0.35" fill="rgba(160,255,214,0.8)" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* nodes */}
        {streams.map((s, i) => {
          const posX = mobile
            ? (i === 0 ? 22 : i === 1 ? 78 : i === 2 ? 22 : 78)
            : s.node.x * 100;
          const posY = mobile
            ? (i === 0 ? 18 : i === 1 ? 18 : i === 2 ? 38 : 38)
            : s.node.y * 100;
          return (
            <div
              key={s.id}
              className={`node node-${i} absolute opacity-0 will-change-transform`}
              style={{ left: `${posX}%`, top: `${posY}%` }}
            >
              <div className="relative">
                <div
                  className="relative h-[18vw] max-h-[190px] min-h-[72px] w-[18vw] max-w-[190px] min-w-[72px] sm:h-[15vw] sm:w-[15vw] overflow-hidden rounded-full"
                  style={{ boxShadow: `0 0 70px -10px ${s.glow}, inset 0 0 40px rgba(2,6,4,0.8)` }}
                >
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{ filter: "saturate(0.35) contrast(1.28) brightness(0.48)" }}
                  />
                  <div className="absolute inset-0 rounded-full border" style={{ borderColor: `${s.accent}55` }} />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_40%,rgba(2,6,4,0.85))]" />
                </div>
                <div
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: `${s.accent}30`, animation: "pulseRing 3.4s ease-out infinite" }}
                />
                <p
                  className="mt-2 sm:mt-3 text-center font-mono text-[8px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em]"
                  style={{ color: s.accent }}
                >
                  {s.index} · {s.name}
                </p>
              </div>
            </div>
          );
        })}

        {/* core */}
        <div className="core absolute left-1/2 top-1/2 opacity-0">
          <div className="relative h-[22vw] max-h-[210px] min-h-[85px] w-[22vw] max-w-[210px] min-w-[85px] sm:h-[16vw] sm:w-[16vw]">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(126,255,200,0.55), rgba(10,60,40,0) 68%)", filter: "blur(6px)" }}
            />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <polygon
                points="50,6 88,28 88,72 50,94 12,72 12,28"
                fill="none"
                stroke="rgba(160,255,214,0.65)"
                strokeWidth="0.7"
              />
              <polygon
                points="50,20 76,35 76,65 50,80 24,65 24,35"
                fill="none"
                stroke="rgba(24,196,124,0.5)"
                strokeWidth="0.5"
                style={{ transformOrigin: "50% 50%", animation: "spin 24s linear infinite" }}
              />
              <circle cx="50" cy="50" r="6" fill="rgba(200,255,232,0.9)" />
            </svg>
            <div className="core-ring absolute inset-0 rounded-full border border-[rgba(126,255,200,0.4)]" />
          </div>
        </div>

        {/* centre readout */}
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

        <div className="pointer-events-none absolute inset-x-0 bottom-[6%] sm:bottom-[10%] md:bottom-[12%] flex justify-center px-6">
          <div className="relative h-[220px] w-full max-w-[620px]">
            {streams.map((s, i) => (
              <div key={s.id} className={`read-${i} absolute inset-x-0 text-center opacity-0`}>
                <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.34em]" style={{ color: s.accent }}>
                  STREAM {s.index}
                </p>
                <h3 className="t-cond mt-1.5 sm:mt-2 text-[8.5vw] sm:text-[6.5vw] md:text-[5.6vw] leading-none text-[#f2fbf6]">{s.name}</h3>
                <p className="t-cond-l mt-2 sm:mt-3 text-[4.2vw] sm:text-[2.6vw] md:text-[1.5vw] text-[#bcdcce]">{s.line}</p>
                <p className="mx-auto mt-2.5 sm:mt-4 max-w-[46ch] text-[12px] sm:text-[13px] leading-relaxed text-[#7d9a8d]">
                  {s.description}
                </p>
                <div className="mt-3.5 sm:mt-5 flex justify-center gap-6 sm:gap-10">
                  {s.stats.map((st) => (
                    <div key={st.label}>
                      <div className="t-mid text-[18px] sm:text-[20px] text-[#dff3e8]">{st.value}</div>
                      <div className="font-mono text-[8px] tracking-[0.3em] text-[#557767]">{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="str-final absolute inset-x-0 top-[-25vh] sm:top-[-30vh] md:top-[-34vh] text-center opacity-0">
              <h3 className="t-cond text-[10vw] sm:text-[8vw] md:text-[6.5vw] leading-[0.86] text-[#f4fcf8]">
                FOUR STREAMS.
                <br />
                <span className="text-[#18c47c]">ONE SIGNAL.</span>
              </h3>
              <MaskReveal delay={0.05}>
                <p className="mx-auto mt-3 sm:mt-5 max-w-[52ch] text-[12px] sm:text-[13px] leading-relaxed text-[#7d9a8d]">
                  Everything built, performed, played and proven across three days collapses into a single
                  current — and that current has a date.
                </p>
              </MaskReveal>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 vignette" />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
