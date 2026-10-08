from decimal import Decimal
from uuid import uuid4

import pytest
from app.modules.events.models import EventStream, RegistrationType
from app.modules.events.schemas import EventCreate, EventOut, EventUpdate


def test_event_schemas_makemypass_url():
    create_payload = EventCreate(
        name="Agentic AI Hackathon",
        slug="agentic-hackathon",
        stream=EventStream.tech,
        registration_type=RegistrationType.team,
        team_size_min=2,
        team_size_max=4,
        prize_amount=Decimal("50000"),
        registration_url="https://makemypass.com/event/vyuham26-agentic-hackathon",
        makemypass_url="https://makemypass.com/event/vyuham26-agentic-hackathon",
    )
    assert create_payload.registration_url == "https://makemypass.com/event/vyuham26-agentic-hackathon"
    assert create_payload.makemypass_url == "https://makemypass.com/event/vyuham26-agentic-hackathon"

    update_payload = EventUpdate(
        makemypass_url="https://makemypass.com/event/updated-url"
    )
    assert update_payload.makemypass_url == "https://makemypass.com/event/updated-url"


def test_event_out_serialization_makemypass():
    from datetime import datetime, timezone

    event_data = {
        "id": uuid4(),
        "name": "Valorant Championship",
        "slug": "valorant-championship",
        "stream": EventStream.gaming,
        "registration_type": RegistrationType.team,
        "team_size_min": 5,
        "team_size_max": 5,
        "prize_amount": Decimal("25000"),
        "venue": "Esports Arena",
        "fee": "₹500",
        "day": 2,
        "time": "11:00 AM",
        "rules": ["Standard 5v5 rules"],
        "eligibility": "College students",
        "seats_total": 16,
        "image": "/images/valorant.webp",
        "featured": True,
        "status": "upcoming",
        "blurb": "Valorant showdown",
        "start_time": None,
        "end_time": None,
        "description": "5v5 tactical shooter championship",
        "registration_url": "https://makemypass.com/event/vyuham26-valorant",
        "makemypass_url": "https://makemypass.com/event/vyuham26-valorant",
        "created_at": datetime.now(timezone.utc),
    }

    event_out = EventOut(**event_data)
    assert event_out.registration_url == "https://makemypass.com/event/vyuham26-valorant"
    assert event_out.makemypass_url == "https://makemypass.com/event/vyuham26-valorant"
    assert event_out.title == "Valorant Championship"
    assert event_out.teamSize == "5 members"
