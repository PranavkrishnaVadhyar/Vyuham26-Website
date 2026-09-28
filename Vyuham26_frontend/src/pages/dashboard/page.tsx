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
  Cpu,
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

const events = [
  {
    stream: "TECH",
    title: "National Hackathon",
    venue: "MAIN LAB 01",
    time: "30 OCT // 10:00 AM",
    href: "/hackathon",
    action: "ENTER BUILD ZONE",
    code: "EVT-001",
  },
  {
    stream: "TECH",
    title: "CTF Warzone",
    venue: "CYBER RANGE",
    time: "31 OCT // 11:30 AM",
    href: "/ctf",
    action: "ENTER CTF PORTAL",
    code: "EVT-002",
  },
  {
    stream: "CULTURE",
    title: "Battle of the Bands",
    venue: "OPEN AMPHITHEATRE",
    time: "31 OCT // 06:00 PM",
    href: "/events/battle-of-the-bands",
    action: "VIEW DOSSIER",
    code: "EVT-003",
  },
];

const timeline = [
  ["30 OCT", "10:00 AM", "National Hackathon", "DAY 01 // IGNITION"],
  ["31 OCT", "11:30 AM", "CTF Warzone", "DAY 02 // CONVERGENCE"],
  ["31 OCT", "06:00 PM", "Battle of the Bands", "DAY 02 // MAIN STAGE"],
] as const;

const stats = [
  { label: "EVENTS", value: 3, suffix: " REGISTERED", icon: Radio },
  { label: "SQUADS", value: 2, suffix: " ACTIVE", icon: Users },
  { label: "PASS", value: 100, suffix: "% VERIFIED", icon: ShieldCheck },
  { label: "FOOD", value: 450, prefix: "₹", suffix: " CREDITS", icon: Zap },
];

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

