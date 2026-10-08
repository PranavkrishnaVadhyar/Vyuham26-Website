"use client";

/**
 * SphericalEventArchive3D — True 3D Spherical Event Archive with Fibonacci Distribution.
 *
 * ═══════════════════════════════════════════════════════════════════
 *  SPATIAL ARCHITECTURE & HIERARCHY:
 *
 *   • CORE:          OFFICIAL VYUHAM'26 LOGO (permanently at x=0, y=0, z=0)
 *                    Counter-rotates to always face user as the central command.
 *                    Unobstructed: cards orbit around the logo with center clearance.
 *   • EVENT SPHERE:  Fibonacci sphere distribution wrapping around the VYUHAM logo.
 *   • ACTIVE POSTER: Front poster in foreground deck highlighted with active beacon & details.
 *   • CLASSIFIED:    Secret Day 3 poster hidden in sphere (NIGHT 03 AFTERSHOCK).
 *
 *  360° ROTATION & MOBILE EXPERIENCE:
 *   - Unclamped continuous 360° yaw rotation in both directions with inertia fling.
 *   - Responsive 2:3 portrait posters calibrated across mobile, tablet, and desktop viewports.
 *   - Immediate tap/click detection without pointer capture stealing child clicks.
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import type { FestEvent, StreamId } from "@/data/types";
import { cyberAudio } from "@/lib/cyberAudio";
import VyuhamLogoCore3D from "./VyuhamLogoCore3D";
import EventPosterCard from "./EventPosterCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Secret Event Configuration                                         */
/* ------------------------------------------------------------------ */
export const SECRET_EVENT_REVEALED = false;

/* ------------------------------------------------------------------ */
/*  Responsive Sphere Configuration (2:3 Poster Aspect Ratio)          */
/* ------------------------------------------------------------------ */
interface SphereCfg {
  radius: number;     // Sphere radius in px
  cardW: number;      // Poster width in px
  cardH: number;      // Poster height in px (2:3 portrait)
  coreSize: number;   // VYUHAM logo core size in px
  stageH: number;     // Stage viewport height in px
  fov: number;        // CSS perspective in px
}

