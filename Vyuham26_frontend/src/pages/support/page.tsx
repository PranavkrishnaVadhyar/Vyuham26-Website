"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

const supportChannels = [
  {
    id: "01",
    title: "EVENT SUPPORT",
    description:
      "Issues with registrations, competitions, schedules, venues, or event participation.",
    action: "VIEW FAQ",
    href: "/faq",
    tag: "GENERAL",
  },
  {
    id: "02",
    title: "TECHNICAL SUPPORT",
    description:
      "Report technical problems with the website, dashboard, ticket, or competition systems.",
    action: "REPORT ISSUE",
    href: "#contact",
    tag: "SYSTEM",
  },
  {
    id: "03",
    title: "TEAM SUPPORT",
    description:
      "Need help with squad formation, member invitations, competition linking, or team access?",
    action: "MANAGE SQUAD",
    href: "/teams",
    tag: "SQUAD",
  },
];

const quickLinks = [
  {
    label: "Frequently Asked Questions",
    href: "/faq",
    code: "FAQ",
  },
  {
    label: "Digital Ticket",
    href: "/ticket",
    code: "PASS",
  },
  {
    label: "Team Management",
    href: "/teams",
    code: "SQUAD",
  },
  {
    label: "Participant Profile",
    href: "/profile",
    code: "ID",
  },
];

