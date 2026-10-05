from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import is_registration_open
from app.core.db import get_db
from app.core.deps import get_current_user, require_role
from app.modules.auth.models import Profile
from app.modules.teams.schemas import TeamCreate, TeamDetailOut, TeamJoinRequest, TeamOut
from app.modules.teams.service import (
    create_team,
    get_team_with_members,
    is_team_member,
    join_team,
    list_user_teams,
)

router = APIRouter(prefix="/teams", tags=["teams"])


@router.post("", response_model=TeamOut, status_code=status.HTTP_201_CREATED)
async def post_team(
    data: TeamCreate,
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    if not is_registration_open():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Registration is coming soon")
    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Team name cannot be blank")
    return await create_team(db, data.name, current_user)


@router.post("/join", response_model=TeamOut)
async def post_join_team(
    data: TeamJoinRequest,
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    if not is_registration_open():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Registration is coming soon")
    try:
        team = await join_team(db, data.invite_code, current_user)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    details = await get_team_with_members(db, team.id)
    return {key: value for key, value in details.items() if key != "members"}



@router.get("/me", response_model=list[TeamOut])
async def read_my_teams(
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[dict]:
    return await list_user_teams(db, current_user.id)


@router.get("/{team_id}", response_model=TeamDetailOut)
async def read_team(
    team_id: UUID,
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    details = await get_team_with_members(db, team_id)
    is_admin = current_user.role.value == "admin"
    if not is_admin and not await is_team_member(db, team_id, current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this team")
    return details
