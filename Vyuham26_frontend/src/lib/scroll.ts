import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./anim";

let lenis: Lenis | null = null;
let rafCb: ((time: number) => void) | null = null;
let _initDone = false;

export function initSmoothScroll() {
  if (lenis) return lenis;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return null;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.6,
    syncTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);
  rafCb = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(rafCb);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Auto-init: call once at module load so Lenis is always running. */
if (typeof window !== "undefined" && !_initDone) {
  _initDone = true;
  // Defer to after first paint so the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initSmoothScroll(), { once: true });
  } else {
    queueMicrotask(() => initSmoothScroll());
  }
}

export function destroySmoothScroll() {
  if (rafCb) gsap.ticker.remove(rafCb);
  lenis?.destroy();
  lenis = null;
  rafCb = null;
}

export function lockScroll(locked: boolean) {
  document.body.classList.toggle("is-locked", locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function scrollToId(id: string, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.5 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export const getLenis = () => lenis;
