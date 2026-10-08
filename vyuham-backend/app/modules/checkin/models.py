from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, Index, String, Text, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class CheckIn(Base):
    __tablename__ = "checkins"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    ticket_code: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    registration_id: Mapped[UUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("registrations.id", ondelete="SET NULL"), nullable=True)
    event_id: Mapped[UUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("events.id", ondelete="SET NULL"), nullable=True)
    user_id: Mapped[UUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    station: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    scanned_by: Mapped[UUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    scanned_by_name: Mapped[str | None] = mapped_column(String(160), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="approved", server_default="approved", nullable=False)
    scanned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
