import React, { useState, useEffect, useRef } from "react";
import "./MeditationTimer.css";

const MeditationTimer = () => {
  const [duration, setDuration] = useState(10); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedSound, setSelectedSound] = useState("silence");
  const [intervalBells, setIntervalBells] = useState(false);
  const [bellInterval, setBellInterval] = useState(5); // minutes
  const [sessionComplete, setSessionComplete] = useState(false);
  const [guidedMode, setGuidedMode] = useState(false);
  const [breathingPattern, setBreathingPattern] = useState(null);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const lastBellRef = useRef(0);

  // Load stats from localStorage
  useEffect(() => {
    const stats = JSON.parse(
      localStorage.getItem("meditationStats") || '{"sessions": 0, "minutes": 0}'
    );
    setTotalSessions(stats.sessions);
    setTotalMinutes(stats.minutes);
  }, []);

  const guidedMeditations = [
    {
      id: "body-scan",
      name: "Body Scan",
      duration: 10,
      description: "Progressive relaxation from head to toe",
      prompts: [
        { time: 0, text: "Begin by taking three deep breaths..." },
        {
          time: 2,
          text: "Notice any tension in your head and face. Let it go...",
        },
        { time: 4, text: "Feel your shoulders relaxing, dropping down..." },
        { time: 6, text: "Scan through your chest, feeling your heartbeat..." },
        { time: 8, text: "Notice your legs and feet, completely relaxed..." },
      ],
    },
    {
      id: "breath-awareness",
      name: "Breath Awareness",
      duration: 5,
      description: "Simple focus on natural breathing",
      prompts: [
        { time: 0, text: "Settle into a comfortable position..." },
        { time: 1, text: "Notice the natural rhythm of your breath..." },
        { time: 2, text: "Feel the air entering your nostrils..." },
        { time: 3, text: "Observe the pause between breaths..." },
        { time: 4, text: "Return to the breath whenever your mind wanders..." },
      ],
    },
    {
      id: "loving-kindness",
      name: "Loving Kindness",
      duration: 15,
      description: "Cultivate compassion for self and others",
      prompts: [
        { time: 0, text: "Bring to mind someone you love deeply..." },
        {
          time: 3,
          text: 'Silently offer: "May you be happy, may you be healthy..."',
        },
        { time: 6, text: "Now extend these wishes to yourself..." },
        { time: 9, text: "Expand to someone neutral in your life..." },
        { time: 12, text: "Finally, send compassion to all beings..." },
      ],
    },
  ];

  const breathingPatterns = [
    {
      id: "478",
      name: "4-7-8 Breathing",
      description: "Inhale 4, Hold 7, Exhale 8 - For deep relaxation",
      inhale: 4,
      hold: 7,
      exhale: 8,
    },
    {
      id: "box",
      name: "Box Breathing",
      description: "Inhale 4, Hold 4, Exhale 4, Hold 4 - For focus",
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4,
    },
    {
      id: "calm",
      name: "Calm Breathing",
      description: "Inhale 4, Exhale 6 - For anxiety relief",
      inhale: 4,
      exhale: 6,
    },
  ];

  const ambientSounds = [
    {
      id: "silence",
      name: "Silence",
      icon: "🔇",
      url: null,
      description: "Pure silence for deep focus",
    },
    {
      id: "rain",
      name: "Rain",
      icon: "🌧️",
      url: "https://cdn.freesound.org/previews/513/513947_1648170-lq.mp3",
      description: "Gentle rainfall for calming",
    },
    {
      id: "ocean",
      name: "Ocean Waves",
      icon: "🌊",
      url: "https://cdn.freesound.org/previews/233/233156_1015240-lq.mp3",
      description: "Rhythmic waves for grounding",
    },
    {
      id: "forest",
      name: "Forest",
      icon: "🌲",
      url: "https://cdn.freesound.org/previews/416/416710_5121236-lq.mp3",
      description: "Birds and nature sounds",
    },
    {
      id: "river",
      name: "River",
      icon: "💧",
      url: "https://cdn.freesound.org/previews/39/39022_16181-lq.mp3",
      description: "Flowing water for peace",
    },
    {
      id: "wind",
      name: "Wind Chimes",
      icon: "🎐",
      url: "https://cdn.freesound.org/previews/411/411089_2977460-lq.mp3",
      description: "Gentle chimes for serenity",
    },
    {
      id: "tibetan",
      name: "Tibetan Bowl",
      icon: "🔔",
      url: "https://cdn.freesound.org/previews/268/268031_4486188-lq.mp3",
      description: "Sacred singing bowl tones",
    },
    {
      id: "fire",
      name: "Crackling Fire",
      icon: "🔥",
      url: "https://cdn.freesound.org/previews/235/235953_3133851-lq.mp3",
      description: "Warm fireplace ambiance",
    },
  ];

  const durations = [5, 10, 15, 20, 25, 30];

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }

          // Check for interval bell
          if (intervalBells) {
            const minutesElapsed = (duration * 60 - prev) / 60;
            if (
              minutesElapsed > 0 &&
              minutesElapsed % bellInterval === 0 &&
              Math.floor(minutesElapsed) !== lastBellRef.current
            ) {
              playBell();
              lastBellRef.current = Math.floor(minutesElapsed);
            }
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, duration, intervalBells, bellInterval]);

  const handleComplete = () => {
    setIsRunning(false);
    setSessionComplete(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    playCompletionBell();

    // Save stats to localStorage
    const newSessions = totalSessions + 1;
    const newMinutes = totalMinutes + duration;
    setTotalSessions(newSessions);
    setTotalMinutes(newMinutes);
    localStorage.setItem(
      "meditationStats",
      JSON.stringify({
        sessions: newSessions,
        minutes: newMinutes,
        lastSession: new Date().toISOString(),
      })
    );
  };

  const startSession = () => {
    setIsRunning(true);
    setIsPaused(false);
    setSessionComplete(false);
    setTimeLeft(duration * 60);
    lastBellRef.current = 0;

    // Play ambient sound
    if (selectedSound !== "silence" && audioRef.current) {
      audioRef.current.play();
    }

    // Play starting bell
    playBell();
  };

  const pauseSession = () => {
    setIsPaused(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeSession = () => {
    setIsPaused(false);
    if (selectedSound !== "silence" && audioRef.current) {
      audioRef.current.play();
    }
  };

  const stopSession = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playBell = () => {
    // Play a bell sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Bell-like sound: high frequency with decay
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.1
      );

      // Decay envelope
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
      // Fallback: use system beep via TTS
      // eslint-disable-next-line no-console
      console.warn("Audio playback failed:", e);
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance("🔔");
        utterance.volume = 0.1;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const playCompletionBell = () => {
    // Play 3 bells to signal completion
    playBell();
    setTimeout(playBell, 500);
    setTimeout(playBell, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="meditation-timer">
      <div className="meditation-timer-header">
        <h2>Meditation Timer</h2>
        <p>Find your center with guided silent meditation</p>

        {/* Stats Display */}
        {(totalSessions > 0 || totalMinutes > 0) && (
          <div className="meditation-stats">
            <div className="stat">
              <span className="stat-value">{totalSessions}</span>
              <span className="stat-label">Sessions</span>
            </div>
            <div className="stat">
              <span className="stat-value">{totalMinutes}</span>
              <span className="stat-label">Minutes</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </span>
              <span className="stat-label">Total Time</span>
            </div>
          </div>
        )}
      </div>

      {!isRunning && !sessionComplete && (
        <>
          {/* Mode Selection */}
          <div className="timer-config-section">
            <h3>Meditation Mode</h3>
            <div className="mode-toggle">
              <button
                className={`mode-btn ${!guidedMode ? "active" : ""}`}
                onClick={() => setGuidedMode(false)}
              >
                🧘 Silent Meditation
              </button>
              <button
                className={`mode-btn ${guidedMode ? "active" : ""}`}
                onClick={() => setGuidedMode(true)}
              >
                🎯 Guided Practice
              </button>
            </div>
          </div>

          {/* Breathing Pattern Selection */}
          {!guidedMode && (
            <div className="timer-config-section">
              <h3>Breathing Pattern (Optional)</h3>
              <div className="breathing-patterns">
                <button
                  className={`pattern-btn ${!breathingPattern ? "active" : ""}`}
                  onClick={() => setBreathingPattern(null)}
                >
                  None
                </button>
                {breathingPatterns.map((pattern) => (
                  <button
                    key={pattern.id}
                    className={`pattern-btn ${
                      breathingPattern === pattern.id ? "active" : ""
                    }`}
                    onClick={() => setBreathingPattern(pattern.id)}
                    title={pattern.description}
                  >
                    {pattern.name}
                  </button>
                ))}
              </div>
              {breathingPattern && (
                <p className="pattern-description">
                  {
                    breathingPatterns.find((p) => p.id === breathingPattern)
                      ?.description
                  }
                </p>
              )}
            </div>
          )}

          {/* Guided Meditation Selection */}
          {guidedMode && (
            <div className="timer-config-section">
              <h3>Choose Guided Meditation</h3>
              <div className="guided-options">
                {guidedMeditations.map((guide) => (
                  <div
                    key={guide.id}
                    className="guided-card"
                    onClick={() => setDuration(guide.duration)}
                  >
                    <h4>{guide.name}</h4>
                    <p>{guide.description}</p>
                    <span className="guide-duration">{guide.duration} min</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Duration Selection */}
          {!guidedMode && (
            <div className="timer-config-section">
              <h3>Duration</h3>
              <div className="duration-buttons">
                {durations.map((d) => (
                  <button
                    key={d}
                    className={`duration-btn ${duration === d ? "active" : ""}`}
                    onClick={() => {
                      setDuration(d);
                      setTimeLeft(d * 60);
                    }}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ambient Sound Selection */}
          <div className="timer-config-section">
            <h3>Ambient Sound</h3>
            <div className="sound-grid">
              {ambientSounds.map((sound) => (
                <button
                  key={sound.id}
                  className={`sound-btn ${
                    selectedSound === sound.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedSound(sound.id)}
                  title={sound.description}
                >
                  <span className="sound-icon">{sound.icon}</span>
                  <span className="sound-name">{sound.name}</span>
                </button>
              ))}
            </div>
            {selectedSound !== "silence" && (
              <p className="sound-note">
                🎧 Tip: Use headphones for the best ambient sound experience
              </p>
            )}
          </div>

          {/* Interval Bells */}
          <div className="timer-config-section">
            <div className="interval-bells-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={intervalBells}
                  onChange={(e) => setIntervalBells(e.target.checked)}
                />
                <span>Interval Bells</span>
              </label>
              {intervalBells && (
                <select
                  value={bellInterval}
                  onChange={(e) => setBellInterval(parseInt(e.target.value))}
                  className="bell-interval-select"
                >
                  <option value={1}>Every 1 min</option>
                  <option value={2}>Every 2 min</option>
                  <option value={5}>Every 5 min</option>
                  <option value={10}>Every 10 min</option>
                </select>
              )}
            </div>
          </div>
        </>
      )}

      {/* Timer Display */}
      <div
        className={`timer-display ${isRunning ? "running" : ""} ${
          sessionComplete ? "complete" : ""
        }`}
      >
        <svg className="timer-circle" viewBox="0 0 200 200">
          <circle className="timer-circle-bg" cx="100" cy="100" r="90" />
          <circle
            className="timer-circle-progress"
            cx="100"
            cy="100"
            r="90"
            style={{
              strokeDasharray: `${565.48}`,
              strokeDashoffset: `${565.48 - (565.48 * progress) / 100}`,
            }}
          />
        </svg>
        <div className="timer-text">
          {sessionComplete ? (
            <>
              <div className="complete-icon">✓</div>
              <div className="complete-text">Complete</div>
            </>
          ) : (
            <>
              <div className="time-display">{formatTime(timeLeft)}</div>
              {isRunning && (
                <div className="status-text">
                  {isPaused ? "Paused" : "Meditating..."}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="timer-controls">
        {!isRunning && !sessionComplete && (
          <button onClick={startSession} className="timer-btn btn-start">
            Begin Meditation
          </button>
        )}
        {isRunning && !isPaused && (
          <>
            <button onClick={pauseSession} className="timer-btn btn-pause">
              Pause
            </button>
            <button onClick={stopSession} className="timer-btn btn-stop">
              Stop
            </button>
          </>
        )}
        {isRunning && isPaused && (
          <>
            <button onClick={resumeSession} className="timer-btn btn-resume">
              Resume
            </button>
            <button onClick={stopSession} className="timer-btn btn-stop">
              Stop
            </button>
          </>
        )}
        {sessionComplete && (
          <button
            onClick={() => {
              setSessionComplete(false);
              setTimeLeft(duration * 60);
            }}
            className="timer-btn btn-new"
          >
            New Session
          </button>
        )}
      </div>

      {/* Session Complete Message */}
      {sessionComplete && (
        <div className="completion-message">
          <h3>🎉 Session Complete!</h3>
          <p>
            You meditated for <strong>{duration} minutes</strong>
          </p>

          <div className="completion-stats">
            <div className="completion-stat">
              <span className="stat-icon">🧘</span>
              <span className="stat-text">{totalSessions} total sessions</span>
            </div>
            <div className="completion-stat">
              <span className="stat-icon">⏱️</span>
              <span className="stat-text">
                {totalMinutes} minutes practiced
              </span>
            </div>
            <div className="completion-stat">
              <span className="stat-icon">🔥</span>
              <span className="stat-text">Keep your streak alive!</span>
            </div>
          </div>

          <div className="meditation-benefits">
            <h4>Benefits You're Building:</h4>
            <ul>
              <li>✓ Reduced stress and anxiety</li>
              <li>✓ Improved focus and clarity</li>
              <li>✓ Better emotional regulation</li>
              <li>✓ Enhanced self-awareness</li>
              <li>✓ Stronger mental resilience</li>
            </ul>
          </div>

          <div className="upgrade-prompt">
            <p>
              <strong>Track your meditation journey!</strong>
            </p>
            <p>
              Create a free account to see detailed analytics, earn
              achievements, and join our meditation community.
            </p>
            <button className="upgrade-btn">Create Free Account →</button>
          </div>
        </div>
      )}

      {/* Audio elements (hidden) */}
      {selectedSound !== "silence" && (
        <audio
          ref={audioRef}
          loop
          preload="auto"
          src={ambientSounds.find((s) => s.id === selectedSound)?.url}
        />
      )}

      {/* Tips Section */}
      {!isRunning && !sessionComplete && (
        <div className="meditation-tips">
          <h3>💡 Meditation Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">🪑</span>
              <h4>Posture</h4>
              <p>
                Sit comfortably with spine straight. Use a chair or cushion.
                Keep shoulders relaxed.
              </p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🫁</span>
              <h4>Breathing</h4>
              <p>
                Breathe naturally through your nose. Notice the sensation of
                each breath.
              </p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🧠</span>
              <h4>Wandering Mind</h4>
              <p>
                It's normal! When you notice, gently return focus to your breath
                without judgment.
              </p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">⏰</span>
              <h4>Consistency</h4>
              <p>
                Start with 5-10 minutes daily. Same time each day builds a
                lasting habit.
              </p>
            </div>
          </div>

          <div className="quick-start">
            <h4>Quick Start Guide:</h4>
            <ol>
              <li>Choose your duration (beginners: start with 5 minutes)</li>
              <li>Select an ambient sound or silence</li>
              <li>Find a quiet space and get comfortable</li>
              <li>Click "Begin Meditation" and focus on your breath</li>
              <li>When the bell rings, slowly return to awareness</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeditationTimer;
