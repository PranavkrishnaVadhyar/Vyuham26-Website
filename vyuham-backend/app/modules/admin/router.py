from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import require_role
from app.modules.admin.schemas import AdminStatsCategory, AdminStatsResponse
from app.modules.auth.models import Profile
from app.modules.checkin.models import CheckIn
from app.modules.events.models import Event, EventStream
from app.modules.payments.models import Order
from app.modules.registrations.models import Registration

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(
    _: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AdminStatsResponse:
    # 1. Total counts across all events
    total_regs = await db.scalar(select(func.count(Registration.id))) or 0
    total_checkins = (
        await db.scalar(
            select(func.count(CheckIn.id)).where(CheckIn.status == "approved")
        )
        or 0
    )
    total_rev_decimal = (
        await db.scalar(
            select(func.coalesce(func.sum(Order.total_amount), Decimal("0.00"))).where(
                Order.status.in_(["paid", "completed", "success"])
            )
        )
        or Decimal("0.00")
    )
    total_revenue = int(total_rev_decimal)
    total_active_events = (
        await db.scalar(select(func.count(Event.id)).where(Event.status != "cancelled"))
        or 0
    )

    all_cat = AdminStatsCategory(
        total_registrations=total_regs,
        total_revenue=total_revenue,
        total_checkins=total_checkins,
        active_events=total_active_events,
    )

    # 2. Stream-wise metrics
    stream_map = {
        "tech": [EventStream.tech],
        "management": [EventStream.management],
        "cultural": [EventStream.culture],
        "esports": [EventStream.gaming],
    }

    categories: dict[str, AdminStatsCategory] = {}

    for cat_name, streams in stream_map.items():
        s_regs = (
            await db.scalar(
                select(func.count(Registration.id))
                .join(Event, Registration.event_id == Event.id)
                .where(Event.stream.in_(streams))
            )
            or 0
        )

        s_checkins = (
            await db.scalar(
                select(func.count(CheckIn.id))
                .join(Event, CheckIn.event_id == Event.id)
                .where(Event.stream.in_(streams), CheckIn.status == "approved")
            )
            or 0
        )

        s_events = (
            await db.scalar(
                select(func.count(Event.id)).where(
                    Event.stream.in_(streams), Event.status != "cancelled"
                )
            )
            or 0
        )

        s_rev = int(total_revenue * (s_regs / max(1, total_regs))) if total_regs > 0 else 0

        categories[cat_name] = AdminStatsCategory(
            total_registrations=s_regs,
            total_revenue=s_rev,
            total_checkins=s_checkins,
            active_events=s_events,
        )

    return AdminStatsResponse(
        all=all_cat,
        tech=categories["tech"],
        management=categories["management"],
        cultural=categories["cultural"],
        esports=categories["esports"],
    )
