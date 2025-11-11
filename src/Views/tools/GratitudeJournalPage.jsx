// src/Views/tools/GratitudeJournalPage.jsx
import React from "react";
import GratitudeJournal from "../../components/tools/GratitudeJournal";
import "./ToolPage.css";

const GratitudeJournalPage = () => {
  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <h1 className="tool-page-title">
          <span className="tool-icon">🙏</span>
          Gratitude Journal
        </h1>
        <p className="tool-page-subtitle">
          Practice daily gratitude and discover the power of appreciation
        </p>
      </div>

      <div className="tool-page-content">
        <GratitudeJournal />
      </div>

      <div className="tool-page-footer">
        <div className="tool-tips">
          <h3>💡 Tips for Gratitude Practice</h3>
          <ul>
            <li>Write at the same time each day for consistency</li>
            <li>Be specific about what you're grateful for</li>
            <li>Notice small things as well as big ones</li>
            <li>Reflect on how gratitude makes you feel</li>
            <li>Review past entries when you need a boost</li>
          </ul>
        </div>

        <div className="tool-benefits">
          <h3>✨ Benefits of Gratitude Journaling</h3>
          <ul>
            <li>Improves mental health and reduces stress</li>
            <li>Enhances relationships and social connections</li>
            <li>Increases resilience during challenging times</li>
            <li>Promotes better sleep and physical health</li>
            <li>Builds a positive mindset over time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GratitudeJournalPage;
