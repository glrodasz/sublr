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
import { db } from "../firebase/client";
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { RecurringItem } from "../types";

export function useUpcomingItems(count: number = 5) {
  const { user } = useUser();
  const { ready } = useFirebaseAuth();
  const [items, setItems] = useState<RecurringItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !user?.sub) return;

    const now = Timestamp.now();
    const q = query(
      collection(db, "recurringItems"),
      where("userId", "==", user.sub),
      where("active", "==", true),
      where("nextOccurrence", ">", now),
      orderBy("nextOccurrence", "asc"),
      limit(count)
    );

    return onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as RecurringItem)));
        setLoading(false);
      },
      (err) => {
        console.error("useUpcomingItems onSnapshot error:", err);
        setLoading(false);
      }
    );
  }, [ready, user?.sub, count]);

  return { items, loading };
}
