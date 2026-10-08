import enum
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, Enum, Integer, JSON, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class EventStream(str, enum.Enum):
    tech = "tech"
    culture = "culture"
    gaming = "gaming"
    impact = "impact"
    management = "management"


class RegistrationType(str, enum.Enum):
    solo = "solo"
    team = "team"


class Event(Base):
    __tablename__ = "events"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    stream: Mapped[EventStream] = mapped_column(Enum(EventStream, name="event_stream"), nullable=False)
    registration_type: Mapped[RegistrationType] = mapped_column(
        Enum(RegistrationType, name="registration_type"), nullable=False, default=RegistrationType.solo,
        server_default=RegistrationType.solo.value,
    )
    team_size_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    team_size_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    prize_amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    venue: Mapped[str | None] = mapped_column(String(250), nullable=True)
    fee: Mapped[str | None] = mapped_column(String(80), nullable=True)
    day: Mapped[int | None] = mapped_column(Integer, nullable=True)
    time: Mapped[str | None] = mapped_column(String(100), nullable=True)
    rules: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    eligibility: Mapped[str | None] = mapped_column(String(200), nullable=True)
    seats_total: Mapped[int | None] = mapped_column(Integer, nullable=True)
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    status: Mapped[str] = mapped_column(String(50), default="open", server_default="open")
    blurb: Mapped[str | None] = mapped_column(String(500), nullable=True)
    start_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    registration_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    makemypass_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
