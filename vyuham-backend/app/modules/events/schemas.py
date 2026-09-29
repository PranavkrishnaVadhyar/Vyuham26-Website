from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.modules.events.models import EventStream, RegistrationType


class EventFields(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    stream: EventStream
    registration_type: RegistrationType
    team_size_min: int | None = Field(default=None, ge=1)
    team_size_max: int | None = Field(default=None, ge=1)
    prize_amount: Decimal | None = Field(default=None, ge=0)
    venue: str | None = Field(default=None, max_length=250)
    start_time: datetime | None = None
    end_time: datetime | None = None
    description: str | None = None

    @model_validator(mode="after")
    def validate_team_size(self):
        if self.registration_type == RegistrationType.team:
            if self.team_size_min is None or self.team_size_max is None:
                raise ValueError("Team events require both team_size_min and team_size_max")
            if self.team_size_min > self.team_size_max:
                raise ValueError("team_size_min must be less than or equal to team_size_max")
        return self


class EventCreate(EventFields):
    pass


class EventUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    stream: EventStream | None = None
    registration_type: RegistrationType | None = None
    team_size_min: int | None = Field(default=None, ge=1)
    team_size_max: int | None = Field(default=None, ge=1)
    prize_amount: Decimal | None = Field(default=None, ge=0)
    venue: str | None = Field(default=None, max_length=250)
    start_time: datetime | None = None
    end_time: datetime | None = None
    description: str | None = None

    @model_validator(mode="after")
    def validate_team_size(self):
        values = self.model_dump(exclude_unset=True)
        kind = values.get("registration_type")
        minimum, maximum = values.get("team_size_min"), values.get("team_size_max")
        if kind == RegistrationType.team:
            if minimum is None or maximum is None or minimum > maximum:
                raise ValueError("Team updates require team_size_min and team_size_max with min <= max")
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
    stream: EventStream
    registration_type: RegistrationType
    team_size_min: int | None
    team_size_max: int | None
    prize_amount: Decimal | None
    venue: str | None
    start_time: datetime | None
    end_time: datetime | None
    description: str | None
    created_at: datetime
