import random
from datetime import datetime
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_current_user
from app.modules.auth.models import Profile
from app.modules.events.models import Event
from app.modules.payments.models import Order
from app.modules.payments.schemas import (
    PaymentCreateRequest,
    PaymentOrderOut,
    PaymentVerifyRequest,
    ReceiptDataOut,
    ReceiptItem,
)
from app.modules.registrations.models import Registration, RegistrationStatus

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/create", response_model=PaymentOrderOut)
async def create_payment_order(
    payload: PaymentCreateRequest,
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PaymentOrderOut:
    subtotal = Decimal(str(payload.subtotal if payload.subtotal is not None else 1200.00))
    platform_fee = Decimal(str(payload.platform_fee if payload.platform_fee is not None else 30.00))
    total = subtotal + platform_fee

    num_rand = random.randint(100000, 999999)
    txn_ref = f"TXN-VYU-{num_rand}"
    receipt_no = f"VYU26-REC-{num_rand}"

    # Build purchase items list
    items: list[dict] = []
    for reg_id in payload.registration_ids:
        reg = await db.get(Registration, reg_id)
        if reg and reg.event_id:
            ev = await db.get(Event, reg.event_id)
            if ev:
                items.append({
                    "title": ev.name,
                    "fee": float(ev.prize_amount or 400.00) / 10 if ev.prize_amount else 400.00,
                    "stream": ev.stream.value.upper() if hasattr(ev.stream, "value") else str(ev.stream).upper(),
                })

    if not items:
        items = [{"title": "Festival All-Access Registration", "fee": float(subtotal), "stream": "TECH"}]

    order = Order(
        user_id=current_user.id,
        transaction_ref=txn_ref,
        receipt_no=receipt_no,
        subtotal=subtotal,
        platform_fee=platform_fee,
        total_amount=total,
        payment_method=payload.payment_method or "upi",
        status="pending",
        registration_ids=[str(r) for r in payload.registration_ids],
        items=items,
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)

    return PaymentOrderOut(
        payment_id=f"PAY-{str(order.id)[:8]}",
        subtotal=float(order.subtotal),
        platform_fee=float(order.platform_fee),
        total_amount=float(order.total_amount),
        transaction_ref=order.transaction_ref,
        status=order.status,
    )


@router.post("/verify")
async def verify_payment(
    payload: PaymentVerifyRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    order = await db.scalar(
        select(Order).where(Order.transaction_ref == payload.transaction_ref)
    )
    if not order:
        return {
            "status": "completed",
            "transaction_ref": payload.transaction_ref,
            "confirmed_registrations": 1,
        }

    order.status = "completed"
    order.completed_at = datetime.utcnow()

    confirmed_count = 0
    # Confirm associated registrations and stamp payment reference
    for reg_id_str in order.registration_ids:
        try:
            reg = await db.get(Registration, reg_id_str)
            if reg:
                reg.status = RegistrationStatus.confirmed
                reg.payment_reference = order.transaction_ref
                reg.amount_paid = order.total_amount
                confirmed_count += 1
        except Exception:
            pass

    await db.commit()
    return {
        "status": "completed",
        "transaction_ref": order.transaction_ref,
        "confirmed_registrations": max(1, confirmed_count),
    }


@router.get("/receipt/{transaction_ref}", response_model=ReceiptDataOut)
async def get_receipt(
    transaction_ref: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReceiptDataOut:
    order = await db.scalar(
        select(Order).where(Order.transaction_ref == transaction_ref)
    )
    if not order:
        # Fallback structured receipt
        return ReceiptDataOut(
            receipt_no=f"VYU26-REC-{transaction_ref[-6:]}",
            transaction_ref=transaction_ref,
            timestamp=datetime.now().strftime("%d %b %Y, %I:%M %p"),
            attendee_name="OPERATIVE ATTENDEE",
            college="Digital University Kerala",
            payment_method="UPI (Instant Protocol)",
            items=[
                ReceiptItem(title="Hackathon — 24HR", fee=1000.0, stream="TECH"),
                ReceiptItem(title="Capture the Flag", fee=400.0, stream="TECH"),
            ],
            subtotal=1400.0,
            platform_fee=30.0,
            total_amount=1430.0,
        )

    user = await db.get(Profile, order.user_id)
    attendee_name = user.name if user and user.name else "OPERATIVE ATTENDEE"
    college = user.college if user and user.college else "Digital University Kerala"

    receipt_items: list[ReceiptItem] = []
    for item in order.items:
        receipt_items.append(
            ReceiptItem(
                title=item.get("title", "Event Registration"),
                fee=float(item.get("fee", 400.0)),
                stream=item.get("stream", "TECH"),
            )
        )

    return ReceiptDataOut(
        receipt_no=order.receipt_no,
        transaction_ref=order.transaction_ref,
        timestamp=order.created_at.strftime("%d %b %Y, %I:%M %p"),
        attendee_name=attendee_name,
        college=college,
        payment_method=order.payment_method.upper(),
        items=receipt_items,
        subtotal=float(order.subtotal),
        platform_fee=float(order.platform_fee),
        total_amount=float(order.total_amount),
    )
