# Vyuham '26 Backend

FastAPI API for the Vyuham '26 college fest platform. Current scope covers Supabase JWT authentication, profiles and roles, event management, teams, and event registrations. Payments, tickets, coupons, certificates, and results are not implemented yet.

## Project conventions

Each feature is self-contained under `app/modules/<name>/`: its router, schemas, models, and service live together. Keep module ownership clear; nobody edits another module's folder without review. Shared application concerns belong in `app/core/`.

## Configuration

Copy `.env.example` to `.env` and fill in the project values. `DATABASE_URL` should be the Supabase Postgres connection string. The app converts the common `postgresql://` form to the `asyncpg` driver form.

Find the project URL and database connection string in the Supabase dashboard under **Project Settings** and **Connect**. The JWT signing secret is in **Project Settings → API → JWT Settings** (the legacy JWT Secret section). Keep secrets private and never commit `.env`.

## Local development

Use Python 3.11 or newer. From this directory:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

The API docs are available at `http://127.0.0.1:8000/docs` while the server is running.

Create the initial tables with:

```powershell
python -m scripts.create_tables
```

After tables exist, the placeholder event data can be inserted with `python -m scripts.seed_events`. The seed script skips names that already exist. Team and registration tables are included in `Base.metadata.create_all()` through their imports in `scripts/create_tables.py`.

## Schema changes (no migration tool)

SQLAlchemy models are the schema source of truth; this project intentionally has no Alembic or other migration tool. For a new table, edit or add the model and re-run `scripts/create_tables.py`. `Base.metadata.create_all()` only creates missing tables; it does **not** alter existing tables. Changes to columns or constraints on an existing table must be applied with matching SQL manually in the Supabase SQL editor (or an equivalent controlled database operation), as well as reflected in the model. Review the SQL against the model before applying it.
