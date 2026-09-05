import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useUser } from "@auth0/nextjs-auth0/client";
import { db } from "../firebase/client";
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { Currency } from "../types";

interface UserDoc {
  mainCurrency: Currency;
  onboardingCompleted: boolean;
}

export function useUserDoc() {
  const { user } = useUser();
  const { ready } = useFirebaseAuth();
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);

  useEffect(() => {
    if (!ready || !user?.sub) return;
    return onSnapshot(doc(db, "users", user.sub), (snap) => {
      if (snap.exists()) setUserDoc(snap.data() as UserDoc);
    });
  }, [ready, user?.sub]);

  return userDoc;
}
