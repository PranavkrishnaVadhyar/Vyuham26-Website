"use client";

import {
  motion,
  LayoutGroup,
  type Transition,
} from "framer-motion";

import {
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface RankListProps {
  children: ReactNode;
  className?: string;
}

export default function RankList({
  children,
  className = "",
}: RankListProps) {
  return (
    <LayoutGroup>
      <div
        className={`relative ${className}`}
      >
        {children}
      </div>
    </LayoutGroup>
  );
}

interface RankRowProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

export function RankRow({
  children,
  index = 0,
  className = "",
}: RankRowProps) {
  const reduceMotion =
    usePrefersReducedMotion();

  const transition: Transition = {
    delay: Math.min(
      index * 0.065,
      0.45
    ),

    duration: 0.65,

    ease: [
      0.16,
      1,
      0.3,
      1,
    ],
  };

  return (
    <motion.div
      layout
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              x: -24,
              scale: 0.985,
              filter:
                "blur(5px)",
            }
      }
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              x: 0,
              scale: 1,
              filter:
                "blur(0px)",
            }
      }
      viewport={{
        once: true,
        margin: "-60px",
      }}
      transition={transition}
      className={`group relative ${className}`}
      style={{
        willChange:
          "transform, opacity, filter",
      }}
    >
      {/* Signal sweep */}
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          initial={{
            scaleX: 0,
            opacity: 0,
          }}
          whileInView={{
            scaleX: [0, 1, 1],
            opacity: [0, 0.6, 0],
          }}
          viewport={{
            once: true,
            margin: "-60px",
          }}
          transition={{
            delay:
              Math.min(
                index * 0.065,
                0.45
              ) + 0.18,
            duration: 0.7,
            ease: "easeOut",
          }}
          className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-linear-to-r from-transparent via-green/60 to-transparent"
        />
      )}

      {children}
    </motion.div>
  );
}