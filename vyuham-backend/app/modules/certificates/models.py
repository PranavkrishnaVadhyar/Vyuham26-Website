from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    certificate_code: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), index=True, nullable=False)
    event_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[str] = mapped_column(String(100), default="PARTICIPANT", server_default="PARTICIPANT", nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="ISSUED & VERIFIED", server_default="ISSUED & VERIFIED", nullable=False)
    issue_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    pdf_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
