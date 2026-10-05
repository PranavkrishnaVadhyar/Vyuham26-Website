from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import require_role
from app.modules.auth.models import Profile
from app.modules.announcements.schemas import AnnouncementCreate, AnnouncementOut
from app.modules.announcements.service import (
    create_announcement,
    delete_announcement,
    list_announcements,
)

router = APIRouter(prefix="/announcements", tags=["announcements"])


@router.get("", response_model=list[AnnouncementOut])
async def read_announcements(db: Annotated[AsyncSession, Depends(get_db)]) -> list:
    return await list_announcements(db)


@router.post("", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
async def post_announcement(
    data: AnnouncementCreate,
    _: Annotated[Profile, Depends(require_role("admin", "event_head"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> object:
    return await create_announcement(db, data)


@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_announcement(
    announcement_id: UUID,
    _: Annotated[Profile, Depends(require_role("admin", "event_head"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Response:
    await delete_announcement(db, announcement_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
