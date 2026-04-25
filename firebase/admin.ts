import fs from "fs";
import path from "path";
import admin from "firebase-admin";

function loadServiceAccount(): Record<string, unknown> | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64) {
    try {
      return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    } catch (err) {
      console.error(
        "[firebase/admin] FIREBASE_SERVICE_ACCOUNT_B64 is set but failed to parse:",
        (err as Error).message
      );
      return null;
    }
  }

  const env = process.env.NODE_ENV === "production" ? "prod" : "dev";
  const keyPath = path.join(process.cwd(), "firebase", `serviceAccountKey.${env}.json`);
  if (fs.existsSync(keyPath)) {
    return JSON.parse(fs.readFileSync(keyPath, "utf8"));
  }

  return null;
}

if (!admin.apps.length) {
  const serviceAccountKey = loadServiceAccount();
  if (serviceAccountKey) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
      databaseURL: `https://${serviceAccountKey.project_id}.firebaseio.com`,
    });
  } else {
    console.warn(
      "[firebase/admin] No credentials found (FIREBASE_SERVICE_ACCOUNT_B64 or local JSON). Skipping initializeApp."
    );
  }
}

export default admin;
