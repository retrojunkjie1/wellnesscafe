// src/Views/tools/TriggerTrackerPage.jsx
import React from "react";
import TriggerTracker from "../../components/TriggerTracker";
import "../Page.css";

const TriggerTrackerPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero">
        <div className="hero-content">
          <h1>📊 Trigger Tracker</h1>
          <p className="hero-subtitle">
            Log and analyze your triggers to identify patterns and improve
            coping strategies
          </p>
        </div>
      </div>

      <div className="page-content">
        <TriggerTracker />
      </div>
    </div>
  );
};

export default TriggerTrackerPage;
