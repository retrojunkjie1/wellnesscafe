// src/firebase/firebase.js
// @ts-check

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- FIREBASE CONFIG ---
// Replace these with your actual credentials from Firebase Console → Project Settings → General
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "wellnesscafelanding.firebaseapp.com",
  projectId: "wellnesscafelanding",
  storageBucket: "wellnesscafelanding.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- INITIALIZE ---
const app = initializeApp(firebaseConfig);

// --- SERVICES ---
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional
export default app;
