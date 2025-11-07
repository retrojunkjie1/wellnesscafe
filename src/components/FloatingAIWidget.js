import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, MicOff, Send } from "lucide-react";
import "./FloatingAIWidget.css";

const FloatingAIWidget = ({ variant = "floating" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setTranscript(interimTranscript || finalTranscript);
        if (finalTranscript) {
          setSearchQuery(finalTranscript);
          setTranscript('');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to AI chat page with query
      navigate(`/wellness-ai?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const isNavbar = variant === "navbar";

  if (isNavbar) {
    return (
      <div className="ai-widget-navbar">
        <button
          className="ai-navbar-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="AI Search"
          title="AI Search & Voice Assistant"
        >
          <Search size={14} />
        </button>

        {isOpen && (
          <>
            <div className="ai-modal-overlay" onClick={() => setIsOpen(false)} />
            <div className="ai-modal-panel">
              <div className="ai-header">
                <h3>🔍 AI Search</h3>
                <button onClick={() => setIsOpen(false)} aria-label="Close">✕</button>
              </div>
              <div className="ai-body">
                <form onSubmit={handleSearch} className="ai-search-form">
                  <div className="ai-input-group">
                    <input
                      type="text"
                      value={transcript || searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask me anything about wellness..."
                      className="ai-search-input"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={toggleVoice}
                      className={`ai-voice-btn ${isListening ? 'listening' : ''}`}
                      aria-label={isListening ? "Stop listening" : "Start voice input"}
                      title={isListening ? "Stop listening" : "Voice search"}
                    >
                      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    <button
                      type="submit"
                      className="ai-submit-btn"
                      disabled={!searchQuery.trim()}
                      aria-label="Submit search"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  {isListening && (
                    <div className="ai-listening-indicator">
                      🎤 Listening...
                    </div>
                  )}
                </form>

                <div className="ai-quick-actions">
                  <p className="ai-quick-title">Quick Actions:</p>
                  <button onClick={() => { navigate("/recovery"); setIsOpen(false); }}>
                    🧠 Recovery Support
                  </button>
                  <button onClick={() => { navigate("/check-in"); setIsOpen(false); }}>
                    ✅ Daily Check-in
                  </button>
                  <button onClick={() => { navigate("/providers/directory"); setIsOpen(false); }}>
                    👥 Find Provider
                  </button>
                  <button onClick={() => { navigate("/assistance"); setIsOpen(false); }}>
                    🏛️ Get Assistance
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Original floating variant (kept for backward compatibility)
  return (
    <>
      <button
        className="floating-ai-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Assistant"
      >
        🔍
      </button>

      {isOpen && (
        <div className="floating-ai-panel">
          <div className="ai-header">
            <h3>Wellness AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="ai-body">
            <form onSubmit={handleSearch} className="ai-search-form">
              <div className="ai-input-group">
                <input
                  type="text"
                  value={transcript || searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask me anything..."
                  className="ai-search-input"
                />
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`ai-voice-btn ${isListening ? 'listening' : ''}`}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button
                  type="submit"
                  className="ai-submit-btn"
                  disabled={!searchQuery.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
              {isListening && (
                <div className="ai-listening-indicator">
                  🎤 Listening...
                </div>
              )}
            </form>

            <div className="ai-quick-actions">
              <button onClick={() => { navigate("/recovery"); setIsOpen(false); }}>
                🧠 Recovery Support
              </button>
              <button onClick={() => { navigate("/check-in"); setIsOpen(false); }}>
                ✅ Daily Check-in
              </button>
              <button onClick={() => { navigate("/providers/directory"); setIsOpen(false); }}>
                👥 Find Provider
              </button>
              <button onClick={() => { navigate("/assistance"); setIsOpen(false); }}>
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
