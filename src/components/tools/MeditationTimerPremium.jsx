import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Music,
  Award,
  Flame,
  TrendingUp,
  Volume2,
  VolumeX,
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
} from "firebase/firestore";

const PRESETS = [
  { name: "Quick Reset", duration: 300, desc: "5-min centering" },
  { name: "Standard", duration: 600, desc: "10-min practice" },
  { name: "Deep Dive", duration: 900, desc: "15-min session" },
  { name: "Extended", duration: 1200, desc: "20-min immersion" },
  { name: "Custom", duration: 0, desc: "Set your own" },
];

const SOUNDS = [
  { id: "none", name: "Silence", desc: "No sound" },
  { id: "bell", name: "Tibetan Bell", desc: "Gentle chimes" },
  { id: "singing-bowl", name: "Singing Bowl", desc: "Resonant tones" },
  { id: "rain", name: "Rain", desc: "Ambient rainfall" },
  { id: "ocean", name: "Ocean Waves", desc: "Rhythmic waves" },
  { id: "forest", name: "Forest", desc: "Birds & breeze" },
];

const TECHNIQUES = [
  "Breath awareness",
  "Body scan",
  "Loving-kindness",
  "Mantra repetition",
  "Open monitoring",
  "Visualization",
];

const todayKey = () => new Date().toISOString().slice(0, 10);
const secondsToClock = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
    2,
    "0"
  )}`;

export default function MeditationTimerPremium() {
  const [preset, setPreset] = useState(PRESETS[1]);
  const [customMinutes, setCustomMinutes] = useState(10);
  const [duration, setDuration] = useState(600);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sound, setSound] = useState(SOUNDS[0]);
  const [technique, setTechnique] = useState(TECHNIQUES[0]);
  const [note, setNote] = useState("");
  const [sessions, setSessions] = useState([]);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef(null);

  // Load sessions from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "meditation"),
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
        setSessions(data);
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error("meditation:onSnapshot", err);
      }
    );
    return () => unsub();
  }, []);

  // Timer logic
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= duration) {
          setRunning(false);
          setCompleted(true);
          playCompletionSound();
          saveSession(duration);
          return duration;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, duration]);

  const start = () => {
    if (elapsed === 0) {
      // Starting fresh
      const finalDuration =
        preset.name === "Custom" ? customMinutes * 60 : preset.duration;
      setDuration(finalDuration);
      setElapsed(0);
    }
    setRunning(true);
    setCompleted(false);
  };

  const pause = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setCompleted(false);
  };

  const selectPreset = (p) => {
    setPreset(p);
    const finalDuration = p.name === "Custom" ? customMinutes * 60 : p.duration;
    setDuration(finalDuration);
    reset();
  };

  const playCompletionSound = () => {
    if (muted || sound.id === "none") return;
    // In production, load actual audio file
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const saveSession = async (durationSecs) => {
    try {
      const session = {
        date: todayKey(),
        duration: durationSecs,
        technique,
        sound: sound.id,
        note,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "meditation"), session);
      setSessions((prev) => [session, ...prev].slice(0, 60));
      setNote("");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("meditation:addDoc", e);
    }
  };

  // Analytics
  const stats = useMemo(() => {
    if (sessions.length === 0)
      return {
        total: 0,
        totalMinutes: 0,
        streak: 0,
        avgDuration: 0,
        thisWeek: 0,
      };
    const totalMinutes =
      sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;
    const streak = calcStreak(sessions);
    const thisWeek = sessions.filter((s) => {
      const sessionDate = new Date(s.date || Date.now());
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    }).length;
    return {
      total: sessions.length,
      totalMinutes: Math.floor(totalMinutes),
      streak,
      avgDuration: Math.floor(totalMinutes / sessions.length),
      thisWeek,
    };
  }, [sessions]);

  const trend14 = useMemo(() => {
    const last14 = [...sessions].reverse().slice(-14);
    return last14.map((s, i) => ({
      name: `D${last14.length - i}`,
      minutes: Math.floor((s.duration || 0) / 60),
    }));
  }, [sessions]);

  const techniqueData = useMemo(() => {
    const counts = TECHNIQUES.reduce((m, t) => {
      m[t] = 0;
      return m;
    }, {});
    sessions.forEach((s) => {
      if (counts[s.technique] != null) counts[s.technique] += 1;
    });
    return TECHNIQUES.map((t) => ({
      name: t.split(" ")[0],
      count: counts[t] || 0,
    }));
  }, [sessions]);

  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;
  const remaining = duration - elapsed;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Header */}
      <div className="relative z-10 sticky top-0 backdrop-blur-md bg-slate-950/60 border-b border-purple-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-400">
                Meditation Timer
              </h1>
              <p className="text-xs text-gray-400">
                Practice mindfulness • Build consistency • Track progress
              </p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-6 text-sm">
            <Metric title="SESSIONS" value={stats.total} />
            <Metric title="STREAK" value={`${stats.streak}d`} />
            <Metric title="TOTAL MIN" value={stats.totalMinutes} />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Timer & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Timer */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-purple-400/30 p-8 backdrop-blur">
            <div className="flex flex-col items-center">
              {/* Circular progress */}
              <div className="relative w-64 h-64 mb-8">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="8"
                    strokeDasharray={`${progress * 2.827} 282.7`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-6xl font-bold text-purple-400">
                    {secondsToClock(
                      running || completed ? remaining : duration
                    )}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {completed
                      ? "Complete!"
                      : running
                      ? "Remaining"
                      : "Duration"}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mb-8">
                {!running ? (
                  <button
                    onClick={start}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  >
                    <Play size={28} />
                  </button>
                ) : (
                  <button
                    onClick={pause}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  >
                    <Pause size={28} />
                  </button>
                )}
                <button
                  onClick={reset}
                  className="w-16 h-16 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all hover:scale-110"
                >
                  <RotateCcw size={24} />
                </button>
                <button
                  onClick={() => setMuted(!muted)}
                  className="w-16 h-16 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all hover:scale-110"
                >
                  {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>

              {/* Presets */}
              <div className="w-full">
                <h3 className="text-sm font-semibold text-purple-300 mb-3">
                  Duration Presets
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => selectPreset(p)}
                      disabled={running}
                      className={`p-3 rounded-lg border-2 transition-all text-sm ${
                        preset.name === p.name
                          ? "border-purple-400 bg-purple-500/20 text-purple-200"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                      } disabled:opacity-50`}
                    >
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.desc}</div>
                    </button>
                  ))}
                </div>
                {preset.name === "Custom" && (
                  <div className="mt-4">
                    <label className="text-sm text-purple-300 block mb-2">
                      Minutes:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={customMinutes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setCustomMinutes(val);
                        setDuration(val * 60);
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-400/50"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            {/* Technique */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-purple-400/30 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold text-purple-300 mb-3">
                Technique
              </h3>
              <select
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-400/50"
              >
                {TECHNIQUES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-purple-400/30 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Music size={16} /> Ambient Sound
              </h3>
              <select
                value={sound.id}
                onChange={(e) =>
                  setSound(SOUNDS.find((s) => s.id === e.target.value))
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-400/50"
              >
                {SOUNDS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {s.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-purple-400/30 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold text-purple-300 mb-3">
                Session Note
              </h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How did this practice feel?"
                className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Flame size={14} />}
                title="This Week"
                value={stats.thisWeek}
              />
              <StatCard
                icon={<Award size={14} />}
                title="Avg Min"
                value={stats.avgDuration}
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        {sessions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2 mb-8">
              <TrendingUp size={24} /> Your Practice Journey
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* 14-day trend */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-purple-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2 mb-6">
                  <TrendingUp size={20} /> 14-Session Minutes
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend14}>
                      <defs>
                        <linearGradient
                          id="colorMeditation"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#a855f7"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#a855f7"
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
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="minutes"
                        stroke="#a855f7"
                        fillOpacity={1}
                        fill="url(#colorMeditation)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Technique distribution */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-purple-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2 mb-6">
                  <BarChart size={20} /> Techniques Used
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={techniqueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="name" stroke="#888" />
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
                        fill="#a855f7"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent sessions */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-purple-400/30 p-8 backdrop-blur">
              <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2 mb-6">
                <Clock size={20} /> Recent Sessions
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sessions.slice(0, 10).map((session, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-black/30 border border-white/10 rounded-xl hover:border-purple-400/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-white font-semibold">
                          {session.technique}
                        </p>
                        <p className="text-xs text-gray-400">{session.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-400">
                          {Math.floor((session.duration || 0) / 60)} min
                        </p>
                        {session.sound && session.sound !== "none" && (
                          <p className="text-xs text-gray-400">
                            {SOUNDS.find((s) => s.id === session.sound)?.name ||
                              "Sound"}
                          </p>
                        )}
                      </div>
                    </div>
                    {session.note && (
                      <p className="text-sm text-gray-300 italic mt-2">
                        "{session.note}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src="/sounds/meditation-bell.mp3" />
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="text-center">
      <p className="text-gray-400 text-xs mb-1">{title}</p>
      <p className="text-2xl font-bold text-purple-400">{value}</p>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-purple-400/30 p-4 backdrop-blur">
      <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
        {icon}
        {title}
      </p>
      <p className="text-2xl font-bold text-purple-400">{value}</p>
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
