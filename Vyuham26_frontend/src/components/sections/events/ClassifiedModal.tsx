"use client";

import { useEffect } from "react";
import { cyberAudio } from "@/lib/cyberAudio";
import { Lock, Radio, ShieldAlert, X } from "lucide-react";

interface ClassifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ClassifiedModal — Cinematic classified transmission overlay.
 * Opens when the user clicks the mysterious center object.
 * Strictly maintains secrecy without revealing concert or artist details.
 */
export default function ClassifiedModal({ isOpen, onClose }: ClassifiedModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-[#030906]/95 p-6 sm:p-8 text-[#dff6ec] shadow-[0_0_80px_rgba(24,196,124,0.25)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Brackets */}
        <span className="pointer-events-none absolute -left-[1px] -top-[1px] h-4 w-4 border-l-2 border-t-2 border-emerald-400" />
        <span className="pointer-events-none absolute -right-[1px] -top-[1px] h-4 w-4 border-r-2 border-t-2 border-emerald-400" />
        <span className="pointer-events-none absolute -bottom-[1px] -left-[1px] h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
        <span className="pointer-events-none absolute -bottom-[1px] -right-[1px] h-4 w-4 border-b-2 border-r-2 border-emerald-400" />

        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.24em] text-emerald-400 uppercase">
              VYUHAM'26 // SIGNAL INTERCEPT
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="rounded p-1 text-[#6f9b89] transition hover:bg-emerald-950/50 hover:text-emerald-300"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="mt-5 border-l-2 border-amber-400/80 bg-amber-950/20 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-amber-400 uppercase">
              CLASSIFIED TRANSMISSION // LEVEL-0
            </p>
          </div>
          <p className="mt-1 font-mono text-[8px] tracking-[0.14em] text-amber-200/70">
            THIS SIGNAL IS NOT READY. THE TRANSMISSION WILL BE DECRYPTED SOON.
          </p>
        </div>

        {/* Core Content */}
        <div className="mt-6 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#558270] uppercase">
            TARGET PHASE: DAY 03 · NIGHTTIME
          </p>
          <h2 className="t-cond mt-2 text-[12vw] sm:text-[42px] leading-tight text-[#f3fbf7] drop-shadow-[0_0_20px_rgba(24,196,124,0.4)]">
            AFTERSHOCK
          </h2>
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-[#8ca89c]">
            An encrypted high-priority festival transmission has been locked into the core mainframe.
            Frequency resonance indicates a massive festival finale scheduled for the closing hours.
          </p>
        </div>

        {/* Audio Spectrogram / Waveform Simulation */}
        <div className="mt-6 rounded border border-emerald-500/25 bg-black/40 p-3">
          <div className="flex items-center justify-between font-mono text-[8px] text-[#558270] uppercase tracking-widest pb-2">
            <span>RECEIVER: 1420.405 MHz</span>
            <span>STATUS: CIPHER LOCKED</span>
          </div>
          <div className="flex items-end justify-center gap-1 h-12">
            {Array.from({ length: 32 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 rounded-t bg-emerald-400/70 transition-all duration-300"
                style={{
                  height: `${20 + ((i * 17) % 80)}%`,
                  animation: `pulse ${(0.6 + (i % 7) * 0.15).toFixed(2)}s infinite alternate ease-in-out`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Telemetry info */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-500/20 pt-4 font-mono text-[9px] text-[#6f9b89]">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-amber-300 uppercase tracking-wider">CLEARANCE PENDING</span>
          </div>
          <span className="uppercase tracking-widest text-[#406857]">CIPHER: AES-4096-QUANTUM</span>
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="w-full border border-emerald-500/40 bg-emerald-950/60 py-2.5 font-mono text-[10px] font-bold tracking-[0.24em] uppercase text-emerald-300 transition-all hover:border-emerald-300 hover:bg-emerald-900/80 hover:shadow-[0_0_20px_rgba(24,196,124,0.3)]"
          >
            ACKNOWLEDGE & CLOSE TRANSMISSION [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
