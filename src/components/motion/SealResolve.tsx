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
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className={`relative ${className}`}>
      {ring && (
        <span className="signal-ring-anim pointer-events-none absolute inset-0 rounded-full border border-green/40" />
      )}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 1.3 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 320, damping: 22, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}