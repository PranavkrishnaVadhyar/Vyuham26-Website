"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { useReducedMotion } from "@/lib/hooks";
import { cyberAudio } from "@/lib/cyberAudio";
import { FocusIn, MaskReveal } from "@/components/cinematic/Reveal";
import type { FestEvent, StreamId } from "@/data/types";

// Sub-components
import SphericalEventArchive3D from "./events/SphericalEventArchive3D";
import ClassifiedModal from "./events/ClassifiedModal";
import EventDossierModal from "./events/EventDossierModal";
import ClassifiedTransmissionIntro from "./events/ClassifiedTransmissionIntro";

import {
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Radio,
  SlidersHorizontal,
  Globe,
  LayoutGrid,
  Search,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  SECRET EVENT CONFIGURATION (DAY 03 AFTERSHOCK)                     */
/* ------------------------------------------------------------------ */
export const SECRET_EVENT_REVEALED = false;

export const secretEvent = {
  day: 3,
  date: "31 OCT 2026",
  title: "AFTERSHOCK",
  status: "CLASSIFIED",
  transmission: "TRANSMISSION LOCKED",
  revealed: SECRET_EVENT_REVEALED,
};

/* ------------------------------------------------------------------ */
/*  CATEGORY FILTERS                                                  */
/* ------------------------------------------------------------------ */
const CATEGORIES: { id: StreamId | "all"; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "tech", label: "TECHNOLOGY" },
  { id: "management", label: "MANAGEMENT" },
  { id: "cultural", label: "CULTURE" },
  { id: "esports", label: "GAMING" },
];

