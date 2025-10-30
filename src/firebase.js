// src/firebase.js
// TEMPORARILY DISABLED FIREBASE INITIALIZATION TO PREVENT RUNTIME ERRORS
// TODO: Re-enable when Firebase project is properly configured

// Read config from environment variables (see .env.example)
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
//   appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "",
// };

// Initialize only when an API key is present to avoid runtime errors in tests/CI
// let app = null;
let auth = null;
let db = null;

// TEMPORARILY DISABLE FIREBASE INITIALIZATION TO PREVENT RUNTIME ERRORS
console.warn("Firebase initialization disabled - using offline mode");
auth = null;
db = null;

export { auth, db };
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
