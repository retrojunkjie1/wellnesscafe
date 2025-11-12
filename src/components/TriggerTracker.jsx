// src/components/TriggerTracker.jsx
import { useState, useMemo } from "react";
import { useTriggers } from "../hooks/useTriggers";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import Papa from "papaparse";
import "./TriggerTracker.css";

const initialForm = {
  timestamp: "",
  category: "General",
  emotion: "",
  intensity: 5,
  situation: "",
  thought: "",
  action: "",
  copingStrategy: "",
  outcomeRating: 5,
  notes: "",
  tagsText: "",
};

const TagList = ({ tags }) => {
  if (!tags || !tags.length) {
    return null;
  }
  return (
    <div className="tag-list">
      {tags.map((t, i) => (
        <span key={i} className="tag-badge">
          {t}
        </span>
      ))}
    </div>
  );
};

const Field = ({ label, children, required }) => (
  <label className="form-field">
    <span className="field-label">
      {label}
      {required && <span className="required">*</span>}
    </span>
    {children}
  </label>
);

const Input = ({ ...props }) => <input {...props} className="form-input" />;

const Textarea = ({ ...props }) => (
  <textarea {...props} className="form-textarea" />
);

const Select = ({ children, ...props }) => (
  <select {...props} className="form-select">
    {children}
  </select>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div className={`section-card ${className}`}>
    {title && <h3 className="section-title">{title}</h3>}
    {children}
  </div>
);

