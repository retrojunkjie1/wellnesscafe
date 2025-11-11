import React, { useState, useEffect } from "react";
import { TrendingUp, Award, Flame, Target, Sparkles } from "lucide-react";
import "./DashboardHeader.css";

/**
 * Premium Dashboard Header - Luxury wellness overview
 * Shows user progress, streaks, achievements, and wellness score
 */
const DashboardHeader = ({ userName = "Friend" }) => {
  const [wellnessScore, setWellnessScore] = useState(0);
  const targetScore = 78; // Example wellness score

  // Animated counter effect
  useEffect(() => {
    let currentScore = 0;
    const increment = targetScore / 50;
    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        setWellnessScore(targetScore);
        clearInterval(timer);
      } else {
        setWellnessScore(Math.floor(currentScore));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [targetScore]);

  // Mock user stats - these would come from Firebase/context in production
  const stats = {
    streak: 7,
    totalSessions: 42,
    weeklyGoal: 14,
    weeklyProgress: 9,
    level: 3,
    nextLevelSessions: 8,
  };

  const achievements = [
    { id: 1, icon: "🔥", name: "7-Day Streak", unlocked: true },
    { id: 2, icon: "🌟", name: "Rising Star", unlocked: true },
    { id: 3, icon: "🎯", name: "Goal Crusher", unlocked: false },
    { id: 4, icon: "🏆", name: "Wellness Pro", unlocked: false },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Green
    if (score >= 60) return "#f59e0b"; // Amber
    if (score >= 40) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  return (
    <div className="dashboard-header-premium">
      <div className="dashboard-header-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome back, {userName}! 👋</h1>
            <p className="welcome-subtitle">
              You're doing amazing. Let's continue your wellness journey today.
            </p>
          </div>

          {/* Wellness Score Circle */}
          <div className="wellness-score-container">
            <div className="score-circle">
              <svg className="score-ring" viewBox="0 0 120 120">
                <circle
                  className="score-ring-background"
                  cx="60"
                  cy="60"
                  r="52"
                />
                <circle
                  className="score-ring-progress"
                  cx="60"
                  cy="60"
                  r="52"
                  stroke={getScoreColor(wellnessScore)}
                  strokeDasharray={`${(wellnessScore / 100) * 326.73} 326.73`}
                />
              </svg>
              <div className="score-content">
                <div className="score-value">{wellnessScore}</div>
                <div className="score-label">
                  {getScoreLabel(wellnessScore)}
                </div>
              </div>
            </div>
            <p className="score-description">Wellness Score</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-premium">
          {/* Streak Counter */}
          <div className="stat-card-premium streak-card">
            <div className="stat-icon">
              <Flame className="icon-flame" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.streak}</div>
              <div className="stat-label">Day Streak</div>
              <div className="stat-progress-bar">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(stats.streak / 30) * 100}%` }}
                />
              </div>
              <div className="stat-note">Keep it going! 🔥</div>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="stat-card-premium sessions-card">
            <div className="stat-icon">
              <Target className="icon-target" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalSessions}</div>
              <div className="stat-label">Total Sessions</div>
              <div className="stat-progress-bar">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(stats.totalSessions / 50) * 100}%` }}
                />
              </div>
              <div className="stat-note">
                Next level: {stats.nextLevelSessions} more
              </div>
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="stat-card-premium goal-card">
            <div className="stat-icon">
              <TrendingUp className="icon-trending" />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {stats.weeklyProgress}/{stats.weeklyGoal}
              </div>
              <div className="stat-label">Weekly Goal</div>
              <div className="stat-progress-bar">
                <div
                  className="stat-progress-fill"
                  style={{
                    width: `${
                      (stats.weeklyProgress / stats.weeklyGoal) * 100
                    }%`,
                  }}
                />
              </div>
              <div className="stat-note">
                {stats.weeklyGoal - stats.weeklyProgress} sessions to go
              </div>
            </div>
          </div>

          {/* Level Badge */}
          <div className="stat-card-premium level-card">
            <div className="stat-icon">
              <Sparkles className="icon-sparkles" />
            </div>
            <div className="stat-content">
              <div className="stat-value">Level {stats.level}</div>
              <div className="stat-label">Wellness Explorer</div>
              <div className="level-badge">
                <Award className="level-award" />
              </div>
              <div className="stat-note">Rising to greatness ✨</div>
            </div>
          </div>
        </div>

        {/* Achievements Bar */}
        <div className="achievements-section">
          <div className="achievements-header">
            <Award className="achievements-icon" />
            <h3>Recent Achievements</h3>
          </div>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-badge ${
                  achievement.unlocked ? "unlocked" : "locked"
                }`}
                title={achievement.name}
              >
                <span className="achievement-icon">{achievement.icon}</span>
                <span className="achievement-name">{achievement.name}</span>
                {!achievement.unlocked && (
                  <div className="achievement-lock">🔒</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="quick-insights">
          <div className="insight-card">
            <span className="insight-emoji">💪</span>
            <p>
              You've completed <strong>3 sessions</strong> this week—you're on
              fire!
            </p>
          </div>
          <div className="insight-card">
            <span className="insight-emoji">🎯</span>
            <p>
              Most used tool: <strong>Mindful Breathing</strong>
            </p>
          </div>
          <div className="insight-card">
            <span className="insight-emoji">📈</span>
            <p>
              Your stress levels decreased <strong>25%</strong> this month!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