export default function Events() {
  const { content } = useApp();
  const reduced = useReducedMotion();

  // Mode: 3D Explore Sphere vs Find Grid Matrix
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  // Search query for FIND MATRIX mode
  const [searchQuery, setSearchQuery] = useState("");

  // Active category filter
  const [selectedCategory, setSelectedCategory] = useState<StreamId | "all">("all");

  // Active public event index in carousel/sphere
  const [activeIndex, setActiveIndex] = useState(0);

  // Modals state
  const [selectedDossierEvent, setSelectedDossierEvent] = useState<FestEvent | null>(null);
  const [isClassifiedModalOpen, setIsClassifiedModalOpen] = useState(false);

  // Initial cinematic signal intro state
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("vyuham26:events_intro_seen");
      if (!seen) {
        setShowIntro(true);
      }
    } catch {}
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    try {
      sessionStorage.setItem("vyuham26:events_intro_seen", "1");
    } catch {}
  }, []);

  const handleReplayIntro = () => {
    cyberAudio.playClick();
    setShowIntro(true);
  };

  const accentOf = useCallback(
    (id: StreamId) => content.streams.find((s) => s.id === id)?.accent ?? "#18c47c",
    [content.streams]
  );

  // Filter public events:
  // 1. Omit secret concert event from public listings
  // 2. Filter by category
  const publicEvents = useMemo(() => {
    return content.events.filter((e) => {
      // Omit secret concert from public cards list
      const slug = e.id.replace(/^ev-/, "").toLowerCase();
      if (slug === "concert" || slug.includes("concert")) return false;

      // Category matching
      if (selectedCategory === "all") return true;
      return e.stream === selectedCategory;
    });
  }, [content.events, selectedCategory]);

  // Search-filtered events for FIND MATRIX mode
  const gridFilteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return publicEvents;
    const q = searchQuery.toLowerCase().trim();
    return publicEvents.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.blurb.toLowerCase().includes(q) ||
        e.stream.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
    );
  }, [publicEvents, searchQuery]);

  // Reset active index when category changes
  const handleCategorySelect = (catId: StreamId | "all") => {
    cyberAudio.playClick();
    setSelectedCategory(catId);
    setActiveIndex(0);
  };

  const totalEvents = publicEvents.length;

  return (
    <section
      id="events"
      className="relative w-full overflow-hidden px-4 sm:px-6 pt-20 sm:pt-28 md:pt-36 pb-14 sm:pb-20 md:px-[6vw] bg-[#020504] scroll-mt-24"
    >
      {/* Background Atmosphere & Radial Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(16,77,50,0.18),transparent_75%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(2,5,4,0.7)_100%)]" />

      {/* ───────────────────────────────────────────────────────────── */}
      {/*  SECTION HEADER                                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">04 — EVENT MATRIX</p>
            <div className="flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-emerald-400">
              <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
              <span>3D SPHERICAL ARCHIVE</span>
            </div>
          </div>

          <h2 className="t-cond mt-4 text-[13vw] sm:text-[10vw] md:text-[6vw] leading-[0.85] text-[#f0f9f5]">
            <MaskReveal>THE PROGRAMME</MaskReveal>
          </h2>

          <p className="mt-4 max-w-[56ch] text-[13px] leading-relaxed text-[#7d9a8d] md:text-[15px]">
            Explore 30+ festival competitions orbiting the official VYUHAM&apos;26 command core in true 3D space.
            Rotate the sphere to discover competitions or switch to the matrix view for instant lookup.
          </p>
        </div>

        {/* Right actions: Mode Toggle, Replay intro & View Directory */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono text-[9px] uppercase tracking-[0.2em]">
          {/* Mode Switcher: 3D Explore vs Find Matrix */}
          <div className="flex items-center rounded-lg border border-emerald-500/30 bg-black/60 p-1">
            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                setViewMode("3d");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "3d"
                  ? "bg-emerald-400 text-black font-bold shadow-[0_0_16px_rgba(24,196,124,0.4)]"
                  : "text-[#7ca290] hover:text-emerald-300"
              }`}
            >
              <Globe className="h-3 w-3" />
              <span>3D EXPLORE</span>
            </button>
            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                setViewMode("grid");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-emerald-400 text-black font-bold shadow-[0_0_16px_rgba(24,196,124,0.4)]"
                  : "text-[#7ca290] hover:text-emerald-300"
              }`}
            >
              <LayoutGrid className="h-3 w-3" />
              <span>FIND MATRIX</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleReplayIntro}
            className="flex items-center gap-1.5 border border-[rgba(120,160,145,0.2)] bg-black/40 px-3.5 py-2 text-[#7d9a8d] transition hover:border-emerald-400/50 hover:text-emerald-300"
            title="Replay classified signal interruption intro"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>REPLAY SIGNAL</span>
          </button>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-950/40 px-4 py-2 text-emerald-300 transition hover:bg-emerald-900/60 hover:text-emerald-200"
          >
            <span>ALL 30+ DIRECTORY</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/*  CATEGORY FILTER RAIL                                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 no-scrollbar mt-8 sm:mt-10 flex items-center justify-between gap-3 overflow-x-auto border-y border-[rgba(120,160,145,0.12)] py-3">
        <div className="flex gap-2 shrink-0">
          {CATEGORIES.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCategorySelect(c.id)}
                className={`shrink-0 rounded-lg border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.22em] transition-all duration-300 ${
                  isActive
                    ? "border-emerald-400 bg-emerald-400 text-[#020504] font-bold shadow-[0_0_24px_rgba(24,196,124,0.4)]"
                    : "border-[rgba(120,160,145,0.16)] bg-black/30 text-[#84a094] hover:border-emerald-500/40 hover:text-[#dff6ec]"
                }`}
              >
                {c.label} {c.id === "all" ? `(${publicEvents.length})` : ""}
              </button>
            );
          })}
        </div>

        {/* Search input in Find Matrix Mode */}
        {viewMode === "grid" && (
          <div className="relative flex items-center shrink-0 min-w-[200px] sm:min-w-[260px]">
            <Search className="absolute left-3 h-3.5 w-3.5 text-emerald-400" />
            <input
              type="text"
              placeholder="SEARCH BY NAME, VENUE, STREAM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-emerald-500/30 bg-[#020805]/80 py-1.5 pl-9 pr-3 font-mono text-[9px] text-[#e0faee] placeholder-[#558270] focus:border-emerald-400 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/*  MAIN VIEWPORT: 3D SPHERICAL ARCHIVE vs FIND MATRIX GRID     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mt-6 sm:mt-8">
        {showIntro ? (
          <ClassifiedTransmissionIntro onComplete={handleIntroComplete} />
        ) : viewMode === "3d" ? (
          <SphericalEventArchive3D
            events={publicEvents}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onOpenEventDossier={setSelectedDossierEvent}
            onOpenClassifiedModal={() => setIsClassifiedModalOpen(true)}
            accentOf={accentOf}
          />
        ) : (
          /* ── FIND MATRIX: RESPONSIVE CYBER GRID VIEW ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {gridFilteredEvents.map((event, idx) => {
              const accent = accentOf(event.stream);
              return (
                <div
                  key={event.id}
                  onClick={() => {
                    cyberAudio.playClick();
                    setSelectedDossierEvent(event);
                  }}
                  className="group relative cursor-pointer rounded-xl border border-[rgba(100,160,135,0.22)] bg-[#030906]/90 p-4 backdrop-blur-md transition-all duration-200 hover:border-emerald-400 hover:bg-[#040e08] hover:shadow-[0_0_30px_rgba(24,196,124,0.25)]"
                >
                  {/* Header: EVT Number & Stream */}
                  <div className="flex items-center justify-between border-b border-[rgba(100,160,135,0.15)] pb-2 font-mono text-[8px]">
                    <span className="text-[#558270] tracking-[0.2em]">
                      EVT {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-bold uppercase tracking-[0.18em]"
                      style={{ color: accent }}
                    >
                      {event.stream}
                    </span>
                  </div>

                  {/* Poster Thumbnail */}
                  <div className="relative mt-2.5 h-36 w-full overflow-hidden rounded-lg border border-emerald-500/20 bg-black/60">
                    <img
                      src={event.poster || event.image}
                      alt={event.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = event.image || "/logo-original.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020504]/90 via-transparent to-black/30" />
                  </div>

                  {/* Title & Blurb */}
                  <div className="mt-2.5">
                    <h3 className="t-cond text-[18px] sm:text-[20px] font-bold leading-tight text-[#f0fbf6] transition-colors group-hover:text-emerald-300">
                      {event.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 font-mono text-[9px] leading-relaxed text-[#7c9e8e]">
                      {event.blurb}
                    </p>
                  </div>

                  {/* Meta Details */}
                  <div className="mt-3 space-y-1 border-t border-[rgba(100,160,135,0.12)] pt-2 font-mono text-[8.5px] text-[#8ca89c]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="h-3 w-3 shrink-0 text-emerald-400" />
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="h-3 w-3 shrink-0 text-emerald-400" />
                        <span className="truncate">{event.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3 w-3 shrink-0 text-emerald-400" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  {/* CTA Action */}
                  <div className="mt-3 flex items-center justify-between border-t border-emerald-500/20 pt-2 font-mono text-[8.5px] font-bold tracking-[0.2em] text-emerald-400">
                    <span>VIEW EVENT DOSSIER</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/*  FOOTER CONTROLS & LIVE NUMBER COUNTER                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {!showIntro && (
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[rgba(120,160,145,0.14)] pt-5">
          {/* Left: Interactive Guidance */}
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-[#6f9b89]">
            <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">DRAG SPHERE IN 3D ·</span>
            <span>CORE = VYUHAM&apos;26 LOGO · CONCERT IS CLASSIFIED</span>
          </div>

          {/* Center: Live Number Counter */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.3em] text-[#558270]">
              EVENT:
            </span>
            <div className="flex items-baseline font-mono text-lg sm:text-xl font-bold tracking-[0.2em] text-emerald-400">
              <span className="text-emerald-300">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="mx-1.5 text-[#305747]">/</span>
              <span className="text-[#6f9b89]">
                {String(totalEvents).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Right: Quick Step Nav */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                setActiveIndex(((activeIndex - 1) % totalEvents + totalEvents) % totalEvents);
              }}
              className="flex items-center gap-1.5 border border-[rgba(120,160,145,0.2)] bg-black/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#8ca89c] transition hover:border-emerald-400/50 hover:text-emerald-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>PREV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                setActiveIndex((activeIndex + 1) % totalEvents);
              }}
              className="flex items-center gap-1.5 border border-[rgba(120,160,145,0.2)] bg-black/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#8ca89c] transition hover:border-emerald-400/50 hover:text-emerald-300"
            >
              <span>NEXT</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/*  CINEMATIC MODALS                                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ClassifiedModal
        isOpen={isClassifiedModalOpen}
        onClose={() => setIsClassifiedModalOpen(false)}
      />

      <EventDossierModal
        event={selectedDossierEvent}
        onClose={() => setSelectedDossierEvent(null)}
      />
    </section>
  );
}
