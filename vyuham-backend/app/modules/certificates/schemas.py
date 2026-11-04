from datetime import date
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field, field_validator
from urllib.parse import urlsplit


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
    role: str = Field(default="PARTICIPANT", max_length=40)
    pdf_url: str | None = Field(default=None, max_length=1000)

    @field_validator("pdf_url")
    @classmethod
    def validate_pdf_url(cls, value: str | None) -> str | None:
        if value is None:
            return value
        parsed = urlsplit(value)
        if parsed.scheme != "https" or not parsed.netloc or parsed.username or parsed.password:
            raise ValueError("PDF URL must be a valid HTTPS URL")
        return value
