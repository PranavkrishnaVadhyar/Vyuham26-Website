# VYUHAM'26 Security Remediation Report

**Review date:** 2026-11-03  
**Scope inspected:** React 19 + Vite frontend, Vercel static deployment config, sibling FastAPI + Supabase backend source.  
**Original severity:** Not present in the supplied audit text. The supplied brief lists bug IDs and descriptions only, so original severity cannot be reproduced here.

## Architecture and scope

The deployed frontend is a Vite single-page application. Authentication is performed directly by Supabase Auth; API requests go to a separate FastAPI service using Supabase bearer JWTs. The backend uses PostgreSQL through SQLAlchemy. There is no Next.js server or frontend API route. Supabase Auth settings, deployed Vercel environment values and the real production API origin were not validated against their external dashboards.

## Summary

| Bug ID | Vulnerability | Status | Verification |
|---|---|---|---|
| 8.1 | CORS Misconfiguration | FIXED – PENDING EXTERNAL CONFIGURATION | Exact configured origins and restrictive methods/headers; deployed origins still need verification. |
| 8.2 | Missing Security Headers | PARTIALLY FIXED | Vercel/API headers plus build-time CSP; production API origin must be configured at build time. |
| 8.3 | Clickjacking | PARTIALLY FIXED | `frame-ancestors 'none'` and `X-Frame-Options: DENY` are configured; browser iframe test not run. |
| 8.4 | Concurrent Login | PARTIALLY FIXED | PostgreSQL-backed participant session registry added; privileged sessions are permitted; staging verification remains. |
| 8.5 | No Rate Limiting | PARTIALLY FIXED | PostgreSQL throttles contact, feedback, registrations, teams, payments and CTF guesses; Supabase Auth provider controls remain external. |
| 8.6 | Improper Session Invalidation | PARTIALLY FIXED | Backend revokes the presented session ID and rejects replay; staging test remains. |
| 8.7 | Brute-Force Protection | NOT FIXED | Login is performed by Supabase Auth; provider-side throttling and lockout settings were not verified. |
| 8.8 | Missing Email Verification | FIXED – PENDING EXTERNAL CONFIGURATION | Backend verifies email through Supabase; provider confirmation and OAuth settings remain external. |
| 8.9 | Missing Password Recovery | FIXED – PENDING EXTERNAL CONFIGURATION | Recovery request/reset UI is implemented with Supabase Auth; redirect allowlist, email templates, expiry and provider policy require dashboard verification. |
| 8.10 | Improper Input Validation | PARTIALLY FIXED | Client auth checks, Pydantic request validation and contact length checks exist; full entry-point audit and injection/XSS review remain. |
| 8.11 | Unbounded Input Field Length | PARTIALLY FIXED | Expanded server field caps and 1 MiB body cap; remaining schemas need further review. |

## Findings and remediation

### 8.1 — CORS Misconfiguration

- **Root cause:** FastAPI used `allow_methods=["*"]`, `allow_headers=["*"]` and credentialed CORS. Origin values came from environment configuration without rejecting wildcard or malformed origins.
- **Files:** `vyuham-backend/app/main.py`, `vyuham-backend/app/core/config.py`, `vyuham-backend/tests/test_security_controls.py`.
- **Fix:** CORS now uses a limited method/header list, does not allow credentials (the API uses bearer authorization rather than cookies), and filters configured origins to exact HTTP localhost or HTTPS origins. Wildcards, paths and invalid schemes are discarded.
- **Tests:** Valid preflight allowed; untrusted origin rejected; credential header absent; wildcard configuration filtered. **5 security tests passed.**
- **Remaining:** Set `FRONTEND_ORIGINS` to the exact production and staging origins in the backend deployment and verify them there. This environment was not inspected.

### 8.2 — Missing Security Headers

