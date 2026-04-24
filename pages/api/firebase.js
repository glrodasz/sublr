import { getAuth } from "firebase-admin/auth";
import auth0 from "../../lib/auth0";

import "../../firebase/admin";

export default auth0.withApiAuthRequired(async (req, res) => {
  const session = await auth0.getSession(req, res);
  const userId = session.user.sub;
  const customToken = await getAuth().createCustomToken(userId);
  res.status(200).json({ firebaseToken: customToken });
});
