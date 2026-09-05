import admin from "../../firebase/admin";
import { seedDefaultCategories } from "../../helpers/seedDefaultCategories";
import seedData from "../../data/testSeedData.json";

const BATCH_SIZE = 400;

const userId = process.argv[2];
const noWipe = process.argv.includes("--no-wipe");

if (!userId) {
  console.error("Usage: pnpm seed:user <userId> [--no-wipe]");
  process.exit(1);
}

const db = admin.firestore();

function daysAgo(n: number) {
  return admin.firestore.Timestamp.fromDate(new Date(Date.now() - n * 24 * 60 * 60 * 1000));
}

function daysFromNow(n: number) {
  return admin.firestore.Timestamp.fromDate(new Date(Date.now() + n * 24 * 60 * 60 * 1000));
}

async function deleteCollection(collectionName: string) {
  let deleted = 0;
  let query = db.collection(collectionName).where("userId", "==", userId).limit(BATCH_SIZE);

  while (true) {
    const snap = await query.get();
    if (snap.empty) break;

    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    deleted += snap.docs.length;
  }

  return deleted;
}

async function wipe() {
  const collections = ["transactions", "recurrentTransactions", "paymentMethods", "categories"];
  for (const col of collections) {
    const n = await deleteCollection(col);
    console.log(`  Wiped ${n} docs from ${col}`);
  }
}

