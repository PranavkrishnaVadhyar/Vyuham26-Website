"use client";

import Image from "next/image";
import {
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { gsap } from "gsap";

export interface LogoRevealHandle {
  addToTimeline: (
    tl: gsap.core.Timeline
  ) => void;
}

const LogoReveal = forwardRef<
  LogoRevealHandle
>(function LogoReveal(_, ref) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const logoRef =
    useRef<HTMLDivElement>(null);

  const titleRef =
    useRef<HTMLHeadingElement>(null);

  const subtitleRef =
    useRef<HTMLParagraphElement>(null);

  const taglineRef =
    useRef<HTMLParagraphElement>(null);

  const scanRef =
    useRef<HTMLDivElement>(null);

  const glitchRef =
    useRef<HTMLDivElement>(null);

  const auraRef =
    useRef<HTMLDivElement>(null);

  const ringRef =
    useRef<HTMLDivElement>(null);

  const coordinatesRef =
    useRef<HTMLParagraphElement>(null);

  useImperativeHandle(ref, () => ({
    addToTimeline(
      tl: gsap.core.Timeline
    ) {
      const container =
        containerRef.current;

      const logo =
        logoRef.current;

      const title =
        titleRef.current;

      const subtitle =
        subtitleRef.current;

      const tagline =
        taglineRef.current;

      const scan =
        scanRef.current;

      const glitch =
        glitchRef.current;

      const aura =
        auraRef.current;

      const ring =
        ringRef.current;

      const coordinates =
        coordinatesRef.current;

      if (
        !container ||
        !logo ||
        !title ||
        !subtitle ||
        !tagline
      ) {
        return;
      }

      /* =====================================================
         REVEAL
      ===================================================== */

      tl.addLabel(
        "reveal",
        "break+=0.55"
      );

      /* =====================================================
         ENERGY AURA
      ===================================================== */

      if (aura) {
        tl.fromTo(
          aura,
          {
            opacity: 0,
            scale: 0.35,
          },
          {
            opacity: 0.75,
            scale: 1,
            duration: 0.55,
            ease: "expo.out",
          },
          "reveal"
        );

        /*
         * Controlled pulse.
         *
         * Unlike the old infinite repeat,
         * this has a finite duration so it
         * cannot keep running after dismissal.
         */

        tl.to(
          aura,
          {
            opacity: 0.42,
            scale: 1.12,
            duration: 1.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
          },
          "reveal+=0.55"
        );
      }

      /* =====================================================
         DIMENSIONAL RING
      ===================================================== */

      if (ring) {
        tl.fromTo(
          ring,
          {
            opacity: 0,
            scale: 0.6,
            rotate: -30,
          },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.8,
            ease: "expo.out",
          },
          "reveal"
        );

        tl.to(
          ring,
          {
            rotate: 360,
            duration: 8,
            ease: "none",
          },
          "reveal"
        );
      }

      /* =====================================================
         GLITCH HIT
      ===================================================== */

      if (glitch) {
        tl.fromTo(
          glitch,
          {
            opacity: 0,
            x: -8,
            scaleX: 1.1,
          },
          {
            opacity: 0.8,
            x: 4,
            scaleX: 1,
            duration: 0.055,
            ease: "none",
          },
          "reveal+=0.04"
        );

        tl.to(
          glitch,
          {
            opacity: 0,
            x: -3,
            duration: 0.05,
          },
          ">"
        );

        tl.to(
          glitch,
          {
            opacity: 0.55,
            x: 2,
            duration: 0.045,
          },
          ">"
        );

        tl.to(
          glitch,
          {
            opacity: 0,
            x: 0,
            duration: 0.08,
          },
          ">"
        );
      }

      /* =====================================================
         LOGO EMBLEM
      ===================================================== */

      tl.fromTo(
        logo,
        {
          opacity: 0,
          scale: 0.2,
          rotate: 0,
          filter:
            "blur(12px) brightness(2)",
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter:
            "blur(0px) brightness(1)",
          duration: 0.85,
          ease: "expo.out",
        },
        "reveal+=0.08"
      );

      /*
       * Small settling motion.
       */

      tl.fromTo(
        logo,
        {
          y: 10,
        },
        {
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        },
        "reveal+=0.35"
      );

      /* =====================================================
         LOGO ENERGY PULSE
      ===================================================== */

      tl.to(
        logo,
        {
          filter:
            "drop-shadow(0 0 35px rgba(16,185,129,0.9))",
          duration: 0.3,
          ease: "power2.out",
        },
        "reveal+=0.55"
      );

      tl.to(
        logo,
        {
          filter:
            "drop-shadow(0 0 18px rgba(16,185,129,0.45))",
          duration: 0.65,
          ease: "sine.inOut",
        },
        "reveal+=0.85"
      );

      /* =====================================================
         SCAN PASS
      ===================================================== */

      if (scan) {
        tl.fromTo(
          scan,
          {
            y: "-120%",
            opacity: 0,
          },
          {
            y: "180%",
            opacity: 0.9,
            duration: 0.65,
            ease: "power1.in",
          },
          "reveal+=0.35"
        );

        tl.to(
          scan,
          {
            opacity: 0,
            duration: 0.15,
          },
          ">"
        );
      }

      /* =====================================================
         WORDMARK
      ===================================================== */

      tl.fromTo(
        title,
        {
          clipPath:
            "inset(0 100% 0 0)",
          opacity: 0,
          x: -12,
        },
        {
          clipPath:
            "inset(0 0% 0 0)",
          opacity: 1,
          x: 0,
          duration: 0.75,
          ease: "expo.out",
        },
        "reveal+=0.65"
      );

      /* =====================================================
         TECH FEST LABEL
      ===================================================== */

      tl.fromTo(
        subtitle,
        {
          opacity: 0,
          y: 14,
          letterSpacing: "0.55em",
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.32em",
          duration: 0.5,
          ease: "power3.out",
        },
        "reveal+=1.05"
      );

      /* =====================================================
         COORDINATE READOUT
      ===================================================== */

      if (coordinates) {
        tl.fromTo(
          coordinates,
          {
            opacity: 0,
            y: 8,
          },
          {
            opacity: 0.6,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "reveal+=1.3"
        );
      }

      /* =====================================================
         TAGLINE
      ===================================================== */

      tl.fromTo(
        tagline,
        {
          opacity: 0,
          y: 14,
          letterSpacing: "0.42em",
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.24em",
          duration: 0.65,
          ease: "power3.out",
        },
        "reveal+=1.45"
      );

      /* =====================================================
         FINAL SIGNAL PULSE
      ===================================================== */

      tl.to(
        tagline,
        {
          color: "#34d399",
          textShadow:
            "0 0 16px rgba(16,185,129,0.75)",
          duration: 0.45,
          ease: "sine.inOut",
        },
        "reveal+=2.1"
      );

      tl.to(
        tagline,
        {
          color: "rgba(156,163,175,0.85)",
          textShadow: "none",
          duration: 0.55,
          ease: "sine.inOut",
        },
        "reveal+=2.55"
      );

      /* =====================================================
         HOLD
      ===================================================== */

      tl.addLabel(
        "transition",
        "reveal+=3.35"
      );

      /*
       * The logo stays completely stable here.
       *
       * IntroSequence controls the final fade,
       * so this component does not disappear itself.
       */
    },
  }));

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-15 grid place-items-center"
      aria-hidden="true"
    >
      <div className="relative grid place-items-center text-center">

        {/* =================================================
            ENERGY AURA
        ================================================= */}

        <div
          ref={auraRef}
          className="absolute h-64 w-64 rounded-full md:h-80 md:w-80"
          style={{
            opacity: 0,

            background:
              "radial-gradient(circle, rgba(16,185,129,0.28) 0%, rgba(16,185,129,0.12) 38%, transparent 72%)",

            filter: "blur(22px)",
          }}
        />

        {/* =================================================
            DIMENSIONAL RING
        ================================================= */}

        <div
          ref={ringRef}
          className="absolute h-48 w-48 rounded-full border border-emerald-400/30 md:h-60 md:w-60"
          style={{
            opacity: 0,

            boxShadow:
              "0 0 25px rgba(16,185,129,0.18), inset 0 0 25px rgba(16,185,129,0.08)",

            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(16,185,129,0.4) 55deg, transparent 90deg, transparent 190deg, rgba(52,211,153,0.35) 240deg, transparent 285deg)",
          }}
        />

        {/* =================================================
            GLITCH OVERLAY
        ================================================= */}

        <div
          ref={glitchRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,

            background:
              "linear-gradient(90deg, transparent 20%, rgba(52,211,153,0.35) 40%, transparent 55%, rgba(16,185,129,0.25) 70%, transparent 85%)",

            mixBlendMode: "screen",
          }}
        />

        {/* =================================================
            LOGO
        ================================================= */}

        <div
          ref={logoRef}
          className="relative grid h-32 w-32 place-items-center md:h-40 md:w-40"
          style={{
            opacity: 0,
          }}
        >
          <Image
            src="/logo.png"
            alt="VYUHAM '26 emblem"
            width={160}
            height={160}
            priority
            loading="eager"
            fetchPriority="high"
            className="h-24 w-24 object-contain md:h-32 md:w-32"
          />

          {/* Logo scan line */}
          <div
            ref={scanRef}
            className="pointer-events-none absolute inset-x-0 h-px"
            style={{
              top: 0,

              background:
                "linear-gradient(90deg, transparent, rgba(52,211,153,0.95), transparent)",

              boxShadow:
                "0 0 12px rgba(16,185,129,0.8)",

              opacity: 0,
            }}
          />
        </div>

        {/* =================================================
            WORDMARK
        ================================================= */}

        <h1
          ref={titleRef}
          className="intro-wordmark mt-6 font-display text-[clamp(48px,10vw,112px)] leading-none tracking-[-0.09em] text-paper"
          style={{
            opacity: 0,
          }}
        >
          VYUHAM
          <span className="text-green">
            &apos;26
          </span>
        </h1>

        {/* =================================================
            EVENT LABEL
        ================================================= */}

        <p
          ref={subtitleRef}
          className="mt-3 font-mono text-[10px] tracking-[0.32em] text-green"
          style={{
            opacity: 0,
          }}
        >
          TECH FEST 2026
        </p>

        {/* =================================================
            COORDINATE READOUT
        ================================================= */}

        <p
          ref={coordinatesRef}
          className="mt-2 font-mono text-[7px] tracking-[0.2em] text-muted"
          style={{
            opacity: 0,
          }}
        >
          SIGNAL // 8.5441° N // 76.8808° E
        </p>

        {/* =================================================
            TAGLINE
        ================================================= */}

        <p
          ref={taglineRef}
          className="mt-2 font-mono text-[9px] tracking-[0.24em] text-muted"
          style={{
            opacity: 0,
          }}
        >
          THE FUTURE AWAITS
        </p>
      </div>
    </div>
  );
});

LogoReveal.displayName =
  "LogoReveal";

export default LogoReveal;