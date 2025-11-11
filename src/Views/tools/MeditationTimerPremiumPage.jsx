// src/Views/tools/MeditationTimerPremiumPage.jsx
import React from "react";
import MeditationTimerPremium from "../../components/tools/MeditationTimerPremium";
import "./ToolPage.css";

const MeditationTimerPremiumPage = () => {
  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <h1 className="tool-page-title">
          <span className="tool-icon">🧘</span>
          Meditation Timer Premium
        </h1>
        <p className="tool-page-subtitle">
          Build your mindfulness practice with guided meditation sessions
        </p>
      </div>

      <div className="tool-page-content">
        <MeditationTimerPremium />
      </div>

      <div className="tool-page-footer">
        <div className="tool-tips">
          <h3>💡 Meditation Tips</h3>
          <ul>
            <li>Find a quiet, comfortable space</li>
            <li>Start with shorter sessions and build up gradually</li>
            <li>Focus on your breath when your mind wanders</li>
            <li>Be patient with yourself - meditation is a practice</li>
            <li>Try different techniques to find what works for you</li>
          </ul>
        </div>

        <div className="tool-benefits">
          <h3>✨ Benefits of Meditation</h3>
          <ul>
            <li>Reduces stress and anxiety</li>
            <li>Improves focus and concentration</li>
            <li>Enhances emotional regulation</li>
            <li>Promotes better sleep quality</li>
            <li>Supports addiction recovery and relapse prevention</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MeditationTimerPremiumPage;
