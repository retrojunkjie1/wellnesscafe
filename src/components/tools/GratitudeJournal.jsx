import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Sparkles,
  Calendar,
  Save,
  TrendingUp,
  Award,
  Flame,
  BookOpen,
  Plus,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

const PROMPTS = [
  "What made you smile today?",
  "Who are you grateful to have in your life?",
  "What challenge helped you grow recently?",
  "What's a simple pleasure you enjoyed today?",
  "What part of your routine brings you peace?",
  "What strength did you discover in yourself?",
  "What act of kindness touched your heart?",
  "What in nature are you thankful for?",
  "What lesson are you grateful to have learned?",
  "What comfort or security do you appreciate?",
];

const CATEGORIES = [
  "People",
  "Health",
  "Growth",
  "Nature",
  "Comfort",
  "Achievement",
  "Kindness",
  "Recovery",
];

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function GratitudeJournal() {
  const [dateKey] = useState(todayKey());
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [entries, setEntries] = useState([{ text: "", category: "People" }]);
  const [reflection, setReflection] = useState("");
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);

  // Load entries from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "gratitude"),
      orderBy("createdAt", "desc"),
      limit(90)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          date: normalizeDate(d.data()),
        }));
        setRows(data);
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error("gratitude:onSnapshot", err);
      }
    );
    return () => unsub();
  }, []);

  const shufflePrompt = () => {
    const newPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(newPrompt);
  };

  const addEntry = () => {
    if (entries.length < 10) {
      setEntries([...entries, { text: "", category: "People" }]);
    }
  };

  const removeEntry = (idx) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== idx));
    }
  };

  const updateEntry = (idx, field, value) => {
    const updated = [...entries];
    updated[idx][field] = value;
    setEntries(updated);
  };

  const save = async () => {
    if (entries.every((e) => !e.text.trim())) return;
    setSaving(true);
    try {
      const validEntries = entries.filter((e) => e.text.trim());
      await addDoc(collection(db, "gratitude"), {
        date: dateKey,
        prompt,
        entries: validEntries,
        reflection,
        count: validEntries.length,
        createdAt: serverTimestamp(),
      });
      setEntries([{ text: "", category: "People" }]);
      setReflection("");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("gratitude:addDoc", e);
    }
    setSaving(false);
  };

  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, "gratitude", id));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("gratitude:deleteDoc", e);
    }
  };

  // Analytics
  const stats = useMemo(() => {
    if (rows.length === 0)
      return { total: 0, streak: 0, avgCount: 0, thisMonth: 0 };
    const totalEntries = rows.reduce((sum, r) => sum + (r.count || 0), 0);
    const streak = calcStreak(rows);
    const thisMonth = countThisMonth(rows);
    return {
      total: totalEntries,
      streak,
      avgCount: (totalEntries / rows.length).toFixed(1),
      thisMonth,
    };
  }, [rows]);

  const trend14 = useMemo(() => {
    const last14 = [...rows].reverse().slice(-14);
    return last14.map((r, i) => ({
      name: `D${last14.length - i}`,
      count: r.count || 0,
    }));
  }, [rows]);

  const categoryData = useMemo(() => {
    const counts = CATEGORIES.reduce((m, c) => {
      m[c] = 0;
      return m;
    }, {});
    rows.forEach((r) => {
      (r.entries || []).forEach((e) => {
        if (counts[e.category] != null) counts[e.category] += 1;
      });
    });
    return CATEGORIES.map((c) => ({ name: c, count: counts[c] || 0 }));
  }, [rows]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Header */}
      <div className="relative z-10 sticky top-0 backdrop-blur-md bg-slate-950/60 border-b border-green-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-400">
                Gratitude Journal
              </h1>
              <p className="text-xs text-gray-400">
                Count blessings • Build positivity • Shift perspective
              </p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-6 text-sm">
            <Metric title="TOTAL" value={stats.total} />
            <Metric title="STREAK" value={`${stats.streak}d`} />
            <Metric title="AVG/DAY" value={stats.avgCount} />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Today's Entry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-green-400/30 p-8 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-green-300 flex items-center gap-2">
                  <Sparkles size={20} /> Today's Prompt
                </h2>
                <button
                  onClick={shufflePrompt}
                  className="px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-sm font-semibold transition-all"
                >
                  Shuffle
                </button>
              </div>
              <p className="text-xl text-white italic mb-6">"{prompt}"</p>
              <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent mb-6" />

              {/* Entries */}
              <div className="space-y-4">
                {entries.map((entry, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={entry.text}
                        onChange={(e) =>
                          updateEntry(idx, "text", e.target.value)
                        }
                        placeholder={`Gratitude #${idx + 1}...`}
                        className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-400/50 text-white placeholder-gray-500 resize-none"
                      />
                      <select
                        value={entry.category}
                        onChange={(e) =>
                          updateEntry(idx, "category", e.target.value)
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-green-400/50"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    {entries.length > 1 && (
                      <button
                        onClick={() => removeEntry(idx)}
                        className="w-10 h-10 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 flex items-center justify-center transition-all"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {entries.length < 10 && (
                <button
                  onClick={addEntry}
                  className="w-full mt-4 px-4 py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Add Another Gratitude
                </button>
              )}
            </div>

            {/* Reflection */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-green-400/30 p-8 backdrop-blur">
              <h2 className="text-lg font-bold text-green-300 flex items-center gap-2 mb-4">
                <BookOpen size={20} /> Evening Reflection (Optional)
              </h2>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="How did practicing gratitude shift your perspective today?"
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-400/50 text-white placeholder-gray-500 resize-none"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-green-400/30 p-8 backdrop-blur">
              <p className="text-sm text-gray-400 mb-4">
                <Calendar size={14} className="inline mr-2" />
                {dateKey}
              </p>
              <button
                onClick={save}
                disabled={saving || entries.every((e) => !e.text.trim())}
                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Entry"}
              </button>
            </div>

            <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 text-sm text-green-100">
              <p className="font-semibold mb-2">💡 Why Gratitude?</p>
              <p className="text-xs">
                Daily gratitude practice rewires your brain to notice
                positivity, reduces stress, and improves emotional resilience.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Flame size={14} />}
                title="This Month"
                value={stats.thisMonth}
              />
              <StatCard
                icon={<Award size={14} />}
                title="All Time"
                value={stats.total}
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        {rows.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-green-300 flex items-center gap-2 mb-8">
              <TrendingUp size={24} /> Your Gratitude Journey
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* 14-day trend */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-green-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-green-300 flex items-center gap-2 mb-6">
                  <TrendingUp size={20} /> 14-Day Trend
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend14}>
                      <defs>
                        <linearGradient
                          id="colorGratitude"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis allowDecimals={false} stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #2a2a2a",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorGratitude)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category distribution */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-green-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-green-300 flex items-center gap-2 mb-6">
                  <BarChart size={20} /> Category Distribution
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis
                        dataKey="name"
                        stroke="#888"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis allowDecimals={false} stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #2a2a2a",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent entries */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-green-400/30 p-8 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-green-300 flex items-center gap-2">
                  <Heart size={20} /> Recent Entries
                </h3>
                <button
                  onClick={() => setShowAllEntries(!showAllEntries)}
                  className="text-sm text-green-400 hover:text-green-300 transition-all"
                >
                  {showAllEntries ? "Show Less" : "Show All"}
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {rows
                  .slice(0, showAllEntries ? rows.length : 5)
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="p-6 bg-black/30 border border-white/10 rounded-xl hover:border-green-400/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-400">{entry.date}</p>
                          <p className="text-xs text-green-400 italic mt-1">
                            "{entry.prompt}"
                          </p>
                        </div>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-400 hover:text-red-300 transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(entry.entries || []).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="text-green-400 mt-1">•</span>
                            <div className="flex-1">
                              <p className="text-sm text-white">{item.text}</p>
                              <span className="text-xs px-2 py-1 rounded-md bg-green-500/20 text-green-200 inline-block mt-1">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {entry.reflection && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs text-gray-400 mb-1">
                            Reflection:
                          </p>
                          <p className="text-sm text-gray-300 italic">
                            "{entry.reflection}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="text-center">
      <p className="text-gray-400 text-xs mb-1">{title}</p>
      <p className="text-2xl font-bold text-green-400">{value}</p>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-green-400/30 p-4 backdrop-blur">
      <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
        {icon}
        {title}
      </p>
      <p className="text-2xl font-bold text-green-400">{value}</p>
    </div>
  );
}

function normalizeDate(d) {
  if (d?.date) return d.date;
  if (d?.createdAt?.seconds) {
    return new Date(d.createdAt.seconds * 1000).toISOString().slice(0, 10);
  }
  return todayKey();
}

function calcStreak(rows) {
  const set = new Set(rows.map((r) => r.date || todayKey()));
  let s = 0;
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) s++;
    else break;
  }
  return s;
}

function countThisMonth(rows) {
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  return rows.filter((r) => (r.date || "").startsWith(ym)).length;
}
