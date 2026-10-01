# 🟢 PHASE 1: Foundation, CORS & Schema Alignment

> **Priority:** CRITICAL (Blocks frontend from connecting or querying the backend)  
> **Target System:** `vyuham-backend`

---

## 🎯 Objectives
1. Allow the Vite frontend (`http://localhost:5173`) to communicate with the FastAPI backend without CORS rejections.
2. Align the `Profile` database model with the user profile fields edited in `src/pages/profile/page.tsx` (`degree`, `year`, `vyuham_id`).
3. Align the `Event` database model with event attributes displayed in `src/data/events.ts` (`slug`, `fee`, `day`, `time`, `rules`, `eligibility`, `stream` enums).
4. Update the event seed script to populate real Vyuham '26 festival events instead of placeholder items.

---

## 📋 Target Files & Required Modifications

### 1.1 CORS Configuration
* **Files:**
  * [`app/core/config.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/core/config.py)
  * [`app/main.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/main.py)
* **Changes:**
  * In `config.py`, change default `frontend_origins` to:
    ```python
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5500,http://127.0.0.1:5500"
    ```
  * In `main.py`, ensure `allow_headers` allows wildcard or standard client headers:
    ```python
    allow_headers=["*"]
    ```

---

### 1.2 User Profile Schema (`app/modules/auth`)
* **Files:**
  * [`app/modules/auth/models.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/auth/models.py)
  * [`app/modules/auth/schemas.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/auth/schemas.py)
  * [`app/modules/auth/service.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/auth/service.py)
* **Changes:**
  * In `models.py` (`Profile` class), add:
    ```python
    degree: Mapped[str | None] = mapped_column(String(120), nullable=True)
    year: Mapped[str | None] = mapped_column(String(50), nullable=True)
    ```
  * In `schemas.py`:
    * Add `degree: str | None = None` and `year: str | None = None` to `ProfileOut` and `ProfileUpdate`.
    * Add computed/formatted property `vyuham_id: str` (e.g. `VYU26-OPER-{uuid[:4].upper()}`).
    * Ensure role serialization supports frontend compatibility (`participant` $\leftrightarrow$ `user`).

---

### 1.3 Event Model & Stream Alignment (`app/modules/events`)
* **Files:**
  * [`app/modules/events/models.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/events/models.py)
  * [`app/modules/events/schemas.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/events/schemas.py)
* **Changes:**
  * Update `EventStream` enum to match frontend streams:
    ```python
    class EventStream(str, enum.Enum):
        tech = "tech"
        culture = "culture"
        gaming = "gaming"
        impact = "impact"
        management = "management"
    ```
  * In `Event` model, add columns:
    ```python
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    fee: Mapped[str | None] = mapped_column(String(80), nullable=True)  # e.g. "₹500 / team" or "Free"
    day: Mapped[int | None] = mapped_column(Integer, nullable=True)     # Day 1, 2, or 3
    time: Mapped[str | None] = mapped_column(String(100), nullable=True) # e.g. "09:00 — 21:00"
    rules: Mapped[list[str] | None] = mapped_column(JSON, nullable=True) # list of rules
    eligibility: Mapped[str | None] = mapped_column(String(200), nullable=True)
    seats_total: Mapped[int | None] = mapped_column(Integer, nullable=True)
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    status: Mapped[str] = mapped_column(String(50), default="upcoming", server_default="upcoming")
    ```
  * In `schemas.py`, mirror all fields in `EventCreate`, `EventUpdate`, and `EventOut`.

---

### 1.4 Official 48 Events Seed Script
* **File:** [`scripts/seed_events.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/scripts/seed_events.py)
* **Changes:**
  * Replace the 4 placeholder events (`Placeholder Hackathon`, etc.) with real festival events from `Vyuham26_frontend/src/data/events.ts`:
    * `hackathon` (Hackathon 36, Tech, Day 1)
    * `ctf` (Capture The Flag, Tech, Day 2)
    * `battle-of-bands` (Battle of the Bands, Culture, Day 2)
    * `fifa-24` / `valorant` (Gaming, Day 2)
    * ... all 21+ cataloged events with their rules, fees, and venues.

---

## ✅ Phase 1 Checklist & Verification

- [ ] 1. Update `app/core/config.py` with port 5173 origins.
- [ ] 2. Add `degree` and `year` to `Profile` model & schemas.
- [ ] 3. Add `slug`, `fee`, `day`, `time`, `rules`, and updated streams to `Event` model & schemas.
- [ ] 4. Run `python -m scripts.create_tables` to generate/update PostgreSQL tables.
- [ ] 5. Run `python -m scripts.seed_events` to populate the official events.
- [ ] 6. Start server with `uvicorn app.main:app --reload` and verify at `http://localhost:8000/docs`.
