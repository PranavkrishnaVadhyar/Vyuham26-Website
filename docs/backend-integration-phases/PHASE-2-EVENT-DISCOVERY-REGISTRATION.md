# 🔵 PHASE 2: Event Discovery & Registration Flow

> **Priority:** HIGH (Enables browsing dynamic events and registering participants)  
> **Target Systems:** `vyuham-backend` & `Vyuham26_frontend`

---

## 🎯 Objectives
1. Allow fetching individual events by **slug** (e.g., `GET /events/slug/hackathon`) to power dynamic routes (`/events/[slug]` and `/register/[slug]`).
2. Update the registration service to accept `event_slug` directly from the frontend form.
3. Automatically generate a unique `ticket_code` (e.g. `VYU26-TKT-1082`) upon registration.
4. Return enriched registration details (`event` object, `team_name`, `ticket_code`) on `GET /registrations/me` for the Dashboard and Ticket pages.
5. Include `registered_events` (list of registered slugs) on `GET /auth/me` to initialize `AuthContext` instantly.

---

## 📋 Target Files & Required Modifications

### 2.1 Event Lookup by Slug & Filtering
* **Files:**
  * [`app/modules/events/router.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/events/router.py)
  * [`app/modules/events/service.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/events/service.py)
* **Changes:**
  * Add endpoint `GET /events/slug/{slug}`:
    ```python
    @router.get("/slug/{slug}", response_model=EventOut)
    async def read_event_by_slug(slug: str, db: Annotated[AsyncSession, Depends(get_db)]) -> Event:
        return await get_event_by_slug(db, slug)
    ```
  * Update `GET /events` to support query params:
    * `stream: Optional[EventStream] = None`
    * `day: Optional[int] = None`
    * `featured: Optional[bool] = None`

---

### 2.2 Register via Slug or UUID
* **Files:**
  * [`app/modules/registrations/schemas.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/registrations/schemas.py)
  * [`app/modules/registrations/service.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/registrations/service.py)
* **Changes:**
  * Update `RegistrationCreate`:
    ```python
    class RegistrationCreate(BaseModel):
        event_id: Optional[UUID] = None
        event_slug: Optional[str] = None
        team_id: Optional[UUID] = None
    ```
  * In `register_for_event`, if `event_id` is missing but `event_slug` is provided, query `Event` by `slug`.

---

### 2.3 Ticket Code Generation
* **Files:**
  * [`app/modules/registrations/models.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/registrations/models.py)
  * [`app/modules/registrations/service.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/registrations/service.py)
* **Changes:**
  * In `Registration` model, add:
    ```python
    ticket_code: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    ```
  * In `register_for_event`, generate a random/secure unique code:
    ```python
    code = f"VYU26-TKT-{secrets.randbelow(9000) + 1000}"
    ```

---

### 2.4 Enriched Registration & Profile Endpoints
* **Files:**
  * [`app/modules/registrations/schemas.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/registrations/schemas.py)
  * [`app/modules/registrations/service.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/registrations/service.py)
  * [`app/modules/auth/schemas.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/auth/schemas.py)
  * [`app/modules/auth/router.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/auth/router.py)
* **Changes:**
  * Define `RegistrationDetailOut` containing:
    * `id: UUID`, `ticket_code: str`, `status: str`, `created_at: datetime`
    * `event: EventOut` (contains `name`, `slug`, `stream`, `venue`, `day`, `time`, `fee`)
    * `team_name: Optional[str] = None`
  * Return `list[RegistrationDetailOut]` for `GET /registrations/me`.
  * Add `registered_events: list[str]` to `ProfileOut` on `GET /auth/me` (queries distinct event slugs registered by current user).

---

## ✅ Phase 2 Checklist & Verification

- [ ] 1. Test `GET http://localhost:8000/events/slug/hackathon` $\rightarrow$ Returns Hackathon 36 details.
- [ ] 2. Test `POST http://localhost:8000/registrations` with `{ "event_slug": "hackathon" }` $\rightarrow$ Generates registration with `ticket_code`.
- [ ] 3. Test `GET http://localhost:8000/registrations/me` $\rightarrow$ Returns populated event details and ticket code.
- [ ] 4. Test `GET http://localhost:8000/auth/me` $\rightarrow$ Includes `registered_events: ["hackathon"]`.
