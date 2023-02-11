const fs = require("fs");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  const env = process.env.NODE_ENV === "production" ? "prod" : "dev";
  const serviceAccountKey = require(`./serviceAccountKey.${env}.json`);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: `https://${serviceAccountKey.project_id}.firebaseio.com`,
  });
}
