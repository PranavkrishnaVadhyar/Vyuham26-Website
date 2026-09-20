"use client";

import {
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import { gsap } from "gsap";

/* =========================================================
   VYUHAM CORE SYSTEM
   ========================================================= */

const CORES = [
  {
    id: "vector",
    label: "VECTOR CORE",

    cx: 100,
    cy: 26,
    r: 13,

    color: "#1d4ed8",
    glow: "#60a5fa",

    shape:
      "M 0 -13 L 9 -9 L 13 -1 L 8 10 L 0 13 L -9 9 L -12 -2 Z",

    facets: [
      {
        d: "M 0 -13 L 9 -9 L 0 0 Z",
        fill: "#bfdbfe",
      },
      {
        d: "M 9 -9 L 13 -1 L 0 0 Z",
        fill: "#60a5fa",
      },
      {
        d: "M 13 -1 L 8 10 L 0 0 Z",
        fill: "#2563eb",
      },
      {
        d: "M 8 10 L 0 13 L 0 0 Z",
        fill: "#1d4ed8",
      },
      {
        d: "M 0 13 L -9 9 L 0 0 Z",
        fill: "#1e3a8a",
      },
      {
        d: "M -9 9 L -12 -2 L 0 0 Z",
        fill: "#3b82f6",
      },
      {
        d: "M -12 -2 L 0 -13 L 0 0 Z",
        fill: "#dbeafe",
      },
    ],
  },

  {
    id: "cognition",
    label: "COGNITION CORE",

    cx: 26,
    cy: 100,
    r: 13,

    color: "#7c2d12",
    glow: "#fb7185",

    shape:
      "M -2 -13 L 9 -9 L 13 1 L 7 11 L -4 13 L -11 6 L -12 -5 Z",

    facets: [
      {
        d: "M -2 -13 L 9 -9 L 0 0 Z",
        fill: "#fecdd3",
      },
      {
        d: "M 9 -9 L 13 1 L 0 0 Z",
        fill: "#fb7185",
      },
      {
        d: "M 13 1 L 7 11 L 0 0 Z",
        fill: "#e11d48",
      },
      {
        d: "M 7 11 L -4 13 L 0 0 Z",
        fill: "#be123c",
      },
      {
        d: "M -4 13 L -11 6 L 0 0 Z",
        fill: "#881337",
      },
      {
        d: "M -11 6 L -12 -5 L 0 0 Z",
        fill: "#9f1239",
      },
      {
        d: "M -12 -5 L -2 -13 L 0 0 Z",
        fill: "#fda4af",
      },
    ],
  },

  {
    id: "power",
    label: "POWER CORE",

    cx: 174,
    cy: 100,
    r: 13,

    color: "#6b21a8",
    glow: "#c084fc",

    shape:
      "M 0 -13 L 10 -7 L 13 3 L 6 12 L -6 12 L -13 3 L -9 -9 Z",

    facets: [
      {
        d: "M 0 -13 L 10 -7 L 0 0 Z",
        fill: "#f3e8ff",
      },
      {
        d: "M 10 -7 L 13 3 L 0 0 Z",
        fill: "#d8b4fe",
      },
      {
        d: "M 13 3 L 6 12 L 0 0 Z",
        fill: "#a855f7",
      },
      {
        d: "M 6 12 L -6 12 L 0 0 Z",
        fill: "#7e22ce",
      },
      {
        d: "M -6 12 L -13 3 L 0 0 Z",
        fill: "#581c87",
      },
      {
        d: "M -13 3 L -9 -9 L 0 0 Z",
        fill: "#7e22ce",
      },
      {
        d: "M -9 -9 L 0 -13 L 0 0 Z",
        fill: "#c084fc",
      },
    ],
  },

  {
    id: "reality",
    label: "REALITY CORE",

    cx: 100,
    cy: 174,
    r: 13,

    color: "#92400e",
    glow: "#fbbf24",

    shape:
      "M -3 -13 L 8 -10 L 13 0 L 8 11 L -2 13 L -10 8 L -12 -4 Z",

    facets: [
      {
        d: "M -3 -13 L 8 -10 L 0 0 Z",
        fill: "#fef3c7",
      },
      {
        d: "M 8 -10 L 13 0 L 0 0 Z",
        fill: "#fcd34d",
      },
      {
        d: "M 13 0 L 8 11 L 0 0 Z",
        fill: "#f59e0b",
      },
      {
        d: "M 8 11 L -2 13 L 0 0 Z",
        fill: "#d97706",
      },
      {
        d: "M -2 13 L -10 8 L 0 0 Z",
        fill: "#92400e",
      },
      {
        d: "M -10 8 L -12 -4 L 0 0 Z",
        fill: "#b45309",
      },
      {
        d: "M -12 -4 L -3 -13 L 0 0 Z",
        fill: "#fde68a",
      },
    ],
  },

  {
    id: "temporal",
    label: "TEMPORAL CORE",

    cx: 100,
    cy: 100,
    r: 26,

    color: "#047857",
    glow: "#34d399",

    shape:
      "M 0 -26 L 18 -18 L 26 -3 L 18 19 L 0 26 L -18 19 L -26 -3 L -17 -19 Z",

    facets: [
      {
        d: "M 0 -26 L 18 -18 L 0 0 Z",
        fill: "#ecfdf5",
      },
      {
        d: "M 18 -18 L 26 -3 L 0 0 Z",
        fill: "#a7f3d0",
      },
      {
        d: "M 26 -3 L 18 19 L 0 0 Z",
        fill: "#34d399",
      },
      {
        d: "M 18 19 L 0 26 L 0 0 Z",
        fill: "#10b981",
      },
      {
        d: "M 0 26 L -18 19 L 0 0 Z",
        fill: "#047857",
      },
      {
        d: "M -18 19 L -26 -3 L 0 0 Z",
        fill: "#065f46",
      },
      {
        d: "M -26 -3 L -17 -19 L 0 0 Z",
        fill: "#059669",
      },
      {
        d: "M -17 -19 L 0 -26 L 0 0 Z",
        fill: "#6ee7b7",
      },
    ],
  },
];

/* =========================================================
   ARRIVAL VECTORS
   ========================================================= */

const FLIGHT_ORIGINS = [
  {
    x: 0,
    y: -220,
    rotate: -180,
  },

  {
    x: -220,
    y: 0,
    rotate: 120,
  },

  {
    x: 220,
    y: 0,
    rotate: -120,
  },

  {
    x: 0,
    y: 220,
    rotate: 180,
  },

  {
    x: 0,
    y: -180,
    rotate: -270,
  },
];

/* =========================================================
   ENERGY NETWORK
   ========================================================= */

const BEAMS = [
  { from: 0, to: 4 },
  { from: 1, to: 4 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },

  { from: 0, to: 2 },
  { from: 1, to: 3 },
];

export interface StoneSystemHandle {
  addToTimeline: (
    tl: gsap.core.Timeline
  ) => void;
}

const StoneSystem = forwardRef<
  StoneSystemHandle
>(function StoneSystem(_, ref) {
  const svgRef =
    useRef<SVGSVGElement>(null);

  const coreRefs =
    useRef<(SVGGElement | null)[]>(
      []
    );

  const pulseRefs =
    useRef<(SVGCircleElement | null)[]>(
      []
    );

  const socketRefs =
    useRef<(SVGGElement | null)[]>(
      []
    );

  const beamRefs =
    useRef<(SVGLineElement | null)[]>(
      []
    );

  const trailRefs =
    useRef<(SVGCircleElement | null)[]>(
      []
    );

  const shimmerRefs =
    useRef<(SVGGElement | null)[]>(
      []
    );

  /*
   * =======================================================
   * TIMELINE
   * =======================================================
   */

  useImperativeHandle(
    ref,
    () => ({
      addToTimeline(
        tl: gsap.core.Timeline
      ) {
        const svg =
          svgRef.current;

        if (!svg) return;

        /*
         * ---------------------------------------------------
         * SOCKET INITIALIZATION
         * ---------------------------------------------------
         */

        socketRefs.current.forEach(
          (socket, i) => {
            if (!socket) return;

            const core =
              CORES[i];

            tl.fromTo(
              socket,
              {
                scale: 0,
                opacity: 0,
                rotation: -15,

                transformOrigin:
                  `${core.cx}px ${core.cy}px`,
              },
              {
                scale: 1,
                opacity: 1,
                rotation: 0,

                duration: 0.42,

                ease:
                  "back.out(2.2)",
              },

              i * 0.1
            );
          }
        );

        /*
         * ---------------------------------------------------
         * CORE ARRIVAL
         * ---------------------------------------------------
         */

        CORES.forEach(
          (core, i) => {
            const group =
              coreRefs.current[i];

            const pulse =
              pulseRefs.current[i];

            const trail =
              trailRefs.current[i];

            const shimmer =
              shimmerRefs.current[i];

            if (!group) return;

            const origin =
              FLIGHT_ORIGINS[i];

            const arrival =
              0.5 + i * 0.58;

            /*
             * Flight trail.
             */
            if (trail) {
              tl.fromTo(
                trail,
                {
                  opacity: 0,
                  attr: {
                    r: 2,
                  },
                },
                {
                  opacity: 0.65,
                  attr: {
                    r: 6,
                  },

                  duration: 0.18,

                  ease:
                    "power1.out",
                },

                arrival - 0.08
              );
            }

            /*
             * Core enters the chamber.
             */
            tl.fromTo(
              group,
              {
                x: origin.x,
                y: origin.y,

                rotation:
                  origin.rotate,

                scale:
                  i === 4
                    ? 3
                    : 2.2,

                opacity: 0,

                transformOrigin:
                  `${core.cx}px ${core.cy}px`,
              },
              {
                x: 0,
                y: 0,

                rotation: 0,

                scale: 1,

                opacity: 1,

                duration:
                  i === 4
                    ? 0.82
                    : 0.56,

                ease:
                  "power3.inOut",
              },

              arrival
            );

            /*
             * Trail disappears.
             */
            if (trail) {
              tl.to(
                trail,
                {
                  opacity: 0,
                  attr: {
                    r: 0,
                  },

                  duration: 0.3,
                },
                `>-0.2`
              );
            }

            /*
             * Mechanical impact.
             */
            tl.to(
              group,
              {
                scale: 1.16,

                duration: 0.055,

                ease:
                  "power2.out",

                transformOrigin:
                  `${core.cx}px ${core.cy}px`,
              },
              `>-0.04`
            );

            tl.to(
              group,
              {
                scale: 0.95,

                duration: 0.055,

                ease:
                  "power2.in",

                transformOrigin:
                  `${core.cx}px ${core.cy}px`,
              }
            );

            tl.to(
              group,
              {
                scale: 1,

                duration: 0.18,

                ease:
                  "back.out(2)",

                transformOrigin:
                  `${core.cx}px ${core.cy}px`,
              }
            );

            /*
             * Arrival pulse.
             */
            if (pulse) {
              tl.fromTo(
                pulse,
                {
                  attr: {
                    r: core.r,
                  },

                  opacity: 0.9,

                  strokeWidth: 3,
                },
                {
                  attr: {
                    r:
                      core.r + 30,
                  },

                  opacity: 0,

                  strokeWidth: 0.5,

                  duration: 0.58,

                  ease:
                    "power2.out",
                },
                `>-0.28`
              );
            }

            /*
             * Continuous crystal movement.
             */
            if (shimmer) {
              tl.add(() => {
                gsap.to(
                  shimmer,
                  {
                    rotation: 7,

                    duration: 1.8,

                    ease:
                      "sine.inOut",

                    yoyo: true,

                    repeat: -1,

                    transformOrigin:
                      `${core.cx}px ${core.cy}px`,
                  }
                );
              }, ">-0.15");
            }
          }
        );

        /*
         * ---------------------------------------------------
         * CORES SYNCHRONIZED
         * ---------------------------------------------------
         */

        tl.addLabel(
          "coresComplete"
        );

        /*
         * Energy network activates.
         */
        beamRefs.current.forEach(
          (beam, i) => {
            if (!beam) return;

            tl.fromTo(
              beam,
              {
                strokeDashoffset: 200,
                opacity: 0,
                strokeWidth: 0.5,
              },
              {
                strokeDashoffset: 0,

                opacity: 0.58,

                strokeWidth: 1.35,

                duration: 0.38,

                ease:
                  "power2.out",
              },
              `coresComplete+=${i * 0.06}`
            );

            /*
             * Subtle living signal.
             */
            tl.add(() => {
              gsap.to(
                beam,
                {
                  opacity: 0.25,

                  strokeWidth: 0.75,

                  duration: 0.75,

                  ease:
                    "sine.inOut",

                  yoyo: true,

                  repeat: -1,
                }
              );
            }, ">");
          }
        );

        /*
         * ---------------------------------------------------
         * TEMPORAL CORE ACTIVATION
         * ---------------------------------------------------
         */

        const temporal =
          coreRefs.current[4];

        if (temporal) {
          /*
           * Small activation pulse.
           */
          tl.to(
            temporal,
            {
              scale: 1.12,

              duration: 0.28,

              ease:
                "power2.out",

              transformOrigin:
                "100px 100px",
            },
            "coresComplete+=0.28"
          );

          tl.to(
            temporal,
            {
              scale: 1,

              duration: 0.42,

              ease:
                "elastic.out(1, 0.5)",

              transformOrigin:
                "100px 100px",
            }
          );
        }

        /*
         * Master synchronization label.
         *
         * EnergyRing / CornerStructures
         * can synchronize from this point.
         */
        tl.addLabel(
          "activate"
        );

        /*
         * ---------------------------------------------------
         * CORE SYSTEM CHARGE
         * ---------------------------------------------------
         */

        CORES.forEach(
          (core, i) => {
            const group =
              coreRefs.current[i];

            if (!group) return;

            /*
             * Gradually intensify the
             * individual core.
             */
            tl.to(
              group,
              {
                filter:
                  "brightness(1.25) saturate(1.25)",

                duration: 1.8,

                ease:
                  "power1.in",
              },
              "charge"
            );
          }
        );

        /*
         * ---------------------------------------------------
         * OVERLOAD / RELEASE
         * ---------------------------------------------------
         */

        const EXPLODE_VECTORS = [
          {
            x: 0,
            y: -500,
            rot: -180,
          },

          {
            x: -500,
            y: 0,
            rot: -240,
          },

          {
            x: 500,
            y: 0,
            rot: 240,
          },

          {
            x: 0,
            y: 500,
            rot: 180,
          },

          {
            x: 0,
            y: 0,
            rot: 360,
          },
        ];

        CORES.forEach(
          (core, i) => {
            const group =
              coreRefs.current[i];

            const socket =
              socketRefs.current[i];

            if (!group) return;

            const vector =
              EXPLODE_VECTORS[i];

            /*
             * Temporal core becomes the
             * overload flash.
             */
            if (i === 4) {
              tl.to(
                group,
                {
                  scale: 2.9,

                  opacity: 0,

                  duration: 0.42,

                  ease:
                    "power3.in",

                  transformOrigin:
                    "100px 100px",
                },
                "break+=0.12"
              );
            } else {
              /*
               * Outer cores release from
               * their containment.
               */
              tl.to(
                group,
                {
                  x: vector.x,
                  y: vector.y,

                  rotation:
                    vector.rot,

                  opacity: 0,

                  scale: 0.38,

                  duration: 0.48,

                  ease:
                    "power4.in",

                  transformOrigin:
                    `${core.cx}px ${core.cy}px`,
                },
                "break+=0.12"
              );
            }

            /*
             * Socket releases separately,
             * giving the impression that the
             * containment system has opened.
             */
            if (socket) {
              tl.to(
                socket,
                {
                  scale: 1.55,

                  opacity: 0,

                  duration: 0.35,

                  ease:
                    "power2.in",
                },
                "break+=0.12"
              );
            }
          }
        );
      },
    }),
    []
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      className="h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        {/* ===================================================
            SOCKET BEVEL
            =================================================== */}

        <filter
          id="socket-bevel"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur
            stdDeviation="1.5"
            result="blur"
          />

          <feComposite
            in2="SourceAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
            result="shadowDiff"
          />

          <feFlood
            floodColor="#000000"
            floodOpacity="0.4"
          />

          <feComposite
            in2="shadowDiff"
            operator="in"
          />

          <feComposite
            in2="SourceGraphic"
            operator="over"
          />
        </filter>

        {/* ===================================================
            CORE GLOWS
            =================================================== */}

        {CORES.map((core) => (
          <filter
            key={`glow-${core.id}`}
            id={`core-glow-${core.id}`}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur
              stdDeviation="4.5"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}

        <filter
          id="core-trail-glow"
          x="-200%"
          y="-200%"
          width="500%"
          height="500%"
        >
          <feGaussianBlur
            stdDeviation="8"
          />
        </filter>
      </defs>

      {/* =====================================================
          CONTAINMENT SOCKETS
          ===================================================== */}

      {CORES.map((core, i) => (
        <g
          key={`socket-${core.id}`}
          ref={(el) => {
            socketRefs.current[i] =
              el;
          }}
          style={{
            opacity: 0,
          }}
        >
          <circle
            cx={core.cx}
            cy={core.cy}
            r={core.r + 6}
            fill="url(#socket-bevel)"
          />

          <circle
            cx={core.cx}
            cy={core.cy}
            r={core.r + 3}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="0.5"
            opacity="0.55"
          />

          <circle
            cx={core.cx}
            cy={core.cy}
            r={core.r + 1}
            className="intro-socket-hole"
            filter="url(#socket-bevel)"
          />

          <circle
            cx={core.cx}
            cy={core.cy}
            r={core.r - 2}
            fill="#334155"
            opacity="0.3"
          />
        </g>
      ))}

      {/* =====================================================
          CORE ENERGY NETWORK
          ===================================================== */}

      {BEAMS.map((beam, i) => {
        const from =
          CORES[beam.from];

        const to =
          CORES[beam.to];

        return (
          <line
            key={`beam-${i}`}
            ref={(el) => {
              beamRefs.current[i] =
                el;
            }}
            x1={from.cx}
            y1={from.cy}
            x2={to.cx}
            y2={to.cy}
            stroke={to.glow}
            strokeWidth="1"
            strokeDasharray="4 6"
            strokeDashoffset="200"
            opacity="0"
            style={{
              filter:
                `drop-shadow(0 0 4px ${to.glow})`,
            }}
          />
        );
      })}

      {/* =====================================================
          ARRIVAL TRAILS
          ===================================================== */}

      {CORES.map((core, i) => (
        <circle
          key={`trail-${core.id}`}
          ref={(el) => {
            trailRefs.current[i] =
              el;
          }}
          cx={core.cx}
          cy={core.cy}
          r="0"
          fill={core.glow}
          opacity="0"
          filter="url(#core-trail-glow)"
        />
      ))}

      {/* =====================================================
          CORES
          ===================================================== */}

      {CORES.map((core, i) => (
        <g
          key={`core-${core.id}`}
        >
          {/* Activation pulse */}
          <circle
            ref={(el) => {
              pulseRefs.current[i] =
                el;
            }}
            cx={core.cx}
            cy={core.cy}
            r={core.r}
            fill="none"
            stroke={core.glow}
            strokeWidth="2"
            opacity="0"
          />

          {/* Core body */}
          <g
            ref={(el) => {
              coreRefs.current[i] =
                el;
            }}
            style={{
              opacity: 0,
            }}
            filter={`url(#core-glow-${core.id})`}
          >
            {/* Ambient aura */}
            <circle
              cx={core.cx}
              cy={core.cy}
              r={core.r + 10}
              fill={core.color}
              opacity="0.22"
            />

            <circle
              cx={core.cx}
              cy={core.cy}
              r={core.r + 6}
              fill={core.glow}
              opacity="0.13"
            />

            {/* Rotating facet system */}
            <g
              ref={(el) => {
                shimmerRefs.current[i] =
                  el;
              }}
            >
              <g
                transform={`translate(${core.cx}, ${core.cy})`}
              >
                {/* Dark base */}
                <path
                  d={core.shape}
                  fill="#0f172a"
                  opacity="0.35"
                />

                {/* Facets */}
                {core.facets.map(
                  (
                    facet,
                    fi
                  ) => (
                    <path
                      key={`${core.id}-facet-${fi}`}
                      d={facet.d}
                      fill={
                        facet.fill
                      }
                      stroke="rgba(255,255,255,0.42)"
                      strokeWidth="0.4"
                    />
                  )
                )}

                {/* Internal energy point */}
                <circle
                  cx="0"
                  cy="0"
                  r={
                    core.r *
                    0.34
                  }
                  fill="#ffffff"
                  opacity="0.9"
                  style={{
                    filter:
                      `drop-shadow(0 0 10px ${core.glow})`,
                  }}
                />

                {/* Specular highlight */}
                <path
                  d={
                    core.facets[0]
                      .d
                  }
                  fill="#ffffff"
                  opacity="0.52"
                />

                {core.facets[1] && (
                  <path
                    d={
                      core.facets[1]
                        .d
                    }
                    fill="#ffffff"
                    opacity="0.18"
                  />
                )}
              </g>
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
});

StoneSystem.displayName =
  "StoneSystem";

export default StoneSystem;