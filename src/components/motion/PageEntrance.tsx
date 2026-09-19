"use client";

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type Phase = "idle" | "hero" | "stats" | "about" | "streams" | "schedule" | "cta" | "complete";

interface PageEntranceContextValue {
  phase: Phase;
  reducedMotion: boolean | null;
  isClient: boolean;
}

const PageEntranceContext = createContext<PageEntranceContextValue>({
  phase: "complete",
  reducedMotion: false,
  isClient: false,
});

export function usePageEntrance() {
  return useContext(PageEntranceContext);
}

const PHASE_ORDER: Phase[] = ["hero", "stats", "about", "streams", "schedule", "cta"];
const PHASE_DELAY = 280;

export function PageEntranceProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("complete"); // SSR shows all
  const [isClient, setIsClient] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsClient(true);
      // Reset to idle on client, then run entrance
      setPhase("idle");
      if (reduceMotion) {
        setPhase("complete");
        return;
      }
      startedRef.current = true;

      let currentIdx = 0;
      const advance = () => {
        if (currentIdx >= PHASE_ORDER.length) {
          setPhase("complete");
          return;
        }
        setPhase(PHASE_ORDER[currentIdx]);
        currentIdx++;
        setTimeout(advance, PHASE_DELAY);
      }

      const startTimer = setTimeout(advance, 300);
      return () => clearTimeout(startTimer);
    }, 0);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  return (
    <PageEntranceContext.Provider value={{ phase, reducedMotion: reduceMotion, isClient }}>
      {children}
    </PageEntranceContext.Provider>
  );
}

export function PageEntranceGate({ phase: targetPhase, children }: { phase: Phase; children: ReactNode }) {
  const { phase, reducedMotion, isClient } = usePageEntrance();
  
  // During SSR or if not client yet, show everything
  if (!isClient) return <>{children}</>;

  const phaseIndex = PHASE_ORDER.indexOf(targetPhase);
  const currentIndex = PHASE_ORDER.indexOf(phase);
  const isActive = reducedMotion || phase === "complete" || currentIndex >= phaseIndex;

  if (!isActive) return null;

  return <>{children}</>;
}