- **Root cause:** No shared application response security headers were configured.
- **Files:** `vercel.json`, `vyuham-backend/app/main.py`, `vyuham-backend/tests/test_security_controls.py`.
- **Fix:** Added X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP and CSP headers at the frontend and backend. The API CSP prevents framing. The frontend CSP disallows objects and untrusted base URLs and omits `unsafe-eval`. Camera access is limited to the same origin to preserve the volunteer QR scanner; microphone and geolocation are disabled.
- **Tests:** Backend health response header assertions pass; production frontend build succeeds.
- **Fix:** Vite now emits a restrictive CSP meta policy with exact Supabase endpoints and the configured `VITE_API_URL` origin. Inline script/style allowances remain necessary for the current single-file Vite bundle.

### 8.3 — Clickjacking

- **Root cause:** No explicit framing restrictions were present.
- **Files:** `vercel.json`, `vyuham-backend/app/main.py`, `vyuham-backend/tests/test_security_controls.py`.
- **Fix:** Configured `frame-ancestors 'none'` and `X-Frame-Options: DENY` on frontend/backend responses.
- **Tests:** Header assertions pass.
- **Remaining:** An external-origin browser iframe attempt was not performed, so this remains partial pending browser verification.

### 8.4 — Concurrent Login

- **Root cause:** Supabase sessions were accepted as JWTs without application-side active-session tracking.
- **Fix:** Added a PostgreSQL active-session registry for participant accounts. New login replaces the prior session and protected API dependencies reject superseded sessions. Privileged roles may retain multiple sessions.
- **Files:** `vyuham-backend/app/core/security_state.py`, `vyuham-backend/app/core/deps.py`, `vyuham-backend/app/modules/auth/router.py`, `Vyuham26_frontend/src/context/AuthContext.tsx`.
- **Tests:** Python compilation passed; concurrent-session integration test not run.

### 8.5 — No Rate Limiting

- **Root cause:** No shared rate limiter covered the API; Supabase Auth requests are sent directly from the browser.
- **Fix:** Added atomic PostgreSQL limits for contact, feedback, registrations, team create/join, payments and CTF flag guesses, returning 429 with `Retry-After`.
- **Files:** `vyuham-backend/app/core/security_state.py` and the auxiliary, registration, team, payment and CTF routers.
- **Tests:** Python compilation passed; PostgreSQL limiter integration tests not run.
- **Remaining:** Supabase Auth provider limits/CAPTCHA remain required for direct Auth endpoints.

### 8.6 — Improper Session Invalidation

- **Root cause:** Logout previously did not make the API reject an already-issued access token.
- **Files:** `src/context/AuthContext.tsx`, `src/pages/reset-password/page.tsx`.
- **Fix:** Logout now records the current Supabase session ID as revoked on the backend. Protected API auth rejects revoked sessions; password reset revokes the current API session before Supabase global sign-out.
- **Tests:** Frontend typecheck and build pass; no authenticated token replay test was run.
- **Remaining:** Run session replay and global reset checks against staging.

### 8.7 — Brute-Force Protection

- **Root cause:** Password login runs directly through Supabase; there is no app-level account/IP failure policy in this repository.
- **Files:** Supabase Auth dashboard configuration; the frontend calls Supabase directly.
- **Tests:** No provider configuration or controlled brute-force test was available.
- **Remaining:** Verify/configure Supabase Auth throttles and CAPTCHA or equivalent credential-stuffing controls. Avoid permanent lockout; log security events without credentials.

### 8.8 — Email Verification

- **Root cause:** Frontend signup already handles the Supabase “confirmation required” response, but provider enforcement and backend checks are not established by repository code.
- **Files:** Existing `src/context/AuthContext.tsx`; deployment configuration not changed.
- **Fix:** Signup waits for confirmation; backend verifies the canonical Supabase user record and rejects unconfirmed email identities.
- **Tests:** Existing behavior inspected; no provider integration test or protected-resource test was run.
- **Remaining:** Require confirmation in Supabase Auth and review SMTP templates, redirect allowlists, expiry and OAuth provider verification.

