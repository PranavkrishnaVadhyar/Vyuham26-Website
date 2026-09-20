"use client";

import {
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { gsap } from "gsap";

const RADIUS = 74;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const INNER_RADIUS = 63;
const INNER_CIRC = 2 * Math.PI * INNER_RADIUS;

const CORE_RADIUS = 48;

const TICK_COUNT = 72;

const TICKS = Array.from(
  { length: TICK_COUNT },
  (_, i) => {
    const angle =
      (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;

    const isMajor = i % 6 === 0;

    const innerR =
      RADIUS - (isMajor ? 9 : 5);

    const outerR = RADIUS - 1;

    return {
      x1: Number(
        (100 + Math.cos(angle) * innerR).toFixed(4)
      ),
      y1: Number(
        (100 + Math.sin(angle) * innerR).toFixed(4)
      ),
      x2: Number(
        (100 + Math.cos(angle) * outerR).toFixed(4)
      ),
      y2: Number(
        (100 + Math.sin(angle) * outerR).toFixed(4)
      ),
      isMajor,
    };
  }
);

export interface EnergyRingHandle {
  addToTimeline: (tl: gsap.core.Timeline) => void;
}

const EnergyRing = forwardRef<EnergyRingHandle>(
  function EnergyRing(_, ref) {
    const containerRef =
      useRef<HTMLDivElement>(null);

    const trackRef =
      useRef<SVGCircleElement>(null);

    const progressRef =
      useRef<SVGCircleElement>(null);

    const innerRingRef =
      useRef<SVGCircleElement>(null);

    const coreRingRef =
      useRef<SVGCircleElement>(null);

    const counterRef =
      useRef<HTMLSpanElement>(null);

    const counterLabelRef =
      useRef<HTMLSpanElement>(null);

    const tickGroupRef =
      useRef<SVGGElement>(null);

    const rotatingGroupRef =
      useRef<SVGGElement>(null);

    const reverseRotatingGroupRef =
      useRef<SVGGElement>(null);

    const arcRefs =
      useRef<(SVGCircleElement | null)[]>([]);

    const pulseRingRefs =
      useRef<(SVGCircleElement | null)[]>([]);

    const scanLineRef =
      useRef<SVGLineElement>(null);

    const coreGlowRef =
      useRef<SVGCircleElement>(null);

    const chargeTweens =
      useRef<(gsap.core.Tween | gsap.core.Timeline)[]>([]);

    useImperativeHandle(ref, () => ({
      addToTimeline(tl: gsap.core.Timeline) {
        const container = containerRef.current;
        const track = trackRef.current;
        const progress = progressRef.current;
        const innerRing = innerRingRef.current;
        const coreRing = coreRingRef.current;
        const counter = counterRef.current;
        const counterLabel = counterLabelRef.current;
        const tickGroup = tickGroupRef.current;
        const rotatingGroup =
          rotatingGroupRef.current;
        const reverseRotatingGroup =
          reverseRotatingGroupRef.current;
        const scanLine = scanLineRef.current;
        const coreGlow = coreGlowRef.current;

        if (
          !container ||
          !track ||
          !progress ||
          !innerRing ||
          !coreRing ||
          !counter ||
          !counterLabel
        ) {
          return;
        }

        /* =====================================================
           ACTIVATE
           Center core creates the first dimensional pulse.
        ===================================================== */

        tl.addLabel("activate");

        /* Core ignition */

        if (coreGlow) {
          tl.fromTo(
            coreGlow,
            {
              opacity: 0,
              attr: {
                r: CORE_RADIUS * 0.45,
              },
            },
            {
              opacity: 0.8,
              attr: {
                r: CORE_RADIUS,
              },
              duration: 0.5,
              ease: "power2.out",
            },
            "activate"
          );
        }

        /* Inner containment ring */

        tl.fromTo(
          coreRing,
          {
            opacity: 0,
            attr: {
              r: CORE_RADIUS * 0.55,
            },
          },
          {
            opacity: 0.85,
            attr: {
              r: CORE_RADIUS,
            },
            duration: 0.55,
            ease: "expo.out",
          },
          "activate+=0.05"
        );

        /* Main track */

        tl.fromTo(
          track,
          {
            opacity: 0,
            attr: {
              "stroke-width": 0,
            },
            scale: 0.72,
            transformOrigin: "100px 100px",
          },
          {
            opacity: 1,
            attr: {
              "stroke-width": 3,
            },
            scale: 1,
            duration: 0.7,
            ease: "expo.out",
          },
          "activate+=0.12"
        );

        /* Inner counter-rotating ring */

        tl.fromTo(
          innerRing,
          {
            opacity: 0,
            strokeDashoffset: INNER_CIRC,
          },
          {
            opacity: 0.6,
            strokeDashoffset: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          "activate+=0.18"
        );

        /* Tick system */

        if (tickGroup) {
          tl.fromTo(
            tickGroup,
            {
              opacity: 0,
              scale: 0.8,
              transformOrigin: "100px 100px",
            },
            {
              opacity: 1,
              scale: 1,
              duration: 0.55,
              ease: "power2.out",
            },
            "activate+=0.25"
          );
        }

        /* Progress ring */

        tl.fromTo(
          progress,
          {
            opacity: 0,
            strokeDashoffset: CIRCUMFERENCE,
          },
          {
            opacity: 1,
            duration: 0.4,
            ease: "power1.out",
          },
          "activate+=0.35"
        );

        /* Counter */

        tl.fromTo(
          counter,
          {
            opacity: 0,
            scale: 0.5,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(2)",
          },
          "activate+=0.4"
        );

        tl.fromTo(
          counterLabel,
          {
            opacity: 0,
            y: 6,
          },
          {
            opacity: 0.7,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          "activate+=0.55"
        );

        /* =====================================================
           ROTATION
        ===================================================== */

        if (rotatingGroup) {
          tl.add(() => {
            const tw = gsap.to(rotatingGroup, {
              rotation: 360,
              duration: 12,
              ease: "none",
              repeat: -1,
              transformOrigin: "100px 100px",
            });
            chargeTweens.current.push(tw);
          }, "activate");
        }

        if (reverseRotatingGroup) {
          tl.add(() => {
            const tw = gsap.to(reverseRotatingGroup, {
              rotation: -360,
              duration: 18,
              ease: "none",
              repeat: -1,
              transformOrigin: "100px 100px",
            });
            chargeTweens.current.push(tw);
          }, "activate");
        }

        /* =====================================================
           RING PHASE
        ===================================================== */

        tl.addLabel(
          "ring",
          "activate+=0.75"
        );

        /* Energy arcs */

        arcRefs.current.forEach(
          (arc, i) => {
            if (!arc) return;

            tl.fromTo(
              arc,
              {
                opacity: 0,
                scale: 0.94,
                transformOrigin:
                  "100px 100px",
              },
              {
                opacity:
                  i === 1 ? 0.8 : 0.45,
                scale: 1,
                duration: 0.35,
                ease: "power2.out",
              },
              `ring+=${i * 0.1}`
            );
          }
        );

        /* =====================================================
           SCAN
        ===================================================== */

        if (scanLine) {
          tl.fromTo(
            scanLine,
            {
              opacity: 0,
              attr: { y1: 35, y2: 35 },
            },
            {
              opacity: 0.7,
              attr: { y1: 65, y2: 65 },
              duration: 0.55,
              ease: "power1.inOut",
              repeat: 2,
              yoyo: true,
            },
            "ring+=0.2"
          );
        }

        /* =====================================================
           CHARGE
        ===================================================== */

        tl.addLabel(
          "charge",
          "ring+=0.85"
        );

        const progressProxy = {
          value: 0,
        };

        const chargeTween = tl.to(
          progressProxy,
          {
            value: 100,

            duration: 4.2,

            ease: "power1.inOut",

            onUpdate() {
              const pct =
                Math.round(
                  progressProxy.value
                );

              counter.textContent =
                `${pct}%`;

              const offset =
                CIRCUMFERENCE *
                (1 - pct / 100);

              progress.style.strokeDashoffset =
                String(offset);

              /*
               * Green energy intensifies as
               * the dimensional system approaches
               * critical load.
               */

              const glow =
                8 + (pct / 100) * 28;

              progress.style.filter =
                `drop-shadow(0 0 ${glow}px #10b981)`;

              /*
               * Core begins to pulse harder
               * above 70%.
               */

              if (coreGlow && pct > 70) {
                const intensity =
                  0.55 +
                  ((pct - 70) / 30) * 0.45;

                coreGlow.style.opacity =
                  String(intensity);
              }
            },
          },
          "charge"
        );

        chargeTweens.current.push(
          chargeTween
        );

        /* Ring thickness */

        tl.to(
          progress,
          {
            attr: {
              "stroke-width": 7,
            },
            duration: 4.2,
            ease: "power1.in",
          },
          "charge"
        );

        /* Inner ring acceleration */

        tl.to(
          innerRing,
          {
            strokeDashoffset:
              -INNER_CIRC * 4,
            duration: 4.2,
            ease: "power1.in",
          },
          "charge"
        );

        /* =====================================================
           PULSE WAVES
        ===================================================== */

        pulseRingRefs.current.forEach(
          (ring, i) => {
            if (!ring) return;

            tl.fromTo(
              ring,
              {
                attr: {
                  r: RADIUS - 4,
                },
                opacity: 0.5,
                strokeWidth: 2,
              },
              {
                attr: {
                  r: RADIUS + 42,
                },
                opacity: 0,
                strokeWidth: 0.4,

                duration: 1.25,

                ease: "power2.out",

                repeat: 3,

                repeatDelay: 0.15,
              },
              `charge+=${i * 0.55}`
            );
          }
        );

        /* =====================================================
           CRITICAL STATE
        ===================================================== */

        tl.addLabel(
          "critical",
          "charge+=3.65"
        );

        /*
         * Counter changes from percentage to
         * system state near completion.
         */

        tl.to(
          counter,
          {
            scale: 1.18,
            duration: 0.18,
            ease: "power2.out",
          },
          "critical"
        );

        tl.to(
          coreGlow,
          {
            attr: {
              r: CORE_RADIUS + 15,
            },
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "critical"
        );

        /*
         * Rapid final pulse.
         */

        tl.to(
          container,
          {
            scale: 1.04,
            duration: 0.12,
            yoyo: true,
            repeat: 3,
            ease: "power2.inOut",
          },
          "critical"
        );

        /* =====================================================
           BREAK / OVERLOAD
        ===================================================== */

        tl.addLabel(
          "break",
          "charge+=4.2"
        );

        /*
         * Hold at full charge briefly.
         */

        tl.to(
          {},
          {
            duration: 0.35,
          },
          "break"
        );

        /*
         * Massive dimensional release.
         */

        tl.to(
          container,
          {
            scale: 3.8,
            opacity: 0,

            duration: 0.48,

            ease: "expo.in",

            onStart() {
              if (coreGlow) {
                gsap.to(
                  coreGlow,
                  {
                    attr: {
                      r: 90,
                    },
                    opacity: 0,
                    duration: 0.35,
                    ease: "power4.out",
                  }
                );
              }
            },
          },
          "break+=0.3"
        );
      },
    }));

    return (
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0"
        style={{
          willChange:
            "transform, opacity",
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full overflow-visible"
        >
          <defs>
            {/* Main green dimensional glow */}
            <filter
              id="vyuham-ring-glow"
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
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

            {/* Core glow */}
            <filter
              id="vyuham-core-glow"
              x="-200%"
              y="-200%"
              width="400%"
              height="400%"
            >
              <feGaussianBlur
                stdDeviation="8"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* =========================================
              ROTATING OUTER SYSTEM
          ========================================= */}

          <g ref={rotatingGroupRef}>
            <g
              ref={tickGroupRef}
              opacity="0"
            >
              {TICKS.map((tick, i) => (
                <line
                  key={`tick-${i}`}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke={
                    tick.isMajor
                      ? "#34d399"
                      : "rgba(16,185,129,0.28)"
                  }
                  strokeWidth={
                    tick.isMajor
                      ? 1.35
                      : 0.45
                  }
                  strokeLinecap="round"
                />
              ))}
            </g>
          </g>

          {/* =========================================
              SECONDARY ROTATING SYSTEM
          ========================================= */}

          <g
            ref={reverseRotatingGroupRef}
          >
            <circle
              cx="100"
              cy="100"
              r="69"
              fill="none"
              stroke="rgba(52,211,153,0.22)"
              strokeWidth="0.7"
              strokeDasharray="2 8 18 5"
            />

            <circle
              cx="100"
              cy="100"
              r="57"
              fill="none"
              stroke="rgba(16,185,129,0.18)"
              strokeWidth="0.6"
              strokeDasharray="12 5 2 6"
            />
          </g>

          {/* =========================================
              CORE ENERGY
          ========================================= */}

          <circle
            ref={coreGlowRef}
            cx="100"
            cy="100"
            r={CORE_RADIUS}
            fill="rgba(16,185,129,0.05)"
            stroke="#10b981"
            strokeWidth="1"
            opacity="0"
            filter="url(#vyuham-core-glow)"
          />

          <circle
            ref={coreRingRef}
            cx="100"
            cy="100"
            r={CORE_RADIUS}
            fill="none"
            stroke="rgba(52,211,153,0.45)"
            strokeWidth="1"
            strokeDasharray="3 6"
            opacity="0"
          />

          {/* =========================================
              INNER COUNTER ROTATING RING
          ========================================= */}

          <circle
            ref={innerRingRef}
            cx="100"
            cy="100"
            r={INNER_RADIUS}
            fill="none"
            stroke="rgba(52,211,153,0.22)"
            strokeWidth="1"
            strokeDasharray="8 4 2 4"
            transform="rotate(90 100 100)"
            opacity="0"
          />

          {/* =========================================
              MAIN TRACK
          ========================================= */}

          <circle
            ref={trackRef}
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="rgba(16,185,129,0.18)"
            strokeWidth="3"
            opacity="0"
          />

          {/* =========================================
              PROGRESS RING
          ========================================= */}

          <circle
            ref={progressRef}
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            strokeDasharray={
              CIRCUMFERENCE
            }
            strokeDashoffset={
              CIRCUMFERENCE
            }
            opacity="0"
            filter="url(#vyuham-ring-glow)"
          />

          {/* =========================================
              ENERGY ARCS
          ========================================= */}

          {[65, 56, 82].map(
            (radius, i) => (
              <circle
                key={`arc-${i}`}
                ref={(el) => {
                  arcRefs.current[i] =
                    el;
                }}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={
                  i === 1
                    ? "#34d399"
                    : "rgba(16,185,129,0.3)"
                }
                strokeWidth={
                  i === 1 ? 1.2 : 0.7
                }
                strokeDasharray={
                  i === 1
                    ? "20 8 4 12"
                    : "8 12"
                }
                opacity="0"
              />
            )
          )}

          {/* =========================================
              SCAN LINE
          ========================================= */}

          <line
            ref={scanLineRef}
            x1="52"
            x2="148"
            y1="35"
            y2="35"
            stroke="#34d399"
            strokeWidth="0.5"
            opacity="0"
          />

          {/* =========================================
              PULSE WAVES
          ========================================= */}

          {[0, 1, 2].map(
            (_, i) => (
              <circle
                key={`pulse-${i}`}
                ref={(el) => {
                  pulseRingRefs.current[i] =
                    el;
                }}
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                opacity="0"
              />
            )
          )}
        </svg>

        {/* =========================================
            SYSTEM READOUT
        ========================================= */}

        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <span
              ref={counterRef}
              className="block font-mono text-2xl font-black tracking-[0.18em] text-[#34d399] [text-shadow:0_0_18px_rgba(16,185,129,0.9)]"
              style={{
                opacity: 0,
              }}
            >
              0%
            </span>

            <span
              ref={counterLabelRef}
              className="mt-1 block font-mono text-[8px] tracking-[0.32em] text-[#34d399]"
              style={{
                opacity: 0,
              }}
            >
              ENERGY LEVEL
            </span>
          </div>
        </div>
      </div>
    );
  }
);

EnergyRing.displayName =
  "EnergyRing";

export default EnergyRing;