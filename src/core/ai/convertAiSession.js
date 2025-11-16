// src/core/ai/convertAiSession.js

import {generateSessionId, generateStepId} from "../../domain/sessionPlan";
import {getMasterCategory} from "../masterSteps";

// Maps AI "type"/"kind" values → internal step kinds
const STEP_KIND_MAP = {
  CHECK_IN: "check_in",
  check_in: "check_in",
  checkin: "check_in",
  BREATH: "breath",
  breath: "breath",
  BREATHWORK: "breath",
  MEDITATION: "meditation",
  meditation: "meditation",
  REFLECTION: "reflection",
  reflection: "reflection",
  MOVEMENT: "movement",
  movement: "movement",
  JOURNAL: "journaling",
  journaling: "journaling",
  INTENTION: "intention",
  intention: "intention"
};

const normalizeKind = (rawKind) => {
  if (!rawKind) return "check_in";
  const asString = String(rawKind);
  if (STEP_KIND_MAP[asString]) return STEP_KIND_MAP[asString];
  if (STEP_KIND_MAP[asString.toUpperCase()]) return STEP_KIND_MAP[asString.toUpperCase()];
  return "check_in";
};

// Main function: raw AI plan → orchestrator-ready plan
export const normalizeAiSessionPlan = (rawPlan) => {
  if (!rawPlan) return null;

  const base = {
    id: rawPlan.id || generateSessionId(),
    userId: rawPlan.userId || "ai_generated",
    intent: rawPlan.intent || "generic",
    title: rawPlan.title || "AI Wellness Session",
    aiSummary: rawPlan.aiSummary || rawPlan.summary || "",
    totalMinutes: rawPlan.totalMinutes || rawPlan.estimatedDuration || 5,
    createdAtIso: rawPlan.createdAtIso || new Date().toISOString(),
    followUpSuggestions: rawPlan.followUpSuggestions || rawPlan.suggestions || []
  };

  const steps = (rawPlan.steps || []).map((step, index) => {
    const kind = normalizeKind(step.kind || step.type);
    return {
      ...step,
      id: step.id || generateStepId(index + 1),
      kind,
      order: step.order || index + 1,
      masterCategory: getMasterCategory(kind) // internal tag, not shown in UI
    };
  });

  return {...base, steps};
};
