"use client";

/**
 * OrbitalCarousel3D — True 3D Orbital Carousel with 360° Circular Distribution.
 *
 * ═══════════════════════════════════════════════════════════════════
 *  REFINED SPATIAL ARCHITECTURE & VISUAL HIERARCHY:
 *
 *   • PRIMARY FOCUS:   SECRET CORE (z = 0, y = 0, fixed at center)
 *   • SECONDARY FOCUS: ACTIVE EVENT (z = +rz, y = +ry, below the core)
 *   • TERTIARY NAV:    ORBITING EVENTS (7–9 visible cards recycled on orbit)
 *   • ATMOSPHERIC:     CYBERNETIC RADIAL GLOW & SVG ORBITAL TRACKS
 *
 *  KEY PRINCIPLES:
 *   1. Exactly 7–9 cards rendered in the orbit at any time.
 *   2. Generous size, contrast, and opacity for visible flank cards.
 *   3. SecretCore is completely fixed and unobstructed at dead center.
 *   4. Active event card sits below the core with clean physical separation.
 *   5. Central HUD is integrated and sized to showcase the 3D core scene.
 *   6. Surrounding cards are legible with clear event names and stream tags.
 *   7. Full GSAP tweening, pointer dragging, wheel, and keyboard navigation.
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import type { FestEvent, StreamId } from "@/data/types";
import { cyberAudio } from "@/lib/cyberAudio";
import SecretCore3D from "./SecretCore3D";
import SecretCenterHUD from "./SecretCenterHUD";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Orbit configuration per breakpoint                                 */
/* ------------------------------------------------------------------ */
interface OrbitCfg {
  rx: number;     // Horizontal radius (px)
  ry: number;     // Vertical radius (px)
  rz: number;     // Depth radius (px)
  fov: number;    // CSS perspective focal length (px)
  anchor: number; // Center anchor % from container top
  cw: number;     // Secret core container width (px)
  ch: number;     // Secret core container height (px)
  cardW: number;  // Event card width (px)
  h: number;      // Carousel viewport height (px)
}

function buildCfg(ww: number): OrbitCfg {
  if (ww < 640) {
    // Mobile
    return {
      rx: 165,
      ry: 210,
      rz: 80,
      fov: 900,
      anchor: 36,
      cw: 180,
      ch: 180,
      cardW: 220,
      h: 680,
    };
  }
  if (ww < 1024) {
    // Tablet
    return {
      rx: 320,
      ry: 245,
      rz: 120,
      fov: 1200,
      anchor: 38,
      cw: 230,
      ch: 230,
      cardW: 245,
      h: 760,
    };
  }
  // Desktop
  return {
    rx: 460,
    ry: 290,
    rz: 160,
    fov: 1600,
    anchor: 39,
    cw: 270,
    ch: 270,
    cardW: 275,
    h: 840,
  };
}

