from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_current_user, require_role
from app.modules.auth.models import Profile, UserRole
from app.modules.auth.schemas import ProfileOut, ProfileUpdate, RoleAssignRequest
from app.modules.auth.service import assign_role, update_profile

router = APIRouter(prefix="/auth", tags=["auth"])


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
