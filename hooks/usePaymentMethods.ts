import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useUser } from "@auth0/nextjs-auth0/client";
import { db } from "../firebase/client";
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { PaymentMethod } from "../types";
import type { PaymentMethodInput } from "../schemas";

export function usePaymentMethods() {
  const { user } = useUser();
  const { ready } = useFirebaseAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !user?.sub) return;

    const q = query(
      collection(db, "paymentMethods"),
      where("userId", "==", user.sub),
      where("archived", "==", false)
    );

    return onSnapshot(
      q,
      (snap) => {
        setMethods(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PaymentMethod));
        setLoading(false);
      },
      (err) => {
        console.error("usePaymentMethods onSnapshot error:", err);
        setLoading(false);
      }
    );
  }, [ready, user?.sub]);

  const create = async (input: PaymentMethodInput): Promise<string> => {
    const res = await fetch("/api/payment-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
    const { id } = (await res.json()) as { id: string };
    return id;
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/payment-methods/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
  };

  return { methods, loading, create, remove };
}
