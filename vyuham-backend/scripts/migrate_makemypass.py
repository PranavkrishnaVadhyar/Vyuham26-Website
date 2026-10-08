import asyncio
from sqlalchemy import text
from app.core.db import engine


async def migrate():
    async with engine.begin() as conn:
        await conn.execute(text("ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_url VARCHAR(500);"))
        await conn.execute(text("ALTER TABLE events ADD COLUMN IF NOT EXISTS makemypass_url VARCHAR(500);"))
        res = await conn.execute(text(
            "SELECT column_name, data_type FROM information_schema.columns "
            "WHERE table_name = 'events' AND column_name IN ('registration_url', 'makemypass_url');"
        ))
        rows = res.fetchall()
        print("Columns in DB:", rows)


if __name__ == "__main__":
    asyncio.run(migrate())
