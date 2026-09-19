"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function PaymentGatewayPage() {
  const [method, setMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("pending");
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(560px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="text-center">
                <Kicker>Verification Chamber</Kicker>
                <h1 className="mt-3 font-display text-[32px] font-semibold md:text-[42px]">
                  SECURE PAYMENT
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Transaction verification portal for Vyuham 26 registrations.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="glass-card mt-8 p-6 md:p-8">
                {status === "success" ? (
                  <div className="py-8 text-center animate-in zoom-in duration-500">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-green bg-green/20 text-3xl text-green shadow-[0_0_30px_rgba(200,255,66,0.4)]">
                      ✓
                    </div>
                    <h2 className="mt-4 font-display text-2xl font-bold text-paper">
                      PAYMENT VERIFIED
                    </h2>
                    <p className="mt-2 text-xs font-mono text-muted">
                      TRANSACTION REF: <strong className="text-green">TXN-VYU-984021</strong>
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                      <Button href="/receipt" variant="outline">
                        View Receipt
                      </Button>
                      <Button href="/confirmation" variant="primary">
                        Mission Confirmation →
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePayment} className="space-y-5">
                    <div className="rounded border border-line bg-ink-mid/40 p-4 flex justify-between items-center font-mono text-sm">
                      <span className="text-muted">TOTAL DUE:</span>
                      <span className="font-bold text-green text-lg">₹1,230</span>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] tracking-wider uppercase text-muted">
                        SELECT PAYMENT METHOD
                      </label>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setMethod("upi")}
                          className={`rounded border py-3 font-mono text-xs font-medium transition-all ${
                            method === "upi"
                              ? "border-green bg-green/10 text-green"
                              : "border-line bg-ink-mid/40 text-muted"
                          }`}
                        >
                          UPI / QR
                        </button>
                        <button
                          type="button"
                          onClick={() => setMethod("card")}
                          className={`rounded border py-3 font-mono text-xs font-medium transition-all ${
                            method === "card"
                              ? "border-green bg-green/10 text-green"
                              : "border-line bg-ink-mid/40 text-muted"
                          }`}
                        >
                          CARD
                        </button>
                        <button
                          type="button"
                          onClick={() => setMethod("netbanking")}
                          className={`rounded border py-3 font-mono text-xs font-medium transition-all ${
                            method === "netbanking"
                              ? "border-green bg-green/10 text-green"
                              : "border-line bg-ink-mid/40 text-muted"
                          }`}
                        >
                          NET BANKING
                        </button>
                      </div>
                    </div>

                    {method === "upi" && (
                      <div className="rounded border border-line bg-ink-mid/40 p-5 text-center">
                        <div className="mx-auto h-32 w-32 rounded bg-paper/90 p-2 flex items-center justify-center">
                          <div className="h-full w-full border-2 border-dashed border-ink flex items-center justify-center font-mono text-[10px] text-ink font-bold">
                            [ MOCK UPI QR ]
                          </div>
                        </div>
                        <p className="mt-3 font-mono text-xs text-muted">
                          Scan with GPay, PhonePe, or Paytm
                        </p>
                        <input
                          type="text"
                          placeholder="vyuham26@upi"
                          readOnly
                          className="mt-2 w-full rounded border border-line bg-ink px-3 py-2 text-center font-mono text-xs text-green"
                        />
                      </div>
                    )}

                    {status === "pending" && (
                      <div className="flex items-center justify-center gap-3 py-4 font-mono text-xs text-muted">
                        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-muted border-t-transparent" />
                        VERIFYING TRANSACTION WITH BANK CHAMBER...
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full justify-center"
                      disabled={status === "pending"}
                    >
                      {status === "pending" ? "VERIFYING..." : "PAY & VERIFY (₹1,230)"}
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
