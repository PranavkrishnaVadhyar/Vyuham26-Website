"use client";

import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { gsap } from "gsap";

const MAX_PARTICLES = 220;
const INITIAL_PARTICLES = 36;
const BURST_PARTICLES = 90;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  decay: number;
}

interface ParticleFieldProps {
  className?: string;
}

export interface ParticleFieldHandle {
  addToTimeline: (
    tl: gsap.core.Timeline
  ) => void;
}

const IntroParticleField = forwardRef<
  ParticleFieldHandle,
  ParticleFieldProps
>(function IntroParticleField(
  { className = "" },
  ref
) {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const particlesRef =
    useRef<Particle[]>([]);

  const animationRef =
    useRef<number | null>(null);

  const stateRef = useRef({
    count: INITIAL_PARTICLES,
    speed: 0.3,
    opacity: 0.28,
    exploding: false,
    centerX: 0,
    centerY: 0,
    active: true,
  });

  /*
   * ─────────────────────────────
   * PARTICLE CREATION
   * ─────────────────────────────
   */

  const createParticle = useCallback(
    (
      cx: number,
      cy: number,
      spread: number
    ): Particle => {
      const angle =
        Math.random() *
        Math.PI *
        2;

      const distance =
        Math.random() *
        spread;

      const bright =
        Math.random() > 0.72;

      return {
        x:
          cx +
          Math.cos(angle) *
            distance,

        y:
          cy +
          Math.sin(angle) *
            distance,

        vx:
          (Math.random() - 0.5) *
          stateRef.current.speed,

        vy:
          (Math.random() - 0.5) *
          stateRef.current.speed,

        size: bright
          ? Math.random() * 2.2 + 0.8
          : Math.random() * 1.3 + 0.4,

        opacity: bright
          ? Math.random() * 0.3 + 0.2
          : Math.random() * 0.18 + 0.05,

        /*
         * Only emerald / green.
         *
         * 145 → emerald
         * 158 → green
         */
        hue:
          Math.random() > 0.45
            ? 145
            : 158,

        life: 1,

        decay:
          0.008 +
          Math.random() * 0.012,
      };
    },
    []
  );

  /*
   * ─────────────────────────────
   * CANVAS ENGINE
   * ─────────────────────────────
   */

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      width = rect.width;
      height = rect.height;

      canvas.width =
        Math.floor(
          width * dpr
        );

      canvas.height =
        Math.floor(
          height * dpr
        );

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

      stateRef.current.centerX =
        width / 2;

      stateRef.current.centerY =
        height / 2;
    };

    resize();

    window.addEventListener(
      "resize",
      resize,
      { passive: true }
    );

    /*
     * Initial particle cloud.
     */
    const {
      centerX,
      centerY,
    } = stateRef.current;

    particlesRef.current =
      Array.from(
        {
          length:
            INITIAL_PARTICLES,
        },
        () =>
          createParticle(
            centerX,
            centerY,
            Math.min(
              140,
              Math.max(
                width,
                height
              ) * 0.15
            )
          )
      );

    /*
     * ─────────────────────────────
     * ANIMATION LOOP
     * ─────────────────────────────
     */

    let lastTime =
      performance.now();

    const animate = (
      currentTime: number
    ) => {
      if (
        !stateRef.current.active
      ) {
        return;
      }

      const delta = Math.min(
        currentTime -
          lastTime,
        32
      );

      lastTime = currentTime;

      const dt =
        delta / 16.67;

      const state =
        stateRef.current;

      const particles =
        particlesRef.current;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      /*
       * Add particles as the system
       * charges.
       */
      while (
        particles.length <
          state.count &&
        particles.length <
          MAX_PARTICLES
      ) {
        particles.push(
          createParticle(
            state.centerX,
            state.centerY,
            state.exploding
              ? 12
              : 120
          )
        );
      }

      /*
       * ─────────────────────────
       * UPDATE PARTICLES
       * ─────────────────────────
       */

      for (
        let i =
          particles.length - 1;
        i >= 0;
        i--
      ) {
        const p =
          particles[i];

        if (state.exploding) {
          /*
           * Explosion particles already
           * have their radial velocity.
           *
           * Do NOT recalculate their
           * velocity every frame.
           */
          p.vx *= 0.985;
          p.vy *= 0.985;

          p.life -=
            p.decay * dt;
        } else {
          /*
           * Gentle orbital field.
           */
          const dx =
            state.centerX -
            p.x;

          const dy =
            state.centerY -
            p.y;

          const distance =
            Math.sqrt(
              dx * dx +
                dy * dy
            ) || 1;

          /*
           * Tangential force.
           */
          p.vx +=
            (dy / distance) *
            0.018 *
            state.speed *
            dt;

          p.vy +=
            (-dx / distance) *
            0.018 *
            state.speed *
            dt;

          /*
           * Soft damping.
           */
          p.vx *=
            Math.pow(
              0.992,
              dt
            );

          p.vy *=
            Math.pow(
              0.992,
              dt
            );
        }

        p.x +=
          p.vx * dt;

        p.y +=
          p.vy * dt;

        /*
         * Remove dead particles.
         */
        if (
          p.life <= 0 ||
          p.x < -100 ||
          p.x > width + 100 ||
          p.y < -100 ||
          p.y > height + 100
        ) {
          particles.splice(
            i,
            1
          );

          continue;
        }

        /*
         * Draw particle.
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
          75%,
          62%,
          ${
            p.opacity *
            p.life
          }
        )`;

        ctx.fill();
      }

      /*
       * ─────────────────────────
       * SIGNAL NETWORK
       * ─────────────────────────
       *
       * Only during charging.
       */
      if (!state.exploding) {
        const maxDistance = 82;
        const maxDistanceSq =
          maxDistance *
          maxDistance;

        for (
          let i = 0;
          i < particles.length;
          i++
        ) {
          const a =
            particles[i];

          for (
            let j = i + 1;
            j < particles.length;
            j++
          ) {
            const b =
              particles[j];

            const dx =
              a.x - b.x;

            const dy =
              a.y - b.y;

            const distanceSq =
              dx * dx +
              dy * dy;

            if (
              distanceSq >
              maxDistanceSq
            ) {
              continue;
            }

            const distance =
              Math.sqrt(
                distanceSq
              );

            const strength =
              1 -
              distance /
                maxDistance;

            ctx.beginPath();

            ctx.moveTo(
              a.x,
              a.y
            );

            ctx.lineTo(
              b.x,
              b.y
            );

            ctx.strokeStyle =
              `rgba(16, 185, 129, ${
                0.055 *
                strength
              })`;

            ctx.lineWidth = 0.45;

            ctx.stroke();
          }
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

    /*
     * ─────────────────────────
     * CLEANUP
     * ─────────────────────────
     */

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

      stateRef.current.active =
        false;
    };
  }, [createParticle]);

  /*
   * ─────────────────────────────
   * GSAP TIMELINE INTEGRATION
   * ─────────────────────────────
   */

  useImperativeHandle(
    ref,
    () => ({
      addToTimeline(
        tl: gsap.core.Timeline
      ) {
        const state =
          stateRef.current;

        /*
         * CHARGE
         *
         * The particle field becomes
         * denser as the VYUHAM core
         * approaches critical energy.
         */
        tl.to(
          state,
          {
            count:
              MAX_PARTICLES,

            speed: 1.8,

            opacity: 0.68,

            duration: 3.8,

            ease: "power1.in",
          },
          "charge"
        );

        /*
         * Small acceleration burst
         * near the end of charging.
         */
        tl.to(
          state,
          {
            speed: 2.8,
            duration: 0.45,
            ease: "power2.in",
          },
          "critical-=0.45"
        );

        /*
         * ─────────────────────
         * BREAK / OVERLOAD
         * ─────────────────────
         */

        tl.add(
          () => {
            state.exploding =
              true;

            const {
              centerX,
              centerY,
            } = state;

            /*
             * Clear old particles so
             * the explosion reads as
             * one controlled energy event.
             */
            particlesRef.current =
              [];

            /*
             * Main radial burst.
             */
            for (
              let i = 0;
              i < BURST_PARTICLES;
              i++
            ) {
              const angle =
                Math.random() *
                Math.PI *
                2;

              const velocity =
                5 +
                Math.random() *
                  9;

              particlesRef.current.push(
                {
                  x:
                    centerX +
                    (Math.random() -
                      0.5) *
                      14,

                  y:
                    centerY +
                    (Math.random() -
                      0.5) *
                      14,

                  vx:
                    Math.cos(
                      angle
                    ) *
                    velocity,

                  vy:
                    Math.sin(
                      angle
                    ) *
                    velocity,

                  size:
                    Math.random() *
                      2.8 +
                    0.8,

                  opacity:
                    Math.random() *
                      0.4 +
                    0.5,

                  hue:
                    Math.random() >
                    0.35
                      ? 145
                      : 158,

                  life: 1,

                  decay:
                    0.018 +
                    Math.random() *
                      0.018,
                }
              );
            }
          },
          "break+=0.05"
        );

        /*
         * Canvas becomes invisible shortly
         * after the overload.
         */
        tl.to(
          canvasRef.current,
          {
            opacity: 0,
            duration: 0.65,
            ease: "power2.out",
          },
          "break+=0.48"
        );
      },
    }),
    []
  );

  return (
    <canvas
      ref={canvasRef}
      className={`intro-particles ${className}`}
      aria-hidden="true"
    />
  );
});

IntroParticleField.displayName =
  "IntroParticleField";

export default IntroParticleField;