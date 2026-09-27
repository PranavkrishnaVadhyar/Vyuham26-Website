/* ─── Event data model ─── */

export interface Event {
  slug: string;
  title: string;
  stream: "tech" | "culture" | "gaming" | "management" | "technology" | "impact";
  day: 1 | 2 | 3;
  time: string;
  venue: string;
  description: string;
  rules: string[];
  prizes: string;
  fee: string;
  eligibility: string;
  teamSize: string;
  status: "upcoming" | "live" | "completed";
}

export const events: Event[] = [
  {
    slug: "hackathon",
    title: "Hackathon 36",
    stream: "tech",
    day: 1,
    time: "09:00 — 21:00",
    venue: "Innovation Lab",
    description:
      "A 36-hour hackathon where teams build solutions to real-world challenges. Mentors, APIs and unlimited coffee provided.",
    rules: [
      "Teams of 2–4 members",
      "No pre-built solutions allowed",
      "All code must be written during the event",
      "Use of open-source libraries is permitted",
    ],
    prizes: "₹50,000 + internship opportunities",
    fee: "₹500 / team",
    eligibility: "Open to all college students across India",
    teamSize: "2–4 members",
    status: "upcoming",
  },
  {
    slug: "ctf",
    title: "Capture The Flag",
    stream: "tech",
    day: 2,
    time: "10:00 — 18:00",
    venue: "Cyber Arena",
    description:
      "Jeopardy-style CTF with challenges spanning cryptography, reverse engineering, web exploitation and forensics.",
    rules: [
      "Solo or teams of 2",
      "No brute-force attacks on infrastructure",
      "Flag sharing results in disqualification",
    ],
    prizes: "₹25,000 + cybersecurity certification vouchers",
    fee: "₹300 / team",
    eligibility: "Open to all students",
    teamSize: "1–2 members",
    status: "upcoming",
  },
  {
    slug: "code-relay",
    title: "Code Relay",
    stream: "tech",
    day: 1,
    time: "14:00 — 17:00",
    venue: "Lab Complex",
    description:
      "A relay-style competitive programming challenge. Each team member solves one problem before passing to the next.",
    rules: [
      "Teams of 3",
      "Each round is timed",
      "Standard competitive programming rules apply",
    ],
    prizes: "₹15,000",
    fee: "₹250 / team",
    eligibility: "Open to all college students",
    teamSize: "3 members",
    status: "upcoming",
  },
  {
    slug: "ai-arena",
    title: "AI Arena",
    stream: "tech",
    day: 2,
    time: "09:00 — 16:00",
    venue: "Innovation Lab",
    description:
      "Build and deploy an AI model to solve a surprise dataset challenge. Judged on accuracy, creativity and presentation.",
    rules: [
      "Teams of 1–3",
      "Pre-trained models allowed with attribution",
      "Final presentation required",
    ],
    prizes: "₹20,000 + cloud credits",
    fee: "₹300 / team",
    eligibility: "Open to all students with ML experience",
    teamSize: "1–3 members",
    status: "upcoming",
  },
  {
    slug: "battle-of-bands",
    title: "Battle of the Bands",
    stream: "culture",
    day: 2,
    time: "18:00 — 22:00",
    venue: "Main Stage",
    description:
      "Bands compete in an electrifying live performance showdown. Original compositions and covers both welcome.",
    rules: [
      "4–8 members per band",
      "15-minute set per band",
      "Bands must bring their own instruments",
      "Sound check at 16:00",
    ],
    prizes: "₹30,000 + recording session",
    fee: "₹400 / band",
    eligibility: "Open to all",
    teamSize: "4–8 members",
    status: "upcoming",
  },
  {
    slug: "street-art",
    title: "Street Art Championship",
    stream: "culture",
    day: 1,
    time: "10:00 — 16:00",
    venue: "Campus Grounds",
    description:
      "Transform blank walls into masterpieces. Theme revealed on the day. Materials provided.",
    rules: [
      "Solo or duo",
      "Theme-based — revealed at start",
      "All materials provided",
      "No pre-made stencils",
    ],
    prizes: "₹15,000",
    fee: "₹150 / entry",
    eligibility: "Open to all students",
    teamSize: "1–2 members",
    status: "upcoming",
  },
  {
    slug: "poetry-slam",
    title: "Poetry Slam",
    stream: "culture",
    day: 3,
    time: "11:00 — 14:00",
    venue: "Amphitheatre",
    description:
      "Spoken word and poetry performances judged on content, delivery and audience response.",
    rules: [
      "Solo performance",
      "3-minute time limit per piece",
      "Original works only",
      "No props or costumes",
    ],
    prizes: "₹10,000",
    fee: "Free Entry",
    eligibility: "Open to all students",
    teamSize: "Solo",
    status: "upcoming",
  },
  {
    slug: "valorant",
    title: "Valorant Championship",
    stream: "gaming",
    day: 1,
    time: "10:00 — 20:00",
    venue: "Esports Arena",
    description:
      "5v5 competitive Valorant tournament. Double elimination bracket with live commentary.",
    rules: [
      "Teams of 5 + 1 substitute",
      "Standard competitive rules",
      "Anti-cheat required",
      "Match disputes handled by tournament officials",
    ],
    prizes: "₹25,000 + gaming peripherals",
    fee: "₹500 / team",
    eligibility: "Open to all",
    teamSize: "5+1 members",
    status: "upcoming",
  },
  {
    slug: "bgmi",
    title: "BGMI Showdown",
    stream: "gaming",
    day: 2,
    time: "10:00 — 18:00",
    venue: "Esports Arena",
    description:
      "Squad-based BGMI tournament with multiple rounds. Points-based scoring across all matches.",
    rules: [
      "Squads of 4",
      "Official devices only (no emulators)",
      "Multiple rounds with aggregate scoring",
    ],
    prizes: "₹20,000",
    fee: "₹400 / squad",
    eligibility: "Open to all",
    teamSize: "4 members",
    status: "upcoming",
  },
  {
    slug: "pitch-perfect",
    title: "Pitch Perfect",
    stream: "management",
    day: 3,
    time: "09:00 — 15:00",
    venue: "Conference Hall",
    description:
      "Pitch your startup idea to a panel of investors, entrepreneurs and industry experts. The best pitches win seed funding.",
    rules: [
      "Teams of 1–4",
      "10-minute pitch + 5-minute Q&A",
      "Slide deck required",
      "Working prototype is a plus",
    ],
    prizes: "₹40,000 + incubation opportunity",
    fee: "Free Entry",
    eligibility: "Open to all students and recent graduates",
    teamSize: "1–4 members",
    status: "upcoming",
  },
  {
    slug: "sustainability-hack",
    title: "Sustainability Hack",
    stream: "management",
    day: 1,
    time: "09:00 — 17:00",
    venue: "Green Lab",
    description:
      "Design solutions for real environmental and social challenges. Judged on feasibility, management and innovation.",
    rules: [
      "Teams of 2–4",
      "Problem statements provided on day",
      "Prototype or detailed plan required",
    ],
    prizes: "₹20,000 + mentorship program",
    fee: "Free Entry",
    eligibility: "Open to all students",
    teamSize: "2–4 members",
    status: "upcoming",
  },
  {
    slug: "dance-battle",
    title: "Dance Battle",
    stream: "culture",
    day: 2,
    time: "15:00 — 18:00",
    venue: "Main Stage",
    description:
      "Freestyle and choreographed dance face-offs. Solo and crew categories. All styles welcome.",
    rules: [
      "Solo: 3-minute performance",
      "Crew (4–12): 8-minute performance",
      "Props allowed but not required",
      "Music tracks submitted in advance",
    ],
    prizes: "₹20,000",
    fee: "₹200 / entry",
    eligibility: "Open to all students",
    teamSize: "Solo or 4–12 crew",
    status: "upcoming",
  },
  {
    slug: "robowars",
    title: "Robowars: Steel Rite",
    stream: "tech",
    day: 2,
    time: "08:00 — 18:00",
    venue: "Arena 02 · East Yard",
    description:
      "15kg combat class. Reinforced arena, open pneumatic and spinner weapon rules, and an indestructible steel perimeter.",
    rules: [
      "15kg weight limit excluding transmitter",
      "Failsafe cutoff mechanism mandatory",
      "Weapon lockout bars required in staging pits",
      "Double elimination knockout format",
    ],
    prizes: "₹1,20,000 + fabrication sponsorship",
    fee: "₹600 / bot team",
    eligibility: "Engineering and polytechnic colleges",
    teamSize: "3–5 members",
    status: "upcoming",
  },
  {
    slug: "silent-circuit",
    title: "Silent Circuit",
    stream: "tech",
    day: 2,
    time: "14:00 — 17:00",
    venue: "Electronics Lab · B Wing",
    description:
      "Reverse-engineer a sealed mystery PCB with zero schematics or documentation. Digital oscilloscopes and logic analyzers provided.",
    rules: [
      "2-person team format",
      "Only provided lab instruments allowed",
      "First team to extract the correct hex payload wins",
    ],
    prizes: "₹25,000 + oscilloscope kits",
    fee: "₹200 / team",
    eligibility: "Open to all engineering students",
    teamSize: "2 members",
    status: "upcoming",
  },
  {
    slug: "mainstage-night-one",
    title: "Mainstage: Night One",
    stream: "culture",
    day: 2,
    time: "21:00 — 00:30",
    venue: "Central Amphitheatre",
    description:
      "The premier headline audio-visual concert. Forty thousand watts of immersive acoustic pressure under the open Thiruvananthapuram night.",
    rules: [
      "Valid festival registration or band required",
      "Gates lock at 21:00 sharp",
      "Zero prohibited substances permitted on amphitheatre turf",
    ],
    prizes: "Headline Concert Pass",
    fee: "Included with Festival Pass",
    eligibility: "All VYUHAM pass holders",
    teamSize: "Open",
    status: "upcoming",
  },
  {
    slug: "nritya",
    title: "Nritya — Classical Frame",
    stream: "culture",
    day: 1,
    time: "17:00 — 20:00",
    venue: "Heritage Hall",
    description:
      "Classical Indian dance (Bharatanatyam, Mohiniyattam, Kuchipudi, Kathak) staged inside an architectural shadow lighting grid.",
    rules: [
      "Solo or duet format",
      "Maximum performance duration: 10 minutes",
      "Traditional costumes and authentic acoustic tracks required",
    ],
    prizes: "₹60,000",
    fee: "₹250 / entry",
    eligibility: "Open to all verified college dancers",
    teamSize: "1–2 members",
    status: "upcoming",
  },
  {
    slug: "street-battle",
    title: "Street Battle 2v2",
    stream: "culture",
    day: 3,
    time: "15:00 — 19:00",
    venue: "Open Plaza",
    description:
      "2v2 all-styles street dance battle. Live DJ rotation, unexpected beat drops, and raw cypher eliminations.",
    rules: [
      "2 vs 2 format",
      "No choreography allowed; raw freestyle only",
      "Judged by international panel",
    ],
    prizes: "₹80,000",
    fee: "₹300 / duo",
    eligibility: "Open to all street dancers",
    teamSize: "2 members",
    status: "upcoming",
  },
  {
    slug: "retro-arcade",
    title: "Retro Cabinet Run",
    stream: "gaming",
    day: 3,
    time: "11:00 — 16:00",
    venue: "Arcade Zone",
    description:
      "Twenty restored CRT arcade cabinets. Highest cumulative score across five retro speedrun classics. One coin credit per stage.",
    rules: [
      "Solo speedrunners only",
      "Standard arcade stick controls",
      "Live leaderboard synced to auditorium display",
    ],
    prizes: "₹15,000 + vintage gaming collectibles",
    fee: "₹100 / entry",
    eligibility: "Open to all arcade enthusiasts",
    teamSize: "Individual",
    status: "upcoming",
  },
  {
    slug: "impact-summit",
    title: "Impact Summit",
    stream: "management",
    day: 2,
    time: "10:30 — 13:00",
    venue: "Convention Hall",
    description:
      "Keynote summit bringing together climate technologists, venture partners, and policy researchers solving real urban challenges.",
    rules: [
      "Interactive Q&A participation",
      "Networking round for startup founders and investors",
    ],
    prizes: "₹1,00,000 Incubation Grant",
    fee: "Free Entry (RSVP Required)",
    eligibility: "Founders, students, researchers",
    teamSize: "Individual / Open",
    status: "upcoming",
  },
  {
    slug: "climate-build-sprint",
    title: "Climate Build Sprint",
    stream: "management",
    day: 3,
    time: "09:00 — 17:00",
    venue: "Green Lab",
    description:
      "Eight-hour rapid intervention sprint using live municipal weather and power sensor datasets. Judged on operational deployability.",
    rules: [
      "Teams of 2–4 members",
      "Solution must address one of three municipal challenge briefs",
      "Working prototype or simulation required",
    ],
    prizes: "₹1,00,000 + deployment pilot grant",
    fee: "₹300 / team",
    eligibility: "Open to all students",
    teamSize: "2–4 members",
    status: "upcoming",
  },
  {
    slug: "outreach-1000-hands",
    title: "Outreach: 1000 Hands",
    stream: "management",
    day: 1,
    time: "06:30 — 10:00",
    venue: "City Sector 4",
    description:
      "Pre-dawn social impact and ecological restoration campaign across Technocity corridors with partner non-profits.",
    rules: [
      "Protective gear provided at staging desk",
      "Community service certificate awarded upon completion",
    ],
    prizes: "Certificate of Social Impact & Merit",
    fee: "Free Volunteer Entry",
    eligibility: "Open to all volunteers",
    teamSize: "Individual / Squad",
    status: "upcoming",
  },
];

/* ─── Helper functions ─── */

const SLUG_ALIASES: Record<string, string> = {
  "ev-hack": "hackathon",
  "ev-robowars": "robowars",
  "ev-circuit": "silent-circuit",
  "ev-mainstage": "mainstage-night-one",
  "ev-nritya": "nritya",
  "ev-battle": "street-battle",
  "ev-valorant": "valorant",
  "ev-bgmi": "bgmi",
  "ev-retro": "retro-arcade",
  "ev-summit": "impact-summit",
  "ev-climate": "climate-build-sprint",
  "ev-outreach": "outreach-1000-hands",
};

export function getEventBySlug(slug: string): Event | undefined {
  const normalized = SLUG_ALIASES[slug] || slug;
  return (
    events.find((e) => e.slug === normalized) ||
    events.find((e) => e.slug === slug)
  );
}

export function getEventsByStream(stream: Event["stream"]): Event[] {
  const streamKey = stream === "technology" ? "tech" : stream === "impact" ? "management" : stream;
  return events.filter((e) => e.stream === stream || e.stream === streamKey);
}

export function getEventsByDay(day: 1 | 2 | 3): Event[] {
  return events.filter((e) => e.day === day);
}
