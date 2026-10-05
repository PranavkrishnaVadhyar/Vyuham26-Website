import asyncio
from sqlalchemy import select
from app.core.db import SessionFactory, engine
from app.modules.announcements.models import Announcement

INITIAL_ANNOUNCEMENTS = [
    {
        "title": "DUK Technocity Gates Open for Operative Check-in",
        "content": "All registered operatives proceed to Gate 1 and Gate 2 for QR pass verification and welcome kit collection.",
        "category": "LOGISTICS",
        "urgent": True,
        "stream": "ALL",
        "pinned": True,
    },
    {
        "title": "National Hackathon Problem Statements Released",
        "content": "Round 1 problem statements in Web3, AI, and Cybersecurity are now accessible in the build zone.",
        "category": "TECH",
        "urgent": False,
        "stream": "TECH",
        "pinned": False,
    },
    {
        "title": "Capture The Flag Cyber Arena Briefing at 09:30 AM",
        "content": "Mandatory operative briefing for registered CTF squads in Cyber Arena B-Block.",
        "category": "CYBER",
        "urgent": False,
        "stream": "TECH",
        "pinned": False,
    },
]


async def seed() -> None:
    async with SessionFactory() as db:
        existing = (await db.scalars(select(Announcement))).all()
        if not existing:
            print("Seeding initial announcements...")
            for item in INITIAL_ANNOUNCEMENTS:
                ann = Announcement(**item)
                db.add(ann)
            await db.commit()
            print("Announcements seeded successfully.")
        else:
            print(f"Announcements table already contains {len(existing)} records.")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
