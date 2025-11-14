import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDT9KZC5cxhQoyEOmMWdufsC-gJCx7O5yA",
  authDomain: "wellcafeland.firebaseapp.com",
  projectId: "wellcafeland",
  storageBucket: "wellcafeland.appspot.com",
  messagingSenderId: "1022330574843",
  appId: "1:1022330574843:web:cb618943891f1d6d0e1d5e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence (will help with offline errors)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    console.warn('Firebase persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence.
    console.warn('Firebase persistence not supported in this browser');
  }
});

export default app;
