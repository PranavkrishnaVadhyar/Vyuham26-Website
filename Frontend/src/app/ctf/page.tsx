"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

interface Challenge {
  id: string;
  category: "Web" | "Crypto" | "Reverse" | "Forensics";
  title: string;
  points: number;
  solves: number;
  unlocked: boolean;
  solved: boolean;
}

export default function CTFPortalPage() {
  const reduceMotion = usePrefersReducedMotion();
  const [flag, setFlag] = useState("");
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [status, setStatus] = useState<"idle" | "verifying" | "correct" | "incorrect">("idle");

  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: "1", category: "Web", title: "Dimensional Gateway Bypass", points: 100, solves: 42, unlocked: true, solved: true },
    { id: "2", category: "Crypto", title: "Quantum Cipher Rift", points: 250, solves: 18, unlocked: true, solved: false },
    { id: "3", category: "Reverse", title: "Doomsday Binary Injector", points: 400, solves: 7, unlocked: true, solved: false },
    { id: "4", category: "Forensics", title: "Corrupted Memory Transmission", points: 500, solves: 3, unlocked: false, solved: false },
  ]);

  const squadScore = useMemo(
    () => 750 + challenges.reduce((acc, c) => (c.solved ? acc + c.points : acc), 0),
    [challenges]
  );

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChallenge) return;
    setStatus("verifying");
    setTimeout(() => {
      if (flag.toLowerCase().includes("vyuham")) {
        setStatus("correct");
        setChallenges(
          challenges.map((c) => (c.id === activeChallenge.id ? { ...c, solved: true } : c))
        );
      } else {
        setStatus("incorrect");
      }
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Threat Simulation Terminal</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    CTF <em>PORTAL</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Capture the Flag cyber range terminal. Decrypt challenges, submit flags, and watch scoreboard deltas.
                  </p>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <div>
                    <span className="text-muted block">SQUAD SCORE:</span>
                    <motion.strong
                      key={squadScore}
                      initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 1.2 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 20 }}
                      className="inline-block text-green text-xl font-bold"
                    >
                      {squadScore.toLocaleString()} PTS
                    </motion.strong>
                  </div>
                  <div>
                    <span className="text-muted block">GLOBAL RANK:</span>
                    <strong className="text-paper text-xl font-bold">#4 / 64</strong>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Challenge Matrix */}
              <AnimatedSection delay={0.1} className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {challenges.map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() => {
                        if (ch.unlocked) {
                          setActiveChallenge(ch);
                          setStatus("idle");
                          setFlag("");
                        }
                      }}
                      className={`glass-card cursor-pointer p-6 transition-all duration-300 ${
                        ch.solved
                          ? "border-green/50 bg-green/5"
                          : activeChallenge?.id === ch.id
                          ? "border-green bg-ink-mid"
                          : "border-line hover:border-green/30"
                      } ${!ch.unlocked ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="text-muted">{ch.category}</span>
                        <span className="text-green font-bold">{ch.points} PTS</span>
                      </div>

                      <h3 className={`mt-3 font-display font-semibold text-paper text-lg ${ch.solved ? "decrypt-text-anim" : ""}`}>
                        {ch.title}
                      </h3>

                      <div className="mt-4 flex justify-between items-center font-mono text-[10px]">
                        <span className="text-muted">{ch.solves} Solves</span>
                        {ch.solved ? (
                          <span className="text-green font-bold">✓ SOLVED</span>
                        ) : ch.unlocked ? (
                          <span className="text-amber-400">● UNLOCKED</span>
                        ) : (
                          <span className="text-muted">🔒 LOCKED</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Terminal Flag Submission Console */}
              <AnimatedSection delay={0.2}>
                <div className="glass-card p-6 md:p-8">
                  <h3 className="font-mono text-xs text-green uppercase tracking-wider border-b border-line pb-3">
                    [ TERMINAL DECRYPT CONSOLE ]
                  </h3>

                  {activeChallenge ? (
                    <div className="mt-4 space-y-4">
                      <div>
                        <span className="font-mono text-[10px] text-muted">{activeChallenge.category}</span>
                        <h4 className="font-display font-semibold text-paper">{activeChallenge.title}</h4>
                        <p className="font-mono text-xs text-muted mt-2">
                          Find the vulnerability in the quantum protocol and extract the root flag.
                        </p>
                      </div>

                      {activeChallenge.solved ? (
                        <div className="rounded border border-green bg-green/10 p-3 font-mono text-xs text-green text-center">
                          ✓ FLAG VERIFIED & REWARDED
                        </div>
                      ) : (
                        <form onSubmit={handleFlagSubmit} className="space-y-3">
                          <input
                            type="text"
                            required
                            value={flag}
                            onChange={(e) => setFlag(e.target.value)}
                            placeholder="vyuham{flag_value_here}"
                            className="w-full rounded border border-line bg-ink px-3 py-2 font-mono text-xs text-green placeholder:text-muted/40 focus:border-green focus:outline-none"
                          />

                          {status === "verifying" && (
                            <div className="font-mono text-[10px] text-amber-400 text-center animate-pulse">
                              DECRYPTING & VERIFYING HASH...
                            </div>
                          )}

                          {status === "correct" && (
                            <div className="font-mono text-[10px] text-green text-center font-bold">
                              ✓ ACCESS GRANTED! +{activeChallenge.points} PTS
                            </div>
                          )}

                          {status === "incorrect" && (
                            <div className="font-mono text-[10px] text-red-400 text-center">
                              ✕ INVALID FLAG HASH. TRY AGAIN.
                            </div>
                          )}

                          <Button type="submit" variant="primary" className="w-full justify-center">
                            Submit Flag →
                          </Button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center font-mono text-xs text-muted">
                      Select an unlocked challenge node to initiate decryption.
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