const TriggerTracker = () => {
  const { items, loading, add, analytics, uid, error } = useTriggers();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [copingSuggestions, setCopingSuggestions] = useState([]);

  // --- Pattern analyzer: find recurring patterns
  const patterns = useMemo(() => {
    const byHour = {};
    const byEmotion = {};
    const byTag = {};

    items.forEach((item) => {
      // Time patterns
      const hour = new Date(item.timestamp).getHours();
      byHour[hour] = (byHour[hour] || 0) + 1;

      // Emotion patterns
      if (item.emotion) {
        byEmotion[item.emotion] = (byEmotion[item.emotion] || 0) + 1;
      }

      // Tag patterns
      if (item.tags) {
        item.tags.forEach((tag) => {
          byTag[tag] = (byTag[tag] || 0) + 1;
        });
      }
    });

    const topHours = Object.entries(byHour)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([h]) => Number(h));

    const topEmotions = Object.entries(byEmotion)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([e]) => e);

    const topTags = Object.entries(byTag)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t, count]) => ({ tag: t, count }));

    return { topHours, topEmotions, topTags };
  }, [items]);

  // --- Smart coping suggestions based on patterns
  const generateCopingSuggestions = () => {
    const suggestions = [];

    // Emotion-based suggestions
    if (
      patterns.topEmotions.includes("anxious") ||
      patterns.topEmotions.includes("stressed")
    ) {
      suggestions.push({
        icon: "🌬️",
        text: "Try Mindful Breathing",
        link: "/tools/breathing",
        reason: "Detected anxiety/stress patterns",
      });
    }

    if (
      patterns.topEmotions.includes("angry") ||
      patterns.topEmotions.includes("frustrated")
    ) {
      suggestions.push({
        icon: "🧘",
        text: "Try Meditation Timer",
        link: "/tools/meditation",
        reason: "Detected anger/frustration patterns",
      });
    }

    if (
      patterns.topEmotions.includes("sad") ||
      patterns.topEmotions.includes("depressed")
    ) {
      suggestions.push({
        icon: "✍️",
        text: "Daily Journaling",
        link: "/tools/journal",
        reason: "Detected low mood patterns",
      });
    }

    // Time-based suggestions
    const lateNightTriggers = patterns.topHours.filter(
      (h) => h >= 22 || h <= 4
    );
    if (lateNightTriggers.length > 0) {
      suggestions.push({
        icon: "🌙",
        text: "Evening Wind-Down Routine",
        link: "/tools/meditation",
        reason: `Triggers often occur at night (${lateNightTriggers.join(
          ", "
        )}:00)`,
      });
    }

    // Default if no patterns
    if (suggestions.length === 0) {
      suggestions.push({
        icon: "📊",
        text: "Keep tracking to discover patterns",
        link: null,
        reason: "Log more entries to get personalized insights",
      });
    }

    setCopingSuggestions(suggestions);
  };

  // --- Export to CSV
  const exportToCSV = () => {
    if (items.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = items.map((item) => ({
      timestamp: item.timestamp,
      category: item.category,
      emotion: item.emotion,
      intensity: item.intensity,
      situation: item.situation,
      thought: item.thought,
      action: item.action,
      copingStrategy: item.copingStrategy,
      outcomeRating: item.outcomeRating,
      notes: item.notes,
      tags: (item.tags || []).join("; "),
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trigger-tracker-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const onChange = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!uid) {
      alert("Please sign in to log triggers");
      return;
    }

    // Validation
    if (!form.emotion || !form.situation) {
      alert("Please fill in required fields (emotion and situation)");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const tags = form.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await add({
        timestamp: form.timestamp || new Date().toISOString(),
        category: form.category,
        emotion: form.emotion,
        intensity: Number(form.intensity),
        situation: form.situation,
        thought: form.thought,
        action: form.action,
        copingStrategy: form.copingStrategy,
        outcomeRating: Number(form.outcomeRating),
        notes: form.notes,
        tags,
      });

      setForm(initialForm);
      // eslint-disable-next-line no-console
      console.log("✅ Trigger logged successfully");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Save error:", err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!uid) {
    return (
      <div className="trigger-tracker">
        <div className="auth-required">
          <div className="auth-icon">🔒</div>
          <h2>Sign In Required</h2>
          <p>Please sign in to use the Trigger Tracker</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trigger-tracker">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Configuration Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trigger-tracker">
      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{analytics.totalEntries}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.avgIntensity}</div>
          <div className="stat-label">Avg Intensity</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.avgOutcome}</div>
          <div className="stat-label">Avg Outcome</div>
        </div>
      </div>

      <div className="tracker-grid">
        {/* Left: Log Form */}
        <SectionCard title="📝 Log a Trigger" className="log-form-card">
          <form onSubmit={onSubmit} className="trigger-form">
            <div className="form-row-2">
              <Field label="Time">
                <Input
                  type="datetime-local"
                  value={form.timestamp}
                  onChange={onChange("timestamp")}
                />
              </Field>
              <Field label="Category">
                <Select value={form.category} onChange={onChange("category")}>
                  <option value="General">General</option>
                  <option value="Conflict">Conflict</option>
                  <option value="Craving">Craving</option>
                  <option value="Environment">Environment</option>
                  <option value="Social">Social</option>
                  <option value="Work">Work</option>
                  <option value="Family">Family</option>
                  <option value="Financial">Financial</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </Select>
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Primary Emotion" required>
                <Input
                  placeholder="anxious, angry, sad..."
                  value={form.emotion}
                  onChange={onChange("emotion")}
                  required
                />
              </Field>
              <Field label="Intensity (0–10)">
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={form.intensity}
                  onChange={onChange("intensity")}
                />
              </Field>
            </div>

            <Field label="Situation" required>
              <Input
                placeholder="Where were you? Who was involved? What happened?"
                value={form.situation}
                onChange={onChange("situation")}
                required
              />
            </Field>

            <Field label="Automatic Thought">
              <Input
                placeholder="What thought crossed your mind?"
                value={form.thought}
                onChange={onChange("thought")}
              />
            </Field>

            <Field label="Action/Urge">
              <Input
                placeholder="What did you do or feel like doing?"
                value={form.action}
                onChange={onChange("action")}
              />
            </Field>

            <Field label="Coping Strategy Used">
              <Input
                placeholder="breathe, walk, call sponsor, journaling..."
                value={form.copingStrategy}
                onChange={onChange("copingStrategy")}
              />
            </Field>

            <div className="form-row-2">
              <Field label="Outcome Rating (0–10)">
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={form.outcomeRating}
                  onChange={onChange("outcomeRating")}
                />
              </Field>
              <Field label="Tags (comma separated)">
                <Input
                  placeholder="work, family, evenings..."
                  value={form.tagsText}
                  onChange={onChange("tagsText")}
                />
              </Field>
            </div>

            <Field label="Notes">
              <Textarea
                placeholder="Reflection, insights, next steps..."
                value={form.notes}
                onChange={onChange("notes")}
                rows={3}
              />
            </Field>

            {saveError && (
              <div className="form-error">
                <span>⚠️</span> {saveError}
              </div>
            )}

            <button type="submit" disabled={saving} className="submit-btn">
              {saving ? "Saving..." : "💾 Save Trigger"}
            </button>
          </form>
        </SectionCard>

        {/* Middle: Timeline */}
        <SectionCard title="📅 Timeline" className="timeline-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading entries...</p>
            </div>
          ) : (
            <div className="timeline-list">
              {items.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>No entries yet.</p>
                  <p className="empty-hint">
                    Start by logging your first trigger
                  </p>
                </div>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="timeline-entry">
                    <div className="entry-header">
                      <div className="entry-time">
                        {new Date(it.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="entry-category">{it.category}</div>
                    </div>
                    <div className="entry-emotion">
                      <span className="emotion-badge">{it.emotion}</span>
                      <span className="intensity-badge">
                        Intensity: {it.intensity}
                      </span>
                      {it.outcomeRating > 0 && (
                        <span className="outcome-badge">
                          Outcome: {it.outcomeRating}
                        </span>
                      )}
                    </div>
                    <div className="entry-situation">{it.situation}</div>
                    {it.thought && (
                      <div className="entry-thought">
                        💭 <em>{it.thought}</em>
                      </div>
                    )}
                    {it.copingStrategy && (
                      <div className="entry-coping">
                        🛠️ <strong>Coping:</strong> {it.copingStrategy}
                      </div>
                    )}
                    {it.notes && (
                      <div className="entry-notes">📌 {it.notes}</div>
                    )}
                    <TagList tags={it.tags} />
                  </div>
                ))
              )}
            </div>
          )}
        </SectionCard>

        {/* Right: Analytics Dashboard */}
        <SectionCard title="📊 Analytics" className="analytics-card">
          {items.length === 0 ? (
            <div className="empty-analytics">
              <p>📈 Analytics will appear after logging a few entries</p>
            </div>
          ) : (
            <div className="analytics-grid">
              {/* Coping Effectiveness Over Time */}
              {analytics.effSeries.length > 0 && (
                <div className="chart-container">
                  <h4 className="chart-title">
                    Coping Effectiveness Over Time
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={analytics.effSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 10]}
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#222",
                          border: "1px solid #444",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: "#10b981", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Top Tags */}
              {analytics.tagSeries.length > 0 && (
                <div className="chart-container">
                  <h4 className="chart-title">Top Tags</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.tagSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="tag"
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#222",
                          border: "1px solid #444",
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Day of Week Frequency */}
              {analytics.dowSeries.length > 0 && (
                <div className="chart-container">
                  <h4 className="chart-title">Day-of-Week Frequency</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.dowSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#222",
                          border: "1px solid #444",
                        }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Emotion Frequency */}
              {analytics.emotionSeries.length > 0 && (
                <div className="chart-container">
                  <h4 className="chart-title">Most Common Emotions</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.emotionSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="emotion"
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#222",
                          border: "1px solid #444",
                        }}
                      />
                      <Bar dataKey="count" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Category Breakdown */}
              {analytics.categorySeries.length > 0 && (
                <div className="chart-container">
                  <h4 className="chart-title">Triggers by Category</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.categorySeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#aaa", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#222",
                          border: "1px solid #444",
                        }}
                      />
                      <Bar dataKey="count" fill="#ec4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* NEW: Time vs Intensity Scatter Chart */}
              {items.length > 0 && (
                <div className="chart-container">
                  <h4 className="chart-title">⏰ Trigger Hour vs Intensity</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis
                        type="number"
                        dataKey="hour"
                        name="Hour"
                        domain={[0, 24]}
                        tick={{ fill: "#aaa", fontSize: 12 }}
                        label={{
                          value: "Hour of Day",
                          position: "insideBottom",
                          offset: -5,
                          fill: "#aaa",
                        }}
                      />
                      <YAxis
                        type="number"
                        dataKey="intensity"
                        name="Intensity"
                        domain={[0, 10]}
                        tick={{ fill: "#aaa", fontSize: 12 }}
                        label={{
                          value: "Intensity",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#aaa",
                        }}
                      />
                      <ZAxis range={[50, 200]} />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{
                          background: "#222",
                          border: "1px solid #444",
                        }}
                      />
                      <Scatter
                        data={items.map((item) => ({
                          hour: new Date(item.timestamp).getHours(),
                          intensity: item.intensity,
                          emotion: item.emotion,
                        }))}
                        fill="#3b82f6"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <p className="chart-hint">
                    Discover when triggers are most intense
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="analytics-actions">
                <button
                  onClick={generateCopingSuggestions}
                  className="action-btn primary"
                >
                  🧠 Analyze Patterns
                </button>
                <button onClick={exportToCSV} className="action-btn secondary">
                  📤 Export CSV
                </button>
              </div>

              {/* Coping Suggestions */}
              {copingSuggestions.length > 0 && (
                <div className="coping-suggestions">
                  <h4 className="suggestions-title">
                    💡 Suggested Coping Actions
                  </h4>
                  <div className="suggestions-list">
                    {copingSuggestions.map((suggestion, index) => (
                      <div key={index} className="suggestion-card">
                        <div className="suggestion-icon">{suggestion.icon}</div>
                        <div className="suggestion-content">
                          {suggestion.link ? (
                            <a
                              href={suggestion.link}
                              className="suggestion-link"
                            >
                              {suggestion.text}
                            </a>
                          ) : (
                            <span className="suggestion-text">
                              {suggestion.text}
                            </span>
                          )}
                          <p className="suggestion-reason">
                            {suggestion.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pattern Insights */}
              {patterns.topEmotions.length > 0 && (
                <div className="pattern-insights">
                  <h4 className="insights-title">🔍 Pattern Insights</h4>
                  <div className="insights-grid">
                    {patterns.topEmotions.length > 0 && (
                      <div className="insight-card">
                        <div className="insight-label">Top Emotions</div>
                        <div className="insight-value">
                          {patterns.topEmotions.join(", ")}
                        </div>
                      </div>
                    )}
                    {patterns.topHours.length > 0 && (
                      <div className="insight-card">
                        <div className="insight-label">Peak Trigger Times</div>
                        <div className="insight-value">
                          {patterns.topHours.map((h) => `${h}:00`).join(", ")}
                        </div>
                      </div>
                    )}
                    {patterns.topTags.length > 0 && (
                      <div className="insight-card">
                        <div className="insight-label">Common Tags</div>
                        <div className="insight-tags">
                          {patterns.topTags.map((tag, i) => (
                            <span key={i} className="insight-tag">
                              {tag.tag} ({tag.count})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default TriggerTracker;
