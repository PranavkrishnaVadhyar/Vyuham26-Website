"use client";

import { motion, LayoutGroup, type Transition } from "framer-motion";
import { type ReactNode } from "react";

interface RankListProps {
  children: ReactNode;
  className?: string;
}

export default function RankList({ children, className = "" }: RankListProps) {
  return (
    <LayoutGroup>
      <div className={className}>{children}</div>
    </LayoutGroup>
  );
}

interface RankRowProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

export function RankRow({ children, index = 0, className = "" }: RankRowProps) {
  const transition: Transition = {
    delay: index * 0.08,
    type: "spring",
    stiffness: 260,
    damping: 26,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}