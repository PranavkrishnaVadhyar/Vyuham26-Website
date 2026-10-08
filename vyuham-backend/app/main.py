from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.db import engine
from app.core.exceptions import register_exception_handlers
from app.core.site_settings import ensure_site_settings_table

from app.modules.auth.router import router as auth_router
from app.modules.events.router import router as events_router
from app.modules.teams.router import router as teams_router
from app.modules.registrations.router import router as registrations_router
from app.modules.hackathon.router import router as hackathon_router
from app.modules.ctf.router import router as ctf_router
from app.modules.announcements.router import router as announcements_router
from app.modules.checkin.router import router as checkin_router
from app.modules.payments.router import router as payments_router
from app.modules.event_results.router import router as event_results_router
from app.modules.certificates.router import router as certificates_router
from app.modules.auxiliary.router import router as auxiliary_router
from app.modules.admin.router import router as admin_ops_router

from app.admin import configure_admin


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Registration gateway configuration lives in the
    # site_settings table. Make sure it exists before
    # serving traffic.
    await ensure_site_settings_table(engine)

    yield

    # Cleanly dispose database connections when the
    # application shuts down.
    await engine.dispose()


app = FastAPI(
    title="Vyuham '26 API",
    version="0.1.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Exception Handlers
# ---------------------------------------------------------------------------

register_exception_handlers(app)


# ---------------------------------------------------------------------------
# Health / Root Endpoints
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
async def root():
    """
    API root endpoint.

    Returns basic information about the API.
    """
    return {
        "status": "online",
        "service": "Vyuham '26 API",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health():
    """
    Health-check endpoint.

    Used by deployment platforms, monitoring systems,
    load balancers, and audit scripts to verify that
    the API process is running.
    """
    return {
        "status": "ok",
        "service": "Vyuham '26 API",
        "version": "0.1.0",
    }


# ---------------------------------------------------------------------------
# API Routers
# ---------------------------------------------------------------------------

app.include_router(auth_router)

app.include_router(event_results_router)

app.include_router(events_router)

app.include_router(teams_router)

app.include_router(registrations_router)

app.include_router(payments_router)

app.include_router(checkin_router)

app.include_router(certificates_router)

app.include_router(hackathon_router)

app.include_router(ctf_router)

app.include_router(announcements_router)

app.include_router(auxiliary_router)

app.include_router(admin_ops_router)


# ---------------------------------------------------------------------------
# Admin
# ---------------------------------------------------------------------------

configure_admin(app)