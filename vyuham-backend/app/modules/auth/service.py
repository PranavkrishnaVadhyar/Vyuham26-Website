from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ResourceNotFoundError
from app.modules.auth.models import Profile, UserRole
from app.modules.auth.schemas import ProfileUpdate


async def update_profile(db: AsyncSession, profile: Profile, changes: ProfileUpdate) -> Profile:
    for field, value in changes.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    await db.commit()
    await db.refresh(profile)
    return profile


async def assign_role(db: AsyncSession, user_id: UUID, role: UserRole) -> Profile:
    profile = await db.get(Profile, user_id)
    if profile is None:
        raise ResourceNotFoundError("Profile")
    profile.role = role
    await db.commit()
    await db.refresh(profile)
    return profile
