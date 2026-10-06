import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { useAuth } from "@/context/AuthContext";
import { teamsApi, type TeamRecord } from "@/lib/api";
import { toast } from "@/components/ui/Toaster";
import Link from "next/link";

interface SquadMember {
  id: string;
  name: string;
  role: "Leader" | "Member" | "Pending";
  email: string;
  status: "Confirmed" | "Invited";
}

export default function TeamsPage() {
  const { user, isAuthenticated } = useAuth();
  const reduceMotion = usePrefersReducedMotion();

  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [activeTeam, setActiveTeam] = useState<TeamRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadSquads = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const list = await teamsApi.listMine();
      if (Array.isArray(list)) {
        setTeams(list);
        if (list.length > 0) {
          try {
            const detailed = await teamsApi.getById(list[0].id);
            setActiveTeam(detailed || list[0]);
          } catch {
            setActiveTeam(list[0]);
          }
        } else {
          setActiveTeam(null);
        }
      }
    } catch (err: any) {
      console.warn("Failed to fetch squads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSquads();
  }, [isAuthenticated]);

  const selectSquad = async (team: TeamRecord) => {
    try {
      const detailed = await teamsApi.getById(team.id);
      setActiveTeam(detailed || team);
    } catch {
      setActiveTeam(team);
    }
  };

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await teamsApi.create({ name: createName.trim() });
      toast(`Squad "${created.name}" created! Invite Code: ${created.invite_code}`, "ok");
      setCreateName("");
      await loadSquads();
    } catch (err: any) {
      toast(`Failed to create squad: ${err?.message || "Error"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setIsSubmitting(true);
    try {
      const joined = await teamsApi.join(joinCode.trim().toUpperCase());
      toast(`Successfully joined squad "${joined.name}"!`, "ok");
      setJoinCode("");
      await loadSquads();
    } catch (err: any) {
      toast(`Invalid invite code or squad full: ${err?.message || "Error"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyInviteCode = () => {
    if (activeTeam?.invite_code) {
      navigator.clipboard.writeText(activeTeam.invite_code);
      setCopied(true);
      toast(`Invite code ${activeTeam.invite_code} copied to clipboard!`, "ok");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const removeMember = (_memberId: string) => {
    toast("Operative roster lock is in effect. Squad modifications must be coordinated with the event desk.", "warn");
  };

  const squadName = activeTeam?.name || "CyberVipers";
  const members: SquadMember[] = activeTeam?.members && activeTeam.members.length > 0
    ? activeTeam.members.map((m, idx) => ({
        id: m.user_id,
        name: m.name || m.email.split("@")[0].toUpperCase(),
        role: idx === 0 || m.user_id === activeTeam.created_by ? "Leader" : "Member",
        email: m.email,
        status: "Confirmed",
      }))
    : [
        {
          id: user?.id || "1",
          name: user?.name || "OPERATIVE",
          role: "Leader",
          email: user?.email || "operative@vyuham26.in",
          status: "Confirmed",
        },
      ];

  const confirmedCount = members.filter((m) => m.status === "Confirmed").length;
  const invitedCount = members.filter((m) => m.status === "Invited").length;
  const capacity = Math.min((members.length / 4) * 100, 100);

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-[92px] bg-[#020504] text-paper">
        {/* =========================================================
            BACKGROUND SYSTEM
        ========================================================= */}

        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* radial glow */}
          <div className="absolute left-1/2 top-[18%] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-green/5 blur-[130px]" />

          <div className="absolute -left-40 top-[45%] h-[420px] w-[420px] rounded-full bg-green/3 blur-[110px]" />

          {/* technical grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(46,229,157,.45) 1px, transparent 1px),
                linear-gradient(90deg, rgba(46,229,157,.45) 1px, transparent 1px)
              `,
              backgroundSize: "55px 55px",
            }}
          />

          {/* scanlines */}
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,.5) 4px)",
            }}
          />
        </div>

        <section className="relative py-16 md:py-24">
          <div className="mx-auto w-[min(1120px,calc(100%-32px))] md:w-[min(1120px,calc(100%-64px))]">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <AnimatedSection>
              <div className="relative overflow-hidden border border-green/15 bg-[#050807]/90 p-6 md:p-8">

                {/* corner accents */}
                <div className="absolute left-0 top-0 h-12 w-12 border-l border-t border-green/50" />
                <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-green/50" />
                <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-green/20" />
                <div className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-green/20" />

                {/* top telemetry */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
                    </span>

                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-green">
                      SQUAD NETWORK ONLINE
                    </span>
                  </div>

                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                    NODE / VYU-TEAM-9021
                  </span>
                </div>

                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

                  <div>
                    <Kicker>Squad Formation Protocol</Kicker>

                    <h1 className="mt-3 max-w-3xl font-display text-[36px] font-semibold leading-[0.95] tracking-tight md:text-[56px]">
                      TEAM
                      <span className="text-green"> MANAGEMENT</span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-6 text-muted md:text-base">
                      Assemble your operative network, manage squad access,
                      and synchronize your team across VYUHAM&apos;26
                      competitions.
                    </p>
                  </div>

                  {/* squad ID & Invite Code */}
                  <div className="min-w-[240px] border border-green/20 bg-black/40 p-4">
                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                      <span>INVITE CODE</span>
                      {activeTeam && (
                        <button
                          onClick={copyInviteCode}
                          className="text-[9px] text-green hover:underline cursor-pointer"
                        >
                          {copied ? "COPIED ✓" : "COPY CODE 📋"}
                        </button>
                      )}
                    </div>

                    <div className="mt-2 font-mono text-base font-bold tracking-widest text-green">
                      {activeTeam?.invite_code || "ENLIST TO VIEW"}
                    </div>

                    {teams.length > 1 && (
                      <div className="mt-2.5 border-t border-white/10 pt-2">
                        <label className="block font-mono text-[8px] uppercase tracking-wider text-muted">SWITCH SQUAD:</label>
                        <select
                          value={activeTeam?.id || ""}
                          onChange={(e) => {
                            const found = teams.find((t) => t.id === e.target.value);
                            if (found) selectSquad(found);
                          }}
                          className="mt-1 w-full bg-[#080c0a] border border-green/30 px-2 py-1 font-mono text-[10px] text-paper outline-none"
                        >
                          {teams.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.invite_code})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_10px_rgba(46,229,157,.8)]" />
                      <span className="font-mono text-[9px] uppercase text-muted">
                        {activeTeam ? "Formation Active" : "No Squad Selected"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                SQUAD CORE
            ===================================================== */}

            <AnimatedSection delay={0.08}>
              <div className="mt-6 overflow-hidden border border-line bg-[#050807]/90">

                <div className="flex flex-col justify-between gap-5 border-b border-line p-5 md:flex-row md:items-center md:px-7">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-green">
                      Squad Core
                    </div>

                    <h2 className="mt-1 font-display text-2xl font-semibold">
                      {squadName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-5 font-mono text-[10px] uppercase">
                    <div>
                      <span className="text-muted">CONFIRMED </span>
                      <span className="text-green">
                        {String(confirmedCount).padStart(2, "0")}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted">INVITED </span>
                      <span className="text-amber-400">
                        {String(invitedCount).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative p-5 md:p-7">

                  {/* connection network */}
                  {!reduceMotion && (
                    <div className="pointer-events-none absolute inset-x-20 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-green/25 to-transparent md:block" />
                  )}

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                    {members.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={
                          reduceMotion
                            ? false
                            : {
                              opacity: 0,
                              y: 20,
                              scale: 0.92,
                            }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.45,
                        }}
                        className="group relative"
                      >
                        {/* node */}
                        <div className="relative flex min-h-[150px] flex-col items-center justify-center overflow-hidden border border-line bg-[#080c0a] p-4 transition-all duration-300 hover:border-green/40 hover:bg-green/[0.025]">

                          {/* scan beam */}
                          {!reduceMotion && (
                            <motion.div
                              className="pointer-events-none absolute inset-x-0 h-px bg-green/40 shadow-[0_0_12px_rgba(46,229,157,.8)]"
                              animate={{ top: ["0%", "100%"] }}
                              transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: index * 0.4,
                              }}
                            />
                          )}

                          {/* avatar */}
                          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-green/30 bg-[#020504]">

                            {!reduceMotion && (
                              <motion.div
                                className="absolute inset-[-6px] rounded-full border border-green/10"
                                animate={{
                                  rotate: 360,
                                }}
                                transition={{
                                  duration: 8,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            )}

                            <span className="font-mono text-lg font-bold text-green">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>

                          <div className="mt-4 w-full text-center">
                            <div className="truncate font-display text-sm font-medium text-paper">
                              {member.name}
                            </div>

                            <div className="mt-1 truncate font-mono text-[9px] text-muted">
                              {member.role.toUpperCase()}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${member.status === "Confirmed"
                                  ? "bg-green shadow-[0_0_8px_rgba(46,229,157,.8)]"
                                  : "bg-amber-400"
                                }`}
                            />

                            <span className="font-mono text-[8px] uppercase text-muted">
                              {member.status}
                            </span>
                          </div>

                          {/* remove */}
                          {member.role !== "Leader" && (
                            <button
                              onClick={() => removeMember(member.id)}
                              className="absolute right-2 top-2 text-[10px] text-muted opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
                              aria-label={`Remove ${member.name}`}
                            >
                              ✕
                            </button>
                          )}

                          {/* corner */}
                          <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-green/30" />
                        </div>
                      </motion.div>
                    ))}

                    {/* empty slot */}
                    {members.length < 4 && (
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex min-h-[150px] flex-col items-center justify-center border border-dashed border-line bg-black/10"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-line font-mono text-lg text-muted">
                          +
                        </div>

                        <span className="mt-3 font-mono text-[9px] uppercase tracking-wider text-muted">
                          Open Slot
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* capacity */}
                  <div className="mt-7 border-t border-line/60 pt-5">
                    <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider">
                      <span className="text-muted">Squad Capacity</span>
                      <span className="text-green">
                        {members.length} / 4
                      </span>
                    </div>

                    <div className="h-1 overflow-hidden bg-white/5">
                      <motion.div
                        className="h-full bg-green shadow-[0_0_12px_rgba(46,229,157,.7)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${capacity}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* ===================================================
                  ROSTER
              =================================================== */}

              <AnimatedSection delay={0.12} className="lg:col-span-2">
                <div className="relative overflow-hidden border border-line bg-[#050807]/90">

                  {/* top line */}
                  <div className="h-px w-full bg-gradient-to-r from-green/60 via-green/20 to-transparent" />

                  <div className="p-6 md:p-7">

                    <div className="flex flex-col justify-between gap-3 border-b border-line pb-5 sm:flex-row sm:items-center">
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
                          Personnel Registry
                        </div>

                        <h3 className="mt-1 font-display text-xl font-semibold">
                          ACTIVE OPERATIVES
                        </h3>
                      </div>

                      <span className="border border-green/25 bg-green/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-green">
                        {members.length} / 4 Connected
                      </span>
                    </div>

                    <div className="mt-6 space-y-3">
                      <AnimatePresence initial={false}>
                        {members.map((member, index) => (
                          <motion.div
                            key={member.id}
                            layout={!reduceMotion}
                            initial={
                              reduceMotion
                                ? false
                                : {
                                  opacity: 0,
                                  x: -20,
                                }
                            }
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            exit={
                              reduceMotion
                                ? { opacity: 0 }
                                : {
                                  opacity: 0,
                                  x: 30,
                                  height: 0,
                                  marginBottom: 0,
                                }
                            }
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 24,
                            }}
                            className="group relative overflow-hidden border border-line bg-[#080c0a] p-4 transition-all duration-300 hover:border-green/30"
                          >
                            {/* hover energy */}
                            <div className="absolute inset-y-0 left-0 w-px bg-green opacity-0 shadow-[0_0_15px_rgba(46,229,157,.9)] transition-opacity group-hover:opacity-100" />

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                              <div className="flex min-w-0 items-center gap-4">

                                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-[#020504] font-mono text-sm font-bold text-green">
                                  {member.name.charAt(0).toUpperCase()}

                                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-[#050807] bg-green" />
                                </div>

                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="font-display font-medium text-paper">
                                      {member.name}
                                    </h4>

                                    {member.role === "Leader" && (
                                      <span className="border border-green/30 bg-green/10 px-1.5 py-0.5 font-mono text-[8px] uppercase text-green">
                                        COMMAND
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-1 truncate font-mono text-[10px] text-muted">
                                    {member.email}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 sm:justify-end">

                                <span
                                  className={`border px-2 py-1 font-mono text-[8px] uppercase ${member.role === "Leader"
                                      ? "border-green/30 bg-green/5 text-green"
                                      : "border-line text-muted"
                                    }`}
                                >
                                  {member.role}
                                </span>

                                <span
                                  className={`font-mono text-[9px] uppercase ${member.status === "Confirmed"
                                      ? "text-green"
                                      : "text-amber-400"
                                    }`}
                                >
                                  ● {member.status}
                                </span>

                                {member.role !== "Leader" && (
                                  <button
                                    onClick={() => removeMember(member.id)}
                                    className="border border-line px-2 py-1 font-mono text-[9px] text-muted transition-colors hover:border-red-400/30 hover:text-red-400"
                                  >
                                    REMOVE
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* index */}
                            <div className="absolute right-2 top-1 font-mono text-[7px] text-white/10">
                              {String(index + 1).padStart(2, "0")}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* =================================================
                        SQUAD FORMATION & JOIN CONTROLS
                    ================================================= */}

                    <div className="mt-7 border-t border-line/60 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* CREATE SQUAD */}
                        <form onSubmit={handleCreateSquad} className="border border-green/20 bg-black/30 p-5 rounded">
                          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-green">
                            Form New Squad
                          </div>
                          <p className="mt-1 text-xs text-muted">
                            Establish a squad and get an official invite code.
                          </p>

                          <div className="mt-4 flex flex-col gap-3">
                            <input
                              type="text"
                              value={createName}
                              onChange={(e) => setCreateName(e.target.value)}
                              placeholder="e.g. QuantumGlitch"
                              required
                              className="w-full rounded border border-white/10 bg-[#0b1410] py-2.5 px-3 font-mono text-xs text-paper focus:border-green/50 focus:outline-none"
                            />
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={isSubmitting || !createName.trim()}
                              className="justify-center"
                            >
                              {isSubmitting ? "INITIALIZING..." : "ESTABLISH SQUAD →"}
                            </Button>
                          </div>
                        </form>

                        {/* JOIN SQUAD BY CODE */}
                        <form onSubmit={handleJoinSquad} className="border border-white/10 bg-black/30 p-5 rounded">
                          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper">
                            Enlist Via Invite Code
                          </div>
                          <p className="mt-1 text-xs text-muted">
                            Enter the 8-character invite code from your squad leader.
                          </p>

                          <div className="mt-4 flex flex-col gap-3">
                            <input
                              type="text"
                              value={joinCode}
                              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                              placeholder="e.g. K9X2LM4Q"
                              maxLength={8}
                              required
                              className="w-full rounded border border-white/10 bg-[#0b1410] py-2.5 px-3 font-mono text-xs uppercase tracking-widest text-green focus:border-green/50 focus:outline-none"
                            />
                            <Button
                              type="submit"
                              variant="outline"
                              disabled={isSubmitting || !joinCode.trim()}
                              className="justify-center"
                            >
                              {isSubmitting ? "CONNECTING..." : "JOIN SQUAD ↗"}
                            </Button>
                          </div>
                        </form>

                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* ===================================================
                  RIGHT PANEL
              =================================================== */}

              <AnimatedSection delay={0.18}>
                <div className="space-y-6">

                  {/* telemetry */}
                  <div className="border border-line bg-[#050807]/90 p-6">
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">
                      Squad Telemetry
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line">

                      <div className="bg-[#080c0a] p-4">
                        <div className="font-mono text-[9px] text-muted">
                          MEMBERS
                        </div>
                        <div className="mt-1 font-display text-2xl text-green">
                          {members.length}
                        </div>
                      </div>

                      <div className="bg-[#080c0a] p-4">
                        <div className="font-mono text-[9px] text-muted">
                          CAPACITY
                        </div>
                        <div className="mt-1 font-display text-2xl text-paper">
                          04
                        </div>
                      </div>

                      <div className="bg-[#080c0a] p-4">
                        <div className="font-mono text-[9px] text-muted">
                          ACTIVE
                        </div>
                        <div className="mt-1 font-display text-2xl text-green">
                          {confirmedCount}
                        </div>
                      </div>

                      <div className="bg-[#080c0a] p-4">
                        <div className="font-mono text-[9px] text-muted">
                          PENDING
                        </div>
                        <div className="mt-1 font-display text-2xl text-amber-400">
                          {invitedCount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* competitions */}
                  <div className="relative overflow-hidden border border-line bg-[#050807]/90 p-6">

                    <div className="flex items-center justify-between border-b border-line pb-4">
                      <h3 className="font-display text-lg font-semibold">
                        LINKED EVENTS
                      </h3>

                      <span className="font-mono text-[8px] text-green">
                        02 ACTIVE
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">

                      {/* hackathon */}
                      <motion.div
                        whileHover={reduceMotion ? undefined : { y: -2 }}
                        className="group relative overflow-hidden border border-line bg-[#080c0a] p-4"
                      >
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-green" />

                        <span className="font-mono text-[8px] uppercase tracking-wider text-green">
                          TECH STREAM
                        </span>

                        <h4 className="mt-2 font-display font-medium text-paper">
                          Hackathon — 24HR
                        </h4>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_8px_rgba(46,229,157,.7)]" />

                          <span className="font-mono text-[9px] uppercase text-muted">
                            Squad Registered
                          </span>
                        </div>
                      </motion.div>

                      {/* CTF */}
                      <motion.div
                        whileHover={reduceMotion ? undefined : { y: -2 }}
                        className="group relative overflow-hidden border border-line bg-[#080c0a] p-4"
                      >
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-green" />

                        <span className="font-mono text-[8px] uppercase tracking-wider text-green">
                          TECH STREAM
                        </span>

                        <h4 className="mt-2 font-display font-medium text-paper">
                          Capture the Flag
                        </h4>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />

                          <span className="font-mono text-[9px] uppercase text-muted">
                            Invite Pending
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-5 border-t border-line/60 pt-5">
                      <Button
                        href="/register"
                        variant="outline"
                        className="w-full justify-center"
                      >
                        BROWSE MORE EVENTS ↗
                      </Button>
                    </div>
                  </div>

                  {/* security status */}
                  <div className="border border-green/15 bg-green/[0.025] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center border border-green/30 bg-green/5 font-mono text-xs text-green">
                        ✓
                      </div>

                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-green">
                          Squad Authorization
                        </div>

                        <div className="mt-1 font-mono text-[9px] text-muted">
                          Identity synchronization active
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* =====================================================
                FOOTER STATUS
            ===================================================== */}

            <AnimatedSection delay={0.25}>
              <div className="mt-6 flex flex-col gap-3 border-t border-line/50 pt-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green shadow-[0_0_8px_rgba(46,229,157,.8)]" />

                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
                    VYUHAM&apos;26 / SQUAD NETWORK
                  </span>
                </div>

                <div className="font-mono text-[9px] uppercase tracking-wider text-muted">
                  NODE STATUS:{" "}
                  <span className="text-green">OPERATIONAL</span>
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
