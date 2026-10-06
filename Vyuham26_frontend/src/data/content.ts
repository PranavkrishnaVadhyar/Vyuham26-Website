import { MEDIA } from "./media";
import { events as rawEvents } from "./events";
import type {
  Announcement,
  FestEvent,
  GalleryItem,
  ScheduleDay,
  Sponsor,
  Stream,
  TeamMember,
  UserAccount,
  Registration,
  StreamId,
} from "./types";

/* ------------------------------------------------------------------ */
/*  HOMEPAGE / GLOBAL COPY (Source: VYUHAM26_v8.pdf)                   */
/* ------------------------------------------------------------------ */

export const homepage = {
  brand: "VYUHAM",
  year: "'26",
  edition: "3RD EDITION",
  institution: "DIGITAL UNIVERSITY KERALA",
  kicker: "TECH • MANAGEMENT • CULTURAL • ESPORTS",
  tagline: "WHERE TECHNOLOGY, MANAGEMENT & CULTURE CONVERGE",
  openingLine: "NATIONAL-LEVEL TECHNO-CULTURAL FEST",
  dates: "OCTOBER 30 – NOVEMBER 1, 2026",
  location: "TECHNOCITY CAMPUS · THIRUVANANTHAPURAM, KERALA",
  countdownTarget: "2026-10-30T09:00:00+05:30",
  primaryCta: "ENTER VYUHAM",
  secondaryCta: "EXPLORE EVENTS",
  finalCta: "JOIN VYUHAM '26",
  about:
    "Vyuham is Digital University Kerala's flagship national-level management–techno–cultural fest — three days of competitions, workshops, talks and cultural showcases that bring students from across India together to build, debate, perform and celebrate.",

  aboutSupport:
    "More than a celebration of technology — Vyuham is where builders, managers and performers meet to push the boundaries of what's possible.",
  awakeningTitle: "WHERE TECHNOLOGY, MANAGEMENT & CULTURE CONVERGE.",
  awakeningLines: [
    "Three days of non-stop action at Technocity.",
    "24-hour hackathons, leadership crisis arenas, and esports brackets.",
    "Panels with industry leaders and hands-on LLM workshops.",
    "Fashion showcases, live cultural nights, and a massive closing concert.",
  ],
  stats: [
    { value: "3", label: "DAYS" },
    { value: "30+", label: "EVENTS" },
    { value: "₹2.21L", label: "PRIZE POOL" },
    { value: "100+", label: "COLLEGES" },
  ],
  contact: {
    email: "techfest@duk.ac.in",
    phone: "+91 471 278 8000",
    address: "Technocity Campus, Mangalapuram, Thiruvananthapuram – 695317",
    socials: [
      { label: "INSTAGRAM", href: "https://instagram.com/vyuham.duk" },
      { label: "YOUTUBE", href: "https://youtube.com/@VYUHAMDUK" },
      { label: "LINKEDIN", href: "https://linkedin.com" },
      { label: "X", href: "https://x.com" },
    ],
  },
};

export const navLinks = [
  { id: "home", label: "HOME", href: "/" },
  { id: "streams", label: "STREAMS", href: "/#streams" },
  { id: "schedule", label: "SCHEDULE", href: "/schedule" },
  { id: "events", label: "EVENTS", href: "/events" },
  { id: "gallery", label: "GALLERY", href: "/#gallery" },
  { id: "about", label: "ABOUT", href: "/#about" },
  { id: "venue", label: "VENUE", href: "/venue" },
  { id: "sponsors", label: "SPONSORS", href: "/sponsors" },
  { id: "contact", label: "CONTACT", href: "/contact" },
];

/** Chapter cards used by the opening cinematic sequence. */
export const introChapters = [
  { key: "campus", word: "CAMPUS", sub: "TECHNOCITY, TVM", image: MEDIA.campusNight, hold: 1250 },
  { key: "tech", word: "TECH", sub: "INNOVATE & BUILD", image: MEDIA.electronics, hold: 1100 },
  { key: "management", word: "MANAGEMENT", sub: "STRATEGY & CRISIS", image: MEDIA.impactTeam, hold: 950 },
  { key: "cultural", word: "CULTURAL", sub: "PERFORM & CELEBRATE", image: MEDIA.dancers, hold: 820 },
  { key: "esports", word: "ESPORTS", sub: "COMPETE & CONQUER", image: MEDIA.esports, hold: 700 },
];

/* ------------------------------------------------------------------ */
/*  STREAMS (Source: VYUHAM26_v8.pdf)                                  */
/* ------------------------------------------------------------------ */

