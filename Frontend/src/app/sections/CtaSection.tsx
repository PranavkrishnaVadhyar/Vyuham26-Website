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
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { motion, useMotionValue, useSpring } from "framer-motion";

/* =============================================================
   THEME SYSTEM
============================================================= */

export type CtaTheme = "accessTerminal" | "threatConsole";

interface ThemeConfig {
  /** "r,g,b" so we can build rgba() strings at any alpha */
  accentRgb: string;
  bg: string;
  labels: {
    kicker: string;
    channelStatus: string;
    accessLabel: string;
    headingLines: [string, string, string];
    headingEmphasis: string;
    description: string;
    statusRows: { label: string; value: string }[];
    buttonLabel: string;
    buttonGrantedLabel: string;
    statusPrefix: string;
    statusIdle: string;
    statusGranted: string;
    bootLines: string[];
    countdownHeader: string;
    countdownBadge: string;
    coreLabel: string;
    dataBlockA: { label: string; value: string; sub: string };
    dataBlockB: { label: string; value: string; sub: string };
    miniData: { label: string; value: string }[];
    energyRowLeft: string;
    energyRowMid: string;
    energyRowRight: string;
    axisRowLeft: string;
    axisRowMid: string;
    axisRowRight: string;
    axisFooter: string;
    finalAxisLeft: string;
    finalAxisMid: string;
    finalAxisRight: string;
    finalFooter: string;
    watermark: string;
    easterEggHeader: string;
    easterEggLines: string[];
    easterEggBig: string;
    easterEggSub: string;
  };
}

