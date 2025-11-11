// src/Views/tools/TriggerJournalPage.jsx
import React from "react";
import TriggerJournal from "../../components/tools/TriggerJournal";
import "./ToolPage.css";

const TriggerJournalPage = () => {
  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <h1 className="tool-page-title">
          <span className="tool-icon">⚠️</span>
          Trigger Journal
        </h1>
        <p className="tool-page-subtitle">
          Log triggers, analyze HALT factors, and track your coping strategies
        </p>
      </div>

      <div className="tool-page-content">
        <TriggerJournal />
      </div>

      <div className="tool-page-footer">
        <div className="tool-tips">
          <h3>💡 Tips for Trigger Management</h3>
          <ul>
            <li>Log triggers immediately or as soon as possible</li>
            <li>Always complete the HALT check (Hungry, Angry, Lonely, Tired)</li>
            <li>Be honest about whether you managed the trigger successfully</li>
            <li>Track which coping strategies work best for you</li>
            <li>Review your journal regularly to identify patterns</li>
          </ul>
        </div>

        <div className="tool-benefits">
          <h3>✨ Benefits of Trigger Journaling</h3>
          <ul>
            <li>Identifies high-risk situations and patterns</li>
            <li>Builds awareness of HALT factors in relapse</li>
            <li>Tracks effectiveness of coping strategies</li>
            <li>Provides data for treatment planning</li>
            <li>Empowers you to prevent relapse proactively</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TriggerJournalPage;
