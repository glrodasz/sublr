const admin = require("firebase-admin");

if (!admin.apps.length) {
  let serviceAccountKey = fs.readFileSync("./serviceAccountKey.dev.json")

  if(process.env.NODE_ENV === 'production') {
    serviceAccountKey = fs.readFileSync("./serviceAccountKey.prod.json")
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
}