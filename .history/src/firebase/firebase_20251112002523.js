// src/firebase.js
// Initializes Firebase when env config is available; otherwise falls back to offline mode.
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./firebase/firebaseConfig";

let app = null;
try {
  if (firebaseConfig.apiKey) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  } else {
    // eslint-disable-next-line no-console
    console.warn("Firebase config not found - running in offline mode");
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("Firebase initialization failed:", err);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const functions = app ? getFunctions(app) : null;
export const storage = app ? getStorage(app) : null;

// Utility: Subscribe to auth state changes
export const onUid = (callback) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (user) => callback(user?.uid || null));
};

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
