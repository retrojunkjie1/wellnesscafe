import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MoodCheckIn from "../../features/recovery/tools/MoodCheckIn";
import "./ToolPage.css";

const MoodCheckInPage = () => {
  return (
    <div className="tool-page">
      <Helmet>
        <title>Daily Mood Check-In - Free Wellness Tool | WellnessCafe</title>
        <meta
          name="description"
          content="Check in with your mood daily using our simple 1-10 scale with personalized affirmations and gratitude prompts. Build self-awareness and emotional wellness."
        />
        <meta
          name="keywords"
          content="mood tracker, emotional wellness, daily check-in, mental health, gratitude journal, self-awareness"
        />
      </Helmet>

      <div className="tool-page-header">
        <Link to="/tools" className="back-link">
          ← Back to Tools
        </Link>
        <div className="tool-title-section">
          <h1>Daily Mood Check-In</h1>
          <span className="free-badge">FREE</span>
        </div>
      </div>

      <div className="tool-stats">
        <div className="stat">
          <span className="stat-value">1-10</span>
          <span className="stat-label">Simple Scale</span>
        </div>
        <div className="stat">
          <span className="stat-value">5</span>
          <span className="stat-label">Mood Categories</span>
        </div>
        <div className="stat">
          <span className="stat-value">∞</span>
          <span className="stat-label">Daily Affirmations</span>
        </div>
      </div>

      <div className="tool-benefits">
        <h2>Why Daily Mood Check-Ins Work</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <span className="benefit-icon">🧠</span>
            <h3>Build Self-Awareness</h3>
            <p>
              Track how you're really feeling each day and recognize patterns in
              your emotional wellness journey.
            </p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">📈</span>
            <h3>Early Detection</h3>
            <p>
              Catch negative patterns before they escalate. Prevention is easier
              than recovery.
            </p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🎯</span>
            <h3>Personalized Support</h3>
            <p>
              Receive mood-specific affirmations and actionable tips tailored to
              how you're feeling right now.
            </p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🙏</span>
            <h3>Gratitude Practice</h3>
            <p>
              Daily gratitude prompts help shift focus to positive aspects of
              your life and build resilience.
            </p>
          </div>
        </div>
      </div>

      <div className="tool-component-wrapper">
        <MoodCheckIn />
      </div>

      <div className="tool-info-section">
        <h2>The Science of Daily Check-Ins</h2>
        <div className="info-content">
          <p>
            Research shows that daily mood tracking and gratitude practices are
            powerful tools for emotional wellness:
          </p>
          <ul>
            <li>
              <strong>Self-awareness:</strong> Regular check-ins help you
              understand your emotional patterns and triggers
            </li>
            <li>
              <strong>Gratitude impact:</strong> Studies show gratitude
              practices increase happiness by 25% and reduce depression
            </li>
            <li>
              <strong>Early intervention:</strong> Tracking mood helps catch
              downward spirals early when they're easier to address
            </li>
            <li>
              <strong>Positive reinforcement:</strong> Celebrating good days
              builds momentum and strengthens recovery
            </li>
          </ul>
          <p>
            <strong>Note:</strong> This is a wellness tool, not a substitute for
            professional mental health care. If you're experiencing persistent
            low mood or crisis, please reach out to a healthcare provider or
            call 988 (Suicide & Crisis Lifeline).
          </p>
        </div>
      </div>

      <div className="tool-page-footer">
        <h2>Ready to Build Better Emotional Awareness?</h2>
        <p>
          Join WellnessCafe to unlock premium mood tracking with 30-day
          analytics, pattern recognition, trigger analysis, and personalized
          insights.
        </p>
        <div className="cta-buttons">
          <Link to="/signup" className="cta-primary">
            Start Your Wellness Journey
          </Link>
          <Link to="/tools" className="cta-secondary">
            Explore More Tools
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckInPage;
