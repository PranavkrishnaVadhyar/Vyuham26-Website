import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { useApp } from "@/lib/store";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";
import { MagneticButton } from "@/components/cinematic/Interactive";
import { scrollToId } from "@/lib/scroll";
import Logo from "@/components/ui/Logo";
import { SITE_CONFIG } from "@/config/site";

/* ---------- geometry: icosahedron ---------- */
const PHI = (1 + Math.sqrt(5)) / 2;
const V: [number, number, number][] = [
  [0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI],
  [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1],
];
const EDGES: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let i = 0; i < V.length; i++)
    for (let j = i + 1; j < V.length; j++) {
      const d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
      if (Math.abs(d - 2) < 0.001) out.push([i, j]);
    }
  return out;
})();

interface P {
  sx: number; sy: number; sz: number;
  tx: number; ty: number; tz: number;
  w: number; a: number;
}

function ConvergenceCanvas({ getProgress }: { getProgress: () => number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const N = reduced ? 120 : mobile ? 260 : 760;
    let w = 0, h = 0, raf = 0, running = true, t = 0;
    const parts: P[] = [];

    const seed = () => {
      parts.length = 0;
      for (let i = 0; i < N; i++) {
        const e = EDGES[Math.floor(Math.random() * EDGES.length)];
        const k = Math.random();
        const a = V[e[0]], b = V[e[1]];
        const jitter = 0.035;
        parts.push({
          sx: (Math.random() - 0.5) * 9,
          sy: (Math.random() - 0.5) * 9,
          sz: (Math.random() - 0.5) * 9,
          tx: a[0] + (b[0] - a[0]) * k + (Math.random() - 0.5) * jitter,
          ty: a[1] + (b[1] - a[1]) * k + (Math.random() - 0.5) * jitter,
          tz: a[2] + (b[2] - a[2]) * k + (Math.random() - 0.5) * jitter,
          w: 0.6 + Math.random() * 1.5,
          a: 0.25 + Math.random() * 0.6,
        });
      }
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    seed();

    const draw = () => {
      if (!running) return;
      t += 0.004;
      const p = Math.min(1, Math.max(0, getProgress()));
      const ease = p * p * (3 - 2 * p);

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * (0.15 + ease * 0.06);
      const ry = t * 0.55;
      const rx = Math.sin(t * 0.32) * 0.36;
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const cosX = Math.cos(rx), sinX = Math.sin(rx);

      const project = (x: number, y: number, z: number) => {
        let X = x * cosY - z * sinY;
        let Z = x * sinY + z * cosY;
        const Y = y * cosX - Z * sinX;
        Z = y * sinX + Z * cosX;
        const persp = 6 / (6 + Z);
        return { x: cx + X * scale * persp, y: cy + Y * scale * persp, s: persp };
      };

      /* structure wireframe */
      if (ease > 0.42) {
        const la = Math.min(1, (ease - 0.42) / 0.42);
        ctx.lineWidth = 1;
        for (const [i, j] of EDGES) {
          const A = project(V[i][0], V[i][1], V[i][2]);
          const B = project(V[j][0], V[j][1], V[j][2]);
          const grad = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
          grad.addColorStop(0, `rgba(24,196,124,${0.06 * la})`);
          grad.addColorStop(0.5, `rgba(150,255,208,${0.5 * la})`);
          grad.addColorStop(1, `rgba(24,196,124,${0.06 * la})`);
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(A.x, A.y);
          ctx.lineTo(B.x, B.y);
          ctx.stroke();
        }
      }

      /* particles */
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < parts.length; i++) {
        const q = parts[i];
        const wander = (1 - ease) * 0.55;
        const x = q.sx + (q.tx - q.sx) * ease + Math.sin(t * 1.4 + i) * wander;
        const y = q.sy + (q.ty - q.sy) * ease + Math.cos(t * 1.1 + i * 0.7) * wander;
        const z = q.sz + (q.tz - q.sz) * ease;
        const pr = project(x, y, z);
        const size = q.w * pr.s * (0.7 + ease * 0.8);
        const alpha = q.a * (0.35 + ease * 0.65) * pr.s;
        ctx.fillStyle = i % 9 === 0 ? `rgba(190,255,225,${alpha})` : `rgba(46,214,142,${alpha * 0.8})`;
        ctx.fillRect(pr.x - size / 2, pr.y - size / 2, size, size);
      }
      ctx.globalCompositeOperation = "source-over";

      /* core bloom */
      if (ease > 0.6) {
        const b = (ease - 0.6) / 0.4;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.3);
        g.addColorStop(0, `rgba(140,255,205,${0.22 * b})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    const onResize = () => {
      resize();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [getProgress, mobile, reduced]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

export default function FinalReveal() {
  const { content, ui, user } = useApp();
  const hp = content.homepage;
  const wrap = useRef<HTMLDivElement | null>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (reduced) {
      progress.current = 1;
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        },
      });
      tl.fromTo(".fin-dark", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.4 }, 0);
      tl.fromTo(
        ".fin-logo",
        { autoAlpha: 0, scale: 1.3, filter: "blur(28px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", ease: "expo.out", duration: 0.2 },
        0.5,
      );
      tl.fromTo(".fin-rule", { scaleX: 0 }, { scaleX: 1, ease: "expo.out", duration: 0.14 }, 0.62);
      tl.fromTo(
        ".fin-tag",
        { autoAlpha: 0, y: 26, filter: "blur(14px)", letterSpacing: "0.5em" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.2em", ease: "expo.out", duration: 0.16 },
        0.7,
      );
      tl.fromTo(".fin-cta", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, ease: "expo.out", duration: 0.12 }, 0.82);
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const getProgress = useRef(() => progress.current).current;

  return (
    <div ref={wrap} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#020403]">
        <div className="fin-dark absolute inset-0 bg-[#010302] opacity-0" />
        <ConvergenceCanvas getProgress={getProgress} />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <div className="fin-logo" style={{ visibility: reduced ? "visible" : "hidden" }}>
            {/* Festival Emblem Logo */}
            <div className="mx-auto mb-4 flex items-center justify-center">
              <div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16 md:h-20 md:w-20">
                <Logo
                  size="md"
                  alt="VYUHAM'26 Emblem"
                  className="relative z-10 h-14 w-14 object-contain drop-shadow-[0_0_24px_rgba(24,196,124,0.65)] transition-transform duration-700 hover:scale-105 sm:h-16 sm:w-16 md:h-20 md:w-20"
                />
              </div>
            </div>

            <p className="eyebrow mb-5">08 — THE FUTURE</p>
            <h2 className="t-cond text-[21vw] leading-[0.8] text-[#f6fdfa] md:text-[13vw]">
              <span style={{ textShadow: "0 0 100px rgba(24,196,124,0.35)" }}>
                {hp.brand}
                <span className="align-super text-[0.34em] text-[#18c47c]">{hp.year}</span>
              </span>
            </h2>
          </div>

          <div className="fin-rule mt-4 h-px w-[min(560px,78vw)] origin-center bg-gradient-to-r from-transparent via-[rgba(24,196,124,0.75)] to-transparent" />

          <p className="fin-tag t-cond-l mt-8 text-[6.6vw] tracking-[0.2em] text-[#c6e9d7] md:text-[2.4vw]">
            {hp.tagline}
          </p>

          <div className="fin-cta mt-12 flex flex-col items-center gap-4 sm:flex-row">
            {!SITE_CONFIG.REG_OPEN ? (
              <MagneticButton
                variant="solid"
                onClick={() => scrollToId("events")}
              >
                REGISTRATION COMING SOON
                <span className="text-[#f59e0b]">●</span>
              </MagneticButton>
            ) : (
              <MagneticButton
                variant="solid"
                onClick={() => (user ? ui.setProfileOpen(true) : ui.setAuthOpen("signup"))}
              >
                {hp.finalCta}
                <span className="text-[#7dffc4]">→</span>
              </MagneticButton>
            )}
            <button
              onClick={() => scrollToId("events")}
              className="link-trail font-mono text-[10px] tracking-[0.28em] text-[#7d9a8d] transition-colors duration-500 hover:text-[#dff6ec]"
            >
              VIEW FULL PROGRAMME
            </button>
          </div>

          <p className="mt-12 font-mono text-[9px] tracking-[0.34em] text-[#3f6152] md:text-[10px]">
            {hp.dates || "30 OCT — 01 NOV 2026"} · {hp.location && !hp.location.includes("HYDERABAD") ? hp.location : "TECHNOCITY · THIRUVANANTHAPURAM"}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0 vignette" />
      </div>
    </div>
  );
}
