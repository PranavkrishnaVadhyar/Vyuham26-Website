import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { toast } from "@/components/ui/Toaster";
import { cyberAudio } from "@/lib/cyberAudio";
import { navigate, markInternalNav, getAppPath } from "@/lib/router";

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
      // 1. HARD SECRET CHORD:
      // Accepts Ctrl+Shift+A, Ctrl+Alt+A, Alt+Shift+A, Ctrl+Alt+Shift+A, or Ctrl+Shift+F12 / Ctrl+F12
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

        const currentPath = getAppPath();
        const isOnAdmin = currentPath === "/admin" || currentPath.startsWith("/admin/");
        const willUnlock = !isOnAdmin;

        ui.setAdminUnlocked(willUnlock);
        playRootChime(willUnlock);
        markInternalNav();

        if (willUnlock) {
          navigate("/admin");
          toast(
            "⚡ [ROOT OVERRIDE GRANTED] Entering Admin Operations Center...",
            "ok"
          );
        } else {
          navigate("/");
          toast(
            "🔒 [SECURITY PROTOCOL] Admin Core locked. Returned to festival arena.",
            "warn"
          );
        }
        return;
      }

      // 2. STEALTH PASSPHRASE BUFFER (e.g. typing "root26", "admin", "admin26", "root" outside inputs)
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

        const buf = bufferRef.current;
        const matchedWord = [
          "root26",
          "admin26",
          "vyuhamadmin",
          "vyuham26",
          "admin",
          "root",
          "secret",
          "vyuham",
        ].find((w) => buf.endsWith(w));
        if (matchedWord) {
          bufferRef.current = "";
          const currentPath = getAppPath();
          const isOnAdmin = currentPath === "/admin" || currentPath.startsWith("/admin/");
          const willUnlock = !isOnAdmin;

          ui.setAdminUnlocked(willUnlock);
          // The typed passphrase doubles as the X-Admin-Key credential for
          // backend admin calls (only matches if the operator configured the
          // backend ADMIN_ACCESS_KEY to the same value; otherwise the backend
          // rejects it and only real admin-role JWTs are accepted).
          try {
            if (willUnlock) {
              sessionStorage.setItem("vyuham26:admin_key", matchedWord);
            } else {
              sessionStorage.removeItem("vyuham26:admin_key");
            }
          } catch {}
          playRootChime(willUnlock);
          markInternalNav();

          if (willUnlock) {
            navigate("/admin");
            toast(
              "⚡ [STEALTH OVERRIDE VERIFIED] Access Granted — Welcome Admin.",
              "ok"
            );
          } else {
            navigate("/");
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
