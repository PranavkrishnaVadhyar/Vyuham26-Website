# VYUHAM’26 Changes

## Event updates

### Startup Showcase

- Removed the **Startup Showcase** event from `js/events-data.js`.
- The event no longer appears in the event archive, event filters, schedule views, or direct event lookup.
- No dedicated Startup Showcase asset or hard-coded page reference remained after removal.

### Beyond Accuracy - Panel Discussion on AI Accuracy

- Updated the event description for `beyond-accuracy-panel-discussion-on-ai-accuracy`.
- Added the panel discussion context covering data quality, bias, fairness, privacy, transparency, reliability, ethics, and accountability in AI.
- Added the following panel speakers:
  - Jyothi Ramaswamy — Freelancer, ex-TCSer, Adhoc Consultant, KSAAC, DUK
  - Chitra Nair — AI and Cloud Architect, McAfee
  - Ardhra Benny — Resource Person, Technology Analyst, Infosys, TVM
- Added speaker portraits under:
  - `assets/events/beyond-accuracy-speakers/jyothi-ramaswamy.jpeg`
  - `assets/events/beyond-accuracy-speakers/chitra-nair.jpeg`
  - `assets/events/beyond-accuracy-speakers/ardhra-benny.jpeg`
- Added a responsive panel-speaker grid to the event dossier.
- Desktop displays the speakers in a three-column layout.
- Mobile displays the speakers in a stacked responsive layout.

### Promptsmith Arena - Prompt War

- Updated the event metadata:
  - Venue: Digital University Kerala
  - Registration fee: ₹400
  - Participation: Individual or teams of 2
  - Eligibility: Students and AI enthusiasts interested in prompt engineering, creative thinking, and AI-powered problem-solving.
- Replaced the generic rules with the supplied round-specific rules:
  - Use only the organizer-provided AI platform.
  - External AI tools are prohibited.
  - Complete all challenges within the given time limits.
  - Maximum 5 attempts in Rounds 1 and 2.
  - One final submission is allowed in Round 3.
  - Follow all round-specific instructions.
  - Malpractice may lead to disqualification.
  - Judges’ decisions are final.
- Added dedicated Participation Notes sections for:
  1. Rules
  2. Eligibility
- Removed the redundant Event Details section from Participation Notes.
- Added a concise Event Intel eligibility value:
  - `Students and AI enthusiasts`
- Kept the full eligibility statement unchanged in Participation Notes.

### Workshop On Prompt Engineering

- Added and ordered ten participation notes for `workshop-on-prompt-engineering`.
- Corrected grammar and expanded LLM as “large language models (LLMs)”:

1. Participation is individual.
2. Actively participate in all practical sessions.
3. Learn the fundamentals of prompt engineering and large language models (LLMs).
4. Design clear and effective prompts.
5. Use AI tools responsibly and ethically.
6. Follow the coordinators’ instructions throughout the workshop.
7. Bring all required devices and accessories.
8. Ensure reliable internet connectivity during the practical sessions.
9. Maintain discipline and cooperate with fellow participants and coordinators.
10. The coordinators’ decision will be final.

### Ink & Letter - Calligraphy Workshop

- Added a complete event description for `ink-and-letter-calligraphy-workshop`.
- Added details about:
  - Devanagari, modern, and fused calligraphy practice.
  - Spacing, rhythm, and experimentation with Pilot Parallel Pens, brush pens, and canvases.
  - Organizer-provided material kits, accessories, and guidance.
  - Personalized artwork creation using scripts, colours, and techniques.
  - Beginner-friendly participation and creative collaboration.
  - Take-home handcrafted calligraphy creations and practical lettering skills.
- Added a dedicated About the Event presentation using the existing event dossier design.

## Sponsor section updates

- Reworked the shared Sponsors section used on both the homepage and About page.
- Established a clear visual hierarchy:
  - DSpace appears first and larger.
  - Canara Bank and Reflections appear as supporting sponsors.
- Removed logo card borders and background containers around sponsor logos.
- Company names are smaller and centered below their logos.
- Removed redundant section-level labels such as:
  - Presenting Partner
  - Festival Partners
  - Title Sponsor
  - Associate Sponsor
  - Technology Partner
- Added one sponsor-type label beneath each company name so the sponsorship type remains clear:
  - DSpace — Title Sponsor
  - Canara Bank — Associate Sponsor
  - Reflections — Technology Partner
- Removed Confirmed status labels.
- Added responsive sponsor layouts for desktop and mobile.
- Reduced the DSpace logo size by approximately 5%:
  - Desktop height: `100px` → `95px`
  - Desktop maximum width: `440px` → `418px`

## Universal eligibility update

- Updated the Event Intel eligibility on all event dossiers to:
  - **Open to all working professionals and students.**
- Updated Prompt War’s Participation Notes eligibility to use the same universal wording.
- Removed the previous Prompt War-specific eligibility wording from the displayed event page to avoid conflicting eligibility information.
- Audited Participation Notes across all event records for eligibility conflicts.
- Replaced college-only ID requirements with valid photo ID requirements where applicable.
- Reworded same-college team composition as same-institution-or-organization team composition.
- Removed college-only participation wording from esports rules while preserving valid ID and pre-registration requirements.

## Esports event artwork update

- Moved the supplied BGMI and E-Football artwork into `assets/eventpics/`.
- Assigned `BGMI.png` to the BGMI Dropzone event.
- Assigned `E-Football.png` to the E-Football Qualifiers event.
- Replaced FIFA 27 with BGMI Dropzone as the final event in the homepage hero carousel.
- Updated the main event title text in the homepage Featured Events cards to title case instead of all caps.
- Aligned the Featured Events card content so the metadata and main titles begin on the same horizontal lines across all cards.

## Idea to Impact speaker profile

- Added Mr. Adarsh V’s professional biography to the Participation Notes for `idea-to-impact-talk-session-by-kerala-startup-mission`.
- Added the speaker’s areas of expertise:
  - Innovation and entrepreneurship development
  - Startup ecosystem and development
  - Student entrepreneurship initiatives
  - Idea generation and innovation
  - Entrepreneurial mindset and leadership
  - IEDC initiatives
- Rendered the content using the existing event dossier content-block design.
- Moved the biography and expertise content inside the existing Session Speaker profile so all speaker information appears in one container.
- Moved the About This Event button below the complete Session Speaker profile.

## Files changed

- `CHANGES.md`
- `js/events-data.js`
- `js/app.js`
- `css/styles.css`
- `assets/events/beyond-accuracy-speakers/jyothi-ramaswamy.jpeg`
- `assets/events/beyond-accuracy-speakers/chitra-nair.jpeg`
- `assets/events/beyond-accuracy-speakers/ardhra-benny.jpeg`

## Validation

- Checked `js/events-data.js` for syntax errors: no errors found.
- Checked `js/app.js` for syntax errors: no errors found.
- Checked `css/styles.css` diagnostics: no errors found.
- Verified the Beyond Accuracy event route and all three speaker portraits.
- Verified the Prompt War route:
  - Event Details section is removed from Participation Notes.
  - Rules appear once under the Rules heading.
  - Full Participation Notes eligibility remains unchanged.
  - Event Intel uses the concise eligibility value.
- Verified the Workshop On Prompt Engineering route and all ten participation notes.
- Verified the sponsor hierarchy on both the homepage and About page.
