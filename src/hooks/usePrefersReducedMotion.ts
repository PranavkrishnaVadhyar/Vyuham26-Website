"use client";

import { useSyncExternalStore } from "react";

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", notify);
      return () => mediaQuery.removeEventListener("change", notify);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}
