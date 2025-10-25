// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// Import analytics only if available in the environment
let getAnalytics;
try {
  // lazy require to avoid issues in non-browser test environments
  // eslint-disable-next-line global-require
  getAnalytics = require('firebase/analytics').getAnalytics;
} catch (e) {
  getAnalytics = null;
}

// Use environment variables for secrets and avoid committing them.
// Create a .env.local with REACT_APP_FIREBASE_* values in development.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ''
};

// Initialize Firebase only when an API key is provided to avoid runtime errors
let app = null;
let analytics = null;
if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  if (getAnalytics) {
    try {
      analytics = getAnalytics(app);
    } catch (err) {
      // analytics may fail in non-browser environments; ignore safely
      // eslint-disable-next-line no-console
      console.warn('Firebase analytics not initialized:', err.message || err);
    }
  }
}

export { app, analytics, firebaseConfig };