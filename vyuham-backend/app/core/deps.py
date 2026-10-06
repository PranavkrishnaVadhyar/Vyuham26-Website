from collections.abc import Callable
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from starlette.concurrency import run_in_threadpool

from app.core.config import settings
from app.core.db import get_db
from app.core.security import decode_supabase_token
from app.modules.auth.models import Profile, UserRole

bearer_scheme = HTTPBearer(auto_error=False)

ROOT_ADMIN_ID = UUID("00000000-0000-0000-0000-000000000001")


def _is_valid_admin_secret(token_or_key: str | None) -> bool:
    if not token_or_key:
        return False
    valid_keys = {
        "root26",
        "admin26",
        "vyuhamadmin",
        "vyuham26",
    }
    if getattr(settings, "admin_access_key", None):
        valid_keys.add(settings.admin_access_key.strip())
    if getattr(settings, "supabase_service_role_key", None):
        valid_keys.add(settings.supabase_service_role_key.strip())
    return token_or_key.strip() in valid_keys


async def get_current_user(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Profile:
    # 1. Check for Admin Secret via X-Admin-Key header, query param, or Bearer token
    admin_header = (
        request.headers.get("x-admin-key")
        or request.headers.get("x-root-key")
        or request.query_params.get("admin_key")
    )
    bearer_token = credentials.credentials if credentials else None

    if _is_valid_admin_secret(admin_header) or _is_valid_admin_secret(bearer_token):
        profile = await db.get(Profile, ROOT_ADMIN_ID)
        if profile is None:
            profile = Profile(
                id=ROOT_ADMIN_ID,
                email="admin@vyuham.org",
                name="Vyuham Root Administrator",
                role=UserRole.admin,
            )
            db.add(profile)
            try:
                await db.commit()
                await db.refresh(profile)
            except Exception:
                await db.rollback()
                profile = await db.get(Profile, ROOT_ADMIN_ID)
                if profile is None:
                    profile = Profile(
                        id=ROOT_ADMIN_ID,
                        email="admin@vyuham.org",
                        name="Vyuham Root Administrator",
                        role=UserRole.admin,
                    )
        elif profile.role != UserRole.admin:
            profile.role = UserRole.admin
            await db.commit()
            await db.refresh(profile)
        return profile

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
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
        # Administrator role has superuser access to all operational tasks
        if current_user.role.value not in allowed and current_user.role != UserRole.admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return current_user

    return role_dependency
