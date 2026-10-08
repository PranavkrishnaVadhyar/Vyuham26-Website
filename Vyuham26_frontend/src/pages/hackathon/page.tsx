 "use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import SignalRing from "@/components/motion/SignalRing";
import { Kicker, Button } from "@/components/ui/Elements";

const milestones = [
  { id: "01", title: "Problem Statement Flag-Off", time: "30 OCT • 09:00 AM", status: "COMPLETE", description: "Agentic AI / Autonomous Systems brief revealed." },
  { id: "02", title: "Midnight Mentoring Round", time: "30 OCT • OVERNIGHT", status: "ACTIVE", description: "Midnight mentoring session & refreshments in Main Hall." },
  { id: "03", title: "Hackathon Demos & Judging", time: "31 OCT • 09:00 AM", status: "PENDING", description: "Prototype demonstrations and jury evaluation in Main Hall." },
  { id: "04", title: "Winners & Prize Distribution", time: "01 NOV • 01:00 PM", status: "LOCKED", description: "₹30,000 prize distribution at Main Hall." },
];

const telemetry = [
  ["BUILD CORE", "ONLINE", "green"],
  ["REPOSITORY", "LINKED", "green"],
  ["DEPLOYMENT", "STANDBY", "amber"],
  ["MENTOR NODE", "AVAILABLE", "cyan"],
];

function Corner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const classes = {
    tl: "left-0 top-0 border-l border-t",
    tr: "right-0 top-0 border-r border-t",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return <span className={`pointer-events-none absolute h-10 w-10 border-green/60 ${classes[position]}`} />;
}

