from datetime import date
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class CertificateOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    certificate_code: str
    event: str
    stream: str
    participant_name: str
    role: str
    status: str
    issue_date: date
    pdf_url: str | None = None


class CertificateIssueRequest(BaseModel):
    user_id: UUID
    event_id: UUID
    role: str = "PARTICIPANT"
    pdf_url: str | None = None
