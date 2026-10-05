from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class AnnouncementCreate(BaseModel):
    title: str
    content: str
    category: str = "TRANSMISSION"
    urgent: bool = False
    stream: str = "GENERAL"
    pinned: bool = False


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
