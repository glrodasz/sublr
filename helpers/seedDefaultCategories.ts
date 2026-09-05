import admin from "../firebase/admin";
import defaults from "../data/defaultCategories.json";
import type { Domain } from "../types";

export async function seedDefaultCategories(userId: string): Promise<void> {
  const db = admin.firestore();
  const batch = db.batch();

  for (const [domain, names] of Object.entries(defaults)) {
    for (const name of names as string[]) {
      const ref = db.collection("categories").doc();
      batch.set(ref, {
        userId,
        domain: domain as Domain,
        name,
        isDefault: true,
        archived: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  await batch.commit();
}
