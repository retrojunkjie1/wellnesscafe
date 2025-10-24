// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: AIzaSyDT9KZC5cxhQoyEOmMWdufsC-gJCx7O5yA,
  authDomain: wellnesscafelanding.firebaseapp.com,
  projectId: wellnesscafelanding,
  storageBucket: wellnesscafelanding.firebasestorage.app,
  messagingSenderId: 1022330574843,
  appId: 1:1022330574843:web:cb618943891f1d6d0e1d5e,
  measurementId: G-4TGHRQB475
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);