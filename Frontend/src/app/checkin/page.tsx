"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";

export default function QRCheckinPage() {
  const [scanResult, setScanResult] = useState<"idle" | "approved" | "duplicate" | "invalid">("idle");
  const [lastScanned, setLastScanned] = useState<string>("");

  const triggerScan = (outcome: "approved" | "duplicate" | "invalid") => {
    setScanResult("idle");
    setTimeout(() => {
      setScanResult(outcome);
      setLastScanned(`VYU26-QR-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 400);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(720px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Gate Control Console</Kicker>
                <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[42px]">
                  QR CHECK-IN CONSOLE
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Gate volunteer verification terminal for campus entry and hall pass validation.
                </p>
              </div>
            </AnimatedSection>

            {/* Camera Viewfinder Simulation */}
            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-8 p-6 text-center md:p-8">
                <div className="relative mx-auto flex h-64 w-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-green/60 bg-ink-mid/80 p-4">
                  <div className="absolute inset-4 rounded border border-green/30 pointer-events-none" />
                  <div className="font-mono text-xs text-green animate-pulse">
                    [ SCANNING QR CODE ]
                  </div>
                </div>

                {/* Simulation Controls for Testing Gate Scanner */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => triggerScan("approved")}
                    className="rounded border border-green/40 bg-green/10 px-4 py-2 font-mono text-xs font-semibold text-green hover:bg-green/20"
                  >
                    Simulate Approved
                  </button>
                  <button
                    onClick={() => triggerScan("duplicate")}
                    className="rounded border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-mono text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
                  >
                    Simulate Duplicate
                  </button>
                  <button
                    onClick={() => triggerScan("invalid")}
                    className="rounded border border-red-500/40 bg-red-500/10 px-4 py-2 font-mono text-xs font-semibold text-red-400 hover:bg-red-500/20"
                  >
                    Simulate Invalid
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* Scanner Outcome Display */}
            {scanResult !== "idle" && (
              <AnimatedSection delay={0.1}>
                <div
                  className={`mt-6 rounded-lg p-6 text-center transition-all duration-300 ${scanResult === "approved"
                      ? "border-2 border-green bg-green/20 text-paper"
                      : scanResult === "duplicate"
                        ? "border-2 border-amber-500 bg-amber-500/20 text-paper"
                        : "border-2 border-red-500 bg-red-500/20 text-paper"
                    }`}
                >
                  {scanResult === "approved" && (
                    <div>
                      <span className="font-display text-3xl font-bold text-green">✓ ENTRY APPROVED</span>
                      <p className="mt-2 font-mono text-xs text-paper">
                        Operative: Aromal S S | Pass: {lastScanned}
                      </p>
                      <span className="mt-2 inline-block rounded bg-green/20 px-3 py-1 font-mono text-[10px] text-green border border-green/40">
                        GATE 1 PASS CONFIRMED
                      </span>
                    </div>
                  )}

                  {scanResult === "duplicate" && (
                    <div>
                      <span className="font-display text-3xl font-bold text-amber-400">⚠️ DUPLICATE SCAN</span>
                      <p className="mt-2 font-mono text-xs text-paper">
                        Pass: {lastScanned} was already scanned at 10:14 AM IST (Gate 1).
                      </p>
                      <span className="mt-2 inline-block rounded bg-amber-500/20 px-3 py-1 font-mono text-[10px] text-amber-400 border border-amber-500/40">
                        FLAGGED FOR VERIFICATION
                      </span>
                    </div>
                  )}

                  {scanResult === "invalid" && (
                    <div>
                      <span className="font-display text-3xl font-bold text-red-400">✕ INVALID PASS</span>
                      <p className="mt-2 font-mono text-xs text-paper">
                        QR signature unknown or unregistered in database.
                      </p>
                      <span className="mt-2 inline-block rounded bg-red-500/20 px-3 py-1 font-mono text-[10px] text-red-400 border border-red-500/40">
                        ACCESS DENIED
                      </span>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
