"use client";

import {
  motion,
  useInView,
} from "framer-motion";

import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface StreamNode {
  x: number;
  y: number;
  label: string;
  color: string;
  code: string;
}

/*
 * VYUHAM signal streams.
 *
 * Different shades provide hierarchy without
 * breaking the emerald visual language.
 */
const nodes: StreamNode[] = [
  {
    x: 70,
    y: 60,
    label: "Technology",
    code: "TECH",
    color: "#34d399",
  },
  {
    x: 330,
    y: 60,
    label: "Culture",
    code: "CULT",
    color: "#6ee7b7",
  },
  {
    x: 330,
    y: 210,
    label: "Gaming",
    code: "GAME",
    color: "#10b981",
  },
  {
    x: 70,
    y: 210,
    label: "Impact",
    code: "IMPT",
    color: "#a7f3d0",
  },
];

const center = {
  x: 200,
  y: 135,
};

export default function StreamSignalMap() {
  const ref =
    useRef<HTMLDivElement>(null);

  const inView =
    useInView(ref, {
      once: true,
      margin: "-60px",
    });

  const reduceMotion =
    usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      className="scanline-card relative h-full w-full overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 270"
        className="h-auto w-full max-w-115"
        fill="none"
      >
        <defs>
          {/* =================================================
              CORE GLOW
              ================================================= */}

          <filter
            id="stream-core-glow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur
              stdDeviation="4"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* =================================================
              NODE GLOW
              ================================================= */}

          <filter
            id="stream-node-glow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur
              stdDeviation="2.5"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* =================================================
              SIGNAL GRADIENT
              ================================================= */}

          <radialGradient
            id="stream-core-gradient"
            cx="50%"
            cy="50%"
          >
            <stop
              offset="0%"
              stopColor="#d1fae5"
            />

            <stop
              offset="12%"
              stopColor="#6ee7b7"
            />

            <stop
              offset="45%"
              stopColor="#10b981"
            />

            <stop
              offset="100%"
              stopColor="#064e3b"
            />
          </radialGradient>
        </defs>

        {/* =====================================================
            ROUTES
            ===================================================== */}

        {nodes.map(
          (node, i) => {
            const mid = {
              x:
                (center.x +
                  node.x) /
                2,

              y:
                (center.y +
                  node.y) /
                2,
            };

            const route =
              `M ${center.x} ${center.y} ` +
              `Q ${mid.x} ${
                node.y -
                20 *
                  (i % 2)
              } ${node.x} ${node.y}`;

            return (
              <g
                key={`route-${node.code}`}
              >
                {/* -----------------------------------------
                    Soft route glow
                    ----------------------------------------- */}

                {!reduceMotion && (
                  <motion.path
                    d={route}
                    initial={{
                      pathLength: 0,
                      opacity: 0,
                    }}
                    animate={
                      inView
                        ? {
                            pathLength: 1,
                            opacity: 0.16,
                          }
                        : {}
                    }
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      pathLength: {
                        duration: 1.15,
                        ease:
                          "easeInOut",
                        delay:
                          0.3 +
                          i *
                            0.16,
                      },
                      opacity: {
                        duration: 0.4,
                        delay:
                          0.3 +
                          i *
                            0.16,
                      },
                    }}
                    stroke={
                      node.color
                    }
                    strokeWidth={4}
                    strokeLinecap="round"
                    filter="url(#stream-node-glow)"
                  />
                )}

                {/* -----------------------------------------
                    Main route
                    ----------------------------------------- */}

                <motion.path
                  d={route}
                  initial={{
                    pathLength:
                      reduceMotion
                        ? 1
                        : 0,

                    opacity:
                      reduceMotion
                        ? 0.55
                        : 0,
                  }}
                  animate={
                    inView
                      ? {
                          pathLength: 1,
                          opacity: 0.55,
                        }
                      : {
                          pathLength: 0,
                          opacity: 0,
                        }
                  }
                  transition={{
                    pathLength: {
                      duration: 1,
                      ease:
                        "easeInOut",
                      delay:
                        0.3 +
                        i *
                          0.18,
                    },

                    opacity: {
                      duration: 0.3,
                      delay:
                        0.3 +
                        i *
                          0.18,
                    },
                  }}
                  stroke={
                    node.color
                  }
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeDasharray="3 6"
                />

                {/* -----------------------------------------
                    Traveling signal
                    ----------------------------------------- */}

                {!reduceMotion && (
                  <motion.circle
                    r={2.5}
                    fill={
                      node.color
                    }
                    filter="url(#stream-node-glow)"
                    initial={{
                      opacity: 0,
                      cx: center.x,
                      cy: center.y,
                    }}
                    animate={
                      inView
                        ? {
                            opacity: [
                              0,
                              1,
                              0,
                            ],

                            cx: [
                              center.x,
                              node.x,
                              node.x,
                            ],

                            cy: [
                              center.y,
                              node.y,
                              node.y,
                            ],
                          }
                        : {
                            opacity: 0,
                          }
                    }
                    transition={{
                      duration: 2.2,
                      repeat:
                        Infinity,
                      delay:
                        0.7 +
                        i *
                          0.35,
                      times: [
                        0,
                        0.62,
                        1,
                      ],
                      ease:
                        "easeInOut",
                    }}
                  />
                )}
              </g>
            );
          }
        )}

        {/* =====================================================
            CENTER CORE
            ===================================================== */}

        <motion.g
          initial={{
            opacity: 0,
            scale: 0.45,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  scale: 1,
                }
              : {}
          }
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
            delay: 0.15,
          }}
          style={{
            transformOrigin:
              `${center.x}px ${center.y}px`,
          }}
        >
          {/* Outer signal ring */}

          <motion.circle
            cx={center.x}
            cy={center.y}
            r={25}
            fill="none"
            stroke="#10b981"
            strokeWidth={0.7}
            strokeDasharray="2 5"
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: 360,
                  }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              transformOrigin:
                `${center.x}px ${center.y}px`,
            }}
          />

          {/* Core body */}

          <circle
            cx={center.x}
            cy={center.y}
            r={18}
            fill="#071c13"
            stroke="#34d399"
            strokeWidth={1.3}
            filter="url(#stream-core-glow)"
          />

          {/* Inner energy */}

          <motion.circle
            cx={center.x}
            cy={center.y}
            r={5}
            fill="url(#stream-core-gradient)"
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [
                      0.8,
                      1.15,
                      0.8,
                    ],

                    opacity: [
                      0.65,
                      1,
                      0.65,
                    ],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease:
                "easeInOut",
            }}
            style={{
              transformOrigin:
                `${center.x}px ${center.y}px`,
            }}
          />

          {/* Identifier */}

          <text
            x={center.x}
            y={center.y + 3}
            textAnchor="middle"
            fontSize="7"
            fontFamily="DM Mono, monospace"
            fill="#ecfdf5"
            letterSpacing="1.2"
          >
            V·26
          </text>
        </motion.g>

        {/* =====================================================
            STREAM NODES
            ===================================================== */}

        {nodes.map(
          (node, i) => (
            <motion.g
              key={`node-${node.code}`}
              style={{
                transformOrigin:
                  `${node.x}px ${node.y}px`,
              }}
              initial={{
                opacity: 0,
                scale: 0.4,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      scale: 1,
                    }
                  : {}
              }
              transition={{
                delay:
                  0.45 +
                  i * 0.18,

                type: "spring",

                stiffness: 300,

                damping: 20,
              }}
            >
              {/* Node aura */}

              {!reduceMotion && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={11}
                  fill="none"
                  stroke={
                    node.color
                  }
                  strokeWidth={0.6}
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: [
                      0,
                      0.35,
                      0,
                    ],

                    scale: [
                      0.7,
                      1.25,
                      1.25,
                    ],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat:
                      Infinity,
                    delay:
                      0.8 +
                      i *
                        0.2,
                    ease:
                      "easeOut",
                  }}
                  style={{
                    transformOrigin:
                      `${node.x}px ${node.y}px`,
                  }}
                />
              )}

              {/* Node shell */}

              <circle
                cx={node.x}
                cy={node.y}
                r={7}
                fill="#07140d"
                stroke={
                  node.color
                }
                strokeWidth={1.2}
              />

              {/* Node core */}

              <circle
                cx={node.x}
                cy={node.y}
                r={1.8}
                fill={
                  node.color
                }
              />

              {/* Label */}

              <text
                x={node.x}
                y={node.y + 24}
                textAnchor="middle"
                fontSize="8"
                fontFamily="DM Mono, monospace"
                fill={
                  node.color
                }
                letterSpacing="1.4"
              >
                {node.label.toUpperCase()}
              </text>

              {/* Channel code */}

              <text
                x={node.x}
                y={node.y - 13}
                textAnchor="middle"
                fontSize="5.5"
                fontFamily="DM Mono, monospace"
                fill="#6b7280"
                letterSpacing="1"
              >
                {node.code}
              </text>
            </motion.g>
          )
        )}

        {/* =====================================================
            SYSTEM STATUS
            ===================================================== */}

        <text
          x="200"
          y="258"
          textAnchor="middle"
          fontSize="5.5"
          fontFamily="DM Mono, monospace"
          fill="#6b7280"
          letterSpacing="1.8"
        >
          FOUR STREAMS // ONE SIGNAL
        </text>
      </svg>
    </div>
  );
}