# VYUHAM’26 — Cyber Convergence

Vanilla HTML, CSS, and JavaScript festival frontend for Digital University Kerala. The homepage and shared visual system have been rebuilt around the dark cyber-conference direction of the [Dribbble reference](https://dribbble.com/shots/15198421-WebDesign): indigo and violet atmosphere, cyan highlights, large title art, and layered angled presentation panels. VYUHAM branding, red logo, and primary red action color remain in place.

## Run locally

From this folder, run `python -m http.server 5500` and open http://localhost:5500/. Run the FastAPI backend from `vyuham-backend` with `uvicorn app.main:app --host 127.0.0.1 --port 8001`. The site uses hash routes; event detail pages can be refreshed directly. The API defaults to `http://127.0.0.1:8001`; for deployment, set `window.VYUHAM_API_URL` before `js/backend.js` in `index.html` to the deployed FastAPI origin and add the exact site origin to the backend's `FRONTEND_ORIGINS` setting. Supabase Auth uses the same public URL and publishable browser key as the React client; deployments can override them with `window.VYUHAM_SUPABASE_URL` and `window.VYUHAM_SUPABASE_ANON_KEY` before `js/backend.js`.

The HTML client is connected to the FastAPI routes for `/auth`, `/events`, `/events/results`, `/registrations`, `/teams`, `/admin`, `/announcements`, `/hackathon`, `/ctf`, `/checkin`, `/contact`, `/feedback`, and `/certificates`. It sends a Supabase access token as a bearer token for protected calls and refreshes expired sessions when possible. Its startup health check treats events, announcements, and the registration gate as separate services so one unavailable endpoint does not suppress the others. MakeMyPass owns event registration and payment; those external purchases appear in the participant dashboard only after a provider-side data sync is configured.

## Included

- Responsive redesigned homepage, event archive and detail dossiers, four festival streams, three-day schedule, about, venue, sponsors, contact, FAQ, and participant account shells.
- Bundled event records as an offline fallback, live event loading, search, category filters, working detail routes, backend registration status, schedule selectors, mobile navigation, FAQ controls, and countdown.
- Live organizer announcements, contact inquiry submission, and festival feedback submission through the FastAPI backend.
- Supabase participant sign-up/sign-in, bearer-token API requests, profile sync, account dashboard, and sign-out.
- Global cyber terminal launcher in the header and footer. Open it with `Ctrl+K`, backtick, or `?`; use `help` for event, schedule, account, status and admin navigation commands. Admin actions still require the backend admin role.
- Team creation and invite-code joining, plus the hackathon milestone/mentor/leaderboard views, authenticated project submission and mentor requests, and CTF challenge/flag/scoreboard features when the API has those records configured.
- Team hub supports participant-only create/join, copyable invite codes and private member rosters. Team joins lock once the team has an internal event registration; team CTF challenges let members choose which team is submitting.
- Authenticated profile updates, certificate-code verification, published event results, volunteer/organizer pass check-in and scan history, and a role-protected admin console with a registration gate, event totals, registration records and participant accounts.
- Official supplied red VYUHAM emblem and the supplied industrial monolith artwork, now composed as a layered stage visual.
- Selective dark-neumorphic depth on buttons, the festival information banner, CTA banner, countdown, and hero image frame; the rest of the page keeps the flatter editorial hierarchy.
- Accessible focus states, reduced-motion handling, practical forms, and static-build safeguards. Payment processing still needs a payment-provider integration; tickets and the food wallet need additional backend services. Team creation, project submissions, CTF flag submissions, profile changes, and check-in require a verified session, with role checks enforced by the API.
- Event registration and ticket payment are handled by the official [VYUHAM MakeMyPass listing](https://org.makemypass.com/web/vyuham-26). Event cards and dossiers open the matching MakeMyPass event page when mapped; unmapped activities open the official festival listing. The static frontend does not process payments or claim to verify tickets.
- Registration starts closed through `REG_OPEN=false`. Admins can toggle the persisted backend gate from the admin console while `REGISTRATION_ENABLED=true`; setting it to `false` is an emergency backend override. `window.VYUHAM_REGISTRATION_ENABLED` in `index.html` is a frontend kill switch. MakeMyPass has its own availability controls and must be closed there as well if direct visits should be blocked.

## Reference and validation

The linked Dribbble shot was inspected in-browser. Its defining characteristics used here are the dark indigo/purple base, cyan/magenta light accents, oversized cyber-style typography, and angled overlapping presentation mockups. The structure and copy are adapted for VYUHAM rather than copied from unrelated branding.

Event-specific photography and confirmed sponsor identities were not supplied, so existing event data and available artwork are used. Verify final schedule changes and sponsor information with official festival communications before publication.
