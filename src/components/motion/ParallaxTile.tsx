"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
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
  depth = 22,
  delay = 0,
}: ParallaxTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [depth, 0, -depth]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduceMotion ? undefined : { y }}
      initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}