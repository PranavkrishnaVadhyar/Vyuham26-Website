"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { cyberAudio } from "@/lib/cyberAudio";

interface NavItem {
  num: string;
  label: string;
  href: string;
  altHref?: string;
  sectionId?: string;
}

const navItems: NavItem[] = [
  { num: "01", label: "HOME", href: "/", sectionId: "home" },
  { num: "02", label: "ABOUT", href: "/about", sectionId: "about" },
  { num: "03", label: "EVENTS", href: "/events", sectionId: "events" },
  { num: "04", label: "SCHEDULE", href: "/schedule", sectionId: "schedule" },
  { num: "05", label: "GALLERY", href: "/gallery" },
  { num: "06", label: "VENUE", href: "/venue" },
  { num: "07", label: "TEAMS", href: "/teams" },
  { num: "08", label: "DASHBOARD", href: "/dashboard" },
  { num: "09", label: "CONTACT", href: "/contact" },
  { num: "10", label: "SUPPORT", href: "/faq", altHref: "/support" },
];

export default function SideNavRail() {
  const router = useRouter();
  const pathname = usePathname();

  /* ─── Hydration-Safe State Initialization ─── */
  const [introPlaying, setIntroPlaying] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // 1. Synchronize collapsed state from localStorage after hydration
    try {
      const isCollapsed = localStorage.getItem("vyuham-rail-collapsed") === "true";
      if (isCollapsed) {
        setCollapsed(true);
        if (typeof document !== "undefined") {
          document.documentElement.dataset.railCollapsed = "true";
        }
      }
    } catch {
      // Storage access blocked or unavailable
    }

    // 2. Synchronize intro animation state
    if (pathname === "/") {
      try {
        const isDismissed = sessionStorage.getItem("vyuham-intro-dismissed") === "1";
        if (!isDismissed && typeof document !== "undefined" && document.documentElement.dataset.introActive === "true") {
          setIntroPlaying(true);
        } else {
          setIntroPlaying(false);
        }
      } catch {
        setIntroPlaying(false);
      }
    } else {
      setIntroPlaying(false);
    }

    const handleStart = () => setIntroPlaying(true);
    const handleComplete = () => setIntroPlaying(false);

    window.addEventListener("vyuham:intro-start", handleStart);
    window.addEventListener("vyuham:intro-complete", handleComplete);

    return () => {
      window.removeEventListener("vyuham:intro-start", handleStart);
      window.removeEventListener("vyuham:intro-complete", handleComplete);
    };
  }, [pathname]);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      if (next) {
        cyberAudio.playCollapse();
      } else {
        cyberAudio.playExpand();
      }
      try {
        localStorage.setItem("vyuham-rail-collapsed", String(next));
      } catch {}
      if (typeof document !== "undefined") {
        if (next) {
          document.documentElement.dataset.railCollapsed = "true";
        } else {
          delete document.documentElement.dataset.railCollapsed;
        }
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (collapsed) {
        document.documentElement.dataset.railCollapsed = "true";
      } else {
        delete document.documentElement.dataset.railCollapsed;
      }
    }
  }, [collapsed]);

  /* ─── Audio Mute State ─── */
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(cyberAudio.isMuted());
    const handleAudioToggle = (e: Event) => {
      const custom = e as CustomEvent<{ muted: boolean }>;
      if (custom.detail) {
        setMuted(custom.detail.muted);
      }
    };
    window.addEventListener("vyuham:audio-toggle", handleAudioToggle);
    return () => window.removeEventListener("vyuham:audio-toggle", handleAudioToggle);
  }, []);

  /* ─── Scroll Spy Progress ─── */
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      setScrollPercent(Math.min(100, Math.max(0, Math.round(latest * 100))));
    });
  }, [smoothProgress]);

  /* ─── Homepage Section Observer ─── */
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const homeSections = [
      { id: "home", num: "01" },
      { id: "about", num: "02" },
      { id: "events", num: "03" },
      { id: "schedule", num: "04" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = homeSections.find((s) => s.id === entry.target.id);
            if (match) setActiveSection(match.num);
          }
        });
      },
      { threshold: 0.25, rootMargin: "-10% 0px -45% 0px" }
    );

    homeSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  /* ─── Live Telemetry Ping Jitter ─── */
  const [ping, setPing] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setPing(Math.floor(19 + Math.random() * 15));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  /* ─── UI State ─── */
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  /* ─── Keyboard Hotkeys (0-9, J/K, M) ─── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      // Keys 0 to 9 (1-9 for nodes 01-09, 0 for node 10)
      const keyNum = parseInt(e.key, 10);
      if (!isNaN(keyNum) && keyNum >= 0 && keyNum <= 9) {
        const targetIndex = keyNum === 0 ? 9 : keyNum - 1;
        const item = navItems[targetIndex];
        if (item) {
          e.preventDefault();
          cyberAudio.playClick();
          if (pathname === "/" && item.sectionId) {
            const el = document.getElementById(item.sectionId);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              setActiveSection(item.num);
              return;
            }
          }
          router.push(item.href);
        }
      }

      // Key M = Toggle Audio Mute
      if (e.key === "m" || e.key === "M") {
        setMuted(cyberAudio.toggleMute());
      }

      // Keys J / K = Section hop on homepage
      if (pathname === "/" && (e.key === "j" || e.key === "k" || e.key === "J" || e.key === "K")) {
        const homeSectionIds = ["home", "about", "events", "schedule", "register"];
        const currentIdx = homeSectionIds.findIndex((id) => {
          const el = document.getElementById(id);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top >= -200 && rect.top <= window.innerHeight * 0.5;
        });

        const nextIdx =
          e.key.toLowerCase() === "j"
            ? Math.min(homeSectionIds.length - 1, (currentIdx >= 0 ? currentIdx : 0) + 1)
            : Math.max(0, (currentIdx >= 0 ? currentIdx : 0) - 1);

        const targetEl = document.getElementById(homeSectionIds[nextIdx]);
        if (targetEl) {
          e.preventDefault();
          cyberAudio.playClick();
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router]);

  if (pathname?.startsWith("/intro") || (pathname === "/" && introPlaying)) {
    return null;
  }

  // Active item calculation
  const routeActiveNum =
    navItems.find((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname.startsWith(item.href) ||
          (item.altHref && pathname.startsWith(item.altHref))
    )?.num ?? "01";

  const activeItem =
    pathname === "/" && activeSection ? activeSection : routeActiveNum;

  // Click handler for in-page anchors on homepage
  const handleItemClick = (e: React.MouseEvent, item: NavItem) => {
    cyberAudio.playClick();
    if (pathname === "/" && item.sectionId) {
      const target = document.getElementById(item.sectionId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        setActiveSection(item.num);
        return;
      }
    }
  };

  return (
    <>
      {/* =========================================================
          NEURAL SPINE (DESKTOP ASIDE)
      ========================================================= */}
      <aside
        className={`side-nav-rail fixed left-0 top-0 z-50 hidden h-screen transition-all duration-300 md:flex ${
          collapsed ? "w-3.5 cursor-pointer bg-[#050908]/95" : "w-14.5"
        }`}
        aria-label="VYUHAM neural navigation"
        onClick={() => {
          if (collapsed) toggleCollapse();
        }}
      >
        {/* Deep background */}
        <div className="absolute inset-0 border-r border-emerald-400/10 bg-[#050908]/95 backdrop-blur-xl" />

        {/* =====================================================
            COLLAPSED MINI TRIGGER VIEW
        ===================================================== */}
        {collapsed ? (
          <div className="relative flex h-full w-full flex-col items-center justify-between py-6">
            {/* Top pulse beacon */}
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#2ee59d]"
            />

            {/* Vertical scroll progress fill track */}
            <div className="relative my-4 w-0.5 flex-1 bg-white/10">
              <div
                style={{ height: `${scrollPercent}%` }}
                className="w-full bg-emerald-400 shadow-[0_0_8px_#2ee59d]"
              />
            </div>

            {/* Expand button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse();
              }}
              title="Expand Neural Rail"
              aria-label="Expand Neural Rail"
              className="flex h-6 w-6 items-center justify-center rounded text-emerald-400 transition hover:bg-emerald-400/20"
            >
              <span className="text-[10px] font-bold">▶</span>
            </button>
          </div>
        ) : (
          <>
            {/* =====================================================
                AMBIENT GLOW
            ===================================================== */}
            <motion.div
              animate={{
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute left-5.75 top-22.5 h-[calc(100%-180px)] w-8 rounded-full bg-emerald-500/10 blur-2xl"
            />

            {/* =====================================================
                TOP VYUHAM CORE (EXPANDS HUD DRAWER)
            ===================================================== */}
            <button
              onClick={() => {
                if (open) {
                  cyberAudio.playCollapse();
                } else {
                  cyberAudio.playExpand();
                }
                setOpen((v) => !v);
              }}
              className="group absolute left-1/2 top-4 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center cursor-pointer"
              aria-label="Open VYUHAM navigation drawer"
              title="Open Navigation Menu"
            >
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full border border-emerald-400/30 border-dashed"
              />

              {/* Second ring */}
              <motion.div
                animate={{
                  scale: [0.9, 1.08, 0.9],
                  opacity: [0.35, 0.8, 0.35],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-1.25 rounded-full border border-cyan-400/40"
              />

              {/* Core */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 5px rgba(46,229,157,.3)",
                    "0 0 18px rgba(46,229,157,.8)",
                    "0 0 5px rgba(46,229,157,.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="relative h-3 w-3 rounded-full bg-emerald-400"
              />

              {/* Core crosshair */}
              <span className="absolute -left-1 top-1/2 h-px w-11 -translate-y-1/2 bg-emerald-400/20" />
              <span className="absolute left-1/2 -top-1 h-11 w-px -translate-x-1/2 bg-emerald-400/20" />
            </button>

            {/* =====================================================
                DEPTH & SYSTEM READOUT
            ===================================================== */}
            <div className="absolute left-1/2 top-15 -translate-x-1/2">
              <span className="font-mono text-[7px] tracking-[0.25em] text-emerald-400/60 [writing-mode:vertical-rl]">
                DEPTH // {scrollPercent}%
              </span>
            </div>

            {/* =====================================================
                DYNAMIC SCROLL-PROGRESS NEURAL SPINE
            ===================================================== */}
            <div className="absolute left-1/2 top-25 bottom-28 w-px -translate-x-1/2">
              {/* Spine background track */}
              <div className="absolute inset-0 bg-emerald-400/15" />

              {/* Dynamic scroll progress line */}
              <div
                style={{ height: `${scrollPercent}%` }}
                className="absolute left-0 top-0 w-full bg-linear-to-b from-cyan-400 via-emerald-300 to-emerald-400 shadow-[0_0_8px_rgba(46,229,157,0.9)]"
              />

              {/* Traveling scroll beacon bead */}
              <div
                style={{ top: `${scrollPercent}%` }}
                className="absolute -left-1 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-cyan-300 bg-emerald-400 shadow-[0_0_12px_#2ee59d]"
              />

              {/* Ambient moving pulse */}
              <motion.div
                animate={{
                  top: ["0%", "100%"],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 h-14 w-0.5 -translate-x-1/2 bg-linear-to-b from-transparent via-cyan-300 to-transparent shadow-[0_0_10px_rgba(34,211,238,.8)]"
              />
            </div>

            {/* =====================================================
                NAVIGATION NODES
            ===================================================== */}
            <div className="absolute left-0 top-24 flex w-full flex-col gap-0.5">
              {navItems.map((item, index) => {
                const isActive = activeItem === item.num;
                const isHovered = hovered === item.num;

                return (
                  <div
                    key={item.num}
                    className="relative flex h-9.5 items-center"
                    onMouseEnter={() => {
                      setHovered(item.num);
                      cyberAudio.playHover();
                    }}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Horizontal neural branch */}
                    <motion.div
                      animate={{
                        width: isActive || isHovered ? 20 : 9,
                        opacity: isActive || isHovered ? 1 : 0.35,
                      }}
                      className="absolute left-7.25 h-px origin-left bg-linear-to-r from-emerald-400 to-cyan-300"
                    />

                    {/* Node Button / Link */}
                    <Link
                      href={item.href}
                      onClick={(e) => handleItemClick(e, item)}
                      aria-label={item.label}
                      className="absolute left-1/2 z-10 -translate-x-1/2"
                    >
                      <motion.div
                        animate={{
                          scale: isActive || isHovered ? 1.35 : 1,
                          boxShadow:
                            isActive || isHovered
                              ? "0 0 14px rgba(46,229,157,.9)"
                              : "0 0 0px rgba(46,229,157,0)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className={`relative h-2.25 w-2.25 rounded-full border ${
                          isActive || isHovered
                            ? "border-cyan-300 bg-emerald-400"
                            : "border-emerald-400/40 bg-[#07100c]"
                        }`}
                      >
                        {/* Inner core */}
                        {(isActive || isHovered) && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0.5 rounded-full bg-white"
                          />
                        )}

                        {/* Pulse ring */}
                        {isActive && (
                          <motion.span
                            animate={{
                              scale: [1, 2.4],
                              opacity: [0.7, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                            className="absolute inset-0 rounded-full border border-emerald-400"
                          />
                        )}
                      </motion.div>
                    </Link>

                    {/* =================================================
                        HUD LABEL TOOLTIP
                    ================================================= */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: -6, scale: 0.96 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -6, scale: 0.96 }}
                          transition={{ duration: 0.12 }}
                          className="absolute left-11 z-30 whitespace-nowrap"
                        >
                          <Link
                            href={item.href}
                            onClick={(e) => handleItemClick(e, item)}
                            className="group flex items-center gap-2 rounded-sm border border-emerald-400/20 bg-[#07100c]/95 px-2.5 py-1.5 shadow-[0_0_25px_rgba(46,229,157,.12)] backdrop-blur-md"
                          >
                            <span className="font-mono text-[8px] text-emerald-400/60">
                              {item.num}
                            </span>

                            <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-emerald-100">
                              {item.label}
                            </span>

                            <span className="text-[8px] text-cyan-400">
                              →
                            </span>

                            {/* Keyboard Hotkey Badge */}
                            {index < 10 && (
                              <span className="ml-1 rounded border border-white/10 bg-white/5 px-1 py-0.2 font-mono text-[7px] text-muted">
                                {index === 9 ? "0" : index + 1}
                              </span>
                            )}
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Connection particles on hover */}
                    {isHovered && (
                      <>
                        <motion.span
                          initial={{ left: 29, opacity: 0 }}
                          animate={{ left: 42, opacity: [0, 1, 0] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                          }}
                          className="absolute h-0.75 w-0.75 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]"
                        />

                        <motion.span
                          initial={{ left: 29, opacity: 0 }}
                          animate={{ left: 39, opacity: [0, 1, 0] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: 0.25,
                          }}
                          className="absolute h-0.5 w-0.5 rounded-full bg-emerald-300"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* =====================================================
                BOTTOM CONTROLS (AUDIO + TERMINAL + ZEN COLLAPSE)
            ===================================================== */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5">
              {/* Audio Sound FX Toggle */}
              <button
                type="button"
                onClick={() => setMuted(cyberAudio.toggleMute())}
                className="group relative flex h-6 w-6 items-center justify-center rounded border border-emerald-400/20 bg-emerald-400/5 text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-400/10 cursor-pointer"
                aria-label={muted ? "Unmute UI sound effects" : "Mute UI sound effects"}
                title={muted ? "Audio FX Muted [M]" : "Audio FX Online [M]"}
              >
                {muted ? (
                  <span className="text-[10px] opacity-40">✕</span>
                ) : (
                  <span className="text-[10px]">♪</span>
                )}
                {/* Tooltip */}
                <span className="pointer-events-none absolute bottom-0 left-8 hidden whitespace-nowrap rounded border border-emerald-400/20 bg-[#07100c] px-2 py-1 font-mono text-[7px] text-emerald-300 group-hover:block z-40">
                  AUDIO // {muted ? "MUTED [M]" : "ACTIVE [M]"}
                </span>
              </button>

              {/* Cyber Terminal Launcher */}
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  window.dispatchEvent(new Event("open-cyber-terminal"));
                }}
                className="group relative flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/5 cursor-pointer hover:scale-110 transition-transform"
                aria-label="Open Cyber Terminal Console"
                title="Cyber Terminal [~]"
              >
                <span className="font-mono text-[9px] font-bold text-emerald-300">
                  ◈
                </span>
                {/* Tooltip */}
                <span className="pointer-events-none absolute bottom-0 left-8 hidden whitespace-nowrap rounded border border-emerald-400/20 bg-[#07100c] px-2 py-1 font-mono text-[7px] text-emerald-300 group-hover:block z-40">
                  TERMINAL [~]
                </span>
              </button>

              {/* Zen Mini-Mode Collapse Button */}
              <button
                type="button"
                onClick={toggleCollapse}
                className="group relative flex h-5 w-5 items-center justify-center rounded text-white/30 hover:text-emerald-300 transition-colors cursor-pointer"
                aria-label="Collapse neural spine"
                title="Zen Mode / Collapse"
              >
                <span className="text-[8px]">◀</span>
                {/* Tooltip */}
                <span className="pointer-events-none absolute bottom-0 left-8 hidden whitespace-nowrap rounded border border-emerald-400/20 bg-[#07100c] px-2 py-1 font-mono text-[7px] text-emerald-300 group-hover:block z-40">
                  COLLAPSE RAIL
                </span>
              </button>
            </div>

            {/* =====================================================
                DYNAMIC PING & TELEMETRY STRIP
            ===================================================== */}
            <div className="absolute bottom-22 left-1.25">
              <div className="flex flex-col items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#2ee59d]" />

                <span className="font-mono text-[6px] tracking-[0.2em] text-emerald-400/40 [writing-mode:vertical-rl]">
                  PING // {ping}ms
                </span>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* =========================================================
          EXPANDED NEURAL HUD DRAWER MODAL
      ========================================================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                cyberAudio.playCollapse();
                setOpen(false);
              }}
              className="fixed inset-0 z-40 hidden bg-black/50 backdrop-blur-[2px] md:block"
            />

            {/* HUD Modal */}
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 24,
              }}
              className="fixed left-14.5 top-1/2 z-50 hidden w-87.5 -translate-y-1/2 overflow-hidden rounded-md border border-emerald-400/20 bg-[#050908]/95 shadow-[0_0_80px_rgba(46,229,157,.12)] backdrop-blur-2xl md:block"
            >
              {/* HUD top header */}
              <div className="flex items-center justify-between border-b border-emerald-400/10 px-5 py-3">
                <div>
                  <div className="font-mono text-[9px] tracking-[0.3em] text-emerald-400">
                    VYUHAM // NEURAL CORE
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="font-mono text-[8px] text-muted">
                      SYSTEM ONLINE // {ping}ms
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[8px] text-emerald-400/40">
                    N-{String(navItems.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playCollapse();
                      setOpen(false);
                    }}
                    className="text-white/40 hover:text-emerald-400 font-mono text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Navigation Nodes List */}
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between font-mono text-[8px] tracking-[0.25em] text-muted">
                  <span>/// NAVIGATION NODES</span>
                  <span>HOTKEYS: [0-9]</span>
                </div>

                <div className="max-h-[calc(100vh-230px)] space-y-0.5 overflow-y-auto pr-1">
                  {navItems.map((item, index) => {
                    const isActive = activeItem === item.num;

                    return (
                      <Link
                        key={item.num}
                        href={item.href}
                        onClick={(e) => {
                          handleItemClick(e, item);
                          setOpen(false);
                        }}
                        onMouseEnter={() => cyberAudio.playHover()}
                        className="group relative flex items-center gap-4 overflow-hidden rounded-sm border border-transparent px-3 py-2 transition hover:border-emerald-400/20 hover:bg-emerald-400/5"
                      >
                        {/* Node Pip */}
                        <div className="relative flex h-5 w-5 items-center justify-center">
                          <span
                            className={`absolute h-2 w-2 rounded-full ${
                              isActive
                                ? "bg-emerald-400 shadow-[0_0_12px_rgba(46,229,157,.9)]"
                                : "bg-emerald-400/20 group-hover:bg-emerald-400"
                            }`}
                          />

                          {isActive && (
                            <motion.span
                              animate={{
                                scale: [1, 2],
                                opacity: [0.6, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                              className="absolute h-3 w-3 rounded-full border border-emerald-400"
                            />
                          )}
                        </div>

                        <span className="font-mono text-[9px] text-muted">
                          {item.num}
                        </span>

                        <span
                          className={`font-display text-sm font-bold tracking-wider ${
                            isActive
                              ? "text-emerald-300"
                              : "text-paper group-hover:text-emerald-300"
                          }`}
                        >
                          {item.label}
                        </span>

                        <div className="ml-auto flex items-center gap-2">
                          {index < 10 && (
                            <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[8px] text-white/30">
                              {index === 9 ? "0" : index + 1}
                            </span>
                          )}
                          <span className="font-mono text-[8px] text-muted transition group-hover:text-emerald-400">
                            {isActive ? "ACTIVE" : "NODE"}
                          </span>
                        </div>

                        {/* Hover energy streak */}
                        <motion.div
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.7 }}
                          className="pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-emerald-400/10 to-transparent"
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* System Status / Diagnostics */}
                <div className="mt-3 flex w-full items-center justify-between rounded border border-emerald-400/20 bg-emerald-400/5 px-3 py-2.5 font-mono text-[9px] text-emerald-300">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span>[ NEURAL LINK // ACTIVE ]</span>
                  </div>
                  <span className="font-semibold text-emerald-400/60">SYS-26 // {ping}ms</span>
                </div>
              </div>

              {/* Footer info */}
              <div className="border-t border-emerald-400/10 px-5 py-3">
                <div className="flex items-center justify-between font-mono text-[7px] text-muted">
                  <span>DIGITAL UNIVERSITY KERALA</span>
                  <span className="text-emerald-400/60">
                    OCT 30 — NOV 01
                  </span>
                </div>
              </div>

              {/* Corner tech accents */}
              <span className="absolute left-0 top-0 h-8 w-px bg-emerald-400/50" />
              <span className="absolute left-0 top-0 h-px w-8 bg-emerald-400/50" />
              <span className="absolute bottom-0 right-0 h-8 w-px bg-cyan-400/50" />
              <span className="absolute bottom-0 right-0 h-px w-8 bg-cyan-400/50" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
