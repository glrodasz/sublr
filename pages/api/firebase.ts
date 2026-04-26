import { getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import auth0 from "../../lib/auth0";

import "../../firebase/admin";

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!getApps().length) {
    return res.status(503).json({ error: "Firebase admin is not configured in this environment." });
  }

  try {
    const session = await auth0.getSession(req, res);
    if (!session?.user?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const customToken = await getAuth().createCustomToken(session.user.sub);
    return res.status(200).json({ firebaseToken: customToken });
  } catch (err) {
    console.error("firebase token api error:", err);
    return res.status(500).json({ error: "Failed to mint token" });
  }
});
