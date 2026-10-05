from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_current_user, require_role
from app.modules.auth.models import Profile
from app.modules.hackathon.schemas import (LeaderboardEntry, MentorCreate, MentorOut, SubmissionOut,
    SubmissionScoreUpdate, TeamSubmissionCreate)
from app.modules.hackathon.service import (create_mentor, get_leaderboard, get_my_submission,
    list_mentors, list_submissions, set_score, upsert_submission)
from app.modules.teams.models import Team

router = APIRouter(prefix="/hackathon", tags=["hackathon"])


@router.post("/{event_id}/submissions", response_model=SubmissionOut, status_code=status.HTTP_201_CREATED)
async def post_submission(event_id: UUID, data: TeamSubmissionCreate, user: Annotated[Profile, Depends(get_current_user)], db: Annotated[AsyncSession, Depends(get_db)]):
    try:
        return await upsert_submission(db, event_id, data.team_id, user, data)
    except PermissionError as exc:
        raise HTTPException(403, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@router.get("/{event_id}/submissions/me", response_model=SubmissionOut)
async def read_my_submissions(event_id: UUID, user: Annotated[Profile, Depends(get_current_user)], db: Annotated[AsyncSession, Depends(get_db)]):
    row = await get_my_submission(db, event_id, user.id)
    if row is None:
        raise HTTPException(404, "No submission found for your teams in this event")
    return row


@router.get("/{event_id}/submissions", response_model=list[SubmissionOut])
async def read_submissions(event_id: UUID, _: Annotated[Profile, Depends(require_role("admin", "event_head"))], db: Annotated[AsyncSession, Depends(get_db)]):
    return await list_submissions(db, event_id)


@router.patch("/{event_id}/submissions/{submission_id}/score", response_model=SubmissionOut)
async def patch_score(event_id: UUID, submission_id: UUID, data: SubmissionScoreUpdate, user: Annotated[Profile, Depends(require_role("admin", "event_head"))], db: Annotated[AsyncSession, Depends(get_db)]):
    try:
        submission = await set_score(db, event_id, submission_id, data.score, user)
        team = await db.get(Team, submission.team_id)
        return {"id": submission.id, "event_id": submission.event_id, "team_id": submission.team_id, "team_name": team.name,
                "repo_url": submission.repo_url, "demo_url": submission.demo_url, "description": submission.description,
                "score": submission.score, "submitted_at": submission.submitted_at, "updated_at": submission.updated_at}
    except PermissionError as exc:
        raise HTTPException(403, str(exc)) from exc


@router.get("/{event_id}/leaderboard", response_model=list[LeaderboardEntry])
async def read_leaderboard(event_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]):
    return await get_leaderboard(db, event_id)


@router.get("/{event_id}/mentors", response_model=list[MentorOut])
async def read_mentors(event_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]):
    return await list_mentors(db, event_id)


@router.post("/{event_id}/mentors", response_model=MentorOut, status_code=status.HTTP_201_CREATED)
async def post_mentor(event_id: UUID, data: MentorCreate, _: Annotated[Profile, Depends(require_role("admin"))], db: Annotated[AsyncSession, Depends(get_db)]):
    return await create_mentor(db, event_id, data)
