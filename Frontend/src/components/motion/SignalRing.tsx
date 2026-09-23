"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface SignalRingProps {
  className?: string;
  count?: number;
  size?: number;
  duration?: number;
  color?: string;
  strokeWidth?: number;
}

export default function SignalRing({
  className = "",
  count = 3,
  size = 64,
  duration = 2.8,
  color = "rgba(52,211,153,0.42)",
  strokeWidth = 1.25,
}: SignalRingProps) {
  const reduceMotion =
    usePrefersReducedMotion();

  /*
   * No animated DOM is required when
   * reduced motion is enabled.
   */
  if (reduceMotion) {
    return null;
  }

  return (
    <span
      className={`pointer-events-none absolute inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
      }}
      aria-hidden="true"
    >
      {Array.from({
        length: count,
      }).map((_, i) => {
        const delay =
          (i / count) *
          duration *
          0.72;

        return (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              border: `${strokeWidth}px solid ${color}`,
              boxShadow:
                `0 0 10px ${color}`,
            }}
            initial={{
              opacity: 0,
              scale: 0.18,
            }}
            animate={{
              opacity: [
                0,
                0.7,
                0,
              ],
              scale: [
                0.18,
                0.72,
                1.5,
              ],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatDelay: 0,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
              delay,
            }}
          />
        );
      })}

      {/* Small signal core */}
      <motion.span
        className="absolute rounded-full bg-emerald-300"
        style={{
          width:
            Math.max(
              3,
              size * 0.055
            ),
          height:
            Math.max(
              3,
              size * 0.055
            ),
          boxShadow:
            "0 0 10px 3px rgba(52,211,153,0.35)",
        }}
        animate={{
          opacity: [0.45, 1, 0.45],
          scale: [0.85, 1.15, 0.85],
        }}
        transition={{
          duration:
            duration * 0.65,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </span>
  );
}