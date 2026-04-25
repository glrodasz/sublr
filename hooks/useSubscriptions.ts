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

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function getSubscriptions() {
      try {
        const { firebaseToken } = await fetch("/api/firebase").then((data) => data.json());
        const userCredentials = await signInWithCustomToken(auth, firebaseToken);
        const queryCollection = query(
          collection(db, COLLECTION_NAME),
          where("userId", "==", userCredentials.user.uid)
        );

        if (cancelled) return;

        unsubscribe = onSnapshot(queryCollection, (querySnapshot) => {
          setSubscriptions(
            querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Subscription)
          );
          setFinishedFirstFetch(true);
        });
      } catch (error) {
        console.error(error);
        setFinishedFirstFetch(true);
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

  return { subscriptions, create, remove, update, finishedFirstFetch };
};

export default useSubscriptions;
