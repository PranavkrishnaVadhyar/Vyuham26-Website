import { useState, useEffect, type FormEvent } from "react";
import { toast } from "@/components/ui/Toaster";
import { cyberAudio } from "@/lib/cyberAudio";
import { navigate, markInternalNav } from "@/lib/router";

interface AdminGateProps {
  onUnlock: () => void;
}

export default function AdminGate({ onUnlock }: AdminGateProps) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const handleChord = (e: KeyboardEvent) => {
      const isAKey = e.code === "KeyA" || e.key.toLowerCase() === "a";
      const hasCtrl = e.ctrlKey || e.metaKey;
      const hasAlt = e.altKey;
      const hasShift = e.shiftKey;

      const isChord =
        (isAKey &&
          ((hasCtrl && hasShift) ||
            (hasCtrl && hasAlt) ||
            (hasAlt && hasShift) ||
            (hasCtrl && hasAlt && hasShift))) ||
        ((e.key === "F12" || e.code === "F12") && hasCtrl);

      if (isChord) {
        e.preventDefault();
        e.stopPropagation();
        markInternalNav();
        cyberAudio.playTelemetry();
        toast("⚡ [ROOT AUTHORIZATION ACCEPTED] Access granted.", "info");
        onUnlock();
      }
    };

    window.addEventListener("keydown", handleChord, { capture: true });
    return () => window.removeEventListener("keydown", handleChord, { capture: true });
  }, [onUnlock]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = passphrase.trim().toLowerCase();

    // Accepted passphrases
    if (
      clean === "root26" ||
      clean === "vyuham26" ||
      clean === "admin26" ||
      clean === "vyuhamadmin" ||
      clean === "admin" ||
      clean === "root" ||
      clean === "secret" ||
      clean === "vyuham"
    ) {
      markInternalNav();
      cyberAudio.playTelemetry();
      toast("⚡ [ROOT AUTHORIZATION ACCEPTED] Access granted.", "info");
      onUnlock();
    } else {
      setError(true);
      setAttempts((a) => a + 1);
      toast("⛔ [ACCESS DENIED] Invalid authorization signature.", "warn");
      setPassphrase("");
      setTimeout(() => setError(false), 1200);
    }
  };

  const handleReturnHome = () => {
    markInternalNav();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center bg-[#020504] px-4 text-[#dff6ec]">
      {/* Ambient background glow and grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,77,50,0.22),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(3,6,5,0.8)_100%)]" />

      {/* Main Terminal Gate Card */}
      <div
        className={`relative z-10 w-full max-w-lg border border-[rgba(24,196,124,0.3)] bg-[rgba(6,15,11,0.92)] p-6 md:p-8 shadow-[0_0_50px_rgba(24,196,124,0.15)] backdrop-blur-xl transition-all duration-300 ${
          error ? "animate-shake border-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.25)]" : ""
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[rgba(24,196,124,0.2)] pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.24em] text-emerald-400">
              VYUHAM'26 // ROOT CORE GATEWAY
            </span>
          </div>
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#557e6d]">
            SYS_LVL_0
          </span>
        </div>

        {/* Warning & Classified Banner */}
        <div className="mt-6 border-l-2 border-amber-500/80 bg-amber-950/20 px-3.5 py-2.5">
          <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-amber-400">
            RESTRICTED INFRASTRUCTURE // LEVEL-0 CLEARANCE REQUIRED
          </p>
          <p className="mt-1 font-mono text-[8px] tracking-[0.14em] text-amber-200/70">
            Direct navigation to the Administrative Core is restricted. Provide authorized root override passphrase or trigger the hardware security chord.
          </p>
        </div>

        {/* Override Form */}
        <form onSubmit={handleSubmit} className="mt-8">
          <label className="block font-mono text-[10px] tracking-[0.22em] text-[#78a594]">
            ENTER ROOT OVERRIDE SIGNATURE:
          </label>
          <div className="mt-2 flex gap-2">
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
              className="flex-1 border border-[rgba(24,196,124,0.35)] bg-[rgba(2,10,7,0.7)] px-3.5 py-2 font-mono text-sm tracking-[0.2em] text-emerald-300 placeholder-emerald-900/50 outline-none transition-colors focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(24,196,124,0.3)]"
            />
            <button
              type="submit"
              className="border border-emerald-500/60 bg-emerald-950/70 px-4 py-2 font-mono text-xs font-semibold tracking-[0.2em] text-emerald-300 transition-all hover:border-emerald-300 hover:bg-emerald-900/80 hover:shadow-[0_0_20px_rgba(24,196,124,0.4)]"
            >
              AUTHENTICATE
            </button>
          </div>

          {error && (
            <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-red-400">
              [ACCESS DENIED] INVALID OVERRIDE PASSPHRASE ({attempts} REJECTED)
            </p>
          )}
        </form>

        {/* Security Chord Hint */}
        <div className="mt-6 border-t border-[rgba(24,196,124,0.14)] pt-4 text-center">
          <p className="font-mono text-[9px] tracking-[0.2em] text-[#557e6d]">
            OR PRESS HARDWARE SECURITY CHORD:
          </p>
          <div className="mt-2 flex justify-center items-center gap-1.5 font-mono text-[10px] text-emerald-400">
            <kbd className="border border-emerald-500/40 bg-emerald-950/50 px-2 py-0.5 rounded text-[9px]">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="border border-emerald-500/40 bg-emerald-950/50 px-2 py-0.5 rounded text-[9px]">
              Shift
            </kbd>
            <span>+</span>
            <kbd className="border border-emerald-500/40 bg-emerald-950/50 px-2 py-0.5 rounded text-[9px]">
              A
            </kbd>
          </div>
          <p className="mt-2 font-mono text-[8px] tracking-[0.16em] text-[#4f7062]">
            (Also accepts Ctrl+Alt+Shift+A · Ctrl+F12 · Passphrases: root26 / admin)
          </p>
        </div>

        {/* Exit back to public */}
        <div className="mt-6 pt-2 text-center">
          <button
            type="button"
            onClick={handleReturnHome}
            className="font-mono text-[9px] tracking-[0.22em] text-[#6e9483] transition-colors hover:text-emerald-300"
          >
            ← RETURN TO PUBLIC FESTIVAL ARENA
          </button>
        </div>
      </div>
    </div>
  );
}
