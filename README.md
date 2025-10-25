# Wellcafeland

AI-powered Wellness Café Landing Page  
Built with React + Firebase.

This project is part of the Wellnesscafe AI initiative, created to deliver optimized, AI-driven wellness content and services to a global audience.

## Firebase setup

This project reads Firebase configuration from environment variables (Create React App style). To configure locally:

1. Copy `.env.example` to `.env.local` at the project root.
2. Fill in your Firebase project's values for the `REACT_APP_FIREBASE_...` variables.
3. Restart the dev server (npm start) so the variables are loaded.

Important: never commit `.env.local` with secrets. `.env.local` is already included in `.gitignore`.
