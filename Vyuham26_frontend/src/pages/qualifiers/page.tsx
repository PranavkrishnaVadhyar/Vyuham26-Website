"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button, StreamBadge } from "@/components/ui/Elements";

export default function QualifiersPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1100px,calc(100%-48px))] md:w-[min(1100px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <Kicker>Pre-Launch Briefing</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    PRE-FEST <em>QUALIFIERS</em>
                  </h1>
                  <p className="mt-2 max-w-xl text-sm text-muted">
                    Online qualification brackets for flagship events. Secure your spot in the finals before on-ground fest dates.
                  </p>
                </div>
                <Button href="/register" variant="primary">
                  Register for Qualifiers →
                </Button>
              </div>
            </AnimatedSection>

            {/* Qualifier Brackets List */}
            <div className="mt-12 space-y-6">
              <AnimatedSection delay={0.1}>
                <div className="glass-card p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-line pb-4">
                    <div>
                      <StreamBadge stream="tech" />
                      <h2 className="mt-2 font-display text-2xl font-bold text-paper">
                        National Hackathon — Phase 1 Screening
                      </h2>
                      <p className="font-mono text-xs text-muted">
                        Online PPT & Abstract Submission | Deadline: 20 OCT 2026
                      </p>
                    </div>
                    <span className="rounded border border-green/30 bg-green/10 px-3 py-1 font-mono text-xs font-semibold text-green">
                      STATUS: SUBMISSIONS OPEN
                    </span>
                  </div>

                  {/* Bracket Timeline */}
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">ROUND 01</span>
                      <h4 className="font-display font-semibold text-paper">Abstract Screening</h4>
                      <p className="font-mono text-xs text-muted mt-1">20 OCT 2026</p>
                    </div>
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">ROUND 02</span>
                      <h4 className="font-display font-semibold text-paper">Prototype Demo</h4>
                      <p className="font-mono text-xs text-muted mt-1">25 OCT 2026</p>
                    </div>
                    <div className="rounded border border-green/30 bg-green/10 p-4">
                      <span className="font-mono text-[10px] text-green">FINALS</span>
                      <h4 className="font-display font-semibold text-paper">24-Hour On-Ground Hack</h4>
                      <p className="font-mono text-xs text-green mt-1">30 OCT 2026 (Fest Day 1)</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="glass-card p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-line pb-4">
                    <div>
                      <StreamBadge stream="gaming" />
                      <h2 className="mt-2 font-display text-2xl font-bold text-paper">
                        VALORANT Arena — Online Knockouts
                      </h2>
                      <p className="font-mono text-xs text-muted">
                        5v5 Single Elimination Bracket | Qualifier Dates: 22 - 24 OCT 2026
                      </p>
                    </div>
                    <span className="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-400">
                      STATUS: BRACKET SEEDED
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">ROUND OF 64</span>
                      <h4 className="font-display font-semibold text-paper">Online Round 1</h4>
                      <p className="font-mono text-xs text-muted mt-1">22 OCT 2026</p>
                    </div>
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">QUARTERFINALS</span>
                      <h4 className="font-display font-semibold text-paper">Online Semis</h4>
                      <p className="font-mono text-xs text-muted mt-1">24 OCT 2026</p>
                    </div>
                    <div className="rounded border border-amber-500/30 bg-amber-500/10 p-4">
                      <span className="font-mono text-[10px] text-amber-400">LAN FINALS</span>
                      <h4 className="font-display font-semibold text-paper">Stage LAN Finals</h4>
                      <p className="font-mono text-xs text-amber-400 mt-1">31 OCT 2026 (Fest Day 2)</p>
                    </div>
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
