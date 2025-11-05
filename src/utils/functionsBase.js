// Centralize Cloud Functions origin. In Firebase Hosting, /__/functions works automatically.
// For local dev or custom setups, set REACT_APP_FUNCTIONS_ORIGIN, e.g.:
// http://localhost:5001/<project-id>/us-central1
export const functionsBase = process.env.REACT_APP_FUNCTIONS_ORIGIN || `${process.env.PUBLIC_URL}/__/functions`;

export const fnUrl = (name)=>`${functionsBase}/${name}`;
