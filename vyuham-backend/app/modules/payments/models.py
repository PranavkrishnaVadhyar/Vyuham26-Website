from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    transaction_ref: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    receipt_no: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    platform_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    total_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), default="upi", server_default="upi", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", server_default="pending", nullable=False)
    registration_ids: Mapped[list[str]] = mapped_column(JSONB, default=list, server_default="[]")
    items: Mapped[list[dict]] = mapped_column(JSONB, default=list, server_default="[]")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
