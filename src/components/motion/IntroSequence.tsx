"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import ChronometerLoader from "@/components/motion/ChronometerLoader";

const messages = [
  "SYSTEM // STANDBY",
  "SIGNAL DETECTED",
  "DIMENSIONAL BREACH",
  "ENERGY LEVEL // RISING",
  "PROTOCOL // VYUHAM 26",
];

export default function IntroSequence() {
  const reduceMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"loader" | "breach">("loader");
  const [dismissed, setDismissed] = useState(false);
  const shouldPlay = useSyncExternalStore(
    () => () => {},
    () => !sessionStorage.getItem("vyuham-intro-seen"),
    () => false
  );

  const visible = shouldPlay && !dismissed && !reduceMotion;

  const dismiss = () => {
    sessionStorage.setItem("vyuham-intro-seen", "true");
    setDismissed(true);
  };

  useEffect(() => {
    if (!visible) return;
    if (phase === "loader") {
      const next = window.setTimeout(() => setPhase("breach"), 2600);
      return () => window.clearTimeout(next);
    }
    const complete = window.setTimeout(dismiss, 5900);
    return () => window.clearTimeout(complete);
  }, [visible, phase]);

  return (
    <AnimatePresence>
      {visible && phase === "loader" && <ChronometerLoader key="chronometer" />}

      {visible && phase === "breach" && (
        <motion.section
          key="breach"
          className="intro-sequence fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink"
          aria-label="Vyuham 26 opening sequence"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeInOut" } }}
        >
          <motion.button
            type="button"
            onClick={dismiss}
            className="absolute top-6 right-6 z-20 font-mono text-[10px] tracking-[0.16em] text-paper/70 transition hover:text-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            SKIP INTRO ↗
          </motion.button>

          <div className="intro-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <motion.div
            className="intro-flash pointer-events-none absolute inset-0 bg-green"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0, 0.66, 0] }}
            transition={{ duration: 5.9, times: [0, 0.58, 0.68, 0.74, 0.84] }}
          />

          <div className="relative z-10 grid place-items-center text-center">
            <motion.p
              className="absolute -top-28 font-mono text-[10px] tracking-[0.17em] text-green"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.2, delay: 0.15, times: [0, 0.2, 0.75, 1] }}
            >
              {messages[0]}
            </motion.p>

            <motion.div
              className="intro-core relative grid h-10 w-10 place-items-center rounded-full bg-green"
              initial={{ opacity: 0, scale: 0.05 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.05, 1, 4.8, 7] }}
              transition={{ duration: 4.6, delay: 0.5, times: [0, 0.13, 0.72, 1], ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="h-2 w-2 rounded-full bg-paper" />
              {[0, 1, 2].map((ring) => (
                <motion.span
                  key={ring}
                  className="absolute inset-0 rounded-full border border-green"
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ opacity: [0, 0.75, 0], scale: [0.2, 4.5 + ring * 1.1, 6 + ring] }}
                  transition={{ duration: 1.35, delay: 1.0 + ring * 0.24, ease: "easeOut" }}
                />
              ))}
            </motion.div>

            <motion.div
              className="absolute grid place-items-center"
              initial={{ opacity: 0, scale: 0.25, rotate: -25 }}
              animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.25, 0.25, 1, 1.15, 3.2], rotate: [-25, -25, 0, 0, 0] }}
              transition={{ duration: 3.05, delay: 2.15, times: [0, 0.22, 0.5, 0.75, 1], ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="intro-emblem-shell grid h-32 w-32 place-items-center rounded-full md:h-40 md:w-40">
                <Image
                  src="/logo.png"
                  alt="Vyuham logo"
                  width={128}
                  height={128}
                  priority
                  loading="eager"
                  fetchPriority="high"
                  className="intro-emblem h-24 w-24 object-contain md:h-32 md:w-32"
                />
              </div>
            </motion.div>

            <motion.div
              className="absolute top-28 w-[min(90vw,520px)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: [0, 0, 1, 1, 0], y: [16, 16, 0, 0, -8] }}
              transition={{ duration: 2.2, delay: 3.75, times: [0, 0.15, 0.35, 0.78, 1] }}
            >
              <h1 className="intro-wordmark font-display text-[clamp(48px,10vw,112px)] leading-none tracking-[-0.09em] text-paper">
                VYUHAM<span className="text-green">&apos;26</span>
              </h1>
              <p className="mt-3 font-mono text-[10px] tracking-[0.3em] text-green">TECH FEST 2026</p>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 z-10 w-[min(88vw,560px)] -translate-x-1/2 font-mono text-[9px] tracking-[0.14em] text-muted" aria-live="polite">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.p
                  key={message}
                  className="absolute inset-x-0 text-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: index === 0 ? [1, 0] : [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: index === 0 ? 0.95 : 1.15, delay: index === 0 ? 0 : 0.6 + index * 0.72, times: [0, 0.18, 0.7, 1] }}
                >
                  {message}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
