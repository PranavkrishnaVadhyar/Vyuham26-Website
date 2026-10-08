from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.modules.auxiliary.models import ContactInquiry, Feedback
from app.modules.auxiliary.schemas import ContactCreateRequest, FeedbackCreateRequest

router = APIRouter(tags=["auxiliary"])


@router.post("/contact")
async def submit_contact(
    payload: ContactCreateRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    inquiry = ContactInquiry(
        name=payload.name,
        organization=payload.organization,
        email=payload.email,
        phone=payload.phone,
        tier=payload.tier,
        message=payload.message,
    )
    db.add(inquiry)
    await db.commit()
    return {"ok": True, "message": "Inquiry recorded successfully."}


@router.post("/feedback")
async def submit_feedback(
    payload: FeedbackCreateRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    user_uuid = None
    if payload.user_id:
        try:
            user_uuid = UUID(payload.user_id)
        except Exception:
            pass

    fb = Feedback(
        user_id=user_uuid,
        rating=payload.rating,
        comments=payload.comments,
    )
    db.add(fb)
    await db.commit()
    return {"ok": True, "message": "Debrief submitted successfully."}
