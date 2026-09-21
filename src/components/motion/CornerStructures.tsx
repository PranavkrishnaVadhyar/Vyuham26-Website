"use client";

import {
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { gsap } from "gsap";

/* =========================================================
   VYUHAM'26 — FOUR DIMENSIONAL LOCK STRUCTURES

   EXACTLY FOUR STRUCTURES:

              ↘  TL     TR  ↙
                    ◉
              ↗  BL     BR  ↖

   Each structure:
   • enters independently
   • has its own energy beam
   • locks into the central ring
   • produces an impact flash
   • vibrates during containment
   • explodes outward during overload
========================================================= */

const STRUCTURES = [
  {
    id: "tl",

    // Mechanical body — upper left
    paths: [
      "M -8 -8 L 48 48 L 74 36 L 56 72 Z",
      "M 30 30 L 64 20 L 78 34 L 48 48 Z",
      "M 10 44 L 38 18 L 48 28 L 20 54 Z",
      "M 2 28 L 22 8 L 30 16 L 10 36 Z",
    ],

    circuits: [
      "M 8 66 L 58 66 L 58 48",
      "M 48 28 L 48 62 L 30 62",
      "M 18 52 L 44 52",
    ],

    bolts: [
      { cx: 52, cy: 52 },
      { cx: 38, cy: 34 },
    ],

    // Beam reaches far outside the stage
    piston: "M -260 -260 L 52 52",

    // Starts from top-left
    origin: {
      x: -260,
      y: -260,
    },

    explode: {
      x: -360,
      y: -360,
      rotation: -42,
    },

    impact: {
      x: 52,
      y: 52,
    },
  },

  {
    id: "tr",

    // Mechanical body — upper right
    paths: [
      "M 208 -8 L 152 48 L 126 36 L 144 72 Z",
      "M 170 30 L 136 20 L 122 34 L 152 48 Z",
      "M 190 44 L 162 18 L 152 28 L 180 54 Z",
      "M 198 28 L 178 8 L 170 16 L 190 36 Z",
    ],

    circuits: [
      "M 192 66 L 142 66 L 142 48",
      "M 152 28 L 152 62 L 170 62",
      "M 182 52 L 156 52",
    ],

    bolts: [
      { cx: 148, cy: 52 },
      { cx: 162, cy: 34 },
    ],

    piston: "M 460 -260 L 148 52",

    origin: {
      x: 260,
      y: -260,
    },

    explode: {
      x: 360,
      y: -360,
      rotation: 42,
    },

    impact: {
      x: 148,
      y: 52,
    },
  },

  {
    id: "bl",

    // Mechanical body — bottom left
    paths: [
      "M -8 208 L 48 152 L 74 164 L 56 128 Z",
      "M 30 170 L 64 180 L 78 166 L 48 152 Z",
      "M 10 164 L 38 190 L 48 180 L 20 154 Z",
      "M 2 180 L 22 200 L 30 192 L 10 172 Z",
    ],

    circuits: [
      "M 8 134 L 58 134 L 58 152",
      "M 48 172 L 48 138 L 30 138",
      "M 18 150 L 44 150",
    ],

    bolts: [
      { cx: 52, cy: 148 },
      { cx: 38, cy: 166 },
    ],

    piston: "M -260 460 L 52 148",

    origin: {
      x: -260,
      y: 260,
    },

    explode: {
      x: -360,
      y: 360,
      rotation: 42,
    },

    impact: {
      x: 52,
      y: 148,
    },
  },

  {
    id: "br",

    // Mechanical body — bottom right
    paths: [
      "M 208 208 L 152 152 L 126 164 L 144 128 Z",
      "M 170 170 L 136 180 L 122 166 L 152 152 Z",
      "M 190 164 L 162 190 L 152 180 L 180 154 Z",
      "M 198 180 L 178 200 L 170 192 L 190 172 Z",
    ],

    circuits: [
      "M 192 134 L 142 134 L 142 152",
      "M 152 172 L 152 138 L 170 138",
      "M 182 150 L 156 150",
    ],

    bolts: [
      { cx: 148, cy: 148 },
      { cx: 162, cy: 166 },
    ],

    piston: "M 460 460 L 148 148",

    origin: {
      x: 260,
      y: 260,
    },

    explode: {
      x: 360,
      y: 360,
      rotation: -42,
    },

    impact: {
      x: 148,
      y: 148,
    },
  },
];

/* ========================================================= */

export interface CornerStructuresHandle {
  addToTimeline: (tl: gsap.core.Timeline) => void;
}

/* ========================================================= */

const CornerStructures = forwardRef<CornerStructuresHandle>(
  function CornerStructures(_, ref) {
    const groupRefs = useRef<(SVGGElement | null)[]>([]);
    const pistonRefs = useRef<(SVGPathElement | null)[]>([]);
    const sparkRefs = useRef<(SVGCircleElement | null)[]>([]);
    const flashRefs = useRef<(SVGCircleElement | null)[]>([]);

    const vibrateTweens = useRef<gsap.core.Tween[]>([]);

    useImperativeHandle(ref, () => ({
      addToTimeline(tl: gsap.core.Timeline) {
        /* =====================================================
           STRUCTURE ENTRY
        ===================================================== */

        /* =====================================================
           FRAME 09 — STRUCTURES APPROACH
           Four irregular mechanical locks enter from the
           corners. The beams arrive first, then the bodies.
        ===================================================== */

        tl.addLabel(
          "structuresApproach",
          "ring+=0.12"
        );

        /* Compatibility label used by older timelines. */
        tl.addLabel(
          "structures",
          "structuresApproach"
        );

        STRUCTURES.forEach((structure, i) => {
          const group = groupRefs.current[i];
          const piston = pistonRefs.current[i];
          const spark = sparkRefs.current[i];
          const flash = flashRefs.current[i];

          if (!group || !piston) return;

          const delay = i * 0.13;

          /* =================================================
             RESET
          ================================================= */

          gsap.set(group, {
            x: structure.origin.x,
            y: structure.origin.y,
            opacity: 0,
            scale: 0.72,
            rotation:
              structure.origin.x < 0 ? 18 : -18,
            transformOrigin: "100px 100px",
          });

          gsap.set(piston, {
            opacity: 0,
            strokeDashoffset: 320,
          });

          if (spark) {
            gsap.set(spark, {
              opacity: 0,
              attr: {
                r: 0,
              },
            });
          }

          if (flash) {
            gsap.set(flash, {
              opacity: 0,
              attr: {
                r: 0,
              },
            });
          }

          /* =================================================
             ENERGY BEAM
          ================================================= */

          tl.fromTo(
            piston,
            {
              opacity: 0,
              strokeDashoffset: 320,
            },
            {
              opacity: 1,
              strokeDashoffset: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            `structuresApproach+=${delay}`
          );

          /* =================================================
             STRUCTURE ARRIVAL
          ================================================= */

          tl.to(
            group,
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,

              duration: 0.68,

              ease: "expo.out",

              onComplete: () => {
                /* Mechanical impact */
                gsap.timeline()
                  .to(group, {
                    x: "+=4",
                    duration: 0.045,
                    ease: "power2.out",
                  })
                  .to(group, {
                    x: "-=7",
                    duration: 0.055,
                    ease: "power2.inOut",
                  })
                  .to(group, {
                    x: "+=3",
                    duration: 0.045,
                    ease: "power2.out",
                  })
                  .to(group, {
                    x: 0,
                    duration: 0.08,
                  });
              },
            },
            `structuresApproach+=${delay + 0.08}`
          );

          /* =================================================
             IMPACT SPARK
          ================================================= */

          if (spark) {
            tl.fromTo(
              spark,
              {
                opacity: 0,
                attr: {
                  r: 0,
                },
              },
              {
                opacity: 1,
                attr: {
                  r: 8,
                },
                duration: 0.12,
                ease: "power3.out",
              },
              `structuresApproach+=${delay + 0.63}`
            );

            tl.to(
              spark,
              {
                opacity: 0,
                attr: {
                  r: 2,
                },
                duration: 0.22,
                ease: "power2.in",
              },
              ">"
            );
          }

          /* =================================================
             IMPACT FLASH
          ================================================= */

          if (flash) {
            tl.fromTo(
              flash,
              {
                opacity: 0,
                attr: {
                  r: 2,
                },
              },
              {
                opacity: 0.95,
                attr: {
                  r: 15,
                },
                duration: 0.16,
                ease: "power3.out",
              },
              `structuresApproach+=${delay + 0.63}`
            );

            tl.to(
              flash,
              {
                opacity: 0,
                attr: {
                  r: 25,
                },
                duration: 0.28,
                ease: "power2.out",
              },
              ">"
            );
          }
        });

        /* =====================================================
           FRAME 10 — STRUCTURES LOCK
           Once all four arms arrive, pull them tightly into
           the ring and create a mechanical containment lock.
        ===================================================== */

        tl.addLabel(
          "structuresLock",
          "structuresApproach+=1.15"
        );

        tl.to(
          groupRefs.current.filter(Boolean),
          {
            scale: 1.045,
            duration: 0.22,
            ease: "power2.out",
          },
          "structuresLock"
        );

        tl.to(
          groupRefs.current.filter(Boolean),
          {
            scale: 1,
            duration: 0.28,
            ease: "power2.inOut",
          },
          "structuresLock+=0.22"
        );

        /* Lock all four impact nodes together. */

        tl.to(
          sparkRefs.current.filter(Boolean),
          {
            opacity: 1,
            attr: { r: 4.5 },
            duration: 0.12,
            stagger: 0.035,
            ease: "power2.out",
          },
          "structuresLock+=0.18"
        );

        tl.to(
          sparkRefs.current.filter(Boolean),
          {
            opacity: 0.35,
            attr: { r: 2 },
            duration: 0.22,
            ease: "power2.inOut",
          },
          "structuresLock+=0.3"
        );

        /* Short lock vibration before loading begins. */

        tl.to(
          groupRefs.current.filter(Boolean),
          {
            x: "+=1.5",
            y: "+=1",
            duration: 0.055,
            yoyo: true,
            repeat: 5,
            ease: "power1.inOut",
          },
          "structuresLock+=0.34"
        );

        /* =====================================================
           CONTAINMENT / CHARGE
        ===================================================== */

        tl.add(() => {
          vibrateTweens.current = [];

          groupRefs.current.forEach((group) => {
            if (!group) return;

            const vibration = gsap.to(group, {
              x: "+=1.1",
              y: "+=0.7",

              duration: 0.065,

              yoyo: true,
              repeat: -1,

              ease: "power1.inOut",
            });

            vibrateTweens.current.push(vibration);
          });
        }, "charge");

        /* =====================================================
           ENERGY PULSE
        ===================================================== */

        tl.to(
          groupRefs.current.filter(Boolean),
          {
            scale: 1.025,
            duration: 0.18,
            yoyo: true,
            repeat: 3,
            ease: "power2.inOut",
          },
          "charge+=0.1"
        );

        /* =====================================================
           FINAL LOCK FLASH
        ===================================================== */

        tl.to(
          sparkRefs.current.filter(Boolean),
          {
            opacity: 1,
            attr: {
              r: 5,
            },
            duration: 0.08,
            stagger: 0.025,
          },
          "critical-=0.15"
        );

        tl.to(
          sparkRefs.current.filter(Boolean),
          {
            opacity: 0,
            attr: {
              r: 1,
            },
            duration: 0.18,
          },
          ">"
        );

        /* =====================================================
           STOP VIBRATION
        ===================================================== */

        tl.add(() => {
          vibrateTweens.current.forEach((tween) => {
            tween.kill();
          });

          vibrateTweens.current = [];
        }, "break");

        /* =====================================================
           FOUR-WAY DIMENSIONAL EXPLOSION
        ===================================================== */

        STRUCTURES.forEach((structure, i) => {
          const group = groupRefs.current[i];

          if (!group) return;

          tl.to(
            group,
            {
              x: structure.explode.x,
              y: structure.explode.y,

              rotation: structure.explode.rotation,

              opacity: 0,

              scale: 0.2,

              duration: 0.5,

              ease: "expo.in",

              transformOrigin: "100px 100px",
            },
            `break+=${0.06 + i * 0.025}`
          );
        });

        /* =====================================================
           BEAMS DISAPPEAR
        ===================================================== */

        tl.to(
          pistonRefs.current.filter(Boolean),
          {
            opacity: 0,
            duration: 0.16,
            ease: "power2.in",
          },
          "break+=0.08"
        );
      },
    }));

    /* =========================================================
       RENDER
    ========================================================= */

    return (
      <svg
        viewBox="0 0 200 200"
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          overflow-visible
        "
        aria-hidden="true"
      >
        <defs>
          {/* Main mechanical glow */}
          <filter
            id="vyuham-structure-glow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur
              stdDeviation="1.8"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Energy beam */}
          <filter
            id="vyuham-inner-glow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur
              stdDeviation="1.3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Impact */}
          <filter
            id="vyuham-spark-glow"
            x="-400%"
            y="-400%"
            width="800%"
            height="800%"
          >
            <feGaussianBlur
              stdDeviation="3.5"
            />
          </filter>
        </defs>

        {/* =====================================================
            FOUR STRUCTURES
        ===================================================== */}

        {STRUCTURES.map((structure, i) => (
          <g
            key={structure.id}
            ref={(el) => {
              groupRefs.current[i] = el;
            }}
            style={{
              opacity: 0,
              transformBox: "fill-box",
            }}
          >
            {/* =================================================
                LONG ENERGY BEAM
            ================================================= */}

            <path
              ref={(el) => {
                pistonRefs.current[i] = el;
              }}
              d={structure.piston}
              stroke="#34d399"
              strokeWidth="2.4"
              strokeDasharray="10 7"
              strokeLinecap="round"
              fill="none"
              opacity="0"
              filter="url(#vyuham-inner-glow)"
            />

            {/* Solid beam underneath */}
            <path
              d={structure.piston}
              stroke="#10b981"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
              filter="url(#vyuham-inner-glow)"
            />

            {/* =================================================
                MECHANICAL BODY
            ================================================= */}

            <g filter="url(#vyuham-structure-glow)">
              {structure.paths.map(
                (path, pathIndex) => (
                  <path
                    key={`${structure.id}-body-${pathIndex}`}
                    d={path}
                    fill={
                      pathIndex === 0
                        ? "#07110e"
                        : pathIndex === 1
                          ? "#0b1f18"
                          : "#07110e"
                    }
                    stroke="#10b981"
                    strokeWidth={
                      pathIndex < 2
                        ? 1.45
                        : 0.9
                    }
                    strokeLinejoin="round"
                    opacity={
                      pathIndex < 2
                        ? 1
                        : 0.72
                    }
                  />
                )
              )}

              {/* Circuit traces */}
              {structure.circuits.map(
                (circuit, circuitIndex) => (
                  <path
                    key={`${structure.id}-circuit-${circuitIndex}`}
                    d={circuit}
                    stroke="#34d399"
                    strokeWidth="0.75"
                    opacity="0.7"
                    fill="none"
                    strokeDasharray="3 3"
                  />
                )
              )}

              {/* Energy bolts */}
              {structure.bolts.map(
                (bolt, boltIndex) => (
                  <g
                    key={`${structure.id}-bolt-${boltIndex}`}
                  >
                    <circle
                      cx={bolt.cx}
                      cy={bolt.cy}
                      r="2.5"
                      fill="#07110e"
                      stroke="#34d399"
                      strokeWidth="0.55"
                    />

                    <circle
                      cx={bolt.cx}
                      cy={bolt.cy}
                      r="0.9"
                      fill="#a7f3d0"
                    />
                  </g>
                )
              )}
            </g>

            {/* =================================================
                IMPACT GLOW
            ================================================= */}

            <circle
              ref={(el) => {
                flashRefs.current[i] = el;
              }}
              cx={structure.impact.x}
              cy={structure.impact.y}
              r="0"
              fill="#34d399"
              opacity="0"
              filter="url(#vyuham-spark-glow)"
            />

            {/* =================================================
                IMPACT CORE
            ================================================= */}

            <circle
              ref={(el) => {
                sparkRefs.current[i] = el;
              }}
              cx={structure.impact.x}
              cy={structure.impact.y}
              r="0"
              fill="#d1fae5"
              opacity="0"
              filter="url(#vyuham-spark-glow)"
            />

            <circle
              cx={structure.impact.x}
              cy={structure.impact.y}
              r="1.6"
              fill="#6ee7b7"
            />
          </g>
        ))}
      </svg>
    );
  }
);

CornerStructures.displayName =
  "CornerStructures";

export default CornerStructures;