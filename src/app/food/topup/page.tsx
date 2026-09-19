"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function CouponTopupPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [amount, setAmount] = useState<number>(300);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(540px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Recharge Channel</Kicker>
                <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[42px]">
                  COUPON TOP-UP
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Add food court credits directly to your Vyuham digital wallet.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-8 p-6 md:p-8">
                <label className="block font-mono text-[10px] tracking-wider uppercase text-muted">
                  SELECT RECHARGE PACK
                </label>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[100, 300, 500].map((val) => (
                    <motion.button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                      className={`rounded border py-3 font-mono text-sm font-bold transition-all ${
                        amount === val
                          ? "border-green bg-green/10 text-green"
                          : "border-line bg-ink-mid/40 text-muted hover:text-paper"
                      }`}
                    >
                      + ₹{val}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 border-t border-line/60 pt-6 space-y-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Current Balance:</span>
                    <span className="text-paper">₹450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Recharge Amount:</span>
                    <motion.span
                      key={amount}
                      initial={reduceMotion ? false : { opacity: 0, x: 10, scale: 1.15 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 22 }}
                      className="text-green font-bold inline-block"
                    >
                      + ₹{amount}
                    </motion.span>
                  </div>
                  <div className="flex justify-between border-t border-line/40 pt-3 text-sm">
                    <span className="text-paper font-bold">NEW WALLET BALANCE:</span>
                    <motion.span
                      key={`total-${amount}`}
                      initial={reduceMotion ? false : { opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="text-amber-400 font-bold inline-block"
                    >
                      ₹{450 + amount}
                    </motion.span>
                  </div>
                </div>

                <div className="mt-8">
                  <Button href="/payment" variant="primary" className="w-full justify-center">
                    Proceed to Payment (₹{amount}) →
                  </Button>
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
