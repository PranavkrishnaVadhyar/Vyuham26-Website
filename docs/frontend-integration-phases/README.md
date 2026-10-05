# ⚡ VYUHAM '26 — Frontend to Backend Integration Roadmap

This directory provides the definitive, phase-by-phase implementation blueprints for upgrading the **React 19 + Vite + TypeScript frontend (`Vyuham26_frontend`)** to connect seamlessly with the **FastAPI + Supabase PostgreSQL backend (`vyuham-backend`)**.

---

## 🗺️ Master Integration Progression Matrix

```text
┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│          PHASE 1          │ ──> │          PHASE 2          │ ──> │          PHASE 3          │
│ Auth & State Unification  │     │ Dynamic Events & Register │     │ Squads & Teams System     │
│ (Supabase + FastAPI Sync) │     │ (Live Catalog & Dashboard)│     │ (8-Char Codes & Roster)   │
└───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘
                                                                                  │
┌───────────────────────────┐     ┌───────────────────────────┐     ┌─────────────┴─────────────┐
│          PHASE 6          │ <── │          PHASE 5          │ <── │          PHASE 4          │
│ Admin Center & Results    │     │ Gate Operations & Scanner │     │ Checkout & Payments Flow  │
│ (Live Stats & Winners)    │     │ (Camera QR + Check-In API)│     │ (Orders, UPI & Receipts)  │
└───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘
              │
              ▼
┌───────────────────────────┐
│          PHASE 7          │
│ Broadcasts & Auxiliary    │
│ (Ticker, Contact, Feedback)
└───────────────────────────┘
```

---

## 📑 Phase Directory

| Phase Document | Focus Domain | Key Pages & Components | Target Backend APIs | Status |
| :--- | :--- | :--- | :--- | :--- |
| **[PHASE 1](./PHASE-1-AUTH-AND-STATE-UNIFICATION.md)** | **Auth & State Unification** | `src/context/AuthContext.tsx`<br>`src/pages/profile/page.tsx`<br>`src/lib/api.ts` | `GET /auth/me`<br>`PATCH /auth/me`<br>`POST /auth/assign-role` | ✅ **Completed** |
| **[PHASE 2](./PHASE-2-EVENT-DISCOVERY-AND-REGISTRATION.md)** | **Dynamic Events & Registrations** | `src/pages/events/[slug]/EventDetailClient.tsx`<br>`src/pages/dashboard/page.tsx`<br>`src/pages/ticket/page.tsx` | `GET /events`<br>`GET /events/by-slug/{slug}`<br>`POST /registrations`<br>`GET /registrations/me` | ✅ **Completed** |
| **[PHASE 3](./PHASE-3-SQUADS-AND-TEAMS-WORKFLOW.md)** | **Squads & Teams System** | `src/pages/teams/page.tsx`<br>`src/components/teams/*` | `POST /teams`<br>`POST /teams/join`<br>`GET /teams/me`<br>`GET /teams/{team_id}` | ✅ **Completed** |
| **[PHASE 4](./PHASE-4-CHECKOUT-AND-PAYMENTS-FLOW.md)** | **Checkout, Orders & Payments** | `src/pages/checkout/page.tsx`<br>`src/pages/payment/page.tsx`<br>`src/pages/receipt/page.tsx`<br>`src/pages/confirmation/page.tsx` | `POST /payments/create`<br>`POST /payments/verify`<br>`GET /payments/receipt/{ref}` | ✅ **Completed** |
| **[PHASE 5](./PHASE-5-GATE-OPERATIONS-AND-QR-SCANNER.md)** | **Gate Operations & Scanner** | `src/pages/volunteer/page.tsx`<br>`src/pages/checkin/page.tsx`<br>`src/lib/cyberAudio.ts` | `POST /checkin/scan`<br>`GET /checkin/history` | ✅ **Completed** |
| **[PHASE 6](./PHASE-6-ADMIN-COMMAND-AND-RESULTS.md)** | **Admin Metrics & Results** | `src/pages/admin/page.tsx`<br>`src/pages/admin/event-head/page.tsx`<br>`src/pages/results/page.tsx` | `GET /admin/stats`<br>`POST /events/{id}/results`<br>`GET /events/results` | ✅ **Completed** |
| **[PHASE 7](./PHASE-7-BROADCASTS-AND-AUXILIARY-MODULES.md)** | **Live Ticker & Auxiliary** | `src/components/ui/BroadcastTicker.tsx`<br>`src/pages/announcements/page.tsx`<br>`src/pages/contact/page.tsx`<br>`src/pages/feedback/page.tsx` | `GET /announcements`<br>`POST /contact`<br>`POST /feedback` | ✅ **Completed** |

---

## 🏗️ Architectural Alignment Blueprint

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT ARCHITECTURE                    │
│                                                                        │
│  ┌────────────────────────┐             ┌───────────────────────────┐  │
│  │     Supabase Auth      │ ──────────> │   AuthContext.tsx         │  │
│  │ (Session, JWT Tokens)  │             │ (Single Source of Identity)│  │
│  └────────────────────────┘             └─────────────┬─────────────┘  │
│                │                                      │                │
│                ▼                                      ▼                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 src/lib/api.ts (HTTP Client Wrapper)             │  │
│  │       - Injects 'Authorization: Bearer <Supabase_JWT>'           │  │
│  │       - Exposes authApi, eventsApi, registrationsApi, teamsApi,  │  │
│  │         paymentsApi, checkinApi, adminApi, auxiliaryApi          │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │
                                      ▼ JSON / REST (port 8000)
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER ARCHITECTURE                     │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               FastAPI Gateway (app.main:app)                     │  │
│  │          - CORS (localhost:5173 allowed)                         │  │
│  │          - Supabase JWT verification & Current User dependency   │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│         ┌──────────────┬────────────┴───┬──────────────┬────────────┐  │
│         ▼              ▼                ▼              ▼            ▼  │
│    /auth/*        /events/*      /registrations/*   /teams/*   /payments*
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 Supabase PostgreSQL Database                      │  │
│  │      profiles | events | registrations | teams | payments | ...  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Execution Guidelines

1. Execute phases **sequentially** from Phase 1 through Phase 7.
2. In each phase, inspect the target files, apply the typed client updates in `src/lib/api.ts`, and replace mock/hardcoded state with reactive API hooks.
3. Validate each phase against the **Acceptance Checklist** before proceeding to subsequent phases.
