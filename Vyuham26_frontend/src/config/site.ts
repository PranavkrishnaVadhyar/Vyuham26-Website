import { useState, useEffect } from "react";

const REG_STORAGE_KEY = "vyuham26:registration_open";

/**
 * Returns whether registration is currently open.
 * Reads from localStorage if available in browser; otherwise defaults to false.
 *
 * localStorage is only a mirror: `syncRegistrationGateFromBackend()` keeps it
 * aligned with the backend `site_settings` table, which is the single
 * authoritative source for the registration gate.
 */
export function isRegistrationOpen(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const val = localStorage.getItem(REG_STORAGE_KEY);
    if (val !== null) {
      return val === "true";
    }
  } catch {
    // ignore security/quota errors
  }
  return false;
}

/** Mirror the gate into localStorage and notify all listeners. No backend call. */
function writeRegistrationOpen(open: boolean): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(REG_STORAGE_KEY, String(open));
      window.dispatchEvent(
        new CustomEvent("vyuham:reg_toggle", {
          detail: { open },
        })
      );
    }
  } catch {
    // ignore security/quota errors
  }
}

let regGateSyncInFlight: Promise<boolean> | null = null;

/**
 * Pull the registration gate from the backend (authoritative) and mirror it
 * into localStorage. Safe to call often: calls are single-flighted and the
 * mirror is only written when the value actually differs.
 * On network failure the current local value is kept.
 */
export function syncRegistrationGateFromBackend(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }
  if (regGateSyncInFlight) {
    return regGateSyncInFlight;
  }
  regGateSyncInFlight = import("@/lib/api")
    .then(({ adminApi }) => adminApi.getRegistrationStatus())
    .then((res) => {
      const remote = !!res?.reg_open;
      if (remote !== isRegistrationOpen()) {
        writeRegistrationOpen(remote);
      }
      return remote;
    })
    .catch(() => isRegistrationOpen())
    .finally(() => {
      regGateSyncInFlight = null;
    });
  return regGateSyncInFlight;
}

/**
 * Toggles or sets registration gate status.
 * Optimistically updates the local mirror, pushes the change to the backend;
 * if the push fails we re-pull the backend state so the UI can never diverge
 * from the authoritative value.
 */
export function setRegistrationOpen(open: boolean): void {
  writeRegistrationOpen(open);
  if (typeof window !== "undefined") {
    import("@/lib/api")
      .then(({ adminApi }) =>
        adminApi.setRegistrationStatus(open).catch(() => syncRegistrationGateFromBackend())
      )
      .catch(() => {});
  }
}

/**
 * React hook that returns live registration open status and auto-updates
 * when any admin toggles registration anywhere in the application.
 * Also re-syncs from the authoritative backend on mount.
 */
export function useRegistrationOpen(): boolean {
  const [open, setOpen] = useState<boolean>(isRegistrationOpen);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.open === "boolean") {
        setOpen(customEvent.detail.open);
      } else {
        setOpen(isRegistrationOpen());
      }
    };

    window.addEventListener("vyuham:reg_toggle", handleToggle);
    window.addEventListener("storage", handleToggle);

    // Authoritative source: refresh from the backend once on mount.
    syncRegistrationGateFromBackend().then((remote) => setOpen(remote));

    return () => {
      window.removeEventListener("vyuham:reg_toggle", handleToggle);
      window.removeEventListener("storage", handleToggle);
    };
  }, []);

  return open;
}

export const SITE_CONFIG = {
  // REG_OPEN: false
  get REG_OPEN(): boolean {
    return isRegistrationOpen();
  },
  set REG_OPEN(val: boolean) {
    setRegistrationOpen(val);
  },
  get SHOW_CORE_TEAM(): boolean {
    return isCoreTeamVisible();
  },
  set SHOW_CORE_TEAM(val: boolean) {
    setCoreTeamVisible(val);
  },
  get SHOW_SPONSORS(): boolean {
    return isSponsorsVisible();
  },
  set SHOW_SPONSORS(val: boolean) {
    setSponsorsVisible(val);
  },
  get STARRED_EVENTS(): string[] {
    return getStarredEvents();
  },
  set STARRED_EVENTS(val: string[]) {
    setStarredEvents(val);
  },
};

const CORE_STORAGE_KEY = "vyuham26:core_team_visible";
const SPONSORS_STORAGE_KEY = "vyuham26:sponsors_visible";

/**
 * Returns whether 'THE CORE' team section is visible.
 * Defaults to true.
 */
export function isCoreTeamVisible(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  try {
    const val = localStorage.getItem(CORE_STORAGE_KEY);
    if (val !== null) {
      return val === "true";
    }
  } catch {
    // ignore
  }
  return true;
}

/**
 * Toggles or sets 'THE CORE' team section visibility.
 * Persists to localStorage and notifies all components via custom event.
 */
export function setCoreTeamVisible(visible: boolean): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CORE_STORAGE_KEY, String(visible));
      window.dispatchEvent(
        new CustomEvent("vyuham:core_toggle", {
          detail: { visible },
        })
      );
      window.dispatchEvent(new Event("storage"));
    }
  } catch {
    // ignore
  }
}

/**
 * React hook that returns live 'THE CORE' team visibility status.
 */
export function useCoreTeamVisible(): boolean {
  const [visible, setVisible] = useState<boolean>(isCoreTeamVisible);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.visible === "boolean") {
        setVisible(customEvent.detail.visible);
      } else {
        setVisible(isCoreTeamVisible());
      }
    };

    window.addEventListener("vyuham:core_toggle", handleToggle);
    window.addEventListener("storage", handleToggle);

    return () => {
      window.removeEventListener("vyuham:core_toggle", handleToggle);
      window.removeEventListener("storage", handleToggle);
    };
  }, []);

  return visible;
}