const THEMES: Record<CtaTheme, ThemeConfig> = {
  accessTerminal: {
    accentRgb: "52,211,153", // emerald-400
    bg: "#030806",
    labels: {
      kicker: "03 / Final transmission",
      channelStatus: "CHANNEL // OPEN",
      accessLabel: "ACCESS TERMINAL // 03",
      headingLines: ["ARE YOU", "READY", "TO"],
      headingEmphasis: "ENTER?",
      description:
        "The count is officially on. Registrations are live — leave the ordinary behind and secure your pass for Vyuham '26.",
      statusRows: [
        { label: "REGISTRATION", value: "ONLINE" },
        { label: "EVENT CHANNEL", value: "ACTIVE" },
        { label: "TEMPORAL LINK", value: "STABLE" },
        { label: "ACCESS", value: "OPEN" },
      ],
      buttonLabel: "INITIALIZE ACCESS",
      buttonGrantedLabel: "ACCESS GRANTED ✓",
      statusPrefix: "SYSTEM STATUS //",
      statusIdle: "REGISTRATION WINDOW OPEN",
      statusGranted: "CLEARANCE VERIFIED",
      bootLines: [
        "VYUHAM CORE // INITIALIZING",
        "SIGNAL // DETECTED",
        "TEMPORAL CHANNEL // OPEN",
        "ACCESS TERMINAL // ONLINE",
      ],
      countdownHeader: "/// TEMPORAL COUNTDOWN",
      countdownBadge: "T-MINUS // 2026",
      coreLabel: "TEMPORAL CORE",
      dataBlockA: { label: "EVENT WINDOW", value: "30 OCT → 01 NOV", sub: "2026" },
      dataBlockB: { label: "SIGNAL ORIGIN", value: "TECHNOCITY", sub: "THIRUVANANTHAPURAM" },
      miniData: [
        { label: "EVENT", value: "VYUHAM'26" },
        { label: "CHANNEL", value: "OPEN" },
        { label: "CLEARANCE", value: "PUBLIC" },
      ],
      energyRowLeft: "ACCESS",
      energyRowMid: "SIGNAL TRANSFER",
      energyRowRight: "EVENT",
      axisRowLeft: "NOW",
      axisRowMid: "TEMPORAL AXIS // 2026",
      axisRowRight: "ACTIVATION",
      axisFooter: "TEMPORAL CHANNEL // LOCKED",
      finalAxisLeft: "TRANSMISSION",
      finalAxisMid: "ACCESS POINT // VYUHAM'26",
      finalAxisRight: "READY",
      finalFooter: "TRANSMISSION READY // ENTER THE DIMENSION",
      watermark: "VYUHAM",
      easterEggHeader: "VYUHAM // CORE OVERRIDE",
      easterEggLines: [
        "[SYSTEM] MATRIX CHANNEL DETECTED",
        "[SYSTEM] IDENTITY VERIFIED",
        "[SYSTEM] TEMPORAL LOCK BYPASSED",
        "[SYSTEM] VYUHAM CORE ACCESS GRANTED",
        "[SYSTEM] CLEARANCE LEVEL: UNRESTRICTED",
      ],
      easterEggBig: "ACCESS GRANTED",
      easterEggSub: "WELCOME, OPERATOR // VYUHAM'26",
    },
  },

  threatConsole: {
    accentRgb: "255,59,48", // siren red
    bg: "#0a0605",
    labels: {
      kicker: "03 / Final warning",
      channelStatus: "CHANNEL // CRITICAL",
      accessLabel: "THREAT CONSOLE // 03",
      headingLines: ["CAN YOU", "MAKE IT", "OUT"],
      headingEmphasis: "ALIVE?",
      description:
        "The clock is already counting down. Containment is failing — secure your evacuation pass before Vyuham '26 hits zero.",
      statusRows: [
        { label: "REGISTRATION", value: "ARMED" },
        { label: "EVENT CHANNEL", value: "CRITICAL" },
        { label: "CONTAINMENT", value: "FAILING" },
        { label: "ACCESS", value: "BREACHED" },
      ],
      buttonLabel: "EVACUATE NOW",
      buttonGrantedLabel: "ESCAPE ROUTE SECURED ✓",
      statusPrefix: "SYSTEM STATUS //",
      statusIdle: "EVACUATION WINDOW CLOSING",
      statusGranted: "ROUTE CONFIRMED",
      bootLines: [
        "VYUHAM CORE // ARMED",
        "ANOMALY // DETECTED",
        "CONTAINMENT // FAILING",
        "EVAC TERMINAL // ONLINE",
      ],
      countdownHeader: "/// EXTINCTION COUNTDOWN",
      countdownBadge: "T-MINUS // IMPACT",
      coreLabel: "THREAT LEVEL",
      dataBlockA: { label: "EVENT WINDOW", value: "30 OCT → 01 NOV", sub: "2026" },
      dataBlockB: { label: "IMPACT ORIGIN", value: "TECHNOCITY", sub: "THIRUVANANTHAPURAM" },
      miniData: [
        { label: "EVENT", value: "VYUHAM'26" },
        { label: "CHANNEL", value: "CRITICAL" },
        { label: "STATUS", value: "AT RISK" },
      ],
      energyRowLeft: "ACCESS",
      energyRowMid: "DISTRESS SIGNAL",
      energyRowRight: "EVENT",
      axisRowLeft: "NOW",
      axisRowMid: "COUNTDOWN AXIS // IMPACT",
      axisRowRight: "DETONATION",
      axisFooter: "CONTAINMENT // LOCKED DOWN",
      finalAxisLeft: "TRANSMISSION",
      finalAxisMid: "EVAC POINT // VYUHAM'26",
      finalAxisRight: "READY",
      finalFooter: "TRANSMISSION READY // ESCAPE WHILE YOU CAN",
      watermark: "VYUHAM",
      easterEggHeader: "VYUHAM // CORE OVERRIDE",
      easterEggLines: [
        "[SYSTEM] BREACH SIGNAL DETECTED",
        "[SYSTEM] IDENTITY VERIFIED",
        "[SYSTEM] CONTAINMENT LOCK BYPASSED",
        "[SYSTEM] VYUHAM CORE OVERRIDE ACCEPTED",
        "[SYSTEM] CLEARANCE LEVEL: CRITICAL",
      ],
      easterEggBig: "TOO LATE.",
      easterEggSub: "FINAL WARNING, OPERATOR // VYUHAM'26",
    },
  },
};

