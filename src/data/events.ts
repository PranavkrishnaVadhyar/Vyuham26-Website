/* ─── Event data model ─── */

export interface Event {
  slug: string;
  title: string;
  stream: "tech" | "culture" | "gaming" | "impact";
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
    stream: "impact",
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
    stream: "impact",
    day: 1,
    time: "09:00 — 17:00",
    venue: "Green Lab",
    description:
      "Design solutions for real environmental and social challenges. Judged on feasibility, impact and innovation.",
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
];

/* ─── Helper functions ─── */

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function getEventsByStream(stream: Event["stream"]): Event[] {
  return events.filter((e) => e.stream === stream);
}

export function getEventsByDay(day: 1 | 2 | 3): Event[] {
  return events.filter((e) => e.day === day);
}