export const streams: Stream[] = [
  {
    id: "tech",
    index: "01",
    name: "TECH",
    line: "Innovate, build, conquer.",
    description:
      "24HR Hackathon, Capture the Flag, Startup Showcase, Prompt War, Tech Quiz, and deep tech sessions.",
    accent: "#18c47c",
    glow: "rgba(24,196,124,0.55)",
    image: MEDIA.lab,
    stats: [
      { label: "PRIZE POOL", value: "₹1,00,000" },
      { label: "FLAGSHIP", value: "24HR HACKATHON" },
    ],
    node: { x: 0.18, y: 0.24 },
  },
  {
    id: "management",
    index: "02",
    name: "MANAGEMENT",
    line: "Lead, strategize, execute.",
    description:
      "Best Manager & Team, Finance & HR crisis simulations, Marketing strategy games, and Business Quiz.",
    accent: "#6ff2b8",
    glow: "rgba(111,242,184,0.45)",
    image: MEDIA.impactTeam,
    stats: [
      { label: "PRIZE POOL", value: "₹90,000" },
      { label: "FLAGSHIP", value: "BEST MANAGER" },
    ],
    node: { x: 0.82, y: 0.2 },
  },
  {
    id: "cultural",
    index: "03",
    name: "CULTURAL",
    line: "Celebrate, express, ignite.",
    description:
      "Runway fashion show, DUK cultural performances, live DJ night, and the headlining closing concert.",
    accent: "#f2c98a",
    glow: "rgba(242,201,138,0.45)",
    image: MEDIA.dancers,
    stats: [
      { label: "MAINSTAGE", value: "OPEN AIR STAGE" },
      { label: "FLAGSHIP", value: "CONCERT NIGHT" },
    ],
    node: { x: 0.2, y: 0.78 },
  },
  {
    id: "esports",
    index: "04",
    name: "ESPORTS",
    line: "Reflexes, tactics, victory.",
    description:
      "Valorant Tournament championship decider, high-intensity BGMI scrims, and E-Football showdowns.",
    accent: "#5ff3d2",
    glow: "rgba(95,243,210,0.45)",
    image: MEDIA.esportsArena,
    stats: [
      { label: "PRIZE POOL", value: "₹21,000" },
      { label: "FLAGSHIP", value: "VALORANT" },
    ],
    node: { x: 0.8, y: 0.8 },
  },
];

/* ------------------------------------------------------------------ */
/*  SCHEDULE / JOURNEY (Source: VYUHAM26_v8.pdf)                       */
/* ------------------------------------------------------------------ */