function BootSequence({ reduced, onComplete }: { reduced: boolean; onComplete: () => void }) {
  const [progress, setProgress] = useState(reduced ? 100 : 0);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }
    const timer = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.ceil(Math.random() * 7));
        if (next >= 100) {
          window.clearInterval(timer);
          window.setTimeout(onComplete, 550);
        }
        return next;
      });
    }, 75);
    return () => window.clearInterval(timer);
  }, [onComplete, reduced]);

  if (reduced) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.65 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#020504] text-white"
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(52,211,153,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,.25)_1px,transparent_1px)] [background-size:50px_50px]" />
      <motion.div
        className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-300 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative w-[min(560px,88vw)] font-mono">
        <div className="mb-3 flex items-center justify-between text-[9px] tracking-[0.3em] text-emerald-300/60">
          <span>VYUHAM&apos;26 // COMMAND NETWORK</span>
          <span>SECURE</span>
        </div>
        <div className="border border-emerald-400/25 bg-emerald-400/[0.03] p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-300">
            <Cpu className="h-5 w-5" />
            <span className="text-xs tracking-[0.35em]">SYSTEM INITIALIZATION</span>
          </div>
          <div className="mt-8 text-5xl font-black tracking-[0.08em] sm:text-7xl">VYUHAM</div>
          <div className="mt-1 text-[10px] tracking-[0.45em] text-white/40">OPERATIVE INTERFACE // 26</div>
          <div className="mt-10 flex items-end justify-between">
            <div>
              <div className="text-[8px] tracking-[0.3em] text-white/40">LOADING COMMAND DECK</div>
              <div className="mt-2 text-2xl text-emerald-300">{String(progress).padStart(3, "0")}%</div>
            </div>
            <div className="text-right text-[8px] tracking-[0.22em] text-white/30">
              <div>AUTH: PASS</div>
              <div>LINK: STABLE</div>
              <div>CORE: READY</div>
            </div>
          </div>
          <div className="mt-4 h-1 overflow-hidden bg-white/5">
            <motion.div className="h-full bg-emerald-300" animate={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [booting, setBooting] = useState(!reduceMotion);
  const [activeTab, setActiveTab] = useState<"events" | "squads" | "schedule">("events");
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [scan, setScan] = useState(0);

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

  const statLabels = useMemo(() => stats, []);

  return (
    <>
      <AnimatePresence>
        {booting && <BootSequence reduced={reduceMotion} onComplete={() => setBooting(false)} />}
      </AnimatePresence>

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
                <div className="font-mono text-[7px] tracking-[0.25em] text-white/25">3 NODES // ALL CONFIRMED</div>
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
                      {events.map((event, index) => (
                        <motion.div key={event.code} whileHover={reduceMotion ? {} : { x: 5 }} className="group relative overflow-hidden border border-white/8 bg-black/20 p-5 transition hover:border-emerald-300/35">
                          <motion.div className="absolute inset-y-0 left-0 w-px bg-emerald-300" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} />
                          {!reduceMotion && <motion.div className="absolute inset-y-0 w-24 bg-linear-to-r from-transparent via-emerald-300/10 to-transparent" animate={{ x: ["-120px", "900px"] }} transition={{ duration: 3.5, repeat: Infinity, delay: index * 0.7 }} />}
                          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0">
                              <div className="flex items-center gap-3 font-mono text-[7px] tracking-[0.25em] text-emerald-300/70"><span>{event.code}</span><span className="h-1 w-1 rounded-full bg-emerald-300" />CONFIRMED</div>
                              <h3 className="mt-2 font-display text-xl font-bold uppercase">{event.title}</h3>
                              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[8px] tracking-[0.15em] text-white/30"><span>{event.venue}</span><span>{event.time}</span><span>{event.stream}</span></div>
                            </div>
                            <Link href={event.href} className="shrink-0 border border-white/10 px-4 py-3 font-mono text-[8px] tracking-[0.15em] text-white/60 transition hover:border-emerald-300 hover:text-emerald-300">{event.action} →</Link>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "squads" && (
                    <motion.div key="squads" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
                      <div className="relative overflow-hidden border border-emerald-300/20 bg-black/20 p-6">
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                          <div>
                            <div className="font-mono text-[8px] tracking-[0.3em] text-emerald-300">SQUAD_NODE_01 // LEADER</div>
                            <h3 className="mt-2 font-display text-3xl font-bold uppercase">CyberVipers</h3>
                            <p className="mt-2 font-mono text-[8px] leading-6 tracking-[0.12em] text-white/35">3 MEMBERS // AROMAL S. // NEHA S. // ROHAN K.<br />LINKED OPERATIONS // HACKATHON + CTF</p>
                          </div>
                          <Link href="/teams" className="border border-emerald-300/30 px-4 py-3 font-mono text-[8px] tracking-[0.15em] text-emerald-300 hover:bg-emerald-300 hover:text-black">MANAGE SQUAD →</Link>
                        </div>
                        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/5 pt-5">
                          {["AROMAL S.", "NEHA S.", "ROHAN K."].map((member, i) => <div key={member} className="border border-white/5 bg-white/[0.02] p-3 font-mono text-[7px] tracking-[0.12em] text-white/45"><span className="mr-2 text-emerald-300">0{i + 1}</span>{member}</div>)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between border border-dashed border-white/10 p-5 font-mono text-[8px] tracking-[0.2em] text-white/25"><span>NETWORK FORMATIONS</span><span className="text-emerald-300/60">02 ACTIVE</span></div>
                    </motion.div>
                  )}

                  {activeTab === "schedule" && (
                    <motion.div key="schedule" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="relative space-y-2">
                      <div className="absolute bottom-8 left-4 top-8 w-px bg-linear-to-b from-emerald-300/50 via-emerald-300/10 to-transparent" />
                      {timeline.map((item, i) => (
                        <div key={item[0] + item[1]} className="relative flex gap-5 py-4">
                          <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-emerald-300/40 bg-[#06100d] font-mono text-[7px] text-emerald-300">0{i + 1}</div>
                          <div><div className="font-mono text-[8px] tracking-[0.18em] text-emerald-300">{item[0]} // {item[1]}</div><h3 className="mt-1 font-display text-lg font-bold uppercase">{item[2]}</h3><p className="mt-1 font-mono text-[7px] tracking-[0.18em] text-white/30">{item[3]}</p></div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </HudPanel>

            {/* Right side telemetry */}
            <div className="space-y-5">
              <HudPanel className="p-5 md:p-6">
                <div className="flex items-center justify-between font-mono text-[7px] tracking-[0.25em] text-white/30"><span>OPERATIVE PROFILE</span><span className="text-emerald-300">ONLINE</span></div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/5 font-mono text-sm text-emerald-300">AV</div>
                  <div><div className="font-display text-xl font-bold">Aromal S S</div><div className="mt-1 font-mono text-[7px] tracking-[0.18em] text-white/30">VYU26-OPER-8042</div></div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-px bg-white/5"><div className="bg-black/30 p-3"><div className="font-mono text-[7px] text-white/25">ACCESS</div><div className="mt-1 text-xs text-emerald-300">OPERATIVE</div></div><div className="bg-black/30 p-3"><div className="font-mono text-[7px] text-white/25">CLEARANCE</div><div className="mt-1 text-xs text-cyan-300">LEVEL 04</div></div></div>
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
                  <div className="flex items-center justify-between font-mono text-[7px] tracking-[0.25em] text-white/30"><span>SECURE ACCESS</span><span className="text-emerald-300">VERIFIED</span></div>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div><div className="font-display text-2xl font-bold uppercase">QR PASS</div><div className="mt-1 font-mono text-[7px] tracking-[0.18em] text-white/30">GENERATE EVENT ACCESS TOKEN</div></div>
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
