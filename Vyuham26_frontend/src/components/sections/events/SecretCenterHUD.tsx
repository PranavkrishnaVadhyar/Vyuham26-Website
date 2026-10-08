"use client";

/**
 * SecretCenterHUD — Classified transmission HUD for the Day-03 secret core.
 *
 * Sits in the center of the 3D SecretCore artifact.
 * Displays classified telemetry, cycling decrypt sequence on hover,
 * redacted cipher bar, and click-to-intercept action.
 *
 * Never reveals: CONCERT / ARTIST / BAND / PERFORMER.
 */

import { useState, useEffect, useRef } from "react";
import { cyberAudio } from "@/lib/cyberAudio";
import { Lock, Radio, ShieldAlert } from "lucide-react";

interface SecretCenterHUDProps {
  onOpenModal: () => void;
  className?: string;
}

const CYCLE = [
  "SIGNAL DETECTED",
  "NIGHT 03",
  "DECRYPTING…",
  "AFTERSHOCK",
  "TRANSMISSION LOCKED",
];

export default function SecretCenterHUD({
  onOpenModal,
  className = "",
}: SecretCenterHUDProps) {
  const [hovered, setHovered]   = useState(false);
  const [cycleIdx, setCycleIdx] = useState(CYCLE.length - 1); // Start at "TRANSMISSION LOCKED"
  const [glitch, setGlitch]     = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Cycle through decrypt steps on hover */
  const handleEnter = () => {
    setHovered(true);
    cyberAudio.playHover();
    setGlitch(true);
    let step = 0;
    setCycleIdx(0);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      step++;
      if (step < CYCLE.length) {
        setCycleIdx(step);
      } else {
        clearInterval(timer.current!);
        setGlitch(false);
      }
    }, 420);
  };

  const handleLeave = () => {
    setHovered(false);
    if (timer.current) clearInterval(timer.current);
    setCycleIdx(CYCLE.length - 1);
    setGlitch(false);
  };

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <div
      onClick={() => { cyberAudio.playClick(); onOpenModal(); }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpenModal()}
      aria-label="Classified transmission — Day 3 Aftershock. Click to intercept signal."
      className={`
        group relative cursor-pointer select-none
        w-full max-w-[215px] sm:max-w-[235px]
        rounded-xl border
        px-3 py-2.5 sm:px-3.5 sm:py-2.5
        text-center
        backdrop-blur-md
        transition-all duration-300
        ${hovered
          ? "border-emerald-400 bg-[#040d08]/90 shadow-[0_0_36px_rgba(24,196,124,0.50)] scale-105"
          : "border-emerald-500/30 bg-[#030906]/80 shadow-[0_0_22px_rgba(24,196,124,0.20)]"
        }
        ${glitch ? "animate-pulse" : ""}
        ${className}
      `}
    >
      {/* Tech corner brackets */}
      <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l-2 border-t-2 border-emerald-400" />
      <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r-2 border-t-2 border-emerald-400" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 border-emerald-400" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-emerald-400" />

      {/* Cyber scanline overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(rgba(24,196,124,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-25" />

      {/* Live frequency badge */}
      <div className="relative flex items-center justify-center gap-1.5 font-mono text-[7px] sm:text-[7.5px] uppercase tracking-[0.22em] text-emerald-400">
        <Radio className="h-2 w-2 animate-pulse text-emerald-400" />
        <span>NIGHT 03 · 31 OCT 2026</span>
      </div>

      {/* Priority label */}
      <p className="relative mt-0.5 font-mono text-[6.5px] sm:text-[7px] tracking-[0.24em] text-[#4a7a65] uppercase">
        [ CLASSIFIED CORE TRANSMISSION ]
      </p>

      {/* Cycling classified title */}
      <h3 className="relative mt-1 t-cond text-[16px] sm:text-[18px] md:text-[19px] leading-tight tracking-[0.05em] text-[#e6fff5] drop-shadow-[0_0_12px_rgba(24,196,124,0.65)]">
        {CYCLE[cycleIdx]}
      </h3>

      {/* Redacted cipher bar */}
      <div className="relative mt-1 flex items-center justify-center gap-1.5">
        <span className="font-mono text-[6.5px] tracking-[0.18em] text-[#345c49]">CIPHER:</span>
        <span className="rounded border border-emerald-500/25 bg-emerald-950/70 px-1.5 py-0.5 font-mono text-[7.5px] tracking-widest text-emerald-400/90 shadow-[0_0_8px_rgba(24,196,124,0.2)]">
          ████████
        </span>
      </div>

      {/* Security Status Tag */}
      <div className="relative mt-1 mx-auto flex w-fit items-center gap-1 rounded border border-amber-400/40 bg-amber-950/30 px-1.5 py-0.5 font-mono text-[6.5px] uppercase tracking-[0.16em] text-amber-300">
        <Lock className="h-2 w-2 shrink-0" />
        <span>SIGNAL LOCKED</span>
      </div>

      {/* CTA Button */}
      <p className="relative mt-1.5 font-mono text-[6.5px] sm:text-[7.5px] font-bold uppercase tracking-[0.20em] text-[#42705b] transition-colors group-hover:text-emerald-300">
        [ CLICK TO INTERCEPT ]
      </p>
    </div>
  );
}
