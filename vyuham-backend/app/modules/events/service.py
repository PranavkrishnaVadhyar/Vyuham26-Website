from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ResourceNotFoundError
from app.modules.events.models import Event, RegistrationType
from app.modules.events.schemas import EventCreate, EventUpdate


async def list_events(db: AsyncSession) -> list[Event]:
    result = await db.scalars(select(Event).order_by(Event.created_at, Event.name))
    return list(result)


async def get_event(db: AsyncSession, event_id: UUID) -> Event:
    event = await db.get(Event, event_id)
    if event is None:
        raise ResourceNotFoundError("Event")
    return event


async def create_event(db: AsyncSession, data: EventCreate) -> Event:
    event = Event(**data.model_dump())
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


async def update_event(db: AsyncSession, event_id: UUID, data: EventUpdate) -> Event:
    event = await get_event(db, event_id)
    changes = data.model_dump(exclude_unset=True)
    # Validate the resulting state, including fields omitted by a partial update.
    kind = changes.get("registration_type", event.registration_type)
    minimum = changes.get("team_size_min", event.team_size_min)
    maximum = changes.get("team_size_max", event.team_size_max)
    if kind == RegistrationType.team and (minimum is None or maximum is None or minimum > maximum):
        raise ValueError("Team events require team_size_min and team_size_max with min <= max")
    if kind == RegistrationType.solo:
        changes["team_size_min"] = changes["team_size_max"] = None
    for field, value in changes.items():
        setattr(event, field, value)
    await db.commit()
    await db.refresh(event)
    return event


async def delete_event(db: AsyncSession, event_id: UUID) -> None:
    event = await get_event(db, event_id)
    await db.delete(event)
    await db.commit()
