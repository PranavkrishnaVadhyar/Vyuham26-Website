"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/lib/store";
import { events } from "@/data/events";

/* ==========================================================================
   VYUHAM'26 — CINEMATIC 3D EVENT REGISTRY
   - 3D Volumetric Cylinder Showcase
   - Front/Back card depth & smooth inertia mouse parallax
   - Clean stage boundaries (no overlap with title or controls)
   - Full browsable & searchable event catalog grid below
   ========================================================================== */

const CARD_VIDEOS = [
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_030111_a9e15665-d379-4a7f-8116-695bbe452ad1.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_171347_f640c30d-ec21-426a-98bc-77e07c2c60cb.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4",
];

const streamTheme: Record<
  string,
  { accent: string; soft: string; border: string; icon: string; name: string }
> = {
  tech: {
    accent: "#35e6a4",
    soft: "rgba(53,230,164,.10)",
    border: "rgba(53,230,164,.32)",
    icon: "◈",
    name: "TECHNOLOGY",
  },
  culture: {
    accent: "#d5a7ff",
    soft: "rgba(213,167,255,.09)",
    border: "rgba(213,167,255,.30)",
    icon: "◇",
    name: "CULTURE",
  },
  gaming: {
    accent: "#57dfff",
    soft: "rgba(87,223,255,.10)",
    border: "rgba(87,223,255,.32)",
    icon: "✦",
    name: "GAMING",
  },
  impact: {
    accent: "#b4e8c8",
    soft: "rgba(180,232,200,.09)",
    border: "rgba(180,232,200,.28)",
    icon: "⊹",
    name: "IMPACT",
  },
  management: {
    accent: "#b4e8c8",
    soft: "rgba(180,232,200,.09)",
    border: "rgba(180,232,200,.28)",
    icon: "⊹",
    name: "IMPACT",
  },
};

const streams = ["all", "tech", "culture", "gaming", "impact"] as const;
const days = ["all", "1", "2", "3"] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

const normalizeOffset = (offset: number, count: number) => {
  const half = count / 2;
  let value = offset;
  while (value > half) value -= count;
  while (value < -half) value += count;
  return value;
};

function getStream(event: (typeof events)[number]) {
  return event.stream === "management" ? "impact" : event.stream;
}

/* ==========================================================================
   3D CYLINDER CARD
   ========================================================================== */

