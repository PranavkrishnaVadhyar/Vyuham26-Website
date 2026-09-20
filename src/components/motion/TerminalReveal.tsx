"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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
  const reduceMotion =
    usePrefersReducedMotion();

  const ref =
    useRef<HTMLSpanElement>(null);

  const inView =
    useInView(ref, {
      once: true,
      margin: "-40px",
    });

  const startedRef =
    useRef(false);

  const completedRef =
    useRef(false);

  const [visible, setVisible] =
    useState("");

  const shouldStart =
    startInView
      ? inView
      : true;

  useEffect(() => {
    /*
     * Reduced motion:
     * reveal everything immediately.
     */
    if (reduceMotion) {
      setVisible(text);

      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }

      return;
    }

    if (
      !shouldStart ||
      startedRef.current
    ) {
      return;
    }

    startedRef.current = true;

    let index = 0;

    /*
     * Keep the interval safely bounded.
     */
    const intervalSpeed =
      Math.max(8, speed);

    const timer =
      window.setInterval(() => {
        index += 1;

        setVisible(
          text.slice(0, index)
        );

        if (
          index >=
          text.length
        ) {
          window.clearInterval(
            timer
          );

          if (
            !completedRef.current
          ) {
            completedRef.current =
              true;

            onComplete?.();
          }
        }
      }, intervalSpeed);

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    shouldStart,
    reduceMotion,
    text,
    speed,
    onComplete,
  ]);

  const isComplete =
    visible.length >=
    text.length;

  return (
    <span
      ref={ref}
      className={`relative inline-block ${className}`}
    >
      {/* =====================================================
          TEXT
          ===================================================== */}

      <span>
        {reduceMotion
          ? text
          : visible}
      </span>

      {/* =====================================================
          TERMINAL CURSOR
          ===================================================== */}

      {!reduceMotion &&
        !isComplete && (
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-[0.9em] w-[0.42em] translate-y-[0.1em] bg-emerald-400 align-baseline shadow-[0_0_8px_rgba(52,211,153,0.45)]"
          >
            <span className="sr-only">
              typing
            </span>
          </span>
        )}

      {/* =====================================================
          COMPLETION FLASH
          ===================================================== */}

      {!reduceMotion &&
        isComplete && (
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-[0.65em] w-[0.18em] translate-y-[0.04em] bg-emerald-300 opacity-60"
          />
        )}
    </span>
  );
}