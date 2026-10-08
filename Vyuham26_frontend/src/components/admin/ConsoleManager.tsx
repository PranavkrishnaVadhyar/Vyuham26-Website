import { useState } from "react";
import {
  useConsoleConfig,
  CONSOLE_PRESETS,
  type ConsoleConfig,
} from "@/config/consoleConfig";
import { useRegistrationOpen } from "@/config/site";
import { toast } from "@/components/ui/Toaster";
import { cyberAudio } from "@/lib/cyberAudio";

interface ModuleMeta {
  key: keyof ConsoleConfig;
  title: string;
  badgeCode: string;
  commands: string[];
  description: string;
  warning?: string;
  recommendedPublishState: boolean;
}

const MODULES: ModuleMeta[] = [
  {
    key: "showAccount",
    title: "Account & Registration Gateway",
    badgeCode: "AUTH // ACC-01",
    commands: ["register", "login", "signup", "dashboard", "profile", "ticket"],
    description:
      "Controls attendee account registration, login portals, participant dashboards, and digital ticketing pass commands in the public terminal.",
    warning:
      "Recommended OFF for public pre-launch until registrations officially commence.",
    recommendedPublishState: false,
  },
  {
    key: "showFestival",
    title: "Festival Operations & Live Tracking",
    badgeCode: "OPS // FEST-02",
    commands: [
      "certificates",
      "leaderboard",
      "results",
      "qualifiers",
      "food",
      "checkin",
      "teams",
      "sponsors",
      "announcements",
      "faq",
      "contact",
      "support",
      "feedback",
      "photography",
    ],
    description:
      "Controls live standings, certificates, competition qualifiers, food court services, and on-ground festival check-in commands.",
    warning:
      "Recommended OFF until festival kickoff (30 OCT 2026). Live scoring and qualifier brackets are not active yet.",
    recommendedPublishState: false,
  },
  {
    key: "showRootGateway",
    title: "Root Gateway (Admin Overrides)",
    badgeCode: "ROOT // SEC-00",
    commands: ["reg:status"],
    description:
      "Controls whether administrative telemetry is displayed. Note: Registration open and close can strictly only be modified by administrators directly inside the Admin Dashboard.",
    warning:
      "Keep OFF for public publication to keep administrative diagnostics hidden from attendees.",
    recommendedPublishState: false,
  },
];

export function getDynamicHelpPreview(config: ConsoleConfig): string {
  const sections: string[] = [];

  sections.push("VYUHAM’26 TERMINAL");

  sections.push(`EXPLORE
  events        - Explore festival events
  schedule      - Festival journey
  streams       - Technology / Culture / Gaming / Management
  about         - Discover VYUHAM’26
  venue         - Explore the festival venue
  gallery       - Open the cinematic gallery`);

  if (config.showAccount) {
    sections.push(`ACCOUNT
  register      - Event registration
  login         - Login portal
  signup        - Create an account
  dashboard     - Participant dashboard
  profile       - Participant profile
  ticket        - Digital festival pass`);
  }

  if (config.showFestival) {
    sections.push(`FESTIVAL
  certificates  - Certificates
  leaderboard   - Live standings
  results       - Competition results
  qualifiers    - Qualifier information
  food          - Food & campus services
  checkin       - Festival check-in
  teams         - Registered teams
  sponsors      - Sponsors & partners
  announcements - Official announcements
  faq           - Frequently asked questions
  contact       - Contact VYUHAM
  support       - Support center
  feedback      - Festival feedback
  photography   - Photography experience`);
  }

  sections.push(`IDENTITY
  logo          - Display VYUHAM identity
  status        - Festival system status
  whoami        - Current terminal session`);

  // Root gateway overrides removed from console per security requirements

  sections.push(`TERMINAL
  help          - Show available commands
  clear / cls   - Clear terminal
  exit / quit   - Close terminal`);

  return sections.join("\n\n");
}

