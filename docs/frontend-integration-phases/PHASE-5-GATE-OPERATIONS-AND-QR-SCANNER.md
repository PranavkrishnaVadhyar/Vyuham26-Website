# 🔴 PHASE 5: Gate Operations & Volunteer QR Scanner Flow

> **Priority:** MEDIUM-HIGH (Required for on-ground festival verification, volunteer camera barcode scanning, and rapid attendee entry)  
> **Target Systems:** `Vyuham26_frontend` (`src/pages/volunteer/page.tsx`, `src/pages/checkin/page.tsx`, `src/lib/api.ts`, `src/lib/cyberAudio.ts`)  
> **Backend Contract:** `vyuham-backend` (`POST /checkin/scan`, `GET /checkin/history`)

---

## 🎯 Objectives

1. Connect the camera QR scanner and manual pass input on [`src/pages/volunteer/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/volunteer/page.tsx) directly to `POST /checkin/scan`.
2. Process live scan verdicts from the database: `approved`, `duplicate`, or `invalid`.
3. Trigger synthesized audio cues using [`playScanSound()`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/volunteer/page.tsx#L28-L74) based on the server response.
4. Replace local state logs with live station scan history queried from `GET /checkin/history?station=...`.
5. Enforce role-based access: Restrict access to operatives with role `volunteer`, `event_head`, or `admin`.

---

## 📋 Target Files & Required Modifications

### 5.1 Check-In Client in `src/lib/api.ts`

* **File:** [`Vyuham26_frontend/src/lib/api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts)
* **Changes:**
  * Define `ScanResult` and `CheckInRecord` and expose `checkinApi`:
    ```typescript
    export interface CheckInScanResponse {
      status: "approved" | "duplicate" | "invalid";
      ticket_code: string;
      attendee_name?: string;
      college?: string;
      event_name?: string;
      station: string;
      scanned_at: string;
      notes?: string;
    }

    export interface CheckInHistoryItem {
      id: string;
      ticket_code: string;
      attendee_name: string;
      college: string;
      event_name: string;
      station: string;
      scanned_by: string;
      status: "approved" | "duplicate" | "invalid";
      scanned_at: string;
    }

    export const checkinApi = {
      scanPass: (payload: { ticket_code: string; station: string }) =>
        apiFetch<CheckInScanResponse>("/checkin/scan", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      getHistory: (station?: string, limit = 50) => {
        const query = station ? `?station=${encodeURIComponent(station)}&limit=${limit}` : `?limit=${limit}`;
        return apiFetch<CheckInHistoryItem[]>(`/checkin/history${query}`);
      },
    };
    ```

---

### 5.2 Rewiring `processScannedValue` in `src/pages/volunteer/page.tsx`

* **File:** [`Vyuham26_frontend/src/pages/volunteer/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/volunteer/page.tsx)
* **Current Issue:** Lines 129–185 search against `checkins` and `registrations` in in-memory `useApp()` state.
* **Modifications:**
  * Call `checkinApi.scanPass` and handle results reactively:
    ```typescript
    import { checkinApi, CheckInScanResponse } from "@/lib/api";

    const processScannedValue = useCallback(
      async (rawPayload: string) => {
        const clean = rawPayload.trim();
        if (!clean) return;

        try {
          const res = await checkinApi.scanPass({
            ticket_code: clean,
            station,
          });

          // Play appropriate audio feedback
          playScanSound(res.status);

          // Update active scan card
          setActiveResult({
            status: res.status,
            ticketCode: res.ticket_code,
            attendeeName: res.attendee_name || "UNKNOWN OPERATIVE",
            college: res.college || "OUTSIDE INSTITUTION",
            eventName: res.event_name || "GENERAL FESTIVAL PASS",
            scannedAt: new Date(res.scanned_at).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          });

          if (res.status === "approved") {
            toast(`✓ ENTRY GRANTED: ${res.attendee_name}`, "ok");
          } else if (res.status === "duplicate") {
            toast(`⚠️ DUPLICATE ENTRY: Pass already scanned at ${station}`, "warn");
          } else {
            toast("⛔ INVALID PASS: No active registration found", "error");
          }

          // Refresh live station history log
          loadHistory();
        } catch (err: any) {
          playScanSound("invalid");
          toast(`Scanner error: ${err.message || "Network timeout"}`, "error");
        }
      },
      [station]
    );
    ```

---

### 5.3 Live Station History & Station Selector

* **File:** [`Vyuham26_frontend/src/pages/volunteer/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/volunteer/page.tsx)
* **Modifications:**
  * When `station` dropdown changes, reload station history:
    ```typescript
    const [history, setHistory] = useState<CheckInHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const loadHistory = useCallback(async () => {
      setLoadingHistory(true);
      try {
        const data = await checkinApi.getHistory(station);
        setHistory(data);
      } catch (err) {
        console.warn("Failed to load station history:", err);
      } finally {
        setLoadingHistory(false);
      }
    }, [station]);

    useEffect(() => {
      loadHistory();
    }, [loadHistory]);
    ```

---

## 📡 Backend Verification Contract

| Method | Endpoint | Request Body | Response (HTTP 200) |
| :--- | :--- | :--- | :--- |
| `POST` | `/checkin/scan` | `{ "ticket_code": "VYU26-TKT-1082", "station": "Gate 1 - Main Entrance" }` | `{ "status": "approved", "ticket_code": "VYU26-TKT-1082", "attendee_name": "ARJUN IYER", "college": "NIE", "event_name": "Hackathon 36", "station": "Gate 1", "scanned_at": "..." }` |
| `GET` | `/checkin/history?station=Gate%201` | *None* | `[ { "id": "...", "ticket_code": "VYU26-TKT-1082", "status": "approved", "scanned_at": "..." } ]` |

---

## ✅ Phase 5 Checklist & Acceptance Testing

- [ ] **1. Scanner Authorization**: Log in as a standard participant user and navigate to `/volunteer`. Verify that unauthorized access is blocked or redirected.
- [ ] **2. Valid Ticket Scan**: Log in as a volunteer/admin. Enter a valid registered `ticket_code` manually or scan via webcam. Verify response is `approved` and audio chime plays.
- [ ] **3. Duplicate Pass Prevention**: Scan the same code again immediately. Verify response status is `duplicate`, warning audio buzzer triggers, and previous scan timestamp is highlighted.
- [ ] **4. Station History Sync**: Check the Station Log below the scanner. Verify that the entry record is added with real timestamps and operative details.
