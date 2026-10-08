"use client";

import { useState } from "react";
import type { FestEvent, StreamId } from "@/data/types";
import { Calendar, Clock, MapPin, ArrowRight, Lock, Radio } from "lucide-react";

interface EventPosterCardProps {
  event?: FestEvent;
  isClassified?: boolean;
  publicIdx?: number;
  isFrontActive?: boolean;
  accent?: string;
  isBack?: boolean;
  camZ: number;
  width: number;
  height: number;
  index: number;
}

/**
 * EventPosterCard — Cinematic 2:3 Portrait Event Poster.
 *
 * Renders the event's visual poster identity in the 3D Fibonacci sphere,
 * with cyberpunk overlays, corner brackets, and robust image fallbacks.
 * For the secret Day 3 concert, renders the classified AFTERSHOCK poster.
 */
export default function EventPosterCard({
  event,
  isClassified = false,
  publicIdx = 0,
  isFrontActive = false,
  accent = "#18c47c",
  isBack = false,
  camZ,
  width,
  height,
  index,
}: EventPosterCardProps) {
  // Image error fallback handling
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (isClassified) return "";
    return event?.poster || event?.image || "/logo-original.png";
  });
  const [hasFailedOnce, setHasFailedOnce] = useState(false);

  const handleImageError = () => {
    if (!hasFailedOnce && event?.image && imgSrc !== event.image) {
      setHasFailedOnce(true);
      setImgSrc(event.image);
    } else {
      // Clean VYUHAM placeholder poster fallback
      setImgSrc("/logo-original.png");
    }
  };

  // Subtle staggered floating animation for organic cinematic feel
  const floatDelay = `${(index % 5) * 0.7}s`;
  const floatDuration = `${5.2 + (index % 4) * 0.6}s`;

  /* ══════════════════════════════════════════════════════════════════
     A) SECRET DAY 3 CLASSIFIED POSTER
     ══════════════════════════════════════════════════════════════════ */
  if (isClassified) {
    return (
      <div
        className="group relative select-none overflow-hidden rounded-xl border border-amber-500/70 bg-[#0e0402] backdrop-blur-md shadow-[0_0_35px_rgba(245,158,11,0.35),0_0_60px_rgba(24,196,124,0.15)] transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_55px_rgba(245,158,11,0.65)]"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          animation: isBack ? "none" : `posterFloat ${floatDuration} ease-in-out ${floatDelay} infinite alternate`,
        }}
      >
        {/* Amber Hazard Header Stripes */}
        <div className="absolute top-0 inset-x-0 h-1.5 z-20 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_6px,#000_6px,#000_12px)] opacity-90" />

        {/* Cyber Tech Corner Brackets */}
        <span className="pointer-events-none absolute left-1.5 top-2.5 z-20 h-2.5 w-2.5 sm:h-3 sm:w-3 border-l-2 border-t-2 border-amber-400" />
        <span className="pointer-events-none absolute right-1.5 top-2.5 z-20 h-2.5 w-2.5 sm:h-3 sm:w-3 border-r-2 border-t-2 border-amber-400" />
        <span className="pointer-events-none absolute bottom-1.5 left-1.5 z-20 h-2.5 w-2.5 sm:h-3 sm:w-3 border-b-2 border-l-2 border-amber-400" />
        <span className="pointer-events-none absolute bottom-1.5 right-1.5 z-20 h-2.5 w-2.5 sm:h-3 sm:w-3 border-b-2 border-r-2 border-amber-400" />

        {/* Scanline Grid Background */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(245,158,11,0.04)_50%,transparent_50%)] bg-[length:100%_4px] opacity-40" />

        {/* Classified Dark Background Plate with Radial Warning Glow */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 40%, rgba(180,83,9,0.35) 0%, rgba(10,3,1,0.95) 75%)",
          }}
        />

        {/* Classified Watermark Graphic */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <img
            src="/vyuham_logo.png"
            alt="Watermark"
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain filter grayscale invert contrast-200"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 flex h-full flex-col justify-between p-2.5 sm:p-4 text-amber-200">
          {/* Top Bar: NIGHT 03 & CLASSIFIED pill */}
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-1.5 sm:pb-2">
            <div className="flex items-center gap-1 font-mono text-[7.5px] sm:text-[9px] font-bold uppercase tracking-[0.20em] text-amber-400">
              <Radio className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-pulse text-amber-400" />
              <span>NIGHT 03</span>
            </div>
            <span className="rounded bg-amber-950/90 px-1.5 sm:px-2 py-0.5 font-mono text-[6.5px] sm:text-[8px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/40">
              CLASSIFIED
            </span>
          </div>

          {/* Center: Mysterious Cipher & Lock Beacon */}
          <div className="my-auto text-center space-y-1.5 sm:space-y-2">
            <div className="mx-auto flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-amber-500/40 bg-amber-950/60 shadow-[0_0_24px_rgba(245,158,11,0.3)]">
              <Lock className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
            </div>

            <div>
              <h4 className="t-cond text-[17px] sm:text-[24px] font-black tracking-wider leading-none text-amber-100 drop-shadow-[0_0_16px_rgba(245,158,11,0.8)]">
                AFTERSHOCK
              </h4>
              <p className="mt-0.5 font-mono text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.18em] text-amber-400">
                TRANSMISSION LOCKED
              </p>
            </div>

            {/* Cipher Bar */}
            <div className="mx-auto max-w-[130px] sm:max-w-[170px] rounded border border-amber-500/25 bg-black/75 px-1.5 py-0.5 font-mono text-[7px] sm:text-[8px]">
              <span className="tracking-widest text-amber-300 font-bold">████████</span>
            </div>
          </div>

          {/* Bottom Bar: Signal Status */}
          <div className="border-t border-amber-500/25 pt-1.5 sm:pt-2">
            <div className="flex items-center justify-between font-mono text-[6.5px] sm:text-[8.5px] text-amber-400">
              <span className="truncate">SIGNAL NOT DECRYPTED</span>
              <span className="text-[6.5px] sm:text-[7.5px] text-amber-300 group-hover:underline">
                [ INTERCEPT ]
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════
     B) PUBLIC EVENT POSTER
     ══════════════════════════════════════════════════════════════════ */
  if (!event) return null;

  return (
    <div
      className={`group relative select-none overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300 ${
        isFrontActive
          ? "border-emerald-400 ring-2 ring-emerald-400/80 shadow-[0_0_50px_rgba(24,196,124,0.65),0_0_80px_rgba(24,196,124,0.25)]"
          : camZ > 0.35
          ? "border-[rgba(24,196,124,0.35)] shadow-[0_0_24px_rgba(24,196,124,0.15)] hover:border-emerald-400 hover:shadow-[0_0_36px_rgba(24,196,124,0.4)]"
          : "border-[rgba(100,160,135,0.2)] bg-[#020504]/90 hover:border-emerald-400/60"
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        animation: isBack ? "none" : `posterFloat ${floatDuration} ease-in-out ${floatDelay} infinite alternate`,
      }}
    >
      {/* ── Active Event Beacon Badge ── */}
      {isFrontActive && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-full border border-emerald-400 bg-emerald-950 px-2.5 sm:px-3.5 py-0.5 font-mono text-[7px] sm:text-[8.5px] font-bold uppercase tracking-[0.20em] sm:tracking-[0.24em] text-emerald-300 shadow-[0_0_20px_rgba(24,196,124,0.8)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
          ACTIVE EVENT
        </div>
      )}

      {/* ── Cyber Corner Brackets ── */}
      <span className="pointer-events-none absolute left-1.5 top-1.5 z-20 h-2 sm:h-2.5 w-2 sm:w-2.5 border-l-2 border-t-2 border-emerald-400/80 group-hover:border-emerald-300" />
      <span className="pointer-events-none absolute right-1.5 top-1.5 z-20 h-2 sm:h-2.5 w-2 sm:w-2.5 border-r-2 border-t-2 border-emerald-400/80 group-hover:border-emerald-300" />
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 z-20 h-2 sm:h-2.5 w-2 sm:w-2.5 border-b-2 border-l-2 border-emerald-400/80 group-hover:border-emerald-300" />
      <span className="pointer-events-none absolute bottom-1.5 right-1.5 z-20 h-2 sm:h-2.5 w-2 sm:w-2.5 border-b-2 border-r-2 border-emerald-400/80 group-hover:border-emerald-300" />

      {/* ── Poster Visual Image (object-fit: cover) ── */}
      <div className="absolute inset-0 bg-[#030906]">
        <img
          src={imgSrc}
          alt={event.name}
          onError={handleImageError}
          loading={isFrontActive ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle holographic scanline layer */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-25" />
      </div>

      {/* ── Top Cyber HUD Bar Gradient Overlay ── */}
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[#010503]/95 via-[#010503]/70 to-transparent p-2 sm:p-3 pt-2">
        <div className="flex items-center justify-between">
          {/* EVT Number */}
          <span className="font-mono text-[7px] sm:text-[9px] font-bold tracking-[0.20em] sm:tracking-[0.22em] text-[#a1d6be] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            EVT {String(publicIdx + 1).padStart(2, "0")}
          </span>

          {/* Stream Category Badge */}
          <span
            className="rounded px-1.5 sm:px-2 py-0.5 font-mono text-[6.5px] sm:text-[8px] font-bold uppercase tracking-wider shadow-sm border border-black/40"
            style={{
              backgroundColor: "rgba(0,0,0,0.75)",
              color: accent,
              borderColor: `${accent}40`,
            }}
          >
            {event.stream}
          </span>
        </div>
      </div>

      {/* ── Bottom Cyber HUD Bar Gradient Overlay ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#010503]/98 via-[#010503]/85 to-transparent p-2.5 sm:p-3.5 pt-6 sm:pt-8">
        {/* Event Title */}
        <h4
          className={`t-cond font-bold leading-tight text-[#f3fbf7] transition-colors group-hover:text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
            isFrontActive
              ? "text-[13px] sm:text-[17px] line-clamp-2"
              : camZ > 0.35
              ? "text-[11px] sm:text-[13px] line-clamp-2"
              : "text-[9.5px] sm:text-[11px] line-clamp-1 text-[#9fc7b5]"
          }`}
        >
          {event.name}
        </h4>

        {/* Metadata Details (Date, Time, Venue) */}
        {isFrontActive ? (
          <div className="mt-1.5 sm:mt-2 space-y-1 border-t border-[rgba(24,196,124,0.25)] pt-1.5 sm:pt-2 font-mono text-[7px] sm:text-[8.5px] text-[#91b8a5]">
            <div className="flex items-center justify-between gap-1 truncate">
              <div className="flex items-center gap-1 truncate">
                <Calendar className="h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0 text-emerald-400" />
                <span className="truncate">{event.date}</span>
              </div>
              <div className="flex items-center gap-1 truncate">
                <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0 text-emerald-400" />
                <span className="truncate">{event.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 truncate text-[#709c86]">
              <MapPin className="h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0 text-emerald-400" />
              <span className="truncate">{event.venue}</span>
            </div>

            {/* View Dossier CTA on Active Poster */}
            <div className="mt-1.5 sm:mt-2 flex items-center justify-between rounded border border-emerald-400/50 bg-emerald-950/70 px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[7px] sm:text-[8px] font-bold tracking-[0.18em] sm:tracking-[0.20em] text-emerald-300 shadow-[0_0_12px_rgba(24,196,124,0.35)] transition-all group-hover:bg-emerald-900/80">
              <span>VIEW DOSSIER</span>
              <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-between border-t border-[rgba(100,148,128,0.15)] pt-1 font-mono text-[6.5px] sm:text-[7.5px] text-[#628f7a]">
            <span className="truncate">{event.date}</span>
            <span className="truncate text-[#426a57]">{event.venue.split(",")[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
