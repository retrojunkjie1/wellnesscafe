import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  TrendingUp,
  Target,
  Award,
  Heart,
  Brain,
  Flame,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { db } from "../../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const getWeekRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 7);
  return {
    start: start.toISOString().slice(0, 10),
    end: now.toISOString().slice(0, 10),
    label: `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`,
  };
};

export default function WeeklyReview() {
  const [weekRange] = useState(getWeekRange());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    moods: [],
    gratitude: [],
    meditation: [],
    emotions: [],
    triggers: [],
    urgeSurfing: [],
    dailyIntentions: [],
  });

  // Load all data for the week
  useEffect(() => {
    const loadWeekData = async () => {
      setLoading(true);
      try {
        const collections = [
          "moods",
          "gratitude",
          "meditation",
          "emotions",
          "triggers",
          "urgeSurfing",
          "dailyIntentions",
        ];
        const results = {};

        for (const collectionName of collections) {
          const q = query(
            collection(db, collectionName),
            where("date", ">=", weekRange.start),
            where("date", "<=", weekRange.end),
            orderBy("date", "asc")
          );
          const snap = await getDocs(q);
          results[collectionName] = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
        }

        setData(results);
      } catch (e) {
        console.error("weeklyReview:loadData", e);
      }
      setLoading(false);
    };

    loadWeekData();
  }, [weekRange]);

  // Analytics
  const summary = useMemo(() => {
    return {
      moodEntries: data.moods.length,
      avgMood:
        data.moods.length > 0
          ? (
              data.moods.reduce((sum, m) => sum + (m.score || 0), 0) /
              data.moods.length
            ).toFixed(1)
          : 0,
      gratitudeCount: data.gratitude.reduce(
        (sum, g) => sum + (g.count || 0),
        0
      ),
      meditationMinutes: Math.floor(
        data.meditation.reduce((sum, m) => sum + (m.duration || 0) / 60, 0)
      ),
      emotionEntries: data.emotions.length,
      avgEmotionIntensity:
        data.emotions.length > 0
          ? (
              data.emotions.reduce((sum, e) => sum + (e.intensity || 0), 0) /
              data.emotions.length
            ).toFixed(1)
          : 0,
      triggersLogged: data.triggers.length,
      triggersManaged: data.triggers.filter((t) => t.managed === true).length,
      urgeSessions: data.urgeSurfing.length,
      avgUrgeDuration:
        data.urgeSurfing.length > 0
          ? Math.floor(
              data.urgeSurfing.reduce((sum, u) => sum + (u.duration || 0), 0) /
                data.urgeSurfing.length
            )
          : 0,
      intentionsDays: data.dailyIntentions.length,
      avgHabits:
        data.dailyIntentions.length > 0
          ? (
              data.dailyIntentions.reduce(
                (sum, d) =>
                  sum + (d.habits?.filter((h) => h.completed).length || 0),
                0
              ) / data.dailyIntentions.length
            ).toFixed(1)
          : 0,
    };
  }, [data]);

  const wellnessScore = useMemo(() => {
    let score = 0;
    let maxScore = 0;

    // Mood tracking (20 points)
    maxScore += 20;
    score += Math.min((summary.moodEntries / 7) * 20, 20);

    // Gratitude practice (15 points)
    maxScore += 15;
    score += Math.min((summary.gratitudeCount / 21) * 15, 15); // 3 per day ideal

    // Meditation (15 points)
    maxScore += 15;
    score += Math.min((summary.meditationMinutes / 70) * 15, 15); // 10 min/day ideal

    // Emotion awareness (15 points)
    maxScore += 15;
    score += Math.min((summary.emotionEntries / 7) * 15, 15);

    // Trigger management (20 points)
    maxScore += 20;
    if (summary.triggersLogged > 0) {
      score += (summary.triggersManaged / summary.triggersLogged) * 20;
    }

    // Daily intentions (15 points)
    maxScore += 15;
    score += Math.min((summary.intentionsDays / 7) * 15, 15);

    return Math.round((score / maxScore) * 100);
  }, [summary]);

  const dailyActivity = useMemo(() => {
    const days = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      days[key] = {
        date: key,
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        moods: 0,
        gratitude: 0,
        meditation: 0,
        emotions: 0,
        triggers: 0,
        intentions: 0,
      };
    }

    data.moods.forEach((m) => {
      if (days[m.date]) days[m.date].moods += 1;
    });
    data.gratitude.forEach((g) => {
      if (days[g.date]) days[g.date].gratitude += 1;
    });
    data.meditation.forEach((m) => {
      if (days[m.date]) days[m.date].meditation += 1;
    });
    data.emotions.forEach((e) => {
      if (days[e.date]) days[e.date].emotions += 1;
    });
    data.triggers.forEach((t) => {
      if (days[t.date]) days[t.date].triggers += 1;
    });
    data.dailyIntentions.forEach((d) => {
      if (days[d.date]) days[d.date].intentions += 1;
    });

    return Object.values(days);
  }, [data]);

  const toolEngagement = useMemo(() => {
    return [
      { tool: "Mood Graph", count: data.moods.length },
      { tool: "Gratitude", count: data.gratitude.length },
      { tool: "Meditation", count: data.meditation.length },
      { tool: "Emotions", count: data.emotions.length },
      { tool: "Triggers", count: data.triggers.length },
      { tool: "Urge Surfing", count: data.urgeSurfing.length },
      { tool: "Intentions", count: data.dailyIntentions.length },
    ];
  }, [data]);

  const wellnessRadar = useMemo(() => {
    const normalize = (value, max) => Math.min((value / max) * 100, 100);
    return [
      { category: "Mood", value: normalize(summary.moodEntries, 7) },
      { category: "Gratitude", value: normalize(summary.gratitudeCount, 21) },
      {
        category: "Meditation",
        value: normalize(summary.meditationMinutes, 70),
      },
      { category: "Emotions", value: normalize(summary.emotionEntries, 7) },
      {
        category: "Triggers",
        value: normalize(summary.triggersManaged, summary.triggersLogged || 1),
      },
      { category: "Intentions", value: normalize(summary.intentionsDays, 7) },
    ];
  }, [summary]);

  const weeklyInsights = useMemo(() => {
    const insights = [];

    if (summary.moodEntries >= 5) {
      insights.push({
        type: "success",
        message: `Excellent mood tracking! You logged ${summary.moodEntries} check-ins this week.`,
      });
    } else if (summary.moodEntries < 3) {
      insights.push({
        type: "warning",
        message: "Try logging your mood daily to identify emotional patterns.",
      });
    }

    if (summary.meditationMinutes >= 50) {
      insights.push({
        type: "success",
        message: `Strong meditation practice! ${summary.meditationMinutes} minutes of mindfulness.`,
      });
    }

    if (
      summary.triggersLogged > 0 &&
      summary.triggersManaged / summary.triggersLogged >= 0.75
    ) {
      insights.push({
        type: "success",
        message: `Impressive trigger management! You handled ${summary.triggersManaged}/${summary.triggersLogged} triggers successfully.`,
      });
    }

    if (summary.gratitudeCount >= 14) {
      insights.push({
        type: "success",
        message: `Gratitude habit strong! You logged ${summary.gratitudeCount} items this week.`,
      });
    }

    if (summary.intentionsDays >= 5) {
      insights.push({
        type: "success",
        message:
          "Consistent with daily intentions - keep building that morning routine!",
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: "info",
        message:
          "Start using more tools to build a comprehensive wellness practice.",
      });
    }

    return insights;
  }, [summary]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading weekly review...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Header */}
      <div className="relative z-10 sticky top-0 backdrop-blur-md bg-slate-950/60 border-b border-indigo-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-indigo-400">
                  Weekly Review
                </h1>
                <p className="text-xs text-gray-400">{weekRange.label}</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Wellness Score</p>
                  <p className="text-3xl font-bold text-indigo-400">
                    {wellnessScore}%
                  </p>
                </div>
                <div
                  className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
                    wellnessScore >= 80
                      ? "border-green-400 text-green-400"
                      : wellnessScore >= 60
                      ? "border-indigo-400 text-indigo-400"
                      : "border-yellow-400 text-yellow-400"
                  }`}
                >
                  <Award size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Wellness Score Card */}
        <div className="bg-gradient-to-br from-indigo-500/20 to-violet-500/10 rounded-3xl border border-indigo-400/30 p-8 backdrop-blur mb-12">
          <div className="text-center">
            <div className="inline-block w-32 h-32 rounded-full border-8 border-indigo-400 flex items-center justify-center mb-4">
              <span className="text-5xl font-bold text-indigo-400">
                {wellnessScore}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Weekly Wellness Score
            </h2>
            <p className="text-gray-400">
              {wellnessScore >= 80
                ? "Outstanding! You're crushing your wellness goals."
                : wellnessScore >= 60
                ? "Great progress! Keep building momentum."
                : "Good start! Small steps lead to big changes."}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <h2 className="text-2xl font-bold text-indigo-300 flex items-center gap-2 mb-6">
          <TrendingUp size={24} /> Key Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <MetricCard
            icon={<Heart size={20} />}
            title="Mood Logs"
            value={summary.moodEntries}
            subtitle={`Avg: ${summary.avgMood}`}
            color="pink"
          />
          <MetricCard
            icon={<Sparkles size={20} />}
            title="Gratitude"
            value={summary.gratitudeCount}
            subtitle="items"
            color="green"
          />
          <MetricCard
            icon={<Brain size={20} />}
            title="Meditation"
            value={summary.meditationMinutes}
            subtitle="minutes"
            color="purple"
          />
          <MetricCard
            icon={<AlertTriangle size={20} />}
            title="Triggers"
            value={`${summary.triggersManaged}/${summary.triggersLogged}`}
            subtitle="managed"
            color="red"
          />
          <MetricCard
            icon={<Heart size={20} />}
            title="Emotions"
            value={summary.emotionEntries}
            subtitle={`Avg: ${summary.avgEmotionIntensity}`}
            color="pink"
          />
          <MetricCard
            icon={<Target size={20} />}
            title="Intentions"
            value={summary.intentionsDays}
            subtitle={`Avg: ${summary.avgHabits} habits`}
            color="amber"
          />
          <MetricCard
            icon={<Flame size={20} />}
            title="Urge Sessions"
            value={summary.urgeSessions}
            subtitle={`Avg: ${summary.avgUrgeDuration}s`}
            color="orange"
          />
          <MetricCard
            icon={<CheckCircle size={20} />}
            title="Active Tools"
            value={toolEngagement.filter((t) => t.count > 0).length}
            subtitle="of 7"
            color="indigo"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Daily activity */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-indigo-400/30 p-8 backdrop-blur">
            <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-6">
              <Calendar size={20} /> Daily Activity
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="label" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      background: "#111",
                      border: "1px solid #2a2a2a",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moods"
                    stroke="#ec4899"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="gratitude"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="meditation"
                    stroke="#a855f7"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="intentions"
                    stroke="#fbbf24"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tool engagement */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-indigo-400/30 p-8 backdrop-blur">
            <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-6">
              <Target size={20} /> Tool Engagement
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis
                    dataKey="tool"
                    stroke="#888"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      background: "#111",
                      border: "1px solid #2a2a2a",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Wellness radar */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-indigo-400/30 p-8 backdrop-blur">
            <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-6">
              <Award size={20} /> Wellness Balance
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={wellnessRadar}>
                  <PolarGrid stroke="#444" />
                  <PolarAngleAxis dataKey="category" stroke="#888" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#888" />
                  <Radar
                    name="Progress"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#111",
                      border: "1px solid #2a2a2a",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-indigo-400/30 p-8 backdrop-blur">
          <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-6">
            <Sparkles size={20} /> Weekly Insights
          </h3>
          <div className="space-y-3">
            {weeklyInsights.map((insight, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${
                  insight.type === "success"
                    ? "border-green-400/30 bg-green-500/10"
                    : insight.type === "warning"
                    ? "border-yellow-400/30 bg-yellow-500/10"
                    : "border-indigo-400/30 bg-indigo-500/10"
                }`}
              >
                <p className="text-sm text-white">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-12 bg-gradient-to-br from-indigo-500/20 to-violet-500/10 rounded-2xl border border-indigo-400/30 p-8 backdrop-blur">
          <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-6">
            <Target size={20} /> Focus Areas for Next Week
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            {summary.moodEntries < 5 && (
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">•</span>
                <span>
                  Log your mood daily to build self-awareness and track
                  emotional patterns
                </span>
              </li>
            )}
            {summary.meditationMinutes < 50 && (
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">•</span>
                <span>
                  Aim for 10 minutes of meditation per day to reduce stress and
                  improve focus
                </span>
              </li>
            )}
            {summary.gratitudeCount < 14 && (
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">•</span>
                <span>
                  Practice gratitude daily - even 2-3 items can shift your
                  perspective
                </span>
              </li>
            )}
            {summary.intentionsDays < 5 && (
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">•</span>
                <span>
                  Set daily intentions each morning to maintain focus and
                  purpose
                </span>
              </li>
            )}
            {summary.triggersLogged === 0 && (
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">•</span>
                <span>
                  Start tracking triggers to identify patterns and build coping
                  strategies
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, subtitle, color }) {
  const colorClasses = {
    pink: "border-pink-400/30 bg-pink-500/10 text-pink-400",
    green: "border-green-400/30 bg-green-500/10 text-green-400",
    purple: "border-purple-400/30 bg-purple-500/10 text-purple-400",
    red: "border-red-400/30 bg-red-500/10 text-red-400",
    amber: "border-amber-400/30 bg-amber-500/10 text-amber-400",
    orange: "border-orange-400/30 bg-orange-500/10 text-orange-400",
    indigo: "border-indigo-400/30 bg-indigo-500/10 text-indigo-400",
  };

  return (
    <div
      className={`rounded-2xl border-2 p-6 backdrop-blur ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs font-semibold">{title}</p>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-80">{subtitle}</p>
    </div>
  );
}
