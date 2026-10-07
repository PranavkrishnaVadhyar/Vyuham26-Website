/* ─── Official VYUHAM'26 Event Schedule Data (Source: VYUHAM26_v8.pdf) ─── */

export interface Event {
  id?: string;
  slug: string;
  title: string;
  stream: "tech" | "management" | "cultural" | "esports" | "general" | "session" | "technology" | "culture" | "gaming" | "impact";
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
  featured?: boolean;
  starred?: boolean;
}

export const events: Event[] = [
  /* =========================================================================
     DAY 1 — OCTOBER 30, 2026
     Theme: HACKATHON BEGINS · MANAGEMENT GAMES · INAUGURATION
     Day Prize Pool: ₹1,20,000
     ========================================================================= */
  {
    slug: "hackathon",
    title: "Hackathon — 24HR",
    stream: "tech",
    day: 1,
    time: "9:00 AM – 9:00 AM (DAY 2)",
    venue: "Main Hall + Computer Lab",
    description:
      "Theme: Agentic AI / Autonomous Systems. 24-hour hackathon, overnight build.",
    rules: [
      "24 uninterrupted hours of collaborative building",
      "Theme: Agentic AI / Autonomous Systems",
      "Midnight mentoring round and refreshments in Main Hall",
      "Prototype demos and jury evaluation on Day 2 morning",
    ],
    prizes: "₹30,000",
    fee: "₹1,000 per team",
    eligibility: "Open to students and developers across India",
    teamSize: "2–4 members",
    status: "upcoming",
    featured: true,
  },
  {
    slug: "best-manager",
    title: "Best Manager",
    stream: "management",
    day: 1,
    time: "10:00 AM – 5:00 PM",
    venue: "Gallery Hall",
    description: "Aptitude, crisis management & leadership interview.",
    rules: [
      "Individual participation",
      "Multi-tier evaluation: Aptitude screening, spontaneous crisis handling, and executive board interview",
      "Final leadership ranking by corporate jury",
    ],
    prizes: "₹15,000",
    fee: "₹200",
    eligibility: "Open to all undergraduate and postgraduate students",
    teamSize: "Individual",
    status: "upcoming",
    featured: true,
  },
  {
    slug: "best-management-team",
    title: "Best Management Team",
    stream: "management",
    day: 1,
    time: "10:00 AM – 5:00 PM",
    venue: "Gallery Hall",
    description: "Team-based business strategy evaluation.",
    rules: [
      "Cross-functional team strategy simulation",
      "Case study resolution, resource optimization, and corporate pitch",
      "Conducted at Gallery Hall",
    ],
    prizes: "₹20,000",
    fee: "₹400",
    eligibility: "College and university management teams",
    teamSize: "3–4 members",
    status: "upcoming",
  },
  {
    slug: "marketing-game",
    title: "Marketing Game",
    stream: "management",
    day: 1,
    time: "10:00 AM – 5:00 PM",
    venue: "Gallery Hall",
    description: "Product & campaign strategy simulation.",
    rules: [
      "Product positioning, viral campaign strategy, and live pitch",
      "Judged on market feasibility, positioning, and storytelling",
    ],
    prizes: "₹15,000",
    fee: "₹400",
    eligibility: "Open to all college students",
    teamSize: "Teams of 2–3",
    status: "upcoming",
  },
  {
    slug: "finance-game",
    title: "Finance Game",
    stream: "management",
    day: 1,
    time: "10:00 AM – 5:00 PM",
    venue: "Gallery Hall",
    description: "Simulated crisis — risk, budget & strategy.",
    rules: [
      "Capital budgeting, financial crisis simulation, and risk hedging",
      "Real-time market volatility and portfolio defense rounds",
    ],
    prizes: "₹15,000",
    fee: "₹400",
    eligibility: "Open to all students",
    teamSize: "Teams of 2–3",
    status: "upcoming",
  },
  {
    slug: "hr-game",
    title: "HR Game",
    stream: "management",
    day: 1,
    time: "10:00 AM – 5:00 PM",
    venue: "Gallery Hall",
    description: "Debates, HR crossword, minefield & case studies.",
    rules: [
      "Includes HR crossword, organizational leadership debates, workplace minefield, and conflict case studies",
      "Evaluated on negotiation, team cohesion, and crisis diplomacy",
    ],
    prizes: "₹15,000",
    fee: "₹400",
    eligibility: "Open to all students",
    teamSize: "Teams of 2–3",
    status: "upcoming",
  },
  {
    slug: "business-quiz",
    title: "Business Quiz",
    stream: "management",
    day: 1,
    time: "10:00 AM – 5:00 PM",
    venue: "Gallery Hall",
    description: "Current affairs, sports & management rounds.",
    rules: [
      "Written preliminary round followed by on-stage buzzer finals",
      "Covers global markets, corporate history, sports business, and current affairs",
    ],
    prizes: "₹10,000",
    fee: "₹200",
    eligibility: "Open to all students",
    teamSize: "Teams of 2",
    status: "upcoming",
  },
  {
    slug: "panel-responsible-ai",
    title: "Panel: Responsible AI — A Humanities Lens",
    stream: "session",
    day: 1,
    time: "10:00 AM – 11:30 AM",
    venue: "Seminar Hall",
    description: "“Responsible AI — A Humanities Lens”.",
    rules: [
      "Distinguished panel on ethics, humanities, and AI governance",
      "Interactive audience discussion round",
    ],
    prizes: "Knowledge Session",
    fee: "Free Entry",
    eligibility: "Open to all fest delegates",
    teamSize: "Open",
    status: "upcoming",
  },
  {
    slug: "talk-quantum-ai",
    title: "Talk: Quantum Computing Meets AI",
    stream: "session",
    day: 1,
    time: "12:00 PM – 1:30 PM",
    venue: "Seminar Hall",
    description: "“Quantum Computing Meets AI: Real vs. Hype”.",
    rules: [
      "Keynote presentation on quantum architectures and artificial intelligence frontiers",
    ],
    prizes: "Keynote Talk",
    fee: "Free Entry",
    eligibility: "Open to all attendees",
    teamSize: "Open",
    status: "upcoming",
  },
  {
    slug: "workshop-prompt-engineering",
    title: "Hands-on Workshop: Prompt Engineering & LLMs",
    stream: "session",
    day: 1,
    time: "2:00 PM – 3:30 PM",
    venue: "Computer Lab",
    description: "“Prompt Engineering & Building with LLMs” (BYOD).",
    rules: [
      "Hands-on interactive lab: Bring Your Own Device (BYOD)",
      "Covers advanced prompt design, context framing, and LLM application prototyping",
    ],
    prizes: "Hands-on Masterclass",
    fee: "Free Entry (BYOD)",
    eligibility: "Open to all attendees",
    teamSize: "Individual",
    status: "upcoming",
  },
  {
    slug: "inauguration-ceremony",
    title: "Inauguration Ceremony",
    stream: "general",
    day: 1,
    time: "5:00 PM",
    venue: "Open Air Stage",
    description: "Official opening of VYUHAM ’26 · Main Stage.",
    rules: [
      "Official festival opening ceremony, dignitary addresses, and lighting of the lamp",
      "All festival delegates and guests assemble at the Open Air Stage",
    ],
    prizes: "Opening Milestone",
    fee: "Open to All",
    eligibility: "All participants and visitors",
    teamSize: "Open",
    status: "upcoming",
    featured: true,
  },
  {
    slug: "play-fest",
    title: "Play Fest",
    stream: "general",
    day: 1,
    time: "Day One",
    venue: "Entertainment Zone",
    description: "Entertainment zone and casual games.",
    rules: [
      "Open casual gaming and interactive carnival installations",
      "Free access throughout Day 1",
    ],
    prizes: "Recreation & Games",
    fee: "Free Entry",
    eligibility: "Open to all delegates",
    teamSize: "Open",
    status: "upcoming",
  },
  {
    slug: "fitness-competition",
    title: "Fitness Competition",
    stream: "general",
    day: 1,
    time: "Day One",
    venue: "Campus Grounds",
    description: "Physical fitness and endurance challenge.",
    rules: [
      "Calisthenics, stamina drills, and timed fitness circuits",
      "Individual scoring table",
    ],
    prizes: "Fitness Challenge",
    fee: "₹50 per head",
    eligibility: "Open to all participants",
    teamSize: "Individual",
    status: "upcoming",
  },

  /* =========================================================================
     DAY 2 — OCTOBER 31, 2026
     Theme: HACKATHON JUDGING · CTF · MAIN STAGE NIGHT
     Day Prize Pool: ₹55,000
     ========================================================================= */
  {
    slug: "hackathon-demos",
    title: "Hackathon Demos & Judging",
    stream: "tech",
    day: 2,
    time: "9:00 AM – 11:00 AM",
    venue: "Main Hall",
    description: "Open floor demonstrations to the jury.",
    rules: [
      "Open floor demonstration of working prototypes built during 24HR Hackathon",
      "Jury evaluation based on innovation, technical execution, and impact",
    ],
    prizes: "Finalist Review",
    fee: "Hackathon Teams",
    eligibility: "24HR Hackathon teams",
    teamSize: "Teams",
    status: "upcoming",
  },
  {
    slug: "ctf",
    title: "Capture the Flag",
    stream: "tech",
    day: 2,
    time: "10:00 AM – 5:00 PM",
    venue: "Computer Lab",
    description: "Cybersecurity puzzles and challenges.",
    rules: [
      "Jeopardy-style security challenge matrix",
      "Categories: Cryptography, Web Exploitation, Reverse Engineering, and Forensics",
      "Strict anti-sharing and infrastructure protection rules",
    ],
    prizes: "₹15,000",
    fee: "₹400",
    eligibility: "Open to all cybersecurity enthusiasts",
    teamSize: "1–2 members",
    status: "upcoming",
    featured: true,
  },
  {
    slug: "startup-showcase",
    title: "Startup Showcase",
    stream: "tech",
    day: 2,
    time: "10:00 AM – 5:00 PM",
    venue: "Gallery Hall",
    description: "Founders pitch to a panel of experts.",
    rules: [
      "Pitch deck and product demonstration to venture experts and founders",
      "Focused Q&A round evaluating scalability, technology, and market fit",
    ],
    prizes: "₹15,000",
    fee: "₹400",
    eligibility: "Student startups and early-stage founders",
    teamSize: "Teams of 1–4",
    status: "upcoming",
  },
  {
    slug: "prompt-war",
    title: "Prompt War",
    stream: "tech",
    day: 2,
    time: "10:00 AM – 5:00 PM",
    venue: "Computer Lab",
    description: "Prompt-engineering challenge.",
    rules: [
      "Time-constrained prompt engineering trials against complex target outputs",
      "Evaluation on precision, token economics, and contextual fidelity",
    ],
    prizes: "₹15,000",
    fee: "₹400",
    eligibility: "Open to all students",
    teamSize: "Individual / Pairs",
    status: "upcoming",
  },
  {
    slug: "tech-quiz",
    title: "Tech Quiz",
    stream: "tech",
    day: 2,
    time: "10:00 AM – 5:00 PM",
    venue: "Gallery Hall",
    description: "General technology knowledge rounds.",
    rules: [
      "Written prelims followed by multi-round on-stage buzzer finals",
      "Questions on computer science, AI, internet history, and cutting-edge engineering",
    ],
    prizes: "₹10,000",
    fee: "₹200",
    eligibility: "Open to all students",
    teamSize: "Teams of 2",
    status: "upcoming",
  },
  {
    slug: "workshop-tech",
    title: "Workshop (Tech & Innovation)",
    stream: "session",
    day: 2,
    time: "10:00 AM – 11:00 AM",
    venue: "Gallery Hall",
    description: "Interactive technology and innovation workshop.",
    rules: [
      "Interactive session led by industry practitioners",
      "Hands-on walkthrough and technical discussion",
    ],
    prizes: "Masterclass",
    fee: "Free Entry",
    eligibility: "Open to all attendees",
    teamSize: "Individual",
    status: "upcoming",
  },
  {
    slug: "debate-open-floor",
    title: "Talk Session: Debate — Open Floor",
    stream: "general",
    day: 2,
    time: "11:00 AM – 1:00 PM",
    venue: "Gallery Hall",
    description: "Debate — open floor interactive discussion.",
    rules: [
      "Moderated open-floor parliamentary-style debate",
      "Topics spanning technology ethics, automated society, and human agency",
    ],
    prizes: "Open Floor",
    fee: "Free Entry",
    eligibility: "Open to all attendees",
    teamSize: "Open",
    status: "upcoming",
  },
  {
    slug: "talk-agentic-ai",
    title: "Talk: State of Agentic AI & Careers",
    stream: "general",
    day: 2,
    time: "2:00 PM – 3:30 PM",
    venue: "Gallery Hall",
    description: "“State of Agentic AI & Careers in Applied AI”.",
    rules: [
      "Keynote insights on agentic workflows, multi-agent frameworks, and industry pathways",
      "Audience Q&A and networking",
    ],
    prizes: "Industry Keynote",
    fee: "Free Entry",
    eligibility: "Open to all attendees",
    teamSize: "Open",
    status: "upcoming",
  },
  {
    slug: "panel-cybersecurity",
    title: "Panel: Cybersecurity Careers",
    stream: "session",
    day: 2,
    time: "4:00 PM – 5:00 PM",
    venue: "Gallery Hall",
    description: "“Cybersecurity Careers — Live CTF Debrief”.",
    rules: [
      "Live walkthrough of key challenges from the Capture the Flag competition",
      "Discussion on industry certifications, bug bounties, and security engineering roles",
    ],
    prizes: "CTF Debrief Session",
    fee: "Free Entry",
    eligibility: "Open to all attendees",
    teamSize: "Open",
    status: "upcoming",
  },
  {
    slug: "cultural-night",
    title: "Cultural Night",
    stream: "cultural",
    day: 2,
    time: "4:00 PM – 7:00 PM",
    venue: "Open Air Stage",
    description: "By DUK students on the Open Air Stage.",
    rules: [
      "Showcase by students of Digital University Kerala",
      "Acoustic sets, choreographed dance productions, and dramatic performances",
    ],
    prizes: "Main Stage Showcase",
    fee: "Open to All",
    eligibility: "All delegates and visitors",
    teamSize: "Open",
    status: "upcoming",
    featured: true,
  },
  {
    slug: "dj-night",
    title: "DJ Night",
    stream: "cultural",
    day: 2,
    time: "8:00 PM – 10:00 PM",
    venue: "Open Air Stage",
    description: "Open-air electronic dance music showcase.",
    rules: [
      "Live DJ electronic set on the main stage",
      "Open festival admission with valid fest ID or wristband",
    ],
    prizes: "Live DJ Showcase",
    fee: "Open to All",
    eligibility: "All delegates and visitors",
    teamSize: "Open",
    status: "upcoming",
  },

  /* =========================================================================
     DAY 3 — NOVEMBER 1, 2026
     Theme: CLOSING CEREMONY · CONCERT NIGHT
     Day Prize Pool: ₹25,000
     ========================================================================= */
  {
    slug: "workshop-ethical-hacking",
    title: "Workshop: Ethical Hacking & OSINT Reconnaissance",
    stream: "session",
    day: 3,
    time: "10:00 AM – 1:00 PM",
    venue: "Gallery Hall",
    description:
      "“Ethical Hacking & OSINT Reconnaissance: Think Like an Attacker”.",
    rules: [
      "Hands-on tactical offensive methodology and open-source intelligence gathering",
      "Demonstration of defensive countermeasures and target surface discovery",
    ],
    prizes: "Masterclass",
    fee: "Free Entry",
    eligibility: "Open to all attendees",
    teamSize: "Individual",
    status: "upcoming",
  },
  {
    slug: "ai-short-film",
    title: "AI Short Film",
    stream: "tech",
    day: 3,
    time: "9:00 AM – 5:00 PM",
    venue: "Seminar Hall / Digital Showcase",
    description:
      "Theme-based short film, made entirely with AI tools.",
    rules: [
      "All video, script, and audio assets must be generated using AI tools",
      "Theme-based cinematic submission",
      "Free entry open call",
    ],
    prizes: "₹10,000",
    fee: "FREE ENTRY",
    eligibility: "Open to all digital creators",
    teamSize: "Individual / Teams",
    status: "upcoming",
  },
  {
    slug: "talk-ksum",
    title: "Talk Session (Kerala Startup Mission)",
    stream: "session",
    day: 3,
    time: "9:00 AM – 5:00 PM",
    venue: "Gallery Hall",
    description: "By Kerala Startup Mission.",
    rules: [
      "Keynote and advisory sessions on venture grants, incubator access, and innovation policies",
      "Direct interaction with startup officers and mentors",
    ],
    prizes: "Ecosystem Session",
    fee: "Free Entry",
    eligibility: "Open to all founders and students",
    teamSize: "Open",
    status: "upcoming",
  },
  {
    slug: "valorant",
    title: "Valorant Tournament",
    stream: "esports",
    day: 3,
    time: "10:00 AM – 1:00 PM",
    venue: "Live / Online",
    description: "Championship decider — LIVE / ONLINE esports championship.",
    rules: [
      "5v5 competitive tactical shooter format",
      "Live and online championship decider bracket",
      "Official anti-cheat and referee validation",
    ],
    prizes: "₹10,000",
    fee: "₹500",
    eligibility: "Open to verified esports teams",
    teamSize: "5 members",
    status: "upcoming",
    featured: true,
  },
  {
    slug: "hackathon-winners",
    title: "Hackathon Winners & Prize Distribution",
    stream: "tech",
    day: 3,
    time: "1:00 PM",
    venue: "Main Hall",
    description: "Closing of the 24HR Hackathon.",
    rules: [
      "Official winner announcement and cash prize distribution ceremony",
      "All hackathon participants assemble at Main Hall",
    ],
    prizes: "₹30,000 Award Distribution",
    fee: "Hackathon Teams",
    eligibility: "Hackathon participants",
    teamSize: "Teams",
    status: "upcoming",
  },
  {
    slug: "movie-quiz",
    title: "Movie Quiz",
    stream: "cultural",
    day: 3,
    time: "1:00 PM – 3:00 PM",
    venue: "Gallery Hall",
    description: "Trivia across genres & eras.",
    rules: [
      "Multi-round film trivia across classic, regional, and world cinema",
      "Audio-visual identifier rounds and buzzer finals",
    ],
    prizes: "₹5,000",
    fee: "₹200",
    eligibility: "Open to all film enthusiasts",
    teamSize: "Teams of 2",
    status: "upcoming",
  },
  {
    slug: "fashion-show",
    title: "Fashion Show",
    stream: "cultural",
    day: 3,
    time: "6:00 PM – 7:00 PM",
    venue: "Open Air Stage",
    description:
      "Student designers and models on the runway. OPEN CALL — NO REG FEE.",
    rules: [
      "Open call for student designers and models",
      "Original collections and themed runway showcases",
      "No registration fee required",
    ],
    prizes: "Runway Titles",
    fee: "OPEN CALL — NO REG FEE",
    eligibility: "Student designers and models",
    teamSize: "Individual / Teams",
    status: "upcoming",
    featured: true,
  },
  {
    slug: "concert",
    title: "Concert Night",
    stream: "cultural",
    day: 3,
    time: "7:00 PM – 10:00 PM",
    venue: "Open Air Stage",
    description: "Closing night, Main Stage.",
    rules: [
      "Three days end on the Open Air Stage",
      "Headline live musical performance",
      "Open access with festival pass",
    ],
    prizes: "Closing Concert",
    fee: "Free Entry",
    eligibility: "All festival attendees",
    teamSize: "Open",
    status: "upcoming",
    featured: true,
  },

  /* =========================================================================
     PRE-FEST & ALL 3 DAYS (CAMPUS LIFE & ONLINE QUALIFIERS)
     Prize Pool: ₹21,000
     ========================================================================= */
  {
    slug: "efootball",
    title: "E-Football Tournament",
    stream: "esports",
    day: 1,
    time: "Online Qualifiers",
    venue: "Online",
    description: "Online qualifiers for E-Football championship.",
    rules: [
      "Pre-Fest: 5 days before festival kickoff",
      "1v1 online knockout tournament",
      "Registered player fixtures and live result tracking",
    ],
    prizes: "₹5,000",
    fee: "ONLINE REG: ₹50/HEAD",
    eligibility: "Open to all players",
    teamSize: "Individual",
    status: "upcoming",
  },
  {
    slug: "bgmi",
    title: "BGMI Tournament",
    stream: "esports",
    day: 1,
    time: "Online Qualifiers",
    venue: "Online",
    description: "Online qualifiers for BGMI battle royale tournament.",
    rules: [
      "Pre-Fest: 5 days before festival kickoff",
      "Squad-based Battle Royale elimination brackets",
      "Aggregate points scoring across qualifier matches",
    ],
    prizes: "₹6,000",
    fee: "ONLINE REG: ₹50/HEAD",
    eligibility: "Open to mobile esports squads",
    teamSize: "Squad of 4",
    status: "upcoming",
  },
  {
    slug: "photography",
    title: "Photography & Videography",
    stream: "general",
    day: 1,
    time: "Running All 3 Days",
    venue: "Campus Wide",
    description: "Campus-wide open contest across all three days.",
    rules: [
      "Campus-wide photography and filmmaking competition",
      "Capture the spirit, architecture, and action of VYUHAM '26",
      "Submissions open across all 3 festival days",
    ],
    prizes: "₹10,000",
    fee: "CAMPUS WIDE REG: ₹100",
    eligibility: "Open to all attendees",
    teamSize: "Individual",
    status: "upcoming",
  },
  {
    slug: "food-court",
    title: "Food Court, Markets & Stalls",
    stream: "general",
    day: 1,
    time: "All Day · 3 Days",
    venue: "Campus Grounds",
    description: "Open all three days · Campus grounds food court, stalls & merchandise.",
    rules: [
      "Curated food stalls, merchandise, and student pop-ups",
      "Active throughout all 3 days across Technocity grounds",
    ],
    prizes: "Campus Life",
    fee: "Open Access",
    eligibility: "All attendees",
    teamSize: "Open",
    status: "upcoming",
  },
];

/* ─── Helper functions & aliases ─── */

const SLUG_ALIASES: Record<string, string> = {
  "hackathon-24hr": "hackathon",
  "capture-the-flag": "ctf",
  "valorant-tournament": "valorant",
  "bgmi-tournament": "bgmi",
  "efootball-tournament": "efootball",
  "closing-concert": "concert",
  "photography-videography": "photography",
  "fashion": "fashion-show",
};

export function getEventBySlug(slug: string): Event | undefined {
  const normalized = SLUG_ALIASES[slug] || slug;
  return (
    events.find((e) => e.slug === normalized) ||
    events.find((e) => e.slug === slug)
  );
}

export function getEventsByStream(stream: string): Event[] {
  const streamKey =
    stream === "technology"
      ? "tech"
      : stream === "gaming"
      ? "esports"
      : stream === "culture"
      ? "cultural"
      : stream === "impact"
      ? "management"
      : stream;

  return events.filter(
    (e) => e.stream === stream || e.stream === streamKey
  );
}

export function getEventsByDay(day: 1 | 2 | 3): Event[] {
  return events.filter((e) => e.day === day);
}
