from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ResourceNotFoundError
from app.modules.announcements.models import Announcement
from app.modules.announcements.schemas import AnnouncementCreate


async def list_announcements(db: AsyncSession) -> list[Announcement]:
    stmt = select(Announcement).order_by(Announcement.pinned.desc(), Announcement.created_at.desc())
    result = await db.scalars(stmt)
    return list(result.all())


async def create_announcement(db: AsyncSession, data: AnnouncementCreate) -> Announcement:
    announcement = Announcement(**data.model_dump())
    db.add(announcement)
    await db.commit()
    await db.refresh(announcement)
    return announcement


async def delete_announcement(db: AsyncSession, announcement_id: UUID) -> None:
    announcement = await db.get(Announcement, announcement_id)
    if announcement is None:
        raise ResourceNotFoundError("Announcement")
    await db.delete(announcement)
    await db.commit()
