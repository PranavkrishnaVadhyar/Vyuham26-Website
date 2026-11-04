from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class PaymentCreateRequest(BaseModel):
    model_config = ConfigDict(allow_inf_nan=False)
    registration_ids: list[UUID] = Field(default_factory=list, max_length=20)
    payment_method: str = Field(default="upi", min_length=1, max_length=30)
    subtotal: float | None = Field(default=None, ge=0, le=1_000_000)
    platform_fee: float | None = Field(default=None, ge=0, le=100_000)


class PaymentOrderOut(BaseModel):
    payment_id: str
    subtotal: float
    platform_fee: float
    total_amount: float
    transaction_ref: str = Field(min_length=1, max_length=200)
    status: str


class PaymentVerifyRequest(BaseModel):
    transaction_ref: str = Field(min_length=1, max_length=200)


class ReceiptItem(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    fee: float
    stream: str = Field(default="TECH", max_length=60)


class ReceiptDataOut(BaseModel):
    receipt_no: str
    transaction_ref: str
    timestamp: str
    attendee_name: str
    college: str
    payment_method: str
    items: list[ReceiptItem]
    subtotal: float
    platform_fee: float
    total_amount: float
