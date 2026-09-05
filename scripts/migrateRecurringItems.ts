/**
 * One-time migration script: recurringItems → recurrentTransactions
 *
 * What it does:
 *   1. Copies all documents from `recurringItems` to `recurrentTransactions`,
 *      adding `type: "OTHER"` as a default on each.
 *   2. For every transaction that has `recurringItemId`, renames the field to
 *      `recurrentTransactionId` and removes the old field.
 *   3. Deletes all documents from `recurringItems` after verifying the copy.
 *
 * Usage:
 *   pnpm tsx scripts/migrateRecurringItems.ts
 *
 * Add --dry-run to preview counts without making any changes:
 *   pnpm tsx scripts/migrateRecurringItems.ts --dry-run
 */

import admin from "../firebase/admin";

const DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = 400;

const db = admin.firestore();

async function migrateRecurringItems() {
  console.log(DRY_RUN ? "=== DRY RUN ===" : "=== LIVE RUN ===");

  // ── Step 1: Copy recurringItems → recurrentTransactions ──────────────────
  const srcSnap = await db.collection("recurringItems").get();
  console.log(`Found ${srcSnap.size} documents in recurringItems`);

  if (!DRY_RUN && srcSnap.size > 0) {
    let batch = db.batch();
    let count = 0;

    for (const doc of srcSnap.docs) {
      const destRef = db.collection("recurrentTransactions").doc(doc.id);
      batch.set(destRef, { ...doc.data(), type: doc.data().type ?? "OTHER" });
      count++;

      if (count % BATCH_SIZE === 0) {
        await batch.commit();
        console.log(`  Copied ${count}/${srcSnap.size}…`);
        batch = db.batch();
      }
    }

    if (count % BATCH_SIZE !== 0) {
      await batch.commit();
    }
    console.log(`✓ Copied ${count} documents to recurrentTransactions`);
  }

  // ── Step 2: Rename recurringItemId → recurrentTransactionId on transactions ──
  const txSnap = await db.collection("transactions").where("recurringItemId", "!=", null).get();

  console.log(`Found ${txSnap.size} transactions with recurringItemId`);

  if (!DRY_RUN && txSnap.size > 0) {
    let batch = db.batch();
    let count = 0;

    for (const doc of txSnap.docs) {
      const recurringItemId = doc.data().recurringItemId as string;
      batch.update(doc.ref, {
        recurrentTransactionId: recurringItemId,
        recurringItemId: admin.firestore.FieldValue.delete(),
      });
      count++;

      if (count % BATCH_SIZE === 0) {
        await batch.commit();
        console.log(`  Updated ${count}/${txSnap.size} transactions…`);
        batch = db.batch();
      }
    }

    if (count % BATCH_SIZE !== 0) {
      await batch.commit();
    }
    console.log(`✓ Renamed recurringItemId → recurrentTransactionId on ${count} transactions`);
  }

  // ── Step 3: Delete source recurringItems documents ────────────────────────
  if (!DRY_RUN && srcSnap.size > 0) {
    // Verify destination has expected count before deleting
    const destCount = (await db.collection("recurrentTransactions").count().get()).data().count;
    if (destCount < srcSnap.size) {
      console.error(
        `Aborting delete: destination has ${destCount} docs but source had ${srcSnap.size}`
      );
      process.exit(1);
    }

    let batch = db.batch();
    let count = 0;

    for (const doc of srcSnap.docs) {
      batch.delete(doc.ref);
      count++;

      if (count % BATCH_SIZE === 0) {
        await batch.commit();
        console.log(`  Deleted ${count}/${srcSnap.size} from recurringItems…`);
        batch = db.batch();
      }
    }

    if (count % BATCH_SIZE !== 0) {
      await batch.commit();
    }
    console.log(`✓ Deleted ${count} documents from recurringItems`);
  }

  console.log(DRY_RUN ? "\nDry run complete — no changes made." : "\nMigration complete.");
}

migrateRecurringItems().catch((err) => {
  console.error(err);
  process.exit(1);
});
