import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDT9KZC5cxhQoyEOmMWdufsC-gJCx7O5yA",
  authDomain: "wellcafeland.firebaseapp.com",
  projectId: "wellcafeland",
  storageBucket: "wellcafeland.appspot.com",
  messagingSenderId: "1022330574843",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
