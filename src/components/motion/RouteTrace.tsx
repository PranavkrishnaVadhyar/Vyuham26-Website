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
  stroke = "rgba(200,255,66,0.7)",
  strokeWidth = 1.5,
  showEndpoints = false,
}: RouteTraceProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
    >
      {paths.map((path, i) => (
        <g key={i}>
          {showEndpoints && (
            <>
              <circle
                cx={path.d.match(/M\s*([\d.]+)[,\s]+([\d.]+)/)?.[1]}
                cy={path.d.match(/M\s*([\d.]+)[,\s]+([\d.]+)/)?.[2]}
                r={3.5}
                fill={stroke}
                opacity={0.9}
              />
              <circle
                cx={path.d.match(/L?\s*([\d.]+)[,\s]+([\d.]+)\s*$/)?.[1]}
                cy={path.d.match(/L?\s*([\d.]+)[,\s]+([\d.]+)\s*$/)?.[2]}
                r={3.5}
                fill={stroke}
                opacity={0.9}
              />
            </>
          )}
          <motion.path
            d={path.d}
            initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0 }}
            whileInView={{
              pathLength: 1,
              opacity: 1,
            }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              pathLength: { duration, ease: "easeInOut", delay: path.delay ?? 0 },
              opacity: { duration: 0.4, delay: path.delay ?? 0 },
            }}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </svg>
  );
}