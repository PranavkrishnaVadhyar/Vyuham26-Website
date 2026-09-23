"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface RoutePath {
  d: string;
  delay?: number;
}

interface RouteTraceProps {
  paths: RoutePath[];
  className?: string;
  viewBox?: string;
  duration?: number;
  stroke?: string;
  strokeWidth?: number;
  showEndpoints?: boolean;
}

export default function RouteTrace({
  paths,
  className = "",
  viewBox = "0 0 800 500",
  duration = 1.4,
  stroke = "rgba(52,211,153,0.72)",
  strokeWidth = 1.5,
  showEndpoints = false,
}: RouteTraceProps) {
  const reduceMotion =
    usePrefersReducedMotion();

  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        {/* Soft route glow */}
        <filter
          id="route-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
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

        {/* Moving signal gradient */}
        <linearGradient
          id="route-signal"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="0%"
            stopColor="#064e3b"
            stopOpacity="0"
          />

          <stop
            offset="45%"
            stopColor="#10b981"
            stopOpacity="0.35"
          />

          <stop
            offset="50%"
            stopColor="#d1fae5"
            stopOpacity="1"
          />

          <stop
            offset="55%"
            stopColor="#10b981"
            stopOpacity="0.35"
          />

          <stop
            offset="100%"
            stopColor="#064e3b"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {paths.map((path, i) => {
        const delay =
          path.delay ?? 0;

        /*
         * Try to extract the first
         * coordinate from the path.
         *
         * This is only used when
         * showEndpoints is enabled.
         */
        const startMatch =
          path.d.match(
            /M\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/
          );

        const startX =
          startMatch?.[1];

        const startY =
          startMatch?.[2];

        return (
          <g key={`${path.d}-${i}`}>
            {/* =================================================
                BASE ROUTE
                ================================================= */}

            <motion.path
              d={path.d}
              initial={{
                pathLength:
                  reduceMotion ? 1 : 0,
                opacity:
                  reduceMotion ? 0.72 : 0,
              }}
              whileInView={{
                pathLength: 1,
                opacity: 0.72,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                pathLength: {
                  duration,
                  ease: "easeInOut",
                  delay,
                },

                opacity: {
                  duration: 0.35,
                  delay,
                },
              }}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* =================================================
                SECONDARY GLOW
                ================================================= */}

            {!reduceMotion && (
              <motion.path
                d={path.d}
                initial={{
                  pathLength: 0,
                  opacity: 0,
                }}
                whileInView={{
                  pathLength: 1,
                  opacity: 0.18,
                }}
                viewport={{
                  once: true,
                  margin: "-80px",
                }}
                transition={{
                  pathLength: {
                    duration:
                      duration * 1.15,
                    ease: "easeInOut",
                    delay:
                      delay + 0.04,
                  },

                  opacity: {
                    duration: 0.5,
                    delay:
                      delay + 0.04,
                  },
                }}
                stroke="#10b981"
                strokeWidth={
                  strokeWidth * 3
                }
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#route-glow)"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {/* =================================================
                SIGNAL TRAVEL
                ================================================= */}

            {!reduceMotion && (
              <motion.path
                d={path.d}
                pathLength={1}
                stroke="url(#route-signal)"
                strokeWidth={
                  strokeWidth * 1.35
                }
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0.025 0.975"
                initial={{
                  pathOffset: 0,
                  opacity: 0,
                }}
                whileInView={{
                  pathOffset: 1,
                  opacity: [
                    0,
                    0.9,
                    0.9,
                    0,
                  ],
                }}
                viewport={{
                  once: true,
                  margin: "-80px",
                }}
                transition={{
                  pathOffset: {
                    duration:
                      duration * 1.3,
                    ease: "easeInOut",
                    delay:
                      delay +
                      duration * 0.45,
                  },

                  opacity: {
                    duration:
                      duration * 1.3,
                    times: [
                      0,
                      0.15,
                      0.75,
                      1,
                    ],
                    delay:
                      delay +
                      duration * 0.45,
                  },
                }}
                vectorEffect="non-scaling-stroke"
              />
            )}

            {/* =================================================
                START ENDPOINT
                ================================================= */}

            {showEndpoints &&
              startX &&
              startY && (
                <motion.circle
                  cx={startX}
                  cy={startY}
                  r={3.5}
                  fill="#34d399"
                  initial={{
                    opacity:
                      reduceMotion
                        ? 0.75
                        : 0,
                    scale:
                      reduceMotion
                        ? 1
                        : 0.5,
                  }}
                  whileInView={{
                    opacity: 0.9,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    margin: "-80px",
                  }}
                  transition={{
                    duration: 0.35,
                    delay,
                  }}
                  style={{
                    transformOrigin:
                      `${startX}px ${startY}px`,
                  }}
                />
              )}
          </g>
        );
      })}
    </svg>
  );
}