import { useState } from "react";
import { useMoods } from "../hooks/useMoods";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./MoodCheckIn.css";

const Field = ({ label, children }) => (
  <label className="mood-field">
    <span className="mood-label">{label}</span>
    {children}
  </label>
);

const Input = ({ ...p }) => <input {...p} className="mood-input" />;
const Textarea = ({ ...p }) => <textarea {...p} className="mood-textarea" />;
const Card = ({ title, children }) => (
  <div className="mood-card">
    {title && <h3 className="mood-card-title">{title}</h3>}
    {children}
  </div>
);

const MoodCheckIn = () => {
  const { items, loading, add, analytics, uid } = useMoods();
  const [state, setState] = useState({
    score: 5,
    emoji: "",
    notes: "",
    timestamp: "",
    tagsText: "",
  });

  const pick = (emoji) => setState((s) => ({ ...s, emoji }));

  const submit = async (e) => {
    e.preventDefault();
    if (!uid) {
      alert("Sign in required");
      return;
    }
    const tags = state.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    await add({
      score: state.score,
      emoji: state.emoji,
      notes: state.notes,
      timestamp: state.timestamp,
      tags,
    });
    setState({ score: 5, emoji: "", notes: "", timestamp: "", tagsText: "" });
  };

  if (!uid) {
    return (
      <div className="mood-container">
        <Card title="Mood Check-In">
          <p className="mood-signin-required">
            🔒 Please sign in to track your mood
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mood-container">
      <Card title="Mood Check-In">
        <form onSubmit={submit} className="mood-form">
          <div className="mood-form-row">
            <Field label="Time">
              <Input
                type="datetime-local"
                value={state.timestamp}
                onChange={(e) =>
                  setState((s) => ({ ...s, timestamp: e.target.value }))
                }
              />
            </Field>
            <Field label="Score (1–10)">
              <Input
                type="number"
                min="1"
                max="10"
                value={state.score}
                onChange={(e) =>
                  setState((s) => ({ ...s, score: e.target.value }))
                }
              />
            </Field>
          </div>

          <div className="mood-emoji-picker">
            {["😄", "🙂", "😐", "☹️", "😢"].map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => pick(em)}
                className={`mood-emoji-btn ${
                  state.emoji === em ? "active" : ""
                }`}
              >
                {em}
              </button>
            ))}
          </div>

          <Field label="Notes">
            <Textarea
              value={state.notes}
              onChange={(e) =>
                setState((s) => ({ ...s, notes: e.target.value }))
              }
              placeholder="How are you feeling today?"
            />
          </Field>

          <Field label="Tags">
            <Input
              placeholder="morning, work, family"
              value={state.tagsText}
              onChange={(e) =>
                setState((s) => ({ ...s, tagsText: e.target.value }))
              }
            />
          </Field>

          <button className="mood-submit-btn">Save Mood</button>
        </form>
      </Card>

      <Card title="Mood Trend">
        {loading ? (
          <div className="mood-loading">Loading…</div>
        ) : (
          <div className="mood-analytics">
            <div className="mood-avg">Avg: {analytics.avg || 0}</div>
            <div className="mood-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#d4b483" />
                  <YAxis domain={[0, 10]} stroke="#d4b483" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(10, 14, 39, 0.95)",
                      border: "1px solid #d4b483",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mood-timeline">
              {items.map((m) => (
                <div key={m.id} className="mood-timeline-item">
                  <div className="mood-timeline-date">
                    {new Date(m.timestamp).toLocaleString()}
                  </div>
                  <div className="mood-timeline-content">
                    <span className="mood-timeline-emoji">
                      {m.emoji || "—"}
                    </span>
                    <span className="mood-timeline-score">• {m.score}</span>
                    {m.notes && (
                      <p className="mood-timeline-notes">{m.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MoodCheckIn;
