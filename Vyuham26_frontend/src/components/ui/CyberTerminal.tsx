import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "@/shims/next-link";
import { lockScroll } from "@/lib/scroll";
import { useApp } from "@/lib/store";
import {
  SITE_CONFIG,
  setRegistrationOpen,
  isRegistrationOpen,
  setCoreTeamVisible,
  isCoreTeamVisible,
  setSponsorsVisible,
  isSponsorsVisible,
} from "@/config/site";
import { useConsoleConfig, type ConsoleConfig } from "@/config/consoleConfig";
import { cyberAudio } from "@/lib/cyberAudio";
import { navigate, markInternalNav } from "@/lib/router";
import { toast } from "@/components/ui/Toaster";

interface HistoryItem {
  type: "input" | "output" | "system" | "error" | "ascii";
  content: string;
  link?: string;
  linkText?: string;
}

const ASCII_LOGO = `
██╗   ██╗██╗   ██╗██╗  ██╗██╗  ██╗ █████╗ ███╗   ███╗
██║   ██║╚██╗ ██╔╝██║  ██║██║  ██║██╔══██╗████╗ ████║
██║   ██║ ╚████╔╝ ███████║███████║███████║██╔████╔██║
╚██╗ ██╔╝  ╚██╔╝  ██╔══██║██╔══██║██╔══██║██║╚██╔╝██║
 ╚████╔╝    ██║   ██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║
  ╚═══╝     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
`;

const INITIAL_WELCOME: HistoryItem[] = [
  {
    type: "ascii",
    content: ASCII_LOGO,
  },
  {
    type: "system",
    content:
      "VYUHAM’26 // CINEMATIC TERMINAL ONLINE\nExplore the festival, streams, schedule and experience. Type 'help' for commands.",
  },
];

export function getDynamicHelpText(config: ConsoleConfig, isAdmin: boolean): string {
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

  if (config.showRootGateway || isAdmin) {
    sections.push(`ROOT GATEWAY (ADMIN)
  reg:open      - Turn ON festival registrations
  reg:close     - Turn OFF festival registrations
  reg:status    - Check live gateway status`);
  }

  sections.push(`TERMINAL
  help          - Show available commands
  clear / cls   - Clear terminal
  exit / quit   - Close terminal`);

  return sections.join("\n\n");
}

