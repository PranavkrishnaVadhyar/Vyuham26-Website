"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

const days = [
  { label: "DAY 01", date: "30 OCT", name: "Ignition" },
  { label: "DAY 02", date: "31 OCT", name: "Convergence" },
  { label: "DAY 03", date: "01 NOV", name: "Aftershock" },
];

export default function ScheduleSection() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <PageEntranceGate phase="schedule">
      <section className="pb-24 md:pb-36" id="schedule">
      <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
        <AnimatedSection>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Kicker>03 / Transmission log</Kicker>
              <h2 className="mt-3 font-display text-[clamp(45px,6vw,82px)] font-semibold leading-[0.87]">
                THE <em>COUNT</em>
                <br />
                IS ON.
              </h2>
            </div>
            <Button href="/schedule" variant="outline">
              View full schedule{" "}
              <span className="ml-2 text-green" aria-hidden="true">
                ↗
              </span>
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <LayoutGroup>
            <div className="mt-10 grid grid-cols-1 border-t border-line md:grid-cols-3">
              {days.map((day, i) => (
                <button
                  key={day.label}
                  onClick={() => setActiveDay(i)}
                  className="relative cursor-pointer border-r border-line px-0 py-7 pr-5 text-left md:px-5 first:md:pl-0"
                  aria-pressed={activeDay === i}
                >
                  {activeDay === i && (
                    <motion.span
                      layoutId="home-day-indicator"
                      className="absolute top-[-2px] left-0 h-[3px] w-16 bg-green"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className="font-mono text-[10px] text-muted">
                    {day.label}
                  </span>
                  <strong className="mt-5 block font-display text-[21px] font-medium md:text-[30px]">
                    {day.date}
                  </strong>
                  <p className="mt-1 text-[13px] text-muted">{day.name}</p>
                  {activeDay === i && (
                    <motion.span
                      className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-green"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ACTIVE
                    </motion.span>
                  )}
                </button>
              ))}
            </div>
          </LayoutGroup>
        </AnimatedSection>
      </div>
    </section>
    </PageEntranceGate>
  );
}