"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import TerminalReveal from "@/components/motion/TerminalReveal";
import { Kicker, Button } from "@/components/ui/Elements";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const faqs = [
  {
    question: "What is Vyuham 26?",
    answer:
      "Vyuham 26 is Digital University Kerala's national-level techno-cultural fest. It spans three days of competitions, performances, hackathons, and experiences across four streams: Technology, Culture, Gaming, and Impact.",
  },
  {
    question: "When and where does Vyuham 26 take place?",
    answer:
      "Vyuham 26 runs from October 30 to November 1, 2026, at the Technocity campus in Thiruvananthapuram, Kerala.",
  },
  {
    question: "Who can participate?",
    answer:
      "Vyuham 26 is open to college students across India. Some events may have specific eligibility criteria — check each event's detail page for requirements.",
  },
  {
    question: "How do I register?",
    answer:
      "Registrations will open soon. Follow our social channels and sign up for notifications to be the first to know. Once registration opens, you'll be able to create an account, browse events, and register individually or as a team.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "Yes, there will be a nominal registration fee. Exact pricing will be announced when registrations open. Some events may have separate entry fees.",
  },
  {
    question: "Can I participate in multiple events?",
    answer:
      "Absolutely! You can register for multiple events as long as there are no scheduling conflicts. The schedule page will help you plan your three days.",
  },
  {
    question: "Is accommodation available?",
    answer:
      "We will provide information about nearby accommodation options for outstation participants. Details will be shared closer to the event date.",
  },
  {
    question: "How do teams work?",
    answer:
      "For team events, one member creates the team and generates an invite code. Other members join using this code. Team sizes vary by event — check each event's detail page.",
  },
  {
    question: "How can I sponsor Vyuham 26?",
    answer:
      "We offer multiple sponsorship tiers with varying benefits. Visit our Contact page or email sponsors@vyuham.duk.ac.in for our sponsorship deck and partnership details.",
  },
  {
    question: "Will there be food available on campus?",
    answer:
      "Yes! A dedicated food court with multiple vendors will be set up on campus. During Phase 3, we'll introduce a digital food coupon system for cashless purchases.",
  },
];

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 18,
            }
      }
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
            }
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.035, 0.3),
      }}
      className={`group relative border-b border-white/[0.07] ${
        open ? "border-[#c8ff42]/20" : ""
      }`}
    >
      {/* Active energy line */}
      <motion.div
        initial={false}
        animate={{
          scaleX: open ? 1 : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.35 }}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-[#c8ff42] shadow-[0_0_12px_rgba(200,255,66,.7)]"
      />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex w-full cursor-pointer items-center gap-4 px-3 py-6 text-left transition-all duration-300 md:px-5 md:py-7"
        aria-expanded={open}
      >
        {/* Index */}
        <span
          className={`w-7 shrink-0 font-mono text-[9px] tracking-[0.15em] transition-colors ${
            open ? "text-[#c8ff42]" : "text-white/25"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Status node */}
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <span
            className={`absolute h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              open
                ? "bg-[#c8ff42] shadow-[0_0_10px_rgba(200,255,66,.9)]"
                : "bg-white/20"
            }`}
          />

          {open && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute h-5 w-5 rounded-full border border-[#c8ff42]/30"
            />
          )}
        </span>

        {/* Question */}
        <span
          className={`flex-1 font-display text-sm font-semibold tracking-tight transition-colors md:text-base ${
            open
              ? "text-[#c8ff42]"
              : "text-paper group-hover:text-[#c8ff42]"
          }`}
        >
          {question}
        </span>

        {/* Command state */}
        <span className="hidden font-mono text-[8px] uppercase tracking-[0.18em] text-white/20 sm:block">
          {open ? "OPEN" : "QUERY"}
        </span>

        {/* Plus / close */}
        <motion.span
          animate={{
            rotate: open ? 45 : 0,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-lg transition-colors ${
            open
              ? "border-[#c8ff42]/40 bg-[#c8ff42]/10 text-[#c8ff42]"
              : "border-white/10 bg-white/[0.02] text-white/40 group-hover:border-[#c8ff42]/30 group-hover:text-[#c8ff42]"
          }`}
        >
          +
        </motion.span>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    height: 0,
                    opacity: 0,
                  }
            }
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={
              reduceMotion
                ? undefined
                : {
                    height: 0,
                    opacity: 0,
                  }
            }
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            <div className="relative ml-[3.1rem] mr-3 mb-7 overflow-hidden rounded border border-[#c8ff42]/10 bg-[#07100c]/70 px-5 py-5 backdrop-blur-sm md:mr-5 md:px-6">
              {/* Answer scanline */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,.4) 4px)",
                }}
              />

              <div className="relative">
                <div className="mb-3 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8ff42]/50">
                  <span className="h-1 w-1 rounded-full bg-[#c8ff42]" />
                  RESPONSE // VERIFIED
                </div>

                <p className="text-sm leading-[1.8] text-white/50">
                  <TerminalReveal
                    text={answer}
                    speed={10}
                  />
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <>
      <Navbar />

      <main className="relative flex-1 overflow-hidden bg-[#020504] pt-[92px] text-paper">
        {/* =========================================================
            BACKGROUND SYSTEM
        ========================================================== */}

        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* Main glow */}
          <div className="absolute left-1/2 top-[12%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#c8ff42]/[0.035] blur-[150px]" />

          <div className="absolute -left-[220px] top-[45%] h-[480px] w-[480px] rounded-full bg-[#c8ff42]/[0.025] blur-[130px]" />

          <div className="absolute -right-[220px] top-[70%] h-[480px] w-[480px] rounded-full bg-[#c8ff42]/[0.02] blur-[130px]" />

          {/* Technical grid */}
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
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)
              `,
              backgroundSize: "16px 16px",
            }}
          />

          {/* Scanlines */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,.3) 4px)",
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.72)_100%)]" />
        </div>

        {/* =========================================================
            MAIN FAQ SECTION
        ========================================================== */}

        <section className="relative py-20 md:py-28">
          <div className="mx-auto w-[min(1120px,calc(100%-40px))] md:w-[min(1120px,calc(100%-64px))]">

            {/* =====================================================
                HERO
            ====================================================== */}

            <AnimatedSection>
              <div className="relative border-b border-white/[0.08] pb-8">

                {/* Telemetry */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-[#c8ff42] opacity-40" />
                      <span className="relative h-2 w-2 rounded-full bg-[#c8ff42] shadow-[0_0_10px_#c8ff42]" />
                    </span>

                    COMMAND TERMINAL
                  </div>

                  <div className="flex gap-5">
                    <span>FAQ_NODE: 10</span>
                    <span className="hidden sm:inline">
                      STATUS: ONLINE
                    </span>
                  </div>
                </div>

                <Kicker>
                  <span className="signal-dot" />
                  Command Terminal
                </Kicker>

                <motion.h1
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 25,
                          filter: "blur(10px)",
                        }
                  }
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                        }
                  }
                  transition={{ duration: 0.8 }}
                  className="mt-5 max-w-5xl font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.84] tracking-[-0.045em]"
                >
                  FREQUENTLY
                  <br />
                  <em className="not-italic text-[#c8ff42] [text-shadow:0_0_32px_rgba(200,255,66,.28)]">
                    ASKED.
                  </em>
                </motion.h1>

                <p className="mt-7 max-w-xl text-sm leading-[1.8] text-white/45 md:text-base">
                  Quick answers to the most common questions about
                  Vyuham 26. Can&apos;t find what you need? Reach out
                  through our{" "}
                  <a
                    href="/contact"
                    className="text-[#c8ff42] underline-offset-4 transition hover:underline"
                  >
                    contact page
                  </a>
                  .
                </p>

                {/* Data strip */}
                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/[0.06] pt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
                  <span>NETWORK: VYUHAM'26</span>
                  <span>DATABASE: PUBLIC</span>
                  <span>RESPONSES: VERIFIED</span>
                  <span className="text-[#c8ff42]/50">
                    ACCESS: GRANTED
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                FAQ TERMINAL
            ====================================================== */}

            <AnimatedSection delay={0.15} className="mt-12">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">

                {/* FAQ list */}
                <div className="overflow-hidden rounded border border-white/[0.08] bg-[#07100c]/65 backdrop-blur-xl">

                  {/* Terminal header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] bg-white/[0.015] px-5 py-4 md:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-400/40" />
                        <span className="h-2 w-2 rounded-full bg-yellow-400/40" />
                        <span className="h-2 w-2 rounded-full bg-[#c8ff42]/60" />
                      </div>

                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                        FAQ_DATABASE.EXE
                      </span>
                    </div>

                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#c8ff42]/50">
                      CONNECTION: SECURE
                    </span>
                  </div>

                  {/* Questions */}
                  <div className="px-3 md:px-5">
                    {faqs.map((faq, i) => (
                      <FaqItem
                        key={i}
                        question={faq.question}
                        answer={faq.answer}
                        index={i}
                      />
                    ))}
                  </div>
                </div>

                {/* =================================================
                    SIDE STATUS PANEL
                ================================================== */}

                <div className="hidden lg:block">
                  <div className="sticky top-[120px] space-y-4">

                    {/* System monitor */}
                    <div className="rounded border border-white/[0.08] bg-[#07100c]/70 p-5 backdrop-blur-xl">
                      <div className="mb-5 flex items-center justify-between">
                        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
                          SYSTEM MONITOR
                        </span>

                        <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff42] shadow-[0_0_8px_#c8ff42]" />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 flex justify-between font-mono text-[8px] uppercase tracking-[0.15em]">
                            <span className="text-white/25">
                              DATABASE
                            </span>
                            <span className="text-[#c8ff42]/70">
                              100%
                            </span>
                          </div>

                          <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 1 }}
                              className="h-full bg-[#c8ff42] shadow-[0_0_8px_rgba(200,255,66,.6)]"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex justify-between font-mono text-[8px] uppercase tracking-[0.15em]">
                            <span className="text-white/25">
                              NETWORK
                            </span>
                            <span className="text-[#c8ff42]/70">
                              STABLE
                            </span>
                          </div>

                          <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "96%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.1, delay: 0.15 }}
                              className="h-full bg-[#c8ff42]/70"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex justify-between font-mono text-[8px] uppercase tracking-[0.15em]">
                            <span className="text-white/25">
                              RESPONSE
                            </span>
                            <span className="text-[#c8ff42]/70">
                              READY
                            </span>
                          </div>

                          <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.9, delay: 0.3 }}
                              className="h-full bg-[#c8ff42]/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact panel */}
                    <div className="relative overflow-hidden rounded border border-[#c8ff42]/15 bg-[#07100c]/70 p-5 backdrop-blur-xl">
                      <div className="absolute right-0 top-0 h-16 w-16 border-r border-t border-[#c8ff42]/20" />

                      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8ff42]/60">
                        NEED MORE DATA?
                      </span>

                      <h3 className="mt-3 font-display text-lg font-semibold text-paper">
                        CONTACT COMMAND
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-white/35">
                        Our support network is available for questions
                        not covered by this terminal.
                      </p>

                      <div className="mt-5">
                        <Button href="/contact" variant="primary">
                          Contact →
                        </Button>
                      </div>
                    </div>

                    {/* Node info */}
                    <div className="rounded border border-white/[0.06] bg-black/20 p-4">
                      <div className="space-y-2 font-mono text-[7px] uppercase tracking-[0.18em] text-white/20">
                        <div className="flex justify-between">
                          <span>NODE</span>
                          <span>FAQ-01</span>
                        </div>

                        <div className="flex justify-between">
                          <span>PROTOCOL</span>
                          <span>PUBLIC</span>
                        </div>

                        <div className="flex justify-between">
                          <span>ENCRYPTION</span>
                          <span className="text-[#c8ff42]/40">
                            ACTIVE
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                MOBILE CONTACT CTA
            ====================================================== */}

            <AnimatedSection delay={0.3}>
              <div className="mt-8 lg:hidden">
                <div className="rounded border border-[#c8ff42]/15 bg-[#07100c]/70 p-6 backdrop-blur-xl">
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#c8ff42]/60">
                    NEED MORE DATA?
                  </span>

                  <h3 className="mt-2 font-display text-xl font-semibold">
                    CONTACT COMMAND
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/35">
                    Can&apos;t find what you need? Contact the VYUHAM&apos;26
                    support network.
                  </p>

                  <div className="mt-5">
                    <Button href="/contact" variant="primary">
                      Contact Support →
                    </Button>
                  </div>
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
