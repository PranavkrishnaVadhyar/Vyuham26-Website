"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const stations = [
  { id: "home", number: "01", label: "Home" },
  { id: "about", number: "02", label: "Brief" },
  { id: "events", number: "03", label: "Arena" },
  { id: "schedule", number: "04", label: "Schedule" },
  { id: "register", number: "05", label: "Enter" },
];

export default function ExperienceRail() {
  const [active, setActive] = useState("home");
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActive(current.target.id);
      },
      { rootMargin: "-35% 0px -45%", threshold: [0.15, 0.4, 0.7] }
    );
    stations.forEach(({ id }) => {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="experience-rail fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 xl:block" aria-label="Experience sections">
      <ol className="m-0 list-none p-0">
        {stations.map((station) => {
          const selected = station.id === active;
          return (
            <li key={station.id} className="relative">
              <a
                href={`#${station.id}`}
                aria-current={selected ? "location" : undefined}
                className={`group flex items-center gap-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] no-underline transition-colors ${selected ? "text-green" : "text-muted hover:text-paper"}`}
              >
                <span className="relative grid h-4 w-4 place-items-center">
                  <span className={`h-1.5 w-1.5 rounded-full ${selected ? "bg-green" : "bg-muted/60"}`} />
                  {selected && !reduceMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-green/70"
                      initial={{ opacity: 0.8, scale: 0.6 }}
                      animate={{ opacity: 0, scale: 1.8 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </span>
                <span className="w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:w-28 group-hover:opacity-100">
                  {station.number} / {station.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
