import json
from decimal import Decimal
from typing import Annotated
from uuid import UUID
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from app.core.config import settings
from app.core.db import get_db
from app.core.deps import require_role
from app.modules.admin.schemas import (
    AdminEventStats,
    AdminRegistrationListOut,
    AdminStatsCategory,
    AdminStatsResponse,
    AdminUserListOut,
    AdminUserStatusUpdate,
)
from app.modules.auth.models import Profile, UserRole
from app.modules.checkin.models import CheckIn
from app.modules.events.models import Event, EventStream
from app.modules.payments.models import Order
from app.modules.registrations.models import Registration

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=AdminUserListOut)
async def list_admin_users(
    _: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: Annotated[int, Query(ge=1, le=500)] = 100,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> dict:
    total = await db.scalar(select(func.count(Profile.id))) or 0
    records = (
        await db.scalars(
            select(Profile)
            .order_by(desc(Profile.created_at), Profile.email)
            .limit(limit)
            .offset(offset)
        )
    ).all()
    return {"items": records, "total": total, "limit": limit, "offset": offset}


def _set_supabase_ban(user_id: UUID, is_active: bool) -> None:
    service_key = settings.supabase_service_role_key
    if not service_key:
        raise HTTPException(status_code=503, detail="Supabase service role key is not configured")
    url = f"{settings.supabase_url.rstrip('/')}/auth/v1/admin/users/{user_id}"
    request = Request(
        url,
        data=json.dumps({"ban_duration": "none" if is_active else "876000h"}).encode(),
        headers={"apikey": service_key, "Authorization": f"Bearer {service_key}", "Content-Type": "application/json"},
        method="PUT",
    )
    try:
        with urlopen(request, timeout=12) as response:
            if response.status != 200:
                raise HTTPException(status_code=502, detail="Supabase account update failed")
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(status_code=502, detail=f"Supabase account update failed ({exc.code}): {detail[:300]}") from exc
    except (URLError, TimeoutError) as exc:
        raise HTTPException(status_code=502, detail="Could not reach Supabase Auth") from exc


@router.patch("/users/{user_id}/status")
async def update_admin_user_status(
    user_id: UUID,
    data: AdminUserStatusUpdate,
    current_admin: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    profile = await db.get(Profile, user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Participant account not found")
    if profile.id == current_admin.id:
        raise HTTPException(status_code=409, detail="You cannot deactivate your own administrator account")
    if profile.role == UserRole.admin:
        raise HTTPException(status_code=409, detail="Administrator accounts cannot be removed from this panel")
    if profile.is_active == data.is_active:
        return {"id": str(profile.id), "is_active": profile.is_active}

    await run_in_threadpool(_set_supabase_ban, profile.id, data.is_active)
    profile.is_active = data.is_active
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        try:
            await run_in_threadpool(_set_supabase_ban, profile.id, not data.is_active)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="Could not save participant account status") from exc
    return {"id": str(profile.id), "is_active": profile.is_active}


@router.get("/registrations", response_model=AdminRegistrationListOut)
async def list_admin_registrations(
    _: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: Annotated[int, Query(ge=1, le=500)] = 100,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> dict:
    total = await db.scalar(select(func.count(Registration.id))) or 0
    rows = (
        await db.execute(
            select(Registration, Event.slug, Event.name, Profile.email, Profile.name)
            .join(Event, Registration.event_id == Event.id)
            .outerjoin(Profile, Registration.user_id == Profile.id)
            .order_by(desc(Registration.created_at))
            .limit(limit)
            .offset(offset)
        )
    ).all()
    items = [
        {
            "id": registration.id,
            "event_id": registration.event_id,
            "event_slug": event_slug,
            "event_name": event_name,
            "user_id": registration.user_id,
            "user_email": user_email,
            "user_name": user_name,
            "team_id": registration.team_id,
            "status": registration.status,
            "ticket_code": registration.ticket_code,
            "checked_in": registration.checked_in,
            "amount_paid": registration.amount_paid,
            "created_at": registration.created_at,
        }
        for registration, event_slug, event_name, user_email, user_name in rows
    ]
    return {"items": items, "total": total, "limit": limit, "offset": offset}


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

    event_rows = (
        await db.execute(
            select(Event.id, Event.slug, Event.name, func.count(Registration.id))
            .outerjoin(Registration, Registration.event_id == Event.id)
            .group_by(Event.id, Event.slug, Event.name)
            .order_by(Event.name)
        )
    ).all()

    return AdminStatsResponse(
        all=all_cat,
        tech=categories["tech"],
        management=categories["management"],
        cultural=categories["cultural"],
        esports=categories["esports"],
        events=[
            AdminEventStats(event_id=event_id, event_slug=event_slug, event_name=event_name, total_registrations=count)
            for event_id, event_slug, event_name, count in event_rows
        ],
    )