async function seedPaymentMethods(): Promise<Map<string, string>> {
  const idByName = new Map<string, string>();
  const batch = db.batch();

  for (const pm of seedData.paymentMethods) {
    const ref = db.collection("paymentMethods").doc();
    const doc: Record<string, unknown> = {
      userId,
      name: pm.name,
      type: pm.type,
      currencies: pm.currencies,
      archived: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (pm.defaultCurrency) doc.defaultCurrency = pm.defaultCurrency;
    if (pm.network) doc.network = pm.network;
    batch.set(ref, doc);
    idByName.set(pm.name, ref.id);
  }

  await batch.commit();
  return idByName;
}

async function loadCategories(): Promise<Map<string, string>> {
  const snap = await db
    .collection("categories")
    .where("userId", "==", userId)
    .where("archived", "==", false)
    .get();

  // key: "DOMAIN:name" → id
  const idByKey = new Map<string, string>();
  snap.docs.forEach((d) => {
    const data = d.data();
    idByKey.set(`${data.domain}:${data.name}`, d.id);
  });
  return idByKey;
}

async function seedSubcategories(catIdByKey: Map<string, string>): Promise<Map<string, string>> {
  const batch = db.batch();
  const subIdByKey = new Map<string, string>();

  for (const sub of seedData.subcategories) {
    const parentId = catIdByKey.get(`${sub.domain}:${sub.parentName}`);
    if (!parentId) {
      console.warn(
        `  Warning: parent "${sub.parentName}" (${sub.domain}) not found — skipping subcategory "${sub.name}"`
      );
      continue;
    }
    const ref = db.collection("categories").doc();
    batch.set(ref, {
      userId,
      domain: sub.domain,
      name: sub.name,
      parentId,
      isDefault: true,
      archived: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    subIdByKey.set(`${sub.domain}:${sub.parentName}:${sub.name}`, ref.id);
  }

  await batch.commit();
  return subIdByKey;
}

function resolveCategoryId(
  domain: string,
  categoryName: string,
  subcategoryName: string | null,
  catIdByKey: Map<string, string>,
  subIdByKey: Map<string, string>
): string | undefined {
  if (subcategoryName) {
    const key = `${domain}:${categoryName}:${subcategoryName}`;
    const id = subIdByKey.get(key);
    if (!id) {
      console.warn(
        `  Warning: subcategory "${subcategoryName}" under "${categoryName}" (${domain}) not found`
      );
    }
    return id;
  }
  const key = `${domain}:${categoryName}`;
  const id = catIdByKey.get(key);
  if (!id) {
    console.warn(`  Warning: category "${categoryName}" (${domain}) not found`);
  }
  return id;
}

async function loadServices(): Promise<
  Map<string, { serviceId: string; name: string; logoUrl?: string }>
> {
  const snap = await db.collection("services").get();
  const byName = new Map<string, { serviceId: string; name: string; logoUrl?: string }>();
  snap.docs.forEach((d) => {
    const data = d.data();
    byName.set(data.name as string, {
      serviceId: d.id,
      name: data.name as string,
      ...(data.logoUrl ? { logoUrl: data.logoUrl as string } : {}),
    });
  });
  return byName;
}

async function seedRecurrentTransactions(
  catIdByKey: Map<string, string>,
  subIdByKey: Map<string, string>,
  pmIdByName: Map<string, string>,
  servicesByName: Map<string, { serviceId: string; name: string; logoUrl?: string }>
): Promise<Map<string, string>> {
  const idByName = new Map<string, string>();
  const batch = db.batch();

  for (const rt of seedData.recurrentTransactions) {
    const categoryId = resolveCategoryId(
      rt.domain,
      rt.categoryName,
      rt.subcategoryName,
      catIdByKey,
      subIdByKey
    );
    if (!categoryId) continue;

    const paymentMethodId = rt.paymentMethodName ? pmIdByName.get(rt.paymentMethodName) : undefined;

    const ref = db.collection("recurrentTransactions").doc();
    const doc: Record<string, unknown> = {
      userId,
      domain: rt.domain,
      categoryId,
      name: rt.name,
      amount: rt.amount,
      currency: rt.currency,
      frequency: rt.frequency,
      type: rt.type,
      active: true,
      startDate: daysAgo(90),
      nextOccurrence: daysFromNow(Math.floor(Math.random() * 28) + 1),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (rt.chargedAmount != null) doc.chargedAmount = rt.chargedAmount;
    if (rt.chargedCurrency != null) doc.chargedCurrency = rt.chargedCurrency;
    if (paymentMethodId) doc.paymentMethodId = paymentMethodId;

    if ("serviceRef" in rt && rt.serviceRef) {
      const svc = servicesByName.get(rt.serviceRef as string);
      if (svc) {
        doc.serviceSnapshot = svc;
      }
    }

    batch.set(ref, doc);
    idByName.set(rt.name, ref.id);
  }

  await batch.commit();
  return idByName;
}

async function seedTransactions(
  catIdByKey: Map<string, string>,
  subIdByKey: Map<string, string>,
  pmIdByName: Map<string, string>,
  rtIdByName: Map<string, string>
) {
  let count = 0;
  let batch = db.batch();
  let batchCount = 0;

  for (const tx of seedData.transactions) {
    const categoryId = resolveCategoryId(
      tx.domain,
      tx.categoryName,
      tx.subcategoryName,
      catIdByKey,
      subIdByKey
    );
    if (!categoryId) continue;

    const paymentMethodId = tx.paymentMethodName ? pmIdByName.get(tx.paymentMethodName) : undefined;

    const ref = db.collection("transactions").doc();
    const doc: Record<string, unknown> = {
      userId,
      domain: tx.domain,
      categoryId,
      name: tx.name,
      amount: tx.amount,
      currency: tx.currency,
      occurredAt: daysAgo(tx.daysAgo),
      status: tx.status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (tx.chargedAmount != null) doc.chargedAmount = tx.chargedAmount;
    if (tx.chargedCurrency != null) doc.chargedCurrency = tx.chargedCurrency;
    if (paymentMethodId) doc.paymentMethodId = paymentMethodId;

    if (tx.recurrentTransactionRef) {
      const rtId = rtIdByName.get(tx.recurrentTransactionRef);
      if (rtId) doc.recurrentTransactionId = rtId;
    }

    batch.set(ref, doc);
    count++;
    batchCount++;

    if (batchCount === BATCH_SIZE) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) await batch.commit();
  return count;
}

async function main() {
  console.log(`Seeding data for user: ${userId}`);

  if (!noWipe) {
    console.log("\nWiping existing user data...");
    await wipe();
  } else {
    console.log("\nSkipping wipe (--no-wipe)");
  }

  console.log("\nSeeding default categories...");
  await seedDefaultCategories(userId);

  const catIdByKey = await loadCategories();
  console.log(`  Loaded ${catIdByKey.size} default categories`);

  console.log("\nSeeding subcategories...");
  const subIdByKey = await seedSubcategories(catIdByKey);
  console.log(`  Created ${subIdByKey.size} subcategories`);

  console.log("\nSeeding payment methods...");
  const pmIdByName = await seedPaymentMethods();
  console.log(`  Created ${pmIdByName.size} payment methods`);

  console.log("\nLoading services...");
  const servicesByName = await loadServices();
  console.log(`  Found ${servicesByName.size} services`);

  console.log("\nSeeding recurrent transactions...");
  const rtIdByName = await seedRecurrentTransactions(
    catIdByKey,
    subIdByKey,
    pmIdByName,
    servicesByName
  );
  console.log(`  Created ${rtIdByName.size} recurrent transactions`);

  console.log("\nSeeding transactions...");
  const txCount = await seedTransactions(catIdByKey, subIdByKey, pmIdByName, rtIdByName);
  console.log(`  Created ${txCount} transactions`);

  console.log("\nDone!");
  console.log(
    `  categories:            ${catIdByKey.size + subIdByKey.size} (${catIdByKey.size} root + ${subIdByKey.size} subcategories)`
  );
  console.log(`  paymentMethods:        ${pmIdByName.size}`);
  console.log(`  recurrentTransactions: ${rtIdByName.size}`);
  console.log(`  transactions:          ${txCount}`);
  console.log("\nRefresh the dashboard to see data.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
