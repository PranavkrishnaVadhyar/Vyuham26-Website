import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { toast } from "@/components/ui/Toaster";
import { cyberAudio } from "@/lib/cyberAudio";

/**
 * Play a high-tech synthesized cyber audio chirp on root unlock/lock
 */
function playRootChime(granted: boolean) {
  try {
    const ctx = cyberAudio.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = granted ? "sine" : "sawtooth";
    if (granted) {
      // Ascending root authorization chirp: 440Hz -> 880Hz -> 1320Hz
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Descending lock chirp: 880Hz -> 330Hz
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch {
    // Audio context not ready or blocked by browser policy
  }
}

export default function AdminSecretListener() {
  const { ui } = useApp();
  const bufferRef = useRef<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. HARD SECRET CHORD 1: Ctrl + Alt + Shift + A (Cmd + Option + Shift + A on macOS)
      const isQuadChord =
        (e.ctrlKey || e.metaKey) &&
        e.altKey &&
        e.shiftKey &&
        (e.code === "KeyA" || e.key.toLowerCase() === "a");

      // 2. HARD SECRET CHORD 2: Ctrl + Shift + F12
      const isF12Chord =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "F12" || e.code === "F12");

      if (isQuadChord || isF12Chord) {
        e.preventDefault();
        e.stopPropagation();

        const willUnlock = !ui.adminUnlocked;
        ui.setAdminUnlocked(willUnlock);
        playRootChime(willUnlock);

        if (willUnlock) {
          toast(
            "⚡ [ROOT OVERRIDE GRANTED] Admin Core protocol activated. Link revealed in footer.",
            "info"
          );
        } else {
          toast(
            "🔒 [SECURITY PROTOCOL] Admin Core protocol locked and concealed.",
            "warn"
          );
        }
        return;
      }

      // 3. STEALTH PASSPHRASE BUFFER (e.g. typing "root26" or "vyuhamadmin" anywhere outside inputs)
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isInput) return;

      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-20);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          bufferRef.current = "";
        }, 2500);

        if (
          bufferRef.current.endsWith("root26") ||
          bufferRef.current.endsWith("vyuhamadmin") ||
          bufferRef.current.endsWith("admin26")
        ) {
          bufferRef.current = "";
          const willUnlock = !ui.adminUnlocked;
          ui.setAdminUnlocked(willUnlock);
          playRootChime(willUnlock);

          if (willUnlock) {
            toast(
              "⚡ [STEALTH OVERRIDE VERIFIED] Admin Core unlocked.",
              "info"
            );
          } else {
            toast("🔒 [SECURITY LOCK] Admin Core concealed.", "warn");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ui]);

  return null;
}
