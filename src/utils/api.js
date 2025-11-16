// src/utils/api.js

const CLOUD_FUNCTION_URL = "https://us-central1-wellnesscafelanding.cloudfunctions.net";

export async function callAISession(payload){
  const res = await fetch(`${CLOUD_FUNCTION_URL}/aiSession`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  });

  if(!res.ok){
    throw new Error(`AI Session Error: ${res.status}`);
  }

  return res.json();
}

export async function callAIMedia(payload){
  const res = await fetch(`${CLOUD_FUNCTION_URL}/aiMedia`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  });

  if(!res.ok){
    throw new Error(`AI Media Error: ${res.status}`);
  }

  return res.json();
}

