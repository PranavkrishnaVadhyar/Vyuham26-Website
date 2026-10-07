import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { useApp } from "@/lib/store";
import { toast } from "@/components/ui/Toaster";
import { cyberAudio } from "@/lib/cyberAudio";
import type { Announcement, FestEvent, Sponsor, StreamId, TeamMember } from "@/data/types";
import ConsoleManager from "./ConsoleManager";
import AnnouncementManager from "./AnnouncementManager";
import { useConsoleConfig } from "@/config/consoleConfig";

/* ------------------------------------------------------------------ */
/*  primitives                                                         */
/* ------------------------------------------------------------------ */
const SECTIONS = [
  "Overview",
  "Console",
  "Events",
  "Registrations",
  "Users",
  "Streams",
  "Schedule",
  "Gallery",
  "Announcements",
  "Sponsors",
  "Team",
  "Homepage",
  "Settings",
] as const;
type Section = (typeof SECTIONS)[number];

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="border border-[rgba(120,160,145,0.16)] bg-[#060a09]">
      <header className="flex items-center justify-between border-b border-[rgba(120,160,145,0.14)] px-5 py-3">
        <h3 className="font-mono text-[10px] tracking-[0.28em] text-[#9fc4b4]">{title.toUpperCase()}</h3>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="relative overflow-hidden border border-[rgba(120,160,145,0.16)] bg-[#060a09] p-5">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(24,196,124,0.18), transparent 70%)" }}
      />
      <p className="font-mono text-[9px] tracking-[0.3em] text-[#4f6f61]">{label}</p>
      <p className="t-cond mt-3 text-[40px] leading-none text-[#eef8f3]">{value}</p>
      {hint && <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-[#18c47c]">{hint}</p>}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <tr className="border-b border-[rgba(120,160,145,0.1)] last:border-0">{children}</tr>;
}
const Th = ({ children }: { children: ReactNode }) => (
  <th className="px-3 py-2 text-left font-mono text-[9px] font-normal tracking-[0.24em] text-[#4f6f61]">
    {children}
  </th>
);
const Td = ({ children, className }: { children: ReactNode; className?: string }) => (
  <td className={cn("px-3 py-3 font-mono text-[10px] tracking-[0.1em] text-[#b9d3c7]", className)}>{children}</td>
);

function Input({
  label,
  value,
  onChange,
  type = "text",
  area,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  area?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-[6px] block font-mono text-[8px] tracking-[0.28em] text-[#4f6f61]">
        {label.toUpperCase()}
      </span>
      {area ? (
        <textarea className="field min-h-[86px]" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="field" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

const blankEvent = (): FestEvent => ({
  id: `ev-${Math.random().toString(36).slice(2, 7)}`,
  name: "NEW EVENT",
  stream: "technology",
  day: 1,
  date: "30 OCT 2026",
  time: "10:00 — 12:00",
  venue: "TBD",
  blurb: "Describe this event.",
  seats: 100,
  registered: 0,
  image: "https://images.pexels.com/photos/3861960/pexels-photo-3861960.jpeg?auto=compress&cs=tinysrgb&w=1200",
  status: "open",
});

function RegistrationGatePanel() {
  const { regOpen, setRegOpen } = useApp();
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setLoading(true);
    cyberAudio.playTelemetry();
    const nextState = !regOpen;
    setRegOpen(nextState);
    setTimeout(() => {
      setLoading(false);
      if (nextState) {
        toast("🟢 [GATEWAY ACTIVATED] Festival registration is now OPEN live across all public portals.", "ok");
      } else {
        toast("🟠 [GATEWAY LOCKED] Festival registration is CLOSED. Public sees COMING SOON.", "warn");
      }
    }, 200);
  };

  return (
    <div
      className={`relative overflow-hidden border p-5 transition-all duration-300 ${
        regOpen
          ? "border-emerald-500/40 bg-gradient-to-r from-[rgba(6,25,18,0.92)] to-[rgba(4,18,13,0.75)] shadow-[0_0_25px_rgba(24,196,124,0.12)]"
          : "border-amber-500/40 bg-gradient-to-r from-[rgba(25,18,6,0.92)] to-[rgba(18,12,4,0.75)] shadow-[0_0_25px_rgba(245,158,11,0.12)]"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-xl"
        style={{
          background: regOpen
            ? "radial-gradient(circle, rgba(24,196,124,0.22), transparent 70%)"
            : "radial-gradient(circle, rgba(245,158,11,0.22), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                regOpen ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
              }`}
            />
            <span
              className={`font-mono text-[10px] font-bold tracking-[0.26em] uppercase ${
                regOpen ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              REGISTRATION GATEWAY: {regOpen ? "OPEN & LIVE" : "CLOSED (COMING SOON)"}
            </span>
            <span className="font-mono text-[8px] tracking-[0.16em] text-[#6f8b80] border border-[rgba(120,160,145,0.2)] px-1.5 py-0.5 rounded">
              ROOT OVERRIDE
            </span>
          </div>

          <p className="font-mono text-[11px] text-[#c6ded3] max-w-[700px] leading-relaxed">
            {regOpen
              ? "All event registration forms, tickets, teams, cart checkout, and attendee dashboard pipelines are actively accepting user entries across the festival site."
              : "All registration forms and submissions are blocked. Navbar and event dossiers display 'COMING SOON'. Direct registration endpoints are guarded."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            className={`group relative flex items-center gap-2.5 px-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
              regOpen
                ? "border border-red-500/60 bg-red-950/40 text-red-300 hover:bg-red-900/60 hover:border-red-400 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                : "border border-emerald-500/60 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/70 hover:border-emerald-300 hover:text-white hover:shadow-[0_0_25px_rgba(24,196,124,0.4)]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                regOpen ? "bg-red-400" : "bg-emerald-400"
              }`}
            />
            <span>{regOpen ? "CLOSE REGISTRATION GATE" : "ACTIVATE REGISTRATION GATE"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CoreTeamGatePanel() {
  const { showCoreTeam, setShowCoreTeam, showSponsors, setShowSponsors } = useApp();
  const [loading, setLoading] = useState(false);

  const handleToggleCore = () => {
    setLoading(true);
    cyberAudio.playTelemetry();
    const nextState = !showCoreTeam;
    setShowCoreTeam(nextState);
    setTimeout(() => {
      setLoading(false);
      if (nextState) {
        toast("🟢 [THE CORE ACTIVATED] 'THE CORE' team showcase is now visible across the public site.", "ok");
      } else {
        toast("🟠 [THE CORE HIDDEN] 'THE CORE' team showcase is turned OFF and hidden from the public.", "warn");
      }
    }, 150);
  };

  const handleToggleSponsors = () => {
    cyberAudio.playTelemetry();
    const nextState = !showSponsors;
    setShowSponsors(nextState);
    if (nextState) {
      toast("🟢 [SPONSORS ACTIVATED] 'BACKED BY' showcase is visible across the public site.", "ok");
    } else {
      toast("🟠 [SPONSORS HIDDEN] 'BACKED BY' showcase is turned OFF and hidden.", "warn");
    }
  };

  return (
    <div
      className={`relative overflow-hidden border p-5 transition-all duration-300 ${
        showCoreTeam
          ? "border-emerald-500/40 bg-gradient-to-r from-[rgba(6,25,18,0.92)] to-[rgba(4,18,13,0.75)] shadow-[0_0_25px_rgba(24,196,124,0.12)]"
          : "border-amber-500/40 bg-gradient-to-r from-[rgba(25,18,6,0.92)] to-[rgba(18,12,4,0.75)] shadow-[0_0_25px_rgba(245,158,11,0.12)]"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-xl"
        style={{
          background: showCoreTeam
            ? "radial-gradient(circle, rgba(24,196,124,0.22), transparent 70%)"
            : "radial-gradient(circle, rgba(245,158,11,0.22), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                showCoreTeam ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
              }`}
            />
            <span
              className={`font-mono text-[10px] font-bold tracking-[0.26em] uppercase ${
                showCoreTeam ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              CORE TEAM SHOWCASE ("THE CORE"): {showCoreTeam ? "ON (VISIBLE & LIVE)" : "OFF (HIDDEN FROM PUBLIC)"}
            </span>
            <span className="font-mono text-[8px] tracking-[0.16em] text-[#6f8b80] border border-[rgba(120,160,145,0.2)] px-1.5 py-0.5 rounded">
              ABOUT SECTION
            </span>
          </div>

          <p className="font-mono text-[11px] text-[#c6ded3] max-w-[700px] leading-relaxed">
            {showCoreTeam
              ? "The 6-member leadership roster ('THE CORE' — Festival Director, Leads & Creative Director) is currently active and rendered on the About page."
              : "The leadership roster ('THE CORE') is completely hidden from the public About page. Only stats and fest details will be displayed."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleToggleCore}
            disabled={loading}
            className={`group relative flex items-center gap-2.5 px-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
              showCoreTeam
                ? "border border-red-500/60 bg-red-950/40 text-red-300 hover:bg-red-900/60 hover:border-red-400 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                : "border border-emerald-500/60 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/70 hover:border-emerald-300 hover:text-white hover:shadow-[0_0_25px_rgba(24,196,124,0.4)]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                showCoreTeam ? "bg-red-400" : "bg-emerald-400"
              }`}
            />
            <span>{showCoreTeam ? "TURN OFF \"THE CORE\"" : "TURN ON \"THE CORE\""}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSponsors}
            className={`flex items-center gap-2 px-3 py-2.5 font-mono text-[10px] tracking-[0.16em] uppercase border transition-all duration-300 ${
              showSponsors
                ? "border-[rgba(120,160,145,0.3)] bg-[rgba(6,25,18,0.5)] text-[#9fc4b4] hover:border-amber-500/50 hover:text-amber-300"
                : "border-amber-500/40 bg-amber-950/30 text-amber-300 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
            title="Toggle 'BACKED BY' sponsors visibility on About page"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${showSponsors ? "bg-emerald-400" : "bg-amber-400"}`} />
            <span>BACKED BY: {showSponsors ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  admin app                                                          */
/* ------------------------------------------------------------------ */
export default function AdminApp() {
  const app = useApp();
  const { content, users, registrations, user } = app;
  const [section, setSection] = useState<Section>("Overview");
  const [consoleConfig] = useConsoleConfig();
  const [editing, setEditing] = useState<FestEvent | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [email, setEmail] = useState("admin@vyuham26.in");
  const [pw, setPw] = useState("");

  // Volunteer enrollment state
  const [volModalOpen, setVolModalOpen] = useState(false);
  const [volName, setVolName] = useState("");
  const [volEmail, setVolEmail] = useState("");
  const [volPw, setVolPw] = useState("");
  const [volCollege, setVolCollege] = useState("");
  const [volStation, setVolStation] = useState("Gate 1 - Main Entrance");

  // Gallery auto-allocation modal state
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaTag, setMediaTag] = useState("CAMPUS");
  const [mediaSpan, setMediaSpan] = useState<"auto" | "wide" | "tall" | "std">("auto");
  const [detectedSpan, setDetectedSpan] = useState<"wide" | "tall" | "std">("std");
  const [detectedInfo, setDetectedInfo] = useState<string>("");

  const handleMediaUrlChange = (url: string) => {
    setMediaUrl(url);
    if (!url.trim()) {
      setDetectedInfo("");
      return;
    }
    const isVid = /\.mp4|\.webm/i.test(url);
    if (isVid) {
      setDetectedSpan("wide");
      setDetectedInfo("Video detected → Auto-allocated: WIDE (16:9)");
      return;
    }
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      let span: "wide" | "tall" | "std" = "std";
      let desc = `${img.naturalWidth}×${img.naturalHeight}px (Ratio: ${ratio.toFixed(2)}) → `;
      if (ratio >= 1.35) {
        span = "wide";
        desc += "Auto-allocated: WIDE (Landscape 16:9)";
      } else if (ratio <= 0.85) {
        span = "tall";
        desc += "Auto-allocated: TALL (Portrait 3:4)";
      } else {
        span = "std";
        desc += "Auto-allocated: STANDARD (4:3)";
      }
      setDetectedSpan(span);
      setDetectedInfo(desc);
    };
    img.onerror = () => {
      setDetectedSpan("std");
      setDetectedInfo("Default allocation: STANDARD (4:3)");
    };
    img.src = url;
  };

  const handleSaveGalleryMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) {
      toast("Please enter an image or video URL.", "warn");
      return;
    }
    const finalSpan = mediaSpan === "auto" ? detectedSpan : mediaSpan;
    app.addGalleryItem({
      id: `g-${Math.random().toString(36).slice(2, 7)}`,
      type: /\.mp4|\.webm/i.test(mediaUrl) ? "video" : "image",
      src: mediaUrl.trim(),
      caption: mediaCaption.trim() || "FESTIVAL CAPTURE",
      tag: mediaTag.toUpperCase() || "CAMPUS",
      span: finalSpan,
    });
    toast(`Media added with ${finalSpan.toUpperCase()} layout allocation.`, "ok");
    setGalleryModalOpen(false);
    setMediaUrl("");
    setMediaCaption("");
    setDetectedInfo("");
    setMediaSpan("auto");
  };

  const handleEnrollVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName.trim() || !volEmail.trim() || !volPw) {
      toast("Please provide name, email, and password.", "warn");
      return;
    }
    const r = app.addVolunteer({
      name: volName,
      email: volEmail,
      password: volPw,
      college: volCollege,
      station: volStation,
    });
    toast(r.message, r.ok ? "ok" : "warn");
    if (r.ok) {
      setVolModalOpen(false);
      setVolName("");
      setVolEmail("");
      setVolPw("");
      setVolCollege("");
    }
  };

  const stats = useMemo(() => {
    const active = content.events.filter((e) => e.status !== "full").length;
    return {
      events: content.events.length,
      users: users.length,
      regs: registrations.length,
      active,
    };
  }, [content.events, users, registrations]);

  /* ---------------- gate ---------------- */
  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[#030504] px-5">
        <div className="w-full max-w-[400px] border border-[rgba(120,160,145,0.18)] bg-[#060a09] p-8">
          <p className="font-mono text-[9px] tracking-[0.3em] text-[#18c47c]">VYUHAM'26 · CONSOLE</p>
          <h1 className="t-cond mt-3 text-[34px] leading-none text-[#f0f9f5]">ADMIN ACCESS</h1>
          <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.18em] text-[#4f6f61]">
            RESTRICTED — CORE TEAM ONLY
          </p>
          <form
            className="mt-7 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const r = app.login(email, pw);
              toast(r.message, r.ok ? "ok" : "warn");
            }}
          >
            <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input
              className="field"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
            />
            <button className="btn-cine btn-cine--solid w-full justify-center" type="submit">
              AUTHENTICATE
            </button>
          </form>
          <a href="#/" className="link-trail mt-6 inline-block font-mono text-[9px] tracking-[0.26em] text-[#6f8b80]">
            ← BACK TO SITE
          </a>
        </div>
      </div>
    );
  }

  /* ---------------- shell ---------------- */
  return (
    <div className="min-h-[100svh] bg-[#030504] text-[#c8ddd3]">
      <div className="flex">
        {/* sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-[230px] border-r border-[rgba(120,160,145,0.14)] bg-[#050807] transition-transform duration-500 lg:translate-x-0",
            navOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-[62px] items-center gap-2 border-b border-[rgba(120,160,145,0.14)] px-5">
            <span className="t-cond text-[18px] text-[#eef8f3]">
              VYUHAM<span className="text-[#18c47c]">'26</span>
            </span>
            <span className="font-mono text-[8px] tracking-[0.24em] text-[#4f6f61]">CONSOLE</span>
          </div>
          <nav className="flex flex-col p-3">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSection(s);
                  setNavOpen(false);
                }}
                className={cn(
                  "relative px-3 py-[10px] text-left font-mono text-[10px] tracking-[0.2em] transition-colors duration-400",
                  section === s ? "text-[#dff6ec]" : "text-[#6f8b80] hover:text-[#bfe6d6]",
                )}
              >
                {section === s && (
                  <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-[#18c47c]" />
                )}
                {s.toUpperCase()}
              </button>
            ))}
          </nav>
          <div className="absolute inset-x-0 bottom-0 border-t border-[rgba(120,160,145,0.14)] p-4">
            <a href="#/" className="link-trail font-mono text-[9px] tracking-[0.24em] text-[#6f8b80]">
              ← PUBLIC SITE
            </a>
          </div>
        </aside>

        {/* main */}
        <main className="w-full lg:pl-[230px]">
          <header className="sticky top-0 z-30 flex h-[62px] items-center justify-between border-b border-[rgba(120,160,145,0.14)] bg-[rgba(3,5,4,0.9)] px-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button onClick={() => setNavOpen((o) => !o)} className="lg:hidden" aria-label="Menu">
                <span className="font-mono text-[12px] text-[#9fc4b4]">☰</span>
              </button>
              <h2 className="font-mono text-[10px] tracking-[0.3em] text-[#9fc4b4]">{section.toUpperCase()}</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden font-mono text-[9px] tracking-[0.22em] text-[#4f6f61] sm:block">
                {user.name} · ADMIN
              </span>
              <button
                onClick={() => {
                  app.logout();
                  toast("Signed out.", "warn");
                }}
                className="font-mono text-[9px] tracking-[0.24em] text-[#6f8b80] hover:text-[#f2a98a]"
              >
                SIGN OUT
              </button>
            </div>
          </header>

          <div className="space-y-5 p-5">
            {/* ---------------- OVERVIEW ---------------- */}
            {section === "Overview" && (
              <>
                <RegistrationGatePanel />
                <CoreTeamGatePanel />

                {/* Cyber Terminal Console Policy Quick Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[rgba(120,160,145,0.16)] bg-[#060a09] p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          !consoleConfig.showAccount &&
                          !consoleConfig.showFestival &&
                          !consoleConfig.showRootGateway
                            ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                            : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                        } animate-pulse`}
                      />
                      <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[#9fc4b4] uppercase">
                        CYBER TERMINAL CONSOLE POLICY:{" "}
                        {!consoleConfig.showAccount &&
                        !consoleConfig.showFestival &&
                        !consoleConfig.showRootGateway
                          ? "PRE-LAUNCH SAFE (PUBLIC READY)"
                          : "CUSTOM PROTOCOL ACTIVE"}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-[#78a091]">
                      Account Module:{" "}
                      <strong className={consoleConfig.showAccount ? "text-emerald-400" : "text-[#9fc4b4]"}>
                        {consoleConfig.showAccount ? "ON (VISIBLE)" : "OFF (HIDDEN)"}
                      </strong>{" "}
                      • Festival Ops:{" "}
                      <strong className={consoleConfig.showFestival ? "text-emerald-400" : "text-[#9fc4b4]"}>
                        {consoleConfig.showFestival ? "ON (VISIBLE)" : "OFF (HIDDEN)"}
                      </strong>{" "}
                      • Root Gateway:{" "}
                      <strong className={consoleConfig.showRootGateway ? "text-amber-400" : "text-emerald-400"}>
                        {consoleConfig.showRootGateway ? "ON (DEBUG VISIBLE)" : "OFF (SECURED)"}
                      </strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSection("Console")}
                    className="btn-cine font-mono text-[9px] tracking-[0.2em] uppercase shrink-0"
                  >
                    MANAGE CONSOLE MODULES →
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Stat label="TOTAL EVENTS" value={stats.events} hint="ACROSS 4 STREAMS" />
                  <Stat label="TOTAL USERS" value={stats.users} hint="REGISTERED ACCOUNTS" />
                  <Stat label="TOTAL REGISTRATIONS" value={stats.regs} hint="SLOTS HELD" />
                  <Stat label="ACTIVE EVENTS" value={stats.active} hint="ACCEPTING ENTRIES" />
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <Panel title="Stream distribution">
                    <div className="space-y-4">
                      {content.streams.map((s) => {
                        const n = content.events.filter((e) => e.stream === s.id).length;
                        const pct = stats.events ? (n / stats.events) * 100 : 0;
                        return (
                          <div key={s.id}>
                            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em]">
                              <span style={{ color: s.accent }}>{s.name}</span>
                              <span className="text-[#4f6f61]">{n} EVENTS</span>
                            </div>
                            <div className="mt-2 h-[3px] bg-[rgba(120,160,145,0.14)]">
                              <div
                                className="h-full transition-[width] duration-700"
                                style={{ width: `${pct}%`, background: s.accent, boxShadow: `0 0 12px ${s.glow}` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Panel>

                  <Panel title="Capacity load">
                    <div className="space-y-3">
                      {content.events.slice(0, 6).map((e) => (
                        <div key={e.id}>
                          <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-[#9fc4b4]">
                            <span className="truncate pr-3">{e.name}</span>
                            <span className="text-[#4f6f61]">
                              {e.registered}/{e.seats}
                            </span>
                          </div>
                          <div className="mt-[6px] h-[2px] bg-[rgba(120,160,145,0.14)]">
                            <div
                              className="h-full bg-[#18c47c]"
                              style={{ width: `${Math.min(100, (e.registered / e.seats) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>

                <Panel title="Recent registrations">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <Th>PARTICIPANT</Th>
                        <Th>EVENT</Th>
                        <Th>DATE</Th>
                        <Th>STATUS</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations
                        .slice(-8)
                        .reverse()
                        .map((r) => (
                          <Row key={r.id}>
                            <Td>{r.userName}</Td>
                            <Td>{r.eventName}</Td>
                            <Td>{r.createdAt}</Td>
                            <Td className={r.status === "confirmed" ? "text-[#18c47c]" : "text-[#f2c98a]"}>
                              {r.status.toUpperCase()}
                            </Td>
                          </Row>
                        ))}
                      {registrations.length === 0 && (
                        <Row>
                          <Td>NO REGISTRATIONS YET.</Td>
                        </Row>
                      )}
                    </tbody>
                  </table>
                </Panel>
              </>
            )}

            {/* ---------------- CONSOLE ---------------- */}
            {section === "Console" && <ConsoleManager />}

            {/* ---------------- EVENTS ---------------- */}
            {section === "Events" && (
              <Panel
                title={`Events (${content.events.length})`}
                action={
                  <button
                    onClick={() => setEditing(blankEvent())}
                    className="font-mono text-[9px] tracking-[0.24em] text-[#18c47c] hover:text-[#7dffc4]"
                  >
                    + NEW EVENT
                  </button>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr>
                        <Th>NAME</Th>
                        <Th>STREAM</Th>
                        <Th>DATE</Th>
                        <Th>VENUE</Th>
                        <Th>SEATS</Th>
                        <Th>STATUS</Th>
                        <Th> </Th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.events.map((e) => (
                        <Row key={e.id}>
                          <Td className="text-[#e7f5ee]">{e.name}</Td>
                          <Td>{e.stream.toUpperCase()}</Td>
                          <Td>{e.date}</Td>
                          <Td>{e.venue}</Td>
                          <Td>
                            {e.registered}/{e.seats}
                          </Td>
                          <Td>{e.status.toUpperCase()}</Td>
                          <Td>
                            <div className="flex gap-3">
                              <button onClick={() => setEditing(e)} className="text-[#18c47c] hover:text-[#7dffc4]">
                                EDIT
                              </button>
                              <button
                                onClick={() => {
                                  app.removeEvent(e.id);
                                  toast("Event removed.", "warn");
                                }}
                                className="text-[#6f8b80] hover:text-[#f2a98a]"
                              >
                                DELETE
                              </button>
                            </div>
                          </Td>
                        </Row>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {/* ---------------- REGISTRATIONS ---------------- */}
            {section === "Registrations" && (
              <Panel title={`Registrations (${registrations.length})`}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px]">
                    <thead>
                      <tr>
                        <Th>ID</Th>
                        <Th>PARTICIPANT</Th>
                        <Th>EVENT</Th>
                        <Th>DATE</Th>
                        <Th>STATUS</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((r) => (
                        <Row key={r.id}>
                          <Td className="text-[#4f6f61]">{r.id}</Td>
                          <Td>{r.userName}</Td>
                          <Td>{r.eventName}</Td>
                          <Td>{r.createdAt}</Td>
                          <Td className={r.status === "confirmed" ? "text-[#18c47c]" : "text-[#f2c98a]"}>
                            {r.status.toUpperCase()}
                          </Td>
                        </Row>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {/* ---------------- USERS & VOLUNTEERS ---------------- */}
            {section === "Users" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Stat label="Total Users" value={users.length} />
                  <Stat
                    label="Volunteers Assigned"
                    value={users.filter((u) => u.role === "volunteer").length}
                    hint="Gate & Stage Officers"
                  />
                  <Stat label="Administrators" value={users.filter((u) => u.role === "admin").length} />
                  <Stat
                    label="Gate Check-Ins"
                    value={app.checkins.length}
                    hint={`${app.checkins.filter((c) => c.status === "approved").length} Approved`}
                  />
                </div>

                <Panel
                  title={`Users & Assigned Personnel (${users.length})`}
                  action={
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          window.location.hash = "/volunteer";
                          window.dispatchEvent(new Event("app:navigate"));
                        }}
                        className="font-mono text-[9px] tracking-[0.2em] text-cyan-400 hover:text-cyan-300"
                      >
                        OPEN SCANNER PORTAL ↗
                      </button>
                      <button
                        onClick={() => setVolModalOpen(true)}
                        className="font-mono text-[9px] tracking-[0.24em] text-[#18c47c] hover:text-[#7dffc4]"
                      >
                        + ENROLL VOLUNTEER
                      </button>
                    </div>
                  }
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">
                      <thead>
                        <tr>
                          <Th>NAME</Th>
                          <Th>EMAIL</Th>
                          <Th>COLLEGE</Th>
                          <Th>ROLE</Th>
                          <Th>ASSIGNED STATION</Th>
                          <Th>ASSIGN ROLE</Th>
                          <Th> </Th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <Row key={u.id}>
                            <Td className="text-[#e7f5ee] font-medium">{u.name}</Td>
                            <Td>{u.email}</Td>
                            <Td>{u.college ?? "—"}</Td>
                            <Td>
                              <span
                                className={`rounded px-1.5 py-0.5 font-mono text-[8px] font-bold ${
                                  u.role === "admin"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : u.role === "volunteer"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-white/5 text-[#88a89b]"
                                }`}
                              >
                                {u.role.toUpperCase()}
                              </span>
                            </Td>
                            <Td className="text-xs text-[#a3c9b7]">{u.station ?? "—"}</Td>
                            <Td>
                              <select
                                value={u.role}
                                onChange={(e) => {
                                  const newRole = e.target.value as "user" | "admin" | "volunteer";
                                  app.updateUserRole(u.id, newRole);
                                  toast(`Updated ${u.name} role to ${newRole.toUpperCase()}`, "ok");
                                }}
                                className="border border-white/10 bg-[#050907] px-2 py-1 font-mono text-[9px] text-[#9fc4b4] outline-none"
                              >
                                <option value="user">User</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="admin">Admin</option>
                              </select>
                            </Td>
                            <Td>
                              {u.id !== user.id && (
                                <button
                                  onClick={() => {
                                    app.removeUser(u.id);
                                    toast("User removed.", "warn");
                                  }}
                                  className="text-[#6f8b80] hover:text-[#f2a98a]"
                                >
                                  REMOVE
                                </button>
                              )}
                            </Td>
                          </Row>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>

                {/* Live Check-ins Feed in Admin */}
                <Panel
                  title={`Live Gate Check-In Audit (${app.checkins.length})`}
                  action={
                    app.checkins.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm("Clear all check-in records?")) {
                            app.clearCheckins();
                            toast("Check-ins cleared.", "warn");
                          }
                        }}
                        className="font-mono text-[9px] tracking-[0.2em] text-[#6f8b80] hover:text-red-400"
                      >
                        CLEAR CHECK-INS
                      </button>
                    )
                  }
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                      <thead>
                        <tr>
                          <Th>TICKET CODE</Th>
                          <Th>ATTENDEE</Th>
                          <Th>EVENT</Th>
                          <Th>STATION</Th>
                          <Th>SCANNED BY</Th>
                          <Th>TIME</Th>
                          <Th>STATUS</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {app.checkins.slice(0, 10).map((c) => (
                          <Row key={c.id}>
                            <Td className="font-mono text-[9px] text-[#719888]">{c.ticketCode}</Td>
                            <Td className="text-white font-medium">{c.attendeeName}</Td>
                            <Td className="text-[#a3c9b7]">{c.eventName}</Td>
                            <Td className="text-[9px]">{c.station}</Td>
                            <Td className="text-[9px] text-[#719888]">{c.scannedBy}</Td>
                            <Td className="text-[9px]">{c.scannedAt}</Td>
                            <Td>
                              <span
                                className={`rounded px-1.5 py-0.5 font-mono text-[8px] font-bold ${
                                  c.status === "approved"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : c.status === "duplicate"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {c.status.toUpperCase()}
                              </span>
                            </Td>
                          </Row>
                        ))}
                        {app.checkins.length === 0 && (
                          <Row>
                            <Td>NO CHECK-INS LOGGED YET.</Td>
                          </Row>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </div>
            )}

            {/* ---------------- STREAMS ---------------- */}
            {section === "Streams" && (
              <div className="grid gap-5 xl:grid-cols-2">
                {content.streams.map((s) => (
                  <Panel key={s.id} title={`${s.index} · ${s.name}`}>
                    <div className="space-y-3">
                      <Input label="Name" value={s.name} onChange={(v) => app.updateStream({ ...s, name: v })} />
                      <Input label="Line" value={s.line} onChange={(v) => app.updateStream({ ...s, line: v })} />
                      <Input
                        label="Description"
                        area
                        value={s.description}
                        onChange={(v) => app.updateStream({ ...s, description: v })}
                      />
                      <Input label="Image URL" value={s.image} onChange={(v) => app.updateStream({ ...s, image: v })} />
                    </div>
                  </Panel>
                ))}
              </div>
            )}

            {/* ---------------- SCHEDULE ---------------- */}
            {section === "Schedule" && (
              <div className="grid gap-5 xl:grid-cols-3">
                {content.schedule.map((d) => (
                  <Panel key={d.id} title={`${d.day} · ${d.title}`}>
                    <div className="space-y-3">
                      <Input label="Title" value={d.title} onChange={(v) => app.updateScheduleDay({ ...d, title: v })} />
                      <Input label="Date" value={d.date} onChange={(v) => app.updateScheduleDay({ ...d, date: v })} />
                      <Input
                        label="Statement"
                        value={d.statement}
                        onChange={(v) => app.updateScheduleDay({ ...d, statement: v })}
                      />
                      <Input
                        label="Description"
                        area
                        value={d.description}
                        onChange={(v) => app.updateScheduleDay({ ...d, description: v })}
                      />
                      <Input
                        label="Intensity (0-1)"
                        value={d.intensity}
                        onChange={(v) => app.updateScheduleDay({ ...d, intensity: Math.min(1, Math.max(0, Number(v) || 0)) })}
                      />
                    </div>
                  </Panel>
                ))}
              </div>
            )}

            {/* ---------------- GALLERY ---------------- */}
            {section === "Gallery" && (
              <Panel
                title={`Gallery (${content.gallery.length})`}
                action={
                  <button
                    onClick={() => setGalleryModalOpen(true)}
                    className="font-mono text-[9px] tracking-[0.24em] text-[#18c47c] hover:text-[#7dffc4]"
                  >
                    + ADD MEDIA (AUTO-FIT)
                  </button>
                }
              >
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {content.gallery.map((g) => (
                    <div key={g.id} className="group relative aspect-[4/3] overflow-hidden border border-[rgba(120,160,145,0.16)] bg-[#030605]">
                      <img
                        src={g.poster ?? g.src}
                        alt={g.caption}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-95"
                      />
                      <div className="absolute left-2 top-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[7px] tracking-wider text-[#18c47c] border border-[#18c47c]/30">
                        {g.span.toUpperCase()}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-[rgba(3,6,5,0.85)] p-2">
                        <p className="truncate font-mono text-[8px] tracking-[0.18em] text-[#b9d3c7]">{g.caption}</p>
                      </div>
                      <button
                        onClick={() => {
                          app.removeGalleryItem(g.id);
                          toast("Media removed.", "warn");
                        }}
                        className="absolute right-2 top-2 bg-[rgba(3,6,5,0.8)] px-2 py-1 font-mono text-[8px] tracking-[0.2em] text-[#f2a98a] opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                      >
                        DELETE
                      </button>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* ---------------- ANNOUNCEMENTS ---------------- */}
            {section === "Announcements" && <AnnouncementManager />}

            {/* ---------------- SPONSORS ---------------- */}
            {section === "Sponsors" && (
              <Panel
                title={`Sponsors (${content.sponsors.length})`}
                action={
                  <button
                    onClick={() =>
                      app.upsertSponsor({
                        id: `s-${Math.random().toString(36).slice(2, 7)}`,
                        name: "NEW PARTNER",
                        tier: "Partner",
                        note: "",
                      } as Sponsor)
                    }
                    className="font-mono text-[9px] tracking-[0.24em] text-[#18c47c] hover:text-[#7dffc4]"
                  >
                    + NEW
                  </button>
                }
              >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {content.sponsors.map((s) => (
                    <div key={s.id} className="space-y-3 border border-[rgba(120,160,145,0.14)] p-4">
                      <Input label="Name" value={s.name} onChange={(v) => app.upsertSponsor({ ...s, name: v })} />
                      <Input label="Tier" value={s.tier} onChange={(v) => app.upsertSponsor({ ...s, tier: v as Sponsor["tier"] })} />
                      <Input label="Note" value={s.note} onChange={(v) => app.upsertSponsor({ ...s, note: v })} />
                      <button
                        onClick={() => app.removeSponsor(s.id)}
                        className="font-mono text-[9px] tracking-[0.22em] text-[#6f8b80] hover:text-[#f2a98a]"
                      >
                        DELETE
                      </button>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* ---------------- TEAM / THE CORE ---------------- */}
            {section === "Team" && (
              <div className="space-y-5">
                <CoreTeamGatePanel />

                <Panel
                  title={`Core Team Roster (${(content.team || []).length} Members)`}
                  action={
                    <button
                      onClick={() =>
                        app.upsertTeamMember({
                          id: `t-${Math.random().toString(36).slice(2, 7)}`,
                          name: "NEW MEMBER",
                          role: "CORE COORDINATOR",
                          dept: "CORE",
                        })
                      }
                      className="font-mono text-[9px] tracking-[0.24em] text-[#18c47c] hover:text-[#7dffc4]"
                    >
                      + NEW MEMBER
                    </button>
                  }
                >
                  <p className="mb-4 font-mono text-[10px] text-[#7d9a8d]">
                    These leadership profiles are featured under "THE CORE" on the public About page. Use the switch above to toggle the whole section ON or OFF.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {(content.team || []).map((m) => (
                      <div key={m.id} className="space-y-3 border border-[rgba(120,160,145,0.14)] p-4 bg-[#050807]">
                        <Input
                          label="Full Name"
                          value={m.name}
                          onChange={(v) => app.upsertTeamMember({ ...m, name: v })}
                        />
                        <Input
                          label="Role / Title"
                          value={m.role}
                          onChange={(v) => app.upsertTeamMember({ ...m, role: v })}
                        />
                        <Input
                          label="Department"
                          value={m.dept}
                          onChange={(v) => app.upsertTeamMember({ ...m, dept: v })}
                        />
                        <button
                          onClick={() => app.removeTeamMember(m.id)}
                          className="font-mono text-[9px] tracking-[0.22em] text-[#6f8b80] hover:text-[#f2a98a]"
                        >
                          REMOVE MEMBER
                        </button>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {/* ---------------- HOMEPAGE ---------------- */}
            {section === "Homepage" && (
              <div className="space-y-5">
                <CoreTeamGatePanel />
                <div className="grid gap-5 xl:grid-cols-2">
                <Panel title="Hero & identity">
                  <div className="space-y-3">
                    <Input label="Brand" value={content.homepage.brand} onChange={(v) => app.setHomepage({ brand: v })} />
                    <Input label="Year mark" value={content.homepage.year} onChange={(v) => app.setHomepage({ year: v })} />
                    <Input label="Kicker" value={content.homepage.kicker} onChange={(v) => app.setHomepage({ kicker: v })} />
                    <Input label="Tagline" value={content.homepage.tagline} onChange={(v) => app.setHomepage({ tagline: v })} />
                    <Input
                      label="Opening line"
                      value={content.homepage.openingLine}
                      onChange={(v) => app.setHomepage({ openingLine: v })}
                    />
                    <Input label="Dates" value={content.homepage.dates} onChange={(v) => app.setHomepage({ dates: v })} />
                    <Input
                      label="Location"
                      value={content.homepage.location}
                      onChange={(v) => app.setHomepage({ location: v })}
                    />
                  </div>
                </Panel>
                <Panel title="Copy & countdown">
                  <div className="space-y-3">
                    <Input label="About" area value={content.homepage.about} onChange={(v) => app.setHomepage({ about: v })} />
                    <Input
                      label="Support copy"
                      area
                      value={content.homepage.aboutSupport}
                      onChange={(v) => app.setHomepage({ aboutSupport: v })}
                    />
                    <Input
                      label="Awakening title"
                      value={content.homepage.awakeningTitle}
                      onChange={(v) => app.setHomepage({ awakeningTitle: v })}
                    />
                    <Input
                      label="Countdown target (ISO)"
                      value={content.homepage.countdownTarget}
                      onChange={(v) => app.setHomepage({ countdownTarget: v })}
                    />
                    <Input
                      label="Primary CTA"
                      value={content.homepage.primaryCta}
                      onChange={(v) => app.setHomepage({ primaryCta: v })}
                    />
                    <Input
                      label="Final CTA"
                      value={content.homepage.finalCta}
                      onChange={(v) => app.setHomepage({ finalCta: v })}
                    />
                  </div>
                </Panel>
              </div>
            </div>
            )}

            {/* ---------------- SETTINGS ---------------- */}
            {section === "Settings" && (
              <div className="space-y-5">
                <RegistrationGatePanel />
                <CoreTeamGatePanel />
                <ConsoleManager />
                <Panel title="Settings">
                <p className="max-w-[60ch] text-[12px] leading-relaxed text-[#7d9a8d]">
                  All content is persisted locally in this browser. In production this store maps 1:1 to a CMS or
                  REST/GraphQL layer — the presentational components never change.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      app.resetContent();
                      toast("Content restored to defaults.", "warn");
                    }}
                    className="btn-cine"
                  >
                    RESET CONTENT
                  </button>
                  <a href="#/" className="btn-cine">
                    VIEW PUBLIC SITE
                  </a>
                </div>
              </Panel>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* event editor */}
      {editing && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center bg-[rgba(2,4,3,0.9)] p-4 backdrop-blur-xl">
          <div className="max-h-[88vh] w-full max-w-[720px] overflow-y-auto border border-[rgba(120,160,145,0.2)] bg-[#060a09] p-6">
            <div className="flex items-center justify-between">
              <h3 className="t-cond text-[26px] text-[#f0f9f5]">EVENT EDITOR</h3>
              <button onClick={() => setEditing(null)} className="font-mono text-[11px] text-[#6f8b80] hover:text-white">
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <Input label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <label className="block">
                <span className="mb-[6px] block font-mono text-[8px] tracking-[0.28em] text-[#4f6f61]">STREAM</span>
                <select
                  className="field"
                  value={editing.stream}
                  onChange={(e) => setEditing({ ...editing, stream: e.target.value as StreamId })}
                >
                  {content.streams.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#060a09]">
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <Input label="Date" value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} />
              <Input label="Time" value={editing.time} onChange={(v) => setEditing({ ...editing, time: v })} />
              <Input label="Venue" value={editing.venue} onChange={(v) => setEditing({ ...editing, venue: v })} />
              <Input label="Prize" value={editing.prize ?? ""} onChange={(v) => setEditing({ ...editing, prize: v })} />
              <Input
                label="Seats"
                type="number"
                value={editing.seats}
                onChange={(v) => setEditing({ ...editing, seats: Number(v) || 0 })}
              />
              <Input
                label="Registered"
                type="number"
                value={editing.registered}
                onChange={(v) => setEditing({ ...editing, registered: Number(v) || 0 })}
              />
              <label className="block">
                <span className="mb-[6px] block font-mono text-[8px] tracking-[0.28em] text-[#4f6f61]">STATUS</span>
                <select
                  className="field"
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as FestEvent["status"] })}
                >
                  {["open", "closing", "full"].map((s) => (
                    <option key={s} value={s} className="bg-[#060a09]">
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-[6px] block font-mono text-[8px] tracking-[0.28em] text-[#4f6f61]">DAY</span>
                <select
                  className="field"
                  value={editing.day}
                  onChange={(e) => setEditing({ ...editing, day: Number(e.target.value) as 1 | 2 | 3 })}
                >
                  {[1, 2, 3].map((d) => (
                    <option key={d} value={d} className="bg-[#060a09]">
                      DAY 0{d}
                    </option>
                  ))}
                </select>
              </label>
              <div className="md:col-span-2">
                <Input label="Image URL" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
              </div>
              <div className="md:col-span-2">
                <Input label="Blurb" area value={editing.blurb} onChange={(v) => setEditing({ ...editing, blurb: v })} />
              </div>
              <label className="flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-[#6f8b80]">
                <input
                  type="checkbox"
                  checked={!!editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                />
                FEATURED
              </label>
            </div>
            <div className="mt-7 flex gap-3">
              <button
                onClick={() => {
                  app.upsertEvent(editing);
                  setEditing(null);
                  toast("Event saved.");
                }}
                className="btn-cine btn-cine--solid"
              >
                SAVE EVENT
              </button>
              <button onClick={() => setEditing(null)} className="btn-cine">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Enrollment Modal */}
      {volModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-[460px] border border-cyan-500/40 bg-[#060e0a] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-cyan-400">
                ENROL NEW FESTIVAL VOLUNTEER
              </span>
              <button onClick={() => setVolModalOpen(false)} className="text-sm text-muted hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleEnrollVolunteer} className="mt-5 space-y-3.5">
              <Input label="Full Name" value={volName} onChange={setVolName} />
              <Input label="Login Email" value={volEmail} onChange={setVolEmail} />
              <Input label="Password" type="password" value={volPw} onChange={setVolPw} />
              <Input label="College / Dept" value={volCollege} onChange={setVolCollege} />
              <div>
                <label className="block font-mono text-[9px] tracking-[0.24em] text-[#4f6f61]">
                  ASSIGNED STATION / GATE
                </label>
                <select
                  value={volStation}
                  onChange={(e) => setVolStation(e.target.value)}
                  className="mt-1 w-full border border-[rgba(120,160,145,0.18)] bg-[#030605] px-3 py-2 font-mono text-[11px] text-[#eef8f3] outline-none"
                >
                  <option value="Gate 1 - Main Entrance">Gate 1 - Main Entrance</option>
                  <option value="Gate 2 - Tech & Hackathon Arena">Gate 2 - Tech & Hackathon Arena</option>
                  <option value="Gate 3 - Cyber CTF Deck">Gate 3 - Cyber CTF Deck</option>
                  <option value="Gate 4 - Cultural Amphitheatre">Gate 4 - Cultural Amphitheatre</option>
                  <option value="Station 5 - Food Court & Wallet Deck">Station 5 - Food Court & Wallet Deck</option>
                  <option value="Station 6 - VIP & Speaker Deck">Station 6 - VIP & Speaker Deck</option>
                </select>
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <button type="submit" className="btn-cine btn-cine--solid flex-1 justify-center">
                  ASSIGN & ENROL VOLUNTEER
                </button>
                <button type="button" onClick={() => setVolModalOpen(false)} className="btn-cine">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Media Upload & Auto-Allocation Modal */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 backdrop-blur-md">
          <div className="w-full max-w-[560px] border border-emerald-500/40 bg-[#060e0a] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div>
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-emerald-400">
                  ADD GALLERY MEDIA (AUTO-ALLOCATE)
                </span>
                <p className="font-mono text-[9px] text-[#6f8b80] mt-0.5">
                  Inspects aspect ratio to display the full image without cropping.
                </p>
              </div>
              <button onClick={() => setGalleryModalOpen(false)} className="text-sm text-muted hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveGalleryMedia} className="mt-5 space-y-4">
              <Input
                label="Image / Video URL"
                value={mediaUrl}
                onChange={handleMediaUrlChange}
              />

              {detectedInfo && (
                <div className="rounded border border-emerald-500/30 bg-emerald-950/40 p-2.5 font-mono text-[9px] text-emerald-300">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{detectedInfo}</span>
                  </div>
                </div>
              )}

              {mediaUrl && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded border border-white/10 bg-black">
                  <img
                    src={mediaUrl}
                    alt="Preview"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute right-2 top-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[8px] text-emerald-400 border border-emerald-500/40">
                    ALLOCATION: {(mediaSpan === "auto" ? detectedSpan : mediaSpan).toUpperCase()}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Caption / Title" value={mediaCaption} onChange={setMediaCaption} />
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.24em] text-[#4f6f61]">
                    ZONE / TAG
                  </label>
                  <select
                    value={mediaTag}
                    onChange={(e) => setMediaTag(e.target.value)}
                    className="mt-1 w-full border border-[rgba(120,160,145,0.18)] bg-[#030605] px-3 py-2 font-mono text-[11px] text-[#eef8f3] outline-none"
                  >
                    <option value="CAMPUS">CAMPUS</option>
                    <option value="ARENA">ARENA</option>
                    <option value="STAGE">STAGE</option>
                    <option value="LABS">LABS</option>
                    <option value="AFTERSHOCK">AFTERSHOCK</option>
                    <option value="NIGHT MARKET">NIGHT MARKET</option>
                    <option value="KEYNOTE">KEYNOTE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-[0.24em] text-[#4f6f61]">
                  GRID SPAN LAYOUT
                </label>
                <select
                  value={mediaSpan}
                  onChange={(e) => setMediaSpan(e.target.value as any)}
                  className="mt-1 w-full border border-[rgba(120,160,145,0.18)] bg-[#030605] px-3 py-2 font-mono text-[11px] text-[#eef8f3] outline-none"
                >
                  <option value="auto">AUTO-ALLOCATE (RECOMMENDED)</option>
                  <option value="wide">WIDE (16:9 Landscape - 2 Columns)</option>
                  <option value="tall">TALL (3:4 Portrait - 2 Rows)</option>
                  <option value="std">STANDARD (4:3 Classic)</option>
                </select>
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <button type="submit" className="btn-cine btn-cine--solid flex-1 justify-center">
                  SAVE TO GALLERY
                </button>
                <button type="button" onClick={() => setGalleryModalOpen(false)} className="btn-cine">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
