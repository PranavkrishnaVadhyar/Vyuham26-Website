"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  scale?: boolean;
}

const directionOffset = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
};

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  scale = true,
}: AnimatedSectionProps) {
  const offset = directionOffset[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      scale: scale ? 0.985 : 1,
      filter: "blur(8px)",
    },

    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",

      transition: {
        duration: 0.85,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-100px",
      }}
      variants={variants}
      className={className}
      style={{
        willChange: "transform, opacity, filter",
      }}
    >
      {children}
    </motion.div>
  );
}