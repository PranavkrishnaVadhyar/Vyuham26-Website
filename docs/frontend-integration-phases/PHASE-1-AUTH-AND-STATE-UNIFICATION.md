# 🟢 PHASE 1: Authentication & State Unification

> **Priority:** CRITICAL (Foundation for user sessions, role-based UI, and authorized API requests)  
> **Target Systems:** `Vyuham26_frontend` (`src/context/AuthContext.tsx`, `src/lib/api.ts`, `src/lib/store.tsx`, `src/pages/profile/page.tsx`)  
> **Backend Contract:** `vyuham-backend` (`GET /auth/me`, `PATCH /auth/me`, `POST /auth/assign-role`)

---

## 🎯 Objectives

1. Eliminate the "split-brain" user state between [`src/context/AuthContext.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/context/AuthContext.tsx) and [`src/lib/store.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/store.tsx) by making `AuthContext` the sole authority on authentication.
2. Synchronize the frontend profile model with the FastAPI backend database fields: `college`, `degree`, `year`, `phone`, `role`, and computed `vyuham_id`.
3. Support the full backend role spectrum: `user` (backend `participant`), `volunteer`, `event_head`, and `admin`.
4. Ensure every API request initiated through [`src/lib/api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts) automatically attaches the verified Supabase Bearer JWT.
5. Connect the Profile Dossier editor ([`src/pages/profile/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/profile/page.tsx)) directly to `PATCH /auth/me`.

---

## 📋 Target Files & Required Modifications

### 1.1 Type & Role Alignment in `AuthContext.tsx`

* **File:** [`Vyuham26_frontend/src/context/AuthContext.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/context/AuthContext.tsx)
* **Changes:**
  * Update `AuthUser` interface to recognize the four system roles:
    ```typescript
    export interface AuthUser {
      id: string;
      name: string;
      email: string;
      college?: string;
      phone?: string;
      degree?: string;
      year?: string;
      role: "user" | "volunteer" | "event_head" | "admin";
      registeredEvents: string[]; // List of event slugs or UUIDs
      vyuham_id?: string;
      vyuhamId?: string;
    }
    ```
  * In `signup()` and `login()`, ensure metadata fields are passed to Supabase auth metadata and synced to `authApi.updateProfile()`.
  * Ensure `fetchBackendProfile()` safely parses backend `ProfileOut`:
    ```typescript
    async function fetchBackendProfile(): Promise<Partial<AuthUser> | null> {
      try {
        const profile = await authApi.getMe();
        return {
          id: profile.id,
          name: profile.name || "OPERATIVE",
          email: profile.email,
          college: profile.college || "Digital University Kerala",
          phone: profile.phone || "",
          degree: profile.degree || "",
          year: profile.year || "",
          role: (profile.role === "participant" ? "user" : profile.role) || "user",
          vyuham_id: profile.vyuham_id || profile.vyuhamId,
          vyuhamId: profile.vyuhamId || profile.vyuham_id,
        };
      } catch (err) {
        console.warn("Could not fetch backend profile:", err);
        return null;
      }
    }
    ```

---

### 1.2 Enhanced API Client in `src/lib/api.ts`

* **File:** [`Vyuham26_frontend/src/lib/api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts)
* **Modifications:**
  * Ensure `authApi` exposes typed methods matching backend `app/modules/auth/router.py`:
    ```typescript
    export interface ProfileUpdatePayload {
      name?: string;
      phone?: string;
      college?: string;
      degree?: string;
      year?: string;
    }

    export const authApi = {
      getMe: () => apiFetch<ProfileOut>("/auth/me"),
      updateProfile: (data: ProfileUpdatePayload) =>
        apiFetch<ProfileOut>("/auth/me", {
          method: "PATCH",
          body: JSON.stringify(data),
        }),
      assignRole: (userId: string, role: string) =>
        apiFetch<ProfileOut>("/auth/assign-role", {
          method: "POST",
          body: JSON.stringify({ user_id: userId, role }),
        }),
    };
    ```

---

### 1.3 Profile Dossier Synchronization (`src/pages/profile/page.tsx`)

* **File:** [`Vyuham26_frontend/src/pages/profile/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/profile/page.tsx)
* **Current Issue:** Uses local mock state or `updateUser()` without feedback handling for network failures.
* **Modifications:**
  * In `handleSave`:
    ```typescript
    const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await updateUser({
          name: profile.name,
          phone: profile.phone,
          college: profile.college,
          degree: profile.degree,
          year: profile.year,
        });
        setSaved(true);
        toast("Personnel dossier synchronized with Central Command.", "ok");
        setTimeout(() => setSaved(false), 3500);
      } catch (err: any) {
        toast(`Synchronization failed: ${err.message || "Network error"}`, "error");
      }
    };
    ```

---

### 1.4 Deprecating Mock Auth in `src/lib/store.tsx`

* **File:** [`Vyuham26_frontend/src/lib/store.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/store.tsx)
* **Current Issue:** Contains hardcoded `seedUsers`, separate `login()`, `signup()`, and `localStorage` session keys (`vyuham26:session:v1`) which diverge from Supabase sessions.
* **Modifications:**
  * Route `useApp().login` and `useApp().signup` directly to `auth.login` and `auth.signup` from `useAuth()`.
  * Ensure `useApp().user` derives directly from `auth.user` rather than querying `seedUsers`.

---

## 📡 Backend Verification Contract

| Method | Endpoint | Expected Headers | Request Body | Expected Response (HTTP 200) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/auth/me` | `Authorization: Bearer <JWT>` | *None* | `{ "id": "uuid", "email": "...", "name": "...", "college": "...", "degree": "...", "year": "...", "role": "user", "vyuham_id": "VYU26-OPER-XXXX" }` |
| `PATCH`| `/auth/me` | `Authorization: Bearer <JWT>` | `{ "college": "DUK", "degree": "M.Tech", "year": "2024-2026" }` | Enriched updated `ProfileOut` object |

---

## ✅ Phase 1 Checklist & Acceptance Testing

- [ ] **1. Sign Up**: Open `http://localhost:5173`, create a new account with email & password. Verify the user appears in Supabase Authentication and a corresponding row exists in PostgreSQL `profiles`.
- [ ] **2. Login & Token Injection**: Log in on the client. Inspect the browser Network tab for any API call; verify the `Authorization: Bearer eyJ...` header is present.
- [ ] **3. Profile Dossier Update**: Navigate to `/profile`, edit Degree to `M.Tech Cyber Security`, Year to `2024–2026`, and click Save. Verify that a `PATCH http://localhost:8000/auth/me` returns HTTP 200 with updated fields.
- [ ] **4. Refresh Persistence**: Refresh the browser page on `/profile`. Verify that the updated Degree and Year remain persisted directly from the backend database.
