import unittest
from decimal import Decimal
from types import SimpleNamespace
from uuid import uuid4

from app.modules.hackathon.models import HackathonSubmission
from app.modules.hackathon.schemas import SubmissionCreate
from app.modules.hackathon.service import get_leaderboard, set_score, upsert_submission


class FakeResult:
    def __init__(self, rows=()):
        self.rows = list(rows)

    def all(self):
        return self.rows

    def first(self):
        return self.rows[0] if self.rows else None


class FakeSession:
    def __init__(self, *, gets=(), scalars=(), rows=()):
        self.get_values = list(gets)
        self.scalar_values = list(scalars)
        self.rows = list(rows)
        self.added = []
        self.commits = 0

    async def get(self, _model, _key):
        return self.get_values.pop(0)

    async def scalar(self, _statement):
        return self.scalar_values.pop(0)

    async def execute(self, _statement):
        return FakeResult(self.rows)

    def add(self, item):
        self.added.append(item)

    async def commit(self):
        self.commits += 1

    async def refresh(self, _item):
        return None


class HackathonServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_submission_create_then_resubmit_updates_same_row(self):
        event_id, team_id, user_id = uuid4(), uuid4(), uuid4()
        event, team = SimpleNamespace(), SimpleNamespace(name="Byte Builders")
        submission = SimpleNamespace(id=uuid4(), event_id=event_id, team_id=team_id,
            repo_url="https://old.example", demo_url=None, description=None, score=None,
            submitted_at="then", updated_at="then")
        new_data = SubmissionCreate(repo_url="https://new.example", demo_url="https://demo.example", description="Updated")
        user = SimpleNamespace(id=user_id)
        create_db = FakeSession(gets=[event, team], scalars=[uuid4(), uuid4(), None])
        created = await upsert_submission(create_db, event_id, team_id, user, new_data)
        self.assertEqual(created["repo_url"], "https://new.example")
        self.assertEqual(len(create_db.added), 1)
        self.assertIsInstance(create_db.added[0], HackathonSubmission)

        update_db = FakeSession(gets=[event, team], scalars=[uuid4(), uuid4(), submission])
        updated = await upsert_submission(update_db, event_id, team_id, user, new_data)
        self.assertEqual(updated["repo_url"], "https://new.example")
        self.assertEqual(updated["demo_url"], "https://demo.example")
        self.assertEqual(update_db.added, [])
        self.assertEqual(update_db.commits, 1)

    async def test_submission_rejects_non_member(self):
        event_id, team_id = uuid4(), uuid4()
        db = FakeSession(gets=[SimpleNamespace(), SimpleNamespace(name="Team")], scalars=[None])
        with self.assertRaises(PermissionError):
            await upsert_submission(db, event_id, team_id, SimpleNamespace(id=uuid4()), SubmissionCreate(repo_url="https://repo.example"))

    async def test_submission_requires_existing_event_registration(self):
        event_id, team_id = uuid4(), uuid4()
        db = FakeSession(gets=[SimpleNamespace(), SimpleNamespace(name="Team")], scalars=[uuid4(), None])
        with self.assertRaisesRegex(ValueError, "must be registered"):
            await upsert_submission(db, event_id, team_id, SimpleNamespace(id=uuid4()), SubmissionCreate(repo_url="https://repo.example"))

    async def test_score_setting_requires_privileged_role(self):
        db = FakeSession()
        with self.assertRaises(PermissionError):
            await set_score(db, uuid4(), uuid4(), Decimal("10"), SimpleNamespace(role=SimpleNamespace(value="participant")))

    async def test_admin_can_set_score(self):
        submission = SimpleNamespace(event_id=uuid4(), score=None)
        db = FakeSession(gets=[submission])
        result = await set_score(db, submission.event_id, uuid4(), Decimal("10"), SimpleNamespace(role=SimpleNamespace(value="admin")))
        self.assertEqual(result.score, Decimal("10"))
        self.assertEqual(db.commits, 1)

    async def test_leaderboard_orders_by_score_descending(self):
        db = FakeSession(rows=[("Alpha", Decimal("99")), ("Beta", Decimal("75"))])
        self.assertEqual(await get_leaderboard(db, uuid4()), [
            {"team_name": "Alpha", "score": Decimal("99")},
            {"team_name": "Beta", "score": Decimal("75")},
        ])


if __name__ == "__main__":
    unittest.main()
