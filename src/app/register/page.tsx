"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import RouteTrace from "@/components/motion/RouteTrace";
import { Kicker, Button, StreamBadge } from "@/components/ui/Elements";
import { events } from "@/data/events";

const NODE_COLUMNS = ["16.5", "50", "83.5"];

export default function RegistrationHubPage() {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "hackathon",
    "ctf",
  ]);

  const toggleEvent = (slug: string) => {
    if (selectedEvents.includes(slug)) {
      setSelectedEvents(selectedEvents.filter((s) => s !== slug));
    } else {
      setSelectedEvents([...selectedEvents, slug]);
    }
  };

  const selectedList = events.filter((e) => selectedEvents.includes(e.slug));
  const nodePath =
    selectedList.length > 0
      ? `M ${NODE_COLUMNS[events.findIndex((e) => e.slug === selectedList[0].slug) % 3]} 5 ${selectedList
          .slice(1)
          .map(
            (e) =>
              `L ${NODE_COLUMNS[events.findIndex((ev) => ev.slug === e.slug) % 3]} 5`
          )
          .join(" ")}`
      : "";

  const totalAmount = selectedList.reduce((acc, e) => {
    const feeStr = e.fee.replace(/[^0-9]/g, "");
    return acc + (feeStr ? parseInt(feeStr, 10) : 0);
  }, 0);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <Kicker>Mission Selection Board</Kicker>
                  <h1 className="mt-3 font-display text-[36px] font-semibold leading-[0.9] md:text-[54px]">
                    REGISTRATION <em>HUB</em>
                  </h1>
                  <p className="mt-3 max-w-xl text-sm text-muted">
                    Select your mission operations. Chosen events light up as active nodes in your loadout route.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted">
                    LOADOUT: <strong className="text-paper">{selectedEvents.length} Selected</strong>
                  </span>
                  <Button href="/checkout" variant="primary">
                    Proceed to Loadout Review →
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            {/* Tactical Grid */}
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, idx) => {
                const isSelected = selectedEvents.includes(event.slug);
                return (
                  <AnimatedSection key={event.slug} delay={0.05 * idx}>
                    <div
                      onClick={() => toggleEvent(event.slug)}
                      className={`group relative flex cursor-pointer flex-col justify-between rounded-sm border p-6 transition-all duration-300 ${
                        isSelected
                          ? "border-green bg-ink-mid shadow-[0_0_24px_rgba(46,229,157,0.12)] energy-bloom-click"
                          : "border-line bg-ink/60 hover:border-green/30"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <StreamBadge stream={event.stream} />
                          <span
                            className={`h-5 w-5 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                              isSelected
                                ? "border-green bg-green text-ink"
                                : "border-line text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                        </div>

                        <h3 className="mt-4 font-display text-xl font-semibold text-paper group-hover:text-green">
                          {event.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs text-muted">
                          {event.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-line/60 pt-4 flex items-center justify-between font-mono text-xs">
                        <span className="text-muted">FEE: <strong className="text-paper">{event.fee}</strong></span>
                        <span className="text-muted">PRIZE: <strong className="text-green">{event.prizes}</strong></span>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>

            {/* Active Node Route — redraws as selections change */}
            {selectedList.length > 1 && (
              <RouteTrace
                key={selectedEvents.join("-")}
                paths={[{ d: nodePath }]}
                className="mx-auto mt-8 h-8 w-full max-w-xl"
                viewBox="0 0 100 10"
                duration={0.9}
                strokeWidth={1.5}
              />
            )}

            {/* Loadout Summary Bar */}
            {selectedEvents.length > 0 && (
              <div className="sticky bottom-6 mt-12 glass-card flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green/10 text-green font-mono font-bold">
                    {selectedEvents.length}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold">Active Mission Loadout</h4>
                    <p className="font-mono text-xs text-muted">
                      Total Fee: <strong className="text-green">₹{totalAmount.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button href="/teams" variant="outline">
                    Squad Formation
                  </Button>
                  <Button href="/checkout" variant="primary">
                    Proceed to Checkout (₹{totalAmount}) →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
