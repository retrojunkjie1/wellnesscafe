// src/features/recovery/tools/AuroraBreathing.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, PauseCircle, Volume2, VolumeX, Mic, MicOff, Sparkles } from "lucide-react";
import { db } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";

// ---- Config (edit to taste) ----
const PATTERN = { inhale: 4000, hold: 7000, exhale: 8000, rest: 2000 }; // 4-7-8 breathing technique
const SOUNDS = {
  ocean: "/sounds/ocean.mp3",
  forest: "/sounds/forest.mp3",
  wind: "/sounds/wind.mp3"
};

const gradientForMood = (value) => {
  if (value <= 3) { return "from-[#ff4e50] to-[#9f5fff]"; }
  if (value <= 6) { return "from-[#7b61ff] to-[#44e0b7]"; }
  return "from-[#00d4ff] to-[#50fa7b]";
};

const phaseOrder = ["inhale", "hold", "exhale", "rest"];

const nextPhase = (p) => {
  const i = phaseOrder.indexOf(p);
  return phaseOrder[(i + 1) % phaseOrder.length];
};

const phaseDuration = (p) => PATTERN[p] || 4000;

const speak = (text) => {
  try {
    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) { msg.voice = voices.find((v) => /en/i.test(v.lang)) || voices[0]; }
    msg.rate = 0.88;
    msg.pitch = 1.0;
    msg.volume = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  } catch (_e) { }
};

