"use client";

import { useSyncExternalStore } from "react";
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
  duration = 2.6,
  color = "rgba(200,255,66,0.5)",
  strokeWidth = 1.5,
}: SignalRingProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const reduceMotion = usePrefersReducedMotion();

  if (!mounted || reduceMotion) return null;

  return (
    <span
      className={`pointer-events-none absolute inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: color, borderWidth: strokeWidth }}
          initial={{ opacity: 0.7, scale: 0.25 }}
          animate={{ opacity: 0, scale: 1.55 }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeOut",
            delay: (i / count) * duration * 0.7,
          }}
        />
      ))}
    </span>
  );
}