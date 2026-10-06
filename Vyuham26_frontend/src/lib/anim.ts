import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ ignoreMobileResize: true });

gsap.defaults({ ease: "power3.out" });

export { gsap, ScrollTrigger };

export const CINE = "expo.out";

/** Split a string into per-character spans for masked reveals. */
export function splitChars(text: string) {
  return text.split("").map((c) => (c === " " ? "\u00A0" : c));
}

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isSmall = () => typeof window !== "undefined" && window.innerWidth < 768;

/** Cheap clamp + lerp helpers used by canvas scenes. */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