export default function CyberTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_WELCOME);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [consoleConfig] = useConsoleConfig();
  const { ui } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalBoxRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Activate standard mouse pointer and lock background scrolling while console is open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("terminal-open");
      lockScroll(true);
      // Auto-focus command prompt with staggered timers for reliability
      inputRef.current?.focus();
      const t1 = setTimeout(() => inputRef.current?.focus(), 40);
      const t2 = setTimeout(() => inputRef.current?.focus(), 160);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      document.documentElement.classList.remove("terminal-open");
      lockScroll(false);
    }
    return () => {
      document.documentElement.classList.remove("terminal-open");
      lockScroll(false);
    };
  }, [isOpen]);

  // Activate native mouse wheel scrolling across the entire terminal dialog
  useEffect(() => {
    const box = terminalBoxRef.current;
    const scrollEl = scrollContainerRef.current;
    if (!box || !scrollEl || !isOpen) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      scrollEl.scrollTop += e.deltaY;
    };

    box.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      box.removeEventListener("wheel", onWheel);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      const isInput =
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        activeTag === "SELECT" ||
        (document.activeElement as HTMLElement)?.isContentEditable;
      const isTerminalInput = document.activeElement === inputRef.current;

      const isBackquote =
        event.key === "`" ||
        event.key === "~" ||
        event.code === "Backquote";

      // Toggle shortcuts:
      // - Backtick / Tilde (when not in a regular page input)
      // - Ctrl+` or Cmd+` (works anywhere!)
      // - Ctrl+K or Cmd+K (works anywhere!)
      // - Ctrl+/ or Cmd+/ (works anywhere!)
      const isTerminalShortcut =
        ((event.ctrlKey || event.metaKey) &&
          (event.key.toLowerCase() === "k" ||
            isBackquote ||
            event.key === "/" ||
            event.code === "Slash")) ||
        (!isInput && isBackquote) ||
        (isTerminalInput && isBackquote && inputVal === "");

      if (isTerminalShortcut) {
        event.preventDefault();
        setIsOpen((previous) => !previous);
        return;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-cyber-terminal", handleOpenEvent);
    window.addEventListener("open-vyuham-terminal", handleOpenEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-cyber-terminal", handleOpenEvent);
      window.removeEventListener("open-vyuham-terminal", handleOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    terminalEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [history, isOpen]);

  const addOutput = useCallback(
    (
      content: string,
      link?: string,
      linkText?: string,
      type: HistoryItem["type"] = "output"
    ) => {
      setHistory((previous) => [
        ...previous,
        { type, content, link, linkText },
      ]);
    },
    []
  );

  const processCommand = useCallback(
    (rawCommand: string) => {
      const trimmed = rawCommand.trim();

      if (!trimmed) return;

      const parts = trimmed.split(/\s+/);
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);

      setHistory((previous) => [
        ...previous,
        {
          type: "input",
          content: `$ ${trimmed}`,
        },
      ]);

      setCmdHistory((previous) => [...previous, trimmed]);
      setHistoryIndex(-1);
      setInputVal("");

      switch (command) {
        case "help":
          addOutput(
            getDynamicHelpText(consoleConfig, ui.adminUnlocked),
            undefined,
            undefined,
            "system"
          );
          break;

        case "events":
          addOutput(
            `VYUHAM’26 EVENTS

Discover competitions, experiences and challenges across the four streams.

01  TECHNOLOGY
    Build what comes next.

02  CULTURE
    Express what defines us.

03  GAMING
    Challenge the limits.

04  MANAGEMENT
    Lead, strategize, build empires.`,
            "/events",
            "Explore all events →"
          );
          break;

        case "schedule":
          addOutput(
            `THE JOURNEY

DAY 01 — IGNITION
30 OCT 2026

DAY 02 — CONVERGENCE
31 OCT 2026

DAY 03 — AFTERSHOCK
01 NOV 2026

Three days. One journey into what comes next.`,
            "/schedule",
            "Open the journey →"
          );
          break;

        case "streams":
          addOutput(
            `FOUR STREAMS

TECHNOLOGY
Build what comes next.

CULTURE
Express what defines us.

GAMING
Challenge the limits.

MANAGEMENT
Lead, strategize, build empires.`,
            "/#streams",
            "Explore the four streams →"
          );
          break;

        case "about":
          addOutput(
            `VYUHAM’26

A convergence of technology, culture, gaming and management —

bringing together ideas, creativity, competition and people
shaping what comes next.

THE FUTURE AWAITS.`,
            "/#about",
            "Discover VYUHAM’26 →"
          );
          break;

        case "venue":
          addOutput(
            `THE EXPERIENCE

Digital University Kerala
Technocity, Thiruvananthapuram, Kerala

A campus where technology, people, creativity and culture
come together.`,
            "/venue",
            "Explore the venue →"
          );
          break;

        case "gallery":
          addOutput(
            `[CINEMATIC ARCHIVE]

A visual collection of VYUHAM moments, people, campus life,
competitions, performances and experiences.`,
            "/#gallery",
            "Open the gallery →"
          );
          break;

        case "register":
          if (!consoleConfig.showAccount) {
            addOutput(
              `[MODULE RESTRICTED // ACCOUNT GATEWAY]

Participant registration commands are currently locked by administration.
Public pre-launch mode active. Check official festival schedule & announcements for enrollment opening.`,
              "/events",
              "Explore public events directory →",
              "system"
            );
            break;
          }
          if (!SITE_CONFIG.REG_OPEN) {
            addOutput(
              `[REGISTRATION]

Registration is coming soon! All public festival pages remain open.`,
              "/events",
              "Explore events directory →"
            );
          } else {
            addOutput(
              `[REGISTRATION]

Choose an event and become part of the VYUHAM’26 journey.`,
              "/register",
              "Explore registration →"
            );
          }
          break;

        case "login":
          if (!consoleConfig.showAccount) {
            addOutput(
              `[MODULE RESTRICTED // ACCOUNT GATEWAY]

Participant authentication is currently locked by administration.
Public pre-launch mode active.`,
              "/schedule",
              "View festival schedule →",
              "system"
            );
            break;
          }
          if (!SITE_CONFIG.REG_OPEN) {
            addOutput(
              `[LOGIN]

Operative authentication is currently locked. Coming soon!`,
              "/schedule",
              "View festival schedule →"
            );
          } else {
            addOutput(
              `[LOGIN]

Access your VYUHAM’26 participant account.`,
              "/login",
              "Open login →"
            );
          }
          break;

        case "signup":
          if (!consoleConfig.showAccount) {
            addOutput(
              `[MODULE RESTRICTED // ACCOUNT GATEWAY]

Participant account creation is currently locked by administration.
Public pre-launch mode active.`,
              "/events",
              "Browse events →",
              "system"
            );
            break;
          }
          if (!isRegistrationOpen()) {
            addOutput(
              `[CREATE ACCOUNT]

Account creation is currently locked. Coming soon!`,
              "/events",
              "Browse events →"
            );
          } else {
            addOutput(
              `[CREATE ACCOUNT]

Create your VYUHAM’26 participant profile.`,
              "/signup",
              "Create account →"
            );
          }
          break;

        case "dashboard":
          if (!consoleConfig.showAccount) {
            addOutput(
              `[MODULE RESTRICTED // ACCOUNT GATEWAY]

Participant dashboard access is currently locked by administration.`,
              "/schedule",
              "View schedule →",
              "system"
            );
            break;
          }
          if (!isRegistrationOpen()) {
            addOutput(
              `[PARTICIPANT DASHBOARD]

Dashboard access is coming soon alongside registration launch.`,
              "/schedule",
              "View schedule →"
            );
          } else {
            addOutput(
              `[PARTICIPANT DASHBOARD]

View registrations, tickets, certificates and festival activity.`,
              "/dashboard",
              "Open dashboard →"
            );
          }
          break;

        case "profile":
          if (!consoleConfig.showAccount) {
            addOutput(
              `[MODULE RESTRICTED // ACCOUNT GATEWAY]

Participant profile management is currently locked by administration.`,
              "/about",
              "Learn about Vyuham →",
              "system"
            );
            break;
          }
          if (!isRegistrationOpen()) {
            addOutput(
              `[PROFILE]

Profile management will open when registration launches.`,
              "/about",
              "Learn about Vyuham →"
            );
          } else {
            addOutput(
              `[PROFILE]

Manage your participant information and VYUHAM activity.`,
              "/profile",
              "Open profile →"
            );
          }
          break;

        case "admin":
        case "root":
        case "sudo":
        case "root26":
        case "admin26":
        case "vyuhamadmin": {
          const pass = (args[0] || "").toLowerCase();
          const validPassphrases = [
            "root26",
            "admin26",
            "vyuhamadmin",
            "vyuham26",
            "admin",
            "root",
          ];
          const isSecret =
            validPassphrases.includes(pass) ||
            command === "root26" ||
            command === "admin26" ||
            command === "vyuhamadmin" ||
            (args.length === 0 && (command === "admin" || command === "root"));

          if (isSecret || ui.adminUnlocked) {
            ui.setAdminUnlocked(true);
            markInternalNav();
            cyberAudio.playTelemetry();
            addOutput(
              `[AUTHENTICATION GRANTED]
Welcome, Administrator. Level-0 Root clearance verified.
Redirecting to Operations Console...`,
              "/admin",
              "Enter Admin Operations Console →",
              "system"
            );
            toast("⚡ [ADMIN ACCESS GRANTED] Operations Console Unlocked", "ok");
            setTimeout(() => {
              navigate("/admin");
              setIsOpen(false);
            }, 600);
          } else if (args.length > 0) {
            addOutput(
              `[ACCESS DENIED] Invalid authorization signature for '${pass}'.
Type 'admin root26' or visit the Cyber Gate.`,
              "/admin",
              "Open Cyber Gate →",
              "error"
            );
            toast("⛔ [ACCESS DENIED] Invalid authorization signature", "warn");
          } else {
            addOutput(
              `[RESTRICTED PROTOCOL // ADMIN GATEWAY]
Direct administrative console requires authentication.
Use: 'admin <passphrase>' (e.g. 'admin root26') or press Ctrl+Shift+A.`,
              "/admin",
              "Open Admin Gateway (Cyber Gate) →",
              "system"
            );
          }
          break;
        }

        case "ticket":
          if (!consoleConfig.showAccount) {
            addOutput(
              `[MODULE RESTRICTED // TICKETING]

Digital pass retrieval is currently locked by administration.
Public pre-launch mode active.`,
              "/schedule",
              "View festival schedule →",
              "system"
            );
            break;
          }
          addOutput(
            `[DIGITAL PASS]

View your VYUHAM’26 festival access pass.`,
            "/ticket",
            "View ticket →"
          );
          break;

        case "certificates":
          if (!consoleConfig.showFestival) {
            addOutput(
              `[MODULE RESTRICTED // FESTIVAL OPERATIONS]

Festival live operations and certificates are scheduled for festival kickoff (30 OCT — 01 NOV 2026).
Module is currently locked by administration.`,
              "/schedule",
              "View festival schedule →",
              "system"
            );
            break;
          }
          addOutput(
            `[CERTIFICATES]

Access official participation and achievement certificates.`,
            "/certificates",
            "Open certificates →"
          );
          break;

        case "leaderboard":
          if (!consoleConfig.showFestival) {
            addOutput(
              `[MODULE RESTRICTED // FESTIVAL OPERATIONS]

Live standings and competition leaderboards will activate on event days.
Module is currently locked by administration.`,
              "/schedule",
              "View festival schedule →",
              "system"
            );
            break;
          }
          addOutput(
            `[LEADERBOARD]

Follow team standings and competition progress.`,
            "/leaderboard",
            "View leaderboard →"
          );
          break;

        case "results":
          if (!consoleConfig.showFestival) {
            addOutput(
              `[MODULE RESTRICTED // FESTIVAL OPERATIONS]

Competition results and finalist announcements will be published during festival days.
Module is currently locked by administration.`,
              "/schedule",
              "View festival schedule →",
              "system"
            );
            break;
          }
          addOutput(
            `[RESULTS]

View official competition results and finalist information.`,
            "/results",
            "View results →"
          );
          break;

        case "qualifiers":
          if (!consoleConfig.showFestival) {
            addOutput(
              `[MODULE RESTRICTED // FESTIVAL OPERATIONS]

Qualifier schedules and matchup brackets will activate on event days.
Module is currently locked by administration.`,
              "/schedule",
              "View festival schedule →",
              "system"
            );
            break;
          }
          addOutput(
            `[QUALIFIERS]

Explore qualifier schedules, matchups and advancement information.`,
            "/qualifiers",
            "Open qualifiers →"
          );
          break;

        case "food":
          if (!consoleConfig.showFestival) {
            addOutput(
              `[MODULE RESTRICTED // FESTIVAL OPERATIONS]

Campus food services, stall menus, and food wallet activate during festival kickoff.
Module is currently locked by administration.`,
              "/venue",
              "Explore venue information →",
              "system"
            );
            break;
          }
          addOutput(
            `[CAMPUS EXPERIENCE]

Food, wallet and festival vendor services.`,
            "/food",
            "Open campus services →"
          );
          break;

        case "checkin":
          if (!consoleConfig.showFestival) {
            addOutput(
              `[MODULE RESTRICTED // FESTIVAL OPERATIONS]

Festival on-ground check-in opens on event day at campus gates.
Module is currently locked by administration.`,
              "/venue",
              "Explore venue information →",
              "system"
            );
            break;
          }
          addOutput(
            `[CHECK-IN]

Access the festival check-in experience.`,
            "/checkin",
            "Open check-in →"
          );
          break;

        case "teams":
          if (!consoleConfig.showFestival) {
            addOutput(
              `[MODULE RESTRICTED // FESTIVAL OPERATIONS]

Registered team rosters and verification activate closer to festival start.
Module is currently locked by administration.`,
              "/schedule",
              "View festival schedule →",
              "system"
            );
            break;
          }
          addOutput(
            `[TEAMS]

Explore registered teams and participants.`,
            "/teams",
            "View teams →"
          );
          break;

        case "sponsors":
          addOutput(
            `[PARTNERS]

Discover the organisations supporting VYUHAM’26.`,
            "/sponsors",
            "View partners →"
          );
          break;

        case "announcements":
          addOutput(
            `[ANNOUNCEMENTS]

Official VYUHAM’26 updates and festival information.`,
            "/announcements",
            "Open announcements →"
          );
          break;

        case "faq":
          addOutput(
            `[FAQ]

Find answers about registration, events, payments, venue and participation.`,
            "/faq",
            "Open FAQ →"
          );
          break;

        case "contact":
          addOutput(
            `[CONTACT]

Reach the VYUHAM’26 team for official enquiries.`,
            "/contact",
            "Open contact →"
          );
          break;

        case "support":
          addOutput(
            `[SUPPORT]

Get help with registration, payments and festival participation.`,
            "/support",
            "Open support →"
          );
          break;

        case "feedback":
          addOutput(
            `[FEEDBACK]

Share your VYUHAM’26 experience.`,
            "/feedback",
            "Send feedback →"
          );
          break;

        case "photography":
          addOutput(
            `[PHOTOGRAPHY]

Explore the photography experience and curated visual stories.`,
            "/photography",
            "Open photography →"
          );
          break;

        case "logo":
          addOutput(ASCII_LOGO, undefined, undefined, "ascii");
          break;

        case "whoami":
          addOutput(
            `VYUHAM’26 PARTICIPANT SESSION

Role   : Visitor
Access : Public
Theme  : Cinematic / Immersive
Status : CONNECTED`
          );
          break;

        case "status":
          addOutput(
            `VYUHAM’26 SYSTEM STATUS

WEBSITE       : ONLINE
EVENTS        : AVAILABLE
SCHEDULE      : AVAILABLE
STREAMS       : 4
FESTIVAL      : 30 OCT — 01 NOV 2026
ENVIRONMENT   : CINEMATIC
STATUS        : NOMINAL`
          );
          break;

        case "clear":
        case "cls":
          setHistory([]);
          return;

        case "exit":
        case "quit":
        case "close":
          setIsOpen(false);
          return;

        case "reg:open":
        case "registration:open":
        case "reg-open":
          if (!consoleConfig.showRootGateway && !ui.adminUnlocked) {
            addOutput(
              `[RESTRICTED PROTOCOL // ROOT PRIVILEGE REQUIRED]

Administrative root clearance required to execute registration gateway overrides.
Clearance signature not verified. Type 'admin <passphrase>' or unlock via Cyber Gate.`,
              "/admin",
              "Open Admin Gateway (Cyber Gate) →",
              "error"
            );
            break;
          }
          setRegistrationOpen(true);
          cyberAudio.playTelemetry();
          addOutput(
            `[ROOT OVERRIDE GRANTED]

FESTIVAL REGISTRATION GATEWAY: OPEN & LIVE
- Public registration routes unlocked (/register, /checkout)
- Event registration buttons activated
- Attendee enrollment protocol: NOMINAL`,
            "/register",
            "Open registration portal →"
          );
          break;

        case "reg:close":
        case "registration:close":
        case "reg-close":
          if (!consoleConfig.showRootGateway && !ui.adminUnlocked) {
            addOutput(
              `[RESTRICTED PROTOCOL // ROOT PRIVILEGE REQUIRED]

Administrative root clearance required to execute registration gateway overrides.
Clearance signature not verified. Type 'admin <passphrase>' or unlock via Cyber Gate.`,
              "/admin",
              "Open Admin Gateway (Cyber Gate) →",
              "error"
            );
            break;
          }
          setRegistrationOpen(false);
          cyberAudio.playTelemetry();
          addOutput(
            `[ROOT OVERRIDE GRANTED]

FESTIVAL REGISTRATION GATEWAY: CLOSED
- Public portals set to COMING SOON
- Registration forms locked
- Security gate active: SAFEGUARDED`
          );
          break;

        case "reg:status":
        case "registration:status":
          if (!consoleConfig.showRootGateway && !ui.adminUnlocked) {
            addOutput(
              `[RESTRICTED PROTOCOL // ROOT PRIVILEGE REQUIRED]

Administrative root clearance required to inspect gateway telemetry.
Clearance signature not verified. Type 'admin <passphrase>' or unlock via Cyber Gate.`,
              "/admin",
              "Open Admin Gateway (Cyber Gate) →",
              "error"
            );
            break;
          }
          addOutput(
            `FESTIVAL REGISTRATION GATEWAY STATUS:

GATE STATUS : ${isRegistrationOpen() ? "OPEN (LIVE)" : "CLOSED (COMING SOON)"}
AUDIT       : LOCAL_STORAGE_PERSISTED
ACCESS      : ADMIN ROOT TOGGLEABLE`
          );
          break;

        case "core:show":
        case "core:on":
        case "team:show":
        case "team:on":
          if (!consoleConfig.showRootGateway && !ui.adminUnlocked) {
            addOutput(
              `[RESTRICTED PROTOCOL // ROOT PRIVILEGE REQUIRED]

Administrative root clearance required to execute core showcase overrides.`,
              "/admin",
              "Open Admin Gateway (Cyber Gate) →",
              "error"
            );
            break;
          }
          setCoreTeamVisible(true);
          cyberAudio.playTelemetry();
          addOutput(
            `[ROOT OVERRIDE GRANTED]

THE CORE SHOWCASE: ACTIVATED & VISIBLE
- Leadership roster is now visible on public About section.
- Section: '06 — ABOUT -> THE CORE'`
          );
          break;

        case "core:hide":
        case "core:off":
        case "team:hide":
        case "team:off":
          if (!consoleConfig.showRootGateway && !ui.adminUnlocked) {
            addOutput(
              `[RESTRICTED PROTOCOL // ROOT PRIVILEGE REQUIRED]

Administrative root clearance required to execute core showcase overrides.`,
              "/admin",
              "Open Admin Gateway (Cyber Gate) →",
              "error"
            );
            break;
          }
          setCoreTeamVisible(false);
          cyberAudio.playTelemetry();
          addOutput(
            `[ROOT OVERRIDE GRANTED]

THE CORE SHOWCASE: DEACTIVATED & HIDDEN
- Leadership roster is suppressed from public About section.`
          );
          break;

        case "core:status":
        case "team:status":
          addOutput(
            `THE CORE (LEADERSHIP ROSTER) STATUS:

VISIBILITY  : ${isCoreTeamVisible() ? "ON (VISIBLE & LIVE)" : "OFF (HIDDEN FROM PUBLIC)"}
SECTION     : 06 — ABOUT -> THE CORE
ACCESS      : ADMIN ROOT TOGGLEABLE`
          );
          break;

        case "sponsors:show":
        case "sponsors:on":
          if (!consoleConfig.showRootGateway && !ui.adminUnlocked) {
            addOutput(
              `[RESTRICTED PROTOCOL // ROOT PRIVILEGE REQUIRED]`,
              "/admin",
              "Open Admin Gateway (Cyber Gate) →",
              "error"
            );
            break;
          }
          setSponsorsVisible(true);
          cyberAudio.playTelemetry();
          addOutput(`[ROOT OVERRIDE GRANTED] BACKED BY SHOWCASE: ON (VISIBLE)`);
          break;

        case "sponsors:hide":
        case "sponsors:off":
          if (!consoleConfig.showRootGateway && !ui.adminUnlocked) {
            addOutput(
              `[RESTRICTED PROTOCOL // ROOT PRIVILEGE REQUIRED]`,
              "/admin",
              "Open Admin Gateway (Cyber Gate) →",
              "error"
            );
            break;
          }
          setSponsorsVisible(false);
          cyberAudio.playTelemetry();
          addOutput(`[ROOT OVERRIDE GRANTED] BACKED BY SHOWCASE: OFF (HIDDEN)`);
          break;

        case "sponsors:status":
          addOutput(
            `BACKED BY (SPONSORS SHOWCASE) STATUS:

VISIBILITY  : ${isSponsorsVisible() ? "ON (VISIBLE & LIVE)" : "OFF (HIDDEN)"}
SECTION     : 06 — ABOUT -> BACKED BY
ACCESS      : ADMIN ROOT TOGGLEABLE`
          );
          break;

        default:
          addOutput(
            `Command not recognized: '${trimmed}'.

Type 'help' to see the available VYUHAM’26 commands.`,
            undefined,
            undefined,
            "error"
          );
      }

      if (args.length > 0 && command === "help") {
        addOutput(
          "Command options are intentionally limited to the VYUHAM’26 festival experience. There are no Matrix, hacking, scan, decrypt, glitch or visual-effect modes."
        );
      }
    },
    [addOutput, ui.adminUnlocked, consoleConfig]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    processCommand(inputVal);
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key.toLowerCase() === "k" ||
        event.key === "`" ||
        event.code === "Backquote")
    ) {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (cmdHistory.length === 0) return;

      const nextIndex =
        historyIndex === -1
          ? cmdHistory.length - 1
          : Math.max(0, historyIndex - 1);

      setHistoryIndex(nextIndex);
      setInputVal(cmdHistory[nextIndex] || "");
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (historyIndex === -1) return;

      const nextIndex = historyIndex + 1;

      if (nextIndex >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex] || "");
      }
    }
  };

  const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.closest("button, a, input, textarea, [role='button']") && window.getSelection()?.toString().length === 0) {
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md cursor-default"
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsOpen(false);
          }
        }}
      >
        <div
          ref={terminalBoxRef}
          onClick={handleBoxClick}
          data-lenis-prevent="true"
          className="relative flex h-[84vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-emerald-400/20 bg-[#030806]/95 font-mono text-xs shadow-[0_0_80px_rgba(16,185,129,0.14)] cursor-default select-text"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-400/15 bg-black/40 px-4 py-3 select-none">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />

              <span className="ml-2 text-[10px] font-medium tracking-[0.28em] text-emerald-300/80">
                VYUHAM’26 // TERMINAL
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-[9px] tracking-[0.18em] text-white/30 sm:inline">
                ` / CTRL+K / ESC
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="flex h-8 w-8 min-h-[32px] min-w-[32px] items-center justify-center rounded text-white/40 transition-colors hover:bg-white/10 hover:text-emerald-300 cursor-pointer text-base font-bold"
                aria-label="Close terminal"
              >
                ×
              </button>
            </div>
          </div>

          {/* Scrollable history area */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            onWheel={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto p-4 text-emerald-200/80 terminal-scroll select-text cursor-text overscroll-contain"
          >
            {history.map((item, index) => (
              <div
                key={index}
                className="mb-3 whitespace-pre-wrap leading-relaxed select-text cursor-text"
              >
                {item.type === "ascii" && (
                  <pre className="overflow-x-auto py-2 text-[7px] font-bold leading-[0.95] text-emerald-400/70 sm:text-[9px] select-text">
                    {item.content}
                  </pre>
                )}

                {item.type === "input" && (
                  <div className="font-semibold text-emerald-200 select-text">
                    {item.content}
                  </div>
                )}

                {item.type === "system" && (
                  <div className="text-emerald-300/70 select-text">
                    {item.content}
                  </div>
                )}

                {item.type === "output" && (
                  <div className="text-white/65 select-text">{item.content}</div>
                )}

                {item.type === "error" && (
                  <div className="text-red-300/80 select-text">{item.content}</div>
                )}

                {item.link && (
                  <div className="mt-2">
                    <Link
                      href={item.link}
                      onClick={() => setIsOpen(false)}
                      className="inline-block border-b border-emerald-400/30 pb-0.5 text-emerald-300/80 transition-colors hover:border-emerald-300 hover:text-emerald-200 cursor-pointer"
                    >
                      {item.linkText || item.link}
                    </Link>
                  </div>
                )}
              </div>
            ))}

            <div ref={terminalEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            onClick={() => inputRef.current?.focus()}
            className="flex items-center gap-3 border-t border-emerald-400/15 bg-black/50 px-4 py-3 cursor-text"
          >
            <span className="text-emerald-400/80 select-none font-mono text-xs">$</span>

            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(event) => setInputVal(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="type a command... (try 'help')"
              className="flex-1 bg-transparent font-mono text-xs text-white/90 outline-none placeholder:text-white/20 cursor-text"
              autoComplete="off"
              spellCheck={false}
            />

            <button
              type="submit"
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit(e);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="border border-emerald-400/20 bg-emerald-950/20 px-3 py-1.5 text-[9px] tracking-[0.18em] text-emerald-300/70 transition-colors hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:text-emerald-200 cursor-pointer active:scale-95"
            >
              ENTER
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
