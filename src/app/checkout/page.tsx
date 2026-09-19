"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function CheckoutPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [items, setItems] = useState([
    { id: "1", title: "National Hackathon", fee: 500, stream: "TECH", squad: "CyberVipers" },
    { id: "2", title: "CTF Warzone", fee: 300, stream: "TECH", squad: "CyberVipers" },
    { id: "3", title: "Battle of the Bands", fee: 400, stream: "CULTURE", squad: "Solo" },
  ]);

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.fee, 0);
  const platformFee = items.length > 0 ? 30 : 0;
  const grandTotal = subtotal + platformFee;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1000px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <Kicker>Loadout Review</Kicker>
                  <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[44px]">
                    CHECKOUT & LOADOUT
                  </h1>
                </div>
                <div className="font-mono text-xs text-muted">
                  SESSION ID: <span className="text-paper">CHK-2026-8802</span>
                </div>
              </div>
            </AnimatedSection>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Selected Loadout Items */}
              <AnimatedSection delay={0.1} className="lg:col-span-2">
                <div className="glass-card p-6 md:p-8">
                  <h2 className="font-display text-lg font-semibold border-b border-line pb-4">
                    SELECTED REGISTRATIONS ({items.length})
                  </h2>

                  {items.length === 0 ? (
                    <div className="py-12 text-center font-mono text-sm text-muted">
                      No registrations in your loadout.{" "}
                      <Link href="/register" className="text-green underline">
                        Browse events →
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      <AnimatePresence initial={false}>
                        {items.map((item, i) => (
                          <motion.div
                            key={item.id}
                            layout={!reduceMotion}
                            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                            transition={{ type: "spring", stiffness: 240, damping: 26, delay: reduceMotion ? 0 : i * 0.07 }}
                            className="flex items-center justify-between overflow-hidden rounded border border-line bg-ink-mid/60 p-4 transition-all hover:border-green/30"
                          >
                            <div>
                              <span className="font-mono text-[10px] text-green">{item.stream} STREAM</span>
                              <h3 className="font-display font-semibold text-paper">{item.title}</h3>
                              <p className="font-mono text-xs text-muted">
                                Squad Mode: <strong className="text-paper">{item.squad}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-6">
                              <span className="font-mono text-sm font-bold text-green">
                                ₹{item.fee}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="font-mono text-xs text-muted hover:text-red-400"
                              >
                                ✕
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              {/* Order Summary */}
              <AnimatedSection delay={0.2}>
                <div className="glass-card p-6 md:p-8">
                  <h3 className="font-display text-lg font-semibold border-b border-line pb-4">
                    PAYMENT SUMMARY
                  </h3>

                  <div className="mt-6 space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Subtotal:</span>
                      <span className="text-paper font-semibold">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Platform / Gateway Service:</span>
                      <span className="text-paper font-semibold">₹{platformFee}</span>
                    </div>
                    <div className="border-t border-line/60 pt-4 flex justify-between text-sm">
                      <span className="text-paper font-bold">TOTAL AMOUNT:</span>
                      <motion.span
                        key={grandTotal}
                        initial={reduceMotion ? false : { opacity: 0, scale: 1.3, color: "#a3a3a3" }}
                        animate={{ opacity: 1, scale: 1, color: "#c8ff42" }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        className="text-green font-bold text-base block"
                      >
                        ₹{grandTotal}
                      </motion.span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      href="/payment"
                      variant="primary"
                      className="w-full justify-center"
                      disabled={items.length === 0}
                    >
                      Proceed to Verification Chamber →
                    </Button>
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
