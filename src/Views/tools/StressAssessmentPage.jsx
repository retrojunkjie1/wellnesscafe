import React from "react";
import { Link } from "react-router-dom";
import StressAssessment from "../../features/recovery/tools/StressAssessment";
import "./ToolPage.css";

const StressAssessmentPage = () => {
  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <Link to="/tools" className="back-link">
          ← Back to Tools
        </Link>
        <div className="tool-badge free-badge">FREE</div>
      </div>

      <div className="tool-page-content">
        <div className="tool-intro">
          <h1>Stress Level Assessment</h1>
          <p className="tool-description">
            Take the scientifically-validated PSS-10 (Perceived Stress Scale) to
            understand your current stress levels. Receive personalized
            recommendations and track your progress over time.
          </p>

          <div className="tool-stats">
            <div className="stat-item">
              <span className="stat-value">PSS-10</span>
              <span className="stat-label">Evidence-Based Tool</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">10</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">3</span>
              <span className="stat-label">Stress Levels</span>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">🔬</span>
              <h3>Scientifically Valid</h3>
              <p>Most widely-used psychological measure of stress perception</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📊</span>
              <h3>Clear Results</h3>
              <p>
                Get your stress score with interpretation and severity level
              </p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💡</span>
              <h3>Personalized Tips</h3>
              <p>Receive recommendations based on your stress level</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📈</span>
              <h3>Track Progress</h3>
              <p>Monitor your stress levels over time (Premium feature)</p>
            </div>
          </div>

          <div className="assessment-info-box">
            <h3>About the PSS-10</h3>
            <p>
              The Perceived Stress Scale is a globally recognized tool for
              measuring psychological stress. It assesses how unpredictable,
              uncontrollable, and overloaded respondents find their lives. This
              10-question version (PSS-10) is the most commonly used format and
              has been validated across diverse populations.
            </p>
          </div>
        </div>

        <div className="tool-component-wrapper">
          <StressAssessment />
        </div>

        <div className="tool-footer-cta">
          <h2>Understanding Your Stress is the First Step</h2>
          <p>
            Regular stress assessments help you track patterns, identify
            triggers, and measure the effectiveness of your stress management
            strategies. Combine this tool with our breathing exercises,
            meditation timer, and affirmations for comprehensive stress relief.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-btn primary">
              Create Free Account
            </Link>
            <Link to="/tools" className="cta-btn secondary">
              Explore More Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressAssessmentPage;
