import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward } from "lucide-react";

/**
 * BreathStepUI - Simplified breathing exercise for sessions
 * 
 * Lightweight breathing guide optimized for session flow.
 * Takes breathing pattern from BreathStep and guides the user.
 * 
 * @param {Object} props
 * @param {import("../../../domain/sessionPlan").BreathStep} props.step
 * @param {Function} props.onComplete
 * @param {Function} [props.onSkip]
 * @param {Object} props.metadata
 */
const BreathStepUI = ({ step, onComplete, onSkip, metadata }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("ready"); // ready | inhale | hold_top | exhale | hold_bottom
  const [cycleCount, setCycleCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const { pattern, durationSec, coaching } = step;
  const targetCycles = durationSec ? Math.floor(durationSec / getTotalCycleDuration()) : 5;

  // Calculate total cycle duration in seconds
  function getTotalCycleDuration() {
    return (
      pattern.inhale +
      (pattern.holdTop || 0) +
      pattern.exhale +
      (pattern.holdBottom || 0)
    );
  }

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get the next phase in the cycle
  const getNextPhase = (currentPhase) => {
    switch (currentPhase) {
      case "ready":
      case "inhale":
        return pattern.holdTop ? "hold_top" : "exhale";
      case "hold_top":
        return "exhale";
      case "exhale":
        return pattern.holdBottom ? "hold_bottom" : "inhale";
      case "hold_bottom":
        return "inhale";
      default:
        return "inhale";
    }
  };

  // Get phase duration in seconds
  const getPhaseDuration = (currentPhase) => {
    switch (currentPhase) {
      case "inhale":
        return pattern.inhale;
      case "hold_top":
        return pattern.holdTop || 0;
      case "exhale":
        return pattern.exhale;
      case "hold_bottom":
        return pattern.holdBottom || 0;
      default:
        return 0;
    }
  };

  // Get phase instruction text
  const getPhaseText = (currentPhase) => {
    switch (currentPhase) {
      case "ready":
        return "Ready to begin";
      case "inhale":
        return "Breathe in";
      case "hold_top":
        return "Hold";
      case "exhale":
        return "Breathe out";
      case "hold_bottom":
        return "Hold";
      default:
        return "";
    }
  };

  // Get orb scale for animation
  const getOrbScale = () => {
    if (!isActive) return 1;
    if (phase === "inhale") return 1.5;
    if (phase === "exhale") return 0.7;
    return 1;
  };

  // Get phase color
  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "#6366f1"; // indigo
      case "exhale":
        return "#10b981"; // emerald
      case "hold_top":
      case "hold_bottom":
        return "#8b5cf6"; // purple
      default:
        return "#64748b"; // slate
    }
  };

  // Start breathing session
  const handleStart = () => {
    setIsActive(true);
    setPhase("inhale");
    setElapsedSeconds(0);
    setCycleCount(0);
    startTimeRef.current = Date.now();
  };

  // Pause/resume
  const handlePause = () => {
    setIsActive(false);
    clearTimeout(timerRef.current);
  };

  const handleResume = () => {
    setIsActive(true);
  };

  // Complete early
  const handleComplete = () => {
    setIsActive(false);
    clearTimeout(timerRef.current);
    onComplete({
      breathingData: {
        cyclesCompleted: cycleCount,
        durationSeconds: elapsedSeconds,
        pattern: step.pattern,
      },
    });
  };

  // Breathing cycle controller
  useEffect(() => {
    if (!isActive || phase === "ready") return;

    const duration = getPhaseDuration(phase) * 1000; // Convert to ms

    timerRef.current = setTimeout(() => {
      const nextPhase = getNextPhase(phase);
      
      // Check if we completed a full cycle (transitioning from last phase to inhale)
      if (phase === (pattern.holdBottom ? "hold_bottom" : "exhale") && nextPhase === "inhale") {
        const newCount = cycleCount + 1;
        setCycleCount(newCount);
        
        // Auto-complete when target cycles reached
        if (newCount >= targetCycles) {
          handleComplete();
          return;
        }
      }
      
      setPhase(nextPhase);
    }, duration);

    return () => clearTimeout(timerRef.current);
  }, [isActive, phase, pattern, cycleCount, targetCycles]);

  // Elapsed time tracker
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Auto-complete when duration reached
  useEffect(() => {
    if (durationSec && elapsedSeconds >= durationSec && isActive) {
      handleComplete();
    }
  }, [elapsedSeconds, durationSec, isActive]);

  const progress = durationSec
    ? (elapsedSeconds / durationSec) * 100
    : (cycleCount / targetCycles) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{metadata.icon}</div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          {step.title}
        </h2>
        {step.description && (
          <p className="text-slate-600 mb-3">{step.description}</p>
        )}
        {coaching && (
          <p className="text-sm text-indigo-600 italic max-w-md mx-auto">
            "{coaching}"
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>
            {cycleCount} / {targetCycles} cycles
          </span>
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Breathing Orb */}
      <div className="relative flex items-center justify-center h-80 mb-6">
        <motion.div
          animate={{
            scale: getOrbScale(),
            backgroundColor: getPhaseColor(),
            boxShadow: isActive
              ? `0 0 80px ${getPhaseColor()}66`
              : "0 0 20px rgba(0,0,0,0.1)",
          }}
          transition={{
            duration: getPhaseDuration(phase),
            ease: "easeInOut",
          }}
          className="w-48 h-48 rounded-full flex items-center justify-center text-white font-semibold text-xl"
        >
          {getPhaseText(phase).toUpperCase()}
        </motion.div>

        {/* Subtle pulse ring */}
        {isActive && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: getPhaseDuration(phase),
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <div
              className="w-48 h-48 rounded-full border-2"
              style={{ borderColor: getPhaseColor() }}
            />
          </motion.div>
        )}
      </div>

      {/* Pattern Info */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6 grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-slate-500">Inhale:</span>
          <span className="ml-2 font-semibold">{pattern.inhale}s</span>
        </div>
        {pattern.holdTop > 0 && (
          <div>
            <span className="text-slate-500">Hold:</span>
            <span className="ml-2 font-semibold">{pattern.holdTop}s</span>
          </div>
        )}
        <div>
          <span className="text-slate-500">Exhale:</span>
          <span className="ml-2 font-semibold">{pattern.exhale}s</span>
        </div>
        {pattern.holdBottom > 0 && (
          <div>
            <span className="text-slate-500">Hold:</span>
            <span className="ml-2 font-semibold">{pattern.holdBottom}s</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!isActive && phase === "ready" ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Play size={20} />
            Start Breathing
          </button>
        ) : !isActive ? (
          <button
            onClick={handleResume}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Play size={20} />
            Resume
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
          >
            <Pause size={20} />
            Pause
          </button>
        )}

        {isActive && (
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            <SkipForward size={20} />
            Complete
          </button>
        )}

        {onSkip && !isActive && phase === "ready" && (
          <button
            onClick={onSkip}
            className="px-4 py-3 text-slate-500 hover:text-slate-700 transition-colors"
          >
            Skip Step
          </button>
        )}
      </div>
    </div>
  );
};

export default BreathStepUI;
