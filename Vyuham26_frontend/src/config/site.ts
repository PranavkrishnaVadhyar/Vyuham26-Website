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
};
