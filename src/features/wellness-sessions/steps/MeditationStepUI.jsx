import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward } from "lucide-react";

/**
 * MeditationStepUI - Guided meditation for sessions
 * 
 * Displays meditation script and provides timer for practice.
 * Simplified version optimized for session context.
 * 
 * @param {Object} props
 * @param {import("../../../domain/sessionPlan").MeditationStep} props.step
 * @param {Function} props.onComplete
 * @param {Function} [props.onSkip]
 * @param {Object} props.metadata
 */
const MeditationStepUI = ({ step, onComplete, onSkip, metadata }) => {
  const [isActive, setIsActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showScript, setShowScript] = useState(true);
  const intervalRef = useRef(null);

  const { script, durationSec, style } = step;
  const targetDuration = durationSec || 300; // Default 5 minutes

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start meditation
  const handleStart = () => {
    setIsActive(true);
    setElapsedSeconds(0);
  };

  // Pause
  const handlePause = () => {
    setIsActive(false);
  };

  // Resume
  const handleResume = () => {
    setIsActive(true);
  };

  // Complete meditation
  const handleComplete = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onComplete({
      meditationData: {
        durationSeconds: elapsedSeconds,
        style: step.style,
        completed: elapsedSeconds >= targetDuration,
      },
    });
  };

  // Timer effect
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        // Auto-complete when target duration reached
        if (next >= targetDuration) {
          handleComplete();
          return prev;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, targetDuration]);

  const progress = (elapsedSeconds / targetDuration) * 100;

  // Get meditation style info
  const getStyleInfo = () => {
    switch (style) {
      case "body_scan":
        return { color: "#8b5cf6", emoji: "🧘‍♀️" };
      case "loving_kindness":
        return { color: "#ec4899", emoji: "💖" };
      case "breath_focus":
        return { color: "#0ea5e9", emoji: "🫁" };
      case "grounding":
        return { color: "#10b981", emoji: "🌱" };
      default:
        return { color: "#6366f1", emoji: "✨" };
    }
  };

  const styleInfo = getStyleInfo();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{styleInfo.emoji}</div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          {step.title}
        </h2>
        {step.description && (
          <p className="text-slate-600">{step.description}</p>
        )}
        <div className="mt-2">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium uppercase tracking-wide">
            {style.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>{formatTime(elapsedSeconds)}</span>
          <span>Target: {formatTime(targetDuration)}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: styleInfo.color,
            }}
          />
        </div>
      </div>

      {/* Script Display */}
      {showScript && (
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Meditation Guide
            </h3>
            <button
              onClick={() => setShowScript(false)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Hide
            </button>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {script}
            </p>
          </div>
        </div>
      )}

      {!showScript && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6 text-center">
          <button
            onClick={() => setShowScript(true)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Show Meditation Guide
          </button>
        </div>
      )}

      {/* Visual Timer - Pulsing Circle */}
      {isActive && (
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-1000"
              style={{
                backgroundColor: styleInfo.color,
                animation: "pulse 4s ease-in-out infinite",
              }}
            >
              <span className="text-lg">{formatTime(elapsedSeconds)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center items-center">
        {!isActive && elapsedSeconds === 0 ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Play size={20} />
            Begin Meditation
          </button>
        ) : isActive ? (
          <>
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
            >
              <Pause size={20} />
              Pause
            </button>
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              <SkipForward size={20} />
              Complete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleResume}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <Play size={20} />
              Resume
            </button>
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              <SkipForward size={20} />
              Complete
            </button>
          </>
        )}

        {onSkip && !isActive && elapsedSeconds === 0 && (
          <button
            onClick={onSkip}
            className="px-4 py-3 text-slate-500 hover:text-slate-700 transition-colors"
          >
            Skip Step
          </button>
        )}
      </div>

      {/* Tips */}
      {!isActive && elapsedSeconds === 0 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Meditation Tips
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Find a comfortable seated or lying position</li>
            <li>• Close your eyes or maintain a soft gaze</li>
            <li>• Let thoughts pass without judgment</li>
            <li>• Return gently to the practice when distracted</li>
          </ul>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
};

export default MeditationStepUI;
