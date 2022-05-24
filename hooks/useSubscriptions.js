import {
  collection,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";

const COLLECTION_NAME = "subscriptions";

const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    let unsubscribe;

    async function getSubscritions() {
      const queryCollection = await query(collection(db, COLLECTION_NAME));
      unsubscribe = onSnapshot(queryCollection, (querySnapshot) => {
        setSubscriptions(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
    }

    getSubscritions();

    return () => unsubscribe();
  }, []);

  const create = async (subscription) => {
    return await addDoc(collection(db, COLLECTION_NAME), subscription);
  };

  const remove = async (id) => {
    return await deleteDoc(doc(db, COLLECTION_NAME, id));
  };

  const update = async (id, subscription) => {
    return await setDoc(doc(db, COLLECTION_NAME, id), subscription);
  };

  return { subscriptions, create, remove, update };
};

export default useSubscriptions;
