import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  Sun,
  Play,
  Pause,
  RefreshCw,
  BookOpenHeart,
  Check,
  Plus,
  Trash2,
  Shuffle,
  Star,
  TrendingUp,
  Award,
  Flame,
  Target,
  Clock,
  BarChart3,
  Calendar,
  Smile,
  Meh,
  Frown,
  Music2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

const todayKey = () => new Date().toISOString().slice(0, 10);
const secondsToClock = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
    2,
    "0"
  )}`;

const WaveHeader = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
    <svg
      className="absolute top-0 w-[200%] h-64 opacity-30"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <animate
        attributeName="x"
        from="0"
        to="-720"
        dur="18s"
        repeatCount="indefinite"
      />
      <path
        fill="#fbbf24"
        fillOpacity="0.15"
        d="M0,64L48,69.3C96,75,192,85,288,122.7C384,160,480,224,576,245.3C672,267,768,245,864,208C960,171,1056,117,1152,85.3C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
      />
    </svg>
    <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-40 right-20 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-700" />
  </div>
);

const prompts = [
  "What energy do you want to bring into today?",
  "What one thing, if done, makes today a win?",
  "Who will benefit from your presence today?",
  "What boundary keeps you balanced today?",
  "What do you choose to release today?",
  "Which value leads your decisions today?",
  "What small act of kindness can you offer?",
  "How will you show up as your best self?",
];

const baseAffirmations = [
  "I move with calm purpose.",
  "My choices align with my values.",
  "I honor my limits and my growth.",
  "I'm grounded, steady, and present.",
  "Today, I choose compassion and clarity.",
  "I am consistent with small wins.",
  "I breathe ease into every task.",
  "My intention guides my day.",
  "I am worthy of rest and progress.",
];

export default function DailyIntentionsDashboard() {
  const [dateKey] = useState(todayKey());
  const [prompt, setPrompt] = useState(
    prompts[Math.floor(Math.random() * prompts.length)]
  );
  const [journal, setJournal] = useState("");
  const [affirmation, setAffirmation] = useState(
    baseAffirmations[Math.floor(Math.random() * baseAffirmations.length)]
  );
  const [customAffirmation, setCustomAffirmation] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [habits, setHabits] = useState([
    { title: "Meditate 10m", completed: false },
    { title: "Gratitude note", completed: false },
    { title: "10k steps", completed: false },
  ]);
  const [sessions, setSessions] = useState([]); // Firestore-backed
  const [streak, setStreak] = useState(0); // computed from sessions
  const [mood, setMood] = useState("");
  const [showReflect, setShowReflect] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitText, setNewHabitText] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const tickRef = useRef(null);

  // Focus timer
  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(tickRef.current);
  }, [running]);

  // Load Storage audio (optional)
  useEffect(() => {
    const loadAudio = async () => {
      if (!storage) return;
      try {
        const url = await getDownloadURL(
          ref(storage, "daily-intentions/morning-guide.mp3")
        );
        setAudioURL(url);
      } catch (_e) {
        /* optional asset; ignore if missing */
      }
    };
    loadAudio();
  }, []);

  // Load recent sessions from Firestore (last 14)
  useEffect(() => {
    const load = async () => {
      if (!db) return;
      try {
        const q = query(
          collection(db, "dailyIntentions"),
          orderBy("createdAt", "desc"),
          limit(14)
        );
        const snap = await getDocs(q);
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSessions(rows);
        setStreak(calcStreak(rows));
      } catch (e) {
        console.error("Load error:", e);
      }
    };
    load();
  }, []);

  const toggleHabit = (i) => {
    setHabits((arr) =>
      arr.map((h, idx) => (idx === i ? { ...h, completed: !h.completed } : h))
    );
  };

  const addHabit = (title) => {
    if (!title.trim() || habits.length >= 5) return;
    setHabits((arr) => [...arr, { title, completed: false }]);
    setNewHabitText("");
    setShowAddHabit(false);
  };

  const removeHabit = (i) =>
    setHabits((arr) => arr.filter((_, idx) => idx !== i));

  const shuffleAffirmation = () =>
    setAffirmation(
      baseAffirmations[Math.floor(Math.random() * baseAffirmations.length)]
    );
  const favoriteAffirmation = () => {
    if (!favorites.includes(affirmation))
      setFavorites((f) => [affirmation, ...f].slice(0, 20));
  };

  // Save to Firestore
  const saveToday = async () => {
    if (!db) {
      alert("Firebase not configured");
      return;
    }
    setSaving(true);
    try {
      const docData = {
        date: dateKey,
        prompt,
        affirmation,
        habits, // full array; charts derive counts
        reflection: journal,
        mood,
        focusSeconds: timer,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "dailyIntentions"), docData);

      // optimistic update (place now at top)
      const optimistic = {
        ...docData,
        createdAt: { seconds: Date.now() / 1000 },
      };
      setSessions((s) => [optimistic, ...s].slice(0, 60));
      setStreak((_) => calcStreak([optimistic, ...sessions]));
      setShowReflect(false);
      setJournal("");
      setMood("");
      setTimer(0);
      setRunning(false);
    } catch (e) {
      console.error("Save error:", e);
    }
    setSaving(false);
  };

  // Chart data
  const chartData = useMemo(() => {
    const last7 = [...sessions].reverse().slice(-7);
    return last7.map((d, i) => ({
      name: `D${last7.length - i}`,
      habits: Array.isArray(d.habits)
        ? d.habits.filter((h) => h.completed).length
        : d.habits || 0,
      focus: Math.round((d.focusSeconds || 0) / 60),
    }));
  }, [sessions]);

  // Summary tiles
  const tiles = useMemo(() => {
    const totalSessions = sessions.length;
    const totalFocusMin = Math.round(
      sessions.reduce((a, s) => a + (s.focusSeconds || 0), 0) / 60
    );
    const avgHabits = totalSessions
      ? sessions.reduce(
          (a, s) =>
            a +
            (Array.isArray(s.habits)
              ? s.habits.filter((h) => h.completed).length
              : s.habits || 0),
          0
        ) / totalSessions
      : 0;
    return {
      streak,
      totalSessions,
      avgHabits: avgHabits.toFixed(1),
      totalFocusHours: Math.round(totalFocusMin / 60),
    };
  }, [sessions, streak]);

  // Helpers
  function calcStreak(rows) {
    if (!rows.length) return 0;
    const toKey = (r) =>
      r.date ||
      (r.createdAt?.seconds
        ? new Date(r.createdAt.seconds * 1000).toISOString().slice(0, 10)
        : todayKey());
    const set = new Set(rows.map(toKey));
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

  const completedHabits = habits.filter((h) => h.completed).length;
  const totalHabits = habits.length;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <WaveHeader />

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-slate-950/60 border-b border-amber-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Sun className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400">
                Daily Intentions
              </h1>
              <p className="text-xs text-gray-400">
                Set • Affirm • Track • Reflect
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-gray-400">Streak</p>
              <p className="text-2xl font-bold text-amber-400">
                {tiles.streak}
              </p>
            </div>
            <div className="h-8 w-px bg-amber-400/20" />
            <div className="text-center">
              <p className="text-gray-400">Today</p>
              <p className="text-amber-400 font-semibold">{dateKey}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Row - Prompt + Affirmation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Morning Prompt */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-amber-400/30 p-8 backdrop-blur overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles size={20} />
                  Morning Prompt
                </h2>
                <button
                  onClick={() =>
                    setPrompt(
                      prompts[Math.floor(Math.random() * prompts.length)]
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black text-xs font-semibold transition-all"
                >
                  Shuffle
                </button>
              </div>
              <p className="text-xl font-semibold text-white mb-6 leading-relaxed">
                {prompt}
              </p>
              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="Write your intention in 1–2 sentences..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-400/50 resize-none text-white placeholder-gray-500 transition-all"
              />
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                {!running ? (
                  <button
                    onClick={() => {
                      setTimer(0);
                      setRunning(true);
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Play size={18} />
                    Focus Timer
                  </button>
                ) : (
                  <button
                    onClick={() => setRunning(false)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-lg"
                  >
                    <Pause size={18} />
                    Stop
                  </button>
                )}
                {timer > 0 && (
                  <button
                    onClick={() => {
                      setTimer(0);
                      setRunning(false);
                    }}
                    className="px-4 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-sm font-semibold flex items-center gap-2 transition-all"
                  >
                    <RefreshCw size={16} />
                    Reset
                  </button>
                )}
                <div className="ml-auto flex items-center gap-2 text-gray-300">
                  <Clock size={16} />
                  <span className="text-sm">
                    Focused:{" "}
                    <span className="font-bold text-amber-300">
                      {secondsToClock(timer)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Affirmation Card */}
          <div className="bg-gradient-to-br from-amber-500/15 to-yellow-500/5 rounded-3xl border border-amber-400/40 p-8 backdrop-blur overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                  <BookOpenHeart size={20} />
                  Affirmation
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={shuffleAffirmation}
                    className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 transition-all"
                  >
                    <Shuffle size={16} className="text-amber-300" />
                  </button>
                  <button
                    onClick={favoriteAffirmation}
                    className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 transition-all"
                  >
                    <Star size={16} className="text-amber-300" />
                  </button>
                </div>
              </div>
              <p className="text-2xl font-bold italic text-white leading-relaxed">
                "{affirmation}"
              </p>
              <div className="space-y-2">
                <input
                  value={customAffirmation}
                  onChange={(e) => setCustomAffirmation(e.target.value)}
                  placeholder="Create your own..."
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-400/50 text-sm"
                />
                <button
                  onClick={() => {
                    if (customAffirmation.trim()) {
                      setAffirmation(customAffirmation.trim());
                      setCustomAffirmation("");
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black text-xs font-semibold transition-all"
                >
                  Use This
                </button>
              </div>
              {favorites.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                    Saved
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {favorites.map((f, i) => (
                      <span
                        key={i}
                        onClick={() => setAffirmation(f)}
                        className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-200 text-xs cursor-pointer hover:bg-amber-500/40 transition-all"
                      >
                        {f.slice(0, 20)}...
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Voice Guide
                </h3>
                {audioURL ? (
                  <audio
                    src={audioURL}
                    controls
                    className="w-full rounded-lg"
                  />
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    Upload <code>daily-intentions/morning-guide.mp3</code> to
                    Firebase Storage to enable playback.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Habits + Reflection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Habit Tracker */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-amber-400/30 p-8 backdrop-blur">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-4">
              <BarChart3 size={20} />
              Daily Habits ({habits.filter((h) => h.completed).length}/
              {habits.length})
            </h2>
            <div className="space-y-3 mb-6">
              {habits.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/10 hover:border-amber-400/30 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleHabit(idx)}
                      className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${
                        h.completed
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400"
                          : "border-white/30 hover:border-amber-400"
                      }`}
                    >
                      {h.completed && (
                        <Check size={16} className="text-white" />
                      )}
                    </button>
                    <span
                      className={`text-sm font-medium transition-all ${
                        h.completed
                          ? "line-through text-gray-500"
                          : "text-white"
                      }`}
                    >
                      {h.title}
                    </span>
                  </div>
                  <button
                    onClick={() => removeHabit(idx)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            {habits.length < 5 &&
              (showAddHabit ? (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-black/20 border border-white/10">
                  <input
                    value={newHabitText}
                    onChange={(e) => setNewHabitText(e.target.value)}
                    placeholder="Add a habit..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => addHabit(newHabitText)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black text-xs font-semibold transition-all"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddHabit(false);
                      setNewHabitText("");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/40 hover:to-yellow-500/40 border border-dashed border-amber-400/30 text-amber-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Plus size={16} />
                  Add Habit
                </button>
              ))}
          </div>

          {/* Reflection */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-amber-400/30 p-8 backdrop-blur">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-4">
              <BarChart3 size={20} />
              End-of-Day
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              Close your day with gratitude.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMood("😊")}
                  className={`p-3 rounded-lg transition-all ${
                    mood === "😊"
                      ? "bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border border-emerald-400"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-2xl">😊</span>
                </button>
                <button
                  onClick={() => setMood("😐")}
                  className={`p-3 rounded-lg transition-all ${
                    mood === "😐"
                      ? "bg-gradient-to-br from-amber-500/30 to-yellow-600/30 border border-amber-400"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-2xl">😐</span>
                </button>
                <button
                  onClick={() => setMood("☹️")}
                  className={`p-3 rounded-lg transition-all ${
                    mood === "☹️"
                      ? "bg-gradient-to-br from-red-500/30 to-rose-600/30 border border-red-400"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-2xl">☹️</span>
                </button>
              </div>
              <button
                onClick={() => setShowReflect(true)}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black text-sm font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Write Reflection
              </button>
              {showReflect && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-amber-400/30 p-8 shadow-2xl">
                    <h3 className="text-xl font-bold text-amber-300 mb-4">
                      Day Wrap-Up
                    </h3>
                    <textarea
                      value={journal}
                      onChange={(e) => setJournal(e.target.value)}
                      placeholder="What went well? What will you carry into tomorrow?"
                      className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-400/50 text-white placeholder-gray-500 resize-none"
                    />
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Mood:{" "}
                        <span className="text-amber-300 font-semibold">
                          {mood || "—"}
                        </span>
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowReflect(false)}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={saving}
                          onClick={saveToday}
                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold transition-all disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics */}
        {sessions.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-amber-300 flex items-center gap-2 mb-8">
              <TrendingUp size={24} />
              Your Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Tile
                icon={<Flame size={16} />}
                label="Current Streak"
                value={tiles.streak}
                sub="days in a row"
              />
              <Tile
                icon={<Award size={16} />}
                label="Total Sessions"
                value={tiles.totalSessions}
                sub="days tracked"
              />
              <Tile
                icon={<Target size={16} />}
                label="Avg Habits"
                value={tiles.avgHabits}
                sub="per day"
              />
              <Tile
                icon={<Clock size={16} />}
                label="Total Focus"
                value={`${tiles.totalFocusHours}h`}
                sub="focused time"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-amber-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-6">
                  <BarChart3 size={20} />
                  Weekly Focus Time
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorFocus"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#fbbf24"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#fbbf24"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #2a2a2a",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="focus"
                        stroke="#fbbf24"
                        fillOpacity={1}
                        fill="url(#colorFocus)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-amber-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-6">
                  <BarChart3 size={20} />
                  Habit Completions
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #2a2a2a",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="habits"
                        fill="#f4c27a"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Tile({ icon, label, value, sub }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-amber-400/30 p-6 backdrop-blur">
      <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
        {icon}
        {label}
      </p>
      <p className="text-4xl font-bold text-amber-400">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{sub}</p>
    </div>
  );
}
