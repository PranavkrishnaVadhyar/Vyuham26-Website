from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.modules.registrations.models import RegistrationStatus


class RegistrationCreate(BaseModel):
    event_id: UUID
    team_id: Optional[UUID] = None


class RegistrationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    event_id: UUID
    user_id: UUID | None
    team_id: UUID | None
    status: RegistrationStatus
    created_at: datetime


class RegistrationStatusUpdate(BaseModel):
    status: RegistrationStatus
