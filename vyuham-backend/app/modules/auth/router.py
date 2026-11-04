from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import bearer_scheme, get_current_user, require_role
from fastapi.security import HTTPAuthorizationCredentials
from app.core.security import decode_supabase_token
from app.core.security_state import register_session, revoke_session
from uuid import UUID
from starlette.concurrency import run_in_threadpool
from app.modules.auth.models import Profile, UserRole
from app.modules.auth.schemas import ProfileOut, ProfileUpdate, RoleAssignRequest
from app.modules.auth.service import assign_role, update_profile

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/session", status_code=204)
async def register_login_session(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """Record the newly authenticated login before the frontend loads its profile."""
    if credentials is None:
        raise HTTPException(status_code=401, detail="Bearer token required")
    claims = await run_in_threadpool(decode_supabase_token, credentials.credentials)
    user_id = UUID(claims["sub"])
    profile = await db.get(Profile, user_id)
    if profile is None:
        profile = Profile(id=user_id, email=claims["email"], role=UserRole.participant)
        db.add(profile)
        await db.commit()
    if profile.role == UserRole.participant:
        await register_session(user_id, claims)


@router.post("/logout", status_code=204)
async def logout(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    current_user: Annotated[Profile, Depends(get_current_user)],
) -> None:
    """Revoke this bearer session server-side before the client signs out."""
    if credentials is None:
        raise HTTPException(status_code=401, detail="Bearer token required")
    claims = await run_in_threadpool(decode_supabase_token, credentials.credentials)
    await revoke_session(current_user.id, claims)


@router.get("/me", response_model=ProfileOut)
async def read_me(current_user: Annotated[Profile, Depends(get_current_user)]) -> Profile:
    return current_user


@router.patch("/me", response_model=ProfileOut)
async def patch_me(
    changes: ProfileUpdate,
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Profile:
    return await update_profile(db, current_user, changes)


@router.post("/assign-role", response_model=ProfileOut)
async def set_role(
    request: RoleAssignRequest,
    _: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Profile:
    return await assign_role(db, request.user_id, request.role)
