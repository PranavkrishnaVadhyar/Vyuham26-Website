"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import GaugeFill from "@/components/motion/GaugeFill";
import { Kicker, Button } from "@/components/ui/Elements";

export default function FoodWalletPage() {
  const balance = 450;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(560px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Energy Reserve</Kicker>
                <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[42px]">
                  FOOD COUPON WALLET
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Digital coupon wallet for Technocity food court stalls and refreshments.
                </p>
              </div>
            </AnimatedSection>

            {/* Energy Reserve Gauge */}
            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-8 p-8 text-center">
                <span className="font-mono text-xs text-muted uppercase tracking-wider block">
                  AVAILABLE CREDIT BALANCE
                </span>

                <strong className="mt-3 block font-display text-5xl font-bold text-amber-400">
                  ₹{balance}
                </strong>

                {/* Balance Fill Gauge Bar */}
                <GaugeFill
                  percent={Math.min(100, (balance / 1000) * 100)}
                  className="mt-6"
                />
                <span className="mt-2 block font-mono text-[10px] text-muted">
                  Max Gauge Capacity: ₹1,000
                </span>

                <div className="mt-8 flex gap-3">
                  <Button href="/food/topup" variant="primary" className="flex-1 justify-center">
                    Top-up Wallet +
                  </Button>
                  <Button href="/food" variant="outline" className="flex-1 justify-center">
                    Food Directory ↗
                  </Button>
                </div>

                {/* Recent Transaction Log */}
                <div className="mt-8 border-t border-line/60 pt-6 text-left">
                  <h4 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
                    RECENT REDEMPTIONS
                  </h4>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-line/30 pb-2">
                      <span className="text-paper">Stall 04 — Cyber Café</span>
                      <span className="text-red-400">- ₹150</span>
                    </div>
                    <div className="flex justify-between border-b border-line/30 pb-2">
                      <span className="text-paper">Stall 01 — DUK Refreshments</span>
                      <span className="text-red-400">- ₹80</span>
                    </div>
                    <div className="flex justify-between text-green">
                      <span>Online Wallet Top-up</span>
                      <span>+ ₹500</span>
                    </div>
                  </div>
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
