"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import SignalRing from "@/components/motion/SignalRing";
import { Kicker, Button, Chip, StreamBadge } from "@/components/ui/Elements";
import { type Event } from "@/data/events";
import { useAuth } from "@/context/AuthContext";

interface EventDetailClientProps {
  event: Event;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isEventRegistered, registerForEvent } = useAuth();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const isRegistered = isEventRegistered(event.slug);

  // Check if redirected back after authenticating with intent to register
  useEffect(() => {
    if (searchParams.get("registered") === "true" && isAuthenticated) {
      registerForEvent(event.slug);
      setShowSuccessModal(true);
    }
  }, [searchParams, isAuthenticated, event.slug, registerForEvent]);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      // User is not signed in: move to sign in page
      router.push(`/login?redirect=/events/${event.slug}&event=${event.slug}`);
      return;
    }

    // User is signed in: show registered successfully
    setIsRegistering(true);
    setTimeout(() => {
      registerForEvent(event.slug);
      setIsRegistering(false);
      setShowSuccessModal(true);
    }, 400);
  };

  const dayLabel =
    event.day === 1
      ? "30 OCTOBER"
      : event.day === 2
        ? "31 OCTOBER"
        : "01 NOVEMBER";

  return (
    <>
      <Navbar />

      <main className="relative flex-1 overflow-hidden bg-[#020504] pt-[92px] text-paper">

        {/* =========================================================
            BACKGROUND SYSTEM
        ========================================================== */}

        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[8%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#c8ff42]/[0.035] blur-[150px]" />

          <div className="absolute -left-[220px] top-[40%] h-[480px] w-[480px] rounded-full bg-[#c8ff42]/[0.02] blur-[130px]" />

          <div className="absolute -right-[220px] top-[65%] h-[480px] w-[480px] rounded-full bg-[#c8ff42]/[0.018] blur-[130px]" />

          {/* Main grid */}
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
            className="absolute inset-0 opacity-[0.02]"
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
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,.25) 4px)",
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,rgba(0,0,0,.72)_100%)]" />
        </div>

        <section className="relative py-20 md:py-28">
          <div className="mx-auto w-[min(1200px,calc(100%-40px))] md:w-[min(1200px,calc(100%-64px))]">

            {/* =====================================================
                BREADCRUMB / TELEMETRY
            ====================================================== */}

            <AnimatedSection>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
                <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em]">
                  <Link
                    href="/events"
                    className="text-white/30 no-underline transition-colors hover:text-[#c8ff42]"
                  >
                    Events
                  </Link>

                  <span className="text-white/15">/</span>

                  <span className="text-[#c8ff42]/60">
                    {event.title}
                  </span>
                </div>

                <div className="flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">
                  <span>EVENT NODE: {String(event.day).padStart(2, "0")}</span>

                  <span className="hidden sm:inline">
                    PROTOCOL: ACTIVE
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                HERO / EVENT IDENTITY
            ====================================================== */}

            <AnimatedSection delay={0.1}>
              <div className="relative mt-10 overflow-hidden rounded border border-white/[0.08] bg-[#07100c]/65 p-7 backdrop-blur-xl md:p-10">

                {/* Corner brackets */}
                <div className="absolute left-0 top-0 h-12 w-12 border-l border-t border-[#c8ff42]/35" />
                <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-[#c8ff42]/35" />
                <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-[#c8ff42]/20" />
                <div className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-[#c8ff42]/20" />

                {/* Ambient glow */}
                <div className="pointer-events-none absolute right-[10%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#c8ff42]/[0.035] blur-[100px]" />

                <div className="relative">

                  {/* Event status */}
                  <div className="flex flex-wrap items-center gap-3">
                    <StreamBadge stream={event.stream} />
                    <Chip variant={event.status}>
                      {event.status}
                    </Chip>

                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">
                      // MISSION DOSSIER
                    </span>
                  </div>

                  {/* Title */}
                  <motion.h1
                    initial={{
                      opacity: 0,
                      y: 25,
                      filter: "blur(8px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    transition={{
                      duration: 0.75,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-7 max-w-5xl font-display text-[clamp(30px,7vw,88px)] font-semibold leading-[0.95] tracking-[-0.045em] break-words"
                  >
                    {event.title.toUpperCase()}
                  </motion.h1>

                  <p className="mt-7 max-w-3xl text-sm leading-[1.85] text-white/45 md:text-base">
                    {event.description}
                  </p>

                  {/* Hero telemetry */}
                  <div className="mt-9 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-6 sm:grid-cols-4">

                    <div>
                      <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-white/20">
                        EVENT DAY
                      </span>
                      <span className="mt-1 block font-mono text-xs font-bold text-[#c8ff42]/80">
                        DAY {event.day}
                      </span>
                    </div>

                    <div>
                      <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-white/20">
                        DATE
                      </span>
                      <span className="mt-1 block font-mono text-xs font-bold text-white/65">
                        {dayLabel}
                      </span>
                    </div>

                    <div>
                      <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-white/20">
                        TIME
                      </span>
                      <span className="mt-1 block font-mono text-xs font-bold text-white/65">
                        {event.time}
                      </span>
                    </div>

                    <div>
                      <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-white/20">
                        TEAM SIZE
                      </span>
                      <span className="mt-1 block font-mono text-xs font-bold text-white/65">
                        {event.teamSize}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                DOSSIER GRID
            ====================================================== */}

            <div className="mt-8 grid gap-6 lg:grid-cols-3">

              {/* ===================================================
                  EVENT DETAILS
              ==================================================== */}

              <AnimatedSection delay={0.15}>
                <div className="relative h-full overflow-hidden rounded border border-white/[0.08] bg-[#07100c]/65 p-6 backdrop-blur-xl">

                  <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-[#c8ff42]/20" />

                  <Kicker>{"// Event details"}</Kicker>

                  <div className="mt-6 space-y-5">
                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
                        Day
                      </span>

                      <strong className="mt-1 block font-display text-sm text-paper">
                        Day {event.day} — {dayLabel}
                      </strong>
                    </div>

                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
                        Time
                      </span>

                      <strong className="mt-1 block font-display text-sm text-paper">
                        {event.time}
                      </strong>
                    </div>

                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
                        Venue
                      </span>

                      <strong className="mt-1 block font-display text-sm leading-6 text-paper">
                        {event.venue}
                      </strong>
                    </div>

                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
                        Team Size
                      </span>

                      <strong className="mt-1 block font-display text-sm text-paper">
                        {event.teamSize}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-7 border-t border-white/[0.06] pt-4">
                    <div className="flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.18em]">
                      <span className="text-white/20">
                        Event Node
                      </span>

                      <span className="text-[#c8ff42]/50">
                        ONLINE
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* ===================================================
                  RULES
              ==================================================== */}

              <AnimatedSection delay={0.2}>
                <div className="relative h-full overflow-hidden rounded border border-white/[0.08] bg-[#07100c]/65 p-6 backdrop-blur-xl">

                  <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-[#c8ff42]/20" />

                  <Kicker>{"// Rules & guidelines"}</Kicker>

                  <div className="mt-6 space-y-4">
                    {event.rules.map((rule, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        whileInView={{
                          opacity: 1,
                          x: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.35,
                          delay: i * 0.05,
                        }}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#c8ff42]/20 bg-[#c8ff42]/[0.04] font-mono text-[7px] text-[#c8ff42]/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="text-xs leading-[1.7] text-white/40">
                          {rule}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* ===================================================
                  PRIZES / ELIGIBILITY
              ==================================================== */}

              <AnimatedSection delay={0.25}>
                <div className="space-y-6">

                  {/* Prize */}
                  <div className="relative overflow-hidden rounded border border-[#c8ff42]/15 bg-[#07100c]/70 p-6 backdrop-blur-xl">

                    <SignalRing
                      className="right-[-10px] top-[-10px] opacity-40"
                      size={90}
                      count={2}
                      duration={3.5}
                      color="rgba(200,255,66,0.3)"
                    />

                    <div className="relative">
                      <Kicker>{"// Prizes"}</Kicker>

                      <span className="mt-5 block font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                        Reward Allocation
                      </span>

                      <p className="mt-2 font-display text-2xl font-semibold text-[#c8ff42] [text-shadow:0_0_20px_rgba(200,255,66,.2)]">
                        {event.prizes}
                      </p>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div className="relative overflow-hidden rounded border border-white/[0.08] bg-[#07100c]/65 p-6 backdrop-blur-xl">
                    <Kicker>{"// Eligibility"}</Kicker>

                    <p className="mt-5 text-xs leading-[1.75] text-white/40">
                      {event.eligibility}
                    </p>
                  </div>

                  {/* Register Block */}
                  {isRegistered ? (
                    <div className="space-y-3">
                      <div className="flex w-full items-center justify-center gap-2.5 rounded border border-[#c8ff42]/60 bg-[#c8ff42]/10 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#c8ff42] shadow-[0_0_25px_rgba(200,255,66,0.15)]">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c8ff42] opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c8ff42]" />
                        </span>
                        ✓ REGISTERED SUCCESSFULLY
                      </div>

                      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-white/40">
                        <span>PASS: VYU26-ACTIVE</span>
                        <Link
                          href="/dashboard"
                          className="text-[#c8ff42] underline decoration-[#c8ff42]/40 underline-offset-4 transition-colors hover:text-white"
                        >
                          View in Dashboard →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRegisterClick}
                      disabled={isRegistering}
                      className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden border border-[#c8ff42]/50 bg-[#c8ff42]/10 px-6 py-4 font-mono text-xs font-extrabold uppercase tracking-[0.18em] text-[#c8ff42] transition-all duration-300 hover:border-[#c8ff42] hover:bg-[#c8ff42]/20 hover:shadow-[0_0_30px_rgba(200,255,66,0.2)] active:scale-[0.99] disabled:opacity-70"
                    >
                      {/* Button scan */}
                      <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-[#c8ff42]/30 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]" />

                      <span className="relative z-10 flex items-center gap-2">
                        {isRegistering ? (
                          <>
                            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#c8ff42] border-t-transparent" />
                            CONFIRMING PROTOCOL...
                          </>
                        ) : (
                          <>
                            Register for this event
                            <span className="ml-2 text-base transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </>
                        )}
                      </span>
                    </button>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* =====================================================
                FINAL EVENT STATUS
            ====================================================== */}

            <AnimatedSection delay={0.35}>
              <div className="mt-8 flex flex-col justify-between gap-5 rounded border border-white/[0.07] bg-black/20 px-5 py-5 sm:flex-row sm:items-center md:px-7">

                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-[#c8ff42] opacity-30" />
                    <span className="relative h-2 w-2 rounded-full bg-[#c8ff42] shadow-[0_0_9px_#c8ff42]" />
                  </span>

                  <div>
                    <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-[#c8ff42]/65">
                      Event Protocol Active
                    </span>

                    <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.15em] text-white/20">
                      VYUHAM&apos;26 // MISSION NODE
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 font-mono text-[7px] uppercase tracking-[0.16em] text-white/20">
                  <span>
                    STREAM:{" "}
                    <span className="text-white/40">
                      {event.stream}
                    </span>
                  </span>

                  <span>
                    STATUS:{" "}
                    <span className="text-[#c8ff42]/50">
                      {event.status}
                    </span>
                  </span>

                  <span>
                    ACCESS:{" "}
                    <span className="text-[#c8ff42]/50">
                      PUBLIC
                    </span>
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* =========================================================
            SUCCESS REGISTRATION MODAL
        ========================================================= */}
        <AnimatePresence>
          {showSuccessModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSuccessModal(false)}
                className="fixed inset-0 bg-[#020504]/85 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-lg overflow-hidden rounded border border-[#c8ff42]/40 bg-[#06100b]/95 p-6 shadow-[0_0_80px_rgba(200,255,66,0.18)] backdrop-blur-2xl md:p-8"
              >
                {/* Corner brackets */}
                <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-[#c8ff42]" />
                <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-[#c8ff42]" />
                <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-[#c8ff42]" />
                <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-[#c8ff42]" />

                {/* Holographic icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#c8ff42]/40 bg-[#c8ff42]/10 text-3xl text-[#c8ff42] shadow-[0_0_30px_rgba(200,255,66,0.3)]">
                  ✓
                </div>

                {/* Status text */}
                <div className="mt-5 text-center">
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#c8ff42]/70">
                    PROTOCOL CONFIRMED // ENLISTMENT COMPLETE
                  </span>

                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-paper md:text-3xl">
                    REGISTERED SUCCESSFULLY!
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/50">
                    You are officially registered for{" "}
                    <strong className="text-paper">{event.title}</strong>. Your mission dossier and event credentials are now active.
                  </p>
                </div>

                {/* Telemetry Box */}
                <div className="mt-6 rounded border border-white/[0.08] bg-black/40 p-4 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-white/30 uppercase">OPERATIVE</span>
                    <span className="text-paper">{user?.name || "AUTHENTICATED OPERATIVE"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] py-2">
                    <span className="text-white/30 uppercase">EVENT</span>
                    <span className="text-[#c8ff42]">{event.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] py-2">
                    <span className="text-white/30 uppercase">TIMING</span>
                    <span className="text-paper">DAY {event.day} // {event.time}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-white/30 uppercase">STATUS</span>
                    <span className="font-bold text-[#c8ff42]">PASS ACTIVE // SEATS RESERVED</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/dashboard"
                    className="flex-1 rounded border border-[#c8ff42] bg-[#c8ff42] py-3 text-center font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#06100b] shadow-[0_0_20px_rgba(200,255,66,0.3)] transition-all hover:bg-[#d8ff66]"
                  >
                    Go to Dashboard →
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 rounded border border-white/10 bg-white/[0.04] py-3 text-center font-mono text-xs uppercase tracking-[0.16em] text-white/60 transition-all hover:bg-white/[0.08] hover:text-white"
                  >
                    Continue Browsing
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
