import { getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import auth0 from "../../lib/auth0";

import "../../firebase/admin";

export default auth0.withApiAuthRequired(async (req, res) => {
  if (!getApps().length) {
    return res
      .status(503)
      .json({ error: "Firebase admin is not configured in this environment." });
  }
  const session = await auth0.getSession(req, res);
  const customToken = await getAuth().createCustomToken(session.user.sub);
  res.status(200).json({ firebaseToken: customToken });
});
