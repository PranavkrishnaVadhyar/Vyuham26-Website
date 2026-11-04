# Security deployment checklist

## Required Supabase Auth settings

The application calls Supabase Auth directly for password login, signup, OAuth, email confirmation and password recovery. Those Auth endpoints are outside the FastAPI process, so their abuse limits must be enabled in the Supabase project.

- Require email confirmation for email/password signup. Confirm OAuth providers return a verified email and reject unverified identities.
- Configure a production SMTP provider and review confirmation and recovery templates.
- Set the Site URL and redirect allowlist for each deployed frontend, including `/reset-password`.
- Set confirmation and recovery token expiry to the shortest value compatible with the user flow.
- Enable Supabase Auth rate limits and CAPTCHA/bot detection for sign-in, signup, recovery and resend verification. Do not treat the frontend as enforcement.
- Review password policy and leaked-password protection in the Auth settings.

The backend checks Supabase's `/auth/v1/user` response before trusting a bearer token. It fails closed if Supabase cannot confirm the user or email.

## Deployment values and database

- Set `FRONTEND_ORIGINS` in the backend deployment to the exact production and staging origins. The checked-in example includes the known Vercel staging/static origins; add any custom domains explicitly.
- Set frontend `VITE_API_URL` to the exact HTTPS API origin at build time. The Vite build adds that one origin to a restrictive CSP `connect-src`; it rejects API URLs containing paths, credentials, query strings or fragments.
- Ensure the API's PostgreSQL role may create the three `security_*` tables and their index at startup. These tables provide shared rate limits, active participant sessions and revoked-session state.
- Run one Uvicorn process per service instance only as required by the existing database connection-pool configuration. PostgreSQL-backed controls are shared across instances.
- Configure the hosting proxy so `request.client.host` is the real client address. Do not trust arbitrary client-supplied `X-Forwarded-For` values.
- Keep Supabase service-role credentials on the backend only. Never set them as Vite `VITE_*` variables.

## Behavior and limits

- The API allows one active participant session. A newer login replaces the old session; a request using the replaced token receives 401. Privileged roles may retain multiple sessions. Backend logout revokes the presented session through its JWT expiry.
- PostgreSQL applies separate IP and account buckets where an account is available, returning 429 with `Retry-After`: contact (5/hour/IP), feedback (10/hour/IP and account), event registration (8/hour/IP and account), team create (3/hour/account), team join (10/hour/account), payment create (5/minute/account), payment verify (10/minute/account), and CTF flag guesses (10/minute/account).
- Supabase login, signup, email verification and password recovery throttles remain provider settings because the browser communicates directly with Supabase Auth.
- Password reset and email-delivery flows need a staging integration check after the Supabase redirect, SMTP and token settings are applied.
