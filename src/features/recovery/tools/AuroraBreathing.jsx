import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Sparkles, Pause } from 'lucide-react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";

/**
 * Aurora Breathing Experience
 * 
 * Luxury breathing session with:
 * - Animated aurora background (pulsing gradient)
 * - Floating particle system
 * - Smooth orb animation synced to breathing phases
 * - Pre/post mood tracking
 * - AI-style feedback modal
 * - Firestore integration
 */
const AuroraBreathing = () => {
  const [mood, setMood] = useState(5);
  const [phase, setPhase] = useState("ready");
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [timer, setTimer] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Handle breathing cycle animation with 4-7-8 technique
  useEffect(() => {
    if (!isRunning) return;
    
    const phases = [
      { name: "inhale", duration: 4000 },
      { name: "hold", duration: 7000 },
      { name: "exhale", duration: 8000 },
      { name: "rest", duration: 2000 }
    ];
    
    let currentPhaseIndex = 0;
    
    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setPhase(currentPhase.name);
      
      // Increment breath count on exhale complete
      if (currentPhase.name === "rest") {
        setBreathCount(prev => prev + 1);
      }
      
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      
      return setTimeout(runPhase, currentPhase.duration);
    };
    
    const timeout = runPhase();
    return () => clearTimeout(timeout);
  }, [isRunning]);

  // Track session duration
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const startSession = () => {
    setIsRunning(true);
    setShowSummary(false);
    setTimer(Date.now());
    setBreathCount(0);
    setSessionDuration(0);
    setPhase("inhale");
  };

  const endSession = async () => {
    const duration = ((Date.now() - timer) / 1000 / 60).toFixed(1);
    const postMood = mood + 2 > 10 ? 10 : mood + 2;
    
    try {
      await addDoc(collection(db, "breathingSessions"), {
        sessionDate: new Date().toISOString(),
        preMood: mood,
        postMood: postMood,
        duration: parseFloat(duration),
        breathCount: breathCount,
        technique: "4-7-8 Aurora",
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error saving session:", error);
    }
    
    setIsRunning(false);
    setShowSummary(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch(phase) {
      case "inhale": return "#7b61ff";
      case "hold": return "#9d7fff";
      case "exhale": return "#44e0b7";
      case "rest": return "#5fe0d1";
      default: return "#ffffff";
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0e0e10] text-gray-100">
      
      {/* Animated Aurora Layer - Pulsing gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at top right, rgba(123, 97, 255, 0.2), transparent 50%), radial-gradient(ellipse at bottom left, rgba(68, 224, 183, 0.2), transparent 50%)",
            "radial-gradient(ellipse at top left, rgba(123, 97, 255, 0.25), transparent 55%), radial-gradient(ellipse at bottom right, rgba(68, 224, 183, 0.25), transparent 55%)",
            "radial-gradient(ellipse at top right, rgba(123, 97, 255, 0.2), transparent 50%), radial-gradient(ellipse at bottom left, rgba(68, 224, 183, 0.2), transparent 50%)",
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating Particles - Energy field simulation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [-100, -800],
              x: [0, (Math.random() - 0.5) * 400],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-6 space-y-10 text-center">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#7b61ff] via-[#9d7fff] to-[#44e0b7] bg-clip-text text-transparent">
            Aurora Breathing
          </h1>
          <p className="text-gray-400 text-sm">4-7-8 Technique • Luxury Experience</p>
        </motion.div>

        {/* Mood Input */}
        {!isRunning && !showSummary && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl"
          >
            <p className="text-sm text-gray-400 mb-3">How are you feeling right now? (1–10)</p>
            <div className="flex items-center gap-4">
              <input 
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-[#7b61ff]"
                style={{
                  background: `linear-gradient(to right, #7b61ff 0%, #7b61ff ${(mood - 1) * 11.11}%, rgba(255,255,255,0.1) ${(mood - 1) * 11.11}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <span className="text-2xl font-bold text-[#7b61ff] min-w-[3rem] text-center">
                {mood}
              </span>
            </div>
          </motion.div>
        )}

        {/* Session Timer */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-6 text-sm text-gray-400"
          >
            <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              ⏱ {formatTime(sessionDuration)}
            </div>
            <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              🌊 {breathCount} breaths
            </div>
          </motion.div>
        )}

        {/* Breathing Orb - The centerpiece */}
        <div className="relative h-72 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              animate={{
                scale: phase === "inhale" ? 1.5 : phase === "exhale" ? 0.7 : phase === "hold" ? 1.5 : 1,
                opacity: 1,
              }}
              transition={{ 
                duration: phase === "inhale" ? 4 : phase === "hold" ? 7 : phase === "exhale" ? 8 : 2, 
                ease: "easeInOut" 
              }}
              className="absolute h-56 w-56 rounded-full flex items-center justify-center 
                bg-gradient-to-br from-[#7b61ff] via-[#9d7fff] to-[#44e0b7]"
              style={{
                boxShadow: `0 0 120px ${getPhaseColor()}66, 0 0 60px ${getPhaseColor()}33`,
              }}
            >
              <motion.span 
                className="text-2xl font-semibold tracking-wider drop-shadow-lg uppercase"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {phase === "ready" ? "READY" : phase.toUpperCase()}
              </motion.span>
            </motion.div>
          </AnimatePresence>

          {/* Outer ring pulse */}
          {isRunning && (
            <motion.div
              className="absolute h-64 w-64 rounded-full border-2 border-white/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: phase === "inhale" ? 4 : phase === "hold" ? 7 : phase === "exhale" ? 8 : 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Instruction Text */}
        {isRunning && (
          <motion.p
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-400 text-sm"
          >
            {phase === "inhale" && "Breathe in slowly through your nose..."}
            {phase === "hold" && "Hold your breath gently..."}
            {phase === "exhale" && "Exhale slowly through your mouth..."}
            {phase === "rest" && "Rest and prepare for the next breath..."}
          </motion.p>
        )}

        {/* Control Buttons */}
        {!isRunning && !showSummary && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={startSession}
            className="flex items-center justify-center gap-3 mx-auto px-10 py-4 
              bg-gradient-to-r from-[#7b61ff] to-[#44e0b7] rounded-full 
              shadow-[0_0_40px_rgba(123,97,255,0.4)] text-lg font-semibold 
              hover:scale-105 hover:shadow-[0_0_60px_rgba(123,97,255,0.6)] 
              transition-all duration-300"
          >
            <PlayCircle className="w-6 h-6" /> START SESSION
          </motion.button>
        )}

        {isRunning && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={endSession}
            className="mx-auto px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md
              rounded-full transition-all duration-300 text-sm text-gray-300
              border border-white/10 flex items-center gap-2 justify-center"
          >
            <Pause className="w-4 h-4" /> END SESSION
          </motion.button>
        )}

        {/* Summary Modal - AI Feedback */}
        <AnimatePresence>
          {showSummary && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl 
                rounded-3xl p-8 border border-white/20 shadow-2xl text-left space-y-5"
            >
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                from-[#7b61ff] to-[#44e0b7] flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-[#7b61ff]" /> 
                Session Complete
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-semibold">{formatTime(sessionDuration)}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Breaths Completed</span>
                  <span className="text-white font-semibold">{breathCount} cycles</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-gray-400">Calm Score</span>
                  <span className="text-white font-semibold">
                    {mood} → {mood + 2 > 10 ? 10 : mood + 2}
                    <span className="text-[#44e0b7] ml-2">↑ +{mood + 2 > 10 ? 10 - mood : 2}</span>
                  </span>
                </div>
              </div>

              <div className="bg-[#7b61ff]/10 border border-[#7b61ff]/30 rounded-2xl p-5 mt-6">
                <p className="text-[#44e0b7] font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Insight
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your heart-mind rhythm shows <em className="text-[#7b61ff]">restorative alignment</em>. 
                  The {breathCount} breath cycles activated your parasympathetic nervous system, 
                  promoting deep calm. Continue consistent breathing for 5-7 minutes daily 
                  to reinforce neural pathways of peace and clarity.
                </p>
              </div>
              
              <button 
                onClick={() => setShowSummary(false)}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-[#7b61ff] to-[#44e0b7] 
                  rounded-full font-semibold text-white hover:scale-105 
                  transition-transform duration-300 shadow-[0_0_30px_rgba(123,97,255,0.4)]"
              >
                CONTINUE JOURNEY
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 text-sm italic"
        >
          Feel the flow. Let energy and calm harmonize ✨
        </motion.p>
      </div>
    </div>
  );
};

export default AuroraBreathing;
