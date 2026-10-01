import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { MEDIA } from "@/data/media";
import { useApp } from "@/lib/store";
import { MagneticButton } from "@/components/cinematic/Interactive";
import { scrollToId } from "@/lib/scroll";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
import Logo from "@/components/ui/Logo";

export default function Hero({ active }: { active: boolean }) {
  const { content } = useApp();
  const hp = content.homepage;
  const root = useRef<HTMLElement | null>(null);
  const [videoOn, setVideoOn] = useState(false);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  /* Load the ambience plate only once the cinematic intro has cleared,
     and never on reduced-motion or coarse/low-power contexts. */
  useEffect(() => {
    if (!active || reduced || mobile) return;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    if (conn?.saveData || (conn?.effectiveType && /2g/.test(conn.effectiveType))) return;
    const t = window.setTimeout(() => setVideoOn(true), 400);
    return () => window.clearTimeout(t);
  }, [active, reduced, mobile]);

  /* camera push-in on scroll */
  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      tl.to(".hero-bg", { scale: 1.16, yPercent: 6, ease: "none" }, 0);
      tl.to(".hero-mid", { yPercent: -14, ease: "none" }, 0);
      tl.to(".hero-copy", { yPercent: -26, autoAlpha: 0, filter: "blur(9px)", ease: "none" }, 0);
      tl.to(".hero-fade", { autoAlpha: 1, ease: "none" }, 0);
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  /* entrance once the intro hands over */
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !active) return;
    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(".hero-emblem", { autoAlpha: 0, scale: 0.85, filter: "blur(14px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.8 }, 0.05);
      tl.fromTo(".hero-kicker", { autoAlpha: 0, y: 18, letterSpacing: "0.6em" }, { autoAlpha: 1, y: 0, letterSpacing: "0.34em", duration: 1.6 }, 0.1);
      tl.fromTo(".hero-title", { autoAlpha: 0, scale: 1.12, filter: "blur(18px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 2 }, 0.2);
      tl.fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.6 }, 0.6);
      tl.fromTo(".hero-tag", { autoAlpha: 0, y: 22, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.5 }, 0.8);
      tl.fromTo(".hero-cta", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.12 }, 1.05);
      tl.fromTo(".hero-meta", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 1.25);
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, [active]);

  return (
    <section
      id="home"
      ref={root}
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden"
      aria-label="VYUHAM 26 — the future awaits"
    >
      {/* ── background plate (swap MEDIA.heroVideo for festival footage) ── */}
      <div className="hero-bg absolute inset-0 will-change-transform">
        <img
          src={MEDIA.campusNight}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(0.35) contrast(1.3) brightness(0.36)" }}
          fetchPriority="high"
        />
        {videoOn && (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-[0.42] mix-blend-screen"
            src={MEDIA.heroVideo}
            poster={MEDIA.heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            style={{ filter: "saturate(0.25) contrast(1.35) brightness(0.6) hue-rotate(96deg)" }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_10%,rgba(6,30,21,0.35),rgba(2,4,3,0.9)_72%)]" />
      </div>

      {/* ── mid-depth silhouette layer ── */}
      <div className="hero-mid pointer-events-none absolute inset-x-0 bottom-[-6%] h-[56%] will-change-transform">
        <img
          src={MEDIA.tower}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-[0.35]"
          style={{
            filter: "saturate(0) contrast(2.1) brightness(0.16)",
            WebkitMaskImage: "linear-gradient(180deg, transparent, #000 45%)",
            maskImage: "linear-gradient(180deg, transparent, #000 45%)",
          }}
          loading="lazy"
        />
      </div>

      {/* green energy traces */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[8%] top-0 h-full w-px opacity-40"
          style={{ background: "linear-gradient(180deg, transparent, rgba(24,196,124,0.5), transparent)" }}
        />
        <div
          className="absolute right-[12%] top-0 h-full w-px opacity-25"
          style={{ background: "linear-gradient(180deg, transparent, rgba(95,243,210,0.45), transparent)" }}
        />
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[rgba(24,196,124,0.14)] to-transparent" />
      </div>

      {/* ── copy ── */}
      <div
        className="hero-copy relative z-10 flex h-full flex-col items-center justify-center px-5 text-center will-change-transform"
        style={{ visibility: active ? "visible" : "hidden" }}
      >
        {/* Festival Emblem Logo */}
        <div className="hero-emblem mb-3 flex items-center justify-center sm:mb-4">
          <div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16 md:h-20 md:w-20">
            <Logo
              size="md"
              alt="VYUHAM'26 Emblem"
              className="relative z-10 h-14 w-14 object-contain drop-shadow-[0_0_28px_rgba(24,196,124,0.65)] transition-transform duration-700 hover:scale-105 sm:h-16 sm:w-16 md:h-20 md:w-20"
            />
          </div>
        </div>

        <p className="hero-kicker font-mono text-[9px] tracking-[0.34em] text-[#8fb3a5] sm:text-[11px]">
          {hp.kicker}
        </p>

        <h1 className="hero-title t-cond mt-4 text-[21vw] leading-[0.8] text-[#f4fcf8] sm:text-[18vw] md:text-[15vw] lg:text-[13.5vw]">
          <span
            style={{
              textShadow: "0 0 90px rgba(24,196,124,0.22), 0 0 200px rgba(10,60,40,0.5)",
            }}
          >
            {hp.brand}
            <span className="align-super text-[0.34em] text-[#18c47c]">{hp.year}</span>
          </span>
        </h1>

        <div className="hero-rule mt-3 h-px w-[min(560px,78vw)] origin-center bg-gradient-to-r from-transparent via-[rgba(24,196,124,0.65)] to-transparent" />

        <p className="hero-tag t-cond-l mt-7 text-[6.4vw] tracking-[0.2em] text-[#b9ddcc] sm:text-[4vw] md:text-[2.1vw]">
          {hp.tagline}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="hero-cta">
            <MagneticButton variant="solid" onClick={() => scrollToId("awakening")}>
              {hp.primaryCta}
              <span className="text-[#7dffc4]">↓</span>
            </MagneticButton>
          </div>
          <div className="hero-cta">
            <MagneticButton onClick={() => scrollToId("events")}>
              {hp.secondaryCta}
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* ── bottom meta rail ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 pb-6 md:px-10 md:pb-8"
        style={{ visibility: active ? "visible" : "hidden" }}
      >
        <div className="hero-meta">
          <p className="font-mono text-[9px] tracking-[0.3em] text-[#6d8d80] md:text-[10px]">{hp.dates}</p>
          <p className="mt-1 font-mono text-[9px] tracking-[0.3em] text-[#3f5c50] md:text-[10px]">
            {hp.location && !hp.location.includes("HYDERABAD") ? hp.location : "TECHNOCITY · THIRUVANANTHAPURAM"}
          </p>
        </div>

        <button
          onClick={() => scrollToId("awakening")}
          className="hero-meta group flex flex-col items-center gap-2"
          aria-label="Scroll"
        >
          <span className="font-mono text-[8px] tracking-[0.34em] text-[#5b7b6e] md:text-[9px]">SCROLL</span>
          <span className="relative block h-10 w-px overflow-hidden bg-[rgba(120,160,145,0.2)]">
            <span
              className="absolute inset-x-0 top-0 h-3 bg-[#18c47c]"
              style={{ animation: "scanline 2.4s cubic-bezier(0.6,0,0.2,1) infinite" }}
            />
          </span>
        </button>

        <div className="hero-meta hidden text-right sm:block">
          <p className="font-mono text-[9px] tracking-[0.3em] text-[#6d8d80] md:text-[10px]">{hp.edition}</p>
          <p className="mt-1 font-mono text-[9px] tracking-[0.3em] text-[#3f5c50] md:text-[10px]">
            {hp.institution}
          </p>
        </div>
      </div>

      <div className="hero-fade pointer-events-none absolute inset-0 bg-[#020403] opacity-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020403] to-transparent" />
    </section>
  );
}
