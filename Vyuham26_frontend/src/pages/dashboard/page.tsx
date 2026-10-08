"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Crosshair,
  Gauge,
  Radio,
  ScanLine,
  ShieldCheck,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { events as catalogEvents } from "@/data/events";
import {
  registrationsApi,
  eventsApi,
  teamsApi,
  type EventRecord,
  type RegistrationRecord,
  type TeamRecord,
} from "@/lib/api";

const festivalMilestones = [
  ["30 OCT", "09:00 AM", "Festival Opening & Keynote", "DAY 01 // MAIN ARENA"],
  ["31 OCT", "10:00 AM", "Flagship Technical Competitions", "DAY 02 // LABS & HUBS"],
  ["01 NOV", "07:00 PM", "Grand Pro-Show & Award Ceremony", "DAY 03 // OPEN AIR STAGE"],
] as const;

function Corner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute h-5 w-5 border-green-400/70 ${className}`}
    />
  );
}

function HudPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-emerald-400/20 bg-[#06100d]/80 backdrop-blur-xl ${className}`}
    >
      <Corner className="left-0 top-0 border-l border-t" />
      <Corner className="right-0 top-0 border-r border-t" />
      <Corner className="bottom-0 left-0 border-b border-l" />
      <Corner className="bottom-0 right-0 border-b border-r" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/70 to-transparent" />
      {children}
    </div>
  );
}

