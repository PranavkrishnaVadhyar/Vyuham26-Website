"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface SealResolveProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  ring?: boolean;
}

export default function SealResolve({
  children,
  className = "",
  delay = 0,
  ring = false,
}: SealResolveProps) {
  const reduceMotion =
    usePrefersReducedMotion();

  return (
    <div
      className={`relative ${className}`}
    >
      {/* =====================================================
          RESOLUTION RING
          ===================================================== */}

      {ring && (
        <>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-emerald-400/40"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.72,
                  }
            }
            whileInView={
              reduceMotion
                ? undefined
                : {
                    opacity: [0, 0.8, 0],
                    scale: [0.72, 1, 1.16],
                  }
            }
            viewport={{
              once: true,
              margin: "-40px",
            }}
            transition={{
              duration: 0.9,
              delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* Secondary thin ring */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[4%] rounded-full border border-green/15"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.82,
                  }
            }
            whileInView={
              reduceMotion
                ? undefined
                : {
                    opacity: [0, 0.5, 0],
                    scale: [0.82, 1, 1.08],
                  }
            }
            viewport={{
              once: true,
              margin: "-40px",
            }}
            transition={{
              duration: 0.75,
              delay: delay + 0.08,
              ease: "easeOut",
            }}
          />
        </>
      )}

      {/* =====================================================
          CONTENT RESOLUTION
          ===================================================== */}

      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                scale: 1.08,
                y: 6,
                filter: "blur(7px)",
              }
        }
        whileInView={
          reduceMotion
            ? undefined
            : {
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px)",
              }
        }
        viewport={{
          once: true,
          margin: "-40px",
        }}
        transition={{
          duration: 0.7,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          willChange:
            "transform, opacity, filter",
        }}
      >
        {children}
      </motion.div>

      {/* =====================================================
          LOCK FLASH
          ===================================================== */}

      {ring && !reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200"
          initial={{
            opacity: 0,
            scale: 0,
          }}
          whileInView={{
            opacity: [0, 1, 0],
            scale: [0, 1.8, 0],
          }}
          viewport={{
            once: true,
            margin: "-40px",
          }}
          transition={{
            duration: 0.35,
            delay: delay + 0.22,
            ease: "easeOut",
          }}
          style={{
            boxShadow:
              "0 0 18px 6px rgba(52,211,153,0.45)",
          }}
        />
      )}
    </div>
  );
}