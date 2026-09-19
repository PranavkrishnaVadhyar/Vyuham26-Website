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
}

export default function GaugeFill({
  percent,
  className = "",
  barClassName = "",
  duration = 1.2,
  delay = 0,
}: GaugeFillProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      className={`w-full rounded-full bg-ink-mid p-0.5 border border-line ${className}`}
    >
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r from-amber-500 to-green transition-all duration-1000 ${barClassName}`}
        initial={false}
        animate={
          inView
            ? { width: reduceMotion ? `${percent}%` : `${percent}%` }
            : { width: "0%" }
        }
        transition={{ duration: reduceMotion ? 0 : duration, delay }}
      />
    </div>
  );
}