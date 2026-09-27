import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/anim";
import { homepage, introChapters } from "@/data/content";
import { useReducedMotion } from "@/lib/hooks";

/**
 * THE OPENING SEQUENCE
 * black → "the world is changing." → campus → people → technology →
 * culture → gaming → impact → VYUHAM'26 → the future awaits.
 * Pacing accelerates chapter by chapter, exactly like a film cold open.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const finished = useRef(false);

  /* ---------- preload chapter plates ---------- */
  useEffect(() => {
    const urls = introChapters.map((c) => c.image);
    let loaded = 0;
    let cancelled = false;
    const bump = () => {
      loaded += 1;
      if (!cancelled) setProgress(Math.round((loaded / urls.length) * 100));
      if (loaded >= urls.length && !cancelled) setReady(true);
    };
    urls.forEach((u) => {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = u;
    });
    const fallback = window.setTimeout(() => {
      if (!cancelled) {
        setProgress(100);
        setReady(true);
      }
    }, 3600);
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    const el = root.current;
    tlRef.current?.kill();
    if (!el) return onDone();
    gsap.to(el, {
      opacity: 0,
      scale: 1.05,
      filter: "blur(14px)",
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: onDone,
    });
  };

  /* ---------- the timeline ---------- */
  useEffect(() => {
    if (!ready) return;
    const el = root.current;
    if (!el) return;

    if (reduced) {
      const t = window.setTimeout(finish, 900);
      return () => window.clearTimeout(t);
    }

    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      gsap.set(q(".bar"), { scaleY: 1 });
      gsap.set(q(".chapter"), { autoAlpha: 0 });
      gsap.set(q(".chapter-plate"), { scale: 1.18, filter: "blur(10px)" });
      gsap.set(q(".flash"), { autoAlpha: 0 });

      /* letterbox settles */
      tl.to(q(".bar"), { scaleY: 0.34, duration: 1.4, ease: "expo.out" }, 0);
      tl.fromTo(q(".hud"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 0.25);

      /* ── THE WORLD IS CHANGING. ───────────────────────── */
      tl.fromTo(
        q(".open-char"),
        { autoAlpha: 0, filter: "blur(18px)", yPercent: 40 },
        { autoAlpha: 1, filter: "blur(0px)", yPercent: 0, duration: 1.3, stagger: 0.028, ease: "expo.out" },
        0.45,
      );
      tl.to(q(".open-line"), { letterSpacing: "0.02em", duration: 2.0, ease: "expo.out" }, 0.45);
      tl.to(
        q(".open-line"),
        { autoAlpha: 0, filter: "blur(16px)", scale: 1.06, duration: 0.85, ease: "power2.in" },
        2.75,
      );

      /* ── CHAPTERS (absolute cut points, accelerating) ── */
      const SPEED = 0.85;
      let cursor = 3.2;
      introChapters.forEach((c, i) => {
        const seg = (c.hold / 1000) * SPEED;
        const sel = `.chapter-${i}`;
        const at = cursor;

        tl.set(q(sel), { autoAlpha: 1 }, at);
        tl.fromTo(
          q(`${sel} .chapter-plate`),
          { scale: 1.2, filter: "blur(12px)", autoAlpha: 0 },
          { scale: 1.02, filter: "blur(0px)", autoAlpha: 1, duration: seg * 1.55, ease: "power2.out" },
          at,
        );
        tl.fromTo(
          q(`${sel} .chapter-wipe`),
          { scaleX: 1 },
          { scaleX: 0, duration: Math.min(0.7, seg), ease: "expo.inOut", transformOrigin: "right center" },
          at,
        );
        tl.fromTo(
          q(`${sel} .chapter-word`),
          { yPercent: 55, autoAlpha: 0, letterSpacing: "0.5em", filter: "blur(10px)" },
          {
            yPercent: 0,
            autoAlpha: 1,
            letterSpacing: "0.12em",
            filter: "blur(0px)",
            duration: seg * 1.15,
            ease: "expo.out",
          },
          at + 0.06,
        );
        tl.fromTo(
          q(`${sel} .chapter-sub`),
          { autoAlpha: 0, x: -14 },
          { autoAlpha: 1, x: 0, duration: seg * 0.9, ease: "power2.out" },
          at + 0.12,
        );

        /* energy flash grows with the edit pace */
        if (i >= 3) {
          tl.to(q(".flash"), { autoAlpha: 0.08 + i * 0.03, duration: 0.05 }, at + seg * 0.82);
          tl.to(q(".flash"), { autoAlpha: 0, duration: 0.22 }, at + seg * 0.87);
        }

        tl.to(
          q(sel),
          { autoAlpha: 0, duration: Math.max(0.16, seg * 0.3), ease: "power2.in" },
          at + seg * 0.88,
        );
        cursor += seg;
      });

      /* ── VYUHAM'26 ────────────────────────────────────── */
      const L = cursor - 0.1;
      tl.to(q(".bar"), { scaleY: 0.5, duration: 0.5, ease: "power3.inOut" }, L - 0.2);
      tl.fromTo(
        q(".logo-wrap"),
        { autoAlpha: 0, scale: 1.32, filter: "blur(26px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.7, ease: "expo.out" },
        L,
      );
      tl.fromTo(q(".logo-sweep"), { xPercent: -140 }, { xPercent: 140, duration: 1.3, ease: "power2.inOut" }, L + 0.35);
      tl.fromTo(q(".logo-rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out" }, L + 0.25);
      tl.fromTo(
        q(".logo-kicker"),
        { autoAlpha: 0, y: 12, letterSpacing: "0.55em" },
        { autoAlpha: 1, y: 0, letterSpacing: "0.34em", duration: 1.1, ease: "expo.out" },
        L + 0.3,
      );
      tl.fromTo(
        q(".logo-tag"),
        { autoAlpha: 0, y: 18, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out" },
        L + 0.95,
      );
      tl.to(q(".bar"), { scaleY: 0, duration: 0.9, ease: "expo.inOut" }, L + 2.25);
    }, el);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced]);

  /* ---------- esc to skip ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[120] overflow-hidden bg-[#020403]"
      style={{ willChange: "opacity, transform, filter" }}
    >
      {/* chapters */}
      {introChapters.map((c, i) => (
        <div key={c.key} className={`chapter chapter-${i} absolute inset-0`} style={{ visibility: "hidden" }}>
          <div className="chapter-plate absolute inset-0">
            <img
              src={c.image}
              alt=""
              aria-hidden
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.42) contrast(1.25) brightness(0.44)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#02040399] via-[#02100b66] to-[#020403]" />
            <div className="light-leak absolute inset-0 opacity-70" />
          </div>
          <div className="chapter-wipe absolute inset-0 origin-left bg-[#020403]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <h2
              className="chapter-word t-cond text-center text-[15vw] leading-[0.9] text-[#e9f5ef] sm:text-[12vw] md:text-[9.5vw]"
              style={{ textShadow: "0 0 60px rgba(24,196,124,0.25)" }}
            >
              {c.word}
            </h2>
            <p className="chapter-sub mt-3 font-mono text-[9px] tracking-[0.42em] text-[#6f9b89] sm:text-[10px]">
              {c.sub}
            </p>
          </div>
          <div className="absolute bottom-[14%] left-1/2 h-px w-[42vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(24,196,124,0.35)] to-transparent" />
        </div>
      ))}

      {/* opening statement */}
      <div className="open-line absolute inset-0 flex items-center justify-center px-6" style={{ letterSpacing: "0.42em" }}>
        <h1 className="t-cond-l max-w-[90vw] text-center text-[7.2vw] leading-[1.05] text-[#dbe8e2] sm:text-[5.4vw] md:text-[3.6vw]">
          {homepage.openingLine.split("").map((ch, i) => (
            <span key={i} className="open-char inline-block">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>
      </div>

      {/* final logo */}
      <div className="logo-wrap pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6" style={{ visibility: "hidden" }}>
        <div className="relative overflow-hidden">
          <h1 className="t-cond text-center text-[19vw] leading-[0.82] text-[#f2fbf6] md:text-[13vw]">
            {homepage.brand}
            <span className="align-super text-[0.36em] text-[#18c47c]">{homepage.year}</span>
          </h1>
          <div className="logo-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-[rgba(160,255,214,0.35)] to-transparent mix-blend-screen" />
        </div>
        <div className="logo-rule mt-4 h-px w-[min(520px,74vw)] origin-center bg-gradient-to-r from-transparent via-[rgba(24,196,124,0.7)] to-transparent" />
        <p className="logo-kicker mt-4 font-mono text-[9px] tracking-[0.34em] text-[#8fb3a5] sm:text-[11px]">
          {homepage.kicker}
        </p>
        <p className="logo-tag t-cond mt-10 text-[5.4vw] tracking-[0.18em] text-[#9ad9bd] md:text-[2vw]">
          {homepage.tagline}
        </p>
      </div>

      {/* energy flash */}
      <div className="flash pointer-events-none absolute inset-0 bg-[#9dffd8] mix-blend-screen" />

      {/* letterbox bars */}
      <div className="bar pointer-events-none absolute inset-x-0 top-0 h-[16vh] origin-top bg-[#020403]" />
      <div className="bar pointer-events-none absolute inset-x-0 bottom-0 h-[16vh] origin-bottom bg-[#020403]" />

      {/* hud */}
      <div className="hud pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5 md:p-8">
        <div className="font-mono text-[9px] tracking-[0.3em] text-[#4c6a5e]">
          {ready ? "SEQ.01 / COLD OPEN" : `INITIALISING · ${progress}%`}
        </div>
        <div className="font-mono text-[9px] tracking-[0.3em] text-[#4c6a5e]">{homepage.dates}</div>
      </div>

      <button
        onClick={finish}
        className="absolute right-5 top-5 z-20 font-mono text-[9px] tracking-[0.3em] text-[#5e7f72] transition-colors duration-500 hover:text-[#9fe9c6] md:right-8 md:top-8"
      >
        SKIP ↦
      </button>

      <div className="grain pointer-events-none absolute inset-0 overflow-hidden" />
      <div className="vignette pointer-events-none absolute inset-0" />
    </div>
  );
}
