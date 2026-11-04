from starlette.testclient import TestClient
import pytest
import asyncio
import sys

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from app.core.config import Settings, settings
from app.main import app
from app.modules.auxiliary.schemas import ContactCreateRequest, FeedbackCreateRequest
from app.modules.auth.schemas import ProfileUpdate
from app.modules.events.schemas import EventCreate
from app.modules.announcements.schemas import AnnouncementCreate
from pydantic import ValidationError


def test_security_headers_are_present_on_api_responses():
    response = TestClient(app).get("/health")
    assert response.status_code == 200
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["referrer-policy"] == "strict-origin-when-cross-origin"
    assert response.headers["cross-origin-opener-policy"] == "same-origin"
    assert "frame-ancestors 'none'" in response.headers["content-security-policy"]


def test_cors_allows_configured_origin_without_credentials():
    origin = settings.allowed_frontend_origins[0]
    response = TestClient(app).options(
        "/health",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization,content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin
    assert "access-control-allow-credentials" not in response.headers
    assert "*" not in response.headers["access-control-allow-methods"]


def test_cors_rejects_untrusted_and_wildcard_origins():
    response = TestClient(app).options(
        "/health",
        headers={
            "Origin": "https://attacker.invalid",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers

    parsed = Settings(
        database_url="postgresql://localhost/db",
        supabase_url="https://auth.example.test",
        supabase_jwt_secret="test-only",
        supabase_service_role_key="test-only",
        frontend_origins="https://good.example.test,https://*.example.test,*",
    )
    assert parsed.allowed_frontend_origins == ["https://good.example.test"]


def test_contact_and_feedback_messages_have_server_side_limits():
    with pytest.raises(ValidationError):
        ContactCreateRequest(name="A", email="a@example.com", message="x" * 3001)
    with pytest.raises(ValidationError):
        FeedbackCreateRequest(rating=5, comments="x" * 3001)


def test_new_schema_caps_and_url_scheme_validation():
    with pytest.raises(ValidationError):
        AnnouncementCreate(title="x" * 151, content="ok")
    with pytest.raises(ValidationError):
        EventCreate(name="Event", slug="event", stream="tech", registration_url="javascript:alert(1)")
    with pytest.raises(ValidationError):
        ProfileUpdate(avatar_url="data:text/html,not-an-image")


def test_request_body_size_is_bounded():
    response = TestClient(app).post("/health", content=b"x" * (1_048_577))
    assert response.status_code == 413
