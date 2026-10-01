# 🟣 PHASE 3: Squads & Teams System

> **Priority:** HIGH (Required for hackathons, CTF squads, and multiplayer esports)  
> **Target Systems:** `vyuham-backend` & `Vyuham26_frontend`

---

## 🎯 Objectives
1. Associate `Team` (Squad) models with an optional `event_id` so squads correspond to specific competitions.
2. Enrich `TeamDetailOut` to return complete member dossiers (name, email, college, leader/member role) for the Squad Formation UI ([`teams/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/teams/page.tsx)).
3. Add a squad invitation endpoint (`POST /teams/{id}/invite`) accepting emails to match the frontend invite box.
4. Enforce event `team_size_min` and `team_size_max` validation rules when submitting squad registrations.

---

## 📋 Target Files & Required Modifications

### 3.1 Event Association in Team Model
* **Files:**
  * [`app/modules/teams/models.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/teams/models.py)
  * [`app/modules/teams/schemas.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/teams/schemas.py)
* **Changes:**
  * In `Team` model:
    ```python
    event_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), 
        ForeignKey("events.id", ondelete="SET NULL"), 
        nullable=True, 
        index=True
    )
    ```
  * In `TeamCreate`, allow passing an optional `event_id: UUID | None = None` or `event_slug: str | None = None`.

---

### 3.2 Rich Team Member Dossier
* **Files:**
  * [`app/modules/teams/schemas.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/teams/schemas.py)
  * [`app/modules/teams/service.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/teams/service.py)
* **Changes:**
  * Define `TeamMemberProfileOut`:
    ```python
    class TeamMemberProfileOut(BaseModel):
        user_id: UUID
        name: Optional[str]
        email: EmailStr
        college: Optional[str]
        is_leader: bool
        joined_at: datetime
    ```
  * Update `TeamDetailOut`:
    ```python
    class TeamDetailOut(TeamOut):
        event_name: Optional[str] = None
        event_slug: Optional[str] = None
        members: list[TeamMemberProfileOut]
    ```

---

### 3.3 Email Invite Endpoint
* **Files:**
  * [`app/modules/teams/router.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/teams/router.py)
  * [`app/modules/teams/schemas.py`](file:///c:/Users/nb200/Documents/Vyuham26-Website/vyuham-backend/app/modules/teams/schemas.py)
* **Changes:**
  * Schema:
    ```python
    class TeamInviteRequest(BaseModel):
        email: EmailStr
    ```
  * Endpoint `POST /teams/{team_id}/invite`:
    * Verifies caller is team leader or member.
    * Returns the team invite code and join URL for emailing or direct copying.

---

## ✅ Phase 3 Checklist & Verification

- [ ] 1. Create a squad via `POST /teams` with `{ "name": "CyberVipers", "event_slug": "hackathon" }`.
- [ ] 2. Verify 8-character `invite_code` is returned.
- [ ] 3. Have a second user join via `POST /teams/join` with `{ "invite_code": "..." }`.
- [ ] 4. Call `GET /teams/{team_id}` and confirm both members appear with names, emails, and leader flags.
- [ ] 5. Register squad for Hackathon 36 and ensure member count meets bounds (`2` to `4` members).
