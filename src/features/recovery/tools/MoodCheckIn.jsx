import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Smile, TrendingUp, Lock, Sparkles } from "lucide-react";
import "./MoodCheckIn.css";

const MOOD_SCALE = [
  { value: 1, emoji: "😢", label: "Terrible", color: "#e63946" },
  { value: 2, emoji: "😞", label: "Bad", color: "#f07167" },
  { value: 3, emoji: "😕", label: "Not Great", color: "#f4a261" },
  { value: 4, emoji: "😐", label: "Okay", color: "#e9c46a" },
  { value: 5, emoji: "🙂", label: "Fine", color: "#e9c46a" },
  { value: 6, emoji: "😊", label: "Good", color: "#b7ce63" },
  { value: 7, emoji: "😄", label: "Great", color: "#8fbc8f" },
  { value: 8, emoji: "😁", label: "Really Good", color: "#66bb6a" },
  { value: 9, emoji: "🤩", label: "Amazing", color: "#4db8a8" },
  { value: 10, emoji: "🎉", label: "Fantastic!", color: "#4db8a8" },
];

const AFFIRMATIONS_BY_MOOD = {
  low: [
    "This feeling is temporary. You've gotten through hard days before.",
    "It's okay to not be okay. Be gentle with yourself today.",
    "You are stronger than you feel right now.",
    "One small step is still progress. You're doing your best.",
    "This too shall pass. Brighter days are ahead.",
  ],
  medium: [
    "You're doing better than you think. Keep going.",
    "Every day is a fresh start. You're on the right path.",
    "Progress, not perfection. You're moving forward.",
    "You're capable of handling today's challenges.",
    "Trust the process. You're exactly where you need to be.",
  ],
  high: [
    "Your positive energy is contagious. Keep shining!",
    "You're crushing it today. This momentum is powerful.",
    "Your joy is your strength. Embrace this feeling.",
    "You deserve this happiness. Celebrate yourself!",
    "You're an inspiration. Share this positivity with others.",
  ],
};

const GRATITUDE_PROMPTS = [
  "What's one thing that made you smile today?",
  "Who are you grateful for right now?",
  "What's a small win you can celebrate today?",
  "What's something beautiful you noticed today?",
  "What strength did you show today?",
];

const MoodCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [gratitude, setGratitude] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [gratitudePrompt] = useState(
    GRATITUDE_PROMPTS[Math.floor(Math.random() * GRATITUDE_PROMPTS.length)]
  );

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    generateAffirmation(mood);
  };

  const generateAffirmation = (mood) => {
    let affirmationSet;
    if (mood <= 3) {
      affirmationSet = AFFIRMATIONS_BY_MOOD.low;
    } else if (mood <= 7) {
      affirmationSet = AFFIRMATIONS_BY_MOOD.medium;
    } else {
      affirmationSet = AFFIRMATIONS_BY_MOOD.high;
    }

    const randomIndex = Math.floor(Math.random() * affirmationSet.length);
    setAffirmation(affirmationSet[randomIndex]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMood) {
      setShowResults(true);
      // In production, save to Firestore with timestamp
      const checkIn = {
        mood: selectedMood,
        gratitude: gratitude,
        timestamp: new Date().toISOString(),
      };
      console.log("Mood Check-In:", checkIn);
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setGratitude("");
    setShowResults(false);
    setAffirmation("");
  };

  const getMoodData = () => {
    if (!selectedMood) return null;
    return MOOD_SCALE.find((m) => m.value === selectedMood);
  };

  const moodData = getMoodData();

  if (showResults) {
    return (
      <div className="mood-checkin">
        <Helmet>
          <title>Mood Check-In Complete - WellnessCafe</title>
        </Helmet>

        <div className="checkin-results">
          <div className="results-header">
            <div className="mood-emoji-large" style={{ color: moodData.color }}>
              {moodData.emoji}
            </div>
            <h2>Check-In Complete</h2>
            <p className="mood-label" style={{ color: moodData.color }}>
              You're feeling: <strong>{moodData.label}</strong>
            </p>
          </div>

          <div className="affirmation-card">
            <Sparkles className="affirmation-icon" />
            <p className="affirmation-text">"{affirmation}"</p>
          </div>

          {gratitude && (
            <div className="gratitude-display">
              <h3>Your Gratitude</h3>
              <p>{gratitude}</p>
            </div>
          )}

          <div className="upgrade-prompt">
            <Lock size={24} />
            <h3>Track Your Mood Over Time</h3>
            <p>
              See patterns, identify triggers, and understand what influences
              your mood. Premium members get 30-day analytics, trend graphs, and
              personalized insights.
            </p>
            <button className="upgrade-btn">Upgrade to Track Trends</button>
          </div>

          <div className="quick-tips">
            <h3>Based on Your Mood</h3>
            <ul>
              {selectedMood <= 3 ? (
                <>
                  <li>Try our Breathing Exercises for instant relief</li>
                  <li>Reach out to someone you trust</li>
                  <li>Take a short walk outside if possible</li>
                  <li>Remember: You don't have to feel this way forever</li>
                </>
              ) : selectedMood <= 7 ? (
                <>
                  <li>Keep up your healthy routines</li>
                  <li>Try a meditation session to maintain balance</li>
                  <li>Connect with supportive people today</li>
                  <li>Celebrate your progress, no matter how small</li>
                </>
              ) : (
                <>
                  <li>Share your positivity with others</li>
                  <li>Use this energy for something meaningful</li>
                  <li>Capture this feeling in a journal</li>
                  <li>You deserve this joy - embrace it fully!</li>
                </>
              )}
            </ul>
          </div>

          <div className="checkin-actions">
            <button className="btn-secondary" onClick={handleReset}>
              New Check-In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-checkin">
      <Helmet>
        <title>Daily Mood Check-In - WellnessCafe</title>
        <meta
          name="description"
          content="Check in with your mood daily. Simple 1-10 scale with personalized affirmations."
        />
      </Helmet>

      <div className="checkin-header">
        <Smile className="header-icon" />
        <h1>How Are You Feeling Today?</h1>
        <p>Take a moment to check in with yourself</p>
      </div>

      <form onSubmit={handleSubmit} className="checkin-form">
        <div className="mood-scale-section">
          <h3>Rate Your Mood (1-10)</h3>
          <div className="mood-scale">
            {MOOD_SCALE.map((mood) => (
              <button
                key={mood.value}
                type="button"
                className={`mood-option ${
                  selectedMood === mood.value ? "selected" : ""
                }`}
                onClick={() => handleMoodSelect(mood.value)}
                style={{
                  "--mood-color": mood.color,
                  borderColor:
                    selectedMood === mood.value ? mood.color : "transparent",
                }}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-value">{mood.value}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedMood && (
          <div className="affirmation-preview fade-in">
            <Sparkles size={20} />
            <p>"{affirmation}"</p>
          </div>
        )}

        {selectedMood && (
          <div className="gratitude-section fade-in">
            <h3>{gratitudePrompt}</h3>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Type your response here (optional)..."
              rows={4}
              className="gratitude-input"
            />
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={!selectedMood}
          style={{
            background:
              selectedMood && moodData
                ? `linear-gradient(135deg, ${moodData.color}, var(--wc-gold))`
                : undefined,
          }}
        >
          Complete Check-In
        </button>
      </form>

      <div className="checkin-info">
        <div className="info-card">
          <TrendingUp className="info-icon" />
          <h3>Why Daily Check-Ins Matter</h3>
          <ul>
            <li>Build self-awareness and emotional intelligence</li>
            <li>Catch negative patterns before they escalate</li>
            <li>Celebrate positive progress and wins</li>
            <li>Create a daily wellness habit</li>
          </ul>
        </div>

        <div className="upgrade-teaser">
          <Lock className="info-icon" />
          <h3>Premium Features</h3>
          <ul>
            <li>📊 30-day mood tracking & trends</li>
            <li>📈 Pattern recognition & insights</li>
            <li>📝 Unlimited gratitude entries</li>
            <li>🎯 Trigger & correlation analysis</li>
            <li>📱 Daily reminder notifications</li>
          </ul>
          <button className="upgrade-btn-small">Upgrade - $9.99/mo</button>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckIn;
