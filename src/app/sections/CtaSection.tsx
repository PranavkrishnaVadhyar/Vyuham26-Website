"use client";

import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";
import CountdownTimer from "@/components/ui/CountdownTimer";
import SignalRing from "@/components/motion/SignalRing";

export default function CtaSection() {
  return (
    <PageEntranceGate phase="cta">
      <section
        className="relative overflow-hidden border-t border-line bg-linear-to-br from-[#0c3321] via-[#07150e] to-ink py-24 md:py-32"
        id="register"
      >
        {/* Background watermark */}
        <span
          className="pointer-events-none absolute right-[-1%] bottom-[-16%] font-display text-[20vw] font-bold -tracking-widest text-green/[0.035]"
          aria-hidden="true"
        >
          VYUHAM
        </span>

        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left CTA text */}
            <div className="lg:col-span-6">
              <AnimatedSection>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green" />
                  <Kicker>Transmission ready</Kicker>
                </div>
                <h2 className="mt-6 font-display text-[clamp(42px,5.5vw,76px)] font-semibold leading-[0.88]">
                  ARE YOU READY
                  <br />
                  TO <em>ENTER?</em>
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  The count is officially on. Registrations are live — leave the ordinary behind and secure your pass for Vyuham &apos;26.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button href="/register" variant="primary">
                    Register Now <span className="ml-2 text-base">→</span>
                  </Button>
                  <Button href="/contact" variant="outline">
                    Get in touch
                  </Button>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Countdown Banner Card */}
            <div className="lg:col-span-6">
              <AnimatedSection delay={0.2}>
                <div className="glass-card relative overflow-hidden rounded-sm border border-green/30 bg-ink/80 p-8 shadow-[0_0_50px_rgba(200,255,66,0.08)] backdrop-blur-xl md:p-10">
                  <SignalRing
                    count={2}
                    size={90}
                    duration={3}
                    color="rgba(200,255,66,0.3)"
                    className="-top-6 -right-6"
                  />
                  <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-green">
                      /// TEMPORAL COUNTDOWN
                    </span>
                    <span className="rounded-full bg-green/10 border border-green/30 px-3 py-1 font-mono text-[9px] text-green">
                      T-MINUS 2026
                    </span>
                  </div>

                  <CountdownTimer
                    targetDate="2026-10-30T09:00:00+05:30"
                    className="py-2"
                  />

                  <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 font-mono text-[9px] text-muted">
                    <span>EVENT DATE: 30 OCT — 01 NOV 2026</span>
                    <span className="text-paper">TECHNOCITY, DUK</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </PageEntranceGate>
  );
}

