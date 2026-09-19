"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import AnimatedSection from "@/components/motion/AnimatedSection";
import CountdownTimer from "@/components/ui/CountdownTimer";
import SignalRing from "@/components/motion/SignalRing";
import { Button, TextLink, Kicker } from "@/components/ui/Elements";
import { motion } from "framer-motion";
import { PageEntranceGate } from "@/components/motion/PageEntrance";

const titleLines = [
  { text: "THE", em: false },
  { text: "FUTURE", em: true },
  { text: "AWAITS.", em: false },
];

const ParticleField = dynamic(
  () => import("@/components/motion/ParticleField"),
  { ssr: false }
);

const Portal = dynamic(() => import("@/components/motion/Portal"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[400px] w-[400px] place-items-center">
      <div className="h-48 w-48 rounded-full bg-gradient-to-br from-emerald/20 to-green/10 blur-2xl" />
    </div>
  ),
});

export default function HeroSection() {
  return (
    <PageEntranceGate phase="hero">
      <section
        className="scan-lines relative min-h-screen overflow-hidden pt-[92px]"
        id="home"
      >
      {/* Particle background */}
      <ParticleField className="z-0" />

      <div className="relative z-10 mx-auto grid w-[min(1200px,calc(100%-48px))] gap-8 pt-12 md:w-[min(1200px,calc(100%-64px))] md:grid-cols-2 md:pt-[92px]">
        {/* Left: Copy */}
        <AnimatedSection className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Vyuham '26 Official Emblem"
              width={72}
              height={72}
              priority
              loading="eager"
              className="h-16 w-16 object-contain drop-shadow-[0_0_24px_rgba(200,255,66,0.6)]"
            />
          </div>

          <Kicker>
            <span className="signal-dot" />
            Digital University Kerala presents
          </Kicker>

          <motion.h1
            className="mt-4 font-display text-[clamp(62px,9vw,135px)] font-semibold leading-[0.79]"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
            }}
          >
            {titleLines.map((line) => (
              <motion.span
                key={line.text}
                className="block"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: "55%",
                  },
                  visible: {
                    opacity: 1,
                    y: "0%",
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                {line.em ? <em>{line.text}</em> : line.text}
              </motion.span>
            ))}
          </motion.h1>

          <p className="mt-9 w-[min(360px,90%)] text-sm leading-[1.7] text-muted">
            A national-level techno-cultural convergence for the curious, the
            bold and the people building what is next.
          </p>

          <div className="mt-7 flex items-center gap-6">
            <Button href="/events">
              Explore events <span className="ml-2 text-base">→</span>
            </Button>
            <TextLink href="/about">Enter the dimension</TextLink>
          </div>
        </AnimatedSection>

        {/* Right: Portal */}
        <AnimatedSection
          delay={0.3}
          className="pointer-events-none relative hidden justify-end md:flex"
        >
          <Portal size="lg" />
        </AnimatedSection>

        {/* Hero meta bar */}
        <AnimatedSection
          delay={0.5}
          className="col-span-full mt-8 grid grid-cols-2 self-end border-t border-line md:grid-cols-[1fr_1fr_1.5fr]"
        >
          <div className="border-r border-line px-0 py-5 pr-5">
            <span className="block font-mono text-[9px] tracking-[0.14em] text-muted">
              DATE
            </span>
            <strong className="mt-2 block font-display text-base tracking-[0.04em]">
              OCT 30 — NOV 01
            </strong>
            <small className="mt-1 block font-mono text-[9px] tracking-[0.07em] text-muted">
              2026
            </small>
          </div>

          <div className="border-r border-line px-5 py-5 max-md:border-r-0">
            <span className="block font-mono text-[9px] tracking-[0.14em] text-muted">
              LOCATION
            </span>
            <strong className="mt-2 block font-display text-base tracking-[0.04em]">
              TECHNOCITY
            </strong>
            <small className="mt-1 block font-mono text-[9px] tracking-[0.07em] text-muted">
              Thiruvananthapuram
            </small>
          </div>

          <div className="col-span-full border-t border-line px-0 py-5 md:col-span-1 md:border-t-0 md:px-5">
            <span className="block font-mono text-[9px] tracking-[0.14em] text-muted">
              EVENT SIGNAL IN
            </span>
            <div className="relative mt-2">
              <SignalRing
                count={2}
                size={72}
                duration={2.8}
                color="rgba(200,255,66,0.4)"
                className="left-[-42px] top-1/2 -translate-y-1/2"
              />
              <CountdownTimer targetDate="2026-10-30T09:00:00+05:30" />
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Mobile portal (smaller, translucent) */}
      <div className="pointer-events-none absolute top-[200px] -right-24 z-0 opacity-60 md:hidden">
        <Portal size="sm" />
      </div>
    </section>
    </PageEntranceGate>
  );
}
