import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import SessionOrchestrator from "../features/wellness-sessions/SessionOrchestrator";
import { generateSessionId, generateStepId, INTENT_METADATA } from "../domain/sessionPlan";

/**
 * SessionDemoPage - Test page for SessionPlan system
 * 
 * Demonstrates the complete session flow with sample sessions.
 * Remove this page once AI generation is implemented.
 */
const SessionDemoPage = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [aiSessionResult, setAiSessionResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  /**
   * ========================================================
   * 🔥 AI SESSION GENERATOR TEST FUNCTION
   * ========================================================
   */
  async function generateSession() {
    try {
      setLoadingAI(true);
      setAiSessionResult(null);

      const response = await fetch("/aiSession", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          intent: "anxiety_relief",
          mood: "overwhelmed",
          duration: 5
        })
      });

      const data = await response.json();
      console.log("AI Session Plan:", data.sessionPlan);
      setAiSessionResult(data.sessionPlan);
    } catch (err) {
      console.error("AI Session Error:", err);
      setAiSessionResult({ error: "AI session failed. Check logs." });
    } finally {
      setLoadingAI(false);
    }
  }

  // Sample Session 1: Quick Anxiety Relief
  const anxietySession = {
    id: generateSessionId(),
    userId: "demo_user",
    intent: "calm_anxiety",
    title: "5-Minute Anxiety Relief",
    aiSummary: "A quick sequence to calm your nervous system when anxiety spikes. Check in, regulate your breath, and close with grounding awareness.",
    totalMinutes: 5,
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: generateStepId(1),
        kind: "check_in",
        order: 1,
        title: "Anxiety Check-In",
        description: "Let's see where you're at right now",
        questions: [
          {
            id: "q_anxiety",
            label: "How anxious do you feel right now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
          {
            id: "q_location",
            label: "Where do you feel it most in your body?",
            type: "text",
          },
        ],
      },
      {
        id: generateStepId(2),
        kind: "breath",
        order: 2,
        title: "Coherence Breathing",
        description: "Let's calm your nervous system",
        durationSec: 120,
        pattern: { inhale: 4, exhale: 6 },
        style: "coherence",
        coaching: "Breathe into your belly. Soften your jaw. Let each exhale be longer and slower.",
      },
      {
        id: generateStepId(3),
        kind: "check_in",
        order: 3,
        title: "Quick Re-Check",
        description: "Notice any shifts?",
        questions: [
          {
            id: "q_anxiety_after",
            label: "How anxious do you feel now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
        ],
      },
    ],
    followUpSuggestions: [
      "If still anxious, try a 10-minute version with gentle movement.",
      "Practice this technique daily for 2 weeks to build lasting resilience.",
    ],
  };

  // Sample Session 2: Full Wellness Practice
  const fullSession = {
    id: generateSessionId(),
    userId: "demo_user",
    intent: "grounding",
    title: "Complete Grounding Practice",
    aiSummary: "A comprehensive session combining breath, meditation, and reflection to ground you in the present moment.",
    totalMinutes: 12,
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: generateStepId(1),
        kind: "check_in",
        order: 1,
        title: "Initial Check-In",
        questions: [
          {
            id: "q_presence",
            label: "How present do you feel right now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
        ],
      },
      {
        id: generateStepId(2),
        kind: "breath",
        order: 2,
        title: "Box Breathing",
        description: "4-count breathing for mental clarity",
        durationSec: 180,
        pattern: { inhale: 4, holdTop: 4, exhale: 4, holdBottom: 4 },
        style: "box",
        coaching: "Equal counts on all four phases. Find your rhythm.",
      },
      {
        id: generateStepId(3),
        kind: "meditation",
        order: 3,
        title: "Grounding Meditation",
        description: "Connect with the present moment",
        durationSec: 300,
        style: "grounding",
        script: `Bring your attention to your feet on the ground.\n\nNotice the contact points. The pressure. The temperature.\n\nFeel the support of the earth beneath you.\n\nYou are here. You are safe. You are grounded.\n\nIf your mind wanders, gently return to the sensation of your feet.\n\nStay with this awareness. Nothing to do. Nowhere to go.\n\nJust here. Just now.`,
      },
      {
        id: generateStepId(4),
        kind: "check_in",
        order: 4,
        title: "Closing Reflection",
        questions: [
          {
            id: "q_presence_after",
            label: "How present do you feel now?",
            type: "scale",
            scaleMin: 0,
            scaleMax: 10,
          },
          {
            id: "q_takeaway",
            label: "What's one thing you're taking from this practice?",
            type: "text",
          },
        ],
      },
    ],
    followUpSuggestions: [
      "Practice this grounding sequence each morning for a week.",
      "Try extending the meditation to 10 minutes as you build comfort.",
    ],
  };

  // Sample Session 3: Morning Reset
  const morningSession = {
    id: generateSessionId(),
    userId: "demo_user",
    intent: "morning_reset",
    title: "Morning Intention Setting",
    aiSummary: "Start your day with clarity and purpose.",
    totalMinutes: 8,
    createdAtIso: new Date().toISOString(),
    steps: [
      {
        id: generateStepId(1),
        kind: "breath",
        order: 1,
        title: "Morning Energizer",
        description: "Wake up your nervous system",
        durationSec: 90,
        pattern: { inhale: 3, exhale: 3 },
        style: "custom",
        coaching: "Breathe with energy. Fill your lungs completely. Exhale fully.",
      },
      {
        id: generateStepId(2),
        kind: "meditation",
        order: 2,
        title: "Gratitude Reflection",
        durationSec: 180,
        style: "custom",
        script: `Think of three things you're grateful for today.\n\nThey can be small. Simple.\n\nNotice how gratitude feels in your body.\n\nLet that feeling expand.\n\nCarry this gratitude into your day.`,
      },
      {
        id: generateStepId(3),
        kind: "check_in",
        order: 3,
        title: "Set Your Intention",
        questions: [
          {
            id: "q_intention",
            label: "What's your intention for today?",
            type: "text",
          },
        ],
      },
    ],
    followUpSuggestions: [
      "Write your intention on a sticky note and place it somewhere visible.",
      "Check in with your intention at lunch time.",
    ],
  };

  const sampleSessions = [anxietySession, fullSession, morningSession];

  const handleStartSession = (session) => {
    setActiveSession(session);
  };

  const handleSessionComplete = (result) => {
    setCompletedSessions((prev) => [...prev, result]);
    setActiveSession(null);
  };

  const handleExit = () => {
    setActiveSession(null);
  };

  // If a session is active, render the orchestrator
  if (activeSession) {
    return (
      <>
        <Helmet>
          <title>{activeSession.title} - WellnessCafe Sessions</title>
        </Helmet>
        <SessionOrchestrator
          sessionPlan={activeSession}
          onComplete={handleSessionComplete}
          onExit={handleExit}
        />
      </>
    );
  }

  // Render session selection page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Helmet>
        <title>AI Wellness Sessions - Demo - WellnessCafe</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            AI Wellness Sessions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience AI-guided wellness practices combining breathwork,
            meditation, and mindful check-ins.
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-amber-100 text-amber-800 text-sm rounded-lg">
            🚧 Demo Mode - Testing SessionPlan Blueprint
          </div>
        </div>

        {/* ===========================
            AI SESSION GENERATOR TEST
        ============================ */}
        <div className="mb-12 p-6 bg-purple-50 border border-purple-200 rounded-xl">
          <h3 className="font-semibold text-purple-900 mb-3">
            🔮 Test AI Session Generator (Firebase → AI)
          </h3>

          <button
            onClick={generateSession}
            className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            disabled={loadingAI}
          >
            {loadingAI ? "Generating..." : "Generate AI Session"}
          </button>

          {aiSessionResult && (
            <pre className="mt-4 p-4 bg-white border border-purple-200 rounded-lg text-sm overflow-auto">
              {JSON.stringify(aiSessionResult, null, 2)}
            </pre>
          )}
        </div>

        {/* Completed Sessions Summary */}
        {completedSessions.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
            <h3 className="font-semibold text-emerald-900 mb-2">
              ✅ Sessions Completed Today: {completedSessions.length}
            </h3>
            <p className="text-sm text-emerald-700">
              Total practice time:{" "}
              {Math.floor(
                completedSessions.reduce((sum, s) => sum + s.durationSeconds, 0) /
                  60
              )}{" "}
              minutes
            </p>
          </div>
        )}

        {/* Sample Sessions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleSessions.map((session) => {
            const intentMeta = INTENT_METADATA[session.intent];
            return (
              <div
                key={session.id}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                  style={{ backgroundColor: `${intentMeta.color}20` }}
                >
                  <span className="text-2xl">{intentMeta.icon}</span>
                </div>

                <div
                  className="mb-1 text-xs uppercase tracking-wide font-semibold"
                  style={{ color: intentMeta.color }}
                >
                  {intentMeta.label}
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {session.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {session.aiSummary}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{session.steps.length} steps</span>
                  <span>~{session.totalMinutes} min</span>
                </div>

                <button
                  onClick={() => handleStartSession(session)}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Start Session
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-3">
            📋 What's Being Tested
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              ✅ <strong>SessionPlan Blueprint:</strong> Core type system and
              validation
            </li>
            <li>
              ✅ <strong>Step Rendering:</strong> CheckIn, Breath, and Meditation
              components
            </li>
            <li>
              ✅ <strong>Session Orchestrator:</strong> Flow management, progress
              tracking, data collection
            </li>
            <li>
              🚧 <strong>Firestore Integration:</strong> Coming in next phase
            </li>
            <li>
              🚧 <strong>AI Generation:</strong> OpenAI integration planned for
              Milestone 3
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SessionDemoPage;
