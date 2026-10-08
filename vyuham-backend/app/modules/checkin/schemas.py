from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class CheckInScanRequest(BaseModel):
    ticket_code: str = Field(min_length=3, max_length=64)
    station: str = Field(min_length=1, max_length=120)
    volunteer_name: str | None = Field(default=None, max_length=160)


class CheckInScanResponse(BaseModel):
    status: str
    ticket_code: str
    attendee_name: str | None = None
    college: str | None = None
    event_name: str | None = None
    station: str
    scanned_at: str
    notes: str | None = None


class CheckInHistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    ticket_code: str
    attendee_name: str = "ATTENDEE"
    college: str = "GUEST"
    event_name: str = "FESTIVAL PASS"
    station: str
    scanned_by: str = "VOLUNTEER"
    status: str
    scanned_at: datetime
