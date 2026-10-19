# Website Redesign Verification & Compliance Audit

**Checked:** 19 October 2026  
**Scope:** Static frontend codebase in [`Vyuham26_static/`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static) (`index.html`, `js/app.js`, `js/events-data.js`, `css/styles.css`, `assets/`, `README.md`) and root redesign ZIP archives (`VYUHAM26_AFTERDARK_redesign.zip`, `VYUHAM26_CYBER_REDESIGN.zip`).  
**Methodology:** Comprehensive static source code inspection and line-by-line audit against the redesign specifications.

---

## Executive Summary & Scorecard

### Implementation progress update — 19 October 2026

The baseline findings below predate the latest implementation work. Current source now has the header registration control removed, a floating pill header with scroll hide/reveal behavior, prize/stream-aware event ordering, ordinal event dates, homepage featured event ranking, event-detail info toggles and stream artwork, and schedule date capsules. Event names and event data have been left unchanged per the user's direction. These changes have not had a browser visual QA pass. Brochure reconciliation and pass purchase details remain pending the final brochure and confirmed provider information.

| Area | Total Items | Implemented | Partially Done | Not Done / Blocked |
|---|---|---|---|---|
| **1. Home page & Navigation** | 4 | 0 | 1 | 3 |
| **2. Event Listings** | 4 | 0 | 2 | 2 |
| **3. Event Details & Schedule** | 6 | 1 | 3 | 2 |
| **4. Pass & Registration Flow** | 5 | 0 | 1 | 4 |
| **5. Follow-up & Verification** | 2 | 0 | 0 | 2 |
| **Overall** | **21** | **1 (5%)** | **7 (33%)** | **13 (62%)** |

### Key Findings
1. **Navigation:** The site uses a traditional full-width fixed header (`.site-header`), not a floating pill-style navbar. There is no hide-on-downward-scroll or reveal-on-scroll-stop logic in `js/app.js`. The Register button is still actively rendered in the header (`#headerRegistration`).
2. **Pill Aesthetics:** While some buttons and filter tabs have rounded styling, the site lacks a unified pill design system. Cards, inputs, and day tabs use mixed rectangular radii (8px–17px).
3. **Event Listings:** The archive sorts events by festival day and alphabetical title. It does not prioritize larger prize pools, nor does it weight technology and management events over casual/esports events. Date formatting uses raw strings (e.g. `30 OCT 2026` or `30 OCT – 01 NOV 2026`) instead of centered, ordinal long-form dates (e.g. `30th October`).
4. **Event Details:** Event pages do not provide an information ("i") button for descriptions, nor dual-title rendering (actual pass name with current title as subheading). Event photos are largely missing from event records.
5. **Schedule:** Day 1/2/3 switching works interactively in the DOM. However, the date is rendered as a plain text eyebrow rather than a prominent date capsule. Outdated entries like `hackathon-continues` are filtered out via a client-side blacklist in `js/app.js`, but have not been cleaned up from the underlying data.
6. **Pass Flow & Form:** No dedicated festival pass form exists in the static site. The specified fields (institution, department, state, district, attendance days) and combinations (Day 1 only, Day 2 only, Day 3 only, combinations) are completely absent. The 2,000-pass limit is nowhere mentioned. "Free entry" copy remains in 9 places in `js/events-data.js`.
7. **Brochure Verification:** No brochure (PDF or DOCX) exists in the repository or ZIP archives, blocking official verification of dates, times, venues, and fees.

---

## Detailed Item-by-Item Verification

### 1. Home Page and Navigation

