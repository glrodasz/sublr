import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { useUser } from "@auth0/nextjs-auth0/client";
import { db } from "../../../firebase/client";
import { useFirebaseAuth } from "../../../hooks/useFirebaseAuth";
import type { RecurrentTransaction } from "../../../types";

export function useUpcomingItems(count: number = 5) {
  const { user } = useUser();
  const { ready } = useFirebaseAuth();
  const [items, setItems] = useState<RecurrentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ready || !user?.sub) return;

    const now = Timestamp.now();
    const q = query(
      collection(db, "recurrentTransactions"),
      where("userId", "==", user.sub),
      where("active", "==", true),
      where("nextOccurrence", ">", now),
      orderBy("nextOccurrence", "asc"),
      limit(count)
    );

    return onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as RecurrentTransaction));
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("useUpcomingItems onSnapshot error:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    );
  }, [ready, user?.sub, count]);

  const markPaid = async (id: string) => {
    const res = await fetch(`/api/recurrent-transactions/${id}/mark-paid`, { method: "POST" });
    if (!res.ok) throw new Error(await res.text());
  };

  return { items, loading, error, markPaid };
}
