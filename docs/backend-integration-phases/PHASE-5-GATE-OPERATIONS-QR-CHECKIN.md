# 🔴 PHASE 5: Gate Operations & Volunteer QR Check-In

> **Priority:** MEDIUM-HIGH (Required for on-ground festival verification, volunteer camera scanner, and attendee access)  
> **Target Systems:** `vyuham-backend` & `Vyuham26_frontend`

---

## 🎯 Objectives
1. Implement the gate check-in backend that powers the frontend QR scanner ([`src/pages/volunteer/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/volunteer/page.tsx)).
2. Validate attendee `ticket_code` against confirmed registrations.
3. Track station assignments ("Gate 1 - Main Entrance", "Gate 2 - Tech Arena", etc.).
4. Detect and prevent duplicate admissions with sound/visual signals ("approved" vs "duplicate" vs "invalid").
5. Provide a station check-in history log for volunteers and gate captains.

---

## 📋 New Module: `app/modules/checkin/`

### 5.1 Database Model (`checkin/models.py`)
```python
import enum
from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column
from app.core.db import Base

class CheckInStatus(str, enum.Enum):
    approved = "approved"
    duplicate = "duplicate"
    invalid = "invalid"

class CheckInRecord(Base):
    __tablename__ = "check_ins"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    ticket_code: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    registration_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("registrations.id", ondelete="SET NULL"), nullable=True
    )
    station: Mapped[str] = mapped_column(String(100), nullable=False)
    scanned_by: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False
    )
    status: Mapped[CheckInStatus] = mapped_column(Enum(CheckInStatus, name="checkin_status"), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    scanned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
```

---

### 5.2 Endpoints Specification (`checkin/router.py`)

#### `POST /checkin/scan`
* **Access:** Role `volunteer`, `event_head`, or `admin`
* **Payload:**
  ```json
  {
    "ticket_code": "VYU26-TKT-1082",
    "station": "Gate 1 - Main Entrance"
  }
  ```
* **Validation Logic:**
  1. Finds `Registration` matching `ticket_code`.
  2. If missing or status is `cancelled`, returns `status: "invalid"`.
  3. Checks if an `approved` scan already exists for this `registration_id` at this `station`. If yes, returns `status: "duplicate"`.
  4. If valid, records scan and returns `status: "approved"` with attendee metadata.
* **Response (HTTP 200):**
  ```json
  {
    "status": "approved",
    "ticket_code": "VYU26-TKT-1082",
    "attendee_name": "ARJUN IYER",
    "college": "National Institute of Engineering",
    "event_name": "HACK VYUHAM 36",
    "station": "Gate 1 - Main Entrance",
    "scanned_at": "2026-10-30T10:14:00Z"
  }
  ```

#### `GET /checkin/history`
* **Access:** Role `volunteer`, `event_head`, or `admin`
* **Query Params:** `station: Optional[str]`, `limit: int = 50`
* **Response:** Returns list of recent scans for the active gate station.

---

## ✅ Phase 5 Checklist & Verification

- [ ] 1. Create `app/modules/checkin/models.py`, `schemas.py`, `service.py`, `router.py`.
- [ ] 2. Register `checkin_router` in `app/main.py`.
- [ ] 3. Create database tables with `scripts/create_tables.py`.
- [ ] 4. Perform a scan with valid ticket code $\rightarrow$ verify response is `approved`.
- [ ] 5. Repeat scan with same code $\rightarrow$ verify response is `duplicate`.
- [ ] 6. Scan non-existent code $\rightarrow$ verify response is `invalid`.
