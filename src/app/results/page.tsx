"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import SignalRing from "@/components/motion/SignalRing";
import { Kicker, Button, StreamBadge } from "@/components/ui/Elements";

export default function ResultsWinnersPage() {
  const reduceMotion = usePrefersReducedMotion();

  const results = [
    {
      event: "National Hackathon",
      stream: "tech",
      first: "CyberVipers (Digital University Kerala)",
      second: "ByteBusters (IIT Madras)",
      third: "NullPointer Squad (NIT Calicut)",
      prize: "₹50,000",
    },
    {
      event: "CTF Warzone",
      stream: "tech",
      first: "QuantumGlitch (CET Trivandrum)",
      second: "CyberVipers (Digital University Kerala)",
      third: "BinaryKnights (CUSAT)",
      prize: "₹40,000",
    },
    {
      event: "Battle of the Bands",
      stream: "culture",
      first: "Echo Horizon",
      second: "Resonance Project",
      third: "Velvet Groove",
      prize: "₹35,000",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="relative flex-1 overflow-hidden bg-[#020504] pt-[92px] text-paper">
        {/* =========================================================
            BACKGROUND SYSTEM
        ========================================================== */}

        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* Main atmospheric glow */}
          <div className="absolute left-1/2 top-[15%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#c8ff42]/[0.035] blur-[140px]" />

          <div className="absolute -left-[180px] top-[45%] h-[420px] w-[420px] rounded-full bg-[#c8ff42]/[0.025] blur-[120px]" />

          <div className="absolute -right-[180px] top-[65%] h-[420px] w-[420px] rounded-full bg-[#c8ff42]/[0.02] blur-[120px]" />

          {/* Technical grid */}
          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(200,255,66,.45) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200,255,66,.45) 1px, transparent 1px)
              `,
              backgroundSize: "64px 64px",
            }}
          />

          {/* Fine grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)
              `,
              backgroundSize: "16px 16px",
            }}
          />

          {/* Scanlines */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,.25) 4px)",
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.68)_100%)]" />
        </div>

        {/* =========================================================
            HERO
        ========================================================== */}

        <section className="relative py-20 md:py-28">
          <div className="mx-auto w-[min(1120px,calc(100%-40px))] md:w-[min(1120px,calc(100%-64px))]">

            <AnimatedSection>
              <div className="relative border-b border-[#c8ff42]/15 pb-8">

                {/* Top telemetry */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff42] shadow-[0_0_10px_#c8ff42]" />
                    VYUHAM'26 // RESULTS NETWORK
                  </div>

                  <div className="flex items-center gap-5">
                    <span>PROTOCOL: VICTORY</span>
                    <span className="hidden sm:inline">STATUS: FINALIZED</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

                  <div className="max-w-3xl">
                    <Kicker>Victory Protocol</Kicker>

                    <motion.h1
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0, y: 22, filter: "blur(8px)" }
                      }
                      animate={
                        reduceMotion
                          ? undefined
                          : { opacity: 1, y: 0, filter: "blur(0px)" }
                      }
                      transition={{ duration: 0.7 }}
                      className="mt-3 font-display text-[42px] font-semibold leading-[0.95] tracking-[-0.04em] md:text-[68px]"
                    >
                      RESULTS
                      <br />
                      <em className="not-italic text-[#c8ff42] [text-shadow:0_0_30px_rgba(200,255,66,.28)]">
                        & WINNERS
                      </em>
                    </motion.h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
                      Official podium placements and prize announcements
                      across all VYUHAM&apos;26 streams.
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Button href="/certificates" variant="primary">
                      Certificate Forge →
                    </Button>
                  </div>
                </div>

                {/* Header data line */}
                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/[0.06] pt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                  <span>EVENTS FINALIZED: 03</span>
                  <span>WINNER RECORDS: 09</span>
                  <span>NETWORK STATUS: STABLE</span>
                  <span className="text-[#c8ff42]/60">
                    ARCHIVE: ONLINE
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                RESULT CARDS
            ====================================================== */}

            <div className="mt-12 space-y-10">
              {results.map((res, idx) => (
                <AnimatedSection
                  key={res.event}
                  delay={0.1 * idx}
                >
                  <motion.div
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 35,
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
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative overflow-hidden rounded border border-white/[0.08] bg-[#07100c]/80 backdrop-blur-xl"
                  >
                    {/* =================================================
                        CARD DECORATION
                    ================================================== */}

                    {/* Green energy sweep */}
                    <motion.div
                      initial={{ x: "-120%" }}
                      whileInView={{ x: "120%" }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.8,
                        delay: 0.2 + idx * 0.15,
                        ease: "easeInOut",
                      }}
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#c8ff42]/[0.035] to-transparent"
                    />

                    {/* Corner markers */}
                    <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-[#c8ff42]/35" />
                    <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-[#c8ff42]/35" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-[#c8ff42]/20" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-[#c8ff42]/20" />

                    {/* Card header */}
                    <div className="relative flex flex-col justify-between gap-5 border-b border-white/[0.07] p-6 md:flex-row md:items-center md:px-8 md:py-7">

                      <div>
                        <div className="mb-3 flex items-center gap-3">
                          <StreamBadge
                            stream={res.stream as "tech" | "culture"}
                          />

                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
                            EVENT // {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <h2 className="font-display text-2xl font-bold tracking-tight text-paper md:text-3xl">
                          {res.event}
                        </h2>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                          TOTAL PRIZE POOL
                        </span>

                        <span className="mt-1 block font-mono text-xl font-bold text-[#c8ff42] [text-shadow:0_0_15px_rgba(200,255,66,.25)]">
                          {res.prize}
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        PODIUM
                    ================================================== */}

                    <div className="relative grid grid-cols-1 gap-4 p-5 md:grid-cols-3 md:p-7">

                      {/* 1ST */}
                      <motion.div
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 34,
                                scale: 0.94,
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
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 18,
                          delay: 0.05,
                        }}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : {
                                y: -5,
                                scale: 1.015,
                              }
                        }
                        className="relative overflow-hidden rounded border border-[#c8ff42]/45 bg-[#c8ff42]/[0.055] p-6 text-center shadow-[0_0_35px_rgba(200,255,66,.08)]"
                      >
                        {/* Podium glow */}
                        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-[#c8ff42]/10 blur-3xl" />

                        <SignalRing
                          className="inset-0 m-auto opacity-70"
                          size={64}
                          count={2}
                          duration={2.6}
                          color="rgba(200,255,66,0.35)"
                        />

                        <div className="relative">
                          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#c8ff42]/40 bg-[#c8ff42]/10 font-mono text-lg">
                            01
                          </div>

                          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#c8ff42]">
                            1ST PLACE
                          </span>

                          <h3 className="mt-3 font-display text-lg font-bold leading-tight text-paper">
                            {res.first}
                          </h3>

                          <div className="mx-auto mt-5 h-px w-16 bg-[#c8ff42]/30" />

                          <span className="mt-4 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                            CHAMPION
                          </span>
                        </div>
                      </motion.div>

                      {/* 2ND */}
                      <motion.div
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 27,
                              }
                        }
                        whileInView={
                          reduceMotion
                            ? undefined
                            : {
                                opacity: 1,
                                y: 0,
                              }
                        }
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 19,
                          delay: 0.16,
                        }}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : {
                                y: -4,
                              }
                        }
                        className="relative rounded border border-white/[0.09] bg-white/[0.025] p-6 text-center"
                      >
                        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] font-mono text-sm text-white/60">
                          02
                        </div>

                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">
                          2ND PLACE
                        </span>

                        <h3 className="mt-3 font-display text-base font-semibold leading-tight text-paper">
                          {res.second}
                        </h3>

                        <div className="mx-auto mt-5 h-px w-12 bg-white/10" />

                        <span className="mt-4 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
                          RUNNER-UP
                        </span>
                      </motion.div>

                      {/* 3RD */}
                      <motion.div
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 21,
                              }
                        }
                        whileInView={
                          reduceMotion
                            ? undefined
                            : {
                                opacity: 1,
                                y: 0,
                              }
                        }
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 20,
                          delay: 0.26,
                        }}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : {
                                y: -3,
                              }
                        }
                        className="relative rounded border border-white/[0.07] bg-white/[0.015] p-6 text-center"
                      >
                        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] font-mono text-sm text-white/40">
                          03
                        </div>

                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                          3RD PLACE
                        </span>

                        <h3 className="mt-3 font-display text-base font-semibold leading-tight text-paper">
                          {res.third}
                        </h3>

                        <div className="mx-auto mt-5 h-px w-12 bg-white/10" />

                        <span className="mt-4 block font-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
                          FINALIST
                        </span>
                      </motion.div>
                    </div>

                    {/* Bottom telemetry */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white/20 md:px-8">
                      <span>
                        RESULT NODE // {String(idx + 1).padStart(2, "0")}
                      </span>

                      <div className="flex items-center gap-4">
                        <span>VERIFIED</span>
                        <span className="h-1 w-1 rounded-full bg-[#c8ff42]/60" />
                        <span>ARCHIVED</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>

            {/* =========================================================
                FINAL NETWORK STATUS
            ========================================================== */}

            <AnimatedSection delay={0.35}>
              <div className="mt-12 overflow-hidden rounded border border-[#c8ff42]/15 bg-[#07100c]/70 p-6 backdrop-blur-xl md:p-8">

                <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c8ff42] opacity-50" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c8ff42]" />
                      </span>

                      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#c8ff42]">
                        Results Archive Online
                      </span>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
                      All podium records have been synchronized with the
                      VYUHAM&apos;26 event archive.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/[0.06] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                        Events
                      </span>
                      <span className="mt-1 block font-mono text-lg font-bold text-paper">
                        03
                      </span>
                    </div>

                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                        Winners
                      </span>
                      <span className="mt-1 block font-mono text-lg font-bold text-paper">
                        09
                      </span>
                    </div>

                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                        Status
                      </span>
                      <span className="mt-1 block font-mono text-lg font-bold text-[#c8ff42]">
                        LIVE
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </AnimatedSection>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}