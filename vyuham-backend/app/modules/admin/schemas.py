from pydantic import BaseModel


class AdminStatsCategory(BaseModel):
    total_registrations: int
    total_revenue: int
    total_checkins: int
    active_events: int


class AdminStatsResponse(BaseModel):
    all: AdminStatsCategory
    tech: AdminStatsCategory
    management: AdminStatsCategory
    cultural: AdminStatsCategory
    esports: AdminStatsCategory
