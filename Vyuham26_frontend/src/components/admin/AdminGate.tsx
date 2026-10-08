import { useEffect } from "react";
import { navigate, markInternalNav } from "@/lib/router";

interface AdminGateProps {
  onUnlock?: () => void;
}

/**
 * AdminGate — Conceals administrative core.
 * Any unauthorized direct access is immediately and silently bounced back to the home page.
 */
export default function AdminGate({ onUnlock: _onUnlock }: AdminGateProps) {
  useEffect(() => {
    try {
      window.history.replaceState(null, "", "/");
    } catch {}
    window.location.hash = "";
    if (window.location.pathname !== "/") {
      window.location.replace("/");
    } else {
      markInternalNav();
      navigate("/", { replace: true });
    }
  }, []);

  return null;
}
