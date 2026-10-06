"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import AnimatedSection from "@/components/motion/AnimatedSection";
import RouteTrace from "@/components/motion/RouteTrace";
import { Kicker } from "@/components/ui/Elements";
import Campus3DOverview from "@/components/venue/Campus3DOverview";

const venues = [
  {
    name: "Open Air Stage",
    description:
      "Grand performances, opening ceremony, fashion runway and closing concert",
    events: "Inauguration Ceremony, Cultural Night, DJ Night, Fashion Show, Concert Night",
    code: "OAS-01",
    type: "CULTURE",
  },
  {
    name: "Main Hall",
    description:
      "24HR Hackathon arena, midnight mentoring, and award ceremonies",
    events: "Hackathon — 24HR, Overnight Mentoring, Hackathon Demos, Prize Distribution",
    code: "MH-02",
    type: "TECH",
  },
  {
    name: "Computer Lab",
    description:
      "Cybersecurity warfare, prompt battles, and hands-on LLM labs",
    events: "Capture the Flag, Prompt War, Prompt Engineering & LLM Workshop",
    code: "CL-03",
    type: "TECH",
  },
  {
    name: "Esports Arena",
    description:
      "Competitive esports tournaments and championship finals",
    events: "Valorant Tournament, BGMI Tournament, E-Football Tournament",
    code: "EA-04",
    type: "GAMING",
  },
  {
    name: "Gallery Hall",
    description:
      "Management strategy rounds, quizzes, and applied AI keynotes",
    events: "Best Management Team, Business Quiz, Startup Showcase, Tech Quiz, Agentic AI Talk, Movie Quiz",
    code: "GH-05",
    type: "FORUM",
  },
  {
    name: "Seminar Hall",
    description:
      "AI panels, debate rounds, and quantum computing sessions",
    events: "Responsible AI Panel, Quantum Computing Meets AI Talk, Open Floor Debate",
    code: "SH-06",
    type: "FORUM",
  },
  {
    name: "Management Wing",
    description:
      "Aptitude, crisis simulation, and executive interviews",
    events: "Best Manager, Marketing Game, Finance Game, HR Game",
    code: "MW-07",
    type: "MANAGEMENT",
  },
  {
    name: "Campus Grounds",
    description:
      "Food court, markets, stalls, and campus-wide contests",
    events: "Play Fest, Fitness Competition, Photography Contest, Food Court & Stalls",
    code: "CG-08",
    type: "OPEN",
  },
];

const hub = {
  x: 450,
  y: 240,
};

const zonePoints = [
  {
    name: "Open Air Stage",
    x: 150,
    y: 80,
  },
  {
    name: "Main Hall",
    x: 450,
    y: 80,
  },
  {
    name: "Computer Lab",
    x: 750,
    y: 80,
  },
  {
    name: "Esports Arena",
    x: 150,
    y: 240,
  },
  {
    name: "Gallery Hall",
    x: 750,
    y: 240,
  },
  {
    name: "Seminar Hall",
    x: 150,
    y: 400,
  },
  {
    name: "Management Wing",
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
            "linear-gradient(rgba(46,229,157,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(46,229,157,0.12) 1px, transparent 1px)",
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
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(46,229,157,0.8)]" />

      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-green">
        {children}
      </span>
    </div>
  );
}

