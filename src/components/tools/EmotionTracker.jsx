import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Activity,
  MapPin,
  Save,
  TrendingUp,
  Award,
  Flame,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
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
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const EMOTIONS = {
  joy: { name: "Joy", color: "#fbbf24", family: "Happy" },
  peace: { name: "Peace", color: "#60a5fa", family: "Calm" },
  love: { name: "Love", color: "#f472b6", family: "Happy" },
  excitement: { name: "Excitement", color: "#fb923c", family: "Energized" },
  contentment: { name: "Contentment", color: "#a3e635", family: "Calm" },
  sadness: { name: "Sadness", color: "#6366f1", family: "Down" },
  anger: { name: "Anger", color: "#ef4444", family: "Tense" },
  fear: { name: "Fear", color: "#a855f7", family: "Anxious" },
  anxiety: { name: "Anxiety", color: "#ec4899", family: "Anxious" },
  frustration: { name: "Frustration", color: "#f97316", family: "Tense" },
  loneliness: { name: "Loneliness", color: "#8b5cf6", family: "Down" },
  hope: { name: "Hope", color: "#10b981", family: "Energized" },
};

const BODY_AREAS = [
  "Head",
  "Neck",
  "Shoulders",
  "Chest",
  "Stomach",
  "Arms",
  "Hands",
  "Back",
  "Legs",
  "Feet",
];

const INTENSITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function EmotionTracker() {
  const [dateKey] = useState(todayKey());
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [intensity, setIntensity] = useState(5);
  const [bodyAreas, setBodyAreas] = useState([]);
  const [context, setContext] = useState("");
  const [coping, setCoping] = useState("");
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load entries from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "emotions"),
      orderBy("createdAt", "desc"),
      limit(60)
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
        console.error("emotions:onSnapshot", err);
      }
    );
    return () => unsub();
  }, []);

  const toggleEmotion = (key) => {
    setSelectedEmotions((prev) =>
      prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]
    );
  };

  const toggleBodyArea = (area) => {
    setBodyAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const save = async () => {
    if (selectedEmotions.length === 0) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "emotions"), {
        date: dateKey,
        emotions: selectedEmotions.map((key) => EMOTIONS[key].name),
        families: [
          ...new Set(selectedEmotions.map((key) => EMOTIONS[key].family)),
        ],
        intensity,
        bodyAreas,
        context,
        coping,
        createdAt: serverTimestamp(),
      });
      setSelectedEmotions([]);
      setBodyAreas([]);
      setIntensity(5);
      setContext("");
      setCoping("");
    } catch (e) {
      console.error("emotions:addDoc", e);
    }
    setSaving(false);
  };

  // Analytics
  const stats = useMemo(() => {
    if (rows.length === 0)
      return { total: 0, streak: 0, avgIntensity: 0, thisWeek: 0 };
    const totalIntensity = rows.reduce((sum, r) => sum + (r.intensity || 0), 0);
    const streak = calcStreak(rows);
    const thisWeek = rows.filter((r) => {
      const sessionDate = new Date(r.date || Date.now());
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    }).length;
    return {
      total: rows.length,
      streak,
      avgIntensity: (totalIntensity / rows.length).toFixed(1),
      thisWeek,
    };
  }, [rows]);

  const trend14 = useMemo(() => {
    const last14 = [...rows].reverse().slice(-14);
    return last14.map((r, i) => ({
      name: `D${last14.length - i}`,
      intensity: r.intensity || 0,
    }));
  }, [rows]);

  const familyData = useMemo(() => {
    const families = ["Happy", "Calm", "Energized", "Down", "Tense", "Anxious"];
    const counts = families.reduce((m, f) => {
      m[f] = 0;
      return m;
    }, {});
    rows.forEach((r) => {
      (r.families || []).forEach((f) => {
        if (counts[f] != null) counts[f] += 1;
      });
    });
    return families.map((f) => ({ family: f, count: counts[f] || 0 }));
  }, [rows]);

  const bodyHeatmap = useMemo(() => {
    const counts = BODY_AREAS.reduce((m, a) => {
      m[a] = 0;
      return m;
    }, {});
    rows.forEach((r) => {
      (r.bodyAreas || []).forEach((a) => {
        if (counts[a] != null) counts[a] += 1;
      });
    });
    return BODY_AREAS.map((a) => ({ area: a, count: counts[a] || 0 }));
  }, [rows]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Header */}
      <div className="relative z-10 sticky top-0 backdrop-blur-md bg-slate-950/60 border-b border-pink-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pink-400">
                Emotion Tracker
              </h1>
              <p className="text-xs text-gray-400">
                Name feelings • Map body sensations • Discover patterns
              </p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-6 text-sm">
            <Metric title="ENTRIES" value={stats.total} />
            <Metric title="STREAK" value={`${stats.streak}d`} />
            <Metric title="AVG INTENSITY" value={stats.avgIntensity} />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Entry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            {/* Emotion Wheel */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-pink-400/30 p-8 backdrop-blur">
              <h2 className="text-lg font-bold text-pink-300 flex items-center gap-2 mb-6">
                <Heart size={20} /> What emotions are present?
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {Object.entries(EMOTIONS).map(([key, emotion]) => (
                  <button
                    key={key}
                    onClick={() => toggleEmotion(key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedEmotions.includes(key)
                        ? "border-pink-400 shadow-lg"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                    style={{
                      backgroundColor: selectedEmotions.includes(key)
                        ? `${emotion.color}20`
                        : undefined,
                      borderColor: selectedEmotions.includes(key)
                        ? emotion.color
                        : undefined,
                    }}
                  >
                    <div
                      className="text-sm font-semibold"
                      style={{ color: emotion.color }}
                    >
                      {emotion.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {emotion.family}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-pink-400/30 p-8 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-pink-300 flex items-center gap-2">
                  <Activity size={20} /> Intensity Level
                </h2>
                <span className="text-4xl font-bold text-white">
                  {intensity}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Mild</span>
                <span>Overwhelming</span>
              </div>
            </div>

            {/* Body Mapping */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-pink-400/30 p-8 backdrop-blur">
              <h2 className="text-lg font-bold text-pink-300 flex items-center gap-2 mb-4">
                <MapPin size={20} /> Where do you feel it in your body?
              </h2>
              <div className="flex flex-wrap gap-2">
                {BODY_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleBodyArea(area)}
                    className={`text-sm px-4 py-2 rounded-lg font-semibold border-2 transition-all ${
                      bodyAreas.includes(area)
                        ? "bg-gradient-to-r from-pink-500/30 to-rose-500/30 border-pink-400 text-pink-200"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Context & Coping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-pink-400/30 p-6 backdrop-blur">
                <h3 className="text-sm font-semibold text-pink-300 mb-3">
                  What triggered this?
                </h3>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Situation or event..."
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-pink-400/50 resize-none"
                />
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-pink-400/30 p-6 backdrop-blur">
                <h3 className="text-sm font-semibold text-pink-300 mb-3">
                  How are you coping?
                </h3>
                <textarea
                  value={coping}
                  onChange={(e) => setCoping(e.target.value)}
                  placeholder="Strategies you're using..."
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-pink-400/50 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-pink-400/30 p-8 backdrop-blur">
              <p className="text-sm text-gray-400 mb-4">
                <Calendar size={14} className="inline mr-2" />
                {dateKey}
              </p>
              <button
                onClick={save}
                disabled={saving || selectedEmotions.length === 0}
                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Entry"}
              </button>
            </div>

            <div className="bg-pink-500/10 border border-pink-400/30 rounded-xl p-4 text-sm text-pink-100">
              <p className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle size={16} /> Why Track Emotions?
              </p>
              <p className="text-xs">
                Naming emotions reduces their intensity. Body awareness helps
                you process feelings before they escalate.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Flame size={14} />}
                title="This Week"
                value={stats.thisWeek}
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
            <h2 className="text-2xl font-bold text-pink-300 flex items-center gap-2 mb-8">
              <TrendingUp size={24} /> Emotion Patterns
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Intensity trend */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-pink-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-pink-300 flex items-center gap-2 mb-6">
                  <TrendingUp size={20} /> 14-Day Intensity
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend14}>
                      <defs>
                        <linearGradient
                          id="colorEmotion"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ec4899"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ec4899"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis domain={[0, 10]} stroke="#888" />
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
                        dataKey="intensity"
                        stroke="#ec4899"
                        fillOpacity={1}
                        fill="url(#colorEmotion)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Emotion families radar */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-pink-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-pink-300 flex items-center gap-2 mb-6">
                  <Activity size={20} /> Emotion Families
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={familyData}>
                      <PolarGrid stroke="#444" />
                      <PolarAngleAxis dataKey="family" stroke="#888" />
                      <PolarRadiusAxis stroke="#888" />
                      <Radar
                        name="Count"
                        dataKey="count"
                        stroke="#ec4899"
                        fill="#ec4899"
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

            {/* Body heatmap */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-pink-400/30 p-8 backdrop-blur mb-12">
              <h3 className="text-lg font-bold text-pink-300 flex items-center gap-2 mb-6">
                <MapPin size={20} /> Body Sensations Heatmap
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {bodyHeatmap.map(({ area, count }) => {
                  const maxCount = Math.max(...bodyHeatmap.map((b) => b.count));
                  const opacity =
                    maxCount > 0 ? (count / maxCount) * 0.8 + 0.2 : 0.2;
                  return (
                    <div
                      key={area}
                      className="p-4 rounded-xl border border-pink-400/30 text-center transition-all"
                      style={{
                        backgroundColor: `rgba(236, 72, 153, ${opacity * 0.3})`,
                        borderColor: `rgba(236, 72, 153, ${opacity})`,
                      }}
                    >
                      <p className="text-sm font-semibold text-white">{area}</p>
                      <p className="text-xs text-pink-300 mt-1">
                        {count} times
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent entries */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-pink-400/30 p-8 backdrop-blur">
              <h3 className="text-lg font-bold text-pink-300 flex items-center gap-2 mb-6">
                <Heart size={20} /> Recent Entries
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {rows.slice(0, 10).map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-black/30 border border-white/10 rounded-xl hover:border-pink-400/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-400">{entry.date}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(entry.emotions || []).map((emotion, eidx) => (
                            <span
                              key={eidx}
                              className="text-xs px-2 py-1 rounded-md bg-pink-500/20 text-pink-200"
                            >
                              {emotion}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-lg font-bold text-pink-400">
                        {entry.intensity}/10
                      </p>
                    </div>
                    {entry.bodyAreas && entry.bodyAreas.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-1">Body: </p>
                        <div className="flex flex-wrap gap-1">
                          {entry.bodyAreas.map((area, aidx) => (
                            <span
                              key={aidx}
                              className="text-xs px-2 py-1 rounded bg-pink-500/10 text-pink-300"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.context && (
                      <p className="text-sm text-gray-300 mb-2">
                        <span className="text-gray-400">Context:</span> "
                        {entry.context}"
                      </p>
                    )}
                    {entry.coping && (
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-400">Coping:</span> "
                        {entry.coping}"
                      </p>
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
      <p className="text-2xl font-bold text-pink-400">{value}</p>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-pink-400/30 p-4 backdrop-blur">
      <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
        {icon}
        {title}
      </p>
      <p className="text-2xl font-bold text-pink-400">{value}</p>
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
