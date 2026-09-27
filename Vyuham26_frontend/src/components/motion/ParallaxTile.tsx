"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  useRef,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface ParallaxTileProps {
  children: ReactNode;
  className?: string;
  depth?: number;
  delay?: number;
}

export default function ParallaxTile({
  children,
  className = "",
  depth = 18,
  delay = 0,
}: ParallaxTileProps) {
  const ref =
    useRef<HTMLDivElement>(null);

  const reduceMotion =
    usePrefersReducedMotion();

  const { scrollYProgress } =
    useScroll({
      target: ref,
      offset: [
        "start end",
        "end start",
      ],
    });

  /*
   * VYUHAM dimensional movement:
   *
   * Entering viewport
   *       ↓
   *     CENTER
   *       ↓
   * Leaving viewport
   */
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      reduceMotion ? 0 : depth,
      0,
      reduceMotion ? 0 : -depth,
    ]
  );

  /*
   * Very subtle scale change.
   * Prevents the "zooming card" feeling.
   */
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.015, 1, 1.015]
  );

  /*
   * Small opacity modulation gives the tile
   * a system-layer feeling as it enters.
   */
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.5, 0.88, 1],
    [0.45, 1, 1, 1, 0.45]
  );

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={
        reduceMotion
          ? undefined
          : {
              y,
              scale,
              opacity,
              willChange:
                "transform, opacity",
            }
      }
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 20,
              scale: 0.985,
            }
      }
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
              scale: 1,
            }
      }
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}