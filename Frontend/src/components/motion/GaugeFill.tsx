"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface GaugeFillProps {
  percent: number;
  className?: string;
  barClassName?: string;
  duration?: number;
  delay?: number;
  showValue?: boolean;
}

export default function GaugeFill({
  percent,
  className = "",
  barClassName = "",
  duration = 1.2,
  delay = 0,
  showValue = false,
}: GaugeFillProps) {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, {
    once: true,
    margin: "-40px",
  });

  const reduceMotion = usePrefersReducedMotion();

  const safePercent = Math.min(
    100,
    Math.max(0, percent)
  );

  return (
    <div
      ref={ref}
      className={`w-full ${className}`}
    >
      <div className="flex items-center gap-3">
        {/* Telemetry bar */}
        <div className="relative h-2 flex-1 overflow-hidden border border-line bg-ink-mid">
          {/* Background scan marks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0px, transparent 9px, rgba(52,211,153,0.35) 10px)",
            }}
          />

          {/* Fill */}
          <motion.div
            className={`relative h-full origin-left bg-linear-to-r from-emerald-700 via-emerald-500 to-green ${barClassName}`}
            initial={{
              width: "0%",
            }}
            animate={
              inView
                ? {
                    width: `${safePercent}%`,
                  }
                : {
                    width: "0%",
                  }
            }
            transition={{
              duration: reduceMotion ? 0 : duration,
              delay: reduceMotion ? 0 : delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Active energy edge */}
            {!reduceMotion && (
              <motion.span
                className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-green shadow-[0_0_10px_rgba(16,185,129,0.9)]"
                animate={{
                  opacity: [0.45, 1, 0.45],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Optional readout */}
        {showValue && (
          <span className="min-w-10 text-right font-mono text-[9px] tracking-widest text-green">
            {String(Math.round(safePercent)).padStart(3, "0")}%
          </span>
        )}
      </div>

      {/* Tiny telemetry scale */}
      <div className="mt-1 flex justify-between font-mono text-[7px] tracking-[0.16em] text-muted/50">
        <span>00</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}