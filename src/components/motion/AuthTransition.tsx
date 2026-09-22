"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface AuthTransitionProps {
  active: boolean;
  destination?: string;
  label?: string;
  onComplete?: () => void;
}

export default function AuthTransition({
  active,
  destination,
  label = "AUTHENTICATING IDENTITY",
  onComplete,
}: AuthTransitionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const router = useRouter();

  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }

    if (reduceMotion) {
      const timer = setTimeout(() => {
        if (destination) {
          router.push(destination);
        }

        onComplete?.();
      }, 500);

      return () => clearTimeout(timer);
    }

    const phase1 = setTimeout(() => setPhase(1), 250);
    const phase2 = setTimeout(() => setPhase(2), 800);
    const phase3 = setTimeout(() => setPhase(3), 1400);

    const finish = setTimeout(() => {
      if (destination) {
        router.push(destination);
      }

      onComplete?.();
    }, 2050);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
      clearTimeout(finish);
    };
  }, [
    active,
    destination,
    onComplete,
    reduceMotion,
    router,
  ]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#010302]"
        >
          {/* =====================================================
              ATMOSPHERE
          ===================================================== */}

          <div className="absolute inset-0">

            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green/5 blur-[120px]" />

            <div
              className="absolute inset-0 opacity-[0.045]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(200,255,66,.55) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(200,255,66,.55) 1px, transparent 1px)
                `,
                backgroundSize: "55px 55px",
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,.5) 4px)",
              }}
            />

            {/* horizontal scan */}
            {!reduceMotion && (
              <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green to-transparent shadow-[0_0_20px_rgba(200,255,66,.9)]"
                animate={{
                  top: ["0%", "100%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}
          </div>

          {/* =====================================================
              CENTER SYSTEM
          ===================================================== */}

          <div className="relative flex min-h-screen items-center justify-center px-6">

            <div className="relative w-full max-w-[520px] text-center">

              {/* outer rotating ring */}
              <div className="relative mx-auto h-56 w-56">

                {!reduceMotion && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border border-green/10"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.div
                      className="absolute inset-5 rounded-full border border-dashed border-green/20"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.div
                      className="absolute inset-10 rounded-full border border-green/20"
                      animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  </>
                )}

                {/* core */}
                <motion.div
                  className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-green/50 bg-green/[0.04] shadow-[0_0_60px_rgba(200,255,66,.12)]"
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          scale: [1, 1.06, 1],
                        }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                >
                  <div className="h-12 w-12 rounded-full border border-green/50 bg-green/10 shadow-[0_0_35px_rgba(200,255,66,.3)]" />
                </motion.div>

                {/* crosshair */}
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-green/20 to-transparent" />

                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-green/20 to-transparent" />
              </div>

              {/* =================================================
                  STATUS
              ================================================= */}

              <AnimatePresence mode="wait">

                {phase === 0 && (
                  <motion.div
                    key="phase0"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-green">
                      VYUHAM&apos;26
                    </div>

                    <h2 className="mt-4 font-display text-2xl font-semibold tracking-wide">
                      {label}
                    </h2>

                    <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.25em] text-muted">
                      Establishing secure identity channel
                    </p>
                  </motion.div>
                )}

                {phase === 1 && (
                  <motion.div
                    key="phase1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-green">
                      IDENTITY NETWORK
                    </div>

                    <h2 className="mt-4 font-display text-2xl font-semibold">
                      VERIFYING
                      <span className="text-green"> CREDENTIALS</span>
                    </h2>

                    <div className="mx-auto mt-5 h-px max-w-xs overflow-hidden bg-green/10">
                      <motion.div
                        className="h-full bg-green shadow-[0_0_12px_rgba(200,255,66,.9)]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 0.55,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {phase === 2 && (
                  <motion.div
                    key="phase2"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-green">
                      HANDSHAKE COMPLETE
                    </div>

                    <h2 className="mt-4 font-display text-3xl font-semibold">
                      ACCESS
                      <span className="text-green"> GRANTED</span>
                    </h2>

                    <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-green">
                      <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_10px_rgba(200,255,66,.9)]" />
                      Identity verified
                    </div>
                  </motion.div>
                )}

                {phase === 3 && (
                  <motion.div
                    key="phase3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-green">
                      VYUHAM&apos;26 NETWORK
                    </div>

                    <h2 className="mt-4 font-display text-3xl font-semibold">
                      ENTERING
                      <span className="text-green"> SYSTEM</span>
                    </h2>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* =================================================
                  TELEMETRY
              ================================================= */}

              <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-px border border-green/10 bg-green/10">

                {[
                  ["AUTH", phase >= 1 ? "OK" : "..."],
                  ["CORE", phase >= 2 ? "OK" : "..."],
                  ["ACCESS", phase >= 3 ? "OK" : "..."],
                ].map(([name, value]) => (
                  <div
                    key={name}
                    className="bg-[#030604] px-3 py-3"
                  >
                    <div className="font-mono text-[7px] text-muted">
                      {name}
                    </div>

                    <div
                      className={`mt-1 font-mono text-[9px] ${
                        value === "OK"
                          ? "text-green"
                          : "text-muted"
                      }`}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 font-mono text-[7px] uppercase tracking-[0.3em] text-white/20">
                THE FUTURE AWAITS
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
