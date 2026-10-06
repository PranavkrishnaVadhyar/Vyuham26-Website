import secrets
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_current_user, require_role
from app.modules.auth.models import Profile
from app.modules.certificates.models import Certificate
from app.modules.certificates.schemas import CertificateIssueRequest, CertificateOut
from app.modules.events.models import Event

router = APIRouter(prefix="/certificates", tags=["certificates"])


@router.get("/verify/{code}", response_model=CertificateOut)
async def verify_certificate(
    code: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CertificateOut:
    cert = await db.scalar(
        select(Certificate).where(Certificate.certificate_code == code.strip().upper())
    )
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate could not be verified or not found in registry",
        )

    user = await db.get(Profile, cert.user_id)
    ev = await db.get(Event, cert.event_id)

    user_name = user.name if user and user.name else "OPERATIVE"
    ev_name = ev.name if ev else "FESTIVAL EVENT"
    ev_stream = ev.stream.value if ev and hasattr(ev.stream, "value") else "TECH"

    return CertificateOut(
        id=cert.id,
        certificate_code=cert.certificate_code,
        event=ev_name,
        stream=str(ev_stream).upper(),
        participant_name=user_name,
        role=cert.role,
        status=cert.status,
        issue_date=cert.issue_date,
        pdf_url=cert.pdf_url,
    )


@router.get("/me", response_model=list[CertificateOut])
async def list_my_certificates(
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[CertificateOut]:
    certs = (
        await db.scalars(
            select(Certificate).where(Certificate.user_id == current_user.id)
        )
    ).all()

    output: list[CertificateOut] = []
    for c in certs:
        ev = await db.get(Event, c.event_id)
        ev_name = ev.name if ev else "FESTIVAL EVENT"
        ev_stream = ev.stream.value if ev and hasattr(ev.stream, "value") else "TECH"
        output.append(
            CertificateOut(
                id=c.id,
                certificate_code=c.certificate_code,
                event=ev_name,
                stream=str(ev_stream).upper(),
                participant_name=current_user.name or "OPERATIVE",
                role=c.role,
                status=c.status,
                issue_date=c.issue_date,
                pdf_url=c.pdf_url,
            )
        )
    return output


@router.post("/issue", response_model=CertificateOut)
async def issue_certificate(
    payload: CertificateIssueRequest,
    current_admin: Annotated[Profile, Depends(require_role("admin"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CertificateOut:
    user = await db.get(Profile, payload.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    ev = await db.get(Event, payload.event_id)
    if not ev:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    code = f"CERT-VYU-{secrets.token_hex(3).upper()}"
    cert = Certificate(
        certificate_code=code,
        user_id=payload.user_id,
        event_id=payload.event_id,
        role=payload.role,
        status="ISSUED & VERIFIED",
        pdf_url=payload.pdf_url,
    )
    db.add(cert)
    await db.commit()
    await db.refresh(cert)

    ev_stream = ev.stream.value if hasattr(ev.stream, "value") else str(ev.stream)
    return CertificateOut(
        id=cert.id,
        certificate_code=cert.certificate_code,
        event=ev.name,
        stream=str(ev_stream).upper(),
        participant_name=user.name or "OPERATIVE",
        role=cert.role,
        status=cert.status,
        issue_date=cert.issue_date,
        pdf_url=cert.pdf_url,
    )
