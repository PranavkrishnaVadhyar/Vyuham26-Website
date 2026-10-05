# ⚪ PHASE 6: Admin Command Center, Results & Live Leaderboards

> **Priority:** MEDIUM (Required for fest administrators, event head score reporting, and public competition results)  
> **Target Systems:** `Vyuham26_frontend` (`src/pages/admin/page.tsx`, `src/pages/admin/event-head/page.tsx`, `src/pages/results/page.tsx`, `src/lib/api.ts`)  
> **Backend Contract:** `vyuham-backend` (`GET /admin/stats`, `POST /events/{event_id}/results`, `GET /events/results`)

---

## 🎯 Objectives

1. Replace the static numbers on the Admin Dashboard ([`src/pages/admin/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/admin/page.tsx)) with real-time aggregate statistics fetched from `GET /admin/stats`.
2. Connect the Event Head Portal ([`src/pages/admin/event-head/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/admin/event-head/page.tsx)) to publish winners directly to PostgreSQL via `POST /events/{id}/results`.
3. Dynamically populate the public Winners Dossier ([`src/pages/results/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/results/page.tsx)) using `GET /events/results`.
4. Enforce strict role authorization so only `admin` and `event_head` accounts can access privileged consoles.

---

## 📋 Target Files & Required Modifications

### 6.1 Admin & Results Client in `src/lib/api.ts`

* **File:** [`Vyuham26_frontend/src/lib/api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts)
* **Changes:**
  * Define `AdminStats` and `EventResult` schemas and expose `adminApi`:
    ```typescript
    export interface StreamMetrics {
      total_registrations: number;
      total_revenue: number;
      total_checkins: number;
      active_events: number;
    }

    export interface AdminStatsResponse {
      all: StreamMetrics;
      tech: StreamMetrics;
      culture: StreamMetrics;
      gaming: StreamMetrics;
    }

    export interface EventResultRecord {
      event_id: string;
      event_name: string;
      stream: string;
      first_place: string;
      second_place: string;
      third_place?: string;
      prize_distributed?: string;
      published_at: string;
    }

    export const adminApi = {
      getStats: () => apiFetch<AdminStatsResponse>("/admin/stats"),
      publishResults: (eventId: string, payload: {
        first_place: string;
        second_place: string;
        third_place?: string;
        prize_distributed?: string;
      }) =>
        apiFetch<EventResultRecord>(`/events/${eventId}/results`, {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      getResults: () => apiFetch<EventResultRecord[]>("/events/results"),
    };
    ```

---

### 6.2 Live Telemetry in `src/pages/admin/page.tsx`

* **File:** [`Vyuham26_frontend/src/pages/admin/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/admin/page.tsx)
* **Current Issue:** Lines 15–20 define a hardcoded `metrics` dictionary.
* **Modifications:**
  * Fetch aggregate metrics from `adminApi.getStats()` on mount:
    ```typescript
    import { useEffect, useState } from "react";
    import { adminApi, AdminStatsResponse } from "@/lib/api";
    import { useAuth } from "@/context/AuthContext";
    import { toast } from "@/components/ui/Toaster";

    export default function AdminDashboardPage() {
      const { user } = useAuth();
      const [filter, setFilter] = useState<"all" | "tech" | "culture" | "gaming">("all");
      const [stats, setStats] = useState<AdminStatsResponse | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        adminApi.getStats()
          .then((data) => setStats(data))
          .catch((err) => toast(`Stats error: ${err.message}`, "error"))
          .finally(() => setLoading(false));
      }, []);

      const currentMetrics = stats ? stats[filter] : {
        total_registrations: 0,
        total_revenue: 0,
        total_checkins: 0,
        active_events: 0,
      };

      // ... format numbers (e.g. currency string "₹" + currentMetrics.total_revenue.toLocaleString('en-IN'))
    }
    ```

---

### 6.3 Event Head Score Reporting (`src/pages/admin/event-head/page.tsx`)

* **File:** [`Vyuham26_frontend/src/pages/admin/event-head/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/admin/event-head/page.tsx)
* **Current Issue:** Dummy `setTimeout` in `handlePublish`.
* **Modifications:**
  * Load assigned events and submit results via `adminApi.publishResults`:
    ```typescript
    const handlePublish = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedEventId) return;

      try {
        await adminApi.publishResults(selectedEventId, {
          first_place: winner,
          second_place: runnerUp,
          third_place: thirdPlace,
          prize_distributed: prizeDistributed,
        });
        setSaved(true);
        toast("Official winners published to public registry & certificates!", "ok");
        setTimeout(() => setSaved(false), 3000);
      } catch (err: any) {
        toast(`Publish error: ${err.message}`, "error");
      }
    };
    ```

---

### 6.4 Dynamic Winners Dossier (`src/pages/results/page.tsx`)

* **File:** [`Vyuham26_frontend/src/pages/results/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/results/page.tsx)
* **Modifications:**
  * Replace static `results` array with `adminApi.getResults()`.
  * Display official winners, prize payouts, and stream badges dynamically.

---

## 📡 Backend Verification Contract

| Method | Endpoint | Access Level | Response (HTTP 200) |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats` | Role: `admin` | `{ "all": { "total_registrations": 2480, "total_revenue": 684000.0, ... }, "tech": { ... } }` |
| `POST` | `/events/{id}/results` | Role: `admin`, `event_head` | `{ "event_id": "...", "first_place": "CyberVipers", "second_place": "ByteBusters", ... }` |
| `GET` | `/events/results` | Public | List of all published winners |

---

## ✅ Phase 6 Checklist & Acceptance Testing

- [ ] **1. Admin Analytics Inspection**: Log in as `admin@vyuham26.in`, open `/admin`. Verify that metric cards update with real counts from `GET /admin/stats`.
- [ ] **2. Stream Toggles**: Click between Tech, Culture, and Gaming filter tabs. Verify metric counts reactively switch to stream-specific totals.
- [ ] **3. Publish Competition Results**: In `/admin/event-head`, choose an event, enter winner names, and submit. Verify that an HTTP 200/201 response is returned.
- [ ] **4. Public Winners Dossier**: Navigate to `/results`. Confirm that the published winner appears dynamically in the public awards ledger.
