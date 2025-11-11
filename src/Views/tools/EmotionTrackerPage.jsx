// src/Views/tools/EmotionTrackerPage.jsx
import React from "react";
import EmotionTracker from "../../components/tools/EmotionTracker";
import "./ToolPage.css";

const EmotionTrackerPage = () => {
  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <h1 className="tool-page-title">
          <span className="tool-icon">💗</span>
          Emotion Tracker
        </h1>
        <p className="tool-page-subtitle">
          Name your emotions and understand where you feel them in your body
        </p>
      </div>

      <div className="tool-page-content">
        <EmotionTracker />
      </div>

      <div className="tool-page-footer">
        <div className="tool-tips">
          <h3>💡 Tips for Emotional Awareness</h3>
          <ul>
            <li>Name your emotions without judgment</li>
            <li>Notice where emotions show up in your body</li>
            <li>Track emotions multiple times daily for better insights</li>
            <li>Use the body map to connect physical sensations with feelings</li>
            <li>Review patterns to understand your emotional triggers</li>
          </ul>
        </div>

        <div className="tool-benefits">
          <h3>✨ Benefits of Emotion Tracking</h3>
          <ul>
            <li>Develops emotional intelligence and self-awareness</li>
            <li>Helps identify patterns and triggers</li>
            <li>Improves communication about feelings</li>
            <li>Reduces emotional reactivity over time</li>
            <li>Supports recovery by preventing emotional relapse</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmotionTrackerPage;
