"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cyberAudio } from "@/lib/cyberAudio";
import { useApp } from "@/lib/store";
import { useRegistrationOpen } from "@/config/site";
import { toast } from "@/components/ui/Toaster";
import type { FestEvent } from "@/data/types";
import { X, Calendar, Clock, MapPin, Trophy, Users, Shield, ArrowRight } from "lucide-react";

interface EventDossierModalProps {
  event: FestEvent | null;
  onClose: () => void;
}

export default function EventDossierModal({ event, onClose }: EventDossierModalProps) {
  const { register, isRegistered, toggleSave, saved, user, ui } = useApp();
  const regOpen = useRegistrationOpen();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && event) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  const handleRegister = () => {
    cyberAudio.playClick();
    if (!regOpen) {
      toast("Event registration opens soon! Explore the rulebook below.", "info");
      return;
    }
    if (!user) {
      ui.setAuthOpen("login");
      toast("Sign in to hold a slot.", "warn");
      return;
    }
    const res = register(event.id);
    toast(res.message, res.ok ? "ok" : "warn");
  };

  const isSaved = saved.includes(event.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[rgba(24,196,124,0.35)] bg-[#040c08]/95 p-6 sm:p-8 text-[#dff6ec] shadow-[0_0_70px_rgba(24,196,124,0.2)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[rgba(24,196,124,0.2)] pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.24em] text-emerald-400 uppercase">
              {event.stream} STREAM // DOSSIER DECRYPTED
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="rounded p-1 text-[#6f9b89] transition hover:bg-emerald-950/50 hover:text-emerald-300"
            aria-label="Close dossier"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Title and Blurb */}
        <div className="mt-6">
          <h2 className="t-cond text-[9vw] sm:text-[38px] leading-[0.9] text-[#f2fbf6]">
            {event.name}
          </h2>
          <p className="mt-3 font-mono text-[11px] sm:text-[12px] leading-relaxed text-[#8ca89c]">
            {event.blurb}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-[10px]">
          <div className="rounded border border-[rgba(24,196,124,0.18)] bg-black/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[#558270] text-[9px]">
              <Calendar className="h-3 w-3 text-emerald-400" />
              <span>DATE</span>
            </div>
            <p className="mt-1 font-semibold text-[#cfe8dc]">{event.date}</p>
          </div>

          <div className="rounded border border-[rgba(24,196,124,0.18)] bg-black/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[#558270] text-[9px]">
              <Clock className="h-3 w-3 text-emerald-400" />
              <span>TIME</span>
            </div>
            <p className="mt-1 font-semibold text-[#cfe8dc]">{event.time}</p>
          </div>

          <div className="rounded border border-[rgba(24,196,124,0.18)] bg-black/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[#558270] text-[9px]">
              <MapPin className="h-3 w-3 text-emerald-400" />
              <span>VENUE</span>
            </div>
            <p className="mt-1 font-semibold text-[#cfe8dc] truncate">{event.venue}</p>
          </div>

          <div className="rounded border border-[rgba(24,196,124,0.18)] bg-black/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[#558270] text-[9px]">
              <Trophy className="h-3 w-3 text-amber-400" />
              <span>PRIZE</span>
            </div>
            <p className="mt-1 font-semibold text-amber-300">{event.prize ?? "FESTIVAL AWARDS"}</p>
          </div>
        </div>

        {/* Rules & Protocols */}
        <div className="mt-6 border-t border-[rgba(24,196,124,0.18)] pt-4">
          <h4 className="font-mono text-[10px] tracking-[0.24em] text-emerald-400 uppercase">
            OPERATIONAL PROTOCOLS & RULES
          </h4>
          <ul className="mt-3 space-y-2 font-mono text-[10px] text-[#8ca89c]">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">▹</span>
              <span>Individual or squad eligibility adhering strictly to festival guidelines.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">▹</span>
              <span>All participants must report to the designated station 15 minutes prior.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">▹</span>
              <span>Decisions by festival marshals and judges are final and binding.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(24,196,124,0.18)] pt-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRegister}
              className="border border-emerald-500/60 bg-emerald-950/70 px-5 py-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-900/80 hover:shadow-[0_0_15px_rgba(24,196,124,0.3)]"
            >
              {!regOpen
                ? "REGISTRATION OPENS SOON"
                : isRegistered(event.id)
                ? "REGISTERED ✓"
                : "REGISTER FOR EVENT"}
            </button>

            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                toggleSave(event.id);
              }}
              className="border border-[rgba(120,160,145,0.25)] bg-black/40 px-3.5 py-2 font-mono text-[10px] tracking-[0.2em] text-[#8ea79b] transition hover:text-[#dff6ec]"
            >
              {isSaved ? "SAVED ★" : "SAVE ☆"}
            </button>
          </div>

          <Link
            href={`/events/${event.id.replace(/^ev-/, "")}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-emerald-400 hover:underline"
          >
            <span>FULL PAGE DETAILS</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
