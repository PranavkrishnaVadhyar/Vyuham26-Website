"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Button } from "@/components/ui/Elements";
import { Event } from "@/data/events";
import { useAuth } from "@/context/AuthContext";

export default function EventRegistrationForm({
  event,
}: {
  event: Event;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { registerForEvent, isAuthenticated } = useAuth();

  const [isTeam, setIsTeam] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [memberCount, setMemberCount] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      registerForEvent(event.slug);
    }
    setSubmitted(true);
  };

  return (
    <div className="relative mt-8 overflow-hidden rounded border border-white/[0.08] bg-[#07100c]/80 shadow-[0_0_60px_rgba(0,0,0,.25)] backdrop-blur-xl">
      {/* =========================================================
          BACKGROUND SYSTEM
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(46,229,157,.45) 1px, transparent 1px),
              linear-gradient(90deg, rgba(46,229,157,.45) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Scanlines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,.3) 4px)",
          }}
        />

        {/* Glow */}
        <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-[#2ee59d]/[0.045] blur-[100px]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.35)_100%)]" />
      </div>

      {/* =========================================================
          TOP TERMINAL BAR
      ========================================================== */}

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-black/20 px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-[#2ee59d]/60 shadow-[0_0_8px_rgba(46,229,157,.4)]" />
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
            REGISTRATION_PROTOCOL.EXE
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em]">
          <span className="text-white/20">NODE</span>
          <span className="text-[#2ee59d]/60">ACTIVE</span>
        </div>
      </div>

      <div className="relative p-6 md:p-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            /* =====================================================
               SUCCESS STATE
            ====================================================== */
            <motion.div
              key="success"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.96,
                      y: 15,
                    }
              }
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }
              }
              exit={
                reduceMotion
                  ? undefined
                  : {
                      opacity: 0,
                      scale: 0.98,
                    }
              }
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="py-8 text-center"
            >
              {/* Success Core */}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                {!reduceMotion && (
                  <>
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full border border-dashed border-[#2ee59d]/25"
                    />

                    <motion.div
                      animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.3, 0.65, 0.3],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-3 rounded-full border border-[#2ee59d]/20"
                    />
                  </>
                )}

                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#2ee59d]/50 bg-[#2ee59d]/10 text-2xl text-[#2ee59d] shadow-[0_0_30px_rgba(46,229,157,.18)]">
                  ✓
                </div>
              </div>

              <div className="mt-7 font-mono text-[9px] uppercase tracking-[0.22em] text-[#2ee59d]/60">
                Deployment Protocol // Complete
              </div>

              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-paper md:text-3xl">
                DEPLOYMENT REGISTERED
              </h2>

              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-white/40">
                Your registration entry for{" "}
                <span className="text-white/65">{event.title}</span>{" "}
                has been added to your loadout.
              </p>

              {/* Registration telemetry */}
              <div className="mx-auto mt-7 grid max-w-md grid-cols-3 overflow-hidden rounded border border-white/[0.07] bg-black/20">
                <div className="border-r border-white/[0.06] px-3 py-4">
                  <span className="block font-mono text-[7px] uppercase tracking-[0.15em] text-white/20">
                    EVENT
                  </span>
                  <span className="mt-1 block font-mono text-[9px] text-[#2ee59d]/70">
                    LOCKED
                  </span>
                </div>

                <div className="border-r border-white/[0.06] px-3 py-4">
                  <span className="block font-mono text-[7px] uppercase tracking-[0.15em] text-white/20">
                    SLOT
                  </span>
                  <span className="mt-1 block font-mono text-[9px] text-[#2ee59d]/70">
                    RESERVED
                  </span>
                </div>

                <div className="px-3 py-4">
                  <span className="block font-mono text-[7px] uppercase tracking-[0.15em] text-white/20">
                    STATUS
                  </span>
                  <span className="mt-1 block font-mono text-[9px] text-[#2ee59d]/70">
                    READY
                  </span>
                </div>
              </div>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/register" variant="outline">
                  Add More Events
                </Button>

                <Button href="/checkout" variant="primary">
                  Proceed to Checkout →
                </Button>
              </div>
            </motion.div>
          ) : (
            /* =====================================================
               REGISTRATION FORM
            ====================================================== */
            <motion.form
              key="form"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                    }
              }
              animate={{
                opacity: 1,
              }}
              exit={
                reduceMotion
                  ? undefined
                  : {
                      opacity: 0,
                    }
              }
              onSubmit={handleSubmit}
              className="space-y-7"
            >
              {/* Form header */}
              <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#2ee59d]/60">
                    Event Access Protocol
                  </span>

                  <h2 className="mt-2 font-display text-xl font-semibold text-paper">
                    DEPLOY OPERATIVE
                  </h2>

                  <p className="mt-1 text-xs text-white/30">
                    Configure your participation profile.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">
                    REGISTRATION FEE
                  </span>

                  <span className="mt-1 block font-mono text-lg font-bold text-[#2ee59d]">
                    {event.fee}
                  </span>
                </div>
              </div>

              {/* =================================================
                  PARTICIPATION MODE
              ================================================== */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">
                    Participation Mode
                  </label>

                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/20">
                    SELECT PROTOCOL
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Solo */}
                  <button
                    type="button"
                    onClick={() => setIsTeam(false)}
                    className={`group relative overflow-hidden rounded border p-4 text-left transition-all duration-300 ${
                      !isTeam
                        ? "border-[#2ee59d]/50 bg-[#2ee59d]/[0.07] shadow-[0_0_25px_rgba(46,229,157,.06)]"
                        : "border-white/[0.08] bg-white/[0.015] hover:border-white/[0.16]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className={`font-mono text-[9px] font-bold uppercase tracking-[0.16em] ${
                            !isTeam
                              ? "text-[#2ee59d]"
                              : "text-white/40"
                          }`}
                        >
                          SOLO OPERATIVE
                        </span>

                        <span className="mt-1 block text-[10px] text-white/25">
                          Single participant
                        </span>
                      </div>

                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[9px] ${
                          !isTeam
                            ? "border-[#2ee59d]/50 bg-[#2ee59d]/10 text-[#2ee59d]"
                            : "border-white/10 text-white/20"
                        }`}
                      >
                        01
                      </span>
                    </div>

                    {!isTeam && (
                      <motion.div
                        layoutId="mode-indicator"
                        className="absolute bottom-0 left-0 h-px w-full bg-[#2ee59d] shadow-[0_0_10px_rgba(46,229,157,.7)]"
                      />
                    )}
                  </button>

                  {/* Team */}
                  <button
                    type="button"
                    onClick={() => setIsTeam(true)}
                    className={`group relative overflow-hidden rounded border p-4 text-left transition-all duration-300 ${
                      isTeam
                        ? "border-[#2ee59d]/50 bg-[#2ee59d]/[0.07] shadow-[0_0_25px_rgba(46,229,157,.06)]"
                        : "border-white/[0.08] bg-white/[0.015] hover:border-white/[0.16]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className={`font-mono text-[9px] font-bold uppercase tracking-[0.16em] ${
                            isTeam
                              ? "text-[#2ee59d]"
                              : "text-white/40"
                          }`}
                        >
                          SQUAD FORMATION
                        </span>

                        <span className="mt-1 block text-[10px] text-white/25">
                          Multi-operative deployment
                        </span>
                      </div>

                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[9px] ${
                          isTeam
                            ? "border-[#2ee59d]/50 bg-[#2ee59d]/10 text-[#2ee59d]"
                            : "border-white/10 text-white/20"
                        }`}
                      >
                        02
                      </span>
                    </div>

                    {isTeam && (
                      <motion.div
                        layoutId="mode-indicator"
                        className="absolute bottom-0 left-0 h-px w-full bg-[#2ee59d] shadow-[0_0_10px_rgba(46,229,157,.7)]"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* =================================================
                  TEAM DETAILS
              ================================================== */}

              <AnimatePresence initial={false}>
                {isTeam && (
                  <motion.div
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            height: 0,
                            y: -8,
                          }
                    }
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: 1,
                            height: "auto",
                            y: 0,
                          }
                    }
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            height: 0,
                            y: -8,
                          }
                    }
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="relative rounded border border-[#2ee59d]/20 bg-black/20 p-5 md:p-6">
                      {/* Corner */}
                      <div className="absolute right-0 top-0 h-7 w-7 border-r border-t border-[#2ee59d]/25" />

                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#2ee59d]/55">
                            Squad Configuration
                          </span>

                          <h4 className="mt-1 font-display text-sm font-semibold text-paper">
                            SQUAD DETAILS
                          </h4>
                        </div>

                        <span className="font-mono text-[8px] text-white/20">
                          TEAM_MODE: ON
                        </span>
                      </div>

                      <div className="space-y-5">
                        {/* Team name */}
                        <div>
                          <label
                            htmlFor="teamName"
                            className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/35"
                          >
                            Squad / Team Name
                          </label>

                          <input
                            id="teamName"
                            type="text"
                            required={isTeam}
                            value={teamName}
                            onChange={(e) =>
                              setTeamName(e.target.value)
                            }
                            placeholder="e.g. CyberViper Squad"
                            className="mt-2 w-full rounded border border-white/[0.08] bg-[#020504]/70 px-4 py-3 font-mono text-sm text-paper outline-none transition-all placeholder:text-white/15 focus:border-[#2ee59d]/50 focus:bg-[#2ee59d]/[0.025] focus:shadow-[0_0_20px_rgba(46,229,157,.05)]"
                          />
                        </div>

                        {/* Member count */}
                        <div>
                          <label
                            htmlFor="members"
                            className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/35"
                          >
                            Operative Count
                          </label>

                          <select
                            id="members"
                            value={memberCount}
                            onChange={(e) =>
                              setMemberCount(
                                parseInt(e.target.value, 10)
                              )
                            }
                            className="mt-2 w-full rounded border border-white/[0.08] bg-[#020504]/70 px-4 py-3 font-mono text-sm text-paper outline-none transition-all focus:border-[#2ee59d]/50"
                          >
                            <option value={2}>2 Operatives</option>
                            <option value={3}>3 Operatives</option>
                            <option value={4}>4 Operatives</option>
                          </select>

                          {/* Squad telemetry */}
                          <div className="mt-3 flex items-center gap-3">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                              <motion.div
                                animate={{
                                  width: `${(memberCount / 4) * 100}%`,
                                }}
                                transition={{ duration: 0.35 }}
                                className="h-full bg-[#2ee59d] shadow-[0_0_8px_rgba(46,229,157,.5)]"
                              />
                            </div>

                            <span className="font-mono text-[8px] text-white/25">
                              {memberCount}/4
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* =================================================
                  LEAD OPERATIVE
              ================================================== */}

              <div>
                <label
                  htmlFor="leadName"
                  className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/35"
                >
                  Lead Operative Name
                </label>

                <input
                  id="leadName"
                  type="text"
                  required
                  placeholder="Arjun V."
                  className="mt-2 w-full rounded border border-white/[0.08] bg-[#020504]/60 px-4 py-3 font-mono text-sm text-paper outline-none transition-all placeholder:text-white/15 focus:border-[#2ee59d]/50 focus:bg-[#2ee59d]/[0.025]"
                />
              </div>

              {/* =================================================
                  CONTACT DETAILS
              ================================================== */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/35"
                  >
                    Contact Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="arjun@duk.ac.in"
                    className="mt-2 w-full rounded border border-white/[0.08] bg-[#020504]/60 px-4 py-3 font-mono text-sm text-paper outline-none transition-all placeholder:text-white/15 focus:border-[#2ee59d]/50 focus:bg-[#2ee59d]/[0.025]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/35"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="mt-2 w-full rounded border border-white/[0.08] bg-[#020504]/60 px-4 py-3 font-mono text-sm text-paper outline-none transition-all placeholder:text-white/15 focus:border-[#2ee59d]/50 focus:bg-[#2ee59d]/[0.025]"
                  />
                </div>
              </div>

              {/* =================================================
                  SUBMIT AREA
              ================================================== */}

              <div className="border-t border-white/[0.07] pt-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
                      Registration Fee
                    </span>

                    <span className="mt-1 block font-mono text-base font-bold text-[#2ee59d]">
                      {event.fee}
                    </span>
                  </div>

                  <Button type="submit" variant="primary">
                    Confirm & Add to Loadout →
                  </Button>
                </div>

                {/* Security notice */}
                <div className="mt-5 flex items-start gap-3 rounded border border-white/[0.05] bg-black/15 px-4 py-3">
                  <span className="mt-0.5 text-[10px] text-[#2ee59d]/60">
                    ◆
                  </span>

                  <p className="font-mono text-[8px] uppercase leading-5 tracking-[0.08em] text-white/20">
                    Submission will reserve your event slot and
                    synchronize this registration with your VYUHAM&apos;26
                    participant profile.
                  </p>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================
          BOTTOM STATUS BAR
      ========================================================== */}

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] bg-black/20 px-5 py-3 md:px-7">
        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/20">
          VYUHAM&apos;26 // ACCESS CONTROL
        </span>

        <div className="flex items-center gap-3 font-mono text-[7px] uppercase tracking-[0.18em]">
          <span className="h-1 w-1 rounded-full bg-[#2ee59d]/70" />
          <span className="text-white/20">SECURE CHANNEL</span>
          <span className="text-[#2ee59d]/40">ONLINE</span>
        </div>
      </div>
    </div>
  );
}
