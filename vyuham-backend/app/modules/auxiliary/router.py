from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_verified_user_id
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
    verified_user_id: Annotated[UUID | None, Depends(get_verified_user_id)],
) -> dict:
    # Attribution comes ONLY from a verified bearer token. The client-supplied
    # payload.user_id field is intentionally ignored so feedback cannot be
    # attributed to arbitrary users.
    fb = Feedback(
        user_id=verified_user_id,
        rating=payload.rating,
        comments=payload.comments,
    )
    db.add(fb)
    await db.commit()
    return {"ok": True, "message": "Debrief submitted successfully."}
