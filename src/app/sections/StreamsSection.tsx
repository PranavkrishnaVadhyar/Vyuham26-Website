"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

const streams = [
  {
    number: "01",
    glyph: "⌁",
    title: "Technology",
    description: "Hackathons, coding, CTF and innovation.",
    slug: "tech",
  },
  {
    number: "02",
    glyph: "◈",
    title: "Culture",
    description: "Stage, visual arts, words and rhythm.",
    slug: "culture",
  },
  {
    number: "03",
    glyph: "✦",
    title: "Gaming",
    description: "Esports, strategy and zero-sum glory.",
    slug: "gaming",
  },
  {
    number: "04",
    glyph: "⊹",
    title: "Impact",
    description: "Ideas designed to move the world forward.",
    slug: "impact",
  },
];

export default function StreamsSection() {
  return (
    <PageEntranceGate phase="streams">
      <section className="py-24 md:py-36" id="events">
      <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Kicker>02 / Choose your protocol</Kicker>
              <h2 className="mt-3 font-display text-[clamp(45px,6vw,82px)] font-semibold leading-[0.87]">
                ENTER THE
                <br />
                <em>ARENA.</em>
              </h2>
            </div>
            <p className="text-right text-sm leading-[1.8] text-muted max-md:hidden">
              Four streams. One charged-up campus.
              <br />
              Select your next challenge.
            </p>
          </div>
        </AnimatedSection>

        {/* Stream cards grid */}
        <div className="mt-14 grid grid-cols-2 border border-line md:grid-cols-4">
          {streams.map((stream, i) => (
            <motion.div
              key={stream.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/events?stream=${stream.slug}`}
                className="group relative block min-h-[245px] overflow-hidden border-r border-b border-line p-5 text-paper no-underline transition-all duration-300 hover:-translate-y-2 hover:bg-ink-mid md:min-h-[330px]"
              >
                {/* Hover radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(200,255,66,0.2),transparent_48%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative font-mono text-[10px] text-muted">
                  {stream.number}
                </span>

                <div className="relative mt-8 font-display text-[52px] leading-none text-green md:mt-11 md:text-[80px]">
                  {stream.glyph}
                </div>

                <h3 className="relative mt-6 font-display text-lg font-semibold md:mt-9 md:text-[25px]">
                  {stream.title}
                </h3>

                <p className="relative mt-1 text-[10px] leading-[1.7] text-muted md:text-xs">
                  {stream.description}
                </p>

                <span
                  className="absolute right-5 bottom-4 text-xl text-green"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </PageEntranceGate>
  );
}