function Reactor({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative h-[260px] w-[260px]">
      <div className="absolute inset-0 rounded-full border border-white/15" />
      <div className="absolute inset-4 rounded-full border border-green/20" />
      <div className="absolute inset-10 rounded-full border border-dashed border-cyan-300/25" />
      <div className="absolute inset-[58px] rounded-full border border-green/30" />
      <div className="absolute inset-[76px] rounded-full bg-green/[.035] shadow-[0_0_80px_rgba(46,229,157,.18)]" />
      <div className="absolute inset-[91px] rounded-full border border-green/30 bg-[#06100b]" />
      <div className="absolute inset-[105px] rounded-full bg-green shadow-[0_0_35px_rgba(46,229,157,.9)]" />

      {!reduceMotion && (
        <>
          <motion.div
            className="absolute inset-1 rounded-full border border-t-green border-r-transparent border-b-cyan-300/30 border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-7 rounded-full border border-t-transparent border-r-green/60 border-b-transparent border-l-cyan-300/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-16 rounded-full border border-dashed border-green/30"
            animate={{ rotate: 360, scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-green shadow-[0_0_12px_rgba(46,229,157,1)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0 130px" }}
          />
        </>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[7px] font-bold tracking-[.45em] text-green">CORE</span>
      </div>

      <div className="absolute left-1/2 top-[-18px] -translate-x-1/2 font-mono text-[7px] tracking-[.25em] text-muted">CORE_03</div>
      <div className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 font-mono text-[7px] tracking-[.2em] text-muted">STABLE // 98.7%</div>
      <div className="absolute left-[-32px] top-1/2 -translate-y-1/2 font-mono text-[7px] tracking-[.15em] text-green/60 [writing-mode:vertical-rl]">ENERGY FLOW ↑</div>
    </div>
  );
}

export default function HackathonHubPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mentorRequested, setMentorRequested] = useState(false);
  const [booted, setBooted] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 55, damping: 20 });
  const smoothY = useSpring(cursorY, { stiffness: 55, damping: 20 });

  useEffect(() => {
    if (reduceMotion) {
      setBooted(true);
      setBootProgress(100);
      return;
    }

    const started = window.setInterval(() => {
      setBootProgress((value) => {
        const next = Math.min(100, value + Math.floor(Math.random() * 9) + 4);
        if (next >= 100) {
          window.clearInterval(started);
          window.setTimeout(() => setBooted(true), 260);
        }
        return next;
      });
    }, 75);

    return () => window.clearInterval(started);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const move = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY, reduceMotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      {!booted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#010302] text-paper">
          <div className="absolute inset-0 opacity-[.05]" style={{ backgroundImage: "linear-gradient(rgba(46,229,157,.7) 1px,transparent 1px),linear-gradient(90deg,rgba(46,229,157,.7) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="relative w-[min(460px,calc(100%-40px))]">
            <div className="mb-3 flex justify-between font-mono text-[8px] uppercase tracking-[.35em] text-muted">
              <span>VYUHAM'26 // BUILD NETWORK</span>
              <span className="text-green">{String(bootProgress).padStart(3, "0")}%</span>
            </div>
            <div className="h-px bg-white/10">
              <motion.div className="h-full bg-green shadow-[0_0_16px_rgba(46,229,157,.9)]" animate={{ width: `${bootProgress}%` }} />
            </div>
            <div className="mt-5 font-display text-3xl font-bold tracking-tight">
              INITIALIZING <span className="text-green">NODE_03</span>
            </div>
            <div className="mt-3 font-mono text-[8px] uppercase tracking-[.25em] text-muted">
              AUTHENTICATING SQUAD // LOADING COMMAND SYSTEM
            </div>
          </div>
        </div>
      )}

      <main className="relative min-h-screen overflow-hidden bg-[#020504] pt-[92px] text-paper">
        {/* DEEP SPACE / HUD ENVIRONMENT */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(46,229,157,.09),transparent_28%),radial-gradient(circle_at_84%_70%,rgba(34,211,238,.045),transparent_24%)]" />

          <div
            className="absolute inset-0 opacity-[.045]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(46,229,157,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(46,229,157,.55) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <div className="absolute inset-0 opacity-[.025]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,.3) 4px)" }} />

          {!reduceMotion && (
            <>
              <motion.div
                className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-green/60 to-transparent"
                animate={{ top: ["5%", "95%"], opacity: [0, 1, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute h-[480px] w-[480px] rounded-full border border-green/[.07]"
                style={{ x: smoothX, y: smoothY, left: "-220px", top: "42%" }}
              />
              <motion.div
                className="absolute right-[-250px] top-[18%] h-[560px] w-[560px] rounded-full border border-cyan-300/[.05]"
                animate={{ rotate: -360 }}
                transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute left-[10%] top-[15%] h-1 w-1 rounded-full bg-green shadow-[0_0_10px_rgba(46,229,157,1)]"
                animate={{ y: [0, 380, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
        </div>

        <section className="relative z-10 py-10 md:py-16">
          <div className="mx-auto w-[min(1240px,calc(100%-28px))] md:w-[min(1240px,calc(100%-64px))]">

            {/* HERO COMMAND FRAME */}
            <AnimatedSection>
              <div className="relative overflow-hidden border border-white/30 bg-black/[.28] px-5 pb-6 pt-5 backdrop-blur-[3px] md:px-8 md:pb-8">
                <Corner position="tl" />
                <Corner position="tr" />
                <Corner position="bl" />
                <Corner position="br" />

                <div className="flex items-center justify-between border-b border-white/10 pb-5 font-mono text-[7px] uppercase tracking-[.3em] text-muted">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_10px_rgba(46,229,157,.9)]" />
                    BUILD NETWORK // ONLINE
                  </span>
                  <span>VYUHAM'26 // NODE_03 // <b className="text-green">LIVE</b></span>
                </div>

                <div className="grid gap-8 pt-9 lg:grid-cols-[1fr_330px] lg:items-center">
                  <div>
                    <div className="font-mono text-[8px] font-bold uppercase tracking-[.35em] text-muted">BUILD ZONE COMMAND</div>

                    <motion.h1
                      className="mt-5 font-display text-[clamp(50px,8vw,104px)] font-black leading-[.78] tracking-[-.055em]"
                      initial={reduceMotion ? false : { opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: .7, ease: "easeOut" }}
                    >
                      HACKATHON
                      <br />
                      <span className="text-green [text-shadow:0_0_35px_rgba(46,229,157,.28)]">HUB</span>
                    </motion.h1>

                    <motion.p
                      className="mt-7 max-w-2xl text-sm leading-7 text-white/65 md:text-base"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: .25, duration: .6 }}
                    >
                      Squad command interface for milestone tracking, prototype deployment,
                      repository submission and mentor communication.
                    </motion.p>
                  </div>

                  <div className="flex justify-center lg:justify-end">
                    <Reactor reduceMotion={reduceMotion} />
                  </div>
                </div>

                {/* TELEMETRY */}
                <div className="mt-4 grid grid-cols-2 gap-px border border-white/15 bg-white/15 md:grid-cols-4">
                  {telemetry.map(([label, value, color]) => (
                    <motion.div
                      key={label}
                      className="relative bg-black/50 px-4 py-4"
                      whileHover={reduceMotion ? undefined : { backgroundColor: "rgba(46,229,157,.035)" }}
                    >
                      <div className="font-mono text-[7px] uppercase tracking-[.22em] text-muted">{label}</div>
                      <div className={`mt-2 flex items-center gap-2 font-mono text-[9px] font-bold ${color === "cyan" ? "text-cyan-300" : color === "amber" ? "text-amber-300" : "text-green"}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                        {value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* COMMAND STRIP */}
            <AnimatedSection delay={.05}>
              <div className="mt-4 grid grid-cols-2 gap-px border-y border-white/15 bg-white/10 md:grid-cols-5">
                {[
                  ["COMMAND LINK", "ACTIVE"],
                  ["PHASE", "03 / 04"],
                  ["NODE", "CYB-14"],
                  ["SUBMISSION", "31 OCT"],
                  ["STATE", "BUILDING"],
                ].map(([label, value], index) => (
                  <div key={label} className="bg-[#030706] px-4 py-3 font-mono">
                    <div className="text-[7px] tracking-[.2em] text-muted">{label}</div>
                    <div className={`mt-1 text-[8px] font-bold tracking-[.14em] ${index === 4 ? "text-amber-300" : "text-green"}`}>{value}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* MILESTONE CONTROL */}
            <AnimatedSection delay={.1}>
              <div className="relative mt-7 overflow-hidden border border-white/20 bg-black/[.5] p-5 backdrop-blur-sm md:p-8">
                <Corner position="tl" />
                <Corner position="tr" />

                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                  <div>
                    <div className="font-mono text-[8px] uppercase tracking-[.3em] text-green">Mission Progress // Squad Path</div>
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">MILESTONE CONTROL</h2>
                  </div>
                  <div className="font-mono text-[9px] text-muted"><span className="text-green">75%</span> SYSTEM COMPLETION</div>
                </div>

                <div className="mt-6 h-[3px] overflow-hidden bg-white/10">
                  <motion.div
                    className="h-full bg-linear-to-r from-green via-green to-cyan-300 shadow-[0_0_15px_rgba(46,229,157,.8)]"
                    initial={{ width: reduceMotion ? "75%" : "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>

                <div className="relative mt-7 grid gap-4 md:grid-cols-4">
                  <div className="absolute left-[8%] right-[8%] top-6 hidden h-px bg-linear-to-r from-green via-green/40 to-white/10 md:block" />

                  {milestones.map((m, index) => {
                    const active = m.status === "ACTIVE";
                    const complete = m.status === "COMPLETE";

                    return (
                      <motion.div
                        key={m.id}
                        className={`group relative z-10 overflow-hidden border p-4 transition-colors ${
                          active
                            ? "border-green/60 bg-green/[.06]"
                            : complete
                              ? "border-green/20 bg-black/40"
                              : "border-white/10 bg-black/30"
                        }`}
                        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * .08, duration: .4 }}
                        whileHover={reduceMotion ? undefined : { y: -4 }}
                      >
                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border font-mono text-[10px] font-bold ${
                          active ? "border-green bg-green text-black shadow-[0_0_20px_rgba(46,229,157,.5)]" :
                          complete ? "border-green/60 bg-green/10 text-green" : "border-white/15 bg-black text-muted"
                        }`}>
                          {complete ? "✓" : m.id}
                        </div>

                        {active && <SignalRing className="left-[-6px] top-[-6px]" size={60} count={2} duration={2.4} />}

                        <div className={`font-mono text-[8px] tracking-[.18em] ${active || complete ? "text-green" : "text-muted"}`}>
                          {m.status}
                        </div>
                        <h3 className="mt-1 font-display text-base font-semibold">{m.title}</h3>
                        <p className="mt-2 text-[11px] leading-5 text-muted">{m.description}</p>
                        <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[8px] text-muted">{m.time}</div>

                        {active && !reduceMotion && (
                          <motion.div
                            className="absolute bottom-0 left-0 h-px bg-green shadow-[0_0_10px_rgba(46,229,157,.9)]"
                            animate={{ width: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2.8, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {!reduceMotion && (
                  <motion.div
                    className="mt-6 hidden h-px w-16 bg-green shadow-[0_0_12px_rgba(46,229,157,.9)] md:block"
                    animate={{ x: ["0%", "1050%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
            </AnimatedSection>

            {/* UPLINK + SUPPORT */}
            <div className="mt-7 grid gap-7 lg:grid-cols-[1.55fr_1fr]">
              <AnimatedSection delay={.16}>
                <div className="relative overflow-hidden border border-white/20 bg-black/[.52] p-5 backdrop-blur-sm md:p-8">
                  <Corner position="tl" />
                  <Corner position="br" />

                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <div className="font-mono text-[8px] uppercase tracking-[.3em] text-green">Data Uplink // UPLINK_03</div>
                      <h3 className="mt-2 font-display text-2xl font-bold">SUBMIT PROTOTYPE</h3>
                    </div>
                    <div className="hidden font-mono text-[8px] text-muted sm:block">SECURE CHANNEL</div>
                  </div>

                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="py-14 text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green/60 bg-green/10 text-3xl text-green shadow-[0_0_35px_rgba(46,229,157,.18)]">✓</div>
                      <div className="mt-5 font-display text-xl font-bold">UPLINK ACCEPTED</div>
                      <p className="mt-2 font-mono text-[10px] text-muted">Repository received. Mentor review queue updated.</p>
                      <button type="button" onClick={() => setSubmitted(false)} className="mt-6 font-mono text-[9px] uppercase tracking-widest text-green hover:underline">
                        Submit another revision
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                      <div>
                        <label className="font-mono text-[8px] uppercase tracking-[.2em] text-muted">Primary Repository</label>
                        <div className="relative mt-2">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-green">//</span>
                          <input
                            type="url"
                            required
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/cybervipers/vyuham-hackathon"
                            className="w-full border border-white/10 bg-black/50 py-4 pl-11 pr-4 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-green/60 focus:shadow-[0_0_20px_rgba(46,229,157,.06)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-mono text-[8px] uppercase tracking-[.2em] text-muted">
                          Live Deployment <span className="ml-2 text-white/20">OPTIONAL</span>
                        </label>
                        <div className="relative mt-2">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan-300">→</span>
                          <input
                            type="url"
                            value={demoUrl}
                            onChange={(e) => setDemoUrl(e.target.value)}
                            placeholder="https://cybervipers.vercel.app"
                            className="w-full border border-white/10 bg-black/50 py-4 pl-11 pr-4 font-mono text-xs text-paper outline-none transition placeholder:text-white/20 focus:border-cyan-300/50"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-mono text-[8px] uppercase tracking-widest text-muted">Current State</div>
                          <div className="mt-1 flex items-center gap-2 font-mono text-xs text-amber-300">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" /> DRAFTING
                          </div>
                        </div>
                        <Button type="submit" variant="primary">TRANSMIT MILESTONE 03 →</Button>
                      </div>
                    </form>
                  )}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={.22}>
                <div className="relative overflow-hidden border border-cyan-300/20 bg-black/[.52] p-5 backdrop-blur-sm md:p-8">
                  <Corner position="tr" />
                  <Corner position="bl" />

                  <div className="absolute right-5 top-5 flex items-center gap-2 font-mono text-[8px] text-green">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" /> ONLINE
                  </div>

                  <div className="font-mono text-[8px] uppercase tracking-[.3em] text-cyan-300">Support Network</div>
                  <h3 className="mt-2 font-display text-2xl font-bold">LIVE SUPPORT NODE</h3>
                  <p className="mt-4 text-xs leading-6 text-muted">
                    Technical assistance, API access, deployment help and architecture guidance are available through the mentor network.
                  </p>

                  <div className="relative my-8 flex h-36 items-center justify-center overflow-hidden border border-white/10 bg-black/50">
                    <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.3) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

                    {!reduceMotion && (
                      <>
                        <motion.div
                          className="absolute h-20 w-20 rounded-full border border-cyan-300/30"
                          animate={{ scale: [1, 2.2, 1], opacity: [.8, 0, .8] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute left-0 right-0 h-px bg-cyan-300/40"
                          animate={{ top: ["10%", "90%", "10%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                      </>
                    )}

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300 text-black shadow-[0_0_30px_rgba(34,211,238,.5)]">⚡</div>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-5 font-mono text-[9px]">
                    <div className="flex justify-between"><span className="text-muted">RESPONSE</span><span>&lt; 05 MIN</span></div>
                    <div className="flex justify-between"><span className="text-muted">BAY</span><span className="text-green">14</span></div>
                    <div className="flex justify-between"><span className="text-muted">CHANNEL</span><span>MENTOR-03</span></div>
                  </div>

                  <Button onClick={() => setMentorRequested(true)} variant="outline" className="mt-6 w-full justify-center">
                    {mentorRequested ? "MENTOR REQUESTED ✓" : "REQUEST MENTOR ⚡"}
                  </Button>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={.28}>
              <div className="mt-7 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[8px] uppercase tracking-[.18em] text-muted sm:flex-row">
                <span>VYUHAM'26 • BUILD NETWORK • CYBERVIPERS</span>
                <span className="text-green">● ALL SYSTEMS NOMINAL</span>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
