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
        "title": "Hackathon — 24HR Problem Statement Released",
        "content": "The official Agentic AI / Autonomous Systems hackathon challenge is now accessible in the build zone.",
        "category": "TECH",
        "urgent": False,
        "stream": "TECH",
        "pinned": False,
    },
    {
        "title": "Capture the Flag Briefing in Computer Lab",
        "content": "Registered CTF teams report to Computer Lab for network credential allocation and environment setup.",
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
