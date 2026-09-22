"use client";

import type { Metadata } from "next";
import { motion } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import ParallaxTile from "@/components/motion/ParallaxTile";
import { Kicker } from "@/components/ui/Elements";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/*
 * NOTE:
 * Next.js metadata normally belongs in a server component.
 * Since this page uses "use client", move metadata to a separate
 * layout.tsx/page wrapper if Next.js gives you a metadata error.
 */

const galleryItems = [
  {
    id: 1,
    title: "Opening Ceremony",
    year: "2025",
    aspect: "landscape",
    category: "ORIGIN",
  },
  {
    id: 2,
    title: "Hackathon Finals",
    year: "2025",
    aspect: "portrait",
    category: "BUILD",
  },
  {
    id: 3,
    title: "Cultural Night",
    year: "2025",
    aspect: "landscape",
    category: "CULTURE",
  },
  {
    id: 4,
    title: "Coding Arena",
    year: "2025",
    aspect: "square",
    category: "TECH",
  },
  {
    id: 5,
    title: "Dance Battle",
    year: "2024",
    aspect: "portrait",
    category: "ENERGY",
  },
  {
    id: 6,
    title: "Main Stage",
    year: "2024",
    aspect: "landscape",
    category: "CORE",
  },
  {
    id: 7,
    title: "Workshop Sessions",
    year: "2024",
    aspect: "square",
    category: "LAB",
  },
  {
    id: 8,
    title: "Award Ceremony",
    year: "2024",
    aspect: "landscape",
    category: "VICTORY",
  },
  {
    id: 9,
    title: "Campus Vibes",
    year: "2025",
    aspect: "portrait",
    category: "ARCHIVE",
  },
  {
    id: 10,
    title: "Tech Expo",
    year: "2025",
    aspect: "square",
    category: "TECH",
  },
  {
    id: 11,
    title: "Battle of Bands",
    year: "2024",
    aspect: "landscape",
    category: "SONIC",
  },
  {
    id: 12,
    title: "Closing Ceremony",
    year: "2025",
    aspect: "landscape",
    category: "ENDPOINT",
  },
];

const gradients = [
  "from-[#162d20] via-[#08130e] to-[#020504]",
  "from-[#123328] via-[#071711] to-[#020504]",
  "from-[#173b29] via-[#091b12] to-[#020504]",
  "from-[#0c3024] via-[#061812] to-[#020504]",
];

