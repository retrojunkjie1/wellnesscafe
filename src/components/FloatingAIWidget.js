import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FloatingAIWidget.css";

const FloatingAIWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        className="floating-ai-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Assistant"
      >
        🤖
      </button>

      {isOpen && (
        <div className="floating-ai-panel">
          <div className="ai-header">
            <h3>Wellness AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="ai-body">
            <p>How can I help you today?</p>
            <div className="ai-quick-actions">
              <button onClick={() => navigate("/recovery")}>
                🧠 Recovery Support
              </button>
              <button onClick={() => navigate("/check-in")}>
                ✅ Daily Check-in
              </button>
              <button onClick={() => navigate("/providers/directory")}>
                👥 Find Provider
              </button>
              <button onClick={() => navigate("/assistance")}>
                🏛️ Get Assistance
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIWidget;
