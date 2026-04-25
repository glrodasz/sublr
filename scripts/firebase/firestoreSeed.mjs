import { config } from "dotenv";
config({ path: ".env.local" });

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/index.js";
import subscriptions from "../../data/subscriptions.json" assert { type: "json" };

async function firestoreSeed() {
  for (const subscription of subscriptions) {
    const docRef = await addDoc(collection(db, "subscriptions"), {
      ...subscription,
      userId: process.env.ADMIN_USER_ID,
    });
    console.info("Document written with ID: ", docRef.id);
  }
}

firestoreSeed();