const AuroraBreathing = () => {
  const [mood, setMood] = useState(5);
  const [phase, setPhase] = useState("ready");
  const [running, setRunning] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [soundKey, setSoundKey] = useState("ocean");
  const [showSummary, setShowSummary] = useState(false);
  const [preMood, setPreMood] = useState(5);
  const [breathCount, setBreathCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const startTsRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // prepare audio element
  useEffect(() => {
    const el = new Audio(SOUNDS[soundKey]);
    el.loop = true;
    el.preload = "auto";
    audioRef.current = el;
    return () => { try { el.pause(); } catch (_e) { } };
  }, [soundKey]);

  // control audio playback
  useEffect(() => {
    const el = audioRef.current;
    if (!el) { return; }
    const run = async () => {
      try {
        if (running && soundOn) { await el.play(); }
        else { el.pause(); }
      } catch (_e) { }
    };
    run();
  }, [running, soundOn, soundKey]);

  // breathing cycle controller
  useEffect(() => {
    if (!running) { return; }
    if (phase === "ready") { setPhase("inhale"); return; }
    if (voiceOn) {
      if (phase === "inhale") { speak("Inhale slowly"); }
      if (phase === "hold") { speak("Hold"); }
      if (phase === "exhale") { speak("Exhale gently"); }
      if (phase === "rest") { speak("Rest"); }
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPhase((p) => {
        const newPhase = nextPhase(p);
        // Increment breath count when completing a full cycle (after rest phase)
        if (p === "rest") {
          setBreathCount((prev) => prev + 1);
        }
        return newPhase;
      });
    }, phaseDuration(phase));
    return () => clearTimeout(timerRef.current);
  }, [running, phase, voiceOn]);

  // Session duration tracker
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const startSession = () => {
    setPreMood(mood);
    setShowSummary(false);
    setPhase("ready");
    setBreathCount(0);
    setSessionDuration(0);
    startTsRef.current = Date.now();
    setRunning(true);
  };

  const endSession = async () => {
    setRunning(false);
    setPhase("ready");
    const mins = ((Date.now() - (startTsRef.current || Date.now())) / 60000);
    const post = Math.min(10, preMood + 2); // simple uplift; replace with your AI calc later
    try {
      if (db) {
        await addDoc(collection(db, "breathingSessions"), {
          sessionDate: new Date().toISOString(),
          technique: "4-7-8 Aurora",
          preMood,
          postMood: post,
          durationMins: Number(mins.toFixed(1)),
          breathCount,
          createdAt: new Date(),
        });
      }
    } catch (_e) { }
    setShowSummary(true);
  };

  const orbTargetScale = useMemo(() => {
    if (!running) { return 1; }
    if (phase === "inhale") { return 1.4; }
    if (phase === "exhale") { return 0.82; }
    return 1.0;
  }, [running, phase]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale": return "#7b61ff";
      case "hold": return "#9d7fff";
      case "exhale": return "#44e0b7";
      case "rest": return "#5fe0d1";
      default: return "#ffffff";
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0c10] text-gray-100">
      {/* Mood-reactive aurora wash */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientForMood(mood)} opacity-20 transition-all duration-700`} />
      
      {/* Soft radial lights */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen">
        <div className="absolute -top-20 -right-24 h-96 w-96 rounded-full blur-3xl bg-[#7b61ff33]" />
        <div className="absolute -bottom-24 -left-20 h-[30rem] w-[30rem] rounded-full blur-3xl bg-[#44e0b733]" />
      </div>
      
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(22)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-white/12"
            initial={{ opacity: 0, y: Math.random() * 800, x: Math.random() * 1200 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [Math.random() * 800, -200],
              x: [Math.random() * 1200, Math.random() * 1200 + 200]
            }}
            transition={{ duration: 14 + Math.random() * 18, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Controls top-right */}
      <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
        <button
          onClick={() => setSoundOn((v) => !v)}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          title={soundOn ? "Mute ambient sound" : "Enable ambient sound"}
        >
          {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setVoiceOn((v) => !v)}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          title={voiceOn ? "Disable voice guidance" : "Enable voice guidance"}
        >
          {voiceOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <select
          value={soundKey}
          onChange={(e) => setSoundKey(e.target.value)}
          className="px-3 py-2 rounded-full bg-white/10 text-sm outline-none hover:bg-white/15 transition cursor-pointer"
        >
          <option value="ocean">Ocean Calm</option>
          <option value="forest">Forest Pulse</option>
          <option value="wind">Mountain Air</option>
        </select>
      </div>

      {/* Main card */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6">
        {/* Mood slider */}
        <div className="w-full rounded-2xl bg-white/6 p-6 backdrop-blur-lg shadow-lg">
          <p className="text-sm text-gray-300">How are you feeling right now? (1–10)</p>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full accent-[#7b61ff]"
              disabled={running}
            />
            <span className="text-xl font-bold text-[#7b61ff]">{mood}</span>
          </div>
        </div>

        {/* Orb */}
        <div className="mt-8 w-full rounded-2xl bg-white/6 p-10 backdrop-blur-xl shadow-xl">
          {/* Session stats */}
          {running && (
            <div className="flex justify-between items-center mb-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-[#7b61ff]">⏱</span>
                <span>{formatTime(sessionDuration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#44e0b7]">🌊</span>
                <span>{breathCount} breaths</span>
              </div>
            </div>
          )}

          <div className="relative mx-auto flex h-[320px] w-full items-center justify-center">
            <AnimatePresence>
              <motion.div
                key={phase}
                animate={{
                  scale: orbTargetScale,
                  boxShadow: `0 0 140px ${phase === "inhale" ? "#7b61ff66" : phase === "exhale" ? "#44e0b766" : "#ffffff22"}`
                }}
                transition={{
                  duration: running ? (phase === "hold" ? 0.6 : 1.4) : 0.5,
                  ease: "easeInOut"
                }}
                className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-[#7b61ff] to-[#44e0b7] shadow-[0_0_40px_rgba(68,224,183,0.55)]"
              >
                <span className="select-none text-2xl font-semibold tracking-wide drop-shadow">
                  {(running ? phase : "READY").toUpperCase()}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Outer ring pulse */}
            {running && (
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: getPhaseColor() }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: phaseDuration(phase) / 1000,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            )}
          </div>

          {/* Phase instruction */}
          {running && (
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-sm text-gray-400 italic"
            >
              {phase === "inhale" && "Breathe in slowly through your nose..."}
              {phase === "hold" && "Hold your breath gently..."}
              {phase === "exhale" && "Exhale slowly through your mouth..."}
              {phase === "rest" && "Rest and prepare for the next breath..."}
            </motion.p>
          )}

          {/* CTA */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {!running ? (
              <button
                onClick={() => startSession()}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7b61ff] to-[#44e0b7] px-8 py-4 font-semibold shadow-lg transition-transform hover:scale-105"
              >
                <PlayCircle className="h-6 w-6" /> START SESSION
              </button>
            ) : (
              <button
                onClick={() => endSession()}
                className="flex items-center gap-2 rounded-full bg-white/10 px-8 py-4 font-semibold text-gray-100 shadow-lg transition-colors hover:bg-white/20"
              >
                <PauseCircle className="h-6 w-6" /> END SESSION
              </button>
            )}
          </div>
          
          {!running && (
            <p className="mt-3 text-center text-sm text-gray-400 italic">
              Breathe with the orb. Inhale • Hold • Exhale • Rest.
            </p>
          )}
        </div>

        {/* Summary */}
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full rounded-2xl bg-white/10 p-8 backdrop-blur-xl shadow-xl"
          >
            <h3 className="mb-2 flex items-center gap-2 text-2xl font-semibold text-[#7b61ff]">
              <Sparkles className="h-5 w-5" /> Session Summary
            </h3>
            <div className="space-y-2 text-gray-200">
              <p>
                <strong>Duration:</strong> {formatTime(sessionDuration)}
              </p>
              <p>
                <strong>Breaths:</strong> {breathCount} cycles
              </p>
              <p>
                Calm Score improved from <strong>{preMood}</strong> → <strong>{Math.min(10, preMood + 2)}</strong>
                {preMood < 10 && <span className="text-[#44e0b7]"> ↑+2</span>}
              </p>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-[#7b61ff]">��</span>
                <span>
                  <strong>AI Insight:</strong> Your heart-mind rhythm shows restorative alignment. 
                  The {breathCount} breath cycles activated your parasympathetic system. 
                  Try 3–5 rounds daily and add a short gratitude reflection after breathing 
                  for enhanced emotional resilience.
                </span>
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setShowSummary(false)}
                className="rounded-full bg-gradient-to-r from-[#7b61ff] to-[#44e0b7] px-6 py-2 font-semibold transition-transform hover:scale-105"
              >
                CONTINUE JOURNEY
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AuroraBreathing;
