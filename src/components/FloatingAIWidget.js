import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, MicOff, Send, Loader2 } from "lucide-react";
import "./FloatingAIWidget.css";

const FloatingAIWidget = forwardRef(
  ({ variant = "floating", initialPrompt = null, autoSend = false }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAutoSent, setHasAutoSent] = useState(false);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      // Scroll to bottom when messages change
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

    // Handle initial prompt from external trigger (GetHelpNow button)
    useEffect(() => {
      if (isOpen && initialPrompt && !hasAutoSent && autoSend) {
        setSearchQuery(initialPrompt);
        setHasAutoSent(true);

        // Auto-submit after a brief delay
        setTimeout(() => {
          const syntheticEvent = { preventDefault: () => {} };
          handleSearch(syntheticEvent);
        }, 300);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialPrompt, autoSend, hasAutoSent]);

    // Reset auto-send flag when closing
    useEffect(() => {
      if (!isOpen) {
        setHasAutoSent(false);
        if (initialPrompt && !autoSend) {
          setSearchQuery(""); // Clear pre-filled prompt if not auto-sending
        }
      }
    }, [isOpen, initialPrompt, autoSend]);

    useEffect(() => {
      // Initialize speech recognition if available
      if (
        "webkitSpeechRecognition" in window ||
        "SpeechRecognition" in window
      ) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = "";
          let finalTranscript = "";

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
            setTranscript("");
          }
        };

        recognitionRef.current.onerror = (event) => {
          // eslint-disable-next-line no-console
          console.error("Speech recognition error:", event.error);
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

    // Expose methods to parent components via ref
    useImperativeHandle(
      ref,
      () => ({
        openWithPrompt: (prompt) => {
          setSearchQuery(prompt);
          setIsOpen(true);
          setHasAutoSent(false);

          // Auto-submit the prompt
          setTimeout(() => {
            const syntheticEvent = { preventDefault: () => {} };
            handleSearch(syntheticEvent);
          }, 300);
        },
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        isOpen: () => isOpen,
      }),
      [isOpen]
    ); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleVoice = () => {
      if (!recognitionRef.current) {
        alert(
          "Voice recognition is not supported in your browser. Please try Chrome or Edge."
        );
        return;
      }

      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setTranscript("");
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to start recognition:", error);
        }
      }
    };

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchQuery.trim() || isLoading) return;

      const userMessage = searchQuery.trim();
      setSearchQuery("");
      setTranscript("");
      setIsLoading(true);

      // Add user message to chat
      const userMsg = { id: Date.now(), role: "user", text: userMessage };
      setMessages((prev) => [...prev, userMsg]);

      try {
        // Simulate AI response (replace with actual API call)
        // For now, provide intelligent routing responses
        const response = await getAIResponse(userMessage);

        const aiMsg = {
          id: Date.now() + 1,
          role: "assistant",
          text: response.text,
        };
        setMessages((prev) => [...prev, aiMsg]);

        // If there's a suggested navigation, add a button
        if (response.navigate) {
          setTimeout(() => {
            if (
              window.confirm(
                `Would you like to go to ${response.navigate.label}?`
              )
            ) {
              navigate(response.navigate.path);
              setIsOpen(false);
            }
          }, 500);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("AI response error:", error);
        const errorMsg = {
          id: Date.now() + 1,
          role: "assistant",
          text: "Sorry, I encountered an error. Please try asking in a different way or use the quick actions below.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    };

    // Intelligent response generator
    const getAIResponse = async (query) => {
      const lowerQuery = query.toLowerCase();

      // CRISIS SUPPORT - Highest priority
      if (
        lowerQuery.includes("crisis") ||
        lowerQuery.includes("suicide") ||
        lowerQuery.includes("hurt myself") ||
        (lowerQuery.includes("end") && lowerQuery.includes("life")) ||
        (lowerQuery.includes("help") &&
          (lowerQuery.includes("need") || lowerQuery.includes("urgent"))) ||
        lowerQuery.includes("emergency")
      ) {
        return {
          text: `🆘 **IMMEDIATE CRISIS SUPPORT**

If you're in crisis, you're not alone. Help is available 24/7:

**988 Suicide & Crisis Lifeline**
Call or text: 988
Available 24/7 for anyone in crisis

**SAMHSA National Helpline**  
1-800-662-HELP (4357)
24/7 treatment referral and information

**Crisis Text Line**
Text HOME to 741741
24/7 crisis counseling via text

You deserve support. These trained professionals are ready to help right now. Would you also like to see our recovery resources?`,
          navigate: { path: "/recovery", label: "Recovery Resources" },
        };
      }

      // Recovery-related queries
      if (
        lowerQuery.includes("recovery") ||
        lowerQuery.includes("sober") ||
        lowerQuery.includes("addiction") ||
        lowerQuery.includes("12 step")
      ) {
        return {
          text: "I can help you with recovery resources! We offer comprehensive recovery support including 12-step programs, peer support, medication-assisted treatment, and relapse prevention. Would you like to explore our recovery programs?",
          navigate: { path: "/recovery", label: "Recovery Page" },
        };
      }

      // Yoga/wellness queries
      if (
        lowerQuery.includes("yoga") ||
        lowerQuery.includes("meditation") ||
        lowerQuery.includes("stress")
      ) {
        return {
          text: "Our yoga and mindfulness programs can help! We offer various classes from beginner-friendly Hatha to dynamic Vinyasa, plus meditation and breathwork. 98% of our practitioners report significant stress reduction. Want to learn more?",
          navigate: { path: "/yoga", label: "Yoga Programs" },
        };
      }

      // Government assistance queries
      if (
        lowerQuery.includes("assistance") ||
        lowerQuery.includes("benefits") ||
        lowerQuery.includes("snap") ||
        lowerQuery.includes("medicaid") ||
        lowerQuery.includes("housing")
      ) {
        return {
          text: "I can help you navigate government assistance programs! We provide guidance for SNAP (food assistance), Medicaid, housing vouchers, utility assistance, and more. We've helped over 85,000 families access $2.4M in benefits. Would you like to check your eligibility?",
          navigate: { path: "/assistance", label: "Government Assistance" },
        };
      }

      // Provider/therapist queries
      if (
        lowerQuery.includes("provider") ||
        lowerQuery.includes("therapist") ||
        lowerQuery.includes("counselor") ||
        lowerQuery.includes("doctor")
      ) {
        return {
          text: "Looking for a healthcare provider? Our directory includes licensed therapists, counselors, addiction specialists, and wellness practitioners. All providers are verified and accept various insurance plans. Let me help you find the right match.",
          navigate: {
            path: "/providers/directory",
            label: "Provider Directory",
          },
        };
      }

      // Check-in queries
      if (
        lowerQuery.includes("check") ||
        lowerQuery.includes("progress") ||
        lowerQuery.includes("track") ||
        lowerQuery.includes("mood")
      ) {
        return {
          text: "Daily check-ins help you track your wellness journey! Log your mood, energy levels, challenges, and victories. Over time, you'll see patterns and celebrate progress. Ready to check in?",
          navigate: { path: "/check-in", label: "Daily Check-in" },
        };
      }

      // Acupuncture/TCM queries
      if (
        lowerQuery.includes("acupuncture") ||
        lowerQuery.includes("tcm") ||
        lowerQuery.includes("chinese medicine") ||
        lowerQuery.includes("meridian")
      ) {
        return {
          text: "Traditional Chinese Medicine and acupuncture can complement your wellness journey! We offer treatments for pain management, stress relief, addiction recovery support, and overall balance. Our practitioners are licensed and experienced.",
          navigate: { path: "/acuwellness", label: "Acuwellness Services" },
        };
      }

      // Spiritual counseling queries
      if (
        lowerQuery.includes("spiritual") ||
        lowerQuery.includes("faith") ||
        lowerQuery.includes("meaning") ||
        lowerQuery.includes("purpose")
      ) {
        return {
          text: "Spiritual counseling can provide deep support on your journey. Our counselors work with various faith traditions and spiritual practices to help you find meaning, process grief, and connect with your higher purpose. All are welcome, regardless of beliefs.",
          navigate: {
            path: "/spiritual-counseling",
            label: "Spiritual Counseling",
          },
        };
      }

      // Events queries
      if (
        lowerQuery.includes("event") ||
        lowerQuery.includes("workshop") ||
        lowerQuery.includes("group") ||
        lowerQuery.includes("meeting")
      ) {
        return {
          text: "We host regular events, workshops, and support groups! Check our calendar for upcoming meditation sessions, recovery meetings, wellness workshops, and community gatherings. All events are free or low-cost.",
          navigate: { path: "/events", label: "Events Calendar" },
        };
      }

      // Default helpful response
      return {
        text: `I'm here to help you with wellness resources! I can assist with:
      
• Recovery & addiction support
• Yoga & meditation classes  
• Government assistance programs
• Finding healthcare providers
• Daily wellness check-ins
• Acupuncture & holistic health
• Spiritual counseling
• Community events

What would you like to know more about?`,
      };
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
              <div
                className="ai-modal-overlay"
                onClick={() => setIsOpen(false)}
              />
              <div className="ai-modal-panel">
                <div className="ai-header">
                  <h3>🔍 Wellness AI Assistant</h3>
                  <button onClick={() => setIsOpen(false)} aria-label="Close">
                    ✕
                  </button>
                </div>
                <div className="ai-body">
                  {/* Messages Display */}
                  {messages.length > 0 && (
                    <div className="ai-messages">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`ai-message ${msg.role}`}>
                          <div className="message-content">{msg.text}</div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="ai-message assistant">
                          <div className="message-content">
                            <Loader2 size={16} className="spin" /> Thinking...
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  <form onSubmit={handleSearch} className="ai-search-form">
                    <div className="ai-input-group">
                      <input
                        type="text"
                        value={transcript || searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ask me anything about wellness..."
                        className="ai-search-input"
                        autoFocus
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleVoice}
                        className={`ai-voice-btn ${
                          isListening ? "listening" : ""
                        }`}
                        aria-label={
                          isListening ? "Stop listening" : "Start voice input"
                        }
                        title={isListening ? "Stop listening" : "Voice search"}
                        disabled={isLoading}
                      >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                      </button>
                      <button
                        type="submit"
                        className="ai-submit-btn"
                        disabled={!searchQuery.trim() || isLoading}
                        aria-label="Submit search"
                      >
                        {isLoading ? (
                          <Loader2 size={18} className="spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                    {isListening && (
                      <div className="ai-listening-indicator">
                        🎤 Listening...
                      </div>
                    )}
                  </form>

                  {messages.length === 0 && (
                    <div className="ai-quick-actions">
                      <p className="ai-quick-title">Quick Actions:</p>
                      <button
                        onClick={() => {
                          navigate("/recovery");
                          setIsOpen(false);
                        }}
                      >
                        🧠 Recovery Support
                      </button>
                      <button
                        onClick={() => {
                          navigate("/yoga");
                          setIsOpen(false);
                        }}
                      >
                        🧘 Yoga & Meditation
                      </button>
                      <button
                        onClick={() => {
                          navigate("/check-in");
                          setIsOpen(false);
                        }}
                      >
                        ✅ Daily Check-in
                      </button>
                      <button
                        onClick={() => {
                          navigate("/assistance");
                          setIsOpen(false);
                        }}
                      >
                        🏛️ Get Assistance
                      </button>
                    </div>
                  )}
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
              {/* Messages Display */}
              {messages.length > 0 && (
                <div className="ai-messages">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`ai-message ${msg.role}`}>
                      <div className="message-content">{msg.text}</div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="ai-message assistant">
                      <div className="message-content">
                        <Loader2 size={16} className="spin" /> Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              <form onSubmit={handleSearch} className="ai-search-form">
                <div className="ai-input-group">
                  <input
                    type="text"
                    value={transcript || searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask me anything..."
                    className="ai-search-input"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className={`ai-voice-btn ${isListening ? "listening" : ""}`}
                    aria-label={
                      isListening ? "Stop listening" : "Start voice input"
                    }
                    disabled={isLoading}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                  <button
                    type="submit"
                    className="ai-submit-btn"
                    disabled={!searchQuery.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
                {isListening && (
                  <div className="ai-listening-indicator">🎤 Listening...</div>
                )}
              </form>

              {messages.length === 0 && (
                <div className="ai-quick-actions">
                  <button
                    onClick={() => {
                      navigate("/recovery");
                      setIsOpen(false);
                    }}
                  >
                    🧠 Recovery Support
                  </button>
                  <button
                    onClick={() => {
                      navigate("/yoga");
                      setIsOpen(false);
                    }}
                  >
                    🧘 Yoga & Meditation
                  </button>
                  <button
                    onClick={() => {
                      navigate("/check-in");
                      setIsOpen(false);
                    }}
                  >
                    ✅ Daily Check-in
                  </button>
                  <button
                    onClick={() => {
                      navigate("/assistance");
                      setIsOpen(false);
                    }}
                  >
                    🏛️ Get Assistance
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
);

FloatingAIWidget.displayName = "FloatingAIWidget";

export default FloatingAIWidget;
