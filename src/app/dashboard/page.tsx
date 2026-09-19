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
  const [activeTab, setActiveTab] = useState<"events" | "squads" | "schedule">("events");

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            {/* Command Header */}
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Personal Command Deck</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    MY <em>DASHBOARD</em>
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono text-xs">
                    <span className="text-muted block">OPERATIVE:</span>
                    <strong className="text-paper">Arjun V. Nair (VYU26-OPER-8042)</strong>
                  </div>
                  <Button href="/ticket" variant="primary">
                    QR Ticket Pass ↗
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            {/* Overview Quick Stats */}
            <AnimatedSection delay={0.1}>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="glass-card p-5">
                  <span className="font-mono text-[10px] uppercase text-muted">REGISTRATIONS</span>
                  <strong className="mt-2 block font-display text-3xl text-paper">3 Events</strong>
                  <span className="mt-1 block font-mono text-[10px] text-green">● All Confirmed</span>
                </div>

                <div className="glass-card p-5">
                  <span className="font-mono text-[10px] uppercase text-muted">SQUADS JOINED</span>
                  <strong className="mt-2 block font-display text-3xl text-paper">2 Teams</strong>
                  <span className="mt-1 block font-mono text-[10px] text-paper">CyberVipers (Leader)</span>
                </div>

                <div className="glass-card p-5">
                  <span className="font-mono text-[10px] uppercase text-muted">PASS STATUS</span>
                  <strong className="mt-2 block font-display text-3xl text-green">ACTIVE</strong>
                  <span className="mt-1 block font-mono text-[10px] text-muted">Verified 30 OCT 2026</span>
                </div>

                <div className="glass-card p-5">
                  <span className="font-mono text-[10px] uppercase text-muted">FOOD CREDITS</span>
                  <strong className="mt-2 block font-display text-3xl text-amber-400">₹450</strong>
                  <span className="mt-1 block font-mono text-[10px] text-muted">Wallet Balance</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Dashboard Tabs */}
            <div className="mt-10">
              <div className="flex border-b border-line gap-4 font-mono text-xs">
                <button
                  onClick={() => setActiveTab("events")}
                  className={`pb-3 font-medium transition-all ${
                    activeTab === "events"
                      ? "border-b-2 border-green text-green"
                      : "text-muted hover:text-paper"
                  }`}
                >
                  MY REGISTERED EVENTS (3)
                </button>
                <button
                  onClick={() => setActiveTab("squads")}
                  className={`pb-3 font-medium transition-all ${
                    activeTab === "squads"
                      ? "border-b-2 border-green text-green"
                      : "text-muted hover:text-paper"
                  }`}
                >
                  SQUAD FORMATIONS (2)
                </button>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className={`pb-3 font-medium transition-all ${
                    activeTab === "schedule"
                      ? "border-b-2 border-green text-green"
                      : "text-muted hover:text-paper"
                  }`}
                >
                  MY TIMELINE
                </button>
              </div>

              {/* Tab Contents */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                {activeTab === "events" && (
                  <motion.div
                    key="events"
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="grid grid-cols-1 gap-6 md:grid-cols-3"
                  >
                    <div className="glass-card p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center">
                          <StreamBadge stream="tech" />
                          <span className="font-mono text-[10px] text-green border border-green/30 px-2 py-0.5 rounded">
                            CONFIRMED
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-xl font-semibold">National Hackathon</h3>
                        <p className="mt-2 font-mono text-xs text-muted">
                          Venue: Main Lab 01 | Day 1, 10:00 AM
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-line/60 flex justify-between items-center">
                        <Link href="/hackathon" className="font-mono text-xs text-green hover:underline">
                          Enter Build Zone →
                        </Link>
                      </div>
                    </div>

                    <div className="glass-card p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center">
                          <StreamBadge stream="tech" />
                          <span className="font-mono text-[10px] text-green border border-green/30 px-2 py-0.5 rounded">
                            CONFIRMED
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-xl font-semibold">CTF Warzone</h3>
                        <p className="mt-2 font-mono text-xs text-muted">
                          Venue: Cyber Range | Day 2, 11:30 AM
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-line/60 flex justify-between items-center">
                        <Link href="/ctf" className="font-mono text-xs text-green hover:underline">
                          Enter CTF Portal →
                        </Link>
                      </div>
                    </div>

                    <div className="glass-card p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center">
                          <StreamBadge stream="culture" />
                          <span className="font-mono text-[10px] text-green border border-green/30 px-2 py-0.5 rounded">
                            CONFIRMED
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-xl font-semibold">Battle of the Bands</h3>
                        <p className="mt-2 font-mono text-xs text-muted">
                          Venue: Open Amphitheatre | Day 2, 06:00 PM
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-line/60 flex justify-between items-center">
                        <Link href="/events/battle-of-the-bands" className="font-mono text-xs text-muted hover:text-green">
                          View Dossier ↗
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "squads" && (
                  <motion.div
                    key="squads"
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <span className="font-mono text-[10px] text-green">LEADER ROLE</span>
                        <h3 className="font-display text-xl font-semibold">CyberVipers</h3>
                        <p className="font-mono text-xs text-muted">
                          3 Members (Arjun V., Neha S., Rohan K.) | Linked: Hackathon, CTF
                        </p>
                      </div>
                      <Button href="/teams" variant="outline">
                        Manage Squad →
                      </Button>
                    </div>
                </motion.div>
                )}

                {activeTab === "schedule" && (
                  <motion.div
                    key="schedule"
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="glass-card p-6 space-y-4"
                  >
                    <div className="flex items-center gap-4 font-mono text-xs border-b border-line/40 pb-3">
                      <span className="text-green font-bold">30 OCT 10:00 AM</span>
                      <span className="text-paper">National Hackathon — Day 1 Kickoff</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-xs border-b border-line/40 pb-3">
                      <span className="text-green font-bold">31 OCT 11:30 AM</span>
                      <span className="text-paper">CTF Warzone Qualification Round</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-xs">
                      <span className="text-green font-bold">31 OCT 06:00 PM</span>
                      <span className="text-paper">Battle of the Bands Main Stage</span>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
