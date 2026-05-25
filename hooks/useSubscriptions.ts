import {
  collection,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  setDoc,
  doc,
  where,
  DocumentData,
} from "firebase/firestore";
import { db, auth } from "../firebase/client";
import { signInWithCustomToken } from "firebase/auth";
import { useState, useEffect } from "react";
import type { Subscription } from "../types";

const COLLECTION_NAME = "subscriptions";

const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [finishedFirstFetch, setFinishedFirstFetch] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    let settled = false;

    const settle = (err: Error | null) => {
      if (cancelled || settled) return;
      settled = true;
      setError(err);
      setFinishedFirstFetch(true);
    };

    async function getSubscriptions() {
      try {
        const response = await fetch("/api/firebase");
        if (!response.ok) {
          throw new Error(`Failed to authenticate with Firebase (${response.status})`);
        }
        const { firebaseToken } = await response.json();
        const userCredentials = await signInWithCustomToken(auth, firebaseToken);
        const queryCollection = query(
          collection(db, COLLECTION_NAME),
          where("userId", "==", userCredentials.user.uid)
        );

        if (cancelled) return;

        unsubscribe = onSnapshot(
          queryCollection,
          (querySnapshot) => {
            setSubscriptions(
              querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Subscription)
            );
            settle(null);
          },
          (snapshotError) => {
            console.error(snapshotError);
            settle(snapshotError);
          }
        );
      } catch (caught) {
        const err = caught instanceof Error ? caught : new Error(String(caught));
        console.error(err);
        settle(err);
      }
    }

    getSubscriptions();

    return () => {
      cancelled = true;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const create = async (subscription: Omit<Subscription, "id">) => {
    return await addDoc(collection(db, COLLECTION_NAME), subscription as DocumentData);
  };

  const remove = async (id: string) => {
    return await deleteDoc(doc(db, COLLECTION_NAME, id));
  };

  const update = async (id: string, subscription: Partial<Subscription>) => {
    return await setDoc(doc(db, COLLECTION_NAME, id), subscription as DocumentData, {
      merge: true,
    });
  };

  return { subscriptions, create, remove, update, finishedFirstFetch, error };
};

export default useSubscriptions;
