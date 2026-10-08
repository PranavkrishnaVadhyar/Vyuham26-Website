from collections.abc import Callable
from typing import Annotated
from uuid import UUID

import secrets

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
    """Validate the optional X-Admin-Key credential.

    Only the env-configured ADMIN_ACCESS_KEY is accepted. The previous
    implementation also accepted four hardcoded literals and the Supabase
    service-role key, which made admin takeover trivial; those are gone
    permanently. Comparison is constant-time.
    """
    if not token_or_key:
        return False
    configured = (getattr(settings, "admin_access_key", None) or "").strip()
    if not configured:
        return False
    return secrets.compare_digest(token_or_key.strip(), configured)


async def get_current_user(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Profile:
    # Admin secret via the X-Admin-Key header or as bearer credential.
    # Deliberately NOT accepted from query parameters (they leak into access
    # logs, browser history and Referer headers) or from secondary headers.
    bearer_token = credentials.credentials if credentials else None
    admin_header = request.headers.get("x-admin-key")

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


async def get_verified_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> UUID | None:
    """Optionally resolve the calling user's id from a valid bearer token.

    Returns None for anonymous callers. Invalid/expired tokens are also
    treated as anonymous (the caller simply gets no identity) instead of
    raising, so endpoints using this dependency stay public but can never
    be tricked into trusting a client-supplied user id.
    """
    if credentials is None:
        return None
    try:
        claims = await run_in_threadpool(decode_supabase_token, credentials.credentials)
    except HTTPException:
        return None
    try:
        return UUID(claims["sub"])
    except (KeyError, ValueError):
        return None


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
