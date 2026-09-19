"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, StreamBadge } from "@/components/ui/Elements";
import { events } from "@/data/events";
import Link from "next/link";

const dayNames = ["Ignition", "Convergence", "Aftershock"];
const dayDates = ["30 October 2026", "31 October 2026", "01 November 2026"];

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  const dayEvents = events
    .filter((e) => e.day === activeDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>
                <span className="signal-dot" />
                Mission protocol timeline
              </Kicker>
              <h1 className="mt-4 font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.85]">
                THE <em>SCHEDULE.</em>
              </h1>
            </AnimatedSection>

            {/* Day tabs */}
            <AnimatedSection delay={0.1} className="mt-12">
              <LayoutGroup>
                <div className="grid grid-cols-3 border border-line">
                  {([1, 2, 3] as const).map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`relative cursor-pointer border-r border-line px-5 py-6 text-left transition-all last:border-r-0 ${activeDay === day
                          ? "bg-ink-mid"
                          : "hover:bg-ink-light"
                        }`}
                    >
                      {activeDay === day && (
                        <motion.span
                          layoutId="day-indicator"
                          className="absolute top-0 left-0 h-[3px] w-16 bg-green"
                          transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        />
                      )}
                      <span className="block font-mono text-[10px] text-muted">
                        DAY {String(day).padStart(2, "0")}
                      </span>
                      <strong className="mt-3 block font-display text-lg font-medium md:text-2xl">
                        {dayDates[day - 1].split(" ").slice(0, 2).join(" ")}
                      </strong>
                      <p className="mt-1 text-xs text-muted">
                        {dayNames[day - 1]}
                      </p>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </AnimatedSection>

            {/* Timeline */}
            <div className="mt-8">
              {dayEvents.length > 0 ? (
                <div className="relative border-l-2 border-line pl-8">
                  <motion.span
                    aria-hidden="true"
                    className="absolute top-0 bottom-0 left-[-2px] w-[2px] origin-top bg-gradient-to-b from-green via-green/60 to-transparent"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                  {dayEvents.map((event, i) => (
                    <AnimatedSection key={event.slug} delay={i * 0.05}>
                      <div className="group relative mb-8 last:mb-0">
                        {/* Timeline dot */}
                        <div className="absolute -left-[41px] top-2 h-3 w-3 rounded-full border-2 border-green bg-ink transition-all group-hover:bg-green group-hover:shadow-[0_0_12px_rgba(200,255,66,0.4)]" />

                        <Link
                          href={`/events/${event.slug}`}
                          className="glass-card glass-card-hover block rounded-sm p-6 no-underline"
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-[11px] font-medium text-green">
                              {event.time}
                            </span>
                            <StreamBadge stream={event.stream} />
                          </div>

                          <h3 className="mt-3 font-display text-lg font-semibold text-paper transition-colors group-hover:text-green">
                            {event.title}
                          </h3>

                          <p className="mt-2 text-xs leading-[1.7] text-muted">
                            {event.description}
                          </p>

                          <div className="mt-3 flex items-center gap-4">
                            <span className="font-mono text-[9px] text-muted">
                              📍 {event.venue}
                            </span>
                            <span className="font-mono text-[9px] text-muted">
                              👥 {event.teamSize}
                            </span>
                          </div>
                        </Link>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              ) : (
                <p className="py-16 text-center font-mono text-sm text-muted">
                  Schedule for this day will be announced soon.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
