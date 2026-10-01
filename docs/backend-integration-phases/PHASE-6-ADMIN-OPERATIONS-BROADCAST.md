# ⚪ PHASE 6: Admin Command Center, Results & Live Broadcasts

> **Priority:** MEDIUM (Required for festival administrators, event head score reporting, and live notices)  
> **Target Systems:** `vyuham-backend` & `Vyuham26_frontend`

---

## 🎯 Objectives
1. Provide aggregated statistical endpoints (`GET /admin/stats`) powering the Admin Dashboard ([`admin/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/admin/page.tsx)).
2. Implement winner & results publishing for Event Heads ([`admin/event-head/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/admin/event-head/page.tsx)) and the public Winners Dossier ([`results/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/results/page.tsx)).
3. Provide a live Announcements & Broadcast API powering [`BroadcastTicker.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/ui/BroadcastTicker.tsx) and the Announcements Feed ([`announcements/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/announcements/page.tsx)).

---

## 📋 Target Files & New Modules

### 6.1 Admin Analytics Router (`app/modules/admin/router.py`)
* **Endpoint `GET /admin/stats`** (Admin Role Only)
* **Response Model:**
  ```json
  {
    "all": {
      "total_registrations": 2480,
      "total_revenue": 684000.0,
      "total_checkins": 1890,
      "active_events": 32
    },
    "tech": {
      "total_registrations": 1120,
      "total_revenue": 340000.0,
      "total_checkins": 890,
      "active_events": 12
    },
    "culture": {
      "total_registrations": 840,
      "total_revenue": 210000.0,
      "total_checkins": 620,
      "active_events": 10
    },
    "gaming": {
      "total_registrations": 520,
      "total_revenue": 134000.0,
      "total_checkins": 380,
      "active_events": 10
    }
  }
  ```

---

### 6.2 Event Results Publishing
* **Endpoint `POST /events/{event_id}/results`** (Role: `admin` or `event_head`)
* **Payload:**
  ```json
  {
    "first_place": "CyberVipers (Digital University Kerala)",
    "second_place": "ByteBusters (IIT Madras)",
    "third_place": "NullPointer Squad (NIT Calicut)",
    "prize_distributed": "₹50,000"
  }
  ```
* **Endpoint `GET /events/results`** (Public)
  * Returns list of all published competition winners.

---

### 6.3 Announcements & Broadcast Ticker Module (`app/modules/announcements/`)
* **Database Model (`announcements/models.py`):**
  ```python
  class Announcement(Base):
      __tablename__ = "announcements"

      id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
      title: Mapped[str] = mapped_column(String(250), nullable=False)
      content: Mapped[str] = mapped_column(Text, nullable=False)
      category: Mapped[str] = mapped_column(String(50), default="TRANSMISSION")
      urgent: Mapped[bool] = mapped_column(Boolean, default=False)
      stream: Mapped[str] = mapped_column(String(50), default="GENERAL")
      pinned: Mapped[bool] = mapped_column(Boolean, default=False)
      created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
  ```
* **Endpoints:**
  * `GET /announcements`: Public, returns sorted bulletin list.
  * `POST /announcements`: Admin only, creates a new festival broadcast.
  * `DELETE /announcements/{id}`: Admin only, removes a bulletin.

---

## ✅ Phase 6 Checklist & Verification

- [ ] 1. Create `admin/router.py` with aggregated metrics queries.
- [ ] 2. Add results columns/table and publish endpoint.
- [ ] 3. Create `announcements` module and seed initial festival transmissions.
- [ ] 4. Register routers in `app/main.py`.
- [ ] 5. Test `GET /admin/stats` and `GET /announcements` from client or curl.
