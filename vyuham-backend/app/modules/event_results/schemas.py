from uuid import UUID
from pydantic import BaseModel, Field


class EventResultCreate(BaseModel):
    first_place: str = Field(min_length=1, max_length=200)
    second_place: str = Field(min_length=1, max_length=200)
    third_place: str | None = Field(default=None, max_length=200)
    prize_distributed: str | None = Field(default=None, max_length=100)


class EventResultOut(BaseModel):
    event_id: str
    event_name: str
    stream: str
    first_place: str
    second_place: str
    third_place: str | None = None
    prize_distributed: str | None = None
    published_at: str
