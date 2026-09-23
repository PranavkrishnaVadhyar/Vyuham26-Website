"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { gsap } from "gsap";

export interface StoneSystemHandle {
  addToTimeline: (tl: gsap.core.Timeline) => void;
}

interface Node {
  x: number;
  y: number;
  r: number;
  delay: number;
}

interface Fragment {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

/* =========================================================
   SIGNAL CORE SYSTEM
   ---------------------------------------------------------
   Replacement for the old five-core / stone system.

   Sequence:
   01  Signal Lost
   02  Signal Detected
   03  Scan
   04  Core Assembly
   05  Fragmentation
   06  Synchronization
   07  Protocol Lock
   08  System Ignition
   ========================================================= */

const SignalCoreSystem = forwardRef<StoneSystemHandle>(
  function SignalCoreSystem(_, ref) {
    /* -----------------------------------------------------
       SVG / DOM references
       ----------------------------------------------------- */

    const rootRef = useRef<HTMLDivElement>(null);

    const signalRef = useRef<SVGCircleElement>(null);
    const signalGlowRef = useRef<SVGCircleElement>(null);

    const scanRing1Ref = useRef<SVGCircleElement>(null);
    const scanRing2Ref = useRef<SVGCircleElement>(null);
    const scanRing3Ref = useRef<SVGCircleElement>(null);

    const coreHexRef = useRef<SVGPolygonElement>(null);
    const coreInnerRef = useRef<SVGPolygonElement>(null);

    const fragmentsRef = useRef<SVGGElement>(null);
    const networkRef = useRef<SVGGElement>(null);
    const protocolRef = useRef<SVGGElement>(null);

    const verticalScanRef = useRef<SVGLineElement>(null);
    const horizontalScanRef = useRef<SVGLineElement>(null);

    const ignitionRef = useRef<SVGCircleElement>(null);

    const initializedRef = useRef(false);

    /* -----------------------------------------------------
       Geometry
       ----------------------------------------------------- */

    const cx = 100;
    const cy = 100;

    const fragments: Fragment[] = [
      {
        x: 100,
        y: 38,
        rotation: 0,
        scale: 1,
      },
      {
        x: 154,
        y: 69,
        rotation: 60,
        scale: 0.9,
      },
      {
        x: 154,
        y: 131,
        rotation: 120,
        scale: 0.95,
      },
      {
        x: 100,
        y: 162,
        rotation: 180,
        scale: 1,
      },
      {
        x: 46,
        y: 131,
        rotation: 240,
        scale: 0.95,
      },
      {
        x: 46,
        y: 69,
        rotation: 300,
        scale: 0.9,
      },
    ];

    /* -----------------------------------------------------
       Fragment color system
       -----------------------------------------------------
       Top          -> Red
       Upper-right  -> Gold
       Lower-right  -> Purple
       Bottom       -> Orange
       Lower-left   -> Green
       Upper-left   -> Blue
       ----------------------------------------------------- */

    /*
     * Six-fragment palette — matched to the reference image.
     *
     * Position:
     *   01 Top          -> REALITY  -> Red
     *   02 Upper-right  -> MIND     -> Gold / Yellow
     *   03 Lower-right  -> POWER    -> Violet / Purple
     *   04 Bottom       -> SOUL     -> Orange
     *   05 Lower-left   -> TIME     -> Green
     *   06 Upper-left   -> SPACE    -> Blue
     */
    const fragmentColors = [
      {
        primary: "#ff304f",
        fill: "#d90429",
        bright: "#ff6b81",
        point: "#ffe5e9",
      },
      {
        primary: "#ffd60a",
        fill: "#eab308",
        bright: "#ffe66d",
        point: "#fff7bf",
      },
      {
        primary: "#a855f7",
        fill: "#7e22ce",
        bright: "#d8b4fe",
        point: "#f3e8ff",
      },
      {
        primary: "#ff7a18",
        fill: "#ea580c",
        bright: "#ffad66",
        point: "#fff0df",
      },
      {
        primary: "#22c55e",
        fill: "#16a34a",
        bright: "#86efac",
        point: "#dcfce7",
      },
      {
        primary: "#2196ff",
        fill: "#2563eb",
        bright: "#60a5fa",
        point: "#dbeafe",
      },
    ];

    const nodes: Node[] = [
      {
        x: 100,
        y: 40,
        r: 1.8,
        delay: 0,
      },
      {
        x: 135,
        y: 60,
        r: 1.4,
        delay: 0.08,
      },
      {
        x: 160,
        y: 100,
        r: 1.7,
        delay: 0.14,
      },
      {
        x: 135,
        y: 140,
        r: 1.5,
        delay: 0.2,
      },
      {
        x: 100,
        y: 160,
        r: 1.8,
        delay: 0.26,
      },
      {
        x: 65,
        y: 140,
        r: 1.5,
        delay: 0.32,
      },
      {
        x: 40,
        y: 100,
        r: 1.7,
        delay: 0.38,
      },
      {
        x: 65,
        y: 60,
        r: 1.5,
        delay: 0.44,
      },
      {
        x: 125,
        y: 82,
        r: 1.2,
        delay: 0.5,
      },
      {
        x: 125,
        y: 118,
        r: 1.2,
        delay: 0.56,
      },
      {
        x: 75,
        y: 118,
        r: 1.2,
        delay: 0.62,
      },
      {
        x: 75,
        y: 82,
        r: 1.2,
        delay: 0.68,
      },
    ];

    /* -----------------------------------------------------
       Helpers
       ----------------------------------------------------- */

    const setInitialState = () => {
      if (initializedRef.current) return;

      initializedRef.current = true;

      /*
       * IMPORTANT:
       * Do not create a temporary GSAP context and immediately
       * revert it here. Reverting would restore the SVG's original
       * opacity values and make the outer circle visible on frame 01.
       */

      /* Signal / white light */
      gsap.set(signalRef.current, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center",
      });

      gsap.set(signalGlowRef.current, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center",
      });

      /* ALL circular scan rings start completely invisible. */
      gsap.set(
        [
          scanRing1Ref.current,
          scanRing2Ref.current,
          scanRing3Ref.current,
        ],
        {
          opacity: 0,
          scale: 0.001,
          transformOrigin: "center",
        },
      );

      /* Core */
      gsap.set(coreHexRef.current, {
        opacity: 0,
        scale: 0.05,
        rotation: 30,
        transformOrigin: "center",
      });

      gsap.set(coreInnerRef.current, {
        opacity: 0,
        scale: 0.02,
        rotation: -30,
        transformOrigin: "center",
      });

      /* Six colored fragments */
      gsap.set(fragmentsRef.current, {
        opacity: 0,
        scale: 0.08,
        transformOrigin: "center",
      });

      /* Network */
      gsap.set(networkRef.current, {
        opacity: 0,
        scale: 0.8,
        transformOrigin: "center",
      });

      /* Protocol geometry */
      gsap.set(protocolRef.current, {
        opacity: 0,
        scale: 0.55,
        rotation: -30,
        transformOrigin: "center",
      });

      /* Scanner lines */
      gsap.set(verticalScanRef.current, {
        opacity: 0,
        attr: {
          y1: 20,
          y2: 20,
        },
      });

      gsap.set(horizontalScanRef.current, {
        opacity: 0,
        attr: {
          x1: 20,
          x2: 20,
        },
      });

      /* Ignition */
      gsap.set(ignitionRef.current, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center",
      });
    };

    /* -----------------------------------------------------
       Timeline
       ----------------------------------------------------- */

    useImperativeHandle(ref, () => ({
      addToTimeline(tl) {
        setInitialState();

        /*
         * ======================================================
         * VYUHAM SIGNAL SEQUENCE
         * 01 INITIAL STATE
         * 02 SIGNAL DETECTED
         * 03 ENERGY ACCUMULATION
         * 04 CORE FORMATION
         * 05 RING ASSEMBLY
         * 06 FRAGMENTS ARRIVE
         * 07 SYNCHRONIZATION
         * 08 PROTOCOL LOCK
         * ======================================================
         */

        /* ------------------------------------------------------
           01 — INITIAL STATE
           Empty frame. No circles, core, fragments or network.
        ------------------------------------------------------ */

        tl.addLabel("signalLost");

        tl.to({}, {
          duration: 0.42,
        }, "signalLost");

        /* ------------------------------------------------------
           02 — SIGNAL DETECTED
           A tiny white point appears first.
        ------------------------------------------------------ */

        tl.addLabel(
          "signalDetected",
          "signalLost+=0.42",
        );

        tl.to(
          signalRef.current,
          {
            opacity: 1,
            scale: 0.72,
            duration: 0.18,
            ease: "power3.out",
          },
          "signalDetected",
        );

        tl.to(
          signalGlowRef.current,
          {
            opacity: 0.3,
            scale: 0.45,
            duration: 0.22,
            ease: "power2.out",
          },
          "signalDetected+=0.02",
        );

        tl.to(
          signalRef.current,
          {
            scale: 0.48,
            duration: 0.16,
            ease: "sine.inOut",
          },
          "signalDetected+=0.18",
        );

        /* ------------------------------------------------------
           03 — ENERGY ACCUMULATION
           White energy grows. Still no circle.
        ------------------------------------------------------ */

        tl.addLabel(
          "energy",
          "signalDetected+=0.44",
        );

        tl.to(
          signalRef.current,
          {
            opacity: 1,
            scale: 2.05,
            duration: 0.42,
            ease: "power3.out",
          },
          "energy",
        );

        tl.to(
          signalGlowRef.current,
          {
            opacity: 0.95,
            scale: 1.55,
            duration: 0.42,
            ease: "power3.out",
          },
          "energy",
        );

        tl.to(
          signalRef.current,
          {
            scale: 2.8,
            duration: 0.14,
            ease: "power2.out",
          },
          "energy+=0.42",
        );

        tl.to(
          signalGlowRef.current,
          {
            scale: 2.15,
            opacity: 1,
            duration: 0.14,
            ease: "power2.out",
          },
          "energy+=0.42",
        );

        /* Fine alignment crosshair appears around the white light. */
        tl.fromTo(
          verticalScanRef.current,
          {
            opacity: 0,
            attr: { y1: 100, y2: 100 },
          },
          {
            opacity: 0.7,
            attr: { y1: 48, y2: 152 },
            duration: 0.28,
            ease: "power2.out",
          },
          "energy+=0.18",
        );

        tl.fromTo(
          horizontalScanRef.current,
          {
            opacity: 0,
            attr: { x1: 100, x2: 100 },
          },
          {
            opacity: 0.55,
            attr: { x1: 48, x2: 152 },
            duration: 0.28,
            ease: "power2.out",
          },
          "energy+=0.26",
        );

        tl.to(
          verticalScanRef.current,
          { opacity: 0, duration: 0.16 },
          "energy+=0.62",
        );

        tl.to(
          horizontalScanRef.current,
          { opacity: 0, duration: 0.16 },
          "energy+=0.70",
        );

        /* ------------------------------------------------------
           04 — CORE FORMATION
           White energy crystallizes into the hexagonal core.
        ------------------------------------------------------ */

        tl.addLabel(
          "coreAssembly",
          "energy+=0.62",
        );

        tl.to(
          coreHexRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.56,
            ease: "back.out(1.7)",
          },
          "coreAssembly",
        );

        tl.to(
          coreInnerRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.46,
            ease: "expo.out",
          },
          "coreAssembly+=0.14",
        );

        tl.to(
          signalRef.current,
          {
            scale: 0.42,
            opacity: 0.95,
            duration: 0.3,
            ease: "power2.inOut",
          },
          "coreAssembly+=0.22",
        );

        tl.to(
          signalGlowRef.current,
          {
            scale: 0.78,
            opacity: 0.55,
            duration: 0.3,
            ease: "power2.inOut",
          },
          "coreAssembly+=0.22",
        );

        tl.to(
          [coreHexRef.current, coreInnerRef.current],
          {
            scale: 1.08,
            duration: 0.18,
            ease: "power2.out",
          },
          "coreAssembly+=0.62",
        );

        tl.to(
          [coreHexRef.current, coreInnerRef.current],
          {
            scale: 1,
            duration: 0.24,
            ease: "power2.inOut",
          },
          "coreAssembly+=0.80",
        );

        /* ------------------------------------------------------
           05 — RING ASSEMBLY
           The first visible circle is born AFTER the core.
        ------------------------------------------------------ */

        tl.addLabel(
          "ringAssembly",
          "coreAssembly+=0.92",
        );

        tl.to(
          scanRing1Ref.current,
          {
            opacity: 0.95,
            scale: 1,
            duration: 0.34,
            ease: "expo.out",
          },
          "ringAssembly",
        );

        tl.to(
          scanRing2Ref.current,
          {
            opacity: 0.72,
            scale: 1,
            duration: 0.44,
            ease: "expo.out",
          },
          "ringAssembly+=0.12",
        );

        tl.to(
          scanRing3Ref.current,
          {
            opacity: 0.58,
            scale: 1,
            duration: 0.54,
            ease: "expo.out",
          },
          "ringAssembly+=0.25",
        );

        tl.to(
          scanRing1Ref.current,
          { opacity: 0.72, duration: 0.22, ease: "sine.out" },
          "ringAssembly+=0.60",
        );

        tl.to(
          scanRing2Ref.current,
          { opacity: 0.52, duration: 0.22, ease: "sine.out" },
          "ringAssembly+=0.66",
        );

        tl.to(
          scanRing3Ref.current,
          { opacity: 0.36, duration: 0.22, ease: "sine.out" },
          "ringAssembly+=0.72",
        );

        /* ------------------------------------------------------
           06 — FRAGMENTS ARRIVE
           Six colored stones appear after the ring.
        ------------------------------------------------------ */

        tl.addLabel(
          "fragmentation",
          "ringAssembly+=0.78",
        );

        tl.to(
          [coreHexRef.current, coreInnerRef.current],
          {
            scale: 0.88,
            duration: 0.28,
            ease: "power2.inOut",
          },
          "fragmentation",
        );

        tl.to(
          fragmentsRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.72,
            ease: "back.out(1.5)",
          },
          "fragmentation+=0.08",
        );

        tl.to(
          fragmentsRef.current,
          {
            rotation: 360,
            duration: 1.15,
            ease: "power2.inOut",
          },
          "fragmentation+=0.06",
        );

        tl.to(
          fragmentsRef.current,
          {
            scale: 1.1,
            duration: 0.18,
            ease: "power2.out",
          },
          "fragmentation+=0.58",
        );

        tl.to(
          fragmentsRef.current,
          {
            scale: 1,
            duration: 0.28,
            ease: "power2.inOut",
          },
          "fragmentation+=0.76",
        );

        /* ------------------------------------------------------
           07 — SYNCHRONIZATION
           Colored nodes connect into a unified network.
        ------------------------------------------------------ */

        tl.addLabel(
          "synchronization",
          "fragmentation+=0.70",
        );

        tl.to(
          networkRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          "synchronization",
        );

        tl.fromTo(
          networkRef.current,
          { scale: 0.68 },
          {
            scale: 1.05,
            duration: 0.5,
            ease: "expo.out",
          },
          "synchronization+=0.04",
        );

        tl.to(
          networkRef.current,
          {
            scale: 1,
            duration: 0.34,
            ease: "power2.inOut",
          },
          "synchronization+=0.54",
        );

        tl.to(
          [
            scanRing1Ref.current,
            scanRing2Ref.current,
            scanRing3Ref.current,
          ],
          {
            scale: 1.045,
            duration: 0.18,
            ease: "power2.out",
          },
          "synchronization+=0.22",
        );

        tl.to(
          [
            scanRing1Ref.current,
            scanRing2Ref.current,
            scanRing3Ref.current,
          ],
          {
            scale: 1,
            duration: 0.3,
            ease: "power2.inOut",
          },
          "synchronization+=0.40",
        );

        tl.to(
          coreInnerRef.current,
          {
            opacity: 1,
            scale: 0.9,
            duration: 0.38,
            ease: "power2.out",
          },
          "synchronization+=0.22",
        );

        /* ------------------------------------------------------
           08 — PROTOCOL LOCK
           Final geometry closes around the complete system.
        ------------------------------------------------------ */

        tl.addLabel(
          "protocol",
          "synchronization+=0.74",
        );

        tl.to(
          protocolRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.68,
            ease: "back.out(1.45)",
          },
          "protocol",
        );

        tl.to(
          protocolRef.current,
          {
            rotation: 90,
            duration: 0.9,
            ease: "power2.inOut",
          },
          "protocol+=0.02",
        );

        tl.to(
          [
            coreHexRef.current,
            coreInnerRef.current,
            fragmentsRef.current,
            networkRef.current,
          ],
          {
            scale: 1.08,
            duration: 0.2,
            ease: "power2.out",
          },
          "protocol+=0.46",
        );

        tl.to(
          [
            coreHexRef.current,
            coreInnerRef.current,
            fragmentsRef.current,
            networkRef.current,
          ],
          {
            scale: 1,
            duration: 0.28,
            ease: "power2.inOut",
          },
          "protocol+=0.66",
        );

        /*
         * Compatibility labels for IntroSequence.
         */
        tl.addLabel(
          "coresComplete",
          "protocol+=0.82",
        );

        tl.addLabel(
          "activate",
          "coresComplete+=0.2",
        );

        /*
         * SYSTEM IGNITION
         */
        tl.to(
          ignitionRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.16,
            ease: "power3.out",
          },
          "activate",
        );

        tl.to(
          ignitionRef.current,
          {
            scale: 3,
            opacity: 0,
            duration: 0.62,
            ease: "expo.out",
          },
          "activate+=0.16",
        );

        tl.to(
          [
            scanRing1Ref.current,
            scanRing2Ref.current,
            scanRing3Ref.current,
          ],
          {
            opacity: 0.75,
            duration: 0.22,
            ease: "power2.out",
          },
          "activate+=0.12",
        );

        /*
         * ------------------------------------------------------
         * BREAK
         * Compatibility point for Frames 9–12.
         * ------------------------------------------------------
         */

        tl.addLabel(
          "break",
          "activate+=0.78",
        );

        tl.to(
          fragmentsRef.current,
          {
            scale: 1.16,
            opacity: 0,
            duration: 0.34,
            ease: "power2.in",
          },
          "break",
        );

        tl.to(
          networkRef.current,
          {
            scale: 1.32,
            opacity: 0,
            duration: 0.38,
            ease: "power2.in",
          },
          "break",
        );

        tl.to(
          protocolRef.current,
          {
            scale: 1.3,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          "break",
        );

        tl.to(
          [
            scanRing1Ref.current,
            scanRing2Ref.current,
            scanRing3Ref.current,
          ],
          {
            scale: 1.25,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          "break",
        );

        tl.to(
          coreHexRef.current,
          {
            scale: 1.8,
            opacity: 0,
            duration: 0.38,
            ease: "power2.in",
          },
          "break+=0.04",
        );

        tl.to(
          coreInnerRef.current,
          {
            scale: 2.2,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
          },
          "break+=0.06",
        );
      },
    }));

