"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

const stats = [
  {
    value: 30,
    suffix: "+",
    label: "Events",
    code: "EVENT SIGNALS",
    status: "ACTIVE",
    node: "01",
    strength: 92,
    accent: "emerald",
  },
  {
    value: 4,
    suffix: "",
    label: "Streams",
    code: "ACTIVE CHANNELS",
    status: "CONNECTED",
    node: "02",
    strength: 78,
    accent: "cyan",
  },
  {
    value: 3,
    suffix: "",
    label: "Days",
    code: "TEMPORAL WINDOW",
    status: "LOCKED",
    node: "03",
    strength: 86,
    accent: "violet",
  },
  {
    value: null,
    display: "∞",
    label: "Possibilities",
    code: "EXPLORATION CORE",
    status: "UNDEFINED",
    node: "04",
    strength: 100,
    accent: "lime",
  },
];

const accentStyles = {
  emerald: {
    number: "text-emerald-300",
    glow: "shadow-[0_0_30px_rgba(52,211,153,0.18)]",
    dot: "bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]",
    line: "bg-emerald-300",
    text: "text-emerald-300/70",
    border: "border-emerald-400/20",
    soft: "bg-emerald-400/[0.035]",
  },
  cyan: {
    number: "text-cyan-300",
    glow: "shadow-[0_0_30px_rgba(34,211,238,0.16)]",
    dot: "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]",
    line: "bg-cyan-300",
    text: "text-cyan-300/70",
    border: "border-cyan-400/20",
    soft: "bg-cyan-400/[0.035]",
  },
  violet: {
    number: "text-violet-300",
    glow: "shadow-[0_0_30px_rgba(167,139,250,0.16)]",
    dot: "bg-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.9)]",
    line: "bg-violet-300",
    text: "text-violet-300/70",
    border: "border-violet-400/20",
    soft: "bg-violet-400/[0.035]",
  },
  lime: {
    number: "text-lime-300",
    glow: "shadow-[0_0_30px_rgba(163,230,53,0.16)]",
    dot: "bg-lime-300 shadow-[0_0_12px_rgba(163,230,53,0.9)]",
    line: "bg-lime-300",
    text: "text-lime-300/70",
    border: "border-lime-400/20",
    soft: "bg-lime-400/[0.035]",
  },
};

