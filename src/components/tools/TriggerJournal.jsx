import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  Award,
  Flame,
  Calendar,
  Save,
  CheckCircle,
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
  PieChart,
  Pie,
  Cell,
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

const TRIGGER_TYPES = [
  "People (specific person)",
  "Places (location/setting)",
  "Times (time of day/anniversary)",
  "Stress (work/life pressure)",
  "Emotions (feeling state)",
  "Sensory (sight/smell/sound)",
  "Social (isolation/conflict)",
  "Physical (pain/fatigue)",
  "Success (fear of failure)",
  "Boredom (lack of structure)",
];

const HALT_FACTORS = [
  { key: "hungry", label: "Hungry", desc: "Physical hunger or poor nutrition" },
  { key: "angry", label: "Angry", desc: "Irritation, resentment, or rage" },
  { key: "lonely", label: "Lonely", desc: "Isolation or lack of connection" },
  { key: "tired", label: "Tired", desc: "Physical or emotional exhaustion" },
];

const COPING_STRATEGIES = [
  { name: "Call support person", category: "Connection" },
  { name: "Go to meeting", category: "Connection" },
  { name: "Urge surfing", category: "Mindfulness" },
  { name: "Box breathing (4-4-4-4)", category: "Physical" },
  { name: "Walk outdoors", category: "Physical" },
  { name: "Journaling", category: "Processing" },
  { name: "Delay & distract", category: "Behavioral" },
  { name: "Play the tape forward", category: "Mental" },
  { name: "Gratitude list", category: "Perspective" },
  { name: "Cold shower", category: "Physical" },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function TriggerJournal() {
  const [dateKey] = useState(todayKey());
  const [triggerType, setTriggerType] = useState(TRIGGER_TYPES[0]);
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [haltFactors, setHaltFactors] = useState([]);
  const [copingUsed, setCopingUsed] = useState([]);
  const [outcome, setOutcome] = useState("");
  const [managed, setManaged] = useState(null);
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load entries from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "triggers"),
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
        console.error("triggers:onSnapshot", err);
      }
    );
    return () => unsub();
  }, []);

  const toggleHalt = (key) => {
    setHaltFactors((prev) =>
      prev.includes(key) ? prev.filter((h) => h !== key) : [...prev, key]
    );
  };

  const toggleCoping = (name) => {
    setCopingUsed((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const save = async () => {
    if (!description.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "triggers"), {
        date: dateKey,
        triggerType,
        description,
        intensity,
        haltFactors,
        copingUsed,
        copingCategories: [
          ...new Set(
            copingUsed.map((c) => {
              const strategy = COPING_STRATEGIES.find((s) => s.name === c);
              return strategy?.category || "Other";
            })
          ),
        ],
        outcome,
        managed: managed !== null ? managed : undefined,
        createdAt: serverTimestamp(),
      });
      setDescription("");
      setIntensity(5);
      setHaltFactors([]);
      setCopingUsed([]);
      setOutcome("");
      setManaged(null);
    } catch (e) {
      console.error("triggers:addDoc", e);
    }
    setSaving(false);
  };

  // Analytics
  const stats = useMemo(() => {
    if (rows.length === 0)
      return {
        total: 0,
        managed: 0,
        avgIntensity: 0,
        thisWeek: 0,
        managedPercent: 0,
      };
    const managedCount = rows.filter((r) => r.managed === true).length;
    const totalIntensity = rows.reduce((sum, r) => sum + (r.intensity || 0), 0);
    const thisWeek = rows.filter((r) => {
      const sessionDate = new Date(r.date || Date.now());
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    }).length;
    return {
      total: rows.length,
      managed: managedCount,
      avgIntensity: (totalIntensity / rows.length).toFixed(1),
      thisWeek,
      managedPercent: ((managedCount / rows.length) * 100).toFixed(0),
    };
  }, [rows]);

  const trend14 = useMemo(() => {
    const last14 = [...rows].reverse().slice(-14);
    return last14.map((r, i) => ({
      name: `D${last14.length - i}`,
      intensity: r.intensity || 0,
      managed: r.managed ? 1 : 0,
    }));
  }, [rows]);

  const triggerTypeData = useMemo(() => {
    const counts = TRIGGER_TYPES.reduce((m, t) => {
      m[t.split(" ")[0]] = 0;
      return m;
    }, {});
    rows.forEach((r) => {
      const short = (r.triggerType || "").split(" ")[0];
      if (counts[short] != null) counts[short] += 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [rows]);

  const haltData = useMemo(() => {
    const counts = { Hungry: 0, Angry: 0, Lonely: 0, Tired: 0 };
    rows.forEach((r) => {
      (r.haltFactors || []).forEach((h) => {
        const factor = h.charAt(0).toUpperCase() + h.slice(1);
        if (counts[factor] != null) counts[factor] += 1;
      });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const copingData = useMemo(() => {
    const categories = [
      "Connection",
      "Mindfulness",
      "Physical",
      "Processing",
      "Behavioral",
      "Mental",
      "Perspective",
    ];
    const counts = categories.reduce((m, c) => {
      m[c] = 0;
      return m;
    }, {});
    rows.forEach((r) => {
      (r.copingCategories || []).forEach((c) => {
        if (counts[c] != null) counts[c] += 1;
      });
    });
    return categories.map((c) => ({ name: c, count: counts[c] || 0 }));
  }, [rows]);

  const COLORS = ["#ef4444", "#f97316", "#fbbf24", "#10b981"];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Header */}
      <div className="relative z-10 sticky top-0 backdrop-blur-md bg-slate-950/60 border-b border-red-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-400">
                Trigger Journal
              </h1>
              <p className="text-xs text-gray-400">
                Identify patterns • Build awareness • Strengthen response
              </p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-6 text-sm">
            <Metric title="TOTAL" value={stats.total} />
            <Metric title="MANAGED" value={`${stats.managedPercent}%`} />
            <Metric title="AVG INTENSITY" value={stats.avgIntensity} />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Entry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            {/* Trigger Type & Description */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-red-400/30 p-8 backdrop-blur">
              <h2 className="text-lg font-bold text-red-300 flex items-center gap-2 mb-6">
                <AlertTriangle size={20} /> What triggered you?
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-red-300 block mb-2">
                    Trigger Type
                  </label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-red-400/50"
                  >
                    {TRIGGER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-red-300 block mb-2">
                    Describe the Trigger
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What happened? Be specific about the situation, people, or circumstances..."
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-400/50 text-white placeholder-gray-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Intensity */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-red-400/30 p-8 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-red-300">
                  Urge/Craving Intensity
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
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Mild</span>
                <span>Overwhelming</span>
              </div>
            </div>

            {/* HALT Check */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-red-400/30 p-8 backdrop-blur">
              <h2 className="text-lg font-bold text-red-300 flex items-center gap-2 mb-4">
                <Shield size={20} /> HALT Check-In
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Which factors are present?
              </p>
              <div className="grid grid-cols-2 gap-4">
                {HALT_FACTORS.map((factor) => (
                  <button
                    key={factor.key}
                    onClick={() => toggleHalt(factor.key)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      haltFactors.includes(factor.key)
                        ? "border-red-400 bg-red-500/20"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="font-bold text-white">{factor.label}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {factor.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Coping Strategies */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-red-400/30 p-8 backdrop-blur">
              <h2 className="text-lg font-bold text-red-300 flex items-center gap-2 mb-4">
                <CheckCircle size={20} /> Coping Strategies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {COPING_STRATEGIES.map((strategy) => (
                  <button
                    key={strategy.name}
                    onClick={() => toggleCoping(strategy.name)}
                    className={`text-sm px-3 py-2 rounded-lg font-semibold border-2 transition-all ${
                      copingUsed.includes(strategy.name)
                        ? "bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400 text-green-200"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    {strategy.name}
                    <span className="text-xs ml-1 opacity-60">
                      ({strategy.category})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Outcome */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-red-400/30 p-8 backdrop-blur">
              <h2 className="text-lg font-bold text-red-300 mb-4">Outcome</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-red-300 block mb-2">
                    Did you manage the trigger successfully?
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setManaged(true)}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold border-2 transition-all ${
                        managed === true
                          ? "border-green-400 bg-green-500/20 text-green-200"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      ✓ Yes, stayed strong
                    </button>
                    <button
                      onClick={() => setManaged(false)}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold border-2 transition-all ${
                        managed === false
                          ? "border-red-400 bg-red-500/20 text-red-200"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      ✗ Relapsed
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-red-300 block mb-2">
                    What happened next?
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="How did the situation resolve? What did you learn?"
                    className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-red-400/50 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-red-400/30 p-8 backdrop-blur">
              <p className="text-sm text-gray-400 mb-4">
                <Calendar size={14} className="inline mr-2" />
                {dateKey}
              </p>
              <button
                onClick={save}
                disabled={saving || !description.trim()}
                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Entry"}
              </button>
            </div>

            <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 text-sm text-red-100">
              <p className="font-semibold mb-2">💡 Why Track Triggers?</p>
              <p className="text-xs">
                Identifying patterns in triggers helps you anticipate and
                prepare for high-risk situations before they escalate.
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
                title="Managed"
                value={stats.managed}
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        {rows.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-red-300 flex items-center gap-2 mb-8">
              <TrendingUp size={24} /> Trigger Patterns & Insights
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Intensity trend */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-red-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-red-300 flex items-center gap-2 mb-6">
                  <TrendingUp size={20} /> 14-Day Intensity
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend14}>
                      <defs>
                        <linearGradient
                          id="colorTrigger"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
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
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorTrigger)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trigger types */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-red-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-red-300 flex items-center gap-2 mb-6">
                  <BarChart size={20} /> Trigger Types
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={triggerTypeData}>
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
                        fill="#ef4444"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* HALT distribution */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-red-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-red-300 flex items-center gap-2 mb-6">
                  <Shield size={20} /> HALT Factors
                </h3>
                <div className="h-72 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={haltData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) =>
                          value > 0 ? `${name}: ${value}` : null
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {haltData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #2a2a2a",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Coping strategies */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-red-400/30 p-8 backdrop-blur">
                <h3 className="text-lg font-bold text-red-300 flex items-center gap-2 mb-6">
                  <CheckCircle size={20} /> Coping Categories
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={copingData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis type="number" stroke="#888" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#888"
                        width={100}
                      />
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
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent entries */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-red-400/30 p-8 backdrop-blur">
              <h3 className="text-lg font-bold text-red-300 flex items-center gap-2 mb-6">
                <AlertTriangle size={20} /> Recent Triggers
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {rows.slice(0, 10).map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-6 bg-black/30 border-2 rounded-xl transition-all ${
                      entry.managed === true
                        ? "border-green-400/30"
                        : entry.managed === false
                        ? "border-red-400/30"
                        : "border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-400">{entry.date}</p>
                        <p className="text-sm font-semibold text-white mt-1">
                          {entry.triggerType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-400">
                          {entry.intensity}/10
                        </p>
                        {entry.managed !== undefined && (
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              entry.managed
                                ? "bg-green-500/20 text-green-200"
                                : "bg-red-500/20 text-red-200"
                            }`}
                          >
                            {entry.managed ? "Managed" : "Relapsed"}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      "{entry.description}"
                    </p>
                    {entry.haltFactors && entry.haltFactors.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-400 mb-1">HALT: </p>
                        <div className="flex flex-wrap gap-1">
                          {entry.haltFactors.map((h, hidx) => (
                            <span
                              key={hidx}
                              className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-200 uppercase"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.copingUsed && entry.copingUsed.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-400 mb-1">Coping: </p>
                        <div className="flex flex-wrap gap-1">
                          {entry.copingUsed.slice(0, 3).map((c, cidx) => (
                            <span
                              key={cidx}
                              className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-200"
                            >
                              {c}
                            </span>
                          ))}
                          {entry.copingUsed.length > 3 && (
                            <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-200">
                              +{entry.copingUsed.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {entry.outcome && (
                      <p className="text-sm text-gray-300 italic">
                        <span className="text-gray-400">Outcome:</span> "
                        {entry.outcome}"
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
      <p className="text-2xl font-bold text-red-400">{value}</p>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-red-400/30 p-4 backdrop-blur">
      <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
        {icon}
        {title}
      </p>
      <p className="text-2xl font-bold text-red-400">{value}</p>
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
