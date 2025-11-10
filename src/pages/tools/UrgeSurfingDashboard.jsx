import React, { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RefreshCw, Music2, Clock, BookOpen, CheckCircle2, TrendingUp, Zap, Wind, Volume2, VolumeX, Flame, Target, Award } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { db, storage } from "../../firebase";
import { collection, addDoc, query, orderBy, getDocs, serverTimestamp, limit } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute bottom-0 w-[200%] h-64 opacity-30" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <animate attributeName="x" from="0" to="-720" dur="16s" repeatCount="indefinite" />
      <path fill="#f4c27a" fillOpacity="0.25" d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,229.3C840,245,960,235,1080,213.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
    </svg>
    <svg className="absolute bottom-0 w-[200%] h-72 opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <animate attributeName="x" from="0" to="-720" dur="22s" repeatCount="indefinite" />
      <path fill="#ffffff" fillOpacity="0.15" d="M0,64L48,90.7C96,117,192,171,288,186.7C384,203,480,181,576,176C672,171,768,181,864,192C960,203,1056,213,1152,224C1248,235,1344,245,1392,250.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
    </svg>
  </div>
);

const secondsToClock = (s) => {
  const mm = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function UrgeSurfingDashboard() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [intensity, setIntensity] = useState(3);
  const [samples, setSamples] = useState([]);
  const [affirmation, setAffirmation] = useState("");
  const [sessions, setSessions] = useState([]);
  const [audioURL, setAudioURL] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const tickRef = useRef(null);

  const library = [
    "I can ride this wave; it will pass.",
    "Cravings are sensations—not orders.",
    "Breathe in calm, exhale urges.",
    "I choose presence over impulse.",
    "Still waters live inside me.",
    "This feeling is temporary.",
    "I am stronger than my impulses.",
    "My mind is a calm ocean.",
    "I breathe through the challenge."
  ];

  useEffect(() => {
    setAffirmation(library[Math.floor(Math.random() * library.length)]);
  }, []);

  useEffect(() => { // breathing cycle
    if (!running) return;
    const breathCycle = setInterval(() => {
      setBreathPhase(p => {
        const phases = ["inhale", "hold", "exhale", "hold"];
        return phases[(phases.indexOf(p) + 1) % phases.length];
      });
    }, 4000);
    return () => clearInterval(breathCycle);
  }, [running]);

  useEffect(() => { // timer
    if (running) {
      tickRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
      return () => clearInterval(tickRef.current);
    }
  }, [running]);

  useEffect(() => { // sampling every 5s
    if (!running) return;
    if (elapsed % 5 === 0 && elapsed > 0) setSamples(arr => [...arr, { t: elapsed, intensity }]);
  }, [elapsed, running, intensity]);

  useEffect(() => { // load audio + sessions
    const fetchAudio = async () => {
      if (!storage) return;
      try {
        const url = await getDownloadURL(ref(storage, "urge-surfing/guide.mp3"));
        setAudioURL(url);
      } catch (e) {
        console.warn("Guide missing:", e.message);
      }
    };
    const fetchSessions = async () => {
      if (!db) return;
      try {
        const q = query(collection(db, "urgeSurfingSessions"), orderBy("endedAt", "desc"), limit(10));
        const snap = await getDocs(q);
        setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
    };
    fetchAudio();
    fetchSessions();
  }, []);

  const start = () => {
    setElapsed(0);
    setSamples([]);
    setRunning(true);
  };

  const stop = async () => {
    setRunning(false);
    const session = { duration: elapsed, samples, affirmation, intensity, endedAt: serverTimestamp() };
    if (db) {
      try {
        await addDoc(collection(db, "urgeSurfingSessions"), session);
        setSessions(prev => [session, ...prev].slice(0, 10));
      } catch (e) {
        console.error("Save error", e);
      }
    }
    setElapsed(0);
    setSamples([]);
  };

  const reset = () => {
    setElapsed(0);
    setSamples([]);
    setRunning(false);
    setIntensity(3);
  };

  const chartData = useMemo(() => sessions.slice(0, 10).reverse().map((s, i) => ({
    name: `S${sessions.slice(0, 10).length - i}`,
    duration: Math.round(s.duration / 60),
    intensity: Math.round((s.samples?.reduce((a, b) => a + b.intensity, 0) || 0) / (s.samples?.length || 1))
  })), [sessions]);

  const stats = useMemo(() => {
    if (!sessions.length) return { totalTime: 0, avgDuration: 0, streak: 0 };
    const totalTime = Math.round(sessions.reduce((a, s) => a + s.duration, 0) / 60);
    const avgDuration = Math.round(totalTime / sessions.length);
    return { totalTime, avgDuration, streak: 5 };
  }, [sessions]);

  const breathSize = breathPhase === "inhale" ? "scale-100" : breathPhase === "exhale" ? "scale-75" : "scale-85";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <WaveBackground />
      <div className="relative z-10 border-b border-orange-500/20 backdrop-blur-md bg-slate-950/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🌊</div>
            <div>
              <h1 className="text-2xl font-bold text-orange-400">Urge Surfing</h1>
              <p className="text-xs text-gray-400">Navigate cravings with mindfulness & presence</p>
            </div>
          </div>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg hover:bg-orange-500/20 transition">
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-orange-500/30 p-8 backdrop-blur group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
            <div className="flex flex-col items-center py-12">
              <div className="relative mb-8 w-48 h-48 flex items-center justify-center">
                <div className={`absolute w-48 h-48 border-4 border-orange-500/30 rounded-full transition-all duration-3000 ${breathSize}`} />
                <div className={`absolute w-40 h-40 border-2 border-orange-400/50 rounded-full transition-all duration-3000 ${breathSize === "scale-100" ? "scale-90" : "scale-100"}`} />
                <div className="text-6xl font-bold text-orange-400 font-mono">{secondsToClock(elapsed)}</div>
              </div>
              {running && <div className="mb-8 text-sm font-semibold text-gray-300 capitalize">
                {breathPhase === "inhale" && "↗ Breathe In"}
                {breathPhase === "exhale" && "↘ Breathe Out"}
                {breathPhase === "hold" && "⏸ Hold"}
              </div>}
              <div className="flex gap-4 flex-wrap justify-center mb-8">
                {!running ?
                  <button onClick={start} className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold flex items-center gap-2 shadow hover:scale-105 transition"><Play size={20} />Start</button> :
                  <button onClick={stop} className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold flex items-center gap-2 shadow"><Pause size={20} />Stop</button>}
                {elapsed > 0 && <button onClick={reset} className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600 rounded-lg font-semibold flex items-center gap-2"><RefreshCw size={18} />Reset</button>}
              </div>
              <div className="w-full">
                <div className="flex justify-between mb-2"><label className="text-sm text-gray-300">Urge Intensity</label><span className="text-2xl font-bold text-orange-400">{intensity}/5</span></div>
                <input type="range" min={1} max={5} value={intensity} onChange={e => setIntensity(parseInt(e.target.value))} disabled={!running} className="w-full h-3 bg-slate-700 rounded-lg accent-orange-500 disabled:opacity-50" />
              </div>
              <div className="mt-8 w-full">
                <p className="text-xs font-semibold text-orange-400 mb-3">Live Intensity Heatmap (5s intervals)</p>
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 60 }).map((_, i) => {
                    const s = samples.find(x => x.t === i * 5);
                    const val = s ? s.intensity : 0;
                    const alpha = val ? 0.15 + val * 0.15 : 0.08;
                    return <div key={i} className="h-4 rounded" style={{ background: `rgba(244,194,122,${alpha})` }} />;
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-500/30 p-6 backdrop-blur space-y-6">
            <div><p className="text-sm text-gray-400 mb-2 flex items-center gap-2"><Clock size={16} />This Session</p>
              <p className="text-4xl font-bold text-orange-400">{secondsToClock(elapsed)}</p></div>
            <div className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            <div><p className="text-sm text-gray-400 mb-2 flex items-center gap-2"><TrendingUp size={16} />Total Sessions</p>
              <p className="text-3xl font-bold">{sessions.length}</p></div>
            <div><p className="text-sm text-gray-400 mb-2 flex items-center gap-2"><Flame size={16} />Streak</p>
              <p className="text-3xl font-bold text-orange-400">{stats.streak} days</p></div>
            <div><p className="text-sm text-gray-400 mb-2 flex items-center gap-2"><Award size={16} />Avg Duration</p>
              <p className="text-2xl font-bold">{stats.avgDuration}m</p></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-2xl border border-orange-500/30 p-8 mb-12 backdrop-blur">
          <div className="flex justify-between mb-4">
            <div><h2 className="text-xl font-bold text-orange-400 flex items-center gap-2 mb-1"><Zap size={20} />Today's Affirmation</h2>
              <p className="text-sm text-gray-400">Renew your mindset with intention</p></div>
            <button onClick={() => setAffirmation(library[Math.floor(Math.random() * library.length)])} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-semibold">New</button>
          </div>
          {affirmation && <p className="text-2xl font-semibold italic text-white">"{affirmation}"</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-500/30 p-6 backdrop-blur">
            <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-4"><Wind size={20} />Quick Techniques</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="p-3 bg-slate-700/30 rounded-lg flex items-center gap-2"><Target size={16} className="text-orange-400" /><span>5-4-3-2-1 grounding</span></div>
              <div className="p-3 bg-slate-700/30 rounded-lg flex items-center gap-2"><Wind size={16} className="text-orange-400" /><span>Box-breathing 4-4-4-4</span></div>
              <div className="p-3 bg-slate-700/30 rounded-lg flex items-center gap-2"><Flame size={16} className="text-orange-400" /><span>Cold-water reset</span></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-500/30 p-6 backdrop-blur">
            <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-4"><Music2 size={20} />Guided Meditation</h3>
            {audioURL ?
              <audio src={audioURL} controls className="w-full rounded-lg" /> :
              <p className="text-xs text-gray-500 italic">Upload <code>urge-surfing/guide.mp3</code> to Firebase Storage to enable playback.</p>}
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-500/30 p-6 backdrop-blur">
              <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-4"><BookOpen size={20} />Duration Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="name" stroke="#888" /><YAxis stroke="#888" />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="duration" stroke="#f4c27a" strokeWidth={3} dot={{ fill: "#f4c27a" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-500/30 p-6 backdrop-blur">
              <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-4"><TrendingUp size={20} />Intensity Patterns</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="name" stroke="#888" /><YAxis stroke="#888" />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px" }} />
                    <Bar dataKey="intensity" fill="#f4c27a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-orange-500/30 p-6 backdrop-blur">
            <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-4"><CheckCircle2 size={20} />Recent Sessions</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {sessions.map((s, i) => (
                <div key={i} className="flex justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/40">
                  <div><p className="text-sm font-semibold">{s.affirmation}</p></div>
                  <div className="text-right text-sm"><p className="font-bold text-orange-400">{secondsToClock(s.duration)}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