function Reactor({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative h-55 w-55 sm:h-65 sm:w-65">
      <motion.div
        className="absolute inset-8 rounded-full border border-emerald-400/20"
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-12 rounded-full border border-dashed border-cyan-300/25"
        animate={reduced ? {} : { rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-16 rounded-full border border-emerald-300/40 shadow-[0_0_40px_rgba(52,211,153,.18)]"
        animate={reduced ? {} : { scale: [1, 1.06, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-21 rounded-full border border-emerald-200/20 bg-emerald-300/5" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/20 shadow-[0_0_55px_rgba(52,211,153,.55)]"
        animate={reduced ? {} : { opacity: [0.35, 0.9, 0.35], scale: [0.85, 1.1, 0.85] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      {[0, 72, 144, 216, 288].map((angle) => (
        <motion.span
          key={angle}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.8)]"
          style={{ transform: `rotate(${angle}deg) translateY(-88px)` }}
          animate={reduced ? {} : { opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, delay: angle / 360, repeat: Infinity }}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-center">
        <span className="text-[8px] tracking-[0.4em] text-emerald-300/60">CORE</span>
        <span className="mt-1 text-xl font-bold tracking-[0.15em] text-white">ONLINE</span>
        <span className="mt-1 text-[7px] tracking-[0.25em] text-cyan-300/60">VYU-CORE // 01</span>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const reduceMotion = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState<"events" | "squads" | "schedule">("events");
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [scan, setScan] = useState(0);

  const [myRegistrations, setMyRegistrations] = useState<RegistrationRecord[]>([]);
  const [allEvents, setAllEvents] = useState<EventRecord[]>([]);
  const [myTeams, setMyTeams] = useState<TeamRecord[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingRegs(false);
      setLoadingTeams(false);
      return;
    }
    Promise.all([
      registrationsApi.listMine().catch(() => [] as RegistrationRecord[]),
      eventsApi.list().catch(() => [] as EventRecord[]),
      teamsApi.listMine().catch(() => [] as TeamRecord[]),
    ])
      .then(([regs, evList, teamsList]) => {
        if (Array.isArray(regs)) setMyRegistrations(regs);
        if (Array.isArray(evList)) setAllEvents(evList);
        if (Array.isArray(teamsList)) setMyTeams(teamsList);
      })
      .finally(() => {
        setLoadingRegs(false);
        setLoadingTeams(false);
      });
  }, [isAuthenticated]);

  const initials = useMemo(() => {
    if (!user?.name) return "OP";
    return (
      user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("") || "OP"
    );
  }, [user]);

  const registeredEventsList = useMemo(() => {
    // 1. If we have live registrations from the backend API
    if (myRegistrations.length > 0) {
      return myRegistrations.map((reg, index) => {
        const matched =
          allEvents.find((e) => e.id === reg.event_id) ||
          catalogEvents.find((e) => (e as any).id === reg.event_id || e.slug === reg.event_id) ||
          null;
        return {
          stream: (matched?.stream || "TECH").toUpperCase(),
          title: matched ? (matched.title || (matched as any).name) : `OPERATION // ${reg.event_id.slice(0, 8)}`,
          venue: (matched?.venue || "MAIN CAMPUS ARENA").toUpperCase(),
          time: matched ? `DAY 0${matched.day || 1} // ${matched.time || "TBA"}` : "30 OCT // 10:00 AM",
          href: matched ? `/events/${matched.slug}` : `/events`,
          action: "VIEW DOSSIER",
          code: reg.ticket_code || `EVT-${String(index + 1).padStart(3, "0")}`,
          status: reg.status,
        };
      });
    }

    // 2. Fallback to AuthContext registered events
    if (user && user.registeredEvents && user.registeredEvents.length > 0) {
      return user.registeredEvents.map((slugOrId, index) => {
        const cleanSlug = slugOrId.replace(/^ev-/, "").toLowerCase();
        const matched =
          allEvents.find((e) => e.slug.toLowerCase() === cleanSlug || e.id === slugOrId) ||
          catalogEvents.find(
            (e) =>
              e.slug.toLowerCase() === cleanSlug ||
              e.title.toLowerCase() === slugOrId.toLowerCase()
          ) || null;
        return {
          stream: (matched?.stream || "TECH").toUpperCase(),
          title: matched ? (matched.title || (matched as any).name) : slugOrId.replace(/^ev-/, "").replace(/-/g, " ").toUpperCase(),
          venue: (matched?.venue || "MAIN CAMPUS ARENA").toUpperCase(),
          time: matched ? `DAY 0${matched.day || 1} // ${matched.time || "10:00 AM"}` : "30 OCT // 10:00 AM",
          href: matched ? `/events/${matched.slug}` : `/events`,
          action: "VIEW DOSSIER",
          code: `EVT-${String(index + 1).padStart(3, "0")}`,
          status: "confirmed",
        };
      });
    }

    // No registrations -> empty list (no demo mock fallback)
    return [];
  }, [myRegistrations, allEvents, user]);

  const statLabels = useMemo(() => {
    const eventCount = myRegistrations.length > 0 ? myRegistrations.length : (user?.registeredEvents?.length ?? 0);
    const squadCount = myTeams.length;
    const hasPass = eventCount > 0;
    return [
      { label: "EVENTS", value: eventCount, suffix: " REGISTERED", icon: Radio },
      { label: "SQUADS", value: squadCount, suffix: " ACTIVE", icon: Users },
      { label: "PASS", value: hasPass ? 100 : 0, suffix: hasPass ? "% VERIFIED" : "% ACTIVE", icon: ShieldCheck },
      { label: "CREDITS", value: 0, prefix: "₹", suffix: " CREDITS", icon: Zap },
    ];
  }, [myRegistrations, myTeams, user]);

  useEffect(() => {
    if (reduceMotion) return;
    const move = (e: MouseEvent) => {
      setCursor({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setScan((v) => (v + 1) % 100), 80);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#020604] pt-23 text-white">
        {/* Global HUD environment */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(16,185,129,.12),transparent_34%),radial-gradient(circle_at_90%_70%,rgba(34,211,238,.05),transparent_28%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(52,211,153,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,.45)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div
            className="absolute inset-0 opacity-[0.11] transition-transform duration-500"
            style={{ transform: `translate(${(cursor.x - 50) * -0.015}%, ${(cursor.y - 50) * -0.015}%)` }}
          >
            <div className="h-full w-full [background-image:linear-gradient(transparent_96%,rgba(255,255,255,.06)_96%)] [background-size:100%_4px]" />
          </div>
          {!reduceMotion && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-300/35 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          )}
          <div className="absolute left-[6%] top-0 h-full w-px bg-linear-to-b from-transparent via-emerald-400/20 to-transparent" />
          <div className="absolute right-[6%] top-0 h-full w-px bg-linear-to-b from-transparent via-cyan-300/15 to-transparent" />
        </div>

        <section className="relative z-10 mx-auto w-[min(1440px,calc(100%-28px))] py-8 md:w-[min(1440px,calc(100%-56px))] md:py-12">
          {/* Top system strip */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex flex-wrap items-center justify-between gap-3 border-y border-emerald-400/15 py-2 font-mono text-[7px] uppercase tracking-[0.28em] text-white/40 sm:text-[8px]"
          >
            <span className="flex items-center gap-2 text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />COMMAND LINK ACTIVE</span>
            <span>CHANNEL // 01</span>
            <span>UPLINK // STABLE</span>
            <span>SCAN // {String(scan).padStart(2, "0")}%</span>
          </motion.div>

          {!isAuthenticated && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border border-emerald-400/25 bg-emerald-950/40 p-3.5 font-mono text-[9px] tracking-wider text-emerald-300 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span>GUEST RECON MODE // Authenticate to connect your personal identity, registered slots, and digital QR pass.</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="border border-emerald-400/60 bg-emerald-400 px-3 py-1 font-bold text-black transition hover:bg-white"
                >
                  SIGN IN →
                </Link>
                <Link
                  href="/signup"
                  className="border border-white/20 px-3 py-1 text-white/80 transition hover:border-emerald-300 hover:text-white"
                >
                  REGISTER
                </Link>
              </div>
            </div>
          )}

          {/* Command header */}
          <HudPanel className="p-5 md:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
              <div>
                <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.32em] text-emerald-300/70">
                  <Terminal className="h-3 w-3" />
                  VYUHAM&apos;26 // OPERATIVE NETWORK
                </div>
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-5"
                >
                  <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/35">PERSONAL COMMAND</div>
                  <h1 className="mt-2 max-w-3xl font-display text-[clamp(48px,8vw,104px)] font-black uppercase leading-[0.8] tracking-[-0.04em]">
                    COMMAND
                    <br />
                    <span className="text-emerald-300">DECK</span>
                  </h1>
                  <p className="mt-7 max-w-xl text-sm leading-7 text-white/45">
                    Operative interface for registrations, squad operations, festival access and live event telemetry.
                  </p>
                </motion.div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/ticket"
                    className="group inline-flex items-center gap-3 border border-emerald-300 bg-emerald-300 px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-white"
                  >
                    <ScanLine className="h-4 w-4" />
                    Open QR Pass
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-3 border border-white/15 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 transition hover:border-emerald-300/50 hover:text-white"
                  >
                    Event Directory <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="relative flex min-h-70 items-center justify-center border border-white/5 bg-black/20">
                <div className="absolute left-3 top-3 font-mono text-[7px] tracking-[0.3em] text-white/25">REACTOR STATUS</div>
                <div className="absolute right-3 top-3 flex items-center gap-2 font-mono text-[7px] text-emerald-300/60"><span className="h-1 w-1 rounded-full bg-emerald-300" />ONLINE</div>
                <Reactor reduced={reduceMotion} />
                <div className="absolute bottom-3 left-3 font-mono text-[7px] text-white/20">TEMP 31.7C</div>
                <div className="absolute bottom-3 right-3 font-mono text-[7px] text-white/20">LOAD 18.4%</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 border-t border-white/5 pt-5 md:grid-cols-4">
              {["OPERATIVE // ONLINE", "ACCESS // VERIFIED", "NETWORK // SECURE", "FESTIVAL // 30 OCT — 01 NOV"].map((x) => (
                <div key={x} className="border-r border-white/5 px-3 py-2 font-mono text-[7px] tracking-[0.2em] text-white/30 last:border-0">{x}</div>
              ))}
            </div>
          </HudPanel>

          {/* Telemetry stats */}
          <div className="mt-5 grid grid-cols-2 gap-px border border-emerald-400/15 bg-emerald-400/10 lg:grid-cols-4">
            {statLabels.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  className="group relative bg-[#06100d]/90 p-5 transition hover:bg-[#0a1813] md:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[7px] tracking-[0.25em] text-white/30">NODE_0{i + 1}</span>
                    <Icon className="h-4 w-4 text-emerald-300/50 transition group-hover:text-emerald-300" />
                  </div>
                  <div className="mt-6 font-mono text-[8px] tracking-[0.22em] text-white/35">{stat.label}</div>
                  <div className="mt-1 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                  <div className="mt-4 h-px bg-linear-to-r from-emerald-300/40 to-transparent" />
                  <div className="mt-3 font-mono text-[7px] uppercase tracking-[0.16em] text-emerald-300/50">TELEMETRY NOMINAL</div>
                </motion.div>
              );
            })}
          </div>

          {/* Main command modules */}
          <div className="mt-8 grid gap-5 xl:grid-cols-[1.65fr_.75fr]">
            <HudPanel className="min-h-130 p-5 md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.3em] text-emerald-300"><Crosshair className="h-3.5 w-3.5" />MISSION CONTROL</div>
                  <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">Operative Modules</h2>
                </div>
                <div className="font-mono text-[7px] tracking-[0.25em] text-white/25">
                  {activeTab === "events"
                    ? `${registeredEventsList.length} ${registeredEventsList.length === 1 ? "SLOT" : "SLOTS"} // ${registeredEventsList.length > 0 ? "CONFIRMED" : "STANDBY"}`
                    : activeTab === "squads"
                    ? `${myTeams.length} ${myTeams.length === 1 ? "SQUAD" : "SQUADS"} // ${myTeams.length > 0 ? "ACTIVE" : "STANDBY"}`
                    : `${registeredEventsList.length > 0 ? registeredEventsList.length : 3} MILESTONES // TIMELINE`}
                </div>
              </div>

              <div className="mt-5 flex gap-5 overflow-x-auto border-b border-white/5 font-mono text-[8px] uppercase tracking-[0.18em]">
                {(["events", "squads", "schedule"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-4 transition ${activeTab === tab ? "text-emerald-300" : "text-white/30 hover:text-white"}`}
                  >
                    {tab === "events" ? "REGISTERED EVENTS" : tab === "squads" ? "SQUAD NETWORK" : "FESTIVAL TIMELINE"}
                    {activeTab === tab && <motion.span layoutId="dash-tab" className="absolute bottom-0 left-0 right-0 h-px bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,.8)]" />}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {activeTab === "events" && (
                    <motion.div key="events" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-3">
                      {loadingRegs ? (
                        <div className="border border-white/5 bg-black/20 p-8 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                          <span className="inline-block h-2 w-2 animate-ping mr-2 bg-emerald-400 rounded-full" />
                          SYNCING EVENT REGISTRATIONS...
                        </div>
                      ) : registeredEventsList.length === 0 ? (
                        <div className="relative overflow-hidden border border-emerald-400/20 bg-[#06100d]/70 p-8 sm:p-10 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/5 text-emerald-300">
                            <Radio className="h-5 w-5" />
                          </div>
                          <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-300">
                            NO EVENT SLOTS RESERVED YET
                          </div>
                          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-white/45">
                            Your operative profile is live and connected. You have not registered for any festival events yet. Browse our 30+ technical, cultural, management, and esports events to secure your slots.
                          </p>
                          <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Link
                              href="/events"
                              className="inline-flex items-center gap-2 border border-emerald-300 bg-emerald-300 px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-white"
                            >
                              BROWSE EVENT DIRECTORY →
                            </Link>
                          </div>
                        </div>
                      ) : (
                        registeredEventsList.map((event, index) => (
                          <motion.div
                            key={event.code + event.title}
                            whileHover={reduceMotion ? {} : { x: 5 }}
                            className="group relative overflow-hidden border border-white/8 bg-black/20 p-5 transition hover:border-emerald-300/35"
                          >
                            <motion.div className="absolute inset-y-0 left-0 w-px bg-emerald-300" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} />
                            {!reduceMotion && (
                              <motion.div
                                className="absolute inset-y-0 w-24 bg-linear-to-r from-transparent via-emerald-300/10 to-transparent"
                                animate={{ x: ["-120px", "900px"] }}
                                transition={{ duration: 3.5, repeat: Infinity, delay: index * 0.7 }}
                              />
                            )}
                            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                              <div className="min-w-0">
                                <div className="flex items-center gap-3 font-mono text-[7px] tracking-[0.25em] text-emerald-300/70">
                                  <span>{event.code}</span>
                                  <span className="h-1 w-1 rounded-full bg-emerald-300" />
                                  <span>{event.status?.toUpperCase() || "CONFIRMED"}</span>
                                </div>
                                <h3 className="mt-2 font-display text-xl font-bold uppercase">{event.title}</h3>
                                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[8px] tracking-[0.15em] text-white/30">
                                  <span>{event.venue}</span>
                                  <span>{event.time}</span>
                                  <span>{event.stream}</span>
                                </div>
                              </div>
                              <Link
                                href={event.href}
                                className="shrink-0 border border-white/10 px-4 py-3 font-mono text-[8px] tracking-[0.15em] text-white/60 transition hover:border-emerald-300 hover:text-emerald-300"
                              >
                                {event.action} →
                              </Link>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {activeTab === "squads" && (
                    <motion.div key="squads" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
                      {loadingTeams ? (
                        <div className="border border-white/5 bg-black/20 p-8 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                          <span className="inline-block h-2 w-2 animate-ping mr-2 bg-emerald-400 rounded-full" />
                          CONNECTING TO SQUAD NETWORK...
                        </div>
                      ) : myTeams.length === 0 ? (
                        <div className="relative overflow-hidden border border-emerald-400/20 bg-[#06100d]/70 p-8 sm:p-10 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/5 text-emerald-300">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-300">
                            NO ACTIVE SQUADS FORMED YET
                          </div>
                          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-white/45">
                            You are not currently enrolled in any operative squads. Form a new squad or join an existing unit with an invite code for team-based competitions and hackathons.
                          </p>
                          <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Link
                              href="/teams"
                              className="inline-flex items-center gap-2 border border-emerald-300 bg-emerald-300 px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-white"
                            >
                              CREATE OR JOIN SQUAD →
                            </Link>
                          </div>
                        </div>
                      ) : (
                        myTeams.map((team, i) => (
                          <div key={team.id} className="relative overflow-hidden border border-emerald-300/20 bg-black/20 p-6">
                            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                              <div>
                                <div className="font-mono text-[8px] tracking-[0.3em] text-emerald-300">
                                  SQUAD_NODE_0{i + 1} // {team.created_by === user?.id ? "LEADER" : "OPERATIVE"}
                                </div>
                                <h3 className="mt-2 font-display text-3xl font-bold uppercase">{team.name}</h3>
                                <p className="mt-2 font-mono text-[8px] leading-6 tracking-[0.12em] text-white/35">
                                  {team.member_count} {team.member_count === 1 ? "MEMBER" : "MEMBERS"} // INVITE CODE: {team.invite_code}
                                </p>
                              </div>
                              <Link
                                href="/teams"
                                className="border border-emerald-300/30 px-4 py-3 font-mono text-[8px] tracking-[0.15em] text-emerald-300 hover:bg-emerald-300 hover:text-black transition"
                              >
                                MANAGE SQUAD →
                              </Link>
                            </div>
                            {team.members && team.members.length > 0 && (
                              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-white/5 pt-5">
                                {team.members.map((member, idx) => (
                                  <div key={member.user_id} className="border border-white/5 bg-white/[0.02] p-3 font-mono text-[7px] tracking-[0.12em] text-white/45">
                                    <span className="mr-2 text-emerald-300">0{idx + 1}</span>
                                    {member.name ? member.name.toUpperCase() : member.email.split("@")[0].toUpperCase()}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}

                      <div className="flex items-center justify-between border border-dashed border-white/10 p-5 font-mono text-[8px] tracking-[0.2em] text-white/25">
                        <span>NETWORK FORMATIONS</span>
                        <span className="text-emerald-300/60">{String(myTeams.length).padStart(2, "0")} ACTIVE</span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "schedule" && (
                    <motion.div key="schedule" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="relative space-y-2">
                      <div className="absolute bottom-8 left-4 top-8 w-px bg-linear-to-b from-emerald-300/50 via-emerald-300/10 to-transparent" />
                      {registeredEventsList.length > 0 ? (
                        registeredEventsList.map((item, i) => (
                          <div key={item.code + item.title} className="relative flex gap-5 py-4">
                            <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-emerald-300/40 bg-[#06100d] font-mono text-[7px] text-emerald-300">
                              0{i + 1}
                            </div>
                            <div>
                              <div className="font-mono text-[8px] tracking-[0.18em] text-emerald-300">
                                {item.time} // {item.stream}
                              </div>
                              <h3 className="mt-1 font-display text-lg font-bold uppercase">{item.title}</h3>
                              <p className="mt-1 font-mono text-[7px] tracking-[0.18em] text-white/30">
                                VENUE: {item.venue} // STATUS: {item.status?.toUpperCase() || "CONFIRMED"}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-4">
                          <div className="relative overflow-hidden border border-emerald-400/20 bg-[#06100d]/70 p-6 text-center">
                            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-300">
                              OFFICIAL FESTIVAL TIMELINE MILESTONES
                            </div>
                            <p className="mt-1 text-xs text-white/40">
                              Register for events to construct your personal mission timeline. General festival milestones are shown below.
                            </p>
                          </div>
                          {festivalMilestones.map((item, i) => (
                            <div key={item[0] + item[1]} className="relative flex gap-5 py-4">
                              <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-emerald-300/40 bg-[#06100d] font-mono text-[7px] text-emerald-300">
                                0{i + 1}
                              </div>
                              <div>
                                <div className="font-mono text-[8px] tracking-[0.18em] text-emerald-300">{item[0]} // {item[1]}</div>
                                <h3 className="mt-1 font-display text-lg font-bold uppercase">{item[2]}</h3>
                                <p className="mt-1 font-mono text-[7px] tracking-[0.18em] text-white/30">{item[3]}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </HudPanel>

            {/* Right side telemetry */}
            <div className="space-y-5">
              <HudPanel className="p-5 md:p-6">
                <div className="flex items-center justify-between font-mono text-[7px] tracking-[0.25em] text-white/30">
                  <span>OPERATIVE PROFILE</span>
                  <span className="text-emerald-300">{user ? "AUTHENTICATED" : "GUEST SIM"}</span>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/5 font-mono text-sm text-emerald-300">
                    {initials}
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold">{user ? user.name : "Guest Operative"}</div>
                    <div className="mt-1 font-mono text-[7px] tracking-[0.18em] text-white/30">
                      {user ? user.id : "VYU26-GUEST-MODE"}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-px bg-white/5">
                  <div className="bg-black/30 p-3">
                    <div className="font-mono text-[7px] text-white/25">ACCESS</div>
                    <div className="mt-1 text-xs text-emerald-300">{user?.role ? user.role.toUpperCase() : "OPERATIVE"}</div>
                  </div>
                  <div className="bg-black/30 p-3">
                    <div className="font-mono text-[7px] text-white/25">CLEARANCE</div>
                    <div className="mt-1 text-xs text-cyan-300">{user?.role === "admin" ? "LEVEL 07 // CORE" : user?.role === "volunteer" ? "LEVEL 05 // FIELD" : "LEVEL 04 // OPERATIVE"}</div>
                  </div>
                </div>
              </HudPanel>

              <HudPanel className="p-5 md:p-6">
                <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.28em] text-cyan-300"><Gauge className="h-3.5 w-3.5" />LIVE TELEMETRY</div>
                <div className="mt-6 space-y-4">
                  {[['NETWORK', 92], ['ACCESS', 100], ['SYNC', 87], ['UPLINK', 96]].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="flex justify-between font-mono text-[7px] tracking-[0.2em] text-white/35"><span>{label as string}</span><span>{value}%</span></div>
                      <div className="mt-2 h-1 bg-white/5"><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.1, delay: 0.4 }} className="h-full bg-linear-to-r from-emerald-400 to-cyan-300" /></div>
                    </div>
                  ))}
                </div>
              </HudPanel>

              <Link href="/ticket" className="group block">
                <HudPanel className="p-5 transition hover:border-emerald-300/50 md:p-6">
                  <div className="flex items-center justify-between font-mono text-[7px] tracking-[0.25em] text-white/30">
                    <span>SECURE ACCESS</span>
                    <span className={registeredEventsList.length > 0 ? "text-emerald-300" : "text-white/40"}>
                      {registeredEventsList.length > 0 ? "VERIFIED" : "STANDBY"}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-display text-2xl font-bold uppercase">QR PASS</div>
                      <div className="mt-1 font-mono text-[7px] tracking-[0.18em] text-white/30">
                        {registeredEventsList.length > 0 ? "VIEW DIGITAL PASS & TOKEN" : "RESERVE SLOTS TO ACTIVATE"}
                      </div>
                    </div>
                    <div className="relative flex h-14 w-14 items-center justify-center border border-emerald-300/30"><div className="h-8 w-8 bg-[linear-gradient(90deg,#fff_10%,transparent_10%_20%,#fff_20%_30%,transparent_30%_45%,#fff_45%_55%,transparent_55%_70%,#fff_70%)] opacity-70" /><motion.div className="absolute inset-x-0 h-px bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,.9)]" animate={reduceMotion ? {} : { top: ["15%", "85%", "15%"] }} transition={{ duration: 2, repeat: Infinity }} /></div>
                  </div>
                </HudPanel>
              </Link>
            </div>
          </div>

          {/* Footer telemetry */}
          <div className="mt-8 flex flex-col items-center justify-center border-t border-white/5 pt-8 text-center">
            <div className="flex w-full max-w-2xl items-center gap-4"><span className="h-px flex-1 bg-linear-to-r from-transparent to-emerald-300/20" /><span className="font-mono text-[7px] tracking-[0.35em] text-emerald-300/50">COMMAND DECK ONLINE</span><span className="h-px flex-1 bg-linear-to-l from-transparent to-emerald-300/20" /></div>
            <div className="mt-4 flex items-center gap-3 font-mono text-[7px] tracking-[0.25em] text-white/20"><Check className="h-3 w-3 text-emerald-300/50" /> ALL SYSTEMS NOMINAL <span>•</span> THE FUTURE AWAITS <span>•</span> VYUHAM&apos;26</div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
