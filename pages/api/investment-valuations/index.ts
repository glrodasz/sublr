import type { NextApiRequest, NextApiResponse } from "next";
import auth0 from "../../../lib/auth0";
import admin from "../../../firebase/admin";
import { InvestmentValuationInputSchema } from "../../../schemas";

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth0.getSession(req, res);
  if (!session?.user?.sub) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = session.user.sub;
  const db = admin.firestore();

  if (req.method === "POST") {
    const parsed = InvestmentValuationInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { categoryId, asOf, gainPct, value, costBasis, currency, note } = parsed.data;

    const catSnap = await db.collection("categories").doc(categoryId).get();
    if (!catSnap.exists) {
      return res.status(400).json({ error: "Category not found" });
    }
    const cat = catSnap.data()!;
    if (cat.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (cat.domain !== "INVESTMENT") {
      return res.status(400).json({ error: "Valuations apply to investment categories only" });
    }

    const ref = await db.collection("investmentValuations").add({
      userId,
      categoryId,
      asOf: admin.firestore.Timestamp.fromDate(new Date(asOf)),
      gainPct,
      value,
      costBasis,
      currency,
      ...(note ? { note } : {}),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ id: ref.id });
  }

  res.setHeader("Allow", "POST");
  return res.status(405).json({ error: "Method not allowed" });
});
