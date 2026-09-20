"use client";


import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Chip, StreamBadge } from "@/components/ui/Elements";
import { events } from "@/data/events";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const streams = ["all", "tech", "culture", "gaming", "impact"] as const;
const days = ["all", "1", "2", "3"] as const;

const streamColors: Record<string, string> = {
  tech: "green",
  culture: "purple",
  gaming: "cyan",
  impact: "amber",
};

const streamText: Record<string, string> = {
  tech: "text-green",
  culture: "text-purple-400",
  gaming: "text-cyan-400",
  impact: "text-amber-400",
};

const streamBg: Record<string, string> = {
  tech: "bg-green",
  culture: "bg-purple-400",
  gaming: "bg-cyan-400",
  impact: "bg-amber-400",
};

const streamBorder: Record<string, string> = {
  tech: "border-green/30",
  culture: "border-purple-500/30",
  gaming: "border-cyan-400/30",
  impact: "border-amber-400/30",
};

/* -------------------------------------------------------------------------- */
/* Animated background                                                        */
/* -------------------------------------------------------------------------- */

function EventBackground() {
  const particles = Array.from({ length: 36 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74,222,128,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Moving scanline */}
      <motion.div
        className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-green/40 to-transparent"
        animate={{
          top: ["0%", "100%"],
        }}
        transition={{
          duration: 8,
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
            left: `${(i * 29) % 100}%`,
            top: `${(i * 53) % 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            y: [-8, 8, -8],
            scale: [0.7, 1.4, 0.7],
          }}
          transition={{
            duration: 3 + (i % 5),
            repeat: Infinity,
            delay: (i % 8) * 0.3,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Cursor glow                                                                */
/* -------------------------------------------------------------------------- */

function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, {
    stiffness: 120,
    damping: 25,
  });

  const smoothY = useSpring(y, {
    stiffness: 120,
    damping: 25,
  });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-1 hidden h-56 w-56 rounded-full bg-green/5.5 blur-[80px] md:block"
      style={{
        left: smoothX,
        top: smoothY,
        x: "-50%",
        y: "-50%",
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Animated number                                                            */
/* -------------------------------------------------------------------------- */

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.round(value * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  return <>{count}</>;
}

/* -------------------------------------------------------------------------- */
/* Filter button                                                               */
/* -------------------------------------------------------------------------- */

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative cursor-pointer rounded-full border border-line px-4 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper"
    >
      {active && (
        <motion.span
          layoutId="active-filter"
          className="absolute inset-0 rounded-full border border-green/50 bg-green/10"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}

      <span className={`relative z-10 ${active ? "text-green" : ""}`}>
        {children}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Event card                                                                 */
/* -------------------------------------------------------------------------- */

function EventCard({
  event,
  index,
}: {
  event: (typeof events)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothX = useSpring(rotateX, {
    stiffness: 180,
    damping: 20,
  });

  const smoothY = useSpring(rotateY, {
    stiffness: 180,
    damping: 20,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateY.set(((x - centerX) / centerX) * 5);
    rotateX.set(-((y - centerY) / centerY) * 5);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const color = streamColors[event.stream] ?? "green";
  const text = streamText[event.stream] ?? "text-green";
  const bg = streamBg[event.stream] ?? "bg-green";
  const border = streamBorder[event.stream] ?? "border-green/30";

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 25,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: -15,
        scale: 0.96,
      }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.035, 0.25),
      }}
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformPerspective: 1000,
      }}
    >
      <Link
        href={`/events/${event.slug}`}
        className={`group relative block min-h-77.5 overflow-hidden rounded-sm border ${border} bg-white/[0.018] p-6 no-underline transition-shadow duration-500 hover:shadow-[0_0_45px_rgba(74,222,128,0.07)]`}
      >
        {/* Hover spotlight */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-green/[0.07] opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-100" />

        {/* Scanline */}
        <motion.div
          className={`pointer-events-none absolute left-0 h-px w-full ${bg} opacity-0 group-hover:opacity-40`}
          animate={{
            top: ["0%", "100%"],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Top metadata */}
        <div className="relative flex items-center justify-between">
          <StreamBadge stream={event.stream} />

          <Chip variant={event.status}>{event.status}</Chip>
        </div>

        {/* Event number */}
        <div
          className={`absolute right-5 top-16 font-mono text-[8px] tracking-[0.16em] ${text} opacity-40`}
        >
          EVT_{String(index + 1).padStart(2, "0")}
        </div>

        {/* Icon / signal */}
        <motion.div
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.1,
          }}
          className={`mt-8 font-display text-3xl ${text}`}
        >
          {event.stream === "tech" && "⌁"}
          {event.stream === "culture" && "◈"}
          {event.stream === "gaming" && "✦"}
          {event.stream === "impact" && "⊹"}
        </motion.div>

        {/* Title */}
        <h3 className="relative mt-4 max-w-[85%] font-display text-xl font-semibold text-paper transition-colors duration-300 group-hover:text-green">
          {event.title}
        </h3>

        {/* Description */}
        <p className="relative mt-3 line-clamp-3 text-xs leading-[1.75] text-muted">
          {event.description}
        </p>

        {/* Metadata */}
        <div className="absolute bottom-0 left-6 right-6 border-t border-line py-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
              D{event.day}
            </span>

            <span className="h-1 w-1 rounded-full bg-green/50" />

            <span className="font-mono text-[8px] text-muted">
              {event.time}
            </span>

            <span className="h-1 w-1 rounded-full bg-green/50" />

            <span className="truncate font-mono text-[8px] text-muted">
              {event.venue}
            </span>
          </div>

          {/* Signal */}
          <div className="mt-3 flex items-end justify-between">
            <div className="flex items-end gap-0.75">
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.span
                  key={i}
                  className={`w-1 rounded-full ${bg}`}
                  animate={{
                    height: [3, 5 + ((i + index) % 4) * 3, 3],
                    opacity: [0.2, 0.75, 0.2],
                  }}
                  transition={{
                    duration: 1 + i * 0.08,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>

            <span
              className={`font-mono text-[8px] uppercase tracking-[0.14em] text-muted transition-colors group-hover:${text}`}
            >
              ACCESS →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function EventsPage() {
  const [activeStream, setActiveStream] = useState<string>("all");
  const [activeDay, setActiveDay] = useState<string>("all");
  const [search, setSearch] = useState("");

  /* Keyboard shortcut */
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();

        document.getElementById("event-search")?.focus();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const streamMatch =
        activeStream === "all" || event.stream === activeStream;

      const dayMatch =
        activeDay === "all" || event.day === Number(activeDay);

      const searchMatch =
        search.trim() === "" ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.venue.toLowerCase().includes(search.toLowerCase());

      return streamMatch && dayMatch && searchMatch;
    });
  }, [activeStream, activeDay, search]);

  const dayCounts = {
    1: events.filter((e) => e.day === 1).length,
    2: events.filter((e) => e.day === 2).length,
    3: events.filter((e) => e.day === 3).length,
  };

  return (
    <>
      <Navbar />

      <CursorGlow />

      <main className="relative flex-1 overflow-hidden bg-[#050807] pt-23">
        {/* ================================================================
            HERO
        ================================================================= */}

        <section className="relative border-b border-line py-24 md:py-32">
          <EventBackground />

          <div className="relative mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-wrap items-center justify-between gap-5">
                <Kicker>
                  <span className="signal-dot" />
                  Mission registry
                </Kicker>

                <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-green">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                  EVENT SYSTEM ONLINE
                </div>
              </div>

              <h1 className="mt-5 font-display text-[clamp(52px,8vw,108px)] font-semibold leading-[0.82] tracking-[-0.045em]">
                ALL <span className="text-green">EVENTS.</span>
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-[1.8] text-muted">
                Every challenge. Every arena. Every signal.
                <br />
                Find your entry point into the VYUHAM dimension.
              </p>
            </AnimatedSection>

            {/* HUD */}
            <AnimatedSection delay={0.15} className="mt-12">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-sm border border-line bg-white/[0.018] p-5">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                    TOTAL EVENTS
                  </div>

                  <div className="mt-2 font-display text-4xl text-paper">
                    <AnimatedNumber value={events.length} />
                  </div>
                </div>

                <div className="rounded-sm border border-line bg-white/[0.018] p-5">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                    ACTIVE STREAMS
                  </div>

                  <div className="mt-2 font-display text-4xl text-green">
                    04
                  </div>
                </div>

                <div className="rounded-sm border border-line bg-white/[0.018] p-5">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                    DIMENSION DAYS
                  </div>

                  <div className="mt-2 font-display text-4xl text-paper">
                    03
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ================================================================
            FILTER COMMAND CENTER
        ================================================================= */}

        <section className="sticky top-23 z-40 border-b border-line bg-[#050807]/90 py-5 backdrop-blur-xl">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Stream */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
                  STREAM
                </span>

                {streams.map((stream) => (
                  <FilterButton
                    key={stream}
                    active={activeStream === stream}
                    onClick={() => setActiveStream(stream)}
                  >
                    {stream === "all" ? "ALL" : stream}
                  </FilterButton>
                ))}
              </div>

              {/* Day */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
                  DAY
                </span>

                {days.map((day) => (
                  <FilterButton
                    key={day}
                    active={activeDay === day}
                    onClick={() => setActiveDay(day)}
                  >
                    {day === "all" ? "ALL" : `DAY ${day}`}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SEARCH + DAY SIGNAL
        ================================================================= */}

        <section className="border-b border-line">
          <div className="mx-auto flex w-[min(1200px,calc(100%-48px))] flex-col gap-5 py-7 md:w-[min(1200px,calc(100%-64px))] md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-green">
                &gt;_
              </span>

              <input
                id="event-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH EVENTS..."
                className="w-full rounded-sm border border-line bg-white/2 py-3 pl-12 pr-12 font-mono text-[9px] uppercase tracking-[0.12em] placeholder:text-muted/60 outline-none transition-colors focus:border-green-dim"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded border border-line px-1.5 py-0.5 font-mono text-[7px] text-muted">
                /
              </span>
            </div>

            {/* Day pulse */}
            <div className="flex items-center gap-5 overflow-x-auto">
              {[1, 2, 3].map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(String(day))}
                  className={`group cursor-pointer whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.14em] ${
                    activeDay === String(day)
                      ? "text-green"
                      : "text-muted"
                  }`}
                >
                  <span>DAY {day}</span>

                  <span className="ml-3 inline-flex items-end gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="w-0.5 bg-current"
                        animate={{
                          height: [
                            3,
                            4 + ((i + day) % 3) * 3,
                            3,
                          ],
                        }}
                        transition={{
                          duration: 1.1 + i * 0.1,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </span>

                  <span className="ml-2 text-[7px] opacity-60">
                    {dayCounts[day as 1 | 2 | 3]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            RESULTS
        ================================================================= */}

        <section className="py-16 md:py-24">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            {/* Results HUD */}
            <div className="mb-8 flex items-center justify-between">
              <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
                SCANNING DIMENSION...
              </div>

              <div className="font-mono text-[8px] uppercase tracking-[0.16em]">
                <span className="text-green">
                  {filtered.length.toString().padStart(2, "0")}
                </span>
                <span className="text-muted"> / </span>
                <span className="text-muted">
                  {events.length.toString().padStart(2, "0")}
                </span>
                <span className="ml-2 text-muted">MATCHES</span>
              </div>
            </div>

            {/* Progress signal */}
            <div className="mb-10 h-px w-full overflow-hidden bg-line">
              <motion.div
                animate={{
                  width: `${events.length ? (filtered.length / events.length) * 100 : 0}%`,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="h-full bg-green shadow-[0_0_10px_rgba(74,222,128,0.8)]"
              />
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <motion.div
                  layout
                  className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filtered.map((event, index) => (
                    <EventCard
                      key={event.slug}
                      event={event}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative overflow-hidden rounded-sm border border-line py-24 text-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="mx-auto h-16 w-16 rounded-full border border-green/30"
                  />

                  <div className="mt-8 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    SIGNAL LOST
                  </div>

                  <p className="mt-3 font-display text-xl text-paper">
                    NO EVENTS FOUND.
                  </p>

                  <p className="mt-2 text-xs text-muted">
                    Try changing your protocol or search query.
                  </p>

                  <button
                    onClick={() => {
                      setActiveStream("all");
                      setActiveDay("all");
                      setSearch("");
                    }}
                    className="mt-7 cursor-pointer border border-green/30 bg-green/5 px-5 py-3 font-mono text-[8px] uppercase tracking-[0.15em] text-green transition-colors hover:bg-green/10"
                  >
                    RESET SYSTEM →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ================================================================
            FOOTER TRANSMISSION
        ================================================================= */}

        <section className="border-t border-line py-24 md:py-32">
          <div className="mx-auto w-[min(1000px,calc(100%-48px))] text-center md:w-[min(1000px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-green">
                REGISTRY COMPLETE
              </div>

              <h2 className="mt-5 font-display text-[clamp(42px,6vw,72px)] font-semibold leading-[0.85]">
                FIND YOUR
                <br />
                <span className="text-green">CHALLENGE.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-md text-sm leading-[1.8] text-muted">
                Choose your protocol. Enter the arena. Leave your signal on
                the VYUHAM dimension.
              </p>

              <div className="mx-auto mt-10 flex items-center justify-center gap-4 font-mono text-[7px] uppercase tracking-[0.25em] text-muted">
                <span className="h-px w-12 bg-green/30" />
                VYUHAM&apos;26
                <span className="h-px w-12 bg-green/30" />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
