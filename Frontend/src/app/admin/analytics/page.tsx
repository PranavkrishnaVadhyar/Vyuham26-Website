"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";

function FunnelBar({
  fill,
  delay,
  reduceMotion,
}: {
  fill: string;
  delay: number;
  reduceMotion: boolean;
}) {
  return (
    <div className="h-3 w-full overflow-hidden rounded bg-ink-mid">
      <motion.div
        className="h-full bg-green"
        style={{ width: fill, transformOrigin: "left" }}
        initial={reduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0.4 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  const reduceMotion = usePrefersReducedMotion();

  const funnel = [
    { step: "1. Page Views & Exploration", value: "14,200 Hits (100%)", fill: "100%", delay: 0 },
    { step: "2. Event Selection Board", value: "6,800 Users (47.8%)", fill: "47.8%", delay: 0.15 },
    { step: "3. Checkout / Verification", value: "3,100 Checkouts (21.8%)", fill: "21.8%", delay: 0.3 },
    { step: "4. Confirmed Payment & Ticket Issued", value: "2,480 Confirmed (17.4%)", fill: "17.4%", delay: 0.45 },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-23">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Signal Intelligence</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    EVENT <em>ANALYTICS</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Registration conversion funnels, stream interest distribution, and campus footfall paths.
                  </p>
                </div>
                <div className="font-mono text-xs text-muted">
                  LIVE TELEMETRY: <span className="text-green font-bold">CONNECTED</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Conversion Funnel Bar */}
            <AnimatedSection delay={0.1}>
              <div className="glass-card mt-8 p-6 md:p-8">
                <h3 className="font-display text-lg font-semibold border-b border-line pb-4">
                  REGISTRATION CONVERSION FUNNEL
                </h3>

                <div className="mt-6 space-y-4 font-mono text-xs">
                  {funnel.map((row) => (
                    <div key={row.step}>
                      <div className="flex justify-between text-paper mb-1">
                        <span>{row.step}</span>
                        <strong className="text-green">{row.value}</strong>
                      </div>
                      <FunnelBar
                        fill={row.fill}
                        delay={row.delay}
                        reduceMotion={reduceMotion}
                      />
                    </div>
                  ))}
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