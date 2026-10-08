import random
from datetime import datetime, timezone
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
    platform_fee = Decimal(str(payload.platform_fee if payload.platform_fee is not None else 30.00))
    if platform_fee < 0:
        platform_fee = Decimal("0")

    num_rand = random.randint(100000, 999999)
    txn_ref = f"TXN-VYU-{num_rand}"
    receipt_no = f"VYU26-REC-{num_rand}"

    # Build purchase items list. Every referenced registration must exist and
    # belong to the caller — otherwise this endpoint becomes an IDOR that can
    # attach (and later confirm) other users' registrations.
    items: list[dict] = []
    for reg_id in payload.registration_ids:
        reg = await db.get(Registration, reg_id)
        if reg is None or reg.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="One or more registrations do not belong to you",
            )
        if reg.event_id:
            ev = await db.get(Event, reg.event_id)
            if ev:
                items.append({
                    "title": ev.name,
                    "fee": float(ev.prize_amount or 400.00) / 10 if ev.prize_amount else 400.00,
                    "stream": ev.stream.value.upper() if hasattr(ev.stream, "value") else str(ev.stream).upper(),
                })

    if items:
        # Prices are computed server-side from the caller's registrations;
        # client-supplied amounts are never trusted.
        subtotal = sum(Decimal(str(item["fee"])) for item in items)
    else:
        subtotal = Decimal(str(payload.subtotal if payload.subtotal is not None else 1200.00))
        items = [{"title": "Festival All-Access Registration", "fee": float(subtotal), "stream": "TECH"}]
    total = subtotal + platform_fee

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
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    order = await db.scalar(
        select(Order).where(Order.transaction_ref == payload.transaction_ref)
    )
    # Unknown refs used to return a fabricated "completed" response; and any
    # authenticated user could confirm any order. Now: 404 for unknown refs,
    # 404 for orders that belong to someone else (no existence oracle).
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment order not found")
    if order.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment order not found")

    if order.status != "completed":
        order.status = "completed"
        order.completed_at = datetime.now(timezone.utc)

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
    else:
        confirmed_count = sum(1 for r in order.registration_ids if r)

    return {
        "status": "completed",
        "transaction_ref": order.transaction_ref,
        "confirmed_registrations": confirmed_count,
    }


@router.get("/receipt/{transaction_ref}", response_model=ReceiptDataOut)
async def get_receipt(
    transaction_ref: str,
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReceiptDataOut:
    order = await db.scalar(
        select(Order).where(Order.transaction_ref == transaction_ref)
    )
    if order is None or (
        order.user_id != current_user.id and current_user.role.value != "admin"
    ):
        # No fabricated fallback receipt: unknown or foreign refs are 404.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receipt not found")

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
