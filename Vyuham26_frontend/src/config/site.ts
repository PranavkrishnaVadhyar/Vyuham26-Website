import { useState, useEffect } from "react";

const REG_STORAGE_KEY = "vyuham26:registration_open";

/**
 * Returns whether registration is currently open.
 * Reads from localStorage if available in browser; otherwise defaults to false.
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

/**
 * Toggles or sets registration gate status.
 * Persists to localStorage and notifies all components via custom event.
 */
export function setRegistrationOpen(open: boolean): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(REG_STORAGE_KEY, String(open));
      window.dispatchEvent(
        new CustomEvent("vyuham:reg_toggle", {
          detail: { open },
        })
      );
      // Synchronize with backend if API is reachable
      import("@/lib/api")
        .then(({ adminApi }) => {
          adminApi.setRegistrationStatus(open).catch(() => {});
        })
        .catch(() => {});
    }
  } catch {
    // ignore security/quota errors
  }
}

/**
 * React hook that returns live registration open status and auto-updates
 * when any admin toggles registration anywhere in the application.
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