function AnimatedNumber({
  value,
  suffix,
  accent,
}: {
  value: number;
  suffix: string;
  accent: keyof typeof accentStyles;
}) {
  const [count, setCount] = useState(0);
  const [glitch, setGlitch] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 1200;
    const steps = 30;
    const increment = value / steps;

    let current = 0;

    const timer = window.setInterval(() => {
      current += increment;

      if (current >= value) {
        setCount(value);
        window.clearInterval(timer);

        // Final signal lock glitch
        setGlitch(true);

        window.setTimeout(() => {
          setGlitch(false);
        }, 350);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => window.clearInterval(timer);
  }, [isInView, value]);

  const style = accentStyles[accent];

  return (
    <div ref={ref}>
      <motion.strong
        className={`
          relative
          inline-block
          font-display
          text-[clamp(42px,5vw,64px)]
          font-medium
          leading-none
          tracking-[-0.07em]
          ${style.number}
        `}
        animate={{
          opacity: glitch ? [1, 0.35, 1, 0.5, 1] : 1,
          x: glitch ? [0, -2, 3, -1, 0] : 0,
          filter: glitch
            ? [
                "blur(0px)",
                "blur(2px)",
                "blur(0px)",
                "blur(1px)",
                "blur(0px)",
              ]
            : "blur(0px)",
        }}
        transition={{
          duration: 0.35,
        }}
      >
        {String(count).padStart(2, "0")}

        {suffix && (
          <span className="ml-1 text-white/70">
            {suffix}
          </span>
        )}
      </motion.strong>
    </div>
  );
}

function InfiniteCore({
  accent,
}: {
  accent: keyof typeof accentStyles;
}) {
  const style = accentStyles[accent];

  return (
    <motion.div
      className={`
        relative
        inline-flex
        items-center
        justify-center
        ${style.number}
      `}
      animate={{
        scale: [1, 1.04, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Outer energy ring */}
      <motion.span
        aria-hidden="true"
        className={`
          absolute
          h-16
          w-24
          rounded-full
          border
          ${style.border}
        `}
        animate={{
          rotate: [0, 360],
          scale: [0.9, 1.08, 0.9],
          opacity: [0.2, 0.55, 0.2],
        }}
        transition={{
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <span
        className="
          relative
          z-10
          font-display
          text-[clamp(48px,5vw,68px)]
          font-light
          leading-none
        "
      >
        ∞
      </span>
    </motion.div>
  );
}

function SignalBars({
  strength,
  accent,
}: {
  strength: number;
  accent: keyof typeof accentStyles;
}) {
  const style = accentStyles[accent];

  return (
    <div className="flex items-center gap-1">
      {[...Array(12)].map((_, index) => {
        const threshold = (index + 1) * 8.33;
        const active = strength >= threshold;

        return (
          <motion.span
            key={index}
            className={`
              h-1
              w-2
              rounded-full
              transition-all
              duration-300
              ${
                active
                  ? `${style.line} opacity-80`
                  : "bg-white/8"
              }
            `}
            initial={{
              scaleX: 0,
              opacity: 0,
            }}
            whileInView={{
              scaleX: 1,
              opacity: active ? 0.8 : 0.35,
            }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.035,
              duration: 0.35,
            }}
          />
        );
      })}
    </div>
  );
}

export default function StatsBar() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <PageEntranceGate phase="stats">
      <section
        className="
          relative
          overflow-hidden
          border-y
          border-emerald-400/10
          bg-[#030806]
        "
        aria-label="Festival statistics"
      >
        {/* =====================================================
            ATMOSPHERE
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-40
            w-[70%]
            -translate-x-1/2
            rounded-full
            bg-emerald-400/2.5
            blur-[90px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-0
            left-[20%]
            h-24
            w-80
            rounded-full
            bg-cyan-400/[0.018]
            blur-[80px]
          "
        />

        {/* =====================================================
            GLOBAL SCAN
        ===================================================== */}

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
            duration: 5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />

        <div className="relative mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-80px))]">

          {/* =====================================================
              TELEMETRY HEADER
          ===================================================== */}

          <motion.div
            className="
              flex
              items-center
              justify-between
              border-b
              border-emerald-400/10
              py-4
            "
            initial={{
              opacity: 0,
              y: -8,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-50px",
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <div className="flex items-center gap-3">
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
                  scale: [1, 1.25, 1],
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
                VYUHAM&apos;26 // SYSTEM TELEMETRY
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden font-mono text-[7px] tracking-[0.22em] text-white/20 sm:block">
                NODE CLUSTER // 04
              </span>

              <span className="flex items-center gap-2 font-mono text-[7px] tracking-[0.22em] text-emerald-400/60">
                <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
                SIGNAL // STABLE
              </span>
            </div>
          </motion.div>

          {/* =====================================================
              CONNECTING SIGNAL
          ===================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-[8%]
              right-[8%]
              top-26
              hidden
              h-px
              bg-linear-to-r
              from-transparent
              via-emerald-400/10
              to-transparent
              md:block
            "
          >
            <motion.span
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
                duration: 4,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "linear",
              }}
            />
          </div>

          {/* =====================================================
              STAT NODES
          ===================================================== */}

          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => {
              const style = accentStyles[stat.accent as keyof typeof accentStyles];
              const isActive = activeNode === stat.node;

              return (
                <motion.article
                  key={stat.label}
                  className={`
                    group
                    relative
                    min-h-52
                    overflow-hidden
                    border-r
                    border-emerald-400/8
                    px-5
                    py-8
                    transition-all
                    duration-500
                    md:px-7
                    md:py-9
                    ${
                      index === 3
                        ? "border-r-0"
                        : ""
                    }
                    max-md:nth-2:border-r-0
                    max-md:nth-[n+3]:border-t
                    max-md:nth-[n+3]:border-emerald-400/8
                    ${
                      isActive
                        ? `${style.soft} ${style.glow}`
                        : "hover:bg-white/[0.012]"
                    }
                  `}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: "-60px",
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => setActiveNode(stat.node)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {/* Hover glow */}
                  <motion.div
                    aria-hidden="true"
                    className={`
                      pointer-events-none
                      absolute
                      left-1/2
                      top-1/2
                      h-32
                      w-32
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      blur-3xl
                      ${style.soft}
                    `}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1.3 : 0.8,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                  />

                  {/* Corner HUD */}
                  <div
                    aria-hidden="true"
                    className={`
                      pointer-events-none
                      absolute
                      left-3
                      top-3
                      h-3
                      w-3
                      border-l
                      border-t
                      transition-colors
                      duration-300
                      ${
                        isActive
                          ? style.border
                          : "border-white/10"
                      }
                    `}
                  />

                  <div
                    aria-hidden="true"
                    className={`
                      pointer-events-none
                      absolute
                      bottom-3
                      right-3
                      h-3
                      w-3
                      border-b
                      border-r
                      transition-colors
                      duration-300
                      ${
                        isActive
                          ? style.border
                          : "border-white/10"
                      }
                    `}
                  />

                  {/* Node ID */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`
                        font-mono
                        text-[7px]
                        tracking-[0.25em]
                        transition-colors
                        ${
                          isActive
                            ? style.text
                            : "text-white/20"
                        }
                      `}
                    >
                      NODE // {stat.node}
                    </span>

                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? style.dot
                            : "bg-white/15"
                        }
                      `}
                    />
                  </div>

                  {/* Number */}
                  <div className="relative z-10 mt-8">
                    {stat.value !== null ? (
                      <AnimatedNumber
                        value={stat.value}
                        suffix={stat.suffix}
                        accent={
                          stat.accent as keyof typeof accentStyles
                        }
                      />
                    ) : (
                      <InfiniteCore
                        accent={
                          stat.accent as keyof typeof accentStyles
                        }
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="relative z-10 mt-3">
                    <p className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-white/70">
                      {stat.label}
                    </p>

                    <p
                      className={`
                        mt-1
                        font-mono
                        text-[6px]
                        tracking-[0.2em]
                        transition-colors
                        ${
                          isActive
                            ? style.text
                            : "text-white/20"
                        }
                      `}
                    >
                      {stat.code}
                    </p>
                  </div>

                  {/* Signal strength */}
                  <div className="relative z-10 mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-[6px] tracking-[0.2em] text-white/15">
                        SIGNAL
                      </span>

                      <span
                        className={`
                          font-mono
                          text-[6px]
                          tracking-[0.15em]
                          ${
                            isActive
                              ? style.text
                              : "text-white/20"
                          }
                        `}
                      >
                        {stat.strength}%
                      </span>
                    </div>

                    <SignalBars
                      strength={stat.strength}
                      accent={
                        stat.accent as keyof typeof accentStyles
                      }
                    />
                  </div>

                  {/* Status */}
                  <div className="relative z-10 mt-4 flex items-center gap-2">
                    <span className="h-px w-5 bg-white/10" />

                    <span
                      className={`
                        font-mono
                        text-[6px]
                        tracking-[0.2em]
                        ${
                          isActive
                            ? style.text
                            : "text-white/15"
                        }
                      `}
                    >
                      {stat.status}
                    </span>
                  </div>

                  {/* Bottom scan */}
                  <motion.div
                    aria-hidden="true"
                    className={`
                      pointer-events-none
                      absolute
                      bottom-0
                      left-0
                      h-px
                      ${style.line}
                    `}
                    initial={{
                      width: "0%",
                      opacity: 0,
                    }}
                    animate={{
                      width: isActive ? "100%" : "0%",
                      opacity: isActive ? 0.45 : 0,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                  />
                </motion.article>
              );
            })}
          </div>

          {/* =====================================================
              FOOTER TELEMETRY
          ===================================================== */}

          <motion.div
            className="
              flex
              flex-col
              gap-3
              border-t
              border-emerald-400/10
              py-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-[6px] tracking-[0.25em] text-white/15">
                TEMPORAL INDEX // 2026
              </span>

              <span className="hidden h-px w-8 bg-emerald-400/15 sm:block" />

              <span className="font-mono text-[6px] tracking-[0.25em] text-emerald-400/35">
                ALL SYSTEMS NOMINAL
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[6px] tracking-[0.2em] text-white/15">
                VYUHAM&apos;26
              </span>

              <motion.span
                className="font-mono text-[6px] tracking-[0.2em] text-emerald-400/45"
                animate={{
                  opacity: [0.35, 0.8, 0.35],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                TRANSMISSION // LIVE
              </motion.span>
            </div>
          </motion.div>
        </div>
      </section>
    </PageEntranceGate>
  );
}