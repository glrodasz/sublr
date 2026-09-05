import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useUser } from "@auth0/nextjs-auth0/client";
import { db } from "../firebase/client";
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { Transaction } from "../types";

export function useRecentTransactions(count: number = 10) {
  const { user } = useUser();
  const { ready } = useFirebaseAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !user?.sub) return;

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.sub),
      where("status", "==", "PAID"),
      orderBy("occurredAt", "desc"),
      limit(count)
    );

    return onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction)));
      setLoading(false);
    });
  }, [ready, user?.sub, count]);

  return { transactions, loading };
}
