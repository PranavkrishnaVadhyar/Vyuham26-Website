"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function ContactPage() {
  const reduceMotion = usePrefersReducedMotion();

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    tier: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const inputClasses =
    "w-full border border-white/10 bg-[#07100c]/80 px-4 py-3.5 text-sm text-paper placeholder:text-muted/40 outline-none transition-all duration-300 font-body backdrop-blur-md focus:border-green/50 focus:bg-green/[0.035] focus:ring-1 focus:ring-green/20";

  const contactChannels = [
    {
      node: "01",
      label: "GENERAL ENQUIRIES",
      value: "techfest@duk.ac.in",
      href: "mailto:techfest@duk.ac.in",
      type: "MAIL CHANNEL",
    },
    {
      node: "02",
      label: "SPONSORSHIP ENQUIRIES",
      value: "sponsors@vyuham.duk.ac.in",
      href: "mailto:sponsors@vyuham.duk.ac.in",
      type: "PARTNERSHIP CHANNEL",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen flex-1 overflow-hidden bg-[#030705] pt-23 text-paper">

        {/* ============================================================
            FUTURE ENVIRONMENT
        ============================================================ */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

          {/* Central green atmosphere */}
          <div className="absolute left-1/2 top-[12%] h-150 w-200 -translate-x-1/2 rounded-full bg-green/4.5 blur-[150px]" />

          {/* Secondary atmosphere */}
          <div className="absolute right-[-15%] top-[45%] h-125 w-125 rounded-full bg-cyan-400/2 blur-[130px]" />

          {/* Futuristic grid */}
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

          {/* Vertical atmospheric light */}
          {!reduceMotion && (
            <motion.div
              className="absolute left-[15%] top-0 h-full w-px bg-linear-to-b from-transparent via-green/10 to-transparent"
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Scanning beam */}
          {!reduceMotion && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-green/25 to-transparent"
              animate={{
                top: ["5%", "95%", "5%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </div>

        <section className="relative py-20 md:py-28">
          <div className="mx-auto w-[min(1200px,calc(100%-40px))] md:w-[min(1200px,calc(100%-64px))]">

            {/* ========================================================
                HEADER
            ======================================================== */}
            <AnimatedSection>
              <div className="relative overflow-hidden border border-white/10 bg-black/30 p-6 backdrop-blur-xl md:p-9">

                {/* Corner brackets */}
                <div className="absolute left-0 top-0 h-10 w-10 border-l border-t border-green/50" />
                <div className="absolute right-0 top-0 h-10 w-10 border-r border-t border-green/50" />
                <div className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-green/30" />
                <div className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-green/30" />

                {/* Top signal */}
                <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-green/70 to-transparent" />

                <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">

                  <div>
                    <div className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.35em] text-green/70">
                      <span className="relative flex h-2 w-2">
                        {!reduceMotion && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-50" />
                        )}
                        <span className="relative h-2 w-2 rounded-full bg-green" />
                      </span>

                      VYUHAM'26 // COMMUNICATION NETWORK
                    </div>

                    <Kicker>Secure Transmission</Kicker>

                    <h1 className="mt-4 font-display text-[clamp(48px,7vw,96px)] font-semibold leading-[0.84] tracking-tight">
                      GET IN
                      <br />
                      <span className="text-green">
                        <em>TOUCH.</em>
                      </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-sm leading-7 text-muted md:text-base">
                      Establish a connection with the VYUHAM&apos;26 network.
                      Send a transmission and our team will respond through
                      the appropriate channel.
                    </p>
                  </div>

                  {/* NETWORK STATUS */}
                  <div className="w-full max-w-60 border border-green/20 bg-green/2.5 p-5 font-mono">

                    <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.3em] text-muted">
                      <span>NETWORK</span>
                      <span>V26</span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <div className="relative flex h-9 w-9 items-center justify-center">
                        {!reduceMotion && (
                          <motion.div
                            className="absolute inset-0 rounded-full border border-green/30"
                            animate={{
                              scale: [1, 1.6],
                              opacity: [0.7, 0],
                            }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                            }}
                          />
                        )}

                        <span className="h-2.5 w-2.5 rounded-full bg-green shadow-[0_0_20px_rgba(80,255,150,.9)]" />
                      </div>

                      <div>
                        <div className="text-xs font-bold tracking-wider text-green">
                          SIGNAL ONLINE
                        </div>
                        <div className="mt-1 text-[8px] tracking-[0.2em] text-muted">
                          CHANNEL SECURE
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 h-px bg-white/5" />

                    <div className="mt-3 flex justify-between text-[8px] uppercase tracking-wider">
                      <span className="text-muted">STATUS</span>
                      <span className="text-green">READY</span>
                    </div>
                  </div>
                </div>

                {/* Core message */}
                <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-5">
                  <span className="font-mono text-[8px] tracking-[0.35em] text-muted">
                    CORE MESSAGE
                  </span>

                  <span className="h-px flex-1 bg-linear-to-r from-green/30 to-transparent" />

                  <span className="font-mono text-[8px] tracking-[0.3em] text-green">
                    THE FUTURE AWAITS
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                MAIN CONTENT
            ======================================================== */}
            <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-[1.25fr_0.75fr] md:gap-10">

              {/* ======================================================
                  TRANSMISSION FORM
              ====================================================== */}
              <AnimatedSection delay={0.1}>
                <div className="relative overflow-hidden border border-white/10 bg-[#050b08]/80 backdrop-blur-xl">

                  {/* top bar */}
                  <div className="flex items-center justify-between border-b border-white/5 px-5 py-3 font-mono text-[8px] uppercase tracking-[0.25em]">
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_10px_rgba(80,255,150,.8)]" />
                      <span className="text-muted">
                        TRANSMISSION CONSOLE
                      </span>
                    </div>

                    <span className="text-green/60">
                      ENCRYPTED // V26
                    </span>
                  </div>

                  <div className="p-6 md:p-8">

                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.div
                          key="success"
                          initial={
                            reduceMotion
                              ? false
                              : { opacity: 0, scale: 0.95 }
                          }
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          className="flex min-h-125 items-center justify-center text-center"
                        >
                          <div>

                            <div className="relative mx-auto mb-8 grid h-24 w-24 place-items-center">

                              {!reduceMotion && (
                                <>
                                  <motion.div
                                    className="absolute inset-0 rounded-full border border-green/30"
                                    animate={{
                                      scale: [1, 1.3],
                                      opacity: [0.6, 0],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                    }}
                                  />

                                  <motion.div
                                    className="absolute inset-2 rounded-full border border-green/20"
                                    animate={{
                                      rotate: 360,
                                    }}
                                    transition={{
                                      duration: 5,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                  />
                                </>
                              )}

                              <div className="relative grid h-16 w-16 place-items-center rounded-full border border-green/30 bg-green/10">
                                <span className="text-3xl text-green">
                                  ✓
                                </span>
                              </div>
                            </div>

                            <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-green">
                              TRANSMISSION RECEIVED
                            </div>

                            <h2 className="mt-4 font-display text-3xl font-semibold">
                              CONNECTION
                              <br />
                              <span className="text-green">
                                ESTABLISHED.
                              </span>
                            </h2>

                            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted">
                              Your transmission has entered the VYUHAM&apos;26
                              communication network. Our team will respond
                              through the designated channel.
                            </p>

                            <div className="mx-auto mt-8 max-w-sm border border-green/10 bg-green/2 p-4 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                              <div className="flex justify-between">
                                <span>STATUS</span>
                                <span className="text-green">VERIFIED</span>
                              </div>

                              <div className="mt-2 flex justify-between">
                                <span>CHANNEL</span>
                                <span className="text-green">
                                  SECURE
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form"
                          onSubmit={handleSubmit}
                          initial={reduceMotion ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6"
                        >

                          {/* NAME + ORGANIZATION */}
                          <div className="grid gap-5 md:grid-cols-2">
                            <div>
                              <label
                                htmlFor="name"
                                className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                              >
                                Identity *
                              </label>

                              <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Your name"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="organization"
                                className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                              >
                                Organization
                              </label>

                              <input
                                type="text"
                                id="organization"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Company or institution"
                              />
                            </div>
                          </div>

                          {/* EMAIL + PHONE */}
                          <div className="grid gap-5 md:grid-cols-2">
                            <div>
                              <label
                                htmlFor="email"
                                className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                              >
                                Communication Channel *
                              </label>

                              <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="you@example.com"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="phone"
                                className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                              >
                                Contact Frequency
                              </label>

                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="+91 ..."
                              />
                            </div>
                          </div>

                          {/* TIER */}
                          <div>
                            <label
                              htmlFor="tier"
                              className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                            >
                              Partnership Protocol
                            </label>

                            <select
                              id="tier"
                              name="tier"
                              value={formData.tier}
                              onChange={handleChange}
                              className={inputClasses}
                            >
                              <option value="">
                                Select a tier (optional)
                              </option>
                              <option value="title">
                                Title Sponsor
                              </option>
                              <option value="gold">
                                Gold Sponsor
                              </option>
                              <option value="silver">
                                Silver Sponsor
                              </option>
                              <option value="community">
                                Community Partner
                              </option>
                              <option value="other">
                                Other / General Enquiry
                              </option>
                            </select>
                          </div>

                          {/* MESSAGE */}
                          <div>
                            <label
                              htmlFor="message"
                              className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-muted"
                            >
                              Transmission *
                            </label>

                            <textarea
                              id="message"
                              name="message"
                              required
                              rows={6}
                              value={formData.message}
                              onChange={handleChange}
                              className={`${inputClasses} resize-none`}
                              placeholder="Enter your transmission..."
                            />
                          </div>

                          {/* SUBMIT */}
                          <div className="flex flex-col gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">

                            <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                              <span className="text-green">●</span>{" "}
                              Channel secure
                            </div>

                            <Button type="submit" variant="primary">
                              Initiate Transmission
                              <span className="ml-2 text-base">
                                →
                              </span>
                            </Button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </AnimatedSection>

              {/* ======================================================
                  COMMUNICATION NODES
              ====================================================== */}
              <AnimatedSection delay={0.2}>
                <div className="space-y-5">

                  {/* NODE HEADER */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <Kicker>{"// Communication Nodes"}</Kicker>
                    </div>

                    <span className="font-mono text-[8px] tracking-[0.2em] text-green">
                      04 ACTIVE
                    </span>
                  </div>

                  {/* EMAIL CHANNELS */}
                  {contactChannels.map((channel, index) => (
                    <motion.div
                      key={channel.node}
                      initial={
                        reduceMotion
                          ? false
                          : {
                              opacity: 0,
                              x: 25,
                            }
                      }
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: reduceMotion
                          ? 0
                          : 0.3 + index * 0.12,
                        duration: 0.6,
                      }}
                      whileHover={
                        reduceMotion
                          ? {}
                          : {
                              x: 5,
                            }
                      }
                      className="group relative overflow-hidden border border-white/10 bg-[#07100c]/70 p-6 backdrop-blur-xl"
                    >
                      <div className="absolute left-0 top-0 h-full w-px bg-green/60 shadow-[0_0_12px_rgba(80,255,150,.5)]" />

                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[8px] tracking-[0.25em] text-green/70">
                          NODE_{channel.node}
                        </span>

                        <span className="font-mono text-[7px] tracking-[0.2em] text-muted">
                          ONLINE
                        </span>
                      </div>

                      <div className="mt-5 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                        {channel.label}
                      </div>

                      <a
                        href={channel.href}
                        className="mt-2 block break-all text-sm text-paper no-underline transition-colors duration-300 group-hover:text-green"
                      >
                        {channel.value}
                      </a>

                      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                          {channel.type}
                        </span>

                        <span className="text-green transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* LOCATION */}
                  <div className="relative overflow-hidden border border-white/10 bg-[#07100c]/70 p-6 backdrop-blur-xl">

                    <div className="absolute right-0 top-0 h-20 w-20 bg-green/3 blur-2xl" />

                    <div className="flex items-start justify-between">
                      <Kicker>{"// Location Node"}</Kicker>

                      <span className="font-mono text-[8px] text-green">
                        NODE_03
                      </span>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-muted">
                      Digital University Kerala
                      <br />
                      Technocity Campus
                      <br />
                      Thiruvananthapuram, Kerala 695317
                    </p>

                    <div className="mt-5 h-px bg-white/5" />

                    <div className="mt-4 flex justify-between font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                      <span>LOCATION STATUS</span>
                      <span className="text-green">ACTIVE</span>
                    </div>
                  </div>

                  {/* SOCIAL CHANNELS */}
                  <div className="relative overflow-hidden border border-white/10 bg-[#07100c]/70 p-6 backdrop-blur-xl">

                    <div className="flex items-start justify-between">
                      <Kicker>{"// Social Network"}</Kicker>

                      <span className="font-mono text-[8px] text-green">
                        NODE_04
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {[
                        "Instagram",
                        "Twitter",
                        "LinkedIn",
                        "YouTube",
                      ].map((platform) => (
                        <a
                          key={platform}
                          href="#"
                          className="border border-white/5 bg-white/1.5 px-3 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-muted transition-all duration-300 hover:border-green/30 hover:bg-green/3 hover:text-green"
                        >
                          {platform}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* ========================================================
                FOOTER SIGNAL
            ======================================================== */}
            <AnimatedSection delay={0.4}>
              <div className="mt-16 flex flex-col items-center text-center">

                <div className="flex w-full max-w-xl items-center gap-4">
                  <span className="h-px flex-1 bg-linear-to-r from-transparent to-green/30" />

                  <span className="font-mono text-[8px] tracking-[0.3em] text-green/60">
                    CONNECTION TERMINAL
                  </span>

                  <span className="h-px flex-1 bg-linear-to-l from-transparent to-green/30" />
                </div>

                <motion.div
                  className="mt-6 font-display text-xl uppercase tracking-[0.3em] text-white/15 md:text-2xl"
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

                <div className="mt-3 font-mono text-[7px] tracking-[0.35em] text-muted">
                  VYUHAM&apos;26 // COMMUNICATION NETWORK // END
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
