/*
 * VYUHAM'26 — Greenanime.tsx
 * MAIN CINEMATIC INTRO ANIMATION
 *
 * This is the main self-contained animation component.
 */

"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import Image from "next/image";

import { gsap } from "gsap";

/*
 * VYUHAM'26 — HAPTIC + CINEMATIC AUDIO
 *
 * Haptics:
 * - Uses navigator.vibrate when supported (mainly Android/mobile browsers).
 * - Completely optional; unsupported devices simply ignore it.
 *
 * Audio:
 * - Uses the Web Audio API to synthesize short reactor/UI sounds.
 * - No external audio files are required.
 * - Browsers may block audio until the user interacts with the page.
 */

type HapticPattern = number | number[];

const haptic = (pattern: HapticPattern) => {
  if (typeof navigator === "undefined") return;

  try {
    if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch {
    // Haptics are an enhancement; never allow them to break the animation.
  }
};

const audioContextRef: { current: AudioContext | null } = {
  current: null,
};

const getAudioContext = () => {
  if (typeof window === "undefined") return null;

  try {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextClass) return null;
      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  } catch {
    return null;
  }
};

const unlockCinematicAudio = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
  } catch {
    // Ignore browser audio-policy restrictions.
  }
};

const reactorSound = (
  type:
    | "signal"
    | "core"
    | "lock"
    | "containment"
    | "charge"
    | "overload"
    | "breakthrough"
) => {
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== "running") return;

  try {
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(master);

    let startFreq = 120;
    let endFreq = 70;
    let duration = 0.16;
    let volume = 0.045;
    let wave: OscillatorType = "sine";

    switch (type) {
      case "signal":
        startFreq = 720;
        endFreq = 260;
        duration = 0.16;
        volume = 0.035;
        wave = "sine";
        break;

      case "core":
        startFreq = 180;
        endFreq = 620;
        duration = 0.34;
        volume = 0.055;
        wave = "triangle";
        break;

      case "lock":
        startFreq = 140;
        endFreq = 90;
        duration = 0.10;
        volume = 0.035;
        wave = "square";
        break;

      case "containment":
        startFreq = 95;
        endFreq = 48;
        duration = 0.24;
        volume = 0.055;
        wave = "sawtooth";
        break;

      case "charge":
        startFreq = 90;
        endFreq = 190;
        duration = 0.28;
        volume = 0.035;
        wave = "sine";
        break;

      case "overload":
        startFreq = 80;
        endFreq = 34;
        duration = 0.42;
        volume = 0.085;
        wave = "sawtooth";
        break;

      case "breakthrough":
        startFreq = 55;
        endFreq = 980;
        duration = 0.62;
        volume = 0.12;
        wave = "sawtooth";
        break;
    }

    osc.type = wave;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, endFreq),
      now + duration
    );

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(1, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.start(now);
    osc.stop(now + duration + 0.03);

    osc.addEventListener("ended", () => {
      try {
        osc.disconnect();
        gain.disconnect();
        master.disconnect();
      } catch {
        // Already disconnected.
      }
    });
  } catch {
    // Audio is optional and must never interrupt the cinematic timeline.
  }
};

const impact = (
  vibration: HapticPattern,
  sound:
    | "signal"
    | "core"
    | "lock"
    | "containment"
    | "charge"
    | "overload"
    | "breakthrough"
) => {
  haptic(vibration);
  reactorSound(sound);
};

/*
 * VYUHAM'26 — INTRO PAGE 2
 * Hybrid cinematic sequence built from the earlier:
 * - SignalCoreSystem
 * - EnergyRing
 * - CornerStructures
 * - ParticleField3D
 * - LogoReveal
 *
 * The visual language is intentionally rebuilt as one component so it can
 * live independently from IntroSequence.tsx.
 */

const STONES = [
  { id: "reality", color: "#ff304f", glow: "#ff6b81", angle: -90 },
  { id: "mind", color: "#ffd60a", glow: "#ffe66d", angle: -30 },
  { id: "power", color: "#a855f7", glow: "#d8b4fe", angle: 30 },
  { id: "soul", color: "#ff7a18", glow: "#ffad66", angle: 90 },
  { id: "time", color: "#22c55e", glow: "#86efac", angle: 150 },
  { id: "space", color: "#2196ff", glow: "#60a5fa", angle: 210 },
];

const CX = 500;
const CY = 430;
const STONE_R = 182;
const STRUCTURE_R = 252;
const STONE_STRETCH_R = 232;

const FRAME_TITLES = [
  "INITIAL STATE",
  "SIGNAL DETECTED",
  "ENERGY ACCUMULATION",
  "CORE FORMATION",
  "RING ASSEMBLY",
  "FRAGMENTS ARRIVE",
  "SYNCHRONIZATION",
  "PROTOCOL LOCK",
  "SIX LOCKS APPROACH",
  "SIX-WAY CONTAINMENT",
  "ENERGY LOADING",
  "MAXIMUM ENERGY",
  "CORE SATURATION",
  "SYSTEM STRETCH",
  "BREAKTHROUGH",
  "LOGO REVEAL",
  "THE FUTURE AWAITS",
  "TRANSITION",
];

const FRAME_TIMES = [
  0, 0.70, 1.75, 4.56, 4.75, 7.55, 8.05, 9.15, 10.45, 12.15,
  13.40, 17.60, 18.72, 19.07, 19.67, 23.0, 25.0,
];

function point(angle: number, radius = STONE_R) {
  const a = (angle * Math.PI) / 180;
  return {
    x: CX + Math.cos(a) * radius,
    y: CY + Math.sin(a) * radius,
  };
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
};

type ParticleState = {
  count: number;
  speed: number;
  burst: boolean;
};

export interface LogoRevealHandle {
  addToTimeline: (tl: gsap.core.Timeline) => void;
}

interface GreenAnimeProps {
  onComplete?: () => void;
}

