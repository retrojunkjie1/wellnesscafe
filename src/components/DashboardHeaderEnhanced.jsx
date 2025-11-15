import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  Award,
  Flame,
  Target,
  Sparkles,
  Activity,
  PieChart,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import "./DashboardHeader.css";

/**
 * Enhanced Premium Dashboard Header with Detailed Analytics Graphs
 * Shows user progress, streaks, achievements, wellness score, and beautiful trend visualizations
 */
const DashboardHeaderEnhanced = ({ userName = "Friend" }) => {
  const [wellnessScore, setWellnessScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    streak: 7,
    totalSessions: 42,
    weeklyGoal: 14,
    weeklyProgress: 9,
    level: 3,
    nextLevelSessions: 8,
  });
  const [activityData, setActivityData] = useState([]);
  const [toolDistribution, setToolDistribution] = useState([]);
  const [wellnessHistory, setWellnessHistory] = useState([]);
  const [weeklyComparison, setWeeklyComparison] = useState([]);

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

  // Load real data from Firebase
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const db = getFirestore();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(
          now.getTime() - 14 * 24 * 60 * 60 * 1000
        );

        // Load last 7 days activity
        const collections = [
          { name: "breathingSessions", tool: "Breathing" },
          { name: "meditation", tool: "Meditation" },
          { name: "moods", tool: "Mood Check" },
          { name: "emotions", tool: "Emotions" },
          { name: "triggers", tool: "Triggers" },
          { name: "gratitude", tool: "Gratitude" },
          { name: "dailyIntentions", tool: "Intentions" },
        ];

        let totalSessions = 0;
        let weeklyCount = 0;
        const toolCounts = {};
        const dailyActivity = {};

        // Load data from each collection
        for (const { name, tool } of collections) {
          try {
            const q = query(
              collection(db, name),
              orderBy("createdAt", "desc"),
              limit(100)
            );
            const snapshot = await getDocs(q);
            const count = snapshot.size;
            totalSessions += count;
            toolCounts[tool] = count;

            // Count weekly sessions
            snapshot.docs.forEach((doc) => {
              const data = doc.data();
              const createdAt =
                data.createdAt?.toDate() || data.date || new Date();
              if (createdAt >= sevenDaysAgo) {
                weeklyCount++;
                const dateKey = createdAt.toISOString().split("T")[0];
                dailyActivity[dateKey] = (dailyActivity[dateKey] || 0) + 1;
              }
            });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`Could not load ${name}:`, error);
          }
        }

        // Format activity data for last 7 days
        const activityArray = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dateKey = date.toISOString().split("T")[0];
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });
          activityArray.push({
            name: dayName,
            sessions: dailyActivity[dateKey] || 0,
            date: dateKey,
          });
        }

        // Format tool distribution
        const distribution = Object.entries(toolCounts)
          .map(([tool, count]) => ({
            name: tool,
            value: count,
          }))
          .filter((item) => item.value > 0)
          .sort((a, b) => b.value - a.value);

        // Generate wellness history (simulated with real patterns)
        const historyArray = [];
        for (let i = 13; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dateKey = date.toISOString().split("T")[0];
          const sessions = dailyActivity[dateKey] || 0;
          // Wellness score based on activity
          const score = Math.min(100, 50 + sessions * 8 + Math.random() * 10);
          historyArray.push({
            name: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            score: Math.round(score),
            target: 75,
          });
        }

        // Calculate streak
        const streak = calculateStreak(dailyActivity);

        // Weekly comparison (this week vs last week)
        let thisWeek = 0;
        let lastWeek = 0;
        Object.entries(dailyActivity).forEach(([dateKey, count]) => {
          const date = new Date(dateKey);
          if (date >= sevenDaysAgo) {
            thisWeek += count;
          } else if (date >= fourteenDaysAgo) {
            lastWeek += count;
          }
        });

        const weeklyComp = [
          { name: "Last Week", sessions: lastWeek, fill: "#d4b483" },
          { name: "This Week", sessions: thisWeek, fill: "#7a5af8" },
        ];

        // Update state
        setStats({
          streak,
          totalSessions,
          weeklyGoal: 14,
          weeklyProgress: weeklyCount,
          level: Math.floor(totalSessions / 15) + 1,
          nextLevelSessions: 15 - (totalSessions % 15),
        });
        setActivityData(activityArray);
        setToolDistribution(distribution);
        setWellnessHistory(historyArray);
        setWeeklyComparison(weeklyComp);
        setLoading(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error loading analytics:", error);
        // Set default data if Firebase fails
        setActivityData(generateDefaultActivity());
        setToolDistribution(generateDefaultDistribution());
        setWellnessHistory(generateDefaultHistory());
        setWeeklyComparison(generateDefaultComparison());
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const achievements = [
    { id: 1, icon: "🔥", name: "7-Day Streak", unlocked: stats.streak >= 7 },
    {
      id: 2,
      icon: "🌟",
      name: "Rising Star",
      unlocked: stats.totalSessions >= 10,
    },
    {
      id: 3,
      icon: "🎯",
      name: "Goal Crusher",
      unlocked: stats.weeklyProgress >= stats.weeklyGoal,
    },
    {
      id: 4,
      icon: "🏆",
      name: "Wellness Pro",
      unlocked: stats.totalSessions >= 50,
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "#7a5af8"; // Purple
    if (score >= 60) return "#d4b483"; // Gold
    if (score >= 40) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Keep Going";
  };

  // Chart colors matching luxury theme
  const COLORS = {
    purple: "#7a5af8",
    purpleLight: "#b19cff",
    gold: "#d4b483",
    goldLight: "#f0e5d8",
    gradient: ["#7a5af8", "#b19cff", "#d4b483", "#f0e5d8"],
  };

  const PIE_COLORS = [
    "#7a5af8",
    "#b19cff",
    "#d4b483",
    "#f0e5d8",
    "#a78bfa",
    "#e9d5ff",
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="tooltip-value"
              style={{ color: entry.color }}
            >
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="dashboard-header-premium">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

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
                  style={{
                    width: `${Math.min((stats.streak / 30) * 100, 100)}%`,
                  }}
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
                  style={{
                    width: `${((stats.totalSessions % 50) / 50) * 100}%`,
                  }}
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
                {Math.max(0, stats.weeklyGoal - stats.weeklyProgress)} sessions
                to go
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

        {/* Detailed Analytics Graphs */}
        <div className="analytics-graphs">
          <h2 className="analytics-title">
            <Activity size={24} />
            Your Wellness Analytics
          </h2>

          <div className="graphs-grid">
            {/* 7-Day Activity Trend */}
            <div className="graph-card">
              <div className="graph-header">
                <h3>
                  <Calendar size={20} />
                  7-Day Activity Trend
                </h3>
                <p className="graph-subtitle">
                  Daily session completion over the past week
                </p>
              </div>
              <div className="graph-container">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient
                        id="colorSessions"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.purple}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.purple}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stroke={COLORS.purple}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorSessions)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tool Distribution */}
            <div className="graph-card">
              <div className="graph-header">
                <h3>
                  <PieChart size={20} />
                  Tool Usage Breakdown
                </h3>
                <p className="graph-subtitle">Which tools you're using most</p>
              </div>
              <div className="graph-container">
                {toolDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={toolDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {toolDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RePieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data">
                    <p>Start using tools to see your breakdown</p>
                  </div>
                )}
              </div>
            </div>

            {/* Wellness Score History */}
            <div className="graph-card graph-card-wide">
              <div className="graph-header">
                <h3>
                  <TrendingUp size={20} />
                  14-Day Wellness Score Timeline
                </h3>
                <p className="graph-subtitle">Track your progress over time</p>
              </div>
              <div className="graph-container">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={wellnessHistory}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: "12px" }}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={COLORS.purple}
                      strokeWidth={3}
                      dot={{ fill: COLORS.purple, r: 5 }}
                      activeDot={{ r: 8 }}
                      name="Your Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke={COLORS.gold}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Target"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Comparison */}
            <div className="graph-card">
              <div className="graph-header">
                <h3>
                  <Target size={20} />
                  Weekly Progress
                </h3>
                <p className="graph-subtitle">This week vs last week</p>
              </div>
              <div className="graph-container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyComparison}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="sessions"
                      fill={COLORS.purple}
                      radius={[8, 8, 0, 0]}
                    >
                      {weeklyComparison.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
              You've completed <strong>{stats.weeklyProgress} sessions</strong>{" "}
              this week—you're on fire!
            </p>
          </div>
          <div className="insight-card">
            <span className="insight-emoji">🎯</span>
            <p>
              Most used tool:{" "}
              <strong>{toolDistribution[0]?.name || "Get started!"}</strong>
            </p>
          </div>
          <div className="insight-card">
            <span className="insight-emoji">📈</span>
            <p>
              {weeklyComparison[1]?.sessions > weeklyComparison[0]?.sessions
                ? `You're up ${
                    weeklyComparison[1]?.sessions -
                    weeklyComparison[0]?.sessions
                  } sessions from last week!`
                : "Keep building your routine this week!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function calculateStreak(dailyActivity) {
  const dates = Object.keys(dailyActivity).sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];

  for (let i = 0; i < 90; i++) {
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - i);
    const dateKey = checkDate.toISOString().split("T")[0];

    if (dailyActivity[dateKey]) {
      streak++;
    } else if (dateKey !== today) {
      break;
    }
  }

  return streak;
}

function generateDefaultActivity() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, index) => ({
    name: day,
    sessions: Math.floor(Math.random() * 5) + 1,
    date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  }));
}

function generateDefaultDistribution() {
  return [
    { name: "Breathing", value: 15 },
    { name: "Meditation", value: 12 },
    { name: "Mood Check", value: 10 },
    { name: "Gratitude", value: 8 },
    { name: "Intentions", value: 6 },
  ];
}

function generateDefaultHistory() {
  return Array.from({ length: 14 }, (_, i) => ({
    name: new Date(
      Date.now() - (13 - i) * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: Math.floor(Math.random() * 30) + 60,
    target: 75,
  }));
}

function generateDefaultComparison() {
  return [
    { name: "Last Week", sessions: 7, fill: "#d4b483" },
    { name: "This Week", sessions: 9, fill: "#7a5af8" },
  ];
}

export default DashboardHeaderEnhanced;
