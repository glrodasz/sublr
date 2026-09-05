import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useUser } from "@auth0/nextjs-auth0/client";
import { db } from "../firebase/client";
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { Domain, RecurrentTransaction } from "../types";

export function useRecurrentTransactions(domain?: Domain) {
  const { user } = useUser();
  const { ready } = useFirebaseAuth();
  const [items, setItems] = useState<RecurrentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !user?.sub) return;

    const constraints = [
      where("userId", "==", user.sub),
      where("active", "==", true),
      ...(domain ? [where("domain", "==", domain)] : []),
    ];

    const q = query(collection(db, "recurrentTransactions"), ...constraints);
    return onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as RecurrentTransaction)));
        setLoading(false);
      },
      (err) => {
        console.error("useRecurrentTransactions onSnapshot error:", err);
        setLoading(false);
      }
    );
  }, [ready, user?.sub, domain]);

  return { items, loading };
}

// Backward-compat alias — callers can migrate to useRecurrentTransactions gradually
export const useRecurringItems = useRecurrentTransactions;
