// src/api/getAiTemplates.js
import {callAISession} from "../utils/api";

export async function getAiTemplates({userId, mood, timeOfDay, intentGroup} = {}) {
  try {
    const data = await callAISession({
      mode: "templates",
      count: 6,
      userId: userId || "demo_user",
      mood: mood || "mixed",
      intentGroup: intentGroup || "quick_resets"
    });
    
    // Handle response format: {templates: [...]} from aiBrain.js
    if(data.templates && Array.isArray(data.templates)){
      return data.templates;
    }
    
    // Fallback: check for nested structure
    if(data.sessionPlan?.templates){
      return data.sessionPlan.templates;
    }
    
    return [];
  } catch (err) {
    console.error("AI Template Error:", err);
    return [];
  }
}

