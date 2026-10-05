import { MEDIA } from "./media";
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
} from "./types";

/* ------------------------------------------------------------------ */
/*  HOMEPAGE / GLOBAL COPY                                             */
/* ------------------------------------------------------------------ */

export const homepage = {
  brand: "VYUHAM",
  year: "'26",
  edition: "EDITION VII",
  institution: "DIGITAL UNIVERSITY KERALA",
  kicker: "TECHNOLOGY • CULTURE • GAMING • MANAGEMENT",
  tagline: "THE FUTURE AWAITS.",
  openingLine: "THE WORLD IS CHANGING.",
  dates: "30 OCT — 01 NOV 2026",
  location: "TECHNOCITY · THIRUVANANTHAPURAM",
  countdownTarget: "2026-10-30T09:00:00+05:30",
  primaryCta: "ENTER VYUHAM",
  secondaryCta: "EXPLORE EVENTS",
  finalCta: "ENTER THE FUTURE",
  about:
    "A convergence of technology, culture, gaming and management at Digital University Kerala — bringing together ideas, creativity, competition and people shaping what comes next.",

  aboutSupport:
    "Three days. Four streams. One signal. VYUHAM'26 is built by students for the generation that refuses to wait for permission to build the future.",
  awakeningTitle: "THE FUTURE IS ALREADY HERE.",
  awakeningLines: [
    "It is being written in labs at 3AM.",
    "In rehearsal rooms that never close.",
    "In the silence before the first move.",
    "In the people who decide to begin.",
  ],
  stats: [
    { value: "72", label: "HOURS" },
    { value: "48", label: "EVENTS" },
    { value: "120+", label: "COLLEGES" },
    { value: "₹12L", label: "PRIZE POOL" },
  ],
  contact: {
    email: "vyuham@duk.ac.in",
    phone: "+91 471 278 8000",
    address: "Digital University Kerala, Technocity Campus, Thiruvananthapuram, Kerala 695317",
    socials: [
      { label: "INSTAGRAM", href: "https://instagram.com" },
      { label: "YOUTUBE", href: "https://youtube.com" },
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
  { key: "campus", word: "CAMPUS", sub: "WHERE IT BEGINS", image: MEDIA.campusNight, hold: 1250 },
  { key: "people", word: "PEOPLE", sub: "WHO REFUSE TO WAIT", image: MEDIA.lecture, hold: 1100 },
  { key: "tech", word: "TECHNOLOGY", sub: "BUILT AFTER MIDNIGHT", image: MEDIA.electronics, hold: 950 },
  { key: "culture", word: "CULTURE", sub: "LOUD AND UNAPOLOGETIC", image: MEDIA.dancers, hold: 820 },
  { key: "gaming", word: "GAMING", sub: "NO SECOND CHANCES", image: MEDIA.esports, hold: 700 },
  { key: "management", word: "MANAGEMENT", sub: "STRATEGY & EXECUTION", image: MEDIA.impactField, hold: 620 },
];

/* ------------------------------------------------------------------ */
/*  STREAMS                                                            */
/* ------------------------------------------------------------------ */

export const streams: Stream[] = [
  {
    id: "technology",
    index: "01",
    name: "TECHNOLOGY",
    line: "Build what comes next.",
    description:
      "Hardware that shouldn't work but does. Models trained on stolen sleep. 36 hours, one problem, no excuses.",
    accent: "#18c47c",
    glow: "rgba(24,196,124,0.55)",
    image: MEDIA.oscilloscope,
    stats: [
      { label: "EVENTS", value: "14" },
      { label: "PRIZE", value: "₹5L" },
    ],
    node: { x: 0.18, y: 0.24 },
  },
  {
    id: "culture",
    index: "02",
    name: "CULTURE",
    line: "Express what defines us.",
    description:
      "Twelve languages on one stage. Rhythm inherited, rebuilt, and handed forward louder than it arrived.",
    accent: "#f2c98a",
    glow: "rgba(242,201,138,0.45)",
    image: MEDIA.dancerSilhouette,
    stats: [
      { label: "EVENTS", value: "16" },
      { label: "STAGES", value: "04" },
    ],
    node: { x: 0.82, y: 0.2 },
  },
  {
    id: "gaming",
    index: "03",
    name: "GAMING",
    line: "Challenge the limits.",
    description:
      "Reaction time measured in milliseconds. LAN arenas, open brackets, and a crowd that hears every keystroke.",
    accent: "#5ff3d2",
    glow: "rgba(95,243,210,0.45)",
    image: MEDIA.esportsArena,
    stats: [
      { label: "TITLES", value: "09" },
      { label: "SLOTS", value: "512" },
    ],
    node: { x: 0.2, y: 0.78 },
  },
  {
    id: "management",
    index: "04",
    name: "MANAGEMENT",
    line: "Lead, strategize, build empires.",
    description:
      "Venture pitch battles, boardroom crisis simulations, corporate strategizing and operational leadership challenges.",
    accent: "#6ff2b8",
    glow: "rgba(111,242,184,0.45)",
    image: MEDIA.impactTeam,
    stats: [
      { label: "TRACKS", value: "09" },
      { label: "PARTNERS", value: "22" },
    ],
    node: { x: 0.8, y: 0.8 },
  },
];


/* ------------------------------------------------------------------ */
/*  SCHEDULE / JOURNEY                                                 */
/* ------------------------------------------------------------------ */

export const schedule: ScheduleDay[] = [
  {
    id: "day-1",
    day: "DAY 01",
    title: "IGNITION",
    date: "30 OCT 2026",
    intensity: 0.34,
    statement: "The first spark is always quiet.",
    description:
      "Gates open at dawn. Keynote, hackathon flag-off and the first qualifiers. The campus stops being a campus.",
    image: MEDIA.campusFigure,
    beats: [
      { time: "07:30", label: "GATES / REGISTRATION DESK" },
      { time: "09:00", label: "OPENING CEREMONY — CENTRAL AMPHITHEATRE" },
      { time: "11:00", label: "HACK VYUHAM 36H — FLAG OFF" },
      { time: "15:00", label: "STREAM QUALIFIERS BEGIN" },
      { time: "20:30", label: "NIGHT SET — LIGHT & SOUND" },
    ],
  },
  {
    id: "day-2",
    day: "DAY 02",
    title: "CONVERGENCE",
    date: "31 OCT 2026",
    intensity: 0.68,
    statement: "Four streams. One current.",
    description:
      "Every arena runs at once. Robotics finals overlap with the cultural mainstage while the LAN floor never sleeps.",
    image: MEDIA.crowd,
    beats: [
      { time: "08:00", label: "ROBOWARS — ARENA 02" },
      { time: "10:30", label: "IMPACT SUMMIT — FOUNDERS PANEL" },
      { time: "13:00", label: "LAN FINALS — STAGE GRID" },
      { time: "17:00", label: "CULTURAL MAINSTAGE OPENS" },
      { time: "21:00", label: "HEADLINE PERFORMANCE" },
    ],
  },
  {
    id: "day-3",
    day: "DAY 03",
    title: "AFTERSHOCK",
    date: "01 NOV 2026",
    intensity: 1,
    statement: "What remains when the lights cut.",
    description:
      "Grand finales, results, and the closing sequence. Everything built over 72 hours collides in one night.",
    image: MEDIA.laser,
    beats: [
      { time: "09:00", label: "HACK VYUHAM — FINAL PITCHES" },
      { time: "12:00", label: "GRAND FINALS — ALL STREAMS" },
      { time: "16:00", label: "SHOWCASE WALK — INNOVATION MILE" },
      { time: "19:00", label: "AWARDS & CLOSING" },
      { time: "21:30", label: "AFTERSHOCK — CLOSING SET" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  EVENTS                                                             */
/* ------------------------------------------------------------------ */

export const events: FestEvent[] = [
  {
    id: "ev-hack",
    name: "HACK VYUHAM 36",
    stream: "technology",
    day: 1,
    date: "30 OCT 2026",
    time: "11:00 — 23:00",
    venue: "INNOVATION BLOCK · L4",
    blurb:
      "Thirty-six uninterrupted hours. One brief revealed at flag-off. Build, break, ship before the sun comes back twice.",
    prize: "₹2,50,000",
    seats: 400,
    registered: 331,
    image: MEDIA.lab,
    featured: true,
    status: "closing",
  },
  {
    id: "ev-robowars",
    name: "ROBOWARS: STEEL RITE",
    stream: "technology",
    day: 2,
    date: "31 OCT 2026",
    time: "08:00 — 18:00",
    venue: "ARENA 02 · EAST YARD",
    blurb:
      "15kg combat class. Reinforced arena, open weapon rules, and a floor that has never survived a full weekend.",
    prize: "₹1,20,000",
    seats: 64,
    registered: 64,
    image: MEDIA.roboticsWide,
    status: "full",
  },
  {
    id: "ev-circuit",
    name: "SILENT CIRCUIT",
    stream: "technology",
    day: 2,
    date: "31 OCT 2026",
    time: "14:00 — 17:00",
    venue: "ELECTRONICS LAB · B WING",
    blurb:
      "Reverse-engineer a sealed board with no documentation. Oscilloscopes provided. Assumptions are not.",
    seats: 120,
    registered: 87,
    image: MEDIA.oscilloscope,
    status: "open",
  },
  {
    id: "ev-mainstage",
    name: "MAINSTAGE: NIGHT ONE",
    stream: "culture",
    day: 2,
    date: "31 OCT 2026",
    time: "21:00 — 00:30",
    venue: "CENTRAL AMPHITHEATRE",
    blurb:
      "The headline set. Forty thousand watts, a crowd that arrived six hours early, and a skyline that answers back.",
    seats: 6000,
    registered: 4820,
    image: MEDIA.crowdBlue,
    featured: true,
    status: "open",
  },
  {
    id: "ev-nritya",
    name: "NRITYA — CLASSICAL FRAME",
    stream: "culture",
    day: 1,
    date: "30 OCT 2026",
    time: "17:00 — 20:00",
    venue: "HERITAGE HALL",
    blurb:
      "Bharatanatyam, Kuchipudi and Kathak in a single lighting grid designed for shadow, not spectacle.",
    prize: "₹60,000",
    seats: 300,
    registered: 244,
    image: MEDIA.kathakali,
    status: "open",
  },
  {
    id: "ev-battle",
    name: "STREET BATTLE 2V2",
    stream: "culture",
    day: 3,
    date: "01 NOV 2026",
    time: "15:00 — 19:00",
    venue: "OPEN PLAZA",
    blurb: "Open cypher, elimination format, live DJ. No choreography allowed — only what you can answer with.",
    prize: "₹80,000",
    seats: 128,
    registered: 96,
    image: MEDIA.dancers,
    status: "open",
  },
  {
    id: "ev-valorant",
    name: "VALORANT OPEN BRACKET",
    stream: "gaming",
    day: 2,
    date: "31 OCT 2026",
    time: "10:00 — 22:00",
    venue: "LAN FLOOR · ARENA 01",
    blurb:
      "128 teams. Double elimination. Broadcast desk, shoutcast, and a viewing wall that makes every clutch public.",
    prize: "₹1,50,000",
    seats: 640,
    registered: 588,
    image: MEDIA.esports,
    featured: true,
    status: "closing",
  },
  {
    id: "ev-bgmi",
    name: "BGMI SCRIM SERIES",
    stream: "gaming",
    day: 1,
    date: "30 OCT 2026",
    time: "13:00 — 20:00",
    venue: "MOBILE ARENA · DOME",
    blurb: "Six matches, rolling points, zero reruns. Bring your own device, we bring the pressure.",
    prize: "₹70,000",
    seats: 400,
    registered: 312,
    image: MEDIA.arcade,
    status: "open",
  },
  {
    id: "ev-retro",
    name: "RETRO CABINET RUN",
    stream: "gaming",
    day: 3,
    date: "01 NOV 2026",
    time: "11:00 — 16:00",
    venue: "ARCADE ZONE",
    blurb: "Twenty restored cabinets. Highest aggregate score across five titles. One credit each.",
    seats: 200,
    registered: 121,
    image: MEDIA.gamingRoom,
    status: "open",
  },
  {
    id: "ev-summit",
    name: "IMPACT SUMMIT",
    stream: "impact",
    day: 2,
    date: "31 OCT 2026",
    time: "10:30 — 13:00",
    venue: "CONVENTION HALL",
    blurb:
      "Founders, policy researchers and climate engineers in conversation about what actually scales beyond a pitch deck.",
    seats: 800,
    registered: 512,
    image: MEDIA.filmCrew,
    status: "open",
  },
  {
    id: "ev-climate",
    name: "CLIMATE BUILD SPRINT",
    stream: "impact",
    day: 3,
    date: "01 NOV 2026",
    time: "09:00 — 17:00",
    venue: "GREEN LAB",
    blurb:
      "Eight hours to prototype one intervention for a real municipal dataset. Judged on deployability, not slides.",
    prize: "₹1,00,000",
    seats: 150,
    registered: 108,
    image: MEDIA.impactField,
    status: "open",
  },
  {
    id: "ev-outreach",
    name: "OUTREACH: 1000 HANDS",
    stream: "impact",
    day: 1,
    date: "30 OCT 2026",
    time: "06:30 — 10:00",
    venue: "CITY SECTOR 4",
    blurb:
      "A pre-dawn city intervention run with partner NGOs. Registration closes when the vans are full.",
    seats: 1000,
    registered: 742,
    image: MEDIA.impactTeam,
    status: "open",
  },
];

/* ------------------------------------------------------------------ */
/*  GALLERY / EXPERIENCE                                               */
/* ------------------------------------------------------------------ */

export const gallery: GalleryItem[] = [
  { id: "g1", type: "image", src: MEDIA.crowd, caption: "MAINSTAGE — NIGHT TWO", tag: "CULTURE", span: "wide" },
  { id: "g2", type: "image", src: MEDIA.tunnel, caption: "THE APPROACH", tag: "CAMPUS", span: "tall" },
  { id: "g3", type: "image", src: MEDIA.esportsArena, caption: "LAN FLOOR — ARENA 01", tag: "GAMING", span: "std" },
  { id: "g4", type: "image", src: MEDIA.electronics, caption: "BUILD BAY 07", tag: "TECHNOLOGY", span: "std" },
  {
    id: "g5",
    type: "video",
    src: MEDIA.heroVideo,
    poster: MEDIA.heroPoster,
    caption: "OPENING SEQUENCE — ATMOSPHERE PLATE",
    tag: "FILM",
    span: "wide",
  },
  { id: "g6", type: "image", src: MEDIA.dancerSilhouette, caption: "HERITAGE HALL", tag: "CULTURE", span: "tall" },
  { id: "g7", type: "image", src: MEDIA.laser, caption: "AFTERSHOCK CLOSING SET", tag: "CULTURE", span: "std" },
  { id: "g8", type: "image", src: MEDIA.victory, caption: "GRAND FINAL — MATCH POINT", tag: "GAMING", span: "std" },
  { id: "g9", type: "image", src: MEDIA.campusNight, caption: "SOUTH CAMPUS 02:40", tag: "CAMPUS", span: "wide" },
];

export const zones = [
  { id: "z1", code: "Z-01", name: "CENTRAL AMPHITHEATRE", note: "6,000 CAP · MAINSTAGE" },
  { id: "z2", code: "Z-02", name: "INNOVATION BLOCK", note: "HACK FLOOR · 36H ACCESS" },
  { id: "z3", code: "Z-03", name: "ARENA GRID", note: "LAN + ROBOTICS COMBAT" },
  { id: "z4", code: "Z-04", name: "HERITAGE HALL", note: "CLASSICAL & THEATRE" },
  { id: "z5", code: "Z-05", name: "INNOVATION MILE", note: "EXHIBITS · STARTUP WALK" },
  { id: "z6", code: "Z-06", name: "NIGHT MARKET", note: "FOOD · MERCH · 24H" },
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
  { id: "t2", name: "KABIR MENON", role: "TECHNOLOGY LEAD", dept: "STREAMS" },
  { id: "t3", name: "ISHA VERMA", role: "CULTURE LEAD", dept: "STREAMS" },
  { id: "t4", name: "ROHAN D'SOUZA", role: "GAMING LEAD", dept: "STREAMS" },
  { id: "t5", name: "MEERA NAIR", role: "IMPACT LEAD", dept: "STREAMS" },
  { id: "t6", name: "ADITYA SHARMA", role: "CREATIVE DIRECTOR", dept: "DESIGN" },
];

export const announcements: Announcement[] = [
  {
    id: "a1",
    date: "12 SEP 2026",
    title: "HACK VYUHAM 36 — SECOND WAVE OPEN",
    body: "An additional 120 seats released after infrastructure expansion in the Innovation Block.",
    pinned: true,
  },
  {
    id: "a2",
    date: "04 SEP 2026",
    title: "MAINSTAGE HEADLINER REVEAL — 25 SEP",
    body: "The Night Two headline act will be announced in the reveal film dropping at 20:00 IST.",
  },
  {
    id: "a3",
    date: "28 AUG 2026",
    title: "TRAVEL & ACCOMMODATION DESK LIVE",
    body: "Outstation participants can now request subsidised campus housing during registration.",
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
    eventId: "ev-hack",
    eventName: "HACK VYUHAM 36",
    createdAt: "2026-08-20",
    status: "confirmed",
  },
];