const SLOT_COUNT = 8;
const STEP_ANGLE = (2 * Math.PI) / SLOT_COUNT; // 45° between slots

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */
interface OrbitalCarousel3DProps {
  events: FestEvent[];
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  onOpenEventDossier: (e: FestEvent) => void;
  onOpenClassifiedModal: () => void;
  accentOf: (s: StreamId) => string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
export default function OrbitalCarousel3D({
  events,
  activeIndex,
  onActiveIndexChange,
  onOpenEventDossier,
  onOpenClassifiedModal,
  accentOf,
}: OrbitalCarousel3DProps) {

  /* ── Responsive sizing ── */
  const [ww, setWw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const fn = () => setWw(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const oc = useMemo(() => buildCfg(ww), [ww]);
  const total = events.length;

  /* ── Global orbit rotation angle (in radians) ── */
  const rotRef = useRef(0);
  const [rot, setRot] = useState(0);

  /* ── GSAP tween handles ── */
  const snapTw = useRef<gsap.core.Tween | null>(null);
  const inertTw = useRef<gsap.core.Tween | null>(null);

  /* ── Drag state ── */
  const dragging = useRef(false);
  const userDrag = useRef(false);
  const hasMoved = useRef(false);
  const dragStartX = useRef(0);
  const dragBaseRot = useRef(0);
  const dragVel = useRef(0);
  const prevDragX = useRef(0);
  const prevDragMs = useRef(0);

  const killTweens = useCallback(() => {
    snapTw.current?.kill();
    snapTw.current = null;
    inertTw.current?.kill();
    inertTw.current = null;
  }, []);

  /* ── Smooth GSAP animation to target event index ── */
  const animTo = useCallback(
    (index: number, fast = false) => {
      if (total === 0) return;
      killTweens();

      // Current virtual step from rotRef
      const curStep = Math.round(-rotRef.current / STEP_ANGLE);
      const curIdx = ((curStep % total) + total) % total;

      // Shortest circular delta in the events playlist
      let diff = index - curIdx;
      while (diff > total / 2) diff -= total;
      while (diff < -total / 2) diff += total;

      const targetStep = curStep + diff;
      const endRot = -targetStep * STEP_ANGLE;

      const o = { v: rotRef.current };
      snapTw.current = gsap.to(o, {
        v: endRot,
        duration: fast ? 0.35 : 0.72,
        ease: fast ? "power2.out" : "power3.out",
        onUpdate() {
          rotRef.current = o.v;
          setRot(o.v);
        },
        onComplete() {
          rotRef.current = endRot;
          setRot(endRot);
        },
      });
    },
    [total, killTweens]
  );

  /* ── Snap to nearest slot and trigger active index update ── */
  const snapNearest = useCallback(() => {
    if (total === 0) return;
    killTweens();

    const vIndex = -rotRef.current / STEP_ANGLE;
    const nearestStep = Math.round(vIndex);
    const targetIdx = ((nearestStep % total) + total) % total;
    onActiveIndexChange(targetIdx);

    const targetRot = -nearestStep * STEP_ANGLE;
    const o = { v: rotRef.current };
    snapTw.current = gsap.to(o, {
      v: targetRot,
      duration: 0.32,
      ease: "power2.out",
      onUpdate() {
        rotRef.current = o.v;
        setRot(o.v);
      },
      onComplete() {
        rotRef.current = targetRot;
        setRot(targetRot);
      },
    });
  }, [total, onActiveIndexChange, killTweens]);

  /* Sync external activeIndex changes */
  useEffect(() => {
    if (!userDrag.current) {
      animTo(activeIndex);
    }
  }, [activeIndex, animTo]);

  /* Reset rotation cleanly if events array identity changes (e.g. category filter) */
  const prevEventsRef = useRef(events);
  useEffect(() => {
    if (prevEventsRef.current !== events) {
      prevEventsRef.current = events;
      killTweens();
      rotRef.current = 0;
      setRot(0);
    }
  }, [events, killTweens]);

  /* ── Pointer Drag / Swipe Handlers ── */
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    // Don't hijack clicks on buttons (e.g. chevrons, modals, HUD)
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    killTweens();
    dragging.current = true;
    userDrag.current = true;
    hasMoved.current = false;
    dragStartX.current = e.clientX;
    dragBaseRot.current = rotRef.current;
    dragVel.current = 0;
    prevDragX.current = e.clientX;
    prevDragMs.current = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 5) {
      hasMoved.current = true;
    }
    const sens = ww < 640 ? 0.0065 : 0.0038;
    const nr = dragBaseRot.current + dx * sens;
    const now = performance.now();
    const dt = Math.max(1, now - prevDragMs.current);
    dragVel.current = ((e.clientX - prevDragX.current) / dt) * sens;
    prevDragX.current = e.clientX;
    prevDragMs.current = now;
    rotRef.current = nr;
    setRot(nr);
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ok */
    }

    const vel = dragVel.current;
    if (Math.abs(vel) > 0.0005) {
      const o = { v: rotRef.current };
      inertTw.current = gsap.to(o, {
        v: rotRef.current + vel * 140,
        duration: 0.5,
        ease: "power2.out",
        onUpdate() {
          rotRef.current = o.v;
          setRot(o.v);
        },
        onComplete() {
          userDrag.current = false;
          snapNearest();
        },
      });
    } else {
      userDrag.current = false;
      snapNearest();
    }
    cyberAudio.playHover();
  };

