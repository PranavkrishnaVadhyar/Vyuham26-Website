from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine = create_async_engine(
    settings.async_database_url,
    pool_pre_ping=True,
    # Supabase (session mode) rejects connections beyond its own client cap
    # (15) with EMXCONNSESSION — under bursts the app used to open up to 15
    # and blow the shared limit (other processes share it too), producing 500s.
    # Keep our ceiling comfortably below it and queue (bounded by pool_timeout)
    # instead of failing: 5 + 3 = 8 max connections per process.
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow,
    pool_timeout=30,
    pool_recycle=3600,
    connect_args={"statement_cache_size": 0},
)
SessionFactory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncSession:
    async with SessionFactory() as session:
        yield session
