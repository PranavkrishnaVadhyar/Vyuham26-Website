"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";

import { gsap } from "gsap";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import StoneSystem, {
  type StoneSystemHandle,
} from "@/components/motion/StoneSystem";

import EnergyRing, {
  type EnergyRingHandle,
} from "@/components/motion/EnergyRing";

import CornerStructures, {
  type CornerStructuresHandle,
} from "@/components/motion/CornerStructures";

import IntroParticleField, {
  type ParticleFieldHandle,
} from "@/components/motion/ParticleField3D";

import LogoReveal, {
  type LogoRevealHandle,
} from "@/components/motion/LogoReveal";

// Track whether intro has completed in this JS execution context (resets on F5 / browser refresh)
let hasCompletedIntroInThisPageLoad = false;

export default function IntroSequence() {
  const reduceMotion = usePrefersReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  /* =========================================================
     SESSION STATE
  ========================================================= */

  useEffect(() => {
    setMounted(true);

    if (hasCompletedIntroInThisPageLoad) {
      setDismissed(true);
    }
  }, []);

  /* =========================================================
     DOM REFS
  ========================================================= */

  const sectionRef =
    useRef<HTMLElement>(null);

  const flashRef =
    useRef<HTMLDivElement>(null);

  const stageRef =
    useRef<HTMLDivElement>(null);

  const gridRef =
    useRef<HTMLDivElement>(null);

  const scanlineRef =
    useRef<HTMLDivElement>(null);

  const vignetteRef =
    useRef<HTMLDivElement>(null);

  const shakeContainerRef =
    useRef<HTMLDivElement>(null);

  const ambientGlowRef =
    useRef<HTMLDivElement>(null);

  const statusTextRef =
    useRef<HTMLParagraphElement>(null);

  const statusSubRef =
    useRef<HTMLParagraphElement>(null);

  const tlRef =
    useRef<gsap.core.Timeline | null>(null);

  /* =========================================================
     ANIMATION COMPONENT REFS
  ========================================================= */

  const stoneRef =
    useRef<StoneSystemHandle>(null);

  const ringRef =
    useRef<EnergyRingHandle>(null);

  const structuresRef =
    useRef<CornerStructuresHandle>(null);

  const particlesRef =
    useRef<ParticleFieldHandle>(null);

  const logoRef =
    useRef<LogoRevealHandle>(null);

  /* =========================================================
     VISIBILITY
  ========================================================= */

  const visible =
    mounted &&
    !dismissed &&
    !reduceMotion;

  /* =========================================================
     DISMISS
  ========================================================= */

  const dismiss = useCallback(() => {
    hasCompletedIntroInThisPageLoad = true;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    try {
      sessionStorage.setItem("vyuham-intro-dismissed", "1");
    } catch {
      // Ignore sessionStorage restrictions.
    }

    setDismissed(true);
  }, []);

  /* =========================================================
     SKIP
  ========================================================= */

  const skip = useCallback(() => {
    const tl = tlRef.current;

    if (!tl) return;

    /*
     * Finish the timeline rather than abruptly
     * removing the intro.
     */
    tl.progress(1);
  }, []);

  /* =========================================================
     VYUHAM SYSTEM STATUS
  ========================================================= */

  const STATUS_MESSAGES = [
    {
      at: 0.00,
      text: "SYSTEM // INITIALIZING",
      sub: "AWAITING ENERGY SIGNATURE",
    },

    {
      at: 0.05,
      text: "CORE ARRAY // ONLINE",
      sub: "FIVE ENERGY CORES DETECTED",
    },

    {
      at: 0.12,
      text: "VECTOR CORE // LOCKED",
      sub: "PRIMARY SIGNAL ESTABLISHED",
    },

    {
      at: 0.19,
      text: "COGNITION CORE // LOCKED",
      sub: "NEURAL SIGNAL SYNCHRONIZED",
    },

    {
      at: 0.26,
      text: "REALITY CORE // LOCKED",
      sub: "DIMENSIONAL FIELD STABLE",
    },

    {
      at: 0.33,
      text: "POWER CORE // LOCKED",
      sub: "ENERGY OUTPUT RISING",
    },

    {
      at: 0.40,
      text: "TEMPORAL CORE // ACTIVE",
      sub: "VYUHAM SIGNAL DETECTED",
    },

    {
      at: 0.46,
      text: "CORE ARRAY // SYNCHRONIZED",
      sub: "DIMENSIONAL SYSTEM ONLINE",
    },

    {
      at: 0.51,
      text: "RING SYSTEM // IGNITION",
      sub: "CONTAINMENT FIELD FORMING",
    },

    {
      at: 0.58,
      text: "DIMENSIONAL LOCKS // APPROACHING",
      sub: "FOUR STRUCTURES DETECTED",
    },

    {
      at: 0.65,
      text: "CONTAINMENT // LOCKED",
      sub: "ENERGY FIELD STABILIZED",
    },

    {
      at: 0.73,
      text: "ENERGY SYSTEM // CHARGING",
      sub: "POWER LEVEL RISING",
    },

    {
      at: 0.84,
      text: "CRITICAL ENERGY // DETECTED",
      sub: "SYSTEM APPROACHING MAXIMUM OUTPUT",
    },

    {
      at: 0.90,
      text: "SYSTEM // OVERLOAD",
      sub: "DIMENSIONAL FIELD RELEASE",
    },

    {
      at: 0.95,
      text: "VYUHAM'26 // ONLINE",
      sub: "THE FUTURE AWAITS",
    },

    {
      at: 0.985,
      text: "SIGNAL // TRANSMITTED",
      sub: "WELCOME TO THE FUTURE",
    },
  ];

  /* =========================================================
     MASTER TIMELINE
  ========================================================= */

  useEffect(() => {
    if (!visible) return;

    const section =
      sectionRef.current;

    const flash =
      flashRef.current;

    const stage =
      stageRef.current;

    const grid =
      gridRef.current;

    const scanline =
      scanlineRef.current;

    const vignette =
      vignetteRef.current;

    const shakeContainer =
      shakeContainerRef.current;

    const ambientGlow =
      ambientGlowRef.current;

    const statusText =
      statusTextRef.current;

    const statusSub =
      statusSubRef.current;

    if (
      !section ||
      !flash ||
      !stage ||
      !shakeContainer
    ) {
      return;
    }

    const buildTimer =
      requestAnimationFrame(() => {
        /* =====================================================
           MASTER TIMELINE
        ===================================================== */

        const tl = gsap.timeline({
          paused: true,

          onComplete: dismiss,

          onUpdate() {
            if (
              !statusText ||
              !statusSub
            ) {
              return;
            }

            const progress =
              tl.progress();

            let current =
              STATUS_MESSAGES[0];

            for (
              const message of STATUS_MESSAGES
            ) {
              if (
                progress >= message.at
              ) {
                current = message;
              }
            }

            if (
              statusText.textContent !==
              current.text
            ) {
              statusText.textContent =
                current.text;

              statusSub.textContent =
                current.sub;

              gsap.fromTo(
                statusText,
                {
                  opacity: 0.25,
                  y: 2,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.16,
                  ease: "power2.out",
                }
              );

              gsap.fromTo(
                statusSub,
                {
                  opacity: 0.3,
                },
                {
                  opacity: 1,
                  duration: 0.2,
                }
              );
            }
          },
        });

        /* =====================================================
           INTRO ENVIRONMENT
        ===================================================== */

        /*
         * Start WHITE.
         * The dark environment gradually arrives
         * when the energy system activates.
         */

        gsap.set(section, {
          backgroundColor: "#eef4ef",
        });

        if (grid) {
          tl.fromTo(
            grid,
            {
              opacity: 0,
            },
            {
              opacity: 0.08,
              duration: 0.8,
              ease: "power1.out",
            },
            0
          );
        }

        if (scanline) {
          tl.fromTo(
            scanline,
            {
              opacity: 0,
            },
            {
              opacity: 0.15,
              duration: 0.6,
            },
            0.4
          );
        }

        if (vignette) {
          tl.fromTo(
            vignette,
            {
              opacity: 0,
            },
            {
              opacity: 0.35,
              duration: 2.5,
              ease: "power1.in",
            },
            1.2
          );
        }

        /* =====================================================
           AMBIENT GREEN ENERGY
        ===================================================== */

        if (ambientGlow) {
          tl.fromTo(
            ambientGlow,
            {
              opacity: 0,
              scale: 0.6,
            },
            {
              opacity: 0.12,
              scale: 1,
              duration: 1.5,
              ease: "power2.out",
            },
            0.5
          );
        }

        /* =====================================================
           PHASE 01
           FIVE CORE ARRAY
        ===================================================== */

        stoneRef.current?.addToTimeline(tl);

        tl.addLabel("coresComplete");

        tl.to(
          section,
          {
            backgroundColor: "#030806",
            duration: 0.7,
            ease: "power2.inOut",
          },
          "coresComplete"
        );

        if (grid) {
          tl.to(
            grid,
            {
              opacity: 0.16,
              duration: 0.8,
            },
            "activate"
          );
        }

        if (ambientGlow) {
          tl.to(
            ambientGlow,
            {
              opacity: 0.25,
              scale: 1.15,
              duration: 0.8,
              ease: "power2.out",
            },
            "activate"
          );
        }

        /* =====================================================
           PHASE 02
           ENERGY RING
        ===================================================== */

        ringRef.current?.addToTimeline(
          tl
        );

        /* =====================================================
           PHASE 03
           DIMENSIONAL STRUCTURES
        ===================================================== */

        structuresRef.current?.addToTimeline(
          tl
        );

        /* =====================================================
           PHASE 04
           PARTICLE FIELD
        ===================================================== */

        particlesRef.current?.addToTimeline(
          tl
        );

        /* =====================================================
           SYSTEM CHARGE SHAKE
        ===================================================== */

        /*
         * Very subtle vibration first.
         */

        tl.to(
          shakeContainer,
          {
            x: "+=1",
            y: "+=0.5",
            yoyo: true,
            repeat: 22,
            duration: 0.07,
            ease: "power1.inOut",
          },
          "charge+=0.55"
        );

        /*
         * Stronger vibration as the system
         * approaches critical energy.
         */

        tl.to(
          shakeContainer,
          {
            x: "+=2.5",
            y: "+=1.5",
            yoyo: true,
            repeat: 14,
            duration: 0.045,
            ease: "power1.inOut",
          },
          "charge+=2.25"
        );

        /* =====================================================
           CRITICAL ENERGY
        ===================================================== */

        tl.to(
          shakeContainer,
          {
            x: "+=4",
            y: "+=2",
            yoyo: true,
            repeat: 8,
            duration: 0.035,
            ease: "power2.inOut",
          },
          "critical"
        );

        /* =====================================================
           BREAK / OVERLOAD
        ===================================================== */

        tl.addLabel(
          "overload",
          "break"
        );

        /*
         * Environment gets darker before the
         * green overload flash.
         */

        tl.to(
          section,
          {
            backgroundColor:
              "#010403",
            duration: 0.25,
            ease: "power2.in",
          },
          "break"
        );

        if (grid) {
          tl.to(
            grid,
            {
              opacity: 0,
              duration: 0.2,
            },
            "break"
          );
        }

        if (scanline) {
          tl.to(
            scanline,
            {
              opacity: 0,
              duration: 0.2,
            },
            "break"
          );
        }

        /*
         * Short distortion hit.
         */

        tl.to(
          shakeContainer,
          {
            filter:
              "blur(2px) brightness(2) saturate(1.5)",
            duration: 0.1,
            ease: "power2.out",
          },
          "break+=0.12"
        );

        tl.to(
          shakeContainer,
          {
            filter: "none",
            duration: 0.16,
            ease: "power1.out",
          },
          "break+=0.22"
        );

        /*
         * Green dimensional flash.
         */

        tl.to(
          flash,
          {
            opacity: 0.92,
            scale: 1.2,
            duration: 0.12,
            ease: "power3.out",
          },
          "break+=0.18"
        );

        tl.to(
          flash,
          {
            opacity: 0,
            scale: 4,
            duration: 0.45,
            ease: "power2.out",
          },
          "break+=0.3"
        );

        /*
         * Collapse the old core stage.
         *
         * The actual logo layer will now
         * take over.
         */

        tl.to(
          stage,
          {
            opacity: 0,
            scale: 0.25,
            duration: 0.32,
            ease: "expo.in",
          },
          "break+=0.12"
        );

        /*
         * Final impact.
         */

        tl.to(
          shakeContainer,
          {
            x: "+=7",
            y: "-=5",
            yoyo: true,
            repeat: 5,
            duration: 0.04,
            ease: "power2.inOut",
          },
          "break+=0.18"
        );

        tl.set(
          shakeContainer,
          {
            x: 0,
            y: 0,
            filter: "none",
          },
          "break+=0.65"
        );

        /* =====================================================
           PHASE 05
           LOGO REVEAL
        ===================================================== */

        logoRef.current?.addToTimeline(
          tl
        );

        /* =====================================================
           PHASE 06
           HOMEPAGE TRANSITION
        ===================================================== */

        tl.addLabel(
          "transition"
        );

        /*
         * Let the logo sit for a moment.
         * This is important: don't immediately
         * remove the brand after revealing it.
         */

        tl.to(
          {},
          {
            duration: 0.55,
          },
          "transition"
        );

        /*
         * Fade the entire cinematic layer.
         */

        tl.to(
          section,
          {
            opacity: 0,
            duration: 0.65,
            ease: "power2.inOut",
          },
          "transition+=0.5"
        );

        tlRef.current = tl;

        /* =====================================================
           PLAY
        ===================================================== */

        tl.play();
      });

    return () => {
      cancelAnimationFrame(
        buildTimer
      );

      if (tlRef.current) {
        hasCompletedIntroInThisPageLoad = true;
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, [visible, dismiss]);

  /* =========================================================
     RENDER
  ========================================================= */

  if (!visible) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="intro-cinema"
      aria-label="VYUHAM 26 opening sequence"
    >
      {/* =====================================================
          SKIP
      ===================================================== */}

      <button
        type="button"
        onClick={skip}
        className="intro-cinema__skip"
      >
        SKIP INTRO ↗
      </button>

      {/* =====================================================
          BACKGROUND GRID
      ===================================================== */}

      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0,

          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)",

          backgroundSize:
            "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* =====================================================
          AMBIENT ENERGY
      ===================================================== */}

      <div
        ref={ambientGlowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          opacity: 0,

          background:
            "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.08) 35%, transparent 72%)",

          filter: "blur(28px)",
        }}
        aria-hidden="true"
      />

      {/* =====================================================
          SCANLINES
      ===================================================== */}

      <div
        ref={scanlineRef}
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          opacity: 0,

          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.035) 2px, rgba(0,0,0,0.035) 4px)",
        }}
        aria-hidden="true"
      />

      {/* =====================================================
          VIGNETTE
      ===================================================== */}

      <div
        ref={vignetteRef}
        className="pointer-events-none absolute inset-0 z-5"
        style={{
          opacity: 0,

          background:
            "radial-gradient(circle at center, transparent 28%, rgba(0,0,0,0.5) 100%)",
        }}
        aria-hidden="true"
      />

      {/* =====================================================
          MAIN CINEMATIC LAYER
      ===================================================== */}

      <div
        ref={shakeContainerRef}
        className="absolute inset-0 grid place-items-center"
        style={{
          willChange:
            "transform, filter",
        }}
      >
        {/* ===================================================
            PARTICLES
        =================================================== */}

        <IntroParticleField
          ref={particlesRef}
        />

        {/* ===================================================
            GREEN OVERLOAD FLASH
        =================================================== */}

        <div
          ref={flashRef}
          className="intro-flash"
          aria-hidden="true"
          style={{
            opacity: 0,
            transform: "scale(1)",
          }}
        />

        {/* ===================================================
            CORE SYSTEM STAGE
        =================================================== */}

        <div
          ref={stageRef}
          className="relative z-10 h-[min(78vw,620px)] w-[min(78vw,620px)]"
        >
          <StoneSystem
            ref={stoneRef}
          />

          <EnergyRing
            ref={ringRef}
          />

          <CornerStructures
            ref={structuresRef}
          />
        </div>

        {/* ===================================================
            LOGO
        =================================================== */}

        <LogoReveal
          ref={logoRef}
        />
      </div>

      {/* =====================================================
          SYSTEM TELEMETRY
      ===================================================== */}

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-40 -translate-x-1/2 text-center font-mono">
        <p
          ref={statusTextRef}
          className="text-[10px] font-bold tracking-[0.24em] text-green uppercase"
        >
          SYSTEM // INITIALIZING
        </p>

        <p
          ref={statusSubRef}
          className="mt-1 text-[8px] tracking-[0.18em] text-muted uppercase"
        >
          AWAITING ENERGY SIGNATURE
        </p>
      </div>
    </section>
  );
}