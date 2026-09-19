"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import SignalRing from "@/components/motion/SignalRing";
import { Kicker, Button } from "@/components/ui/Elements";

export default function HackathonHubPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [repoUrl, setRepoUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1100px,calc(100%-48px))] md:w-[min(1100px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Build Zone Command</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    HACKATHON <em>HUB</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Track milestones, submit project commits, and check mentor review status.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted">SQUAD:</span>
                  <span className="rounded border border-green/30 bg-ink-mid px-3 py-1 font-mono text-xs font-semibold text-green">
                    CyberVipers
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* Team Milestone Progress Path with Live Pulses */}
            <AnimatedSection delay={0.1}>
              <div className="glass-card mt-8 p-6 md:p-8">
                <h3 className="font-display text-lg font-semibold mb-6">SQUAD MILESTONE PATH</h3>

                <div className="relative grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="relative rounded border border-green bg-green/10 p-4">
                    <span className="font-mono text-[10px] text-green">MILESTONE 01 ✓</span>
                    <h4 className="font-display font-semibold text-paper mt-1">Problem Statement</h4>
                    <p className="font-mono text-xs text-muted mt-1">Submitted 30 OCT 11:00 AM</p>
                  </div>

                  <div className="relative rounded border border-green bg-green/10 p-4">
                    <span className="font-mono text-[10px] text-green">MILESTONE 02 ✓</span>
                    <h4 className="font-display font-semibold text-paper mt-1">Architecture & API</h4>
                    <p className="font-mono text-xs text-muted mt-1">Submitted 30 OCT 04:00 PM</p>
                  </div>

                  <div className="relative rounded border border-green bg-green/20 p-4 shadow-[0_0_20px_rgba(200,255,66,0.15)]">
                    <SignalRing
                      className="-top-2 -right-2"
                      size={44}
                      count={2}
                      duration={2.2}
                    />
                    <span className="font-mono text-[10px] text-green font-bold">MILESTONE 03 [IN PROGRESS]</span>
                    <h4 className="font-display font-semibold text-paper mt-1">Prototype Submission</h4>
                    <p className="font-mono text-xs text-green mt-1 font-bold">Due 31 OCT 09:00 AM</p>
                  </div>

                  <div className="relative rounded border border-line bg-ink-mid/40 p-4 opacity-60">
                    <span className="font-mono text-[10px] text-muted">MILESTONE 04</span>
                    <h4 className="font-display font-semibold text-paper mt-1">Final Pitch & Demo</h4>
                    <p className="font-mono text-xs text-muted mt-1">31 OCT 02:00 PM</p>
                  </div>
                </div>

                {/* Live submission pulses traveling the milestone path toward Milestone 03 */}
                <div className="relative mt-6 hidden md:block" aria-hidden="true">
                  <div className="h-px w-full bg-gradient-to-r from-green/60 via-green/30 to-line" />
                  <motion.span
                    className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-green shadow-[0_0_8px_rgba(200,255,66,0.8)]"
                    initial={reduceMotion ? { left: "0%", opacity: 0.6 } : { left: "0%", opacity: 0 }}
                    animate={
                      reduceMotion
                        ? { left: ["0%", "62.5%"], opacity: [0.2, 1, 0] }
                        : { left: ["0%", "62.5%"], opacity: [0, 1, 0] }
                    }
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6,
                    }}
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* Submission Form */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <AnimatedSection delay={0.2} className="lg:col-span-2">
                <div className="glass-card p-6 md:p-8">
                  <h3 className="font-display text-lg font-semibold border-b border-line pb-4">
                    SUBMIT COMMITS & REPOSITORIES
                  </h3>

                  {submitted ? (
                    <div className="py-6 text-center font-mono text-xs text-green">
                      ✓ Submission received and logged. Mentors notified.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div>
                        <label className="block font-mono text-[10px] tracking-wider uppercase text-muted">
                          GITHUB REPOSITORY URL
                        </label>
                        <input
                          type="url"
                          required
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          placeholder="https://github.com/cybervipers/vyuham-hackathon"
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] tracking-wider uppercase text-muted">
                          LIVE DEMO / DEPLOYMENT URL (OPTIONAL)
                        </label>
                        <input
                          type="url"
                          placeholder="https://cybervipers.vercel.app"
                          className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                        />
                      </div>

                      <div className="pt-4 flex justify-between items-center">
                        <span className="font-mono text-xs text-muted">
                          Status: <strong className="text-amber-400">Drafting</strong>
                        </span>
                        <Button type="submit" variant="primary">
                          Submit Milestone 3 →
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </AnimatedSection>

              {/* Mentor Help Desk */}
              <AnimatedSection delay={0.3}>
                <div className="glass-card p-6 md:p-8">
                  <h3 className="font-display text-lg font-semibold border-b border-line pb-4">
                    MENTOR DESK
                  </h3>
                  <p className="mt-4 text-xs text-muted font-mono">
                    Need technical help or API keys? Request a mentor to visit your build bay.
                  </p>

                  <div className="mt-6">
                    <Button
                      onClick={() => alert("Mentor requested! A mentor is arriving at Bay 14.")}
                      variant="outline"
                      className="w-full justify-center"
                    >
                      Request Mentor Assistance ⚡
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
