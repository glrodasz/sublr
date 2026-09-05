import type { NextApiRequest, NextApiResponse } from "next";
import auth0 from "../../../lib/auth0";
import admin from "../../../firebase/admin";
import { CategoryInputSchema } from "../../../schemas";

import "../../../firebase/admin";

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth0.getSession(req, res);
  if (!session?.user?.sub) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = session.user.sub;
  const db = admin.firestore();

  if (req.method === "GET") {
    const { domain } = req.query;
    let query = db
      .collection("categories")
      .where("userId", "==", userId)
      .where("archived", "==", false);

    if (typeof domain === "string") {
      query = query.where("domain", "==", domain);
    }

    const snap = await query.get();
    const categories = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json(categories);
  }

  if (req.method === "POST") {
    const parsed = CategoryInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { domain, name } = parsed.data;

    const existing = await db
      .collection("categories")
      .where("userId", "==", userId)
      .where("domain", "==", domain)
      .where("name", "==", name)
      .where("archived", "==", false)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const ref = await db.collection("categories").add({
      userId,
      domain,
      name,
      isDefault: false,
      archived: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ id: ref.id });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
});
