"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function VendorRedemptionPage() {
  const [amount, setAmount] = useState("120");
  const [status, setStatus] = useState<"idle" | "verifying" | "approved" | "declined">("idle");

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("verifying");
    setTimeout(() => {
      if (parseInt(amount, 10) <= 450) {
        setStatus("approved");
      } else {
        setStatus("declined");
      }
    }, 600);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(540px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Supply Checkpoint</Kicker>
                <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[42px]">
                  VENDOR REDEMPTION
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Fast scan and redemption portal built for busy food court stalls.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-8 p-6 md:p-8">
                {status === "approved" ? (
                  <div className="py-8 text-center bg-green/20 border-2 border-green rounded-lg animate-in zoom-in duration-300">
                    <span className="font-display text-4xl font-bold text-green block">✓ REDEEMED</span>
                    <p className="mt-2 font-mono text-sm text-paper">Amount Debited: ₹{amount}</p>
                    <span className="mt-1 block font-mono text-xs text-muted">New Operative Balance: ₹330</span>
                    <div className="mt-6">
                      <Button onClick={() => setStatus("idle")} variant="primary">
                        Next Customer Scan →
                      </Button>
                    </div>
                  </div>
                ) : status === "declined" ? (
                  <div className="py-8 text-center bg-red-500/20 border-2 border-red-500 rounded-lg animate-in zoom-in duration-300">
                    <span className="font-display text-4xl font-bold text-red-400 block">✕ INSUFFICIENT FUNDS</span>
                    <p className="mt-2 font-mono text-sm text-paper">Requested: ₹{amount} | Balance: ₹450</p>
                    <div className="mt-6">
                      <Button onClick={() => setStatus("idle")} variant="outline">
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRedeem} className="space-y-4">
                    <div>
                      <label className="block font-mono text-[10px] tracking-wider uppercase text-muted">
                        STALL REDEMPTION AMOUNT (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1.5 w-full rounded border border-line bg-ink-mid/60 px-4 py-3 font-mono text-xl text-green text-center font-bold focus:border-green focus:outline-none"
                      />
                    </div>

                    <div className="rounded border border-line bg-ink/80 p-4 text-center">
                      <span className="font-mono text-xs text-muted block">[ TAP OR SCAN OPERATIVE WALLET QR ]</span>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full justify-center text-base py-3"
                      disabled={status === "verifying"}
                    >
                      {status === "verifying" ? "VERIFYING..." : "CONFIRM REDEMPTION (₹" + amount + ")"}
                    </Button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
