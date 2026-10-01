from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.core.db import engine
from app.core.exceptions import register_exception_handlers
from app.modules.auth.router import router as auth_router
from app.modules.events.router import router as events_router
from app.modules.teams.router import router as teams_router
from app.modules.registrations.router import router as registrations_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await engine.dispose()


app = FastAPI(title="Vyuham '26 API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_exception_handlers(app)
app.include_router(auth_router)
app.include_router(events_router)
app.include_router(teams_router)
app.include_router(registrations_router)
