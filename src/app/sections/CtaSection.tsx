"use client";

import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";
import CountdownTimer from "@/components/ui/CountdownTimer";
import SignalRing from "@/components/motion/SignalRing";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CtaSection() {
  /* =========================================================
     SYSTEM STATE
  ========================================================= */

  const [bootStep, setBootStep] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [systemGlitch, setSystemGlitch] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     MOUSE PARALLAX
  ========================================================= */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 120,
    damping: 18,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 120,
    damping: 18,
  });

  /* =========================================================
     BOOT SEQUENCE
  ========================================================= */

  useEffect(() => {
    const timers = [
      setTimeout(() => setBootStep(1), 400),
      setTimeout(() => setBootStep(2), 900),
      setTimeout(() => setBootStep(3), 1450),
      setTimeout(() => setBootStep(4), 2000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  /* =========================================================
     RANDOM SIGNAL INTERFERENCE
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      const chance = Math.random();

      if (chance > 0.72) {
        setSystemGlitch(true);

        setTimeout(() => {
          setSystemGlitch(false);
        }, 350);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     KONAMI / EASTER EGG
  ========================================================= */

  useEffect(() => {
    const sequence = [
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

    let index = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === sequence[index]?.toLowerCase()
      ) {
        index += 1;

        if (index === sequence.length) {
          setEasterEgg(true);
          setTerminalMode(true);
          index = 0;

          setTimeout(() => {
            setTerminalMode(false);
          }, 7000);
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* =========================================================
     MOUSE HANDLER
  ========================================================= */

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) * 8;

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) * 8;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  /* =========================================================
     REGISTRATION ACCESS
  ========================================================= */

  const handleAccess = () => {
    setAccessGranted(true);

    setTimeout(() => {
      window.location.href = "/register";
    }, 1300);
  };

  return (
    <PageEntranceGate phase="cta">
      <section
        id="register"
        className="
          relative
          overflow-hidden
          border-t
          border-emerald-400/10
          bg-[#030806]
          py-24
          md:py-32
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
            top-[38%]
            h-125
            w-125
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-emerald-400/4.5
            blur-[140px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[8%]
            top-[30%]
            h-112.5
            w-112.5
            rounded-full
            bg-emerald-300/4
            blur-[130px]
          "
        />

        {/* =====================================================
            GIANT WATERMARK
        ===================================================== */}

        <motion.span
          aria-hidden="true"
          onDoubleClick={() => {
            setEasterEgg(true);
            setTerminalMode(true);

            setTimeout(() => {
              setTerminalMode(false);
            }, 7000);
          }}
          className="
            pointer-events-auto
            absolute
            bottom-[-6%]
            right-[-2%]
            cursor-pointer
            select-none
            font-display
            text-[20vw]
            font-bold
            leading-none
            tracking-[-0.08em]
            text-[#B6FF00]/[0.07]
          "
          animate={{
            x: [0, -18, 0],
            opacity: [0.65, 1, 0.65],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          VYUHAM
        </motion.span>

        {/* =====================================================
            TOP SIGNAL SWEEP
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
            via-emerald-300/70
            to-transparent
          "
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        {/* =====================================================
            SYSTEM GRID
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.035]
            bg-[linear-gradient(rgba(52,211,153,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.35)_1px,transparent_1px)]
            bg-size-[80px_80px]
            mask-[linear-gradient(to_bottom,black,transparent)]
          "
        />

        {/* =====================================================
            GLITCH OVERLAY
        ===================================================== */}

        {systemGlitch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.7, 0],
                scaleY: [1, 0.98, 1],
              }}
              transition={{ duration: 0.3 }}
              className="
                pointer-events-none
                absolute
                inset-0
                z-40
                bg-emerald-300/2.5
                mix-blend-screen
              "
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.35 }}
              className="
                pointer-events-none
                absolute
                left-0
                right-0
                top-1/2
                z-50
                h-px
                bg-emerald-200/70
                shadow-[0_0_20px_rgba(52,211,153,0.9)]
              "
            />
          </>
        )}

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
            <div className="flex items-center justify-between border-b border-emerald-400/10 pb-3">
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
                    opacity: [0.25, 1, 0.25],
                    scale: [1, 1.35, 1],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                  }}
                />

                <Kicker>03 / Final transmission</Kicker>
              </div>

              <span
                className="
                  hidden
                  font-mono
                  text-[8px]
                  tracking-[0.25em]
                  text-emerald-400/50
                  sm:block
                "
              >
                CHANNEL // OPEN
              </span>
            </div>
          </AnimatedSection>

          {/* ===================================================
              MAIN GRID
          =================================================== */}

          <div
            className="
              mt-12
              grid
              grid-cols-1
              items-center
              gap-14
              lg:grid-cols-12
              lg:gap-16
            "
          >
            {/* =================================================
                LEFT — ACCESS TERMINAL
            ================================================= */}

            <div className="lg:col-span-6">
              <AnimatedSection>
                <div className="relative">
                  {/* ACCESS LABEL */}

                  <motion.div
                    className="
                      mb-5
                      flex
                      items-center
                      gap-3
                      font-mono
                      text-[7px]
                      tracking-[0.3em]
                      text-emerald-300/50
                    "
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <span className="h-px w-8 bg-emerald-400/30" />
                    ACCESS TERMINAL // 03
                  </motion.div>

                  {/* HEADING */}

                  <motion.h2
                    className="
                      font-display
                      text-[clamp(42px,5.5vw,76px)]
                      font-semibold
                      leading-[0.88]
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
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    ARE YOU
                    <br />
                    READY
                    <br />
                    TO{" "}
                    <em className="relative not-italic text-emerald-300">
                      ENTER?
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
                          from-emerald-400
                          via-emerald-200
                          to-transparent
                          shadow-[0_0_14px_rgba(52,211,153,0.8)]
                        "
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.9,
                          delay: 0.7,
                        }}
                      />
                    </em>
                  </motion.h2>

                  {/* VERTICAL SIGNAL */}

                  <motion.div
                    aria-hidden="true"
                    className="
                      absolute
                      -left-5
                      top-0
                      hidden
                      h-64
                      w-px
                      origin-top
                      bg-linear-to-b
                      from-transparent
                      via-emerald-400/40
                      to-transparent
                      md:block
                    "
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: 0.3,
                    }}
                  />

                  {/* DESCRIPTION */}

                  <motion.p
                    className="
                      mt-8
                      max-w-md
                      text-sm
                      leading-[1.85]
                      text-white/45
                      md:text-[15px]
                    "
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: 0.25,
                    }}
                  >
                    The count is officially on. Registrations are live —
                    leave the ordinary behind and secure your pass for
                    Vyuham &apos;26.
                  </motion.p>

                  {/* =================================================
                      SYSTEM STATUS
                  ================================================= */}

                  <motion.div
                    className="
                      mt-7
                      grid
                      grid-cols-2
                      gap-x-6
                      gap-y-3
                      border-y
                      border-emerald-400/10
                      py-4
                      font-mono
                      text-[7px]
                      tracking-[0.18em]
                    "
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <SystemStatus
                      label="REGISTRATION"
                      value="ONLINE"
                    />

                    <SystemStatus
                      label="EVENT CHANNEL"
                      value="ACTIVE"
                    />

                    <SystemStatus
                      label="TEMPORAL LINK"
                      value="STABLE"
                    />

                    <SystemStatus
                      label="ACCESS"
                      value="OPEN"
                    />
                  </motion.div>

                  {/* =================================================
                      ACCESS BUTTON
                  ================================================= */}

                  <motion.div
                    className="mt-8 flex flex-wrap items-center gap-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={
                        accessGranted
                          ? {
                            scale: [1, 1.04, 1],
                          }
                          : {
                            scale: [1, 1.015, 1],
                          }
                      }
                      transition={{
                        duration: accessGranted ? 0.6 : 4,
                        repeat: accessGranted ? 0 : Infinity,
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleAccess}
                        className="
                          group
                          relative
                          overflow-hidden
                          border
                          border-emerald-300/50
                          bg-emerald-300
                          px-6
                          py-3
                          font-mono
                          text-[10px]
                          font-semibold
                          tracking-[0.18em]
                          text-[#031008]
                          transition-all
                          duration-300
                          hover:border-emerald-200
                          hover:bg-emerald-200
                          hover:shadow-[0_0_30px_rgba(52,211,153,0.35)]
                        "
                      >
                        <span
                          className="
                            absolute
                            inset-0
                            -translate-x-full
                            bg-white/30
                            transition-transform
                            duration-500
                            group-hover:translate-x-full
                          "
                        />

                        <span className="relative z-10">
                          {accessGranted
                            ? "ACCESS GRANTED ✓"
                            : "INITIALIZE ACCESS"}
                        </span>
                      </button>
                    </motion.div>

                    <Button href="/contact" variant="outline">
                      Get in touch
                    </Button>
                  </motion.div>

                  {/* =================================================
                      ACCESS STATE
                  ================================================= */}

                  <motion.div
                    className="
                      mt-5
                      font-mono
                      text-[7px]
                      tracking-[0.22em]
                    "
                    animate={{
                      opacity: accessGranted
                        ? [0.5, 1, 0.5]
                        : 0.5,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: accessGranted ? Infinity : 0,
                    }}
                  >
                    <span className="text-white/20">
                      SYSTEM STATUS //
                    </span>

                    <span className="ml-2 text-emerald-400">
                      {accessGranted
                        ? "CLEARANCE VERIFIED"
                        : "REGISTRATION WINDOW OPEN"}
                    </span>
                  </motion.div>

                  {/* =================================================
                      BOOT TERMINAL
                  ================================================= */}

                  <div
                    className="
                      mt-8
                      border
                      border-emerald-400/10
                      bg-black/20
                      p-4
                      font-mono
                      text-[7px]
                      tracking-[0.14em]
                    "
                  >
                    <BootLine
                      active={bootStep >= 1}
                      text="VYUHAM CORE // INITIALIZING"
                    />

                    <BootLine
                      active={bootStep >= 2}
                      text="SIGNAL // DETECTED"
                    />

                    <BootLine
                      active={bootStep >= 3}
                      text="TEMPORAL CHANNEL // OPEN"
                    />

                    <BootLine
                      active={bootStep >= 4}
                      text="ACCESS TERMINAL // ONLINE"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* =================================================
                RIGHT — COUNTDOWN REACTOR
            ================================================= */}

            <div className="lg:col-span-6">
              <AnimatedSection delay={0.2}>
                <motion.div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    rotateX: smoothY,
                    rotateY: smoothX,
                  }}
                  className="
                    relative
                    overflow-hidden
                    border
                    border-emerald-400/20
                    bg-[#030806]/85
                    p-6
                    shadow-[0_0_70px_rgba(52,211,153,0.08)]
                    backdrop-blur-xl
                    md:p-9
                  "
                >
                  {/* =================================================
                      CARD GLOW
                  ================================================= */}

                  <motion.div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-1/2
                      h-72
                      w-72
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-emerald-400/[0.035]
                      blur-[70px]
                    "
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                    }}
                  />

                  {/* =================================================
                      CARD CORNERS
                  ================================================= */}

                  <Corner position="left-top" />
                  <Corner position="right-top" />
                  <Corner position="left-bottom" />
                  <Corner position="right-bottom" />

                  {/* =================================================
                      SIGNAL RINGS
                  ================================================= */}

                  <SignalRing
                    count={4}
                    size={170}
                    duration={5}
                    color="rgba(52,211,153,0.22)"
                    className="-right-16 -top-16"
                  />

                  <SignalRing
                    count={2}
                    size={90}
                    duration={3}
                    color="rgba(52,211,153,0.15)"
                    className="-bottom-10 -left-10"
                  />

                  {/* =================================================
                      CARD HEADER
                  ================================================= */}

                  <div
                    className="
                      relative
                      z-10
                      mb-6
                      flex
                      items-center
                      justify-between
                      border-b
                      border-emerald-400/10
                      pb-4
                    "
                  >
                    <span
                      className="
                        font-mono
                        text-[9px]
                        tracking-[0.25em]
                        text-emerald-400
                      "
                    >
                      /// TEMPORAL COUNTDOWN
                    </span>

                    <motion.span
                      className="
                        rounded-full
                        border
                        border-emerald-400/25
                        bg-emerald-400/5
                        px-3
                        py-1
                        font-mono
                        text-[8px]
                        tracking-[0.12em]
                        text-emerald-400/70
                      "
                      animate={{
                        opacity: [0.45, 1, 0.45],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                      }}
                    >
                      T-MINUS // 2026
                    </motion.span>
                  </div>

                  {/* =================================================
                      REACTOR CORE
                  ================================================= */}

                  <div
                    className="
                      relative
                      z-10
                      flex
                      min-h-67.5
                      items-center
                      justify-center
                    "
                  >
                    {/* Outer reactor */}

                    <motion.div
                      className="
                        absolute
                        h-65
                        w-65
                        rounded-full
                        border
                        border-emerald-400/10
                      "
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <span
                        className="
                          absolute
                          left-1/2
                          top-0
                          h-2
                          w-2
                          -translate-x-1/2
                          rounded-full
                          bg-emerald-300
                          shadow-[0_0_14px_rgba(52,211,153,1)]
                        "
                      />
                    </motion.div>

                    {/* Second reactor */}

                    <motion.div
                      className="
                        absolute
                        h-52.5
                        w-52.5
                        rounded-full
                        border
                        border-dashed
                        border-emerald-400/15
                      "
                      animate={{
                        rotate: -360,
                      }}
                      transition={{
                        duration: 24,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Core */}

                    <motion.div
                      className="
                        relative
                        z-10
                        flex
                        h-38.75
                        w-38.75
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-emerald-300/20
                        bg-[#06140c]/90
                        shadow-[0_0_50px_rgba(52,211,153,0.12)]
                      "
                      animate={{
                        boxShadow: [
                          "0 0 35px rgba(52,211,153,0.08)",
                          "0 0 70px rgba(52,211,153,0.2)",
                          "0 0 35px rgba(52,211,153,0.08)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    >
                      <div className="text-center">
                        <div
                          className="
                            mb-2
                            font-mono
                            text-[7px]
                            tracking-[0.3em]
                            text-emerald-400/50
                          "
                        >
                          T-MINUS
                        </div>

                        <CountdownTimer
                          targetDate="2026-10-30T09:00:00+05:30"
                          className="py-1"
                        />

                        <div
                          className="
                            mt-2
                            font-mono
                            text-[6px]
                            tracking-[0.2em]
                            text-emerald-400/40
                          "
                        >
                          TEMPORAL CORE
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* =================================================
                      EVENT DATA
                  ================================================= */}

                  <div
                    className="
                      relative
                      z-10
                      grid
                      grid-cols-2
                      border-t
                      border-emerald-400/10
                      pt-5
                    "
                  >
                    <DataBlock
                      label="EVENT WINDOW"
                      value="30 OCT → 01 NOV"
                      sub="2026"
                    />

                    <DataBlock
                      label="SIGNAL ORIGIN"
                      value="TECHNOCITY"
                      sub="THIRUVANANTHAPURAM"
                      bordered
                    />
                  </div>

                  {/* =================================================
                      MISSION DATA
                  ================================================= */}

                  <div
                    className="
                      relative
                      z-10
                      mt-5
                      grid
                      grid-cols-3
                      gap-2
                      border-t
                      border-emerald-400/10
                      pt-5
                    "
                  >
                    <MiniData
                      label="EVENT"
                      value="VYUHAM'26"
                    />

                    <MiniData
                      label="CHANNEL"
                      value="OPEN"
                    />

                    <MiniData
                      label="CLEARANCE"
                      value="PUBLIC"
                    />
                  </div>

                  {/* =================================================
                      ENERGY CONNECTION
                  ================================================= */}

                  <div className="relative z-10 mt-7">
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        font-mono
                        text-[6px]
                        tracking-[0.2em]
                        text-white/20
                      "
                    >
                      <span>ACCESS</span>

                      <span className="text-emerald-400/50">
                        SIGNAL TRANSFER
                      </span>

                      <span>EVENT</span>
                    </div>

                    <div className="relative mt-4 h-px bg-white/5">
                      <motion.div
                        className="
                          absolute
                          left-0
                          top-0
                          h-px
                          w-full
                          bg-linear-to-r
                          from-transparent
                          via-emerald-400/60
                          to-transparent
                        "
                        animate={{
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />

                      <motion.span
                        className="
                          absolute
                          top-1/2
                          h-1.5
                          w-1.5
                          -translate-y-1/2
                          rounded-full
                          bg-emerald-200
                          shadow-[0_0_14px_rgba(52,211,153,1)]
                        "
                        animate={{
                          left: ["0%", "100%"],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          repeatDelay: 0.7,
                          ease: "linear",
                        }}
                      />
                    </div>
                  </div>

                  {/* =================================================
                      TEMPORAL AXIS
                  ================================================= */}

                  <div className="relative z-10 mt-7">
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        font-mono
                        text-[6px]
                        tracking-[0.2em]
                        text-white/20
                      "
                    >
                      <span>NOW</span>

                      <span className="text-emerald-400/45">
                        TEMPORAL AXIS // 2026
                      </span>

                      <span>ACTIVATION</span>
                    </div>

                    <div className="relative mt-4 h-px bg-white/5">
                      <motion.div
                        className="
                          absolute
                          left-0
                          top-0
                          h-px
                          w-[68%]
                          bg-linear-to-r
                          from-emerald-500
                          via-emerald-300
                          to-transparent
                          shadow-[0_0_10px_rgba(52,211,153,0.7)]
                        "
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1.8,
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
                          left: ["0%", "68%"],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />

                      <span
                        className="
                          absolute
                          left-[68%]
                          top-1/2
                          h-2
                          w-2
                          -translate-x-1/2
                          -translate-y-1/2
                          rounded-full
                          bg-emerald-300
                          shadow-[0_0_14px_rgba(52,211,153,0.9)]
                        "
                      />
                    </div>

                    <div
                      className="
                        mt-3
                        text-center
                        font-mono
                        text-[6px]
                        tracking-[0.22em]
                        text-emerald-400/40
                      "
                    >
                      TEMPORAL CHANNEL // LOCKED
                    </div>
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
                      z-30
                      h-px
                      bg-linear-to-r
                      from-transparent
                      via-emerald-300/50
                      to-transparent
                      shadow-[0_0_12px_rgba(52,211,153,0.5)]
                    "
                    animate={{
                      top: ["0%", "100%"],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatDelay: 4,
                    }}
                  />
                </motion.div>
              </AnimatedSection>
            </div>
          </div>

          {/* =====================================================
              FINAL ACCESS AXIS
          ===================================================== */}

          <AnimatedSection delay={0.35}>
            <div className="mt-20 border-t border-emerald-400/10 pt-5">
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
                <span>TRANSMISSION</span>

                <span className="text-emerald-400/50">
                  ACCESS POINT // VYUHAM&apos;26
                </span>

                <span>READY</span>
              </div>

              <div className="relative mt-4 h-px bg-white/5">
                <motion.div
                  className="
                    absolute
                    left-0
                    top-0
                    h-px
                    w-full
                    bg-linear-to-r
                    from-emerald-500/0
                    via-emerald-400/40
                    to-emerald-300/0
                  "
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.8,
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
                    shadow-[0_0_12px_rgba(167,243,208,1)]
                  "
                  animate={{
                    left: ["0%", "100%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "linear",
                  }}
                />
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
                TRANSMISSION READY // ENTER THE DIMENSION
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* =========================================================
            EASTER EGG TERMINAL
        ========================================================= */}

        {terminalMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-999
              flex
              items-center
              justify-center
              bg-[#020604]/95
              p-6
              backdrop-blur-md
            "
          >
            {/* Matrix-like background */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-20
                bg-[linear-gradient(rgba(52,211,153,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.12)_1px,transparent_1px)]
                bg-size-[32px_32px]
              "
            />

            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
                filter: "blur(15px)",
              }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.8,
              }}
              className="
                relative
                w-full
                max-w-2xl
                border
                border-emerald-400/30
                bg-black/70
                p-8
                font-mono
                shadow-[0_0_100px_rgba(52,211,153,0.15)]
                md:p-12
              "
            >
              <div
                className="
                  mb-8
                  flex
                  items-center
                  justify-between
                  border-b
                  border-emerald-400/15
                  pb-4
                  text-[8px]
                  tracking-[0.25em]
                "
              >
                <span className="text-emerald-400">
                  VYUHAM // CORE OVERRIDE
                </span>

                <span className="text-emerald-400/40">
                  0x26
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <TerminalLine>
                  [SYSTEM] MATRIX CHANNEL DETECTED
                </TerminalLine>

                <TerminalLine>
                  [SYSTEM] IDENTITY VERIFIED
                </TerminalLine>

                <TerminalLine>
                  [SYSTEM] TEMPORAL LOCK BYPASSED
                </TerminalLine>

                <TerminalLine>
                  [SYSTEM] VYUHAM CORE ACCESS GRANTED
                </TerminalLine>

                <TerminalLine>
                  [SYSTEM] CLEARANCE LEVEL: UNRESTRICTED
                </TerminalLine>
              </div>

              <motion.div
                className="
                  mt-10
                  text-center
                  font-display
                  text-4xl
                  font-bold
                  tracking-[-0.04em]
                  text-emerald-300
                  md:text-6xl
                "
                animate={{
                  opacity: [0.5, 1, 0.5],
                  textShadow: [
                    "0 0 10px rgba(52,211,153,0.3)",
                    "0 0 35px rgba(52,211,153,0.8)",
                    "0 0 10px rgba(52,211,153,0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                ACCESS GRANTED
              </motion.div>

              <div
                className="
                  mt-8
                  text-center
                  font-mono
                  text-[8px]
                  tracking-[0.25em]
                  text-emerald-400/50
                "
              >
                WELCOME, OPERATOR // VYUHAM&apos;26
              </div>

              <motion.div
                className="
                  mt-8
                  h-px
                  bg-emerald-400/20
                "
                animate={{
                  scaleX: [0, 1],
                }}
                transition={{
                  duration: 2,
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* =========================================================
            BOTTOM FADE
        ========================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            right-0
            h-28
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
   SYSTEM STATUS
============================================================= */

function SystemStatus({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <motion.span
        className="
          h-1
          w-1
          rounded-full
          bg-emerald-400
          shadow-[0_0_8px_rgba(52,211,153,0.9)]
        "
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />

      <span className="text-white/20">
        {label}
      </span>

      <span className="text-emerald-400/70">
        {value}
      </span>
    </div>
  );
}

/* =============================================================
   BOOT LINE
============================================================= */

function BootLine({
  active,
  text,
}: {
  active: boolean;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{
        opacity: active ? 1 : 0.15,
        x: active ? 0 : -10,
      }}
      className="flex gap-3 py-1"
    >
      <span
        className={
          active
            ? "text-emerald-400"
            : "text-white/10"
        }
      >
        {active ? "●" : "○"}
      </span>

      <span
        className={
          active
            ? "text-emerald-400/60"
            : "text-white/10"
        }
      >
        {text}
      </span>

      {active && (
        <motion.span
          className="text-emerald-300"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        >
          _
        </motion.span>
      )}
    </motion.div>
  );
}

/* =============================================================
   DATA BLOCK
============================================================= */

function DataBlock({
  label,
  value,
  sub,
  bordered = false,
}: {
  label: string;
  value: string;
  sub: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={
        bordered
          ? "border-l border-emerald-400/10 pl-4"
          : "pr-4"
      }
    >
      <span
        className="
          block
          font-mono
          text-[7px]
          tracking-[0.2em]
          text-white/20
        "
      >
        {label}
      </span>

      <strong
        className="
          mt-2
          block
          font-display
          text-sm
          tracking-wider
          text-white/80
        "
      >
        {value}
      </strong>

      <span
        className="
          mt-1
          block
          font-mono
          text-[7px]
          tracking-[0.15em]
          text-white/20
        "
      >
        {sub}
      </span>
    </div>
  );
}

/* =============================================================
   MINI DATA
============================================================= */

function MiniData({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        border
        border-emerald-400/10
        bg-emerald-400/2
        px-3
        py-3
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
          mt-1
          font-mono
          text-[7px]
          tracking-[0.15em]
          text-emerald-400/70
        "
      >
        {value}
      </div>
    </div>
  );
}

/* =============================================================
   CORNER BRACKET
============================================================= */

function Corner({
  position,
}: {
  position:
  | "left-top"
  | "right-top"
  | "left-bottom"
  | "right-bottom";
}) {
  const positionClass = {
    "left-top":
      "left-0 top-0 border-l border-t",
    "right-top":
      "right-0 top-0 border-r border-t",
    "left-bottom":
      "bottom-0 left-0 border-b border-l",
    "right-bottom":
      "bottom-0 right-0 border-b border-r",
  }[position];

  return (
    <motion.div
      aria-hidden="true"
      className={`
        pointer-events-none
        absolute
        z-30
        h-8
        w-8
        border-emerald-400/60
        ${positionClass}
      `}
      animate={{
        opacity: [0.45, 1, 0.45],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    />
  );
}

/* =============================================================
   EASTER EGG TERMINAL LINE
============================================================= */

function TerminalLine({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
      }}
      className="text-emerald-400/70"
    >
      <span className="text-emerald-300">
        &gt;
      </span>{" "}
      {children}
    </motion.div>
  );
}