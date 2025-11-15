// Centralize Cloud Functions origin. In Firebase Hosting, /__/functions works automatically.
// For local dev or custom setups, set VITE_FUNCTIONS_ORIGIN, e.g.:
// http://localhost:5001/<project-id>/us-central1
export const functionsBase = import.meta.env.VITE_FUNCTIONS_ORIGIN || `${import.meta.env.PUBLIC_URL}/__/functions`;

export const fnUrl = (name)=>`${functionsBase}/${name}`;
