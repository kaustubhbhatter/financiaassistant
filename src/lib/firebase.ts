import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
// @ts-ignore
import firebaseConfig from "../../firebase-applet-config.json";

let auth: Auth | undefined;
let db: Firestore | undefined;
let app: FirebaseApp | undefined;

// Basic validation to ensure the API key is not a placeholder or empty
const isApiKeyValid = 
  firebaseConfig.apiKey && 
  typeof firebaseConfig.apiKey === "string" && 
  firebaseConfig.apiKey.length > 20 && 
  !firebaseConfig.apiKey.includes("YOUR_API_KEY");

if (isApiKeyValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase API key is missing or invalid. Authentication will be disabled.");
}

export { auth, db, app };
