# 🟡 PHASE 4: Checkout, Orders & Payment Confirmation

> **Priority:** MEDIUM-HIGH (Required for paid event checkout, cart review, and confirmed tickets)  
> **Target System:** `vyuham-backend`

---

## 🎯 Objectives
1. Provide a payments module to calculate registration subtotals and platform fees (`₹30`) matching [`checkout/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/checkout/page.tsx).
2. Store transaction records (`Payment`) linked to the user's registrations.
3. Allow participants to confirm payments via transaction reference (e.g. `TXN-VYU-984021`) on [`payment/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/payment/page.tsx).
4. Transition registration status from `pending` $\rightarrow$ `confirmed` upon payment verification and generate active ticket passes.
5. Provide a receipt query endpoint for the [`receipt/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/receipt/page.tsx).

---

## 📋 New Module: `app/modules/payments/`

### 4.1 Database Model (`payments/models.py`)
```python
import enum
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4
from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from app.core.db import Base

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"

class PaymentMethod(str, enum.Enum):
    upi = "upi"
    card = "card"
    netbanking = "netbanking"

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    registration_ids: Mapped[list[UUID]] = mapped_column(ARRAY(PGUUID(as_uuid=True)), nullable=False)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    platform_fee: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("30.00"), nullable=False)
    total_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    payment_method: Mapped[PaymentMethod] = mapped_column(Enum(PaymentMethod, name="payment_method"), nullable=False)
    transaction_ref: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status"), default=PaymentStatus.pending, server_default="pending"
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
```

---

### 4.2 Endpoints Specification (`payments/router.py`)

#### `POST /payments/create`
* **Access:** Authenticated User
* **Payload:**
  ```json
  {
    "registration_ids": ["uuid-1", "uuid-2"],
    "payment_method": "upi"
  }
  ```
* **Response (HTTP 201):**
  ```json
  {
    "payment_id": "9a7f3408-...",
    "subtotal": 800.0,
    "platform_fee": 30.0,
    "total_amount": 830.0,
    "transaction_ref": "TXN-VYU-984021",
    "status": "pending"
  }
  ```

#### `POST /payments/verify`
* **Access:** Authenticated User
* **Payload:**
  ```json
  {
    "transaction_ref": "TXN-VYU-984021"
  }
  ```
* **Action:**
  * Validates transaction reference.
  * Sets `Payment.status = completed`.
  * Updates all associated `Registration.status = confirmed`.
* **Response (HTTP 200):**
  ```json
  {
    "status": "completed",
    "transaction_ref": "TXN-VYU-984021",
    "confirmed_registrations": 2
  }
  ```

#### `GET /payments/receipt/{transaction_ref}`
* **Access:** Authenticated User (Owner or Admin)
* **Response (HTTP 200):** Detailed receipt with itemized breakdown, attendee name, and verification timestamp.

---

## ✅ Phase 4 Checklist & Verification

- [ ] 1. Create `app/modules/payments/models.py`, `schemas.py`, `service.py`, `router.py`.
- [ ] 2. Register `payments_router` in `app/main.py`.
- [ ] 3. Run migration / table creation for the `payments` table.
- [ ] 4. Test checkout flow from loadout creation to transaction verification.
- [ ] 5. Confirm that after verification, `GET /registrations/me` shows status as `confirmed`.
