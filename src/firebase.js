// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read config from environment variables (see .env.example)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize only when an API key is present to avoid runtime errors in tests/CI
let app = null;
try {
  if (firebaseConfig.apiKey || process.env.NODE_ENV === "development") {
    app = initializeApp(firebaseConfig);
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn("Firebase initialization skipped:", e?.message || e);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
/*
Firestore data model (example):

users/{uid} {
  displayName: string,
  interests: string[],          // ['yoga','acuwellness','na','mindfulness']
  goals: { dailyMinutes: number, weeklyMeetings: number, streak: number, progress: number }, // 0..100
  lastCheckIn: string,          // ISO date
  riskScore: number,            // 0..100 (server/update function later)
  alerts: string[]              // optional, e.g., ['Missed 2 check-ins','High craving log']
}
*/
