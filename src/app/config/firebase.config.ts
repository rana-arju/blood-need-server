import * as admin from "firebase-admin"
import path from "path"
import fs from "fs"
import config from "./index"

// Check if we're running on Vercel
const isVercel = process.env.VERCEL_REGION || process.env.VERCEL_URL

let serviceAccount

// Handle service account differently based on environment
if (isVercel) {
  // On Vercel, use environment variable
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}")
  } catch (error) {
    console.error("Error parsing Firebase service account from env:", error)
    serviceAccount = undefined
  }
} else {
  // In local development, try to read from file
  try {
    const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.json")
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = require(serviceAccountPath)
    }
  } catch (error) {
    console.error("Error reading Firebase service account file:", error)
    serviceAccount = undefined
  }
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
       // databaseURL: config.firebase.databaseURL,
      })
      console.log("Firebase Admin SDK initialized successfully")
    } else {
      console.warn("Firebase service account not found, FCM notifications will not work")
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error)
  }
}

export default admin