/**
 * Returns whether 'BACKED BY' sponsors section is visible.
 * Defaults to true.
 */
export function isSponsorsVisible(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  try {
    const val = localStorage.getItem(SPONSORS_STORAGE_KEY);
    if (val !== null) {
      return val === "true";
    }
  } catch {
    // ignore
  }
  return true;
}

/**
 * Toggles or sets 'BACKED BY' sponsors section visibility.
 */
export function setSponsorsVisible(visible: boolean): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(SPONSORS_STORAGE_KEY, String(visible));
      window.dispatchEvent(
        new CustomEvent("vyuham:sponsors_toggle", {
          detail: { visible },
        })
      );
      window.dispatchEvent(new Event("storage"));
    }
  } catch {
    // ignore
  }
}

/**
 * React hook that returns live 'BACKED BY' sponsors section visibility status.
 */
export function useSponsorsVisible(): boolean {
  const [visible, setVisible] = useState<boolean>(isSponsorsVisible);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.visible === "boolean") {
        setVisible(customEvent.detail.visible);
      } else {
        setVisible(isSponsorsVisible());
      }
    };

    window.addEventListener("vyuham:sponsors_toggle", handleToggle);
    window.addEventListener("storage", handleToggle);

    return () => {
      window.removeEventListener("vyuham:sponsors_toggle", handleToggle);
      window.removeEventListener("storage", handleToggle);
    };
  }, []);

  return visible;
}

/* -------------------------------------------------------------------------- */
/*  STARRED / MAIN PAGE EVENTS CONFIGURATION                                  */
/* -------------------------------------------------------------------------- */

const STARRED_STORAGE_KEY = "vyuham26:starred_events";

/**
 * Default flagship events highlighted on the main stage before admin overrides.
 */
export const DEFAULT_STARRED_EVENTS: string[] = [
  "hackathon",
  "best-manager",
  "valorant",
  "concert",
];

export function normalizeEventSlug(idOrSlug: string): string {
  if (!idOrSlug) return "";
  return idOrSlug.replace(/^ev-/, "").trim().toLowerCase();
}

/**
 * Returns the list of event slugs currently starred for Main Page showcase.
 */
export function getStarredEvents(): string[] {
  if (typeof window === "undefined") {
    return DEFAULT_STARRED_EVENTS;
  }
  try {
    const val = localStorage.getItem(STARRED_STORAGE_KEY);
    if (val !== null) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeEventSlug).filter(Boolean);
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_STARRED_EVENTS;
}

/**
 * Checks whether an event (by slug or id) is starred for Main Page showcase.
 */
export function isEventStarred(idOrSlug: string): boolean {
  const norm = normalizeEventSlug(idOrSlug);
  return getStarredEvents().includes(norm);
}

/**
 * Persists the entire list of starred event slugs and broadcasts change.
 */
export function setStarredEvents(slugs: string[]): void {
  try {
    if (typeof window !== "undefined") {
      const unique = Array.from(new Set(slugs.map(normalizeEventSlug).filter(Boolean)));
      localStorage.setItem(STARRED_STORAGE_KEY, JSON.stringify(unique));
      window.dispatchEvent(
        new CustomEvent("vyuham:starred_events_toggle", {
          detail: { slugs: unique },
        })
      );
      window.dispatchEvent(new Event("storage"));
    }
  } catch {}
}

/**
 * Stars or unstars a single event by id/slug.
 */
export function setEventStarred(idOrSlug: string, starred: boolean): void {
  const norm = normalizeEventSlug(idOrSlug);
  if (!norm) return;
  const current = getStarredEvents();
  const next = starred
    ? Array.from(new Set([...current, norm]))
    : current.filter((s) => s !== norm);
  setStarredEvents(next);
}

/**
 * Toggles starred status for an event. Returns true if newly starred, false if unstarred.
 */
export function toggleEventStarred(idOrSlug: string): boolean {
  const norm = normalizeEventSlug(idOrSlug);
  if (!norm) return false;
  const current = getStarredEvents();
  const isCurrently = current.includes(norm);
  const nextStarred = !isCurrently;
  setEventStarred(norm, nextStarred);
  return nextStarred;
}

/**
 * React hook that returns live starred event slugs and mutation utilities.
 * Synchronizes instantly across admin and public pages without page reloads.
 */
export function useStarredEvents() {
  const [starredSlugs, setStarredSlugs] = useState<string[]>(getStarredEvents);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ slugs?: string[] }>;
      if (customEvent.detail && Array.isArray(customEvent.detail.slugs)) {
        setStarredSlugs(customEvent.detail.slugs);
      } else {
        setStarredSlugs(getStarredEvents());
      }
    };

    window.addEventListener("vyuham:starred_events_toggle", handleToggle);
    window.addEventListener("storage", handleToggle);

    return () => {
      window.removeEventListener("vyuham:starred_events_toggle", handleToggle);
      window.removeEventListener("storage", handleToggle);
    };
  }, []);

  const isStarred = (idOrSlug: string) => {
    const norm = normalizeEventSlug(idOrSlug);
    return starredSlugs.includes(norm);
  };

  const toggleStar = (idOrSlug: string) => {
    return toggleEventStarred(idOrSlug);
  };

  const setStar = (idOrSlug: string, starred: boolean) => {
    setEventStarred(idOrSlug, starred);
  };

  return {
    starredSlugs,
    isStarred,
    toggleStar,
    setStar,
  };
}

