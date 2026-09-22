"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import AuthTransition from "@/components/motion/AuthTransition";

import { Kicker, Button } from "@/components/ui/Elements";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function SignupPage() {
  const reduceMotion = usePrefersReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState<
    "idle" | "registering" | "success"
  >("idle");

  const [authTransition, setAuthTransition] = useState(false);
  const [loginTransition, setLoginTransition] = useState(false);
  const [error, setError] = useState("");

  /* =============================================================
     REGISTER
  ============================================================= */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.college ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("ALL REQUIRED IDENTITY PARAMETERS MUST BE PROVIDED.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("ACCESS CODES DO NOT MATCH.");
      return;
    }

    setStatus("registering");

    setTimeout(() => {
      setStatus("success");

      /*
       * Let the success screen appear briefly,
       * then launch the cinematic transition.
       */
      setTimeout(() => {
        setAuthTransition(true);
      }, 700);
    }, 1400);
  };

  /* =============================================================
     INPUT STYLING
  ============================================================= */

  const inputClasses =
    "mt-2 w-full border border-white/10 bg-[#07100c]/80 px-4 py-3 font-mono text-sm text-paper placeholder:text-muted/35 outline-none backdrop-blur-md transition-all duration-300 focus:border-green/50 focus:bg-green/[0.035] focus:ring-1 focus:ring-green/20";

  return (
    <>
      {/* =========================================================
          AUTHENTICATION TRANSITIONS
      ========================================================= */}

      <AuthTransition
        active={authTransition}
        destination="/profile"
        label="PROVISIONING IDENTITY"
      />

      <AuthTransition
        active={loginTransition}
        destination="/login"
        label="OPENING AUTHENTICATION"
      />

      <Navbar />

      {/* =========================================================
          MAIN
      ========================================================= */}

      <main className="relative min-h-screen flex-1 overflow-hidden bg-[#030705] pt-[92px] text-paper">

        {/* =======================================================
            FUTURE ENVIRONMENT
        ======================================================= */}

        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

          {/* main atmosphere */}
          <div className="absolute left-1/2 top-[5%] h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-green/[0.045] blur-[150px]" />

          {/* secondary glow */}
          <div className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-green/[0.025] blur-[130px]" />

          {/* grid */}
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

          {/* scan beam */}
          {!reduceMotion && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green/30 to-transparent"
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

          {/* vertical energy lines */}
          {!reduceMotion && (
            <>
              <motion.div
                className="absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-green/10 to-transparent"
                animate={{
                  opacity: [0.2, 0.7, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />

              <motion.div
                className="absolute right-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-green/10 to-transparent"
                animate={{
                  opacity: [0.7, 0.2, 0.7],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              />
            </>
          )}
        </div>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}

        <section className="relative py-20 md:py-28">

          <div className="mx-auto w-[min(680px,calc(100%-40px))]">

            {/* ===================================================
                SYSTEM HEADER
            =================================================== */}

            <AnimatedSection>
              <div className="relative overflow-hidden border border-white/10 bg-black/30 p-6 text-center backdrop-blur-xl md:p-8">

                {/* corner brackets */}
                <div className="absolute left-0 top-0 h-9 w-9 border-l border-t border-green/50" />
                <div className="absolute right-0 top-0 h-9 w-9 border-r border-t border-green/50" />
                <div className="absolute bottom-0 left-0 h-9 w-9 border-b border-l border-green/30" />
                <div className="absolute bottom-0 right-0 h-9 w-9 border-b border-r border-green/30" />

                {/* top signal */}
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-green/70 to-transparent" />

                {/* network identifier */}
                <div className="mb-6 flex items-center justify-center gap-3 font-mono text-[8px] uppercase tracking-[0.35em] text-green/70">

                  <span className="relative flex h-2 w-2">
                    {!reduceMotion && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-50" />
                    )}

                    <span className="relative h-2 w-2 rounded-full bg-green" />
                  </span>

                  VYUHAM&apos;26 // IDENTITY NETWORK
                </div>

                <Kicker>Identity Checkpoint</Kicker>

                <h1 className="mt-4 font-display text-[clamp(38px,7vw,64px)] font-semibold leading-[0.9] tracking-tight">
                  REGISTER
                  <br />
                  <span className="text-green">
                    CREDENTIALS
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted">
                  Create your VYUHAM&apos;26 identity and enter the future
                  network. Your credentials will be used for event
                  registration and pass generation.
                </p>

                {/* system status */}
                <div className="mx-auto mt-7 flex max-w-sm items-center justify-between border border-green/10 bg-green/[0.025] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.2em]">

                  <span className="text-muted">
                    IDENTITY SYSTEM
                  </span>

                  <span className="flex items-center gap-2 text-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_8px_rgba(80,255,150,.8)]" />
                    ONLINE
                  </span>
                </div>

                {/* future message */}
                <div className="mt-7 flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-green/20" />

                  <span className="font-mono text-[8px] tracking-[0.3em] text-green/50">
                    THE FUTURE AWAITS
                  </span>

                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-green/20" />
                </div>
              </div>
            </AnimatedSection>

            {/* ===================================================
                REGISTRATION TERMINAL
            =================================================== */}

            <AnimatedSection delay={0.12}>
              <div className="relative mt-8 overflow-hidden border border-white/10 bg-[#050b08]/85 backdrop-blur-xl">

                {/* terminal header */}
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-3 font-mono text-[8px] uppercase tracking-[0.25em]">

                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_10px_rgba(80,255,150,.8)]" />

                    <span className="text-muted">
                      CREDENTIAL PROVISIONING TERMINAL
                    </span>
                  </div>

                  <span className="hidden text-green/60 sm:block">
                    SECURE // V26
                  </span>
                </div>

                <div className="p-6 md:p-8">

                  <AnimatePresence mode="wait">

                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {status === "success" ? (
                      <motion.div
                        key="success"
                        initial={
                          reduceMotion
                            ? false
                            : {
                                opacity: 0,
                                scale: 0.96,
                              }
                        }
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        className="py-10 text-center"
                      >

                        {/* identity core */}
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
                                  rotate: 360,
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
                          PERSONNEL RECORD
                          <br />
                          <span className="text-green">
                            CREATED.
                          </span>
                        </h2>

                        <p className="mx-auto mt-4 max-w-md text-xs leading-7 text-muted">
                          Your VYUHAM ID has been provisioned successfully.
                          The identity network is ready for the next stage.
                        </p>

                        {/* provision data */}
                        <div className="mx-auto mt-7 max-w-sm border border-green/10 bg-green/[0.02] p-4 font-mono text-[8px] uppercase tracking-[0.2em]">

                          <div className="flex justify-between">
                            <span className="text-muted">
                              RECORD
                            </span>

                            <span className="text-green">
                              PROVISIONED
                            </span>
                          </div>

                          <div className="mt-3 flex justify-between">
                            <span className="text-muted">
                              IDENTITY
                            </span>

                            <span className="text-green">
                              VERIFIED
                            </span>
                          </div>

                          <div className="mt-3 flex justify-between">
                            <span className="text-muted">
                              NETWORK
                            </span>

                            <span className="text-green">
                              ACTIVE
                            </span>
                          </div>
                        </div>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                          <Button
                            href="/profile"
                            variant="outline"
                          >
                            View Profile
                          </Button>

                          <Button
                            href="/register"
                            variant="primary"
                          >
                            Event Registration →
                          </Button>
                        </div>
                      </motion.div>
                    ) : (

                      /* =================================================
                         FORM
                      ================================================= */

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
                        className="space-y-5"
                      >

                        {/* FORM NODE */}

                        <div className="mb-7 flex items-center justify-between border-b border-white/5 pb-4">

                          <div>
                            <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-green">
                              NODE_01
                            </div>

                            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                              Identity parameters
                            </div>
                          </div>

                          <span className="font-mono text-[8px] text-muted">
                            REQUIRED FIELDS *
                          </span>
                        </div>

                        {/* NAME + PHONE */}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                          <div>
                            <label
                              htmlFor="name"
                              className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                            >
                              FULL NAME *
                            </label>

                            <input
                              id="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Arjun V."
                              className={inputClasses}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="phone"
                              className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                            >
                              CONTACT NUMBER *
                            </label>

                            <input
                              id="phone"
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="+91 98765 43210"
                              className={inputClasses}
                            />
                          </div>

                        </div>

                        {/* EMAIL */}

                        <div>
                          <label
                            htmlFor="email"
                            className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                          >
                            EMAIL ADDRESS *
                          </label>

                          <input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="operator@university.edu"
                            className={inputClasses}
                          />
                        </div>

                        {/* COLLEGE */}

                        <div>
                          <label
                            htmlFor="college"
                            className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                          >
                            COLLEGE / INSTITUTION *
                          </label>

                          <input
                            id="college"
                            type="text"
                            required
                            value={formData.college}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                college: e.target.value,
                              })
                            }
                            placeholder="Digital University Kerala"
                            className={inputClasses}
                          />
                        </div>

                        {/* CREDENTIAL NODE */}

                        <div className="mt-7 border-t border-white/5 pt-6">

                          <div className="mb-5">
                            <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-green">
                              NODE_02
                            </div>

                            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                              Access credentials
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                              <label
                                htmlFor="password"
                                className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                              >
                                ACCESS CODE *
                              </label>

                              <input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    password: e.target.value,
                                  })
                                }
                                placeholder="••••••••••••"
                                className={inputClasses}
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="confirmPassword"
                                className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                              >
                                CONFIRM CODE *
                              </label>

                              <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    confirmPassword: e.target.value,
                                  })
                                }
                                placeholder="••••••••••••"
                                className={inputClasses}
                              />
                            </div>

                          </div>
                        </div>

                        {/* ERROR */}

                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                height: 0,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                              }}
                              className="overflow-hidden"
                            >
                              <div className="border border-red-400/20 bg-red-400/[0.03] px-4 py-3 text-center font-mono text-[8px] uppercase tracking-[0.12em] text-red-300">
                                {error}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* PROVISIONING */}

                        {status === "registering" && (
                          <motion.div
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
                            className="border border-green/10 bg-green/[0.025] py-4"
                          >

                            <div className="flex items-center justify-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-green">

                              <span className="relative flex h-2 w-2">
                                <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-60" />

                                <span className="relative h-2 w-2 rounded-full bg-green" />
                              </span>

                              PROVISIONING OPERATIVE CREDENTIALS...
                            </div>

                            <div className="mx-auto mt-3 h-px max-w-xs overflow-hidden bg-green/10">
                              <motion.div
                                className="h-full bg-green"
                                initial={{
                                  width: "0%",
                                }}
                                animate={{
                                  width: "100%",
                                }}
                                transition={{
                                  duration: 1.4,
                                  ease: "linear",
                                }}
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* SUBMIT */}

                        <Button
                          type="submit"
                          variant="primary"
                          className="mt-3 w-full justify-center"
                          disabled={status === "registering"}
                        >
                          {status === "registering"
                            ? "PROVISIONING..."
                            : "CREATE IDENTITY"}
                        </Button>

                        {/* SECURITY */}

                        <div className="flex items-center justify-center gap-2 border-t border-white/5 pt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">

                          <span className="h-1.5 w-1.5 rounded-full bg-green" />

                          Secure identity channel active
                        </div>

                      </motion.form>
                    )}

                  </AnimatePresence>
                </div>

                {/* =================================================
                    LOGIN
                ================================================= */}

                <div className="mt-5 border border-white/5 bg-black/20 p-5 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-muted">

                  Already registered?

                  <button
                    type="button"
                    onClick={() => setLoginTransition(true)}
                    className="ml-2 text-paper underline decoration-green/40 underline-offset-4 transition-colors hover:text-green"
                  >
                    Authenticate identity
                  </button>
                </div>

              </div>
            </AnimatedSection>

            {/* ===================================================
                BOTTOM SIGNAL
            =================================================== */}

            <AnimatedSection delay={0.35}>
              <div className="mt-12 flex flex-col items-center text-center">

                <div className="flex w-full max-w-md items-center gap-4">

                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-green/20" />

                  <span className="font-mono text-[7px] tracking-[0.3em] text-green/50">
                    IDENTITY TERMINAL
                  </span>

                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-green/20" />

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
                  VYUHAM&apos;26 // IDENTITY NETWORK
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
