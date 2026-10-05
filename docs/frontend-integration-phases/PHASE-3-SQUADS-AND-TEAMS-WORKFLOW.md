# 🟣 PHASE 3: Squads & Teams System Workflow

> **Priority:** HIGH (Required for multiplayer competitions, 24H hackathons, CTF squads, and gaming tournaments)  
> **Target Systems:** `Vyuham26_frontend` (`src/pages/teams/page.tsx`, `src/lib/api.ts`, `src/pages/events/[slug]/EventDetailClient.tsx`)  
> **Backend Contract:** `vyuham-backend` (`POST /teams`, `POST /teams/join`, `GET /teams/me`, `GET /teams/{team_id}`)

---

## 🎯 Objectives

1. Replace the hardcoded `"CyberVipers"` squad state in [`src/pages/teams/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/teams/page.tsx) with live squad management connected to `vyuham-backend`.
2. Allow operatives to create a squad via `POST /teams`, generating an official **8-character invite code** (e.g. `K9X2LM4Q`).
3. Allow teammates to join an existing squad using the invite code via `POST /teams/join`.
4. Render the complete squad dossier (leader and members list) fetched from `GET /teams/{team_id}`.
5. In [`EventDetailClient.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/events/%5Bslug%5D/EventDetailClient.tsx), enable operatives to select an active squad when registering for team-based competitions (Hackathons, Gaming, CTF).

---

## 📋 Target Files & Required Modifications

### 3.1 Align Teams Client in `src/lib/api.ts`

* **File:** [`Vyuham26_frontend/src/lib/api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts)
* **Changes:**
  * Define `TeamSummary` and `TeamDetail` schemas and update `teamsApi`:
    ```typescript
    export interface TeamMemberRecord {
      user_id: string;
      email: string;
      name?: string;
      joined_at: string;
    }

    export interface TeamRecord {
      id: string;
      name: string;
      invite_code: string;
      created_by: string;
      created_at: string;
      member_count: number;
      members?: TeamMemberRecord[];
    }

    export const teamsApi = {
      listMine: () => apiFetch<TeamRecord[]>("/teams/me"),
      getById: (teamId: string) => apiFetch<TeamRecord>(`/teams/${teamId}`),
      create: (payload: { name: string }) =>
        apiFetch<TeamRecord>("/teams", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      join: (inviteCode: string) =>
        apiFetch<TeamRecord>("/teams/join", {
          method: "POST",
          body: JSON.stringify({ invite_code: inviteCode.trim().toUpperCase() }),
        }),
    };
    ```

---

### 3.2 Dynamic Squad Command Center (`src/pages/teams/page.tsx`)

* **File:** [`Vyuham26_frontend/src/pages/teams/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/teams/page.tsx)
* **Current Issue:** Uses hardcoded state (`squadName = "CyberVipers"`, static members array).
* **Modifications:**
  * Load user's squads dynamically via `teamsApi.listMine()`.
  * Support creating squads and joining via code:
    ```typescript
    import { useEffect, useState } from "react";
    import { teamsApi, TeamRecord } from "@/lib/api";
    import { useAuth } from "@/context/AuthContext";
    import { toast } from "@/components/ui/Toaster";

    export default function TeamsPage() {
      const { user, isAuthenticated } = useAuth();
      const [teams, setTeams] = useState<TeamRecord[]>([]);
      const [activeTeam, setActiveTeam] = useState<TeamRecord | null>(null);
      const [loading, setLoading] = useState(true);

      // Create & Join Inputs
      const [newSquadName, setNewSquadName] = useState("");
      const [joinCode, setJoinCode] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false);

      const loadTeams = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
          const list = await teamsApi.listMine();
          setTeams(list);
          if (list.length > 0) {
            // Load full member dossier for first team
            const fullTeam = await teamsApi.getById(list[0].id);
            setActiveTeam(fullTeam);
          } else {
            setActiveTeam(null);
          }
        } catch (err: any) {
          console.warn("Failed to load squads:", err);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        loadTeams();
      }, [isAuthenticated]);

      const handleCreateSquad = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSquadName.trim()) return;

        setIsSubmitting(true);
        try {
          const created = await teamsApi.create({ name: newSquadName.trim() });
          toast(`Squad "${created.name}" established! Invite Code: ${created.invite_code}`, "ok");
          setNewSquadName("");
          await loadTeams();
        } catch (err: any) {
          toast(err.message || "Failed to create squad", "error");
        } finally {
          setIsSubmitting(false);
        }
      };

      const handleJoinSquad = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinCode.trim()) return;

        setIsSubmitting(true);
        try {
          const joined = await teamsApi.join(joinCode.trim());
          toast(`Successfully enlisted into squad "${joined.name}"!`, "ok");
          setJoinCode("");
          await loadTeams();
        } catch (err: any) {
          toast(err.message || "Invalid squad invite code", "error");
        } finally {
          setIsSubmitting(false);
        }
      };

      const copyInviteCode = () => {
        if (activeTeam?.invite_code) {
          navigator.clipboard.writeText(activeTeam.invite_code);
          toast(`Invite code ${activeTeam.invite_code} copied to clipboard!`, "ok");
        }
      };

      // ... render squad controls, invite code badge, and member roster
    }
    ```

---

### 3.3 Team Registration Selection in `EventDetailClient.tsx`

* **File:** [`Vyuham26_frontend/src/pages/events/[slug]/EventDetailClient.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/events/%5Bslug%5D/EventDetailClient.tsx)
* **Changes:**
  * For events where `registration_type === "team"`, prompt the user to choose their squad from `teamsApi.listMine()`.
  * Pass `{ event_id: event.id, team_id: selectedTeam.id }` to `registrationsApi.register()`.
  * If the user has no squads, render a prompt with a direct link to `/teams` to form or join one.

---

## 📡 Backend Verification Contract

| Method | Endpoint | Request Body | Response (HTTP 200/201) |
| :--- | :--- | :--- | :--- |
| `POST` | `/teams` | `{ "name": "CyberVipers" }` | `{ "id": "uuid", "name": "CyberVipers", "invite_code": "V6X9Q2LM", "created_by": "user-uuid", "member_count": 1 }` |
| `POST` | `/teams/join` | `{ "invite_code": "V6X9Q2LM" }` | `{ "id": "uuid", "name": "CyberVipers", "invite_code": "V6X9Q2LM", "member_count": 2 }` |
| `GET` | `/teams/{id}` | *None* | `{ "id": "uuid", "name": "CyberVipers", "members": [ { "user_id": "...", "email": "...", "joined_at": "..." } ] }` |

---

## ✅ Phase 3 Checklist & Acceptance Testing

- [ ] **1. Create Squad**: Navigate to `/teams`. Enter squad name `QuantumGlitch` and submit. Verify that an 8-character invite code is generated.
- [ ] **2. Copy Code**: Click the copy button next to the invite code. Verify the code is copied to your clipboard.
- [ ] **3. Join Squad from Second User**: Log in with another test user in an incognito window. Navigate to `/teams`, paste the invite code, and submit. Verify both members appear on the squad roster.
- [ ] **4. Register Team for Hackathon**: On `/events/hackathon`, click Register, select the newly formed squad, and submit. Verify that `POST /registrations` returns HTTP 201 with `team_id` linked.
