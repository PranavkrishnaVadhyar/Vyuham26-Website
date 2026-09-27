import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { useIsCoarse, useReducedMotion } from "@/lib/hooks";

/* ------------------------------------------------------------------ */
/*  Magnetic cinematic button                                          */
/* ------------------------------------------------------------------ */
interface MagneticProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "ghost" | "solid";
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  variant = "ghost",
  strength = 0.28,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const coarse = useIsCoarse();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || coarse || reduced) return;
    let raf = 0;
    const state = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      state.tx = (e.clientX - (r.left + r.width / 2)) * strength;
      state.ty = (e.clientY - (r.top + r.height / 2)) * strength * 1.4;
    };
    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
    };
    const loop = () => {
      state.x += (state.tx - state.x) * 0.15;
      state.y += (state.ty - state.y) * 0.15;
      el.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [coarse, reduced, strength]);

  return (
    <button
      ref={ref}
      data-cursor="hover"
      className={cn("btn-cine", variant === "solid" && "btn-cine--solid", className)}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom cinematic cursor (desktop, fine pointer only)               */
/* ------------------------------------------------------------------ */
export function CinematicCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const coarse = useIsCoarse();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (coarse || reduced) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const s = { x: innerWidth / 2, y: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2, scale: 1 };
    let target = 1;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      s.x = e.clientX;
      s.y = e.clientY;
      const el = (e.target as HTMLElement)?.closest?.("a,button,[data-cursor='hover'],input,textarea,select,[role='button']");
      target = el ? 2.1 : 1;
    };
    const loop = () => {
      s.rx += (s.x - s.rx) * 0.13;
      s.ry += (s.y - s.ry) * 0.13;
      s.scale += (target - s.scale) * 0.12;
      dot.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%,-50%) scale(${s.scale.toFixed(3)})`;
      ring.style.opacity = String(0.35 + (s.scale - 1) * 0.3);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    document.documentElement.style.cursor = "none";
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
    };
  }, [coarse, reduced]);

  if (coarse || reduced) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] hidden lg:block">
      <div ref={dotRef} className="absolute h-[5px] w-[5px] rounded-full bg-[#7dffc4] mix-blend-screen" />
      <div
        ref={ringRef}
        className="absolute h-8 w-8 rounded-full border border-[rgba(125,255,196,0.6)] mix-blend-screen"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Depth image — parallax lift on hover                               */
/* ------------------------------------------------------------------ */
export function DepthImage({
  src,
  alt,
  className,
  imgClassName,
  grade = "grade-cine-soft",
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  grade?: string;
  loading?: "lazy" | "eager";
}) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const coarse = useIsCoarse();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    if (!el || coarse || reduced) return;
    const img = el.querySelector("img");
    if (!img) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      (img as HTMLElement).style.transform = `scale(1.08) translate3d(${(-px * 18).toFixed(1)}px, ${(
        -py * 18
      ).toFixed(1)}px, 0)`;
    };
    const onLeave = () => {
      (img as HTMLElement).style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [coarse, reduced]);

  return (
    <div ref={wrap} className={cn("hover-depth relative overflow-hidden bg-[#070b09]", className)}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className={cn("h-full w-full object-cover", grade, imgClassName)}
      />
      <div className="tint-green pointer-events-none absolute inset-0" />
      <div className="light-leak pointer-events-none absolute inset-0 opacity-60" />
    </div>
  );
}
