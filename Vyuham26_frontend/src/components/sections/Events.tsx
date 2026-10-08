"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { useReducedMotion } from "@/lib/hooks";
import { cyberAudio } from "@/lib/cyberAudio";
import { FocusIn, MaskReveal } from "@/components/cinematic/Reveal";
import type { FestEvent, StreamId } from "@/data/types";

// Sub-components
import OrbitalCarousel3D from "./events/OrbitalCarousel3D";
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  SECRET EVENT CONFIGURATION (DAY 03 AFTERSHOCK ARTIFACT)            */
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

  // Active category filter
  const [selectedCategory, setSelectedCategory] = useState<StreamId | "all">("all");

  // Active public event index in carousel
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
  // 1. Filter out secret concert event so it NEVER appears as a public card
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

  // Reset active index when category changes
  const handleCategorySelect = (catId: StreamId | "all") => {
    cyberAudio.playClick();
    setSelectedCategory(catId);
    setActiveIndex(0);
  };

  const totalEvents = publicEvents.length;
  const currentEvent = publicEvents[activeIndex] || publicEvents[0];

  return (
    <section
      id="events"
      className="relative w-full overflow-hidden px-4 sm:px-6 pt-16 sm:pt-24 md:pt-32 pb-14 sm:pb-20 md:px-[6vw] bg-[#020504]"
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
              <span>3D ORBITAL GRID</span>
            </div>
          </div>

          <h2 className="t-cond mt-4 text-[13vw] sm:text-[10vw] md:text-[6vw] leading-[0.85] text-[#f0f9f5]">
            <MaskReveal>THE PROGRAMME</MaskReveal>
          </h2>

          <p className="mt-4 max-w-[56ch] text-[13px] leading-relaxed text-[#7d9a8d] md:text-[15px]">
            Explore 30+ festival competitions orbiting the classified Day 03 transmission core.
            Rotate the matrix to inspect event dossiers or lock in your squad.
          </p>
        </div>

        {/* Right actions: Replay intro & View Directory */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono text-[9px] uppercase tracking-[0.2em]">
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
      <div className="relative z-10 no-scrollbar mt-8 sm:mt-10 flex gap-2 overflow-x-auto border-y border-[rgba(120,160,145,0.12)] py-3">
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/*  MAIN 3D ORBITAL CAROUSEL VIEWPORT                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mt-6 sm:mt-8">
        {showIntro ? (
          <ClassifiedTransmissionIntro onComplete={handleIntroComplete} />
        ) : (
          <OrbitalCarousel3D
            events={publicEvents}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onOpenEventDossier={setSelectedDossierEvent}
            onOpenClassifiedModal={() => setIsClassifiedModalOpen(true)}
            accentOf={accentOf}
          />
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/*  FOOTER ORBITAL CONTROLS & LIVE COUNTER                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {!showIntro && (
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[rgba(120,160,145,0.14)] pt-5">
          {/* Left: Interactive Guidance */}
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-[#6f9b89]">
            <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">DRAG, SWIPE, OR SCROLL TO ROTATE ORBIT ·</span>
            <span>CENTER OBJECT IS CLASSIFIED</span>
          </div>

          {/* Center: Live Number Counter */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.3em] text-[#558270]">
              ORBIT INDEX:
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
