"use client";

import {
  useRef,
  useEffect,
  useCallback,
} from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  phase: number;
  hue: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
}

export default function ParticleField({
  className = "",
  particleCount = 65,
  connectionDistance = 105,
}: ParticleFieldProps) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const particlesRef =
    useRef<Particle[]>([]);

  const animationRef =
    useRef<number | null>(null);

  const initParticles = useCallback(
    (width: number, height: number) => {
      particlesRef.current = Array.from(
        { length: particleCount },
        () => {
          const isBright =
            Math.random() > 0.78;

          return {
            x: Math.random() * width,
            y: Math.random() * height,

            vx:
              (Math.random() - 0.5) *
              0.16,

            vy:
              (Math.random() - 0.5) *
              0.16,

            size: isBright
              ? Math.random() * 1.4 + 0.8
              : Math.random() * 1 + 0.35,

            opacity: isBright
              ? Math.random() * 0.28 + 0.18
              : Math.random() * 0.18 + 0.05,

            baseOpacity: isBright
              ? Math.random() * 0.28 + 0.18
              : Math.random() * 0.18 + 0.05,

            phase:
              Math.random() *
              Math.PI *
              2,

            /*
             * 140 = emerald
             * 150 = green
             */
            hue:
              Math.random() > 0.35
                ? 145
                : 158,
          };
        }
      );
    },
    [particleCount]
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        Math.floor(width * dpr);

      canvas.height =
        Math.floor(height * dpr);

      /*
       * Reset transform before applying
       * the new DPR scale.
       */
      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      initParticles(width, height);
    };

    resize();

    window.addEventListener(
      "resize",
      resize,
      { passive: true }
    );

    /*
     * Respect reduced motion without
     * removing the visual completely.
     */
    if (prefersReducedMotion) {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      particlesRef.current.forEach(
        (p) => {
          ctx.beginPath();

          ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
          );

          ctx.fillStyle = `hsla(
            ${p.hue},
            70%,
            58%,
            ${p.baseOpacity * 0.65}
          )`;

          ctx.fill();
        }
      );

      return () => {
        window.removeEventListener(
          "resize",
          resize
        );
      };
    }

    let lastTime = performance.now();

    const animate = (
      currentTime: number
    ) => {
      const delta =
        Math.min(
          currentTime - lastTime,
          32
        );

      lastTime = currentTime;

      const dt = delta / 16.67;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      const particles =
        particlesRef.current;

      /*
       * ─────────────────────────
       * PARTICLE MOVEMENT
       * ─────────────────────────
       */
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        /*
         * Wrap around the viewport.
         */
        if (p.x < -4) {
          p.x = width + 4;
        }

        if (p.x > width + 4) {
          p.x = -4;
        }

        if (p.y < -4) {
          p.y = height + 4;
        }

        if (p.y > height + 4) {
          p.y = -4;
        }

        /*
         * Very subtle signal pulse.
         */
        p.phase +=
          0.008 * dt;

        p.opacity =
          p.baseOpacity +
          Math.sin(p.phase) * 0.035;

        /*
         * Particle.
         */
        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          p.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `hsla(
          ${p.hue},
          72%,
          62%,
          ${Math.max(
            0.02,
            p.opacity
          )}
        )`;

        ctx.fill();
      }

      /*
       * ─────────────────────────
       * SIGNAL CONNECTIONS
       * ─────────────────────────
       *
       * Only nearby particles connect.
       * This keeps the field lightweight
       * and prevents a spider-web look.
       */
      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const a = particles[i];

        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const b = particles[j];

          const dx =
            a.x - b.x;

          const dy =
            a.y - b.y;

          const distanceSquared =
            dx * dx + dy * dy;

          const maxDistance =
            connectionDistance;

          if (
            distanceSquared >
            maxDistance *
              maxDistance
          ) {
            continue;
          }

          const distance =
            Math.sqrt(
              distanceSquared
            );

          /*
           * Fade connections toward
           * their endpoints.
           */
          const strength =
            1 -
            distance /
              maxDistance;

          /*
           * Keep the network extremely
           * subtle.
           */
          const alpha =
            strength * 0.075;

          ctx.beginPath();

          ctx.moveTo(
            a.x,
            a.y
          );

          ctx.lineTo(
            b.x,
            b.y
          );

          ctx.strokeStyle = `rgba(
            52,
            211,
            153,
            ${alpha}
          )`;

          ctx.lineWidth = 0.45;

          ctx.stroke();
        }
      }

      animationRef.current =
        requestAnimationFrame(
          animate
        );
    };

    animationRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );

      if (
        animationRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, [initParticles, connectionDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}