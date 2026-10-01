# ⚡ VYUHAM '26 — Backend to Frontend Integration Roadmap

This directory contains the detailed phase-by-phase specifications to upgrade `vyuham-backend` (FastAPI + Supabase PostgreSQL) to support all data models, user flows, and operations designed in `Vyuham26_frontend` (React 19 + Vite).

---

## 🗺️ Phase Progression Matrix

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     PHASE 1     │ ──> │     PHASE 2     │ ──> │     PHASE 3     │ ──> │     PHASE 4     │
│ Foundation,     │     │ Event Discovery │     │ Squads & Teams  │     │ Checkout &      │
│ CORS & Schemas  │     │ & Registration  │     │ Management      │     │ Payments        │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                                                                 │
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐              │
│     PHASE 7     │ <── │     PHASE 6     │ <── │     PHASE 5     │ <────────────┘
│ Auxiliary:      │     │ Admin Command   │     │ Gate Operations │
│ Feedback/Contact│     │ Center & Ticker │     │ & QR Check-In   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 📑 Phase Directory

| Document | Phase | Focus Areas | Key Endpoints / Models |
| :--- | :--- | :--- | :--- |
| [PHASE 1](./PHASE-1-FOUNDATION-CORS-SCHEMA.md) | **Foundation & Schemas** | CORS, Profile fields (`degree`, `year`), Event attributes (`slug`, `fee`, `stream`), Seed DB with 48 events | `app/core/config.py`, `Profile`, `Event` |
| [PHASE 2](./PHASE-2-EVENT-DISCOVERY-REGISTRATION.md) | **Events & Registration** | Route by slug, Solo registration, Ticket code generation, Enriched `/registrations/me` & `/auth/me` | `GET /events/slug/{slug}`, `POST /registrations`, `ticket_code` |
| [PHASE 3](./PHASE-3-SQUADS-AND-TEAMS.md) | **Squads & Teams** | Event squads (Hackathon / Gaming), 8-char invite codes, email invite endpoints, member roster | `Team`, `POST /teams/{id}/invite`, `TeamDetailOut` |
| [PHASE 4](./PHASE-4-CHECKOUT-PAYMENTS.md) | **Checkout & Payments** | Fee calculations, UPI/QR transaction verification, move registrations from `pending` $\rightarrow$ `confirmed` | `Payment`, `POST /payments/create`, `POST /payments/verify` |
| [PHASE 5](./PHASE-5-GATE-OPERATIONS-QR-CHECKIN.md) | **Gate Operations & QR** | Physical attendee verification, camera QR scanner, rapid check-in, duplicate detection, station logs | `CheckInRecord`, `POST /checkin/scan`, `GET /checkin/history` |
| [PHASE 6](./PHASE-6-ADMIN-OPERATIONS-BROADCAST.md) | **Admin & Broadcasts** | Fest analytics, stream counts, Event Head winner publishing, live announcements & ticker API | `GET /admin/stats`, `POST /events/{id}/results`, `Announcement` |
| [PHASE 7](./PHASE-7-AUXILIARY-MODULES.md) | **Auxiliary Touchpoints** | Sponsorship & general inquiries form, post-event festival debrief & rating surveys | `POST /contact`, `POST /feedback` |

---

## 🛠️ Environment Prerequisites

### Backend (`vyuham-backend`)
* Python 3.11+
* FastAPI + SQLAlchemy 2.0 (asyncio) + asyncpg
* Supabase PostgreSQL

### Frontend (`Vyuham26_frontend`)
* Node.js 20+
* Vite 7 + React 19 + TypeScript
* Client runs on `http://localhost:5173`
