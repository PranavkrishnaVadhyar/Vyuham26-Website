# 🔵 PHASE 2: Dynamic Event Discovery & Registration Flow

> **Priority:** HIGH (Enables live festival catalog browsing, official database registrations, and live dashboard telemetry)  
> **Target Systems:** `Vyuham26_frontend` (`src/pages/events/[slug]/EventDetailClient.tsx`, `src/pages/events/page.tsx`, `src/pages/dashboard/page.tsx`, `src/pages/ticket/page.tsx`, `src/lib/api.ts`)  
> **Backend Contract:** `vyuham-backend` (`GET /events`, `GET /events/by-slug/{slug}`, `POST /registrations`, `GET /registrations/me`)

---

## 🎯 Objectives

1. Switch event exploration from static [`src/data/events.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/data/events.ts) to the live backend catalog (`GET /events` and `GET /events/by-slug/{slug}`).
2. Connect the "REGISTER PROTOCOL" button on event detail pages to `POST /registrations` with the event's database UUID.
3. Automatically update `AuthContext.user.registeredEvents` upon successful registration.
4. Replace hardcoded demo registrations on the Operative Dashboard ([`src/pages/dashboard/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/dashboard/page.tsx)) with real registrations retrieved from `GET /registrations/me`.
5. Display confirmed passes with unique `ticket_code` identifiers on the Ticket Page ([`src/pages/ticket/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/ticket/page.tsx)).

---

## 📋 Target Files & Required Modifications

### 2.1 Typed Event & Registration API Clients (`src/lib/api.ts`)

* **File:** [`Vyuham26_frontend/src/lib/api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts)
* **Changes:**
  * Define backend response schemas and enhance `eventsApi` and `registrationsApi`:
    ```typescript
    export interface EventRecord {
      id: string;
      name: string;
      slug: string;
      stream: "tech" | "culture" | "gaming" | "impact" | "management";
      registration_type: "solo" | "team";
      team_size_min?: number;
      team_size_max?: number;
      prize_amount?: number;
      venue?: string;
      fee?: string;
      day?: number;
      time?: string;
      rules?: string[];
      eligibility?: string;
      seats_total?: number;
      image?: string;
      featured: boolean;
      status: string;
      description?: string;
      title: string;
      prizes: string;
      teamSize: string;
    }

    export interface RegistrationRecord {
      id: string;
      event_id: string;
      user_id?: string;
      team_id?: string;
      status: "pending" | "confirmed" | "cancelled";
      ticket_code?: string;
      created_at: string;
    }

    export const eventsApi = {
      list: () => apiFetch<EventRecord[]>("/events"),
      getBySlug: (slug: string) => apiFetch<EventRecord>(`/events/by-slug/${slug}`),
      getById: (id: string) => apiFetch<EventRecord>(`/events/${id}`),
    };

    export const registrationsApi = {
      listMine: () => apiFetch<RegistrationRecord[]>("/registrations/me"),
      register: (payload: { event_id: string; team_id?: string }) =>
        apiFetch<RegistrationRecord>("/registrations", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      cancel: (registrationId: string) =>
        apiFetch<void>(`/registrations/${registrationId}`, {
          method: "DELETE",
        }),
    };
    ```

---

### 2.2 Dynamic Registration in `EventDetailClient.tsx`

* **File:** [`Vyuham26_frontend/src/pages/events/[slug]/EventDetailClient.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/events/%5Bslug%5D/EventDetailClient.tsx)
* **Current Issue:** Lines 45–50 call local `registerForEvent(event.slug)` which only alters `localStorage`.
* **Modifications:**
  * Fetch or resolve the event's backend UUID and submit via `registrationsApi.register`:
    ```typescript
    import { registrationsApi, eventsApi } from "@/lib/api";
    import { toast } from "@/components/ui/Toaster";

    const handleRegisterClick = async () => {
      if (!isAuthenticated) {
        navigate(`/login?redirect=/events/${event.slug}&intent=register`);
        return;
      }

      setIsRegistering(true);
      try {
        // Resolve backend UUID if missing on client
        let eventId = event.id;
        if (!eventId || eventId.startsWith("ev-")) {
          const remoteEvent = await eventsApi.getBySlug(event.slug);
          eventId = remoteEvent.id;
        }

        const registration = await registrationsApi.register({ event_id: eventId });
        
        // Update local session state
        registerForEvent(event.slug);
        
        toast(`Transmission Confirmed. Ticket registered for ${event.title}!`, "ok");
      } catch (err: any) {
        const errorMsg = err.message || "Registration failed";
        if (errorMsg.includes("already registered")) {
          registerForEvent(event.slug);
          toast("You are already registered for this protocol.", "warn");
        } else {
          toast(`Registration Error: ${errorMsg}`, "error");
        }
      } finally {
        setIsRegistering(false);
      }
    };
    ```

---

### 2.3 Live Registrations on Dashboard (`src/pages/dashboard/page.tsx`)

* **File:** [`Vyuham26_frontend/src/pages/dashboard/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/dashboard/page.tsx)
* **Current Issue:** Lines 222–244 attempt string comparisons between `slugOrId` and fallback to `defaultEvents`.
* **Modifications:**
  * Fetch real registrations from `registrationsApi.listMine()` alongside catalog events.
  * Map each registration ID $\rightarrow$ `Event` $\rightarrow$ Live timeline item:
    ```typescript
    const [myRegistrations, setMyRegistrations] = useState<RegistrationRecord[]>([]);
    const [allEvents, setAllEvents] = useState<EventRecord[]>([]);
    const [loadingRegs, setLoadingRegs] = useState(true);

    useEffect(() => {
      if (!isAuthenticated) return;
      Promise.all([registrationsApi.listMine(), eventsApi.list()])
        .then(([regs, eventsList]) => {
          setMyRegistrations(regs);
          setAllEvents(eventsList);
        })
        .catch((err) => console.warn("Failed to load dashboard registrations:", err))
        .finally(() => setLoadingRegs(false));
    }, [isAuthenticated]);

    const registeredEventsList = useMemo(() => {
      if (myRegistrations.length === 0) return [];
      
      return myRegistrations.map((reg, index) => {
        const matched = allEvents.find((e) => e.id === reg.event_id) || null;
        return {
          stream: (matched?.stream || "TECH").toUpperCase(),
          title: matched?.name || `OPERATION // ${reg.event_id.slice(0, 8)}`,
          venue: (matched?.venue || "MAIN CAMPUS ARENA").toUpperCase(),
          time: matched ? `DAY 0${matched.day || 1} // ${matched.time || "TBA"}` : "SCHEDULE PENDING",
          href: matched ? `/events/${matched.slug}` : "/events",
          action: "VIEW DOSSIER",
          code: reg.ticket_code || `EVT-${String(index + 1).padStart(3, "0")}`,
          status: reg.status,
        };
      });
    }, [myRegistrations, allEvents]);
    ```

---

### 2.4 Ticket Passes with Verified Ticket Codes (`src/pages/ticket/page.tsx`)

* **File:** [`Vyuham26_frontend/src/pages/ticket/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/ticket/page.tsx)
* **Modifications:**
  * Load user's latest confirmed registration ticket from `registrationsApi.listMine()`.
  * Display real `ticket_code` (e.g. `VYU26-TKT-1082`) in both the barcode simulation and the downloadable QR generator.

