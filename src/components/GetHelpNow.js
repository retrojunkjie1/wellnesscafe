import React from "react";
import { Phone, MessageCircle, AlertTriangle } from "lucide-react";
import "./GetHelpNow.css";

/**
 * GetHelpNow - Smart crisis support button
 * Opens AI chat with contextual help prompts OR shows emergency resources
 * Props:
 *  - variant: 'mobile' | 'hero' | 'sticky' | 'inline'
 *  - onOpenAI: callback to open FloatingAIWidget with context
 *  - context: 'crisis' | 'recovery' | 'general' - pre-fills AI with relevant prompts
 */
const GetHelpNow = ({ variant = "inline", onOpenAI, context = "general" }) => {
  const [showEmergency, setShowEmergency] = React.useState(false);

  const handleGetHelp = () => {
    if (onOpenAI) {
      // Context-aware AI prompts
      const prompts = {
        crisis: "I'm in crisis and need immediate support. Can you help me?",
        recovery:
          "I need help with my recovery journey. What resources are available?",
        general: "I need help. What support options do you have?",
      };
      onOpenAI(prompts[context] || prompts.general);
    } else {
      // Fallback: show emergency resources
      setShowEmergency(true);
    }
  };

  const closeEmergency = () => setShowEmergency(false);

  return (
    <>
      <button
        className={`help-now-btn help-now-${variant}`}
        onClick={handleGetHelp}
        aria-label="Get help now"
      >
        <AlertTriangle className="help-icon pulse" aria-hidden="true" />
        <span className="help-text">Get Help Now</span>
      </button>

      {/* Emergency Resources Modal */}
      {showEmergency && (
        <div className="emergency-modal-overlay" onClick={closeEmergency}>
          <div className="emergency-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="emergency-close"
              onClick={closeEmergency}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="emergency-header">
              <AlertTriangle className="emergency-icon" />
              <h2>Immediate Help Available</h2>
            </div>

            <div className="emergency-content">
              <div className="emergency-card crisis">
                <Phone className="card-icon" />
                <h3>Crisis Support</h3>
                <p>
                  If you're in immediate danger or having thoughts of self-harm:
                </p>
                <a href="tel:988" className="emergency-link primary">
                  <Phone /> Call 988 - Suicide & Crisis Lifeline
                </a>
                <p className="emergency-note">
                  24/7, free, confidential support
                </p>
              </div>

              <div className="emergency-card">
                <MessageCircle className="card-icon" />
                <h3>Substance Use Support</h3>
                <p>Treatment referrals and information:</p>
                <a href="tel:18006624357" className="emergency-link">
                  <Phone /> Call 1-800-662-HELP (4357)
                </a>
                <p className="emergency-note">SAMHSA National Helpline</p>
              </div>

              <div className="emergency-card">
                <MessageCircle className="card-icon" />
                <h3>Text Support</h3>
                <p>Prefer to text? We've got you covered:</p>
                <a href="sms:741741" className="emergency-link">
                  <MessageCircle /> Text HOME to 741741
                </a>
                <p className="emergency-note">Crisis Text Line</p>
              </div>
            </div>

            <div className="emergency-footer">
              <p>You're not alone. Help is available 24/7.</p>
              <button onClick={closeEmergency} className="emergency-ok">
                Got it, thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GetHelpNow;
