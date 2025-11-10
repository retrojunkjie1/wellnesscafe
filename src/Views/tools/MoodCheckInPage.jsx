// src/Views/tools/MoodCheckInPage.jsx
import React from "react";
import MoodCheckIn from "../../components/MoodCheckIn";
import "./ToolPage.css";

const MoodCheckInPage = () => {
  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <h1 className="tool-page-title">
          <span className="tool-icon">😊</span>
          Mood Check-In
        </h1>
        <p className="tool-page-subtitle">
          Track your emotional wellness daily and discover patterns in your mood
        </p>
      </div>

      <div className="tool-page-content">
        <MoodCheckIn />
      </div>

      <div className="tool-page-footer">
        <div className="tool-tips">
          <h3>💡 Tips for Better Mood Tracking</h3>
          <ul>
            <li>Check in at the same time each day for consistency</li>
            <li>Be honest with yourself - there are no wrong answers</li>
            <li>
              Use tags to categorize what influences your mood (work, family,
              exercise, etc.)
            </li>
            <li>Review your mood trend regularly to identify patterns</li>
            <li>
              Celebrate your good days and be gentle with yourself on tough ones
            </li>
          </ul>
        </div>

        <div className="tool-benefits">
          <h3>🌟 Benefits of Mood Tracking</h3>
          <ul>
            <li>
              <strong>Self-awareness:</strong> Understand your emotional
              patterns
            </li>
            <li>
              <strong>Early intervention:</strong> Catch negative trends before
              they worsen
            </li>
            <li>
              <strong>Progress tracking:</strong> See your improvement over time
            </li>
            <li>
              <strong>Trigger identification:</strong> Discover what affects
              your mood
            </li>
            <li>
              <strong>Therapy support:</strong> Share data with your counselor
              or therapist
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckInPage;
