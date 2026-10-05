import unittest
from types import SimpleNamespace
from uuid import uuid4

from app.modules.ctf.models import CTFChallenge, CTFTrack
from app.modules.ctf.schemas import ChallengeCreate, ChallengeOut
from app.modules.ctf.service import create_challenge, get_scoreboard, hash_flag, submit_flag
from app.modules.events.models import RegistrationType


class FakeResult:
    def __init__(self, rows=()):
        self.rows = list(rows)

    def all(self):
        return self.rows


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


def challenge(event_id, flag="flag{ok}"):
    return SimpleNamespace(id=uuid4(), event_id=event_id, is_active=True, flag_hash=hash_flag(flag))


class CTFServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_create_challenge_hashes_flag_and_schema_omits_hash(self):
        event_id = uuid4()
        db = FakeSession(gets=[SimpleNamespace()])
        row = await create_challenge(db, event_id, ChallengeCreate(title="One", description="Desc", category="web",
            track=CTFTrack.beginner, points=50, flag="flag{secret}"), SimpleNamespace(role=SimpleNamespace(value="admin")))
        self.assertEqual(row.flag_hash, hash_flag("flag{secret}"))
        api = ChallengeOut(id=uuid4(), event_id=event_id, title="One", description="Desc", category="web",
            track=CTFTrack.beginner, points=50, is_active=True, created_at="2026-01-01T00:00:00Z")
        self.assertNotIn("flag_hash", api.model_dump())

    async def test_correct_and_incorrect_flags_are_both_logged(self):
        event_id, user_id = uuid4(), uuid4()
        event = SimpleNamespace(registration_type=RegistrationType.solo)
        good_challenge = challenge(event_id)
        user = SimpleNamespace(id=user_id)
        wrong_db = FakeSession(gets=[good_challenge, event], scalars=[None])
        self.assertFalse(await submit_flag(wrong_db, event_id, good_challenge.id, "wrong", user))
        self.assertFalse(wrong_db.added[0].is_correct)
        good_db = FakeSession(gets=[good_challenge, event], scalars=[None])
        self.assertTrue(await submit_flag(good_db, event_id, good_challenge.id, "flag{ok}", user))
        self.assertTrue(good_db.added[0].is_correct)

    async def test_duplicate_correct_solve_is_rejected(self):
        event_id = uuid4()
        target = challenge(event_id)
        db = FakeSession(gets=[target, SimpleNamespace(registration_type=RegistrationType.solo)], scalars=[uuid4()])
        with self.assertRaisesRegex(ValueError, "already solved"):
            await submit_flag(db, event_id, target.id, "flag{ok}", SimpleNamespace(id=uuid4()))
        self.assertEqual(db.added, [])

    async def test_team_flag_requires_membership(self):
        event_id, team_id = uuid4(), uuid4()
        target = challenge(event_id)
        db = FakeSession(gets=[target, SimpleNamespace(registration_type=RegistrationType.team), SimpleNamespace()], scalars=[None])
        with self.assertRaises(PermissionError):
            await submit_flag(db, event_id, target.id, "flag{ok}", SimpleNamespace(id=uuid4()), team_id)

    async def test_scoreboard_aggregates_points_and_solved_count(self):
        event_id = uuid4()
        rows = [("Team A", 150, 2, "2026-01-02"), ("Team B", 50, 1, "2026-01-01")]
        db = FakeSession(gets=[SimpleNamespace(registration_type=RegistrationType.team)], rows=rows)
        result = await get_scoreboard(db, event_id)
        self.assertEqual(result, [
            {"scorer_name": "Team A", "total_points": 150, "solved_count": 2},
            {"scorer_name": "Team B", "total_points": 50, "solved_count": 1},
        ])


if __name__ == "__main__":
    unittest.main()
