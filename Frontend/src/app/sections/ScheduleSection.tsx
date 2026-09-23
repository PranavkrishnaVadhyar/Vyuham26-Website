"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";
import { events } from "@/data/events";
import Link from "next/link";

const days = [
  {
    dayNum: 1,
    label: "DAY 01",
    date: "30 OCT 2026",
    name: "Ignition",
    code: "TEMPORAL PHASE // 01",
    description: "The signal activates.",
    status: "INITIALIZATION",
    signal: 94,
    color: "emerald",
  },
  {
    dayNum: 2,
    label: "DAY 02",
    date: "31 OCT 2026",
    name: "Convergence",
    code: "TEMPORAL PHASE // 02",
    description: "Dimensions converge.",
    status: "CONVERGENCE",
    signal: 98,
    color: "cyan",
  },
  {
    dayNum: 3,
    label: "DAY 03",
    date: "01 NOV 2026",
    name: "Aftershock",
    code: "TEMPORAL PHASE // 03",
    description: "The future leaves its mark.",
    status: "AFTERSHOCK",
    signal: 91,
    color: "violet",
  },
];

const colorStyles = {
  emerald: {
    text: "text-emerald-300",
    softText: "text-emerald-300/55",
    border: "border-emerald-400/30",
    softBorder: "border-emerald-400/10",
    bg: "bg-emerald-400/[0.035]",
    line: "bg-emerald-300",
    glow:
      "shadow-[0_0_45px_rgba(52,211,153,0.10)]",
  },

  cyan: {
    text: "text-cyan-300",
    softText: "text-cyan-300/55",
    border: "border-cyan-400/30",
    softBorder: "border-cyan-400/10",
    bg: "bg-cyan-400/[0.035]",
    line: "bg-cyan-300",
    glow:
      "shadow-[0_0_45px_rgba(34,211,238,0.10)]",
  },

  violet: {
    text: "text-violet-300",
    softText: "text-violet-300/55",
    border: "border-violet-400/30",
    softBorder: "border-violet-400/10",
    bg: "bg-violet-400/[0.035]",
    line: "bg-violet-300",
    glow:
      "shadow-[0_0_45px_rgba(167,139,250,0.10)]",
  },
};

function SignalMeter({
  strength,
  color,
}: {
  strength: number;
  color: keyof typeof colorStyles;
}) {
  const style = colorStyles[color];

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 12 }).map((_, index) => {
        const active = strength >= (index + 1) * 8.33;

        return (
          <span
            key={index}
            className={`
              h-1
              flex-1
              rounded-full
              transition-all
              duration-300
              ${
                active
                  ? `${style.line} opacity-80`
                  : "bg-white/8"
              }
            `}
          />
        );
      })}
    </div>
  );
}

