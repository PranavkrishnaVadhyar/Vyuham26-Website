from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import require_role
from app.modules.auth.models import Profile
from app.modules.events.models import Event
from app.modules.event_results.models import EventResult
from app.modules.event_results.schemas import EventResultCreate, EventResultOut

router = APIRouter(prefix="/events", tags=["event_results"])


@router.get("/results", response_model=list[EventResultOut])
async def list_event_results(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[EventResultOut]:
    results = (await db.scalars(select(EventResult))).all()
    output: list[EventResultOut] = []

    for r in results:
        ev = await db.get(Event, r.event_id)
        ev_name = ev.name if ev else "COMPETITION"
        ev_stream = ev.stream.value if ev and hasattr(ev.stream, "value") else "TECH"
        output.append(
            EventResultOut(
                event_id=str(r.event_id),
                event_name=ev_name,
                stream=str(ev_stream).upper(),
                first_place=r.first_place,
                second_place=r.second_place,
                third_place=r.third_place,
                prize_distributed=r.prize_distributed or "₹15,000",
                published_at=r.published_at.strftime("%d %b %Y"),
            )
        )
    return output


@router.post("/{event_id}/results", response_model=EventResultOut)
async def publish_event_result(
    event_id: str,
    payload: EventResultCreate,
    current_admin: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> EventResultOut:
    ev = None
    try:
        parsed_id = UUID(event_id)
        ev = await db.get(Event, parsed_id)
    except ValueError:
        ev = await db.scalar(select(Event).where(Event.slug == event_id))
        if not ev:
            ev = await db.scalar(select(Event).where(Event.slug.ilike(f"%{event_id}%")))

    if not ev:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    real_event_id = ev.id
    existing = await db.scalar(
        select(EventResult).where(EventResult.event_id == real_event_id)
    )
    if existing:
        existing.first_place = payload.first_place
        existing.second_place = payload.second_place
        existing.third_place = payload.third_place
        existing.prize_distributed = payload.prize_distributed
        existing.published_by = current_admin.id
        db_obj = existing
    else:
        db_obj = EventResult(
            event_id=real_event_id,
            first_place=payload.first_place,
            second_place=payload.second_place,
            third_place=payload.third_place,
            prize_distributed=payload.prize_distributed,
            published_by=current_admin.id,
        )
        db.add(db_obj)

    await db.commit()
    await db.refresh(db_obj)

    ev_stream = ev.stream.value if hasattr(ev.stream, "value") else str(ev.stream)
    return EventResultOut(
        event_id=str(db_obj.event_id),
        event_name=ev.name,
        stream=ev_stream.upper(),
        first_place=db_obj.first_place,
        second_place=db_obj.second_place,
        third_place=db_obj.third_place,
        prize_distributed=db_obj.prize_distributed,
        published_at=db_obj.published_at.strftime("%d %b %Y"),
    )
