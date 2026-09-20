"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, StreamBadge } from "@/components/ui/Elements";
import { events } from "@/data/events";
import Link from "next/link";

const dayNames = ["Ignition", "Convergence", "Aftershock"];
const dayDates = ["30 October 2026", "31 October 2026", "01 November 2026"];

function ScheduleContent() {
  const searchParams = useSearchParams();
  const initialDayParam = parseInt(searchParams.get("day") || "1", 10);
  const initialDay = (initialDayParam >= 1 && initialDayParam <= 3) ? (initialDayParam as 1 | 2 | 3) : 1;

  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(initialDay);
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const dayEvents = events
    .filter((e) => e.day === activeDay)
    .filter((e) => selectedStream === "all" || e.stream === selectedStream)
    .filter(
      (e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
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
                className={`relative cursor-pointer not-last:border-r border-line px-5 py-6 text-left transition-all ${activeDay === day ? "bg-ink-mid" : "hover:bg-ink-light"
                  }`}
              >
                {activeDay === day && (
                  <motion.span
                    layoutId="day-indicator"
                    className="absolute top-0 left-0 h-0.75 w-16 bg-green"
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

      {/* Filter and Search Bar */}
      <AnimatedSection delay={0.15} className="mt-8">
        <div className="flex flex-col gap-4 border border-line bg-ink-mid/50 p-4 md:flex-row md:items-center md:justify-between">
          {/* Stream Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted mr-2">
              Filter:
            </span>
            {[
              { id: "all", label: "ALL" },
              { id: "tech", label: "TECH" },
              { id: "culture", label: "CULTURE" },
              { id: "gaming", label: "GAMING" },
              { id: "impact", label: "IMPACT" },
            ].map((stream) => (
              <button
                key={stream.id}
                onClick={() => setSelectedStream(stream.id)}
                className={`cursor-pointer rounded-xs px-3 py-1 font-mono text-[10px] uppercase transition-all ${selectedStream === stream.id
                  ? "bg-green text-ink font-bold shadow-[0_0_12px_rgba(200,255,66,0.3)]"
                  : "border border-line text-muted hover:border-paper/40 hover:text-paper"
                  }`}
              >
                {stream.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-55">
            <input
              type="text"
              placeholder="Search schedule or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-line bg-ink px-3 py-1.5 font-mono text-xs text-paper focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-paper"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Timeline */}
      <div className="mt-10">
        {dayEvents.length > 0 ? (
          <div className="relative border-l-2 border-line pl-8">
            <motion.span
              aria-hidden="true"
              className="absolute top-0 bottom-0 -left-0.5 w-0.5 origin-top bg-linear-to-b from-green via-green/60 to-transparent"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
            {dayEvents.map((event, i) => (
              <AnimatedSection key={event.slug} delay={i * 0.05}>
                <div className="group relative not-last:mb-8">
                  {/* Timeline dot */}
                  <div className="absolute -left-10.25 top-2 h-3 w-3 rounded-full border-2 border-green bg-ink transition-all group-hover:bg-green group-hover:shadow-[0_0_12px_rgba(200,255,66,0.4)]" />

                  <Link
                    href={`/events/${event.slug}`}
                    className="glass-card glass-card-hover block rounded-sm p-6 no-underline"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[11px] font-medium text-green">
                          {event.time}
                        </span>
                        <StreamBadge stream={event.stream} />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
                        Status: <span className="text-paper font-semibold">{event.status}</span>
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-lg font-semibold text-paper transition-colors group-hover:text-green">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-xs leading-[1.7] text-muted">
                      {event.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line/40 pt-3">
                      <span className="font-mono text-[10px] text-muted">
                        📍 {event.venue}
                      </span>
                      <span className="font-mono text-[10px] text-muted">
                        👥 {event.teamSize}
                      </span>
                      {event.prizes && (
                        <span className="font-mono text-[10px] text-green">
                          🏆 {event.prizes}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-line bg-ink-mid/20 p-8">
            <p className="font-mono text-sm text-muted">
              {searchQuery || selectedStream !== "all"
                ? "No schedule events match your active filters."
                : "Schedule for this day will be announced soon."}
            </p>
            {(searchQuery || selectedStream !== "all") && (
              <button
                onClick={() => {
                  setSelectedStream("all");
                  setSearchQuery("");
                }}
                className="mt-4 inline-block font-mono text-xs text-green underline cursor-pointer"
              >
                Clear filters & search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-23">
        <section className="py-24 md:py-36">
          <Suspense fallback={
            <div className="py-24 text-center font-mono text-sm text-muted">
              Loading schedule protocol...
            </div>
          }>
            <ScheduleContent />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}

