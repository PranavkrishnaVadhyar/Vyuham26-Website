import enum
from datetime import datetime
from uuid import UUID, uuid4

from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, Numeric, String, func, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class RegistrationStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"


class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (
        # Null team IDs are solo registrations; a team submission is unique per event/team.
        Index(
            "uq_registrations_solo_event_user",
            "event_id",
            "user_id",
            unique=True,
            postgresql_where=text("team_id IS NULL"),
        ),
        Index(
            "uq_registrations_team_event",
            "event_id",
            "team_id",
            unique=True,
            postgresql_where=text("team_id IS NOT NULL"),
        ),
    )

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    event_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[UUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True, index=True)
    team_id: Mapped[UUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=True, index=True)
    ticket_code: Mapped[str | None] = mapped_column(String(64), unique=True, index=True, nullable=True)
    checked_in: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    checked_in_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    amount_paid: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), server_default="0.00")
    payment_reference: Mapped[str | None] = mapped_column(String(120), nullable=True)
    status: Mapped[RegistrationStatus] = mapped_column(
        Enum(RegistrationStatus, name="registration_status"), nullable=False,
        default=RegistrationStatus.pending, server_default=RegistrationStatus.pending.value,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
