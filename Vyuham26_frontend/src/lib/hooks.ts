import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () => useMediaQuery("(max-width: 1023px)");
export const useIsCoarse = () => useMediaQuery("(pointer: coarse)");

/* ------------------------------------------------------------------ */
export function useHashRoute() {
  const read = () => (typeof window === "undefined" ? "/" : window.location.hash.replace(/^#/, "") || "/");
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);
  return { route, navigate };
}

/* ------------------------------------------------------------------ */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota / private mode — silently continue */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

/* ------------------------------------------------------------------ */
export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function useCountdown(targetISO: string): TimeLeft {
  const target = new Date(targetISO).getTime();
  const compute = useCallback((): TimeLeft => {
    const total = Math.max(0, target - Date.now());
    return {
      total,
      days: Math.floor(total / 86400000),
      hours: Math.floor((total / 3600000) % 24),
      minutes: Math.floor((total / 60000) % 60),
      seconds: Math.floor((total / 1000) % 60),
    };
  }, [target]);

  const [left, setLeft] = useState(compute);
  useEffect(() => {
    const id = window.setInterval(() => setLeft(compute()), 1000);
    return () => window.clearInterval(id);
  }, [compute]);
  return left;
}

/* ------------------------------------------------------------------ */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit & { once?: boolean }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options?.once !== false) io.disconnect();
        } else if (options?.once === false) {
          setInView(false);
        }
      },
      { rootMargin: "0px 0px 40px 0px", threshold: 0.05, ...options },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [options]);
  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/** Mouse position normalised to -1..1, eased. Desktop only. */
export function usePointerParallax(enabled = true) {
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      pos.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pos.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    let raf = 0;
    const loop = () => {
      pos.current.x += (pos.current.tx - pos.current.x) * 0.06;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.06;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return pos;
}