function VenuePageContent() {
  const [selectedVenue, setSelectedVenue] =
    useState("Main Stage");
  const [mapViewMode, setMapViewMode] = useState<"3d" | "2d">("3d");

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

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#campus-3d-overview"
                  className="group inline-flex items-center gap-2 border border-green/50 bg-green/10 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-green transition-all hover:bg-green hover:text-ink shadow-[0_0_20px_rgba(46,229,157,0.15)]"
                >
                  <span className="h-2 w-2 rounded-full bg-green group-hover:bg-ink animate-pulse" />
                  LAUNCH 3D DIGITAL TWIN ↓
                </a>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                  WebGL 360° // DUK CAMPUS
                </span>
              </div>
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
            <div className="relative overflow-hidden rounded-xl border border-[rgba(24,196,124,0.2)] bg-[#050805] shadow-[0_0_50px_rgba(24,196,124,0.06)]">
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

      <section id="campus-3d-overview" className="py-20 md:py-32 scroll-mt-20">
        <div className="mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">
          <AnimatedSection>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <Kicker>Campus zones & 3D Digital Twin</Kicker>

                <h2 className="mt-3 font-display text-[clamp(40px,5vw,68px)] font-semibold leading-[0.85]">
                  EXPLORE THE
                  <br />
                  <em className="text-green">
                    CAMPUS GRID.
                  </em>
                </h2>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <div className="inline-flex rounded-lg border border-line bg-ink-mid/80 p-1 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setMapViewMode("3d")}
                    className={`flex items-center gap-2 rounded px-3.5 py-1.5 transition-all cursor-pointer ${
                      mapViewMode === "3d"
                        ? "bg-green text-ink font-bold shadow-[0_0_15px_rgba(46,229,157,0.4)]"
                        : "text-muted hover:text-paper"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                    3D DIGITAL TWIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapViewMode("2d")}
                    className={`flex items-center gap-2 rounded px-3.5 py-1.5 transition-all cursor-pointer ${
                      mapViewMode === "2d"
                        ? "bg-green text-ink font-bold shadow-[0_0_15px_rgba(46,229,157,0.4)]"
                        : "text-muted hover:text-paper"
                    }`}
                  >
                    2D TACTICAL MATRIX
                  </button>
                </div>

                <div className="max-w-sm text-left sm:text-right">
                  <p className="text-xs leading-[1.8] text-muted">
                    {mapViewMode === "3d"
                      ? "Interactive 3D Three.js architectural digital twin of Digital University Kerala (DUK). Rotate, zoom, and inspect nodes."
                      : "Tactical schematics tracing connections across the operational zones."}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* NETWORK VISUALIZATION */}
          <AnimatedSection
            delay={0.1}
            className="mt-14"
          >
            {mapViewMode === "3d" ? (
              <div className="relative">
                <Campus3DOverview
                  selectedZoneId={selectedVenue}
                  onSelectZone={(zone) => {
                    const match = venues.find(
                      (v) =>
                        v.name.toLowerCase().includes(zone.name.toLowerCase().split(" ")[0]) ||
                        zone.name.toLowerCase().includes(v.name.toLowerCase().split(" ")[0]) ||
                        v.code.slice(0, 2) === zone.code.slice(0, 2)
                    );
                    if (match) setSelectedVenue(match.name);
                  }}
                />
              </div>
            ) : (
              <div className="relative hidden h-120 overflow-hidden rounded-xl border border-[rgba(24,196,124,0.2)] bg-[rgba(11,20,16,0.6)] backdrop-blur-md shadow-[0_0_50px_rgba(24,196,124,0.06)] md:block">
              {/* Grid */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(46,229,157,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(46,229,157,0.15) 1px, transparent 1px)",
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
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-green/60 bg-green/4 shadow-[0_0_40px_rgba(46,229,157,0.08)]">
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
                          ? "border-green bg-green text-ink shadow-[0_0_24px_rgba(46,229,157,0.35)]"
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
            )}
          </AnimatedSection>

          {/* MOBILE ZONE GRID */}
          {mapViewMode === "2d" && (
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
          )}

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
              className="mt-8 overflow-hidden rounded-xl border border-[rgba(24,196,124,0.25)] bg-[rgba(11,20,16,0.7)] p-6 backdrop-blur-md md:p-8"
            >
              <div className="flex flex-col justify-between gap-8 md:flex-row">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[8px] tracking-[0.18em] text-[#18c47c]">
                      ACTIVE_ZONE_SELECTED
                    </span>

                    <span className="h-px w-8 bg-[#18c47c]/30" />

                    <span className="font-mono text-[8px] text-muted">
                      {activeVenue.code}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-semibold text-[#f0f9f5] md:text-4xl">
                    {activeVenue.name}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-[1.8] text-[#cfd8d4]">
                    {activeVenue.description}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-4 sm:grid-cols-3">
                    <div>
                      <span className="font-mono text-[7px] uppercase tracking-wider text-[#9caaa2]">
                        ZONE CAPACITY
                      </span>
                      <p className="mt-1 font-mono text-[11px] font-bold text-[#18c47c]">
                        ● 450 SEATS // 78% ACTIVE
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[7px] uppercase tracking-wider text-[#9caaa2]">
                        CAMPUS LEVEL
                      </span>
                      <p className="mt-1 font-mono text-[11px] text-[#f0f9f5]">
                        CONCOURSE LEVEL 01
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[7px] uppercase tracking-wider text-[#9caaa2]">
                        INDOOR FAST PATH
                      </span>
                      <p className="mt-1 font-mono text-[11px] text-[#f0f9f5]">
                        EAST CORRIDOR GATE 3
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-64 rounded-lg border border-[rgba(24,196,124,0.14)] bg-[rgba(8,26,18,0.5)] p-5">
                  <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#18c47c]">
                    SCHEDULED SESSIONS
                  </div>

                  <div className="mt-2 font-mono text-xs text-[#f0f9f5]">
                    {activeVenue.events}
                  </div>

                  <div className="mt-6 border-t border-white/5 pt-4">
                    <Link
                      href="/schedule"
                      className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#18c47c] transition-all hover:text-white"
                    >
                      VIEW VENUE TIMELINE →
                    </Link>
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
                  className={`group relative w-full cursor-pointer overflow-hidden rounded-xl border p-6 text-left transition-all duration-300 backdrop-blur-md ${
    selectedVenue === venue.name
      ? "border-[#18c47c] bg-[rgba(24,196,124,0.12)] shadow-[0_0_30px_rgba(24,196,124,0.2)]"
      : "border-[rgba(24,196,124,0.14)] bg-[rgba(11,20,16,0.6)] hover:border-[rgba(24,196,124,0.3)] hover:shadow-[0_8px_30px_rgba(24,196,124,0.08)]"
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