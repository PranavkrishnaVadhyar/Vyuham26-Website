from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class AnnouncementCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    content: str = Field(min_length=1, max_length=5000)
    category: str = Field(default="TRANSMISSION", max_length=60)
    urgent: bool = False
    stream: str = Field(default="GENERAL", max_length=60)
    pinned: bool = False


class AnnouncementUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=150)
    content: Optional[str] = Field(default=None, min_length=1, max_length=5000)
    category: Optional[str] = Field(default=None, max_length=60)
    urgent: Optional[bool] = None
    stream: Optional[str] = Field(default=None, max_length=60)
    pinned: Optional[bool] = None


class AnnouncementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    content: str
    category: str
    urgent: bool
    stream: str
    pinned: bool
    created_at: datetime
