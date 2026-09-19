"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Chip, StreamBadge } from "@/components/ui/Elements";
import { events } from "@/data/events";

const streams = ["all", "tech", "culture", "gaming", "impact"] as const;
const days = ["all", "1", "2", "3"] as const;

export default function EventsPage() {
  const [activeStream, setActiveStream] = useState<string>("all");
  const [activeDay, setActiveDay] = useState<string>("all");

  const filtered = events.filter((e) => {
    const streamMatch =
      activeStream === "all" || e.stream === activeStream;
    const dayMatch = activeDay === "all" || e.day === Number(activeDay);
    return streamMatch && dayMatch;
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>
                <span className="signal-dot" />
                Mission registry
              </Kicker>
              <h1 className="mt-4 font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.85]">
                ALL <em>EVENTS.</em>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-[1.7] text-muted">
                30+ events across four streams. Filter by stream or day to find
                your next challenge.
              </p>
            </AnimatedSection>

            {/* Filters */}
            <AnimatedSection delay={0.15} className="mt-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  Stream:
                </span>
                {streams.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveStream(s)}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-all ${
                      activeStream === s
                        ? "border-green/50 bg-green/10 text-green"
                        : "border-line text-muted hover:border-green/30 hover:text-paper"
                    }`}
                  >
                    {s === "all" ? "All" : s}
                  </button>
                ))}

                <span className="ml-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted max-md:ml-0">
                  Day:
                </span>
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-all ${
                      activeDay === d
                        ? "border-green/50 bg-green/10 text-green"
                        : "border-line text-muted hover:border-green/30 hover:text-paper"
                    }`}
                  >
                    {d === "all" ? "All" : `Day ${d}`}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* Event cards grid */}
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event, i) => (
                <AnimatedSection key={event.slug} delay={i * 0.05}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="glass-card glass-card-hover group block rounded-sm p-6 no-underline"
                  >
                    <div className="flex items-center justify-between">
                      <StreamBadge stream={event.stream} />
                      <Chip variant={event.status}>{event.status}</Chip>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-semibold text-paper transition-colors group-hover:text-green">
                      {event.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-[1.7] text-muted">
                      {event.description}
                    </p>

                    <div className="mt-4 flex items-center gap-4 border-t border-line pt-4">
                      <span className="font-mono text-[9px] text-muted">
                        Day {event.day}
                      </span>
                      <span className="font-mono text-[9px] text-muted">
                        {event.time}
                      </span>
                      <span className="font-mono text-[9px] text-muted">
                        {event.venue}
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-16 text-center">
                <p className="font-mono text-sm text-muted">
                  No events match this filter. Try a different combination.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
