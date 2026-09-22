"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import SignalRing from "@/components/motion/SignalRing";
import { Kicker, Button } from "@/components/ui/Elements";

const milestones = [
  {
    id: "01",
    title: "Problem Statement",
    time: "30 OCT • 11:00 AM",
    status: "COMPLETE",
    description: "Challenge parameters locked.",
  },
  {
    id: "02",
    title: "Architecture & API",
    time: "30 OCT • 04:00 PM",
    status: "COMPLETE",
    description: "Core system architecture verified.",
  },
  {
    id: "03",
    title: "Prototype Submission",
    time: "31 OCT • 09:00 AM",
    status: "ACTIVE",
    description: "Upload your working prototype.",
  },
  {
    id: "04",
    title: "Final Pitch & Demo",
    time: "31 OCT • 02:00 PM",
    status: "LOCKED",
    description: "Final presentation sequence.",
  },
];

export default function HackathonHubPage() {
  const reduceMotion = usePrefersReducedMotion();

  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!repoUrl.trim()) return;

    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#030506] pt-[92px] text-paper">
        {/* =========================================================
            BACKGROUND SYSTEM
        ========================================================= */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          {/* radial core glow */}
          <motion.div
            className="absolute left-1/2 top-[25%] h-[520px] w-[520px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(150,255,90,.075) 0%, rgba(0,220,255,.025) 38%, transparent 70%)",
              filter: "blur(25px)",
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.08, 1],
                    opacity: [0.65, 1, 0.65],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* scan line */}
          {!reduceMotion && (
            <motion.div
              className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-green/20 to-transparent"
              initial={{ top: "5%" }}
              animate={{ top: "95%" }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}

          {/* subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
        </div>

        <section className="py-16 md:py-24">
          <div className="mx-auto w-[min(1160px,calc(100%-32px))] md:w-[min(1160px,calc(100%-64px))]">

            {/* =====================================================
                HEADER
            ===================================================== */}
            <AnimatedSection>
              <div className="relative overflow-hidden border-b border-white/10 pb-7">
                {/* top metadata */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green shadow-[0_0_12px_rgba(200,255,66,.9)]" />

                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-green">
                      Build Network Online
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted">
                    <span>VYUHAM'26</span>
                    <span className="text-white/20">/</span>
                    <span>NODE 03</span>
                    <span className="text-white/20">/</span>
                    <span className="text-green">LIVE</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                  <div>
                    <Kicker>Build Zone Command</Kicker>

                    <h1 className="mt-3 font-display text-[42px] font-semibold leading-[0.95] tracking-tight md:text-[68px]">
                      HACKATHON{" "}
                      <em className="not-italic text-green [text-shadow:0_0_30px_rgba(200,255,66,.25)]">
                        HUB
                      </em>
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                      Your squad command interface for milestone tracking,
                      prototype deployment, repository submission and mentor
                      communication.
                    </p>
                  </div>

                  {/* squad badge */}
                  <div className="relative overflow-hidden rounded border border-green/20 bg-green/[0.035] px-5 py-4">
                    <div className="absolute inset-y-0 left-0 w-px bg-green/60" />

                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                      Active Squad
                    </div>

                    <div className="mt-1 font-display text-xl font-semibold text-green">
                      CyberVipers
                    </div>

                    <div className="mt-2 flex items-center gap-2 font-mono text-[9px] text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-green" />
                      SYSTEM LINKED
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                STATUS STRIP
            ===================================================== */}
            <AnimatedSection delay={0.08}>
              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded border border-white/10 bg-white/10 md:grid-cols-4">
                {[
                  ["PHASE", "03 / 04"],
                  ["STATUS", "BUILDING"],
                  ["SUBMISSION", "31 OCT"],
                  ["NODE", "CYB-14"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-[#070a0b] px-4 py-4"
                  >
                    <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                      {label}
                    </div>

                    <div className="mt-1 font-mono text-sm font-semibold text-paper">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* =====================================================
                MILESTONE COMMAND
            ===================================================== */}
            <AnimatedSection delay={0.12}>
              <div className="relative mt-8 overflow-hidden rounded border border-white/10 bg-[#070a0b]/90 p-5 md:p-8">

                {/* corner accents */}
                <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-green/60" />
                <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-green/60" />
                <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-green/20" />
                <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-green/20" />

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-green">
                      Mission Progress
                    </div>

                    <h2 className="mt-2 font-display text-2xl font-semibold">
                      SQUAD MILESTONE PATH
                    </h2>
                  </div>

                  <div className="font-mono text-[10px] text-muted">
                    <span className="text-green">75%</span> SYSTEM COMPLETION
                  </div>
                </div>

                {/* progress bar */}
                <div className="mt-6 h-px w-full overflow-hidden bg-white/10">
                  <motion.div
                    className="h-full bg-green shadow-[0_0_12px_rgba(200,255,66,.8)]"
                    initial={{ width: reduceMotion ? "75%" : "0%" }}
                    animate={{ width: "75%" }}
                    transition={{
                      duration: 1.6,
                      ease: "easeOut",
                    }}
                  />
                </div>

                {/* milestone nodes */}
                <div className="relative mt-8 grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-3">

                  {/* desktop connector */}
                  <div
                    className="absolute left-[8%] right-[8%] top-[38px] hidden h-px bg-gradient-to-r from-green via-green/60 to-white/10 md:block"
                    aria-hidden="true"
                  />

                  {milestones.map((milestone, index) => {
                    const active = milestone.status === "ACTIVE";
                    const complete = milestone.status === "COMPLETE";
                    const locked = milestone.status === "LOCKED";

                    return (
                      <motion.div
                        key={milestone.id}
                        className={`relative rounded border p-4 ${
                          active
                            ? "border-green/60 bg-green/[0.07] shadow-[0_0_30px_rgba(200,255,66,.08)]"
                            : complete
                              ? "border-green/20 bg-green/[0.025]"
                              : "border-white/10 bg-white/[0.015]"
                        }`}
                        initial={
                          reduceMotion
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 15 }
                        }
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.45,
                        }}
                      >
                        {/* node */}
                        <div className="relative z-10 mb-4 flex items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[10px] font-bold ${
                              active
                                ? "border-green bg-green text-black shadow-[0_0_18px_rgba(200,255,66,.45)]"
                                : complete
                                  ? "border-green/60 bg-green/10 text-green"
                                  : "border-white/15 bg-black text-muted"
                            }`}
                          >
                            {complete ? "✓" : milestone.id}
                          </div>

                          {active && (
                            <SignalRing
                              className="left-[-8px] top-[-8px]"
                              size={48}
                              count={2}
                              duration={2.4}
                            />
                          )}
                        </div>

                        <div
                          className={`font-mono text-[9px] font-bold tracking-[0.15em] ${
                            active
                              ? "text-green"
                              : complete
                                ? "text-green/70"
                                : "text-muted"
                          }`}
                        >
                          {milestone.status}
                        </div>

                        <h3 className="mt-1 font-display text-base font-semibold">
                          {milestone.title}
                        </h3>

                        <p className="mt-2 text-[11px] leading-5 text-muted">
                          {milestone.description}
                        </p>

                        <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[9px] text-muted">
                          {milestone.time}
                        </div>

                        {active && !reduceMotion && (
                          <motion.div
                            className="absolute bottom-0 left-0 h-px bg-green"
                            initial={{ width: "0%" }}
                            animate={{ width: ["0%", "100%", "0%"] }}
                            transition={{
                              duration: 2.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* energy pulse */}
                <div
                  className="relative mt-7 hidden h-5 overflow-hidden md:block"
                  aria-hidden="true"
                >
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-green/40 via-green/10 to-transparent" />

                  {!reduceMotion && (
                    <motion.div
                      className="absolute top-1/2 h-1 w-12 -translate-y-1/2 rounded-full bg-green shadow-[0_0_14px_rgba(200,255,66,.9)]"
                      animate={{
                        left: ["0%", "74%", "74%", "0%"],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 3.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                SUBMISSION + SUPPORT
            ===================================================== */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

              {/* submission */}
              <AnimatedSection
                delay={0.18}
                className="lg:col-span-2"
              >
                <div className="relative overflow-hidden rounded border border-white/10 bg-[#070a0b]/90 p-5 md:p-8">

                  <div className="absolute right-0 top-0 h-20 w-20 border-r border-t border-green/20" />

                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-green">
                        Data Uplink
                      </div>

                      <h3 className="mt-2 font-display text-xl font-semibold">
                        SUBMIT PROTOTYPE
                      </h3>
                    </div>

                    <div className="hidden font-mono text-[9px] text-muted sm:block">
                      UPLINK / 03
                    </div>
                  </div>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-green/50 bg-green/10 text-2xl text-green shadow-[0_0_30px_rgba(200,255,66,.12)]">
                        ✓
                      </div>

                      <div className="mt-5 font-display text-xl font-semibold">
                        UPLINK ACCEPTED
                      </div>

                      <p className="mt-2 font-mono text-xs text-muted">
                        Repository received. Mentor review queue updated.
                      </p>

                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-6 font-mono text-[10px] uppercase tracking-widest text-green hover:underline"
                      >
                        Submit another revision
                      </button>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="mt-6 space-y-5"
                    >
                      {/* GitHub */}
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                          Primary Repository
                        </label>

                        <div className="relative mt-2">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-green">
                            //
                          </span>

                          <input
                            type="url"
                            required
                            value={repoUrl}
                            onChange={(e) =>
                              setRepoUrl(e.target.value)
                            }
                            placeholder="https://github.com/cybervipers/vyuham-hackathon"
                            className="w-full rounded border border-white/10 bg-black/40 py-3 pl-11 pr-4 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-green/60 focus:bg-green/[0.025]"
                          />
                        </div>
                      </div>

                      {/* Demo */}
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                          Live Deployment
                          <span className="ml-2 text-white/20">
                            OPTIONAL
                          </span>
                        </label>

                        <div className="relative mt-2">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-green">
                            →
                          </span>

                          <input
                            type="url"
                            value={demoUrl}
                            onChange={(e) =>
                              setDemoUrl(e.target.value)
                            }
                            placeholder="https://cybervipers.vercel.app"
                            className="w-full rounded border border-white/10 bg-black/40 py-3 pl-11 pr-4 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-green/60 focus:bg-green/[0.025]"
                          />
                        </div>
                      </div>

                      {/* bottom */}
                      <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-widest text-muted">
                            Current State
                          </div>

                          <div className="mt-1 flex items-center gap-2 font-mono text-xs text-amber-300">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                            DRAFTING
                          </div>
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                        >
                          TRANSMIT MILESTONE 03 →
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </AnimatedSection>

              {/* ===================================================
                  SUPPORT NODE
              =================================================== */}
              <AnimatedSection delay={0.25}>
                <div className="relative overflow-hidden rounded border border-white/10 bg-[#070a0b]/90 p-5 md:p-8">

                  <div className="absolute right-5 top-5">
                    <span className="flex items-center gap-2 font-mono text-[8px] text-green">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(200,255,66,.8)]" />
                      ONLINE
                    </span>
                  </div>

                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-green">
                    Support Network
                  </div>

                  <h3 className="mt-2 font-display text-xl font-semibold">
                    LIVE SUPPORT NODE
                  </h3>

                  <p className="mt-4 text-xs leading-6 text-muted">
                    Need technical assistance, API access, deployment help,
                    or architecture guidance? Open a direct mentor channel.
                  </p>

                  {/* support signal */}
                  <div className="relative my-8 flex h-24 items-center justify-center overflow-hidden rounded border border-white/10 bg-black/30">
                    <motion.div
                      className="absolute h-12 w-12 rounded-full border border-green/30"
                      animate={
                        reduceMotion
                          ? undefined
                          : {
                              scale: [1, 1.7, 1],
                              opacity: [0.8, 0, 0.8],
                            }
                      }
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />

                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green text-black shadow-[0_0_20px_rgba(200,255,66,.5)]">
                      <span className="text-xs">⚡</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-5">
                    <div className="flex justify-between font-mono text-[9px]">
                      <span className="text-muted">RESPONSE</span>
                      <span className="text-paper">&lt; 05 MIN</span>
                    </div>

                    <div className="flex justify-between font-mono text-[9px]">
                      <span className="text-muted">BAY</span>
                      <span className="text-green">14</span>
                    </div>

                    <div className="flex justify-between font-mono text-[9px]">
                      <span className="text-muted">CHANNEL</span>
                      <span className="text-paper">MENTOR-03</span>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      alert(
                        "Mentor requested! A mentor is arriving at Bay 14."
                      )
                    }
                    variant="outline"
                    className="mt-6 w-full justify-center"
                  >
                    REQUEST MENTOR ⚡
                  </Button>
                </div>
              </AnimatedSection>
            </div>

            {/* =====================================================
                FOOTER STATUS
            ===================================================== */}
            <AnimatedSection delay={0.3}>
              <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted sm:flex-row">
                <span>
                  VYUHAM'26 • BUILD NETWORK
                </span>

                <span>
                  <span className="text-green">●</span>{" "}
                  ALL SYSTEMS NOMINAL
                </span>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