function EventCard({
  event,
  index,
  total,
  registerCard,
}: {
  event: (typeof events)[number];
  index: number;
  total: number;
  registerCard: (index: number, element: HTMLDivElement | null) => void;
}) {
  const stream = getStream(event);
  const theme = streamTheme[stream] ?? streamTheme.tech;
  const phase =
    event.day === 1 ? "IGNITION" : event.day === 2 ? "CONVERGENCE" : "AFTERSHOCK";

  return (
    <div
      ref={(element) => registerCard(index, element)}
      className="absolute left-1/2 top-1/2 cursor-pointer select-none"
      style={{
        width: "var(--event-card-w, 360px)",
        height: "var(--event-card-h, 228px)",
        marginLeft: "calc(var(--event-card-w, 360px) / -2)",
        marginTop: "calc(var(--event-card-h, 228px) / -2)",
        transformStyle: "preserve-3d",
        backfaceVisibility: "visible",
        willChange: "transform, opacity",
      }}
    >
      <Link
        href={`/events/${event.slug}`}
        className="group relative block h-full w-full rounded-[22px] no-underline focus:outline-none"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "visible",
        }}
      >
        {/* Physical volumetric depth layers */}
        {[-2, -1, 0, 1, 2].map((depth) => (
          <div
            key={depth}
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px] border"
            style={{
              transform: `translateZ(${depth * 1}px)`,
              borderColor:
                depth === 2 ? theme.border : "rgba(255,255,255,0.04)",
              background: depth === 2 ? "#07100c" : "rgba(8,16,12,0.92)",
              backfaceVisibility: "hidden",
            }}
          />
        ))}

        {/* FRONT FACE */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[22px] border"
          style={{
            transform: "translateZ(3px)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            borderColor: theme.border,
            background: "#060e0a",
            boxShadow: `0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 30px ${theme.accent}15`,
          }}
        >
          {/* Background video with fallback */}
          <video
            src={CARD_VIDEOS[index % CARD_VIDEOS.length]}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen transition-opacity duration-500 group-hover:opacity-75"
            onError={(e) => {
              (e.currentTarget as HTMLVideoElement).style.display = "none";
            }}
          />

          {/* Cinematic dark overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(150deg, rgba(2,7,5,0.45) 0%, rgba(2,7,5,0.92) 80%),
                radial-gradient(circle at 85% 20%, ${theme.accent}25, transparent 40%)
              `,
            }}
          />

          {/* Top highlight bar */}
          <div
            className="absolute left-5 right-5 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
              opacity: 0.8,
            }}
          />

          {/* Content layout */}
          <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="font-mono text-[9px] uppercase tracking-[0.24em] font-semibold"
                  style={{ color: theme.accent }}
                >
                  {stream}
                </div>
                <div className="mt-1 font-mono text-[7px] tracking-[0.16em] text-white/35">
                  PROTOCOL {String(index + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </div>
              </div>

              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg border text-xs shadow-inner"
                style={{
                  borderColor: theme.border,
                  color: theme.accent,
                  background: theme.soft,
                }}
              >
                {theme.icon}
              </div>
            </div>

            <div>
              <div className="mb-2 h-px w-8 bg-white/30" />

              <h3 className="line-clamp-1 font-display text-[clamp(22px,2.4vw,32px)] font-bold leading-none tracking-tight text-white group-hover:text-emerald-200">
                {event.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-white/55">
                {event.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/50">
                  DAY {event.day} · {event.time}
                </span>

                <span
                  className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.18em] transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: theme.accent }}
                >
                  ENTER PROTOCOL →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[22px] border"
          style={{
            transform: "rotateY(180deg) translateZ(3px)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            borderColor: theme.border,
            background: "#040906",
            boxShadow: `0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          <div className="absolute inset-0 bg-[#020504]/90" />

          <div className="relative z-10 flex h-full flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span
                  className="font-mono text-[7px] uppercase tracking-[0.24em]"
                  style={{ color: theme.accent }}
                >
                  VYUHAM&apos;26 // ARCHIVE
                </span>
                <span className="font-mono text-[7px] text-white/30">
                  {phase}
                </span>
              </div>

              <div className="mt-3 font-display text-lg font-bold text-white">
                {event.title}
              </div>

              <div className="mt-3 space-y-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
                <div className="flex justify-between">
                  <span>VENUE</span>
                  <span className="truncate text-white/70">{event.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span>TIME</span>
                  <span className="text-white/70">{event.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>PRIZES</span>
                  <span className="text-white/70">{event.prizes}</span>
                </div>
              </div>
            </div>

            <div
              className="border-t pt-2.5 text-center font-mono text-[7px] uppercase tracking-[0.2em]"
              style={{ borderColor: theme.border, color: theme.accent }}
            >
              CLICK TO VIEW SPECIFICATION →
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function EventsPage() {
  const { saved, toggleSave } = useApp();

  const [activeStream, setActiveStream] = useState<string>("all");
  const [activeDay, setActiveDay] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [paused, setPaused] = useState(false);

  const [metrics, setMetrics] = useState({ cardW: 340, cardH: 215 });

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const pointerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    insideStage: false,
    stageMouseX: 0, // -1 to 1, normalised within carousel container
  });

  /* Keyboard shortcut for search */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const isTyping =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "SELECT" ||
          active.isContentEditable);

      if (isTyping) return;

      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("event-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* Filter events */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const stream = getStream(event);
      const streamMatch = activeStream === "all" || stream === activeStream;
      const dayMatch = activeDay === "all" || event.day === Number(activeDay);

      const searchMatch =
        query === "" ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query);

      const savedMatch = !savedOnly || saved.includes(event.slug);

      return streamMatch && dayMatch && searchMatch && savedMatch;
    });
  }, [activeStream, activeDay, search, savedOnly, saved]);

  /* Carousel shows up to 12 featured events */
  const carouselEvents = useMemo(() => {
    return filtered.slice(0, 12);
  }, [filtered]);

  const registerCard = useCallback(
    (index: number, element: HTMLDivElement | null) => {
      cardsRef.current[index] = element;
    },
    []
  );

  /* Responsive card sizing */
  useEffect(() => {
    const updateMetrics = () => {
      const w = window.innerWidth;
      const isMobile = w < 640;
      const cardW = isMobile
        ? Math.round(clamp(w * 0.62, 220, 290))
        : Math.round(clamp(w * 0.22, 260, 340));
      const cardH = Math.round(cardW / 1.58);
      setMetrics({ cardW, cardH });
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  /* Mouse & touch tracking — direct handlers on the stage for reliable detection */
  const handleStageMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Normalise mouse X within stage to -1..+1
    pointerRef.current.stageMouseX =
      ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.insideStage = true;
  }, []);

  const handleStageMouseEnter = useCallback(() => {
    pointerRef.current.insideStage = true;
  }, []);

  const handleStageMouseLeave = useCallback(() => {
    pointerRef.current.insideStage = false;
    pointerRef.current.stageMouseX = 0;
  }, []);

  /* Mouse wheel — scroll to orbit through cards */
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    // deltaY > 0 = scroll down = orbit forward, deltaY < 0 = scroll up = orbit backward
    const scrollSpeed = 0.004;
    targetProgressRef.current += e.deltaY * scrollSpeed;
  }, []);

  /* Touch drag support */
  const touchRef = useRef<{ startX: number; lastX: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchRef.current = { startX: touch.clientX, lastX: touch.clientX };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchRef.current.lastX;
    touchRef.current.lastX = touch.clientX;
    // Dragging right = orbit backward, left = orbit forward
    targetProgressRef.current -= dx * 0.008;
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchRef.current = null;
  }, []);

  /* Global mouse position for parallax tilt only */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const gx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const gy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      pointerRef.current.targetX = clamp(gx, -1, 1);
      pointerRef.current.targetY = clamp(gy, -1, 1);
    };

    const onLeave = () => {
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
      pointerRef.current.insideStage = false;
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /*
   * HORIZONTAL RING CAROUSEL — driven by mouse X + scroll wheel + touch
   *
   * Cards are placed around a horizontal circle using sin/cos.
   * When the mouse is inside the stage, the mouse X position
   * drives orbital rotation speed (move right = rotate forward,
   * move left = rotate backward). Mouse scroll wheel also orbits.
   * When outside or paused, a gentle auto-rotation continues.
   *
   * Cards scale up, move forward (Z), and become fully opaque when
   * facing the viewer. Cards behind the ring fade and shrink.
   */
  useEffect(() => {
    const tick = (time: number) => {
      const previous = lastTimeRef.current ?? time;
      const delta = Math.min((time - previous) / 1000, 0.05);
      lastTimeRef.current = time;

      const pointer = pointerRef.current;

      // Smooth inertia for global tilt
      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;

      const count = carouselEvents.length;
      if (count === 0) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      // Drive rotation from mouse when inside the stage
      if (pointer.insideStage && !paused) {
        // stageMouseX: -1 (left edge) to +1 (right edge)
        // Speed proportional to how far from center the cursor is
        const speed = pointer.stageMouseX * 2.2; // cards/sec at edge
        targetProgressRef.current += speed * delta;
      } else if (!paused) {
        // Gentle auto-rotate when mouse is not on the stage
        targetProgressRef.current += delta * 0.18;
      }

      // Smooth approach to target (inertia)
      progressRef.current += (targetProgressRef.current - progressRef.current) * 0.1;

      // Ring geometry
      const ringRadius = Math.min(window.innerWidth * 0.36, 420);

      cardsRef.current.forEach((card, index) => {
        if (!card || count === 0) return;

        // Angle for this card in the ring
        const anglePerCard = (2 * Math.PI) / count;
        const rawAngle = anglePerCard * index - progressRef.current * anglePerCard;

        // Normalise angle to -PI..+PI
        let angle = rawAngle % (2 * Math.PI);
        if (angle > Math.PI) angle -= 2 * Math.PI;
        if (angle < -Math.PI) angle += 2 * Math.PI;

        // Position on the ring
        const x = Math.sin(angle) * ringRadius;
        const z = Math.cos(angle) * ringRadius;

        // Depth factor: 1 at front (angle=0), -1 at back (angle=PI)
        const depthFactor = Math.cos(angle); // 1 at front, -1 at back

        // Hide cards that are behind the ring
        if (depthFactor < -0.3) {
          card.style.visibility = "hidden";
          card.style.opacity = "0";
          return;
        }

        card.style.visibility = "visible";

        // Scale: front card is 1.0, side cards shrink
        const scale = 0.65 + Math.max(0, depthFactor) * 0.35;

        // Opacity: full at front, fading at sides
        const opacity = clamp(0.15 + Math.max(0, depthFactor) * 0.85, 0, 1);

        // Gentle Y-axis rotation so cards face outward from the ring
        const faceRotation = -(angle * 180) / Math.PI;

        // Mouse-driven tilt on the front card
        const centerFactor = Math.max(0, depthFactor);
        const tiltX = -pointer.y * 6 * centerFactor;
        const tiltY = pointer.x * 8 * centerFactor;

        // Subtle vertical bob based on position
        const yBob = Math.sin(angle) * 12;

        card.style.zIndex = String(Math.round(500 + depthFactor * 200));
        card.style.opacity = String(opacity);
        card.style.transform =
          `translateX(${x.toFixed(1)}px) ` +
          `translateY(${yBob.toFixed(1)}px) ` +
          `translateZ(${z.toFixed(1)}px) ` +
          `rotateY(${(faceRotation + tiltY).toFixed(1)}deg) ` +
          `rotateX(${tiltX.toFixed(1)}deg) ` +
          `scale(${scale.toFixed(3)})`;
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [carouselEvents.length, paused]);

  /* Prevent default wheel on the stage element (needs native event for passive: false) */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const preventScroll = (e: WheelEvent) => e.preventDefault();
    stage.addEventListener("wheel", preventScroll, { passive: false });
    return () => stage.removeEventListener("wheel", preventScroll);
  }, []);

  const stepNext = () => {
    targetProgressRef.current += 1;
  };

  const stepPrev = () => {
    targetProgressRef.current -= 1;
  };

  return (
    <div className="min-h-screen bg-[#020504] text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      <main className="relative overflow-hidden pt-24 md:pt-28">
        {/* Background Atmosphere */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 50% 18%, rgba(24,196,124,0.08) 0%, transparent 40%),
                radial-gradient(circle at 15% 55%, rgba(0,180,255,0.035) 0%, transparent 32%),
                radial-gradient(circle at 85% 65%, rgba(46,229,157,0.04) 0%, transparent 35%),
                #020504
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(24,196,124,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(24,196,124,0.3) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        {/* ===================================================================
            1. HERO TITLE & STATS
            =================================================================== */}
        <section className="relative z-10 mx-auto w-[min(1360px,calc(100%-32px))] md:w-[min(1360px,calc(100%-64px))]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-1 font-mono text-[9px] uppercase tracking-[0.26em] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>VYUHAM&apos;26 // PROTOCOL ARENA</span>
            </div>

            <h1 className="mt-4 font-display text-[clamp(40px,6.8vw,88px)] font-bold leading-[0.88] tracking-tight">
              EXPLORE
              <span className="ml-3 bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                THE EVENTS.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-[12px] leading-relaxed text-[#8da69c] md:text-[14px]">
              48 Competitions, challenges, and cultural arenas across 4 streams.
              Scroll or move your cursor to orbit through the 3D arena.
            </p>

            {/* Quick Stat Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-center font-mono text-[9px] tracking-[0.2em] text-[#527768]">
              <span>48 EVENTS</span>
              <span className="text-emerald-500">•</span>
              <span>4 STREAMS</span>
              <span className="text-emerald-500">•</span>
              <span>3 DAYS</span>
              <span className="text-emerald-500">•</span>
              <span>₹12L PRIZE POOL</span>
            </div>
          </div>
        </section>

        {/* ===================================================================
            2. MOUSE-DRIVEN 3D HORIZONTAL RING CAROUSEL
            =================================================================== */}
        <section className="relative z-20 my-8 mx-auto w-full max-w-[1360px] px-4">
          <div
            ref={stageRef}
            className="relative mx-auto h-[420px] md:h-[480px] w-full max-w-[1100px] overflow-hidden rounded-3xl border border-white/[0.06] bg-black/30"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 50%",
              ["--event-card-w" as string]: `${metrics.cardW}px`,
              ["--event-card-h" as string]: `${metrics.cardH}px`,
              cursor: "grab",
            }}
            onMouseMove={handleStageMouseMove}
            onMouseEnter={handleStageMouseEnter}
            onMouseLeave={handleStageMouseLeave}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Center ambient glow */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(24,196,124,0.14), transparent 65%)",
                filter: "blur(35px)",
              }}
            />

            {/* Floor reflection */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-[35%]"
              style={{
                background:
                  "linear-gradient(to top, rgba(24,196,124,0.03), transparent)",
              }}
            />

            {/* Cards orbiting in a horizontal ring */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(0)",
              }}
            >
              {carouselEvents.map((event, index) => (
                <EventCard
                  key={event.slug}
                  event={event}
                  index={index}
                  total={carouselEvents.length}
                  registerCard={registerCard}
                />
              ))}
            </div>

            {/* Edge vignettes */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#020504] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#020504] to-transparent" />

            {/* Mouse hint overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-3 font-mono text-[8px] uppercase tracking-[0.22em] text-emerald-300/40">
              <span>← SCROLL OR MOVE CURSOR TO ORBIT →</span>
            </div>
          </div>

          {/* Controls bar */}
          <div className="mx-auto mt-4 flex max-w-xl items-center justify-between px-2 font-mono text-[9px] tracking-[0.2em] text-[#5a7c6f]">
            <button
              onClick={stepPrev}
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-white/70 transition hover:border-emerald-500/50 hover:text-emerald-300"
            >
              <span>◄</span>
              <span>PREV</span>
            </button>

            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{paused ? "PAUSED" : "ORBITING"}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/40">{carouselEvents.length} CARDS</span>
            </button>

            <button
              onClick={stepNext}
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-white/70 transition hover:border-emerald-500/50 hover:text-emerald-300"
            >
              <span>NEXT</span>
              <span>►</span>
            </button>
          </div>
        </section>

        {/* ===================================================================
            3. REGISTRY COMMAND CENTER (Filters + Search)
            =================================================================== */}
        <section
          id="registry-controls"
          className="relative z-30 mt-8 border-y border-white/[0.08] bg-[#030705]/95 backdrop-blur-xl"
        >
          <div className="mx-auto w-[min(1360px,calc(100%-32px))] py-6 md:w-[min(1360px,calc(100%-64px))]">
            {/* Top row: Stream tabs & Day tabs */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* Streams */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 font-mono text-[8px] uppercase tracking-[0.24em] text-[#55786b]">
                  STREAM:
                </span>
                {streams.map((s) => {
                  const active = activeStream === s;
                  const theme = streamTheme[s] ?? streamTheme.tech;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setActiveStream(s)}
                      className="rounded-lg border px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] transition-all"
                      style={{
                        borderColor: active
                          ? theme.border
                          : "rgba(255,255,255,0.08)",
                        background: active ? theme.soft : "rgba(255,255,255,0.02)",
                        color: active ? theme.accent : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {s === "all" ? "ALL STREAMS" : `${theme.icon} ${s}`}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setSavedOnly((v) => !v)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] transition-all ${
                    savedOnly
                      ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                      : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:text-white/70"
                  }`}
                >
                  ★ SAVED ({saved.length})
                </button>
              </div>

              {/* Days */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 font-mono text-[8px] uppercase tracking-[0.24em] text-[#55786b]">
                  TIMELINE:
                </span>
                {days.map((d) => {
                  const active = activeDay === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setActiveDay(d)}
                      className={`rounded-lg border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] transition-all ${
                        active
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                          : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:text-white/70"
                      }`}
                    >
                      {d === "all" ? "ALL DAYS" : `DAY 0${d}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative mt-5">
              <input
                id="event-search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH 48 EVENTS BY TITLE, VENUE, OR KEYWORD... (PRESS '/' TO FOCUS)"
                className="h-12 w-full rounded-xl border border-white/10 bg-black/50 pl-11 pr-10 font-mono text-[10px] uppercase tracking-[0.16em] text-white outline-none placeholder:text-white/25 focus:border-emerald-500/50 focus:bg-emerald-950/20 transition-all"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-emerald-400 text-sm">
                ◈
              </span>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-white/40 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. COMPREHENSIVE EVENT CATALOG GRID (All 48 Events)
            =================================================================== */}
        <section className="relative z-20 py-16 md:py-24">
          <div className="mx-auto w-[min(1360px,calc(100%-32px))] md:w-[min(1360px,calc(100%-64px))]">
            {/* Header / Counter */}
            <div className="mb-8 flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-emerald-400">
                  SYSTEM DIRECTORY
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {filtered.length}{" "}
                  <span className="text-[#648577]">
                    {filtered.length === 1 ? "EVENT FOUND" : "EVENTS FOUND"}
                  </span>
                </h2>
              </div>

              {(activeStream !== "all" ||
                activeDay !== "all" ||
                search !== "" ||
                savedOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveStream("all");
                    setActiveDay("all");
                    setSearch("");
                    setSavedOnly(false);
                  }}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-400 hover:bg-emerald-900/40 transition"
                >
                  RESET FILTERS ✕
                </button>
              )}
            </div>

            {/* Event Cards Grid */}
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((event, i) => {
                  const stream = getStream(event);
                  const theme = streamTheme[stream] ?? streamTheme.tech;
                  const isSaved = saved.includes(event.slug);

                  return (
                    <div
                      key={event.slug}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#050c08]/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#07130d]"
                      style={{ borderColor: "rgba(120,160,145,0.16)" }}
                    >
                      {/* Top accent line on hover */}
                      <div
                        className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                        }}
                      />

                      {/* Header info */}
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-md border text-[10px]"
                              style={{
                                color: theme.accent,
                                borderColor: theme.border,
                                background: theme.soft,
                              }}
                            >
                              {theme.icon}
                            </span>
                            <span
                              className="font-mono text-[8px] uppercase tracking-[0.2em] font-semibold"
                              style={{ color: theme.accent }}
                            >
                              {stream}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleSave(event.slug)}
                              title={isSaved ? "Saved" : "Save event"}
                              className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs transition ${
                                isSaved
                                  ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                                  : "border-white/10 text-white/30 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              ★
                            </button>
                            <span className="font-mono text-[8px] text-white/30">
                              #{String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="mt-4 font-display text-xl font-bold text-white transition-colors group-hover:text-emerald-200">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-[#7e998e]">
                          {event.description}
                        </p>
                      </div>

                      {/* Footer metadata */}
                      <div className="mt-6 border-t border-white/[0.08] pt-4">
                        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-[#6b8b7e]">
                          <span>DAY {event.day} · {event.time}</span>
                          <span className="max-w-[45%] truncate text-right text-white/50">
                            {event.venue}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="font-mono text-[8px] text-[#4f7062]">
                            PRIZE: <span className="text-white/70">{event.prizes}</span>
                          </span>

                          <Link
                            href={`/events/${event.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-emerald-400 transition hover:bg-emerald-500 hover:text-black"
                          >
                            <span>VIEW PROTOCOL</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-black/30 py-20 text-center">
                <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-emerald-400">
                  PROTOCOL NOT FOUND
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-white">
                  NO MATCHING EVENTS
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-xs text-[#7e998e]">
                  Try clearing your search terms or selecting another stream/day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStream("all");
                    setActiveDay("all");
                    setSearch("");
                    setSavedOnly(false);
                  }}
                  className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-400 hover:bg-emerald-900/40 transition"
                >
                  RESET SEARCH FILTERS →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================
            5. CLOSING TRANSMISSION
            =================================================================== */}
        <section className="relative border-t border-white/[0.08] py-20 text-center">
          <div className="mx-auto max-w-md px-4">
            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-emerald-400">
              VYUHAM&apos;26 ARENA
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
              CHOOSE YOUR ARENA.
            </h2>
            <p className="mt-2 text-xs text-[#7e998e]">
              30 OCT — 01 NOV 2026 · TECHNOCITY · THIRUVANANTHAPURAM
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
