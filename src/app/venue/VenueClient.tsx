"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import AnimatedSection from "@/components/motion/AnimatedSection";
import RouteTrace from "@/components/motion/RouteTrace";
import { Kicker } from "@/components/ui/Elements";

const venues = [
  {
    name: "Main Stage",
    description:
      "Grand performances, opening and closing ceremonies",
    events: "Battle of Bands, Dance Battle, Ceremonies",
    code: "MS-01",
    type: "CULTURE",
  },
  {
    name: "Innovation Lab",
    description:
      "Hackathons and AI/ML challenges",
    events: "Hackathon 36, AI Arena",
    code: "IL-02",
    type: "TECH",
  },
  {
    name: "Cyber Arena",
    description:
      "Cybersecurity and CTF competitions",
    events: "Capture The Flag",
    code: "CA-03",
    type: "CYBER",
  },
  {
    name: "Esports Arena",
    description:
      "Competitive gaming tournaments",
    events:
      "Valorant Championship, BGMI Showdown",
    code: "EA-04",
    type: "GAMING",
  },
  {
    name: "Lab Complex",
    description:
      "Coding competitions and technical events",
    events: "Code Relay, Technical workshops",
    code: "LC-05",
    type: "TECH",
  },
  {
    name: "Conference Hall",
    description:
      "Presentations and pitching events",
    events: "Pitch Perfect, Panel discussions",
    code: "CH-06",
    type: "FORUM",
  },
  {
    name: "Amphitheatre",
    description:
      "Open-air cultural performances",
    events: "Poetry Slam, Open mic sessions",
    code: "AM-07",
    type: "CULTURE",
  },
  {
    name: "Green Lab",
    description:
      "Sustainability and management events",
    events: "Sustainability Hack",
    code: "GL-08",
    type: "MANAGEMENT",
  },
  {
    name: "Campus Grounds",
    description:
      "Outdoor art and food courts",
    events:
      "Street Art, Food Court, Exhibitions",
    code: "CG-09",
    type: "OPEN",
  },
];

const hub = {
  x: 450,
  y: 240,
};

const zonePoints = [
  {
    name: "Main Stage",
    x: 150,
    y: 80,
  },
  {
    name: "Innovation Lab",
    x: 450,
    y: 80,
  },
  {
    name: "Cyber Arena",
    x: 750,
    y: 80,
  },
  {
    name: "Esports Arena",
    x: 150,
    y: 240,
  },
  {
    name: "Lab Complex",
    x: 450,
    y: 240,
  },
  {
    name: "Conference Hall",
    x: 750,
    y: 240,
  },
  {
    name: "Amphitheatre",
    x: 150,
    y: 400,
  },
  {
    name: "Green Lab",
    x: 450,
    y: 400,
  },
  {
    name: "Campus Grounds",
    x: 750,
    y: 400,
  },
];

const venueRoutes = zonePoints
  .filter(
    (point) =>
      !(point.x === hub.x && point.y === hub.y)
  )
  .map((point, i) => ({
    d: `M ${hub.x} ${hub.y} Q ${(hub.x + point.x) / 2
      } ${(hub.y + point.y) / 2 - 30
      } ${point.x} ${point.y}`,
    delay: i * 0.06,
  }));

function TacticalBackground() {
  const particles = Array.from({ length: 35 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,255,66,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,66,0.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

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

      {particles.map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-0.5 w-0.5 rounded-full bg-green/40"
          style={{
            left: `${(i * 31) % 100}%`,
            top: `${(i * 47) % 100}%`,
          }}
          animate={{
            opacity: [0.05, 0.8, 0.05],
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 3 + (i % 5),
            repeat: Infinity,
            delay: (i % 7) * 0.3,
          }}
        />
      ))}

      <div className="absolute right-[-15%] top-[5%] h-112.5 w-112.5 rounded-full bg-green/3.5 blur-3xl" />

      <div className="absolute bottom-[-15%] left-[-10%] h-112.5 w-112.5 rounded-full bg-green/2.5 blur-3xl" />
    </div>
  );
}

function StatusPill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border border-green/20 bg-green/3 px-3 py-1.5">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(200,255,66,0.8)]" />

      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-green">
        {children}
      </span>
    </div>
  );
}

