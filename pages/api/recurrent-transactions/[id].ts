import type { NextApiRequest, NextApiResponse } from "next";
import auth0 from "../../../lib/auth0";
import admin from "../../../firebase/admin";

import "../../../firebase/admin";

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth0.getSession(req, res);
  if (!session?.user?.sub) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = session.user.sub;
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id" });
  }

  const db = admin.firestore();
  const ref = db.collection("recurrentTransactions").doc(id);
  const snap = await ref.get();

  if (!snap.exists) {
    return res.status(404).json({ error: "Not found" });
  }

  if (snap.data()?.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "DELETE") {
    // Deactivate rather than delete so historical transactions keep resolving.
    await ref.update({ active: false });
    return res.status(200).json({ id });
  }

  res.setHeader("Allow", "DELETE");
  return res.status(405).json({ error: "Method not allowed" });
});
