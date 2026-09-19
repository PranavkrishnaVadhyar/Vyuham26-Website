"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const RING_RADIUS = 47;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const DURATION = 2400;

export default function ChronometerLoader() {
  const reduceMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setProgress(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <motion.section
        className="fixed inset-0 z-[100] grid place-items-center bg-ink"
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
      >
<Image
            src="/logo.png"
            alt="Vyuham '26"
            width={96}
            height={96}
            priority
            loading="eager"
            fetchPriority="high"
            className="h-24 w-24 object-contain"
          />
      </motion.section>
    );
  }

  return (
    <motion.section
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink"
      style={{
        background:
          "radial-gradient(circle at center, rgba(200,255,66,0.07), transparent 70%)",
      }}
      aria-label="Vyuham 26 system check"
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      <div className="intro-grid pointer-events-none absolute inset-0" />

      <div className="relative flex flex-col items-center gap-7">
        <div className="relative flex h-48 w-48 items-center justify-center">
          {/* Concentric spinner rings */}
          <motion.span
            className="absolute inset-0 rounded-full border border-green/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.span
            className="absolute inset-[20%] rounded-full border-t border-r border-green/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.span
            className="absolute inset-[40%] rounded-full border-b border-l border-green/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />

          {/* Circular progress ring */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              strokeWidth="1"
              fill="none"
              className="stroke-green/15"
            />
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="stroke-green transition-[stroke-dashoffset] duration-200 ease-linear [filter:drop-shadow(0_0_6px_rgba(200,255,66,0.7))]"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress / 100)}
            />
          </svg>

          {/* Center logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Image
              src="/logo.png"
              alt="Vyuham '26 emblem"
              width={88}
              height={88}
              priority
              loading="eager"
              fetchPriority="high"
              className="h-22 w-22 object-contain drop-shadow-[0_0_20px_rgba(200,255,66,0.5)]"
            />
          </motion.div>
        </div>

        <div className="text-center">
          <p className="font-display text-xl tracking-[-0.04em] text-paper">
            VYUHAM<span className="text-green">&apos;26</span>
          </p>
          <p className="mt-2 font-mono text-[9px] tracking-[0.22em] text-green tabular-nums">
            SYSTEM CHECK — {String(progress).padStart(3, "0")}%
          </p>
        </div>
      </div>
    </motion.section>
  );
}