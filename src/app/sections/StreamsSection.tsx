"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

const streams = [
  {
    number: "01",
    glyph: "⌁",
    title: "Technology",
    description: "Hackathons, coding, CTF and innovation.",
    slug: "tech",
    code: "TECH PROTOCOL",
    signal: "96%",
    status: "ONLINE",
    color: "emerald",
  },
  {
    number: "02",
    glyph: "◈",
    title: "Culture",
    description: "Stage, visual arts, words and rhythm.",
    slug: "culture",
    code: "CULTURE PROTOCOL",
    signal: "91%",
    status: "ONLINE",
    color: "cyan",
  },
  {
    number: "03",
    glyph: "✦",
    title: "Gaming",
    description: "Esports, strategy and zero-sum glory.",
    slug: "gaming",
    code: "GAMING PROTOCOL",
    signal: "98%",
    status: "ONLINE",
    color: "violet",
  },
  {
    number: "04",
    glyph: "⊹",
    title: "Management",
    description: "Ideas designed to move the world forward.",
    slug: "management",
    code: "MANAGEMENT PROTOCOL",
    signal: "88%",
    status: "ONLINE",
    color: "lime",
  },
] as const;

const colorStyles = {
  emerald: {
    text: "text-emerald-300",
    softText: "text-emerald-300/60",
    border: "border-emerald-400/30",
    softBorder: "border-emerald-400/15",
    bg: "bg-emerald-400/[0.035]",
    line: "bg-emerald-300",
    shadow:
      "shadow-[0_0_18px_rgba(52,211,153,0.95)]",
    glow:
      "shadow-[0_0_50px_rgba(52,211,153,0.15)]",
    ring: "border-emerald-300/40",
  },

  cyan: {
    text: "text-cyan-300",
    softText: "text-cyan-300/60",
    border: "border-cyan-400/30",
    softBorder: "border-cyan-400/15",
    bg: "bg-cyan-400/[0.035]",
    line: "bg-cyan-300",
    shadow:
      "shadow-[0_0_18px_rgba(34,211,238,0.95)]",
    glow:
      "shadow-[0_0_50px_rgba(34,211,238,0.15)]",
    ring: "border-cyan-300/40",
  },

  violet: {
    text: "text-violet-300",
    softText: "text-violet-300/60",
    border: "border-violet-400/30",
    softBorder: "border-violet-400/15",
    bg: "bg-violet-400/[0.035]",
    line: "bg-violet-300",
    shadow:
      "shadow-[0_0_18px_rgba(167,139,250,0.95)]",
    glow:
      "shadow-[0_0_50px_rgba(167,139,250,0.15)]",
    ring: "border-violet-300/40",
  },

  lime: {
    text: "text-lime-300",
    softText: "text-lime-300/60",
    border: "border-lime-400/30",
    softBorder: "border-lime-400/15",
    bg: "bg-lime-400/[0.035]",
    line: "bg-lime-300",
    shadow:
      "shadow-[0_0_18px_rgba(163,230,53,0.95)]",
    glow:
      "shadow-[0_0_50px_rgba(163,230,53,0.15)]",
    ring: "border-lime-300/40",
  },
};

type StreamColor = keyof typeof colorStyles;

