import React, { useState, useEffect, useRef } from 'react';
import './MeditationTimer.css';

const MeditationTimer = () => {
  const [duration, setDuration] = useState(10); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedSound, setSelectedSound] = useState('silence');
  const [intervalBells, setIntervalBells] = useState(false);
  const [bellInterval, setBellInterval] = useState(5); // minutes
  const [sessionComplete, setSessionComplete] = useState(false);
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const bellAudioRef = useRef(null);
  const lastBellRef = useRef(0);

  const ambientSounds = [
    { id: 'silence', name: 'Silence', icon: '🔇', url: null },
    { id: 'rain', name: 'Rain', icon: '🌧️', url: '/sounds/rain.mp3' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊', url: '/sounds/ocean.mp3' },
    { id: 'forest', name: 'Forest', icon: '🌲', url: '/sounds/forest.mp3' },
    { id: 'river', name: 'River', icon: '💧', url: '/sounds/river.mp3' },
    { id: 'wind', name: 'Wind Chimes', icon: '🎐', url: '/sounds/windchimes.mp3' }
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
            if (minutesElapsed > 0 && minutesElapsed % bellInterval === 0 && 
                Math.floor(minutesElapsed) !== lastBellRef.current) {
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
  };

  const startSession = () => {
    setIsRunning(true);
    setIsPaused(false);
    setSessionComplete(false);
    setTimeLeft(duration * 60);
    lastBellRef.current = 0;
    
    // Play ambient sound
    if (selectedSound !== 'silence' && audioRef.current) {
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
    if (selectedSound !== 'silence' && audioRef.current) {
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
    // In production, this would play an actual bell sound
    // For now, we'll use the browser's beep or TTS
    try {
      const bell = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGnODuuWYdBjeP1vLNeiwGJHXE8N+SQwoUXLPp6qhVFApFnODuuWYdBjeP1vLMeiwGJHXE8N+SQwoQW7Hnsq1rBwgST5jatW4fBjeP1u3LeSsGI373KJBPRU');
      bell.play().catch(() => {});
    } catch (e) {
      // Fallback: use system beep via TTS
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance('');
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="meditation-timer">
      <div className="meditation-timer-header">
        <h2>Meditation Timer</h2>
        <p>Find your center with guided silent meditation</p>
      </div>

      {!isRunning && !sessionComplete && (
        <>
          {/* Duration Selection */}
          <div className="timer-config-section">
            <h3>Duration</h3>
            <div className="duration-buttons">
              {durations.map((d) => (
                <button
                  key={d}
                  className={`duration-btn ${duration === d ? 'active' : ''}`}
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

          {/* Ambient Sound Selection */}
          <div className="timer-config-section">
            <h3>Ambient Sound</h3>
            <div className="sound-buttons">
              {ambientSounds.map((sound) => (
                <button
                  key={sound.id}
                  className={`sound-btn ${selectedSound === sound.id ? 'active' : ''}`}
                  onClick={() => setSelectedSound(sound.id)}
                  title={sound.name}
                >
                  <span className="sound-icon">{sound.icon}</span>
                  <span className="sound-name">{sound.name}</span>
                </button>
              ))}
            </div>
            <p className="sound-note">
              🔊 Note: For full ambient sound experience, download our mobile app or upgrade to Premium
            </p>
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
      <div className={`timer-display ${isRunning ? 'running' : ''} ${sessionComplete ? 'complete' : ''}`}>
        <svg className="timer-circle" viewBox="0 0 200 200">
          <circle className="timer-circle-bg" cx="100" cy="100" r="90" />
          <circle
            className="timer-circle-progress"
            cx="100"
            cy="100"
            r="90"
            style={{
              strokeDasharray: `${565.48}`,
              strokeDashoffset: `${565.48 - (565.48 * progress) / 100}`
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
                <div className="status-text">{isPaused ? 'Paused' : 'Meditating...'}</div>
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
          <button onClick={() => {
            setSessionComplete(false);
            setTimeLeft(duration * 60);
          }} className="timer-btn btn-new">
            New Session
          </button>
        )}
      </div>

      {/* Session Complete Message */}
      {sessionComplete && (
        <div className="completion-message">
          <h3>Well done! 🎉</h3>
          <p>You completed {duration} minutes of meditation.</p>
          <div className="upgrade-prompt">
            <p><strong>Want to track your progress?</strong></p>
            <p>Sign up for a free account to track meditation streaks, analyze patterns, and unlock premium features!</p>
            <button className="upgrade-btn">Create Free Account</button>
          </div>
        </div>
      )}

      {/* Audio elements (hidden) */}
      {selectedSound !== 'silence' && (
        <audio
          ref={audioRef}
          loop
          preload="auto"
          src={ambientSounds.find(s => s.id === selectedSound)?.url}
        />
      )}

      {/* Tips Section */}
      {!isRunning && !sessionComplete && (
        <div className="meditation-tips">
          <h3>Meditation Tips</h3>
          <ul>
            <li>Find a quiet, comfortable place to sit</li>
            <li>Keep your spine straight but relaxed</li>
            <li>Focus on your breath - notice the inhale and exhale</li>
            <li>When your mind wanders, gently bring it back to your breath</li>
            <li>There's no "wrong" way to meditate - just begin</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MeditationTimer;
