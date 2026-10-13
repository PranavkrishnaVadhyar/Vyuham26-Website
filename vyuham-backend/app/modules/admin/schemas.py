from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.modules.auth.models import UserRole
from app.modules.registrations.models import RegistrationStatus


class AdminStatsCategory(BaseModel):
    total_registrations: int
    total_revenue: int
    total_checkins: int
    active_events: int


class AdminEventStats(BaseModel):
    event_id: UUID
    event_slug: str
    event_name: str
    total_registrations: int


class AdminStatsResponse(BaseModel):
    all: AdminStatsCategory
    tech: AdminStatsCategory
    management: AdminStatsCategory
    cultural: AdminStatsCategory
    esports: AdminStatsCategory
    events: list[AdminEventStats] = Field(default_factory=list)


class AdminUserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    name: str | None
    phone: str | None
    college: str | None
    degree: str | None
    year: str | None
    station: str | None
    role: UserRole
    is_active: bool
    created_at: datetime


class AdminUserStatusUpdate(BaseModel):
    is_active: bool


class AdminUserListOut(BaseModel):
    items: list[AdminUserOut]
    total: int
    limit: int
    offset: int


class AdminRegistrationOut(BaseModel):
    id: UUID
    event_id: UUID
    event_slug: str
    event_name: str
    user_id: UUID | None
    user_email: str | None
    user_name: str | None
    team_id: UUID | None
    status: RegistrationStatus
    ticket_code: str | None
    checked_in: bool
    amount_paid: float
    created_at: datetime


class AdminRegistrationListOut(BaseModel):
    items: list[AdminRegistrationOut]
    total: int
    limit: int
    offset: int