export default function SupportPage() {
  const reduceMotion = usePrefersReducedMotion();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) return;

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[#020504] pt-[92px] text-paper">
        {/* =========================================================
            BACKGROUND SYSTEM
        ========================================================= */}

        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[15%] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-green/5 blur-[140px]" />

          <div className="absolute -right-40 top-[55%] h-[420px] w-[420px] rounded-full bg-green/[0.025] blur-[120px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(46,229,157,.45) 1px, transparent 1px),
                linear-gradient(90deg, rgba(46,229,157,.45) 1px, transparent 1px)
              `,
              backgroundSize: "55px 55px",
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,.5) 4px)",
            }}
          />
        </div>

        <section className="relative py-16 md:py-24">
          <div className="mx-auto w-[min(1120px,calc(100%-32px))] md:w-[min(1120px,calc(100%-64px))]">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <AnimatedSection>
              <div className="relative overflow-hidden border border-green/15 bg-[#050807]/90 p-6 md:p-9">

                {/* corner brackets */}
                <div className="absolute left-0 top-0 h-14 w-14 border-l border-t border-green/50" />
                <div className="absolute right-0 top-0 h-14 w-14 border-r border-t border-green/50" />
                <div className="absolute bottom-0 left-0 h-14 w-14 border-b border-l border-green/20" />
                <div className="absolute bottom-0 right-0 h-14 w-14 border-b border-r border-green/20" />

                {/* top status */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-4">

                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
                    </span>

                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-green">
                      SUPPORT NETWORK ONLINE
                    </span>
                  </div>

                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                    NODE / HELP-DESK-01
                  </span>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">

                  <div>
                    <Kicker>Command Assistance Protocol</Kicker>

                    <h1 className="mt-3 max-w-3xl font-display text-[38px] font-semibold leading-[0.94] tracking-tight md:text-[58px]">
                      SUPPORT
                      <span className="text-green"> CENTER</span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-6 text-muted md:text-base">
                      Need assistance? Access the VYUHAM&apos;26 support
                      network for event information, technical issues,
                      participant access, and squad coordination.
                    </p>
                  </div>

                  {/* system status */}
                  <div className="border border-green/20 bg-black/30 p-5">

                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                      SYSTEM STATUS
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-green shadow-[0_0_12px_rgba(46,229,157,.9)]" />

                      <span className="font-mono text-sm font-semibold text-green">
                        ALL SYSTEMS OPERATIONAL
                      </span>
                    </div>

                    <div className="mt-4 h-px bg-line" />

                    <div className="mt-4 flex justify-between font-mono text-[9px] uppercase">
                      <span className="text-muted">Response Node</span>
                      <span className="text-paper">ACTIVE</span>
                    </div>

                    <div className="mt-2 flex justify-between font-mono text-[9px] uppercase">
                      <span className="text-muted">Help Protocol</span>
                      <span className="text-green">ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                SUPPORT CHANNELS
            ===================================================== */}

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              {supportChannels.map((channel, index) => (
                <AnimatedSection key={channel.id} delay={0.08 + index * 0.08}>
                  <motion.div
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -5,
                          }
                    }
                    className="group relative h-full overflow-hidden border border-line bg-[#050807]/90 transition-colors duration-300 hover:border-green/30"
                  >
                    <div className="h-px w-full bg-gradient-to-r from-green/50 via-green/10 to-transparent" />

                    <div className="relative p-6">

                      {/* number */}
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] text-green">
                          {channel.id}
                        </span>

                        <span className="border border-line px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-muted">
                          {channel.tag}
                        </span>
                      </div>

                      <h2 className="mt-7 font-display text-lg font-semibold">
                        {channel.title}
                      </h2>

                      <p className="mt-3 min-h-[72px] text-xs leading-5 text-muted">
                        {channel.description}
                      </p>

                      <div className="mt-6 border-t border-line/60 pt-5">
                        <Button
                          href={channel.href}
                          variant="outline"
                          className="w-full justify-center"
                        >
                          {channel.action} ↗
                        </Button>
                      </div>

                      {/* corner */}
                      <span className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-green/20" />
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>

            {/* =====================================================
                QUICK ACCESS
            ===================================================== */}

            <AnimatedSection delay={0.15}>
              <div className="mt-6 border border-line bg-[#050807]/90 p-6 md:p-7">

                <div className="flex flex-col justify-between gap-3 border-b border-line pb-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
                      Navigation Protocol
                    </div>

                    <h2 className="mt-1 font-display text-xl font-semibold">
                      QUICK ACCESS
                    </h2>
                  </div>

                  <span className="font-mono text-[9px] uppercase text-green">
                    04 AVAILABLE NODES
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  {quickLinks.map((link, index) => (
                    <motion.a
                      key={link.code}
                      href={link.href}
                      whileHover={reduceMotion ? undefined : { x: 4 }}
                      className="group flex items-center justify-between border border-line bg-[#080c0a] p-4 transition-all hover:border-green/30 hover:bg-green/[0.025]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] text-green">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="font-mono text-[10px] uppercase text-muted group-hover:text-paper">
                          {link.label}
                        </span>
                      </div>

                      <span className="font-mono text-[10px] text-green">
                        {link.code}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                CONTACT / ISSUE REPORT
            ===================================================== */}

            <div
              id="contact"
              className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]"
            >

              {/* form */}
              <AnimatedSection delay={0.2}>
                <div className="relative overflow-hidden border border-line bg-[#050807]/90">

                  <div className="h-px w-full bg-gradient-to-r from-green/60 via-green/20 to-transparent" />

                  <div className="p-6 md:p-8">

                    <div className="border-b border-line pb-5">
                      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-green">
                        Direct Communication
                      </div>

                      <h2 className="mt-2 font-display text-2xl font-semibold">
                        REPORT AN ISSUE
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-muted">
                        Describe the problem and our support team will route
                        your request to the appropriate response node.
                      </p>
                    </div>

                    {submitted ? (
                      <motion.div
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
                        className="flex min-h-[330px] flex-col items-center justify-center text-center"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green/30 bg-green/5 font-mono text-2xl text-green shadow-[0_0_30px_rgba(46,229,157,.1)]">
                          ✓
                        </div>

                        <h3 className="mt-6 font-display text-xl font-semibold">
                          REQUEST TRANSMITTED
                        </h3>

                        <p className="mt-2 max-w-sm text-xs leading-5 text-muted">
                          Your support request has been received by the
                          VYUHAM&apos;26 response network.
                        </p>

                        <div className="mt-5 font-mono text-[9px] uppercase tracking-wider text-green">
                          ROUTING REQUEST...
                        </div>
                      </motion.div>
                    ) : (
                      <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-5"
                      >

                        <div className="grid gap-5 sm:grid-cols-2">

                          <div>
                            <label className="font-mono text-[9px] uppercase tracking-wider text-muted">
                              Your Name
                            </label>

                            <input
                              required
                              value={form.name}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Enter your name"
                              className="mt-2 w-full border border-line bg-black/30 px-4 py-3 font-mono text-xs text-paper placeholder:text-muted/40 outline-none transition-colors focus:border-green/50 focus:ring-1 focus:ring-green/10"
                            />
                          </div>

                          <div>
                            <label className="font-mono text-[9px] uppercase tracking-wider text-muted">
                              Email Address
                            </label>

                            <input
                              required
                              type="email"
                              value={form.email}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  email: e.target.value,
                                })
                              }
                              placeholder="you@example.com"
                              className="mt-2 w-full border border-line bg-black/30 px-4 py-3 font-mono text-xs text-paper placeholder:text-muted/40 outline-none transition-colors focus:border-green/50 focus:ring-1 focus:ring-green/10"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-mono text-[9px] uppercase tracking-wider text-muted">
                            Issue Classification
                          </label>

                          <select
                            value={form.subject}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                subject: e.target.value,
                              })
                            }
                            className="mt-2 w-full appearance-none border border-line bg-[#080c0a] px-4 py-3 font-mono text-xs text-paper outline-none focus:border-green/50"
                          >
                            <option value="">Select issue type</option>
                            <option value="registration">
                              Registration / Account
                            </option>
                            <option value="technical">
                              Technical Problem
                            </option>
                            <option value="ticket">
                              Ticket / Entry
                            </option>
                            <option value="team">
                              Team / Competition
                            </option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-mono text-[9px] uppercase tracking-wider text-muted">
                            Message
                          </label>

                          <textarea
                            required
                            rows={6}
                            value={form.message}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                message: e.target.value,
                              })
                            }
                            placeholder="Describe the issue..."
                            className="mt-2 w-full resize-none border border-line bg-black/30 px-4 py-3 font-mono text-xs leading-5 text-paper placeholder:text-muted/40 outline-none transition-colors focus:border-green/50 focus:ring-1 focus:ring-green/10"
                          />
                        </div>

                        <div className="flex flex-col justify-between gap-4 border-t border-line/60 pt-5 sm:flex-row sm:items-center">

                          <span className="font-mono text-[8px] uppercase tracking-wider text-muted">
                            SECURE SUPPORT CHANNEL
                          </span>

                          <Button
                            type="submit"
                            variant="primary"
                            className="justify-center sm:min-w-[190px]"
                          >
                            TRANSMIT REQUEST →
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </AnimatedSection>

              {/* ===================================================
                  SUPPORT INFO
              =================================================== */}

              <AnimatedSection delay={0.25}>
                <div className="space-y-6">

                  {/* response node */}
                  <div className="border border-line bg-[#050807]/90 p-6">

                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
                      Response Node
                    </div>

                    <h3 className="mt-2 font-display text-xl font-semibold">
                      NEED DIRECT HELP?
                    </h3>

                    <p className="mt-3 text-xs leading-5 text-muted">
                      For urgent event-related assistance, connect with the
                      VYUHAM&apos;26 coordination team through the official
                      support channels.
                    </p>

                    <div className="mt-6 space-y-3">

                      <div className="border border-line bg-[#080c0a] p-4">
                        <div className="font-mono text-[8px] uppercase text-muted">
                          Support Desk
                        </div>

                        <div className="mt-1 font-mono text-xs text-green">
                          VYUHAM&apos;26 HELP DESK
                        </div>
                      </div>

                      <div className="border border-line bg-[#080c0a] p-4">
                        <div className="font-mono text-[8px] uppercase text-muted">
                          Availability
                        </div>

                        <div className="mt-1 font-mono text-xs text-paper">
                          EVENT OPERATIONS ACTIVE
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* protocol */}
                  <div className="border border-green/15 bg-green/[0.025] p-6">

                    <div className="flex items-start gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-green/30 bg-green/5 font-mono text-sm text-green">
                        !
                      </div>

                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-green">
                          Support Protocol
                        </div>

                        <p className="mt-2 text-xs leading-5 text-muted">
                          Before submitting a request, check the FAQ for
                          common registration, ticket, venue, and competition
                          questions.
                        </p>

                        <a
                          href="/faq"
                          className="mt-4 inline-flex font-mono text-[9px] uppercase tracking-wider text-green transition-colors hover:text-paper"
                        >
                          OPEN FAQ →
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* system monitor */}
                  <div className="border border-line bg-[#050807]/90 p-5">

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-muted">
                        Network Monitor
                      </span>

                      <span className="text-[9px] text-green">
                        ● ONLINE
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">

                      {[
                        ["Registration", "ONLINE"],
                        ["Ticket System", "ONLINE"],
                        ["Team Network", "ONLINE"],
                        ["Event Portal", "ONLINE"],
                      ].map(([name, status]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between font-mono text-[9px]"
                        >
                          <span className="text-muted">{name}</span>

                          <span className="flex items-center gap-2 text-green">
                            <span className="h-1.5 w-1.5 rounded-full bg-green" />
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* =====================================================
                BOTTOM STATUS
            ===================================================== */}

            <AnimatedSection delay={0.3}>
              <div className="mt-7 flex flex-col gap-3 border-t border-line/50 pt-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(46,229,157,.8)]" />

                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
                    VYUHAM&apos;26 / SUPPORT NETWORK
                  </span>
                </div>

                <div className="font-mono text-[9px] uppercase tracking-wider text-muted">
                  HELP NODE:{" "}
                  <span className="text-green">OPERATIONAL</span>
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
