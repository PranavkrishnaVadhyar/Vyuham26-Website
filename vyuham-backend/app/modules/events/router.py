from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import require_role
from app.modules.auth.models import Profile
from app.modules.events.schemas import EventCreate, EventOut, EventUpdate
from app.modules.events.service import create_event, delete_event, get_event, list_events, update_event

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventOut])
async def read_events(db: Annotated[AsyncSession, Depends(get_db)]) -> list:
    return await list_events(db)


@router.get("/{event_id}", response_model=EventOut)
async def read_event(event_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]) -> object:
    return await get_event(db, event_id)


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
async def post_event(
    data: EventCreate,
    _: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> object:
    return await create_event(db, data)


@router.patch("/{event_id}", response_model=EventOut)
async def patch_event(
    event_id: UUID,
    data: EventUpdate,
    _: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> object:
    return await update_event(db, event_id, data)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_event(
    event_id: UUID,
    _: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Response:
    await delete_event(db, event_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
