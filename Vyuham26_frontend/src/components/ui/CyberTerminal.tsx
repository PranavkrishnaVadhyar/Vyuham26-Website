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

const HELP_TEXT = `VYUHAM’26 TERMINAL

EXPLORE
  events        - Explore festival events
  schedule      - Festival journey
  streams       - Technology / Culture / Gaming / Impact
  about         - Discover VYUHAM’26
  venue         - Explore the festival venue
  gallery       - Open the cinematic gallery

ACCOUNT
  register      - Event registration
  login         - Login portal
  signup        - Create an account
  dashboard     - Participant dashboard
  profile       - Participant profile
  ticket        - Digital festival pass

FESTIVAL
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
  photography   - Photography experience

IDENTITY
  logo          - Display VYUHAM identity
  status        - Festival system status
  whoami        - Current terminal session

TERMINAL
  help          - Show available commands
  clear / cls   - Clear terminal
  exit / quit   - Close terminal`;

export default function CyberTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_WELCOME);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
      const typing = activeTag === "INPUT" || activeTag === "TEXTAREA";

      if (
        !typing &&
        (event.key === "`" ||
          event.key === "~" ||
          ((event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"))
      ) {
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
          addOutput(HELP_TEXT, undefined, undefined, "system");
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

04  IMPACT
    Create change that matters.`,
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

IMPACT
Create change that matters.`,
            "/#streams",
            "Explore the four streams →"
          );
          break;

        case "about":
          addOutput(
            `VYUHAM’26

A convergence of technology, culture, gaming and impact —
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
          addOutput(
            `[REGISTRATION]

Choose an event and become part of the VYUHAM’26 journey.`,
            "/register",
            "Explore registration →"
          );
          break;

        case "login":
          addOutput(
            `[LOGIN]

Access your VYUHAM’26 participant account.`,
            "/login",
            "Open login →"
          );
          break;

        case "signup":
          addOutput(
            `[CREATE ACCOUNT]

Create your VYUHAM’26 participant profile.`,
            "/signup",
            "Create account →"
          );
          break;

        case "dashboard":
          addOutput(
            `[PARTICIPANT DASHBOARD]

View registrations, tickets, certificates and festival activity.`,
            "/dashboard",
            "Open dashboard →"
          );
          break;

        case "profile":
          addOutput(
            `[PROFILE]

Manage your participant information and VYUHAM activity.`,
            "/profile",
            "Open profile →"
          );
          break;

        case "admin":
          if (ui.adminUnlocked) {
            addOutput(
              `[ADMINISTRATION]

Restricted administration interface for managing the VYUHAM ecosystem.`,
              "/admin",
              "Open admin →"
            );
          } else {
            addOutput(
              `Command not recognized: '${trimmed}'.

Type 'help' to see the available VYUHAM’26 commands.`,
              undefined,
              undefined,
              "error"
            );
          }
          break;

        case "ticket":
          addOutput(
            `[DIGITAL PASS]

View your VYUHAM’26 festival access pass.`,
            "/ticket",
            "View ticket →"
          );
          break;

        case "certificates":
          addOutput(
            `[CERTIFICATES]

Access official participation and achievement certificates.`,
            "/certificates",
            "Open certificates →"
          );
          break;

        case "leaderboard":
          addOutput(
            `[LEADERBOARD]

Follow team standings and competition progress.`,
            "/leaderboard",
            "View leaderboard →"
          );
          break;

        case "results":
          addOutput(
            `[RESULTS]

View official competition results and finalist information.`,
            "/results",
            "View results →"
          );
          break;

        case "qualifiers":
          addOutput(
            `[QUALIFIERS]

Explore qualifier schedules, matchups and advancement information.`,
            "/qualifiers",
            "Open qualifiers →"
          );
          break;

        case "food":
          addOutput(
            `[CAMPUS EXPERIENCE]

Food, wallet and festival vendor services.`,
            "/food",
            "Open campus services →"
          );
          break;

        case "checkin":
          addOutput(
            `[CHECK-IN]

Access the festival check-in experience.`,
            "/checkin",
            "Open check-in →"
          );
          break;

        case "teams":
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
    [addOutput, ui.adminUnlocked]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    processCommand(inputVal);
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
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
                className="rounded px-2.5 py-1 text-white/40 transition-colors hover:bg-white/10 hover:text-emerald-300 cursor-pointer text-sm font-bold"
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
