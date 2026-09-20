"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* =========================================================
   PAGE PHASES
========================================================= */

export type Phase =
  | "idle"
  | "hero"
  | "stats"
  | "about"
  | "streams"
  | "schedule"
  | "cta"
  | "complete";

interface PageEntranceContextValue {
  phase: Phase;
  reducedMotion: boolean;
  isClient: boolean;
}

/* =========================================================
   CONTEXT
========================================================= */

const PageEntranceContext =
  createContext<PageEntranceContextValue>({
    phase: "complete",
    reducedMotion: false,
    isClient: false,
  });

export function usePageEntrance() {
  return useContext(PageEntranceContext);
}

/* =========================================================
   PHASE ORDER
========================================================= */

const PHASE_ORDER: Phase[] = [
  "hero",
  "stats",
  "about",
  "streams",
  "schedule",
  "cta",
];

/*
 * Time between section unlocks.
 *
 * 420ms gives the homepage a more deliberate
 * cinematic rhythm without making it feel slow.
 */
const PHASE_DELAY = 420;

/* =========================================================
   PROVIDER
========================================================= */

export function PageEntranceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const reduceMotion =
    usePrefersReducedMotion();

  /*
   * SSR renders everything.
   * This prevents hydration problems and
   * avoids blank content before JS starts.
   */
  const [phase, setPhase] =
    useState<Phase>("complete");

  const [isClient, setIsClient] =
    useState(false);

  const startedRef =
    useRef(false);

  useEffect(() => {
    let mounted = true;

    /*
     * Move from SSR state to client state.
     */
    const clientTimer = window.setTimeout(() => {
      if (!mounted) return;

      setIsClient(true);

      /*
       * Accessibility:
       * if reduced motion is enabled, immediately
       * expose the complete page.
       */
      if (reduceMotion) {
        setPhase("complete");
        return;
      }

      /*
       * Prevent duplicate entrance sequences.
       */
      if (startedRef.current) {
        return;
      }

      startedRef.current = true;

      setPhase("idle");

      let currentIndex = 0;

      const startTimer =
        window.setTimeout(() => {
          if (!mounted) return;

          const advance = () => {
            if (!mounted) return;

            if (
              currentIndex >=
              PHASE_ORDER.length
            ) {
              setPhase("complete");
              return;
            }

            setPhase(
              PHASE_ORDER[currentIndex]
            );

            currentIndex += 1;

            window.setTimeout(
              advance,
              PHASE_DELAY
            );
          };

          advance();
        }, 250);

      /*
       * Store timer for cleanup.
       */
      cleanupTimers.push(startTimer);
    }, 0);

    const cleanupTimers: number[] = [];

    return () => {
      mounted = false;

      window.clearTimeout(
        clientTimer
      );

      cleanupTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [reduceMotion]);

  return (
    <PageEntranceContext.Provider
      value={{
        phase,
        reducedMotion: reduceMotion,
        isClient,
      }}
    >
      {children}
    </PageEntranceContext.Provider>
  );
}

/* =========================================================
   GATE
========================================================= */

export function PageEntranceGate({
  phase: targetPhase,
  children,
}: {
  phase: Phase;
  children: ReactNode;
}) {
  const {
    phase,
    reducedMotion,
    isClient,
  } = usePageEntrance();

  /*
   * During SSR/hydration show everything.
   * This avoids content flashing/disappearing.
   */
  if (!isClient) {
    return <>{children}</>;
  }

  /*
   * Reduced-motion users should never be
   * blocked by the cinematic sequencing.
   */
  if (reducedMotion) {
    return <>{children}</>;
  }

  /*
   * Once the page is complete, everything
   * remains available.
   */
  if (phase === "complete") {
    return <>{children}</>;
  }

  const targetIndex =
    PHASE_ORDER.indexOf(targetPhase);

  const currentIndex =
    PHASE_ORDER.indexOf(phase);

  /*
   * Unknown phase safety.
   */
  if (targetIndex === -1) {
    return <>{children}</>;
  }

  const isActive =
    currentIndex >= targetIndex;

  if (!isActive) {
    return null;
  }

  return <>{children}</>;
}