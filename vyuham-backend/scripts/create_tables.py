import asyncio
from sqlalchemy import text

from app.core.db import Base, engine
from app.modules.auth import models as auth_models  # noqa: F401
from app.modules.events import models as event_models  # noqa: F401
from app.modules.teams import models as team_models  # noqa: F401
from app.modules.registrations import models as registration_models  # noqa: F401
from app.modules.hackathon import models as hackathon_models  # noqa: F401
from app.modules.ctf import models as ctf_models  # noqa: F401

MIGRATION_SQLS = [
    # Enum updates for event_stream if type already exists in Postgres
    """
    DO $$
    BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_stream') THEN
            BEGIN
                ALTER TYPE event_stream ADD VALUE IF NOT EXISTS 'culture';
            EXCEPTION WHEN duplicate_object THEN null;
            END;
            BEGIN
                ALTER TYPE event_stream ADD VALUE IF NOT EXISTS 'gaming';
            EXCEPTION WHEN duplicate_object THEN null;
            END;
            BEGIN
                ALTER TYPE event_stream ADD VALUE IF NOT EXISTS 'impact';
            EXCEPTION WHEN duplicate_object THEN null;
            END;
        END IF;
    END$$;
    """,
    # Clean up or migrate legacy placeholder events and streams
    """
    DO $$
    BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
            UPDATE events SET stream = 'culture' WHERE stream::text = 'cultural';
            UPDATE events SET stream = 'gaming' WHERE stream::text = 'esports';
            DELETE FROM events WHERE name LIKE 'Placeholder%';
        END IF;
    END$$;
    """,
    # Profile table column additions
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS degree VARCHAR(120);",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year VARCHAR(50);",
    # Event table column additions
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS slug VARCHAR(100);",
    "CREATE UNIQUE INDEX IF NOT EXISTS ix_events_slug ON events (slug);",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS fee VARCHAR(80);",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS day INTEGER;",
    'ALTER TABLE events ADD COLUMN IF NOT EXISTS "time" VARCHAR(100);',
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS rules JSON;",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS eligibility VARCHAR(200);",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS seats_total INTEGER;",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS image VARCHAR(500);",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'upcoming';",
]


async def main() -> None:
    async with engine.begin() as connection:
        print("Creating tables if they do not exist...")
        await connection.run_sync(Base.metadata.create_all)
        
        print("Applying column and type alignment migrations...")
        for sql in MIGRATION_SQLS:
            try:
                await connection.execute(text(sql))
            except Exception as e:
                # Log but continue if non-PostgreSQL dialect or already present
                print(f"Migration note for: {sql.strip()[:40]}... -> {e}")
                
    await engine.dispose()
    print("Database schema successfully aligned.")


if __name__ == "__main__":
    asyncio.run(main())
