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

  const titleCharsRef =
    useRef<HTMLSpanElement[]>([]);

  const yearRef =
    useRef<HTMLSpanElement>(null);

  const subtitleRef =
    useRef<HTMLParagraphElement>(null);

  const taglineRef =
    useRef<HTMLParagraphElement>(null);

  const scanRef =
    useRef<HTMLDivElement>(null);

  const finalScanRef =
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

      const titleChars =
        titleCharsRef.current.filter(Boolean);

      const year =
        yearRef.current;

      const subtitle =
        subtitleRef.current;

      const tagline =
        taglineRef.current;

      const scan =
        scanRef.current;

      const finalScan =
        finalScanRef.current;

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
         FRAME 14 — LOGO REVEAL
         Energy collapses into the VYUHAM emblem.
      ===================================================== */

      tl.addLabel(
        "reveal",
        "break+=0.62"
      );

      /* -----------------------------------------------------
         RESET
      ----------------------------------------------------- */

      gsap.set(container, {
        opacity: 1,
      });

      gsap.set(logo, {
        opacity: 0,
        scale: 0.18,
        y: 18,
        filter:
          "blur(12px) brightness(2.4)",
      });

      gsap.set(title, {
        opacity: 1,
      });

      gsap.set(titleChars, {
        opacity: 0,
        y: 42,
        x: (index) =>
          index % 2 === 0 ? -26 : 26,
        rotateX: 78,
        rotateY: (index) =>
          index % 2 === 0 ? -18 : 18,
        scale: 0.78,
        filter: "blur(8px)",
      });

      if (year) {
        gsap.set(year, {
          opacity: 0,
          y: -22,
          scale: 0.48,
          rotate: -12,
          filter: "blur(6px)",
        });
      }

      gsap.set(subtitle, {
        opacity: 0,
        y: 16,
        letterSpacing: "0.58em",
      });

      gsap.set(tagline, {
        opacity: 0,
        y: 18,
        letterSpacing: "0.52em",
      });

      if (coordinates) {
        gsap.set(coordinates, {
          opacity: 0,
          y: 8,
        });
      }

      if (aura) {
        gsap.set(aura, {
          opacity: 0,
          scale: 0.25,
        });
      }

      if (ring) {
        gsap.set(ring, {
          opacity: 0,
          scale: 0.55,
          rotation: -24,
        });
      }

      if (glitch) {
        gsap.set(glitch, {
          opacity: 0,
          x: -8,
          scaleX: 1.15,
        });
      }

      if (scan) {
        gsap.set(scan, {
          y: "-120%",
          opacity: 0,
        });
      }

      if (finalScan) {
        gsap.set(finalScan, {
          opacity: 0,
          scaleX: 0,
        });
      }

      /* -----------------------------------------------------
         ENERGY MANAGEMENT / CORE
      ----------------------------------------------------- */

      if (aura) {
        tl.fromTo(
          aura,
          {
            opacity: 0,
            scale: 0.25,
          },
          {
            opacity: 0.95,
            scale: 1,
            duration: 0.38,
            ease: "expo.out",
          },
          "reveal"
        );

        tl.to(
          aura,
          {
            opacity: 0.34,
            scale: 1.35,
            duration: 0.72,
            ease: "power2.out",
          },
          "reveal+=0.38"
        );
      }

      if (ring) {
        tl.fromTo(
          ring,
          {
            opacity: 0,
            scale: 0.5,
            rotation: -30,
          },
          {
            opacity: 0.92,
            scale: 1,
            rotation: 0,
            duration: 0.62,
            ease: "expo.out",
          },
          "reveal+=0.04"
        );

        tl.to(
          ring,
          {
            rotation: 180,
            opacity: 0.55,
            duration: 1.4,
            ease: "none",
          },
          "reveal+=0.04"
        );
      }

      /* -----------------------------------------------------
         GLITCH HIT
      ----------------------------------------------------- */

      if (glitch) {
        tl.fromTo(
          glitch,
          {
            opacity: 0,
            x: -12,
            scaleX: 1.18,
          },
          {
            opacity: 0.95,
            x: 8,
            scaleX: 1,
            duration: 0.045,
            ease: "none",
          },
          "reveal+=0.08"
        );

        tl.to(
          glitch,
          {
            opacity: 0,
            x: -4,
            duration: 0.05,
          },
          ">"
        );

        tl.to(
          glitch,
          {
            opacity: 0.45,
            x: 3,
            duration: 0.04,
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

      /* -----------------------------------------------------
         LOGO MATERIALIZATION
      ----------------------------------------------------- */

      tl.fromTo(
        logo,
        {
          opacity: 0,
          scale: 0.18,
          y: 20,
          filter:
            "blur(14px) brightness(2.8)",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter:
            "blur(0px) brightness(1)",
          duration: 0.72,
          ease: "expo.out",
        },
        "reveal+=0.14"
      );

      /* -----------------------------------------------------
         LOGO MANAGEMENT PULSE
      ----------------------------------------------------- */

      tl.to(
        logo,
        {
          scale: 1.075,
          filter:
            "drop-shadow(0 0 42px rgba(52,211,153,0.95)) brightness(1.2)",
          duration: 0.18,
          ease: "power3.out",
        },
        "reveal+=0.68"
      );

      tl.to(
        logo,
        {
          scale: 1,
          filter:
            "drop-shadow(0 0 20px rgba(16,185,129,0.55)) brightness(1)",
          duration: 0.5,
          ease: "sine.out",
        },
        "reveal+=0.86"
      );

      /* -----------------------------------------------------
         LOGO SCAN
      ----------------------------------------------------- */

      if (scan) {
        tl.fromTo(
          scan,
          {
            y: "-120%",
            opacity: 0,
          },
          {
            y: "180%",
            opacity: 0.95,
            duration: 0.62,
            ease: "power1.inOut",
          },
          "reveal+=0.34"
        );

        tl.to(
          scan,
          {
            opacity: 0,
            duration: 0.12,
          },
          ">"
        );
      }

      /* =====================================================
         FRAME 14 — VYUHAM LETTER ASSEMBLY
      ===================================================== */

      tl.to(
        titleChars,
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.54,
          stagger: {
            each: 0.075,
            from: "start",
          },
          ease: "expo.out",
        },
        "reveal+=0.96"
      );

      if (year) {
        tl.to(
          year,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            duration: 0.48,
            ease: "back.out(1.7)",
          },
          "reveal+=1.54"
        );
      }

      /* Small constructed-wordmark pulse. */
      tl.to(
        titleChars,
        {
          textShadow:
            "0 0 14px rgba(209,250,229,0.28), 0 0 34px rgba(52,211,153,0.16)",
          duration: 0.28,
          stagger: 0.035,
          ease: "sine.out",
        },
        "reveal+=1.74"
      );

      /* =====================================================
         FRAME 15 — EVENT LABEL
      ===================================================== */

      tl.fromTo(
        subtitle,
        {
          opacity: 0,
          y: 16,
          letterSpacing: "0.58em",
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.32em",
          duration: 0.5,
          ease: "power3.out",
        },
        "reveal+=1.82"
      );

      if (coordinates) {
        tl.fromTo(
          coordinates,
          {
            opacity: 0,
            y: 8,
          },
          {
            opacity: 0.52,
            y: 0,
            duration: 0.38,
            ease: "power2.out",
          },
          "reveal+=2.02"
        );
      }

      /* -----------------------------------------------------
         TAGLINE
      ----------------------------------------------------- */

      tl.fromTo(
        tagline,
        {
          opacity: 0,
          y: 18,
          letterSpacing: "0.52em",
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.28em",
          duration: 0.62,
          ease: "power3.out",
        },
        "reveal+=2.18"
      );

      /* -----------------------------------------------------
         TAGLINE SIGNAL PULSE
      ----------------------------------------------------- */

      tl.to(
        tagline,
        {
          color: "#d1fae5",
          textShadow:
            "0 0 18px rgba(52,211,153,0.8)",
          duration: 0.28,
          ease: "power2.out",
        },
        "reveal+=2.86"
      );

      tl.to(
        tagline,
        {
          color: "rgba(156,163,175,0.9)",
          textShadow: "none",
          duration: 0.48,
          ease: "sine.inOut",
        },
        "reveal+=3.14"
      );

      /* =====================================================
         FRAME 15 — CONTROLLED LOGO BREATH
      ===================================================== */

      tl.to(
        logo,
        {
          scale: 1.025,
          filter:
            "drop-shadow(0 0 28px rgba(16,185,129,0.62))",
          duration: 0.72,
          ease: "sine.inOut",
        },
        "reveal+=2.55"
      );

      tl.to(
        logo,
        {
          scale: 1,
          filter:
            "drop-shadow(0 0 16px rgba(16,185,129,0.38))",
          duration: 0.72,
          ease: "sine.inOut",
        },
        "reveal+=3.27"
      );

      /* =====================================================
         FRAME 16 — TRANSMISSION
      ===================================================== */

      tl.addLabel(
        "transition",
        "reveal+=3.78"
      );

      if (finalScan) {
        tl.to(
          finalScan,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.32,
            ease: "power3.inOut",
          },
          "transition"
        );

        tl.to(
          finalScan,
          {
            opacity: 0,
            scaleX: 1.55,
            duration: 0.4,
            ease: "power2.out",
          },
          "transition+=0.32"
        );
      }

      /* -----------------------------------------------------
         FINAL SIGNAL FLASH
      ----------------------------------------------------- */

      tl.to(
        logo,
        {
          filter:
            "drop-shadow(0 0 45px rgba(52,211,153,0.9)) brightness(1.15)",
          duration: 0.18,
          ease: "power2.out",
        },
        "transition+=0.18"
      );

      tl.to(
        title,
        {
          scale: 0.985,
          opacity: 0.92,
          duration: 0.28,
          ease: "power2.inOut",
        },
        "transition+=0.18"
      );

      /*
       * Hold the complete title card.
       * IntroSequence owns the actual section fade.
       */
      tl.addLabel(
        "transitionComplete",
        "transition+=0.72"
      );
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
              "radial-gradient(circle, rgba(16,185,129,0.34) 0%, rgba(16,185,129,0.14) 36%, transparent 72%)",
            filter: "blur(22px)",
          }}
        />

        {/* =================================================
            DIMENSIONAL RING
        ================================================= */}

        <div
          ref={ringRef}
          className="absolute h-48 w-48 rounded-full border border-emerald-300/35 md:h-60 md:w-60"
          style={{
            opacity: 0,
            boxShadow:
              "0 0 28px rgba(16,185,129,0.2), inset 0 0 28px rgba(16,185,129,0.08)",
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(16,185,129,0.5) 55deg, transparent 95deg, transparent 180deg, rgba(52,211,153,0.42) 240deg, transparent 290deg)",
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
              "linear-gradient(90deg, transparent 15%, rgba(209,250,229,0.45) 38%, transparent 52%, rgba(16,185,129,0.32) 72%, transparent 88%)",
            mixBlendMode: "screen",
          }}
        />

        {/* =================================================
            LOGO EMBLEM
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
                "linear-gradient(90deg, transparent, rgba(209,250,229,0.98), transparent)",
              boxShadow:
                "0 0 14px rgba(16,185,129,0.9)",
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
            perspective: "900px",
            transformStyle: "preserve-3d",
          }}
        >
          {"VYUHAM".split("").map(
            (char, index) => (
              <span
                key={`${char}-${index}`}
                ref={(el) => {
                  if (el) {
                    titleCharsRef.current[index] =
                      el;
                  }
                }}
                className="inline-block will-change-transform"
                style={{
                  opacity: 0,
                  transformStyle:
                    "preserve-3d",
                }}
              >
                {char}
              </span>
            )
          )}

          <span
            ref={yearRef}
            className="inline-block text-green will-change-transform"
            style={{
              opacity: 0,
            }}
          >
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

        {/* =================================================
            FINAL TRANSMISSION SCAN
        ================================================= */}

        <div
          ref={finalScanRef}
          className="pointer-events-none absolute left-[-45vw] right-[-45vw] top-1/2 h-px"
          style={{
            opacity: 0,
            transform:
              "scaleX(0)",
            transformOrigin: "center",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.1) 20%, rgba(209,250,229,0.98) 50%, rgba(52,211,153,0.1) 80%, transparent 100%)",
            boxShadow:
              "0 0 24px rgba(52,211,153,0.9)",
          }}
        />
      </div>
    </div>
  );
});

LogoReveal.displayName =
  "LogoReveal";

export default LogoReveal;