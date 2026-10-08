"use client";

import { useEffect, useState } from "react";
import { cyberAudio } from "@/lib/cyberAudio";
import { Radio, AlertTriangle } from "lucide-react";

interface ClassifiedTransmissionIntroProps {
  onComplete: () => void;
}

const STEPS = [
  { text: "EVENT DATABASE INITIALIZING…", duration: 1100, glitch: false },
  { text: "CALIBRATING ORBITAL SECTOR…", duration: 800, glitch: false },
  { text: "⚠ WARNING: UNKNOWN SIGNAL DETECTED", duration: 1000, glitch: true },
  { text: "TRANSMISSION INTERCEPTED: DAY 03 // CLASSIFIED", duration: 1200, glitch: true },
  { text: "ARTIFACT CODE: AFTERSHOCK", duration: 1100, glitch: false },
  { text: "TRANSMISSION LOCKED // MATERIALIZING MATRIX", duration: 900, glitch: false },
];

export default function ClassifiedTransmissionIntro({ onComplete }: ClassifiedTransmissionIntroProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentStep < STEPS.length) {
      cyberAudio.playHover();
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, STEPS[currentStep].duration);
    } else {
      onComplete();
    }

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  // Keyboard shortcut ESC to skip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onComplete]);

  const stepData = STEPS[Math.min(currentStep, STEPS.length - 1)];

  return (
    <div className="relative z-30 flex min-h-[480px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#020504]/95 p-8 text-center backdrop-blur-2xl">
      {/* Glitch & Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(24,196,124,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(24,196,124,0.12),transparent_70%)]" />

      {/* Center Radar / Beacon */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        <span className="absolute h-full w-full rounded-full border border-emerald-400/30 animate-ping" />
        <span className="absolute h-16 w-16 rounded-full border border-cyan-400/50 animate-pulse" />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950/80 border border-emerald-400/80 shadow-[0_0_25px_rgba(24,196,124,0.6)]">
          {stepData.glitch ? (
            <AlertTriangle className="h-5 w-5 text-amber-400 animate-bounce" />
          ) : (
            <Radio className="h-5 w-5 text-emerald-300 animate-pulse" />
          )}
        </div>
      </div>

      {/* Terminal Readout */}
      <div className="relative max-w-lg">
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#558270] uppercase">
          SEC-04 // TELEMETRY SCAN
        </p>

        <h3
          className={`t-cond mt-3 text-[7vw] sm:text-[34px] leading-tight transition-all duration-200 ${
            stepData.glitch
              ? "text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]"
              : "text-[#eafaf2] drop-shadow-[0_0_25px_rgba(24,196,124,0.4)]"
          }`}
        >
          {stepData.text}
        </h3>

        {/* Loading Bar */}
        <div className="mx-auto mt-6 h-1 w-48 overflow-hidden rounded-full bg-emerald-950 border border-emerald-500/20">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={onComplete}
        className="relative mt-8 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6f9b89] transition hover:text-emerald-300"
      >
        [ SKIP TRANSMISSION INTRO · ESC ]
      </button>
    </div>
  );
}
