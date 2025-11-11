// src/Views/tools/WeeklyReviewPage.jsx
import React from "react";
import WeeklyReview from "../../components/tools/WeeklyReview";
import "./ToolPage.css";

const WeeklyReviewPage = () => {
  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <h1 className="tool-page-title">
          <span className="tool-icon">📊</span>
          Weekly Review
        </h1>
        <p className="tool-page-subtitle">
          Get insights into your wellness journey with cross-tool analytics
        </p>
      </div>

      <div className="tool-page-content">
        <WeeklyReview />
      </div>

      <div className="tool-page-footer">
        <div className="tool-tips">
          <h3>💡 Tips for Weekly Reviews</h3>
          <ul>
            <li>Set aside time each week for reflection</li>
            <li>Celebrate small wins and progress</li>
            <li>Use insights to adjust your wellness strategies</li>
            <li>Focus on patterns rather than individual days</li>
            <li>Share your wellness score with your support system</li>
          </ul>
        </div>

        <div className="tool-benefits">
          <h3>✨ Benefits of Weekly Reviews</h3>
          <ul>
            <li>Provides a holistic view of your wellness journey</li>
            <li>Identifies which tools are most helpful for you</li>
            <li>Motivates continued engagement with positive feedback</li>
            <li>Helps spot warning signs early</li>
            <li>Creates accountability and tracks long-term progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReviewPage;
