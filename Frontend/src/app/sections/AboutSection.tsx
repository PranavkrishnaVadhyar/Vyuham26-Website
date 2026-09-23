"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AnimatedSection from "@/components/motion/AnimatedSection";
import StreamSignalMap from "@/components/motion/StreamSignalMap";
import { Kicker, TextLink } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

/* =============================================================
   MISSION DATA
============================================================= */

const missionData = [
  {
    id: "01",
    label: "TECHNOLOGY",
    value: "ACTIVE",
    title: "TECHNOLOGY PROTOCOL",
    description:
      "Engineering, artificial intelligence, cybersecurity and emerging technologies converge inside the VYUHAM network.",
    modules: ["AI", "CYBER", "ROBOTICS", "DEV"],
  },
  {
    id: "02",
    label: "CULTURE",
    value: "CONNECTED",
    title: "CULTURAL NETWORK",
    description:
      "Technology meets people, creativity and expression through a shared digital environment.",
    modules: ["MEDIA", "ART", "DESIGN", "COMMUNITY"],
  },
  {
    id: "03",
    label: "IMAGINATION",
    value: "UNLOCKED",
    title: "IMAGINATION CORE",
    description:
      "Ideas move beyond conventional boundaries and become experiments, experiences and reality.",
    modules: ["IDEAS", "CREATE", "EXPLORE", "BUILD"],
  },
];

/* =============================================================
   NETWORK NODES
============================================================= */

const networkNodes = [
  {
    id: "NODE 01",
    x: 25,
    y: 27,
    strength: 96,
    label: "TECH",
  },
  {
    id: "NODE 02",
    x: 67,
    y: 21,
    strength: 91,
    label: "AI",
  },
  {
    id: "NODE 03",
    x: 50,
    y: 48,
    strength: 99,
    label: "CORE",
  },
  {
    id: "NODE 04",
    x: 23,
    y: 70,
    strength: 87,
    label: "CULTURE",
  },
  {
    id: "NODE 05",
    x: 75,
    y: 72,
    strength: 94,
    label: "IDEAS",
  },
];

/* =============================================================
   ABOUT SECTION
============================================================= */

