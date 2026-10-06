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
    event_slug: Optional[str] = None
    user_id: UUID | None
    team_id: UUID | None
    ticket_code: Optional[str] = None
    checked_in: bool = False
    checked_in_at: Optional[datetime] = None
    amount_paid: Optional[float] = 0.0
    payment_reference: Optional[str] = None
    status: RegistrationStatus
    created_at: datetime



class RegistrationStatusUpdate(BaseModel):
    status: RegistrationStatus
