"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";

interface SquadMember {
  id: string;
  name: string;
  role: "Leader" | "Member" | "Pending";
  email: string;
  status: "Confirmed" | "Invited";
}

export default function TeamsPage() {
  const reduceMotion = usePrefersReducedMotion();
  const squadName = "CyberVipers";
  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState<SquadMember[]>([
    {
      id: "1",
      name: "Arjun V. Nair",
      role: "Leader",
      email: "arjun@duk.ac.in",
      status: "Confirmed",
    },
    {
      id: "2",
      name: "Neha Suresh",
      role: "Member",
      email: "neha@duk.ac.in",
      status: "Confirmed",
    },
    {
      id: "3",
      name: "Rohan K.",
      role: "Member",
      email: "rohan@gmail.com",
      status: "Invited",
    },
  ]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newMember: SquadMember = {
      id: String(Date.now()),
      name: inviteEmail.split("@")[0],
      role: "Member",
      email: inviteEmail,
      status: "Invited",
    };
    setMembers([...members, newMember]);
    setInviteEmail("");
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1000px,calc(100%-48px))]">
            <AnimatedSection>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <Kicker>Squad Formation</Kicker>
                  <h1 className="mt-2 font-display text-[32px] font-semibold md:text-[44px]">
                    TEAM MANAGEMENT
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Assemble and manage team members for hackathons, CTFs, and group competitions.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted">SQUAD ID:</span>
                  <span className="rounded border border-green/30 bg-ink-mid px-3 py-1 font-mono text-xs font-semibold text-green">
                    SQD-VYU-9021
                  </span>
                </div>
              </div>
            </AnimatedSection>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Squad Roster */}
              <AnimatedSection delay={0.1} className="lg:col-span-2">
                <div className="glass-card p-6 md:p-8">
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <h2 className="font-display text-xl font-semibold text-paper">
                      {squadName} <span className="font-mono text-xs text-muted">({members.length}/4 Members)</span>
                    </h2>
                    <span className="rounded bg-green/10 border border-green/30 px-2.5 py-0.5 font-mono text-[10px] text-green">
                      FORMATION ACTIVE
                    </span>
                  </div>

                  {/* Member Snap-in List */}
                  <div className="mt-6 space-y-4">
                    <AnimatePresence initial={false}>
                      {members.map((member) => (
                        <motion.div
                          key={member.id}
                          layout={!reduceMotion}
                          initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, height: 0, marginBottom: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 22 }}
                          className="flex items-center justify-between overflow-hidden rounded border border-line bg-ink-mid/60 p-4 transition-all duration-300 hover:border-green/30"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ink font-mono text-sm font-bold text-green">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-display font-medium text-paper">
                                {member.name}
                              </h4>
                              <p className="font-mono text-xs text-muted">{member.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span
                              className={`rounded px-2.5 py-0.5 font-mono text-[10px] ${
                                member.role === "Leader"
                                  ? "border border-green/40 bg-green/10 text-green"
                                  : "border border-line text-muted"
                              }`}
                            >
                              {member.role}
                            </span>

                            <span
                              className={`font-mono text-xs ${
                                member.status === "Confirmed" ? "text-green" : "text-amber-400"
                              }`}
                            >
                              ● {member.status}
                            </span>

                            {member.role !== "Leader" && (
                              <button
                                onClick={() => removeMember(member.id)}
                                className="font-mono text-xs text-muted hover:text-red-400"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Invite New Member */}
                  <form onSubmit={handleInvite} className="mt-8 border-t border-line/60 pt-6">
                    <label className="block font-mono text-[10px] tracking-wider uppercase text-muted">
                      INVITE OPERATIVE TO SQUAD
                    </label>
                    <div className="mt-2 flex gap-3">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="teammate@university.edu"
                        className="flex-1 rounded-sm border border-line bg-ink-mid/60 px-4 py-2.5 font-mono text-sm text-paper focus:border-green focus:outline-none"
                      />
                      <Button type="submit" variant="primary">
                        Send Invite +
                      </Button>
                    </div>
                  </form>
                </div>
              </AnimatedSection>

              {/* Linked Events Card */}
              <AnimatedSection delay={0.2}>
                <div className="glass-card p-6 md:p-8">
                  <h3 className="font-display text-lg font-semibold border-b border-line pb-4">
                    LINKED COMPETITIONS
                  </h3>

                  <div className="mt-6 space-y-4">
                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-green">TECH STREAM</span>
                      <h4 className="mt-1 font-display font-medium text-paper">
                        National Hackathon
                      </h4>
                      <p className="mt-1 font-mono text-xs text-muted">
                        Status: <strong className="text-green">Squad Registered</strong>
                      </p>
                    </div>

                    <div className="rounded border border-line bg-ink-mid/40 p-4">
                      <span className="font-mono text-[10px] text-purple-400">GAMING STREAM</span>
                      <h4 className="mt-1 font-display font-medium text-paper">
                        CTF Warzone
                      </h4>
                      <p className="mt-1 font-mono text-xs text-muted">
                        Status: <strong className="text-amber-400">Invite Pending</strong>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-line/60 pt-6">
                    <Button href="/register" variant="outline" className="w-full justify-center">
                      Browse More Events ↗
                    </Button>
                  </div>
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
