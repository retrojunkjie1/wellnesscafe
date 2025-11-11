import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ClipboardCheck, AlertCircle, TrendingUp, Lock } from "lucide-react";
import "./StressAssessment.css";

// PSS-10 Questions (Perceived Stress Scale)
const PSS10_QUESTIONS = [
  {
    id: 1,
    text: "In the last month, how often have you been upset because of something that happened unexpectedly?",
    reversed: false,
  },
  {
    id: 2,
    text: "In the last month, how often have you felt that you were unable to control the important things in your life?",
    reversed: false,
  },
  {
    id: 3,
    text: "In the last month, how often have you felt nervous and stressed?",
    reversed: false,
  },
  {
    id: 4,
    text: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    reversed: true,
  },
  {
    id: 5,
    text: "In the last month, how often have you felt that things were going your way?",
    reversed: true,
  },
  {
    id: 6,
    text: "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    reversed: false,
  },
  {
    id: 7,
    text: "In the last month, how often have you been able to control irritations in your life?",
    reversed: true,
  },
  {
    id: 8,
    text: "In the last month, how often have you felt that you were on top of things?",
    reversed: true,
  },
  {
    id: 9,
    text: "In the last month, how often have you been angered because of things that were outside of your control?",
    reversed: false,
  },
  {
    id: 10,
    text: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
    reversed: false,
  },
];

const LIKERT_OPTIONS = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost Never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly Often" },
  { value: 4, label: "Very Often" },
];

