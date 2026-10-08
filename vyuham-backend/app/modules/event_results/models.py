from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class EventResult(Base):
    __tablename__ = "event_results"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    event_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    first_place: Mapped[str] = mapped_column(String(200), nullable=False)
    second_place: Mapped[str] = mapped_column(String(200), nullable=False)
    third_place: Mapped[str | None] = mapped_column(String(200), nullable=True)
    prize_distributed: Mapped[str | None] = mapped_column(String(100), nullable=True)
    published_by: Mapped[UUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
