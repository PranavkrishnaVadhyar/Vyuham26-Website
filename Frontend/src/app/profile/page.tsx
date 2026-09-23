"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button, StreamBadge } from "@/components/ui/Elements";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function ProfilePage() {
  const reduceMotion = usePrefersReducedMotion();

  const [profile, setProfile] = useState({
    name: "Aromal S S",
    email: "aromal.s24@duk.ac.in",
    college: "Digital University Kerala",
    phone: "+91 98470 12345",
    degree: "M.Tech Cyber Security",
    year: "2024–2026",
    vyuhamId: "VYU26-OPER-8042",
  });

  const [saved, setSaved] = useState(false);

  const fields = [
    profile.name,
    profile.email,
    profile.college,
    profile.phone,
    profile.degree,
    profile.year,
  ];

  const filledCount = fields.filter((f) => f.trim().length > 0).length;
  const completionPercent = Math.round(
    (filledCount / fields.length) * 100
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#020504] pt-[92px] text-paper">

        {/* ============================================================
            GLOBAL BACKGROUND
        ============================================================ */}

        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          {/* Core glow */}
          <motion.div
            className="absolute left-1/2 top-[20%] h-[560px] w-[560px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(46,229,157,.06), rgba(0,220,255,.018) 40%, transparent 70%)",
              filter: "blur(28px)",
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                  scale: [1, 1.08, 1],
                  opacity: [0.55, 0.9, 0.55],
                }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Technical grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />

          {/* Scan line */}
          {!reduceMotion && (
            <motion.div
              className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-green/20 to-transparent"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </div>

        <section className="py-16 md:py-24">
          <div className="mx-auto w-[min(1100px,calc(100%-32px))] md:w-[min(1100px,calc(100%-64px))]">

            {/* ========================================================
                HEADER
            ======================================================== */}

            <AnimatedSection>
              <div className="relative overflow-hidden border-b border-white/10 pb-7">

                {/* System status */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-40" />
                      <span className="relative h-2 w-2 rounded-full bg-green shadow-[0_0_12px_rgba(46,229,157,.9)]" />
                    </span>

                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-green">
                      Personnel Network Online
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wider text-muted">
                    <span>VYUHAM'26</span>
                    <span className="text-white/20">/</span>
                    <span>IDENTITY NODE</span>
                    <span className="text-white/20">/</span>
                    <span className="text-green">VERIFIED</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">

                  <div>
                    <Kicker>Personnel Record</Kicker>

                    <h1 className="mt-3 font-display text-[42px] font-semibold leading-[0.9] tracking-tight md:text-[64px]">
                      OPERATIVE{" "}
                      <em className="not-italic text-green [text-shadow:0_0_30px_rgba(46,229,157,.22)]">
                        PROFILE
                      </em>
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                      Manage your VYUHAM identity, academic record, event
                      credentials and operative information.
                    </p>
                  </div>

                  {/* ID block */}
                  <div className="relative overflow-hidden rounded border border-green/20 bg-green/[0.025] px-5 py-4">

                    <div className="absolute inset-y-0 left-0 w-px bg-green/60" />

                    <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                      VYUHAM Identity
                    </div>

                    <div className="mt-1 font-mono text-sm font-semibold text-green">
                      {profile.vyuhamId}
                    </div>

                    <div className="mt-2 flex items-center gap-2 font-mono text-[8px] text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-green" />
                      IDENTITY VERIFIED
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                  <span>
                    NODE <b className="text-paper">OPER-01</b>
                  </span>

                  <span>
                    ACCESS <b className="text-green">AUTHORIZED</b>
                  </span>

                  <span>
                    RECORD <b className="text-paper">ACTIVE</b>
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                PROFILE + DOSSIER
            ======================================================== */}

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

              {/* ======================================================
                  IDENTITY CARD
              ====================================================== */}

              <AnimatedSection delay={0.08}>
                <div className="relative overflow-hidden rounded border border-white/10 bg-[#070a0b]/90 p-6 md:p-8">

                  {/* corners */}
                  <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-green/50" />
                  <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-green/20" />
                  <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-green/20" />
                  <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-green/20" />

                  {/* identity label */}
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-green">
                        Identity Core
                      </div>

                      <div className="mt-1 font-display text-lg font-semibold">
                        OPERATIVE
                      </div>
                    </div>

                    <span className="font-mono text-[8px] text-green">
                      01
                    </span>
                  </div>

                  {/* ==================================================
                      COMPLETION CORE
                  ================================================== */}

                  <div className="relative mx-auto flex h-44 w-44 items-center justify-center">

                    {/* outer pulse */}
                    {!reduceMotion && (
                      <motion.div
                        className="absolute inset-1 rounded-full border border-green/10"
                        animate={{
                          scale: [1, 1.08, 1],
                          opacity: [0.25, 0.6, 0.25],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {/* outer ring */}
                    <svg
                      className="absolute inset-0 h-full w-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-white/10"
                        fill="transparent"
                      />

                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-green"
                        fill="transparent"
                        strokeDasharray="264"
                        initial={{
                          strokeDashoffset: 264,
                        }}
                        animate={{
                          strokeDashoffset:
                            264 - (264 * completionPercent) / 100,
                        }}
                        transition={{
                          duration: 1.5,
                          ease: "easeOut",
                        }}
                        strokeLinecap="round"
                        style={{
                          filter:
                            "drop-shadow(0 0 5px rgba(46,229,157,.65))",
                        }}
                      />

                      {/* inner ticks */}
                      <circle
                        cx="50"
                        cy="50"
                        r="34"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeDasharray="1 5"
                        className="text-green/30"
                        fill="transparent"
                      />
                    </svg>

                    {/* core */}
                    <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border border-green/20 bg-green/[0.025]">
                      <span className="font-mono text-3xl font-bold text-green">
                        {completionPercent}%
                      </span>

                      <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                        RECORD
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="mt-6 text-center">
                    <h2 className="font-display text-xl font-semibold">
                      {profile.name}
                    </h2>

                    <p className="mt-1 font-mono text-[10px] text-muted">
                      {profile.college}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <StreamBadge stream="tech" />

                    <span className="rounded border border-green/20 bg-green/[0.04] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-green">
                      VERIFIED OPERATIVE
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="mt-7 space-y-3 border-t border-white/10 pt-6">

                    <div className="flex items-center justify-between font-mono text-[9px]">
                      <span className="text-muted">
                        REGISTERED EVENTS
                      </span>

                      <span className="font-semibold text-paper">
                        03
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px]">
                      <span className="text-muted">
                        TEAMS JOINED
                      </span>

                      <span className="font-semibold text-paper">
                        02
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px]">
                      <span className="text-muted">
                        QR PASS
                      </span>

                      <span className="flex items-center gap-2 font-semibold text-green">
                        <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_8px_rgba(46,229,157,.7)]" />
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Ticket */}
                  <Button
                    href="/ticket"
                    variant="outline"
                    className="mt-7 w-full justify-center"
                  >
                    VIEW QR CREDENTIAL ↗
                  </Button>
                </div>
              </AnimatedSection>

              {/* ======================================================
                  DOSSIER
              ====================================================== */}

              <AnimatedSection
                delay={0.16}
                className="lg:col-span-2"
              >
                <div className="relative overflow-hidden rounded border border-white/10 bg-[#070a0b]/90 p-6 md:p-8">

                  {/* corner */}
                  <div className="absolute right-0 top-0 h-20 w-20 border-r border-t border-green/20" />

                  <div className="flex items-center justify-between border-b border-white/10 pb-5">

                    <div>
                      <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-green">
                        Identity Database
                      </div>

                      <h3 className="mt-2 font-display text-xl font-semibold">
                        PERSONNEL DOSSIER
                      </h3>
                    </div>

                    <div className="hidden font-mono text-[8px] text-muted sm:block">
                      RECORD / 001
                    </div>
                  </div>

                  <form
                    onSubmit={handleSave}
                    className="mt-6 space-y-5"
                  >

                    {/* =================================================
                        ROW 1
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                      <div>
                        <label
                          htmlFor="name"
                          className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                        >
                          Operative Name
                        </label>

                        <input
                          id="name"
                          type="text"
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              name: e.target.value,
                            })
                          }
                          className="mt-2 w-full rounded border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-green/60 focus:bg-green/[0.025]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                        >
                          Communication Address
                        </label>

                        <input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              email: e.target.value,
                            })
                          }
                          className="mt-2 w-full rounded border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-green/60 focus:bg-green/[0.025]"
                        />
                      </div>
                    </div>

                    {/* =================================================
                        ROW 2
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                      <div>
                        <label
                          htmlFor="college"
                          className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                        >
                          Institution / Campus
                        </label>

                        <input
                          id="college"
                          type="text"
                          value={profile.college}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              college: e.target.value,
                            })
                          }
                          className="mt-2 w-full rounded border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-green/60 focus:bg-green/[0.025]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                        >
                          Contact Number
                        </label>

                        <input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              phone: e.target.value,
                            })
                          }
                          className="mt-2 w-full rounded border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-green/60 focus:bg-green/[0.025]"
                        />
                      </div>
                    </div>

                    {/* =================================================
                        ROW 3
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                      <div>
                        <label
                          htmlFor="degree"
                          className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                        >
                          Degree / Program
                        </label>

                        <input
                          id="degree"
                          type="text"
                          value={profile.degree}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              degree: e.target.value,
                            })
                          }
                          className="mt-2 w-full rounded border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-green/60 focus:bg-green/[0.025]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="year"
                          className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                        >
                          Academic Batch
                        </label>

                        <input
                          id="year"
                          type="text"
                          value={profile.year}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              year: e.target.value,
                            })
                          }
                          className="mt-2 w-full rounded border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-green/60 focus:bg-green/[0.025]"
                        />
                      </div>
                    </div>

                    {/* =================================================
                        RECORD STATUS
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">

                      <div className="rounded border border-white/10 bg-black/20 px-4 py-3">
                        <div className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                          Identity
                        </div>

                        <div className="mt-1 font-mono text-[9px] text-green">
                          VERIFIED
                        </div>
                      </div>

                      <div className="rounded border border-white/10 bg-black/20 px-4 py-3">
                        <div className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                          Access
                        </div>

                        <div className="mt-1 font-mono text-[9px] text-green">
                          AUTHORIZED
                        </div>
                      </div>

                      <div className="rounded border border-white/10 bg-black/20 px-4 py-3">
                        <div className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                          Record
                        </div>

                        <div className="mt-1 font-mono text-[9px] text-green">
                          {completionPercent}% COMPLETE
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        SAVE
                    ================================================= */}

                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        {saved ? (
                          <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 font-mono text-[9px] text-green"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_8px_rgba(46,229,157,.8)]" />
                            DOSSIER RECORD UPDATED
                          </motion.div>
                        ) : (
                          <div className="font-mono text-[9px] uppercase tracking-wider text-muted">
                            Last synchronized: 2 mins ago
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                      >
                        SYNCHRONIZE RECORD →
                      </Button>
                    </div>
                  </form>
                </div>
              </AnimatedSection>
            </div>

            {/* ========================================================
                SECURITY FOOTER
            ======================================================== */}

            <AnimatedSection delay={0.25}>
              <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-muted sm:flex-row">
                <span>
                  VYUHAM'26 • IDENTITY NETWORK
                </span>

                <span>
                  <span className="text-green">●</span>{" "}
                  PERSONNEL RECORD SECURE
                </span>

                <span>
                  ACCESS LEVEL: OPERATIVE
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