const StressAssessment = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const calculateScore = () => {
    let total = 0;
    PSS10_QUESTIONS.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        // Reverse scoring for positive questions (4, 5, 7, 8)
        if (question.reversed) {
          total += 4 - answer;
        } else {
          total += answer;
        }
      }
    });
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all questions answered
    if (Object.keys(answers).length < PSS10_QUESTIONS.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetake = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStressLevel = (score) => {
    if (score <= 13)
      return {
        level: "Low",
        color: "#4db8a8",
        description: "You appear to be managing stress well.",
      };
    if (score <= 26)
      return {
        level: "Moderate",
        color: "#f4a261",
        description: "You are experiencing moderate stress levels.",
      };
    return {
      level: "High",
      color: "#e63946",
      description:
        "You are experiencing high stress that may benefit from intervention.",
    };
  };

  const getRecommendations = (score) => {
    if (score <= 13) {
      return [
        "Continue your current stress management practices",
        "Maintain healthy routines (sleep, exercise, nutrition)",
        "Stay connected with supportive relationships",
        "Practice preventive self-care regularly",
      ];
    } else if (score <= 26) {
      return [
        "Prioritize daily stress-reduction activities",
        "Try our Breathing Exercises or Meditation Timer",
        "Identify and limit major stressors where possible",
        "Consider talking to a supportive friend or counselor",
        "Establish consistent sleep and exercise routines",
      ];
    } else {
      return [
        "Consider speaking with a mental health professional",
        "Use our Recovery Tools daily for stress management",
        "Practice deep breathing exercises multiple times daily",
        "Identify urgent stressors and create an action plan",
        "Prioritize sleep, nutrition, and gentle movement",
        "Reach out to your support network immediately",
      ];
    }
  };

  const stressData = getStressLevel(score);
  const progressPercentage =
    (Object.keys(answers).length / PSS10_QUESTIONS.length) * 100;

  if (showResults) {
    return (
      <div className="stress-assessment">
        <Helmet>
          <title>Your Stress Assessment Results - WellnessCafe</title>
          <meta
            name="description"
            content="Review your PSS-10 stress assessment results and personalized recommendations."
          />
        </Helmet>

        <div className="results-container">
          <div className="results-header">
            <ClipboardCheck
              className="results-icon"
              style={{ color: stressData.color }}
            />
            <h1>Your Stress Assessment Results</h1>
            <p>Based on the Perceived Stress Scale (PSS-10)</p>
          </div>

          <div
            className="score-display"
            style={{ borderColor: stressData.color }}
          >
            <div className="score-number" style={{ color: stressData.color }}>
              {score}
              <span className="score-total">/40</span>
            </div>
            <div
              className="stress-level"
              style={{
                background: `linear-gradient(135deg, ${stressData.color}, ${stressData.color}dd)`,
              }}
            >
              {stressData.level} Stress
            </div>
            <p className="stress-description">{stressData.description}</p>
          </div>

          <div className="stress-breakdown">
            <h2>What This Means</h2>
            <div className="score-ranges">
              <div className={`range-item ${score <= 13 ? "active" : ""}`}>
                <div className="range-indicator low"></div>
                <div>
                  <strong>Low Stress (0-13)</strong>
                  <p>Stress is well-managed</p>
                </div>
              </div>
              <div
                className={`range-item ${
                  score > 13 && score <= 26 ? "active" : ""
                }`}
              >
                <div className="range-indicator moderate"></div>
                <div>
                  <strong>Moderate Stress (14-26)</strong>
                  <p>Noticeable stress levels</p>
                </div>
              </div>
              <div className={`range-item ${score > 26 ? "active" : ""}`}>
                <div className="range-indicator high"></div>
                <div>
                  <strong>High Stress (27-40)</strong>
                  <p>Significant stress requiring attention</p>
                </div>
              </div>
            </div>
          </div>

          <div className="recommendations-section">
            <h2>Personalized Recommendations</h2>
            <ul className="recommendations-list">
              {getRecommendations(score).map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="cta-section">
            <div className="premium-upsell">
              <Lock size={24} />
              <h3>Track Your Stress Over Time</h3>
              <p>
                Premium members can save assessments, track progress, and
                receive personalized insights.
              </p>
              <button className="upgrade-btn">
                Upgrade to Premium - $9.99/mo
              </button>
            </div>

            <div className="tools-cta">
              <h3>Try Our Free Stress Relief Tools</h3>
              <div className="tools-grid">
                <button className="tool-cta-btn">🧘 Meditation Timer</button>
                <button className="tool-cta-btn">🌬️ Breathing Exercises</button>
                <button className="tool-cta-btn">✨ Daily Affirmations</button>
              </div>
            </div>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={handleRetake}>
              Take Assessment Again
            </button>
          </div>

          <div className="disclaimer">
            <AlertCircle size={18} />
            <p>
              <strong>Important:</strong> This assessment is a screening tool,
              not a diagnostic instrument. If you're experiencing significant
              distress, please consult a mental health professional.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stress-assessment">
      <Helmet>
        <title>Stress Assessment (PSS-10) - WellnessCafe</title>
        <meta
          name="description"
          content="Take the scientifically-validated PSS-10 stress assessment to understand your stress levels."
        />
      </Helmet>

      <div className="assessment-header">
        <ClipboardCheck className="header-icon" />
        <h1>Stress Level Assessment</h1>
        <p>
          Complete this 10-question survey to understand your current stress
          level
        </p>
        <div className="assessment-badge">
          <TrendingUp size={16} />
          <span>Evidence-Based • PSS-10</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {Object.keys(answers).length} of {PSS10_QUESTIONS.length} questions
          answered
        </p>
      </div>

      <form onSubmit={handleSubmit} className="assessment-form">
        {PSS10_QUESTIONS.map((question, index) => (
          <div key={question.id} className="question-card">
            <div className="question-number">Question {index + 1}</div>
            <h3 className="question-text">{question.text}</h3>

            <div className="likert-scale">
              {LIKERT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`likert-option ${
                    answers[question.id] === option.value ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={() =>
                      handleAnswerChange(question.id, option.value)
                    }
                  />
                  <span className="option-value">{option.value}</span>
                  <span className="option-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="submit-btn"
          disabled={Object.keys(answers).length < PSS10_QUESTIONS.length}
        >
          Calculate My Stress Level
        </button>
      </form>

      <div className="assessment-info">
        <h3>About the PSS-10</h3>
        <p>
          The Perceived Stress Scale (PSS-10) is the most widely used
          psychological instrument for measuring the perception of stress. It is
          a reliable and validated measure of the degree to which situations in
          one's life are appraised as stressful.
        </p>
        <p>
          Scores range from 0-40, with higher scores indicating higher perceived
          stress. This assessment helps you understand your stress levels and
          provides personalized recommendations for managing stress effectively.
        </p>
      </div>

      <div className="disclaimer">
        <AlertCircle size={18} />
        <p>
          <strong>Confidential:</strong> Your responses are private and not
          shared. This is a self-assessment tool, not a medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default StressAssessment;
