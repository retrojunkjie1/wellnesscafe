import React from "react";
import { STEP_KIND_METADATA } from "../../../domain/sessionPlan";
import CheckInStepUI from "./CheckInStepUI";
import BreathStepUI from "./BreathStepUI";
import MeditationStepUI from "./MeditationStepUI";
// import JournalingStepUI from "./JournalingStepUI";
// import YogaStepUI from "./YogaStepUI";
// import EducationStepUI from "./EducationStepUI";
// import ReflectionStepUI from "./ReflectionStepUI";
// import MediaStepUI from "./MediaStepUI";
// import ProviderStepUI from "./ProviderStepUI";

/**
 * StepRenderer - Routes session steps to appropriate UI components
 * 
 * This component acts as a router, taking a SessionStep object and
 * rendering the appropriate specialized UI component based on the step.kind.
 * 
 * @param {Object} props
 * @param {import("../../../domain/sessionPlan").SessionStep} props.step - The step to render
 * @param {Function} props.onComplete - Callback when step is completed
 * @param {Function} [props.onSkip] - Optional callback to skip the step
 * @param {Object} [props.sessionContext] - Optional context about the full session
 */
const StepRenderer = ({ step, onComplete, onSkip, sessionContext }) => {
  // Get step metadata for display
  const metadata = STEP_KIND_METADATA[step.kind] || {
    label: "Unknown Step",
    icon: "❓",
    color: "#6b7280",
  };

  // Common props to pass to all step UIs
  const commonProps = {
    step,
    onComplete,
    onSkip,
    sessionContext,
    metadata,
  };

  // Route to appropriate step UI based on kind
  switch (step.kind) {
    case "check_in":
      return <CheckInStepUI {...commonProps} />;

    case "breath":
      return <BreathStepUI {...commonProps} />;

    case "meditation":
      return <MeditationStepUI {...commonProps} />;

    // TODO: Implement remaining step types in Phase 5
    case "journaling":
      return <PlaceholderStepUI {...commonProps} message="Journaling step coming soon" />;

    case "yoga":
      return <PlaceholderStepUI {...commonProps} message="Yoga/Movement step coming soon" />;

    case "education":
      return <PlaceholderStepUI {...commonProps} message="Education step coming soon" />;

    case "reflection":
      return <PlaceholderStepUI {...commonProps} message="Reflection step coming soon" />;

    case "media":
      return <PlaceholderStepUI {...commonProps} message="Media step coming soon" />;

    case "provider_suggestion":
      return <PlaceholderStepUI {...commonProps} message="Provider suggestion coming soon" />;

    default:
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
          <div className="text-red-600 font-semibold mb-2">
            ⚠️ Unsupported Step Type
          </div>
          <div className="text-sm text-red-500">
            Unknown step kind: <code>{step.kind}</code>
          </div>
          {onSkip && (
            <button
              onClick={onSkip}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm"
            >
              Skip This Step
            </button>
          )}
        </div>
      );
  }
};

/**
 * Placeholder UI for unimplemented step types
 */
const PlaceholderStepUI = ({ step, metadata, onComplete, onSkip, message }) => {
  return (
    <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center">
      <div className="text-4xl mb-3">{metadata.icon}</div>
      <div className="text-lg font-semibold text-slate-700 mb-2">
        {step.title}
      </div>
      {step.description && (
        <div className="text-sm text-slate-500 mb-4">{step.description}</div>
      )}
      <div className="inline-block px-4 py-2 bg-amber-100 text-amber-700 text-sm rounded-lg mb-4">
        {message}
      </div>
      <div className="flex gap-3 justify-center mt-6">
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm"
          >
            Skip
          </button>
        )}
        {onComplete && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default StepRenderer;