/* =============================================================
   MAIN COMPONENT
============================================================= */

export default function CtaSection({
  theme = "accessTerminal",
}: {
  theme?: CtaTheme;
}) {
  const cfg = THEMES[theme];
  const c = (alpha: number) => `rgba(${cfg.accentRgb},${alpha})`;

  /* =========================================================
     SYSTEM STATE
  ========================================================= */

  const [bootStep, setBootStep] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [systemGlitch, setSystemGlitch] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     MOUSE PARALLAX
  ========================================================= */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 18 });

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
     (threatConsole fires slightly more often + is more intense)
  ========================================================= */

  useEffect(() => {
    const threshold = theme === "threatConsole" ? 0.6 : 0.72;
    const glitchDuration = theme === "threatConsole" ? 450 : 350;

    const interval = setInterval(() => {
      if (Math.random() > threshold) {
        setSystemGlitch(true);
        setTimeout(() => setSystemGlitch(false), glitchDuration);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [theme]);

  /* =========================================================
     KONAMI / EASTER EGG
  ========================================================= */

  useEffect(() => {
    const sequence = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let index = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === sequence[index]?.toLowerCase()) {
        index += 1;
        if (index === sequence.length) {
          setTerminalMode(true);
          index = 0;
          setTimeout(() => setTerminalMode(false), 7000);
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* =========================================================
     MOUSE HANDLER
  ========================================================= */

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
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

  // Reactor motion runs faster/harder in threat mode
  const reactorSpeed = theme === "threatConsole" ? 14 : 30;
  const reactorSpeedReverse = theme === "threatConsole" ? 11 : 24;
  const ringDuration = theme === "threatConsole" ? 2.5 : 5;

  const rootStyle: CSSProperties = { backgroundColor: cfg.bg };

  return (
    <PageEntranceGate phase="cta">
      <section
        id="register"
        style={{ ...rootStyle, borderTopColor: c(0.1) }}
        className="relative overflow-hidden border-t py-24 md:py-32"
      >
        {/* ATMOSPHERE */}
        <div
          aria-hidden="true"
          style={{ backgroundColor: c(0.045) }}
          className="pointer-events-none absolute left-[12%] top-[38%] h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        />
        <div
          aria-hidden="true"
          style={{ backgroundColor: c(0.04) }}
          className="pointer-events-none absolute right-[8%] top-[30%] h-112.5 w-112.5 rounded-full blur-[130px]"
        />

        {/* GIANT WATERMARK */}
        <motion.span
          aria-hidden="true"
          onDoubleClick={() => {
            setTerminalMode(true);
            setTimeout(() => setTerminalMode(false), 7000);
          }}
          style={{ color: c(0.07) }}
          className="pointer-events-auto absolute bottom-[-6%] right-[-2%] cursor-pointer select-none font-display text-[20vw] font-bold leading-none tracking-[-0.08em]"
          animate={{ x: [0, -18, 0], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {cfg.labels.watermark}
        </motion.span>

        {/* TOP SIGNAL SWEEP */}
        <motion.div
          aria-hidden="true"
          style={{
            background: `linear-gradient(to right, transparent, ${c(0.7)}, transparent)`,
          }}
          className="pointer-events-none absolute left-0 right-0 top-0 h-px origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* SYSTEM GRID */}
        <div
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(${c(0.35)} 1px, transparent 1px), linear-gradient(90deg, ${c(0.35)} 1px, transparent 1px)`,
          }}
          className="pointer-events-none absolute inset-0 opacity-[0.035] bg-size-[80px_80px] mask-[linear-gradient(to_bottom,black,transparent)]"
        />

        {/* GLITCH OVERLAY */}
        {systemGlitch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0], scaleY: [1, 0.98, 1] }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: c(0.025) }}
              className="pointer-events-none absolute inset-0 z-40 mix-blend-screen"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.35 }}
              style={{
                backgroundColor: c(0.7),
                boxShadow: `0 0 20px ${c(0.9)}`,
              }}
              className="pointer-events-none absolute left-0 right-0 top-1/2 z-50 h-px"
            />
          </>
        )}

        {/* MAIN CONTAINER */}
        <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
          {/* SECTION HEADER */}
          <AnimatedSection>
            <div style={{ borderColor: c(0.1) }} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <motion.span
                  style={{ backgroundColor: `rgb(${cfg.accentRgb})`, boxShadow: `0 0 12px ${c(0.9)}` }}
                  className="h-1.5 w-1.5 rounded-full"
                  animate={{ opacity: [0.25, 1, 0.25], scale: [1, 1.35, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <Kicker>{cfg.labels.kicker}</Kicker>
              </div>
              <span style={{ color: c(0.5) }} className="hidden font-mono text-[8px] tracking-[0.25em] sm:block">
                {cfg.labels.channelStatus}
              </span>
            </div>
          </AnimatedSection>

          {/* MAIN GRID */}
          <div className="mt-12 grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
            {/* LEFT — ACCESS / THREAT TERMINAL */}
            <div className="lg:col-span-6">
              <AnimatedSection>
                <div className="relative">
                  {/* ACCESS LABEL */}
                  <motion.div
                    style={{ color: c(0.5) }}
                    className="mb-5 flex items-center gap-3 font-mono text-[7px] tracking-[0.3em]"
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <span style={{ backgroundColor: c(0.3) }} className="h-px w-8" />
                    {cfg.labels.accessLabel}
                  </motion.div>

                  {/* HEADING */}
                  <motion.h2
                    className="font-display text-[clamp(42px,5.5vw,76px)] font-semibold leading-[0.88] tracking-[-0.045em]"
                    initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {cfg.labels.headingLines[0]}
                    <br />
                    {cfg.labels.headingLines[1]}
                    <br />
                    {cfg.labels.headingLines[2]}{" "}
                    <em style={{ color: `rgb(${cfg.accentRgb})` }} className="relative not-italic">
                      {cfg.labels.headingEmphasis}
                      <motion.span
                        aria-hidden="true"
                        style={{
                          background: `linear-gradient(to right, rgb(${cfg.accentRgb}), ${c(0.6)}, transparent)`,
                          boxShadow: `0 0 14px ${c(0.8)}`,
                        }}
                        className="absolute -bottom-2 left-0 h-0.5 w-full origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.7 }}
                      />
                    </em>
                  </motion.h2>

                  {/* VERTICAL SIGNAL */}
                  <motion.div
                    aria-hidden="true"
                    style={{
                      background: `linear-gradient(to bottom, transparent, ${c(0.4)}, transparent)`,
                    }}
                    className="absolute -left-5 top-0 hidden h-64 w-px origin-top md:block"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />

                  {/* DESCRIPTION */}
                  <motion.p
                    className="mt-8 max-w-md text-sm leading-[1.85] text-white/45 md:text-[15px]"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.25 }}
                  >
                    {cfg.labels.description}
                  </motion.p>

                  {/* SYSTEM STATUS */}
                  <motion.div
                    style={{ borderColor: c(0.1) }}
                    className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 border-y py-4 font-mono text-[7px] tracking-[0.18em]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {cfg.labels.statusRows.map((row) => (
                      <SystemStatus key={row.label} label={row.label} value={row.value} accentRgb={cfg.accentRgb} />
                    ))}
                  </motion.div>

                  {/* ACCESS BUTTON */}
                  <motion.div
                    className="mt-8 flex flex-wrap items-center gap-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={accessGranted ? { scale: [1, 1.04, 1] } : { scale: [1, 1.015, 1] }}
                      transition={{ duration: accessGranted ? 0.6 : 4, repeat: accessGranted ? 0 : Infinity }}
                    >
                      <button
                        type="button"
                        onClick={handleAccess}
                        aria-label="Register for Vyuham '26"
                        style={{
                          borderColor: c(0.5),
                          backgroundColor: `rgb(${cfg.accentRgb})`,
                          color: cfg.bg,
                        }}
                        className="group relative overflow-hidden border px-6 py-3 font-mono text-[10px] font-semibold tracking-[0.18em] transition-all duration-300 hover:shadow-[0_0_30px_var(--tw-shadow-color)]"
                      >
                        <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-full" />
                        <span className="relative z-10">
                          {accessGranted ? cfg.labels.buttonGrantedLabel : cfg.labels.buttonLabel}
                        </span>
                      </button>
                    </motion.div>

                    <Button href="/contact" variant="outline">
                      Get in touch
                    </Button>
                  </motion.div>

                  {/* ACCESS STATE */}
                  <motion.div
                    className="mt-5 font-mono text-[7px] tracking-[0.22em]"
                    animate={{ opacity: accessGranted ? [0.5, 1, 0.5] : 0.5 }}
                    transition={{ duration: 0.8, repeat: accessGranted ? Infinity : 0 }}
                  >
                    <span className="text-white/20">{cfg.labels.statusPrefix}</span>
                    <span style={{ color: `rgb(${cfg.accentRgb})` }} className="ml-2">
                      {accessGranted ? cfg.labels.statusGranted : cfg.labels.statusIdle}
                    </span>
                  </motion.div>

                  {/* BOOT TERMINAL */}
                  <div style={{ borderColor: c(0.1) }} className="mt-8 border bg-black/20 p-4 font-mono text-[7px] tracking-[0.14em]">
                    {cfg.labels.bootLines.map((line, i) => (
                      <BootLine key={line} active={bootStep >= i + 1} text={line} accentRgb={cfg.accentRgb} />
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* RIGHT — COUNTDOWN REACTOR */}
            <div className="lg:col-span-6">
              <AnimatedSection delay={0.2}>
                <motion.div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    rotateX: smoothY,
                    rotateY: smoothX,
                    borderColor: c(0.2),
                    backgroundColor: `${cfg.bg}D9`,
                    boxShadow: `0 0 70px ${c(0.08)}`,
                  }}
                  className="relative overflow-hidden border p-6 backdrop-blur-xl md:p-9"
                >
                  {/* CARD GLOW */}
                  <motion.div
                    aria-hidden="true"
                    style={{ backgroundColor: c(0.035) }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />

                  <Corner position="left-top" accentRgb={cfg.accentRgb} />
                  <Corner position="right-top" accentRgb={cfg.accentRgb} />
                  <Corner position="left-bottom" accentRgb={cfg.accentRgb} />
                  <Corner position="right-bottom" accentRgb={cfg.accentRgb} />

                  <SignalRing count={4} size={170} duration={ringDuration} color={c(0.22)} className="-right-16 -top-16" />
                  <SignalRing count={2} size={90} duration={ringDuration * 0.6} color={c(0.15)} className="-bottom-10 -left-10" />

                  {/* CARD HEADER */}
                  <div style={{ borderColor: c(0.1) }} className="relative z-10 mb-6 flex items-center justify-between border-b pb-4">
                    <span style={{ color: `rgb(${cfg.accentRgb})` }} className="font-mono text-[9px] tracking-[0.25em]">
                      {cfg.labels.countdownHeader}
                    </span>
                    <motion.span
                      style={{ borderColor: c(0.25), backgroundColor: c(0.05), color: c(0.7) }}
                      className="rounded-full border px-3 py-1 font-mono text-[8px] tracking-[0.12em]"
                      animate={{ opacity: [0.45, 1, 0.45] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                    >
                      {cfg.labels.countdownBadge}
                    </motion.span>
                  </div>

                  {/* REACTOR CORE */}
                  <div className="relative z-10 flex min-h-67.5 items-center justify-center">
                    <motion.div
                      style={{ borderColor: c(0.1) }}
                      className="absolute h-65 w-65 rounded-full border"
                      animate={{ rotate: 360 }}
                      transition={{ duration: reactorSpeed, repeat: Infinity, ease: "linear" }}
                    >
                      <span
                        style={{ backgroundColor: `rgb(${cfg.accentRgb})`, boxShadow: `0 0 14px ${c(1)}` }}
                        className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
                      />
                    </motion.div>

                    <motion.div
                      style={{ borderColor: c(0.15) }}
                      className="absolute h-52.5 w-52.5 rounded-full border border-dashed"
                      animate={{ rotate: -360 }}
                      transition={{ duration: reactorSpeedReverse, repeat: Infinity, ease: "linear" }}
                    />

                    <motion.div
                      style={{
                        borderColor: c(0.2),
                        backgroundColor: `${cfg.bg}E6`,
                        boxShadow: `0 0 50px ${c(0.12)}`,
                      }}
                      className="relative z-10 flex h-38.75 w-38.75 items-center justify-center rounded-full border"
                      animate={{
                        boxShadow: [
                          `0 0 35px ${c(0.08)}`,
                          `0 0 70px ${c(0.2)}`,
                          `0 0 35px ${c(0.08)}`,
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="text-center">
                        <div style={{ color: c(0.5) }} className="mb-2 font-mono text-[7px] tracking-[0.3em]">
                          T-MINUS
                        </div>
                        <CountdownTimer targetDate="2026-10-30T09:00:00+05:30" className="py-1" />
                        <div style={{ color: c(0.4) }} className="mt-2 font-mono text-[6px] tracking-[0.2em]">
                          {cfg.labels.coreLabel}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* EVENT DATA */}
                  <div style={{ borderColor: c(0.1) }} className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0 border-t pt-5">
                    <DataBlock {...cfg.labels.dataBlockA} />
                    <DataBlock {...cfg.labels.dataBlockB} bordered accentRgb={cfg.accentRgb} />
                  </div>

                  {/* MISSION DATA */}
                  <div style={{ borderColor: c(0.1) }} className="relative z-10 mt-5 grid grid-cols-3 gap-2 border-t pt-5">
                    {cfg.labels.miniData.map((d) => (
                      <MiniData key={d.label} label={d.label} value={d.value} accentRgb={cfg.accentRgb} />
                    ))}
                  </div>

                  {/* ENERGY CONNECTION */}
                  <div className="relative z-10 mt-7">
                    <div className="flex items-center justify-between font-mono text-[6px] tracking-[0.2em] text-white/20">
                      <span>{cfg.labels.energyRowLeft}</span>
                      <span style={{ color: c(0.5) }}>{cfg.labels.energyRowMid}</span>
                      <span>{cfg.labels.energyRowRight}</span>
                    </div>
                    <div className="relative mt-4 h-px bg-white/5">
                      <motion.div
                        style={{ background: `linear-gradient(to right, transparent, ${c(0.6)}, transparent)` }}
                        className="absolute left-0 top-0 h-px w-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.span
                        style={{ backgroundColor: c(0.9), boxShadow: `0 0 14px ${c(1)}` }}
                        className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                        animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 0.7, ease: "linear" }}
                      />
                    </div>
                  </div>

                  {/* TEMPORAL / COUNTDOWN AXIS */}
                  <div className="relative z-10 mt-7">
                    <div className="flex items-center justify-between font-mono text-[6px] tracking-[0.2em] text-white/20">
                      <span>{cfg.labels.axisRowLeft}</span>
                      <span style={{ color: c(0.45) }}>{cfg.labels.axisRowMid}</span>
                      <span>{cfg.labels.axisRowRight}</span>
                    </div>
                    <div className="relative mt-4 h-px bg-white/5">
                      <motion.div
                        style={{
                          background: `linear-gradient(to right, rgb(${cfg.accentRgb}), ${c(0.6)}, transparent)`,
                          boxShadow: `0 0 10px ${c(0.7)}`,
                        }}
                        className="absolute left-0 top-0 h-px w-[68%]"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.8 }}
                      />
                      <motion.div
                        style={{ backgroundColor: c(1) }}
                        className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full"
                        animate={{ left: ["0%", "68%"], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1 }}
                      />
                      <span
                        style={{ backgroundColor: `rgb(${cfg.accentRgb})`, boxShadow: `0 0 14px ${c(0.9)}` }}
                        className="absolute left-[68%] top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      />
                    </div>
                    <div style={{ color: c(0.4) }} className="mt-3 text-center font-mono text-[6px] tracking-[0.22em]">
                      {cfg.labels.axisFooter}
                    </div>
                  </div>

                  {/* SCAN LINE */}
                  <motion.div
                    aria-hidden="true"
                    style={{
                      background: `linear-gradient(to right, transparent, ${c(0.5)}, transparent)`,
                      boxShadow: `0 0 12px ${c(0.5)}`,
                    }}
                    className="pointer-events-none absolute left-0 right-0 z-30 h-px"
                    animate={{ top: ["0%", "100%"], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, repeatDelay: 4 }}
                  />
                </motion.div>
              </AnimatedSection>
            </div>
          </div>

          {/* FINAL ACCESS AXIS */}
          <AnimatedSection delay={0.35}>
            <div style={{ borderColor: c(0.1) }} className="mt-20 border-t pt-5">
              <div className="flex items-center justify-between font-mono text-[7px] tracking-[0.2em] text-white/20">
                <span>{cfg.labels.finalAxisLeft}</span>
                <span style={{ color: c(0.5) }}>{cfg.labels.finalAxisMid}</span>
                <span>{cfg.labels.finalAxisRight}</span>
              </div>
              <div className="relative mt-4 h-px bg-white/5">
                <motion.div
                  style={{ background: `linear-gradient(to right, transparent, ${c(0.4)}, transparent)` }}
                  className="absolute left-0 top-0 h-px w-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8 }}
                />
                <motion.div
                  style={{ backgroundColor: c(1) }}
                  className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full"
                  animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
                />
              </div>
              <div style={{ color: c(0.4) }} className="mt-3 text-center font-mono text-[7px] tracking-[0.2em]">
                {cfg.labels.finalFooter}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* EASTER EGG TERMINAL */}
        {terminalMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 flex items-center justify-center bg-[#020604]/95 p-6 backdrop-blur-md"
          >
            <div
              aria-hidden="true"
              style={{
                backgroundImage: `linear-gradient(${c(0.12)} 1px, transparent 1px), linear-gradient(90deg, ${c(0.12)} 1px, transparent 1px)`,
              }}
              className="pointer-events-none absolute inset-0 opacity-20 bg-size-[32px_32px]"
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: "blur(15px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              style={{ borderColor: c(0.3), boxShadow: `0 0 100px ${c(0.15)}` }}
              className="relative w-full max-w-2xl border bg-black/70 p-8 font-mono md:p-12"
            >
              <div style={{ borderColor: c(0.15) }} className="mb-8 flex items-center justify-between border-b pb-4 text-[8px] tracking-[0.25em]">
                <span style={{ color: `rgb(${cfg.accentRgb})` }}>{cfg.labels.easterEggHeader}</span>
                <span style={{ color: c(0.4) }}>0x26</span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                {cfg.labels.easterEggLines.map((line) => (
                  <TerminalLine key={line} accentRgb={cfg.accentRgb}>
                    {line}
                  </TerminalLine>
                ))}
              </div>

              <motion.div
                style={{ color: `rgb(${cfg.accentRgb})` }}
                className="mt-10 text-center font-display text-4xl font-bold tracking-[-0.04em] md:text-6xl"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  textShadow: [
                    `0 0 10px ${c(0.3)}`,
                    `0 0 35px ${c(0.8)}`,
                    `0 0 10px ${c(0.3)}`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {cfg.labels.easterEggBig}
              </motion.div>

              <div style={{ color: c(0.5) }} className="mt-8 text-center font-mono text-[8px] tracking-[0.25em]">
                {cfg.labels.easterEggSub}
              </div>

              <motion.div
                style={{ backgroundColor: c(0.2) }}
                className="mt-8 h-px"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 2 }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* BOTTOM FADE */}
        <div
          aria-hidden="true"
          style={{ background: `linear-gradient(to top, ${cfg.bg}, transparent)` }}
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-28"
        />
      </section>
    </PageEntranceGate>
  );
}

/* =============================================================
   SYSTEM STATUS
============================================================= */

function SystemStatus({ label, value, accentRgb }: { label: string; value: string; accentRgb: string }) {
  return (
    <div className="flex items-center gap-2">
      <motion.span
        style={{ backgroundColor: `rgb(${accentRgb})`, boxShadow: `0 0 8px rgba(${accentRgb},0.9)` }}
        className="h-1 w-1 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-white/20">{label}</span>
      <span style={{ color: `rgba(${accentRgb},0.7)` }}>{value}</span>
    </div>
  );
}

/* =============================================================
   BOOT LINE
============================================================= */

function BootLine({ active, text, accentRgb }: { active: boolean; text: string; accentRgb: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: active ? 1 : 0.15, x: active ? 0 : -10 }}
      className="flex gap-3 py-1"
    >
      <span style={{ color: active ? `rgb(${accentRgb})` : "rgba(255,255,255,0.1)" }}>
        {active ? "●" : "○"}
      </span>
      <span style={{ color: active ? `rgba(${accentRgb},0.6)` : "rgba(255,255,255,0.1)" }}>{text}</span>
      {active && (
        <motion.span
          style={{ color: `rgba(${accentRgb},0.9)` }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
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
  accentRgb,
}: {
  label: string;
  value: string;
  sub: string;
  bordered?: boolean;
  accentRgb?: string;
}) {
  return (
    <div
      style={bordered && accentRgb ? { borderLeftColor: `rgba(${accentRgb},0.1)` } : undefined}
      className={bordered ? "border-l pl-4" : "pr-4"}
    >
      <span className="block font-mono text-[7px] tracking-[0.2em] text-white/20">{label}</span>
      <strong className="mt-2 block font-display text-sm tracking-wider text-white/80">{value}</strong>
      <span className="mt-1 block font-mono text-[7px] tracking-[0.15em] text-white/20">{sub}</span>
    </div>
  );
}

/* =============================================================
   MINI DATA
============================================================= */

function MiniData({ label, value, accentRgb }: { label: string; value: string; accentRgb: string }) {
  return (
    <div
      style={{ borderColor: `rgba(${accentRgb},0.1)`, backgroundColor: `rgba(${accentRgb},0.02)` }}
      className="border px-3 py-3"
    >
      <div className="font-mono text-[6px] tracking-[0.2em] text-white/20">{label}</div>
      <div style={{ color: `rgba(${accentRgb},0.7)` }} className="mt-1 font-mono text-[7px] tracking-[0.15em]">
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
  accentRgb,
}: {
  position: "left-top" | "right-top" | "left-bottom" | "right-bottom";
  accentRgb: string;
}) {
  const positionClass = {
    "left-top": "left-0 top-0 border-l border-t",
    "right-top": "right-0 top-0 border-r border-t",
    "left-bottom": "bottom-0 left-0 border-b border-l",
    "right-bottom": "bottom-0 right-0 border-b border-r",
  }[position];

  return (
    <motion.div
      aria-hidden="true"
      style={{ borderColor: `rgba(${accentRgb},0.6)` }}
      className={`pointer-events-none absolute z-30 h-8 w-8 ${positionClass}`}
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}

/* =============================================================
   EASTER EGG TERMINAL LINE
============================================================= */

function TerminalLine({ children, accentRgb }: { children: React.ReactNode; accentRgb: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{ color: `rgba(${accentRgb},0.7)` }}
    >
      <span style={{ color: `rgba(${accentRgb},0.9)` }}>&gt;</span> {children}
    </motion.div>
  );
}