"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function LoginPage() {
  const reduceMotion = usePrefersReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<
    "idle" | "verifying" | "success"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("verifying");

    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  const inputClasses =
    "mt-2 w-full border border-white/10 bg-[#07100c]/80 px-4 py-3.5 font-mono text-sm text-paper placeholder:text-muted/35 outline-none backdrop-blur-md transition-all duration-300 focus:border-green/50 focus:bg-green/[0.035] focus:ring-1 focus:ring-green/20";

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen flex-1 overflow-hidden bg-[#030705] pt-23 text-paper">

        {/* ============================================================
            FUTURE ENVIRONMENT
        ============================================================ */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

          {/* Main green atmosphere */}
          <div className="absolute left-1/2 top-[5%] h-162.5 w-212.5 -translate-x-1/2 rounded-full bg-green/4.5 blur-[150px]" />

          {/* Lower atmosphere */}
          <div className="absolute bottom-[-20%] right-[-15%] h-125 w-125 rounded-full bg-green/2.5 blur-[130px]" />

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
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}

          {/* Vertical system lines */}
          {!reduceMotion && (
            <>
              <motion.div
                className="absolute left-[12%] top-0 h-full w-px bg-linear-to-b from-transparent via-green/10 to-transparent"
                animate={{ opacity: [0.2, 0.7, 0.2] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />

              <motion.div
                className="absolute right-[12%] top-0 h-full w-px bg-linear-to-b from-transparent via-green/10 to-transparent"
                animate={{ opacity: [0.7, 0.2, 0.7] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              />
            </>
          )}
        </div>

        <section className="relative py-20 md:py-28">

          <div className="mx-auto w-[min(540px,calc(100%-40px))]">

            {/* ========================================================
                ACCESS HEADER
            ======================================================== */}
            <AnimatedSection>
              <div className="relative overflow-hidden border border-white/10 bg-black/30 p-6 text-center backdrop-blur-xl md:p-8">

                {/* Corner brackets */}
                <div className="absolute left-0 top-0 h-9 w-9 border-l border-t border-green/50" />
                <div className="absolute right-0 top-0 h-9 w-9 border-r border-t border-green/50" />
                <div className="absolute bottom-0 left-0 h-9 w-9 border-b border-l border-green/30" />
                <div className="absolute bottom-0 right-0 h-9 w-9 border-b border-r border-green/30" />

                {/* Top signal */}
                <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-green/70 to-transparent" />

                {/* Network identifier */}
                <div className="mb-6 flex items-center justify-center gap-3 font-mono text-[8px] uppercase tracking-[0.35em] text-green/70">
                  <span className="relative flex h-2 w-2">
                    {!reduceMotion && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-50" />
                    )}
                    <span className="relative h-2 w-2 rounded-full bg-green" />
                  </span>

                  VYUHAM&apos;26 // ACCESS NETWORK
                </div>

                <Kicker>Identity Checkpoint</Kicker>

                <h1 className="mt-4 font-display text-[clamp(42px,8vw,64px)] font-semibold leading-[0.9] tracking-tight">
                  AUTHENTICATE
                </h1>

                <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted">
                  Establish a secure connection to the VYUHAM&apos;26
                  command network using your registered credentials.
                </p>

                {/* System status */}
                <div className="mx-auto mt-7 flex max-w-sm items-center justify-between border border-green/10 bg-green/2.5 px-4 py-3 font-mono text-[8px] uppercase tracking-[0.2em]">
                  <span className="text-muted">
                    ACCESS GATEWAY
                  </span>

                  <span className="flex items-center gap-2 text-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_8px_rgba(80,255,150,.8)]" />
                    ONLINE
                  </span>
                </div>

                {/* Future message */}
                <div className="mt-7 flex items-center gap-3">
                  <span className="h-px flex-1 bg-linear-to-r from-transparent to-green/20" />

                  <span className="font-mono text-[8px] tracking-[0.3em] text-green/50">
                    THE FUTURE AWAITS
                  </span>

                  <span className="h-px flex-1 bg-linear-to-l from-transparent to-green/20" />
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                AUTHENTICATION TERMINAL
            ======================================================== */}
            <AnimatedSection delay={0.12}>
              <div className="relative mt-8 overflow-hidden border border-white/10 bg-[#050b08]/85 backdrop-blur-xl">

                {/* Terminal header */}
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-3 font-mono text-[8px] uppercase tracking-[0.25em]">

                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_10px_rgba(80,255,150,.8)]" />

                    <span className="text-muted">
                      AUTHENTICATION TERMINAL
                    </span>
                  </div>

                  <span className="hidden text-green/60 sm:block">
                    SECURE // V26
                  </span>
                </div>

                <div className="p-6 md:p-8">

                  <AnimatePresence mode="wait">

                    {/* ==================================================
                        SUCCESS
                    ================================================== */}
                    {status === "success" ? (
                      <motion.div
                        key="success"
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                scale: 0.95,
                              }
                        }
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        className="py-10 text-center"
                      >

                        {/* Authentication core */}
                        <div className="relative mx-auto mb-8 grid h-28 w-28 place-items-center">

                          {!reduceMotion && (
                            <>
                              <motion.div
                                className="absolute inset-0 rounded-full border border-green/30"
                                animate={{
                                  scale: [1, 1.35],
                                  opacity: [0.6, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                              />

                              <motion.div
                                className="absolute inset-3 rounded-full border border-green/20"
                                animate={{
                                  rotate: -360,
                                }}
                                transition={{
                                  duration: 6,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            </>
                          )}

                          <div className="relative grid h-20 w-20 place-items-center rounded-full border border-green/40 bg-green/10 shadow-[0_0_35px_rgba(80,255,150,.12)]">
                            <span className="text-4xl text-green">
                              ✓
                            </span>
                          </div>
                        </div>

                        <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-green">
                          IDENTITY HANDSHAKE VERIFIED
                        </div>

                        <h2 className="mt-4 font-display text-2xl font-semibold md:text-3xl">
                          IDENTITY
                          <br />
                          <span className="text-green">
                            CONFIRMED.
                          </span>
                        </h2>

                        <p className="mx-auto mt-4 max-w-md text-xs leading-7 text-muted">
                          Secure handshake complete. Your connection to the
                          VYUHAM&apos;26 command network has been established.
                        </p>

                        {/* Verification data */}
                        <div className="mx-auto mt-7 max-w-sm border border-green/10 bg-green/2 p-4 font-mono text-[8px] uppercase tracking-[0.2em]">

                          <div className="flex justify-between">
                            <span className="text-muted">
                              IDENTITY
                            </span>

                            <span className="text-green">
                              VERIFIED
                            </span>
                          </div>

                          <div className="mt-3 flex justify-between">
                            <span className="text-muted">
                              HANDSHAKE
                            </span>

                            <span className="text-green">
                              COMPLETE
                            </span>
                          </div>

                          <div className="mt-3 flex justify-between">
                            <span className="text-muted">
                              ACCESS
                            </span>

                            <span className="text-green">
                              GRANTED
                            </span>
                          </div>
                        </div>

                        <div className="mt-8">
                          <Button
                            href="/dashboard"
                            variant="primary"
                          >
                            Enter Dashboard →
                          </Button>
                        </div>
                      </motion.div>
                    ) : (

                      /* ==================================================
                          LOGIN FORM
                      ================================================== */
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 10,
                              }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="space-y-6"
                      >

                        {/* NODE */}
                        <div className="mb-7 flex items-center justify-between border-b border-white/5 pb-4">

                          <div>
                            <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-green">
                              NODE_01
                            </div>

                            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                              Identity verification
                            </div>
                          </div>

                          <span className="font-mono text-[8px] text-muted">
                            SECURE CHANNEL
                          </span>
                        </div>

                        {/* EMAIL */}
                        <div>
                          <label
                            htmlFor="email"
                            className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                          >
                            COMM IDENTIFIER *
                          </label>

                          <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="operator@duk.ac.in"
                            className={inputClasses}
                          />
                        </div>

                        {/* PASSWORD */}
                        <div>
                          <div className="flex items-center justify-between">
                            <label
                              htmlFor="password"
                              className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                            >
                              ACCESS CODE *
                            </label>

                            <a
                              href="#"
                              className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-green"
                            >
                              Reset code?
                            </a>
                          </div>

                          <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) =>
                              setPassword(e.target.value)
                            }
                            placeholder="••••••••••••"
                            className={inputClasses}
                          />
                        </div>

                        {/* VERIFYING */}
                        {status === "verifying" && (
                          <motion.div
                            initial={
                              reduceMotion
                                ? false
                                : { opacity: 0 }
                            }
                            animate={{ opacity: 1 }}
                            className="border border-green/10 bg-green/2.5 py-4"
                          >
                            <div className="flex items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-green">

                              <span className="relative flex h-2 w-2">
                                <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-60" />
                                <span className="relative h-2 w-2 rounded-full bg-green" />
                              </span>

                              INITIATING IDENTITY HANDSHAKE...
                            </div>

                            <div className="mx-auto mt-3 h-px max-w-xs overflow-hidden bg-green/10">
                              <motion.div
                                className="h-full bg-green"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{
                                  duration: 1.2,
                                  ease: "linear",
                                }}
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* BUTTON */}
                        <Button
                          type="submit"
                          variant="primary"
                          className="w-full justify-center"
                          disabled={status === "verifying"}
                        >
                          {status === "verifying"
                            ? "VERIFYING..."
                            : "AUTHENTICATE"}
                        </Button>

                        {/* SECURITY STATUS */}
                        <div className="flex items-center justify-center gap-2 border-t border-white/5 pt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                          <span className="h-1.5 w-1.5 rounded-full bg-green" />
                          Authentication channel secure
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* REGISTER */}
              <div className="mt-5 border border-white/5 bg-black/20 p-5 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-muted">

                New personnel?

                <Link
                  href="/signup"
                  className="ml-2 text-paper underline decoration-green/40 underline-offset-4 transition-colors hover:text-green"
                >
                  Register credentials
                </Link>
              </div>
            </AnimatedSection>

            {/* ========================================================
                BOTTOM SYSTEM SIGNAL
            ======================================================== */}
            <AnimatedSection delay={0.35}>
              <div className="mt-12 flex flex-col items-center text-center">

                <div className="flex w-full max-w-md items-center gap-4">
                  <span className="h-px flex-1 bg-linear-to-r from-transparent to-green/20" />

                  <span className="font-mono text-[7px] tracking-[0.3em] text-green/50">
                    ACCESS TERMINAL
                  </span>

                  <span className="h-px flex-1 bg-linear-to-l from-transparent to-green/20" />
                </div>

                <motion.div
                  className="mt-5 font-display text-lg uppercase tracking-[0.3em] text-white/15"
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

                <div className="mt-2 font-mono text-[7px] tracking-[0.3em] text-muted">
                  VYUHAM&apos;26 // ACCESS NETWORK
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
