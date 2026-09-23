"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cyberMusic } from "@/lib/cyberAudio";

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

export type ScrollSpeed = "idle" | "slow" | "fast";

interface PageEntranceContextValue {
  phase: Phase;
  reducedMotion: boolean;
  isClient: boolean;
  scrollSpeed: ScrollSpeed;
  isSpeedSliding: boolean;
  velocity: number;
}

/* =========================================================
   CONTEXT
========================================================= */

const PageEntranceContext = createContext<PageEntranceContextValue>({
  phase: "complete",
  reducedMotion: false,
  isClient: false,
  scrollSpeed: "idle",
  isSpeedSliding: false,
  velocity: 0,
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

const PHASE_DELAY = 420;
const SPEED_SLIDE_THRESHOLD = 0.65; // px/ms threshold for fast sliding (650px/sec)

/* =========================================================
   PROVIDER
========================================================= */

export function PageEntranceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const reduceMotion = usePrefersReducedMotion();

  const [phase, setPhase] = useState<Phase>("complete");
  const [isClient, setIsClient] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<ScrollSpeed>("idle");
  const [isSpeedSliding, setIsSpeedSliding] = useState(false);
  const [velocity, setVelocity] = useState(0);

  const startedRef = useRef(false);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const whooshCooldownRef = useRef(0);

  /* ─── Client Mount & SSR Safety ─── */
  useEffect(() => {
    setIsClient(true);
    lastScrollY.current = window.scrollY;
    lastScrollTime.current = performance.now();

    // If user already scrolled down (e.g. reload or anchor link), instantly unlock
    if (window.scrollY > 80 || reduceMotion) {
      setPhase("complete");
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    setPhase("idle");

    let currentIndex = 0;
    const advance = () => {
      if (currentIndex >= PHASE_ORDER.length) {
        setPhase("complete");
        return;
      }
      setPhase(PHASE_ORDER[currentIndex]);
      currentIndex += 1;
      phaseTimerRef.current = setTimeout(advance, PHASE_DELAY);
    };

    phaseTimerRef.current = setTimeout(advance, 200);

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [reduceMotion]);

  /* ─── Real-Time Scroll Velocity & Speed Sliding Engine ─── */
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const deltaY = Math.abs(currentY - lastScrollY.current);
      const deltaTime = Math.max(1, now - lastScrollTime.current);
      const currentVelocity = deltaY / deltaTime; // px/ms

      lastScrollY.current = currentY;
      lastScrollTime.current = now;

      setVelocity(currentVelocity);

      // Fast sliding detected
      if (currentVelocity > SPEED_SLIDE_THRESHOLD) {
        setIsSpeedSliding(true);
        setScrollSpeed("fast");
        // Play Doppler speed whoosh (rate-limited)
        if (now - whooshCooldownRef.current > 1100) {
          whooshCooldownRef.current = now;
          cyberMusic.playSpeedSlideWhoosh();
        }
        // Immediately complete entrance sequence so no sections are delayed
        setPhase("complete");
        if (typeof document !== "undefined") {
          document.documentElement.dataset.speedSliding = "true";
        }
      } else if (currentVelocity > 0.05) {
        // Slow/normal sliding
        setIsSpeedSliding(false);
        setScrollSpeed("slow");
        if (typeof document !== "undefined") {
          document.documentElement.dataset.speedSliding = "false";
        }
        // If user scrolls even slowly, unlock full page so content is never blocked
        if (currentY > 150) {
          setPhase("complete");
        }
      }

      // Reset to idle once scrolling ceases
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsSpeedSliding(false);
        setScrollSpeed("idle");
        setVelocity(0);
        if (typeof document !== "undefined") {
          delete document.documentElement.dataset.speedSliding;
        }
      }, 200);
    };

    // Wheel listener for instant speed sliding trigger on rapid flick
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 85) {
        setIsSpeedSliding(true);
        setScrollSpeed("fast");
        setPhase("complete");
        if (typeof document !== "undefined") {
          document.documentElement.dataset.speedSliding = "true";
        }
      }
    };

    // Touch listener for instant inertia swipe detection
    let touchStartY = 0;
    let touchStartTime = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const now = performance.now();
      const delta = Math.abs(currentY - touchStartY);
      const dt = Math.max(1, now - touchStartTime);
      const touchVel = delta / dt;

      if (touchVel > 0.8) {
        setIsSpeedSliding(true);
        setScrollSpeed("fast");
        setPhase("complete");
        if (typeof document !== "undefined") {
          document.documentElement.dataset.speedSliding = "true";
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isClient]);

  return (
    <PageEntranceContext.Provider
      value={{
        phase,
        reducedMotion: reduceMotion,
        isClient,
        scrollSpeed,
        isSpeedSliding,
        velocity,
      }}
    >
      {children}

      {/* =========================================================
          SPEED SLIDING KINETIC HUD TELEMETRY BADGE
          Shown exclusively when user scrolls at high speed
      ========================================================= */}
      <AnimatePresence>
        {isSpeedSliding && (
          <motion.aside
            initial={{ opacity: 0, y: -12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.94 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none fixed right-6 top-20 z-50 hidden md:flex items-center gap-2.5 rounded-sm border border-emerald-400/40 bg-[#050a08]/95 px-3 py-1.5 shadow-[0_0_30px_rgba(46,229,157,.25)] backdrop-blur-md"
            aria-live="polite"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-emerald-300">
              WARP SLIDE // {Math.round(velocity * 1000)} PX/S
            </span>

            <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 font-mono text-[8px] font-bold text-cyan-300">
              FAST REVEAL
            </span>
          </motion.aside>
        )}
      </AnimatePresence>
    </PageEntranceContext.Provider>
  );
}

/* =========================================================
   GATE (Velocity-Adaptive Section Entrance)
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
    isSpeedSliding,
    scrollSpeed,
  } = usePageEntrance();

  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const targetIndex = PHASE_ORDER.indexOf(targetPhase);
  const currentIndex = PHASE_ORDER.indexOf(phase);
  const isPhaseActive =
    phase === "complete" ||
    (targetIndex !== -1 && currentIndex >= targetIndex);

  /* ─── Viewport Intersection Observer ─── */
  useEffect(() => {
    if (!containerRef.current || revealed) return;

    // Check if element is already within viewport on mount
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.top < window.innerHeight + 300) {
      setInView(true);
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px", threshold: 0 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [revealed]);

  // Activate when timed phase sequence reaches this section
  useEffect(() => {
    if (isPhaseActive && !revealed) {
      setRevealed(true);
      cyberMusic.playSectionHarmonic(targetPhase);
    }
  }, [isPhaseActive, revealed, targetPhase]);

  /* ─── Accessibility & SSR Fallback ─── */
  if (!isClient || reducedMotion) {
    return <div className="page-entrance-gate w-full">{children}</div>;
  }

  const isHero = targetPhase === "hero";
  const isVisible = isHero || isPhaseActive || inView || revealed;

  /* ─── Velocity-Adaptive Transition Dynamics ───
     • Fast / Speed Sliding: snappy 0.16s easeOut reveal (no blur, no lag)
     • Slow Sliding / Cinematic: deliberate 0.85s smooth cubic-bezier curve
  ─── */
  const transitionConfig: Transition = isSpeedSliding
    ? { duration: 0.16, ease: [0, 0, 0.2, 1] }
    : { duration: 0.85, ease: [0.16, 1, 0.3, 1] };

  return (
    <motion.div
      ref={containerRef}
      initial={
        isHero
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: isSpeedSliding ? 0 : 22 }
      }
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : isSpeedSliding ? 0 : 22,
      }}
      transition={transitionConfig}
      className="page-entrance-gate w-full will-change-transform"
    >
      {children}
    </motion.div>
  );
}