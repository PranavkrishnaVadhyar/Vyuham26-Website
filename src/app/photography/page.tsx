"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker } from "@/components/ui/Elements";

interface PhotoEntry {
  id: string;
  title: string;
  photographer: string;
  votes: number;
  voted: boolean;
  bgGradient: string;
}

export default function PhotographyContestPage() {
  const [entries, setEntries] = useState<PhotoEntry[]>([
    { id: "1", title: "Midnight Laser Core", photographer: "Arjun V.", votes: 142, voted: false, bgGradient: "from-green/30 to-ink" },
    { id: "2", title: "Technocity Horizon", photographer: "Sneha R.", votes: 98, voted: false, bgGradient: "from-purple-500/30 to-ink" },
    { id: "3", title: "Crowd Surge Ignition", photographer: "Dev K.", votes: 210, voted: false, bgGradient: "from-amber-500/30 to-ink" },
    { id: "4", title: "Multiverse Stage Lights", photographer: "Meera P.", votes: 165, voted: false, bgGradient: "from-cyan-500/30 to-ink" },
  ]);

  const toggleVote = (id: string) => {
    setEntries(
      entries.map((e) => {
        if (e.id === id) {
          const newVoted = !e.voted;
          return { ...e, voted: newVoted, votes: e.votes + (newVoted ? 1 : -1) };
        }
        return e;
      })
    );
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
                  <Kicker>Memory Vault</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    PHOTOGRAPHY <em>CONTEST</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Vote for your favorite capture from Vyuham 26. Vote confirmation creates an energy bloom on your pick.
                  </p>
                </div>
                <div className="font-mono text-xs text-green">
                  ● VOTING OPEN FOR FESTIVAL DELEGATES
                </div>
              </div>
            </AnimatedSection>

            {/* Photo Entries Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {entries.map((photo, idx) => (
                <AnimatedSection key={photo.id} delay={0.05 * idx}>
                  <div
                    className={`group relative overflow-hidden rounded-sm border p-5 transition-all duration-500 ${
                      photo.voted
                        ? "border-green bg-gradient-to-b from-green/20 to-ink-mid shadow-[0_0_30px_rgba(46,229,157,0.3)]"
                        : "border-line bg-ink-mid/40 hover:border-green/40"
                    }`}
                  >
                    {/* Image Mock Placeholder with Gradient Bloom */}
                    <div className={`h-48 w-full rounded bg-gradient-to-br ${photo.bgGradient} flex items-center justify-center relative overflow-hidden`}>
                      <span className="font-mono text-xs text-paper/80 font-bold">
                        [ PHOTO SUBMISSION #{photo.id} ]
                      </span>

                      {/* Bloom Glow on Vote */}
                      {photo.voted && (
                        <div className="absolute inset-0 bg-green/20 animate-pulse pointer-events-none" />
                      )}
                    </div>

                    <div className="mt-4">
                      <h3 className="font-display font-semibold text-paper text-lg">
                        {photo.title}
                      </h3>
                      <p className="font-mono text-xs text-muted">
                        Captured by {photo.photographer}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-line/60 flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-green">
                        {photo.votes} Votes
                      </span>

                      <button
                        onClick={() => toggleVote(photo.id)}
                        className={`rounded px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                          photo.voted
                            ? "border border-green bg-green text-ink"
                            : "border border-line bg-ink text-muted hover:border-green hover:text-paper"
                        }`}
                      >
                        {photo.voted ? "♥ VOTED" : "♥ VOTE"}
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
