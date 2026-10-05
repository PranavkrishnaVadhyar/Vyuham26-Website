"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import Logo from "@/components/ui/Logo";

interface RegistrationComingSoonProps {
  title?: string;
  subtitle?: string;
  withLayout?: boolean;
}

export default function RegistrationComingSoon({
  title = "REGISTRATION COMING SOON",
  subtitle = "Event registrations, operative logins, and mission loadout configuration for VYUHAM'26 are undergoing final calibration. Full portal access will launch shortly.",
  withLayout = true,
}: RegistrationComingSoonProps) {
  const content = (
    <main className="relative min-h-[85vh] flex-1 overflow-hidden bg-[#030705] pt-24 pb-16 text-paper flex items-center justify-center">
      {/* Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-[10%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/[0.04] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(46,229,157,.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(46,229,157,.6) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Laser scanline */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
          animate={{
            top: ["0%", "100%"],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-[min(760px,calc(100%-40px))] py-12">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(24,196,124,0.22)] bg-[rgba(6,18,13,0.7)] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(24,196,124,0.08)] backdrop-blur-2xl md:p-12">
            {/* Cyber Corner HUD Brackets */}
            <div className="pointer-events-none absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-emerald-400/60" />
            <div className="pointer-events-none absolute right-0 top-0 h-10 w-10 border-r-2 border-t-2 border-emerald-400/60" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-emerald-400/40" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-emerald-400/40" />

            {/* Glowing Logo */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
              <Logo
                size="md"
                className="h-16 w-16 object-contain drop-shadow-[0_0_24px_rgba(46,229,157,0.6)]"
              />
            </div>

            {/* Tactical Sub-label */}
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-950/40 px-3.5 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              TRANSMISSION LOCKED // ACCESS STANDBY
            </div>

            <div className="mt-2">
              <Kicker>System Calibration</Kicker>
            </div>

            <h1 className="mt-4 font-display text-[clamp(32px,6vw,56px)] font-bold leading-[0.95] tracking-tight text-[#f0f9f5]">
              {title}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#8dafa1] md:text-base">
              {subtitle}
            </p>

            {/* Mission Telemetry Grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 border-y border-white/[0.08] py-5 font-mono text-[9px] uppercase tracking-[0.16em] sm:grid-cols-4">
              <div className="text-left">
                <span className="block text-white/30 text-[8px]">PORTAL</span>
                <span className="mt-1 block font-bold text-amber-300">LOCKED</span>
              </div>
              <div className="text-left">
                <span className="block text-white/30 text-[8px]">DATES</span>
                <span className="mt-1 block font-bold text-[#d8f4e8]">30 OCT — 01 NOV</span>
              </div>
              <div className="text-left">
                <span className="block text-white/30 text-[8px]">LOCATION</span>
                <span className="mt-1 block font-bold text-[#d8f4e8]">TECHNOCITY</span>
              </div>
              <div className="text-left">
                <span className="block text-white/30 text-[8px]">EVENTS</span>
                <span className="mt-1 block font-bold text-emerald-400">48 LIVE ARENAS</span>
              </div>
            </div>

            {/* Public Navigation CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/events" variant="primary" className="w-full sm:w-auto justify-center">
                Explore All Events →
              </Button>
              <Button href="/schedule" variant="outline" className="w-full sm:w-auto justify-center">
                View 72-Hour Timeline
              </Button>
              <Button href="/" variant="outline" className="w-full sm:w-auto justify-center">
                Return to Home
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/5 pt-4 font-mono text-[8px] uppercase tracking-[0.2em] text-[#4f6f61]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PUBLIC SCHEDULE & FESTIVAL INFORMATION FULLY ACCESSIBLE
            </div>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );

  if (!withLayout) {
    return content;
  }

  return (
    <>
      <Navbar />
      {content}
      <Footer />
    </>
  );
}
