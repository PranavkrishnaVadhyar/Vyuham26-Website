from datetime import datetime
from decimal import Decimal
from typing import Literal
from uuid import UUID
from urllib.parse import urlsplit

from pydantic import BaseModel, ConfigDict, Field, field_validator


class SubmissionCreate(BaseModel):
    repo_url: str = Field(min_length=1, max_length=1000)
    demo_url: str | None = Field(default=None, max_length=1000)
    description: str | None = Field(default=None, max_length=4000)

    @field_validator("repo_url", "demo_url")
    @classmethod
    def validate_http_url(cls, value: str | None) -> str | None:
        if value is None:
            return value
        parsed = urlsplit(value.strip())
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("URL must start with http:// or https://")
        return value.strip()


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


class MentorRequestCreate(BaseModel):
    team_id: UUID | None = None
    mentor_id: UUID | None = None
    message: str | None = Field(default=None, max_length=2000)


class MentorRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    event_id: UUID
    requester_id: UUID
    team_id: UUID | None
    mentor_id: UUID | None
    message: str | None
    status: str
    created_at: datetime
    updated_at: datetime


class MentorRequestAdminOut(MentorRequestOut):
    requester_name: str | None = None
    requester_email: str | None = None
    team_name: str | None = None


class MentorRequestStatusUpdate(BaseModel):
    status: Literal["pending", "accepted", "completed", "cancelled"]


class HackathonMilestoneOut(BaseModel):
    id: UUID
    title: str
    time: str
    status: Literal["COMPLETE", "ACTIVE", "PENDING"]
    description: str | None
    venue: str | None


class LeaderboardEntry(BaseModel):
    team_name: str
    score: Decimal
