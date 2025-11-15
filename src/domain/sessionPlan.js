/**
 * SessionPlan Blueprint - Core Type Definitions
 * 
 * This file defines the "language" for AI-generated wellness sessions.
 * All session plans follow this structure, enabling consistent rendering
 * and validation across the platform.
 */

/**
 * @typedef {"sleep_reset"|"calm_anxiety"|"craving_wave"|"grounding"|"morning_reset"|"evening_winddown"|"body_awareness"|"custom"} SessionIntent
 */

/**
 * @typedef {"check_in"|"breath"|"yoga"|"meditation"|"journaling"|"education"|"reflection"|"media"|"provider_suggestion"} SessionStepKind
 */

/**
 * Base properties shared by all step types
 * @typedef {Object} BaseStep
 * @property {string} id - Unique identifier for this step
 * @property {SessionStepKind} kind - The type of step
 * @property {string} title - Display title for the step
 * @property {string} [description] - Optional description
 * @property {number} [durationSec] - Duration in seconds (if applicable)
 * @property {number} order - Position in the session sequence (1-indexed)
 */

/**
 * Check-in step: Collect user state before/after session
 * @typedef {Object} CheckInStep
 * @property {string} id
 * @property {"check_in"} kind
 * @property {string} title
 * @property {string} [description]
 * @property {number} [durationSec]
 * @property {number} order
 * @property {Array<{id: string, label: string, type: "scale"|"text"|"multi", scaleMin?: number, scaleMax?: number}>} questions
 */

/**
 * Breathwork step: Guided breathing exercise
 * @typedef {Object} BreathStep
 * @property {string} id
 * @property {"breath"} kind
 * @property {string} title
 * @property {string} [description]
 * @property {number} [durationSec]
 * @property {number} order
 * @property {{inhale: number, exhale: number, holdTop?: number, holdBottom?: number}} pattern
 * @property {"coherence"|"box"|"4_7_8"|"custom"} style
 * @property {string} coaching - Coaching text to display
 */

/**
 * Yoga/movement step: Physical practice
 * @typedef {Object} YogaStep
 * @property {string} id
 * @property {"yoga"} kind
 * @property {string} title
 * @property {string} [description]
 * @property {number} [durationSec]
 * @property {number} order
 * @property {Array<{name: string, durationSec: number, cue: string}>} poses
 * @property {"gentle"|"moderate"|"strong"} intensity
 * @property {"full_body"|"hips"|"back"|"shoulders"|"restorative"} focusArea
 * @property {string} [mediaJobId] - Links to ai_jobs for generated media
 */

/**
 * Meditation step: Guided meditation practice
 * @typedef {Object} MeditationStep
 * @property {string} id
 * @property {"meditation"} kind
 * @property {string} title
 * @property {string} [description]
 * @property {number} [durationSec]
 * @property {number} order
 * @property {"body_scan"|"loving_kindness"|"breath_focus"|"grounding"|"custom"} style
 * @property {string} script - Meditation script (can be read by TTS or avatar)
 */

/**
 * Journaling step: Reflective writing prompts
 * @typedef {Object} JournalingStep
 * @property {string} id
 * @property {"journaling"} kind
 * @property {string} title
 * @property {string} [description]
 * @property {number} [durationSec]
 * @property {number} order
 * @property {string} prompt - Main journaling prompt
 * @property {string[]} [subPrompts] - Optional follow-up prompts
 */

/**
 * Education step: Psychoeducation content (MIR-style)
 * @typedef {Object} EducationStep
 * @property {string} id
 * @property {"education"} kind
 * @property {string} title
 * @property {string} [description]
 * @property {number} [durationSec]
 * @property {number} order
 * @property {string} topic - Educational topic
 * @property {string} content - Educational content text
 */

/**
 * Reflection step: Simple reflection questions
 * @typedef {Object} ReflectionStep
 * @property {string} id
 * @property {"reflection"} kind
 * @property {string} title
 * @property {string} [description]
 * @property {number} [durationSec]
 * @property {number} order
 * @property {string[]} questions - Reflection questions to ponder
 */

/**
 * Media step: AI-generated or curated media content
 * @typedef {Object} MediaStep
 * @property {string} id
 * @property {"media"} kind
 * @property {string} title
 * @property {string} [description]
 * @property {number} [durationSec]
 * @property {number} order
 * @property {string} mediaJobId - Points to ai_jobs/{id}
 * @property {"video"|"animation"|"avatar"} mediaType
 * @property {string} [placeholderText] - Text while media loads
 */

/**
 * Provider suggestion step: Recommend professional support
 * @typedef {Object} ProviderSuggestionStep
 * @property {string} id
 * @property {"provider_suggestion"} kind
 * @property {string} title
 * @property {string} [description]
 * @property {number} [durationSec]
 * @property {number} order
 * @property {string} rationale - Why this provider type is suggested
 * @property {string[]} suggestedTypes - Provider types (e.g., ["somatic_therapist", "yoga_therapist"])
 */

/**
 * Union type for all session steps
 * @typedef {CheckInStep|BreathStep|YogaStep|MeditationStep|JournalingStep|EducationStep|ReflectionStep|MediaStep|ProviderSuggestionStep} SessionStep
 */

