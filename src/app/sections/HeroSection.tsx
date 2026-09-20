"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import AnimatedSection from "@/components/motion/AnimatedSection";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { Button, TextLink, Kicker } from "@/components/ui/Elements";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

const titleLines = [
  { text: "THE", em: false },
  { text: "FUTURE", em: true },
  { text: "AWAITS.", em: false },
];

const ParticleField = dynamic(
  () => import("@/components/motion/ParticleField"),
  { ssr: false }
);

const Portal = dynamic(
  () => import("@/components/motion/Portal"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-105 w-105 place-items-center">
        <div className="h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
    ),
  }
);

function CoreReactor({ booted }: { booted: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        aria-hidden="true"
        className="absolute h-[82%] w-[82%] rounded-full border border-emerald-300/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute h-[72%] w-[72%] rounded-full border border-dashed border-emerald-400/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute h-[62%] w-[62%] rounded-full border border-emerald-300/10"
        animate={{ scale: [0.94, 1.04, 0.94], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 120, 240].map((angle) => (
        <motion.span
          key={angle}
          aria-hidden="true"
          className="absolute h-1.5 w-1.5 rounded-full bg-emerald-200 shadow-[0_0_12px_rgba(167,243,208,1)]"
          style={{ transform: `rotate(${angle}deg) translateY(-46%)` }}
          animate={{ rotate: [angle, angle + 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      ))}
      <motion.div
        aria-hidden="true"
        className="absolute inset-[7%] rounded-full border border-emerald-400/10"
        animate={{ opacity: booted ? [0.15, 0.5, 0.15] : 0 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function HeroSection() {
  const [booted, setBooted] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const logoRotateY = useTransform(springX, [-1, 1], [-4, 4]);
  const logoRotateX = useTransform(springY, [-1, 1], [3, -3]);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 1500);
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "m") setMatrixMode((value) => !value);
      if (key === "v") {
        setLogoClicks((value) => {
          const next = value + 1;
          if (next >= 5) {
            setBooted(false);
            window.setTimeout(() => setBooted(true), 450);
            return 0;
          }
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
    mouseY.set((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleLogoClick = () => {
    setLogoClicks((value) => {
      const next = value + 1;
      if (next >= 5) {
        setBooted(false);
        window.setTimeout(() => setBooted(true), 450);
        return 0;
      }
      return next;
    });
  };

  return (
    <PageEntranceGate phase="hero">
      <section
        id="home"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="
          scan-lines
          relative
          min-h-screen
          overflow-hidden
          bg-[#030806]
          pt-23
        "
      >
        {/* =====================================================
            SYSTEM BOOT / OVERRIDE LAYER
        ===================================================== */}
        <motion.div
          aria-hidden={booted}
          className="pointer-events-none absolute inset-0 z-90 flex items-center justify-center bg-[#030806]"
          initial={{ opacity: 1 }}
          animate={{ opacity: booted ? 0 : 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-[min(520px,86vw)] font-mono text-[9px] tracking-[0.28em] text-emerald-300/70">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
              VYUHAM // SYSTEM BOOT
            </div>
            <div className="space-y-2 text-white/35">
              <div>INITIALIZING TEMPORAL CHANNEL... <span className="text-emerald-300/70">OK</span></div>
              <div>SIGNAL HANDSHAKE............. <span className="text-emerald-300/70">OK</span></div>
              <div>PORTAL SYNCHRONIZATION....... <span className="text-emerald-300/70">OK</span></div>
              <div>VYUHAM CORE.................. <span className="text-emerald-300/70">ONLINE</span></div>
            </div>
            <motion.div
              className="mt-5 h-px origin-left bg-emerald-300/70 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* =====================================================
            BACKGROUND
        ===================================================== */}

        <ParticleField className="z-0" />

        {matrixMode && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-70 overflow-hidden bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(52,211,153,0.06),transparent)] bg-size-[100%_7px]" />
            <motion.div
              className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_31px,rgba(52,211,153,0.08)_32px)]"
              animate={{ backgroundPositionY: [0, 900] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <motion.div
                className="font-mono text-[clamp(30px,8vw,110px)] font-semibold tracking-[0.15em] text-emerald-300/20"
                animate={{ opacity: [0.15, 0.55, 0.15], scale: [0.98, 1.02, 0.98] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                VYUHAM
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Main atmospheric glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[68%]
            top-[43%]
            z-0
            h-140
            w-140
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-emerald-400/4.5
            blur-[130px]
          "
        />

        {/* Secondary title atmosphere */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[22%]
            top-[47%]
            z-0
            h-105
            w-105
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-emerald-500/[0.018]
            blur-[110px]
          "
        />

        {/* Top signal line */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-23
            z-20
            h-px
            bg-linear-to-r
            from-transparent
            via-emerald-400/25
            to-transparent
          "
        />

        {/* =====================================================
            LEFT VERTICAL SYSTEM MARKER
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-20
            left-5
            top-32
            z-20
            hidden
            w-7
            flex-col
            items-center
            justify-between
            md:flex
          "
        >
          <div
            className="
              [writing-mode:vertical-rl]
              rotate-180
              font-mono
              text-[8px]
              tracking-[0.3em]
              text-emerald-400/45
            "
          >
            VYUHAM // 26
          </div>

          <div className="flex flex-col gap-6">
            {["01", "02", "03", "04", "05", "06"].map(
              (item, index) => (
                <span
                  key={item}
                  className={`
                    font-mono
                    text-[7px]
                    tracking-[0.2em]
                    transition-colors
                    ${
                      index === 0
                        ? "text-emerald-300"
                        : "text-white/20"
                    }
                  `}
                >
                  {item}
                </span>
              )
            )}
          </div>

          <span
            className="
              h-8
              w-px
              bg-linear-to-b
              from-transparent
              via-emerald-400/50
              to-transparent
            "
          />
        </div>

        {/* =====================================================
            MAIN CONTAINER
        ===================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-[min(1320px,calc(100%-32px))]
            md:w-[min(1320px,calc(100%-80px))]
          "
        >
          {/* ===================================================
              SIGNAL HEADER
          =================================================== */}

          <motion.div
            className="
              flex
              items-center
              justify-between
              border-b
              border-emerald-400/10
              py-3
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_12px_rgba(52,211,153,0.9)]
                "
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <span
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.28em]
                  text-emerald-200/55
                  sm:text-[9px]
                "
              >
                DIGITAL UNIVERSITY KERALA // VYUHAM&apos;26
              </span>
            </div>

            <div className="hidden items-center gap-5 sm:flex">
              <span
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.22em]
                  text-white/20
                "
              >
                V.26 // 2026
              </span>

              <span
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.22em]
                  text-emerald-400/60
                "
              >
                SIGNAL // FOUND
              </span>
            </div>
          </motion.div>

          {/* ===================================================
              TOP CENTER ENLARGED ANIMATED LOGO
          =================================================== */}

          <motion.div
            className="
              relative
              pt-8
              pb-4
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <CoreReactor booted={booted} />

            {/* Ambient Pulsing Radial Aura */}
            <motion.div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                h-52
                w-130
                rounded-full
                bg-emerald-400/15
                blur-3xl
              "
              animate={{
                scale: [0.9, 1.25, 0.9],
                opacity: [0.35, 0.75, 0.35],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Levitating & Breathing Logo Container */}
            <motion.div
              className="
                group
                relative
                cursor-pointer
                h-32 sm:h-40 md:h-48 lg:h-56
                w-[min(90vw,540px)]
                overflow-visible
                rounded-2xl
                p-3
              "
              style={{ perspective: 900, rotateX: logoRotateX, rotateY: logoRotateY }}
              onClick={handleLogoClick}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") handleLogoClick();
              }}
              role="button"
              tabIndex={0}
              aria-label="VYUHAM 26 core — click five times for system override"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              {/* Cyber Corner HUD Brackets */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-emerald-400/40 transition-colors duration-300 group-hover:border-emerald-300"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-emerald-400/40 transition-colors duration-300 group-hover:border-emerald-300"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 bottom-0 h-4 w-4 border-l-2 border-b-2 border-emerald-400/40 transition-colors duration-300 group-hover:border-emerald-300"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-emerald-400/40 transition-colors duration-300 group-hover:border-emerald-300"
              />

              {/* Holographic Laser Scan Line */}
              <motion.div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-0
                  right-0
                  z-20
                  h-0.5
                  w-full
                  bg-linear-to-r
                  from-transparent
                  via-emerald-300
                  to-transparent
                  shadow-[0_0_14px_rgba(52,211,153,0.9)]
                "
                animate={{
                  top: ["-10%", "110%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeInOut",
                }}
              />

              {/* Logo Image with Dynamic Glow Pulse */}
              <motion.div
                className="relative h-full w-full"
                animate={{
                  filter: [
                    "drop-shadow(0 0 24px rgba(52,211,153,0.35))",
                    "drop-shadow(0 0 45px rgba(52,211,153,0.68))",
                    "drop-shadow(0 0 24px rgba(52,211,153,0.35))",
                  ],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="VYUHAM '26 Official Emblem"
                  fill
                  priority
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 440px, 540px"
                  className="object-contain"
                />
              </motion.div>

              {/* Core status + technical annotations */}
              <div className="pointer-events-none absolute -bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap font-mono text-[7px] tracking-[0.24em] text-emerald-300/55">
                <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                CORE // {booted ? "ONLINE" : "SYNCING"}
                <span className="text-white/20">•</span>
                VYUHAM&apos;26
                {logoClicks > 0 && (
                  <span className="text-emerald-200/30"> OVERRIDE {logoClicks}/5</span>
                )}
              </div>

              <span className="pointer-events-none absolute -left-5 top-1/2 hidden -translate-y-1/2 font-mono text-[6px] tracking-[0.2em] text-emerald-400/25 md:block [writing-mode:vertical-rl]">
                SIGNAL 001 // CORE
              </span>
              <span className="pointer-events-none absolute -right-5 top-1/2 hidden -translate-y-1/2 font-mono text-[6px] tracking-[0.2em] text-emerald-400/25 md:block [writing-mode:vertical-rl]">
                2026 // ONLINE
              </span>
            </motion.div>
          </motion.div>

          {/* ===================================================
              HERO CORE
          =================================================== */}

          <div
            className="
              relative
              grid
              min-h-162.5
              items-center
              md:min-h-170
              md:grid-cols-[1fr_0.9fr]
            "
          >
            {/* =================================================
                LEFT — TYPOGRAPHY
            ================================================= */}

            <AnimatedSection
              className="
                relative
                z-30
                py-14
                md:py-20
              "
            >
              {/* Small identity label */}
              <motion.div
                className="
                  mb-7
                  flex
                  items-center
                  gap-3
                "
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.35,
                }}
              >
                <Kicker>
                  <span
                    className="
                      signal-dot
                      bg-emerald-400
                      shadow-[0_0_10px_rgba(52,211,153,0.9)]
                    "
                  />
                  Digital University Kerala presents
                </Kicker>
              </motion.div>

              {/* Dimension label */}
              <motion.div
                className="
                  mb-4
                  flex
                  items-center
                  gap-3
                  font-mono
                  text-[7px]
                  tracking-[0.3em]
                  text-emerald-300/45
                "
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.5,
                  duration: 0.6,
                }}
              >
                <span className="h-px w-9 bg-emerald-400/30" />

                <span>DIMENSION // 01</span>
              </motion.div>

              {/* =================================================
                  MAIN TITLE
              ================================================= */}

              <div className="relative">
                <motion.h1
                  className="
                    relative
                    font-display
                    text-[clamp(64px,9.6vw,142px)]
                    font-semibold
                    leading-[0.76]
                    tracking-[-0.055em]
                  "
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.13,
                        delayChildren: 0.42,
                      },
                    },
                  }}
                >
                  {titleLines.map((line) => (
                    <motion.span
                      key={line.text}
                      className="relative block"
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: "55%",
                          filter: "blur(14px)",
                        },

                        visible: {
                          opacity: 1,
                          y: "0%",
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.9,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          },
                        },
                      }}
                    >
                      {line.em ? (
                        <span
                          className="
                            relative
                            inline-block
                            text-emerald-300
                            drop-shadow-[0_0_22px_rgba(52,211,153,0.16)]
                          "
                        >
                          {line.text}

                          {/* Energy underline */}
                          <motion.span
                            aria-hidden="true"
                            className="
                              absolute
                              -bottom-2
                              left-0
                              h-0.5
                              w-full
                              origin-left
                              bg-linear-to-r
                              from-emerald-500
                              via-emerald-200
                              to-transparent
                              shadow-[0_0_14px_rgba(52,211,153,0.8)]
                            "
                            initial={{
                              scaleX: 0,
                            }}
                            animate={{
                              scaleX: 1,
                            }}
                            transition={{
                              duration: 1,
                              delay: 1.05,
                              ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                              ],
                            }}
                          />

                          {/* Passing energy scan */}
                          <motion.span
                            aria-hidden="true"
                            className="
                              pointer-events-none
                              absolute
                              inset-y-0
                              left-0
                              w-0.5
                              bg-emerald-100
                              shadow-[0_0_16px_rgba(167,243,208,1)]
                            "
                            initial={{
                              opacity: 0,
                              x: 0,
                            }}
                            animate={{
                              opacity: [0, 1, 0],
                              x: ["0%", "1000%"],
                            }}
                            transition={{
                              duration: 1.4,
                              delay: 1.3,
                              ease: "easeInOut",
                            }}
                          />
                        </span>
                      ) : (
                        line.text
                      )}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Vertical signal line */}
                <motion.div
                  aria-hidden="true"
                  className="
                    absolute
                    -left-5
                    top-1
                    hidden
                    h-72.5
                    w-px
                    bg-linear-to-b
                    from-transparent
                    via-emerald-400/45
                    to-transparent
                    md:block
                  "
                  initial={{
                    scaleY: 0,
                  }}
                  animate={{
                    scaleY: 1,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.6,
                  }}
                />

                {/* Small corner marker */}
                <motion.div
                  aria-hidden="true"
                  className="
                    absolute
                    -right-3
                    top-0
                    hidden
                    h-3
                    w-3
                    border-r
                    border-t
                    border-emerald-400/40
                    md:block
                  "
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 1.2,
                  }}
                />
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <motion.p
                className="
                  mt-10
                  max-w-110
                  text-sm
                  leading-[1.8]
                  text-white/45
                  md:text-[15px]
                "
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 1.15,
                }}
              >
                A national-level techno-cultural convergence
                for the curious, the bold, and the people
                building what is next.
              </motion.p>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <motion.div
                className="
                  mt-8
                  flex
                  flex-wrap
                  items-center
                  gap-6
                "
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 1.3,
                }}
              >
                <Button href="/events">
                  Explore events
                  <span className="ml-2 text-base">
                    →
                  </span>
                </Button>

                <TextLink href="/about">
                  Enter the dimension
                </TextLink>
              </motion.div>

              {/* =================================================
                  TELEMETRY
              ================================================= */}

              <motion.div
                className="
                  mt-10
                  flex
                  flex-wrap
                  gap-x-8
                  gap-y-3
                  font-mono
                  text-[7px]
                  tracking-[0.22em]
                  text-white/25
                "
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: 1.5,
                }}
              >
                <span>
                  CORE //
                  <span className="ml-1 text-emerald-400/70">
                    ACTIVE
                  </span>
                </span>

                <span>
                  TRANSMISSION //
                  <span className="ml-1 text-emerald-400/70">
                    STABLE
                  </span>
                </span>

                <span>
                  VYUHAM //
                  <span className="ml-1 text-emerald-400/70">
                    26
                  </span>
                </span>
              </motion.div>
            </AnimatedSection>

            {/* =================================================
                ENERGY CONNECTION
            ================================================= */}

            <motion.div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                left-[43%]
                right-[30%]
                top-1/2
                z-10
                hidden
                h-px
                -translate-y-1/2
                md:block
              "
              initial={{
                scaleX: 0,
                opacity: 0,
              }}
              animate={{
                scaleX: 1,
                opacity: 1,
              }}
              transition={{
                duration: 1.4,
                delay: 1.2,
                ease: "easeOut",
              }}
            >
              <div
                className="
                  h-px
                  w-full
                  bg-linear-to-r
                  from-emerald-400/0
                  via-emerald-400/15
                  to-emerald-400/0
                "
              />

              <motion.div
                className="
                  absolute
                  top-1/2
                  h-1
                  w-1
                  -translate-y-1/2
                  rounded-full
                  bg-emerald-200
                  shadow-[0_0_12px_rgba(167,243,208,1)]
                "
                animate={{
                  left: ["0%", "100%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>

            {/* Core-to-portal energy bridge */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-[30%] right-[8%] top-[18%] z-10 hidden h-px md:block"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: booted ? 1 : 0, opacity: booted ? 1 : 0 }}
              transition={{ duration: 1.4, delay: 1.1 }}
            >
              <div className="h-px w-full bg-linear-to-r from-transparent via-emerald-400/10 to-emerald-300/25" />
              <motion.span
                className="absolute -top-0.5 h-1 w-1 rounded-full bg-emerald-100 shadow-[0_0_12px_rgba(167,243,208,1)]"
                animate={{ left: ["5%", "95%"], opacity: [0, 1, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* =================================================
                PORTAL
            ================================================= */}

            <AnimatedSection
              delay={0.2}
              className="
                pointer-events-none
                absolute
                right-[-8%]
                top-1/2
                z-10
                hidden
                -translate-y-1/2
                md:block
              "
            >
              <div className="relative">
                {/* Portal atmosphere */}
                <motion.div
                  aria-hidden="true"
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-130
                    w-130
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-emerald-400/[0.035]
                    blur-[80px]
                  "
                  animate={{
                    scale: [1, 1.06, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Portal itself */}
                <Portal size="lg" />

                {/* =================================================
                    PORTAL TELEMETRY
                ================================================= */}

                <motion.div
                  className="
                    absolute
                    right-[9%]
                    top-[15%]
                    font-mono
                    text-[7px]
                    tracking-[0.25em]
                    text-emerald-300/50
                  "
                  animate={{
                    opacity: [0.3, 0.9, 0.3],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  SIGNAL // FOUND
                </motion.div>

                <motion.div
                  className="
                    absolute
                    bottom-[17%]
                    left-[7%]
                    font-mono
                    text-[7px]
                    tracking-[0.25em]
                    text-emerald-300/40
                  "
                  animate={{
                    opacity: [0.2, 0.7, 0.2],
                  }}
                  transition={{
                    duration: 3.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  CORE // ACTIVE
                </motion.div>

                <div
                  className="
                    absolute
                    bottom-[8%]
                    right-[8%]
                    font-mono
                    text-[7px]
                    tracking-[0.25em]
                    text-emerald-400/45
                  "
                >
                  V.26 // 2026
                </div>

                {/* Portal brackets */}
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    left-[8%]
                    top-[9%]
                    h-9
                    w-9
                    border-l
                    border-t
                    border-emerald-400/25
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    bottom-[9%]
                    right-[8%]
                    h-9
                    w-9
                    border-b
                    border-r
                    border-emerald-400/25
                  "
                />
              </div>
            </AnimatedSection>

            {/* =================================================
                MOBILE PORTAL
            ================================================= */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-31.25
                -top-25
                z-0
                opacity-[0.28]
                md:hidden
              "
            >
              <Portal size="sm" />
            </div>
          </div>

          {/* Desktop targeting HUD */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed bottom-6 right-6 z-50 hidden font-mono text-[7px] tracking-[0.2em] text-emerald-300/30 md:block"
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            VYUHAM // TARGETING SYSTEM<br />
            POINTER // ACTIVE<br />
            CORE // {booted ? "ONLINE" : "SYNC"}
          </motion.div>

          {/* ===================================================
              TEMPORAL SYSTEM
          =================================================== */}

          <AnimatedSection
            delay={0.5}
            className="
              relative
              z-30
              border-t
              border-emerald-400/10
            "
          >
            {/* System header */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-emerald-400/10
                py-3
              "
            >
              <div className="flex items-center gap-3">
                <motion.span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_10px_rgba(52,211,153,0.9)]
                  "
                  animate={{
                    opacity: [0.35, 1, 0.35],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <span
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.25em]
                    text-white/30
                  "
                >
                  VYUHAM&apos;26 // TEMPORAL SYSTEM
                </span>
              </div>

              <span
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.2em]
                  text-emerald-400/55
                "
              >
                SIGNAL // ACTIVE
              </span>
            </div>

            {/* Main data */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* DATE */}
              <div
                className="
                  relative
                  border-b
                  border-emerald-400/10
                  py-6
                  md:border-b-0
                  md:border-r
                  md:pr-8
                "
              >
                <span
                  className="
                    block
                    font-mono
                    text-[8px]
                    tracking-[0.22em]
                    text-white/25
                  "
                >
                  TEMPORAL COORDINATES
                </span>

                <strong
                  className="
                    mt-3
                    block
                    font-display
                    text-xl
                    tracking-[0.04em]
                    text-white/90
                    md:text-2xl
                  "
                >
                  30 OCT → 01 NOV
                </strong>

                <small
                  className="
                    mt-1
                    block
                    font-mono
                    text-[9px]
                    tracking-[0.12em]
                    text-white/25
                  "
                >
                  2026
                </small>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-px w-6 bg-emerald-400/40" />

                  <span
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-emerald-400/50
                    "
                  >
                    TIMEFRAME LOCKED
                  </span>
                </div>
              </div>

              {/* LOCATION */}
              <div
                className="
                  relative
                  border-b
                  border-emerald-400/10
                  py-6
                  md:border-b-0
                  md:border-r
                  md:px-8
                "
              >
                <span
                  className="
                    block
                    font-mono
                    text-[8px]
                    tracking-[0.22em]
                    text-white/25
                  "
                >
                  SIGNAL ORIGIN
                </span>

                <strong
                  className="
                    mt-3
                    block
                    font-display
                    text-xl
                    tracking-[0.04em]
                    text-white/90
                    md:text-2xl
                  "
                >
                  TECHNOCITY
                </strong>

                <small
                  className="
                    mt-1
                    block
                    font-mono
                    text-[9px]
                    tracking-[0.12em]
                    text-white/25
                  "
                >
                  THIRUVANANTHAPURAM
                </small>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-px w-6 bg-emerald-400/40" />

                  <span
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-emerald-400/50
                    "
                  >
                    SIGNAL LOCKED
                  </span>
                </div>
              </div>

              {/* COUNTDOWN */}
              <div className="py-6 md:pl-8">
                <span
                  className="
                    block
                    font-mono
                    text-[8px]
                    tracking-[0.22em]
                    text-white/25
                  "
                >
                  FUTURE ACTIVATION
                </span>

                <div className="mt-3 rounded-sm border border-emerald-400/10 bg-emerald-400/1.5 px-3 py-2">
                  <CountdownTimer
                    targetDate="2026-10-30T00:00:00+05:30"
                  />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-px w-6 bg-emerald-400/40" />

                  <span
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-emerald-400/50
                    "
                  >
                    THE FUTURE BEGINS IN
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                TEMPORAL AXIS
            ================================================= */}

            <div
              className="
                relative
                border-t
                border-emerald-400/10
                py-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  font-mono
                  text-[7px]
                  tracking-[0.2em]
                  text-white/20
                "
              >
                <span>PAST</span>

                <span className="text-emerald-400/50">
                  TEMPORAL AXIS // 2026
                </span>

                <span>FUTURE</span>
              </div>

              <div
                className="
                  relative
                  mt-4
                  h-px
                  bg-white/6
                "
              >
                {/* Progress */}
                <motion.div
                  className="
                    absolute
                    left-0
                    top-0
                    h-px
                    w-[35%]
                    origin-left
                    bg-linear-to-r
                    from-emerald-500
                    via-emerald-300
                    to-emerald-200
                    shadow-[0_0_10px_rgba(52,211,153,0.7)]
                  "
                  initial={{
                    scaleX: 0,
                  }}
                  animate={{
                    scaleX: 1,
                  }}
                  transition={{
                    duration: 1.6,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                />

                {/* Moving signal */}
                <motion.div
                  aria-hidden="true"
                  className="
                    absolute
                    top-1/2
                    h-1
                    w-1
                    -translate-y-1/2
                    rounded-full
                    bg-emerald-100
                    shadow-[0_0_10px_rgba(209,250,229,1)]
                  "
                  animate={{
                    left: ["0%", "35%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut",
                  }}
                />

                {/* NOW */}
                <motion.div
                  className="
                    absolute
                    left-[35%]
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                  "
                  animate={{
                    scale: [1, 1.18, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span
                    className="
                      block
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-300
                      shadow-[0_0_14px_rgba(52,211,153,0.9)]
                    "
                  />
                </motion.div>
              </div>

              <div
                className="
                  mt-3
                  text-center
                  font-mono
                  text-[7px]
                  tracking-[0.2em]
                  text-emerald-400/45
                "
              >
                NOW // SIGNAL APPROACHING
              </div>

              <div className="mt-3 text-center font-mono text-[6px] tracking-[0.3em] text-white/15">
                TEMPORAL CHANNEL // LOCKED TO 2026
              </div>
            </div>
          </AnimatedSection>
        </div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2 font-mono text-[6px] tracking-[0.32em] text-white/10"
          animate={{ opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          V = VYUHAM // M = MATRIX // CLICK CORE ×5 = OVERRIDE
        </motion.div>

        {/* Global signal sweep */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-0 z-30 h-px bg-linear-to-r from-transparent via-emerald-200/40 to-transparent shadow-[0_0_18px_rgba(52,211,153,0.5)]"
          animate={{ top: ["10%", "92%"], opacity: [0, 0.8, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, repeatDelay: 7, ease: "easeInOut" }}
        />

        {/* =====================================================
            BOTTOM FADE
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            right-0
            z-40
            h-32
            bg-linear-to-t
            from-[#030806]
            to-transparent
          "
        />
      </section>
    </PageEntranceGate>
  );
}