from collections.abc import Callable
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from starlette.concurrency import run_in_threadpool

from app.core.db import get_db
from app.core.security import decode_supabase_token
from app.modules.auth.models import Profile, UserRole

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Profile:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token required",
                            headers={"WWW-Authenticate": "Bearer"})
    claims = await run_in_threadpool(decode_supabase_token, credentials.credentials)
    profile_id = UUID(claims["sub"])
    profile = await db.get(Profile, profile_id)
    if profile is not None:
        # Keep the locally cached email aligned with Supabase's verified claim.
        if profile.email != claims["email"]:
            profile.email = claims["email"]
            await db.commit()
            await db.refresh(profile)
        return profile

    profile = Profile(id=profile_id, email=claims["email"], role=UserRole.participant)
    db.add(profile)
    try:
        await db.commit()
        await db.refresh(profile)
        return profile
    except IntegrityError:
        # Another request may have created this profile concurrently.
        await db.rollback()
        profile = await db.get(Profile, profile_id)
        if profile is None:
            raise HTTPException(status_code=409, detail="Could not initialize profile")
        return profile


def require_role(*allowed_roles: UserRole | str) -> Callable:
    allowed = set()
    for role in allowed_roles:
        val = role.value if isinstance(role, UserRole) else str(role)
        if val == "user":
            val = "participant"
        allowed.add(val)

    async def role_dependency(
        current_user: Annotated[Profile, Depends(get_current_user)],
    ) -> Profile:
        if current_user.role.value not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return current_user

    return role_dependency
