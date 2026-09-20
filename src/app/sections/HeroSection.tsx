"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import AnimatedSection from "@/components/motion/AnimatedSection";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { Button, TextLink, Kicker } from "@/components/ui/Elements";
import { motion } from "framer-motion";
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

const Portal = dynamic(() => import("@/components/motion/Portal"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[min(44vw,520px)] w-[min(44vw,520px)] place-items-center">
      <div className="h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
    </div>
  ),
});

export default function HeroSection() {
  return (
    <PageEntranceGate phase="hero">
      <section
        id="home"
        className="scan-lines relative min-h-screen overflow-hidden bg-[#030806] pt-23"
      >
        {/* =====================================================
            BACKGROUND SYSTEM
        ===================================================== */}

        <ParticleField className="z-0" />

        {/* Atmospheric emerald glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[42%]
            z-0
            h-125
            w-125
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-emerald-400/[0.035]
            blur-[120px]
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
            z-10
            h-px
            bg-linear-to-r
            from-transparent
            via-emerald-400/30
            to-transparent
          "
        />

        {/* =====================================================
            HERO CONTENT
        ===================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-[min(1280px,calc(100%-32px))]
            md:w-[min(1280px,calc(100%-64px))]
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
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_12px_rgba(52,211,153,0.9)]
                "
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
                VYUHAM&apos;26 // DIMENSIONAL GATE
              </span>
            </div>

            <div className="hidden items-center gap-4 sm:flex">
              <span className="font-mono text-[8px] tracking-[0.22em] text-white/25">
                V.26 // 2026
              </span>

              <span className="font-mono text-[8px] tracking-[0.22em] text-emerald-400/60">
                SIGNAL // FOUND
              </span>
            </div>
          </motion.div>

          {/* ===================================================
              MAIN HERO
          =================================================== */}

          <div
            className="
              relative
              grid
              min-h-162.5
              items-center
              md:min-h-175
              md:grid-cols-[1.05fr_0.95fr]
            "
          >
            {/* ===============================================
                LEFT CONTENT
            =============================================== */}

            <AnimatedSection className="relative z-20 py-12 md:py-20">
              {/* Logo */}
              <motion.div
                className="relative mb-7 h-20 w-[min(280px,72vw)] sm:h-24 sm:w-77.5 md:h-28 md:w-85"
                initial={{
                  opacity: 0,
                  y: 20,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Image
                  src="/logo.png"
                  alt="VYUHAM '26 Official Emblem"
                  fill
                  priority
                  sizes="(max-width: 640px) 280px, 340px"
                  className="
                    object-contain
                    object-left
                    drop-shadow-[0_0_28px_rgba(52,211,153,0.38)]
                  "
                />

                {/* Logo scan */}
                <motion.div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-0
                    top-0
                    h-px
                    w-full
                    bg-linear-to-r
                    from-transparent
                    via-emerald-200/70
                    to-transparent
                  "
                  animate={{
                    y: ["0%", "10000%"],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "linear",
                  }}
                />
              </motion.div>

              {/* Kicker */}
              <div className="mb-5">
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
              </div>

              {/* =================================================
                  MAIN TITLE
              ================================================= */}

              <div className="relative">
                {/* Small coordinate label */}
                <motion.div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-3
                    font-mono
                    text-[7px]
                    tracking-[0.28em]
                    text-emerald-300/45
                  "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                >
                  <span className="h-px w-8 bg-emerald-400/30" />
                  DIMENSION // 01
                </motion.div>

                <motion.h1
                  className="
                    relative
                    font-display
                    text-[clamp(62px,10vw,142px)]
                    font-semibold
                    leading-[0.77]
                    tracking-[-0.045em]
                  "
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.14,
                        delayChildren: 0.45,
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
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                      }}
                    >
                      {line.em ? (
                        <span className="relative inline-block text-emerald-300">
                          {line.text}

                          {/* Energy underline */}
                          <motion.span
                            aria-hidden="true"
                            className="
                              absolute
                              -bottom-1.75
                              left-0
                              h-0.5
                              w-full
                              origin-left
                              bg-linear-to-r
                              from-emerald-500
                              via-emerald-200
                              to-transparent
                              shadow-[0_0_14px_rgba(52,211,153,0.75)]
                            "
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: 1.1,
                              delay: 1.05,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        </span>
                      ) : (
                        line.text
                      )}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Vertical signal marker */}
                <motion.div
                  aria-hidden="true"
                  className="
                    absolute
                    -left-4
                    top-2
                    hidden
                    h-47.5
                    w-px
                    bg-linear-to-b
                    from-emerald-400/0
                    via-emerald-400/50
                    to-emerald-400/0
                    md:block
                  "
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 1.3,
                    delay: 0.6,
                  }}
                />
              </div>

              {/* Description */}
              <motion.p
                className="
                  mt-10
                  max-w-107.5
                  text-sm
                  leading-[1.8]
                  text-white/45
                  md:text-[15px]
                "
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.15,
                }}
              >
                A national-level techno-cultural convergence for the curious,
                the bold, and the people building what is next.
              </motion.p>

              {/* Actions */}
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.3,
                }}
              >
                <Button href="/events">
                  Explore events
                  <span className="ml-2 text-base">→</span>
                </Button>

                <TextLink href="/about">
                  Enter the dimension
                </TextLink>
              </motion.div>

              {/* Small telemetry */}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 1.5,
                }}
              >
                <span>
                  CORE //{" "}
                  <span className="text-emerald-400/70">
                    ACTIVE
                  </span>
                </span>

                <span>
                  TRANSMISSION //{" "}
                  <span className="text-emerald-400/70">
                    STABLE
                  </span>
                </span>

                <span>
                  VYUHAM //{" "}
                  <span className="text-emerald-400/70">
                    26
                  </span>
                </span>
              </motion.div>
            </AnimatedSection>

            {/* ===============================================
                PORTAL SYSTEM
            =============================================== */}

            <AnimatedSection
              delay={0.25}
              className="
                pointer-events-none
                absolute
                right-[-12%]
                top-1/2
                z-10
                hidden
                -translate-y-1/2
                md:block
              "
            >
              <div className="relative">
                {/* Outer atmosphere */}
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-125
                    w-125
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-emerald-400/2.5
                    blur-[70px]
                  "
                />

                {/* Portal */}
                <Portal size="lg" />

                {/* Portal telemetry */}
                <motion.div
                  className="
                    absolute
                    right-[8%]
                    top-[18%]
                    font-mono
                    text-[7px]
                    tracking-[0.24em]
                    text-emerald-300/45
                  "
                  animate={{
                    opacity: [0.35, 0.8, 0.35],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  SIGNAL // FOUND
                </motion.div>

                <motion.div
                  className="
                    absolute
                    bottom-[18%]
                    left-[6%]
                    font-mono
                    text-[7px]
                    tracking-[0.24em]
                    text-emerald-300/35
                  "
                  animate={{
                    opacity: [0.25, 0.65, 0.25],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  CORE // ACTIVE
                </motion.div>

                {/* Corner brackets */}
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    left-[10%]
                    top-[12%]
                    h-8
                    w-8
                    border-l
                    border-t
                    border-emerald-400/20
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    right-[10%]
                    bottom-[12%]
                    h-8
                    w-8
                    border-b
                    border-r
                    border-emerald-400/20
                  "
                />
              </div>
            </AnimatedSection>

            {/* ===============================================
                MOBILE PORTAL
            =============================================== */}

            <div
              className="
                pointer-events-none
                absolute
                -right-37.5
                -top-5
                z-0
                opacity-30
                md:hidden
              "
            >
              <Portal size="sm" />
            </div>
          </div>

          {/* ===================================================
              TEMPORAL SYSTEM
          =================================================== */}

          <AnimatedSection
            delay={0.5}
            className="
              relative
              z-20
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

            {/* Main system data */}
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
                <span className="block font-mono text-[8px] tracking-[0.22em] text-white/25">
                  TEMPORAL COORDINATES
                </span>

                <strong className="mt-3 block font-display text-xl tracking-[0.04em] text-white/90 md:text-2xl">
                  30 OCT → 01 NOV
                </strong>

                <small className="mt-1 block font-mono text-[9px] tracking-[0.12em] text-white/25">
                  2026
                </small>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-px w-6 bg-emerald-400/40" />

                  <span className="font-mono text-[7px] tracking-[0.2em] text-emerald-400/50">
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
                <span className="block font-mono text-[8px] tracking-[0.22em] text-white/25">
                  SIGNAL ORIGIN
                </span>

                <strong className="mt-3 block font-display text-xl tracking-[0.04em] text-white/90 md:text-2xl">
                  TECHNOCITY
                </strong>

                <small className="mt-1 block font-mono text-[9px] tracking-[0.12em] text-white/25">
                  THIRUVANANTHAPURAM
                </small>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-px w-6 bg-emerald-400/40" />

                  <span className="font-mono text-[7px] tracking-[0.2em] text-emerald-400/50">
                    SIGNAL LOCKED
                  </span>
                </div>
              </div>

              {/* COUNTDOWN */}
              <div className="py-6 md:pl-8">
                <span className="block font-mono text-[8px] tracking-[0.22em] text-white/25">
                  FUTURE ACTIVATION
                </span>

                <div className="mt-3">
                  <CountdownTimer
                    targetDate="2026-10-30T00:00:00+05:30"
                  />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-px w-6 bg-emerald-400/40" />

                  <span className="font-mono text-[7px] tracking-[0.2em] text-emerald-400/50">
                    THE FUTURE BEGINS IN
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                TEMPORAL AXIS
            ================================================= */}

            <div className="relative border-t border-emerald-400/10 py-4">
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

              <div className="relative mt-4 h-px bg-white/6">
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
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 1.6,
                    ease: [0.22, 1, 0.36, 1],
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
              </div>

              <div className="mt-3 text-center font-mono text-[7px] tracking-[0.2em] text-emerald-400/45">
                NOW // SIGNAL APPROACHING
              </div>
            </div>
          </AnimatedSection>
        </div>

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
            z-20
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