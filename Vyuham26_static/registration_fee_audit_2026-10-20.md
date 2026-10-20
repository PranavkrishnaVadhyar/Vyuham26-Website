# VYUHAM’26 Registration Fee Audit

**Checked:** 20 October 2026  
**Website data:** `js/events-data.js` and shared event metadata rendering in `js/app.js`.  
**Official source:** [VYUHAM’26 MakeMyPass directory](https://org.makemypass.com/web/vyuham-26)

## Audit method and limits

Compared all **28 visible VYUHAM’26 event records** with their corresponding MakeMyPass directory listing cards. Matched using the existing MakeMyPass path mapping or explicit registration URL; the individual directory pages were opened where a direct listing was available to confirm identity. The directory cards expose starting prices such as “₹499 onwards.” The detail pages generally show “Pricing — See Registration” without repeating the amount, so the directory card is the source for the fee and any unshown charging basis remains unspecified. No per-person or per-team basis was added unless MakeMyPass itself displayed it.

**Status reflects the pre-correction comparison.** The website column shows the prior fee followed by the current corrected display. `UNVERIFIED` means MakeMyPass did not expose a fee in the directory card or listing page. The prior website value was not kept as if confirmed. “Onwards” indicates the advertised starting fee; users should check the listing for available options and final charges.

## Event comparison

| # | VYUHAM’26 event | MakeMyPass fee | Website fee (before → after) | Status | Correction made | Official listing |
|---:|---|---|---|---|---|---|
| 1 | Hackathon — 24HR | ₹499 onwards | ₹999 → ₹499 onwards | MISMATCH | Changed website value from ₹999 to the listed starting fee. | [AGENT FORGE — Hackathon (24 Hours)](https://org.makemypass.com/web/vyuham-26/events/hackathon-24hr) |
| 2 | Best Manager | ₹200 onwards | ₹200 → ₹200 onwards | MISMATCH | Added the advertised “onwards” qualifier. | [THE DECISION ROOM — BEST MANAGER](https://org.makemypass.com/web/vyuham-26/events/best-manager-4) |
| 3 | Best Management Team | ₹400 onwards | ₹400 → ₹400 onwards | MISMATCH | Added the advertised “onwards” qualifier. | [BOARDROOM BATTLE — BEST MANAGEMENT TEAM](https://org.makemypass.com/web/vyuham-26/events/best-management-team) |
| 4 | Marketing Game | ₹300 onwards | ₹300 → ₹300 onwards | MISMATCH | Added the advertised “onwards” qualifier. | [MARKET MAKERS — MARKETING GAMES](https://org.makemypass.com/web/vyuham-26/events/marketing-game-3) |
| 5 | Finance Game | ₹300 onwards | ₹300 → ₹300 onwards | MISMATCH | Added the advertised “onwards” qualifier. | [CAPITAL UNDER PRESSURE — FINANCE GAMES](https://org.makemypass.com/web/vyuham-26/events/finance-game-3) |
| 6 | HR Game | ₹300 onwards | ₹300 → ₹300 onwards | MISMATCH | Added the advertised “onwards” qualifier. | [PEOPLE IN PLAY — HR GAMES](https://org.makemypass.com/web/vyuham-26/events/hr-game-1) |
| 7 | Business Quiz | ₹200 onwards | ₹200 → ₹200 onwards | MISMATCH | Added the advertised “onwards” qualifier. | [THE BUSINESS CIRCUIT — BUSINESS QUIZ](https://org.makemypass.com/web/vyuham-26/events/business-quiz-2) |
| 8 | Panel Discussion: Beyond Accuracy: Can We Trust the Data Behind AI? | FREE | Free Entry → FREE ENTRY | MATCH | Kept the confirmed free fee and standardized its display. | [Beyond Accuracy — Panel Discussion on AI Accuracy](https://org.makemypass.com/web/vyuham-26/events/beyond-accuracy-ai-panel-discussion) |
| 9 | Hands-on Workshop: Calligraphy | ₹120 onwards | ₹120 onwards → ₹120 onwards | MATCH | No fee change; matches the supplied listing. | [INK & LETTER — CALLIGRAPHY WORKSHOP](https://org.makemypass.com/web/vyuham-26/events/hands-on-workshop) |
| 10 | Play Fest | FREE | Free Entry → FREE ENTRY | MATCH | Kept the confirmed free fee and standardized its display. | [PLAY DISTRICT](https://org.makemypass.com/web/vyuham-26/events/play-fest) |
| 11 | Fitness Competition | ₹50 onwards | ₹50 per head → ₹50 onwards | MISMATCH | Removed the unsupported “per head” basis and matched the displayed starting fee. | [FIT ARENA — FITNESS COMPETITION](https://org.makemypass.com/web/vyuham-26/events/fitness-competition) |
| 12 | Capture the Flag | ₹500 onwards | ₹500 per team → ₹500 onwards | MISMATCH | Removed the unsupported “per team” basis. | [THE CYBER GAUNTLET — CAPTURE THE FLAG](https://org.makemypass.com/web/vyuham-26/events/capture-the-flag-3) |
| 13 | Startup Showcase | Not displayed | ₹400 → Not confirmed | UNVERIFIED | Removed the old unverified ₹400 amount from display and flagged for review. | [PITCH TO PROOF](https://org.makemypass.com/web/vyuham-26/events/startup-showcase) |
| 14 | Prompt War | ₹400 onwards | ₹400 → ₹400 onwards | MISMATCH | Added the advertised “onwards” qualifier. | [PROMPTSMITH ARENA — PROMPT WAR](https://org.makemypass.com/web/vyuham-26/events/prompt-war) |
| 15 | Tech Quiz | ₹200 onwards | ₹200 → ₹200 onwards | MISMATCH | Added the advertised “onwards” qualifier. | [TECHSPRINT — TECH QUIZ](https://org.makemypass.com/web/vyuham-26/events/tech-quiz) |
| 16 | Talk: From Agents to Outcomes: Building AI That Works in the Real World (Applied AI and Engineering) | FREE | Free Entry → FREE ENTRY | MATCH | Kept the confirmed free fee and standardized its display. | [FROM AGENTS TO OUTCOME](https://org.makemypass.com/web/vyuham-26/events/from-agents-to-outcome) |
| 17 | Talk: Inside the Modern SOC: Detect, Investigate, Respond | FREE | Free Entry → FREE ENTRY | MATCH | Fee matches the listing reached through the existing mapped registration path. | [CYBER SECURITY IN THE ERA OF AI](https://org.makemypass.com/web/vyuham-26/events/cybersecurity-panel-live-demo) |
| 18 | Workshop: Ethical Hacking & OSINT Reconnaissance | ₹99 onwards | ₹99 onwards → ₹99 onwards | MATCH | No fee change; matches the listing. | [THINK LIKE AN ATTACKER — ETHICAL HACKING WORKSHOP](https://org.makemypass.com/web/vyuham-26/events/workshop-ethical-hacking-osint) |
| 19 | AI Short Film | ₹50 onwards | FREE ENTRY → ₹50 onwards | MISMATCH | Changed website value from FREE ENTRY to the paid starting fee. | [SYNTHETIC FRAMES — AI SHORT FILM](https://org.makemypass.com/web/vyuham-26/events/ai-short-film) |
| 20 | From Classroom to Startup: Where Do Students’ Ideas Go? | FREE | Free Entry → FREE ENTRY | MATCH | Kept the confirmed free fee and standardized its display. | [IDEA TO IMPACT — TALK SESSION BY KSUM](https://org.makemypass.com/web/vyuham-26/events/talk-session-kerala-startup-mission) |
| 21 | FIFA 27 Tournament | ₹50 onwards | ₹50 → ₹50 onwards | MISMATCH | Added the advertised “onwards” qualifier. | [FIFA 27](https://org.makemypass.com/web/vyuham-26/events/fifa-27) |
| 22 | Movie Quiz | ₹100 onwards | ₹200 → ₹100 onwards | MISMATCH | Changed website value from ₹200 to the listed starting fee. | [REEL ROYALE — MOVIE QUIZ](https://org.makemypass.com/web/vyuham-26/events/movie-quiz) |
| 23 | E-Football Tournament | ₹50 onwards | ONLINE REG: ₹50/HEAD → ₹50 onwards | MISMATCH | Removed the unsupported online/per-head wording and matched the listing. | [E-FOOTBALL QUALIFIERS](https://org.makemypass.com/web/vyuham-26/events/e-football-tournament-2) |
| 24 | BGMI Tournament | ₹50 onwards | ONLINE REG: ₹50/HEAD → ₹50 onwards | MISMATCH | Removed the unsupported online/per-head wording and matched the listing. | [BGMI DROPZONE](https://org.makemypass.com/web/vyuham-26/events/bgmi-tournament-3) |
| 25 | Photography & Videography | ₹100 onwards | CAMPUS WIDE REG: ₹100 → ₹100 onwards | MISMATCH | Removed unsupported “campus wide registration” wording and matched the listing. | [FRAME HUNT](https://org.makemypass.com/web/vyuham-26/events/photography-videography) |
| 26 | Workshop: VEGA Processors & Ecosystem by C-DAC | FREE | Free → FREE ENTRY | MATCH | Kept the confirmed free fee and standardized its display. | [VEGA PROCESSORS & ECOSYSTEM BY C-DAC](https://org.makemypass.com/web/vyuham-26/events/c-dac-workshop) |
| 27 | ProjectX Minerva: Project Expo 2026 | ₹100 onwards | ₹100 (IEEE members) / ₹200 (others) → ₹100 onwards | MISMATCH | Replaced unsupported ₹100/₹200 member tiers with the listing’s displayed starting fee. | [PROJECT X MINERVA — PROJECT EXPO BY IEEE](https://org.makemypass.com/web/vyuham-26/events/project-expo-by-ieee) |
| 28 | Workshop by Luminar Technolab: Prompt Engineering and Building with LLMs | ₹100 onwards | ₹100 onwards → ₹100 onwards | MATCH | No fee change; matches the listing. | [Workshop On Prompt Engineering](https://org.makemypass.com/web/vyuham-26/events/workshop-on-prompt-engineering) |

## Day Pass check

| Item | MakeMyPass | Website after update | Status | Listing |
|---|---|---|---|---|
| Day Pass fee | FREE in the directory listing | FREE ENTRY | MATCH | [Vyuham Day-Pass](https://org.makemypass.com/web/vyuham-26/events/vyuham-day-pass) |
| Pass limit | Not displayed on the directory or event detail page | No longer displayed pending confirmation | UNVERIFIED | Same listing |

The MakeMyPass directory confirms the Day Pass as free, but does not publish the website’s former 2,000-pass limit. The limit has been removed from the visible card and details until the organizer confirms it.

## Changes made

- Updated fees in the shared event records, so event cards and detail pages render the same fee.
- Standardized free listings as `FREE ENTRY`.
- Removed unverified per-person/per-team or other charge-basis claims where MakeMyPass only says “onwards.”
- Set Startup Showcase to `Not confirmed` instead of continuing to show the unverified ₹400 value.
- Added `FREE ENTRY` to the Day Pass card and detail panel.
- Removed the unverified Day Pass limit from display pending confirmation.
- Preserved event titles, descriptions, prize pools, routes, and registration URLs.

**Remaining review item:** Startup Showcase registration fee is not shown by the MakeMyPass listing; confirm it with the organizer/provider before publishing a numeric price.
