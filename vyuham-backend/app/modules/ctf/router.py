from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_current_user, require_role
from app.modules.auth.models import Profile
from app.modules.ctf.models import CTFTrack
from app.modules.ctf.schemas import ChallengeCreate, ChallengeOut, ChallengeUpdate, FlagSubmitRequest, ScoreboardEntry, SubmissionResult
from app.modules.ctf.service import create_challenge, get_scoreboard, list_challenges, submit_flag, update_challenge

router = APIRouter(prefix="/ctf", tags=["ctf"])


@router.get("/{event_id}/challenges", response_model=list[ChallengeOut])
async def read_challenges(event_id: UUID, db: Annotated[AsyncSession, Depends(get_db)], track: CTFTrack | None = Query(default=None)):
    return await list_challenges(db, event_id, track)


@router.post("/{event_id}/challenges", response_model=ChallengeOut, status_code=status.HTTP_201_CREATED)
async def post_challenge(event_id: UUID, data: ChallengeCreate, _: Annotated[Profile, Depends(require_role("admin"))], db: Annotated[AsyncSession, Depends(get_db)]):
    return await create_challenge(db, event_id, data, _)


@router.patch("/{event_id}/challenges/{challenge_id}", response_model=ChallengeOut)
async def patch_challenge(event_id: UUID, challenge_id: UUID, data: ChallengeUpdate, _: Annotated[Profile, Depends(require_role("admin"))], db: Annotated[AsyncSession, Depends(get_db)]):
    try:
        return await update_challenge(db, event_id, challenge_id, data)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@router.post("/{event_id}/submit", response_model=SubmissionResult)
async def post_flag(event_id: UUID, data: FlagSubmitRequest, user: Annotated[Profile, Depends(get_current_user)], db: Annotated[AsyncSession, Depends(get_db)]):
    try:
        correct = await submit_flag(db, event_id, data.challenge_id, data.flag, user, data.team_id)
        return {"correct": correct}
    except PermissionError as exc:
        raise HTTPException(403, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@router.get("/{event_id}/scoreboard", response_model=list[ScoreboardEntry])
async def read_scoreboard(event_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]):
    return await get_scoreboard(db, event_id)
