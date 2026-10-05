from starlette.testclient import TestClient
from app.main import app
from app.core.config import settings

def test_phase1():
    print("--- 1.1 CORS Check ---")
    print("Allowed origins:", settings.allowed_frontend_origins)
    assert "http://localhost:5173" in settings.allowed_frontend_origins
    assert "http://127.0.0.1:5173" in settings.allowed_frontend_origins

    with TestClient(app) as client:
        print("\n--- 1.3 Events API Check ---")
        res = client.get("/events")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        events = res.json()
        print(f"Total events returned: {len(events)}")
        assert len(events) >= 21, f"Expected at least 21 events, got {len(events)}"

        first = events[0]
        print(f"Sample Event: {first['name']} (slug: {first['slug']}, stream: {first['stream']}, day: {first['day']})")
        assert "slug" in first
        assert "title" in first
        assert "teamSize" in first
        assert "rules" in first
        assert "fee" in first

        # Test by-slug lookup
        slug = first["slug"]
        slug_res = client.get(f"/events/by-slug/{slug}")
        assert slug_res.status_code == 200
        print(f"By-slug lookup for '{slug}' succeeded: {slug_res.json()['name']}")

        # Test OpenAPI schema
        docs_res = client.get("/openapi.json")
        assert docs_res.status_code == 200
        print("OpenAPI schema verified successfully.")

        # Test CORS headers on preflight
        cors_res = client.options(
            "/events",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Authorization,Content-Type",
            },
        )
        print("CORS preflight status:", cors_res.status_code)
        print("Access-Control-Allow-Origin:", cors_res.headers.get("access-control-allow-origin"))
        assert cors_res.headers.get("access-control-allow-origin") == "http://localhost:5173"

        print("\n--- 1.2 User Profile Schema Check ---")
        from uuid import uuid4
        from app.modules.auth.schemas import ProfileOut, ProfileUpdate
        from app.modules.auth.models import UserRole

        test_uuid = uuid4()
        p = ProfileOut(
            id=test_uuid,
            email="operative@vyuham.in",
            name="Aromal S S",
            phone="+91 98470 12345",
            college="Digital University Kerala",
            degree="M.Tech Cyber Security",
            year="2024–2026",
            role=UserRole.participant,
        )
        p_dump = p.model_dump()
        print("Profile dump:", p_dump)
        assert p_dump["degree"] == "M.Tech Cyber Security"
        assert p_dump["year"] == "2024–2026"
        assert p_dump["vyuham_id"].startswith("VYU26-OPER-")
        assert p_dump["role"] == "user"  # Serializes participant -> user for frontend

        update = ProfileUpdate(degree="B.Tech CS", year="2022-2026")
        assert update.degree == "B.Tech CS"
        print("Profile schema verification succeeded.")

    print("\n[SUCCESS] ALL PHASE 1 CHECKS PASSED!")

if __name__ == "__main__":
    test_phase1()
