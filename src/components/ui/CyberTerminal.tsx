"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
  KeyboardEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";

interface HistoryItem {
  type: "input" | "output" | "system" | "error" | "ascii";
  content: string;
  link?: string;
  linkText?: string;
}

type VisualEffect =
  | "none"
  | "scan"
  | "trace"
  | "hack"
  | "decrypt"
  | "neural"
  | "doomsday";

type VisualPhase = "idle" | "intro" | "active" | "critical" | "complete";

type MatrixPhase =
  | "idle"
  | "glitch"
  | "rain"
  | "logo"
  | "fade"
  | "complete";

type DoomsdayPhase =
  | "idle"
  | "arming"
  | "countdown"
  | "critical"
  | "offline"
  | "blackout"
  | "restore"
  | "prank"
  | "return";

const ASCII_LOGO = `
 ██╗   ██╗██╗   ██╗██╗  ██╗██████╗ ███╗   ███╗    ██████╗  ██████╗ 
 ██║   ██║██║   ██║██║  ██║██╔══██╗████╗ ████║   ██╔════╝ ██╔════╝ 
 ██║   ██║██║   ██║███████║██████╔╝██╔████╔██║   ███████╗ ███████╗ 
 ╚██╗ ██╔╝██║   ██║██╔══██║██╔══██╗██║╚██╔╝██║   ██╔═══██╗██╔═══██╗
  ╚████╔╝ ╚██████╔╝██║  ██║██║  ██║██║ ╚═╝ ██║██╗╚██████╔╝╚██████╔╝
   ╚═══╝   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝ ╚═════╝  ╚═════╝ 
`;

