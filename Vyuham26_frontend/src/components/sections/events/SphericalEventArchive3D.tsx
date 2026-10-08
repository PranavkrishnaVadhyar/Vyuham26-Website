"use client";

/**
 * SphericalEventArchive3D — 3D Spherical Event Poster Archive with Fibonacci Distribution.
 *
 * ═══════════════════════════════════════════════════════════════════
 *  VYUHAM'26 EVENT UNIVERSE ARCHITECTURE:
 *
 *   • CORE:          OFFICIAL VYUHAM'26 LOGO (permanently at x=0, y=0, z=0)
 *                    Floating directly inside a holographic energy core.
 *                    Transparent background, no rectangular box, unobstructed.
 *   • EVENT SPHERE:  Fibonacci sphere distribution wrapping around the core.
 *                    All event cards are uniform 2:3 portrait posters.
 *                    No artificial special selection or enlargement of any card.
 *                    Clicking ANY card opens its Event Dossier immediately.
 *   • ALWAYS-ON AUTO ROTATION:
 *                    Continuous cinematic rotation of event cards at ~4.0°/s.
 *                    Pauses during active mouse movement, direct card hover, or drag.
 *                    Resumes after 2.5s delay from the exact current angle.
 *   • CLEAN HUD:     No floating arrow buttons. Interaction via 360° drag or auto-orbit.
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import type { FestEvent, StreamId } from "@/data/types";
import { cyberAudio } from "@/lib/cyberAudio";
import VyuhamLogoCore3D from "./VyuhamLogoCore3D";
import EventPosterCard from "./EventPosterCard";

/* ------------------------------------------------------------------ */
/*  Responsive Sphere Configuration (2:3 Poster Aspect Ratio)          */
/* ------------------------------------------------------------------ */
interface SphereCfg {
  radius: number;          // Sphere radius in px (Desktop: 360–430, Tablet: 280–350, Mobile: 190–250)
  cardW: number;           // Uniform poster width in px
  cardH: number;           // Uniform poster height in px (2:3 portrait)
  coreSize: number;        // Holographic core diameter in px (Desktop: 220–320, Mobile: 150–220)
  exclusionRadius: number; // Protected central exclusion radius in px (Desktop: 190–230, Mobile: 100–140)
  stageH: number;          // Stage viewport height in px (Desktop: ~650–740, Mobile: 500–600)
  fov: number;             // CSS perspective in px
  isMobile: boolean;       // Phone viewport (< 768px)
  isTablet: boolean;       // Tablet viewport (768–1023px)
}

function buildCfg(ww: number): SphereCfg {
  if (ww < 400) {
    // Narrow Mobile (iPhone SE, Galaxy A-series, 360-375px)
    return {
      radius: 205,
      cardW: 75,
      cardH: 112,
      coreSize: 165,
      exclusionRadius: 115,
      stageH: 520,
      fov: 1000,
      isMobile: true,
      isTablet: false,
    };
  }
  if (ww < 640) {
    // Standard Mobile (iPhone 12/13/14/15/Pro, Galaxy S21/22/23, Pixel, 390-430px)
    return {
      radius: 215,
      cardW: 80,
      cardH: 120,
      coreSize: 170,
      exclusionRadius: 120,
      stageH: 540,
      fov: 1050,
      isMobile: true,
      isTablet: false,
    };
  }
  if (ww < 768) {
    // Large Phone / Phablet (640-767px)
    return {
      radius: 235,
      cardW: 88,
      cardH: 132,
      coreSize: 185,
      exclusionRadius: 130,
      stageH: 560,
      fov: 1150,
      isMobile: true,
      isTablet: false,
    };
  }
  if (ww < 1024) {
    // Tablet (768-1023px)
    return {
      radius: 310,
      cardW: 120,
      cardH: 180,
      coreSize: 210,
      exclusionRadius: 165,
      stageH: 620,
      fov: 1350,
      isMobile: false,
      isTablet: true,
    };
  }
  // Desktop (>= 1024px)
  return {
    radius: 380,
    cardW: 160,
    cardH: 240,
    coreSize: 260,
    exclusionRadius: 205,
    stageH: 740,
    fov: 1600,
    isMobile: false,
    isTablet: false,
  };
}

