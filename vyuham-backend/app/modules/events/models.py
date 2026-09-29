import enum
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class EventStream(str, enum.Enum):
    tech = "tech"
    management = "management"
    cultural = "cultural"
    esports = "esports"


class RegistrationType(str, enum.Enum):
    solo = "solo"
    team = "team"


class Event(Base):
    __tablename__ = "events"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    stream: Mapped[EventStream] = mapped_column(Enum(EventStream, name="event_stream"), nullable=False)
    registration_type: Mapped[RegistrationType] = mapped_column(
        Enum(RegistrationType, name="registration_type"), nullable=False
    )
    team_size_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    team_size_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    prize_amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    venue: Mapped[str | None] = mapped_column(String(250), nullable=True)
    start_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
