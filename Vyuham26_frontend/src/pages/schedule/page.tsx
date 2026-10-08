"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, StreamBadge } from "@/components/ui/Elements";
import { useApp } from "@/lib/store";
import { events } from "@/data/events";

const dayShortTitles = ["DAY ONE", "DAY TWO", "DAY THREE"];

const dayDates = [
  "October 30, 2026",
  "October 31, 2026",
  "November 1, 2026",
];

const dayThemes = [
  "HACKATHON BEGINS · MANAGEMENT GAMES · INAUGURATION",
  "HACKATHON JUDGING · CTF · MAIN STAGE NIGHT",
  "CLOSING CEREMONY · CONCERT NIGHT",
];

const dayPrizes = ["₹1,20,000", "₹55,000", "₹25,000"];

const streamFilters = [
  { id: "all", label: "ALL", code: "00" },
  { id: "tech", label: "TECH", code: "01" },
  { id: "management", label: "MANAGEMENT", code: "02" },
  { id: "cultural", label: "CULTURAL", code: "03" },
  { id: "esports", label: "ESPORTS", code: "04" },
];

const streamAccent: Record<string, string> = {
  tech: "text-green border-green/30 bg-green/5",
  technology: "text-green border-green/30 bg-green/5",
  cultural: "text-purple-300 border-purple-400/30 bg-purple-400/5",
  culture: "text-purple-300 border-purple-400/30 bg-purple-400/5",
  esports: "text-cyan-300 border-cyan-400/30 bg-cyan-400/5",
  gaming: "text-cyan-300 border-cyan-400/30 bg-cyan-400/5",
  management: "text-amber-300 border-amber-400/30 bg-amber-400/5",
  impact: "text-amber-300 border-amber-400/30 bg-amber-400/5",
  general: "text-emerald-300 border-emerald-400/30 bg-emerald-400/5",
  session: "text-sky-300 border-sky-400/30 bg-sky-400/5",
};