export const schedule: ScheduleDay[] = [
  {
    id: "day-1",
    day: "DAY 01",
    title: "DAY ONE",
    date: "30 OCT 2026",
    intensity: 0.34,
    statement: "HACKATHON BEGINS · MANAGEMENT GAMES · INAUGURATION",
    description:
      "24HR Hackathon begins with overnight mentoring, full lineup of 6 management games, tech & AI sessions, and the official VYUHAM '26 Inauguration on the Open Air Stage.",
    image: MEDIA.campusFigure,
    beats: [
      { time: "09:00 AM", label: "HACKATHON — 24HR BEGINS (MAIN HALL + LAB)" },
      { time: "10:00 AM", label: "MANAGEMENT GAMES (BEST MANAGER, TEAM, HR, FINANCE, MKTG, QUIZ)" },
      { time: "10:00 AM", label: "PANEL: RESPONSIBLE AI — A HUMANITIES LENS" },
      { time: "12:00 PM", label: "TALK: QUANTUM COMPUTING MEETS AI: REAL VS. HYPE" },
      { time: "02:00 PM", label: "WORKSHOP: PROMPT ENGINEERING & BUILDING WITH LLMS" },
      { time: "05:00 PM", label: "INAUGURATION CEREMONY (OPEN AIR STAGE)" },
      { time: "OVERNIGHT", label: "HACKATHON CONTINUES — MIDNIGHT MENTORING ROUND & SNACKS" },
    ],
  },
  {
    id: "day-2",
    day: "DAY 02",
    title: "DAY TWO",
    date: "31 OCT 2026",
    intensity: 0.68,
    statement: "HACKATHON JUDGING · CTF · MAIN STAGE NIGHT",
    description:
      "Hackathon demos and evaluation, Capture the Flag, Startup Showcase, Prompt War, Tech Quiz, expert AI talk sessions, and an electric Cultural & DJ Night.",
    image: MEDIA.crowd,
    beats: [
      { time: "09:00 AM", label: "HACKATHON DEMOS & JUDGING (MAIN HALL)" },
      { time: "10:00 AM", label: "CAPTURE THE FLAG & PROMPT WAR (COMPUTER LAB)" },
      { time: "10:00 AM", label: "STARTUP SHOWCASE & TECH QUIZ (GALLERY HALL)" },
      { time: "02:00 PM", label: "TALK: STATE OF AGENTIC AI & CAREERS IN APPLIED AI" },
      { time: "04:00 PM", label: "PANEL: CYBERSECURITY CAREERS — LIVE CTF DEBRIEF" },
      { time: "04:00 PM", label: "CULTURAL NIGHT BY DUK STUDENTS (OPEN AIR STAGE)" },
      { time: "08:00 PM", label: "DJ NIGHT (OPEN AIR STAGE)" },
    ],
  },
  {
    id: "day-3",
    day: "DAY 03",
    title: "DAY THREE",
    date: "01 NOV 2026",
    intensity: 1,
    statement: "CLOSING CEREMONY · CONCERT NIGHT",
    description:
      "AI Short Film screenings, Ethical Hacking workshop, Valorant Tournament decider, Hackathon prize distribution, Movie Quiz, Fashion Show, and the Grand Closing Concert.",
    image: MEDIA.laser,
    beats: [
      { time: "09:00 AM", label: "AI SHORT FILM SCREENINGS & KSUM TALK SESSION" },
      { time: "10:00 AM", label: "WORKSHOP: ETHICAL HACKING & OSINT RECONNAISSANCE" },
      { time: "10:00 AM", label: "VALORANT TOURNAMENT CHAMPIONSHIP DECIDER" },
      { time: "01:00 PM", label: "HACKATHON WINNERS & PRIZE DISTRIBUTION" },
      { time: "01:00 PM", label: "MOVIE QUIZ (GALLERY HALL)" },
      { time: "06:00 PM", label: "FASHION SHOW (OPEN AIR STAGE)" },
      { time: "07:00 PM", label: "CLOSING CEREMONY & CONCERT NIGHT (OPEN AIR STAGE)" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  EVENTS (Unified directly from rawEvents — Source: VYUHAM26_v8.pdf) */
/* ------------------------------------------------------------------ */

export const events: FestEvent[] = rawEvents.map((e) => {
  const imageByStream: Record<string, string> = {
    tech: MEDIA.lab,
    management: MEDIA.impactTeam,
    cultural: MEDIA.dancers,
    esports: MEDIA.esportsArena,
    general: MEDIA.crowdBlue,
    session: MEDIA.lecture,
  };

  const isClosing = e.featured || e.slug === "hackathon" || e.slug === "valorant";

  return {
    id: `ev-${e.slug}`,
    name: e.title,
    stream: e.stream as StreamId,
    day: e.day,
    date: e.day === 1 ? "30 OCT 2026" : e.day === 2 ? "31 OCT 2026" : "01 NOV 2026",
    time: e.time,
    venue: e.venue,
    blurb: e.description,
    prize: e.prizes !== "N/A" && e.prizes !== "Campus Life" ? e.prizes : undefined,
    fee: e.fee !== "FREE ENTRY" && e.fee !== "Open Access" ? e.fee : undefined,
    seats: e.slug.includes("hackathon") ? 400 : 200,
    registered: e.slug.includes("hackathon") ? 312 : 85,
    image: imageByStream[e.stream] || MEDIA.lab,
    featured: e.featured,
    status: isClosing ? "closing" : "open",
  };
});

/* ------------------------------------------------------------------ */
/*  GALLERY / EXPERIENCE                                               */
/* ------------------------------------------------------------------ */

export const gallery: GalleryItem[] = [
  { id: "g1", type: "image", src: MEDIA.crowd, caption: "MAINSTAGE — NIGHT TWO", tag: "CULTURAL", span: "wide" },
  { id: "g2", type: "image", src: MEDIA.tunnel, caption: "THE APPROACH", tag: "CAMPUS", span: "tall" },
  { id: "g3", type: "image", src: MEDIA.esportsArena, caption: "LAN FLOOR — ESPORTS ARENA", tag: "ESPORTS", span: "std" },
  { id: "g4", type: "image", src: MEDIA.electronics, caption: "BUILD BAY — COMPUTER LAB", tag: "TECH", span: "std" },
  {
    id: "g5",
    type: "video",
    src: MEDIA.heroVideo,
    poster: MEDIA.heroPoster,
    caption: "OPENING SEQUENCE — ATMOSPHERE PLATE",
    tag: "FILM",
    span: "wide",
  },
  { id: "g6", type: "image", src: MEDIA.dancerSilhouette, caption: "OPEN AIR STAGE", tag: "CULTURAL", span: "tall" },
  { id: "g7", type: "image", src: MEDIA.laser, caption: "AFTERSHOCK CLOSING CONCERT", tag: "CULTURAL", span: "std" },
  { id: "g8", type: "image", src: MEDIA.victory, caption: "GRAND FINAL — MATCH POINT", tag: "ESPORTS", span: "std" },
  { id: "g9", type: "image", src: MEDIA.campusNight, caption: "TECHNOCITY CAMPUS 02:40", tag: "CAMPUS", span: "wide" },
];

export const zones = [
  { id: "z1", code: "Z-01", name: "OPEN AIR STAGE", note: "INAUGURATION · CULTURAL · CONCERT" },
  { id: "z2", code: "Z-02", name: "MAIN HALL", note: "24HR HACKATHON · CEREMONIES" },
  { id: "z3", code: "Z-03", name: "COMPUTER LAB", note: "CTF · PROMPT WAR · LLM WORKSHOPS" },
  { id: "z4", code: "Z-04", name: "GALLERY HALL", note: "MANAGEMENT GAMES · QUIZZES · TALKS" },
  { id: "z5", code: "Z-05", name: "SEMINAR HALL", note: "AI PANELS · QUANTUM COMPUTING TALKS" },
  { id: "z6", code: "Z-06", name: "CAMPUS GROUNDS", note: "FOOD COURT · MARKETS & STALLS · CONTESTS" },
];

/* ------------------------------------------------------------------ */
/*  SPONSORS / TEAM / ANNOUNCEMENTS                                    */
/* ------------------------------------------------------------------ */

export const sponsors: Sponsor[] = [
  { id: "s1", name: "HELIONYX", tier: "Title", note: "Title Partner · Deep Tech" },
  { id: "s2", name: "ORBIT LABS", tier: "Powered By", note: "Compute & Cloud" },
  { id: "s3", name: "NORTHWIND", tier: "Powered By", note: "Energy Systems" },
  { id: "s4", name: "KAVYA MEDIA", tier: "Associate", note: "Broadcast Partner" },
  { id: "s5", name: "FORMLINE", tier: "Associate", note: "Fabrication" },
  { id: "s6", name: "STRATA FOUNDATION", tier: "Partner", note: "Impact Track" },
  { id: "s7", name: "PIXELRUNNER", tier: "Partner", note: "Esports Ops" },
  { id: "s8", name: "SAHAJ", tier: "Partner", note: "Community Outreach" },
];

export const team: TeamMember[] = [
  { id: "t1", name: "ANANYA RAO", role: "FESTIVAL DIRECTOR", dept: "CORE" },
  { id: "t2", name: "KABIR MENON", role: "TECH LEAD", dept: "STREAMS" },
  { id: "t3", name: "ISHA VERMA", role: "MANAGEMENT LEAD", dept: "STREAMS" },
  { id: "t4", name: "ROHAN D'SOUZA", role: "CULTURAL LEAD", dept: "STREAMS" },
  { id: "t5", name: "MEERA NAIR", role: "ESPORTS LEAD", dept: "STREAMS" },
  { id: "t6", name: "ADITYA SHARMA", role: "CREATIVE DIRECTOR", dept: "DESIGN" },
];

export const announcements: Announcement[] = [
  {
    id: "a1",
    date: "12 SEP 2026",
    title: "24HR HACKATHON — PROBLEM STATEMENT TRACKS ANNOUNCED",
    body: "Theme: Agentic AI / Autonomous Systems. Mentors from top AI labs confirmed for midnight rounds.",
    pinned: true,
  },
  {
    id: "a2",
    date: "04 SEP 2026",
    title: "CONCERT NIGHT HEADLINER REVEAL — COMING SOON",
    body: "The Day 3 Closing Concert headliner on the Open Air Stage will be revealed shortly.",
  },
  {
    id: "a3",
    date: "28 AUG 2026",
    title: "PRE-FEST ONLINE QUALIFIERS LIVE",
    body: "BGMI and E-Football online qualifiers begin 5 days prior to the festival kickoff.",
  },
];

/* ------------------------------------------------------------------ */
/*  SEED ACCOUNTS (demo auth layer)                                    */
/* ------------------------------------------------------------------ */

export const seedUsers: UserAccount[] = [
  {
    id: "u-admin",
    name: "VYUHAM CORE",
    email: "admin@vyuham26.in",
    password: "vyuham26",
    role: "admin",
    college: "Digital University Kerala",
    station: "Central Command",
    joined: "2026-01-04",
  },
  {
    id: "u-volunteer",
    name: "DIVYA MENON",
    email: "volunteer@vyuham26.in",
    password: "volunteer26",
    role: "volunteer",
    college: "Digital University Kerala",
    station: "Gate 1 - Main Entrance",
    joined: "2026-09-01",
  },
  {
    id: "u-demo",
    name: "ARJUN IYER",
    email: "arjun@student.in",
    password: "vyuham26",
    role: "user",
    college: "National Institute of Engineering",
    joined: "2026-08-19",
  },
];

export const seedRegistrations: Registration[] = [
  {
    id: "r-1",
    userId: "u-demo",
    userName: "ARJUN IYER",
    eventId: "ev-hackathon",
    eventName: "Hackathon — 24HR",
    createdAt: "2026-08-20",
    status: "confirmed",
  },
];