/**
 * Complete session plan structure
 * @typedef {Object} SessionPlan
 * @property {string} id - Unique session identifier
 * @property {string} userId - User who owns this session
 * @property {SessionIntent} intent - Session's primary intent
 * @property {string} title - Session title
 * @property {string} aiSummary - AI-generated summary of the session
 * @property {number} totalMinutes - Total session duration in minutes
 * @property {string} createdAtIso - ISO timestamp of creation
 * @property {SessionStep[]} steps - Ordered array of session steps
 * @property {string[]} [followUpSuggestions] - Optional suggestions for next sessions
 */

/**
 * Session status in Firestore
 * @typedef {"planned"|"active"|"completed"|"abandoned"} SessionStatus
 */

/**
 * Firestore session document shape
 * @typedef {Object} SessionDocument
 * @property {SessionStatus} status
 * @property {SessionIntent} intent
 * @property {string} title
 * @property {string} aiSummary
 * @property {number} totalMinutes
 * @property {Date} createdAt
 * @property {Date|null} completedAt
 * @property {SessionStep[]} steps
 * @property {number} [lastStepIndex] - Last completed step index
 * @property {{moodBefore: number|null, moodAfter: number|null, cravingBefore: number|null, cravingAfter: number|null}} metrics
 * @property {string[]} [followUpSuggestions]
 */

/**
 * Intent metadata for UI display and AI prompting
 */
export const INTENT_METADATA = {
  sleep_reset: {
    label: "Sleep Reset",
    description: "Wind down and prepare for restorative sleep",
    icon: "🌙",
    color: "#6366f1",
    defaultDuration: 15,
  },
  calm_anxiety: {
    label: "Calm Anxiety",
    description: "Regulate your nervous system and ease worry",
    icon: "🌊",
    color: "#0ea5e9",
    defaultDuration: 10,
  },
  craving_wave: {
    label: "Craving Wave",
    description: "Ride the wave of craving without acting on it",
    icon: "🌊",
    color: "#f59e0b",
    defaultDuration: 8,
  },
  grounding: {
    label: "Grounding",
    description: "Return to present moment awareness",
    icon: "🌱",
    color: "#10b981",
    defaultDuration: 5,
  },
  morning_reset: {
    label: "Morning Reset",
    description: "Start your day with intention and energy",
    icon: "☀️",
    color: "#f97316",
    defaultDuration: 12,
  },
  evening_winddown: {
    label: "Evening Winddown",
    description: "Release the day and transition to rest",
    icon: "🌆",
    color: "#8b5cf6",
    defaultDuration: 15,
  },
  body_awareness: {
    label: "Body Awareness",
    description: "Connect with physical sensations and movement",
    icon: "💫",
    color: "#ec4899",
    defaultDuration: 20,
  },
  custom: {
    label: "Custom Session",
    description: "Tailored to your specific needs",
    icon: "✨",
    color: "#a855f7",
    defaultDuration: 15,
  },
};

/**
 * Step kind metadata for UI rendering
 */
export const STEP_KIND_METADATA = {
  check_in: { label: "Check-In", icon: "📋", color: "#64748b" },
  breath: { label: "Breathwork", icon: "🫁", color: "#0ea5e9" },
  yoga: { label: "Movement", icon: "🧘", color: "#ec4899" },
  meditation: { label: "Meditation", icon: "🧘‍♀️", color: "#8b5cf6" },
  journaling: { label: "Journaling", icon: "✍️", color: "#f59e0b" },
  education: { label: "Learn", icon: "📚", color: "#10b981" },
  reflection: { label: "Reflection", icon: "💭", color: "#6366f1" },
  media: { label: "Media", icon: "🎬", color: "#ec4899" },
  provider_suggestion: { label: "Get Support", icon: "🤝", color: "#f97316" },
};

/**
 * Validate a session plan structure (basic validation)
 * @param {any} plan - The plan to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateSessionPlan(plan) {
  const errors = [];

  if (!plan || typeof plan !== "object") {
    return { valid: false, errors: ["Plan must be an object"] };
  }

  // Required fields
  if (!plan.id) errors.push("Missing required field: id");
  if (!plan.userId) errors.push("Missing required field: userId");
  if (!plan.intent) errors.push("Missing required field: intent");
  if (!plan.title) errors.push("Missing required field: title");
  if (!Array.isArray(plan.steps)) errors.push("steps must be an array");

  // Validate intent
  if (plan.intent && !INTENT_METADATA[plan.intent]) {
    errors.push(`Invalid intent: ${plan.intent}`);
  }

  // Validate steps
  if (Array.isArray(plan.steps)) {
    plan.steps.forEach((step, idx) => {
      if (!step.id) errors.push(`Step ${idx}: missing id`);
      if (!step.kind) errors.push(`Step ${idx}: missing kind`);
      if (!STEP_KIND_METADATA[step.kind]) {
        errors.push(`Step ${idx}: invalid kind ${step.kind}`);
      }
      if (typeof step.order !== "number") {
        errors.push(`Step ${idx}: order must be a number`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Generate a unique session ID
 * @returns {string}
 */
export function generateSessionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `session_${timestamp}_${random}`;
}

/**
 * Generate a unique step ID
 * @param {number} order - The step's order in sequence
 * @returns {string}
 */
export function generateStepId(order) {
  const random = Math.random().toString(36).substring(2, 6);
  return `step_${order}_${random}`;
}

/**
 * Calculate total duration from steps
 * @param {SessionStep[]} steps
 * @returns {number} Total duration in minutes
 */
export function calculateTotalMinutes(steps) {
  const totalSeconds = steps.reduce(
    (sum, step) => sum + (step.durationSec || 0),
    0
  );
  return Math.round(totalSeconds / 60);
}
