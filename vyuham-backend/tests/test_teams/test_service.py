import unittest
from types import SimpleNamespace
from uuid import uuid4

from app.modules.teams.models import Team, TeamMember
from app.modules.teams.service import create_team, join_team


class FakeSession:
    def __init__(self, scalar_values=()):
        self.scalar_values = list(scalar_values)
        self.added = []
        self.commits = 0

    async def scalar(self, _statement):
        return self.scalar_values.pop(0)

    def add(self, item):
        self.added.append(item)

    async def flush(self):
        for item in self.added:
            if isinstance(item, Team) and item.id is None:
                item.id = uuid4()

    async def commit(self):
        self.commits += 1

    async def refresh(self, _item):
        return None

    async def rollback(self):
        return None


class TeamServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_create_team_adds_creator_as_member(self):
        creator_id = uuid4()
        db = FakeSession(scalar_values=[None])

        result = await create_team(db, "Robotics", SimpleNamespace(id=creator_id))

        self.assertEqual(result["name"], "Robotics")
        self.assertEqual(result["member_count"], 1)
        self.assertEqual(len(result["invite_code"]), 8)
        self.assertTrue(any(isinstance(row, TeamMember) and row.user_id == creator_id for row in db.added))
        self.assertEqual(db.commits, 1)

    async def test_join_team_by_invite_code(self):
        team = SimpleNamespace(id=uuid4(), invite_code="AB234567")
        user_id = uuid4()
        db = FakeSession(scalar_values=[team, None])

        joined = await join_team(db, "ab234567", SimpleNamespace(id=user_id))

        self.assertIs(joined, team)
        self.assertTrue(any(isinstance(row, TeamMember) and row.user_id == user_id for row in db.added))

    async def test_join_rejects_existing_member(self):
        team = SimpleNamespace(id=uuid4())
        db = FakeSession(scalar_values=[team, uuid4()])

        with self.assertRaisesRegex(ValueError, "already a member"):
            await join_team(db, "AB234567", SimpleNamespace(id=uuid4()))


if __name__ == "__main__":
    unittest.main()
