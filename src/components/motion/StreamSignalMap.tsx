"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface StreamNode {
  x: number;
  y: number;
  label: string;
  color: string;
}

const nodes: StreamNode[] = [
  { x: 70, y: 60, label: "Technology", color: "#c8ff42" },
  { x: 330, y: 60, label: "Culture", color: "#a78bfa" },
  { x: 330, y: 210, label: "Gaming", color: "#22d3ee" },
  { x: 70, y: 210, label: "Impact", color: "#fbbf24" },
];

const center = { x: 200, y: 135 };

export default function StreamSignalMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      className="scanline-card relative h-full w-full"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 270"
        className="h-auto w-full max-w-[460px]"
        fill="none"
      >
        {nodes.map((node, i) => {
          const mid = {
            x: (center.x + node.x) / 2,
            y: (center.y + node.y) / 2,
          };
          return (
            <g key={node.label}>
              <motion.path
                d={`M ${center.x} ${center.y} Q ${mid.x} ${node.y - 20 * (i % 2)} ${node.x} ${node.y}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  inView
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{
                  pathLength: { duration: 1, ease: "easeInOut", delay: 0.3 + i * 0.18 },
                  opacity: { duration: 0.3, delay: 0.3 + i * 0.18 },
                }}
                stroke={reduceMotion ? node.color : node.color}
                strokeOpacity={0.55}
                strokeWidth={1}
                strokeLinecap="round"
                strokeDasharray="4 5"
              />
              <motion.circle
                r={3}
                fill={node.color}
                initial={{ opacity: 0, cx: center.x, cy: center.y }}
                animate={
                  inView
                    ? {
                        opacity: [0, 1, 0],
                        cx: [center.x, node.x],
                        cy: [center.y, node.y],
                      }
                    : { opacity: 0 }
                }
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: 0.6 + i * 0.35,
                  times: [0, 0.55, 1],
                  ease: "easeInOut",
                }}
              />
            </g>
          );
        })}

        {/* Center core */}
        <motion.circle
          cx={center.x}
          cy={center.y}
          r={18}
          fill="#0b2014"
          stroke="#c8ff42"
          strokeWidth={1.5}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <text
          x={center.x}
          y={center.y + 3}
          textAnchor="middle"
          fontSize="8"
          fontFamily="DM Mono, monospace"
          fill="#c8ff42"
          letterSpacing="1"
        >
          V·26
        </text>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.label}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.45 + i * 0.18, type: "spring", stiffness: 300, damping: 18 }}
          >
            <circle cx={node.x} cy={node.y} r={7} fill="#08170f" stroke={node.color} strokeWidth={1.2} />
            <circle cx={node.x} cy={node.y} r={1.8} fill={node.color}>
              <animate
                attributeName="opacity"
                values="1;0.25;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={node.x}
              y={node.y + 24}
              textAnchor="middle"
              fontSize="8"
              fontFamily="DM Mono, monospace"
              fill={node.color}
              letterSpacing="1.5"
            >
              {node.label.toUpperCase()}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}