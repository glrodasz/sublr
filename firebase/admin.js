const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  const env = process.env.NODE_ENV === "production" ? "prod" : "dev";
  const keyPath = path.join(
    process.cwd(),
    "firebase",
    `serviceAccountKey.${env}.json`
  );
  const serviceAccountKey = JSON.parse(fs.readFileSync(keyPath, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: `https://${serviceAccountKey.project_id}.firebaseio.com`,
  });
}
