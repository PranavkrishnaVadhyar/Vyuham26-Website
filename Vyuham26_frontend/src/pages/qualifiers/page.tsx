"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button, StreamBadge } from "@/components/ui/Elements";
import { SITE_CONFIG } from "@/config/site";

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
                  <Kicker>PRE FEST · 5 DAYS BEFORE</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    ONLINE <em>QUALIFIERS</em>
                  </h1>
                  <p className="mt-2 max-w-xl text-sm text-muted">
                    Official online tournament qualifiers beginning 5 days prior to VYUHAM &apos;26 fest kickoff.
                  </p>
                </div>
                {SITE_CONFIG.REG_OPEN ? (
                  <Button href="/register" variant="primary">
                    Register for Qualifiers →
                  </Button>
                ) : (
                  <span className="inline-flex items-center justify-center border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse mr-2" />
                    REGISTRATION COMING SOON
                  </span>
                )}
              </div>
            </AnimatedSection>

            {/* Qualifier Brackets List */}
            <div className="mt-12 space-y-6">
              {/* E-Football Tournament */}
              <AnimatedSection delay={0.1}>
                <div className="glass-card p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-line pb-4">
                    <div>
                      <StreamBadge stream="esports" />
                      <h2 className="mt-2 font-display text-2xl font-bold text-paper">
                        E-Football Tournament
                      </h2>
                      <p className="font-mono text-xs text-muted">
                        Online Qualifiers · 5 Days Before Fest | Prize: ₹5,000 | Reg: ₹50/head
                      </p>
                    </div>
                    <span className="rounded border border-green/30 bg-green/10 px-3 py-1 font-mono text-xs font-semibold text-green">
                      FORMAT: ONLINE QUALIFIERS
                    </span>
                  </div>

                  {/* Bracket Timeline */}
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">TIMING</span>
                      <h4 className="font-display font-semibold text-paper">5 Days Before Fest</h4>
                      <p className="font-mono text-xs text-muted mt-1">25 OCT 2026</p>
                    </div>
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">ENTRY & PRIZE</span>
                      <h4 className="font-display font-semibold text-paper">₹50 / Head</h4>
                      <p className="font-mono text-xs text-green mt-1">Prize Pool: ₹5,000</p>
                    </div>
                    <div className="rounded border border-green/30 bg-green/10 p-4">
                      <span className="font-mono text-[10px] text-green">FINALS</span>
                      <h4 className="font-display font-semibold text-paper">Championship Decider</h4>
                      <p className="font-mono text-xs text-green mt-1">Online / Broadcast</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* BGMI Tournament */}
              <AnimatedSection delay={0.2}>
                <div className="glass-card p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-line pb-4">
                    <div>
                      <StreamBadge stream="esports" />
                      <h2 className="mt-2 font-display text-2xl font-bold text-paper">
                        BGMI Tournament
                      </h2>
                      <p className="font-mono text-xs text-muted">
                        Online Qualifiers · 5 Days Before Fest | Prize: ₹6,000 | Reg: ₹50/head
                      </p>
                    </div>
                    <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-semibold text-cyan-400">
                      FORMAT: ONLINE BATTLE ROYALE
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">TIMING</span>
                      <h4 className="font-display font-semibold text-paper">5 Days Before Fest</h4>
                      <p className="font-mono text-xs text-muted mt-1">25 OCT 2026</p>
                    </div>
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">ENTRY & PRIZE</span>
                      <h4 className="font-display font-semibold text-paper">₹50 / Head</h4>
                      <p className="font-mono text-xs text-green mt-1">Prize Pool: ₹6,000</p>
                    </div>
                    <div className="rounded border border-cyan-500/30 bg-cyan-500/10 p-4">
                      <span className="font-mono text-[10px] text-cyan-400">FINALS</span>
                      <h4 className="font-display font-semibold text-paper">Lobby Finals</h4>
                      <p className="font-mono text-xs text-cyan-400 mt-1">Online Broadcast Stream</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Valorant Tournament */}
              <AnimatedSection delay={0.3}>
                <div className="glass-card p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-line pb-4">
                    <div>
                      <StreamBadge stream="esports" />
                      <h2 className="mt-2 font-display text-2xl font-bold text-paper">
                        Valorant Tournament
                      </h2>
                      <p className="font-mono text-xs text-muted">
                        Championship Decider · Live / Online | Prize: ₹10,000 | Reg: ₹500
                      </p>
                    </div>
                    <span className="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-400">
                      STATUS: CHAMPIONSHIP DECIDER
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">FORMAT</span>
                      <h4 className="font-display font-semibold text-paper">Live / Online</h4>
                      <p className="font-mono text-xs text-muted mt-1">Pre-fest &amp; Main Fest</p>
                    </div>
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-muted">ENTRY & PRIZE</span>
                      <h4 className="font-display font-semibold text-paper">₹500 / Team</h4>
                      <p className="font-mono text-xs text-green mt-1">Prize Pool: ₹10,000</p>
                    </div>
                    <div className="rounded border border-amber-500/30 bg-amber-500/10 p-4">
                      <span className="font-mono text-[10px] text-amber-400">DECIDER MATCH</span>
                      <h4 className="font-display font-semibold text-paper">Championship Decider</h4>
                      <p className="font-mono text-xs text-amber-400 mt-1">10:00 AM – 1:00 PM (DAY 3)</p>
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
