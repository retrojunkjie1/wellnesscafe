import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Sparkles } from "lucide-react";
import StepRenderer from "./steps/StepRenderer";
import { INTENT_METADATA, calculateTotalMinutes } from "../../domain/sessionPlan";

/**
 * SessionOrchestrator - Main session player component
 * 
 * Manages session flow, step navigation, data collection, and completion.
 * This is the orchestrator that brings the SessionPlan to life.
 * 
 * @param {Object} props
 * @param {import("../../domain/sessionPlan").SessionPlan} props.sessionPlan
 * @param {Function} [props.onComplete] - Called when session completes
 * @param {Function} [props.onExit] - Called when user exits session
 */
const SessionOrchestrator = ({ sessionPlan, onComplete, onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepCompletionData, setStepCompletionData] = useState([]);
  const [sessionStartTime] = useState(Date.now());
  const [showSummary, setShowSummary] = useState(false);

  const currentStep = sessionPlan.steps[currentStepIndex];
  const isLastStep = currentStepIndex === sessionPlan.steps.length - 1;
  const intentMeta = INTENT_METADATA[sessionPlan.intent] || INTENT_METADATA.custom;

  // Calculate progress
  const progressPercent = ((currentStepIndex + 1) / sessionPlan.steps.length) * 100;

  // Handle step completion
  const handleStepComplete = (stepData) => {
    // Store completion data
    const completionRecord = {
      stepId: currentStep.id,
      stepKind: currentStep.kind,
      stepOrder: currentStep.order,
      completedAt: new Date().toISOString(),
      data: stepData || {},
    };

    setStepCompletionData((prev) => [...prev, completionRecord]);

    // Advance to next step or show summary
    if (isLastStep) {
      setShowSummary(true);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Handle step skip
  const handleStepSkip = () => {
    const skipRecord = {
      stepId: currentStep.id,
      stepKind: currentStep.kind,
      stepOrder: currentStep.order,
      skipped: true,
      skippedAt: new Date().toISOString(),
    };

    setStepCompletionData((prev) => [...prev, skipRecord]);

    if (isLastStep) {
      setShowSummary(true);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      // Remove last completion data entry
      setStepCompletionData((prev) => prev.slice(0, -1));
    }
  };

  // Handle session completion
  const handleSessionComplete = () => {
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
    
    const sessionResult = {
      sessionId: sessionPlan.id,
      userId: sessionPlan.userId,
      intent: sessionPlan.intent,
      title: sessionPlan.title,
      completedAt: new Date().toISOString(),
      durationSeconds: sessionDuration,
      stepsCompleted: stepCompletionData.filter((s) => !s.skipped).length,
      stepsSkipped: stepCompletionData.filter((s) => s.skipped).length,
      totalSteps: sessionPlan.steps.length,
      stepData: stepCompletionData,
    };

    // TODO: Save to Firestore in Milestone 3
    console.log("Session completed:", sessionResult);

    if (onComplete) {
      onComplete(sessionResult);
    }
  };

  // Format session duration
  const formatDuration = () => {
    const seconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Render summary screen
  if (showSummary) {
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const completedCount = stepCompletionData.filter((s) => !s.skipped).length;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 py-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ backgroundColor: `${intentMeta.color}20` }}
          >
            <span className="text-4xl">{intentMeta.icon}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Session Complete! 🎉
          </h1>
          <p className="text-slate-600">
            Well done on completing your {sessionPlan.title}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Math.floor(sessionDuration / 60)}m
            </div>
            <div className="text-xs text-slate-600 mt-1">Duration</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {completedCount}/{sessionPlan.steps.length}
            </div>
            <div className="text-xs text-slate-600 mt-1">Steps Done</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-xs text-slate-600 mt-1">Complete</div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                AI Insight
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {sessionPlan.aiSummary || 
                  "Great work completing this session! Regular practice of these techniques will build lasting resilience and emotional regulation skills."}
              </p>
            </div>
          </div>
        </div>

        {/* Follow-up Suggestions */}
        {sessionPlan.followUpSuggestions &&
          sessionPlan.followUpSuggestions.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-slate-800 mb-3">
                💡 Next Steps
              </h3>
              <ul className="space-y-2">
                {sessionPlan.followUpSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-indigo-600 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleSessionComplete}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Finish & Save
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Render active session
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Session Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{intentMeta.icon}</span>
                <h1 className="text-lg font-semibold text-slate-800">
                  {sessionPlan.title}
                </h1>
              </div>
              <div className="text-xs text-slate-500">
                Step {currentStepIndex + 1} of {sessionPlan.steps.length}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock size={16} />
                <span className="font-mono">{formatDuration()}</span>
              </div>
              {onExit && (
                <button
                  onClick={onExit}
                  className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Exit
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full"
              style={{ backgroundColor: intentMeta.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <StepRenderer
              step={currentStep}
              onComplete={handleStepComplete}
              onSkip={handleStepSkip}
              sessionContext={{
                sessionId: sessionPlan.id,
                intent: sessionPlan.intent,
                currentStepIndex,
                totalSteps: sessionPlan.steps.length,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Back Button */}
        {currentStepIndex > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleBack}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              ← Go back to previous step
            </button>
          </div>
        )}
      </div>

      {/* Completed Steps Indicator */}
      <div className="fixed bottom-6 right-6 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
        <CheckCircle size={16} className="text-emerald-500" />
        <span className="text-sm font-medium text-slate-700">
          {stepCompletionData.filter((s) => !s.skipped).length} completed
        </span>
      </div>
    </div>
  );
};

export default SessionOrchestrator;