function buildCfg(ww: number): SphereCfg {
  if (ww < 400) {
    // Narrow Mobile (iPhone SE, Galaxy A-series)
    return {
      radius: 148,
      cardW: 102,
      cardH: 153,
      coreSize: 110,
      stageH: 480,
      fov: 760,
    };
  }
  if (ww < 640) {
    // Standard Mobile (iPhone 12/13/14/Pro, Galaxy S21/22/23, Pixel)
    return {
      radius: 172,
      cardW: 114,
      cardH: 171,
      coreSize: 125,
      stageH: 520,
      fov: 840,
    };
  }
  if (ww < 1024) {
    // Tablet
    return {
      radius: 265,
      cardW: 142,
      cardH: 213,
      coreSize: 165,
      stageH: 640,
      fov: 1050,
    };
  }
  // Desktop
  return {
    radius: 390,
    cardW: 170,
    cardH: 255,
    coreSize: 210,
    stageH: 800,
    fov: 1350,
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
}

export default function SphericalEventArchive3D({
  events,
  activeIndex,
  onActiveIndexChange,
  onOpenEventDossier,
  onOpenClassifiedModal,
  accentOf,
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
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);

  const yawRef = useRef(0);
  const pitchRef = useRef(0);

  /* ── GSAP Tween Reference ── */
  const rotTw = useRef<gsap.core.Tween | null>(null);

  /* ── Drag & Gestures State ── */
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);
  const dragStartPoint = useRef({ x: 0, y: 0 });
  const lastPoint = useRef({ x: 0, y: 0, time: 0 });
  const velX = useRef(0);
  const velY = useRef(0);
  const capturedPointerId = useRef<number | null>(null);
  const isManualRotation = useRef(false);

  /* ── Classified hover state ── */
  const [classifiedHovered, setClassifiedHovered] = useState(false);

  /* ── Build Fibonacci Distribution with Center Logo Clearance ── */
  const nodes: SphereNode[] = useMemo(() => {
    if (totalPublic === 0) return [];

    const totalNodes = totalPublic + 1;
    // Classified event placed in an upper-flank slot
    const classifiedSlot = 6;

    const GA = Math.PI * (3 - Math.sqrt(5)); // Golden Angle (~2.39996 rad)
    const list: SphereNode[] = [];

    let publicCounter = 0;
    const half = Math.floor(totalNodes / 2);
    const minDxy = 0.52;

    for (let i = 0; i < totalNodes; i++) {
      let y: number;
      if (i < half) {
        // Northern orbital dome (y: +0.92 down to +0.36)
        y = 0.92 - (i / Math.max(1, half - 1)) * 0.56;
      } else {
        // Southern orbital dome (y: -0.36 down to -0.92)
        const k = i - half;
        const count = totalNodes - half;
        y = -0.36 - (k / Math.max(1, count - 1)) * 0.56;
      }
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GA;
      let x = Math.cos(theta) * rad;
      let z = Math.sin(theta) * rad;

      // Radial clearance: ensure posters orbit around the logo with clear central corridor
      const dxy = Math.sqrt(x * x + y * y);
      if (dxy < minDxy) {
        const factor = minDxy / Math.max(0.01, dxy);
        x *= factor;
        y = y >= 0 ? Math.max(0.38, y * factor) : -Math.max(0.38, Math.abs(y * factor));
        const len = Math.sqrt(x * x + y * y + z * z);
        x /= len;
        y /= len;
        z /= len;
      }

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

  /* ── Smoothly Rotate Sphere to Bring a Node to Front Active Focus ── */
  const rotateToNode = useCallback(
    (node: SphereNode, fast = false) => {
      rotTw.current?.kill();

      // Horizontal angle to center card: yaw = -atan2(node.x, node.z)
      const targetYawRad = -Math.atan2(node.x, node.z);
      let targetYawDeg = (targetYawRad * 180) / Math.PI;

      // Pitch calculation: gentle responsive sphere tilt
      const elevationDeg = (Math.asin(Math.max(-0.95, Math.min(0.95, node.y))) * 180) / Math.PI;
      let targetPitchDeg = elevationDeg * 0.28;
      targetPitchDeg = Math.max(-20, Math.min(20, targetPitchDeg));

      // Calculate shortest circular path from current yaw
      let diffYaw = targetYawDeg - (yawRef.current % 360);
      while (diffYaw > 180) diffYaw -= 360;
      while (diffYaw < -180) diffYaw += 360;
      const endYaw = yawRef.current + diffYaw;

      const o = { y: yawRef.current, p: pitchRef.current };
      rotTw.current = gsap.to(o, {
        y: endYaw,
        p: targetPitchDeg,
        duration: fast ? 0.38 : 0.75,
        ease: fast ? "power2.out" : "power3.out",
        onUpdate() {
          yawRef.current = o.y;
          pitchRef.current = o.p;
          setYaw(o.y);
          setPitch(o.p);
        },
        onComplete() {
          yawRef.current = endYaw;
          pitchRef.current = targetPitchDeg;
          setYaw(endYaw);
          setPitch(targetPitchDeg);
        },
      });
    },
    []
  );

  /* ── Sync External activeIndex changes (e.g. from parent/keys) ── */
  useEffect(() => {
    // If the user is currently dragging the sphere freely, DO NOT override with snap
    if (isManualRotation.current) return;

    const targetNode = nodes.find((n) => !n.isClassified && n.publicIdx === activeIndex);
    if (targetNode) {
      rotateToNode(targetNode);
    }
  }, [activeIndex, nodes, rotateToNode]);

  /* ── Pointer Drag / Swipe Handlers (Continuous 360° Rotation) ── */
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;

    rotTw.current?.kill();
    isPointerDown.current = true;
    hasDragged.current = false;
    dragStartPoint.current = { x: e.clientX, y: e.clientY };
    lastPoint.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velX.current = 0;
    velY.current = 0;
    capturedPointerId.current = null;
    // Note: Do not setPointerCapture here so taps and clicks reach children cleanly
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;

    const totalDx = e.clientX - dragStartPoint.current.x;
    const totalDy = e.clientY - dragStartPoint.current.y;
    const totalDist = Math.hypot(totalDx, totalDy);

    // If movement exceeds 7px, enter 3D rotation drag mode
    if (!hasDragged.current && totalDist > 7) {
      hasDragged.current = true;
      isManualRotation.current = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        capturedPointerId.current = e.pointerId;
      } catch {
        /* ok */
      }
    }

    if (!hasDragged.current) return;

    const sens = ww < 640 ? 0.54 : 0.40;
    const stepX = e.clientX - lastPoint.current.x;
    const stepY = e.clientY - lastPoint.current.y;
    const now = performance.now();
    const dt = Math.max(1, now - lastPoint.current.time);

    velX.current = (stepX / dt) * sens;
    velY.current = -(stepY / dt) * sens;

    lastPoint.current = { x: e.clientX, y: e.clientY, time: now };

    // Continuous unclamped 360° yaw rotation:
    yawRef.current += stepX * sens;
    // Pitch clamped between -26° and +26°:
    pitchRef.current = Math.max(-26, Math.min(26, pitchRef.current - stepY * sens * 0.45));

    setYaw(yawRef.current);
    setPitch(pitchRef.current);
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;

    if (capturedPointerId.current !== null) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(capturedPointerId.current);
      } catch {
        /* ok */
      }
      capturedPointerId.current = null;
    }

    if (hasDragged.current) {
      const vX = velX.current;
      // Fling momentum with natural damping
      if (Math.abs(vX) > 0.05) {
        const o = { y: yawRef.current };
        const fling = vX * (ww < 640 ? 95 : 75);
        rotTw.current = gsap.to(o, {
          y: yawRef.current + fling,
          duration: 0.95,
          ease: "power2.out",
          onUpdate() {
            yawRef.current = o.y;
            setYaw(o.y);
          },
          onComplete() {
            setTimeout(() => {
              isManualRotation.current = false;
            }, 120);
          },
        });
      } else {
        setTimeout(() => {
          isManualRotation.current = false;
        }, 120);
      }
      cyberAudio.playHover();
    }
  };

  /* ── Mouse Wheel Rotation ── */
  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (Math.abs(e.deltaY) < 15) return;
      isManualRotation.current = false;
      const dir = e.deltaY > 0 ? 1 : -1;
      const nextIdx = ((activeIndex + dir) % totalPublic + totalPublic) % totalPublic;
      const targetNode = nodes.find((n) => !n.isClassified && n.publicIdx === nextIdx);
      if (targetNode) rotateToNode(targetNode);
      onActiveIndexChange(nextIdx);
      cyberAudio.playHover();
    },
    [activeIndex, totalPublic, nodes, rotateToNode, onActiveIndexChange]
  );

  /* ── Keyboard Arrow Navigation ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowLeft") {
        isManualRotation.current = false;
        cyberAudio.playClick();
        const prevIdx = ((activeIndex - 1) % totalPublic + totalPublic) % totalPublic;
        const targetNode = nodes.find((n) => !n.isClassified && n.publicIdx === prevIdx);
        if (targetNode) rotateToNode(targetNode);
        onActiveIndexChange(prevIdx);
      } else if (e.key === "ArrowRight") {
        isManualRotation.current = false;
        cyberAudio.playClick();
        const nextIdx = (activeIndex + 1) % totalPublic;
        const targetNode = nodes.find((n) => !n.isClassified && n.publicIdx === nextIdx);
        if (targetNode) rotateToNode(targetNode);
        onActiveIndexChange(nextIdx);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, totalPublic, nodes, rotateToNode, onActiveIndexChange]);

  /* ── Calculate Real-Time 3D Depth in Camera Space ── */
  const { renderedNodes, frontPublicIdx } = useMemo(() => {
    if (nodes.length === 0) return { renderedNodes: [], frontPublicIdx: 0 };

    const radYaw = (yaw * Math.PI) / 180;
    const radPitch = (pitch * Math.PI) / 180;

    let bestScore = -999;
    let closestPublicIdx = activeIndex;

    const list = nodes.map((n, idx) => {
      // 1. Rotate around Y axis by yaw:
      const x1 = n.x * Math.cos(radYaw) + n.z * Math.sin(radYaw);
      const y1 = n.y;
      const z1 = -n.x * Math.sin(radYaw) + n.z * Math.cos(radYaw);

      // 2. Rotate around X axis by pitch:
      const x2 = x1;
      const y2 = y1 * Math.cos(radPitch) - z1 * Math.sin(radPitch);
      const z2 = y1 * Math.sin(radPitch) + z1 * Math.cos(radPitch);

      // Track front-most card (prioritizing forward deck: high z2 and moderate y2)
      if (!n.isClassified) {
        const score = z2 - (y2 > 0 ? y2 * 0.35 : 0);
        if (score > bestScore) {
          bestScore = score;
          if (n.publicIdx !== undefined) closestPublicIdx = n.publicIdx;
        }
      }

      // Visibility tiers based on camera depth (z2 in [-1, +1])
      // Front (z2 >= 0.35): sharp, bright, prominent
      // Side (0 <= z2 < 0.35): medium size and opacity
      // Back (z2 < 0): smaller, darker, lower opacity
      const normDepth = (z2 + 1) / 2;
      let scale = 0.52 + normDepth * 0.48; // 0.52 -> 1.00
      let opacity: number;

      if (z2 >= 0.35) {
        opacity = 0.84 + ((z2 - 0.35) / 0.65) * 0.16; // 0.84 -> 1.00
      } else if (z2 >= 0.0) {
        opacity = 0.40 + (z2 / 0.35) * 0.44; // 0.40 -> 0.84
      } else {
        const backRatio = Math.max(0, (z2 + 1.0) / 1.0);
        opacity = 0.05 + Math.pow(backRatio, 2.0) * 0.35; // 0.05 -> 0.40
      }

      // Occlusion clearance: posters behind the center logo (z2 < 0.20 and 2D near origin) fade
      const dist2D = Math.sqrt(x2 * x2 + y2 * y2);
      if (z2 < 0.20 && dist2D < 0.38) {
        opacity *= Math.max(0.08, dist2D / 0.38);
      }

      // Subtle 3D perspective orientation (faces camera while retaining spherical curve)
      const subtleTiltY = x2 * 13 + (z2 < 0 ? (x2 >= 0 ? 8 : -8) : 0);
      const subtleTiltX = -y2 * 9;

      let brightness = 0.45 + normDepth * 0.65;
      let zIndex = Math.round(10 + normDepth * 85);
      let isBack = z2 < -0.05;

      return {
        node: n,
        x: n.x,
        y: n.y,
        z: n.z,
        camZ: z2,
        normDepth,
        scale,
        opacity,
        brightness,
        zIndex,
        isBack,
        subtleTiltY,
        subtleTiltX,
        index: idx,
      };
    });

    // Sort back-to-front for accurate DOM rendering
    list.sort((a, b) => a.camZ - b.camZ);

    return { renderedNodes: list, frontPublicIdx: closestPublicIdx };
  }, [nodes, yaw, pitch, activeIndex]);

  // Keep parent activeIndex updated with front card during free rotation
  useEffect(() => {
    if (isManualRotation.current && frontPublicIdx !== activeIndex) {
      onActiveIndexChange(frontPublicIdx);
    }
  }, [frontPublicIdx, activeIndex, onActiveIndexChange]);

  /* ── Card Click Handler (Guaranteed Execution on Tap/Click) ── */
  const handleCardClick = (item: (typeof renderedNodes)[0]) => {
    if (hasDragged.current) return;
    isManualRotation.current = false;
    cyberAudio.playClick();

    if (item.node.isClassified) {
      rotateToNode(item.node, true);
      setTimeout(() => {
        onOpenClassifiedModal();
      }, 260);
      return;
    }

    if (item.node.event) {
      if (item.node.publicIdx !== undefined) {
        onActiveIndexChange(item.node.publicIdx);
      }

      // If card is already in the forward deck, open dossier directly
      if (item.camZ > 0.38) {
        onOpenEventDossier(item.node.event);
      } else {
        // If card is on flank/rear, rotate it forward first then open dossier
        rotateToNode(item.node, true);
        setTimeout(() => {
          onOpenEventDossier(item.node.event!);
        }, 340);
      }
    }
  };

  return (
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
          r={cfg.radius + (ww < 640 ? 18 : 32)}
          fill="none"
          stroke="rgba(24,196,124,0.12)"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
        <circle
          cx="50%"
          cy="50%"
          r={cfg.radius}
          fill="none"
          stroke="rgba(0,229,255,0.08)"
          strokeWidth="1"
        />
      </svg>

      {/* ════════════════════════════════════════════════════════════
          EVENT WORLD — 0×0 ORIGIN AT CENTER (50%, 50%)
          Rotates around X and Y axes according to user pitch & yaw.
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
          transform: `rotateX(${pitch}deg) rotateY(${yaw}deg)`,
        }}
      >
        {/* ════════════════════════════════════════════════════════════
            EVENT SPHERE — FIBONACCI 3D DISTRIBUTED EVENT POSTERS
            Surrounds the VYUHAM Logo Core in true 3D space.
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
          {renderedNodes.map((item) => {
            const {
              node,
              x,
              y,
              z,
              camZ,
              scale,
              opacity,
              brightness,
              zIndex,
              isBack,
              subtleTiltY,
              subtleTiltX,
              index,
            } = item;
            const isFrontActive = !node.isClassified && node.publicIdx === activeIndex && camZ > 0.32;
            const accent = node.event ? accentOf(node.event.stream) : "#18c47c";

            /* ── Poster Coordinates on 3D Fibonacci Sphere ── */
            const posX = x * cfg.radius;
            const posY = -y * cfg.radius;
            const posZ = z * cfg.radius;

            const finalScale = isFrontActive ? Math.max(scale, 1.08) : scale;
            const rotY = -yaw + subtleTiltY;
            const rotX = -pitch + subtleTiltX;

            return (
              <div
                key={node.id}
                className="absolute cursor-pointer"
                style={{
                  width: `${cfg.cardW}px`,
                  height: `${cfg.cardH}px`,
                  top: 0,
                  left: 0,
                  transform: `translate3d(calc(-50% + ${posX}px), calc(-50% + ${posY}px), ${posZ}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${finalScale})`,
                  opacity: isFrontActive ? 1.0 : opacity,
                  filter: `brightness(${isFrontActive ? 1.15 : brightness})${isBack ? " blur(2px) saturate(0.55)" : ""}`,
                  zIndex: isFrontActive ? 95 : zIndex,
                  pointerEvents: isBack ? "none" : "auto",
                  transition: hasDragged.current ? "none" : "filter 0.2s ease-out, transform 0.12s linear",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(item);
                }}
                onMouseEnter={() => {
                  cyberAudio.playHover();
                  if (node.isClassified) setClassifiedHovered(true);
                }}
                onMouseLeave={() => {
                  if (node.isClassified) setClassifiedHovered(false);
                }}
              >
                <EventPosterCard
                  event={node.event}
                  isClassified={node.isClassified}
                  publicIdx={node.publicIdx}
                  isFrontActive={isFrontActive}
                  accent={accent}
                  isBack={isBack}
                  camZ={camZ}
                  width={cfg.cardW}
                  height={cfg.cardH}
                  index={index}
                />
              </div>
            );
          })}
        </div>
        {/* End Event Sphere */}

        {/* ════════════════════════════════════════════════════════════
            VYUHAM CORE — OFFICIAL VYUHAM'26 LOGO & HOLOGRAPHIC SCENE
            Originates at 0×0. Counter-rotates to permanently face user.
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
            transform: `rotateY(${-yaw}deg) rotateX(${-pitch}deg)`,
            zIndex: 50,
          }}
        >
          <VyuhamLogoCore3D size={cfg.coreSize} />
        </div>
      </div>
      {/* End Event World */}

      {/* ── PREV / NEXT FLOATING NAV BUTTONS ── */}
      <div
        className="pointer-events-none absolute inset-x-2 sm:inset-x-6 z-[100] flex justify-between"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <button
          type="button"
          aria-label="Previous event"
          onClick={() => {
            isManualRotation.current = false;
            cyberAudio.playClick();
            const prevIdx = ((activeIndex - 1) % totalPublic + totalPublic) % totalPublic;
            const targetNode = nodes.find((n) => !n.isClassified && n.publicIdx === prevIdx);
            if (targetNode) rotateToNode(targetNode);
            onActiveIndexChange(prevIdx);
          }}
          className="pointer-events-auto flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-emerald-500/35 bg-[#020704]/90 text-[#8ca89c] shadow-[0_0_20px_rgba(24,196,124,0.18)] backdrop-blur-md transition-all hover:border-emerald-300 hover:bg-emerald-950 hover:text-emerald-300 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
        <button
          type="button"
          aria-label="Next event"
          onClick={() => {
            isManualRotation.current = false;
            cyberAudio.playClick();
            const nextIdx = (activeIndex + 1) % totalPublic;
            const targetNode = nodes.find((n) => !n.isClassified && n.publicIdx === nextIdx);
            if (targetNode) rotateToNode(targetNode);
            onActiveIndexChange(nextIdx);
          }}
          className="pointer-events-auto flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-emerald-500/35 bg-[#020704]/90 text-[#8ca89c] shadow-[0_0_20px_rgba(24,196,124,0.18)] backdrop-blur-md transition-all hover:border-emerald-300 hover:bg-emerald-950 hover:text-emerald-300 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* ── Drag & Navigation Instructions ── */}
      <div className="pointer-events-none absolute bottom-3 inset-x-0 flex justify-center z-[100]">
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-black/60 px-3 py-1 backdrop-blur-md font-mono text-[7px] sm:text-[8px] tracking-[0.20em] sm:tracking-[0.24em] text-[#558270]">
          <span className="hidden sm:inline">◈ &nbsp; DRAG TO ROTATE 360° · SCROLL · ARROWS &nbsp; ◈</span>
          <span className="sm:hidden">◈ &nbsp; DRAG 360° SPHERE · TAP TO OPEN &nbsp; ◈</span>
          {classifiedHovered && (
            <span className="text-amber-400 font-bold animate-pulse">
              [ UNKNOWN SIGNAL ]
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