### 8.9 — Password Recovery

- **Root cause:** No user-facing reset route existed in the frontend.
- **Files:** `src/context/AuthContext.tsx`, `src/pages/reset-password/page.tsx`, `src/routes.tsx`.
- **Fix:** Added generic recovery request behavior, a reset form using Supabase’s one-time recovery session, password length checks and global sign-out after password change. Added a “Forgot password?” entry point in the auth modal.
- **Tests:** Frontend typecheck and production build pass; token expiry, reuse and email delivery were not integration-tested.
- **Remaining:** Add `/reset-password` to Supabase’s redirect allowlist and configure/test reset email templates and expiry. Confirm auth provider rate limits and global revocation behavior.

### 8.10 — Improper Input Validation

- **Root cause:** Validation is uneven across the API. Some Pydantic schemas already validate fields, but not every route/schema has been audited.
- **Files:** `src/context/AuthContext.tsx`, `src/components/auth/Auth.tsx`, `src/pages/signup/page.tsx`, `src/pages/contact/page.tsx`, `src/pages/support/page.tsx`, `src/lib/api.ts`, `vyuham-backend/app/modules/auxiliary/schemas.py`.
- **Fix:** Added client-side email/password/profile checks and field caps; contact API failures are no longer falsely reported as successful. Added further input caps and URL/enum constraints to event, announcement, payment, CTF, team and certificate request schemas.
- **Tests:** Frontend typecheck/build and two selected server-side boundary tests pass. A route-by-route injection/XSS and database-access review remains.

### 8.11 — Unbounded Input Field Length

- **Root cause:** Contact and feedback backend message fields had no maximum; body size was not bounded globally.
- **Files:** `src/pages/contact/page.tsx`, `src/pages/support/page.tsx`, `src/pages/signup/page.tsx`, `src/components/auth/Auth.tsx`, `vyuham-backend/app/core/middleware.py`, `vyuham-backend/app/main.py`, `vyuham-backend/app/modules/auxiliary/schemas.py`, `vyuham-backend/tests/test_security_controls.py`.
- **Fix:** Added HTML limits to public and admin forms, caps to request schemas and path/query parameters, and a 1 MiB API request-body cap returning 413.
- **Tests:** Boundary tests for message lengths and new URL/title caps pass. Python compilation passes. The HTTP body-cap/header/CORS tests could not run because TestClient cannot create its Windows async socketpair in this sandbox.
- **Remaining:** Review all product-specific caps and run the blocked HTTP checks and live database boundaries in staging.

## Additional security review

- Passwords are sent to Supabase Auth; this frontend/backend does not store password hashes. Supabase storage/hash configuration was not available for review.
- Backend verifies JWT signature, issuer, audience, expiry and subject format in `app/core/security.py`.
- Role-protected API routes use backend dependencies; frontend route concealment is not treated as authorization. A full route-by-route privilege escalation audit was not performed.
- The API optionally accepts `X-Admin-Key` from the backend environment. The frontend no longer reads `VITE_ADMIN_ACCESS_KEY`, because Vite variables are public in the bundle. Privileged access should use an admin-role Supabase identity unless a separately secured operator flow is provided.
- Existing FastAPI ORM usage and Pydantic request schemas were inspected, but a complete SQL injection/RLS review was not performed.

## Verification performed

- `npm run typecheck` — passed.
- `npm run build` — passed (Vite production bundle).
- `python -m compileall app tests/test_security_controls.py` — passed.
- `python -m pytest tests/test_security_controls.py -k "contact_and_feedback or new_schema_caps"` — **2 passed**.
- `python -m pytest tests/test_security_controls.py -q` — blocked because TestClient could not create its Windows async socketpair in this sandbox; no result is claimed.
- Rate limits and session enforcement compile, but their PostgreSQL integration tests were not run because no staging database was used.
- No live Supabase, staging, production, browser iframe, session concurrency, token replay, rate-limit load, email-delivery or password-reset integration tests were run.




