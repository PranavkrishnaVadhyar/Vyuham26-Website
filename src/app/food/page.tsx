"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

export default function FoodCourtDirectoryPage() {
  const vendors = [
    { name: "DUK Central Refreshments", category: "Snacks & Beverages", status: "OPEN", location: "Main Zone A" },
    { name: "Cyber Cyber Café", category: "Coffee & Burgers", status: "OPEN", location: "Technocity Hub" },
    { name: "Malabar Spice Express", category: "Kerala Meals & Biryani", status: "OPEN", location: "Food Court Stall 03" },
    { name: "Wok & Roll Noodles", category: "Asian Street Food", status: "CLOSING SOON", location: "Food Court Stall 04" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1100px,calc(100%-48px))] md:w-[min(1100px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Resource Grid</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    FOOD COURT <em>DIRECTORY</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Explore live food stalls and use your digital coupon wallet for cashless payments.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button href="/food/wallet" variant="outline">
                    My Wallet (₹450)
                  </Button>
                  <Button href="/food/topup" variant="primary">
                    Top-up Balance +
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            {/* Vendor Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {vendors.map((vendor, idx) => (
                <AnimatedSection key={vendor.name} delay={0.05 * idx}>
                  <div className="glass-card p-6 flex flex-col justify-between h-full border border-line hover:border-green/30 transition-all">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-muted">{vendor.category}</span>
                        <span
                          className={`font-mono text-[10px] px-2.5 py-0.5 rounded border ${
                            vendor.status === "OPEN"
                              ? "border-green/30 bg-green/10 text-green"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          ● {vendor.status}
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-xl font-bold text-paper">
                        {vendor.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-muted">
                        Location: <strong className="text-paper">{vendor.location}</strong>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-line/60 flex justify-between items-center">
                      <span className="font-mono text-xs text-green">Accepts Digital Wallet Pass</span>
                      <Button href="/food/vendor" variant="outline">
                        Redeem Here →
                      </Button>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
