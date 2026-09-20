"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";
import { events } from "@/data/events";
import Link from "next/link";

const days = [
  {
    dayNum: 1,
    label: "DAY 01",
    date: "30 OCT 2026",
    name: "Ignition",
    code: "TEMPORAL PHASE // 01",
    description: "The signal activates.",
  },
  {
    dayNum: 2,
    label: "DAY 02",
    date: "31 OCT 2026",
    name: "Convergence",
    code: "TEMPORAL PHASE // 02",
    description: "Dimensions converge.",
  },
  {
    dayNum: 3,
    label: "DAY 03",
    date: "01 NOV 2026",
    name: "Aftershock",
    code: "TEMPORAL PHASE // 03",
    description: "The future leaves its mark.",
  },
];

export default function ScheduleSection() {
  return (
    <PageEntranceGate phase="schedule">
      <section
        className="relative overflow-hidden pb-24 pt-10 md:pb-36"
        id="schedule"
      >
        {/* Background temporal grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(120,255,0,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(120,255,0,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">

          {/* HEADER */}
          <AnimatedSection>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

              <div>
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />

                  <Kicker>03 / Temporal transmission</Kicker>
                </div>

                <h2 className="mt-4 font-display text-[clamp(45px,6vw,82px)] font-semibold leading-[0.87]">
                  THE <em>FUTURE</em>
                  <br />
                  AWAITS.
                </h2>

                <p className="mt-5 max-w-md font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted">
                  THREE PHASES.
                  <br />
                  ONE CONTINUOUS SIGNAL.
                </p>
              </div>

              <div className="md:text-right">
                <div className="mb-3 font-mono text-[9px] tracking-[0.22em] text-muted">
                  TRANSMISSION STATUS
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />

                  <span className="font-mono text-xs tracking-widest text-green">
                    SIGNAL ACTIVE
                  </span>
                </div>

                <Button href="/schedule" variant="primary" className="mt-5">
                  View full schedule
                  <span className="ml-2 text-ink" aria-hidden="true">
                    ↗
                  </span>
                </Button>
              </div>

            </div>
          </AnimatedSection>

          {/* TEMPORAL AXIS */}
          <AnimatedSection delay={0.15}>
            <div className="relative mt-20">

              {/* axis labels */}
              <div className="mb-5 flex justify-between font-mono text-[8px] tracking-[0.2em] text-muted">
                <span>PAST</span>

                <span className="text-green/60">
                  TEMPORAL AXIS // 2026
                </span>

                <span>FUTURE</span>
              </div>

              {/* main line */}
              <div className="absolute left-0 right-0 top-13 hidden h-px bg-line md:block">

                {/* glowing progress */}
                <motion.div
                  className="absolute left-0 top-0 h-px w-full origin-left bg-green"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />

                {/* scanning light */}
                <motion.div
                  className="absolute top-1/2 h-8 w-20 -translate-y-1/2 bg-green/10 blur-xl"
                  animate={{ x: ["0%", "100%"] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              {/* DAYS */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">

                {days.map((day, index) => {
                  const count = events.filter(
                    (event) => event.day === day.dayNum
                  ).length;

                  return (
                    <motion.div
                      key={day.label}
                      initial={{ opacity: 0, y: 35 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        duration: 0.7,
                        delay: index * 0.15,
                      }}
                      className="relative"
                    >

                      {/* timeline node */}
                      <div className="relative z-10 mb-7 hidden md:flex md:justify-center">

                        <motion.div
                          className="relative flex h-7 w-7 items-center justify-center rounded-full border border-green/50 bg-ink"
                          whileHover={{
                            scale: 1.2,
                            boxShadow: "0 0 30px rgba(120,255,0,0.35)",
                          }}
                        >
                          <span className="h-2 w-2 rounded-full bg-green shadow-[0_0_12px_rgba(120,255,0,0.9)]" />

                          <span className="absolute -inset-1.75 rounded-full border border-green/10" />
                        </motion.div>

                      </div>

                      {/* CARD */}
                      <Link
                        href={`/schedule?day=${day.dayNum}`}
                        className="
                          group
                          relative
                          block
                          overflow-hidden
                          rounded-sm
                          border
                          border-line
                          bg-ink/40
                          p-6
                          no-underline
                          backdrop-blur-sm
                          transition-all
                          duration-500
                          hover:border-green/50
                          hover:bg-green/2.5
                        "
                      >

                        {/* scan line */}
                        <motion.div
                          className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-green/70 opacity-0 group-hover:opacity-100"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />

                        {/* corner marker */}
                        <div className="absolute right-4 top-4 font-mono text-[8px] text-green/30">
                          0{day.dayNum}
                        </div>

                        {/* top information */}
                        <div className="flex items-center justify-between">

                          <span className="font-mono text-[9px] tracking-[0.2em] text-green">
                            {day.label}
                          </span>

                          <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[8px] tracking-wider text-muted">
                            {count}{" "}
                            {count === 1 ? "EVENT" : "EVENTS"}
                          </span>

                        </div>

                        {/* phase code */}
                        <div className="mt-8 font-mono text-[8px] tracking-[0.18em] text-muted">
                          {day.code}
                        </div>

                        {/* date */}
                        <strong className="mt-3 block font-display text-2xl font-semibold text-paper transition-colors duration-300 group-hover:text-green md:text-3xl">
                          {day.date}
                        </strong>

                        {/* phase name */}
                        <div className="mt-2 flex items-center gap-3">

                          <span className="h-px w-6 bg-green/40 transition-all duration-300 group-hover:w-10" />

                          <span className="font-display text-sm uppercase tracking-[0.12em] text-paper/80">
                            {day.name}
                          </span>

                        </div>

                        {/* description */}
                        <p className="mt-4 font-mono text-[9px] leading-relaxed tracking-[0.08em] text-muted">
                          {day.description}
                        </p>

                        {/* footer */}
                        <div className="mt-8 flex items-center justify-between border-t border-line pt-4">

                          <span className="font-mono text-[8px] tracking-[0.15em] text-muted">
                            EVENT SIGNAL
                          </span>

                          <span className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-green">
                            ENTER
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </span>

                        </div>

                        {/* hover glow */}
                        <div className="pointer-events-none absolute -bottom-20 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-green/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                      </Link>

                    </motion.div>
                  );
                })}

              </div>
            </div>
          </AnimatedSection>

          {/* BOTTOM TEMPORAL STATUS */}
          <AnimatedSection delay={0.4}>
            <div className="mt-10 flex flex-col gap-3 border-t border-line pt-5 font-mono text-[8px] tracking-[0.18em] text-muted md:flex-row md:items-center md:justify-between">

              <span>
                TEMPORAL INDEX // VYUHAM'26
              </span>

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-green/40" />
                <span className="text-green/70">
                  THE FUTURE AWAITS
                </span>
              </div>

              <span>
                STATUS // APPROACHING
              </span>

            </div>
          </AnimatedSection>

        </div>
      </section>
    </PageEntranceGate>
  );
}