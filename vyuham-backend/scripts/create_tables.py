import asyncio

from app.core.db import Base, engine
from app.modules.auth import models as auth_models  # noqa: F401
from app.modules.events import models as event_models  # noqa: F401
from app.modules.teams import models as team_models  # noqa: F401
from app.modules.registrations import models as registration_models  # noqa: F401


async def main() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