| # | Requirement | Status | Detailed Evidence & Code Inspection |
|---|---|---|---|
| 1.1 | **Replace current top bar with pill-style navigation bar** | ❌ **Not done** | In [`Vyuham26_static/index.html`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/index.html#L26-L37), navigation is wrapped in a full-width `<header class="site-header" id="siteHeader">`. In [`Vyuham26_static/css/styles.css`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/css/styles.css#L3), `.site-header` is styled as an edge-to-edge bar (`height:72px; position:sticky; top:0; z-index:50; width:100%; border-bottom:1px solid ...`). It does not use a floating pill container (`border-radius: 9999px; margin: 12px auto; max-width: fit-content;`). |
| 1.2 | **Hide navigation on downward scroll; reappear on scroll stop or scroll up** | ❌ **Not done** | In [`Vyuham26_static/js/app.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L432), the window scroll listener only updates `#topProgress` (`transform: scaleX(...)`). There is zero scroll direction detection (`currentScroll > lastScroll`), zero header transform/visibility toggling, and no debounce/idle timer to reappear when scrolling stops. |
| 1.3 | **Remove Register button from homepage navigation** | ❌ **Not done** | In [`Vyuham26_static/index.html`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/index.html#L35), `<span class="button button-small button-primary registration-disabled" id="headerRegistration">` remains inside `#mainNav`. In [`Vyuham26_static/js/app.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L87-L99), `updateHeaderRegistration()` actively updates this element with a `Register ↗` link or `Registration closed`. It must be completely removed from the header. |
| 1.4 | **Consistent pill-style visual treatment across the site** | ⚠️ **Partial** | Some elements have rounded corners, but treatment is inconsistent: `.filter-pill` has pill styling, but `.button` in [`css/styles.css`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/css/styles.css#L94) is `border-radius: 9px` (and `3px` in line 3), event cards use `border-radius: 10px`, stage panels use `border-radius: 17px`, day buttons use rectangular cards. A unified `--radius-pill: 999px` design token is not consistently applied. |

---

### 2. Event Listings

| # | Requirement | Status | Detailed Evidence & Code Inspection |
|---|---|---|---|
| 2.1 | **Make live events the primary focus of event listings** | ⚠️ **Partial** | Homepage has a section titled `THE LINEUP IS LIVE` ([`js/app.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L131)), but it only slices 4 featured events. The archive page (`eventsPage`, [`js/app.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L141)) treats all 36+ events equally in a flat grid. There is no live event hero banner, live badge (`🔴 LIVE NOW`), or dedicated live-first presentation. |
| 2.2 | **Prioritize events with larger prize pools, preference to tech & management; avoid unrelated/random listings** | ⚠️ **Partial** | In [`Vyuham26_static/js/app.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L234-L237), default sorting (`sort === 'day'`) orders strictly by festival day, then alphabetically by title. There is no ranking algorithm for prize amounts (e.g. ₹30,000 Hackathon, ₹20,000 Best Management Team) or prioritizing tech/management streams over general sessions/esports. Unrelated listings are only partially handled by `hiddenEventSlugs` (line 7). |
| 2.3 | **Clearer date formatting (e.g. “13th October”) & centered where space allows** | ❌ **Not done / Inconsistent** | Dates in [`js/app.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L62-L66) are rendered in uppercase numeric shorthand like `30 OCT 2026`, `31 OCT 2026`, `01 NOV 2026`, or `30 OCT – 01 NOV 2026`. Ordinal formatting ("30th October") is not implemented, and dates on event cards are not centered (they appear in the art overlay or metadata strip). |
| 2.4 | **Carousel for event listings (optional; goal is easy live event discovery)** | ❌ **Not done** | Homepage featured events use a 4-column CSS grid (`.home-event-grid`); archive uses `.events-grid`. No horizontal scrolling carousel or swipeable slider component exists. |

---

### 3. Event Details and Schedule

| # | Requirement | Status | Detailed Evidence & Code Inspection |
|---|---|---|---|
| 3.1 | **Remove logo at top of event detail; use info (“i”) button for description** | ❌ **Not done** | In [`Vyuham26_static/js/app.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L144-L151) (`eventDetail()`), the description is rendered as plain static text: `<p class="muted" style="line-height:1.9">${esc(e.description)}</p>`. There is no information ("i") button, popup modal, or collapsible accordion for the description. |
| 3.2 | **Show event’s actual name from pass/event data; keep current heading as subheading** | ⚠️ **Not verifiable / Partial** | In [`Vyuham26_static/js/events-data.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/events-data.js), records only contain a single `title` field. In `eventDetail()`, only `<h2>${esc(e.title)}</h2>` is displayed. There is no secondary pass title or two-tier heading/subheading hierarchy implemented. |
| 3.3 | **Add event photo and small pill-style label indicating event type (e.g. esports)** | ❌ **Not done** | Almost all event entries in `events-data.js` lack an `image` property, defaulting to generic CSS gradient blocks. In `eventDetail()`, the event type is output as plain text in an eyebrow (`<div class="eyebrow">${esc(streamLabel(e.stream))} / ...</div>`), rather than a dedicated pill badge (e.g. `<span class="pill-badge">🎮 Esports</span>`). |
| 3.4 | **Review schedule for outdated/additional entries (e.g. “Hackathon continues”), update against latest brochure** | ⚠️ **Partially addressed; Blocked on brochure** | In [`Vyuham26_static/js/app.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L7-L9), `hiddenEventSlugs` explicitly filters out `hackathon-continues`, `hackathon-demos`, `hackathon-winners`, `inauguration-ceremony`, `talk-quantum-ai`, `cultural-night`, etc. However, these still exist in `events-data.js` and have not been authoritatively reconciled against an official brochure. |
| 3.5 | **Show Day 1 / Day 2 / Day 3 details on selection; visible date capsule/container; keep image readable (no opacity reduction)** | ⚠️ **Partial** | **Day switching:** Implemented via `renderSchedule(day)` ([`js/app.js:248`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L248)).<br>**Date capsule:** Not done. The date is rendered as text in `.eyebrow` (`DAY 01 / 30 OCT 2026`), not a standalone pill/capsule container.<br>**Image treatment:** Mostly readable; cards use background dark gradient overlays rather than reducing image element opacity. |
| 3.6 | **Consider adding a direct day-pass purchase button where appropriate** | ❌ **Not done** | In `schedulePage()` and `renderSchedule()`, there is no day-pass purchase button or day-specific ticketing link. Users must navigate to MakeMyPass or the event archive. |

---

### 4. Pass and Registration Flow

| # | Requirement | Status | Detailed Evidence & Code Inspection |
|---|---|---|---|
| 4.1 | **Keep pass form fields: name, phone, email, institution, department, state, district, planned attendance day(s)** | ❌ **Not done** | No festival day-pass form exists in `Vyuham26_static`. Routes `register`, `participate`, and `profile` are disabled or redirected to home ([`js/app.js:271-274`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L271-L274)). The existing backend `profileForm` ([`js/app.js:198`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L198)) only has name, phone, college, degree, year, and lacks institution, department, state, district, and attendance days. |
| 4.2 | **Attendance-day options: Day 1 only, Day 2 only, Day 3 only, or applicable combinations** | ❌ **Not done** | No attendance-day selector, multi-select checkboxes, or radio combination matrix exists in any static page or script. |
| 4.3 | **Pass is same across days; stated 2,000-pass limit** | ❌ **Not done / Not verifiable** | The 2,000-pass capacity limit is not mentioned in any UI copy, countdown, or data file. No unified multi-day pass model exists in the frontend. |
| 4.4 | **Add direct “Make My Pass” button or make pass flow easy to reach** | ⚠️ **Partial** | The site links externally to `https://org.makemypass.com/web/vyuham-26`, but CTAs are labeled `REGISTER & GET TICKETS ↗` or `VIEW ALL EVENTS ON MAKEMYPASS ↗`. There is no dedicated "Make My Pass" hero button or prominent pass modal launcher. |
| 4.5 | **Remove “free entry” wording from relevant event listings** | ❌ **Not done** | In [`Vyuham26_static/js/events-data.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/events-data.js), "Free Entry" appears in 9 places:<br>• Line 200: Panel Discussion: Beyond Accuracy (`"fee": "Free Entry"`)<br>• Line 217: Talk: Responsible AI (`"fee": "Free Entry"`)<br>• Line 251 & 259: Play Fest (`"fee": "Free Entry"`, rules: `"Free access throughout Day 1"`)<br>• Line 379: Talk: From Agents to Outcomes (`"fee": "Free Entry"`)<br>• Line 407: Talk: Inside Modern SOC (`"fee": "Free Entry"`)<br>• Line 444 & 453: AI Short Film (`"fee": "FREE ENTRY"`, rules: `"Free entry open call"`)<br>• Line 465: Talk: From Classroom to Startup (`"fee": "Free Entry"`) |

---

### 5. Follow-Up and External Dependencies

| # | Requirement | Status | Detailed Evidence & Code Inspection |
|---|---|---|---|
| 5.1 | **Check updated brochure & confirm schedule and event details against it** | ⏳ **Blocked on source** | No brochure PDF, DOCX, or graphic file exists in the repository, `assets/`, or root ZIP archives. Verification of timings, prize amounts, fees, and rules is completely blocked until the brochure is provided. |
| 5.2 | **Review proposed pill-style layout and navigation behavior** | ⏳ **Pending implementation** | Because the pill navigation bar, scroll-triggered hide/reveal, and date capsules are not yet coded, visual and interaction QA (desktop, mobile, touch, reduced motion) cannot be conducted. |

---

## Code Evidence Summary Table

| Requirement Summary | Target File(s) | Current State in Source Code | Required Code Change |
|---|---|---|---|
| **Pill navigation bar** | [`index.html:26`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/index.html#L26), [`styles.css:3`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/css/styles.css#L3) | Full-width `.site-header` across screen top (`width:100%`) | Restyle into centered floating pill (`border-radius: 999px; max-width: fit-content; margin: 16px auto;`) |
| **Hide/show on scroll** | [`js/app.js:432`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L432) | Scroll listener only updates `#topProgress` scale | Add direction check (`delta > 0 -> hide; delta < 0 -> show`) and `scrollStop` timeout |
| **Remove header Register button** | [`index.html:35`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/index.html#L35), [`js/app.js:87-99`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L87-L99) | `#headerRegistration` exists in nav & JS updates it | Delete HTML element and remove `updateHeaderRegistration()` logic from `app.js` |
| **Pill design system** | [`styles.css:94`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/css/styles.css#L94) | Mixed radii (`9px`, `10px`, `14px`, `17px`) | Standardize control radii with `--radius-pill: 9999px` |
| **Prize & Stream Sorting** | [`js/app.js:234-237`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L234-L237) | Sorted only by day index or title | Sort default by prize pool (descending) with tech & management boosted |
| **Centered Ordinal Dates** | [`js/app.js:62-66`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L62-L66) | `30 OCT 2026`, `31 OCT 2026` | Format using `getOrdinalDate()` (e.g. `30th October 2026`) and center within cards |
| **Event Info ("i") Button** | [`js/app.js:148-150`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L148-L150) | Description is static paragraph text | Add `<button class="info-btn" aria-label="More info">i</button>` with popover/modal |
| **Event Stream Pill & Photos** | [`js/events-data.js`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/events-data.js) | No images in event records; plain text stream label | Populate event image paths; render `<span class="pill-type">🎮 Esports</span>` |
| **Schedule Date Capsule** | [`js/app.js:255`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L255) | Plain text `<div class="eyebrow">` | Wrap in `.date-capsule` pill container with background & border |
| **Pass Form & Day Options** | [`js/app.js:198`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/app.js#L198) | Outdated user profile form; no pass form | Add modal/page with specified 8 fields, day combinations, and 2,000 cap |
| **Remove "Free Entry"** | [`js/events-data.js:200,444`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_static/js/events-data.js#L200) | 9 instances of `"Free Entry"` / `"FREE ENTRY"` | Identify target events (especially AI Short Film) and update fee to official terms |

---

## Recommended Action Plan

1. **Brochure Ingestion (Highest Priority):** Obtain the latest official brochure from the organizing team to verify all 36+ event titles, pass names, cash prizes, registration fees, schedules, and venues.
2. **Navigation & Header Refactor:**
   - Remove `#headerRegistration` from `index.html` and `updateHeaderRegistration` in `app.js`.
   - Update `.site-header` CSS into a floating, centered pill container with `backdrop-filter: blur(20px)` and `border-radius: 9999px`.
   - Implement scroll direction and idle detection in `js/app.js` to hide on scroll down and reveal on scroll up or stop.
3. **Event Listing & Discovery Engine:**
   - Add a "Live / Happening Now" highlight strip or carousel on the homepage and archive.
   - Update default sort order in `renderEvents()` to prioritize larger prize pools, placing Technology and Management events first.
   - Format all event dates as centered ordinal strings (e.g. `30th October 2026`).
4. **Event Details & Dossier Redesign:**
   - Add the description info ("i") toggle button.
   - Render dual title structure: Pass/Event Name as primary `<h1>`, existing title as subtitle where appropriate.
   - Add event imagery and stream pill labels (`Esports`, `Technology`, etc.).
5. **Schedule Polish:**
   - Wrap festival day dates in a high-contrast pill capsule container.
   - Add a direct "Get Day Pass" action button linking directly to the festival pass flow.
6. **Festival Pass Modal / Flow:**
   - Implement the dedicated "Make My Pass" form with: Name, Phone, Email, Institution, Department, State, District, and Attendance Days (Day 1 / Day 2 / Day 3 / All Days).
   - Display the stated 2,000-pass limit badge.
   - Remove "Free Entry" phrasing from the relevant event records in `js/events-data.js`.
