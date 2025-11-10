import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import CheckIn from "./CheckIn";
import Progress from "./Progress";
import DashboardPin from "./DashboardPin";
import MoodHeatmap from "./MoodHeatmap";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard, checkin, progress
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [toolsStats, setToolsStats] = useState({
    breathingSessions: 0,
    meditationSessions: 0,
    lastBreathing: null,
    lastMeditation: null,
  });

  // Load tool usage stats from localStorage
  useEffect(() => {
    const breathingStats = JSON.parse(
      localStorage.getItem("breathingStats") || '{"totalSessions": 0}'
    );
    const meditationStats = JSON.parse(
      localStorage.getItem("meditationStats") || '{"sessions": 0}'
    );

    setToolsStats({
      breathingSessions: breathingStats.totalSessions || 0,
      meditationSessions: meditationStats.sessions || 0,
      lastBreathing: breathingStats.lastSession || null,
      lastMeditation: meditationStats.lastSession || null,
    });
  }, [currentView]); // Reload when returning to dashboard

  const handleCheckInComplete = (checkInData) => {
    setLastCheckIn(checkInData);
    setCurrentView("dashboard");
  };

  const renderContent = () => {
    switch (currentView) {
      case "checkin":
        return (
          <div className="dashboard-wrapper">
            <CheckIn onComplete={handleCheckInComplete} />
            <button
              className="back-to-dashboard-btn"
              onClick={() => setCurrentView("dashboard")}
            >
              ← Back to Dashboard
            </button>
          </div>
        );
      case "progress":
        return (
          <div className="dashboard-wrapper">
            <Progress />
            <button
              className="back-to-dashboard-btn"
              onClick={() => setCurrentView("dashboard")}
            >
              ← Back to Dashboard
            </button>
          </div>
        );
      default:
        return (
          <div className="dashboard-container">
            <div className="dashboard-header">
              <h1>Welcome back, {user?.displayName || user?.email}!</h1>
              <p>Your personalized wellness dashboard</p>
            </div>

            {/* Daily Affirmation Pin */}
            <DashboardPin />

            <div className="dashboard-grid">
              {/* Mood Heatmap - Full Width */}
              <div className="dashboard-card full-width">
                <MoodHeatmap />
              </div>

              {/* Daily Check-in Card */}
              <div className="dashboard-card">
                <h3>Daily Check-in</h3>
                <p>How are you feeling today?</p>
                {lastCheckIn ? (
                  <div className="checkin-status">
                    <p>✅ Completed today!</p>
                    <small>
                      Last check-in:{" "}
                      {new Date(
                        lastCheckIn.timestamp.toDate()
                      ).toLocaleDateString()}
                    </small>
                  </div>
                ) : (
                  <button
                    className="dashboard-btn"
                    onClick={() => setCurrentView("checkin")}
                  >
                    Start Check-in
                  </button>
                )}
              </div>

              {/* Recovery Tools - Breathing */}
              <div className="dashboard-card recovery-tool-card">
                <div className="tool-header">
                  <span className="tool-icon">🫁</span>
                  <div>
                    <h3>Breathing Exercise</h3>
                    <p>3-minute calm down</p>
                  </div>
                </div>
                {toolsStats.breathingSessions > 0 && (
                  <div className="tool-stats-mini">
                    <span>✓ {toolsStats.breathingSessions} sessions</span>
                  </div>
                )}
                <button
                  className="dashboard-btn tool-btn"
                  onClick={() => navigate("/tools/breathing")}
                >
                  Start Breathing →
                </button>
              </div>

              {/* Recovery Tools - Meditation */}
              <div className="dashboard-card recovery-tool-card">
                <div className="tool-header">
                  <span className="tool-icon">🧘</span>
                  <div>
                    <h3>Meditation Timer</h3>
                    <p>Find your peace</p>
                  </div>
                </div>
                {toolsStats.meditationSessions > 0 && (
                  <div className="tool-stats-mini">
                    <span>✓ {toolsStats.meditationSessions} sessions</span>
                  </div>
                )}
                <button
                  className="dashboard-btn tool-btn"
                  onClick={() => navigate("/tools/meditation")}
                >
                  Start Meditation →
                </button>
              </div>

              {/* Mood Check-In Card */}
              <div className="dashboard-card recovery-tool-card">
                <div className="tool-header">
                  <span className="tool-icon">😊</span>
                  <div>
                    <h3>Mood Check-In</h3>
                    <p>Track your emotional wellness</p>
                  </div>
                </div>
                <button
                  className="dashboard-btn tool-btn"
                  onClick={() => navigate("/tools/mood-checkin")}
                >
                  Check My Mood →
                </button>
              </div>

              {/* Trigger Tracker Card */}
              <div className="dashboard-card recovery-tool-card">
                <div className="tool-header">
                  <span className="tool-icon">📊</span>
                  <div>
                    <h3>Trigger Tracker</h3>
                    <p>Identify patterns & get insights</p>
                  </div>
                </div>
                <button
                  className="dashboard-btn tool-btn"
                  onClick={() => navigate("/tools/trigger-tracker")}
                >
                  Track Triggers →
                </button>
              </div>

              {/* My Progress Card */}
              <div className="dashboard-card">
                <h3>My Progress</h3>
                <p>Track your wellness journey</p>
                <button
                  className="dashboard-btn"
                  onClick={() => setCurrentView("progress")}
                >
                  View Progress
                </button>
              </div>

              {/* All Recovery Tools Link */}
              <div className="dashboard-card tools-overview-card">
                <h3>All Recovery Tools</h3>
                <p>Explore breathing, meditation, and more</p>
                <button
                  className="dashboard-btn secondary-btn"
                  onClick={() => navigate("/tools")}
                >
                  View All Tools →
                </button>
              </div>

              {/* Community Card */}
              <div className="dashboard-card">
                <h3>Community</h3>
                <p>Connect with others on similar paths</p>
                <button className="dashboard-btn">Join Community</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};

export default Dashboard;
