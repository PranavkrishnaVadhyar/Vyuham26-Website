[1mdiff --git a/.gitignore b/.gitignore[m
[1mindex 5a7bbe9..2c80686 100644[m
[1m--- a/.gitignore[m
[1m+++ b/.gitignore[m
[36m@@ -1,3 +1,7 @@[m
[32m+[m[32m# ==============================================================================[m
[32m+[m[32m# VYUHAM 26 — ROOT GITIGNORE (Frontend & Backend)[m
[32m+[m[32m# ==============================================================================[m
[32m+[m
 # Dependencies[m
 node_modules/[m
 .pnp[m
[36m@@ -5,21 +9,29 @@[m [mnode_modules/[m
 [m
 # Build Outputs[m
 dist/[m
[32m+[m[32mdist-ssr/[m
 out/[m
 build/[m
 .next/[m
 .turbo/[m
 .vercel/[m
 [m
[31m-# Environment Variables[m
[32m+[m[32m# Environment Variables & Secrets[m
 .env[m
[32m+[m[32m.env.*[m
 .env.local[m
 .env.development.local[m
 .env.test.local[m
 .env.production.local[m
 .env*.local[m
[32m+[m[32m*.env[m
[32m+[m[32menv[m
[32m+[m[32menv.*[m
[32m+[m[32m!.env.example[m
[32m+[m[32m!*.env.example[m
 [m
 # Logs[m
[32m+[m[32mlogs/[m
 *.log[m
 npm-debug.log*[m
 yarn-debug.log*[m
[36m@@ -27,8 +39,33 @@[m [myarn-error.log*[m
 pnpm-debug.log*[m
 lerna-debug.log*[m
 [m
[32m+[m[32m# Python & Virtual Environments (vyuham-backend)[m
[32m+[m[32m__pycache__/[m
[32m+[m[32m*.py[cod][m
[32m+[m[32m*$py.class[m
[32m+[m[32m*.so[m
[32m+[m[32m.Python[m
[32m+[m[32m*.egg-info/[m
[32m+[m[32m.eggs/[m
[32m+[m
[32m+[m[32m# Virtual Environments[m
[32m+[m[32m.venv/[m
[32m+[m[32m.venv*/[m
[32m+[m[32mvenv/[m
[32m+[m[32mvenv*/[m
[32m+[m[32mENV/[m
[32m+[m[32menv/[m
[32m+[m
[32m+[m[32m# Python Testing & Linters[m
[32m+[m[32m.pytest_cache/[m
[32m+[m[32m.coverage[m
[32m+[m[32mhtmlcov/[m
[32m+[m[32m.mypy_cache/[m
[32m+[m[32m.ruff_cache/[m
[32m+[m
 # Editor & IDE directories[m
 .vscode/[m
[32m+[m[32m!.vscode/extensions.json[m
 .idea/[m
 *.suo[m
 *.ntvs*[m
[1mdiff --git a/Vyuham26_frontend/BACKEND_INTEGRATION_STEPS.txt b/Vyuham26_frontend/BACKEND_INTEGRATION_STEPS.txt[m
[1mnew file mode 100644[m
[1mindex 0000000..e1bb863[m
[1m--- /dev/null[m
[1m+++ b/Vyuham26_frontend/BACKEND_INTEGRATION_STEPS.txt[m
[36m@@ -0,0 +1,145 @@[m
[32m+[m[32m================================================================================[m
[32m+[m[32m          VYUHAM '26 â€” FRONTEND TO BACKEND INTEGRATION GUIDE[m
[32m+[m[32m================================================================================[m
[32m+[m
[32m+[m[32mThis document outlines the step-by-step roadmap to connect the React/Vite[m[41m [m
[32m+[m[32mfrontend (Vyuham26_frontend) with the FastAPI/Supabase backend (vyuham-backend).[m
[32m+[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m[32mARCHITECTURE OVERVIEW[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m[32m- Frontend: React 19 + Vite (Runs on http://localhost:5173)[m
[32m+[m[32m- Backend:  FastAPI + SQLAlchemy + asyncpg (Runs on http://localhost:8000)[m
[32m+[m[32m- Database: Supabase PostgreSQL[m
[32m+[m[32m- Auth:     Supabase Auth (JWT verified by FastAPI using Bearer tokens)[m
[32m+[m
[32m+[m[32mAuthentication Flow:[m
[32m+[m[32m  1. User signs up / logs in via Supabase in the frontend.[m
[32m+[m[32m  2. Frontend gets the Supabase access token (JWT).[m
[32m+[m[32m  3. Frontend sends API requests to FastAPI with:[m
[32m+[m[32m     Authorization: Bearer <supabase_access_token>[m
[32m+[m[32m  4. FastAPI validates token, retrieves/creates the user Profile, and[m[41m [m
[32m+[m[32m     handles event registrations and teams.[m
[32m+[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m[32mPHASE 1: PREREQUISITES (SUPABASE SETUP)[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m[32m1. Go to https://supabase.com and create a project (e.g., "vyuham-26").[m
[32m+[m[32m2. Under Project Settings -> API, collect:[m
[32m+[m[32m   - Project URL (SUPABASE_URL)[m
[32m+[m[32m   - Anon / Public Key (for frontend)[m
[32m+[m[32m   - Service Role Key (for backend)[m
[32m+[m[32m   - JWT Secret (Project Settings -> API -> JWT Settings)[m
[32m+[m[32m3. Under Project Settings -> Database, collect:[m
[32m+[m[32m   - Connection String (URI with asyncpg / postgresql format)[m
[32m+[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m[32mPHASE 2: BACKEND CONFIGURATION & FIXES (vyuham-backend)[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m
[32m+[m[32m[ ] STEP 2.1: CREATE THE BACKEND .env FILE[m
[32m+[m[32m    In `c:\Users\nb200\Documents\Vyuham26-Website\vyuham-backend`, create `.env`:[m
[32m+[m[41m    [m
[32m+[m[32m    DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres[m
[32m+[m[32m    SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co[m
[32m+[m[32m    SUPABASE_JWT_SECRET=[YOUR-PROJECT-JWT-SECRET][m
[32m+[m[32m    SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY][m
[32m+[m[32m    FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173[m
[32m+[m
[32m+[m[32m[ ] STEP 2.2: FIX CORS IN BACKEND CONFIG[m
[32m+[m[32m    File: `vyuham-backend/app/core/config.py`[m
[32m+[m[32m    Ensure `frontend_origins` default includes port 5173:[m
[32m+[m[32m    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5500"[m
[32m+[m
[32m+[m[32m[ ] STEP 2.3: ADD `slug` TO EVENT MODEL & SCHEMAS[m
[32m+[m[32m    The frontend routes by slug (/events/hackathon-36), while backend only has UUID.[m
[32m+[m[32m    File: `vyuham-backend/app/modules/events/models.py`[m
[32m+[m[32m    - Add: slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)[m
[32m+[m[32m    File: `vyuham-backend/app/modules/events/schemas.py`[m
[32m+[m[32m    - Add `slug: str` to EventCreate, EventUpdate, and EventOut.[m
[32m+[m
[32m+[m[32m[ ] STEP 2.4: ALIGN STREAM ENUMS[m
[32m+[m[32m    Frontend streams: 'tech', 'culture', 'gaming', 'impact'[m
[32m+[m[32m    Backend enum: `app/modules/events/models.py`[m
[32m+[m[32m    - Update EventStream to: tech, culture, gaming, impact (or map them).[m
[32m+[m
[32m+[m[32m[ ] STEP 2.5: ADD `degree` AND `year` TO PROFILE[m
[32m+[m[32m    File: `vyuham-backend/app/modules/auth/models.py` & `schemas.py`[m
[32m+[m[32m    - Add `degree: Mapped[str | None]` and `year: Mapped[str | None]` to Profile model.[m
[32m+[m[32m    - Add them to ProfileOut and ProfileUpdate schemas so the frontend profile page[m
[32m+[m[32m      can sync degree and academic year with the database.[m
[32m+[m
[32m+[m[32m[ ] STEP 2.6: PYTHON VIRTUAL ENVIRONMENT & DEPENDENCIES[m
[32m+[m[32m    In terminal (under `vyuham-backend` folder):[m
[32m+[m[32m      python -m venv .venv[m
[32m+[m[32m      .venv\Scripts\activate[m
[32m+[m[32m      pip install -r requirements.txt[m
[32m+[m
[32m+[m[32m[ ] STEP 2.7: CREATE TABLES & SEED 48 REAL EVENTS[m
[32m+[m[32m    Run table creation and populate with the 48 official events from frontend:[m
[32m+[m[32m      python -m scripts.create_tables[m
[32m+[m[32m      python -m scripts.seed_events[m
[32m+[m
[32m+[m[32m[ ] STEP 2.8: RUN THE BACKEND SERVER[m
[32m+[m[32m    Start the FastAPI server:[m
[32m+[m[32m      uvicorn app.main:app --reload --port 8000[m
[32m+[m
[32m+[m[32m    Verify by visiting: http://localhost:8000/docs (Swagger UI)[m
[32m+[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m[32mPHASE 3: FRONTEND INTEGRATION (Vyuham26_frontend)[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m
[32m+[m[32m[ ] STEP 3.1: INSTALL SUPABASE CLIENT[m
[32m+[m[32m    In terminal (under `Vyuham26_frontend` folder):[m
[32m+[m[32m      npm install @supabase/supabase-js[m
[32m+[m
[32m+[m[32m[ ] STEP 3.2: CREATE FRONTEND .env FILE[m
[32m+[m[32m    In `Vyuham26_frontend`, create `.env`:[m
[32m+[m[32m      VITE_API_URL=http://localhost:8000[m
[32m+[m[32m      VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co[m
[32m+[m[32m      VITE_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY][m
[32m+[m
[32m+[m[32m[ ] STEP 3.3: CREATE SUPABASE CLIENT INSTANCE[m
[32m+[m[32m    Create `src/lib/supabase.ts`:[m
[32m+[m[32m      import { createClient } from "@supabase/supabase-js";[m
[32m+[m[32m      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;[m
[32m+[m[32m      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;[m
[32m+[m[32m      export const supabase = createClient(supabaseUrl, supabaseAnonKey);[m
[32m+[m
[32m+[m[32m[ ] STEP 3.4: CREATE API CLIENT HELPER[m
[32m+[m[32m    Create `src/lib/api.ts`:[m
[32m+[m[32m      A standard fetch wrapper that retrieves the current Supabase session token:[m
[32m+[m[32m      const { data: { session } } = await supabase.auth.getSession();[m
[32m+[m[32m      headers['Authorization'] = `Bearer ${session?.access_token}`;[m
[32m+[m
[32m+[m[32m[ ] STEP 3.5: WIRE AUTHCONTEXT WITH REAL SUPABASE & BACKEND[m
[32m+[m[32m    Update `src/context/AuthContext.tsx`:[m
[32m+[m[32m      - login(): calls supabase.auth.signInWithPassword({ email, password })[m
[32m+[m[32m      - signup(): calls supabase.auth.signUp({ email, password, options: { data: { name } } })[m
[32m+[m[32m      - onAuthStateChange(): fetches verified profile from `GET http://localhost:8000/auth/me`[m
[32m+[m[32m      - updateUser(): calls `PATCH http://localhost:8000/auth/me`[m
[32m+[m[32m      - logout(): calls supabase.auth.signOut()[m
[32m+[m
[32m+[m[32m[ ] STEP 3.6: WIRE EVENT REGISTRATION & DASHBOARD[m
[32m+[m[32m    - When clicking "REGISTER PROTOCOL" on an event page:[m
[32m+[m[32m      Call `POST http://localhost:8000/registrations` with { event_id, team_id }.[m
[32m+[m[32m    - In Dashboard & Profile pages:[m
[32m+[m[32m      Fetch official registered events from `GET http://localhost:8000/registrations/me`.[m
[32m+[m
[32m+[m[32m[ ] STEP 3.7: WIRE TEAMS MODULE (FOR SQUAD/HACKATHON EVENTS)[m
[32m+[m[32m    - Team creation: `POST http://localhost:8000/teams` -> generates unique invite code.[m
[32m+[m[32m    - Join team: `POST http://localhost:8000/teams/join` with invite code.[m
[32m+[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m[32mPHASE 4: TESTING CHECKLIST[m
[32m+[m[32m--------------------------------------------------------------------------------[m
[32m+[m[32m1. Sign up a new user on http://localhost:5173.[m
[32m+[m[32m2. Confirm user appears in Supabase Auth and a Profile row exists in PostgreSQL.[m
[32m+[m[32m3. Update Profile details (College, Degree, Year) on `/profile` and verify DB updates.[m
[32m+[m[32m4. Register for a Solo event -> verify registration in `/registrations/me` & dashboard.[m
[32m+[m[32m5. Create a Team for Hackathon 36 -> invite teammate using code -> verify both registered.[m
[32m+[m
[32m+[m[32m================================================================================[m
[32m+[m[32mGuide generated on: 2026-09-29[m
[32m+[m[32m================================================================================[m
[1mdiff --git a/vyuham-backend/.gitignore b/vyuham-backend/.gitignore[m
[1mindex a95295c..3a817b4 100644[m
[1m--- a/vyuham-backend/.gitignore[m
[1m+++ b/vyuham-backend/.gitignore[m
[36m@@ -1,9 +1,56 @@[m
[31m-.venv[m
[32m+[m[32m# ==============================================================================[m
[32m+[m[32m# VYUHAM BACKEND (FastAPI / Python) GITIGNORE[m
[32m+[m[32m# ==============================================================================[m
[32m+[m
[32m+[m[32m# Environment Variables & Secrets[m
 .env[m
[31m-README.md[m
[31m-/frontend[m
[32m+[m[32m.env.*[m
[32m+[m[32menv[m
[32m+[m[32menv.*[m
[32m+[m[32m*.env[m
[32m+[m[32m!.env.example[m
[32m+[m[32m!*.env.example[m
[32m+[m
[32m+[m[32m# Virtual Environments[m
[32m+[m[32m.venv/[m
[32m+[m[32m.venv*/[m
[32m+[m[32mvenv/[m
[32m+[m[32mvenv*/[m
[32m+[m[32menv/[m
[32m+[m[32mENV/[m
 [m
[31m-# Python cache directories and compiled bytecode[m
[32m+[m[32m# Python Cache & Bytecode[m
 __pycache__/[m
 *.py[cod][m
 *$py.class[m
[32m+[m[32m*.so[m
[32m+[m[32m.Python[m
[32m+[m
[32m+[m[32m# Build & Packaging[m
[32m+[m[32mbuild/[m
[32m+[m[32mdist/[m
[32m+[m[32m*.egg-info/[m
[32m+[m[32m.eggs/[m
[32m+[m
[32m+[m[32m# Testing & Coverage[m
[32m+[m[32m.pytest_cache/[m
[32m+[m[32m.coverage[m
[32m+[m[32mhtmlcov/[m
[32m+[m[32m.mypy_cache/[m
[32m+[m[32m.ruff_cache/[m
[32m+[m
[32m+[m[32m# SQLite / Local DBs[m
[32m+[m[32m*.sqlite3[m
[32m+[m[32m*.db[m
[32m+[m
[32m+[m[32m# Logs[m
[32m+[m[32mlogs/[m
[32m+[m[32m*.log[m
[32m+[m
[32m+[m[32m# Editor & OS files[m
[32m+[m[32m.vscode/[m
[32m+[m[32m.idea/[m
[32m+[m[32m.DS_Store[m
[32m+[m[32mThumbs.db[m
[32m+[m[32m*.swp[m
[32m+[m[32m*.swo[m