function VenuePageContent() {
  const [selectedVenue, setSelectedVenue] =
    useState("Main Stage");

  const activeVenue = useMemo(
    () =>
      venues.find(
        (venue) => venue.name === selectedVenue
      ) || venues[0],
    [selectedVenue]
  );

  return (
    <div className="relative">
      <TacticalBackground />

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative border-b border-line py-20 md:py-32">
        <div className="mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <AnimatedSection>
              <Kicker>
                <span className="signal-dot" />
                Tactical navigation grid
              </Kicker>

              <h1 className="mt-5 font-display text-[clamp(52px,8vw,110px)] font-semibold leading-[0.8] tracking-tighter">
                THE{" "}
                <em className="text-green">
                  VENUE.
                </em>
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-[1.8] text-muted">
                Technocity campus becomes the
                operational grid for three days of
                VYUHAM&apos;26. Locate your zone,
                trace the network and move toward
                the future.
              </p>
            </AnimatedSection>

            {/* SYSTEM STATUS */}
            <AnimatedSection delay={0.15}>
              <div className="border border-line bg-ink-mid/70 p-5 font-mono">
                <div className="flex items-center justify-between gap-12">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-muted">
                    Navigation
                  </span>

                  <StatusPill>
                    GPS LOCKED
                  </StatusPill>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-5">
                  <div>
                    <span className="text-[7px] uppercase tracking-[0.18em] text-muted">
                      GRID
                    </span>

                    <div className="mt-1 text-[11px] text-paper">
                      TECHNOCITY
                    </div>
                  </div>

                  <div>
                    <span className="text-[7px] uppercase tracking-[0.18em] text-muted">
                      ZONES
                    </span>

                    <div className="mt-1 text-[11px] text-green">
                      09 ACTIVE
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-1">
                  {Array.from({
                    length: 20,
                  }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="h-1 flex-1 bg-green/30"
                      animate={{
                        opacity:
                          i < 14
                            ? [0.25, 1, 0.25]
                            : 0.15,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CAMPUS MAP */}
      {/* ===================================================== */}

      <section className="border-b border-line py-16 md:py-24">
        <div className="mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">
          <AnimatedSection>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <Kicker>Live campus grid</Kicker>

                <h2 className="mt-3 font-display text-3xl font-semibold md:text-5xl">
                  TRACE THE{" "}
                  <em className="text-green">
                    NETWORK.
                  </em>
                </h2>
              </div>

              <div className="flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                <span>LAT 08.5559°</span>
                <span>LONG 76.8803°</span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="relative overflow-hidden border border-line bg-[#050805]">
              {/* Map */}
              <div className="relative h-115 md:h-140">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.123456789!2d76.8803!3d8.5559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05b9e7a7f1a1a1%3A0x1a1a1a1a1a1a1a1a!2sTechnocity%2C%20Thiruvananthapuram!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter:
                      "invert(90%) hue-rotate(180deg) saturate(0.7)",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Technocity campus map"
                />

                {/* Map overlay */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-ink/20" />

                {/* Grid corners */}
                <div className="pointer-events-none absolute inset-0">
                  <span className="absolute left-4 top-4 h-8 w-8 border-l border-t border-green/60" />
                  <span className="absolute right-4 top-4 h-8 w-8 border-r border-t border-green/60" />
                  <span className="absolute bottom-4 left-4 h-8 w-8 border-b border-l border-green/60" />
                  <span className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-green/60" />
                </div>

                {/* Map HUD */}
                <div className="absolute left-4 top-4 border border-line bg-ink/80 px-3 py-2 backdrop-blur-md">
                  <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                    VYUHAM NAVIGATION SYSTEM
                  </div>

                  <div className="mt-1 font-mono text-[9px] text-green">
                    MAP::LIVE
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 border border-line bg-ink/80 px-3 py-2 backdrop-blur-md">
                  <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                    SIGNAL
                  </div>

                  <div className="mt-1 flex items-center gap-2 font-mono text-[9px] text-green">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
                    CONNECTED
                  </div>
                </div>
              </div>

              {/* Map footer */}
              <div className="flex flex-col justify-between gap-3 border-t border-line bg-ink-mid/80 px-4 py-3 md:flex-row md:items-center">
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                  TECHNOCITY // THIRUVANANTHAPURAM
                </span>

                <Link
                  href="https://www.google.com/maps/search/?api=1&query=Technocity+Thiruvananthapuram"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[8px] uppercase tracking-[0.18em] text-green transition-colors hover:text-paper"
                >
                  OPEN NAVIGATION →
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===================================================== */}
      {/* ZONE NETWORK */}
      {/* ===================================================== */}

      <section className="py-20 md:py-32">
        <div className="mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">
          <AnimatedSection>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <Kicker>Campus zones</Kicker>

                <h2 className="mt-3 font-display text-[clamp(40px,5vw,68px)] font-semibold leading-[0.85]">
                  NAVIGATE THE
                  <br />
                  <em className="text-green">
                    GRID.
                  </em>
                </h2>
              </div>

              <div className="max-w-sm">
                <p className="text-xs leading-[1.8] text-muted">
                  Every zone is connected to the
                  central VYUHAM network. Select a
                  node to inspect its mission data.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* NETWORK VISUALIZATION */}
          <AnimatedSection
            delay={0.1}
            className="mt-14"
          >
            <div className="relative hidden h-120 overflow-hidden border border-line bg-ink-mid/30 md:block">
              {/* Grid */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(200,255,66,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,66,0.15) 1px, transparent 1px)",
                  backgroundSize: "45px 45px",
                }}
              />

              {/* Routes */}
              <RouteTrace
                paths={venueRoutes}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-50"
                viewBox="0 0 900 480"
                showEndpoints
                duration={1.3}
              />

              {/* Central Hub */}
              <motion.div
                className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                animate={{
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-green/60 bg-green/4 shadow-[0_0_40px_rgba(200,255,66,0.08)]">
                  <motion.div
                    className="absolute inset-2 rounded-full border border-green/20"
                    animate={{
                      scale: [1, 1.25],
                      opacity: [0.7, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />

                  <div className="text-center font-mono">
                    <div className="text-[7px] uppercase tracking-[0.2em] text-muted">
                      CORE
                    </div>

                    <div className="mt-1 text-[10px] text-green">
                      VYUHAM
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Zone Nodes */}
              {zonePoints.map((point, i) => {
                const venue = venues.find(
                  (item) =>
                    item.name === point.name
                );

                const selected =
                  selectedVenue === point.name;

                return (
                  <motion.button
                    key={point.name}
                    onClick={() =>
                      setSelectedVenue(point.name)
                    }
                    className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      left: `${(point.x / 900) * 100}%`,
                      top: `${(point.y / 480) * 100}%`,
                    }}
                    whileHover={{
                      scale: 1.12,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                  >
                    <div
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all ${selected
                          ? "border-green bg-green text-ink shadow-[0_0_24px_rgba(200,255,66,0.35)]"
                          : "border-line bg-ink/90 text-green hover:border-green/50"
                        }`}
                    >
                      <span className="font-mono text-[8px] font-bold">
                        {String(i + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      {selected && (
                        <motion.span
                          className="absolute -inset-1.75 rounded-full border border-green/30"
                          animate={{
                            scale: [0.8, 1.2],
                            opacity: [0.8, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </div>

                    <span
                      className={`absolute left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] uppercase tracking-widest ${selected
                          ? "text-green"
                          : "text-muted"
                        }`}
                    >
                      {venue?.name}
                    </span>
                  </motion.button>
                );
              })}

              {/* Coordinates */}
              <div className="absolute left-4 top-4 font-mono text-[7px] leading-5 text-muted">
                GRID_REF: VX-26
                <br />
                SECTOR: TECHNOCITY
                <br />
                NODES: 09
              </div>

              <div className="absolute bottom-4 right-4 font-mono text-[7px] text-green">
                NETWORK_STATUS::STABLE
              </div>
            </div>
          </AnimatedSection>

          {/* MOBILE ZONE GRID */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:hidden">
            {venues.map((venue, i) => {
              const selected =
                selectedVenue === venue.name;

              return (
                <button
                  key={venue.name}
                  onClick={() =>
                    setSelectedVenue(venue.name)
                  }
                  className={`cursor-pointer border p-4 text-left transition-all ${selected
                      ? "border-green/50 bg-green/4"
                      : "border-line bg-ink-mid/30"
                    }`}
                >
                  <span className="font-mono text-[8px] text-green">
                    ZONE_
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-2 font-display text-base font-semibold text-paper">
                    {venue.name}
                  </h3>

                  <span className="mt-2 block font-mono text-[7px] uppercase tracking-[0.15em] text-muted">
                    {venue.type}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SELECTED ZONE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVenue.name}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.3,
              }}
              className="mt-8 border border-green/20 bg-green/2.5"
            >
              <div className="flex flex-col justify-between gap-8 p-6 md:flex-row md:p-8">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[8px] tracking-[0.18em] text-green">
                      SELECTED_ZONE
                    </span>

                    <span className="h-px w-8 bg-green/30" />

                    <span className="font-mono text-[8px] text-muted">
                      {activeVenue.code}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-semibold md:text-4xl">
                    {activeVenue.name}
                  </h3>

                  <p className="mt-3 max-w-xl text-xs leading-[1.8] text-muted">
                    {activeVenue.description}
                  </p>
                </div>

                <div className="min-w-55">
                  <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                    ACTIVE EVENTS
                  </div>

                  <div className="mt-2 font-mono text-xs text-paper">
                    {activeVenue.events}
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />

                    <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-green">
                      Navigation ready
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ZONE CARDS */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {venues.map((venue, i) => (
              <AnimatedSection
                key={venue.name}
                delay={i * 0.04}
              >
                <motion.button
                  onClick={() =>
                    setSelectedVenue(venue.name)
                  }
                  whileHover={{
                    y: -5,
                  }}
                  className={`group relative w-full cursor-pointer overflow-hidden border p-6 text-left transition-all ${selectedVenue === venue.name
                      ? "border-green/40 bg-green/2.5"
                      : "border-line bg-ink-mid/30 hover:border-green/20"
                    }`}
                >
                  <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-green/20 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-green">
                      ZONE{" "}
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="font-mono text-[7px] text-muted">
                      {venue.code}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-semibold text-paper transition-colors group-hover:text-green">
                    {venue.name}
                  </h3>

                  <p className="mt-2 text-xs leading-[1.7] text-muted">
                    {venue.description}
                  </p>

                  <div className="mt-5 border-t border-line pt-4">
                    <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-muted">
                      EVENTS
                    </span>

                    <p className="mt-1 text-[10px] leading-[1.6] text-muted/80">
                      {venue.events}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-green">
                      {venue.type}
                    </span>

                    <span className="translate-x-2 font-mono text-[8px] text-green opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      LOCATE →
                    </span>
                  </div>
                </motion.button>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HOW TO REACH */}
      {/* ===================================================== */}

      <section className="border-t border-line py-20 md:py-28">
        <div className="mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">
          <AnimatedSection>
            <Kicker>{"// How to reach"}</Kicker>

            <h2 className="mt-3 font-display text-[clamp(36px,5vw,60px)] font-semibold leading-[0.9]">
              CHOOSE YOUR
              <br />
              <em className="text-green">
                ROUTE.
              </em>
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                code: "AIR-01",
                title: "By Air",
                icon: "✈",
                text:
                  "Trivandrum International Airport (TRV) — approximately 18 km from Technocity.",
              },
              {
                code: "RAIL-02",
                title: "By Train",
                icon: "▣",
                text:
                  "Thiruvananthapuram Central — approximately 12 km from Technocity.",
              },
              {
                code: "ROAD-03",
                title: "By Road",
                icon: "→",
                text:
                  "Technocity is connected through the National Highway bypass and local transport network.",
              },
            ].map((route, i) => (
              <AnimatedSection
                key={route.code}
                delay={i * 0.08}
              >
                <motion.div
                  whileHover={{
                    y: -6,
                  }}
                  className="group relative overflow-hidden border border-line bg-ink-mid/30 p-7"
                >
                  <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-green/20 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-green">
                      {route.code}
                    </span>

                    <span className="font-mono text-lg text-green/70">
                      {route.icon}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold">
                    {route.title}
                  </h3>

                  <p className="mt-3 text-xs leading-[1.8] text-muted">
                    {route.text}
                  </p>

                  <div className="mt-6 flex items-center gap-2">
                    <span className="h-px w-8 bg-green/50" />

                    <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
                      ROUTE AVAILABLE
                    </span>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL TRANSMISSION */}
      {/* ===================================================== */}

      <section className="pb-24 md:pb-32">
        <div className="mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">
          <AnimatedSection>
            <div className="relative overflow-hidden border border-line bg-ink-mid/50 p-8 md:p-12">
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

              <div className="relative z-10 flex flex-col justify-between gap-10 md:flex-row md:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />

                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-green">
                      Navigation complete
                    </span>
                  </div>

                  <h2 className="mt-4 max-w-2xl font-display text-[clamp(32px,5vw,60px)] font-semibold leading-[0.9]">
                    THE FUTURE
                    <br />
                    <em className="text-green">
                      AWAITS.
                    </em>
                  </h2>
                </div>

                <div className="max-w-sm">
                  <p className="text-xs leading-[1.8] text-muted">
                    Locate your zone. Find your
                    signal. Enter the VYUHAM
                    network.
                  </p>

                  <div className="mt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                    VYUHAM&apos;26 // TECHNOCITY //{" "}
                    <span className="text-green">
                      ONLINE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

export default function VenueClient() {
  return <VenuePageContent />;
}