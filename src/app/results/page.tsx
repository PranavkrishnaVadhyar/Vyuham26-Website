"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import SignalRing from "@/components/motion/SignalRing";
import { Kicker, Button, StreamBadge } from "@/components/ui/Elements";

export default function ResultsWinnersPage() {
  const reduceMotion = usePrefersReducedMotion();
  const results = [
    {
      event: "National Hackathon",
      stream: "tech",
      first: "CyberVipers (Digital University Kerala)",
      second: "ByteBusters (IIT Madras)",
      third: "NullPointer Squad (NIT Calicut)",
      prize: "₹50,000",
    },
    {
      event: "CTF Warzone",
      stream: "tech",
      first: "QuantumGlitch (CET Trivandrum)",
      second: "CyberVipers (Digital University Kerala)",
      third: "BinaryKnights (CUSAT)",
      prize: "₹40,000",
    },
    {
      event: "Battle of the Bands",
      stream: "culture",
      first: "Echo Horizon",
      second: "Resonance Project",
      third: "Velvet Groove",
      prize: "₹35,000",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1100px,calc(100%-48px))] md:w-[min(1100px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Victory Protocol</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    RESULTS & <em>WINNERS</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Official podium placements and prize announcements across all streams.
                  </p>
                </div>
                <Button href="/certificates" variant="primary">
                  Certificate Forge →
                </Button>
              </div>
            </AnimatedSection>

            {/* Victory Podium Cards */}
            <div className="mt-10 space-y-8">
              {results.map((res, idx) => (
                <AnimatedSection key={res.event} delay={0.1 * idx}>
                  <div className="glass-card p-6 md:p-8">
                    <div className="flex justify-between items-center border-b border-line pb-4">
                      <div>
                        <StreamBadge stream={res.stream as "tech" | "culture"} />
                        <h2 className="mt-2 font-display text-2xl font-bold text-paper">
                          {res.event}
                        </h2>
                      </div>
                      <span className="font-mono text-sm font-bold text-green">
                        Total Pool: {res.prize}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* 1st Place */}
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.96 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0 }}
                        className="relative rounded border-2 border-green bg-green/10 p-5 text-center shadow-[0_0_24px_rgba(200,255,66,0.15)]"
                      >
                        <SignalRing
                          className="inset-0 m-auto"
                          size={56}
                          count={2}
                          duration={2.6}
                          color="rgba(255,214,10,0.45)"
                        />
                        <span className="font-mono text-xs font-bold text-green block">🥇 1ST PLACE WINNER</span>
                        <h3 className="mt-2 font-display text-lg font-bold text-paper">{res.first}</h3>
                      </motion.div>

                      {/* 2nd Place */}
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.12 }}
                        className="rounded border border-line bg-ink-mid/60 p-5 text-center"
                      >
                        <span className="font-mono text-xs font-bold text-paper block">🥈 2ND PLACE RUNNER-UP</span>
                        <h3 className="mt-2 font-display text-base font-semibold text-paper">{res.second}</h3>
                      </motion.div>

                      {/* 3rd Place */}
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.22 }}
                        className="rounded border border-line bg-ink-mid/40 p-5 text-center"
                      >
                        <span className="font-mono text-xs font-bold text-amber-400 block">🥉 3RD PLACE</span>
                        <h3 className="mt-2 font-display text-base font-semibold text-paper">{res.third}</h3>
                      </motion.div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