---

## 📡 Backend Verification Contract

| Method | Endpoint | Request Body | Response (HTTP 200/201) |
| :--- | :--- | :--- | :--- |
| `GET` | `/events/by-slug/hackathon` | *None* | `{ "id": "uuid", "name": "Hackathon 36", "slug": "hackathon", "fee": "₹500 / team", ... }` |
| `POST` | `/registrations` | `{ "event_id": "uuid" }` | `{ "id": "reg-uuid", "event_id": "uuid", "status": "pending", "created_at": "..." }` |
| `GET` | `/registrations/me` | *None* | `[ { "id": "reg-uuid", "event_id": "uuid", "status": "pending" } ]` |

---

## ✅ Phase 2 Checklist & Acceptance Testing

- [ ] **1. Event Catalog Inspection**: Navigate to `/events/hackathon`. Open browser Network tab and confirm that event details are retrieved from `http://localhost:8000/events/by-slug/hackathon`.
- [ ] **2. Solo Registration Execution**: Click "REGISTER PROTOCOL". Verify an HTTP 201 response is returned from `POST http://localhost:8000/registrations`.
- [ ] **3. Duplicate Guard**: Click "REGISTER PROTOCOL" again for the same event. Confirm that the UI reports duplicate status without crashing.
- [ ] **4. Live Dashboard Verification**: Navigate to `/dashboard`. Confirm that the newly registered event appears in the Operative Loadout table with the real venue and time from the database.