export default function AboutSection() {
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState("NODE 03");
  const [signalStrength, setSignalStrength] = useState(98);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [missionInitialized, setMissionInitialized] = useState(false);

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  /* =========================================================
     SIGNAL STRENGTH
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 5) - 2;

      setSignalStrength((previous) =>
        Math.min(100, Math.max(92, previous + variation))
      );
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     MISSION INITIALIZATION
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setMissionInitialized(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /* =========================================================
     ACTIVE NODE ROTATION
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((current) => {
        const currentIndex = networkNodes.findIndex(
          (node) => node.id === current
        );

        const nextIndex =
          (currentIndex + 1) % networkNodes.length;

        return networkNodes[nextIndex].id;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     MOUSE TRACKING
  ========================================================= */

  const handleMapMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) * 2;

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    setMousePosition({
      x,
      y,
    });
  };

  const handleMapMouseLeave = () => {
    setMousePosition({
      x: 0,
      y: 0,
    });
  };

  const selectedNode = useMemo(
    () =>
      networkNodes.find(
        (node) => node.id === activeNode
      ) ?? networkNodes[2],
    [activeNode]
  );

  return (
    <PageEntranceGate phase="about">
      <section
        id="about"
        className="
          relative
          overflow-hidden
          border-b
          border-line
          py-24
          md:py-36
        "
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
            top-[32%]
            h-105
            w-105
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-emerald-400/[0.035]
            blur-[130px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[4%]
            top-[52%]
            h-130
            w-130
            -translate-y-1/2
            rounded-full
            bg-emerald-400/3
            blur-[140px]
          "
        />

        {/* =====================================================
            GLOBAL SIGNAL LINE
        ===================================================== */}

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-0
            h-px
            origin-left
            bg-linear-to-r
            from-transparent
            via-emerald-400/40
            to-transparent
          "
          initial={{
            scaleX: 0,
            opacity: 0,
          }}
          whileInView={{
            scaleX: 1,
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        {/* =====================================================
            BACKGROUND GRID
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.025]
            bg-[linear-gradient(rgba(52,211,153,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.35)_1px,transparent_1px)]
            bg-size-[80px_80px]
            mask-[linear-gradient(to_bottom,black,transparent)]
          "
        />


        {/* =====================================================
            MAIN CONTAINER
        ===================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-[min(1200px,calc(100%-48px))]
            md:w-[min(1200px,calc(100%-64px))]
          "
        >
          {/* ===================================================
              SECTION HEADER
          =================================================== */}

          <AnimatedSection>
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-emerald-400/10
                pb-3
              "
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
                    opacity: [
                      0.35,
                      1,
                      0.35,
                    ],
                    scale: [
                      1,
                      1.25,
                      1,
                    ],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                  }}
                />

                <Kicker>
                  01 / Mission brief
                </Kicker>
              </div>

              <span
                className="
                  hidden
                  font-mono
                  text-[8px]
                  tracking-[0.22em]
                  text-emerald-400/45
                  sm:block
                "
              >
                SYSTEM // MISSION
              </span>
            </div>
          </AnimatedSection>

          {/* ===================================================
              MAIN CONTENT
          =================================================== */}

          <div
            className="
              mt-12
              grid
              gap-16
              md:grid-cols-[0.9fr_1.1fr]
              md:items-center
              md:gap-20
            "
          >
            {/* =================================================
                LEFT — MISSION TYPOGRAPHY
            ================================================= */}

            <AnimatedSection>
              <div className="relative">
                {/* DIMENSION */}

                <motion.div
                  className="
                    mb-5
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
                    x: -15,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                >
                  <span className="h-px w-8 bg-emerald-400/30" />

                  DIMENSION // 01
                </motion.div>

                {/* HEADING */}

                <motion.h2
                  className="
                    font-display
                    text-[clamp(45px,6vw,82px)]
                    font-semibold
                    leading-[0.87]
                    tracking-[-0.045em]
                  "
                  initial={{
                    opacity: 0,
                    y: 35,
                    filter: "blur(10px)",
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                >
                  WHERE
                  <br />
                  IDEAS{" "}
                  <em className="relative not-italic text-emerald-300">
                    SHIFT
                    <motion.span
                      aria-hidden="true"
                      className="
                        absolute
                        -bottom-2
                        left-0
                        h-px
                        w-full
                        origin-left
                        bg-linear-to-r
                        from-emerald-400
                        via-emerald-200
                        to-transparent
                        shadow-[0_0_12px_rgba(52,211,153,0.7)]
                      "
                      initial={{
                        scaleX: 0,
                      }}
                      whileInView={{
                        scaleX: 1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.9,
                        delay: 0.65,
                      }}
                    />
                  </em>
                  <br />
                  REALITY.
                </motion.h2>

                {/* VERTICAL SIGNAL */}

                <motion.div
                  aria-hidden="true"
                  className="
                    absolute
                    -left-5
                    top-0
                    hidden
                    h-56
                    w-px
                    origin-top
                    bg-linear-to-b
                    from-transparent
                    via-emerald-400/40
                    to-transparent
                    md:block
                  "
                  initial={{
                    scaleY: 0,
                  }}
                  whileInView={{
                    scaleY: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.4,
                  }}
                />

                {/* DESCRIPTION */}

                <motion.p
                  className="
                    mt-9
                    max-w-md
                    text-sm
                    leading-[1.85]
                    text-muted
                    md:text-[15px]
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
                    duration: 0.8,
                    delay: 0.25,
                  }}
                >
                  Vyuham is a meeting point for
                  technology, culture and
                  unfiltered imagination. Three
                  days of competition,
                  collaboration and things that
                  refuse to stay inside a box.
                </motion.p>

                {/* =================================================
                    MISSION MODULES
                ================================================= */}

                <div className="mt-9 max-w-md">
                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-between
                      font-mono
                      text-[6px]
                      tracking-[0.2em]
                    "
                  >
                    <span className="text-white/20">
                      MISSION MODULES
                    </span>

                    <span className="text-emerald-400/40">
                      {missionInitialized
                        ? "INITIALIZED"
                        : "INITIALIZING"}
                    </span>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-3
                      border-y
                      border-emerald-400/10
                    "
                  >
                    {missionData.map(
                      (item, index) => {
                        const isActive =
                          activeMission ===
                          item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              setActiveMission(
                                isActive
                                  ? null
                                  : item.id
                              )
                            }
                            className={`
                              relative
                              py-4
                              text-left
                              transition-all
                              duration-300
                              ${index !==
                                missionData.length -
                                1
                                ? "border-b sm:border-b-0 sm:border-r border-emerald-400/10"
                                : ""
                              }
                              ${isActive
                                ? "bg-emerald-400/5"
                                : "hover:bg-emerald-400/2.5"
                              }
                            `}
                          >
                            <span
                              className="
                                block
                                px-3
                                font-mono
                                text-[6px]
                                tracking-[0.18em]
                                text-white/25
                              "
                            >
                              {item.label}
                            </span>

                            <div className="mt-2 flex items-center gap-2 px-3">
                              <motion.span
                                className="
                                  h-1
                                  w-1
                                  rounded-full
                                  bg-emerald-400
                                  shadow-[0_0_8px_rgba(52,211,153,0.8)]
                                "
                                animate={{
                                  opacity: [
                                    0.3,
                                    1,
                                    0.3,
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  delay:
                                    item.id ===
                                      "01"
                                      ? 0
                                      : index *
                                      0.1,
                                  repeat:
                                    Infinity,
                                }}
                              />

                              <span
                                className="
                                  font-mono
                                  text-[6px]
                                  tracking-[0.16em]
                                  text-emerald-400/60
                                "
                              >
                                {item.value}
                              </span>
                            </div>

                            <span
                              className="
                                absolute
                                bottom-0
                                left-0
                                h-px
                                bg-emerald-300
                              "
                              style={{
                                width: isActive
                                  ? "100%"
                                  : "0%",
                              }}
                            />
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* =================================================
                      EXPANDED MODULE
                  ================================================= */}

                  <AnimatePresence mode="wait">
                    {activeMission && (
                      <motion.div
                        key={activeMission}
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        className="
                          overflow-hidden
                          border-b
                          border-emerald-400/10
                        "
                      >
                        {(() => {
                          const mission =
                            missionData.find(
                              (item) =>
                                item.id ===
                                activeMission
                            );

                          if (!mission)
                            return null;

                          return (
                            <div className="px-4 py-5">
                              <div className="flex items-start justify-between gap-5">
                                <div>
                                  <div
                                    className="
                                      font-mono
                                      text-[6px]
                                      tracking-[0.2em]
                                      text-emerald-400/40
                                    "
                                  >
                                    MODULE //
                                    {mission.id}
                                  </div>

                                  <h3
                                    className="
                                      mt-2
                                      font-display
                                      text-lg
                                      text-white/80
                                    "
                                  >
                                    {
                                      mission.title
                                    }
                                  </h3>
                                </div>

                                <span
                                  className="
                                    font-mono
                                    text-[7px]
                                    text-emerald-400/60
                                  "
                                >
                                  ONLINE
                                </span>
                              </div>

                              <p
                                className="
                                  mt-3
                                  max-w-md
                                  text-xs
                                  leading-6
                                  text-white/35
                                "
                              >
                                {
                                  mission.description
                                }
                              </p>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {mission.modules.map(
                                  (module) => (
                                    <span
                                      key={module}
                                      className="
                                        border
                                        border-emerald-400/10
                                        bg-emerald-400/2.5
                                        px-2
                                        py-1
                                        font-mono
                                        text-[6px]
                                        tracking-[0.15em]
                                        text-emerald-400/50
                                      "
                                    >
                                      {module}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CTA */}

                <motion.div
                  className="mt-7"
                  initial={{
                    opacity: 0,
                    y: 10,
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
                    delay: 0.55,
                  }}
                >
                  <TextLink href="/about">
                    Discover Vyuham
                  </TextLink>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* =================================================
                RIGHT — SIGNAL NETWORK
            ================================================= */}

            <AnimatedSection delay={0.2}>
              <div className="relative">
                {/* MAP HEADER */}

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-7 bg-emerald-400/30" />

                    <span
                      className="
                        font-mono
                        text-[7px]
                        tracking-[0.25em]
                        text-emerald-400/50
                      "
                    >
                      SIGNAL NETWORK // ACTIVE
                    </span>
                  </div>

                  <motion.span
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-emerald-400/50
                    "
                    animate={{
                      opacity: [
                        0.4,
                        1,
                        0.4,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    {signalStrength}%
                  </motion.span>
                </div>

                {/* =================================================
                    MAP FRAME
                ================================================= */}

                <motion.div
                  onMouseMove={handleMapMouseMove}
                  onMouseLeave={
                    handleMapMouseLeave
                  }
                  style={{
                    perspective: 1000,
                  }}
                  className="
                    group
                    relative
                    min-h-100
                    overflow-hidden
                    border
                    border-emerald-400/10
                    bg-[#030806]/50
                    p-4
                    md:min-h-120
                  "
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 1,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                >
                  {/* MAP PARALLAX LAYER */}

                  <motion.div
                    className="
                      absolute
                      inset-0
                    "
                    animate={{
                      x:
                        mousePosition.x * 6,
                      y:
                        mousePosition.y * 6,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 20,
                    }}
                  >
                    {/* Grid */}

                    <div
                      className="
                        absolute
                        inset-0
                        opacity-[0.08]
                        bg-[linear-gradient(rgba(52,211,153,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.4)_1px,transparent_1px)]
                        bg-size-[40px_40px]
                      "
                    />

                    {/* Center glow */}

                    <motion.div
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        h-48
                        w-48
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-emerald-400/4
                        blur-[50px]
                      "
                      animate={{
                        scale: [
                          1,
                          1.2,
                          1,
                        ],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                      }}
                    />

                    {/* NETWORK CONNECTIONS */}

                    <NetworkLine
                      from={networkNodes[0]}
                      to={networkNodes[2]}
                    />

                    <NetworkLine
                      from={networkNodes[1]}
                      to={networkNodes[2]}
                    />

                    <NetworkLine
                      from={networkNodes[3]}
                      to={networkNodes[2]}
                    />

                    <NetworkLine
                      from={networkNodes[4]}
                      to={networkNodes[2]}
                    />

                    <NetworkLine
                      from={networkNodes[0]}
                      to={networkNodes[1]}
                    />

                    {/* MOVING DATA PACKETS */}

                    <DataPacket
                      from={networkNodes[0]}
                      to={networkNodes[2]}
                      delay={0}
                    />

                    <DataPacket
                      from={networkNodes[1]}
                      to={networkNodes[2]}
                      delay={1.2}
                    />

                    <DataPacket
                      from={networkNodes[3]}
                      to={networkNodes[2]}
                      delay={2.2}
                    />

                    {/* NODES */}

                    {networkNodes.map(
                      (node) => {
                        const isActive =
                          node.id ===
                          activeNode;

                        return (
                          <button
                            key={node.id}
                            type="button"
                            onClick={() =>
                              setActiveNode(
                                node.id
                              )
                            }
                            className="
                              absolute
                              z-20
                              -translate-x-1/2
                              -translate-y-1/2
                              outline-none
                            "
                            style={{
                              left: `${node.x}%`,
                              top: `${node.y}%`,
                            }}
                            aria-label={`Select ${node.id}`}
                          >
                            {/* Radar */}

                            {isActive && (
                              <motion.span
                                className="
                                  absolute
                                  left-1/2
                                  top-1/2
                                  h-12
                                  w-12
                                  -translate-x-1/2
                                  -translate-y-1/2
                                  rounded-full
                                  border
                                  border-emerald-400/20
                                "
                                animate={{
                                  scale: [
                                    0.7,
                                    1.5,
                                  ],
                                  opacity: [
                                    0.8,
                                    0,
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat:
                                    Infinity,
                                }}
                              />
                            )}

                            {/* Node */}

                            <motion.span
                              className={`
                                block
                                h-2
                                w-2
                                rounded-full
                                ${isActive
                                  ? "bg-emerald-200"
                                  : "bg-emerald-400/70"
                                }
                              `}
                              animate={{
                                scale: isActive
                                  ? [
                                    1,
                                    1.4,
                                    1,
                                  ]
                                  : [1, 1.1, 1],
                              }}
                              transition={{
                                duration:
                                  isActive
                                    ? 1.2
                                    : 2,
                                repeat:
                                  Infinity,
                              }}
                              style={{
                                boxShadow:
                                  "0 0 14px rgba(52,211,153,0.9)",
                              }}
                            />

                            {/* Label */}

                            <span
                              className={`
                                absolute
                                left-4
                                top-0
                                whitespace-nowrap
                                font-mono
                                text-[6px]
                                tracking-[0.15em]
                                ${isActive
                                  ? "text-emerald-300/80"
                                  : "text-white/20"
                                }
                              `}
                            >
                              {node.label}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </motion.div>

                  {/* =================================================
                      TECHNICAL COORDINATES
                  ================================================= */}

                  <div
                    className="
                      absolute
                      left-5
                      top-4
                      z-30
                      font-mono
                      text-[6px]
                      leading-4
                      tracking-[0.2em]
                      text-white/20
                    "
                  >
                    X: 026
                    <br />
                    Y: 2026
                    <br />
                    Z: 001
                  </div>

                  <div
                    className="
                      absolute
                      right-5
                      top-4
                      z-30
                      text-right
                      font-mono
                      text-[6px]
                      leading-4
                      tracking-[0.2em]
                      text-emerald-400/40
                    "
                  >
                    SIGNAL
                    <br />
                    {signalStrength >= 95
                      ? "LOCKED"
                      : "SYNCING"}
                  </div>

                  {/* =================================================
                      STREAM SIGNAL MAP
                  ================================================= */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      z-10
                      flex
                      items-center
                      justify-center
                      opacity-30
                    "
                  >
                    <StreamSignalMap />
                  </div>

                  {/* =================================================
                      SCAN LINE
                  ================================================= */}

                  <motion.div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-0
                      right-0
                      z-40
                      h-px
                      bg-linear-to-r
                      from-transparent
                      via-emerald-300/60
                      to-transparent
                      shadow-[0_0_14px_rgba(52,211,153,0.7)]
                    "
                    animate={{
                      top: [
                        "5%",
                        "95%",
                      ],
                      opacity: [
                        0,
                        0.9,
                        0,
                      ],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                    }}
                  />

                  {/* =================================================
                      RECONNAISSANCE PANEL
                  ================================================= */}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedNode.id}
                      initial={{
                        opacity: 0,
                        x: 10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                      className="
                        absolute
                        bottom-14
                        left-5
                        z-30
                        w-48
                        border
                        border-emerald-400/10
                        bg-[#030806]/80
                        p-3
                        backdrop-blur-md
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          font-mono
                          text-[6px]
                          tracking-[0.18em]
                        "
                      >
                        <span className="text-white/25">
                          RECON // NODE
                        </span>

                        <span className="text-emerald-400/60">
                          {selectedNode.id}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-end justify-between">
                          <span
                            className="
                              font-display
                              text-lg
                              text-white/80
                            "
                          >
                            {
                              selectedNode.label
                            }
                          </span>

                          <span
                            className="
                              font-mono
                              text-[7px]
                              text-emerald-400/60
                            "
                          >
                            {
                              selectedNode.strength
                            }
                            %
                          </span>
                        </div>

                        <div className="mt-2 h-px bg-white/5">
                          <motion.div
                            className="
                              h-px
                              bg-linear-to-r
                              from-emerald-500
                              to-emerald-200
                            "
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${selectedNode.strength}%`,
                            }}
                            transition={{
                              duration: 0.8,
                            }}
                          />
                        </div>
                      </div>

                      <div
                        className="
                          mt-3
                          grid
                          grid-cols-2
                          gap-2
                          font-mono
                          text-[5px]
                          tracking-[0.15em]
                        "
                      >
                        <span className="text-white/20">
                          STATUS
                          <br />
                          <b className="text-emerald-400/60">
                            ACTIVE
                          </b>
                        </span>

                        <span className="text-white/20">
                          CHANNEL
                          <br />
                          <b className="text-emerald-400/60">
                            STABLE
                          </b>
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* =================================================
                      CORNER BRACKETS
                  ================================================= */}

                  <div className="pointer-events-none absolute left-0 top-0 z-50 h-7 w-7 border-l border-t border-emerald-400/60" />
                  <div className="pointer-events-none absolute right-0 top-0 z-50 h-7 w-7 border-r border-t border-emerald-400/60" />
                  <div className="pointer-events-none absolute bottom-0 left-0 z-50 h-7 w-7 border-b border-l border-emerald-400/60" />
                  <div className="pointer-events-none absolute bottom-0 right-0 z-50 h-7 w-7 border-b border-r border-emerald-400/60" />

                  {/* =================================================
                      BOTTOM TELEMETRY
                  ================================================= */}

                  <div
                    className="
                      absolute
                      bottom-4
                      left-5
                      right-5
                      z-50
                      flex
                      items-center
                      justify-between
                      border-t
                      border-emerald-400/10
                      pt-3
                    "
                  >
                    <span
                      className="
                        font-mono
                        text-[6px]
                        tracking-[0.2em]
                        text-white/20
                      "
                    >
                      TRANSMISSION // STABLE
                    </span>

                    <motion.span
                      className="
                        font-mono
                        text-[6px]
                        tracking-[0.2em]
                        text-emerald-400/60
                      "
                      animate={{
                        opacity: [
                          0.35,
                          1,
                          0.35,
                        ],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                      }}
                    >
                      ● LIVE
                    </motion.span>
                  </div>
                </motion.div>

                {/* =================================================
                    MAP CAPTION
                ================================================= */}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-white/20
                    "
                  >
                    VYUHAM // NETWORK ORIGIN
                  </span>

                  <span
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-emerald-400/40
                    "
                  >
                    CORE → SIGNAL → REALITY
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* =====================================================
              SYSTEM DIAGNOSTICS
          ===================================================== */}

          <AnimatedSection delay={0.3}>
            <div className="mt-14">
              <button
                type="button"
                onClick={() =>
                  setDiagnosticsOpen(
                    (value) => !value
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  border-y
                  border-emerald-400/10
                  py-3
                  text-left
                "
              >
                <span
                  className="
                    font-mono
                    text-[7px]
                    tracking-[0.22em]
                    text-white/25
                  "
                >
                  SYSTEM DIAGNOSTICS
                </span>

                <span
                  className="
                    font-mono
                    text-[7px]
                    tracking-[0.18em]
                    text-emerald-400/50
                  "
                >
                  {diagnosticsOpen
                    ? "CLOSE // SYS"
                    : "OPEN // SYS"}
                </span>
              </button>

              <AnimatePresence>
                {diagnosticsOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-px
                        bg-emerald-400/10
                        md:grid-cols-4
                      "
                    >
                      <Diagnostic
                        label="CORE"
                        value="ONLINE"
                      />

                      <Diagnostic
                        label="SIGNAL"
                        value={`${signalStrength}%`}
                      />

                      <Diagnostic
                        label="NETWORK"
                        value="STABLE"
                      />

                      <Diagnostic
                        label="MISSION"
                        value="ACTIVE"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>

          {/* =====================================================
              BOTTOM SYSTEM AXIS
          ===================================================== */}

          <AnimatedSection delay={0.4}>
            <div className="mt-16 border-t border-emerald-400/10 pt-5">
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
                <span>IDEA</span>

                <span className="text-emerald-400/50">
                  MISSION AXIS // 01
                </span>

                <span>REALITY</span>
              </div>

              <div className="relative mt-4 h-px bg-white/5">
                <motion.div
                  className="
                    absolute
                    left-0
                    top-0
                    h-px
                    w-[42%]
                    origin-left
                    bg-linear-to-r
                    from-emerald-500
                    via-emerald-300
                    to-transparent
                    shadow-[0_0_10px_rgba(52,211,153,0.6)]
                  "
                  initial={{
                    scaleX: 0,
                  }}
                  whileInView={{
                    scaleX: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 1.6,
                  }}
                />

                <motion.div
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
                    left: [
                      "0%",
                      "42%",
                    ],
                    opacity: [
                      0,
                      1,
                      0,
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />

                <motion.div
                  className="
                    absolute
                    left-[42%]
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                  "
                  animate={{
                    scale: [
                      1,
                      1.3,
                      1,
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
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
                  text-emerald-400/40
                "
              >
                MISSION // IN PROGRESS
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
            h-24
            bg-linear-to-t
            from-[#030806]
            to-transparent
          "
        />
      </section>
    </PageEntranceGate>
  );
}

/* =============================================================
   NETWORK LINE
============================================================= */

function NetworkLine({
  from,
  to,
}: {
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const length = Math.sqrt(
    dx * dx + dy * dy
  ).toFixed(4);

  const angle = (
    Math.atan2(dy, dx) *
    (180 / Math.PI)
  ).toFixed(4);

  return (
    <motion.div
      aria-hidden="true"
      className="
        absolute
        z-10
        h-px
        origin-left
        bg-linear-to-r
        from-emerald-400/5
        via-emerald-400/30
        to-emerald-300/5
      "
      style={{
        left: `${from.x}%`,
        top: `${from.y}%`,
        width: `${length}%`,
        transform: `rotate(${angle}deg)`,
      }}
      animate={{
        opacity: [
          0.2,
          0.7,
          0.2,
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* =============================================================
   DATA PACKET
============================================================= */

function DataPacket({
  from,
  to,
  delay,
}: {
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
  delay: number;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className="
        absolute
        z-20
        h-1
        w-1
        rounded-full
        bg-emerald-200
        shadow-[0_0_10px_rgba(167,243,208,1)]
      "
      style={{
        left: `${from.x}%`,
        top: `${from.y}%`,
      }}
      animate={{
        left: [
          `${from.x}%`,
          `${to.x}%`,
        ],
        top: [
          `${from.y}%`,
          `${to.y}%`,
        ],
        opacity: [
          0,
          1,
          0,
        ],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "linear",
      }}
    />
  );
}

/* =============================================================
   DIAGNOSTIC
============================================================= */

function Diagnostic({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        bg-[#030806]/80
        px-4
        py-4
      "
    >
      <div
        className="
          font-mono
          text-[6px]
          tracking-[0.2em]
          text-white/20
        "
      >
        {label}
      </div>

      <div
        className="
          mt-2
          flex
          items-center
          gap-2
          font-mono
          text-[8px]
          tracking-[0.15em]
          text-emerald-400/70
        "
      >
        <motion.span
          className="
            h-1
            w-1
            rounded-full
            bg-emerald-400
          "
          animate={{
            opacity: [
              0.3,
              1,
              0.3,
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />

        {value}
      </div>
    </div>
  );
}