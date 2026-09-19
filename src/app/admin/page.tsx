"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function AdminDashboardPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [filter, setFilter] = useState<"all" | "tech" | "culture" | "gaming">("all");

  const metrics = {
    all: { totalRegs: "2,480", totalRevenue: "₹6,84,000", totalCheckins: "1,890", activeEvents: 32 },
    tech: { totalRegs: "1,120", totalRevenue: "₹3,40,000", totalCheckins: "890", activeEvents: 12 },
    culture: { totalRegs: "840", totalRevenue: "₹2,10,000", totalCheckins: "620", activeEvents: 10 },
    gaming: { totalRegs: "520", totalRevenue: "₹1,34,000", totalCheckins: "380", activeEvents: 10 },
  };

  const currentMetrics = metrics[filter];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Operations Command Center</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    ADMIN <em>PANEL</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Real-time fest metrics, registrations, gate check-in counts, and financial summaries.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {(["all", "tech", "culture", "gaming"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`rounded px-3 py-1.5 uppercase font-medium transition-all ${
                        filter === cat
                          ? "border border-green bg-green/10 text-green"
                          : "border border-line bg-ink-mid/40 text-muted hover:text-paper"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Metrics Overview Cards */}
            <AnimatedSection delay={0.1}>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="glass-card p-6">
                  <span className="font-mono text-[10px] uppercase text-muted">TOTAL REGISTRATIONS</span>
                  <motion.strong
                    key={`regs-${filter}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-2 block font-display text-4xl text-paper"
                  >
                    {currentMetrics.totalRegs}
                  </motion.strong>
                  <span className="mt-2 block font-mono text-[10px] text-green">↑ 14% vs yesterday</span>
                </div>

                <div className="glass-card p-6">
                  <span className="font-mono text-[10px] uppercase text-muted">GROSS REVENUE</span>
                  <motion.strong
                    key={`rev-${filter}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-2 block font-display text-4xl text-green"
                  >
                    {currentMetrics.totalRevenue}
                  </motion.strong>
                  <span className="mt-2 block font-mono text-[10px] text-muted">Gate & Online total</span>
                </div>

                <div className="glass-card p-6">
                  <span className="font-mono text-[10px] uppercase text-muted">GATE CHECK-INS</span>
                  <motion.strong
                    key={`checkins-${filter}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-2 block font-display text-4xl text-paper"
                  >
                    {currentMetrics.totalCheckins}
                  </motion.strong>
                  <span className="mt-2 block font-mono text-[10px] text-green">76% of registered</span>
                </div>

                <div className="glass-card p-6">
                  <span className="font-mono text-[10px] uppercase text-muted">ACTIVE EVENTS</span>
                  <motion.strong
                    key={`events-${filter}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-2 block font-display text-4xl text-paper"
                  >
                    {currentMetrics.activeEvents}
                  </motion.strong>
                  <span className="mt-2 block font-mono text-[10px] text-amber-400">● 4 Events Live Now</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Admin Quick Links */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              <AnimatedSection delay={0.15}>
                <div className="glass-card p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">Analytics Intelligence</h3>
                    <p className="mt-2 font-mono text-xs text-muted">
                      Detailed funnel analytics, footfall paths, and stream conversion graphs.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60">
                    <Button href="/admin/analytics" variant="outline" className="w-full justify-center">
                      View Analytics →
                    </Button>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="glass-card p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">Event Head Portal</h3>
                    <p className="mt-2 font-mono text-xs text-muted">
                      Field commander console for recording attendance and publishing event results.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60">
                    <Button href="/admin/event-head" variant="outline" className="w-full justify-center">
                      Event Head Console →
                    </Button>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.25}>
                <div className="glass-card p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">Gate Check-in Scanner</h3>
                    <p className="mt-2 font-mono text-xs text-muted">
                      Scanner console for gate security volunteers to validate QR entry passes.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60">
                    <Button href="/checkin" variant="primary" className="w-full justify-center">
                      Open Gate Scanner →
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
