const { collection, addDoc } = require("firebase/firestore");
const { db } = require("../../firebase");
const subscriptions = require("../../data/subscriptions.json");

async function firestoreSeed() {
  subscriptions.forEach(async (subscription) => {
    const docRef = await addDoc(collection(db, "subscriptions"), subscription);
    console.info("Document written with ID: ", docRef.id);
  });
}

firestoreSeed().then(() => process.exit());
