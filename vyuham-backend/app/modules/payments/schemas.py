from uuid import UUID
from pydantic import BaseModel, Field


class PaymentCreateRequest(BaseModel):
    registration_ids: list[UUID] = Field(default_factory=list)
    payment_method: str = Field(default="upi")
    subtotal: float | None = None
    platform_fee: float | None = None


class PaymentOrderOut(BaseModel):
    payment_id: str
    subtotal: float
    platform_fee: float
    total_amount: float
    transaction_ref: str
    status: str


class PaymentVerifyRequest(BaseModel):
    transaction_ref: str


class ReceiptItem(BaseModel):
    title: str
    fee: float
    stream: str = "TECH"


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
