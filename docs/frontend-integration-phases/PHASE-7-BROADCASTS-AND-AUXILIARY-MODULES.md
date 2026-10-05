# 🔘 PHASE 7: Live Broadcasts & Auxiliary Modules Flow

> **Priority:** LOW-MEDIUM (Live emergency campus bulletins, ticker updates, sponsorship inquiries, and festival debrief surveys)  
> **Target Systems:** `Vyuham26_frontend` (`src/components/ui/BroadcastTicker.tsx`, `src/pages/announcements/page.tsx`, `src/pages/contact/page.tsx`, `src/pages/feedback/page.tsx`, `src/lib/api.ts`)  
> **Backend Contract:** `vyuham-backend` (`GET /announcements`, `POST /announcements`, `POST /contact`, `POST /feedback`)

---

## 🎯 Objectives

1. Replace static mock announcements in [`src/components/ui/BroadcastTicker.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/ui/BroadcastTicker.tsx) and [`src/pages/announcements/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/announcements/page.tsx) with live broadcasts fetched from `GET /announcements`.
2. Connect the Sponsorship & Partner Inquiries form ([`src/pages/contact/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/contact/page.tsx)) to `POST /contact`.
3. Connect the Festival Debrief survey form ([`src/pages/feedback/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/feedback/page.tsx)) to `POST /feedback`.

---

## 📋 Target Files & Required Modifications

### 7.1 Broadcast & Auxiliary Clients in `src/lib/api.ts`

* **File:** [`Vyuham26_frontend/src/lib/api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts)
* **Changes:**
  * Define `AnnouncementRecord`, `ContactPayload`, and `FeedbackPayload` schemas and expose `announcementsApi` and `auxiliaryApi`:
    ```typescript
    export interface AnnouncementRecord {
      id: string;
      title: string;
      content: string;
      category: string;
      urgent: boolean;
      stream: string;
      pinned: boolean;
      created_at: string;
    }

    export const announcementsApi = {
      list: () => apiFetch<AnnouncementRecord[]>("/announcements"),
      create: (payload: { title: string; content: string; category?: string; urgent?: boolean; stream?: string; pinned?: boolean }) =>
        apiFetch<AnnouncementRecord>("/announcements", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
    };

    export const auxiliaryApi = {
      submitContact: (payload: {
        name: string;
        organization: string;
        email: string;
        phone: string;
        tier: string;
        message: string;
      }) =>
        apiFetch<{ ok: boolean; message: string }>("/contact", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      submitFeedback: (payload: { rating: number; comments: string; user_id?: string }) =>
        apiFetch<{ ok: boolean; message: string }>("/feedback", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
    };
    ```

---

### 7.2 Live Broadcast Ticker (`src/components/ui/BroadcastTicker.tsx`)

* **File:** [`Vyuham26_frontend/src/components/ui/BroadcastTicker.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/components/ui/BroadcastTicker.tsx)
* **Current Issue:** Lines 68–77 read `content.announcements` from local `store.tsx`.
* **Modifications:**
  * Fetch bulletins from `announcementsApi.list()` on mount, with polling every 30 seconds for live transmissions:
    ```typescript
    import { useEffect, useState } from "react";
    import { announcementsApi, AnnouncementRecord } from "@/lib/api";

    export default function BroadcastTicker({ visible = true }: { visible?: boolean }) {
      const [bulletins, setBulletins] = useState<AnnouncementRecord[]>([]);

      useEffect(() => {
        const fetchBulletins = () => {
          announcementsApi.list()
            .then((data) => {
              if (data && data.length > 0) setBulletins(data);
            })
            .catch((err) => console.warn("Could not fetch ticker broadcasts:", err));
        };

        fetchBulletins();
        const poll = setInterval(fetchBulletins, 30000); // 30s background sync
        return () => clearInterval(poll);
      }, []);

      // ... cycle through bulletins and display modal
    }
    ```

---

### 7.3 Public Inquiries Submission (`src/pages/contact/page.tsx`)

* **File:** [`Vyuham26_frontend/src/pages/contact/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/contact/page.tsx)
* **Current Issue:** `handleSubmit` merely sets `submitted = true`.
* **Modifications:**
  * Submit form via `auxiliaryApi.submitContact`:
    ```typescript
    import { auxiliaryApi } from "@/lib/api";
    import { toast } from "@/components/ui/Toaster";

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await auxiliaryApi.submitContact(formData);
        setSubmitted(true);
        toast("Partnership dossier received by Central Logistics.", "ok");
      } catch (err: any) {
        toast(`Submission failed: ${err.message || "Network error"}`, "error");
      } finally {
        setIsSubmitting(false);
      }
    };
    ```

---

### 7.4 Festival Debrief Survey (`src/pages/feedback/page.tsx`)

* **File:** [`Vyuham26_frontend/src/pages/feedback/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/feedback/page.tsx)
* **Current Issue:** `handleSubmit` merely sets `submitted = true`.
* **Modifications:**
  * Submit debrief via `auxiliaryApi.submitFeedback`:
    ```typescript
    import { auxiliaryApi } from "@/lib/api";
    import { useAuth } from "@/context/AuthContext";
    import { toast } from "@/components/ui/Toaster";

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await auxiliaryApi.submitFeedback({
          rating,
          comments,
          user_id: user?.id,
        });
        setSubmitted(true);
        toast("Debrief logged into festival record.", "ok");
      } catch (err: any) {
        toast(`Submission error: ${err.message || "Network error"}`, "error");
      }
    };
    ```

---

## 📡 Backend Verification Contract

| Method | Endpoint | Request Body | Response (HTTP 200/201) |
| :--- | :--- | :--- | :--- |
| `GET` | `/announcements` | *None* | `[ { "id": "...", "title": "DUK Technocity Gates Open", "urgent": false } ]` |
| `POST` | `/contact` | `{ "name": "Jane", "organization": "TechCorp", "email": "...", "message": "..." }` | `{ "ok": true, "message": "Inquiry recorded" }` |
| `POST` | `/feedback` | `{ "rating": 5, "comments": "Phenomenal CTF infrastructure" }` | `{ "ok": true, "message": "Debrief submitted successfully" }` |

---

## ✅ Phase 7 Checklist & Acceptance Testing

- [ ] **1. Live Ticker Verification**: Add an announcement on the backend. Confirm it appears within 30 seconds on the top ticker banner and modal without a page reload.
- [ ] **2. Contact Inquiries**: Navigate to `/contact`, fill in organization details and sponsorship tier, and submit. Verify that `POST /contact` returns HTTP 201 and shows confirmation.
- [ ] **3. Feedback Survey**: Navigate to `/feedback`, complete the 2-step debrief, and submit. Verify that `POST /feedback` returns HTTP 201.
