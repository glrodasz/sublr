import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useUser } from "@auth0/nextjs-auth0/client";
import { db } from "../firebase/client";
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { Category, Domain } from "../types";

export function useCategories(domain?: Domain) {
  const { user } = useUser();
  const { ready } = useFirebaseAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !user?.sub) return;

    const constraints = [
      where("userId", "==", user.sub),
      where("archived", "==", false),
      ...(domain ? [where("domain", "==", domain)] : []),
      orderBy("createdAt", "asc"),
    ];

    const q = query(collection(db, "categories"), ...constraints);
    return onSnapshot(q, (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)));
      setLoading(false);
    });
  }, [ready, user?.sub, domain]);

  const create = async (input: { domain: Domain; name: string }) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await res.text());
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
  };

  return { categories, loading, create, remove };
}
