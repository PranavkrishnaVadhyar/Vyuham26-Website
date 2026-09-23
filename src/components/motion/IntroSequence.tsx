"use client";

import { useEffect, useState, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import GreenAnime from "@/components/motion/Greenanime2";

export let hasCompletedIntroInThisPageLoad = false;

export default function IntroSequence() {
  const reduceMotion = usePrefersReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (hasCompletedIntroInThisPageLoad) {
      setDismissed(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    hasCompletedIntroInThisPageLoad = true;

    try {
      sessionStorage.setItem("vyuham-intro-dismissed", "1");
    } catch {
      // Ignore sessionStorage restrictions.
    }

    setDismissed(true);
    if (typeof document !== "undefined") {
      delete document.documentElement.dataset.introActive;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("vyuham:intro-complete"));
    }
  }, []);

  const visible = mounted && !dismissed && !reduceMotion;

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    if (visible) {
      document.documentElement.dataset.introActive = "true";
      window.dispatchEvent(new CustomEvent("vyuham:intro-start"));
    } else {
      delete document.documentElement.dataset.introActive;
      window.dispatchEvent(new CustomEvent("vyuham:intro-complete"));
    }

    return () => {
      delete document.documentElement.dataset.introActive;
      window.dispatchEvent(new CustomEvent("vyuham:intro-complete"));
    };
  }, [visible]);

  if (!visible) return null;

  return <GreenAnime onComplete={dismiss} />;
}