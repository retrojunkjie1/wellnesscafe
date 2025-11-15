import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

// Optional but still works with Vite:
import reportWebVitals from './reportWebVitals';

// PWA service worker (still works, just different path handling)
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');

// Vite + React 18 way (same as CRA 18)
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Web Vitals still works in Vite (optional):
reportWebVitals();

// Service worker registration (CRA-style PWAs still work fine)
serviceWorkerRegistration.register();