export default function GalleryPage() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#020504] pt-[92px] text-paper">

        {/* ============================================================
            BACKGROUND SYSTEM
        ============================================================ */}

        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          {/* central archive glow */}
          <motion.div
            className="absolute left-1/2 top-[18%] h-[600px] w-[600px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(200,255,66,.055), rgba(0,220,255,.018) 38%, transparent 70%)",
              filter: "blur(30px)",
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.08, 1],
                    opacity: [0.6, 0.9, 0.6],
                  }
            }
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* technical grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />

          {/* vertical scan */}
          {!reduceMotion && (
            <motion.div
              className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-green/20 to-transparent"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </div>

        <section className="py-20 md:py-32">
          <div className="mx-auto w-[min(1200px,calc(100%-32px))] md:w-[min(1200px,calc(100%-64px))]">

            {/* ========================================================
                HEADER
            ======================================================== */}

            <AnimatedSection>
              <div className="relative overflow-hidden border-b border-white/10 pb-8">

                {/* top system bar */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green shadow-[0_0_10px_rgba(200,255,66,.9)]" />
                    </span>

                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-green">
                      Archive Network Online
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wider text-muted">
                    <span>VYUHAM'26</span>
                    <span className="text-white/20">/</span>
                    <span>MEMORY NODE</span>
                    <span className="text-white/20">/</span>
                    <span className="text-green">ACTIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-end">

                  <div>
                    <Kicker>
                      <span className="signal-dot" />
                      Multiverse Archive
                    </Kicker>

                    <h1 className="mt-5 max-w-4xl font-display text-[clamp(52px,8vw,108px)] font-semibold leading-[0.82] tracking-[-0.04em]">
                      THE{" "}
                      <em className="not-italic text-green [text-shadow:0_0_35px_rgba(200,255,66,.18)]">
                        GALLERY.
                      </em>
                    </h1>

                    <p className="mt-7 max-w-xl text-sm leading-7 text-muted">
                      Fragments of previous VYUHAM realities. Every frame
                      records a moment, a collision of ideas, and another
                      chapter in the archive.
                    </p>
                  </div>

                  {/* archive indicator */}
                  <div className="relative min-w-[180px] overflow-hidden rounded border border-green/20 bg-green/[0.025] p-5">

                    <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-green/50" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-green/20" />

                    <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                      Archive Status
                    </div>

                    <div className="mt-2 font-display text-3xl font-semibold text-green">
                      ONLINE
                    </div>

                    <div className="mt-3 font-mono text-[8px] text-muted">
                      12 MEMORY FRAGMENTS
                    </div>
                  </div>
                </div>

                {/* decorative data */}
                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                  <span>
                    NODE <b className="text-paper">ARCH-01</b>
                  </span>

                  <span>
                    YEAR RANGE <b className="text-paper">2024—2025</b>
                  </span>

                  <span>
                    STATUS <b className="text-green">SYNCED</b>
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                FEATURED ARCHIVE
            ======================================================== */}

            <AnimatedSection delay={0.08}>
              <div className="relative mt-10 overflow-hidden rounded border border-white/10 bg-[#070a0b]">

                <div className="absolute left-0 top-0 z-20 h-10 w-10 border-l border-t border-green/50" />
                <div className="absolute right-0 top-0 z-20 h-10 w-10 border-r border-t border-green/20" />
                <div className="absolute bottom-0 left-0 z-20 h-10 w-10 border-b border-l border-green/20" />
                <div className="absolute bottom-0 right-0 z-20 h-10 w-10 border-b border-r border-green/20" />

                <div className="grid min-h-[320px] grid-cols-1 lg:grid-cols-[1.5fr_0.5fr]">

                  {/* image / visual */}
                  <div className="group relative min-h-[320px] overflow-hidden">

                    <div className="absolute inset-0 bg-gradient-to-br from-[#193d27] via-[#08150f] to-[#020504]" />

                    {/* animated glow */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(200,255,66,.14), transparent 70%)",
                      }}
                      animate={
                        reduceMotion
                          ? undefined
                          : {
                              scale: [1, 1.25, 1],
                              opacity: [0.4, 0.8, 0.4],
                            }
                      }
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* fake archive geometry */}
                    <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-green/20">
                      <div className="absolute inset-4 border border-green/10" />
                    </div>

                    {/* grid */}
                    <div className="absolute inset-0 grid-bg opacity-30" />

                    {/* scan */}
                    {!reduceMotion && (
                      <motion.div
                        className="absolute left-0 h-px w-full bg-green/30"
                        initial={{ top: "10%" }}
                        animate={{ top: "90%" }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}

                    <div className="absolute left-5 top-5 font-mono text-[8px] tracking-[0.2em] text-green">
                      FEATURED MEMORY / 001
                    </div>

                    <div className="absolute bottom-5 left-5">
                      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-green">
                        VYUHAM 2025
                      </div>

                      <div className="mt-1 font-display text-2xl font-semibold">
                        Opening Ceremony
                      </div>
                    </div>
                  </div>

                  {/* information */}
                  <div className="border-t border-white/10 p-6 lg:border-l lg:border-t-0 md:p-8">

                    <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                      Memory Fragment
                    </div>

                    <div className="mt-4 font-display text-5xl font-semibold text-green">
                      001
                    </div>

                    <p className="mt-4 text-xs leading-6 text-muted">
                      The first signal. The moment the campus transformed
                      into a convergence point of technology, culture and
                      imagination.
                    </p>

                    <div className="mt-8 space-y-3 border-t border-white/10 pt-5 font-mono text-[9px]">
                      <div className="flex justify-between">
                        <span className="text-muted">YEAR</span>
                        <span>2025</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted">TYPE</span>
                        <span>EVENT</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted">STATUS</span>
                        <span className="text-green">ARCHIVED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                ARCHIVE GRID HEADER
            ======================================================== */}

            <AnimatedSection delay={0.12}>
              <div className="mt-16 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">

                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-green">
                    Memory Database
                  </div>

                  <h2 className="mt-2 font-display text-2xl font-semibold">
                    ARCHIVED MOMENTS
                  </h2>
                </div>

                <div className="font-mono text-[9px] text-muted">
                  <span className="text-green">12</span> FRAGMENTS FOUND
                </div>
              </div>
            </AnimatedSection>

            {/* ========================================================
                MASONRY ARCHIVE
            ======================================================== */}

            <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">

              {galleryItems.map((item, i) => {
                const isPortrait = item.aspect === "portrait";
                const isSquare = item.aspect === "square";

                return (
                  <ParallaxTile
                    key={item.id}
                    className="mb-4 break-inside-avoid"
                    depth={i % 2 === 0 ? 18 : 12}
                    delay={i * 0.035}
                  >
                    <motion.div
                      whileHover={
                        reduceMotion
                          ? undefined
                          : {
                              y: -4,
                            }
                      }
                      className={`group relative overflow-hidden rounded border border-white/10 bg-[#070a0b] transition-all duration-500 hover:border-green/40 hover:shadow-[0_0_35px_rgba(200,255,66,.08)] ${
                        isPortrait
                          ? "aspect-[3/4]"
                          : isSquare
                            ? "aspect-square"
                            : "aspect-video"
                      }`}
                    >
                      {/* background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          gradients[i % gradients.length]
                        }`}
                      />

                      {/* central glow */}
                      <div
                        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-70"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(200,255,66,.22), transparent 70%)",
                        }}
                      />

                      {/* grid */}
                      <div className="absolute inset-0 grid-bg opacity-20 transition-opacity duration-500 group-hover:opacity-35" />

                      {/* abstract frame */}
                      <div className="absolute inset-[12%] rotate-45 border border-green/10 transition-transform duration-700 group-hover:rotate-[55deg] group-hover:scale-110" />

                      {/* scan */}
                      {!reduceMotion && (
                        <motion.div
                          className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-green/30 to-transparent opacity-0 group-hover:opacity-100"
                          initial={{ top: "0%" }}
                          animate={{ top: "100%" }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      )}

                      {/* archive number */}
                      <div className="absolute right-3 top-3 z-10">
                        <span className="rounded border border-white/10 bg-black/30 px-2 py-1 font-mono text-[8px] tracking-[0.15em] text-white/40 backdrop-blur-sm">
                          {String(item.id).padStart(3, "0")}
                        </span>
                      </div>

                      {/* category */}
                      <div className="absolute left-3 top-3 z-10">
                        <span className="font-mono text-[7px] tracking-[0.2em] text-green/60">
                          {item.category}
                        </span>
                      </div>

                      {/* hover information */}
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent p-5 opacity-0 transition-all duration-400 group-hover:opacity-100">

                        <div className="translate-y-3 transition-transform duration-500 group-hover:translate-y-0">
                          <div className="font-mono text-[8px] tracking-[0.2em] text-green">
                            VYUHAM {item.year}
                          </div>

                          <div className="mt-1 font-display text-lg font-semibold">
                            {item.title}
                          </div>

                          <div className="mt-3 flex items-center gap-2 font-mono text-[8px] text-muted">
                            <span className="h-1 w-1 rounded-full bg-green" />
                            MEMORY FRAGMENT ARCHIVED
                          </div>
                        </div>
                      </div>

                      {/* bottom status */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[7px] tracking-[0.15em] text-white/25 transition-opacity duration-300 group-hover:opacity-0">
                        <span>ARCHIVE</span>
                        <span>{item.year}</span>
                      </div>

                      {/* corner frame */}
                      <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-green/10 transition-colors duration-300 group-hover:border-green/40" />
                    </motion.div>
                  </ParallaxTile>
                );
              })}
            </div>

            {/* ========================================================
                END ARCHIVE
            ======================================================== */}

            <AnimatedSection delay={0.3}>
              <div className="mt-16 border-t border-white/10 pt-6">
                <div className="flex flex-col justify-between gap-4 font-mono text-[8px] uppercase tracking-[0.2em] text-muted sm:flex-row">

                  <span>
                    END OF ARCHIVE
                  </span>

                  <span>
                    <span className="text-green">●</span>{" "}
                    ALL MEMORY FRAGMENTS SYNCHRONIZED
                  </span>

                  <span>
                    VYUHAM'26
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