function EnergyNode({
  color = "emerald",
  size = "normal",
  override = false,
}: {
  color?: StreamColor;
  size?: "normal" | "large";
  override?: boolean;
}) {
  const style = colorStyles[color];
  const large = size === "large";

  return (
    <div
      className={`relative flex items-center justify-center ${large ? "h-16 w-16" : "h-10 w-10"
        }`}
    >
      {/* Outer ring */}
      <motion.div
        className={`absolute inset-0 rounded-full border ${style.ring}`}
        animate={{
          rotate: 360,
          scale: override
            ? [1, 1.3, 1]
            : [1, 1.08, 1],
        }}
        transition={{
          rotate: {
            duration: override ? 2 : 8,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: override ? 0.9 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Secondary ring */}
      <motion.div
        className={`absolute rounded-full border border-emerald-300/20 ${large ? "inset-2" : "inset-1.5"
          }`}
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: override ? 1.5 : 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Glow */}
      <motion.div
        className={`absolute rounded-full ${style.line} ${style.shadow}`}
        animate={{
          scale: override
            ? [0.5, 1.7, 0.5]
            : [0.65, 1.15, 0.65],
          opacity: override
            ? [0.5, 1, 0.5]
            : [0.5, 1, 0.5],
        }}
        transition={{
          duration: override ? 0.9 : 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: large ? 11 : 7,
          height: large ? 11 : 7,
        }}
      />

      {/* Core */}
      <div
        className={`relative rounded-full border border-white/30 bg-[#07140e] ${large ? "h-5 w-5" : "h-3 w-3"
          }`}
      >
        <div
          className={`absolute inset-1 rounded-full ${style.line} ${style.shadow}`}
        />
      </div>
    </div>
  );
}

function StreamGlyph({
  stream,
  index,
  override,
}: {
  stream: (typeof streams)[number];
  index: number;
  override: boolean;
}) {
  const style = colorStyles[stream.color];

  return (
    <div className="relative flex h-32 items-center justify-center">
      {/* Outer orbit */}
      <motion.div
        aria-hidden="true"
        className={`absolute h-28 w-28 rounded-full border ${style.ring}`}
        animate={{
          rotate: 360,
          scale: override
            ? [1, 1.15, 1]
            : [1, 1, 1],
        }}
        transition={{
          rotate: {
            duration: override ? 3 : 15 + index * 2,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <div
          className={`absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${style.line} ${style.shadow}`}
        />
      </motion.div>

      {/* Secondary orbit */}
      <motion.div
        aria-hidden="true"
        className={`absolute h-20 w-20 rounded-full border border-dashed ${style.softBorder}`}
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: override ? 2 : 9 + index,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner glow */}
      <motion.div
        className={`absolute h-16 w-16 rounded-full ${style.bg} blur-xl`}
        animate={{
          scale: override
            ? [0.7, 1.5, 0.7]
            : [0.8, 1.25, 0.8],
          opacity: override
            ? [0.4, 1, 0.4]
            : [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: override ? 1.2 : 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glyph */}
      <motion.div
        className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border ${style.border} bg-[#06110c]/90`}
        animate={{
          y: [0, -4, 0],
          scale: override
            ? [1, 1.12, 1]
            : [1, 1.04, 1],
        }}
        transition={{
          duration: override ? 0.8 : 3 + index * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span
          className={`font-display text-[48px] leading-none ${style.text}`}
        >
          {stream.glyph}
        </span>
      </motion.div>
    </div>
  );
}

function SignalMeter({
  signal,
  color,
  override,
}: {
  signal: string;
  color: StreamColor;
  override: boolean;
}) {
  const style = colorStyles[color];
  const active = Math.round(parseInt(signal) / 10);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[7px] tracking-[0.22em] text-white/30">
          SIGNAL
        </span>

        <span
          className={`font-mono text-[7px] tracking-[0.18em] ${style.text}`}
        >
          {override ? "100%" : signal}
        </span>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.span
            key={index}
            className={`h-1 flex-1 rounded-full ${override || index < active
                ? style.line
                : "bg-white/10"
              }`}
            animate={
              override
                ? {
                  opacity: [0.35, 1, 0.35],
                }
                : undefined
            }
            transition={{
              duration: 0.6,
              repeat: override ? Infinity : 0,
              delay: index * 0.04,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function StreamsSection() {
  // ============================================================
  // EASTER EGG STATE
  // ============================================================

  const [overrideMode, setOverrideMode] = useState(false);
  const [overrideMessage, setOverrideMessage] = useState("");

  const coreClicks = useRef(0);
  const coreClickTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const sequenceIndex = useRef(0);
  const sequenceTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const overrideTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // ============================================================
  // ACTIVATE OVERRIDE
  // ============================================================

  const activateOverride = (message: string) => {
    setOverrideMessage(message);
    setOverrideMode(true);

    if (overrideTimer.current) {
      clearTimeout(overrideTimer.current);
    }

    overrideTimer.current = setTimeout(() => {
      setOverrideMode(false);
      setOverrideMessage("");
    }, 7500);
  };

  // ============================================================
  // EASTER EGG 01
  // CORE × 3
  // ============================================================

  const handleCoreClick = () => {
    coreClicks.current += 1;

    if (coreClickTimer.current) {
      clearTimeout(coreClickTimer.current);
    }

    if (coreClicks.current >= 3) {
      activateOverride("STREAM CORE OVERRIDE");
      coreClicks.current = 0;
      return;
    }

    coreClickTimer.current = setTimeout(() => {
      coreClicks.current = 0;
    }, 1200);
  };

  // ============================================================
  // EASTER EGG 02
  // TECHNOLOGY → CULTURE → GAMING → MANAGEMENT
  // ============================================================

  const handleStreamClick = (
    index: number,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    const expected = sequenceIndex.current;

    // Normal browsing if the sequence hasn't started
    // and the user didn't click Technology.
    if (expected === 0 && index !== 0) {
      return;
    }

    // Correct sequence node
    if (index === expected) {
      event.preventDefault();

      sequenceIndex.current += 1;

      if (sequenceIndex.current === streams.length) {
        sequenceIndex.current = 0;

        if (sequenceTimer.current) {
          clearTimeout(sequenceTimer.current);
        }

        activateOverride(
          "CORE SYNCHRONIZATION // COMPLETE"
        );

        return;
      }

      if (sequenceTimer.current) {
        clearTimeout(sequenceTimer.current);
      }

      sequenceTimer.current = setTimeout(() => {
        sequenceIndex.current = 0;
      }, 2500);

      return;
    }

    // Wrong node after sequence started.
    // Reset and allow the clicked card to work normally.
    sequenceIndex.current = 0;

    if (sequenceTimer.current) {
      clearTimeout(sequenceTimer.current);
    }
  };

  // ============================================================
  // EASTER EGG 03
  // KONAMI STYLE
  // ↑ ↑ ↓ ↓ ← → ← → B A
  // ============================================================

  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];

    let keyIndex = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      const key =
        event.key.length === 1
          ? event.key.toLowerCase()
          : event.key;

      if (key === konamiCode[keyIndex]) {
        keyIndex += 1;

        if (keyIndex === konamiCode.length) {
          activateOverride("VYUHAM STREAM OVERRIDE");
          keyIndex = 0;
        }
      } else {
        keyIndex = key === konamiCode[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      if (coreClickTimer.current) {
        clearTimeout(coreClickTimer.current);
      }

      if (sequenceTimer.current) {
        clearTimeout(sequenceTimer.current);
      }

      if (overrideTimer.current) {
        clearTimeout(overrideTimer.current);
      }
    };
  }, []);

  return (
    <PageEntranceGate phase="streams">
      <section
        id="events"
        className="
          relative
          overflow-hidden
          bg-[#030806]
          py-24
          md:py-36
        "
      >
        {/* ============================================================
            EASTER EGG OVERRIDE SCREEN
        ============================================================ */}

        <AnimatePresence>
          {overrideMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                pointer-events-none
                fixed
                inset-0
                z-9999
                flex
                items-center
                justify-center
                overflow-hidden
                bg-[#020604]/85
                backdrop-blur-[3px]
              "
            >
              {/* Core atmosphere */}
              <motion.div
                className="
                  absolute
                  h-[80vw]
                  w-[80vw]
                  rounded-full
                  bg-emerald-400/[0.07]
                  blur-[100px]
                "
                animate={{
                  scale: [0.7, 1.15, 0.7],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Expanding radar rings */}
              {[0, 1, 2].map((ring) => (
                <motion.div
                  key={ring}
                  className="
                    absolute
                    h-56
                    w-56
                    rounded-full
                    border
                    border-emerald-300/20
                  "
                  initial={{
                    scale: 0.2,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0.2, 2.5],
                    opacity: [0.7, 0],
                  }}
                  transition={{
                    duration: 2.4,
                    delay: ring * 0.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Terminal */}
              <motion.div
                initial={{
                  scale: 0.7,
                  y: 20,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  y: 0,
                  opacity: 1,
                }}
                className="
                  relative
                  w-[min(620px,calc(100%-32px))]
                  overflow-hidden
                  border
                  border-emerald-300/30
                  bg-[#030806]/95
                  p-8
                  text-center
                  shadow-[0_0_100px_rgba(52,211,153,0.2)]
                  backdrop-blur-xl
                  md:p-10
                "
              >
                {/* HUD corners */}
                <div className="absolute left-3 top-3 h-7 w-7 border-l border-t border-emerald-300/60" />
                <div className="absolute right-3 top-3 h-7 w-7 border-r border-t border-emerald-300/60" />
                <div className="absolute bottom-3 left-3 h-7 w-7 border-b border-l border-emerald-300/60" />
                <div className="absolute bottom-3 right-3 h-7 w-7 border-b border-r border-emerald-300/60" />

                <div className="font-mono text-[7px] tracking-[0.4em] text-emerald-300/60">
                  VYUHAM&apos;26 // STREAM NETWORK
                </div>

                <motion.div
                  className="mt-6 font-mono text-[9px] tracking-[0.35em] text-white/30"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  {">"} SYSTEM OVERRIDE
                </motion.div>

                <motion.h3
                  className="
                    mt-4
                    font-display
                    text-[clamp(28px,5vw,54px)]
                    font-semibold
                    tracking-[-0.04em]
                    text-white
                  "
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(52,211,153,0)",
                      "0 0 30px rgba(52,211,153,0.8)",
                      "0 0 0px rgba(52,211,153,0)",
                    ],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                  }}
                >
                  {overrideMessage}
                </motion.h3>

                {/* Four nodes */}
                <div className="mt-8 grid grid-cols-4 gap-2">
                  {streams.map((stream, index) => {
                    const style =
                      colorStyles[stream.color];

                    return (
                      <motion.div
                        key={stream.slug}
                        className={`
                          border
                          ${style.softBorder}
                          bg-white/2
                          p-3
                        `}
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.12,
                        }}
                      >
                        <motion.div
                          className={`mx-auto h-2 w-2 rounded-full ${style.line} ${style.shadow}`}
                          animate={{
                            scale: [0.7, 1.4, 0.7],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: index * 0.15,
                          }}
                        />

                        <div className="mt-2 font-mono text-[6px] tracking-[0.15em] text-white/35">
                          {stream.number}
                        </div>

                        <div
                          className={`mt-1 font-mono text-[6px] tracking-[0.12em] ${style.text}`}
                        >
                          ONLINE
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Network status */}
                <div className="mt-7 flex items-center justify-center gap-3">
                  <motion.span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-emerald-300
                      shadow-[0_0_12px_rgba(52,211,153,1)]
                    "
                    animate={{
                      scale: [0.7, 1.5, 0.7],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                    }}
                  />

                  <span className="font-mono text-[7px] tracking-[0.3em] text-emerald-300/70">
                    ALL STREAMS // SYNCHRONIZED
                  </span>
                </div>

                <div className="mt-4 font-mono text-[6px] tracking-[0.25em] text-white/15">
                  NETWORK STATUS // 04 / 04 NODES ACTIVE
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================
            ATMOSPHERIC FIELD
        ============================================================ */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[8%]
            top-[18%]
            h-96
            w-96
            rounded-full
            bg-emerald-400/[0.035]
            blur-[120px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[8%]
            right-[5%]
            h-96
            w-96
            rounded-full
            bg-cyan-400/2.5
            blur-[120px]
          "
        />

        {/* Central atmosphere */}
        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[30%]
            h-125
            w-125
            -translate-x-1/2
            rounded-full
            bg-emerald-400/[0.018]
            blur-[140px]
          "
          animate={{
            scale: [0.9, 1.08, 0.9],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ============================================================
            GLOBAL SIGNAL SWEEP
        ============================================================ */}

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-0
            z-30
            h-px
            bg-linear-to-r
            from-transparent
            via-emerald-300/50
            to-transparent
          "
          animate={{
            x: ["-100%", "100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />

        <div className="mx-auto w-[min(1280px,calc(100%-32px))] md:w-[min(1280px,calc(100%-64px))]">
          {/* ============================================================
              HEADER
          ============================================================ */}

          <AnimatedSection>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <motion.span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-emerald-300
                      shadow-[0_0_12px_rgba(52,211,153,0.9)]
                    "
                    animate={{
                      scale: [0.8, 1.3, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />

                  <Kicker>
                    02 / Choose your protocol
                  </Kicker>
                </div>

                <div className="font-mono text-[7px] tracking-[0.3em] text-emerald-300/40">
                  STREAM NETWORK // VYUHAM&apos;26
                </div>

                <h2
                  className="
                    mt-4
                    font-display
                    text-[clamp(48px,6vw,88px)]
                    font-semibold
                    leading-[0.82]
                    tracking-tighter
                  "
                >
                  <span className="text-white">
                    ENTER THE
                  </span>

                  <br />

                  <span
                    className="
                      bg-linear-to-r
                      from-white
                      via-emerald-300
                      to-cyan-300
                      bg-clip-text
                      text-transparent
                    "
                  >
                    ARENA.
                  </span>
                </h2>
              </div>

              <div className="max-w-sm md:text-right">
                <p className="text-sm leading-[1.8] text-white/50">
                  Four streams. One charged-up campus.
                  <br />
                  Select your next challenge.
                </p>

                <div className="mt-5 flex items-center justify-end gap-3">
                  <span className="h-px w-8 bg-emerald-400/40" />

                  <span className="font-mono text-[7px] tracking-[0.25em] text-emerald-300/60">
                    STREAM NETWORK // ONLINE
                  </span>

                  <span className="font-mono text-emerald-300/50">
                    ///
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ============================================================
              STREAM CORE NETWORK
          ============================================================ */}

          <div className="relative mt-12 md:mt-16">
            {/* ========================================================
                DESKTOP NETWORK
            ======================================================== */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-x-0
                -top-28
                -bottom-17.5
                z-0
                hidden
                lg:block
              "
            >
              <div className="absolute inset-x-[8%] top-[25%] h-32 rounded-full bg-emerald-400/2.5 blur-3xl" />

              <svg
                viewBox="0 0 1000 620"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                <defs>
                  <filter
                    id="streamGlow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                  >
                    <feGaussianBlur
                      stdDeviation="3"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <linearGradient
                    id="networkGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor="#34d399"
                    />
                    <stop
                      offset="45%"
                      stopColor="#22d3ee"
                    />
                    <stop
                      offset="65%"
                      stopColor="#a78bfa"
                    />
                    <stop
                      offset="100%"
                      stopColor="#a3e635"
                    />
                  </linearGradient>

                  <linearGradient
                    id="greenNetwork"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor="#34d399"
                    />
                    <stop
                      offset="50%"
                      stopColor="#22d3ee"
                    />
                    <stop
                      offset="100%"
                      stopColor="#34d399"
                    />
                  </linearGradient>
                </defs>

                {/* TOP CORE → STREAMS */}

                <path
                  d="M500 45 C500 90 500 110 500 135"
                  stroke="#34d399"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  fill="none"
                />

                <path
                  d="M500 135 C410 175 320 205 125 215"
                  stroke="url(#greenNetwork)"
                  strokeOpacity="0.65"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M500 135 C455 170 415 200 375 215"
                  stroke="url(#greenNetwork)"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M500 135 C545 170 585 200 625 215"
                  stroke="url(#networkGradient)"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M500 135 C590 175 680 205 875 215"
                  stroke="url(#greenNetwork)"
                  strokeOpacity="0.65"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                {/* CARD ↔ CARD */}

                <path
                  d="M125 215 C210 205 290 205 375 215"
                  stroke="url(#greenNetwork)"
                  strokeOpacity="0.7"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M375 215 C455 205 545 205 625 215"
                  stroke="url(#greenNetwork)"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M625 215 C710 205 790 205 875 215"
                  stroke="url(#greenNetwork)"
                  strokeOpacity="0.7"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                {/* BOTTOM RETURN */}

                <path
                  d="M125 505 C125 555 180 570 250 570"
                  stroke="#34d399"
                  strokeOpacity="0.7"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M375 505 C375 550 420 570 500 570"
                  stroke="#22d3ee"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M625 505 C625 550 580 570 500 570"
                  stroke="#a78bfa"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M875 505 C875 555 820 570 750 570"
                  stroke="#a3e635"
                  strokeOpacity="0.7"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M250 570 C330 570 420 570 500 570"
                  stroke="url(#greenNetwork)"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                <path
                  d="M500 570 C580 570 670 570 750 570"
                  stroke="url(#networkGradient)"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  fill="none"
                  filter="url(#streamGlow)"
                />

                {/* Moving particles */}

                {[
                  {
                    path: "M125 215 C210 205 290 205 375 215",
                    delay: 0,
                  },
                  {
                    path: "M375 215 C455 205 545 205 625 215",
                    delay: 0.8,
                  },
                  {
                    path: "M625 215 C710 205 790 205 875 215",
                    delay: 1.6,
                  },
                  {
                    path: "M500 135 C410 175 320 205 125 215",
                    delay: 0.5,
                  },
                  {
                    path: "M500 135 C590 175 680 205 875 215",
                    delay: 1.2,
                  },
                ].map((particle, index) => (
                  <motion.circle
                    key={index}
                    r="3"
                    fill="#a7f3d0"
                    filter="url(#streamGlow)"
                  >
                    <animateMotion
                      dur={`${3.5 + index * 0.25}s`}
                      repeatCount="indefinite"
                      begin={`${particle.delay}s`}
                      path={particle.path}
                    />
                  </motion.circle>
                ))}
              </svg>

              {/* TOP CORE */}

              <motion.button
                type="button"
                onClick={handleCoreClick}
                aria-label="VYUHAM Stream Core"
                className="
                  absolute
                  left-1/2
                  top-0
                  z-40
                  -translate-x-1/2
                  cursor-pointer
                  border-0
                  bg-transparent
                  p-0
                  outline-none
                "
                whileTap={{
                  scale: 0.9,
                }}
              >
                <div className="relative flex flex-col items-center">
                  <motion.div
                    animate={
                      overrideMode
                        ? {
                          scale: [1, 1.3, 1],
                          rotate: [0, 180, 360],
                        }
                        : undefined
                    }
                    transition={{
                      duration: 1.2,
                      repeat: overrideMode
                        ? Infinity
                        : 0,
                      ease: "linear",
                    }}
                  >
                    <EnergyNode
                      color="emerald"
                      size="large"
                      override={overrideMode}
                    />
                  </motion.div>

                  <div className="-mt-1 text-center">
                    <div className="font-display text-sm tracking-[0.15em] text-white/80">
                      VYUHAM
                      <span className="text-emerald-300">
                        &apos;26
                      </span>
                    </div>

                    <div className="mt-1 font-mono text-[6px] tracking-[0.35em] text-emerald-300/70">
                      STREAM CORE
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* CARD NODES */}

              <div className="absolute left-[12.5%] top-48.75 -translate-x-1/2">
                <EnergyNode
                  color="emerald"
                  override={overrideMode}
                />
              </div>

              <div className="absolute left-[37.5%] top-48.75 -translate-x-1/2">
                <EnergyNode
                  color="cyan"
                  override={overrideMode}
                />
              </div>

              <div className="absolute left-[62.5%] top-48.75 -translate-x-1/2">
                <EnergyNode
                  color="violet"
                  override={overrideMode}
                />
              </div>

              <div className="absolute left-[87.5%] top-48.75 -translate-x-1/2">
                <EnergyNode
                  color="lime"
                  override={overrideMode}
                />
              </div>

              {/* BOTTOM CORE */}

              <motion.div
                className="absolute -bottom-1.25 left-1/2 -translate-x-1/2"
                animate={
                  overrideMode
                    ? {
                      scale: [1, 1.2, 1],
                    }
                    : undefined
                }
                transition={{
                  duration: 1,
                  repeat: overrideMode
                    ? Infinity
                    : 0,
                }}
              >
                <EnergyNode
                  color="emerald"
                  size="large"
                  override={overrideMode}
                />
              </motion.div>
            </div>

            {/* ========================================================
                STREAM CARDS
            ======================================================== */}

            <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {streams.map((stream, i) => {
                const style = colorStyles[stream.color];

                return (
                  <motion.div
                    key={stream.slug}
                    initial={{
                      opacity: 0,
                      y: 45,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: "-80px",
                    }}
                    transition={{
                      delay: i * 0.12,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative"
                  >
                    {/* Connection node */}

                    <div className="absolute left-1/2 top-0 z-30 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                      <motion.div
                        className={`h-3 w-3 rounded-full ${style.line} ${style.shadow}`}
                        animate={{
                          scale: overrideMode
                            ? [0.8, 1.8, 0.8]
                            : [0.8, 1.35, 0.8],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: overrideMode
                            ? 0.7
                            : 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.25,
                        }}
                      />
                    </div>

                    <Link
                      href={`/events?stream=${stream.slug}`}
                      onClick={(event) =>
                        handleStreamClick(i, event)
                      }
                      className="
                        group
                        relative
                        block
                        min-h-117.5
                        overflow-hidden
                        border
                        border-emerald-400/15
                        bg-[#04100a]/90
                        p-6
                        text-white
                        no-underline
                        backdrop-blur-sm
                        transition-all
                        duration-500
                        hover:border-emerald-300/40
                        hover:bg-[#06140d]
                        md:p-7
                      "
                    >
                      {/* Card atmosphere */}

                      <div
                        className={`
                          pointer-events-none
                          absolute
                          inset-0
                          ${style.bg}
                          opacity-0
                          transition-opacity
                          duration-500
                          group-hover:opacity-100
                        `}
                      />

                      {/* Card glow */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          left-1/2
                          top-1/2
                          h-64
                          w-64
                          -translate-x-1/2
                          -translate-y-1/2
                          rounded-full
                          bg-emerald-300/2.5
                          blur-3xl
                          opacity-0
                          transition-all
                          duration-700
                          group-hover:scale-125
                          group-hover:opacity-100
                        "
                      />

                      {/* HUD corners */}

                      <div
                        className={`absolute left-3 top-3 h-5 w-5 border-l border-t ${style.softBorder} transition-all duration-300 group-hover:h-8 group-hover:w-8`}
                      />

                      <div
                        className={`absolute right-3 top-3 h-5 w-5 border-r border-t ${style.softBorder} transition-all duration-300 group-hover:h-8 group-hover:w-8`}
                      />

                      <div
                        className={`absolute bottom-3 left-3 h-5 w-5 border-b border-l ${style.softBorder} transition-all duration-300 group-hover:h-8 group-hover:w-8`}
                      />

                      <div
                        className={`absolute bottom-3 right-3 h-5 w-5 border-b border-r ${style.softBorder} transition-all duration-300 group-hover:h-8 group-hover:w-8`}
                      />

                      {/* TOP TELEMETRY */}

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="font-mono text-[7px] tracking-[0.25em] text-white/35">
                          PROTOCOL // {stream.number}
                        </span>

                        <span
                          className={`flex items-center gap-2 font-mono text-[6px] tracking-[0.2em] ${style.softText}`}
                        >
                          <motion.span
                            className={`h-1.5 w-1.5 rounded-full ${style.line} ${style.shadow}`}
                            animate={{
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                          />

                          {stream.status}
                        </span>
                      </div>

                      {/* GLYPH */}

                      <div className="relative mt-8">
                        <StreamGlyph
                          stream={stream}
                          index={i}
                          override={overrideMode}
                        />
                      </div>

                      {/* TITLE */}

                      <div className="relative z-10 mt-5">
                        <h3
                          className="
                            font-display
                            text-[24px]
                            font-semibold
                            tracking-tight
                            text-white
                            md:text-[27px]
                          "
                        >
                          {stream.title}
                        </h3>

                        <p className="mt-2 max-w-62.5 text-xs leading-[1.7] text-white/40 transition-colors duration-300 group-hover:text-white/60">
                          {stream.description}
                        </p>
                      </div>

                      {/* SIGNAL */}

                      <div className="relative z-10 mt-6">
                        <SignalMeter
                          signal={stream.signal}
                          color={stream.color}
                          override={overrideMode}
                        />
                      </div>

                      {/* FOOTER */}

                      <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between md:left-7 md:right-7">
                        <span
                          className={`font-mono text-[7px] tracking-[0.2em] ${style.softText}`}
                        >
                          {stream.code}
                        </span>

                        <motion.span
                          className={`flex h-9 w-9 items-center justify-center rounded-full border ${style.softBorder} ${style.text}`}
                          whileHover={{
                            scale: 1.15,
                            rotate: 8,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                          }}
                        >
                          →
                        </motion.span>
                      </div>

                      {/* SCANNING BEAM */}

                      <motion.div
                        aria-hidden="true"
                        className={`pointer-events-none absolute left-0 right-0 top-0 h-px ${style.line} opacity-0 shadow-[0_0_14px_currentColor] group-hover:opacity-70`}
                        animate={{
                          top: ["0%", "100%"],
                        }}
                        transition={{
                          duration: overrideMode
                            ? 0.9
                            : 2.8,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1,
                        }}
                      />

                      {/* Bottom energy */}

                      <motion.div
                        aria-hidden="true"
                        className={`absolute bottom-0 left-0 h-px ${style.line} opacity-0 shadow-[0_0_15px_currentColor] group-hover:opacity-100`}
                        initial={{
                          width: "0%",
                        }}
                        whileHover={{
                          width: "100%",
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                      />

                      {/* Override scan */}

                      <AnimatePresence>
                        {overrideMode && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: "-100%",
                            }}
                            animate={{
                              opacity: [0, 0.8, 0],
                              y: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="
                              pointer-events-none
                              absolute
                              left-0
                              right-0
                              top-0
                              h-12
                              bg-linear-to-b
                              from-transparent
                              via-emerald-300/20
                              to-transparent
                            "
                          />
                        )}
                      </AnimatePresence>
                    </Link>

                    {/* MOBILE CONNECTOR */}

                    {i < streams.length - 1 && (
                      <div className="relative flex h-12 items-center justify-center lg:hidden">
                        <motion.div
                          className="
                            h-full
                            w-px
                            bg-linear-to-b
                            from-emerald-400/0
                            via-emerald-300/60
                            to-cyan-400/0
                          "
                          animate={{
                            opacity: overrideMode
                              ? [0.3, 1, 0.3]
                              : [0.25, 1, 0.25],
                          }}
                          transition={{
                            duration: overrideMode
                              ? 0.6
                              : 1.8,
                            repeat: Infinity,
                            delay: i * 0.25,
                          }}
                        />

                        <motion.div
                          className="
                            absolute
                            h-2
                            w-2
                            rounded-full
                            bg-emerald-200
                            shadow-[0_0_14px_rgba(52,211,153,1)]
                          "
                          animate={{
                            y: [-18, 18],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: overrideMode
                              ? 0.7
                              : 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* ========================================================
                MOBILE CORE
            ======================================================== */}

            <div className="mt-10 flex flex-col items-center lg:hidden">
              <motion.button
                type="button"
                onClick={handleCoreClick}
                aria-label="VYUHAM Stream Core"
                className="
                  cursor-pointer
                  border-0
                  bg-transparent
                  p-0
                  outline-none
                "
                whileTap={{
                  scale: 0.9,
                }}
              >
                <EnergyNode
                  color="emerald"
                  size="large"
                  override={overrideMode}
                />
              </motion.button>

              <div className="mt-2 text-center">
                <div className="font-display text-sm tracking-[0.15em] text-white/70">
                  VYUHAM
                  <span className="text-emerald-300">
                    &apos;26
                  </span>
                </div>

                <div className="mt-1 font-mono text-[6px] tracking-[0.35em] text-emerald-300/60">
                  STREAM CORE // ONLINE
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              BOTTOM SYSTEM STATUS
          ============================================================ */}

          <motion.div
            className="
              mt-12
              flex
              flex-col
              gap-4
              border-t
              border-emerald-400/10
              pt-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-emerald-400/40" />

              <span className="font-mono text-[7px] tracking-[0.25em] text-white/25">
                STREAM NETWORK // 04 NODES
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <span className="font-mono text-[7px] tracking-[0.2em] text-white/20">
                PEOPLE // IDEAS // EXPERIENCES // MANAGEMENT
              </span>

              <span className="font-mono text-[7px] tracking-[0.2em] text-emerald-300/60">
                ONE NETWORK. MANY POSSIBILITIES.
              </span>

              <span className="font-mono text-[7px] tracking-[0.2em] text-white/20">
                VYUHAM&apos;26 // STREAMS
              </span>
            </div>
          </motion.div>

          {/* ============================================================
              MICRO LABEL
          ============================================================ */}

          <div className="mt-5 flex justify-between font-mono text-[6px] tracking-[0.28em] text-white/10">
            <span>SELECT // STREAM</span>
            <span>ENTER // CHALLENGE</span>
          </div>

          {/* Hidden Easter Egg Hint */}
          <div className="pointer-events-none mt-3 text-center font-mono text-[5px] tracking-[0.4em] text-white/2.5">
            CORE // LISTENING // NETWORK // VYUHAM
          </div>
        </div>
      </section>
    </PageEntranceGate>
  );
}