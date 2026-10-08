from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.modules.checkin.models import CheckIn
from app.modules.checkin.schemas import (
    CheckInHistoryItem,
    CheckInScanRequest,
    CheckInScanResponse,
)
from app.modules.events.models import Event
from app.modules.registrations.models import Registration
from app.modules.auth.models import Profile

router = APIRouter(prefix="/checkin", tags=["checkin"])


@router.post("/scan", response_model=CheckInScanResponse)
async def scan_pass(
    payload: CheckInScanRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CheckInScanResponse:
    code = payload.ticket_code.strip().upper()
    now_str = datetime.now().strftime("%I:%M:%S %p")

    # Check for duplicate scan at the same station
    existing_scan = await db.scalar(
        select(CheckIn).where(
            CheckIn.ticket_code == code,
            CheckIn.station == payload.station,
            CheckIn.status == "approved",
        )
    )

    # Lookup registration
    reg = await db.scalar(
        select(Registration).where(Registration.ticket_code == code)
    )

    attendee_name = "OPERATIVE"
    college = "GUEST"
    event_name = "FESTIVAL ACCESS PASS"
    user_id = None
    event_id = None
    reg_id = None

    if reg is not None:
        reg_id = reg.id
        event_id = reg.event_id
        user_id = reg.user_id

        if user_id:
            user_profile = await db.get(Profile, user_id)
            if user_profile:
                attendee_name = user_profile.name or user_profile.email.split("@")[0].upper()
                college = user_profile.college or "Digital University Kerala"

        if event_id:
            event_obj = await db.get(Event, event_id)
            if event_obj:
                event_name = event_obj.name
    elif not (code.startswith("VYU26-") or code.startswith("EVT-") or code.startswith("TKT-") or len(code) >= 6):
        # Invalid ticket format
        invalid_rec = CheckIn(
            ticket_code=code,
            station=payload.station,
            scanned_by_name=payload.volunteer_name or "VOLUNTEER",
            status="invalid",
            notes="Unrecognized barcode sequence",
        )
        db.add(invalid_rec)
        await db.commit()
        return CheckInScanResponse(
            status="invalid",
            ticket_code=code,
            station=payload.station,
            scanned_at=now_str,
            notes="Invalid pass signature",
        )

    if existing_scan is not None:
        status_verdict = "duplicate"
    else:
        status_verdict = "approved"
        if reg:
            reg.checked_in = True
            reg.checked_in_at = datetime.utcnow()

    scan_record = CheckIn(
        ticket_code=code,
        registration_id=reg_id,
        event_id=event_id,
        user_id=user_id,
        station=payload.station,
        scanned_by_name=payload.volunteer_name or "GATE VOLUNTEER",
        status=status_verdict,
    )
    db.add(scan_record)
    await db.commit()

    return CheckInScanResponse(
        status=status_verdict,
        ticket_code=code,
        attendee_name=attendee_name,
        college=college,
        event_name=event_name,
        station=payload.station,
        scanned_at=now_str,
    )


@router.get("/history", response_model=list[CheckInHistoryItem])
async def get_checkin_history(
    station: Annotated[str | None, Query()] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> list[CheckInHistoryItem]:
    stmt = select(CheckIn).order_by(desc(CheckIn.scanned_at)).limit(limit)
    if station and station.lower() != "all":
        stmt = stmt.where(CheckIn.station == station)

    records = (await db.scalars(stmt)).all()
    results: list[CheckInHistoryItem] = []
    for r in records:
        results.append(
            CheckInHistoryItem(
                id=r.id,
                ticket_code=r.ticket_code,
                attendee_name=f"OPERATIVE {r.ticket_code[-4:]}",
                college="Digital University Kerala",
                event_name="FESTIVAL TICKET",
                station=r.station,
                scanned_by=r.scanned_by_name or "VOLUNTEER",
                status=r.status,
                scanned_at=r.scanned_at,
            )
        )
    return results
