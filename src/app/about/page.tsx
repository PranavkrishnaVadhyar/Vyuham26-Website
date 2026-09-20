"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/*
|--------------------------------------------------------------------------
| NOTE
|--------------------------------------------------------------------------
| This page is intentionally built as a client component because it uses:
| - mouse tracking
| - scroll progress
| - animation state
| - intersection observers
|
| If you need Next.js static metadata, move metadata into a separate
| layout.tsx for this route.
|--------------------------------------------------------------------------
*/

const streams = [
  {
    id: "01",
    glyph: "⌁",
    title: "TECHNOLOGY",
    command: "BUILD // BREAK // REBUILD",
    description:
      "Hackathons, CTFs, innovation challenges and digital warfare. Enter the protocol, solve the impossible and push technology beyond its limits.",
    accent: "green",
    glow: "rgba(74,222,128,0.18)",
  },
  {
    id: "02",
    glyph: "◈",
    title: "CULTURE",
    command: "CREATE // EXPRESS // INSPIRE",
    description:
      "Music, performance, visual arts, literature and expression. A dimension where creativity breaks boundaries and imagination becomes reality.",
    accent: "purple",
    glow: "rgba(168,85,247,0.18)",
  },
  {
    id: "03",
    glyph: "✦",
    title: "GAMING",
    command: "COMPETE // ADAPT // CONQUER",
    description:
      "Esports, strategy and competitive arenas. Test your reflexes, coordination and tactical thinking against challengers from every corner.",
    accent: "cyan",
    glow: "rgba(34,211,238,0.18)",
  },
  {
    id: "04",
    glyph: "⊹",
    title: "IMPACT",
    command: "IDEATE // INNOVATE // TRANSFORM",
    description:
      "Social innovation, sustainability and entrepreneurship. Turn meaningful ideas into actions capable of changing the world around you.",
    accent: "amber",
    glow: "rgba(251,191,36,0.18)",
  },
];

const stats = [
  { value: 4, label: "STREAMS", suffix: "" },
  { value: 3, label: "DAYS", suffix: "" },
  { value: 1, label: "DIMENSION", suffix: "" },
  { value: 100, label: "POSSIBILITIES", suffix: "%" },
];

/* -------------------------------------------------------------------------- */
/* Mouse glow                                                                 */
/* -------------------------------------------------------------------------- */

function CursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 120,
    damping: 25,
    mass: 0.5,
  });

  const springY = useSpring(mouseY, {
    stiffness: 120,
    damping: 25,
    mass: 0.5,
  });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-1 hidden h-48 w-48 rounded-full bg-green/[0.07] blur-[70px] md:block"
      style={{
        left: springX,
        top: springY,
        x: "-50%",
        y: "-50%",
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Background particles                                                       */
/* -------------------------------------------------------------------------- */

function ParticleField() {
  const particles = Array.from({ length: 45 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, index) => {
        const left = (index * 37) % 100;
        const top = (index * 67) % 100;
        const duration = 4 + (index % 5);

        return (
          <motion.span
            key={index}
            className="absolute h-0.5 w-0.5 rounded-full bg-green/40"
            style={{
              left: `${left}%`,
              top: `${top}%`,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [0.7, 1.5, 0.7],
              y: [-8, 8, -8],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay: (index % 7) * 0.35,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Neural spine                                                               */
/* -------------------------------------------------------------------------- */

function NeuralSpine() {
  const { scrollYProgress } = useScroll();

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="pointer-events-none fixed right-3 top-0 z-30 hidden h-screen w-8 md:block">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/6" />

      <motion.div
        style={{ height }}
        className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-green shadow-[0_0_12px_rgba(74,222,128,0.8)]"
      />

      {[18, 38, 58, 78].map((position, index) => (
        <motion.div
          key={index}
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-green bg-[#050807]"
          style={{ top: `${position}%` }}
          animate={{
            boxShadow: [
              "0 0 0 rgba(74,222,128,0)",
              "0 0 16px rgba(74,222,128,0.8)",
              "0 0 0 rgba(74,222,128,0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Animated counter                                                           */
/* -------------------------------------------------------------------------- */

function Counter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setStarted(true);

        const duration = 1200;
        const start = performance.now();

        const animate = (time: number) => {
          const progress = Math.min((time - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setCount(Math.round(value * eased));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      },
      { threshold: 0.5 },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [started, value]);

  return (
    <div ref={ref}>
      {count}
      {suffix}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Glitch title                                                               */
/* -------------------------------------------------------------------------- */

function GlitchTitle() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);

      setTimeout(() => {
        setGlitch(false);
      }, 180);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${glitch ? "glitch-active" : ""}`}>
      <h1 className="relative z-10 font-display text-[clamp(58px,10vw,136px)] font-semibold leading-[0.76] tracking-[-0.055em]">
        THE
        <br />
        <span className="text-green">DIMENSION</span>
        <br />
        <em>EXPLAINED.</em>
      </h1>

      {glitch && (
        <>
          <div className="pointer-events-none absolute left-1 top-0 font-display text-[clamp(58px,10vw,136px)] font-semibold leading-[0.76] tracking-[-0.055em] text-cyan-400/50">
            THE
            <br />
            DIMENSION
            <br />
            EXPLAINED.
          </div>

          <div className="pointer-events-none absolute -left-1 top-0 font-display text-[clamp(58px,10vw,136px)] font-semibold leading-[0.76] tracking-[-0.055em] text-red-400/40">
            THE
            <br />
            DIMENSION
            <br />
            EXPLAINED.
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Interactive stream card                                                    */
/* -------------------------------------------------------------------------- */

function StreamCard({
  stream,
  index,
}: {
  stream: (typeof streams)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, {
    stiffness: 180,
    damping: 20,
  });

  const springY = useSpring(rotateY, {
    stiffness: 180,
    damping: 20,
  });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateY.set(((x - centerX) / centerX) * 5);
    rotateX.set(-((y - centerY) / centerY) * 5);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const accentClass = {
    green: "text-green",
    purple: "text-purple-400",
    cyan: "text-cyan-400",
    amber: "text-amber-400",
  }[stream.accent];

  const borderClass = {
    green: "border-green/30",
    purple: "border-purple-500/30",
    cyan: "border-cyan-500/30",
    amber: "border-amber-400/30",
  }[stream.accent];

  const bgClass = {
    green: "bg-green",
    purple: "bg-purple-400",
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
  }[stream.accent];

  return (
    <AnimatedSection delay={index * 0.1}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformPerspective: 1000,
        }}
        whileHover={{
          scale: 1.015,
        }}
        className={`group relative min-h-105 overflow-hidden rounded-sm border ${borderClass} bg-white/[0.018] p-7 transition-shadow duration-500 md:p-9`}
      >
        {/* Animated spotlight */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-0 blur-[90px] transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: stream.glow }}
        />

        {/* Scanning line */}
        <motion.div
          className={`pointer-events-none absolute left-0 h-px w-full ${bgClass} opacity-0 group-hover:opacity-50`}
          animate={{
            top: ["0%", "100%"],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
            STREAM_{stream.id}
          </span>

          <span
            className={`flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.15em] ${accentClass}`}
          >
            <span
              className={`h-1.5 w-1.5 animate-pulse rounded-full ${bgClass}`}
            />
            ONLINE
          </span>
        </div>

        {/* Glyph */}
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: index * 0.3,
          }}
          className={`relative mt-14 font-display text-7xl ${accentClass}`}
        >
          {stream.glyph}
        </motion.div>

        <h3 className="relative mt-7 font-display text-2xl font-semibold tracking-tight text-paper">
          {stream.title}
        </h3>

        <div
          className={`relative mt-2 font-mono text-[8px] uppercase tracking-[0.16em] ${accentClass}`}
        >
          {stream.command}
        </div>

        <p className="relative mt-6 max-w-lg text-sm leading-[1.8] text-muted">
          {stream.description}
        </p>

        {/* Signal bars */}
        <div className="absolute bottom-7 left-7 right-7 border-t border-line pt-5 md:left-9 md:right-9 md:bottom-9">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.span
                  key={i}
                  className={`w-1 rounded-full ${bgClass}`}
                  animate={{
                    height: [4, 8 + ((i + index) % 4) * 4, 4],
                    opacity: [0.25, 0.8, 0.25],
                  }}
                  transition={{
                    duration: 1 + i * 0.08,
                    repeat: Infinity,
                    delay: i * 0.06,
                  }}
                />
              ))}
            </div>

            <span
              className={`font-mono text-[8px] uppercase tracking-[0.16em] text-muted transition-colors group-hover:${accentClass}`}
            >
              ENTER →
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  const { scrollYProgress } = useScroll();

  const progressWidth = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"],
  );

  return (
    <>
      <Navbar />

      <CursorGlow />
      <NeuralSpine />

      {/* Global scroll progress */}
      <motion.div
        style={{ width: progressWidth }}
        className="fixed left-0 top-0 z-100 h-0.5 bg-green shadow-[0_0_12px_rgba(74,222,128,0.9)]"
      />

      <main className="relative flex-1 overflow-hidden bg-[#050807] pt-23">
        {/* ================================================================
            HERO
        ================================================================= */}

        <section className="relative min-h-212.5 border-b border-line py-24 md:py-36">
          <ParticleField />

          {/* Cyber grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(74,222,128,0.09) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74,222,128,0.09) 1px, transparent 1px)
              `,
              backgroundSize: "72px 72px",
            }}
          />

          {/* Main glow */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[35%] h-137.5 w-137.5 -translate-x-1/2 rounded-full bg-green/8 blur-[140px]"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* System coordinates */}
          <div className="absolute left-6 top-12 hidden font-mono text-[8px] uppercase leading-loose tracking-[0.18em] text-muted md:block">
            SYS // VYUHAM_26
            <br />
            LOC // TECHNOCITY
            <br />
            NODE // 001
            <br />
            STATUS // ONLINE
          </div>

          <div className="absolute right-6 top-12 hidden text-right font-mono text-[8px] uppercase leading-loose tracking-[0.18em] text-muted md:block">
            DIMENSION_01
            <br />
            ACCESS // GRANTED
            <br />
            SIGNAL // STABLE
            <br />
            FUTURE // AWAITS
          </div>

          <div className="relative mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>
                <span className="signal-dot" />
                Mission briefing // 01
              </Kicker>

              <div className="mt-8">
                <GlitchTitle />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="mt-20">
              <div className="grid gap-7 md:grid-cols-[1fr_330px]">
                {/* Mission terminal */}
                <div className="glass-card scanline-card relative overflow-hidden rounded-sm border border-green/20 p-7 md:p-9">
                  <div className="absolute right-0 top-0 h-24 w-24 border-b border-l border-green/20" />

                  <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-[8px] uppercase tracking-[0.16em]">
                    <span className="text-green">
                      {"// HOLOGRAPHIC_MISSION_BRIEFING"}
                    </span>

                    <span className="text-muted">VYH_001</span>
                  </div>

                  <div className="mt-7 font-mono text-[9px] leading-loose text-green/70">
                    <span className="text-green">&gt;</span> INITIALIZING
                    DIMENSION...
                    <br />
                    <span className="text-green">&gt;</span> LOADING VYUHAM
                    PROTOCOL...
                    <br />
                    <span className="text-green">&gt;</span> CONNECTION
                    ESTABLISHED.
                  </div>

                  <p className="mt-7 max-w-3xl text-sm leading-[1.9] text-muted md:text-base">
                    VYUHAM &apos;26 is Digital University Kerala&apos;s flagship
                    national-level techno-cultural fest — a collision point
                    where technology, creativity, competition and ideas enter
                    the same dimension.
                  </p>

                  <p className="mt-5 max-w-3xl text-sm leading-[1.9] text-muted">
                    Across three electrifying days at Technocity,
                    Thiruvananthapuram, students, creators, developers, gamers
                    and innovators come together to challenge what exists and
                    imagine what comes next.
                  </p>

                  <div className="mt-7 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.15em]">
                    <span className="text-green">&gt;</span>
                    <span className="text-paper">THE FUTURE AWAITS.</span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                      }}
                      className="h-3 w-1.5 bg-green"
                    />
                  </div>
                </div>

                {/* Status core */}
                <div className="relative overflow-hidden rounded-sm border border-line bg-white/2 p-7">
                  <motion.div
                    className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green/20"
                    animate={{
                      scale: [0.8, 1.15, 0.8],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  />

                  <motion.div
                    className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green/30"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <div className="relative">
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                      DIMENSION STATUS
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green shadow-[0_0_15px_rgba(74,222,128,0.9)]" />

                      <span className="font-mono text-xs uppercase tracking-[0.12em] text-green">
                        STABLE
                      </span>
                    </div>

                    <div className="mt-32">
                      <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                        CORE DIRECTIVE
                      </div>

                      <p className="mt-4 font-display text-2xl uppercase leading-[0.9] text-paper">
                        CONNECT
                        <br />
                        CREATE
                        <br />
                        <span className="text-green">CONQUER.</span>
                      </p>
                    </div>

                    <div className="mt-10 border-t border-line pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
                      SIGNAL:{" "}
                      <span className="text-green">
                        100% // LOCKED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute -bottom-17.5 left-1/2 -translate-x-1/2 text-center"
            >
              <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
                SCROLL TO ENTER
              </div>

              <div className="mx-auto mt-3 h-8 w-px bg-linear-to-b from-green to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* ================================================================
            STATS
        ================================================================= */}

        <section className="border-b border-line bg-white/1.5">
          <div className="mx-auto grid w-[min(1200px,calc(100%-48px))] grid-cols-2 md:w-[min(1200px,calc(100%-64px))] md:grid-cols-4">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.08}>
                <div className="relative border-r border-line px-5 py-12 md:px-8">
                  <div className="font-display text-5xl font-semibold tracking-tight text-paper">
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>

                  <div className="mt-3 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                    {stat.label}
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-green"
                    initial={{ width: 0 }}
                    whileInView={{ width: "45%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ================================================================
            DUK ORIGIN
        ================================================================= */}

        <section className="relative border-b border-line py-28 md:py-40">
          <ParticleField />

          <div className="pointer-events-none absolute -right-50 top-1/2 h-125 w-125 -translate-y-1/2 rounded-full bg-green/4 blur-[120px]" />

          <div className="relative mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="grid gap-16 md:grid-cols-[0.85fr_1.15fr] md:items-center">
                <div>
                  <Kicker>The institution // 02</Kicker>

                  <h2 className="mt-6 font-display text-[clamp(44px,5vw,72px)] font-semibold leading-[0.82] tracking-[-0.04em]">
                    DIGITAL
                    <br />
                    UNIVERSITY
                    <br />
                    <span className="text-green">KERALA.</span>
                  </h2>

                  <div className="mt-9 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                    <span className="h-px w-12 bg-green" />
                    ORIGIN NODE // TECHNOCITY
                  </div>
                </div>

                {/* Origin node */}
                <div className="relative min-h-110 overflow-hidden rounded-sm border border-line bg-white/1.5 p-8">
                  <div className="absolute inset-0 opacity-[0.1]">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                      }}
                    />
                  </div>

                  {/* Core */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="relative flex h-28 w-28 items-center justify-center rounded-full border border-green/30"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div className="absolute inset-3 rounded-full border border-green/20" />

                      <div className="h-4 w-4 rounded-full bg-green shadow-[0_0_30px_rgba(74,222,128,1)]" />
                    </motion.div>

                    <div className="absolute left-1/2 top-[calc(100%+18px)] -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.2em] text-green">
                      DUK // ORIGIN
                    </div>
                  </div>

                  {/* Orbiting nodes */}
                  {[
                    { x: "-130px", y: "-90px" },
                    { x: "130px", y: "-50px" },
                    { x: "110px", y: "110px" },
                    { x: "-120px", y: "100px" },
                  ].map((node, index) => (
                    <motion.div
                      key={index}
                      className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-green shadow-[0_0_12px_rgba(74,222,128,0.8)]"
                      style={{
                        marginLeft: node.x,
                        marginTop: node.y,
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2 + index * 0.4,
                        repeat: Infinity,
                      }}
                    />
                  ))}

                  <div className="relative z-10">
                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                      SYSTEM ORIGIN
                    </div>

                    <div className="mt-4 max-w-md">
                      <p className="text-sm leading-[1.9] text-muted">
                        Digital University Kerala is India&apos;s first digital
                        university, established by the Government of Kerala.
                      </p>

                      <p className="mt-5 text-sm leading-[1.9] text-muted">
                        Located at Technocity, Thiruvananthapuram, DUK brings
                        education, research and industry together around
                        emerging digital technologies.
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-7 left-8 right-8 border-t border-line pt-4 font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
                    NODE STATUS{" "}
                    <span className="text-green">● ACTIVE</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ================================================================
            STREAMS
        ================================================================= */}

        <section className="relative py-28 md:py-40">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-green/30 to-transparent" />

          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>Four streams // 03</Kicker>

              <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <h2 className="font-display text-[clamp(44px,5vw,72px)] font-semibold leading-[0.82] tracking-[-0.04em]">
                  CHOOSE YOUR
                  <br />
                  <span className="text-green">PROTOCOL.</span>
                </h2>

                <div className="max-w-sm font-mono text-[8px] uppercase leading-loose tracking-[0.15em] text-muted">
                  <span className="text-green">&gt;</span> FOUR ENTRY POINTS
                  <br />
                  <span className="text-green">&gt;</span> ONE SHARED DIMENSION
                  <br />
                  <span className="text-green">&gt;</span> INFINITE OUTCOMES
                </div>
              </div>
            </AnimatedSection>

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {streams.map((stream, index) => (
                <StreamCard
                  key={stream.title}
                  stream={stream}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            FINAL TRANSMISSION
        ================================================================= */}

        <section className="relative overflow-hidden border-t border-line py-32 md:py-48">
          <ParticleField />

          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-112.5 w-112.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green/6 blur-[130px]"
            animate={{
              scale: [0.9, 1.2, 0.9],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />

          <div className="relative mx-auto w-[min(1100px,calc(100%-48px))] text-center">
            <AnimatedSection>
              <div className="font-mono text-[8px] uppercase tracking-[0.28em] text-green">
                FINAL TRANSMISSION // 04
              </div>

              <h2 className="mt-7 font-display text-[clamp(50px,8vw,108px)] font-semibold leading-[0.78] tracking-tighter">
                THE FUTURE
                <br />
                <em className="text-green">AWAITS.</em>
              </h2>

              <p className="mx-auto mt-10 max-w-xl text-sm leading-[1.9] text-muted">
                The dimension is open.
                <br />
                The streams are active.
                <br />
                All that remains is your move.
              </p>

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="mx-auto mt-12 flex w-fit cursor-pointer items-center gap-4 border border-green/30 bg-green/4 px-7 py-4 font-mono text-[9px] uppercase tracking-[0.2em] text-green transition-colors hover:bg-green/10"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
                ENTER THE DIMENSION
                <span>→</span>
              </motion.div>

              <div className="mx-auto mt-16 flex items-center justify-center gap-4 font-mono text-[7px] uppercase tracking-[0.25em] text-muted">
                <span className="h-px w-16 bg-green/30" />
                VYUHAM&apos;26
                <span className="h-px w-16 bg-green/30" />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        .glitch-active h1 {
          animation: vyuham-glitch 0.18s steps(2, end);
        }

        @keyframes vyuham-glitch {
          0% {
            transform: translate(0);
            filter: none;
          }

          25% {
            transform: translate(-3px, 1px);
            filter: contrast(1.4);
          }

          50% {
            transform: translate(3px, -1px);
            filter: brightness(1.4);
          }

          75% {
            transform: translate(-1px, 2px);
          }

          100% {
            transform: translate(0);
            filter: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
