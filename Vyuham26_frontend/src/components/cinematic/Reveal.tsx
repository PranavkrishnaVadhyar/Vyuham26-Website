import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { useReducedMotion } from "@/lib/hooks";

function useSeen<T extends HTMLElement>(threshold = 0.2, rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);
  return { ref, seen };
}

/* ---------------- masked line reveal ---------------- */
export function MaskReveal({
  children,
  delay = 0,
  className,
  as: As = "span",
  duration = 1.1,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  duration?: number;
}) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  const reduced = useReducedMotion();
  return (
    <span ref={ref} className="block overflow-hidden">
      <As
        className={cn("block will-change-transform", className)}
        style={
          {
            transform: seen || reduced ? "translate3d(0,0,0)" : "translate3d(0,110%,0)",
            opacity: seen || reduced ? 1 : 0,
            transition: `transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, opacity ${duration * 0.7}s ease ${delay}s`,
          } as CSSProperties
        }
      >
        {children}
      </As>
    </span>
  );
}

/* ---------------- blur-to-focus fade ---------------- */
export function FocusIn({
  children,
  delay = 0,
  className,
  y = 26,
  blur = 12,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  blur?: number;
}) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  const reduced = useReducedMotion();
  const on = seen || reduced;
  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        transform: on ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
        filter: on ? "blur(0px)" : `blur(${blur}px)`,
        opacity: on ? 1 : 0,
        transition: `transform 1.25s cubic-bezier(0.16,1,0.3,1) ${delay}s, filter 1.1s ease ${delay}s, opacity 1s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- per-character reveal ---------------- */
export function CharReveal({
  text,
  className,
  delay = 0,
  stagger = 0.028,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const { ref, seen } = useSeen<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const on = seen || reduced;

  // Split by words so that words stay intact and never break across lines mid-word
  const words = text.split(" ");
  let charCounter = 0;

  return (
    <span ref={ref} className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, wIdx) => {
        const wordOffset = charCounter;
        charCounter += word.length + 1;

        return (
          <span key={`w-${wIdx}`} className="inline-block">
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((ch, cIdx) => {
                const i = wordOffset + cIdx;
                return (
                  <span
                    key={`${ch}-${i}`}
                    aria-hidden
                    className="inline-block will-change-transform"
                    style={{
                      transform: on ? "translate3d(0,0,0)" : "translate3d(0,0.5em,0)",
                      opacity: on ? 1 : 0,
                      filter: on ? "blur(0)" : "blur(6px)",
                      transition: `transform .95s cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}s, opacity .8s ease ${
                        delay + i * stagger
                      }s, filter .8s ease ${delay + i * stagger}s`,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
            {wIdx < words.length - 1 && (
              <span
                aria-hidden
                className="inline-block"
                style={{
                  transform: on ? "translate3d(0,0,0)" : "translate3d(0,0.5em,0)",
                  opacity: on ? 1 : 0,
                  transition: `opacity .8s ease ${delay + (wordOffset + word.length) * stagger}s`,
                }}
              >
                &nbsp;
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/* ---------------- tracking-in headline ---------------- */
export function TrackIn({
  children,
  className,
  delay = 0,
  from = "0.6em",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: string;
}) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  const reduced = useReducedMotion();
  const on = seen || reduced;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        letterSpacing: on ? undefined : from,
        opacity: on ? 1 : 0,
        filter: on ? "blur(0)" : "blur(10px)",
        transition: `letter-spacing 1.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, opacity 1.2s ease ${delay}s, filter 1.3s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
