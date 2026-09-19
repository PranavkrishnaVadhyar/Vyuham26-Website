"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface TerminalRevealProps {
  text: string;
  className?: string;
  speed?: number;
  startInView?: boolean;
  onComplete?: () => void;
}

export default function TerminalReveal({
  text,
  className = "",
  speed = 18,
  startInView = false,
  onComplete,
}: TerminalRevealProps) {
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const startedRef = useRef(false);
  const [visible, setVisible] = useState("");

  const shouldStart = startInView ? inView : true;

  useEffect(() => {
    if (reduceMotion) {
      onComplete?.();
      return;
    }
    if (!shouldStart || startedRef.current) return;
    startedRef.current = true;
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setVisible(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [shouldStart, reduceMotion, text, speed, onComplete]);

  return (
    <span ref={ref} className={className}>
      {reduceMotion ? text : visible}
      {!reduceMotion && visible.length < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.12em] animate-pulse bg-green/80" />
      )}
    </span>
  );
}
