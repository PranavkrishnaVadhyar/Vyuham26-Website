from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.modules.ctf.models import CTFTrack


class ChallengeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str
    category: str = Field(min_length=1, max_length=80)
    track: CTFTrack
    points: int = Field(gt=0)
    flag: str = Field(min_length=1)


class ChallengeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    event_id: UUID
    title: str
    description: str
    category: str
    track: CTFTrack
    points: int
    is_active: bool
    created_at: datetime


class ChallengeUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    points: int | None = Field(default=None, gt=0)
    is_active: bool | None = None


class FlagSubmitRequest(BaseModel):
    challenge_id: UUID
    flag: str = Field(min_length=1)
    team_id: UUID | None = None


class SubmissionResult(BaseModel):
    correct: bool


class ScoreboardEntry(BaseModel):
    scorer_name: str
    total_points: int
    solved_count: int
