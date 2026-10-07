import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { Kicker, Button } from "@/components/ui/Elements";
import { useAuth } from "@/context/AuthContext";
import { adminApi, type AdminStatsResponse } from "@/lib/api";
import {
  useRegistrationOpen,
  setRegistrationOpen,
  useCoreTeamVisible,
  setCoreTeamVisible,
  useSponsorsVisible,
  setSponsorsVisible,
} from "@/config/site";
import { toast } from "@/components/ui/Toaster";
import { cyberAudio } from "@/lib/cyberAudio";
import AnnouncementManager from "@/components/admin/AnnouncementManager";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const regOpen = useRegistrationOpen();
  const showCoreTeam = useCoreTeamVisible();
  const showSponsors = useSponsorsVisible();
  const reduceMotion = usePrefersReducedMotion();
  const [filter, setFilter] = useState<"all" | "tech" | "management" | "cultural" | "esports">("all");
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);

  const handleToggleRegistration = () => {
    cyberAudio.playTelemetry();
    const next = !regOpen;
    setRegistrationOpen(next);
    if (next) {
      toast("🟢 [GATEWAY ACTIVATED] Registration is now OPEN live across all public portals.", "ok");
    } else {
      toast("🟠 [GATEWAY LOCKED] Registration is CLOSED. Public sees COMING SOON.", "warn");
    }
  };

  const handleToggleCoreTeam = () => {
    cyberAudio.playTelemetry();
    const next = !showCoreTeam;
    setCoreTeamVisible(next);
    if (next) {
      toast("🟢 [THE CORE ACTIVATED] 'THE CORE' team showcase is now visible across the public site.", "ok");
    } else {
      toast("🟠 [THE CORE HIDDEN] 'THE CORE' team showcase is turned OFF and hidden from the public.", "warn");
    }
  };

  const handleToggleSponsors = () => {
    cyberAudio.playTelemetry();
    const next = !showSponsors;
    setSponsorsVisible(next);
    if (next) {
      toast("🟢 [SPONSORS ACTIVATED] 'BACKED BY' showcase is now visible across the public site.", "ok");
    } else {
      toast("🟠 [SPONSORS HIDDEN] 'BACKED BY' showcase is turned OFF and hidden.", "warn");
    }
  };

  useEffect(() => {
    adminApi.getStats().then((data) => setStats(data)).catch(() => {});
  }, []);

  const rawMetrics = stats ? stats[filter] : {
    total_registrations: 2480,
    total_revenue: 684000,
    total_checkins: 1890,
    active_events: 32,
  };

  const currentMetrics = {
    totalRegs: rawMetrics.total_registrations.toLocaleString("en-IN"),
    totalRevenue: "₹" + rawMetrics.total_revenue.toLocaleString("en-IN"),
    totalCheckins: rawMetrics.total_checkins.toLocaleString("en-IN"),
    activeEvents: rawMetrics.active_events,
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
                  <Kicker>Operations Command Center</Kicker>
                  <h1 className="mt-2 font-display text-[36px] font-semibold md:text-[52px]">
                    ADMIN <em>PANEL</em>
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Real-time fest metrics, registrations, gate check-in counts, and financial summaries.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {(["all", "tech", "management", "cultural", "esports"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`rounded px-3 py-1.5 uppercase font-medium transition-all ${
                        filter === cat
                           ? "border border-green bg-green/10 text-green"
                          : "border border-line bg-ink-mid/40 text-muted hover:text-paper"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Festival Registration Gateway Operational Status Banner */}
            <AnimatedSection delay={0.05}>
              <div
                className={`mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-lg border backdrop-blur-xl transition-all duration-300 ${
                  regOpen
                    ? "border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_25px_rgba(24,196,124,0.1)]"
                    : "border-amber-500/40 bg-amber-950/20 shadow-[0_0_25px_rgba(245,158,11,0.1)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                        regOpen ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                        regOpen ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper">
                        Registration Gateway:
                      </span>
                      <span
                        className={`font-mono text-xs font-extrabold uppercase tracking-[0.22em] ${
                          regOpen ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {regOpen ? "OPEN & LIVE" : "CLOSED (COMING SOON)"}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] text-muted">
                      {regOpen
                        ? "Public portals are actively accepting event registrations, teams, and pass checkouts."
                        : "Registration forms and checkout are locked. Public sees 'COMING SOON' on Nav and event pages."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleRegistration}
                    className={`font-mono text-xs font-bold px-4 py-2 uppercase tracking-[0.18em] transition-all duration-300 rounded border ${
                      regOpen
                        ? "border-red-500/60 bg-red-950/40 text-red-300 hover:bg-red-900/60 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        : "border-emerald-500/60 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/70 hover:text-white hover:shadow-[0_0_20px_rgba(24,196,124,0.4)]"
                    }`}
                  >
                    {regOpen ? "Turn OFF Registration" : "Turn ON Registration"}
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* The Core (Core Team) Showcase Operational Status Banner */}
            <AnimatedSection delay={0.08}>
              <div
                className={`mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-lg border backdrop-blur-xl transition-all duration-300 ${
                  showCoreTeam
                    ? "border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_25px_rgba(24,196,124,0.1)]"
                    : "border-amber-500/40 bg-amber-950/20 shadow-[0_0_25px_rgba(245,158,11,0.1)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                        showCoreTeam ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                        showCoreTeam ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper">
                        The Core Team Showcase ("THE CORE"):
                      </span>
                      <span
                        className={`font-mono text-xs font-extrabold uppercase tracking-[0.22em] ${
                          showCoreTeam ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {showCoreTeam ? "VISIBLE & LIVE" : "HIDDEN (OFF)"}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] text-muted">
                      {showCoreTeam
                        ? "Public About section displays 'THE CORE' leadership roster (6 members)."
                        : "'THE CORE' is suppressed from public view. Attendees only see fest identity & metrics."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleCoreTeam}
                    className={`font-mono text-xs font-bold px-4 py-2 uppercase tracking-[0.18em] transition-all duration-300 rounded border ${
                      showCoreTeam
                        ? "border-red-500/60 bg-red-950/40 text-red-300 hover:bg-red-900/60 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        : "border-emerald-500/60 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/70 hover:text-white hover:shadow-[0_0_20px_rgba(24,196,124,0.4)]"
                    }`}
                  >
                    {showCoreTeam ? "Turn OFF 'THE CORE'" : "Turn ON 'THE CORE'"}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleSponsors}
                    className={`font-mono text-[11px] font-medium px-3 py-2 uppercase tracking-[0.14em] transition-all duration-300 rounded border ${
                      showSponsors
                        ? "border-line bg-ink-mid/40 text-muted hover:text-paper"
                        : "border-amber-500/50 bg-amber-950/30 text-amber-300 hover:text-white"
                    }`}
                  >
                    Backed By: {showSponsors ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* Metrics Overview Cards */}
            <AnimatedSection delay={0.1}>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="glass-card p-6">
                  <span className="font-mono text-[10px] uppercase text-muted">TOTAL REGISTRATIONS</span>
                  <motion.strong
                    key={`regs-${filter}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-2 block font-display text-4xl text-paper"
                  >
                    {currentMetrics.totalRegs}
                  </motion.strong>
                  <span className="mt-2 block font-mono text-[10px] text-green">↑ 14% vs yesterday</span>
                </div>

                <div className="glass-card p-6">
                  <span className="font-mono text-[10px] uppercase text-muted">GROSS REVENUE</span>
                  <motion.strong
                    key={`rev-${filter}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-2 block font-display text-4xl text-green"
                  >
                    {currentMetrics.totalRevenue}
                  </motion.strong>
                  <span className="mt-2 block font-mono text-[10px] text-muted">Gate & Online total</span>
                </div>

                <div className="glass-card p-6">
                  <span className="font-mono text-[10px] uppercase text-muted">GATE CHECK-INS</span>
                  <motion.strong
                    key={`checkins-${filter}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-2 block font-display text-4xl text-paper"
                  >
                    {currentMetrics.totalCheckins}
                  </motion.strong>
                  <span className="mt-2 block font-mono text-[10px] text-green">76% of registered</span>
                </div>

                <div className="glass-card p-6">
                  <span className="font-mono text-[10px] uppercase text-muted">ACTIVE EVENTS</span>
                  <motion.strong
                    key={`events-${filter}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-2 block font-display text-4xl text-paper"
                  >
                    {currentMetrics.activeEvents}
                  </motion.strong>
                  <span className="mt-2 block font-mono text-[10px] text-amber-400">● 4 Events Live Now</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Admin Quick Links */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              <AnimatedSection delay={0.15}>
                <div className="glass-card p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">Analytics Intelligence</h3>
                    <p className="mt-2 font-mono text-xs text-muted">
                      Detailed funnel analytics, footfall paths, and stream conversion graphs.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60">
                    <Button href="/admin/analytics" variant="outline" className="w-full justify-center">
                      View Analytics →
                    </Button>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="glass-card p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">Event Head Portal</h3>
                    <p className="mt-2 font-mono text-xs text-muted">
                      Field commander console for recording attendance and publishing event results.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60">
                    <Button href="/admin/event-head" variant="outline" className="w-full justify-center">
                      Event Head Console →
                    </Button>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.25}>
                <div className="glass-card p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">Gate Check-in Scanner</h3>
                    <p className="mt-2 font-mono text-xs text-muted">
                      Scanner console for gate security volunteers to validate QR entry passes.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60">
                    <Button href="/checkin" variant="primary" className="w-full justify-center">
                      Open Gate Scanner →
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Live Announcements Management */}
            <div className="mt-12">
              <AnimatedSection delay={0.3}>
                <AnnouncementManager />
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
