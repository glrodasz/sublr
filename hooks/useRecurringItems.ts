import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useUser } from "@auth0/nextjs-auth0/client";
import { db } from "../firebase/client";
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { Domain, RecurringItem } from "../types";

export function useRecurringItems(domain?: Domain) {
  const { user } = useUser();
  const { ready } = useFirebaseAuth();
  const [items, setItems] = useState<RecurringItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !user?.sub) return;

    const constraints = [
      where("userId", "==", user.sub),
      where("active", "==", true),
      ...(domain ? [where("domain", "==", domain)] : []),
    ];

    const q = query(collection(db, "recurringItems"), ...constraints);
    return onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as RecurringItem)));
        setLoading(false);
      },
      (err) => {
        console.error("useRecurringItems onSnapshot error:", err);
        setLoading(false);
      }
    );
  }, [ready, user?.sub, domain]);

  return { items, loading };
}
