"""Persistent site settings stored in the database.

The registration gateway state used to live only in a process-global variable,
so an admin closing registration lost that decision on every restart/deploy
(and with multiple uvicorn workers the workers could disagree). The source of
truth is now a small ``site_settings`` key/value table. The in-process value
remains as a fast cache and as the last-resort fallback when the row has never
been set (initial default still comes from ``REG_OPEN`` / site config).
"""

import logging

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

from app.core.config import is_registration_open, set_runtime_registration_open

logger = logging.getLogger(__name__)

REG_OPEN_KEY = "registration_open"

CREATE_TABLE_SQL = """
create table if not exists site_settings (
    key text primary key,
    value text not null,
    updated_at timestamptz not null default now()
)
"""


async def ensure_site_settings_table(engine: AsyncEngine) -> None:
    """Idempotent bootstrap; never blocks application startup."""
    try:
        async with engine.begin() as conn:
            await conn.execute(text(CREATE_TABLE_SQL))
    except Exception as exc:  # pragma: no cover - startup resilience
        logger.warning(
            "Could not ensure site_settings table (%s); registration config "
            "will fall back to environment defaults",
            type(exc).__name__,
        )


async def get_registration_open(db: AsyncSession) -> bool:
    """Authoritative registration gateway state.

    Order: database row (admin override) -> runtime cache -> env/site config
    -> default open. Falls back gracefully if the table does not exist yet.
    """
    try:
        result = await db.execute(
            text("select value from site_settings where key = :key"),
            {"key": REG_OPEN_KEY},
        )
        row = result.first()
    except Exception:
        row = None
    if row is not None:
        value = str(row[0]).strip().lower() == "true"
        set_runtime_registration_open(value)
        return value
    return is_registration_open()


async def set_registration_open(db: AsyncSession, value: bool) -> None:
    """Persist the admin's registration gateway decision."""
    await db.execute(
        text(
            "insert into site_settings (key, value) values (:key, :value) "
            "on conflict (key) do update set value = excluded.value, "
            "updated_at = now()"
        ),
        {"key": REG_OPEN_KEY, "value": "true" if value else "false"},
    )
    await db.commit()
    set_runtime_registration_open(value)
