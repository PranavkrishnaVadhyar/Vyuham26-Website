"use client";

import { useEffect, useState, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import GreenAnime from "@/components/motion/Greenanime2";

let hasCompletedIntroInThisPageLoad = false;

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
  }, []);

  const visible = mounted && !dismissed && !reduceMotion;

  if (!visible) return null;

  return <GreenAnime onComplete={dismiss} />;
}