"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import SealResolve from "@/components/motion/SealResolve";
import { Kicker, Button } from "@/components/ui/Elements";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function TicketPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);

    setTimeout(() => {
      setDownloaded(false);
    }, 2500);
  };

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#020504] pt-[92px] text-paper">

        {/* ============================================================
            BACKGROUND SYSTEM
        ============================================================ */}

        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          {/* Central ticket core */}
          <motion.div
            className="absolute left-1/2 top-[20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(46,229,157,.07), rgba(0,220,255,.018) 40%, transparent 70%)",
              filter: "blur(30px)",
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

          {/* Grid */}
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
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </div>

        <section className="py-16 md:py-24">
          <div className="mx-auto w-[min(620px,calc(100%-32px))] md:w-[min(620px,calc(100%-48px))]">

            {/* ========================================================
                HEADER
            ======================================================== */}

            <AnimatedSection>
              <div className="text-center">

                <div className="mb-5 flex items-center justify-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-40" />
                    <span className="relative h-2 w-2 rounded-full bg-green shadow-[0_0_12px_rgba(46,229,157,.9)]" />
                  </span>

                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-green">
                    Credential Network Online
                  </span>
                </div>

                <Kicker>Access Pass Materialization</Kicker>

                <h1 className="mt-3 font-display text-[40px] font-semibold leading-[0.9] tracking-tight md:text-[52px]">
                  DIGITAL{" "}
                  <em className="not-italic text-green [text-shadow:0_0_30px_rgba(46,229,157,.2)]">
                    TICKET
                  </em>
                </h1>

                <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-muted">
                  Present this credential at Technocity campus gates and event
                  venues for verified VYUHAM'26 access.
                </p>

                <div className="mt-5 flex items-center justify-center gap-4 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                  <span>NODE PASS-01</span>
                  <span className="text-white/20">/</span>
                  <span className="text-green">SECURE</span>
                  <span className="text-white/20">/</span>
                  <span>2026</span>
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                TICKET
            ======================================================== */}

            <AnimatedSection delay={0.15}>
              <SealResolve>
                <div className="relative mt-10 overflow-hidden rounded border border-green/20 bg-[#070a0b]/95 shadow-[0_0_60px_rgba(46,229,157,.04)]">

                  {/* ==================================================
                      TICKET CORNERS
                  ================================================== */}

                  <div className="absolute left-0 top-0 z-30 h-10 w-10 border-l border-t border-green/60" />
                  <div className="absolute right-0 top-0 z-30 h-10 w-10 border-r border-t border-green/30" />
                  <div className="absolute bottom-0 left-0 z-30 h-10 w-10 border-b border-l border-green/20" />
                  <div className="absolute bottom-0 right-0 z-30 h-10 w-10 border-b border-r border-green/20" />

                  {/* ==================================================
                      TICKET HEADER
                  ================================================== */}

                  <div className="relative border-b border-white/10 px-6 py-5 md:px-8">

                    <div className="flex items-center justify-between">

                      <div>
                        <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-green">
                          VYUHAM'26
                        </div>

                        <div className="mt-1 font-display text-xl font-semibold">
                          ACCESS CREDENTIAL
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                          STATUS
                        </div>

                        <div className="mt-1 flex items-center gap-2 font-mono text-[9px] font-bold text-green">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(46,229,157,.8)]" />
                          VALID
                        </div>
                      </div>
                    </div>

                    {/* ID strip */}
                    <div className="mt-5 flex items-center justify-between rounded border border-white/10 bg-black/30 px-3 py-2">
                      <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                        CREDENTIAL ID
                      </span>

                      <span className="font-mono text-[9px] text-green">
                        VYU26-QR-904812
                      </span>
                    </div>
                  </div>

                  {/* ==================================================
                      QR CORE
                  ================================================== */}

                  <div className="relative flex justify-center overflow-hidden px-6 py-10 md:px-8">

                    {/* ambient glow */}
                    <motion.div
                      className="absolute h-64 w-64 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(46,229,157,.13), transparent 68%)",
                        filter: "blur(20px)",
                      }}
                      animate={
                        reduceMotion
                          ? undefined
                          : {
                              scale: [0.9, 1.15, 0.9],
                              opacity: [0.45, 0.75, 0.45],
                            }
                      }
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* rotating technical ring */}
                    {!reduceMotion && (
                      <motion.div
                        className="absolute h-60 w-60 rounded-full border border-dashed border-green/10"
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}

                    {/* QR container */}
                    <div className="relative z-10">

                      {/* corner brackets */}
                      <div className="absolute -left-3 -top-3 h-8 w-8 border-l-2 border-t-2 border-green" />
                      <div className="absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-green" />
                      <div className="absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-green" />
                      <div className="absolute -bottom-3 -right-3 h-8 w-8 border-b-2 border-r-2 border-green" />

                      <div className="rounded-lg border border-green/60 bg-paper p-4 shadow-[0_0_35px_rgba(46,229,157,.18)]">

                        <div className="relative flex h-48 w-48 flex-col items-center justify-center overflow-hidden border-2 border-black p-3">

                          {/* simulated QR */}
                          <div className="grid h-40 w-40 grid-cols-7 gap-1">
                            {Array.from({ length: 49 }).map((_, i) => {
                              const active =
                                i % 3 === 0 ||
                                i % 5 === 0 ||
                                i % 7 === 0 ||
                                [0, 1, 2, 7, 14, 21, 42, 43, 44, 45, 46, 47, 48].includes(i);

                              return (
                                <div
                                  key={i}
                                  className={`rounded-[1px] ${
                                    active
                                      ? "bg-black"
                                      : "bg-black/10"
                                  }`}
                                />
                              );
                            })}
                          </div>

                          {/* QR scan beam */}
                          {!reduceMotion && (
                            <motion.div
                              className="absolute left-0 h-0.5 w-full bg-green shadow-[0_0_10px_rgba(46,229,157,.9)]"
                              initial={{ top: "5%" }}
                              animate={{ top: "95%" }}
                              transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="mt-4 text-center font-mono text-[7px] uppercase tracking-[0.2em] text-green">
                        SCAN FOR AUTHORIZATION
                      </div>
                    </div>
                  </div>

                  {/* ==================================================
                      ACCESS DATA
                  ================================================== */}

                  <div className="border-t border-white/10 px-6 py-6 md:px-8">

                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-green">
                          Identity Data
                        </div>

                        <div className="mt-1 font-display text-lg font-semibold">
                          OPERATIVE RECORD
                        </div>
                      </div>

                      <span className="font-mono text-[8px] text-muted">
                        06 FIELDS
                      </span>
                    </div>

                    <div className="space-y-3 font-mono text-[9px]">

                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-muted">OPERATIVE</span>
                        <strong className="text-paper">
                          Arjun V. Nair
                        </strong>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-muted">PASS ID</span>
                        <strong className="text-green">
                          VYU26-QR-904812
                        </strong>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-muted">ACCESS LEVEL</span>
                        <strong className="text-paper">
                          ALL-ACCESS
                        </strong>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-muted">VALIDITY</span>
                        <strong className="text-paper">
                          30 OCT — 01 NOV 2026
                        </strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted">VENUE</span>
                        <strong className="text-paper">
                          DUK CAMPUS / TECHNOCITY
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* ==================================================
                      SECURITY STRIP
                  ================================================== */}

                  <div className="border-t border-white/10 bg-black/20 px-6 py-4 md:px-8">

                    <div className="grid grid-cols-3 gap-3">

                      <div className="text-center">
                        <div className="font-mono text-[7px] uppercase tracking-wider text-muted">
                          Identity
                        </div>

                        <div className="mt-1 font-mono text-[8px] text-green">
                          VERIFIED
                        </div>
                      </div>

                      <div className="border-x border-white/10 text-center">
                        <div className="font-mono text-[7px] uppercase tracking-wider text-muted">
                          Credential
                        </div>

                        <div className="mt-1 font-mono text-[8px] text-green">
                          ACTIVE
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="font-mono text-[7px] uppercase tracking-wider text-muted">
                          Access
                        </div>

                        <div className="mt-1 font-mono text-[8px] text-green">
                          GRANTED
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ==================================================
                      ACTIONS
                  ================================================== */}

                  <div className="flex flex-col gap-3 border-t border-white/10 p-6 md:flex-row md:px-8">

                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex-1 justify-center"
                    >
                      {downloaded
                        ? "✓ PASS SAVED"
                        : "SAVE PASS (PDF) ↓"}
                    </Button>

                    <Button
                      href="/dashboard"
                      variant="primary"
                      className="flex-1 justify-center"
                    >
                      DASHBOARD →
                    </Button>
                  </div>
                </div>
              </SealResolve>
            </AnimatedSection>

            {/* ========================================================
                SECURITY NOTICE
            ======================================================== */}

            <AnimatedSection delay={0.25}>
              <div className="mt-7 rounded border border-white/10 bg-[#070a0b]/60 p-4">

                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-green/30 text-[9px] text-green">
                    ✓
                  </div>

                  <div>
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-green">
                      Credential Security Notice
                    </div>

                    <p className="mt-1 text-[10px] leading-5 text-muted">
                      This digital pass is linked to the registered operative
                      identity. Do not share your QR credential with another
                      attendee.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                FOOTER STATUS
            ======================================================== */}

            <AnimatedSection delay={0.3}>
              <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-muted sm:flex-row">
                <span>
                  VYUHAM'26 • CREDENTIAL NETWORK
                </span>

                <span>
                  <span className="text-green">●</span>{" "}
                  PASS AUTHENTICATION READY
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