/* -----------------------------------------------------
   Render
   ----------------------------------------------------- */

return (
  <div
    ref={rootRef}
    className="absolute inset-0 pointer-events-none overflow-hidden"
    style={{
      width: "100%",
      height: "100%",
    }}
  >
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      style={{
        overflow: "visible",
      }}
    >
      <defs>
        {/* ---------------------------------------------
               Main green glow
               --------------------------------------------- */}

        <filter
          id="signalGlow"
          x="-200%"
          y="-200%"
          width="400%"
          height="400%"
        >
          <feGaussianBlur
            stdDeviation="3"
            result="blur"
          />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter
          id="strongSignalGlow"
          x="-300%"
          y="-300%"
          width="600%"
          height="600%"
        >
          <feGaussianBlur
            stdDeviation="6"
            result="blur1"
          />

          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="1.5"
            result="blur2"
          />

          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ---------------------------------------------
               Core gradients
               --------------------------------------------- */}

        <radialGradient
          id="coreGradient"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop
            offset="0%"
            stopColor="#ffffff"
            stopOpacity="1"
          />

          <stop
            offset="20%"
            stopColor="#86efac"
            stopOpacity="1"
          />

          <stop
            offset="55%"
            stopColor="#22c55e"
            stopOpacity="0.9"
          />

          <stop
            offset="100%"
            stopColor="#16a34a"
            stopOpacity="0"
          />
        </radialGradient>

        <linearGradient
          id="coreLineGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="#dcfce7"
            stopOpacity="0.95"
          />

          <stop
            offset="50%"
            stopColor="#22c55e"
            stopOpacity="1"
          />

          <stop
            offset="100%"
            stopColor="#15803d"
            stopOpacity="0.3"
          />
        </linearGradient>

        {/* ---------------------------------------------
               Subtle grid pattern
               --------------------------------------------- */}

        <pattern
          id="microGrid"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 10 0 L 0 0 0 10"
            fill="none"
            stroke="#22c55e"
            strokeWidth="0.25"
            opacity="0.12"
          />
        </pattern>
      </defs>

      {/* =============================================
             SUBTLE GRID
             ============================================= */}

      <rect
        x="10"
        y="10"
        width="180"
        height="180"
        fill="url(#microGrid)"
        opacity="0.35"
      />

      {/* =============================================
             SIGNAL GLOW
             ============================================= */}

      <circle
        ref={signalGlowRef}
        cx={cx}
        cy={cy}
        r="13"
        fill="#22c55e"
        opacity="0"
        filter="url(#strongSignalGlow)"
      />

      <circle
        ref={signalRef}
        cx={cx}
        cy={cy}
        r="2.4"
        fill="#ffffff"
        filter="url(#strongSignalGlow)"
      />

      {/* =============================================
             SCAN RINGS
             ============================================= */}

      <circle
        ref={scanRing1Ref}
        cx={cx}
        cy={cy}
        r="22"
        fill="none"
        stroke="#22c55e"
        strokeWidth="0.7"
        strokeDasharray="2 4"
      />

      <circle
        ref={scanRing2Ref}
        cx={cx}
        cy={cy}
        r="42"
        fill="none"
        stroke="#4ade80"
        strokeWidth="0.55"
        strokeDasharray="5 6"
      />

      <circle
        ref={scanRing3Ref}
        cx={cx}
        cy={cy}
        r="68"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.45"
        strokeDasharray="1 7"
      />

      {/* =============================================
             SCANNER LINES
             ============================================= */}

      <line
        ref={verticalScanRef}
        x1="20"
        y1="20"
        x2="180"
        y2="20"
        stroke="#86efac"
        strokeWidth="0.7"
        filter="url(#signalGlow)"
      />

      <line
        ref={horizontalScanRef}
        x1="20"
        y1="20"
        x2="20"
        y2="180"
        stroke="#4ade80"
        strokeWidth="0.7"
        filter="url(#signalGlow)"
      />

      {/* =============================================
             NETWORK
             ============================================= */}

      <g ref={networkRef}>
        {/* Outer connections */}

        {nodes.map((node, index) => {
          const next =
            nodes[(index + 1) % nodes.length];

          return (
            <line
              key={`network-${index}`}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke="#22c55e"
              strokeWidth="0.55"
              strokeOpacity="0.48"
              strokeDasharray="2 3"
            />
          );
        })}

        {/* Cross connections */}

        <line
          x1="100"
          y1="40"
          x2="160"
          y2="100"
          stroke="#4ade80"
          strokeWidth="0.5"
          strokeOpacity="0.35"
        />

        <line
          x1="160"
          y1="100"
          x2="100"
          y2="160"
          stroke="#4ade80"
          strokeWidth="0.5"
          strokeOpacity="0.35"
        />

        <line
          x1="100"
          y1="160"
          x2="40"
          y2="100"
          stroke="#4ade80"
          strokeWidth="0.5"
          strokeOpacity="0.35"
        />

        <line
          x1="40"
          y1="100"
          x2="100"
          y2="40"
          stroke="#4ade80"
          strokeWidth="0.5"
          strokeOpacity="0.35"
        />

        {/* Node points */}

        {nodes.map((node, index) => (
          <circle
            key={`node-${index}`}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="#86efac"
            opacity="0.8"
            filter="url(#signalGlow)"
          />
        ))}
      </g>

      {/* =============================================
             FRAGMENTS
             ============================================= */}

      <g ref={fragmentsRef}>
        {fragments.map((fragment, index) => {
          const color = fragmentColors[index];

          return (
            <g
              key={`fragment-${index}`}
              transform={`translate(${fragment.x} ${fragment.y}) rotate(${fragment.rotation}) scale(${fragment.scale})`}
            >
              {/* Main fragment */}

              <polygon
                points="-7,0 -3.5,-5.5 3.5,-5.5 7,0 3.5,5.5 -3.5,5.5"
                fill="none"
                stroke={color.primary}
                strokeWidth="0.9"
                filter="url(#signalGlow)"
              />

              {/* Inner fragment */}

              <polygon
                points="-3.5,0 -1.7,-2.8 1.7,-2.8 3.5,0 1.7,2.8 -1.7,2.8"
                fill={color.fill}
                fillOpacity="0.28"
                stroke={color.bright}
                strokeWidth="0.45"
                filter="url(#signalGlow)"
              />

              {/* Fragment signal point */}

              <circle
                cx="0"
                cy="0"
                r="1"
                fill={color.point}
                filter="url(#strongSignalGlow)"
              />

              {/* Directional lines */}

              <line
                x1="-10"
                y1="0"
                x2="-6"
                y2="0"
                stroke={color.primary}
                strokeWidth="0.7"
                opacity="0.78"
                filter="url(#signalGlow)"
              />

              <line
                x1="6"
                y1="0"
                x2="10"
                y2="0"
                stroke={color.primary}
                strokeWidth="0.7"
                opacity="0.78"
                filter="url(#signalGlow)"
              />

              {/* Small inner highlight */}

              <circle
                cx="0"
                cy="0"
                r="0.38"
                fill="#ffffff"
                opacity="0.9"
              />
            </g>
          );
        })}
      </g>

      {/* =============================================
             CENTRAL CORE
             ============================================= */}

      <polygon
        ref={coreHexRef}
        points="
              100,70
              126,85
              126,115
              100,130
              74,115
              74,85
            "
        fill="rgba(34,197,94,0.08)"
        stroke="url(#coreLineGradient)"
        strokeWidth="1.2"
        filter="url(#signalGlow)"
      />

      <polygon
        ref={coreInnerRef}
        points="
              100,80
              117,90
              117,110
              100,120
              83,110
              83,90
            "
        fill="url(#coreGradient)"
        fillOpacity="0.3"
        stroke="#86efac"
        strokeWidth="0.7"
        filter="url(#strongSignalGlow)"
      />

      {/* Core crosshair */}

      <g
        opacity="0.7"
        stroke="#86efac"
        strokeWidth="0.45"
      >
        <line
          x1="100"
          y1="63"
          x2="100"
          y2="73"
        />

        <line
          x1="100"
          y1="127"
          x2="100"
          y2="137"
        />

        <line
          x1="63"
          y1="100"
          x2="73"
          y2="100"
        />

        <line
          x1="127"
          y1="100"
          x2="137"
          y2="100"
        />
      </g>

      {/* =============================================
             PROTOCOL GEOMETRY
             ============================================= */}

      <g ref={protocolRef}>
        {/* Outer hex */}

        <polygon
          points="
                100,25
                165,62
                165,138
                100,175
                35,138
                35,62
              "
          fill="none"
          stroke="#22c55e"
          strokeWidth="0.55"
          strokeDasharray="5 4"
          opacity="0.7"
        />

        {/* Inner hex */}

        <polygon
          points="
                100,32
                158,66
                158,134
                100,168
                42,134
                42,66
              "
          fill="none"
          stroke="#4ade80"
          strokeWidth="0.4"
          strokeDasharray="1 5"
          opacity="0.65"
        />

        {/* Protocol brackets */}

        <path
          d="
                M 52 48
                L 70 38
                L 78 38
              "
          fill="none"
          stroke="#86efac"
          strokeWidth="0.8"
        />

        <path
          d="
                M 148 48
                L 130 38
                L 122 38
              "
          fill="none"
          stroke="#86efac"
          strokeWidth="0.8"
        />

        <path
          d="
                M 52 152
                L 70 162
                L 78 162
              "
          fill="none"
          stroke="#86efac"
          strokeWidth="0.8"
        />

        <path
          d="
                M 148 152
                L 130 162
                L 122 162
              "
          fill="none"
          stroke="#86efac"
          strokeWidth="0.8"
        />

        {/* Small protocol nodes */}

        <circle
          cx="70"
          cy="38"
          r="1.4"
          fill="#86efac"
          filter="url(#signalGlow)"
        />

        <circle
          cx="130"
          cy="38"
          r="1.4"
          fill="#86efac"
          filter="url(#signalGlow)"
        />

        <circle
          cx="70"
          cy="162"
          r="1.4"
          fill="#86efac"
          filter="url(#signalGlow)"
        />

        <circle
          cx="130"
          cy="162"
          r="1.4"
          fill="#86efac"
          filter="url(#signalGlow)"
        />
      </g>

      {/* =============================================
             IGNITION FLASH
             ============================================= */}

      <circle
        ref={ignitionRef}
        cx={cx}
        cy={cy}
        r="7"
        fill="none"
        stroke="#dcfce7"
        strokeWidth="1.5"
        filter="url(#strongSignalGlow)"
      />

      {/* =============================================
             MICRO HUD MARKERS
             ============================================= */}

      <g
        fill="#4ade80"
        opacity="0.55"
        fontFamily="monospace"
        fontSize="3"
        letterSpacing="0.6"
      >
        <text x="17" y="18">
          SIG_01
        </text>

        <text x="143" y="18">
          SYS.ACT
        </text>

        <text x="17" y="185">
          VYUHAM
        </text>

        <text x="143" y="185">
          26.00
        </text>
      </g>

      {/* Corner markers */}

      <g
        fill="none"
        stroke="#22c55e"
        strokeWidth="0.55"
        opacity="0.45"
      >
        <path d="M 15 30 L 15 15 L 30 15" />
        <path d="M 170 15 L 185 15 L 185 30" />
        <path d="M 15 170 L 15 185 L 30 185" />
        <path d="M 170 185 L 185 185 L 185 170" />
      </g>
    </svg>
  </div>
);
  },
);

export default SignalCoreSystem;