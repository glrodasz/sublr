const { getAuth } = require("firebase-admin/auth");
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import "../../firebase/admin";

export default withApiAuthRequired(async (req, res) => {
  const session = getSession(req, res);
  const userId = session.user.sub;
  const customToken = await getAuth().createCustomToken(userId);
  res.status(200).json({ firebaseToken: customToken });
});