  /* ── Mouse Wheel Orbit Rotation ── */
  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (Math.abs(e.deltaY) < 15) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = ((activeIndex + dir) % total + total) % total;
      onActiveIndexChange(next);
      cyberAudio.playHover();
    },
    [activeIndex, total, onActiveIndexChange]
  );

  /* ── Keyboard Arrow Navigation ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowLeft") {
        cyberAudio.playClick();
        onActiveIndexChange(((activeIndex - 1) % total + total) % total);
      } else if (e.key === "ArrowRight") {
        cyberAudio.playClick();
        onActiveIndexChange((activeIndex + 1) % total);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, total, onActiveIndexChange]);

  /* ── Build 7–9 Recycled Orbiting Cards ── */
  const cards = useMemo(() => {
    if (total === 0) return [];

    const vIndex = -rot / STEP_ANGLE;
    const centerIdx = Math.round(vIndex);
    const frac = vIndex - centerIdx; // in range [-0.5, 0.5]

    // Maximum slot offset to guarantee 7–9 visible cards
    const maxK = Math.min(4, Math.floor((total - 1) / 2));
    const list: Array<{
      event: FestEvent;
      eventIdx: number;
      k: number;
      theta: number;
      x: number;
      y: number;
      z: number;
      rotY: number;
      depth: number;
      scale: number;
      opacity: number;
      brightness: number;
      cardWidth: number;
      zIndex: number;
      isFront: boolean;
    }> = [];

    for (let k = -maxK; k <= maxK; k++) {
      const rawIdx = centerIdx + k;
      const eventIdx = ((rawIdx % total) + total) % total;
      const event = events[eventIdx];
      if (!event) continue;

      // Angular position of this slot along the 3D orbit
      const theta = (k - frac) * STEP_ANGLE;
      const absTheta = Math.abs(theta);

      /*
       * 3-D Orbital Ellipse Mathematics:
       *   x = sin(θ) * rx   → horizontal span (left ↔ right)
       *   z = cos(θ) * rz   → depth (+z = front/closer, -z = back/further)
       *   y = cos(θ) * ry   → vertical arc:
       *         θ ≈ 0   (front card): y = +ry → positioned BELOW the core
       *         θ ≈ π   (back card):  y = -ry → positioned ABOVE the core
       *         θ ≈ ±π/2 (sides):     y = 0   → positioned AT core equator
       */
      const x = Math.sin(theta) * oc.rx;
      const z = Math.cos(theta) * oc.rz;
      const y = Math.cos(theta) * oc.ry;

      // Card faces inward toward the viewer / orbit curvature
      const rotY = -Math.sin(theta) * 14;

      // Normalized depth 0 (far back) -> 1 (foreground)
      const depth = (z + oc.rz) / (2 * oc.rz);

      // Active front card detection
      const isFront = k === 0 && Math.abs(frac) < 0.38;
      const absK = Math.abs(k);

      // Visual scaling & opacity
      let scale = 0.70 + depth * 0.24;
      let opacity = 0.48 + depth * 0.48;
      let brightness = 0.75 + depth * 0.35;
      let zIndex = Math.round(25 + depth * 60);

      // Smooth fade-out at the far back apex (recycling transition zone)
      if (absTheta > 2.45) {
        const backFactor = Math.max(0, (Math.PI - absTheta) / (Math.PI - 2.45));
        opacity *= backFactor;
      }

      // Card width per tier
      let cardWidth = oc.cardW;
      if (absK === 1) cardWidth = Math.round(oc.cardW * 0.90);
      else if (absK === 2) cardWidth = Math.round(oc.cardW * 0.84);
      else if (absK === 3) cardWidth = Math.round(oc.cardW * 0.78);
      else if (absK >= 4) cardWidth = Math.round(oc.cardW * 0.72);

      if (isFront) {
        scale = 1.0;
        opacity = 1.0;
        brightness = 1.15;
        zIndex = 95;
      }

      list.push({
        event,
        eventIdx,
        k,
        theta,
        x,
        y,
        z,
        rotY,
        depth,
        scale,
        opacity,
        brightness,
        cardWidth,
        zIndex,
        isFront,
      });
    }

    return list.sort((a, b) => a.z - b.z); // Paint back to front
  }, [total, events, rot, oc]);

  const focusCard = (idx: number) => {
    cyberAudio.playClick();
    onActiveIndexChange(idx);
  };

  const anchorPct = `${oc.anchor}%`;

  return (
    <div
      className="relative w-full select-none touch-pan-y overflow-hidden"
      style={{ height: `${oc.h}px` }}
      onWheel={onWheel}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {/* Central atmospheric glow (anchored at core position) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 65% 45% at 50% ${anchorPct}, rgba(12,60,40,0.32) 0%, rgba(4,20,14,0.12) 50%, transparent 75%)`,
        }}
      />

      {/* ════════════════════════════════════════════════════════════
          3-D PERSPECTIVE CONTAINER
          perspectiveOrigin matches the orbit anchor point so all 3D
          depth lines radiate directly from the Secret Core.
         ════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          perspective: `${oc.fov}px`,
          perspectiveOrigin: `50% ${anchorPct}`,
        }}
      >
        {/* ── BACKGROUND ORBITAL GUIDE RAIL (zIndex: 20 — behind core) ── */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 20 }}
        >
          <defs>
            <radialGradient id="orbitGlow" cx="50%" cy={anchorPct} r="60%">
              <stop offset="0%" stopColor="rgba(24,196,124,0.16)" />
              <stop offset="60%" stopColor="rgba(24,196,124,0.03)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="orbitRailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(24,196,124,0.12)" />
              <stop offset="30%" stopColor="rgba(0,229,255,0.25)" />
              <stop offset="50%" stopColor="rgba(24,196,124,0.40)" />
              <stop offset="70%" stopColor="rgba(0,229,255,0.25)" />
              <stop offset="100%" stopColor="rgba(24,196,124,0.12)" />
            </linearGradient>
          </defs>

          {/* Outer subtle guide ellipse */}
          <ellipse
            cx="50%"
            cy={anchorPct}
            rx={oc.rx + 30}
            ry={oc.ry + 20}
            fill="none"
            stroke="rgba(24,196,124,0.12)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />

          {/* Main orbital track ellipse */}
          <ellipse
            cx="50%"
            cy={anchorPct}
            rx={oc.rx}
            ry={oc.ry}
            fill="url(#orbitGlow)"
            stroke="url(#orbitRailGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* Inner orbital guide ellipse */}
          <ellipse
            cx="50%"
            cy={anchorPct}
            rx={oc.rx * 0.72}
            ry={oc.ry * 0.72}
            fill="none"
            stroke="rgba(0,229,255,0.10)"
            strokeWidth="1"
          />
        </svg>

        {/* ════════════════════════════════════════════════════════════
            SECRET CORE — THE FIXED PRIMARY FOCUS (zIndex: 50)
            Positioned exactly at (50%, anchor%) with no Z translation.
            Unobstructed by surrounding cards.
           ════════════════════════════════════════════════════════════ */}
        <div
          className="pointer-events-auto absolute"
          style={{
            width: `${oc.cw}px`,
            height: `${oc.ch}px`,
            left: "50%",
            top: anchorPct,
            transform: "translate(-50%, -50%)",
            zIndex: 50,
            filter:
              "drop-shadow(0 0 36px rgba(24,196,124,0.45)) drop-shadow(0 0 80px rgba(24,196,124,0.16))",
          }}
        >
          {/* Three.js WebGL Holographic Artifact Scene */}
          <div className="absolute inset-0">
            <SecretCore3D className="h-full w-full" />
          </div>

          {/* Holographic Classified Transmission HUD */}
          <div className="absolute inset-0 flex items-center justify-center p-2.5">
            <SecretCenterHUD onOpenModal={onOpenClassifiedModal} />
          </div>
        </div>

        {/* ── FOREGROUND RAIL ACCENT (zIndex: 55 — in front of core, behind active card) ── */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 55 }}
        >
          <ellipse
            cx="50%"
            cy={anchorPct}
            rx={oc.rx}
            ry={oc.ry}
            fill="none"
            stroke="rgba(24,196,124,0.32)"
            strokeWidth="2"
            strokeDasharray={`${oc.rx * 0.8} ${oc.rx * 2}`}
            strokeDashoffset={oc.rx * 0.4}
          />
        </svg>

        {/* ════════════════════════════════════════════════════════════
            ORBITING EVENT CARDS (7–9 RECYCLED POSITIONS)
           ════════════════════════════════════════════════════════════ */}
        {cards.map(
          ({
            event,
            eventIdx,
            k,
            x,
            y,
            z,
            rotY,
            scale,
            opacity,
            brightness,
            cardWidth,
            zIndex,
            isFront,
          }) => {
            const accent = accentOf(event.stream);
            const absK = Math.abs(k);

            return (
              <div
                key={`card-${event.id}`}
                className="absolute cursor-pointer"
                style={{
                  width: `${cardWidth}px`,
                  left: "50%",
                  top: anchorPct,
                  transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${rotY}deg) scale(${scale})`,
                  opacity,
                  filter: `brightness(${brightness})${absK >= 3 ? " blur(0.8px)" : ""}`,
                  zIndex,
                  transition: dragging.current
                    ? "none"
                    : "transform 0.14s linear, opacity 0.14s linear",
                  willChange: "transform, opacity",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasMoved.current) return;
                  if (isFront) {
                    onOpenEventDossier(event);
                  } else {
                    focusCard(eventIdx);
                  }
                }}
              >
                {/* ── CARD BODY ── */}
                <div
                  className={`group relative w-full rounded-xl border backdrop-blur-md transition-all duration-200 ${
                    isFront
                      ? "p-3.5 sm:p-4 border-emerald-400 bg-[#040c08]/96 shadow-[0_0_48px_rgba(24,196,124,0.48),0_0_90px_rgba(24,196,124,0.14)]"
                      : absK === 1
                      ? "p-2.5 sm:p-3 border-[rgba(24,196,124,0.30)] bg-[#030906]/92 shadow-[0_0_24px_rgba(24,196,124,0.18)] hover:border-emerald-400 hover:shadow-[0_0_32px_rgba(24,196,124,0.35)]"
                      : absK === 2
                      ? "p-2.5 sm:p-3 border-[rgba(100,160,135,0.24)] bg-[#020705]/88 shadow-[0_0_18px_rgba(24,196,124,0.10)] hover:border-emerald-400/60 hover:shadow-[0_0_24px_rgba(24,196,124,0.25)]"
                      : "p-2 sm:p-2.5 border-[rgba(100,160,135,0.16)] bg-[#020504]/80 hover:border-emerald-400/40"
                  }`}
                >
                  {/* Active Indicator Pill */}
                  {isFront && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-emerald-400 bg-emerald-950 px-3 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-emerald-300 shadow-[0_0_14px_rgba(24,196,124,0.6)]">
                      ● ACTIVE SELECTION
                    </div>
                  )}

                  {/* Card Header: Event Number & Stream Badge */}
                  <div className="flex items-center justify-between border-b border-[rgba(100,148,128,0.18)] pb-1">
                    <span className="font-mono text-[8px] sm:text-[8.5px] tracking-[0.20em] text-[#52846c]">
                      EVT {String(eventIdx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-mono text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: accent }}
                    >
                      {event.stream}
                    </span>
                  </div>

                  {/* Event Name */}
                  <div className="mt-1.5">
                    <h4
                      className={`t-cond leading-tight text-[#f0fbf6] transition-colors group-hover:text-emerald-300 ${
                        isFront
                          ? "text-[16px] sm:text-[18px]"
                          : absK === 1
                          ? "text-[13.5px] sm:text-[15px] font-semibold line-clamp-1"
                          : absK === 2
                          ? "text-[12.5px] sm:text-[14px] font-medium line-clamp-1"
                          : "text-[11.5px] sm:text-[12.5px] line-clamp-1 text-[#9fc7b5]"
                      }`}
                    >
                      {event.name}
                    </h4>

                    {/* Blurb on front card only */}
                    {isFront && (
                      <p className="mt-1 line-clamp-1 sm:line-clamp-2 font-mono text-[9px] leading-relaxed text-[#7c9e8e]">
                        {event.blurb}
                      </p>
                    )}
                  </div>

                  {/* Meta details */}
                  {isFront ? (
                    <div className="mt-2 space-y-0.5 border-t border-[rgba(100,148,128,0.12)] pt-1.5 font-mono text-[8.5px] text-[#8ca89c]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 truncate">
                          <Calendar className="h-2.5 w-2.5 shrink-0 text-emerald-400" />
                          <span className="truncate">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 truncate">
                          <Clock className="h-2.5 w-2.5 shrink-0 text-emerald-400" />
                          <span className="truncate">{event.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-400" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center justify-between text-[7.5px] sm:text-[8px] font-mono text-[#628f7a] border-t border-[rgba(100,148,128,0.10)] pt-1">
                      <span className="truncate">{event.date}</span>
                      <span className="truncate text-[#426a57]">
                        {event.venue.split(",")[0]}
                      </span>
                    </div>
                  )}

                  {/* CTA Action */}
                  {isFront ? (
                    <div className="mt-2 flex items-center justify-between border-t border-emerald-500/25 pt-1.5 font-mono text-[8.5px] tracking-[0.18em] text-emerald-400">
                      <span className="font-bold">VIEW EVENT DOSSIER</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  ) : (
                    <div className="mt-1 text-center font-mono text-[7px] tracking-[0.20em] text-[#3e6654] group-hover:text-emerald-300 transition-colors">
                      [ CLICK TO FOCUS ]
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
      {/* End Perspective Container */}

      {/* ── PREV / NEXT FLOATING NAV BUTTONS ── */}
      <div
        className="pointer-events-none absolute inset-x-3 sm:inset-x-6 z-[100] flex justify-between"
        style={{ top: anchorPct, transform: "translateY(-50%)" }}
      >
        <button
          type="button"
          aria-label="Previous event"
          onClick={() => {
            cyberAudio.playClick();
            onActiveIndexChange(((activeIndex - 1) + total) % total);
          }}
          className="pointer-events-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-[#020704]/90 text-[#8ca89c] shadow-[0_0_18px_rgba(24,196,124,0.16)] backdrop-blur-md transition-all hover:border-emerald-300/70 hover:bg-emerald-950 hover:text-emerald-300 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          type="button"
          aria-label="Next event"
          onClick={() => {
            cyberAudio.playClick();
            onActiveIndexChange((activeIndex + 1) % total);
          }}
          className="pointer-events-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-[#020704]/90 text-[#8ca89c] shadow-[0_0_18px_rgba(24,196,124,0.16)] backdrop-blur-md transition-all hover:border-emerald-300/70 hover:bg-emerald-950 hover:text-emerald-300 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* ── Orbit Drag Hint Strip ── */}
      <div className="pointer-events-none absolute bottom-2 inset-x-0 flex justify-center z-[100]">
        <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.28em] text-[#335647]">
          ◈ &nbsp; DRAG · SCROLL · ARROWS TO ROTATE ORBIT &nbsp; ◈
        </span>
      </div>
    </div>
  );
}