const streamGlow: Record<string, string> = {
  tech: "group-hover:border-green/40",
  technology: "group-hover:border-green/40",
  cultural: "group-hover:border-purple-400/40",
  culture: "group-hover:border-purple-400/40",
  esports: "group-hover:border-cyan-400/40",
  gaming: "group-hover:border-cyan-400/40",
  management: "group-hover:border-amber-400/40",
  impact: "group-hover:border-amber-400/40",
  general: "group-hover:border-emerald-400/40",
  session: "group-hover:border-sky-400/40",
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
            "linear-gradient(rgba(46,229,157,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(46,229,157,0.10) 1px, transparent 1px)",
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

function ThreeSignal() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 8.5);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const group = new THREE.Group();
    scene.add(group);
    const green = new THREE.Color(0x18c47c);
    const cyan = new THREE.Color(0x62d9ff);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.78, 2), new THREE.MeshBasicMaterial({ color: green, wireframe: true, transparent: true, opacity: 0.32 }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.012, 8, 128), new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.42 }));
    const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.008, 8, 128), new THREE.MeshBasicMaterial({ color: green, transparent: true, opacity: 0.2 }));
    ring.rotation.set(0.95, 0.2, -0.35);
    ringTwo.rotation.set(-0.6, 0.8, 0.2);
    group.add(core, ring, ringTwo);

    const points = new Float32Array(28 * 3);
    for (let i = 0; i < 28; i += 1) {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 2.15 + (i % 3) * 0.13;
      points[i * 3] = Math.cos(angle) * radius;
      points[i * 3 + 1] = Math.sin(angle) * radius;
      points[i * 3 + 2] = ((i % 5) - 2) * 0.08;
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
    const satellites = new THREE.Points(pointGeometry, new THREE.PointsMaterial({ color: green, size: 0.055, transparent: true, opacity: 0.8 }));
    group.add(satellites);

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.45;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.3;
    };
    canvas.addEventListener("pointermove", onPointerMove);

    let frame = 0;
    const animate = () => {
      const elapsed = performance.now() * 0.001;
      if (!reducedMotion) {
        core.rotation.x = elapsed * 0.16;
        core.rotation.y = elapsed * 0.25;
        ring.rotation.z = elapsed * 0.18;
        ringTwo.rotation.x = -elapsed * 0.12;
        satellites.rotation.z = -elapsed * 0.08;
        group.rotation.y += (pointerX - group.rotation.y) * 0.025;
        group.rotation.x += (-pointerY - group.rotation.x) * 0.025;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      pointGeometry.dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
      ringTwo.geometry.dispose();
      (ringTwo.material as THREE.Material).dispose();
      (satellites.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-auto absolute -right-10 -top-24 hidden h-[360px] w-[360px] opacity-80 md:block lg:-right-4 lg:-top-28 lg:h-[430px] lg:w-[430px]" />;
}

function SignalBars({
  active,
  total,
}: {
  active: number;
  total: number;
}) {
  return (
    <div className="flex items-end gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          className={`w-[3px] ${i < active ? "bg-green" : "bg-line"
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

  const searchInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    const day = parseInt(searchParams.get("day") || "1", 10);
    if (day >= 1 && day <= 3) {
      setActiveDay(day as 1 | 2 | 3);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const isSearchActive = active === searchInputRef.current;

      if (e.key === "Escape" && isSearchActive) {
        setSearchQuery("");
        searchInputRef.current?.blur();
        return;
      }

      const isTyping =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "SELECT" ||
          active.isContentEditable);

      if (isTyping) return;

      if (e.key === "/" && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDayChange = (day: 1 | 2 | 3) => {
    setActiveDay(day);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("day", String(day));
      window.history.replaceState({}, "", url.toString());
    }
  };

  const dayEvents = useMemo(() => {
    return events
      .filter((event) => event.day === activeDay)
      .filter((event) => {
        if (selectedStream === "all") return true;
        if (selectedStream === "tech") {
          return event.stream === "tech" || event.stream === "technology";
        }
        if (selectedStream === "management") {
          return event.stream === "management" || event.stream === "impact";
        }
        if (selectedStream === "cultural") {
          return event.stream === "cultural" || event.stream === "culture";
        }
        if (selectedStream === "esports") {
          return event.stream === "esports" || event.stream === "gaming";
        }
        return event.stream === selectedStream;
      })
      .filter((event) => {
        const query = searchQuery.toLowerCase().trim();

        if (!query) return true;

        return (
          event.title.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.stream.toLowerCase().includes(query) ||
          event.time.toLowerCase().includes(query)
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
      <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[rgba(24,196,124,0.16)] bg-[rgba(24,196,124,0.1)] md:grid-cols-4">
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
            className="bg-[#0b1410]/90 px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] tracking-[0.2em] text-muted">
                {item.label}
              </span>

              {item.accent && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(46,229,157,0.8)]" />
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
          <ThreeSignal />
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
          <div className="relative grid overflow-hidden rounded-xl border border-[rgba(24,196,124,0.16)] bg-[rgba(11,20,16,0.6)] backdrop-blur-md md:grid-cols-3">
            {([1, 2, 3] as const).map((day) => {
              const count = events.filter(
                (event) => event.day === day
              ).length;

              const isActive = activeDay === day;

              return (
                <button
                  key={day}
                  onClick={() => handleDayChange(day)}
                  className={`group relative cursor-pointer border-line px-5 py-6 text-left transition-all md:not-last:border-r ${isActive
                      ? "bg-[rgba(24,196,124,0.08)]"
                      : "bg-[#0b1410]/50 hover:bg-[#0b1410]/80"
                    }`}
                >
                  {isActive && (
                    <>
                      <motion.span
                        layoutId="day-indicator"
                        className="absolute left-0 top-0 h-[3px] w-20 bg-green shadow-[0_0_14px_rgba(46,229,157,0.5)]"
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
                      {dayShortTitles[day - 1]} · {dayDates[day - 1].split(",")[0]}
                    </strong>

                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`h-1 w-1 rounded-full ${isActive
                            ? "bg-green"
                            : "bg-line"
                          }`}
                      />

                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                        {dayThemes[day - 1]}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-line/30 pt-2">
                      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                        PRIZE POOL
                      </span>
                      <span className="font-mono text-[9px] font-medium text-green">
                        {dayPrizes[day - 1]}
                      </span>
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
                        ? "border-green/50 bg-green text-ink shadow-[0_0_16px_rgba(46,229,157,0.18)]"
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
                <svg className="h-3.5 w-3.5 text-[#18c47c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                ref={searchInputRef}
                type="text"
                placeholder="SEARCH PROTOCOL... (PRESS /)"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-[rgba(24,196,124,0.16)] bg-[#0b1410]/80 py-2 pl-10 pr-10 font-mono text-[10px] uppercase tracking-[0.08em] placeholder:text-muted/50 focus:border-[#18c47c]/60 focus:outline-none"
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
              {dayShortTitles[activeDay - 1]} · {dayDates[activeDay - 1]} — {dayThemes[activeDay - 1]}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
              DAY PRIZE POOL: <strong className="text-green font-semibold">{dayPrizes[activeDay - 1]}</strong>
            </span>

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
                        className={`absolute -left-[34px] top-7 h-3 w-3 rounded-full border bg-ink md:-left-[46px] ${event.stream === "cultural" || event.stream === "culture"
                            ? "border-purple-300"
                            : event.stream === "esports" || event.stream === "gaming"
                              ? "border-cyan-300"
                              : event.stream === "management"
                                ? "border-amber-300"
                                : event.stream === "session"
                                  ? "border-sky-300"
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
                        className="absolute -left-[31px] top-7.5 h-1.5 w-1.5 rounded-full bg-green md:-left-[43px]"
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
                        className={`relative block overflow-hidden rounded-xl border border-[rgba(24,196,124,0.16)] bg-[rgba(11,20,16,0.6)] backdrop-blur-md p-5 no-underline transition-all duration-500 hover:border-[rgba(24,196,124,0.35)] hover:shadow-[0_8px_32px_rgba(24,196,124,0.1)] md:p-6 ${glow}`}
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
                        <div className="relative z-10 mt-5 grid gap-3 border-t border-line/50 pt-4 grid-cols-2 sm:grid-cols-4">
                          <div>
                            <span className="block font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                              VENUE
                            </span>

                            <span className="mt-1 block font-mono text-[9px] text-paper">
                              {event.venue}
                            </span>
                          </div>

                          <div>
                            <span className="block font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                              REGISTRATION
                            </span>

                            <span className="mt-1 block font-mono text-[9px] text-paper">
                              {event.fee || "Free Entry"}
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
                              PRIZE
                            </span>

                            <span
                              className={`mt-1 block font-mono text-[9px] ${event.prizes && event.prizes !== "N/A"
                                  ? "text-green"
                                  : "text-muted"
                                }`}
                            >
                              {event.prizes || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Access */}
                        <div className="absolute bottom-5 right-5 translate-x-2 font-mono text-[8px] uppercase tracking-[0.18em] text-green opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                          ACCESS →
                        </div>

                        {/* Stream accent */}
                        <div
                          className={`absolute bottom-0 left-0 h-px w-0 transition-all duration-700 group-hover:w-full ${event.stream === "cultural" || event.stream === "culture"
                              ? "bg-purple-300"
                              : event.stream === "esports" || event.stream === "gaming"
                                ? "bg-cyan-300"
                                : event.stream === "management"
                                  ? "bg-amber-300"
                                  : event.stream === "session"
                                    ? "bg-sky-300"
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
                      "linear-gradient(90deg, rgba(46,229,157,0.3) 1px, transparent 1px), linear-gradient(rgba(46,229,157,0.3) 1px, transparent 1px)",
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

      <main className="relative flex-1 overflow-hidden pt-24">
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