export default function GreenAnime({ onComplete }: GreenAnimeProps = {}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const signalHaloRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const coreSvgRef = useRef<SVGPolygonElement>(null);
  const coreOuterShapeRef = useRef<HTMLDivElement>(null);
  const coreInnerShapeRef = useRef<HTMLDivElement>(null);
  const corePointRef = useRef<HTMLDivElement>(null);
  const energyRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<SVGCircleElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);
  const loadingLabelRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const statusSubRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const stoneRefs = useRef<(SVGGElement | null)[]>([]);
  const structureRefs = useRef<(SVGGElement | null)[]>([]);
  const beamRefs = useRef<(SVGLineElement | null)[]>([]);
  const connectorBeamRefs = useRef<(SVGLineElement | null)[]>([]);
  const connectorGlowRefs = useRef<(SVGLineElement | null)[]>([]);
  const guaranteedBeamRefs = useRef<(SVGLineElement | null)[]>([]);
  const guaranteedBeamGlowRefs = useRef<(SVGLineElement | null)[]>([]);
  const crackRefs = useRef<(SVGPathElement | null)[]>([]);
  const highBeamRef = useRef<SVGLineElement>(null);
  const networkRef = useRef<SVGGElement>(null);
  const tickRef = useRef<SVGGElement>(null);
  const logoRevealRef = useRef<LogoRevealHandle>(null);

  const particleState = useRef<ParticleState>({
    count: 42,
    speed: 0.35,
    burst: false,
  });

  const particles = useRef<Particle[]>([]);
  const animationFrame = useRef<number | null>(null);
  const [frame, setFrame] = useState(1);

  /*
   * Particle field — adapted from the earlier ParticleField3D concept.
   * It remains subtle until the system reaches overload.
   */
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeParticle = (burst = false): Particle => {
      const cx = width / 2;
      const cy = height / 2;
      const a = Math.random() * Math.PI * 2;
      const radius = burst
        ? 20 + Math.random() * 50
        : Math.random() * Math.max(width, height) * 0.32;

      return {
        x: cx + Math.cos(a) * radius,
        y: cy + Math.sin(a) * radius,
        vx: burst
          ? Math.cos(a) * (1.4 + Math.random() * 4)
          : (Math.random() - 0.5) * 0.4,
        vy: burst
          ? Math.sin(a) * (1.4 + Math.random() * 4)
          : (Math.random() - 0.5) * 0.4,
        size: 0.5 + Math.random() * 1.8,
        alpha: 0.06 + Math.random() * 0.28,
        life: burst ? 1 : 0.7 + Math.random() * 0.3,
      };
    };

    resize();
    particles.current = Array.from({ length: 42 }, () => makeParticle());

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const animate = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2);
      last = now;

      const state = particleState.current;
      ctx.clearRect(0, 0, width, height);

      while (
        particles.current.length < state.count &&
        particles.current.length < 260
      ) {
        particles.current.push(makeParticle(state.burst));
      }

      const cx = width / 2;
      const cy = height / 2;

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];

        if (state.burst) {
          p.vx *= Math.pow(0.987, dt);
          p.vy *= Math.pow(0.987, dt);
          p.life -= 0.012 * dt;
        } else {
          const dx = cx - p.x;
          const dy = cy - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          p.vx += (dy / distance) * 0.008 * state.speed * dt;
          p.vy += (-dx / distance) * 0.008 * state.speed * dt;
          p.vx *= Math.pow(0.994, dt);
          p.vy *= Math.pow(0.994, dt);
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (
          p.life <= 0 ||
          p.x < -100 ||
          p.x > width + 100 ||
          p.y < -100 ||
          p.y > height + 100
        ) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,255,175,${p.alpha * p.life})`;
        ctx.fill();
      }

      if (!state.burst) {
        const maxDistance = 90;

        for (let i = 0; i < particles.current.length; i++) {
          const a = particles.current[i];

          for (let j = i + 1; j < particles.current.length; j++) {
            const b = particles.current[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > maxDistance) continue;

            const alpha = (1 - distance / maxDistance) * 0.055;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(52,211,153,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onResize);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  /*
   * Unlock Web Audio after the first real user interaction.
   * This is needed because mobile browsers commonly block autoplay audio.
   * Vibration does not depend on this unlock.
   */
  useEffect(() => {
    const unlock = () => {
      unlockCinematicAudio();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const handleSkip = useCallback(() => {
    if (rootRef.current) {
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: () => {
          onComplete?.();
        },
      });
    } else {
      onComplete?.();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!rootRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onUpdate: () => {
          const t = tl.time();
          let currentFrame = 1;

          FRAME_TIMES.forEach((mark, index) => {
            if (t >= mark) currentFrame = index + 1;
          });

          setFrame(currentFrame);
        },
        onComplete: () => {
          gsap.to(rootRef.current, {
            opacity: 0,
            duration: 0.38,
            ease: "power2.inOut",
            onComplete: () => {
              onComplete?.();
            },
          });
        },
      });

      /*
       * -----------------------------------------------------------
       * RESET
       * -----------------------------------------------------------
       */

      if (sceneRef.current) gsap.set(sceneRef.current, { opacity: 1, scale: 1 });
      if (signalRef.current) gsap.set(signalRef.current, {
        opacity: 0,
        scale: 0.02,
        transformOrigin: "center",
      });
      if (signalHaloRef.current) gsap.set(signalHaloRef.current, {
        opacity: 0,
        scale: 0.1,
        transformOrigin: "center",
      });
      if (energyRef.current) gsap.set(energyRef.current, {
        opacity: 0,
        scale: 0.25,
        transformOrigin: "center",
      });
      // Core formation starts as a single energy point. The individual
      // geometric layers are revealed separately so they visibly GROW
      // out of that point instead of appearing as a pre-built shape.
      if (coreRef.current) gsap.set(coreRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        transformOrigin: "center",
      });
      if (coreOuterShapeRef.current) gsap.set(coreOuterShapeRef.current, {
        opacity: 0,
        scale: 0.02,
        rotation: 45,
        transformOrigin: "center",
      });
      if (coreInnerShapeRef.current) gsap.set(coreInnerShapeRef.current, {
        opacity: 0,
        scale: 0.02,
        rotation: 45,
        transformOrigin: "center",
      });
      if (corePointRef.current) gsap.set(corePointRef.current, {
        opacity: 1,
        scale: 0.35,
        transformOrigin: "center",
      });
      if (coreSvgRef.current) gsap.set(coreSvgRef.current, {
        opacity: 0,
        attr: {
          transform: `translate(${CX} ${CY}) scale(0.02) translate(${-CX} ${-CY})`,
        },
      });

      gsap.set(ringRefs.current.filter(Boolean), {
        opacity: 0,
        scale: 0.01,
        transformOrigin: `${CX}px ${CY}px`,
      });

      // IMPORTANT: SVG stones are positioned with the SVG `transform`
      // attribute, not CSS x/y transforms. This keeps them locked to the
      // same 1000x860 coordinate system as the rings/core.
      stoneRefs.current.forEach((stone, i) => {
        if (!stone) return;
        const a = (STONES[i].angle * Math.PI) / 180;
        const startDistance = 430;
        const sx = CX + Math.cos(a) * startDistance;
        const sy = CY + Math.sin(a) * startDistance;

        gsap.set(stone, {
          opacity: 0,
          attr: {
            transform: `translate(${sx} ${sy}) rotate(0) scale(0.08)`,
          },
        });
      });

      gsap.set(beamRefs.current.filter(Boolean), {
        opacity: 0,
        strokeDashoffset: 420,
      });

      // Dedicated visible energy connectors. These are rendered above the
      // expanding core so the six stone→core links never get covered.
      gsap.set(connectorBeamRefs.current.filter(Boolean), {
        opacity: 0,
        strokeWidth: 1.5,
      });

      gsap.set(connectorGlowRefs.current.filter(Boolean), {
        opacity: 0,
        strokeWidth: 4,
      });

      gsap.set(guaranteedBeamRefs.current.filter(Boolean), {
        opacity: 0,
        strokeWidth: 2,
      });

      gsap.set(guaranteedBeamGlowRefs.current.filter(Boolean), {
        opacity: 0,
        strokeWidth: 6,
      });

      gsap.set(structureRefs.current.filter(Boolean), {
        opacity: 0,
      });

      gsap.set(crackRefs.current.filter(Boolean), {
        opacity: 0,
        strokeDasharray: 260,
        strokeDashoffset: 260,
        strokeWidth: 1.15,
        attr: {
          transform:
            `translate(${CX} ${CY}) scale(1) translate(${-CX} ${-CY})`,
        },
      });

      if (highBeamRef.current) gsap.set(highBeamRef.current, {
        opacity: 0,
        strokeDashoffset: 860,
        strokeWidth: 1,
      });

      if (networkRef.current) gsap.set(networkRef.current, {
        opacity: 0,
        scale: 0.7,
        transformOrigin: `${CX}px ${CY}px`,
      });

      if (tickRef.current) gsap.set(tickRef.current, {
        opacity: 0,
        scale: 0.75,
        transformOrigin: `${CX}px ${CY}px`,
      });

      if (loadingRef.current) gsap.set(loadingRef.current, {
        opacity: 0,
        strokeDashoffset: 440,
      });

      if (loadingTextRef.current) gsap.set(loadingTextRef.current, {
        opacity: 0,
        scale: 0.65,
      });

      if (loadingLabelRef.current) gsap.set(loadingLabelRef.current, { opacity: 0 });

      if (flashRef.current) gsap.set(flashRef.current, {
        opacity: 0,
        scale: 0.5,
      });

      if (logoRef.current) gsap.set(logoRef.current, {
        opacity: 0,
        scale: 0.2,
        y: 20,
        filter: "blur(14px) brightness(2.5)",
      });

      if (titleRef.current) gsap.set(titleRef.current, {
        opacity: 0,
        y: 38,
        filter: "blur(7px)",
      });

      if (subtitleRef.current) gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 16,
      });

      if (taglineRef.current) gsap.set(taglineRef.current, {
        opacity: 0,
        y: 18,
        letterSpacing: "0.55em",
      });

      if (glitchRef.current) gsap.set(glitchRef.current, {
        opacity: 0,
        scaleX: 1.2,
      });

      if (scanRef.current) gsap.set(scanRef.current, {
        opacity: 0,
        scaleX: 0,
      });

      /*
       * -----------------------------------------------------------
       * FRAME 01 — INITIAL STATE
       * No large circle exists here.
       * -----------------------------------------------------------
       */

      tl.to(sceneRef.current, {
        opacity: 1,
        duration: 0.25,
      }, 0);

      /*
       * FRAME 02 — WHITE SIGNAL
       */

      tl.to(signalRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.38,
        ease: "expo.out",
      }, 0.70);

      // SIGNAL DETECTED — first physical response.
      tl.call(() => {
        impact(15, "signal");
      }, [], 0.70);

      tl.to(signalRef.current, {
        scale: 2.5,
        boxShadow: "0 0 25px #fff, 0 0 70px rgba(255,255,255,.9)",
        duration: 0.25,
        ease: "power2.out",
      }, 1.10);

      /*
       * FRAME 03 — ENERGY ACCUMULATION
       */

      tl.to(signalHaloRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.38,
        ease: "expo.out",
      }, 1.75);

      tl.to(signalRef.current, {
        scale: 3.8,
        boxShadow:
          "0 0 40px #fff, 0 0 100px rgba(52,211,153,.95), 0 0 190px rgba(16,185,129,.6)",
        duration: 0.38,
        ease: "power2.out",
      }, 1.75);

      particleState.current.count = 90;
      particleState.current.speed = 0.8;

      /*
       * FRAME 04 — CORE FORMATION
       *
       * The core is not a static shape that simply fades in. The energy
       * point at the exact centre becomes the source of every geometry: 
       * point -> inner diamond -> outer diamond -> hexagonal core.
       * Each layer expands from the same origin, giving the impression
       * that the shape is being generated by the energy itself.
       */

      // 1. Collapse the white signal into a very small energy nucleus.
      tl.to(signalRef.current, {
        scale: 0.12,
        boxShadow: "0 0 20px #fff, 0 0 55px rgba(52,211,153,.95), 0 0 100px rgba(16,185,129,.65)",
        duration: 0.32,
        ease: "expo.in",
      }, 2.75);

      // 2. The halo also collapses into the same origin, feeding the nucleus.
      tl.to(signalHaloRef.current, {
        scale: 0.10,
        opacity: 1,
        duration: 0.30,
        ease: "expo.in",
      }, 2.77);

      // 3. Bright central nucleus ignites first.
      tl.to(corePointRef.current, {
        opacity: 1,
        scale: 1.45,
        duration: 0.16,
        ease: "expo.out",
      }, 2.93);

      // CORE IGNITION — short focused pulse.
      tl.call(() => {
        impact([18, 18, 28], "core");
      }, [], 2.93);

      tl.to(corePointRef.current, {
        scale: 0.72,
        duration: 0.16,
        ease: "power2.inOut",
      }, 3.09);

      // 4. Inner diamond is generated from the nucleus.
      tl.to(coreInnerShapeRef.current, {
        opacity: 1,
        scale: 0.08,
        rotation: 45,
        duration: 0.12,
        ease: "power2.out",
      }, 3.01);

      tl.to(coreInnerShapeRef.current, {
        scale: 1,
        rotation: 135,
        duration: 0.32,
        ease: "expo.out",
      }, 3.13);

      // 5. The larger diamond follows the energy wave outward.
      tl.to(coreOuterShapeRef.current, {
        opacity: 1,
        scale: 0.06,
        rotation: 45,
        duration: 0.12,
        ease: "power2.out",
      }, 3.21);

      tl.to(coreOuterShapeRef.current, {
        scale: 1,
        rotation: 135,
        duration: 0.38,
        ease: "expo.out",
      }, 3.33);

      // 6. Finally the large six-sided core is drawn outward from the same
      // point, completing the mechanical/energy geometry.
      tl.to(coreSvgRef.current, {
        opacity: 1,
        attr: {
          transform: `translate(${CX} ${CY}) scale(0.04) translate(${-CX} ${-CY})`,
        },
        duration: 0.10,
        ease: "power2.out",
      }, 3.62);

      tl.to(coreSvgRef.current, {
        attr: {
          transform: `translate(${CX} ${CY}) scale(1.08) translate(${-CX} ${-CY})`,
        },
        duration: 0.42,
        ease: "expo.out",
      }, 3.72);

      // 7. All layers settle together while the centre remains energized.
      tl.to([coreOuterShapeRef.current, coreInnerShapeRef.current], {
        scale: 1,
        rotation: 45,
        duration: 0.16,
        ease: "power2.inOut",
      }, 4.30);

      tl.to(coreSvgRef.current, {
        attr: {
          transform: `translate(${CX} ${CY}) scale(1) translate(${-CX} ${-CY})`,
        },
        duration: 0.16,
        ease: "power2.inOut",
      }, 4.30);

      tl.to(corePointRef.current, {
        scale: 1,
        duration: 0.15,
        ease: "power2.out",
      }, 4.30);

      // CORE SETTLE — second, heavier mechanical hit.
      tl.call(() => {
        impact(32, "core");
      }, [], 4.30);

      // 8. A final radial energy pulse launches outward into the ring system.
      tl.to(signalRef.current, {
        scale: 1.65,
        opacity: 0.78,
        boxShadow:
          "0 0 24px #fff, 0 0 75px rgba(52,211,153,.98), 0 0 145px rgba(16,185,129,.62)",
        duration: 0.18,
        ease: "expo.out",
      }, 4.38);

      tl.to(signalRef.current, {
        scale: 0.38,
        opacity: 0.5,
        duration: 0.24,
        ease: "expo.inOut",
      }, 4.56);

      /*
       * FRAME 05 — RINGS FORM ONLY AFTER THE WHITE LIGHT/CORE
       */

      ringRefs.current.forEach((ring, i) => {
        if (!ring) return;

        tl.to(ring, {
          opacity: i === 0 ? 0.95 : i === 1 ? 0.58 : 0.32,
          scale: 1,
          duration: 0.38,
          ease: "expo.out",
        }, 4.75 + i * 0.08);
      });

      /*
       * FRAME 06 — SIX COLORED FRAGMENTS
       */

      /*
       * FRAME 06 — SIX COLORED FRAGMENTS
       *
       * The fragments must arrive on the SAME six node positions used by
       * the synchronization network.  The previous version targeted the
       * larger outer ring, which made the fragments appear detached from
       * their colored nodes.
       *
       * Each fragment now has:
       *   1. a fixed target on the 182px synchronization orbit
       *   2. a dedicated entry point outside the system
       *   3. a straight radial flight into that exact target
       *   4. a controlled rotation + scale-in while travelling
       */
      const fragmentTargets = STONES.map((stone) => point(stone.angle, 182));

      const fragmentStarts = [
        { x: 500, y: -95 },   // REALITY  — from top
        { x: 1015, y: 125 },  // MIND     — from upper-right
        { x: 1015, y: 735 },  // POWER    — from lower-right
        { x: 500, y: 955 },   // SOUL     — from bottom
        { x: -15, y: 735 },   // TIME     — from lower-left
        { x: -15, y: 125 },   // SPACE    — from upper-left
      ];

      stoneRefs.current.forEach((stone, i) => {
        if (!stone) return;

        const target = fragmentTargets[i];
        const start = fragmentStarts[i];
        const startRotation = i % 2 === 0 ? -70 : 70;

        // Reset in pure SVG coordinates.  No CSS x/y transform is used.
        gsap.set(stone, {
          opacity: 0,
          attr: {
            transform: `translate(${start.x} ${start.y}) rotate(${startRotation}) scale(0.16)`,
          },
        });

        // Short anticipation: the fragment becomes visible before moving.
        tl.to(stone, {
          opacity: 1,
          attr: {
            transform: `translate(${start.x} ${start.y}) rotate(${startRotation}) scale(0.48)`,
          },
          duration: 0.16,
          ease: "power2.out",
        }, 5.65 + i * 0.13);

        // Main arrival: straight into the exact synchronization node.
        tl.to(stone, {
          attr: {
            transform: `translate(${target.x} ${target.y}) rotate(0) scale(1)`,
          },
          duration: 0.382,
          ease: "power3.inOut",
        }, 5.81 + i * 0.13);

        // Each arriving fragment gives a short mechanical lock pulse.
        tl.call(() => {
          impact(18, "lock");
        }, [], 6.19 + i * 0.13);

        // Tiny lock pulse after arrival, without changing the final position.
        tl.to(stone, {
          attr: {
            transform: `translate(${target.x} ${target.y}) rotate(0) scale(1.12)`,
          },
          duration: 0.12,
          ease: "power2.out",
        }, 6.65 + i * 0.13);

        tl.to(stone, {
          attr: {
            transform: `translate(${target.x} ${target.y}) rotate(0) scale(1)`,
          },
          duration: 0.16,
          ease: "sine.out",
        }, 6.77 + i * 0.13);
      });

      /* FRAME 06.5 — STONE CALIBRATION / BLINK / SIDE RECOIL
       * After entering the ring, each stone performs a short mechanical
       * side-to-side calibration before the network locks them.
       */
      stoneRefs.current.forEach((stone, i) => {
        if (!stone) return;
        const p = point(STONES[i].angle);
        const a = (STONES[i].angle * Math.PI) / 180;
        const tx = -Math.sin(a);
        const ty = Math.cos(a);
        const side = i % 2 === 0 ? 11 : -11;

        const pos = (dx: number, dy: number, scale = 1) =>
          `translate(${p.x + dx} ${p.y + dy}) scale(${scale})`;

        const base = 7.35 + i * 0.075;

        // Side movement → back → opposite side → back.
        tl.to(stone, {
          attr: { transform: pos(tx * side, ty * side, 1.08) },
          duration: 0.10,
          ease: "power2.out",
        }, base);
        tl.to(stone, {
          attr: { transform: pos(0, 0, 1) },
          duration: 0.10,
          ease: "power2.inOut",
        }, base + 0.10);
        tl.to(stone, {
          attr: { transform: pos(-tx * side * 0.78, -ty * side * 0.78, 1.10) },
          duration: 0.10,
          ease: "power2.out",
        }, base + 0.20);
        tl.to(stone, {
          attr: { transform: pos(0, 0, 1) },
          duration: 0.11,
          ease: "power2.inOut",
        }, base + 0.30);

        // Three quick blinks while the calibration settles.
        [0, 0.22, 0.44].forEach((blink) => {
          tl.to(stone, { opacity: 0.20, duration: 0.055, ease: "none" }, base + blink);
          tl.to(stone, { opacity: 1, duration: 0.065, ease: "none" }, base + blink + 0.055);
        });
      });

      /*
       * FRAME 07 — SYNCHRONIZATION
       */

      tl.to(networkRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: "power2.out",
      }, 8.05);

      // SYNCHRONIZATION — all six nodes become one system.
      tl.call(() => {
        impact([25, 20, 35], "containment");
      }, [], 8.05);

      tl.to([coreRef.current, coreSvgRef.current], {
        scale: 1.12,
        duration: 0.18,
        yoyo: true,
        repeat: 3,
        ease: "sine.inOut",
      }, 7.55);

      tl.to(energyRef.current, {
        opacity: 1,
        scale: 1.25,
        duration: 0.38,
      }, 7.55);

      /*
       * FRAME 08 — PROTOCOL LOCK
       */

      tl.to(tickRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.38,
        ease: "back.out(1.7)",
      }, 9.15);

      // PROTOCOL LOCK — crisp confirmation hit.
      tl.call(() => {
        impact(28, "lock");
      }, [], 9.15);

      // Small synchronized pulse without changing the stones' fixed
      // orbital positions. We scale around their local SVG origin.
      stoneRefs.current.forEach((stone, i) => {
        if (!stone) return;
        const p = point(STONES[i].angle);

        tl.to(stone, {
          attr: {
            transform: `translate(${p.x} ${p.y}) scale(1.09)`,
          },
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        }, 9.30 + i * 0.045);
      });

      /*
       * FRAME 09 → 14
       * ---------------------------------------------------------------
       * SIX-WAY MECHANICAL CONTAINMENT
       *
       * One lock now belongs to each stone. The six locks approach on the
       * exact same radial axes as the stones, clamp close to them, then
       * physically pull the stones outward as the reactor reaches 100%.
       */

      /*
       * IMPORTANT GEOMETRY
       * ---------------------------------------------------------------
       * Every mechanical lock is allocated to the EXACT endpoint of its
       * coloured energy beam.  The lock origin is therefore the same point
       * as the stone, not a second outer orbit.
       *
       * Local lock geometry extends OUTWARD from (0,0).  This means the
       * hexagonal clamp at the origin sits directly on the beam, while the
       * mechanical body points away from the core.
       */
      const structureLayout = STONES.map((stone) => {
        const a = (stone.angle * Math.PI) / 180;
        const anchor = point(stone.angle, STONE_R);
        const startDistance = 720;

        return {
          x: anchor.x,
          y: anchor.y,
          rotation: stone.angle - 33.69,
          angle: stone.angle,
          startX: CX + Math.cos(a) * startDistance,
          startY: CY + Math.sin(a) * startDistance,
        };
      });

      structureRefs.current.forEach((structure, i) => {
        if (!structure) return;
        const s = structureLayout[i];

        gsap.set(structure, {
          x: s.startX,
          y: s.startY,
          rotation: s.rotation,
          scale: 0.72,
          opacity: 0,
          transformOrigin: "0px 0px",
        });
      });

      /* FRAME 09 — SIX LOCKS APPROACH */
      structureRefs.current.forEach((structure, i) => {
        if (!structure) return;
        const s = structureLayout[i];
        const t = 10.45 + i * 0.08;

        tl.to(structure, {
          opacity: 1,
          x: s.x,
          y: s.y,
          rotation: s.rotation,
          scale: 0.72,
          duration: 0.74,
          ease: "power3.out",
        }, t);

        /* Small mechanical brake as the lock seats. */
        tl.to(structure, {
          x: s.x - Math.cos((s.angle * Math.PI) / 180) * 7,
          y: s.y - Math.sin((s.angle * Math.PI) / 180) * 7,
          scale: 0.79,
          duration: 0.12,
          ease: "power2.out",
        }, t + 0.60);

        tl.to(structure, {
          x: s.x,
          y: s.y,
          scale: 0.72,
          duration: 0.16,
          ease: "power2.inOut",
        }, t + 0.72);
      });

      /* Six independent feeds, one terminating at every lock. */
      beamRefs.current.forEach((beam, i) => {
        if (!beam) return;
        gsap.set(beam, { opacity: 0, strokeDashoffset: 520 });

        tl.to(beam, {
          opacity: 0.46,
          strokeDashoffset: 0,
          duration: 0.42,
          ease: "power2.out",
        }, 10.57 + i * 0.08);
      });

      /* FRAME 10 — SIX-WAY CONTAINMENT */
      structureRefs.current.forEach((structure, i) => {
        if (!structure) return;
        const s = structureLayout[i];
        const t = 12.15 + i * 0.025;

        tl.to(structure, {
          x: s.x - Math.cos((s.angle * Math.PI) / 180) * 12,
          y: s.y - Math.sin((s.angle * Math.PI) / 180) * 12,
          scale: 0.78,
          duration: 0.13,
          ease: "power3.in",
        }, t);

        tl.to(structure, {
          x: s.x,
          y: s.y,
          scale: 0.72,
          duration: 0.20,
          ease: "power2.out",
        }, t + 0.13);

        tl.set(structure, {
          x: s.x,
          y: s.y,
          rotation: s.rotation,
          scale: 0.72,
        }, t + 0.35);
      });

      /* Controlled six-fold network scan. */
      tl.to(networkRef.current, {
        rotation: 60,
        duration: 0.62,
        ease: "power1.inOut",
      }, 12.25);

      // SIX-WAY CONTAINMENT — mechanical clamp impact.
      tl.call(() => {
        impact([30, 25, 45], "containment");
      }, [], 12.15);

      tl.to(networkRef.current, {
        rotation: 0,
        duration: 0.38,
        ease: "power2.out",
      }, 12.87);

      tl.to(coreRef.current, {
        scale: 1.12,
        duration: 0.16,
        ease: "power2.out",
      }, 12.90);

      tl.to(coreSvgRef.current, {
        attr: {
          transform: `translate(${CX} ${CY}) scale(1.12) translate(${-CX} ${-CY})`,
        },
        duration: 0.16,
        ease: "power2.out",
      }, 12.90);

      tl.to(coreRef.current, {
        scale: 1,
        duration: 0.24,
        ease: "power2.inOut",
      }, 13.06);

      tl.to(coreSvgRef.current, {
        attr: {
          transform: `translate(${CX} ${CY}) scale(1) translate(${-CX} ${-CY})`,
        },
        duration: 0.24,
        ease: "power2.inOut",
      }, 13.06);

      /* FRAME 11 → 12 — CONTINUOUS 0% → 100% REACTOR OVERLOAD */

      const load = { value: 0 };

      /*
       * The six coloured hexagons, six energy beams and six old-style
       * mechanical locks ALL use this exact radial position.
       *
       * This is the important fix:
       * no separate x/y motion is allowed for the hexagon.
       */
      const loadStartRadius = STONE_R;
      const loadMaxRadius = 278;

      const updateContinuousLoad = (value: number) => {
        const load01 = Math.max(0, Math.min(1, value / 100));

        // Smooth expansion from the core.
        const expansion = load01 * load01 * (3 - 2 * load01);

        const radius =
          loadStartRadius +
          (loadMaxRadius - loadStartRadius) * expansion;

        STONES.forEach((stone, i) => {
          const angleRad = (stone.angle * Math.PI) / 180;
          const dx = Math.cos(angleRad);
          const dy = Math.sin(angleRad);

          // ONE exact radial point for this stone.
          const nodeX = CX + dx * radius;
          const nodeY = CY + dy * radius;

          /*
           * 1. COLOURED HEXAGON
           *
           * It can ONLY move outward/inward on its own radial line.
           * Rotation is kept at zero so it cannot visually drift.
           */
          const stoneEl = stoneRefs.current[i];

          if (stoneEl) {
            gsap.set(stoneEl, {
              attr: {
                transform:
                  `translate(${nodeX} ${nodeY}) ` +
                  `rotate(0) ` +
                  `scale(${1 + expansion * 0.16})`,
              },
            });
          }

          /*
           * 2. ENERGY BEAM
           *
           * Its endpoint is the exact same point as the hexagon.
           */
          // TOP-LAYER CONNECTOR BEAM
          //
          // The normal SVG beam can disappear underneath the HTML core when
          // the core enlarges. This second line is deliberately rendered
          // later in the DOM, above the core. It starts just outside the
          // actual core edge and ends beyond the stone, creating one
          // continuous energy channel:
          //
          //       CORE ======> STONE ======> OUTWARD
          //
          // Both endpoints are computed from the SAME angle/radius as the
          // hexagon, so there is no diagonal drift or separation.
          // Match the visible reactor geometry as it expands.
          // The connector begins just outside the largest core layer,
          // so the beam never appears detached from the reactor.
          const coreEdgeRadius = 78 + expansion * 18;
          const connectorOuterRadius = radius + 138;

          const connectorGlow = connectorGlowRefs.current[i];

          if (connectorGlow) {
            gsap.set(connectorGlow, {
              attr: {
                x1: CX + dx * coreEdgeRadius,
                y1: CY + dy * coreEdgeRadius,
                x2: CX + dx * connectorOuterRadius,
                y2: CY + dy * connectorOuterRadius,
              },
              strokeWidth: 4 + expansion * 15,
              strokeOpacity: 0.16 + expansion * 0.32,
              filter: "url(#ga2-heavy-glow)",
            });
          }

          const connector = connectorBeamRefs.current[i];

          if (connector) {
            gsap.set(connector, {
              attr: {
                x1: CX + dx * coreEdgeRadius,
                y1: CY + dy * coreEdgeRadius,
                x2: CX + dx * connectorOuterRadius,
                y2: CY + dy * connectorOuterRadius,
              },
              strokeWidth: 2.2 + expansion * 8.8,
              strokeOpacity: 0.42 + expansion * 0.58,
              filter:
                expansion > 0.70
                  ? "url(#ga2-heavy-glow)"
                  : "url(#ga2-glow)",
            });
          }

          // GUARANTEED SIX-BEAM LAYER
          // This is independent of the original beamRefs animation.
          // It deliberately uses the exact STONES angle so the vertical
          // red/orange channels cannot disappear.
          const guaranteedGlow = guaranteedBeamGlowRefs.current[i];
          const guaranteed = guaranteedBeamRefs.current[i];

          const guaranteedStart = 82 + expansion * 14;
          const guaranteedEnd = radius + 142;

          if (guaranteedGlow) {
            gsap.set(guaranteedGlow, {
              attr: {
                x1: CX + dx * guaranteedStart,
                y1: CY + dy * guaranteedStart,
                x2: CX + dx * guaranteedEnd,
                y2: CY + dy * guaranteedEnd,
              },
              stroke: stone.glow,
              strokeWidth: 5 + expansion * 15,
              strokeOpacity: 0.20 + expansion * 0.38,
              filter: "url(#ga2-heavy-glow)",
            });
          }

          if (guaranteed) {
            gsap.set(guaranteed, {
              attr: {
                x1: CX + dx * guaranteedStart,
                y1: CY + dy * guaranteedStart,
                x2: CX + dx * guaranteedEnd,
                y2: CY + dy * guaranteedEnd,
              },
              stroke: stone.color,
              strokeWidth: 2 + expansion * 8,
              strokeOpacity: 0.55 + expansion * 0.45,
              filter: "url(#ga2-heavy-glow)",
            });
          }

          const beam = beamRefs.current[i];

          if (beam) {
            gsap.set(beam, {
              attr: {
                x1: CX,
                y1: CY,
                x2: nodeX,
                y2: nodeY,
              },
              strokeWidth: 1.4 + expansion * 7.6,
              strokeOpacity: 0.30 + expansion * 0.70,
              filter:
                expansion > 0.72
                  ? "url(#ga2-heavy-glow)"
                  : "url(#ga2-glow)",
            });
          }

          /*
           * 3. ORIGINAL STRING / LOCK
           *
           * Its group origin is the same exact node point.
           * Therefore the string and circular lock follow the hexagon
           * without ever taking another trajectory.
           */
          const structure = structureRefs.current[i];
          const s = structureLayout[i];

          if (structure && s) {
            gsap.set(structure, {
              x: nodeX,
              y: nodeY,
              rotation: s.rotation,
              scale: 0.72 + expansion * 0.10,
            });
          }
        });

        /*
         * The entire reactor expands from its center.
         */
        if (sceneRef.current) {
          gsap.set(sceneRef.current, {
            scale: 1 + expansion * 0.22,
          });
        }

        if (networkRef.current) {
          gsap.set(networkRef.current, {
            scale: 1 + expansion * 0.26,
          });
        }

        if (energyRef.current) {
          gsap.set(energyRef.current, {
            opacity: 0.62 + expansion * 0.38,
            scale: 1.20 + expansion * 1.35,
          });
        }

        if (coreRef.current) {
          gsap.set(coreRef.current, {
            scale: 1 + expansion * 0.30,
          });
        }

        if (coreSvgRef.current) {
          gsap.set(coreSvgRef.current, {
            attr: {
              transform: `translate(${CX} ${CY}) scale(${1 + expansion * 0.30}) translate(${-CX} ${-CY})`,
            },
          });
        }

        /*
         * CRACK FORMATION
         *
         * The fractures are generated by the same expanding energy core.
         * They begin early, are drawn progressively, and become bright/heavy
         * as the reactor approaches 100%.
         *
         * The previous version only changed opacity while leaving
         * strokeDashoffset at 260, so the crack paths remained undrawn.
         */
        /*
         * Keep the fractures attached to the central hexagon.
         * The exact same center-based SVG transform is used by the core.
         * This prevents the cracks from separating into another orbit.
         */
        const coreScale = 1 + expansion * 0.30;

        crackRefs.current.forEach((crack) => {
          if (!crack) return;

          gsap.set(crack, {
            attr: {
              transform:
                `translate(${CX} ${CY}) ` +
                `scale(${coreScale}) ` +
                `translate(${-CX} ${-CY})`,
            },
          });
        });

        const crackProgress = Math.max(
          0,
          Math.min(1, (value - 12) / 88)
        );

        crackRefs.current.forEach((crack, i) => {
          if (!crack) return;

          // Slight stagger between individual fractures.
          const reveal = Math.max(
            0,
            Math.min(1, crackProgress * 1.35 - i * 0.055)
          );

          gsap.set(crack, {
            strokeDasharray: 260,
            strokeDashoffset: 260 * (1 - reveal),
            opacity: reveal <= 0 ? 0 : 0.25 + reveal * 0.75,
            strokeWidth: 1.15 + reveal * 2.65,
            filter:
              reveal > 0.55
                ? "url(#ga2-heavy-glow)"
                : "url(#ga2-glow)",
          });
        });

        if (loadingRef.current) {
          gsap.set(loadingRef.current, {
            strokeDashoffset: 440 * (1 - load01),
          });
        }

        if (loadingTextRef.current) {
          loadingTextRef.current.textContent =
            `${Math.round(value)}%`;
        }
      };

      /*
       * Start at exactly 0%.
       */
      updateContinuousLoad(0);

      tl.set(loadingRef.current, {
        opacity: 1,
        strokeDashoffset: 440,
      }, 13.20);

      tl.set(loadingTextRef.current, {
        opacity: 1,
        scale: 0.72,
      }, 13.20);

      tl.set(loadingLabelRef.current, {
        opacity: 0,
      }, 13.20);

      tl.to(loadingTextRef.current, {
        scale: 1,
        duration: 0.30,
        ease: "back.out(1.7)",
      }, 13.20);

      tl.to(loadingLabelRef.current, {
        opacity: 0.75,
        duration: 0.25,
      }, 13.40);

      /*
       * SINGLE 0 → 100% TWEEN.
       *
       * There is no 78% breakpoint anymore.
       * The loading number itself drives the complete machine.
       */
      tl.to(load, {
        value: 100,
        duration: 4.20,
        ease: "power2.inOut",
        onUpdate: () => {
          updateContinuousLoad(load.value);
        },
      }, 13.40);

      // CHARGE START — low rumble as the reactor begins loading.
      tl.call(() => {
        impact(16, "charge");
      }, [], 13.40);

      // MID-CHARGE — one restrained pulse, not constant vibration.
      tl.call(() => {
        impact([18, 24, 18], "charge");
      }, [], 15.55);

      particleState.current.count = 180;
      particleState.current.speed = 1.2;

      /*
       * Final 100% overload. This overlaps the last part of the SAME
       * 0 → 100 tween instead of creating another percentage sequence.
       */
      /*
       * FINAL SIX-BEAM SYNCHRONIZATION
       * --------------------------------
       * Keep all six radial beams alive and visible through the
       * overload/breakthrough moment.  Each beam is driven from the
       * exact same radial endpoint as its corresponding stone.
       *
       * The old animation could visually read as only four beams because
       * the beams were thin/overlapped near the center.  At 100% we give
       * every beam its own strong glow and a slightly different timing.
       */
      // FINAL SIX CONNECTOR BEAMS
      // Keep the six channels visibly attached to the six stones and
      // extend them outward, matching the cinematic reference layout.
      connectorBeamRefs.current.forEach((beam, i) => {
        if (!beam) return;

        const stone = STONES[i];
        const a = (stone.angle * Math.PI) / 180;
        const dx = Math.cos(a);
        const dy = Math.sin(a);

        const finalCoreEdge = 96;
        const finalOuter = loadMaxRadius + 138;

        tl.set(beam, {
          attr: {
            x1: CX + dx * finalCoreEdge,
            y1: CY + dy * finalCoreEdge,
            x2: CX + dx * finalOuter,
            y2: CY + dy * finalOuter,
          },
          stroke: stone.color,
          strokeWidth: 10,
          strokeOpacity: 1,
          filter: "url(#ga2-heavy-glow)",
        }, 18.34);

        tl.to(beam, {
          stroke: "#ecfdf5",
          strokeWidth: 11,
          strokeOpacity: 1,
          duration: 0.12,
          ease: "expo.in",
        }, 18.40 + i * 0.015);
      });

      beamRefs.current.forEach((beam, i) => {
        if (!beam) return;

        const stone = STONES[i];
        const a = (stone.angle * Math.PI) / 180;
        // Extend each beam beyond its stone so the energy is visibly
        // emitted THROUGH the stone and continues outward.
        const finalBeamRadius = loadMaxRadius + 105;
        const finalX = CX + Math.cos(a) * finalBeamRadius;
        const finalY = CY + Math.sin(a) * finalBeamRadius;

        tl.set(beam, {
          attr: {
            x1: CX,
            y1: CY,
            x2: finalX,
            y2: finalY,
          },
          stroke: stone.color,
          strokeWidth: 10,
          strokeOpacity: 1,
          strokeDashoffset: 0,
          filter: "url(#ga2-heavy-glow)",
        }, 18.38);

        tl.to(beam, {
          stroke: "#ecfdf5",
          strokeWidth: 9,
          strokeOpacity: 1,
          filter: "url(#ga2-heavy-glow)",
          duration: 0.16,
          ease: "expo.in",
        }, 18.40 + i * 0.012);
      });

      // 100% OVERLOAD — strongest pre-breakthrough reactor hit.
      tl.call(() => {
        impact([45, 25, 70], "overload");
      }, [], 18.40);

      tl.to(energyRef.current, {
        scale: 2.75,
        opacity: 1,
        duration: 0.28,
        ease: "expo.in",
      }, 18.40);

      tl.to(coreRef.current, {
        scale: 1.30,
        duration: 0.28,
        ease: "expo.in",
      }, 18.40);

      tl.to(coreSvgRef.current, {
        attr: {
          transform: `translate(${CX} ${CY}) scale(1.30) translate(${-CX} ${-CY})`,
        },
        duration: 0.28,
        ease: "expo.in",
      }, 18.40);

      /*
       * Freeze all six hexagons on the exact final radial points before
       * the breakthrough. This prevents any later animation from sending
       * one of them in a diagonal direction.
       */
      STONES.forEach((stone, i) => {
        const stoneEl = stoneRefs.current[i];
        if (!stoneEl) return;

        const a = (stone.angle * Math.PI) / 180;
        const finalX = CX + Math.cos(a) * loadMaxRadius;
        const finalY = CY + Math.sin(a) * loadMaxRadius;

        tl.set(stoneEl, {
          attr: {
            transform:
              `translate(${finalX} ${finalY}) scale(1.16)`,
          },
        }, 18.46);
      });

      tl.to(loadingTextRef.current, {
        scale: 1.22,
        textShadow:
          "0 0 24px rgba(255,255,255,.95), 0 0 55px rgba(52,211,153,.95)",
        duration: 0.12,
        ease: "expo.out",
      }, 18.38);

      /*
       * SIX-BEAM FINAL PULSE
       * --------------------
       * A synchronized pulse makes all six radial feeds unmistakable
       * immediately before the central beam erupts.
       */
      tl.to(
        connectorBeamRefs.current.filter(Boolean),
        {
          strokeWidth: 14,
          strokeOpacity: 1,
          duration: 0.10,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        18.56
      );

      tl.to(beamRefs.current.filter(Boolean), {
        strokeWidth: 12,
        strokeOpacity: 1,
        duration: 0.10,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      }, 18.56);

      /*
       * FINAL SIX-STONE BEAM FLASH
       * Each beam is flashed independently so none of the six radial
       * directions can visually disappear into the reactor glow.
       */
      guaranteedBeamGlowRefs.current.forEach((beam, i) => {
        if (!beam) return;

        const stone = STONES[i];
        const a = (stone.angle * Math.PI) / 180;
        const dx = Math.cos(a);
        const dy = Math.sin(a);

        tl.set(
          beam,
          {
            attr: {
              x1: CX + dx * 82,
              y1: CY + dy * 82,
              x2: CX + dx * (loadMaxRadius + 142),
              y2: CY + dy * (loadMaxRadius + 142),
            },
            stroke: stone.glow,
            strokeWidth: 24,
            strokeOpacity: 0.62,
            filter: "url(#ga2-heavy-glow)",
          },
          18.34
        );

        tl.to(
          beam,
          {
            strokeWidth: 32,
            strokeOpacity: 0.78,
            duration: 0.14,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          18.56
        );
      });

      guaranteedBeamRefs.current.forEach((beam, i) => {
        if (!beam) return;

        const stone = STONES[i];
        const a = (stone.angle * Math.PI) / 180;
        const dx = Math.cos(a);
        const dy = Math.sin(a);

        tl.set(
          beam,
          {
            attr: {
              x1: CX + dx * 82,
              y1: CY + dy * 82,
              x2: CX + dx * (loadMaxRadius + 142),
              y2: CY + dy * (loadMaxRadius + 142),
            },
            stroke: stone.color,
            strokeWidth: 10,
            strokeOpacity: 1,
            filter: "url(#ga2-heavy-glow)",
          },
          18.34
        );

        tl.to(
          beam,
          {
            stroke: "#ffffff",
            strokeWidth: 16,
            strokeOpacity: 1,
            duration: 0.08,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          },
          18.58 + i * 0.012
        );
      });

      connectorGlowRefs.current.forEach((beam, i) => {
        if (!beam) return;

        tl.set(
          beam,
          {
            stroke: STONES[i].glow,
            strokeWidth: 18,
            strokeOpacity: 0.58,
            filter: "url(#ga2-heavy-glow)",
          },
          18.34
        );

        tl.to(
          beam,
          {
            strokeWidth: 26,
            strokeOpacity: 0.72,
            duration: 0.16,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          18.56
        );
      });

      connectorBeamRefs.current.forEach((beam, i) => {
        if (!beam) return;

        tl.to(
          beam,
          {
            stroke: "#ffffff",
            strokeWidth: 17,
            strokeOpacity: 1,
            duration: 0.07,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          },
          18.58 + i * 0.018
        );
      });

      beamRefs.current.forEach((beam, i) => {
        if (!beam) return;

        tl.to(
          beam,
          {
            stroke: "#ffffff",
            strokeWidth: 15,
            strokeOpacity: 1,
            duration: 0.07,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          },
          18.58 + i * 0.018
        );
      });

      /*
       * 100% — CENTRAL HIGH BEAM
       *
       * The six radial beams peak first. Only after the 0→100 controller
       * reaches 100% does the central beam erupt.
       */
      tl.to(highBeamRef.current, {
        opacity: 1,
        stroke: "#ffffff",
        strokeWidth: 22,
        strokeDashoffset: 0,
        duration: 0.13,
        ease: "expo.out",
      }, 18.60);

      // CENTRAL BEAM ERUPTION.
      tl.call(() => {
        impact(65, "overload");
      }, [], 18.60);

      tl.to(highBeamRef.current, {
        strokeWidth: 34,
        opacity: 1,
        duration: 0.11,
        ease: "expo.in",
      }, 18.73);

      tl.to(flashRef.current, {
        opacity: 0.95,
        scale: 1.25,
        duration: 0.07,
        ease: "expo.out",
      }, 18.86);

      /* FRAME 13 — SATURATION HOLD
       *
       * The complete reactor has already been expanded by the single
       * 0% -> 100% controller above. Do not move the six hexagons again here.
       * They remain locked to their final radial axes until rupture.
       */
      tl.to(loadingTextRef.current, {
        scale: 1.08,
        duration: 0.12,
        ease: "power2.out",
      }, 18.72);

      tl.to(loadingTextRef.current, {
        scale: 1,
        duration: 0.14,
        ease: "power2.inOut",
      }, 18.84);

      /* FRAME 14 — BREAKTHROUGH */
      particleState.current.burst = true;
      particleState.current.count = 260;

      tl.to(glitchRef.current, {
        opacity: 1,
        x: -16,
        scaleX: 1.4,
        duration: 0.045,
        ease: "none",
      }, 18.92);

      tl.to(glitchRef.current, {
        opacity: 0,
        x: 14,
        duration: 0.05,
        ease: "none",
      }, 18.965);

      tl.to(flashRef.current, {
        opacity: 1,
        scale: 1.35,
        duration: 0.07,
        ease: "power3.out",
      }, 19.00);

      // BREAKTHROUGH — cinematic double-impact.
      tl.call(() => {
        impact([120, 45, 180], "breakthrough");
      }, [], 19.00);

      tl.to(sceneRef.current, {
        opacity: 0,
        scale: 3.1,
        filter: "blur(10px) brightness(3)",
        duration: 0.58,
        ease: "expo.out",
      }, 19.07);

      tl.to(flashRef.current, {
        opacity: 0,
        scale: 10,
        duration: 0.58,
        ease: "expo.out",
      }, 19.07);

      /* Short black breathing space. */
      tl.addLabel("break", 19.07);
      tl.set(sceneRef.current, {
        visibility: "hidden",
      }, 19.67);

      /* FRAME 15 — LOGO REVEAL */
      if (logoRevealRef.current) {
        logoRevealRef.current.addToTimeline(tl);
      }

      tl.play();

      return () => tl.kill();
    }, rootRef.current);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      ctx.revert();
    };
  }, [handleSkip]);

  const ringRadius = [155, 184, 212, 238];

  return (
    <section
      ref={rootRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-black text-white"
    >
      <canvas
        ref={particleCanvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
      />

      <div
        ref={sceneRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(5,35,24,.22), transparent 42%), #000",
        }}
      >
        {/* HUD FRAME */}
        <div className="absolute inset-[5%] border border-emerald-400/[0.08]">
          <span className="absolute left-0 top-0 h-12 w-px bg-emerald-400/60" />
          <span className="absolute left-0 top-0 h-px w-12 bg-emerald-400/60" />
          <span className="absolute right-0 top-0 h-12 w-px bg-emerald-400/60" />
          <span className="absolute right-0 top-0 h-px w-12 bg-emerald-400/60" />
          <span className="absolute bottom-0 left-0 h-12 w-px bg-emerald-400/60" />
          <span className="absolute bottom-0 left-0 h-px w-12 bg-emerald-400/60" />
          <span className="absolute bottom-0 right-0 h-12 w-px bg-emerald-400/60" />
          <span className="absolute bottom-0 right-0 h-px w-12 bg-emerald-400/60" />

          <span className="absolute left-3 top-2 font-mono text-[8px] tracking-[0.3em] text-emerald-500/60">
            SIG_01
          </span>
          <span className="absolute right-3 top-2 font-mono text-[8px] tracking-[0.3em] text-emerald-500/60">
            SYS.ACT
          </span>
        </div>

        {/* GRID */}
        <div
          className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,.22) 1px, transparent 1px),linear-gradient(90deg,rgba(16,185,129,.22) 1px,transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(circle, black 10%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(circle, black 10%, transparent 72%)",
          }}
        />

        {/* ENERGY HALO */}
        <div
          ref={energyRef}
          className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,.42), rgba(16,185,129,.14) 35%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* WHITE SIGNAL */}
        <div
          ref={signalHaloRef}
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,.28) 20%, rgba(52,211,153,.18) 55%, transparent 75%)",
            filter: "blur(7px)",
          }}
        />

        <div
          ref={signalRef}
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            boxShadow:
              "0 0 25px #fff, 0 0 70px rgba(52,211,153,.75)",
          }}
        />

        {/* SVG SYSTEM */}
        <svg
          viewBox="0 0 1000 860"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="ga2-glow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="ga2-heavy-glow">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="core-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#86efac" />
              <stop offset="60%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="mechanical-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d1fae5" />
              <stop offset="40%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
          </defs>

          {/* RINGS — invisible until Frame 05 */}
          {ringRadius.map((radius, i) => (
            <circle
              key={radius}
              ref={(el) => {
                ringRefs.current[i] = el;
              }}
              cx={CX}
              cy={CY}
              r={radius}
              fill="none"
              stroke={i === 0 ? "#34d399" : "#10b981"}
              strokeWidth={i === 0 ? 3 : i === 1 ? 1.7 : 1}
              strokeDasharray={
                i === 0
                  ? "none"
                  : i === 1
                    ? "16 12"
                    : i === 2
                      ? "4 13"
                      : "28 18"
              }
              filter="url(#ga2-glow)"
            />
          ))}

          {/* RADIAL ENERGY PATHS */}
          {STONES.map((stone) => {
            const p = point(stone.angle);

            return (
              <line
                key={`path-${stone.id}`}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke={stone.color}
                strokeOpacity="0.16"
                strokeWidth="1"
                strokeDasharray="5 10"
              />
            );
          })}

          {/* NETWORK */}
          <g ref={networkRef}>
            <circle
              cx={CX}
              cy={CY}
              r={STONE_R}
              fill="none"
              stroke="#34d399"
              strokeOpacity=".18"
              strokeDasharray="3 12"
            />

            {STONES.map((stone, i) => {
              const p = point(stone.angle, STONE_R);

              return (
                <g key={`node-${stone.id}`}>
                  <line
                    x1={CX}
                    y1={CY}
                    x2={p.x}
                    y2={p.y}
                    stroke={stone.color}
                    strokeOpacity=".25"
                    strokeWidth="1"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="3"
                    fill={stone.color}
                    filter="url(#ga2-glow)"
                  />
                </g>
              );
            })}
          </g>

          {/* CORE */}
          <g>
            <polygon
              ref={coreSvgRef}
              points={`${CX},${CY - 92} ${CX + 80},${CY - 46} ${CX + 80},${CY + 46} ${CX},${CY + 92} ${CX - 80},${CY + 46} ${CX - 80},${CY - 46}`}
              fill="rgba(34,197,94,.06)"
              stroke="url(#core-gradient)"
              strokeWidth="3"
              filter="url(#ga2-glow)"
            />
          </g>

          {/* SIX COLORED FRAGMENTS */}
          {STONES.map((stone, i) => {
            const p = point(stone.angle);

            return (
              <g
                key={stone.id}
                ref={(el) => {
                  stoneRefs.current[i] = el;
                }}
              >
                <circle
                  r="32"
                  fill={stone.color}
                  opacity=".14"
                  filter="url(#ga2-heavy-glow)"
                />

                <polygon
                  points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11"
                  fill={`${stone.color}22`}
                  stroke={stone.color}
                  strokeWidth="2.8"
                  filter="url(#ga2-glow)"
                />

                <polygon
                  points="0,-13 11,-6 11,6 0,13 -11,6 -11,-6"
                  fill={stone.color}
                  fillOpacity=".82"
                />

                <circle
                  r="4"
                  fill="#fff"
                  style={{
                    filter: `drop-shadow(0 0 7px ${stone.glow})`,
                  }}
                />
              </g>
            );
          })}

          {/* PROTOCOL TICKS */}
          <g ref={tickRef}>
            {[
              [CX, CY - 120, CX, CY - 150],
              [CX + 120, CY, CX + 150, CY],
              [CX, CY + 120, CX, CY + 150],
              [CX - 120, CY, CX - 150, CY],
            ].map((v, i) => (
              <line
                key={i}
                x1={v[0]}
                y1={v[1]}
                x2={v[2]}
                y2={v[3]}
                stroke="#86efac"
                strokeWidth="1.5"
                opacity=".75"
              />
            ))}
          </g>

          {/* SIX MECHANICAL STRING / LOCK STRUCTURES — ORIGINAL STYLE */}
          {STONES.map((stone, i) => {
            /*
             * Keep the original mechanical lock silhouette:
             *   beam/stone origin -> mechanical string/arm -> circular lock point.
             *
             * The group origin is exactly the corresponding stone/energy-beam
             * endpoint.  The arm is rotated so its circular lock point always
             * sits OUTWARD on the same radial axis.
             */
            const armAngle = stone.angle - 33.69;

            return (
              <g
                key={`structure-${stone.id}`}
                ref={(el) => {
                  structureRefs.current[i] = el;
                }}
              >
                {/* ORIGINAL MECHANICAL BODY / STRING */}
                <path
                  d="M0 0 L220 150 L285 122 L245 190 L180 165 L95 85 Z"
                  fill="#03140e"
                  stroke="url(#mechanical-gradient)"
                  strokeWidth="2"
                  filter="url(#ga2-glow)"
                />

                {/* PRIMARY ENERGY STRING */}
                <path
                  d="M55 30 L185 125 L225 105"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="5"
                  strokeOpacity=".68"
                  strokeLinecap="round"
                  filter="url(#ga2-glow)"
                />

                {/* INNER TECH STRING / DASHED GUIDE */}
                <path
                  d="M100 60 L180 60 L215 92"
                  fill="none"
                  stroke="#6ee7b7"
                  strokeWidth="2"
                  strokeDasharray="7 7"
                  strokeOpacity=".9"
                />

                {/* SMALL MECHANICAL RIBS */}
                <path
                  d="M78 48 L118 82 M92 39 L132 73 M108 30 L148 64"
                  fill="none"
                  stroke="#86efac"
                  strokeWidth="1.2"
                  strokeOpacity=".45"
                />

                {/* LOCKABLE POINT — THE ORIGINAL ROUND END */}
                <circle
                  cx="210"
                  cy="140"
                  r="13"
                  fill="#06100b"
                  stroke="#86efac"
                  strokeWidth="2.2"
                  filter="url(#ga2-glow)"
                />
                <circle
                  cx="210"
                  cy="140"
                  r="5"
                  fill={stone.color}
                  filter="url(#ga2-heavy-glow)"
                />

                {/* LOCK POINT RETICLE */}
                <circle
                  cx="210"
                  cy="140"
                  r="18"
                  fill="none"
                  stroke={stone.color}
                  strokeWidth="1"
                  strokeOpacity=".32"
                  strokeDasharray="3 5"
                />

              </g>
            );
          })}

          {/* FRACTURE / CRACK SYSTEM — CONFINED TO THE CORE HEXAGON */}
          {[
            // Top edge -> inward branch
            "M500 338 L486 356 L500 371 L491 389",
            // Upper-right edge -> inward branch
            "M580 384 L558 392 L565 410 L548 423",
            // Lower-right edge -> inward branch
            "M580 476 L558 468 L562 448 L544 438",
            // Bottom edge -> inward branch
            "M500 522 L514 503 L501 487 L510 469",
            // Lower-left edge -> inward branch
            "M420 476 L441 466 L436 448 L454 437",
            // Upper-left edge -> inward branch
            "M420 384 L441 395 L436 412 L454 423",
            // Left edge -> center
            "M420 430 L443 430 L458 419",
            // Right edge -> center
            "M580 430 L557 430 L542 441",
          ].map((d, i) => (
            <path
              key={`crack-${i}`}
              ref={(el) => {
                crackRefs.current[i] = el;
              }}
              d={d}
              fill="none"
              stroke="#d1fae5"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="260"
              strokeDashoffset="260"
              opacity="0"
              filter="url(#ga2-glow)"
            />
          ))}

          {/* SIX RADIAL STRUCTURE BEAMS */}
          {STONES.map((stone, i) => {
            const p = point(stone.angle, STRUCTURE_R);

            return (
              <line
                key={`beam-${stone.id}`}
                ref={(el) => {
                  beamRefs.current[i] = el;
                }}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke={stone.color}
                strokeWidth="1.5"
                strokeDasharray="520"
                strokeDashoffset="520"
                filter="url(#ga2-glow)"
                opacity="0"
              />
            );
          })}

          {/* FINAL HIGH BEAM */}
          <line
            ref={highBeamRef}
            x1={CX}
            y1={CY}
            x2={CX}
            y2={-120}
            stroke="#ecfdf5"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="860"
            strokeDashoffset="860"
            filter="url(#ga2-heavy-glow)"
            opacity="0"
          />

          {/* LOADING RING */}
          <circle
            ref={loadingRef}
            cx={CX}
            cy={CY}
            r="70"
            fill="none"
            stroke="#d1fae5"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="440"
            transform={`rotate(-90 ${CX} ${CY})`}
            filter="url(#ga2-glow)"
          />
        </svg>

        {/* CORE CENTER */}
        <div
          ref={coreRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2"
        >
          {/* Each layer starts at the centre and grows outward during formation. */}
          <div
            ref={coreOuterShapeRef}
            className="absolute inset-5 rotate-45 border-2 border-emerald-300/90 bg-emerald-400/[0.08] shadow-[0_0_45px_rgba(16,185,129,.55)]"
          />
          <div
            ref={coreInnerShapeRef}
            className="absolute inset-9 rotate-45 border border-emerald-100/90 bg-emerald-300/20"
          />
          <div
            ref={corePointRef}
            className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,.98),0_0_75px_rgba(16,185,129,.95),0_0_120px_rgba(52,211,153,.55)]"
          />
        </div>

        {/* =========================================================
            SIX CONTINUOUS STONE → CORE ENERGY CHANNELS
            ---------------------------------------------------------
            This layer is intentionally ABOVE the expanding core.
            Each line:
              CORE EDGE ======> STONE ======> OUTWARD EMITTER

            The six lines share the exact same angle/radius system as
            the six hexagons, so they remain physically connected while
            the stones expand.
        ========================================================= */}
        <svg
          className="pointer-events-none absolute inset-0 z-[35] h-full w-full"
          viewBox="0 0 1000 860"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {STONES.map((stone, i) => (
            <g key={`connector-system-${stone.id}`}>
              <line
                ref={(el) => {
                  connectorGlowRefs.current[i] = el;
                }}
                x1={CX}
                y1={CY}
                x2={point(stone.angle, STONE_R + 138).x}
                y2={point(stone.angle, STONE_R + 138).y}
                stroke={stone.glow}
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#ga2-heavy-glow)"
                opacity="0"
              />
              <line
                key={`connector-beam-${stone.id}`}
                ref={(el) => {
                  connectorBeamRefs.current[i] = el;
                }}
              x1={CX}
              y1={CY}
              x2={point(stone.angle, STONE_R + 112).x}
              y2={point(stone.angle, STONE_R + 112).y}
              stroke={stone.color}
              strokeWidth="1.6"
              strokeLinecap="round"
                filter="url(#ga2-glow)"
                opacity="0"
              />
            </g>
          ))}
        </svg>

        {/* =========================================================
            GUARANTEED SIX-BEAM TOP LAYER
            ---------------------------------------------------------
            Independent from the original beam system.
            Explicitly renders all six radial channels, including the
            vertical RED (top) and ORANGE (bottom) channels.
        ========================================================= */}
        <svg
          className="pointer-events-none absolute inset-0 z-[50] h-full w-full"
          viewBox="0 0 1000 860"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {STONES.map((stone, i) => {
            const p = point(stone.angle, STONE_R + 142);

            return (
              <g key={`guaranteed-${stone.id}`}>
                <line
                  ref={(el) => {
                    guaranteedBeamGlowRefs.current[i] = el;
                  }}
                  x1={CX}
                  y1={CY}
                  x2={p.x}
                  y2={p.y}
                  stroke={stone.glow}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#ga2-heavy-glow)"
                  opacity="0"
                />
                <line
                  ref={(el) => {
                    guaranteedBeamRefs.current[i] = el;
                  }}
                  x1={CX}
                  y1={CY}
                  x2={p.x}
                  y2={p.y}
                  stroke={stone.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter="url(#ga2-heavy-glow)"
                  opacity="0"
                />
              </g>
            );
          })}
        </svg>

        {/* LOADING TEXT */}
        <div
          ref={loadingTextRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-5xl font-semibold text-emerald-50"
          style={{ textShadow: "0 0 28px rgba(52,211,153,.85)" }}
        >
          0%
        </div>

        <div
          ref={loadingLabelRef}
          className="absolute left-1/2 top-[58%] -translate-x-1/2 font-mono text-[8px] tracking-[0.58em] text-emerald-300"
        >
          ENERGY LOAD
        </div>

        {/* STATUS */}
        <div
          ref={statusRef}
          className="absolute bottom-[7%] left-1/2 -translate-x-1/2 text-center font-mono"
        >
          <div className="text-[10px] tracking-[0.32em] text-lime-300">
            {String(frame).padStart(2, "0")} // {FRAME_TITLES[frame - 1]}
          </div>
          <div
            ref={statusSubRef}
            className="mt-2 text-[7px] tracking-[0.3em] text-emerald-500/70"
          >
            VYUHAM&apos;26 // TECH FEST 2026
          </div>
        </div>

        {/* LOGO */}
        <div
          ref={logoRef}
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <img
            src="/logo.png"
            alt="VYUHAM'26"
            className="mx-auto h-32 w-32 object-contain"
          />
        </div>

        {/* TITLE */}
        <div
          ref={titleRef}
          className="absolute left-1/2 top-[54%] -translate-x-1/2 text-center"
        >
          <div
            className="whitespace-nowrap font-mono text-[clamp(42px,7vw,94px)] font-semibold tracking-[-0.08em] text-white"
            style={{
              textShadow:
                "0 0 25px rgba(255,255,255,.15), 0 0 55px rgba(16,185,129,.35)",
            }}
          >
            VYUHAM<span className="text-emerald-400">&apos;26</span>
          </div>
        </div>

        {/* SUBTITLE */}
        <div
          ref={subtitleRef}
          className="absolute left-1/2 top-[65%] -translate-x-1/2 font-mono text-[10px] tracking-[0.55em] text-emerald-300"
        >
          TECH FEST 2026
        </div>

        {/* TAGLINE */}
        <div
          ref={taglineRef}
          className="absolute left-1/2 top-[72%] -translate-x-1/2 whitespace-nowrap font-mono text-[clamp(12px,1.5vw,18px)] tracking-[0.55em] text-emerald-50"
        >
          THE FUTURE AWAITS
        </div>

        {/* GLITCH LAYER */}
        <div
          ref={glitchRef}
          className="pointer-events-none absolute left-1/2 top-[54%] h-[5px] w-[38vw] -translate-x-1/2 bg-emerald-300/60 mix-blend-screen"
        />

        {/* FINAL SCAN */}
        <div
          ref={scanRef}
          className="pointer-events-none absolute left-[-20vw] right-[-20vw] top-1/2 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(209,250,229,.95), transparent)",
            boxShadow: "0 0 25px rgba(52,211,153,.95)",
          }}
        />

        {/* BREAKTHROUGH FLASH */}
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 bg-emerald-100"
          style={{ mixBlendMode: "screen" }}
        />

        {/* TOP RIGHT - SKIP BUTTON */}
        <button
          type="button"
          onClick={handleSkip}
          className="group absolute right-[3%] top-[3%] z-[10000] flex cursor-pointer items-center gap-2 rounded border border-emerald-500/20 bg-black/60 px-3.5 py-2 font-mono text-[9px] tracking-[0.24em] text-emerald-500/80 backdrop-blur-sm transition-all hover:border-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-400"
        >
          <span>SKIP INTRO</span>
          <span className="transition-transform group-hover:translate-x-0.5">//</span>
        </button>
      </div>

      {/* =========================================================
          CINEMATIC LOGO REVEAL
          Outside sceneRef so the reactor can fade to black without
          hiding the logo sequence.
      ========================================================= */}
      <IntegratedLogoReveal ref={logoRevealRef} />
    </section>
  );
}

/* ================================================================
 * INTEGRATED LOGO REVEAL
 * Based directly on the supplied LogoReveal sequence.
 * ================================================================ */

const IntegratedLogoReveal = forwardRef<
  LogoRevealHandle
>(function IntegratedLogoReveal(_, ref) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const logoRef =
    useRef<HTMLDivElement>(null);

  const titleRef =
    useRef<HTMLHeadingElement>(null);

  const titleCharsRef =
    useRef<HTMLSpanElement[]>([]);

  const yearRef =
    useRef<HTMLSpanElement>(null);

  const subtitleRef =
    useRef<HTMLParagraphElement>(null);

  const taglineRef =
    useRef<HTMLParagraphElement>(null);

  const scanRef =
    useRef<HTMLDivElement>(null);

  const finalScanRef =
    useRef<HTMLDivElement>(null);

  const glitchRef =
    useRef<HTMLDivElement>(null);

  const auraRef =
    useRef<HTMLDivElement>(null);

  const ringRef =
    useRef<HTMLDivElement>(null);

  const coordinatesRef =
    useRef<HTMLParagraphElement>(null);

  useImperativeHandle(ref, () => ({
    addToTimeline(
      tl: gsap.core.Timeline
    ) {
      const container =
        containerRef.current;

      const logo =
        logoRef.current;

      const title =
        titleRef.current;

      const titleChars =
        titleCharsRef.current.filter(Boolean);

      const year =
        yearRef.current;

      const subtitle =
        subtitleRef.current;

      const tagline =
        taglineRef.current;

      const scan =
        scanRef.current;

      const finalScan =
        finalScanRef.current;

      const glitch =
        glitchRef.current;

      const aura =
        auraRef.current;

      const ring =
        ringRef.current;

      const coordinates =
        coordinatesRef.current;

      if (
        !container ||
        !logo ||
        !title ||
        !subtitle ||
        !tagline
      ) {
        return;
      }

      /* =====================================================
         FRAME 14 — LOGO REVEAL
         Energy collapses into the VYUHAM emblem.
      ===================================================== */

      tl.addLabel(
        "reveal",
        "break+=0.62"
      );

      /* -----------------------------------------------------
         RESET
      ----------------------------------------------------- */

      gsap.set(container, {
        opacity: 1,
      });

      gsap.set(logo, {
        opacity: 0,
        scale: 0.18,
        y: 18,
        filter:
          "blur(12px) brightness(2.4)",
      });

      gsap.set(title, {
        opacity: 1,
      });

      gsap.set(titleChars, {
        opacity: 0,
        y: 42,
        x: (index) =>
          index % 2 === 0 ? -26 : 26,
        rotateX: 78,
        rotateY: (index) =>
          index % 2 === 0 ? -18 : 18,
        scale: 0.78,
        filter: "blur(8px)",
      });

      if (year) {
        gsap.set(year, {
          opacity: 0,
          y: -22,
          scale: 0.48,
          rotate: -12,
          filter: "blur(6px)",
        });
      }

      gsap.set(subtitle, {
        opacity: 0,
        y: 16,
        letterSpacing: "0.58em",
      });

      gsap.set(tagline, {
        opacity: 0,
        y: 18,
        letterSpacing: "0.52em",
      });

      if (coordinates) {
        gsap.set(coordinates, {
          opacity: 0,
          y: 8,
        });
      }

      if (aura) {
        gsap.set(aura, {
          opacity: 0,
          scale: 0.25,
        });
      }

      if (ring) {
        gsap.set(ring, {
          opacity: 0,
          scale: 0.55,
          rotation: -24,
        });
      }

      if (glitch) {
        gsap.set(glitch, {
          opacity: 0,
          x: -8,
          scaleX: 1.15,
        });
      }

      if (scan) {
        gsap.set(scan, {
          y: "-120%",
          opacity: 0,
        });
      }

      if (finalScan) {
        gsap.set(finalScan, {
          opacity: 0,
          scaleX: 0,
        });
      }

      /* -----------------------------------------------------
         ENERGY MANAGEMENT / CORE
      ----------------------------------------------------- */

      if (aura) {
        tl.fromTo(
          aura,
          {
            opacity: 0,
            scale: 0.25,
          },
          {
            opacity: 0.95,
            scale: 1,
            duration: 0.38,
            ease: "expo.out",
          },
          "reveal"
        );

        tl.to(
          aura,
          {
            opacity: 0.34,
            scale: 1.35,
            duration: 0.72,
            ease: "power2.out",
          },
          "reveal+=0.38"
        );
      }

      if (ring) {
        tl.fromTo(
          ring,
          {
            opacity: 0,
            scale: 0.5,
            rotation: -30,
          },
          {
            opacity: 0.92,
            scale: 1,
            rotation: 0,
            duration: 0.62,
            ease: "expo.out",
          },
          "reveal+=0.04"
        );

        tl.to(
          ring,
          {
            rotation: 180,
            opacity: 0.55,
            duration: 1.4,
            ease: "none",
          },
          "reveal+=0.04"
        );
      }

      /* -----------------------------------------------------
         GLITCH HIT
      ----------------------------------------------------- */

      if (glitch) {
        tl.fromTo(
          glitch,
          {
            opacity: 0,
            x: -12,
            scaleX: 1.18,
          },
          {
            opacity: 0.95,
            x: 8,
            scaleX: 1,
            duration: 0.045,
            ease: "none",
          },
          "reveal+=0.08"
        );

        tl.to(
          glitch,
          {
            opacity: 0,
            x: -4,
            duration: 0.05,
          },
          ">"
        );

        tl.to(
          glitch,
          {
            opacity: 0.45,
            x: 3,
            duration: 0.04,
          },
          ">"
        );

        tl.to(
          glitch,
          {
            opacity: 0,
            x: 0,
            duration: 0.08,
          },
          ">"
        );
      }

      /* -----------------------------------------------------
         LOGO MATERIALIZATION
      ----------------------------------------------------- */

      tl.fromTo(
        logo,
        {
          opacity: 0,
          scale: 0.18,
          y: 20,
          filter:
            "blur(14px) brightness(2.8)",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter:
            "blur(0px) brightness(1)",
          duration: 0.72,
          ease: "expo.out",
        },
        "reveal+=0.14"
      );

      /* -----------------------------------------------------
         LOGO MANAGEMENT PULSE
      ----------------------------------------------------- */

      tl.to(
        logo,
        {
          scale: 1.075,
          filter:
            "drop-shadow(0 0 42px rgba(52,211,153,0.95)) brightness(1.2)",
          duration: 0.18,
          ease: "power3.out",
        },
        "reveal+=0.68"
      );

      tl.to(
        logo,
        {
          scale: 1,
          filter:
            "drop-shadow(0 0 20px rgba(16,185,129,0.55)) brightness(1)",
          duration: 0.5,
          ease: "sine.out",
        },
        "reveal+=0.86"
      );

      /* -----------------------------------------------------
         LOGO SCAN
      ----------------------------------------------------- */

      if (scan) {
        tl.fromTo(
          scan,
          {
            y: "-120%",
            opacity: 0,
          },
          {
            y: "180%",
            opacity: 0.95,
            duration: 0.62,
            ease: "power1.inOut",
          },
          "reveal+=0.34"
        );

        tl.to(
          scan,
          {
            opacity: 0,
            duration: 0.12,
          },
          ">"
        );
      }

      /* =====================================================
         FRAME 14 — VYUHAM LETTER ASSEMBLY
      ===================================================== */

      tl.to(
        titleChars,
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.54,
          stagger: {
            each: 0.075,
            from: "start",
          },
          ease: "expo.out",
        },
        "reveal+=0.96"
      );

      if (year) {
        tl.to(
          year,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            duration: 0.48,
            ease: "back.out(1.7)",
          },
          "reveal+=1.54"
        );
      }

      /* Small constructed-wordmark pulse. */
      tl.to(
        titleChars,
        {
          textShadow:
            "0 0 14px rgba(209,250,229,0.28), 0 0 34px rgba(52,211,153,0.16)",
          duration: 0.28,
          stagger: 0.035,
          ease: "sine.out",
        },
        "reveal+=1.74"
      );

      /* =====================================================
         FRAME 15 — EVENT LABEL
      ===================================================== */

      tl.fromTo(
        subtitle,
        {
          opacity: 0,
          y: 16,
          letterSpacing: "0.58em",
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.32em",
          duration: 0.5,
          ease: "power3.out",
        },
        "reveal+=1.82"
      );

      if (coordinates) {
        tl.fromTo(
          coordinates,
          {
            opacity: 0,
            y: 8,
          },
          {
            opacity: 0.52,
            y: 0,
            duration: 0.38,
            ease: "power2.out",
          },
          "reveal+=2.02"
        );
      }

      /* -----------------------------------------------------
         TAGLINE
      ----------------------------------------------------- */

      tl.fromTo(
        tagline,
        {
          opacity: 0,
          y: 18,
          letterSpacing: "0.52em",
        },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.28em",
          duration: 0.62,
          ease: "power3.out",
        },
        "reveal+=2.18"
      );

      /* -----------------------------------------------------
         TAGLINE SIGNAL PULSE
      ----------------------------------------------------- */

      tl.to(
        tagline,
        {
          color: "#d1fae5",
          textShadow:
            "0 0 18px rgba(52,211,153,0.8)",
          duration: 0.28,
          ease: "power2.out",
        },
        "reveal+=2.86"
      );

      tl.to(
        tagline,
        {
          color: "rgba(156,163,175,0.9)",
          textShadow: "none",
          duration: 0.48,
          ease: "sine.inOut",
        },
        "reveal+=3.14"
      );

      /* =====================================================
         FRAME 15 — CONTROLLED LOGO BREATH
      ===================================================== */

      tl.to(
        logo,
        {
          scale: 1.025,
          filter:
            "drop-shadow(0 0 28px rgba(16,185,129,0.62))",
          duration: 0.72,
          ease: "sine.inOut",
        },
        "reveal+=2.55"
      );

      tl.to(
        logo,
        {
          scale: 1,
          filter:
            "drop-shadow(0 0 16px rgba(16,185,129,0.38))",
          duration: 0.72,
          ease: "sine.inOut",
        },
        "reveal+=3.27"
      );

      /* =====================================================
         FRAME 16 — TRANSMISSION
      ===================================================== */

      tl.addLabel(
        "transition",
        "reveal+=3.78"
      );

      if (finalScan) {
        tl.to(
          finalScan,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.32,
            ease: "power3.inOut",
          },
          "transition"
        );

        tl.to(
          finalScan,
          {
            opacity: 0,
            scaleX: 1.55,
            duration: 0.4,
            ease: "power2.out",
          },
          "transition+=0.32"
        );
      }

      /* -----------------------------------------------------
         FINAL SIGNAL FLASH
      ----------------------------------------------------- */

      tl.to(
        logo,
        {
          filter:
            "drop-shadow(0 0 45px rgba(52,211,153,0.9)) brightness(1.15)",
          duration: 0.18,
          ease: "power2.out",
        },
        "transition+=0.18"
      );

      tl.to(
        title,
        {
          scale: 0.985,
          opacity: 0.92,
          duration: 0.28,
          ease: "power2.inOut",
        },
        "transition+=0.18"
      );

      /*
       * Hold the complete title card.
       * IntroSequence owns the actual section fade.
       */
      tl.addLabel(
        "transitionComplete",
        "transition+=0.72"
      );
    },
  }));

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[30] grid place-items-center"
      aria-hidden="true"
    >
      <div className="relative grid place-items-center text-center">

        {/* =================================================
            ENERGY AURA
        ================================================= */}

        <div
          ref={auraRef}
          className="absolute h-64 w-64 rounded-full md:h-80 md:w-80"
          style={{
            opacity: 0,
            background:
              "radial-gradient(circle, rgba(16,185,129,0.34) 0%, rgba(16,185,129,0.14) 36%, transparent 72%)",
            filter: "blur(22px)",
          }}
        />

        {/* =================================================
            DIMENSIONAL RING
        ================================================= */}

        <div
          ref={ringRef}
          className="absolute h-48 w-48 rounded-full border border-emerald-300/35 md:h-60 md:w-60"
          style={{
            opacity: 0,
            boxShadow:
              "0 0 28px rgba(16,185,129,0.2), inset 0 0 28px rgba(16,185,129,0.08)",
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(16,185,129,0.5) 55deg, transparent 95deg, transparent 180deg, rgba(52,211,153,0.42) 240deg, transparent 290deg)",
          }}
        />

        {/* =================================================
            GLITCH OVERLAY
        ================================================= */}

        <div
          ref={glitchRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,
            background:
              "linear-gradient(90deg, transparent 15%, rgba(209,250,229,0.45) 38%, transparent 52%, rgba(16,185,129,0.32) 72%, transparent 88%)",
            mixBlendMode: "screen",
          }}
        />

        {/* =================================================
            LOGO EMBLEM
        ================================================= */}

        <div
          ref={logoRef}
          className="relative grid h-32 w-32 place-items-center md:h-40 md:w-40"
          style={{
            opacity: 0,
          }}
        >
          <Image
            src="/logo.png"
            alt="VYUHAM '26 emblem"
            width={160}
            height={160}
            priority
            loading="eager"
            fetchPriority="high"
            className="h-24 w-24 object-contain md:h-32 md:w-32"
          />

          {/* Logo scan line */}
          <div
            ref={scanRef}
            className="pointer-events-none absolute inset-x-0 h-px"
            style={{
              top: 0,
              background:
                "linear-gradient(90deg, transparent, rgba(209,250,229,0.98), transparent)",
              boxShadow:
                "0 0 14px rgba(16,185,129,0.9)",
              opacity: 0,
            }}
          />
        </div>

        {/* =================================================
            WORDMARK
        ================================================= */}

        <h1
          ref={titleRef}
          className="intro-wordmark mt-6 font-display text-[clamp(48px,10vw,112px)] leading-none tracking-[-0.09em] text-paper"
          style={{
            perspective: "900px",
            transformStyle: "preserve-3d",
          }}
        >
          {"VYUHAM".split("").map(
            (char, index) => (
              <span
                key={`${char}-${index}`}
                ref={(el) => {
                  if (el) {
                    titleCharsRef.current[index] =
                      el;
                  }
                }}
                className="inline-block will-change-transform"
                style={{
                  opacity: 0,
                  transformStyle:
                    "preserve-3d",
                }}
              >
                {char}
              </span>
            )
          )}

          <span
            ref={yearRef}
            className="inline-block text-green will-change-transform"
            style={{
              opacity: 0,
            }}
          >
            &apos;26
          </span>
        </h1>

        {/* =================================================
            EVENT LABEL
        ================================================= */}

        <p
          ref={subtitleRef}
          className="mt-3 font-mono text-[10px] tracking-[0.32em] text-green"
          style={{
            opacity: 0,
          }}
        >
          TECH FEST 2026
        </p>

        {/* =================================================
            COORDINATE READOUT
        ================================================= */}

        <p
          ref={coordinatesRef}
          className="mt-2 font-mono text-[7px] tracking-[0.2em] text-muted"
          style={{
            opacity: 0,
          }}
        >
          SIGNAL // 8.5441° N // 76.8808° E
        </p>

        {/* =================================================
            TAGLINE
        ================================================= */}

        <p
          ref={taglineRef}
          className="mt-2 font-mono text-[9px] tracking-[0.24em] text-muted"
          style={{
            opacity: 0,
          }}
        >
          THE FUTURE AWAITS
        </p>

        {/* =================================================
            FINAL TRANSMISSION SCAN
        ================================================= */}

        <div
          ref={finalScanRef}
          className="pointer-events-none absolute left-[-45vw] right-[-45vw] top-1/2 h-px"
          style={{
            opacity: 0,
            transform:
              "scaleX(0)",
            transformOrigin: "center",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.1) 20%, rgba(209,250,229,0.98) 50%, rgba(52,211,153,0.1) 80%, transparent 100%)",
            boxShadow:
              "0 0 24px rgba(52,211,153,0.9)",
          }}
        />
      </div>
    </div>
  );
});

IntegratedLogoReveal.displayName =
  "IntegratedLogoReveal";