export default function ScheduleSection() {
  const [activeDay, setActiveDay] = useState(1);

  const activePhase =
    days.find((day) => day.dayNum === activeDay) ?? days[0];

  const activeCount = events.filter(
    (event) => event.day === activeDay
  ).length;

  const activeStyle =
    colorStyles[
      activePhase.color as keyof typeof colorStyles
    ];

  return (
    <PageEntranceGate phase="schedule">
      <section
        className="
          relative
          overflow-hidden
          bg-[#030806]
          pb-24
          pt-16
          md:pb-36
          md:pt-24
        "
        id="schedule"
      >
        {/* =====================================================
            ATMOSPHERE
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[12%]
            top-[18%]
            h-80
            w-80
            rounded-full
            bg-emerald-400/2.5
            blur-[120px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[5%]
            top-[45%]
            h-96
            w-96
            rounded-full
            bg-cyan-400/[0.018]
            blur-[130px]
          "
        />

        {/* Global signal sweep */}
        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-0
            z-20
            h-px
            bg-linear-to-r
            from-transparent
            via-emerald-300/35
            to-transparent
          "
          animate={{
            x: ["-100%", "100%"],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        />

        <div className="relative mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">

          {/* =====================================================
              HEADER
          ===================================================== */}

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
                      opacity: [0.35, 1, 0.35],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                    }}
                  />

                  <Kicker>
                    03 / Temporal transmission
                  </Kicker>
                </div>

                <div className="mb-4 font-mono text-[7px] tracking-[0.3em] text-emerald-300/35">
                  VYUHAM&apos;26 // TEMPORAL NETWORK
                </div>

                <h2
                  className="
                    font-display
                    text-[clamp(45px,6vw,82px)]
                    font-semibold
                    leading-[0.84]
                    tracking-[-0.045em]
                  "
                >
                  THE{" "}
                  <span
                    className="
                      bg-linear-to-r
                      from-white
                      via-emerald-200
                      to-cyan-300
                      bg-clip-text
                      text-transparent
                    "
                  >
                    FUTURE
                  </span>

                  <br />

                  <span className="text-white/90">
                    AWAITS.
                  </span>
                </h2>

                <p
                  className="
                    mt-6
                    max-w-md
                    font-mono
                    text-[9px]
                    leading-[1.9]
                    tracking-[0.16em]
                    text-white/30
                  "
                >
                  THREE PHASES.
                  <br />
                  ONE CONTINUOUS SIGNAL.
                </p>
              </div>

              {/* Transmission status */}
              <div className="md:text-right">
                <div className="mb-3 font-mono text-[8px] tracking-[0.25em] text-white/20">
                  TRANSMISSION STATUS
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <motion.span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-emerald-300
                      shadow-[0_0_10px_rgba(52,211,153,0.9)]
                    "
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />

                  <span className="font-mono text-xs tracking-[0.18em] text-emerald-300">
                    SIGNAL ACTIVE
                  </span>
                </div>

                <Button
                  href="/schedule"
                  variant="primary"
                  className="mt-5"
                >
                  View full schedule
                  <span className="ml-2 text-ink" aria-hidden="true">
                    ↗
                  </span>
                </Button>
              </div>
            </div>
          </AnimatedSection>

          {/* =====================================================
              TEMPORAL CORE STATUS
          ===================================================== */}

          <AnimatedSection delay={0.15}>
            <div
              className="
                mt-16
                flex
                flex-col
                gap-4
                border-y
                border-emerald-400/10
                py-4
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-[7px] tracking-[0.25em] text-white/20">
                  TEMPORAL CORE
                </span>

                <span className="h-px w-8 bg-emerald-400/20" />

                <span className="font-mono text-[7px] tracking-[0.2em] text-emerald-300/55">
                  2026
                </span>
              </div>

              <div className="flex items-center gap-5">
                <span className="font-mono text-[7px] tracking-[0.2em] text-white/15">
                  PHASES // 03
                </span>

                <span className="font-mono text-[7px] tracking-[0.2em] text-emerald-400/45">
                  CHANNEL // LOCKED
                </span>
              </div>
            </div>
          </AnimatedSection>

          {/* =====================================================
              TEMPORAL AXIS
          ===================================================== */}

          <AnimatedSection delay={0.2}>
            <div className="relative mt-14">

              <div className="mb-6 flex items-center justify-between font-mono text-[7px] tracking-[0.22em] text-white/20">
                <span>ORIGIN</span>

                <span className="text-emerald-400/50">
                  TEMPORAL AXIS // 2026
                </span>

                <span>DESTINATION</span>
              </div>

              {/* Axis */}
              <div className="relative h-px bg-white/8">

                <motion.div
                  className="
                    absolute
                    left-0
                    top-0
                    h-px
                    bg-linear-to-r
                    from-emerald-500
                    via-cyan-300
                    to-violet-300
                  "
                  initial={{
                    width: "0%",
                  }}
                  whileInView={{
                    width: "100%",
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 1.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />

                {/* Moving signal */}
                <motion.span
                  className="
                    absolute
                    top-1/2
                    h-1
                    w-1
                    -translate-y-1/2
                    rounded-full
                    bg-white
                    shadow-[0_0_12px_rgba(255,255,255,0.9)]
                  "
                  animate={{
                    left: ["0%", "100%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "linear",
                  }}
                />
              </div>

              {/* =================================================
                  DAY SELECTOR
              ================================================= */}

              <div className="mt-8 grid grid-cols-3 gap-2">
                {days.map((day) => {
                  const style =
                    colorStyles[
                      day.color as keyof typeof colorStyles
                    ];

                  const active =
                    activeDay === day.dayNum;

                  return (
                    <button
                      key={day.dayNum}
                      type="button"
                      onClick={() =>
                        setActiveDay(day.dayNum)
                      }
                      className={`
                        relative
                        overflow-hidden
                        border
                        px-3
                        py-3
                        text-left
                        transition-all
                        duration-300
                        ${
                          active
                            ? `${style.border} ${style.bg}`
                            : "border-white/6 bg-white/1"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`
                            font-mono
                            text-[7px]
                            tracking-[0.2em]
                            ${
                              active
                                ? style.text
                                : "text-white/25"
                            }
                          `}
                        >
                          {day.label}
                        </span>

                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${
                              active
                                ? `${style.line} shadow-[0_0_10px_currentColor]`
                                : "bg-white/10"
                            }
                          `}
                        />
                      </div>

                      <span
                        className={`
                          mt-2
                          block
                          font-display
                          text-sm
                          ${
                            active
                              ? "text-white/90"
                              : "text-white/35"
                          }
                        `}
                      >
                        {day.name}
                      </span>

                      {active && (
                        <motion.div
                          layoutId="activePhase"
                          className={`
                            absolute
                            bottom-0
                            left-0
                            h-px
                            w-full
                            ${style.line}
                          `}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* =====================================================
              ACTIVE PHASE DOSSIER
          ===================================================== */}

          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase.dayNum}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.35,
              }}
              className={`
                mt-6
                border
                ${activeStyle.border}
                ${activeStyle.bg}
                ${activeStyle.glow}
                p-5
                md:p-6
              `}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        font-mono
                        text-[7px]
                        tracking-[0.25em]
                        ${activeStyle.softText}
                      `}
                    >
                      {activePhase.code}
                    </span>

                    <span className="h-px w-6 bg-white/10" />

                    <span className="font-mono text-[7px] tracking-[0.2em] text-white/20">
                      {activePhase.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-baseline gap-4">
                    <h3 className="font-display text-2xl font-semibold text-white/90 md:text-3xl">
                      {activePhase.name}
                    </h3>

                    <span
                      className={`
                        font-mono
                        text-[8px]
                        tracking-[0.2em]
                        ${activeStyle.softText}
                      `}
                    >
                      {activePhase.date}
                    </span>
                  </div>

                  <p className="mt-2 font-mono text-[8px] tracking-[0.12em] text-white/30">
                    {activePhase.description}
                  </p>
                </div>

                <div className="min-w-55 md:text-right">
                  <div className="mb-2 flex items-center justify-between md:justify-end md:gap-4">
                    <span className="font-mono text-[6px] tracking-[0.2em] text-white/20">
                      PHASE SIGNAL
                    </span>

                    <span
                      className={`
                        font-mono
                        text-[7px]
                        ${activeStyle.text}
                      `}
                    >
                      {activePhase.signal}%
                    </span>
                  </div>

                  <SignalMeter
                    strength={activePhase.signal}
                    color={
                      activePhase.color as keyof typeof colorStyles
                    }
                  />

                  <div className="mt-3 flex items-center justify-between md:justify-end md:gap-4">
                    <span className="font-mono text-[6px] tracking-[0.18em] text-white/15">
                      EVENT NODES
                    </span>

                    <span
                      className={`
                        font-mono
                        text-[7px]
                        ${activeStyle.softText}
                      `}
                    >
                      {String(activeCount).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* =====================================================
              DAY CARDS
          ===================================================== */}

          <AnimatedSection delay={0.25}>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">

              {days.map((day, index) => {
                const count = events.filter(
                  (event) => event.day === day.dayNum
                ).length;

                const style =
                  colorStyles[
                    day.color as keyof typeof colorStyles
                  ];

                const active =
                  activeDay === day.dayNum;

                return (
                  <motion.div
                    key={day.label}
                    initial={{
                      opacity: 0,
                      y: 30,
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
                      duration: 0.65,
                      delay: index * 0.12,
                    }}
                    className="relative"
                  >
                    {/* Timeline node */}
                    <div className="relative z-10 mb-6 hidden justify-center md:flex">

                      <button
                        type="button"
                        onClick={() =>
                          setActiveDay(day.dayNum)
                        }
                        className="
                          relative
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/10
                          bg-[#030806]
                        "
                        aria-label={`Select ${day.label}`}
                      >
                        <motion.span
                          className={`
                            h-2
                            w-2
                            rounded-full
                            ${style.line}
                          `}
                          animate={{
                            scale: active
                              ? [1, 1.35, 1]
                              : 1,
                            opacity: active
                              ? [0.5, 1, 0.5]
                              : 0.35,
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                          }}
                        />

                        <span
                          className={`
                            absolute
                            -inset-2
                            rounded-full
                            border
                            transition-opacity
                            ${
                              active
                                ? style.softBorder
                                : "border-transparent"
                            }
                          `}
                        />
                      </button>
                    </div>

                    {/* Card */}
                    <Link
                      href={`/schedule?day=${day.dayNum}`}
                      onMouseEnter={() =>
                        setActiveDay(day.dayNum)
                      }
                      className={`
                        group
                        relative
                        block
                        min-h-85
                        overflow-hidden
                        border
                        p-6
                        no-underline
                        transition-all
                        duration-500
                        md:min-h-95
                        md:p-7
                        ${
                          active
                            ? `${style.border} ${style.bg} ${style.glow}`
                            : "border-white/7 bg-white/[0.008] hover:border-white/15"
                        }
                      `}
                    >
                      {/* HUD corners */}

                      <span
                        className={`
                          absolute
                          left-3
                          top-3
                          h-4
                          w-4
                          border-l
                          border-t
                          ${
                            active
                              ? style.softBorder
                              : "border-white/10"
                          }
                        `}
                      />

                      <span
                        className={`
                          absolute
                          right-3
                          top-3
                          h-4
                          w-4
                          border-r
                          border-t
                          ${
                            active
                              ? style.softBorder
                              : "border-white/10"
                          }
                        `}
                      />

                      <span
                        className={`
                          absolute
                          bottom-3
                          left-3
                          h-4
                          w-4
                          border-b
                          border-l
                          ${
                            active
                              ? style.softBorder
                              : "border-white/10"
                          }
                        `}
                      />

                      <span
                        className={`
                          absolute
                          bottom-3
                          right-3
                          h-4
                          w-4
                          border-b
                          border-r
                          ${
                            active
                              ? style.softBorder
                              : "border-white/10"
                          }
                        `}
                      />

                      {/* Scan */}
                      <motion.div
                        aria-hidden="true"
                        className={`
                          pointer-events-none
                          absolute
                          left-0
                          right-0
                          top-0
                          h-px
                          ${style.line}
                        `}
                        animate={{
                          x: ["-100%", "100%"],
                          opacity: active
                            ? [0, 0.7, 0]
                            : 0,
                        }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1,
                        }}
                      />

                      {/* Header */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span
                          className={`
                            font-mono
                            text-[8px]
                            tracking-[0.24em]
                            ${style.text}
                          `}
                        >
                          {day.label}
                        </span>

                        <span className="font-mono text-[7px] tracking-[0.2em] text-white/20">
                          0{day.dayNum}
                        </span>
                      </div>

                      {/* Phase code */}
                      <div className="relative z-10 mt-10 font-mono text-[7px] tracking-[0.22em] text-white/20">
                        {day.code}
                      </div>

                      {/* Date */}
                      <strong
                        className={`
                          relative
                          z-10
                          mt-3
                          block
                          font-display
                          text-2xl
                          font-semibold
                          tracking-[-0.02em]
                          transition-colors
                          md:text-3xl
                          ${
                            active
                              ? "text-white/95"
                              : "text-white/75"
                          }
                        `}
                      >
                        {day.date}
                      </strong>

                      {/* Name */}
                      <div className="relative z-10 mt-3 flex items-center gap-3">
                        <motion.span
                          className={`
                            h-px
                            ${style.line}
                          `}
                          animate={{
                            width: active ? 40 : 24,
                          }}
                        />

                        <span className="font-display text-sm uppercase tracking-[0.12em] text-white/70">
                          {day.name}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="relative z-10 mt-5 max-w-55 font-mono text-[8px] leading-[1.8] tracking-[0.08em] text-white/30">
                        {day.description}
                      </p>

                      {/* Event telemetry */}
                      <div className="relative z-10 mt-7">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono text-[6px] tracking-[0.2em] text-white/15">
                            EVENT NODES
                          </span>

                          <span
                            className={`
                              font-mono
                              text-[7px]
                              ${style.softText}
                            `}
                          >
                            {String(count).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="flex gap-1">
                          {Array.from({
                            length: 10,
                          }).map((_, i) => (
                            <span
                              key={i}
                              className={`
                                h-1
                                flex-1
                                rounded-full
                                ${
                                  i <
                                  Math.min(
                                    count,
                                    10
                                  )
                                    ? style.line
                                    : "bg-white/7"
                                }
                              `}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-white/7 pt-4 md:left-7 md:right-7">

                        <span className="font-mono text-[6px] tracking-[0.2em] text-white/15">
                          EVENT SIGNAL
                        </span>

                        <span
                          className={`
                            flex
                            items-center
                            gap-2
                            font-mono
                            text-[8px]
                            tracking-[0.18em]
                            ${style.text}
                          `}
                        >
                          ENTER

                          <motion.span
                            animate={{
                              x: active
                                ? [0, 4, 0]
                                : 0,
                            }}
                            transition={{
                              duration: 1.4,
                              repeat: Infinity,
                            }}
                          >
                            →
                          </motion.span>
                        </span>
                      </div>

                      {/* Bottom glow */}
                      <div
                        className={`
                          pointer-events-none
                          absolute
                          -bottom-20
                          left-1/2
                          h-36
                          w-36
                          -translate-x-1/2
                          rounded-full
                          ${style.bg}
                          opacity-0
                          blur-3xl
                          transition-opacity
                          duration-500
                          group-hover:opacity-100
                        `}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* =====================================================
              BOTTOM STATUS
          ===================================================== */}

          <AnimatedSection delay={0.4}>
            <div
              className="
                mt-10
                flex
                flex-col
                gap-4
                border-t
                border-emerald-400/10
                pt-5
                font-mono
                text-[7px]
                tracking-[0.2em]
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              <span className="text-white/20">
                TEMPORAL INDEX // VYUHAM&apos;26
              </span>

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-emerald-400/30" />

                <motion.span
                  className="text-emerald-300/60"
                  animate={{
                    opacity: [0.4, 0.9, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  THE FUTURE AWAITS
                </motion.span>
              </div>

              <span className="text-white/15">
                STATUS // APPROACHING
              </span>
            </div>
          </AnimatedSection>

        </div>
      </section>
    </PageEntranceGate>
  );
}