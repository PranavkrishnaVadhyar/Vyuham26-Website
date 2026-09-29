import unittest
from types import SimpleNamespace
from uuid import uuid4

from fastapi import HTTPException

from app.modules.events.models import RegistrationType
from app.modules.registrations.models import Registration, RegistrationStatus
from app.modules.registrations.router import post_registration
from app.modules.registrations.schemas import RegistrationCreate
from app.modules.registrations.service import register_for_event


class FakeSession:
    def __init__(self, *, gets=(), scalars=()):
        self.get_values = list(gets)
        self.scalar_values = list(scalars)
        self.added = []
        self.commits = 0
        self.rollbacks = 0

    async def get(self, _model, _key):
        return self.get_values.pop(0)

    async def scalar(self, _statement):
        return self.scalar_values.pop(0)

    def add(self, item):
        self.added.append(item)

    async def commit(self):
        self.commits += 1

    async def refresh(self, _item):
        return None

    async def rollback(self):
        self.rollbacks += 1


class RegistrationServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_register_solo_event(self):
        event = SimpleNamespace(registration_type=RegistrationType.solo, team_size_min=None, team_size_max=None)
        user = SimpleNamespace(id=uuid4())
        db = FakeSession(gets=[event], scalars=[None])

        result = await register_for_event(db, uuid4(), user)

        self.assertIsInstance(result, Registration)
        self.assertEqual(result.user_id, user.id)
        self.assertIsNone(result.team_id)
        self.assertEqual(result.status, RegistrationStatus.pending)

    async def test_solo_request_with_only_event_id_is_accepted_by_schema(self):
        request = RegistrationCreate(event_id=uuid4())

        self.assertIsNone(request.team_id)

    async def test_solo_registration_rejects_supplied_team_id_with_http_400(self):
        event = SimpleNamespace(registration_type=RegistrationType.solo, team_size_min=None, team_size_max=None)
        # The valid team ID is deliberately supplied. The service must reject based on
        # the event type before it attempts any team lookup or membership check.
        request = RegistrationCreate(event_id=uuid4(), team_id=uuid4())
        db = FakeSession(gets=[event])

        with self.assertRaises(HTTPException) as raised:
            await post_registration(request, SimpleNamespace(id=uuid4()), db)

        self.assertEqual(raised.exception.status_code, 400)
        self.assertEqual(db.commits, 0)

    async def test_team_registration_without_team_id_returns_http_400(self):
        event = SimpleNamespace(registration_type=RegistrationType.team, team_size_min=2, team_size_max=4)
        request = RegistrationCreate(event_id=uuid4())
        db = FakeSession(gets=[event])

        with self.assertRaises(HTTPException) as raised:
            await post_registration(request, SimpleNamespace(id=uuid4()), db)

        self.assertEqual(raised.exception.status_code, 400)
        self.assertEqual(db.commits, 0)

    async def test_register_team_within_size_range(self):
        event = SimpleNamespace(registration_type=RegistrationType.team, team_size_min=2, team_size_max=4)
        team = SimpleNamespace()
        user = SimpleNamespace(id=uuid4())
        db = FakeSession(gets=[event, team], scalars=[uuid4(), 3, None])

        result = await register_for_event(db, uuid4(), user, uuid4())

        self.assertEqual(result.user_id, user.id)
        self.assertIsNotNone(result.team_id)
        self.assertEqual(db.commits, 1)

    async def test_reject_team_outside_size_range(self):
        event = SimpleNamespace(registration_type=RegistrationType.team, team_size_min=2, team_size_max=4)
        db = FakeSession(gets=[event, SimpleNamespace()], scalars=[uuid4(), 1])

        with self.assertRaisesRegex(ValueError, "between 2 and 4"):
            await register_for_event(db, uuid4(), SimpleNamespace(id=uuid4()), uuid4())

    async def test_reject_duplicate_registration(self):
        event = SimpleNamespace(registration_type=RegistrationType.solo, team_size_min=None, team_size_max=None)
        db = FakeSession(gets=[event], scalars=[uuid4()])

        with self.assertRaisesRegex(ValueError, "already registered"):
            await register_for_event(db, uuid4(), SimpleNamespace(id=uuid4()))

    async def test_reject_non_member_submitting_team(self):
        event = SimpleNamespace(registration_type=RegistrationType.team, team_size_min=2, team_size_max=4)
        db = FakeSession(gets=[event, SimpleNamespace()], scalars=[None])

        with self.assertRaisesRegex(PermissionError, "member of this team"):
            await register_for_event(db, uuid4(), SimpleNamespace(id=uuid4()), uuid4())


if __name__ == "__main__":
    unittest.main()
