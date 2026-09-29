import asyncio

from sqlalchemy import select

from app.core.db import SessionFactory, engine
from app.modules.events.models import Event, EventStream, RegistrationType

STARTER_EVENTS = [
    {
        "name": "Placeholder Hackathon",
        "stream": EventStream.tech,
        "registration_type": RegistrationType.team,
        "team_size_min": 2,
        "team_size_max": 4,
        "description": "Placeholder event; replace with the official Vyuham event list.",
    },
    {
        "name": "Placeholder Case Challenge",
        "stream": EventStream.management,
        "registration_type": RegistrationType.solo,
        "description": "Placeholder event; replace with the official Vyuham event list.",
    },
    {
        "name": "Placeholder Battle of Bands",
        "stream": EventStream.cultural,
        "registration_type": RegistrationType.team,
        "team_size_min": 3,
        "team_size_max": 8,
        "description": "Placeholder event; replace with the official Vyuham event list.",
    },
    {
        "name": "Placeholder Esports Open",
        "stream": EventStream.esports,
        "registration_type": RegistrationType.team,
        "team_size_min": 1,
        "team_size_max": 5,
        "description": "Placeholder event; replace with the official Vyuham event list.",
    },
]


async def main() -> None:
    async with SessionFactory() as session:
        existing_names = set((await session.scalars(select(Event.name))).all())
        session.add_all(Event(**item) for item in STARTER_EVENTS if item["name"] not in existing_names)
        await session.commit()
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
