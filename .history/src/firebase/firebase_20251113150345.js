// src/firebase/firebase.js
// @ts-check

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your actual Firebase keys
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "wellnesscafelanding.firebaseapp.com",
  projectId: "wellnesscafelanding",
  storageBucket: "wellnesscafelanding.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
