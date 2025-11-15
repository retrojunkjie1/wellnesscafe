import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SessionOrchestrator from "./SessionOrchestrator";

/**
 * ActiveSession - Wrapper page for running a session
 * Receives sessionPlan from navigation state
 */
const ActiveSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionPlan = location.state?.sessionPlan;

  // If no session plan provided, redirect to templates
  if (!sessionPlan) {
    navigate("/sessions/templates");
    return null;
  }

  const handleComplete = (sessionResult) => {
    console.log("Session completed:", sessionResult);
    // Navigate to a completion page or back to templates
    navigate("/sessions/templates", {
      state: { message: "Session completed successfully!" },
    });
  };

  const handleExit = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit this session? Your progress will not be saved."
    );
    if (confirmExit) {
      navigate("/sessions/templates");
    }
  };

  return (
    <SessionOrchestrator
      sessionPlan={sessionPlan}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
};

export default ActiveSession;
