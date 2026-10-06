import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { useAuth } from "@/context/AuthContext";
import { paymentsApi, registrationsApi, eventsApi, type EventRecord } from "@/lib/api";
import { toast } from "@/components/ui/Toaster";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const reduceMotion = usePrefersReducedMotion();

  const [items, setItems] = useState([
    { id: "1", title: "Hackathon — 24HR", fee: 1000, stream: "TECH", squad: "CyberVipers" },
    { id: "2", title: "Capture the Flag", fee: 400, stream: "TECH", squad: "CyberVipers" },
    { id: "3", title: "Best Management Team", fee: 400, stream: "MANAGEMENT", squad: "Apex Strikers" },
  ]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      registrationsApi.listMine().catch(() => []),
      eventsApi.list().catch(() => []),
    ]).then(([regs, eventsList]) => {
      if (Array.isArray(regs) && regs.length > 0 && Array.isArray(eventsList)) {
        const mapped = regs.map((r, idx) => {
          const ev = eventsList.find((e) => e.id === r.event_id);
          const feeStr = ev?.fee ? String(ev.fee).replace(/[^0-9]/g, "") : "400";
          const feeVal = parseInt(feeStr, 10) || 400;
          return {
            id: r.id || String(idx + 1),
            title: ev?.name || `Operation ${r.event_id.slice(0, 8)}`,
            fee: feeVal,
            stream: (ev?.stream || "TECH").toUpperCase(),
            squad: r.team_id ? "Squad Linked" : "Solo",
          };
        });
        setItems(mapped);
      }
    });
  }, [isAuthenticated]);

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.fee, 0);
  const platformFee = items.length > 0 ? 30 : 0;
  const grandTotal = subtotal + platformFee;

  const handleProceedToPayment = async () => {
    if (items.length === 0) return;
    setIsCreatingOrder(true);
    try {
      const order = await paymentsApi.createOrder({
        registration_ids: items.map((i) => i.id),
        payment_method: "upi",
        subtotal,
        platform_fee: platformFee,
      });
      sessionStorage.setItem("vyuham_active_payment", JSON.stringify(order));
      router.push(`/payment?order_id=${order.payment_id}&ref=${order.transaction_ref}`);
    } catch (err: any) {
      toast(`Checkout Error: ${err?.message || "Failed to initialize order"}`, "error");
    } finally {
      setIsCreatingOrder(false);
    }
  };

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
                        animate={{ opacity: 1, scale: 1, color: "#2ee59d" }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        className="text-green font-bold text-base block"
                      >
                        ₹{grandTotal}
                      </motion.span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      disabled={items.length === 0 || isCreatingOrder}
                      className="w-full rounded border border-green/50 bg-green/20 py-3.5 px-4 font-mono text-xs font-bold uppercase tracking-widest text-green transition-all hover:bg-green hover:text-black disabled:opacity-50 cursor-pointer"
                    >
                      {isCreatingOrder ? "INITIALIZING SECURE GATEWAY..." : "Proceed to Verification Chamber →"}
                    </button>
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
