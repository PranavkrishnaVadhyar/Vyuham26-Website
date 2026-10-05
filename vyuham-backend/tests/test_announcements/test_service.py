import unittest
from types import SimpleNamespace
from uuid import uuid4

from app.modules.announcements.schemas import AnnouncementCreate
from app.modules.announcements.service import create_announcement, list_announcements


class FakeAnnouncementsSession:
    def __init__(self, *, scalars=()):
        self.scalar_values = list(scalars)
        self.added = []
        self.commits = 0

    async def scalars(self, _statement):
        val = self.scalar_values.pop(0)
        return SimpleNamespace(all=lambda: val)

    def add(self, item):
        self.added.append(item)

    async def commit(self):
        self.commits += 1

    async def refresh(self, _item):
        return None


class AnnouncementServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_list_announcements(self):
        fake_announcement = SimpleNamespace(id=uuid4(), title="Test", pinned=True)
        db = FakeAnnouncementsSession(scalars=[[fake_announcement]])

        result = await list_announcements(db)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].title, "Test")

    async def test_create_announcement(self):
        db = FakeAnnouncementsSession()
        data = AnnouncementCreate(title="Test Alert", content="Sample content", urgent=True)

        result = await create_announcement(db, data)
        self.assertEqual(result.title, "Test Alert")
        self.assertTrue(result.urgent)
        self.assertEqual(db.commits, 1)


if __name__ == "__main__":
    unittest.main()
