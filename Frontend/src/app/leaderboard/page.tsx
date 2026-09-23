"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import RankList, { RankRow } from "@/components/motion/RankList";
import { Kicker } from "@/components/ui/Elements";

interface LeaderboardTeam {
  rank: number;
  prevRank: number;
  name: string;
  college: string;
  score: number;
  solves: number;
}

export default function LeaderboardPage() {
  const teams: LeaderboardTeam[] = [
    { rank: 1, prevRank: 2, name: "CyberVipers", college: "Digital University Kerala", score: 1450, solves: 12 },
    { rank: 2, prevRank: 1, name: "ByteBusters", college: "IIT Madras", score: 1380, solves: 11 },
    { rank: 3, prevRank: 3, name: "NullPointer Squad", college: "NIT Calicut", score: 1210, solves: 10 },
    { rank: 4, prevRank: 5, name: "QuantumGlitch", college: "CET Trivandrum", score: 980, solves: 8 },
    { rank: 5, prevRank: 4, name: "BinaryKnights", college: "CUSAT", score: 920, solves: 7 },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1100px,calc(100%-48px))] md:w-[min(1100px,calc(100%-64px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-line pb-6">
                <div>
                  <Kicker>Rank Conflict Board</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    LIVE <em>LEADERBOARD</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Real-time ranking for National Hackathon & CTF Warzone.
                  </p>
                </div>
                <div className="font-mono text-xs text-green">
                  ● TELEMETRY UPDATED 10 SEC AGO
                </div>
              </div>
            </AnimatedSection>

            {/* Leaderboard Ranks */}
            <RankList className="mt-8 space-y-4">
              {teams.map((team, idx) => {
                const delta = team.prevRank - team.rank;
                return (
                  <RankRow key={team.name} index={idx}>
                    <div
                      className={`glass-card flex items-center justify-between p-5 md:p-6 transition-all duration-500 ${
                        team.rank === 1
                          ? "border-green bg-green/10 shadow-[0_0_24px_rgba(46,229,157,0.15)]"
                          : "border-line"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        {/* Rank Badge */}
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full font-mono text-xl font-bold ${
                            team.rank === 1
                              ? "bg-green text-ink"
                              : team.rank === 2
                              ? "bg-paper text-ink"
                              : team.rank === 3
                              ? "bg-amber-500 text-ink"
                              : "border border-line bg-ink text-muted"
                          }`}
                        >
                          #{team.rank}
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-display text-xl font-bold text-paper">
                              {team.name}
                            </h3>
                            {delta > 0 && (
                              <span className="font-mono text-xs text-green">
                                ▲ +{delta} Rank
                              </span>
                            )}
                            {delta < 0 && (
                              <span className="font-mono text-xs text-red-400">
                                ▼ {delta} Rank
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-xs text-muted">{team.college}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 font-mono text-right">
                        <div>
                          <span className="text-muted block text-[10px]">FLAG SOLVES</span>
                          <strong className="text-paper text-sm">{team.solves} Solves</strong>
                        </div>
                        <div>
                          <span className="text-muted block text-[10px]">TOTAL SCORE</span>
                          <strong className="text-green text-xl font-bold">{team.score} PTS</strong>
                        </div>
                      </div>
                    </div>
                  </RankRow>
                );
              })}
            </RankList>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