/* ------------------------------------------------------------------ */
/*  Fibonacci Sphere Item Type                                         */
/* ------------------------------------------------------------------ */
interface SphereNode {
  id: string;
  isClassified: boolean;
  event?: FestEvent;
  publicIdx?: number;
  x: number;
  y: number;
  z: number;
}

/* ------------------------------------------------------------------ */
/*  Component Props                                                     */
/* ------------------------------------------------------------------ */
interface SphericalEventArchive3DProps {
  events: FestEvent[];
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  onOpenEventDossier: (e: FestEvent) => void;
  onOpenClassifiedModal: () => void;
  accentOf: (s: StreamId) => string;
  isModalOpen?: boolean;
}

export default function SphericalEventArchive3D({
  events,
  activeIndex,
  onActiveIndexChange,
  onOpenEventDossier,
  onOpenClassifiedModal,
  accentOf,
  isModalOpen = false,
}: SphericalEventArchive3DProps) {
  /* ── Responsive sizing ── */
  const [ww, setWw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const fn = () => setWw(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const cfg = useMemo(() => buildCfg(ww), [ww]);
  const totalPublic = events.length;

  /* ── 3D Sphere Rotation State (degrees) ── */
  const yawRef = useRef(0);
  const pitchRef = useRef(0);

  /* ── GSAP Tween Reference ── */
  const rotTw = useRef<gsap.core.Tween | null>(null);

  /* ── Auto Rotation & Interaction State ── */
  const isInteracting = useRef(false);
  const isCardHovered = useRef(false);
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);

  /* ── Gesture Tracking ── */
  const touchIntent = useRef<"undecided" | "horizontal" | "vertical">("undecided");
  const dragStartPoint = useRef({ x: 0, y: 0 });
  const lastPoint = useRef({ x: 0, y: 0, time: 0 });
  const velX = useRef(0);
  const velY = useRef(0);
  const capturedPointerId = useRef<number | null>(null);

  /* ── DOM Node Elements Ref Map (Direct DOM updates for 60fps) ── */
  const cardEls = useRef<Map<string, HTMLDivElement>>(new Map());

  /* ── Classified hover state ── */
  const [classifiedHovered, setClassifiedHovered] = useState(false);

  /* ── Symmetrical Fibonacci 3D Spherical Distribution Around Core ── */
  const nodes: SphereNode[] = useMemo(() => {
    if (totalPublic === 0) return [];

    const totalNodes = totalPublic + 1; // e.g. 35 public + 1 classified = 36 nodes
    const classifiedSlot = 14; // Neutral flank slot

    const list: SphereNode[] = [];
    let publicCounter = 0;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < totalNodes; i++) {
      // Symmetrical Y distribution centered around 0 (y in [-0.85, +0.85])
      const y = (1 - (i / Math.max(1, totalNodes - 1)) * 2) * 0.85;
      const radius = Math.sqrt(Math.max(0.04, 1 - y * y));
      const theta = i * phi;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      if (i === classifiedSlot) {
        list.push({
          id: "secret-aftershock-card",
          isClassified: true,
          x,
          y,
          z,
        });
      } else {
        const ev = events[publicCounter];
        if (ev) {
          list.push({
            id: ev.id,
            isClassified: false,
            event: ev,
            publicIdx: publicCounter,
            x,
            y,
            z,
          });
        }
        publicCounter++;
      }
    }

    return list;
  }, [totalPublic, events]);

  /* ── Helper to Schedule Auto-Rotation Resume after Delay (2.5s) ── */
  const scheduleResume = useCallback((delayMs = 2500) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, delayMs);
  }, []);

  /* ── Apply Real-Time 3D Camera Projection & Depth Styling to All Cards ── */
  const applyTransforms = useCallback(
    (currentYawDeg: number, currentPitchDeg: number) => {
      if (nodes.length === 0) return;

      const radYaw = (currentYawDeg * Math.PI) / 180;
      const radPitch = (currentPitchDeg * Math.PI) / 180;

      let bestFrontZ = -999;
      let frontNode: SphereNode | null = null;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // 1. Rotate around Y axis (Yaw)
        const x1 = n.x * Math.cos(radYaw) + n.z * Math.sin(radYaw);
        const y1 = n.y;
        const z1 = -n.x * Math.sin(radYaw) + n.z * Math.cos(radYaw);

        // 2. Rotate around X axis (Pitch)
        const x2 = x1;
        const y2 = y1 * Math.cos(radPitch) - z1 * Math.sin(radPitch);
        const z2 = y1 * Math.sin(radPitch) + z1 * Math.cos(radPitch);

        // Track closest camera candidate for live event counter
        if (!n.isClassified && z2 > bestFrontZ) {
          bestFrontZ = z2;
          frontNode = n;
        }

        // 3. Screen coordinates (World Origin at Center: 0, 0)
        let posX = x2 * cfg.radius;
        let posY = -y2 * cfg.radius;
        const posZ = z2 * cfg.radius;

        // 4. Central Core Exclusion Zone: push outward so logo is never obstructed
        const dist2D = Math.hypot(posX, posY);
        if (dist2D < cfg.exclusionRadius) {
          const push = cfg.exclusionRadius / Math.max(1, dist2D);
          posX *= push;
          posY *= push;
        }

        // 5. Depth Hierarchy Calculation (Natural 3D depth for all cards)
        let scale: number;
        let opacity: number;
        let blurPx: number;
        let brightness: number;
        let isBack = false;

        if (cfg.isMobile) {
          // Mobile Depth Bands
          if (z2 >= 0.65) {
            const frac = (z2 - 0.65) / 0.35;
            scale = 0.92 + frac * 0.10;
            opacity = 0.90 + frac * 0.10;
            blurPx = 0;
            brightness = 1.05 + frac * 0.10;
          } else if (z2 >= 0.25) {
            const frac = (z2 - 0.25) / 0.40;
            scale = 0.70 + frac * 0.16;
            opacity = 0.60 + frac * 0.20;
            blurPx = 0;
            brightness = 0.85 + frac * 0.15;
          } else if (z2 >= -0.20) {
            const frac = (z2 - (-0.20)) / 0.45;
            scale = 0.45 + frac * 0.18;
            opacity = 0.18 + frac * 0.18;
            blurPx = 1;
            brightness = 0.50;
            isBack = true;
          } else {
            const frac = Math.max(0, (z2 - (-1)) / 0.80);
            scale = 0.30 + frac * 0.14;
            opacity = 0.03 + frac * 0.05;
            blurPx = 2;
            brightness = 0.30;
            isBack = true;
          }
        } else {
          // Desktop / Tablet Depth Bands
          if (z2 >= 0.55) {
            const frac = (z2 - 0.55) / 0.45;
            scale = 0.95 + frac * 0.10;
            opacity = 0.90 + frac * 0.10;
            blurPx = 0;
            brightness = 1.05 + frac * 0.12;
          } else if (z2 >= 0.12) {
            const frac = (z2 - 0.12) / 0.43;
            scale = 0.75 + frac * 0.15;
            opacity = 0.65 + frac * 0.20;
            blurPx = (1 - frac) * 0.4;
            brightness = 0.85 + frac * 0.15;
          } else if (z2 >= -0.35) {
            const frac = (z2 - (-0.35)) / 0.47;
            scale = 0.55 + frac * 0.20;
            opacity = 0.35 + frac * 0.25;
            blurPx = 0.5 + (1 - frac) * 0.5;
            brightness = 0.55 + frac * 0.20;
          } else {
            const frac = Math.max(0, (z2 - (-1)) / 0.65);
            scale = 0.35 + frac * 0.20;
            opacity = 0.08 + frac * 0.17;
            blurPx = 1.0 + (1 - frac) * 1.0;
            brightness = 0.35;
            isBack = true;
          }
        }

        // Controlled subtle tilt
        const rotY = x2 * (cfg.isMobile ? 12 : 16);
        const rotX = -y2 * (cfg.isMobile ? 7 : 10);
        const zIndex = Math.round(10 + ((z2 + 1) / 2) * 85);

        // Update DOM element directly
        const el = cardEls.current.get(n.id);
        if (el) {
          el.style.transform = `translate3d(calc(-50% + ${posX}px), calc(-50% + ${posY}px), ${posZ}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`;
          el.style.opacity = String(opacity);
          el.style.filter = `brightness(${brightness})${blurPx > 0 ? ` blur(${blurPx}px) saturate(0.55)` : ""}`;
          el.style.zIndex = String(zIndex);
          el.style.pointerEvents = isBack ? "none" : "auto";
        }
      }

      // Update external active counter if front node changed
      if (frontNode && frontNode.publicIdx !== undefined && frontNode.publicIdx !== activeIndex) {
        onActiveIndexChange(frontNode.publicIdx);
      }
    },
    [nodes, cfg, activeIndex, onActiveIndexChange]
  );

  /* ── Modal Open / Close Handler ── */
  useEffect(() => {
    if (isModalOpen) {
      rotTw.current?.kill();
      isInteracting.current = true;
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    } else {
      scheduleResume(2500);
    }
  }, [isModalOpen, scheduleResume]);

  /* ── Continuous Always-On Auto-Rotation Animation Loop ── */
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Desktop: 0.07 rad/s (~4.0°/s); Mobile: 0.04 rad/s (~2.3°/s)
    const autoSpeedDeg = cfg.isMobile ? 2.3 : 4.0;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const shouldAutoRotate =
        !isInteracting.current &&
        !isCardHovered.current &&
        !isModalOpen &&
        !prefersReducedMotion;

      if (shouldAutoRotate) {
        yawRef.current = (yawRef.current + autoSpeedDeg * dt) % 360;
        applyTransforms(yawRef.current, pitchRef.current);
      }
    };

    applyTransforms(yawRef.current, pitchRef.current);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [cfg, isModalOpen, applyTransforms]);

  /* ── Pointer & Touch Gesture Handlers ── */
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;

    rotTw.current?.kill();
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    isInteracting.current = true;
    isPointerDown.current = true;
    hasDragged.current = false;
    touchIntent.current = "undecided";
    dragStartPoint.current = { x: e.clientX, y: e.clientY };
    lastPoint.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velX.current = 0;
    velY.current = 0;
    capturedPointerId.current = null;
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;

    const totalDx = e.clientX - dragStartPoint.current.x;
    const totalDy = e.clientY - dragStartPoint.current.y;
    const absDx = Math.abs(totalDx);
    const absDy = Math.abs(totalDy);

    if (touchIntent.current === "undecided") {
      if (absDx < 8 && absDy < 8) return;
      if (absDy >= absDx) {
        touchIntent.current = "vertical";
        isPointerDown.current = false;
        scheduleResume(1500);
        return;
      } else {
        touchIntent.current = "horizontal";
        hasDragged.current = true;
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          capturedPointerId.current = e.pointerId;
        } catch {}
      }
    }

    if (touchIntent.current !== "horizontal" || !hasDragged.current) return;

    const sens = cfg.isMobile ? 0.22 : 0.36;
    const stepX = e.clientX - lastPoint.current.x;
    const stepY = e.clientY - lastPoint.current.y;
    const now = performance.now();
    const dt = Math.max(1, now - lastPoint.current.time);

    velX.current = (stepX / dt) * sens;
    velY.current = -(stepY / dt) * sens;
    lastPoint.current = { x: e.clientX, y: e.clientY, time: now };

    yawRef.current = (yawRef.current + stepX * sens) % 360;
    pitchRef.current = Math.max(-8, Math.min(8, pitchRef.current - stepY * sens * 0.15));

    applyTransforms(yawRef.current, pitchRef.current);
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current && touchIntent.current !== "horizontal") return;
    isPointerDown.current = false;

    if (capturedPointerId.current !== null) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(capturedPointerId.current);
      } catch {}
      capturedPointerId.current = null;
    }

    if (hasDragged.current) {
      const vX = velX.current;
      if (Math.abs(vX) > 0.04) {
        const o = { y: yawRef.current, p: pitchRef.current };
        const fling = vX * (cfg.isMobile ? 50 : 65);
        rotTw.current = gsap.to(o, {
          y: yawRef.current + fling,
          p: 0,
          duration: 0.85,
          ease: "power2.out",
          onUpdate() {
            yawRef.current = o.y;
            pitchRef.current = o.p;
            applyTransforms(o.y, o.p);
          },
          onComplete() {
            scheduleResume(2500);
          },
        });
      } else {
        const o = { p: pitchRef.current };
        rotTw.current = gsap.to(o, {
          p: 0,
          duration: 0.4,
          ease: "power2.out",
          onUpdate() {
            pitchRef.current = o.p;
            applyTransforms(yawRef.current, o.p);
          },
          onComplete() {
            scheduleResume(2500);
          },
        });
      }
      cyberAudio.playHover();
    } else {
      scheduleResume(2500);
    }
    touchIntent.current = "undecided";
  };

  /* ── Desktop Stage Mouse Movement (Pause on motion, resume after stillness) ── */
  const onStageMouseMove = () => {
    if (cfg.isMobile || isPointerDown.current) return;
    isInteracting.current = true;
    scheduleResume(2500);
  };

  const onStageMouseLeave = () => {
    if (cfg.isMobile) return;
    isCardHovered.current = false;
    scheduleResume(2000);
  };

  /* ── Mouse Wheel Rotation ── */
  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (Math.abs(e.deltaY) < 15) return;
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      isInteracting.current = true;

      const step = (e.deltaY > 0 ? 1 : -1) * 12;
      yawRef.current = (yawRef.current + step) % 360;
      applyTransforms(yawRef.current, pitchRef.current);
      cyberAudio.playHover();
      scheduleResume(2500);
    },
    [applyTransforms, scheduleResume]
  );

  /* ── Card Click Handler: Opens Event Dossier immediately for ANY card ── */
  const handleCardClick = (node: SphereNode) => {
    if (hasDragged.current) return;
    cyberAudio.playClick();

    if (node.isClassified) {
      onOpenClassifiedModal();
      return;
    }

    if (node.event) {
      if (node.publicIdx !== undefined) {
        onActiveIndexChange(node.publicIdx);
      }
      onOpenEventDossier(node.event);
    }
  };

  return (
    <div className="relative w-full select-none">
      {/* ───────────────────────────────────────────────────────────── */}
      {/*  3D SPHERICAL ARCHIVE STAGE VIEWPORT                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        id="event-stage"
        className="relative w-full select-none touch-pan-y overflow-hidden"
        style={{
          height: `${cfg.stageH}px`,
          perspective: `${cfg.fov}px`,
          perspectiveOrigin: "50% 50%",
        }}
        onWheel={onWheel}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onMouseMove={onStageMouseMove}
        onMouseLeave={onStageMouseLeave}
      >
        {/* ── Central Atmospheric Cyber Radiance ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(16,77,50,0.32) 0%, rgba(3,15,10,0.12) 55%, transparent 75%)",
          }}
        />

        {/* ── Outer Orbital Guides (SVG Atmospheric Grid) ── */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 5 }}
        >
          <circle
            cx="50%"
            cy="50%"
            r={cfg.radius + (cfg.isMobile ? 18 : 28)}
            fill="none"
            stroke="rgba(24,196,124,0.12)"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
          <circle
            cx="50%"
            cy="50%"
            r={cfg.exclusionRadius}
            fill="none"
            stroke="rgba(0,229,255,0.08)"
            strokeWidth="1"
          />
        </svg>

        {/* ── NON-INTERACTIVE STATUS INDICATOR (● LIVE ORBIT) ── */}
        <div className="pointer-events-none absolute top-3 left-3 sm:top-4 sm:left-4 z-[90] flex items-center gap-2 rounded-full border border-emerald-500/25 bg-black/60 px-3 py-1 backdrop-blur-md font-mono text-[7.5px] sm:text-[8px] tracking-[0.24em] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE ORBIT</span>
        </div>

        <div className="pointer-events-none absolute top-3 right-3 sm:top-4 sm:right-4 z-[90] hidden xs:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-black/60 px-3 py-1 backdrop-blur-md font-mono text-[7.5px] sm:text-[8px] tracking-[0.22em] text-[#558270]">
          <span>3D ARCHIVE</span>
        </div>

        {/* ════════════════════════════════════════════════════════════
            EVENT WORLD — 0×0 ORIGIN AT EXACT CENTER (50%, 50%)
           ════════════════════════════════════════════════════════════ */}
        <div
          id="event-world"
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: 0,
            height: 0,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ════════════════════════════════════════════════════════════
              EVENT SPHERE — UNIFORM FIBONACCI 3D POSTER ARCHIVE
             ════════════════════════════════════════════════════════════ */}
          <div
            id="event-sphere"
            className="absolute"
            style={{
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              transformStyle: "preserve-3d",
            }}
          >
            {nodes.map((node, index) => {
              const accent = node.event ? accentOf(node.event.stream) : "#18c47c";
              const cardWidth = cfg.cardW;
              const cardHeight = cfg.cardH;

              return (
                <div
                  key={node.id}
                  ref={(el) => {
                    if (el) cardEls.current.set(node.id, el);
                    else cardEls.current.delete(node.id);
                  }}
                  className="absolute cursor-pointer will-change-transform"
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    top: 0,
                    left: 0,
                    transition: hasDragged.current
                      ? "none"
                      : "filter 0.2s ease-out, transform 0.1s linear",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(node);
                  }}
                  onMouseEnter={() => {
                    cyberAudio.playHover();
                    if (!cfg.isMobile) {
                      isCardHovered.current = true;
                      if (resumeTimer.current) clearTimeout(resumeTimer.current);
                    }
                    if (node.isClassified) setClassifiedHovered(true);
                  }}
                  onMouseLeave={() => {
                    if (!cfg.isMobile) {
                      isCardHovered.current = false;
                      scheduleResume(2500);
                    }
                    if (node.isClassified) setClassifiedHovered(false);
                  }}
                >
                  <EventPosterCard
                    event={node.event}
                    isClassified={node.isClassified}
                    publicIdx={node.publicIdx}
                    accent={accent}
                    isBack={false}
                    camZ={0}
                    width={cardWidth}
                    height={cardHeight}
                    index={index}
                    isMobile={cfg.isMobile}
                  />
                </div>
              );
            })}
          </div>
          {/* End Event Sphere */}

          {/* ════════════════════════════════════════════════════════════
              VYUHAM CORE — OFFICIAL VYUHAM'26 LOGO & HOLOGRAPHIC SCENE
              Permanently at exact origin (0, 0, 0).
             ════════════════════════════════════════════════════════════ */}
          <div
            id="vyuham-core"
            className="absolute"
            style={{
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              transformStyle: "preserve-3d",
              zIndex: 50,
            }}
          >
            <VyuhamLogoCore3D size={cfg.coreSize} />
          </div>
        </div>
        {/* End Event World */}

        {/* ── Desktop Drag Guidance ── */}
        <div className="pointer-events-none absolute bottom-2 inset-x-0 hidden sm:flex justify-center z-[90]">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-black/60 px-3 py-0.5 backdrop-blur-md font-mono text-[8px] tracking-[0.24em] text-[#558270]">
            <span>◈ &nbsp; DRAG 360° SPHERE · SCROLL TO ROTATE &nbsp; ◈</span>
            {classifiedHovered && (
              <span className="text-amber-400 font-bold animate-pulse">
                [ UNKNOWN SIGNAL ]
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/*  MOBILE DEDICATED CLEAN EVENT COUNTER                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {cfg.isMobile && (
        <div className="relative mt-2 flex justify-center py-1">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/60 px-4 py-1 backdrop-blur-md font-mono text-xs font-bold tracking-[0.2em] text-emerald-400">
            <span className="text-[7.5px] text-[#558270] tracking-[0.24em]">EVENT</span>
            <span className="text-emerald-300">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-[#305747]">/</span>
            <span className="text-[#6f9b89]">
              {String(totalPublic).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
