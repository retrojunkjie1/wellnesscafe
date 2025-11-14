import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyDT9KZC5cxhQoyEOmMWdufsC-gJCx7O5yA",
  authDomain: "wellnesscafelanding.firebaseapp.com",
  projectId: "wellnesscafelanding",
  storageBucket: "wellnesscafelanding.firebasestorage.app",
  messagingSenderId: "1022330574843",
  appId: "1:1022330574843:web:cb618943891f1d6d0e1d5e",
  measurementId: "G-4TGHRQB475"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;