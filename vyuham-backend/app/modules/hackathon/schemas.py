from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SubmissionCreate(BaseModel):
    repo_url: str = Field(min_length=1, max_length=1000)
    demo_url: str | None = Field(default=None, max_length=1000)
    description: str | None = None


class TeamSubmissionCreate(SubmissionCreate):
    team_id: UUID


class SubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    event_id: UUID
    team_id: UUID
    team_name: str
    repo_url: str
    demo_url: str | None
    description: str | None
    score: Decimal | None
    submitted_at: datetime
    updated_at: datetime


class SubmissionScoreUpdate(BaseModel):
    score: Decimal = Field(ge=0)


class MentorCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    expertise: str = Field(min_length=1, max_length=250)
    slot_time: str = Field(min_length=1, max_length=120)
    contact: str | None = Field(default=None, max_length=250)


class MentorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    event_id: UUID
    name: str
    expertise: str
    slot_time: str
    contact: str | None


class LeaderboardEntry(BaseModel):
    team_name: str
    score: Decimal
