"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, StreamBadge } from "@/components/ui/Elements";
import { events } from "@/data/events";

const dayNames = ["Ignition", "Convergence", "Aftershock"];

const dayDates = [
  "30 October 2026",
  "31 October 2026",
  "01 November 2026",
];

const streamFilters = [
  { id: "all", label: "ALL", code: "00" },
  { id: "tech", label: "TECH", code: "01" },
  { id: "culture", label: "CULTURE", code: "02" },
  { id: "gaming", label: "GAMING", code: "03" },
  { id: "management", label: "MANAGMENT", code: "04" },
];

const streamAccent: Record<string, string> = {
  tech: "text-green border-green/30 bg-green/5",
  culture: "text-purple-300 border-purple-400/30 bg-purple-400/5",
  gaming: "text-cyan-300 border-cyan-400/30 bg-cyan-400/5",
  management: "text-amber-300 border-amber-400/30 bg-amber-400/5",
};

const streamGlow: Record<string, string> = {
  tech: "group-hover:border-green/40",
  culture: "group-hover:border-purple-400/40",
  gaming: "group-hover:border-cyan-400/40",
  management: "group-hover:border-amber-400/40",
};

function ScheduleBackground() {
  const particles = Array.from({ length: 42 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,255,66,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,66,0.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Moving scan beam */}
      <motion.div
        className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-green/50 to-transparent"
        animate={{
          top: ["0%", "100%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Secondary scan beam */}
      <motion.div
        className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-paper/10 to-transparent"
        animate={{
          top: ["100%", "0%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Particles */}
      {particles.map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-0.5 w-0.5 rounded-full bg-green/40"
          style={{
            left: `${(i * 31) % 100}%`,
            top: `${(i * 47) % 100}%`,
          }}
          animate={{
            opacity: [0.05, 0.7, 0.05],
            y: [-10, 10, -10],
            scale: [0.6, 1.4, 0.6],
          }}
          transition={{
            duration: 3 + (i % 5),
            repeat: Infinity,
            delay: (i % 9) * 0.35,
          }}
        />
      ))}

      {/* Corner glow */}
      <div className="absolute right-[-15%] top-[5%] h-105 w-105 rounded-full bg-green/3.5 blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-10%] h-105 w-105 rounded-full bg-green/2.5 blur-3xl" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
}

function SignalBars({
  active,
  total,
}: {
  active: number;
  total: number;
}) {
  return (
    <div className="flex items-end gap-0.75">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          className={`w-0.75 ${i < active ? "bg-green" : "bg-line"
            }`}
          style={{
            height: `${5 + i * 3}px`,
          }}
          animate={
            i < active
              ? {
                opacity: [0.45, 1, 0.45],
              }
              : {
                opacity: 0.35,
              }
          }
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

function ScheduleContent() {
  const searchParams = useSearchParams();

  const initialDayParam = parseInt(
    searchParams.get("day") || "1",
    10
  );

  const initialDay =
    initialDayParam >= 1 && initialDayParam <= 3
      ? (initialDayParam as 1 | 2 | 3)
      : 1;

  const [activeDay, setActiveDay] =
    useState<1 | 2 | 3>(initialDay);

  const [selectedStream, setSelectedStream] =
    useState<string>("all");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [currentTime, setCurrentTime] =
    useState("");

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const dayEvents = useMemo(() => {
    return events
      .filter((event) => event.day === activeDay)
      .filter(
        (event) =>
          selectedStream === "all" ||
          event.stream === selectedStream
      )
      .filter((event) => {
        const query = searchQuery.toLowerCase().trim();

        if (!query) return true;

        return (
          event.title.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [activeDay, selectedStream, searchQuery]);

  const totalDayEvents = events.filter(
    (event) => event.day === activeDay
  ).length;

  const filteredCount = dayEvents.length;

  const progress =
    totalDayEvents > 0
      ? Math.min(
        100,
        Math.max(
          5,
          (filteredCount / totalDayEvents) * 100
        )
      )
      : 0;

  return (
    <div className="relative mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">
      <ScheduleBackground />

      {/* TOP HUD */}
      <div className="mb-10 grid grid-cols-2 gap-px border border-line bg-line/40 md:grid-cols-4">
        {[
          {
            label: "SYSTEM",
            value: "ONLINE",
            accent: true,
          },
          {
            label: "UPLINK",
            value: "VYUHAM_26",
          },
          {
            label: "CLOCK",
            value: currentTime || "--:--:--",
          },
          {
            label: "CHANNEL",
            value: `DAY_${String(activeDay).padStart(2, "0")}`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-ink/90 px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] tracking-[0.2em] text-muted">
                {item.label}
              </span>

              {item.accent && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(200,255,66,0.8)]" />
              )}
            </div>

            <div
              className={`mt-1 font-mono text-[11px] tracking-[0.12em] ${item.accent ? "text-green" : "text-paper"
                }`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* HERO */}
      <AnimatedSection>
        <Kicker>
          <span className="signal-dot" />
          Mission protocol timeline
        </Kicker>

        <div className="relative mt-4">
          <div className="absolute -left-5 top-0 hidden h-full w-px bg-linear-to-b from-green/60 via-green/10 to-transparent md:block" />

          <h1 className="font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.82] tracking-[-0.04em]">
            THE <em className="text-green">SCHEDULE.</em>
          </h1>

          <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <p className="max-w-xl text-sm leading-[1.8] text-muted">
              Three days. Multiple channels. One convergence point.
              Navigate the VYUHAM&apos;26 event protocol and locate
              your next challenge.
            </p>

            <div className="flex items-center gap-3">
              <SignalBars active={5} total={6} />

              <div>
                <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                  Transmission
                </div>
                <div className="font-mono text-[10px] text-green">
                  STABLE
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* DAY NAVIGATION */}
      <AnimatedSection
        delay={0.1}
        className="mt-12"
      >
        <LayoutGroup>
          <div className="relative grid overflow-hidden border border-line md:grid-cols-3">
            {([1, 2, 3] as const).map((day) => {
              const count = events.filter(
                (event) => event.day === day
              ).length;

              const isActive = activeDay === day;

              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`group relative cursor-pointer border-line px-5 py-6 text-left transition-all md:not-last:border-r ${isActive
                      ? "bg-ink-mid"
                      : "bg-ink/70 hover:bg-ink-light"
                    }`}
                >
                  {isActive && (
                    <>
                      <motion.span
                        layoutId="day-indicator"
                        className="absolute left-0 top-0 h-0.75 w-20 bg-green shadow-[0_0_14px_rgba(200,255,66,0.5)]"
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 28,
                        }}
                      />

                      <motion.span
                        layoutId="day-glow"
                        className="absolute inset-0 bg-green/2.5"
                      />
                    </>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-[0.2em] text-muted">
                        DAY {String(day).padStart(2, "0")}
                      </span>

                      <span
                        className={`font-mono text-[8px] ${isActive
                            ? "text-green"
                            : "text-muted"
                          }`}
                      >
                        {String(count).padStart(2, "0")} EVT
                      </span>
                    </div>

                    <strong
                      className={`mt-4 block font-display text-xl font-medium transition-colors md:text-2xl ${isActive
                          ? "text-paper"
                          : "text-muted group-hover:text-paper"
                        }`}
                    >
                      {dayDates[day - 1]
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}
                    </strong>

                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`h-1 w-1 rounded-full ${isActive
                            ? "bg-green"
                            : "bg-line"
                          }`}
                      />

                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                        {dayNames[day - 1]}
                      </p>
                    </div>

                    {/* Mini signal */}
                    <div className="mt-5 flex gap-1">
                      {Array.from({ length: 12 }).map(
                        (_, i) => (
                          <span
                            key={i}
                            className={`h-px flex-1 ${i <
                                Math.round(
                                  (count / Math.max(events.length, 1)) *
                                  12
                                )
                                ? isActive
                                  ? "bg-green/70"
                                  : "bg-line"
                                : "bg-line/40"
                              }`}
                          />
                        )
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </AnimatedSection>

      {/* COMMAND CENTER */}
      <AnimatedSection
        delay={0.15}
        className="mt-8"
      >
        <div className="relative overflow-hidden border border-line bg-ink-mid/60">
          {/* top status strip */}
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                Command Center
              </span>
            </div>

            <span className="font-mono text-[8px] text-muted">
              SYS::FILTER_INTERFACE
            </span>
          </div>

          <div className="flex flex-col gap-5 p-4 lg:flex-row lg:items-center lg:justify-between">
            {/* STREAM FILTER */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                Stream
              </span>

              {streamFilters.map((stream) => {
                const active =
                  selectedStream === stream.id;

                return (
                  <button
                    key={stream.id}
                    onClick={() =>
                      setSelectedStream(stream.id)
                    }
                    className={`relative cursor-pointer overflow-hidden border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-all ${active
                        ? "border-green/50 bg-green text-ink shadow-[0_0_16px_rgba(200,255,66,0.18)]"
                        : "border-line text-muted hover:border-paper/30 hover:text-paper"
                      }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="stream-active"
                        className="absolute inset-0 bg-green"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-2">
                      <span>{stream.code}</span>
                      <span>{stream.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SEARCH */}
            <div className="relative w-full lg:w-[320px]">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <span className="font-mono text-[10px] text-green">
                  &gt;_
                </span>
              </div>

              <input
                type="text"
                placeholder="SEARCH PROTOCOL..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full border border-line bg-ink py-2 pl-10 pr-10 font-mono text-[10px] uppercase tracking-[0.08em] placeholder:text-muted/50 focus:border-green-dim focus:outline-none"
              />

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer font-mono text-[10px] text-muted transition-colors hover:text-green"
                  aria-label="Clear search"
                >
                  ESC
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[8px] text-muted">
                  /
                </span>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* RESULTS HUD */}
      <AnimatedSection
        delay={0.2}
        className="mt-8"
      >
        <div className="flex flex-col gap-4 border-y border-line py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
              Channel {String(activeDay).padStart(2, "0")}
            </span>

            <span className="h-3 w-px bg-line" />

            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper">
              {dayNames[activeDay - 1]}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden h-1 w-24 overflow-hidden bg-line sm:block">
              <motion.div
                className="h-full bg-green"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <span className="font-mono text-[9px] text-green">
              {String(filteredCount).padStart(2, "0")}{" "}
              /{" "}
              {String(totalDayEvents).padStart(2, "0")} EVENTS
            </span>
          </div>
        </div>
      </AnimatedSection>

      {/* TIMELINE */}
      <div className="mt-10">
        <AnimatePresence mode="wait">
          {dayEvents.length > 0 ? (
            <motion.div
              key={`${activeDay}-${selectedStream}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative space-y-8 border-l border-line pl-7 md:pl-10"
            >
              {/* Main energy beam */}
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 -left-px top-0 w-px origin-top bg-linear-to-b from-green via-green/50 to-transparent"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                }}
              />

              {dayEvents.map((event, i) => {
                const accent =
                  streamAccent[event.stream] ||
                  streamAccent.tech;

                const glow =
                  streamGlow[event.stream] ||
                  streamGlow.tech;

                return (
                  <AnimatedSection
                    key={event.slug}
                    delay={i * 0.06}
                  >
                    <div className="group relative">
                      {/* Timeline node */}
                      <motion.div
                        className={`absolute -left-9.25 top-7 h-3 w-3 rounded-full border bg-ink md:-left-12.25 ${event.stream === "culture"
                            ? "border-purple-300"
                            : event.stream === "gaming"
                              ? "border-cyan-300"
                              : event.stream === "management"
                                ? "border-amber-300"
                                : "border-green"
                          }`}
                        whileHover={{
                          scale: 1.5,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                      />

                      {/* Node pulse */}
                      <motion.div
                        className="absolute -left-8.5 top-7.5 h-1.5 w-1.5 rounded-full bg-green md:-left-11.5"
                        animate={{
                          opacity: [0.25, 1, 0.25],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />

                      <Link
                        href={`/events/${event.slug}`}
                        className={`glass-card glass-card-hover relative block overflow-hidden rounded-sm border border-transparent p-5 no-underline transition-all duration-500 md:p-6 ${glow}`}
                      >
                        {/* Card scanline */}
                        <motion.div
                          aria-hidden="true"
                          className="pointer-events-none absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-green/50 to-transparent opacity-0 group-hover:opacity-100"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />

                        {/* Corner markers */}
                        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-green/20 opacity-0 transition-opacity group-hover:opacity-100" />
                        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-green/20 opacity-0 transition-opacity group-hover:opacity-100" />

                        {/* Event header */}
                        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-[9px] tracking-[0.18em] text-green">
                              EVT_
                              {String(i + 1).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <span className="h-3 w-px bg-line" />

                            <span className="font-mono text-[11px] font-medium text-paper">
                              {event.time}
                            </span>

                            <StreamBadge
                              stream={event.stream}
                            />
                          </div>

                          <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
                            <span className="text-green">
                              ●
                            </span>{" "}
                            {event.status}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="relative z-10 mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-paper transition-colors group-hover:text-green md:text-2xl">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="relative z-10 mt-2 max-w-2xl text-xs leading-[1.8] text-muted">
                          {event.description}
                        </p>

                        {/* Metadata */}
                        <div className="relative z-10 mt-5 grid gap-3 border-t border-line/50 pt-4 sm:grid-cols-3">
                          <div>
                            <span className="block font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                              LOCATION
                            </span>

                            <span className="mt-1 block font-mono text-[9px] text-paper">
                              {event.venue}
                            </span>
                          </div>

                          <div>
                            <span className="block font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                              PARTICIPANTS
                            </span>

                            <span className="mt-1 block font-mono text-[9px] text-paper">
                              {event.teamSize}
                            </span>
                          </div>

                          <div>
                            <span className="block font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                              REWARD
                            </span>

                            <span
                              className={`mt-1 block font-mono text-[9px] ${event.prizes
                                  ? "text-green"
                                  : "text-muted"
                                }`}
                            >
                              {event.prizes || "CLASSIFIED"}
                            </span>
                          </div>
                        </div>

                        {/* Access */}
                        <div className="absolute bottom-5 right-5 translate-x-2 font-mono text-[8px] uppercase tracking-[0.18em] text-green opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                          ACCESS →
                        </div>

                        {/* Stream accent */}
                        <div
                          className={`absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full ${event.stream === "culture"
                              ? "bg-purple-300"
                              : event.stream === "gaming"
                                ? "bg-cyan-300"
                                : event.stream === "management"
                                  ? "bg-amber-300"
                                  : "bg-green"
                            }`}
                        />
                      </Link>
                    </div>
                  </AnimatedSection>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="relative overflow-hidden border border-dashed border-line bg-ink-mid/30 p-12 text-center"
            >
              <div className="absolute inset-0 opacity-[0.04]">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(200,255,66,0.3) 1px, transparent 1px), linear-gradient(rgba(200,255,66,0.3) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              <div className="relative z-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-green/20">
                  <span className="font-mono text-lg text-green">
                    ∅
                  </span>
                </div>

                <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-green">
                  Signal Lost
                </div>

                <p className="mt-3 font-mono text-xs text-muted">
                  {searchQuery ||
                    selectedStream !== "all"
                    ? "No schedule events match the active protocol filters."
                    : "Schedule for this channel will be announced soon."}
                </p>

                {(searchQuery ||
                  selectedStream !== "all") && (
                    <button
                      onClick={() => {
                        setSelectedStream("all");
                        setSearchQuery("");
                      }}
                      className="mt-5 cursor-pointer border border-green/30 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-green transition-all hover:bg-green hover:text-ink"
                    >
                      Reset Protocol
                    </button>
                  )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER TRANSMISSION */}
      <AnimatedSection
        delay={0.2}
        className="mt-20"
      >
        <div className="relative overflow-hidden border border-line bg-ink-mid/40 px-6 py-8 md:px-8">
          <motion.div
            className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-green to-transparent"
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
          />

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-green">
                  Future Awaits
                </span>
              </div>

              <h2 className="mt-3 font-display text-2xl font-medium md:text-3xl">
                THE NEXT SIGNAL
                <br />
                <em className="text-green">
                  IS YOURS.
                </em>
              </h2>
            </div>

            <div className="max-w-sm">
              <p className="text-xs leading-[1.8] text-muted">
                Select a protocol. Enter the arena.
                Connect with the future.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-px w-12 bg-green/60" />

                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                  VYUHAM_26 // SYSTEM READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <>
      <Navbar />

      <main className="relative flex-1 overflow-hidden pt-23">
        <section className="relative py-16 md:py-24 lg:py-32">
          <Suspense
            fallback={
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border border-line border-t-green" />

                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    Loading schedule protocol...
                  </p>
                </div>
              </div>
            }
          >
            <ScheduleContent />
          </Suspense>
        </section>
      </main>

      <Footer />
    </>
  );
}