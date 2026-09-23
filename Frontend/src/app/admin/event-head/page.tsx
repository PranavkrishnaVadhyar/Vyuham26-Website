"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function EventHeadPortalPage() {
  const [saved, setSaved] = useState(false);
  const [winner, setWinner] = useState("CyberVipers");
  const [runnerUp, setRunnerUp] = useState("ByteBusters");

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(900px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Field Commander Console</Kicker>
                  <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[44px]">
                    EVENT HEAD PORTAL
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Attendance recording, squad verification, and result publishing console.
                  </p>
                </div>
                <span className="rounded border border-green/30 bg-ink-mid px-3 py-1 font-mono text-xs text-green">
                  EVENT: National Hackathon
                </span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-8 p-6 md:p-8 space-y-6">
                <h3 className="font-display text-lg font-semibold border-b border-line pb-4">
                  PUBLISH OFFICIAL WINNERS
                </h3>

                <form onSubmit={handlePublish} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] tracking-wider uppercase text-muted">
                      1ST PLACE WINNER SQUAD
                    </label>
                    <input
                      type="text"
                      required
                      value={winner}
                      onChange={(e) => setWinner(e.target.value)}
                      className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] tracking-wider uppercase text-muted">
                      2ND PLACE RUNNER UP SQUAD
                    </label>
                    <input
                      type="text"
                      required
                      value={runnerUp}
                      onChange={(e) => setRunnerUp(e.target.value)}
                      className="mt-1.5 w-full rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-line/60 pt-6">
                    {saved ? (
                      <span className="font-mono text-xs text-green">
                        ✓ Results published to live leaderboard & certificates!
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-muted">
                        Status: Draft Ready
                      </span>
                    )}
                    <Button type="submit" variant="primary">
                      Publish Official Results →
                    </Button>
                  </div>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
