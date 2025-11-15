import React, { useState } from "react";

/**
 * CheckInStepUI - Wrapper for check-in step in sessions
 * 
 * Collects user responses to questions defined in the CheckInStep.
 * Simplified version optimized for session context.
 * 
 * @param {Object} props
 * @param {import("../../../domain/sessionPlan").CheckInStep} props.step
 * @param {Function} props.onComplete
 * @param {Function} [props.onSkip]
 * @param {Object} props.metadata
 */
const CheckInStepUI = ({ step, onComplete, onSkip, metadata }) => {
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = step.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === step.questions.length - 1;
  const allAnswered = step.questions.every((q) => responses[q.id] !== undefined);

  const handleResponse = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Complete the step with collected responses
      onComplete({ checkInResponses: responses });
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const renderQuestionInput = (question) => {
    const value = responses[question.id];

    switch (question.type) {
      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-500">
                {question.scaleMin || 0}
              </span>
              <span className="text-sm text-slate-500">
                {question.scaleMax || 10}
              </span>
            </div>
            <input
              type="range"
              min={question.scaleMin || 0}
              max={question.scaleMax || 10}
              value={value || Math.floor((question.scaleMax || 10) / 2)}
              onChange={(e) =>
                handleResponse(question.id, parseInt(e.target.value))
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="text-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold">
                {value !== undefined
                  ? value
                  : Math.floor((question.scaleMax || 10) / 2)}
              </span>
            </div>
          </div>
        );

      case "text":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Type your response..."
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        );

      case "multi":
        // TODO: Implement multi-select option (Phase 2)
        return (
          <div className="text-sm text-slate-500 p-4 bg-slate-50 rounded-lg">
            Multi-select option coming soon. For now, please use text input.
          </div>
        );

      default:
        return (
          <div className="text-sm text-red-500">
            Unsupported question type: {question.type}
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{metadata.icon}</div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          {step.title}
        </h2>
        {step.description && (
          <p className="text-slate-600">{step.description}</p>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>
            Question {currentQuestionIndex + 1} of {step.questions.length}
          </span>
          <span>{Math.round(((currentQuestionIndex + 1) / step.questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / step.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <label className="block text-lg font-medium text-slate-700 mb-4">
          {currentQuestion.label}
        </label>
        {renderQuestionInput(currentQuestion)}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between">
        <div className="flex gap-2">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              ← Back
            </button>
          )}
          {onSkip && (
            <button
              onClick={onSkip}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              Skip Step
            </button>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={responses[currentQuestion.id] === undefined}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            responses[currentQuestion.id] !== undefined
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isLastQuestion ? "Complete Check-In" : "Next →"}
        </button>
      </div>

      {/* Quick Summary (if multiple questions answered) */}
      {Object.keys(responses).length > 1 && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <div className="text-sm font-medium text-slate-700 mb-2">
            Your Responses
          </div>
          <div className="space-y-1">
            {step.questions.map((q) => {
              const resp = responses[q.id];
              if (resp === undefined) return null;
              return (
                <div key={q.id} className="text-xs text-slate-600">
                  <span className="font-medium">{q.label}:</span>{" "}
                  <span>
                    {q.type === "scale"
                      ? `${resp}/${q.scaleMax || 10}`
                      : typeof resp === "string" && resp.length > 50
                      ? resp.substring(0, 50) + "..."
                      : resp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInStepUI;
