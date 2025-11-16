// src/api/getAiTemplates.js
export async function getAiTemplates({userId, mood, timeOfDay} = {}) {
  try {
    const res = await fetch("/aiSession", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        mode: "templates",
        userId: userId || "anonymous",
        mood: mood || "neutral",
        timeOfDay: timeOfDay || "any"
      })
    });
    const data = await res.json();
    return data.sessionPlan?.templates || [];
  } catch (err) {
    console.error("AI Template Error:", err);
    return [];
  }
}