const CLASSIFIED_LOGO = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        ██╗   ██╗███╗   ██╗███████╗                      ║
║        ██║   ██║████╗  ██║██╔════╝                      ║
║        ██║   ██║██╔██╗ ██║█████╗                        ║
║        ╚██╗ ██╔╝██║╚██╗██║██╔══╝                        ║
║         ╚████╔╝ ██║ ╚████║███████╗                      ║
║          ╚═══╝  ╚═╝  ╚═══╝╚══════╝                      ║
║                                                          ║
║              NEURAL CORE // CLASSIFIED                  ║
╚══════════════════════════════════════════════════════════╝
`;

const INITIAL_WELCOME: HistoryItem[] = [
  {
    type: "ascii",
    content: ASCII_LOGO,
  },
  {
    type: "system",
    content:
      "VYUHAM OS v26.4.0 (x86_64-cyber-pc) [NEURAL LINK ONLINE]\nType 'help' to display available system commands.",
  },
];

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function CyberTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_WELCOME);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [showMatrix, setShowMatrix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [classifiedUnlocked, setClassifiedUnlocked] = useState(false);
  const [visualEffect, setVisualEffect] = useState<VisualEffect>("none");
  const [visualPhase, setVisualPhase] = useState<VisualPhase>("idle");

  const [matrixSequence, setMatrixSequence] = useState(false);
  const [matrixPhase, setMatrixPhase] =
    useState<MatrixPhase>("idle");

  const [doomsdaySequence, setDoomsdaySequence] = useState(false);
  const [doomsdayPhase, setDoomsdayPhase] =
    useState<DoomsdayPhase>("idle");
  const [doomsdayCount, setDoomsdayCount] = useState(10);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);

  /* =========================================================
     TERMINAL KEYBOARD CONTROL
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const activeTag =
        document.activeElement?.tagName;

      const typing =
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA";

      if (
        (e.key === "`" ||
          e.key === "~" ||
          (e.ctrlKey &&
            e.shiftKey &&
            e.key.toLowerCase() === "k")) &&
        !typing
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        if (matrixSequence) {
          setMatrixSequence(false);
          setMatrixPhase("idle");
          setShowMatrix(false);
          setIsProcessing(false);
          setVisualEffect("none");
          setIsOpen(true);
          return;
        }

        if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    const handleCustomEvent = () => {
      if (!matrixSequence) {
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(
      "open-cyber-terminal",
      handleCustomEvent
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "open-cyber-terminal",
        handleCustomEvent
      );
    };
  }, [isOpen, matrixSequence, doomsdaySequence]);

  /* =========================================================
     FOCUS INPUT
  ========================================================= */

  useEffect(() => {
    if (isOpen && !matrixSequence) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 80);

      return () => window.clearTimeout(timer);
    }
  }, [isOpen, matrixSequence]);

  /* =========================================================
     AUTO SCROLL
  ========================================================= */

  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [history, isOpen]);

  /* =========================================================
     MATRIX DIGITAL RAIN
  ========================================================= */

  useEffect(() => {
    if (!showMatrix) return;

    const canvas = matrixCanvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationId = 0;

    const chars =
      "01VYUHAM26NEURALCORECYBERSECURITYACCESSDENIED<>[]{}#$%";

    const fontSize = 14;

    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        window.innerWidth * dpr;

      canvas.height =
        window.innerHeight * dpr;

      canvas.style.width =
        `${window.innerWidth}px`;

      canvas.style.height =
        `${window.innerHeight}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      columns = Math.ceil(
        window.innerWidth / fontSize
      );

      drops = Array.from(
        { length: columns },
        () =>
          Math.floor(
            Math.random() * -50
          )
      );
    };

    resize();

    const draw = () => {
      ctx.fillStyle =
        "rgba(1, 6, 3, 0.075)";

      ctx.fillRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      ctx.font =
        `${fontSize}px monospace`;

      for (
        let i = 0;
        i < drops.length;
        i++
      ) {
        const text =
          chars.charAt(
            Math.floor(
              Math.random() *
              chars.length
            )
          );

        const brightness =
          Math.random();

        if (brightness > 0.975) {
          ctx.fillStyle =
            "#ecfdf5";

          ctx.shadowColor =
            "#34d399";

          ctx.shadowBlur = 14;
        } else if (
          brightness > 0.78
        ) {
          ctx.fillStyle =
            "#6ee7b7";

          ctx.shadowColor =
            "#34d399";

          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle =
            "#34d399";

          ctx.shadowBlur = 0;
        }

        ctx.fillText(
          text,
          i * fontSize,
          drops[i] * fontSize
        );

        ctx.shadowBlur = 0;

        if (
          drops[i] * fontSize >
          window.innerHeight &&
          Math.random() > 0.975
        ) {
          drops[i] =
            Math.floor(
              Math.random() * -20
            );
        }

        drops[i] +=
          Math.random() > 0.96
            ? 2
            : 1;
      }

      animationId =
        requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [showMatrix]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const progressBar = (
    percent: number
  ) => {
    const total = 24;

    const filled = Math.round(
      (percent / 100) * total
    );

    return `[${"█".repeat(
      filled
    )}${"░".repeat(
      total - filled
    )}] ${percent}%`;
  };

  const runVisualEffect = useCallback(
    async (effect: Exclude<VisualEffect, "none">, duration: number) => {
      setVisualEffect(effect);
      setVisualPhase("intro");
      await sleep(900);
      setVisualPhase("active");
      await sleep(Math.max(700, duration - 1800));
      setVisualPhase("critical");
      await sleep(550);
      setVisualPhase("complete");
      await sleep(350);
      setVisualEffect("none");
      setVisualPhase("idle");
    },
    []
  );

  /* =========================================================
     MATRIX CINEMATIC SEQUENCE
  ========================================================= */

  const runMatrixSequence =
    useCallback(async () => {
      if (isProcessing) return;

      setIsProcessing(true);
      setMatrixSequence(true);
      setMatrixPhase("glitch");

      /*
       * PHASE 1
       * Terminal glitch remains visible.
       */

      await sleep(900);

      /*
       * PHASE 2
       * Terminal disappears.
       * Matrix takes over the screen.
       */

      setIsOpen(false);
      setShowMatrix(true);
      setMatrixPhase("rain");

      await sleep(1300);

      /*
       * PHASE 3
       * Giant VYUHAM logo.
       */

      setMatrixPhase("logo");

      await sleep(2600);

      /*
       * PHASE 4
       * Logo fades away.
       */

      setMatrixPhase("fade");

      await sleep(1100);

      /*
       * PHASE 5
       * Matrix remains behind terminal.
       */

      setMatrixPhase("complete");
      setMatrixSequence(false);
      setIsOpen(true);

      setHistory((prev) => [
        ...prev,

        {
          type: "system",
          content: `
╔════════════════════════════════════════╗
║        VYUHAM MATRIX // ONLINE         ║
╠════════════════════════════════════════╣
║  NEURAL LINK       : ACTIVE            ║
║  DATA STREAM       : CONNECTED         ║
║  ENCRYPTION        : AES-256           ║
║  MATRIX CORE       : ONLINE            ║
║  OVERRIDE          : COMPLETE          ║
╚════════════════════════════════════════╝`,
        },

        {
          type: "output",
          content: `
[SYSTEM] MATRIX OVERRIDE COMPLETE.

> NEURAL STREAM ONLINE
> VYUHAM DATA STREAM CONNECTED
> ENCRYPTED SYMBOL CHANNEL ACTIVE

>> WELCOME TO THE HIDDEN LAYER.`,
        },
      ]);

      await sleep(500);

      setMatrixPhase("idle");
      setIsProcessing(false);
    }, [isProcessing]);

  /* =========================================================
     DOOMSDAY CINEMATIC SEQUENCE
  ========================================================= */

  const runDoomsdaySequence = useCallback(async () => {
    if (isProcessing || doomsdaySequence) return;

    setIsProcessing(true);
    setDoomsdaySequence(true);
    setIsOpen(false);
    setDoomsdayPhase("arming");
    setDoomsdayCount(10);

    await sleep(2600);

    setDoomsdayPhase("countdown");

    for (let i = 10; i >= 0; i--) {
      setDoomsdayCount(i);

      if (i <= 4) {
        setDoomsdayPhase("critical");
      }

      await sleep(i <= 3 ? 1500 : 1900);
    }

    // Hold the final zero long enough for the viewer to understand
    // that something catastrophic is about to happen.
    setDoomsdayPhase("critical");
    await sleep(2600);

    // Skip the old "SYSTEM FAILURE" panel and collapse directly
    // into the blackout.
    setDoomsdayPhase("blackout");
    await sleep(5000);

    setDoomsdayPhase("restore");
    await sleep(2600);

    setDoomsdayPhase("prank");
    await sleep(4200);

    setDoomsdayPhase("return");
    await sleep(1600);

    setDoomsdaySequence(false);
    setDoomsdayPhase("idle");
    setDoomsdayCount(10);
    setIsOpen(true);

    setHistory((prev) => [
      ...prev,
      {
        type: "system",
        content:
          "DOOMSDAY PROTOCOL COMPLETE. SYSTEM RESTORED. You actually thought we would destroy the website? 😈 It's a prank.",
      },
    ]);

    setIsProcessing(false);
  }, [isProcessing, doomsdaySequence]);

  /* =========================================================
     COMMAND PROCESSOR
  ========================================================= */

  const processCommand = useCallback(
    async (rawCmd: string) => {
      const trimmed =
        rawCmd.trim();

      if (
        !trimmed ||
        isProcessing
      ) {
        return;
      }

      const parts =
        trimmed.split(/\s+/);

      const cmd =
        parts[0].toLowerCase();

      const args =
        parts.slice(1);

      const newHistory: HistoryItem[] =
        [
          ...history,
          {
            type: "input",
            content: `$ ${trimmed}`,
          },
        ];

      setCmdHistory((prev) => [
        ...prev,
        trimmed,
      ]);

      setHistoryIndex(-1);
      setInputVal("");

      /* =====================================================
         HELP
      ===================================================== */

      switch (cmd) {
        case "help": {
          if (
            args.includes("-a") ||
            args.includes("--all")
          ) {
            newHistory.push({
              type: "system",
              content: `FULL VYUHAM OS COMMAND INDEX:

CORE
  help              - Command index
  events            - Competition streams
  schedule          - Festival timeline
  ctf               - Flag Hunt briefing
  hackathon         - Code Storm briefing
  whoami            - Operative telemetry
  status            - System status

VISUAL
  matrix            - Cinematic Matrix mode
  logo              - VYUHAM ASCII identity

NETWORK
  scan              - Scan neural mesh
  trace             - Trace network route

SIMULATION
  boot              - System boot
  hack              - Intrusion simulation
  decrypt           - Decrypt classified packet

CLASSIFIED
  neural            - Access Neural Core
  doomsday          - Emergency protocol
  ls                - Virtual filesystem
  cat secret.txt    - Classified file

SECURITY
  sudo              - Root access request
  anonymous         - Anonymous mode

TERMINAL
  clear / cls       - Clear terminal
  exit / quit       - Close terminal

TIP:
Try 'neural' or 'matrix'.`,
            });

            break;
          }

          newHistory.push({
            type: "system",
            content: `AVAILABLE COMMANDS:

  help        - Show commands
  events      - Vyuham '26 events
  schedule    - Festival timeline
  ctf         - Flag Hunt CTF
  hackathon   - 24hr Code Storm

  matrix      - Matrix override
  scan        - Neural mesh scan
  trace       - Network trace
  boot        - Boot sequence
  hack        - Intrusion simulation

  whoami      - Operative status
  status      - System status
  logo        - System identity

  clear       - Clear terminal
  exit        - Close terminal

Type 'help -a' for classified commands.`,
          });

          break;
        }

        /* =====================================================
           EVENTS
        ===================================================== */

        case "events":
          newHistory.push({
            type: "output",
            content: `VYUHAM '26 FEATURED STREAMS:

  1. HACKATHON    - 24-Hour Code Storm
  2. FLAG HUNT    - Capture The Flag Cyber Warfare
  3. CODE RELAY   - High-Speed Algorithmic Team Sprint
  4. ALGO RUSH    - Competitive Programming Arena
  5. UI/UX MATRIX - Cyberpunk Interface Design Challenge
  6. AI SHOWDOWN  - Autonomous AI Agent Hackathon`,
            link: "/events",
            linkText:
              "Click to view full events roster ->",
          });
          break;

        /* =====================================================
           SCHEDULE
        ===================================================== */

        case "schedule":
          newHistory.push({
            type: "output",
            content: `VYUHAM '26 OFFICIAL TIMELINE:

DAY 01 (OCT 14)
  Keynote
  Code Relay
  Flag Hunt Qualifiers

DAY 02 (OCT 15)
  24hr Hackathon Kickoff
  Esports Arena
  AI Battle

DAY 03 (OCT 16)
  Hackathon Demos
  Grand Finale
  Prize Ceremony`,
            link: "/schedule",
            linkText:
              "Click to open interactive schedule page ->",
          });
          break;

        /* =====================================================
           CTF
        ===================================================== */

        case "ctf":
          newHistory.push({
            type: "output",
            content: `[OPERATIVE BRIEFING: FLAG HUNT CTF]

Mode       : Jeopardy Style
Categories : Reverse Engineering, Web, Crypto, Pwn
Format     : Squad (up to 4 members)
Prize Pool : ₹45,000 + Exclusive Cyber Badges`,
            link: "/events/ctf",
            linkText:
              "Register for CTF ->",
          });
          break;

        /* =====================================================
           HACKATHON
        ===================================================== */

        case "hackathon":
          newHistory.push({
            type: "output",
            content: `[OPERATIVE BRIEFING: 24HR CODE STORM]

Duration   : 24 Hours Non-Stop
Themes     : AI/ML, Web3, CyberSecurity, Open Innovation
Prize Pool : ₹1,000,000 Total Pool`,
            link: "/events/hackathon",
            linkText:
              "Register for Hackathon ->",
          });
          break;

        /* =====================================================
           MATRIX
        ===================================================== */

        case "matrix": {
          if (showMatrix) {
            setShowMatrix(false);
            setMatrixPhase("idle");

            newHistory.push({
              type: "system",
              content:
                "[SYSTEM] MATRIX DIGITAL RAIN DISABLED.",
            });

            break;
          }

          /*
           * Start cinematic Matrix sequence.
           * It manages its own history after this point.
           */

          setHistory(newHistory);

          await runMatrixSequence();

          return;
        }

        /* =====================================================
           LOGO
        ===================================================== */

        case "logo":
          newHistory.push({
            type: "ascii",
            content: ASCII_LOGO,
          });
          break;

        /* =====================================================
           WHOAMI / STATUS
        ===================================================== */

        case "whoami":
        case "status":
          newHistory.push({
            type: "output",
            content: `OPERATIVE TELEMETRY:

Identity      : ANONYMOUS OPERATIVE
Clearance     : ${classifiedUnlocked
                ? "LEVEL 5"
                : "LEVEL 3"
              }
Node IP       : 127.0.0.1
Node          : VYUHAM-LOCAL
Status        : CONNECTED
Neural Mesh   : ONLINE
Matrix Core   : ${showMatrix
                ? "ACTIVE"
                : "STANDBY"
              }
Encryption    : AES-256
Protocol      : TLS 1.3
OS            : VYUHAM OS v26.4.0`,
          });
          break;

        /* =====================================================
           BOOT
        ===================================================== */

        case "boot": {
          setHistory(newHistory);
          setIsProcessing(true);

          const stages = [
            "BIOS CHECK",
            "MEMORY CHECK",
            "CRYPTOGRAPHIC ENGINE",
            "NEURAL PROCESSOR",
            "CYBER MESH",
            "SECURITY CORE",
            "VYUHAM CORE",
          ];

          for (
            let i = 0;
            i < stages.length;
            i++
          ) {
            await sleep(350);

            setHistory((prev) => [
              ...prev,
              {
                type: "system",
                content: `[BOOT] ${stages[i]} ........ ${progressBar(
                  Math.round(
                    ((i + 1) /
                      stages.length) *
                    100
                  )
                )}`,
              },
            ]);
          }

          await sleep(400);

          setHistory((prev) => [
            ...prev,

            {
              type: "ascii",
              content: CLASSIFIED_LOGO,
            },

            {
              type: "system",
              content: `VYUHAM OS BOOT COMPLETE.

NEURAL LINK     : ONLINE
CYBER MESH      : ONLINE
SECURITY CORE   : ONLINE
CLASSIFIED CORE : LOCKED

System ready.`,
            },
          ]);

          setIsProcessing(false);
          return;
        }

        /* =====================================================
           SCAN
        ===================================================== */

        case "scan": {
          setHistory(newHistory);
          setIsProcessing(true);
          const effectPromise = runVisualEffect("scan", 4200);

          await sleep(400);

          setHistory((prev) => [
            ...prev,
            {
              type: "system",
              content:
                "[SCAN] Initializing neural mesh scanner...",
            },
          ]);

          const nodes = [
            "VYUHAM-CORE",
            "EVENT-NODE",
            "CYBER-ARENA",
            "AI-MESH",
            "CLASSIFIED-NODE",
          ];

          for (const node of nodes) {
            await sleep(320);

            setHistory((prev) => [
              ...prev,
              {
                type: "output",
                content: `[SCAN] ${node.padEnd(
                  20,
                  " "
                )} ONLINE`,
              },
            ]);
          }

          setHistory((prev) => [
            ...prev,
            {
              type: "system",
              content: `

SCAN COMPLETE.

Nodes discovered : 05
Active channels  : 05
Encrypted links  : 03
Unknown nodes    : 01

WARNING:
One classified node is responding.`,
            },
          ]);

          await effectPromise;
          setIsProcessing(false);
          return;
        }

        /* =====================================================
           TRACE
        ===================================================== */

        case "trace": {
          setHistory(newHistory);
          setIsProcessing(true);
          const effectPromise = runVisualEffect("trace", 4000);

          const routes = [
            "localhost",
            "gateway.vyuham",
            "neural.mesh",
            "cyber.core",
            "unknown.node",
          ];

          await sleep(300);

          setHistory((prev) => [
            ...prev,
            {
              type: "system",
              content:
                "[TRACE] Routing neural packet...",
            },
          ]);

          for (
            let i = 0;
            i < routes.length;
            i++
          ) {
            await sleep(350);

            const latency =
              Math.floor(
                Math.random() * 30
              ) + 8;

            setHistory((prev) => [
              ...prev,
              {
                type: "output",
                content: `  ${String(
                  i + 1
                ).padStart(
                  2,
                  "0"
                )}  ${routes[i].padEnd(
                  22,
                  " "
                )} ${latency} ms`,
              },
            ]);
          }

          setHistory((prev) => [
            ...prev,
            {
              type: "system",
              content:
                "[TRACE] Route complete. Final node identity concealed.",
            },
          ]);

          await effectPromise;
          setIsProcessing(false);
          return;
        }

        /* =====================================================
           HACK
        ===================================================== */

        case "hack": {
          setHistory(newHistory);
          setIsProcessing(true);
          const effectPromise = runVisualEffect("hack", 5000);

          const hackStages = [
            "Establishing handshake...",
            "Scanning exposed ports...",
            "Analyzing encryption...",
            "Testing firewall boundary...",
            "Simulating payload injection...",
            "Opening neural channel...",
          ];

          for (
            const stage of hackStages
          ) {
            await sleep(450);

            setHistory((prev) => [
              ...prev,
              {
                type: "output",
                content:
                  `[HACK] ${stage}`,
              },
            ]);
          }

          await sleep(500);

          setHistory((prev) => [
            ...prev,
            {
              type: "error",
              content: `[SYSTEM] INTRUSION SIMULATION COMPLETE.

ACCESS LEVEL: SIMULATED ROOT

No actual system was compromised.`,
            },
          ]);

          await effectPromise;
          setIsProcessing(false);
          return;
        }

        /* =====================================================
           LS
        ===================================================== */

        case "ls":
          newHistory.push({
            type: "output",
            content: `VYUHAM://

DRW  SYSTEM/
DRW  EVENTS/
DRW  SECURITY/
DRW  NEURAL/
DRW  CLASSIFIED/

-rw  README.sys
-rw  operators.log
-rw  motd.txt
-rw  matrix.core

${classifiedUnlocked
                ? "-rw  CLASSIFIED_ACCESS.key"
                : "-rw  ????????.enc"
              }`,
          });
          break;

        /* =====================================================
           CAT
        ===================================================== */

        case "cat": {
          const file =
            args.join(" ")
              .toLowerCase();

          if (
            file === "secret.txt" ||
            file === "classified.txt"
          ) {
            if (!classifiedUnlocked) {
              newHistory.push({
                type: "error",
                content: `ACCESS DENIED.

File is encrypted.
Required clearance: LEVEL 5

Hint:
The Neural Core may know more.`,
              });
            } else {
              newHistory.push({
                type: "system",
                content: `CLASSIFIED FILE // SECRET.TXT

"You found the hidden layer.

VYUHAM is watching.

Not your system.
Not your device.

The website.

— NEURAL CORE`,
              });
            }
          } else if (
            file === "motd.txt"
          ) {
            newHistory.push({
              type: "output",
              content: `MESSAGE OF THE DAY:

The best Easter eggs are the ones
you weren't supposed to find.`,
            });
          } else if (
            file === "readme.sys"
          ) {
            newHistory.push({
              type: "output",
              content: `VYUHAM OS

Built for:
  Competition
  Creativity
  Cybersecurity
  Innovation

SYSTEM STATUS: ONLINE`,
            });
          } else if (
            file === "matrix.core"
          ) {
            newHistory.push({
              type: "system",
              content: `MATRIX CORE

Status      : DORMANT
Neural Link : READY
Encryption  : AES-256
Override    : AVAILABLE

Hint:
Try the 'matrix' command.`,
            });
          } else {
            newHistory.push({
              type: "error",
              content:
                `cat: ${file || "unknown"
                }: file not found`,
            });
          }

          break;
        }

        /* =====================================================
           DECRYPT
        ===================================================== */

        case "decrypt": {
          setHistory(newHistory);
          setIsProcessing(true);
          const effectPromise = runVisualEffect("decrypt", 4500);

          await sleep(500);

          setHistory((prev) => [
            ...prev,
            {
              type: "system",
              content: `[CRYPTO] ENCRYPTED PACKET DETECTED.

Cipher       : AES-256
Payload size : 4.2 KB
Key status   : UNKNOWN`,
            },
          ]);

          for (
            const value of [
              20,
              40,
              60,
              80,
              100,
            ]
          ) {
            await sleep(300);

            setHistory((prev) => [
              ...prev,
              {
                type: "output",
                content:
                  `[CRYPTO] ${progressBar(
                    value
                  )}`,
              },
            ]);
          }

          setClassifiedUnlocked(true);

          setHistory((prev) => [
            ...prev,
            {
              type: "system",
              content: `DECRYPTION SUCCESSFUL.

CLASSIFIED CLEARANCE GRANTED.

New file discovered:
  CLASSIFIED_ACCESS.key

Try:
  ls
  cat secret.txt`,
            },
          ]);

          await effectPromise;
          setIsProcessing(false);
          return;
        }

        /* =====================================================
           NEURAL
        ===================================================== */

        case "neural": {
          setHistory(newHistory);
          setIsProcessing(true);
          const effectPromise = runVisualEffect("neural", 5500);

          await sleep(400);

          setHistory((prev) => [
            ...prev,
            {
              type: "ascii",
              content: CLASSIFIED_LOGO,
            },
            {
              type: "system",
              content:
                "CONNECTING TO VYUHAM NEURAL CORE...",
            },
          ]);

          const neuralMessages = [
            "Authenticating operative...",
            "Checking clearance...",
            "Establishing encrypted channel...",
            "Synchronizing neural mesh...",
            "Opening classified layer...",
          ];

          for (
            const message of neuralMessages
          ) {
            await sleep(400);

            setHistory((prev) => [
              ...prev,
              {
                type: "output",
                content:
                  `[NEURAL] ${message}`,
              },
            ]);
          }

          setClassifiedUnlocked(true);

          setHistory((prev) => [
            ...prev,
            {
              type: "system",
              content: `
╔══════════════════════════════════════╗
║       VYUHAM NEURAL CORE ONLINE      ║
╠══════════════════════════════════════╣
║                                      ║
║  OPERATIVE STATUS : VERIFIED         ║
║  CLEARANCE        : LEVEL 5          ║
║  CORE ACCESS      : GRANTED          ║
║                                      ║
║  Something is hidden inside.         ║
║                                      ║
╚══════════════════════════════════════╝

CLASSIFIED COMMANDS UNLOCKED.`,
            },
          ]);

          await effectPromise;
          setIsProcessing(false);
          return;
        }

        /* =====================================================
           DOOMSDAY
        ===================================================== */

        case "doomsday": {
          setHistory(newHistory);
          await runDoomsdaySequence();
          return;
        }

        /* =====================================================
           ANONYMOUS
        ===================================================== */

        case "anonymous":
          newHistory.push({
            type: "system",
            content: `
ANONYMOUS OPERATIVE MODE

Identity : [REDACTED]
IP       : [MASKED]
Node     : [UNKNOWN]
Trace    : DISABLED

You are now invisible.

Probably.`,
          });
          break;

        /* =====================================================
           SUDO
        ===================================================== */

        case "sudo":
          newHistory.push({
            type: "error",
            content: `sudo: authentication required

ACCESS DENIED.

Operative is not in the sudoers file.
This incident has been logged.

Nice try. 😎`,
          });
          break;

        /* =====================================================
           CLEAR
        ===================================================== */

        case "clear":
        case "cls":
          setHistory([]);
          setInputVal("");
          return;

        /* =====================================================
           EXIT
        ===================================================== */

        case "exit":
        case "quit":
        case "close":
          setIsOpen(false);
          setInputVal("");
          return;

        /* =====================================================
           UNKNOWN
        ===================================================== */

        default:
          newHistory.push({
            type: "error",
            content: `Command not recognized: '${trimmed}'.

Type 'help' for standard commands.
Type 'help -a' for advanced commands.`,
          });
          break;
      }

      setHistory(newHistory);
    },
    [
      history,
      showMatrix,
      isProcessing,
      classifiedUnlocked,
      runMatrixSequence,
      runVisualEffect,
    ]
  );

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (
    e: FormEvent
  ) => {
    e.preventDefault();

    processCommand(inputVal);
  };

  /* =========================================================
     COMMAND HISTORY
  ========================================================= */

  const handleKeyDownInput = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "ArrowUp"
    ) {
      e.preventDefault();

      if (
        cmdHistory.length === 0
      ) {
        return;
      }

      const nextIndex =
        historyIndex === -1
          ? cmdHistory.length - 1
          : Math.max(
            0,
            historyIndex - 1
          );

      setHistoryIndex(
        nextIndex
      );

      setInputVal(
        cmdHistory[nextIndex] || ""
      );
    }

    if (
      e.key === "ArrowDown"
    ) {
      e.preventDefault();

      if (
        historyIndex === -1
      ) {
        return;
      }

      const nextIndex =
        historyIndex + 1;

      if (
        nextIndex >=
        cmdHistory.length
      ) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(
          nextIndex
        );

        setInputVal(
          cmdHistory[nextIndex] ||
          ""
        );
      }
    }
  };

  /* =========================================================
     RENDER GUARD
  ========================================================= */

  if (
    !isOpen &&
    !showMatrix &&
    !matrixSequence &&
    !doomsdaySequence
  ) {
    return null;
  }

  return (
    <>
      {/* =====================================================
          INTERACTIVE EASTER-EGG VISUAL EFFECTS
      ===================================================== */}

      {visualEffect !== "none" && (
        <div
          className={`pointer-events-none fixed inset-0 z-99995 overflow-hidden font-mono ${
            visualEffect === "hack" || visualEffect === "doomsday"
              ? "bg-black/95"
              : "bg-[#010504]/95"
          } ${visualPhase === "critical" ? "animate-[eggShake_.11s_steps(2)_infinite]" : ""}`}
        >
          {/* universal CRT / scanline layer */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(255,255,255,.055)_4px)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,.13),transparent_52%)]" />
          <div className="absolute inset-0 animate-[eggNoise_.18s_steps(2)_infinite] opacity-[.08] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_7px,rgba(255,255,255,.18)_8px)]" />

          {visualEffect === "scan" && (
            <div className="absolute inset-0 text-emerald-300">
              <div className="absolute inset-x-0 top-0 h-1 bg-emerald-200 shadow-[0_0_40px_#34d399] animate-[eggScan_1.8s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[min(72vw,620px)] w-[min(72vw,620px)] rounded-full border border-emerald-400/25 shadow-[0_0_100px_rgba(52,211,153,.12)]">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span key={i} className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-emerald-200 shadow-[0_0_18px_#34d399] animate-pulse" style={{ transform: `rotate(${i * 22.5}deg) translateY(-${220 + (i % 4) * 22}px)`, animationDelay: `${i * 55}ms` }} />
                  ))}
                  <div className="absolute inset-[12%] rounded-full border border-emerald-400/20 animate-[eggPulse_1.5s_ease-in-out_infinite]" />
                  <div className="absolute inset-[25%] rounded-full border border-emerald-400/20" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-[9px] tracking-[.65em] text-emerald-400">NEURAL MESH</div>
                    <div className="mt-3 text-5xl font-black tracking-widest text-emerald-50 sm:text-7xl">SCAN</div>
                    <div className="mt-4 text-[9px] tracking-[.35em] text-emerald-400/70">{visualPhase === "intro" ? "CALIBRATING SENSORS" : visualPhase === "critical" ? "ANOMALY DETECTED" : "05 NODES // 03 LINKS"}</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-[9px] tracking-[.4em] text-emerald-400/60">VYUHAM SECURITY SCANNER // LIVE TELEMETRY</div>
            </div>
          )}

          {visualEffect === "trace" && (
            <div className="absolute inset-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[min(72vh,620px)] w-[min(92vw,900px)]">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="absolute left-1/2 top-1/2 h-px origin-left bg-emerald-400/70 shadow-[0_0_14px_#34d399]" style={{ width: `${30 + i * 7}%`, transform: `rotate(${i * 51.4}deg)`, animation: `eggTrace 1.1s ${i * .09}s ease-in-out infinite alternate` }} />
                  ))}
                  {[
                    [50,50,"VYUHAM"],[13,23,"LOCALHOST"],[84,18,"GATEWAY"],[16,74,"NEURAL"],[84,70,"CORE"],[50,90,"UNKNOWN"]
                  ].map(([x,y,label],i)=>(
                    <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{left:`${x}%`,top:`${y}%`}}>
                      <div className="mx-auto h-3 w-3 rounded-full bg-emerald-100 shadow-[0_0_22px_#34d399] animate-pulse" />
                      <div className="mt-2 text-[8px] tracking-[.25em] text-emerald-300">{label}</div>
                    </div>
                  ))}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border border-emerald-400/40 bg-black/70 px-8 py-5 text-center backdrop-blur-md">
                    <div className="text-[9px] tracking-[.6em] text-emerald-400">PACKET TRACE</div>
                    <div className="mt-2 text-3xl font-black text-emerald-50">{visualPhase === "critical" ? "IDENTITY MASKED" : "ROUTE LOCKED"}</div>
                    <div className="mt-2 text-[8px] tracking-[.35em] text-emerald-400/60">HOP 05 // LATENCY NOMINAL</div>
                  </div>
                </div>
              </div>
              <div className="absolute left-6 top-6 text-[8px] tracking-[.35em] text-emerald-500/70">TRACE://LIVE</div>
              <div className="absolute bottom-6 right-6 text-[8px] tracking-[.35em] text-emerald-500/70">SOURCE: CONCEALED</div>
            </div>
          )}

          {visualEffect === "hack" && (
            <div className="absolute inset-0 text-red-300">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_5px,rgba(239,68,68,.05)_6px)]" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-red-400 shadow-[0_0_40px_#ef4444] animate-[eggScan_1.2s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[min(90vw,820px)] border-y border-red-500/40 py-10 text-center">
                  <div className="text-[9px] tracking-[.7em] text-red-500">SECURITY CORE // INTRUSION SIMULATION</div>
                  <div className="relative mt-5 inline-block text-6xl font-black tracking-[.18em] text-red-50 sm:text-8xl">
                    BREACH
                    <span className="absolute inset-0 translate-x-2 text-cyan-400/25 blur-[1px]">BREACH</span>
                  </div>
                  <div className="mx-auto mt-8 h-2 w-full overflow-hidden bg-red-950">
                    <div className="h-full origin-left bg-red-400 shadow-[0_0_25px_#f87171] animate-[eggProgress_5s_linear_forwards]" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-left text-[8px] tracking-[.2em] text-red-300/70 sm:grid-cols-4">
                    {['FIREWALL','CRYPTO','PAYLOAD','NEURAL'].map((x,i)=><div key={x} className="border border-red-500/20 p-3">{x}<span className="float-right text-red-400">{visualPhase === "critical" && i === 3 ? "FAIL" : "OK"}</span></div>)}
                  </div>
                  <div className="mt-7 text-[9px] tracking-[.35em] text-red-400/70 animate-pulse">{visualPhase === "critical" ? "BOUNDARY BREACHED // SIMULATION PEAK" : "NO REAL SYSTEM IS BEING COMPROMISED"}</div>
                </div>
              </div>
            </div>
          )}

          {visualEffect === "decrypt" && (
            <div className="absolute inset-0 flex items-center justify-center text-cyan-300">
              <div className="w-[min(90vw,760px)] text-center">
                <div className="text-[9px] tracking-[.7em]">CLASSIFIED PACKET // AES-256</div>
                <div className="mt-5 text-5xl font-black tracking-[.18em] text-cyan-50 sm:text-7xl animate-[eggDecode_.55s_steps(2)_infinite]">DECRYPT</div>
                <div className="mx-auto mt-8 grid w-full grid-cols-24 gap-1 opacity-80">
                  {Array.from({length:24}).map((_,i)=><span key={i} className="h-10 bg-cyan-300/70" style={{animation:`eggBars .9s ${i*38}ms ease-in-out infinite`}} />)}
                </div>
                <div className="mt-7 flex flex-wrap justify-center gap-2 text-[8px] tracking-[.25em] text-cyan-300/70">
                  {Array.from({length:12}).map((_,i)=><span key={i} className="border border-cyan-400/20 px-2 py-1">{visualPhase === "critical" ? "FF" : ["A7","3C","91","E2"][i%4]}</span>)}
                </div>
                <div className="mt-6 text-[9px] tracking-[.4em] text-cyan-300/60">{visualPhase === "critical" ? "KEY RECONSTRUCTED // ACCESS GRANTED" : "RECONSTRUCTING KEY FRAGMENTS"}</div>
              </div>
            </div>
          )}

          {visualEffect === "neural" && (
            <div className="absolute inset-0 flex items-center justify-center text-emerald-300">
              <div className="relative h-[min(78vw,680px)] w-[min(78vw,680px)]">
                <div className="absolute inset-[15%] rounded-full border border-emerald-400/20 animate-[eggPulse_1.4s_ease-in-out_infinite]" />
                <div className="absolute inset-[27%] rounded-full border border-emerald-400/30" />
                {Array.from({length:34}).map((_,i)=>{const a=i/34*Math.PI*2;const r=35+(i%5)*5;return <span key={i} className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-emerald-100 shadow-[0_0_18px_#34d399] animate-pulse" style={{transform:`translate(-50%,-50%) translate(${Math.cos(a)*r}vw,${Math.sin(a)*r}vw)`,animationDelay:`${i*55}ms`}}/>})}
                {Array.from({length:10}).map((_,i)=><div key={i} className="absolute left-1/2 top-1/2 h-px origin-left bg-emerald-400/50" style={{width:`${35+i*4}%`,transform:`rotate(${i*36}deg)`,animation:`eggTrace 1.3s ${i*80}ms ease-in-out infinite alternate`}} />)}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/60 bg-black/65 px-10 py-9 text-center shadow-[0_0_100px_rgba(52,211,153,.3)] animate-[eggCore_1.2s_ease-in-out_infinite]">
                  <div className="text-[9px] tracking-[.6em]">NEURAL CORE</div>
                  <div className="mt-2 text-4xl font-black tracking-widest text-emerald-50">{visualPhase === "critical" ? "UNLOCKED" : "SYNCING"}</div>
                  <div className="mt-3 text-[8px] tracking-[.35em] text-emerald-400/60">LEVEL 5 // BI-DIRECTIONAL LINK</div>
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] tracking-[.45em] text-emerald-400/60">SYNAPTIC PATHWAYS // {visualPhase === "critical" ? "STABLE" : "CALIBRATING"}</div>
            </div>
          )}

          {visualEffect !== "doomsday" && (
            <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6">
              <div className="border border-white/10 bg-black/50 px-5 py-2 text-[8px] tracking-[.35em] text-white/40 backdrop-blur-sm">
                {visualPhase === "intro" ? "INITIALIZING VISUAL PROTOCOL" : visualPhase === "critical" ? "PROTOCOL PEAK" : visualPhase === "complete" ? "SIGNAL LOCKED" : "LIVE SYSTEM TELEMETRY"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          MATRIX CANVAS
      ===================================================== */}

      {showMatrix && (
        <canvas
          ref={matrixCanvasRef}
          className={`pointer-events-none fixed inset-0 h-full w-full transition-opacity duration-700 ${matrixSequence
              ? "z-99990 opacity-75"
              : "z-90 opacity-40"
            }`}
        />
      )}

      {/* =====================================================
          MATRIX CINEMATIC OVERLAY
      ===================================================== */}

      {matrixSequence && (
        <div className="pointer-events-none fixed inset-0 z-99999 overflow-hidden bg-[#010603] font-mono">

          {/* Scanlines */}

          <div
            className="absolute inset-0 z-40 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(52,211,153,0.12) 4px)",
            }}
          />

          {/* Moving scan beam */}

          <div
            className="absolute left-0 right-0 z-30 h-px bg-emerald-300/40 shadow-[0_0_20px_#34d399]"
            style={{
              animation:
                "matrixScan 2.2s linear infinite",
            }}
          />

          {/* =================================================
              GLITCH
          ================================================= */}

          {matrixPhase ===
            "glitch" && (
              <div className="absolute inset-0 flex items-center justify-center">

                <div
                  className="relative text-center"
                  style={{
                    animation:
                      "matrixGlitch 0.16s infinite",
                  }}
                >

                  <div className="text-[9px] tracking-[0.6em] text-emerald-500 sm:text-xs">
                    VYUHAM_CLI //
                    SYSTEM_OVERRIDE
                  </div>

                  <div className="relative mt-6">

                    <div className="absolute inset-0 translate-x-2 text-red-500/40 blur-[1px]">
                      MATRIX
                    </div>

                    <div className="absolute inset-0 -translate-x-2 text-cyan-400/30">
                      MATRIX
                    </div>

                    <div className="relative text-5xl font-black tracking-[0.3em] text-emerald-200 drop-shadow-[0_0_25px_rgba(52,211,153,0.8)] sm:text-8xl">
                      MATRIX
                    </div>

                  </div>

                  <div className="mt-8 animate-pulse text-[10px] tracking-[0.35em] text-emerald-400/70">
                    INITIALIZING
                    OVERRIDE...
                  </div>

                </div>

              </div>
            )}

          {/* =================================================
              RAIN
          ================================================= */}

          {matrixPhase ===
            "rain" && (
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="animate-pulse text-[10px] font-bold tracking-[0.4em] text-emerald-200 sm:text-sm">
                    INITIALIZING MATRIX
                    OVERRIDE...
                  </div>

                  <div className="mx-auto mt-7 h-px w-64 overflow-hidden bg-emerald-950 sm:w-96">

                    <div
                      className="h-full origin-left bg-emerald-400 shadow-[0_0_20px_#34d399]"
                      style={{
                        animation:
                          "matrixProgress 1.3s ease-in-out forwards",
                      }}
                    />

                  </div>

                  <div className="mt-6 text-[9px] tracking-[0.35em] text-emerald-500/70">
                    NEURAL STREAM
                    CONNECTING
                  </div>

                </div>

              </div>
            )}

          {/* =================================================
              LOGO REVEAL
          ================================================= */}

          {(
            matrixPhase ===
            "logo" ||
            matrixPhase ===
            "fade"
          ) && (
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${matrixPhase ===
                    "logo"
                    ? "scale-100 opacity-100"
                    : "scale-125 opacity-0"
                  }`}
              >

                <div className="relative text-center">

                  {/* Main glow */}

                  <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[80px] sm:h-72 sm:w-72" />

                  {/* VYUHAM Emblem Logo */}

                  <div
                    className="relative mb-3 flex items-center justify-center"
                    style={{
                      animation:
                        "logoPulse 1.8s ease-in-out infinite",
                    }}
                  >
                    <Image
                      src="/logo.png"
                      alt="VYUHAM '26 Emblem Logo"
                      width={220}
                      height={220}
                      priority
                      className="h-28 w-auto object-contain filter drop-shadow-[0_0_30px_rgba(52,211,153,0.95)] sm:h-44 md:h-56"
                    />
                  </div>

                  {/* VYUHAM */}

                  <div className="-mt-1 text-4xl font-black tracking-[0.3em] text-emerald-100 drop-shadow-[0_0_20px_rgba(52,211,153,0.9)] sm:text-7xl">
                    VYUHAM
                  </div>

                  {/* Tagline */}

                  <div className="mt-5 text-[9px] tracking-[0.75em] text-emerald-400/80 sm:text-xs">
                    BEYOND ORDINARY
                  </div>

                  {/* Core */}

                  <div className="mt-10 text-[8px] tracking-[0.45em] text-emerald-500/60 sm:text-[10px]">
                    NEURAL CORE //
                    ONLINE
                  </div>

                </div>

              </div>
            )}

          {/* =================================================
              COMPLETE FLASH
          ================================================= */}

          {matrixPhase ===
            "complete" && (
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="text-2xl font-black tracking-[0.25em] text-emerald-200 drop-shadow-[0_0_20px_#34d399] sm:text-5xl">
                    MATRIX
                  </div>

                  <div className="mt-3 text-xs tracking-[0.5em] text-emerald-400">
                    OVERRIDE COMPLETE
                  </div>

                </div>

              </div>
            )}
        </div>
      )}

      {/* =====================================================
          DOOMSDAY CINEMATIC OVERLAY
      ===================================================== */}

      {doomsdaySequence && (
        <div
          className={`fixed inset-0 z-100000 overflow-hidden bg-black font-mono text-white transition-all duration-700 ${
            doomsdayPhase === "critical"
              ? "animate-[doomsdayShake_0.12s_infinite]"
              : ""
          }`}
        >
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              doomsdayPhase === "blackout" ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Emergency grid / scanlines */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[42px_42px]" />
            <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(255,255,255,.12)_4px)]" />

            {/* Emergency flash */}
            {doomsdayPhase === "critical" && (
              <>
                <div className="absolute inset-0 animate-[doomsdayFlash_0.55s_steps(2,end)_infinite] bg-red-600/20" />
                <div className="absolute inset-x-0 top-1/3 h-px bg-red-300/60 shadow-[0_0_25px_rgba(248,113,113,.9)] animate-[doomsdayScan_1.1s_linear_infinite]" />
                <div className="absolute inset-0 mix-blend-screen opacity-20 animate-[doomsdayChromatic_0.22s_steps(2,end)_infinite] bg-[linear-gradient(90deg,transparent_0%,rgba(239,68,68,.7)_48%,transparent_52%)]" />
              </>
            )}

            {doomsdayPhase === "arming" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-xl px-6 text-center">
                  <div className="text-[10px] font-bold tracking-[0.5em] text-red-400">
                    VYUHAM EMERGENCY SYSTEM
                  </div>
                  <div className="mt-6 text-4xl font-black tracking-[0.18em] text-white sm:text-7xl">
                    DOOMSDAY
                  </div>
                  <div className="mt-4 animate-pulse text-[10px] tracking-[0.35em] text-red-400">
                    PROTOCOL ARMING...
                  </div>
                  <div className="mx-auto mt-8 h-1 max-w-md overflow-hidden bg-red-950">
                    <div className="h-full origin-left animate-[doomsdayCharge_1.4s_ease-out_forwards] bg-red-500 shadow-[0_0_25px_rgba(239,68,68,.9)]" />
                  </div>
                </div>
              </div>
            )}

            {(doomsdayPhase === "countdown" ||
              doomsdayPhase === "critical") && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[9px] font-bold tracking-[0.55em] text-red-400 sm:text-xs">
                    VYUHAM CORE // TERMINATION SEQUENCE
                  </div>

                  <div
                    className={`mt-8 text-[clamp(7rem,25vw,18rem)] font-black leading-none tracking-[-0.08em] ${
                      doomsdayCount <= 3
                        ? "text-red-100 drop-shadow-[0_0_55px_rgba(239,68,68,.95)]"
                        : "text-white drop-shadow-[0_0_40px_rgba(255,255,255,.35)]"
                    }`}
                  >
                    {doomsdayCount}
                  </div>

                  <div className="mt-5 text-[10px] tracking-[0.45em] text-red-400 sm:text-sm">
                    {doomsdayCount <= 3
                      ? "CRITICAL CORE INSTABILITY"
                      : "SYSTEM SHUTDOWN IMMINENT"}
                  </div>

                  <div className="mt-7 flex justify-center gap-2 text-[8px] tracking-[0.25em] text-red-500/60">
                    <span className="animate-[doomsdayFlicker_0.8s_steps(2,end)_infinite]">
                      CORE_ERR
                    </span>
                    <span className="animate-[doomsdayFlicker_1.1s_steps(2,end)_infinite]">
                      0x7F
                    </span>
                    <span className="animate-[doomsdayFlicker_0.6s_steps(2,end)_infinite]">
                      LINK_LOST
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-2 text-[8px] text-red-300/70 sm:text-[10px]">
                    <span>NEURAL CORE</span>
                    <span>NETWORK</span>
                    <span>EVENT SYSTEM</span>
                  </div>
                </div>
              </div>
            )}

            {doomsdayPhase === "restore" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs tracking-[0.5em] text-emerald-400">
                    SYSTEM RESTORATION
                  </div>
                  <div className="mt-6 text-3xl font-black tracking-[0.18em] text-white sm:text-6xl">
                    VYUHAM SYSTEM
                  </div>
                  <div className="mt-3 text-xs tracking-[0.4em] text-emerald-400">
                    RESTORING...
                  </div>
                  <div className="mx-auto mt-8 h-1 w-72 overflow-hidden bg-emerald-950 sm:w-96">
                    <div className="h-full animate-[doomsdayRestore_1.8s_ease-out_forwards] bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,.9)]" />
                  </div>
                </div>
              </div>
            )}

            {doomsdayPhase === "prank" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="px-6 text-center">
                  <div className="text-[10px] tracking-[0.5em] text-emerald-400">
                    SYSTEM MESSAGE
                  </div>
                  <div className="mt-7 text-3xl font-black tracking-[0.08em] text-white sm:text-6xl">
                    YOU ACTUALLY THOUGHT...
                  </div>
                  <div className="mt-7 text-5xl font-black text-emerald-300 drop-shadow-[0_0_35px_rgba(52,211,153,.8)] sm:text-8xl">
                    IT'S A PRANK 😈
                  </div>
                  <div className="mt-6 text-[10px] tracking-[0.4em] text-emerald-400/80">
                    VYUHAM CORE REMAINS STABLE
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* True blackout: intentionally empty for the cinematic pause */}
          {doomsdayPhase === "blackout" && (
            <div className="absolute inset-0 bg-black animate-[doomsdayBlackout_900ms_ease-out_forwards]" />
          )}
        </div>
      )}

      {/* =====================================================
          TERMINAL
      ===================================================== */}

      {isOpen && (
        <div
          className={`fixed inset-0 z-9999 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md ${matrixPhase === "glitch"
              ? "animate-[terminalGlitch_0.16s_infinite]"
              : ""
            }`}
        >

          <div
            className={`relative flex h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-emerald-500/30 bg-[#030806]/95 font-mono text-xs shadow-[0_0_50px_rgba(16,185,129,0.25)] transition-all duration-300 ${matrixPhase ===
                "glitch"
                ? "scale-[1.005] border-emerald-300/70 shadow-[0_0_100px_rgba(52,211,153,0.55)]"
                : ""
              }`}
          >

            {/* Terminal header */}

            <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-950/30 px-4 py-2.5">

              <div className="flex items-center gap-2">

                <span className="inline-block h-3 w-3 rounded-full bg-red-500/80" />

                <span className="inline-block h-3 w-3 rounded-full bg-yellow-500/80" />

                <span className="inline-block h-3 w-3 rounded-full bg-emerald-500/80" />

                <span className="ml-2 text-[11px] font-bold tracking-widest text-emerald-400">
                  VYUHAM_CLI //
                  OPERATIVE_TERMINAL
                </span>

              </div>

              <div className="flex items-center gap-3">

                <span className="hidden text-[10px] text-emerald-500/60 sm:inline">
                  PRESS ` OR ESC
                  TO EXIT
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="rounded px-2 py-0.5 text-xs text-emerald-400/70 transition hover:bg-emerald-500/20 hover:text-emerald-300"
                >
                  ✕
                </button>

              </div>

            </div>

            {/* Terminal output */}

            <div className="flex-1 space-y-2 overflow-y-auto p-4 text-emerald-300">

              {history.map(
                (item, idx) => (
                  <div
                    key={idx}
                    className="whitespace-pre-wrap leading-relaxed"
                  >

                    {item.type ===
                      "ascii" && (
                        <pre className="overflow-x-auto py-1 text-[9px] font-bold leading-none text-emerald-400 sm:text-[10px]">
                          {item.content}
                        </pre>
                      )}

                    {item.type ===
                      "input" && (
                        <div className="font-semibold text-emerald-200">
                          {item.content}
                        </div>
                      )}

                    {item.type ===
                      "system" && (
                        <div className="italic text-emerald-400/90">
                          {item.content}
                        </div>
                      )}

                    {item.type ===
                      "output" && (
                        <div className="text-emerald-300/90">
                          {item.content}
                        </div>
                      )}

                    {item.type ===
                      "error" && (
                        <div className="font-medium text-red-400">
                          {item.content}
                        </div>
                      )}

                    {item.link && (
                      <div className="mt-1">
                        <Link
                          href={
                            item.link
                          }
                          onClick={() =>
                            setIsOpen(
                              false
                            )
                          }
                          className="inline-block font-bold text-emerald-400 underline transition hover:text-emerald-200"
                        >
                          {item.linkText ||
                            item.link}
                        </Link>
                      </div>
                    )}

                  </div>
                )
              )}

              <div
                ref={
                  terminalEndRef
                }
              />

            </div>

            {/* Input */}

            <form
              onSubmit={
                handleSubmit
              }
              className="flex items-center gap-2 border-t border-emerald-500/20 bg-black/60 px-4 py-3"
            >

              <span className="font-bold text-emerald-400">
                $
              </span>

              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) =>
                  setInputVal(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDownInput
                }
                disabled={
                  isProcessing
                }
                placeholder={
                  isProcessing
                    ? "system processing..."
                    : "type command... (try 'help')"
                }
                className="flex-1 bg-transparent font-mono text-xs text-emerald-200 outline-none disabled:cursor-not-allowed"
                autoComplete="off"
                spellCheck={false}
              />

              <button
                type="submit"
                disabled={
                  isProcessing
                }
                className="rounded border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 font-mono text-[10px] tracking-wider text-emerald-400 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isProcessing
                  ? "BUSY"
                  : "EXEC"}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* =====================================================
          LOCAL ANIMATIONS
      ===================================================== */}

      <style jsx global>{`
        @keyframes eggScan { 0% { top: -5%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 105%; opacity: 0; } }
        @keyframes eggPulse { 0%,100% { transform: scale(.94); opacity: .65; } 50% { transform: scale(1); opacity: 1; } }
        @keyframes eggTrace { from { opacity: .2; transform: rotate(var(--r,0deg)) scaleX(.65); } to { opacity: 1; transform: rotate(var(--r,0deg)) scaleX(1); } }
        @keyframes eggGlitch { 0% { transform: translate(0); } 50% { transform: translate(3px,-2px); } 100% { transform: translate(-3px,2px); } }
        @keyframes eggProgress { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
        @keyframes eggDecode { 0%,100% { filter: blur(0); opacity: 1; } 50% { filter: blur(3px); opacity: .55; } }
        @keyframes eggBars { 0%,100% { transform: scaleY(.25); opacity: .35; } 50% { transform: scaleY(1); opacity: 1; } }
        @keyframes eggCore { 0%,100% { transform: translate(-50%,-50%) scale(.96); } 50% { transform: translate(-50%,-50%) scale(1.04); } }
        @keyframes eggShake { 0%,100% { transform: translate(0); } 25% { transform: translate(-2px,1px); } 50% { transform: translate(2px,-1px); } 75% { transform: translate(-1px,-2px); } }

        @keyframes eggNoise { 0% { transform: translateX(0); opacity:.04; } 25% { transform: translateX(-2px); opacity:.12; } 50% { transform: translateX(3px); opacity:.05; } 75% { transform: translateX(-1px); opacity:.1; } 100% { transform: translateX(0); opacity:.04; } }

        @keyframes matrixGlitch {
          0% {
            transform: translate(0);
            filter: brightness(1);
          }

          15% {
            transform: translate(-4px, 1px);
            filter: brightness(1.5);
          }

          30% {
            transform: translate(4px, -2px);
            filter: contrast(1.5);
          }

          45% {
            transform: translate(-2px, 3px);
            filter: brightness(0.7);
          }

          60% {
            transform: translate(3px, -1px);
            filter: brightness(1.8);
          }

          75% {
            transform: translate(-3px, 2px);
            filter: contrast(1.8);
          }

          100% {
            transform: translate(0);
            filter: brightness(1);
          }
        }

        @keyframes terminalGlitch {
          0% {
            transform: translate(0);
            opacity: 1;
          }

          20% {
            transform: translate(-2px, 1px);
            opacity: 0.9;
          }

          40% {
            transform: translate(2px, -1px);
            opacity: 1;
          }

          60% {
            transform: translate(-1px, 2px);
            opacity: 0.8;
          }

          80% {
            transform: translate(1px, -2px);
            opacity: 1;
          }

          100% {
            transform: translate(0);
            opacity: 1;
          }
        }

        @keyframes matrixScan {
          0% {
            top: -5%;
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          90% {
            opacity: 1;
          }

          100% {
            top: 105%;
            opacity: 0;
          }
        }

        @keyframes matrixProgress {
          0% {
            transform: scaleX(0);
          }

          100% {
            transform: scaleX(1);
          }
        }

        @keyframes logoPulse {
          0%,
          100% {
            transform: scale(1);
            filter: brightness(1);
          }

          50% {
            transform: scale(1.025);
            filter: brightness(1.4);
          }
        }

        @keyframes doomsdayShake {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(3px, -2px); }
          60% { transform: translate(-2px, -1px); }
          80% { transform: translate(2px, 2px); }
          100% { transform: translate(0, 0); }
        }

        @keyframes doomsdayFlash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        @keyframes doomsdayCharge {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes doomsdayRestore {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes doomsdayScan {
          0% { transform: translateY(-35vh); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(35vh); opacity: 0; }
        }

        @keyframes doomsdayChromatic {
          0% { transform: translateX(0) skewX(0deg); opacity: .15; }
          35% { transform: translateX(-8px) skewX(-1deg); opacity: .5; }
          70% { transform: translateX(7px) skewX(1deg); opacity: .25; }
          100% { transform: translateX(0) skewX(0deg); opacity: .15; }
        }

        @keyframes doomsdayFlicker {
          0%, 72%, 100% { opacity: .35; }
          74% { opacity: 1; }
          76% { opacity: .1; }
          79% { opacity: .9; }
          82% { opacity: .2; }
        }

        @keyframes doomsdayBlackout {
          0% { opacity: 0; }
          35% { opacity: .35; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}