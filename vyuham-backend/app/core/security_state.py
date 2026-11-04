"""Database-backed authentication session and request-throttle state."""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, Request, status
from sqlalchemy import DateTime, Integer, String, delete, or_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base, SessionFactory


class ActiveAuthSession(Base):
    __tablename__ = "security_active_sessions"

    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True)
    session_id: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    auth_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class RevokedAuthSession(Base):
    __tablename__ = "security_revoked_sessions"

    session_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class RateLimitBucket(Base):
    __tablename__ = "security_rate_limit_buckets"

    bucket_key: Mapped[str] = mapped_column(String(512), primary_key=True)
    hit_count: Mapped[int] = mapped_column(Integer, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)


async def register_session(user_id: UUID, claims: dict) -> None:
    """Enforce one current participant session; newer logins replace older ones."""
    sid = claims.get("session_id")
    exp = claims.get("exp")
    auth_time = claims.get("auth_time", claims.get("iat"))
    if not isinstance(sid, str) or not sid or not isinstance(exp, (int, float)) or not isinstance(auth_time, (int, float)):
        raise HTTPException(status_code=401, detail="Authentication session is invalid")

    issued = datetime.fromtimestamp(auth_time, timezone.utc)
    expiry = datetime.fromtimestamp(exp, timezone.utc)
    async with SessionFactory() as db:
        await db.execute(delete(RevokedAuthSession).where(RevokedAuthSession.expires_at < issued))
        if await db.scalar(select(RevokedAuthSession.session_id).where(RevokedAuthSession.session_id == sid)):
            raise HTTPException(status_code=401, detail="Session has been revoked")
        stmt = insert(ActiveAuthSession).values(
            user_id=user_id, session_id=sid, auth_time=issued, expires_at=expiry
        )
        stmt = stmt.on_conflict_do_update(
            index_elements=[ActiveAuthSession.user_id],
            set_={
                "session_id": stmt.excluded.session_id,
                "auth_time": stmt.excluded.auth_time,
                "expires_at": stmt.excluded.expires_at,
            },
            where=or_(
                ActiveAuthSession.session_id == stmt.excluded.session_id,
                ActiveAuthSession.auth_time <= stmt.excluded.auth_time,
            ),
        ).returning(ActiveAuthSession.session_id)
        accepted_sid = await db.scalar(stmt)
        if accepted_sid != sid:
            await db.rollback()
            raise HTTPException(status_code=401, detail="This session was replaced by a newer login")
        await db.commit()


async def validate_active_session(user_id: UUID, claims: dict) -> None:
    sid = claims.get("session_id")
    if not isinstance(sid, str) or not sid:
        raise HTTPException(status_code=401, detail="Authentication session is invalid")
    async with SessionFactory() as db:
        active = await db.get(ActiveAuthSession, user_id)
    if active is None:
        # One-time adoption for accounts already signed in during rollout.
        await register_session(user_id, claims)
    elif active.session_id != sid:
        raise HTTPException(status_code=401, detail="This session was replaced by a newer login")


async def reject_revoked_session(claims: dict) -> None:
    sid = claims.get("session_id")
    if not isinstance(sid, str) or not sid:
        raise HTTPException(status_code=401, detail="Authentication session is invalid")
    async with SessionFactory() as db:
        revoked = await db.scalar(
            select(RevokedAuthSession.session_id).where(
                RevokedAuthSession.session_id == sid,
                RevokedAuthSession.expires_at > datetime.now(timezone.utc),
            )
        )
    if revoked:
        raise HTTPException(status_code=401, detail="Session has been revoked")


async def revoke_session(user_id: UUID, claims: dict) -> None:
    sid, exp = claims.get("session_id"), claims.get("exp")
    if not isinstance(sid, str) or not isinstance(exp, (int, float)):
        return
    async with SessionFactory() as db:
        active = await db.get(ActiveAuthSession, user_id)
        if active and active.session_id == sid:
            await db.delete(active)
        await db.execute(delete(RevokedAuthSession).where(RevokedAuthSession.expires_at < datetime.now(timezone.utc)))
        db.add(RevokedAuthSession(session_id=sid, expires_at=datetime.fromtimestamp(exp, timezone.utc)))
        await db.commit()


async def enforce_rate_limit(
    request: Request, *, scope: str, limit: int, window_seconds: int, identity: str | None = None
) -> None:
    """Atomic fixed-window limiter shared across API workers via PostgreSQL."""
    ip = request.client.host if request.client else "unknown"
    now_epoch = int(datetime.now(timezone.utc).timestamp())
    window = now_epoch // window_seconds
    expires = datetime.fromtimestamp((window + 1) * window_seconds, timezone.utc)
    keys = [f"{scope}:ip:{ip}:{window}"]
    if identity:
        keys.append(f"{scope}:account:{identity}:{window}")
    async with SessionFactory() as db:
        counts = []
        for key in keys:
            stmt = insert(RateLimitBucket).values(bucket_key=key, hit_count=1, expires_at=expires)
            stmt = stmt.on_conflict_do_update(
                index_elements=[RateLimitBucket.bucket_key],
                set_={"hit_count": RateLimitBucket.hit_count + 1},
            ).returning(RateLimitBucket.hit_count)
            counts.append(await db.scalar(stmt))
        await db.execute(delete(RateLimitBucket).where(RateLimitBucket.expires_at < datetime.now(timezone.utc)))
        await db.commit()
    if any(count and count > limit for count in counts):
        retry_after = max(1, int(expires.timestamp()) - now_epoch)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )
