/**
 * Session Templates - Pre-built wellness sessions
 * These templates provide immediate value without requiring AI generation
 */

import { generateSessionId } from "../domain/sessionPlan";

/**
 * @typedef {import("../domain/sessionPlan").SessionPlan} SessionPlan
 */

/**
 * Template categories for organization
 */
export const TEMPLATE_CATEGORIES = {
  quick: { label: "Quick Resets", duration: "5-10 min", color: "#f59e0b" },
  morning: { label: "Morning Rituals", duration: "10-20 min", color: "#3b82f6" },
  evening: { label: "Evening Wind-Down", duration: "15-30 min", color: "#8b5cf6" },
  crisis: { label: "Crisis Support", duration: "5-15 min", color: "#ef4444" },
  focus: { label: "Focus & Clarity", duration: "10-25 min", color: "#10b981" },
};

/**
 * Pre-built session templates
 * @type {SessionPlan[]}
 */
export const SESSION_TEMPLATES = [
  // Quick Resets
  {
    id: "template_anxiety_quick",
    userId: "template",
    intent: "calm_anxiety",
    title: "5-Minute Anxiety Reset",
    aiSummary: "Quick nervous system regulation using breathing and grounding.",
    totalMinutes: 5,
    category: "quick",
    difficulty: "beginner",
    tags: ["breathing", "quick", "anxiety"],
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: "step_1",
        kind: "check_in",
        order: 1,
        title: "Quick Check-In",
        questions: [
          {
            id: "q_anxiety",
            label: "How anxious do you feel right now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
        ],
      },
      {
        id: "step_2",
        kind: "breath",
        order: 2,
        title: "Coherence Breathing",
        durationSec: 240,
        pattern: { inhale: 4, exhale: 6 },
        style: "coherence",
        coaching: "Slow, steady breaths to calm your nervous system.",
      },
      {
        id: "step_3",
        kind: "check_in",
        order: 3,
        title: "Quick Check-Out",
        questions: [
          {
            id: "q_anxiety_after",
            label: "How do you feel now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
        ],
      },
    ],
    followUpSuggestions: [
      "Practice this twice daily for best results",
      "Try the 10-minute version for deeper calm",
    ],
  },

  {
    id: "template_sleep_quick",
    userId: "template",
    intent: "sleep_reset",
    title: "Quick Sleep Prep",
    aiSummary: "Wind down fast with gentle breathing and body awareness.",
    totalMinutes: 8,
    category: "quick",
    difficulty: "beginner",
    tags: ["sleep", "bedtime", "relaxation"],
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: "step_1",
        kind: "breath",
        order: 1,
        title: "4-7-8 Breathing",
        durationSec: 180,
        pattern: { inhale: 4, hold: 7, exhale: 8 },
        style: "sleep",
        coaching: "This pattern naturally induces drowsiness.",
      },
      {
        id: "step_2",
        kind: "meditation",
        order: 2,
        title: "Body Scan",
        durationSec: 300,
        style: "body_scan",
        script: "Starting with your toes, notice any sensations. Release any tension. Move slowly up through your feet, ankles, calves... Let each part of your body sink into rest.",
      },
    ],
    followUpSuggestions: [
      "Keep your bedroom cool and dark",
      "Avoid screens 30 minutes before this session",
    ],
  },

  // Morning Rituals
  {
    id: "template_morning_energy",
    userId: "template",
    intent: "morning_reset",
    title: "Morning Energy Boost",
    aiSummary: "Start your day with intention, movement, and mental clarity.",
    totalMinutes: 12,
    category: "morning",
    difficulty: "beginner",
    tags: ["morning", "energy", "intention"],
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: "step_1",
        kind: "check_in",
        order: 1,
        title: "Morning Check-In",
        questions: [
          {
            id: "q_energy",
            label: "How's your energy level this morning?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
          {
            id: "q_intention",
            label: "What's one intention for today?",
            type: "text",
            placeholder: "I intend to...",
          },
        ],
      },
      {
        id: "step_2",
        kind: "breath",
        order: 2,
        title: "Energizing Breath",
        durationSec: 180,
        pattern: { inhale: 3, exhale: 3 },
        style: "energizing",
        coaching: "Quick, rhythmic breaths to wake up your system.",
      },
      {
        id: "step_3",
        kind: "meditation",
        order: 3,
        title: "Gratitude Moment",
        durationSec: 240,
        style: "gratitude",
        script: "Bring to mind three things you're grateful for today. They can be simple: warm coffee, a comfortable bed, another day. Let the feeling of gratitude fill your chest.",
      },
      {
        id: "step_4",
        kind: "check_in",
        order: 4,
        title: "Set Your Tone",
        questions: [
          {
            id: "q_ready",
            label: "How ready do you feel for your day?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
        ],
      },
    ],
    followUpSuggestions: [
      "Add 5 minutes of stretching before this session",
      "Journal your intention for deeper clarity",
    ],
  },

  // Evening Wind-Down
  {
    id: "template_evening_release",
    userId: "template",
    intent: "evening_winddown",
    title: "Evening Release & Reflect",
    aiSummary: "Let go of the day's stress and transition into rest mode.",
    totalMinutes: 15,
    category: "evening",
    difficulty: "beginner",
    tags: ["evening", "reflection", "stress-relief"],
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: "step_1",
        kind: "check_in",
        order: 1,
        title: "Day Review",
        questions: [
          {
            id: "q_stress",
            label: "How stressed do you feel after today?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
          {
            id: "q_win",
            label: "What was one win from today?",
            type: "text",
            placeholder: "Even a small win counts...",
          },
        ],
      },
      {
        id: "step_2",
        kind: "breath",
        order: 2,
        title: "Releasing Breath",
        durationSec: 300,
        pattern: { inhale: 4, hold: 2, exhale: 6 },
        style: "calm",
        coaching: "With each exhale, imagine releasing tension from your day.",
      },
      {
        id: "step_3",
        kind: "meditation",
        order: 3,
        title: "Loving Kindness",
        durationSec: 360,
        style: "loving_kindness",
        script: "May I be peaceful. May I be safe. May I be healthy. May I rest easy. Repeat these phrases, letting the words settle into your heart. You deserve rest.",
      },
      {
        id: "step_4",
        kind: "check_in",
        order: 4,
        title: "Evening Reflection",
        questions: [
          {
            id: "q_peaceful",
            label: "How peaceful do you feel now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
        ],
      },
    ],
    followUpSuggestions: [
      "Try reading for 15 minutes after this",
      "Keep a gratitude journal by your bed",
    ],
  },

  // Crisis Support
  {
    id: "template_crisis_grounding",
    userId: "template",
    intent: "grounding",
    title: "Emergency Grounding",
    aiSummary: "Rapid stabilization using proven grounding techniques.",
    totalMinutes: 7,
    category: "crisis",
    difficulty: "beginner",
    tags: ["crisis", "grounding", "panic", "emergency"],
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: "step_1",
        kind: "check_in",
        order: 1,
        title: "Immediate Check",
        questions: [
          {
            id: "q_distress",
            label: "How distressed are you feeling right now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
        ],
      },
      {
        id: "step_2",
        kind: "breath",
        order: 2,
        title: "Box Breathing",
        durationSec: 240,
        pattern: { inhale: 4, hold: 4, exhale: 4, hold: 4 },
        style: "box",
        coaching: "Follow the square pattern. This is what Navy SEALs use.",
      },
      {
        id: "step_3",
        kind: "meditation",
        order: 3,
        title: "5-4-3-2-1 Grounding",
        durationSec: 180,
        style: "grounding",
        script: "Name 5 things you can see. 4 things you can touch. 3 things you can hear. 2 things you can smell. 1 thing you can taste. You are here. You are safe. You are present.",
      },
    ],
    followUpSuggestions: [
      "Call your support person if distress remains high",
      "Consider professional help if crises are frequent",
    ],
  },

  {
    id: "template_craving_wave",
    userId: "template",
    intent: "craving_wave",
    title: "Urge Surfing Session",
    aiSummary: "Ride the craving wave without acting on it.",
    totalMinutes: 10,
    category: "crisis",
    difficulty: "intermediate",
    tags: ["cravings", "urges", "recovery", "mindfulness"],
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: "step_1",
        kind: "check_in",
        order: 1,
        title: "Craving Assessment",
        questions: [
          {
            id: "q_urge",
            label: "How strong is your urge right now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
          {
            id: "q_trigger",
            label: "What triggered this urge?",
            type: "text",
            placeholder: "Person, place, feeling...",
          },
        ],
      },
      {
        id: "step_2",
        kind: "breath",
        order: 2,
        title: "Stabilizing Breath",
        durationSec: 180,
        pattern: { inhale: 4, exhale: 6 },
        style: "calm",
        coaching: "Ground yourself before surfing the urge.",
      },
      {
        id: "step_3",
        kind: "meditation",
        order: 3,
        title: "Urge Surfing",
        durationSec: 300,
        style: "mindfulness",
        script: "Notice the urge like a wave. Don't fight it. Don't feed it. Just watch it. Where do you feel it in your body? What thoughts come with it? Observe with curiosity. The wave will crest and fall. Urges always pass.",
      },
      {
        id: "step_4",
        kind: "check_in",
        order: 4,
        title: "Post-Wave Check",
        questions: [
          {
            id: "q_urge_after",
            label: "How strong is the urge now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
        ],
      },
    ],
    followUpSuggestions: [
      "Text your accountability partner",
      "Distract with a healthy activity for 20 minutes",
      "Track this urge in your journal",
    ],
  },

  // Focus & Clarity
  {
    id: "template_focus_prep",
    userId: "template",
    intent: "custom",
    title: "Deep Work Preparation",
    aiSummary: "Clear your mind and prime focus for productive work.",
    totalMinutes: 10,
    category: "focus",
    difficulty: "beginner",
    tags: ["focus", "productivity", "clarity", "work"],
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: "step_1",
        kind: "check_in",
        order: 1,
        title: "Pre-Work Check",
        questions: [
          {
            id: "q_focus",
            label: "How focused do you feel right now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
          {
            id: "q_goal",
            label: "What's your main goal for this work session?",
            type: "text",
            placeholder: "I want to accomplish...",
          },
        ],
      },
      {
        id: "step_2",
        kind: "breath",
        order: 2,
        title: "Clarity Breath",
        durationSec: 180,
        pattern: { inhale: 5, exhale: 5 },
        style: "coherence",
        coaching: "Balanced breathing brings mental clarity.",
      },
      {
        id: "step_3",
        kind: "meditation",
        order: 3,
        title: "Intention Setting",
        durationSec: 240,
        style: "visualization",
        script: "Visualize yourself working with complete focus. See yourself moving through tasks with ease. Feel the satisfaction of progress. Set the intention: 'I am focused and productive.'",
      },
    ],
    followUpSuggestions: [
      "Use the Pomodoro technique (25 min work, 5 min break)",
      "Repeat this before important meetings or creative work",
    ],
  },
];

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category) => {
  return SESSION_TEMPLATES.filter((t) => t.category === category);
};

/**
 * Get template by ID
 */
export const getTemplateById = (id) => {
  return SESSION_TEMPLATES.find((t) => t.id === id);
};

/**
 * Create session from template (with new ID and user ID)
 */
export const createSessionFromTemplate = (templateId, userId) => {
  const template = getTemplateById(templateId);
  if (!template) return null;

  return {
    ...template,
    id: generateSessionId(),
    userId: userId,
    createdAtIso: new Date().toISOString(),
    isFromTemplate: true,
    templateId: templateId,
  };
};

export default SESSION_TEMPLATES;
