import { useEffect, useRef } from "react";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";

interface Particle {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  hue: 0 | 1;
}

/**
 * Global atmospheric layer: volumetric haze, drifting dust, faint green
 * energy motes, film grain and a cinematic vignette. One canvas, one rAF,
 * DPR-capped, paused when the tab is hidden.
 */
export default function Atmosphere({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

    const count = reduced ? 22 : mobile ? 38 : 110;
    const parts: Particle[] = [];

    // Pre-rendered sprites (soft bokeh dot) — far cheaper than per-frame gradients.
    const makeSprite = (color: string) => {
      const s = document.createElement("canvas");
      s.width = s.height = 64;
      const c = s.getContext("2d")!;
      const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, color);
      g.addColorStop(0.35, color.replace(/[\d.]+\)$/, "0.35)"));
      g.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
      c.fillStyle = g;
      c.fillRect(0, 0, 64, 64);
      return s;
    };
    const spriteDust = makeSprite("rgba(206,224,215,0.9)");
    const spriteGreen = makeSprite("rgba(70,238,160,0.9)");

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      parts.length = 0;
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: (0.6 + z * 2.6) * (mobile ? 0.8 : 1),
          vx: (Math.random() - 0.5) * 0.12 * (0.3 + z),
          vy: -(0.05 + Math.random() * 0.22) * (0.3 + z),
          a: 0.05 + Math.random() * 0.3,
          hue: Math.random() > 0.82 ? 1 : 0,
        });
      }
    };

    resize();
    seed();

    let t = 0;
    const draw = () => {
      if (!running) return;
      t += 0.0035;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";

      for (const p of parts) {
        p.x += p.vx + Math.sin(t + p.y * 0.004) * 0.16 * p.z;
        p.y += p.vy;
        if (p.y < -30) {
          p.y = h + 20;
          p.x = Math.random() * w;
        }
        if (p.x < -30) p.x = w + 20;
        if (p.x > w + 30) p.x = -20;

        const flicker = 0.7 + Math.sin(t * 6 + p.x * 0.02) * 0.3;
        const size = p.r * 12;
        ctx.globalAlpha = p.a * flicker * intensity;
        ctx.drawImage(p.hue ? spriteGreen : spriteDust, p.x - size / 2, p.y - size / 2, size, size);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // one static frame only
      draw();
      running = false;
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    const onResize = () => {
      resize();
      seed();
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, mobile, intensity]);

  return (
    <>
      {/* behind the content: volumetric haze + drifting dust */}
      <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        <div className="haze absolute inset-0 opacity-70" />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
      </div>
      {/* in front of the content: the film itself */}
      <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
        <div className="vignette absolute inset-0" />
        <div className="grain absolute inset-0 overflow-hidden" />
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "repeating-linear-gradient(180deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>
    </>
  );
}
