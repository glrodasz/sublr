import { config } from "dotenv";
config({ path: ".env.local" });

import admin from "../firebase/admin";

const userId = process.argv[2];
if (!userId) {
  console.error("Usage: pnpm tsx scripts/seedTestData.ts <userId>");
  process.exit(1);
}

const db = admin.firestore();
const now = admin.firestore.Timestamp.now();
const daysAgo = (n: number) =>
  admin.firestore.Timestamp.fromDate(new Date(Date.now() - n * 24 * 60 * 60 * 1000));
const daysFromNow = (n: number) =>
  admin.firestore.Timestamp.fromDate(new Date(Date.now() + n * 24 * 60 * 60 * 1000));

async function seedTestData() {
  // Fetch existing categories for this user
  const catSnap = await db
    .collection("categories")
    .where("userId", "==", userId)
    .where("archived", "==", false)
    .get();

  if (catSnap.empty) {
    console.error("No categories found for user. Run a login first to seed default categories.");
    process.exit(1);
  }

  const categories = catSnap.docs.map((d) => ({ id: d.id, ...d.data() } as { id: string; domain: string; name: string }));
  const byDomain = (domain: string) => categories.filter((c) => c.domain === domain);

  const income = byDomain("INCOME");
  const expense = byDomain("EXPENSE");
  const investment = byDomain("INVESTMENT");
  const saving = byDomain("SAVING");

  const batch = db.batch();

  // Recurring items
  const recurringItems: { domain: string; category: { id: string; name: string }; name: string; amount: number; currency: string; frequency: string }[] = [
    { domain: "INCOME", category: income[0], name: "Monthly salary", amount: 5000, currency: "USD", frequency: "MONTHLY" },
    { domain: "INCOME", category: income[1] ?? income[0], name: "Freelance", amount: 800, currency: "USD", frequency: "MONTHLY" },
    { domain: "EXPENSE", category: expense[0], name: "Rent", amount: 1200, currency: "USD", frequency: "MONTHLY" },
    { domain: "EXPENSE", category: expense[1] ?? expense[0], name: "Netflix", amount: 15, currency: "USD", frequency: "MONTHLY" },
    { domain: "EXPENSE", category: expense[1] ?? expense[0], name: "Spotify", amount: 10, currency: "USD", frequency: "MONTHLY" },
    { domain: "EXPENSE", category: expense[2] ?? expense[0], name: "Car loan", amount: 350, currency: "USD", frequency: "MONTHLY" },
    { domain: "EXPENSE", category: expense[3] ?? expense[0], name: "Health insurance", amount: 200, currency: "USD", frequency: "MONTHLY" },
    { domain: "INVESTMENT", category: investment[0], name: "Bitcoin DCA", amount: 100, currency: "USD", frequency: "MONTHLY" },
    { domain: "INVESTMENT", category: investment[1] ?? investment[0], name: "S&P 500 ETF", amount: 300, currency: "USD", frequency: "MONTHLY" },
    { domain: "SAVING", category: saving[0], name: "Emergency fund", amount: 200, currency: "USD", frequency: "MONTHLY" },
  ];

  for (const item of recurringItems) {
    const ref = db.collection("recurringItems").doc();
    batch.set(ref, {
      userId,
      domain: item.domain,
      categoryId: item.category.id,
      name: item.name,
      amount: item.amount,
      currency: item.currency,
      frequency: item.frequency,
      active: true,
      startDate: daysAgo(90),
      nextOccurrence: daysFromNow(Math.floor(Math.random() * 28) + 1),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`✓ Created ${recurringItems.length} recurring items`);

  // Transactions — spread across last 60 days
  const txBatch = db.batch();
  const txNames = ["Netflix", "Spotify", "Rent", "Car loan", "Health insurance", "Grocery store", "Gym", "Electric bill", "Internet", "Phone bill"];
  for (let i = 0; i < 20; i++) {
    const ref = db.collection("transactions").doc();
    const cat = expense[i % expense.length];
    txBatch.set(ref, {
      userId,
      domain: "EXPENSE",
      categoryId: cat.id,
      name: txNames[i % txNames.length],
      amount: Math.round((Math.random() * 200 + 10) * 100) / 100,
      currency: "USD",
      occurredAt: daysAgo(Math.floor(Math.random() * 60)),
      status: "PAID",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await txBatch.commit();
  console.log("✓ Created 20 transactions");
  console.log("Done. Refresh the dashboard to see data.");
}

seedTestData().catch((err) => {
  console.error(err);
  process.exit(1);
});
