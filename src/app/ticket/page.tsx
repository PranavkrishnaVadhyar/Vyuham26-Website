"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import SealResolve from "@/components/motion/SealResolve";
import { Kicker, Button } from "@/components/ui/Elements";

export default function TicketPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(540px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Access Pass Materialization</Kicker>
                <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[42px]">
                  DIGITAL TICKET PASS
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Present this QR pass at Technocity campus gates and event venues for instant entry.
                </p>
              </div>
            </AnimatedSection>

            {/* Ticket Pass Container with Scaling Entrance and Validity Aura around QR */}
            <AnimatedSection delay={0.2}>
              <SealResolve>
                <div className="glass-card relative mt-8 overflow-hidden p-8 text-center">
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-xs">
                  <span className="text-green font-bold">VYUHAM &apos;26 PASS</span>
                  <span className="rounded border border-green/30 bg-green/10 px-2.5 py-0.5 text-[10px] text-green">
                    ● VALID & ACTIVE
                  </span>
                </div>

                {/* QR Code Container with Faint Validity Aura */}
                <div className="relative my-8 flex justify-center">
                  {/* Aura Glow Ring */}
                  <div className="absolute h-48 w-48 rounded-lg bg-green/10 blur-xl animate-pulse" />

                  {/* QR Box */}
                  <div className="relative z-10 rounded-lg border-2 border-green bg-paper/95 p-4 shadow-[0_0_30px_rgba(200,255,66,0.3)]">
                    <div className="flex h-40 w-40 flex-col items-center justify-center border-2 border-dashed border-ink p-2 text-center">
                      {/* Grid Pattern Simulating QR Code */}
                      <div className="grid h-32 w-32 grid-cols-5 gap-1">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              i % 2 === 0 || i % 5 === 0 ? "bg-ink" : "bg-ink/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pass Info */}
                <div className="space-y-2 border-t border-line/60 pt-4 font-mono text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-muted">OPERATIVE:</span>
                    <strong className="text-paper">Arjun V. Nair</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">PASS ID:</span>
                    <strong className="text-green">VYU26-QR-904812</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">ACCESS LEVEL:</span>
                    <strong className="text-paper">All-Access Fest Pass</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">VALIDITY:</span>
                    <strong className="text-paper">30 OCT — 01 NOV 2026</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">VENUE:</span>
                    <strong className="text-paper">DUK Campus, Technocity</strong>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Button
                    onClick={() => alert("Downloading Digital Ticket PDF...")}
                    variant="outline"
                    className="flex-1 justify-center"
                  >
                    Save Pass (PDF) ↓
                  </Button>
                  <Button href="/dashboard" variant="primary" className="flex-1 justify-center">
                    Dashboard →
                  </Button>
                </div>
              </div>
              </SealResolve>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
