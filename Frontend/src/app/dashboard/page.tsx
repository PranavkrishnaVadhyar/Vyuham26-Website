"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button, StreamBadge } from "@/components/ui/Elements";

export default function DashboardPage() {
  const reduceMotion = usePrefersReducedMotion();

  const [activeTab, setActiveTab] = useState<
    "events" | "squads" | "schedule"
  >("events");

  const stats = [
    {
      node: "01",
      label: "REGISTRATIONS",
      value: "03",
      detail: "ALL CONFIRMED",
      status: "green",
    },
    {
      node: "02",
      label: "SQUADS JOINED",
      value: "02",
      detail: "CYBERVIPERS // LEADER",
      status: "cyan",
    },
    {
      node: "03",
      label: "PASS STATUS",
      value: "ACTIVE",
      detail: "VERIFIED // 30 OCT 2026",
      status: "green",
    },
    {
      node: "04",
      label: "FOOD CREDITS",
      value: "₹450",
      detail: "WALLET BALANCE",
      status: "amber",
    },
  ];

  const events = [
    {
      stream: "tech" as const,
      title: "National Hackathon",
      venue: "Main Lab 01",
      time: "DAY 1 // 10:00 AM",
      href: "/hackathon",
      action: "ENTER BUILD ZONE",
    },
    {
      stream: "tech" as const,
      title: "CTF Warzone",
      venue: "Cyber Range",
      time: "DAY 2 // 11:30 AM",
      href: "/ctf",
      action: "ENTER CTF PORTAL",
    },
    {
      stream: "culture" as const,
      title: "Battle of the Bands",
      venue: "Open Amphitheatre",
      time: "DAY 2 // 06:00 PM",
      href: "/events/battle-of-the-bands",
      action: "VIEW DOSSIER",
    },
  ];

  const timeline = [
    {
      date: "30 OCT",
      time: "10:00 AM",
      title: "National Hackathon",
      description: "Day 1 kickoff",
    },
    {
      date: "31 OCT",
      time: "11:30 AM",
      title: "CTF Warzone",
      description: "Qualification round",
    },
    {
      date: "31 OCT",
      time: "06:00 PM",
      title: "Battle of the Bands",
      description: "Main stage",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen flex-1 overflow-hidden bg-[#030705] pt-23 text-paper">

        {/* ============================================================
            FUTURE ENVIRONMENT
        ============================================================ */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

          {/* Main atmospheric core */}
          <div className="absolute left-1/2 top-[3%] h-175 w-225 -translate-x-1/2 rounded-full bg-green/4.5 blur-[160px]" />

          {/* Secondary glow */}
          <div className="absolute right-[-15%] top-[45%] h-137.5 w-137.5 rounded-full bg-cyan-400/[0.018] blur-[140px]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(80,255,150,.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(80,255,150,.8) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />

          {/* Scan beam */}
          {!reduceMotion && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-green/30 to-transparent"
              animate={{
                top: ["0%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}

          {/* Vertical system rails */}
          {!reduceMotion && (
            <>
              <motion.div
                className="absolute left-[8%] top-0 h-full w-px bg-linear-to-b from-transparent via-green/10 to-transparent"
                animate={{ opacity: [0.2, 0.7, 0.2] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              />

              <motion.div
                className="absolute right-[8%] top-0 h-full w-px bg-linear-to-b from-transparent via-green/10 to-transparent"
                animate={{ opacity: [0.7, 0.2, 0.7] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                }}
              />
            </>
          )}
        </div>

        <section className="relative py-20 md:py-28">

          <div className="mx-auto w-[min(1200px,calc(100%-40px))] md:w-[min(1200px,calc(100%-64px))]">

            {/* ========================================================
                COMMAND HEADER
            ======================================================== */}
            <AnimatedSection>
              <div className="relative overflow-hidden border border-white/10 bg-black/30 p-6 backdrop-blur-xl md:p-8">

                {/* Corner brackets */}
                <div className="absolute left-0 top-0 h-10 w-10 border-l border-t border-green/50" />
                <div className="absolute right-0 top-0 h-10 w-10 border-r border-t border-green/50" />
                <div className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-green/30" />
                <div className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-green/30" />

                {/* Energy line */}
                <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-green/70 to-transparent" />

                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

                  {/* TITLE */}
                  <div>

                    <div className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.35em] text-green/70">

                      <span className="relative flex h-2 w-2">
                        {!reduceMotion && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-50" />
                        )}

                        <span className="relative h-2 w-2 rounded-full bg-green" />
                      </span>

                      VYUHAM&apos;26 // OPERATIVE NETWORK
                    </div>

                    <Kicker>Personal Command Deck</Kicker>

                    <h1 className="mt-4 font-display text-[clamp(42px,6vw,70px)] font-semibold leading-[0.88] tracking-tight">
                      MY
                      <br />
                      <span className="text-green">
                        <em>DASHBOARD</em>
                      </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
                      Your personal VYUHAM&apos;26 command interface.
                      Monitor registrations, squad activity, event access,
                      and your festival timeline.
                    </p>
                  </div>

                  {/* OPERATIVE */}
                  <div className="w-full max-w-77.5">

                    <div className="border border-green/20 bg-green/2.5 p-5">

                      <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.25em] text-muted">
                        <span>OPERATIVE</span>
                        <span className="text-green">
                          ONLINE
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-4">

                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-green/30 bg-green/4">

                          {!reduceMotion && (
                            <motion.div
                              className="absolute inset-0 rounded-full border border-green/20"
                              animate={{
                                scale: [1, 1.25],
                                opacity: [0.7, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                            />
                          )}

                          <span className="font-mono text-xs text-green">
                            AV
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-paper">
                            Aromal S S
                          </div>

                          <div className="mt-1 truncate font-mono text-[8px] tracking-[0.15em] text-muted">
                            VYU26-OPER-8042
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 h-px bg-white/5" />

                      <div className="mt-4 flex justify-between font-mono text-[8px] uppercase tracking-[0.18em]">
                        <span className="text-muted">
                          ACCESS LEVEL
                        </span>

                        <span className="text-green">
                          OPERATIVE
                        </span>
                      </div>
                    </div>

                    <Button
                      href="/ticket"
                      variant="primary"
                      className="mt-3 w-full justify-center"
                    >
                      QR Ticket Pass ↗
                    </Button>
                  </div>
                </div>

                {/* CORE MESSAGE */}
                <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-5">

                  <span className="font-mono text-[8px] tracking-[0.3em] text-muted">
                    SYSTEM MESSAGE
                  </span>

                  <span className="h-px flex-1 bg-linear-to-r from-green/30 to-transparent" />

                  <span className="font-mono text-[8px] tracking-[0.3em] text-green">
                    THE FUTURE AWAITS
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                LIVE NETWORK BAR
            ======================================================== */}
            <AnimatedSection delay={0.08}>
              <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-green/10 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">

                <span className="flex items-center gap-2 text-green">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
                  COMMAND LINK ACTIVE
                </span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span>
                  03 EVENTS REGISTERED
                </span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span>
                  02 SQUADS
                </span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span className="ml-auto">
                  CHANNEL // 01
                </span>
              </div>
            </AnimatedSection>

            {/* ========================================================
                QUICK STATS
            ======================================================== */}
            <AnimatedSection delay={0.12}>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.node}
                    initial={
                      reduceMotion
                        ? false
                        : {
                          opacity: 0,
                          y: 20,
                        }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: reduceMotion
                        ? 0
                        : 0.15 + index * 0.08,
                    }}
                    whileHover={
                      reduceMotion
                        ? {}
                        : {
                          y: -4,
                        }
                    }
                    className="group relative overflow-hidden border border-white/10 bg-[#07100c]/75 p-5 backdrop-blur-xl"
                  >

                    {/* Accent line */}
                    <div
                      className={`absolute left-0 top-0 h-full w-px ${stat.status === "amber"
                          ? "bg-amber-400/70"
                          : stat.status === "cyan"
                            ? "bg-cyan-400/70"
                            : "bg-green/70"
                        }`}
                    />

                    <div className="flex items-center justify-between">

                      <span className="font-mono text-[8px] tracking-[0.25em] text-muted">
                        NODE_{stat.node}
                      </span>

                      <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_8px_rgba(80,255,150,.8)]" />
                    </div>

                    <span className="mt-5 block font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                      {stat.label}
                    </span>

                    <strong
                      className={`mt-2 block font-display text-3xl ${stat.status === "amber"
                          ? "text-amber-400"
                          : stat.status === "cyan"
                            ? "text-cyan-400"
                            : "text-paper"
                        }`}
                    >
                      {stat.value}
                    </strong>

                    <span className="mt-2 block truncate font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                      {stat.detail}
                    </span>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* ========================================================
                COMMAND MODULE
            ======================================================== */}
            <AnimatedSection delay={0.18}>
              <div className="mt-12">

                {/* TAB NAVIGATION */}
                <div className="relative overflow-x-auto border-b border-white/10">

                  <div className="flex min-w-max gap-6 font-mono text-[9px] uppercase tracking-[0.16em]">

                    {[
                      {
                        id: "events" as const,
                        label: "MY REGISTERED EVENTS",
                        count: "03",
                      },
                      {
                        id: "squads" as const,
                        label: "SQUAD FORMATIONS",
                        count: "02",
                      },
                      {
                        id: "schedule" as const,
                        label: "MY TIMELINE",
                        count: "03",
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative pb-4 transition-all ${activeTab === tab.id
                            ? "text-green"
                            : "text-muted hover:text-paper"
                          }`}
                      >
                        {tab.label} ({tab.count})

                        {activeTab === tab.id && (
                          <motion.span
                            layoutId="dashboard-tab"
                            className="absolute bottom-0 left-0 right-0 h-px bg-green shadow-[0_0_10px_rgba(80,255,150,.7)]"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAB CONTENT */}
                <div className="mt-6">

                  <AnimatePresence mode="wait">

                    {/* ==================================================
                        EVENTS
                    ================================================== */}
                    {activeTab === "events" && (
                      <motion.div
                        key="events"
                        initial={
                          reduceMotion
                            ? false
                            : {
                              opacity: 0,
                              y: 14,
                            }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : {
                              opacity: 0,
                              y: -8,
                            }
                        }
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className="grid grid-cols-1 gap-5 md:grid-cols-3"
                      >

                        {events.map((event, index) => (
                          <motion.div
                            key={event.title}
                            whileHover={
                              reduceMotion
                                ? {}
                                : {
                                  y: -5,
                                }
                            }
                            className="group relative overflow-hidden border border-white/10 bg-[#07100c]/75 p-6 backdrop-blur-xl"
                          >

                            <div className="absolute left-0 top-0 h-full w-px bg-green/60 shadow-[0_0_12px_rgba(80,255,150,.5)]" />

                            {/* top */}
                            <div className="flex items-center justify-between gap-3">

                              <StreamBadge stream={event.stream} />

                              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-green">
                                ● CONFIRMED
                              </span>
                            </div>

                            <div className="mt-5 font-mono text-[8px] tracking-[0.2em] text-muted">
                              EVENT_NODE_0{index + 1}
                            </div>

                            <h3 className="mt-2 font-display text-xl font-semibold leading-tight">
                              {event.title}
                            </h3>

                            <p className="mt-3 font-mono text-[9px] uppercase tracking-widest text-muted">
                              {event.venue}
                            </p>

                            <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-green/80">
                              {event.time}
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">

                              <Link
                                href={event.href}
                                className="font-mono text-[9px] uppercase tracking-[0.12em] text-green no-underline transition-all hover:translate-x-1"
                              >
                                {event.action} →
                              </Link>

                              <span className="text-2xl text-white/4">
                                0{index + 1}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* ==================================================
                        SQUADS
                    ================================================== */}
                    {activeTab === "squads" && (
                      <motion.div
                        key="squads"
                        initial={
                          reduceMotion
                            ? false
                            : {
                              opacity: 0,
                              y: 14,
                            }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : {
                              opacity: 0,
                              y: -8,
                            }
                        }
                        transition={{
                          duration: 0.3,
                        }}
                        className="space-y-5"
                      >

                        <div className="relative overflow-hidden border border-white/10 bg-[#07100c]/75 p-6 backdrop-blur-xl md:p-7">

                          <div className="absolute left-0 top-0 h-full w-px bg-green/70" />

                          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                            <div>

                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[8px] tracking-[0.25em] text-green">
                                  SQUAD_NODE_01
                                </span>

                                <span className="font-mono text-[8px] text-green">
                                  ● LEADER
                                </span>
                              </div>

                              <h3 className="mt-3 font-display text-2xl font-semibold">
                                CyberVipers
                              </h3>

                              <p className="mt-2 max-w-xl font-mono text-[9px] leading-6 text-muted">
                                3 MEMBERS // AROMAL S., NEHA S., ROHAN K.
                                <br />
                                LINKED OPERATIONS // HACKATHON + CTF
                              </p>
                            </div>

                            <Button href="/teams" variant="outline">
                              Manage Squad →
                            </Button>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/5 pt-5">
                            {["AROMAL S.", "NEHA S.", "ROHAN K."].map(
                              (member, index) => (
                                <div
                                  key={member}
                                  className="border border-white/5 bg-black/20 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-muted"
                                >
                                  <span className="mr-2 text-green">
                                    0{index + 1}
                                  </span>
                                  {member}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div className="border border-dashed border-white/10 bg-black/10 p-6 text-center">

                          <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-muted">
                            SQUAD NETWORK
                          </div>

                          <div className="mt-3 font-display text-xl text-white/30">
                            02 ACTIVE FORMATIONS
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ==================================================
                        TIMELINE
                    ================================================== */}
                    {activeTab === "schedule" && (
                      <motion.div
                        key="schedule"
                        initial={
                          reduceMotion
                            ? false
                            : {
                              opacity: 0,
                              y: 14,
                            }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : {
                              opacity: 0,
                              y: -8,
                            }
                        }
                        transition={{
                          duration: 0.3,
                        }}
                        className="relative border border-white/10 bg-[#07100c]/75 p-6 backdrop-blur-xl md:p-8"
                      >

                        {/* Timeline rail */}
                        <div className="absolute bottom-8 left-9.25 top-8 w-px bg-green/15 md:left-11.25" />

                        <div className="space-y-8">

                          {timeline.map((item, index) => (
                            <div
                              key={`${item.date}-${item.time}`}
                              className="relative flex gap-5 md:gap-7"
                            >

                              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border border-green/30 bg-[#07100c] font-mono text-[8px] text-green md:h-10 md:w-10">
                                0{index + 1}
                              </div>

                              <div className="min-w-0 flex-1 border-b border-white/5 pb-6">

                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">

                                  <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-green">
                                    {item.date} // {item.time}
                                  </span>

                                  <span className="hidden h-1 w-1 rounded-full bg-green sm:block" />

                                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
                                    TIMELINE NODE
                                  </span>
                                </div>

                                <h3 className="mt-2 font-display text-lg font-semibold">
                                  {item.title}
                                </h3>

                                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                SYSTEM FOOTER
            ======================================================== */}
            <AnimatedSection delay={0.35}>
              <div className="mt-16 flex flex-col items-center text-center">

                <div className="flex w-full max-w-xl items-center gap-4">

                  <span className="h-px flex-1 bg-linear-to-r from-transparent to-green/20" />

                  <span className="font-mono text-[8px] tracking-[0.3em] text-green/50">
                    COMMAND DECK ONLINE
                  </span>

                  <span className="h-px flex-1 bg-linear-to-l from-transparent to-green/20" />
                </div>

                <motion.div
                  className="mt-6 font-display text-xl uppercase tracking-[0.3em] text-white/15 md:text-2xl"
                  animate={
                    reduceMotion
                      ? {}
                      : {
                        opacity: [0.15, 0.4, 0.15],
                      }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  THE FUTURE AWAITS
                </motion.div>

                <div className="mt-3 font-mono text-[7px] tracking-[0.35em] text-muted">
                  VYUHAM&apos;26 // OPERATIVE NETWORK // END
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
