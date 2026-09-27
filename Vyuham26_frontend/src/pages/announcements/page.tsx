"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";

export default function AnnouncementsFeedPage() {
  const reduceMotion = usePrefersReducedMotion();

  const notices = [
    {
      id: "01",
      priority: "HIGH PRIORITY",
      title: "CTF WARZONE // ROUND 02",
      subtitle: "OPENING SHIFT DETECTED",
      time: "10 MIN AGO",
      stream: "TECH",
      content:
        "All registered CTF teams are requested to report to the Cyber Range by 11:15 AM for network credential allocation.",
      accent: "green",
    },
    {
      id: "02",
      priority: "SYSTEM UPDATE",
      title: "TRANSPORT GRID // ACTIVE",
      subtitle: "SHUTTLE NETWORK ONLINE",
      time: "01 HR AGO",
      stream: "GENERAL",
      content:
        "Shuttle units are operating every 15 minutes between the DUK Main Academic Block and Technocity Food Court.",
      accent: "cyan",
    },
    {
      id: "03",
      priority: "LIVE SIGNAL",
      title: "BATTLE OF THE BANDS",
      subtitle: "SOUND CHECK WINDOW OPEN",
      time: "02 HRS AGO",
      stream: "CULTURE",
      content:
        "Stage A sound checks begin at 03:00 PM. Team leads are requested to bring their stage technical riders.",
      accent: "purple",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex-1 overflow-hidden bg-[#030705] pt-23 text-paper">
        {/* =========================================================
            AMBIENT FUTURE GRID
        ========================================================= */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Radial glow */}
          <div className="absolute left-1/2 top-[15%] h-125 w-175 -translate-x-1/2 rounded-full bg-green/5 blur-[140px]" />

          {/* Horizontal scan */}
          {!reduceMotion && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-green/30 to-transparent"
              animate={{
                top: ["5%", "95%", "5%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(100,255,170,.7) 1px, transparent 1px),
                linear-gradient(90deg, rgba(100,255,170,.7) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* =========================================================
            MAIN
        ========================================================= */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto w-[min(1100px,calc(100%-40px))]">

            {/* =====================================================
                HEADER
            ===================================================== */}
            <AnimatedSection>
              <div className="relative overflow-hidden border border-white/10 bg-black/30 p-6 backdrop-blur-xl md:p-8">

                {/* top signal line */}
                <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-green/70 to-transparent" />

                {/* corner decorations */}
                <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-green/50" />
                <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-green/50" />
                <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-green/30" />
                <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-green/30" />

                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

                  {/* TITLE */}
                  <div>
                    <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-green/70">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
                      VYUHAM'26 // COMMUNICATION NETWORK
                    </div>

                    <Kicker>Future Signal Network</Kicker>

                    <h1 className="mt-3 font-display text-[40px] font-semibold leading-[0.9] tracking-tight md:text-[64px]">
                      ANNOUNCEMENTS
                      <br />
                      <span className="text-green">
                        <em>FEED</em>
                      </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                      Real-time transmissions from the VYUHAM'26 network.
                      Schedule changes, live updates and critical festival
                      signals appear here.
                    </p>
                  </div>

                  {/* SIGNAL STATUS */}
                  <div className="relative min-w-47.5 border border-green/20 bg-green/3 p-4 font-mono">

                    <div className="mb-4 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-muted">
                      <span>Network</span>
                      <span>V26</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex h-8 w-8 items-center justify-center">
                        {!reduceMotion && (
                          <motion.div
                            className="absolute inset-0 rounded-full border border-green/40"
                            animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                            }}
                          />
                        )}

                        <span className="h-2.5 w-2.5 rounded-full bg-green shadow-[0_0_18px_rgba(80,255,150,.9)]" />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-green">
                          SIGNAL ONLINE
                        </div>
                        <div className="mt-1 text-[9px] text-muted">
                          FUTURE LINK ACTIVE
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 h-px bg-green/10" />

                    <div className="mt-3 flex justify-between text-[9px] text-muted">
                      <span>LATENCY</span>
                      <span className="text-green">08ms</span>
                    </div>
                  </div>
                </div>

                {/* FUTURE AWAITS */}
                <div className="mt-8 border-t border-white/5 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] tracking-[0.4em] text-muted">
                      CORE MESSAGE
                    </span>

                    <span className="h-px flex-1 bg-linear-to-r from-green/30 to-transparent" />

                    <span className="font-mono text-[9px] tracking-[0.3em] text-green">
                      THE FUTURE AWAITS
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                LIVE TRANSMISSION BAR
            ===================================================== */}
            <AnimatedSection delay={0.1}>
              <div className="mt-6 flex items-center gap-3 border-y border-green/10 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
                <span className="text-green">LIVE</span>

                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((bar) => (
                    <motion.span
                      key={bar}
                      className="h-3 w-px bg-green/70"
                      animate={
                        reduceMotion
                          ? {}
                          : {
                              scaleY: [0.3, 1, 0.5, 0.8, 0.3],
                            }
                      }
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: bar * 0.12,
                      }}
                    />
                  ))}
                </div>

                <span>Receiving future transmissions...</span>

                <span className="ml-auto hidden md:block">
                  CHANNEL // 01
                </span>
              </div>
            </AnimatedSection>

            {/* =====================================================
                BROADCAST CARDS
            ===================================================== */}
            <div className="mt-8 space-y-5">
              {notices.map((notice, idx) => (
                <AnimatedSection
                  key={notice.id}
                  delay={0.15 + idx * 0.08}
                >
                  <motion.div
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 30,
                            scale: 0.98,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: reduceMotion ? 0 : idx * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={
                      reduceMotion
                        ? {}
                        : {
                            y: -4,
                          }
                    }
                    className="group relative overflow-hidden"
                  >
                    {/* Energy line */}
                    <div
                      className={`absolute left-0 top-0 h-full w-0.5 ${
                        notice.accent === "green"
                          ? "bg-green shadow-[0_0_18px_rgba(80,255,150,.8)]"
                          : notice.accent === "cyan"
                          ? "bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.8)]"
                          : "bg-purple-400 shadow-[0_0_18px_rgba(192,132,252,.8)]"
                      }`}
                    />

                    {/* Card */}
                    <div className="relative border border-white/10 bg-[#07100c]/80 p-6 backdrop-blur-xl transition-all duration-500 group-hover:border-green/30 md:p-7">

                      {/* Hover glow */}
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-green/4 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Scan line */}
                      {!reduceMotion && (
                        <motion.div
                          className="pointer-events-none absolute left-0 right-0 h-px bg-green/10"
                          animate={{
                            top: ["0%", "100%"],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                            delay: idx * 0.5,
                          }}
                        />
                      )}

                      {/* TOP META */}
                      <div className="relative flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">

                        <div className="flex items-center gap-3">

                          <span className="text-muted">
                            NODE_{notice.id}
                          </span>

                          <span className="h-3 w-px bg-white/10" />

                          <span
                            className={
                              notice.accent === "green"
                                ? "text-green"
                                : notice.accent === "cyan"
                                ? "text-cyan-400"
                                : "text-purple-400"
                            }
                          >
                            {notice.stream}
                          </span>
                        </div>

                        <span className="text-muted">
                          {notice.time}
                        </span>
                      </div>

                      {/* MAIN */}
                      <div className="relative mt-5 md:flex md:items-start md:justify-between md:gap-10">

                        <div className="flex-1">

                          <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.18em]">
                            <span className="relative flex h-2 w-2">
                              {!reduceMotion && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-50" />
                              )}
                              <span className="relative h-2 w-2 rounded-full bg-green" />
                            </span>

                            <span
                              className={
                                notice.accent === "green"
                                  ? "text-green"
                                  : notice.accent === "cyan"
                                  ? "text-cyan-400"
                                  : "text-purple-400"
                              }
                            >
                              {notice.priority}
                            </span>
                          </div>

                          <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-tight tracking-tight text-paper md:text-3xl">
                            {notice.title}
                          </h3>

                          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                            {notice.subtitle}
                          </div>

                          <p className="mt-5 max-w-3xl font-mono text-xs leading-7 text-muted">
                            <span className="mr-2 text-green/60">
                              &gt;&gt;
                            </span>
                            {notice.content}
                          </p>
                        </div>

                        {/* NODE NUMBER */}
                        <div className="mt-6 hidden select-none md:block">
                          <div className="font-display text-6xl font-bold leading-none text-white/[0.035]">
                            {notice.id}
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM DATA */}
                      <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">

                        <span>
                          Transmission verified
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-green" />
                          <span>SECURE CHANNEL</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>

            {/* =====================================================
                END SIGNAL
            ===================================================== */}
            <AnimatedSection delay={0.4}>
              <div className="mt-12 flex flex-col items-center text-center">

                <div className="flex items-center gap-3">
                  <span className="h-px w-16 bg-linear-to-r from-transparent to-green/40" />

                  <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-green/60">
                    END OF CURRENT TRANSMISSIONS
                  </span>

                  <span className="h-px w-16 bg-linear-to-l from-transparent to-green/40" />
                </div>

                <motion.div
                  className="mt-5 font-display text-xl uppercase tracking-[0.25em] text-white/20 md:text-2xl"
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          opacity: [0.2, 0.45, 0.2],
                        }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  THE FUTURE AWAITS
                </motion.div>

                <div className="mt-3 font-mono text-[8px] tracking-[0.3em] text-muted">
                  VYUHAM'26 // SIGNAL NETWORK
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