export default function ConsoleManager() {
  const [config, updateConfig] = useConsoleConfig();
  const regOpen = useRegistrationOpen();
  const [previewTab, setPreviewTab] = useState<"terminal" | "details">("terminal");

  const handleToggle = (key: keyof ConsoleConfig) => {
    cyberAudio.playTelemetry();
    const nextVal = !config[key];
    updateConfig({ [key]: nextVal });
    toast(
      `Console Module [${key}]: ${nextVal ? "ENABLED (VISIBLE)" : "DISABLED (HIDDEN)"}`,
      nextVal ? "ok" : "warn"
    );
  };

  const handleApplyPreset = (presetKey: keyof typeof CONSOLE_PRESETS) => {
    cyberAudio.playTelemetry();
    const preset = CONSOLE_PRESETS[presetKey];
    updateConfig(preset.config);
    toast(`Preset applied: ${preset.name}`, "ok");
  };

  const isPublicSafe =
    !config.showAccount && !config.showFestival && !config.showRootGateway;

  const openTerminal = () => {
    cyberAudio.playTelemetry();
    window.dispatchEvent(new CustomEvent("open-cyber-terminal"));
  };

  return (
    <div className="space-y-6">
      {/* Top Status & Security Bar */}
      <div
        className={`relative overflow-hidden border p-5 transition-all duration-300 ${
          isPublicSafe
            ? "border-emerald-500/40 bg-gradient-to-r from-[rgba(6,25,18,0.92)] to-[rgba(4,18,13,0.75)] shadow-[0_0_25px_rgba(24,196,124,0.12)]"
            : "border-amber-500/40 bg-gradient-to-r from-[rgba(25,18,6,0.92)] to-[rgba(18,12,4,0.75)] shadow-[0_0_25px_rgba(245,158,11,0.12)]"
        }`}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-xl"
          style={{
            background: isPublicSafe
              ? "radial-gradient(circle, rgba(24,196,124,0.22), transparent 70%)"
              : "radial-gradient(circle, rgba(245,158,11,0.22), transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isPublicSafe
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
                    : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                }`}
              />
              <span
                className={`font-mono text-[11px] font-bold tracking-[0.24em] uppercase ${
                  isPublicSafe ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                CONSOLE GATEWAY POLICY:{" "}
                {isPublicSafe ? "PRE-LAUNCH SAFE (PUBLISH READY)" : "CUSTOM PROTOCOL ACTIVE"}
              </span>
              <span className="font-mono text-[8px] tracking-[0.16em] text-[#6f8b80] border border-[rgba(120,160,145,0.2)] px-2 py-0.5 rounded">
                LIVE TERMINAL
              </span>
            </div>

            <p className="font-mono text-[11px] text-[#c6ded3] max-w-[760px] leading-relaxed">
              {isPublicSafe
                ? "The cyber terminal is running in Production Safe Mode. Account authentication, festival operations, and root gateway overrides are completely hidden from public visitors. Only public festival exploration commands are exposed."
                : "One or more sensitive console modules are enabled. Ensure you lock root commands before website publication to prevent attendee exposure."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] font-mono text-[#8eb0a2]">
              <span>
                REGISTRATION GATEWAY:{" "}
                <strong className={regOpen ? "text-emerald-400" : "text-amber-400"}>
                  {regOpen ? "OPEN & LIVE" : "CLOSED (COMING SOON)"}
                </strong>
              </span>
              <span>•</span>
              <span>
                ACTIVE CONSOLE MODULES:{" "}
                <strong className="text-white">
                  {[
                    config.showAccount && "ACCOUNT",
                    config.showFestival && "FESTIVAL",
                    config.showRootGateway && "ROOT",
                  ]
                    .filter(Boolean)
                    .join(", ") || "EXPLORE ONLY (SECURED)"}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openTerminal}
              className="flex items-center gap-2 border border-emerald-500/40 bg-emerald-950/40 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] text-emerald-300 transition-all hover:bg-emerald-900/60 hover:text-white"
            >
              <span>TEST TERMINAL (`~`)</span>
              <span>↗</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("PUBLIC_SAFE")}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${
                isPublicSafe
                  ? "border border-emerald-500/30 bg-emerald-950/20 text-emerald-400/80 cursor-default"
                  : "border border-emerald-500 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/40 hover:text-white shadow-[0_0_15px_rgba(24,196,124,0.3)] cursor-pointer"
              }`}
            >
              <span>🛡️ ONE-CLICK PUBLISH SAFE</span>
            </button>
          </div>
        </div>
      </div>

      {/* One-Click Presets Grid */}
      <div className="border border-[rgba(120,160,145,0.16)] bg-[#060a09] p-5">
        <div className="mb-4 flex items-center justify-between border-b border-[rgba(120,160,145,0.12)] pb-3">
          <div>
            <h3 className="font-mono text-[10px] tracking-[0.28em] text-[#9fc4b4] uppercase">
              QUICK LAUNCH PRESETS
            </h3>
            <p className="font-mono text-[9px] text-[#6f8b80] mt-0.5">
              Instantly configure the terminal for website publication, registration launch, or festival live days.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            Object.keys(CONSOLE_PRESETS) as Array<keyof typeof CONSOLE_PRESETS>
          ).map((pKey) => {
            const p = CONSOLE_PRESETS[pKey];
            const isCurrent =
              config.showAccount === p.config.showAccount &&
              config.showFestival === p.config.showFestival &&
              config.showRootGateway === p.config.showRootGateway;

            return (
              <div
                key={pKey}
                className={`relative flex flex-col justify-between border p-3.5 transition-all ${
                  isCurrent
                    ? "border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_15px_rgba(24,196,124,0.15)]"
                    : "border-[rgba(120,160,145,0.16)] bg-[#030605] hover:border-[rgba(120,160,145,0.35)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-[#eef8f3]">
                      {p.name}
                    </span>
                    <span
                      className={`font-mono text-[7px] tracking-[0.18em] px-1.5 py-0.5 rounded border ${
                        pKey === "PUBLIC_SAFE"
                          ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/40"
                          : "border-[rgba(120,160,145,0.25)] text-[#8eb0a2]"
                      }`}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[9px] leading-relaxed text-[#7e9e90]">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[rgba(120,160,145,0.1)]">
                  {isCurrent ? (
                    <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>CURRENT CONFIGURATION</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(pKey)}
                      className="w-full border border-[rgba(120,160,145,0.25)] bg-[rgba(120,160,145,0.06)] py-1.5 font-mono text-[9px] font-bold tracking-[0.18em] text-[#a9cebe] hover:border-emerald-500/60 hover:bg-emerald-950/40 hover:text-emerald-300 transition-colors"
                    >
                      APPLY PRESET
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Configuration Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-[10px] tracking-[0.28em] text-[#9fc4b4] uppercase">
            INDIVIDUAL MODULE CONTROLS
          </h3>
          <span className="font-mono text-[9px] text-[#6f8b80]">
            Changes synchronize reactively across all terminal instances.
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {MODULES.map((mod) => {
            const isEnabled = config[mod.key];
            return (
              <div
                key={mod.key}
                className={`relative flex flex-col justify-between border p-5 transition-all ${
                  isEnabled
                    ? "border-cyan-500/40 bg-gradient-to-b from-[#081512] to-[#040907] shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                    : "border-[rgba(120,160,145,0.18)] bg-[#040807]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[8px] tracking-[0.24em] text-[#4f6f61]">
                        {mod.badgeCode}
                      </span>
                      <h4 className="font-mono text-[12px] font-bold tracking-[0.16em] text-[#eef8f3] mt-0.5">
                        {mod.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(mod.key)}
                      aria-label={`Toggle ${mod.title}`}
                      className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled
                          ? "border-emerald-400 bg-emerald-500/40"
                          : "border-zinc-700 bg-zinc-900"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isEnabled
                            ? "translate-x-6 bg-emerald-300"
                            : "translate-x-0.5 bg-zinc-400"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        isEnabled
                          ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                          : "bg-zinc-600"
                      }`}
                    />
                    <span
                      className={`font-mono text-[9px] font-bold tracking-[0.2em] uppercase ${
                        isEnabled ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    >
                      {isEnabled ? "ACTIVE (VISIBLE IN CONSOLE)" : "LOCKED & HIDDEN"}
                    </span>
                  </div>

                  <p className="mt-3 font-mono text-[10px] leading-relaxed text-[#8ca89c]">
                    {mod.description}
                  </p>

                  <div className="mt-4">
                    <span className="block font-mono text-[8px] tracking-[0.24em] text-[#4f6f61] uppercase">
                      COMMANDS GOVERNED
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {mod.commands.map((cmd) => (
                        <span
                          key={cmd}
                          className={`font-mono text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                            isEnabled
                              ? "border-cyan-500/30 bg-cyan-950/30 text-cyan-200"
                              : "border-[rgba(120,160,145,0.12)] bg-[#030605] text-[#557165]"
                          }`}
                        >
                          {cmd}
                        </span>
                      ))}
                    </div>
                  </div>

                  {mod.warning && (
                    <div className="mt-4 rounded border border-amber-500/20 bg-amber-950/20 p-2 text-[9px] font-mono text-amber-300/80">
                      ⚠ {mod.warning}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[rgba(120,160,145,0.12)]">
                  <button
                    type="button"
                    onClick={() => handleToggle(mod.key)}
                    className={`w-full py-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${
                      isEnabled
                        ? "border border-red-500/40 bg-red-950/30 text-red-300 hover:bg-red-900/50 hover:text-white"
                        : "border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 hover:text-white"
                    }`}
                  >
                    {isEnabled ? "HIDE & LOCK MODULE" : "ENABLE FOR VISITORS"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="border border-[rgba(120,160,145,0.16)] bg-[#060a09] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(120,160,145,0.12)] pb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.28em] text-[#9fc4b4] uppercase">
              LIVE VISITOR TERMINAL MANUAL PREVIEW
            </span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-emerald-400 border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 rounded">
              REAL-TIME
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewTab("terminal")}
              className={`px-3 py-1 font-mono text-[9px] tracking-[0.2em] uppercase transition-colors ${
                previewTab === "terminal"
                  ? "border-b-2 border-emerald-400 text-white"
                  : "text-[#6f8b80] hover:text-[#9fc4b4]"
              }`}
            >
              PREVIEW (OUTPUT FOR 'help')
            </button>
            <button
              type="button"
              onClick={openTerminal}
              className="flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-emerald-300 hover:bg-emerald-900/50 hover:text-white"
            >
              <span>OPEN CYBER TERMINAL</span>
              <span>↗</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="rounded-xl border border-emerald-500/20 bg-[#020604] p-4 font-mono text-xs text-emerald-300/90 shadow-inner">
            <div className="mb-2 flex items-center justify-between border-b border-emerald-500/10 pb-2 text-[9px] text-[#5d7c6e]">
              <span>TERMINAL SESSION // VISITOR VIEW SIMULATION</span>
              <span>INPUT: $ help</span>
            </div>
            <pre className="max-h-[380px] overflow-y-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-emerald-200/90 select-text">
              {getDynamicHelpPreview(config)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
