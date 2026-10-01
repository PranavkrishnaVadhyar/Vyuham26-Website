from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, computed_field, field_validator, model_validator

from app.modules.events.models import EventStream, RegistrationType


class EventFields(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=100)
    stream: EventStream
    registration_type: RegistrationType = RegistrationType.solo
    team_size_min: int | None = Field(default=None, ge=1)
    team_size_max: int | None = Field(default=None, ge=1)
    prize_amount: Decimal | None = Field(default=None, ge=0)
    venue: str | None = Field(default=None, max_length=250)
    fee: str | None = Field(default=None, max_length=80)
    day: int | None = Field(default=None, ge=1, le=3)
    time: str | None = Field(default=None, max_length=100)
    rules: list[str] | None = None
    eligibility: str | None = Field(default=None, max_length=200)
    seats_total: int | None = Field(default=None, ge=1)
    image: str | None = Field(default=None, max_length=500)
    featured: bool = False
    status: str = Field(default="upcoming", max_length=50)
    start_time: datetime | None = None
    end_time: datetime | None = None
    description: str | None = None

    @field_validator("stream", mode="before")
    @classmethod
    def normalize_stream(cls, v: Any) -> Any:
        if isinstance(v, str):
            mapping = {
                "cultural": "culture",
                "technology": "tech",
                "esports": "gaming",
            }
            return mapping.get(v.lower(), v.lower())
        return v

    @model_validator(mode="after")
    def validate_team_size(self):
        if self.registration_type == RegistrationType.team:
            if self.team_size_min is not None and self.team_size_max is not None:
                if self.team_size_min > self.team_size_max:
                    raise ValueError("team_size_min must be less than or equal to team_size_max")
        return self


class EventCreate(EventFields):
    pass


class EventUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    slug: str | None = Field(default=None, min_length=1, max_length=100)
    stream: EventStream | None = None
    registration_type: RegistrationType | None = None
    team_size_min: int | None = Field(default=None, ge=1)
    team_size_max: int | None = Field(default=None, ge=1)
    prize_amount: Decimal | None = Field(default=None, ge=0)
    venue: str | None = Field(default=None, max_length=250)
    fee: str | None = Field(default=None, max_length=80)
    day: int | None = Field(default=None, ge=1, le=3)
    time: str | None = Field(default=None, max_length=100)
    rules: list[str] | None = None
    eligibility: str | None = Field(default=None, max_length=200)
    seats_total: int | None = Field(default=None, ge=1)
    image: str | None = Field(default=None, max_length=500)
    featured: bool | None = None
    status: str | None = Field(default=None, max_length=50)
    start_time: datetime | None = None
    end_time: datetime | None = None
    description: str | None = None

    @field_validator("stream", mode="before")
    @classmethod
    def normalize_stream(cls, v: Any) -> Any:
        if isinstance(v, str):
            mapping = {
                "cultural": "culture",
                "technology": "tech",
                "esports": "gaming",
            }
            return mapping.get(v.lower(), v.lower())
        return v

    @model_validator(mode="after")
    def validate_team_size(self):
        values = self.model_dump(exclude_unset=True)
        kind = values.get("registration_type")
        minimum, maximum = values.get("team_size_min"), values.get("team_size_max")
        if kind == RegistrationType.team:
            if minimum is not None and maximum is not None and minimum > maximum:
                raise ValueError("Team updates require team_size_min <= team_size_max")
        elif kind == RegistrationType.solo:
            if minimum is not None or maximum is not None:
                raise ValueError("Solo events must not include team sizes")
        elif (minimum is not None or maximum is not None) and (minimum is None or maximum is None or minimum > maximum):
            raise ValueError("When updating team sizes, provide both with min <= max")
        return self


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    stream: EventStream
    registration_type: RegistrationType
    team_size_min: int | None
    team_size_max: int | None
    prize_amount: Decimal | None
    venue: str | None
    fee: str | None
    day: int | None
    time: str | None
    rules: list[str] | None
    eligibility: str | None
    seats_total: int | None
    image: str | None
    featured: bool
    status: str
    start_time: datetime | None
    end_time: datetime | None
    description: str | None
    created_at: datetime

    @computed_field
    @property
    def title(self) -> str:
        return self.name

    @computed_field
    @property
    def prizes(self) -> str:
        if self.prize_amount is not None:
            return f"₹{int(self.prize_amount):,}"
        return ""

    @computed_field
    @property
    def teamSize(self) -> str:
        if self.registration_type == RegistrationType.solo:
            return "Solo"
        if self.team_size_min and self.team_size_max:
            if self.team_size_min == self.team_size_max:
                return f"{self.team_size_min} members"
            return f"{self.team_size_min}–{self.team_size_max} members"
        return "Team"
