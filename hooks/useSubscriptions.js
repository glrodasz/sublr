import {
  collection,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  setDoc,
  doc,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase/client";
import { signInWithCustomToken } from "firebase/auth";
import { useState, useEffect } from "react";

const COLLECTION_NAME = "subscriptions";

const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [finishedFirstFetch, setFinishedFirstFetch] = useState(false);

  useEffect(() => {
    let unsubscribe;
    let cancelled = false;

    // TODO: Add try catch to handle errors
    async function getSubscritions() {
      const { firebaseToken } = await fetch("/api/firebase").then((data) =>
        data.json()
      );
      const userCredentials = await signInWithCustomToken(auth, firebaseToken);
      const queryCollection = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userCredentials.user.uid)
      );

      if (cancelled) return;

      unsubscribe = onSnapshot(queryCollection, (querySnapshot) => {
        setSubscriptions(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setFinishedFirstFetch(true);
      });
    }

    getSubscritions();

    return () => {
      cancelled = true;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const create = async (subscription) => {
    return await addDoc(collection(db, COLLECTION_NAME), subscription);
  };

  const remove = async (id) => {
    return await deleteDoc(doc(db, COLLECTION_NAME, id));
  };

  const update = async (id, subscription) => {
    return await setDoc(doc(db, COLLECTION_NAME, id), subscription, {
      merge: true,
    });
  };

  return { subscriptions, create, remove, update, finishedFirstFetch };
};

export default useSubscriptions;
