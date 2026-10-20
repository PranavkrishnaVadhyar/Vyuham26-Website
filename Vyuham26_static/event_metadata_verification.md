> **Fee data superseded:** Use [registration_fee_audit_2026-10-20.md](registration_fee_audit_2026-10-20.md) for the current MakeMyPass comparison and corrected website fees.

# VYUHAM’26 Event Metadata Verification

**Audit date:** 20 October 2026  
**Scope:** Bundled static frontend event records and shared event-card / event-detail metadata rendering.

## Verification outcome

- The frontend bundle contains **29 event records**; the current Events catalogue filters out one record (`talk-quantum-ai`), leaving **28 visible events**.
- The shared event card and Event Intel panel now use the same typed metadata source. `PRIZE POOL` is rendered only when a `prizePool` value exists; workshops with an explicit certificate record can show `CERTIFICATE`; participant/pass limits render only when supplied; and `FEE` renders only when the source has a value.
- Non-prize descriptors previously stored in the prize field (for example “Interactive Session” and “Recreation & Games”) are no longer presented as prize pools. Existing fee values, event names, slugs, routes, and registration URL fields were preserved.
- The `VENUE` row has been removed from the shared event-detail Event Intel renderer. Venue data remains in the event records and schedule/venue views.
- Day Pass uses the shared `2,000 passes` limit value on both the card and detail page. Its fee is not declared in the frontend source, so no fee row is shown.
- Workshop records use `eventType: workshop` and `certificateProvided: true`. The shared card and detail metadata show `CERTIFICATE PROVIDED: Yes` instead of a prize-pool row. Workshop fees were updated from the supplied MakeMyPass screenshot: ₹99 onwards, ₹120 onwards, Free, and ₹100 onwards respectively.
- JavaScript syntax checks passed for `js/app.js` and `js/events-data.js`.

## MakeMyPass verification limitation

The official MakeMyPass directory and individual listings could not be opened with the available browsing access during this audit. Therefore, the values below are **existing frontend values**, not independently confirmed against MakeMyPass. Keep the source amounts and links as-is pending a direct comparison with the final official listings. Registration fields and existing fallback routing were not changed, but link destinations were not externally clicked/verified in this audit.

## Visible catalogue mapping

“Frontend category” and metadata below reflect the current bundled records. “MMP status” is unverified for every row because the source listings were inaccessible.

| # | Event (frontend title) | Category | Metadata currently shown | Registration link | MMP status |
|---:|---|---|---|---|---|
| 1 | Hackathon — 24HR | Technology | PRIZE POOL ₹30,000; FEE ₹999 | Preserved | Unverified |
| 2 | Best Manager | Management | PRIZE POOL ₹15,000; FEE ₹200 | Preserved | Unverified |
| 3 | Best Management Team | Management | PRIZE POOL ₹20,000; FEE ₹400 | Preserved | Unverified |
| 4 | Marketing Game | Management | PRIZE POOL ₹15,000; FEE ₹300 | Preserved | Unverified |
| 5 | Finance Game | Management | PRIZE POOL ₹15,000; FEE ₹300 | Preserved | Unverified |
| 6 | HR Game | Management | PRIZE POOL ₹15,000; FEE ₹300 | Preserved | Unverified |
| 7 | Business Quiz | Management | PRIZE POOL ₹10,000; FEE ₹200 | Preserved | Unverified |
| 8 | Panel Discussion: Beyond Accuracy: Can We Trust the Data Behind AI? | Session | FEE: Free Entry | Preserved | Unverified |
| 9 | Hands-on Workshop: Calligraphy | Session | CERTIFICATE PROVIDED: Yes; FEE: ₹120 onwards | Preserved | Screenshot supplied; directory unverified |
| 10 | Play Fest | General | FEE: Free Entry | Preserved | Unverified |
| 11 | Fitness Competition | General | FEE: ₹50 per head | Preserved | Unverified |
| 12 | Capture the Flag | Technology | PRIZE POOL ₹50,000+; FEE ₹500 per team | Preserved | Unverified |
| 13 | Startup Showcase | Technology | PRIZE POOL ₹15,000; FEE ₹400 | Preserved | Unverified |
| 14 | Prompt War | Technology | PRIZE POOL ₹15,000; FEE ₹400 | Preserved | Unverified |
| 15 | Tech Quiz | Technology | PRIZE POOL ₹10,000; FEE ₹200 | Preserved | Unverified |
| 16 | Talk: From Agents to Outcomes: Building AI That Works in the Real World (Applied AI and Engineering) | General | FEE: Free Entry | Preserved | Unverified |
| 17 | Talk: Inside the Modern SOC: Detect, Investigate, Respond | Session | FEE: Free Entry | Preserved | Unverified |
| 18 | Workshop: Ethical Hacking & OSINT Reconnaissance | Session | CERTIFICATE PROVIDED: Yes; FEE: ₹99 onwards | Preserved | Screenshot supplied; directory unverified |
| 19 | AI Short Film | Technology | PRIZE POOL ₹10,000; FEE: FREE ENTRY | Preserved | Unverified |
| 20 | From Classroom to Startup: Where Do Students’ Ideas Go? | Session | FEE: Free Entry | Preserved | Unverified |
| 21 | FIFA 27 Tournament | Esports | PRIZE POOL ₹10,000; FEE ₹50 | Preserved | Unverified |
| 22 | Movie Quiz | Cultural | PRIZE POOL ₹5,000; FEE ₹200 | Preserved | Unverified |
| 23 | E-Football Tournament | Esports | PRIZE POOL ₹5,000; FEE: ONLINE REG: ₹50/HEAD | Preserved | Unverified |
| 24 | BGMI Tournament | Esports | PRIZE POOL ₹5,000; FEE: ONLINE REG: ₹50/HEAD | Preserved | Unverified |
| 25 | Photography & Videography | General | PRIZE POOL ₹10,000; FEE: CAMPUS WIDE REG: ₹100 | Preserved | Unverified |
| 26 | Workshop: VEGA Processors & Ecosystem by C-DAC | Session | CERTIFICATE PROVIDED: Yes; FEE: Free | Preserved | Screenshot supplied; directory unverified |
| 27 | ProjectX Minerva: Project Expo 2026 | General | PRIZE POOL ₹10,000; FEE: ₹100 (IEEE members) / ₹200 (others) | Preserved | Unverified |
| 28 | Workshop by Luminar Technolab: Prompt Engineering and Building with LLMs | Session | CERTIFICATE PROVIDED: Yes; FEE: ₹100 onwards | Preserved | Screenshot supplied; directory unverified |

## Separate Day Pass record

| Record | Metadata currently shown | Registration link | Verification |
|---|---|---|---|
| VYUHAM’26 Day Pass | PASS LIMIT: 2,000 passes; fee omitted because none is declared in frontend data | Existing MakeMyPass Day Pass destination preserved | Limit is frontend-sourced; MakeMyPass limit and fee remain unverified |

## Follow-up needed

1. Compare each listed event with its individual MakeMyPass page and confirm the title, category, prize pool or certificate, fee, participant/team limit, and registration destination.
2. Confirm whether the Day Pass fee is published; add it only after confirmation.
3. Resolve any mismatches in the frontend data source before deployment. No event title or event detail was changed based on the prior brochure.
