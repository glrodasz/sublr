import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const GUARD_KEY = "sublr.materialized";

/**
 * Fire-and-forget trigger for POST /api/transactions/materialize on dashboard
 * mount. The endpoint is idempotent (deterministic occurrence ids), so the
 * sessionStorage guard only exists to avoid a redundant request per navigation
 * — not for correctness. Deliberately not wired into login (/api/firebase).
 */
export function useMaterialize() {
  const { user } = useUser();

  useEffect(() => {
    if (!user?.sub) return;
    try {
      if (sessionStorage.getItem(GUARD_KEY)) return;
      sessionStorage.setItem(GUARD_KEY, "1");
    } catch {
      // Storage unavailable — fall through and rely on idempotency.
    }

    fetch("/api/transactions/materialize", { method: "POST" }).catch((err) => {
      console.error("materialize failed:", err);
      try {
        sessionStorage.removeItem(GUARD_KEY);
      } catch {
        // ignore
      }
    });
  }, [user?.sub]);
}
