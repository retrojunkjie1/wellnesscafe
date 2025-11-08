import React from 'react';
import { Link } from 'react-router-dom';
import MeditationTimer from '../../features/recovery/tools/MeditationTimer';
import './ToolPage.css';

const MeditationTimerPage = () => {
  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <Link to="/tools" className="back-link">
          ← Back to Tools
        </Link>
        <div className="tool-badge free-badge">FREE</div>
      </div>

      <div className="tool-page-content">
        <div className="tool-intro">
          <h1>Meditation Timer</h1>
          <p className="tool-description">
            Silent meditation with customizable durations, ambient sounds, and interval bells. 
            Build a consistent practice with our beautiful, distraction-free timer.
          </p>
          
          <div className="tool-stats">
            <div className="stat-item">
              <span className="stat-value">5,200+</span>
              <span className="stat-label">Sessions Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">12 min</span>
              <span className="stat-label">Average Duration</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">4.9/5</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">🧘</span>
              <h3>Mindfulness</h3>
              <p>Develop present-moment awareness</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🎵</span>
              <h3>Ambient Sounds</h3>
              <p>Choose from rain, ocean, forest, and more</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🔔</span>
              <h3>Interval Bells</h3>
              <p>Stay focused with customizable reminders</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📊</span>
              <h3>Track Progress</h3>
              <p>Build streaks and see your growth (Premium)</p>
            </div>
          </div>
        </div>

        {/* The actual meditation timer */}
        <div className="tool-container">
          <MeditationTimer />
        </div>

        {/* Educational content */}
        <div className="tool-education">
          <h2>Meditation Benefits & Best Practices</h2>
          <div className="education-content">
            <p>
              Regular meditation practice has been shown to reduce stress, improve focus, 
              enhance emotional regulation, and even change brain structure over time.
            </p>
            
            <h3>Getting Started</h3>
            <ul>
              <li><strong>Start Small:</strong> Begin with 5-10 minutes daily</li>
              <li><strong>Be Consistent:</strong> Same time each day builds habit</li>
              <li><strong>Posture:</strong> Sit comfortably, spine straight but relaxed</li>
              <li><strong>Focus Point:</strong> Breath, body sensations, or sound</li>
              <li><strong>Gentle Mind:</strong> When thoughts arise, gently return to focus</li>
            </ul>

            <h3>Types of Meditation</h3>
            <div className="usage-scenarios">
              <div className="scenario">
                <strong>🎯 Focused Attention:</strong> Concentrate on breath or mantra
              </div>
              <div className="scenario">
                <strong>🌊 Open Monitoring:</strong> Observe thoughts without judgment
              </div>
              <div className="scenario">
                <strong>💝 Loving-Kindness:</strong> Cultivate compassion for self and others
              </div>
              <div className="scenario">
                <strong>🔍 Body Scan:</strong> Progressive relaxation through body awareness
              </div>
            </div>

            <h3>Research-Backed Benefits</h3>
            <ul>
              <li>Reduces cortisol (stress hormone) levels</li>
              <li>Increases gray matter density in brain regions associated with learning and memory</li>
              <li>Improves emotional regulation and resilience</li>
              <li>Enhances attention span and cognitive flexibility</li>
              <li>May help with anxiety, depression, and chronic pain</li>
            </ul>
          </div>
        </div>

        {/* Upgrade prompt */}
        <div className="upgrade-section">
          <h2>Track Your Meditation Journey</h2>
          <p>Upgrade to Premium to unlock:</p>
          <ul className="premium-features">
            <li>✓ Meditation streak tracking</li>
            <li>✓ Weekly and monthly statistics</li>
            <li>✓ Personalized insights and recommendations</li>
            <li>✓ Exclusive guided meditations</li>
            <li>✓ Premium ambient soundscapes</li>
            <li>✓ Group meditation sessions</li>
          </ul>
          <button className="upgrade-btn">Upgrade to Premium</button>
        </div>

        {/* Related tools */}
        <div className="related-tools">
          <h2>Other Wellness Tools</h2>
          <div className="tools-grid">
            <Link to="/tools/breathing" className="tool-card">
              <span className="tool-icon">🌬️</span>
              <h3>Mindful Breathing</h3>
              <p>Voice-guided breathing exercises</p>
              <span className="badge">FREE</span>
            </Link>
            <Link to="/tools" className="tool-card">
              <span className="tool-icon">😊</span>
              <h3>Mood Check-In</h3>
              <p>Track your daily emotional state</p>
              <span className="badge">Coming Soon</span>
            </Link>
            <Link to="/tools" className="tool-card">
              <span className="tool-icon">📊</span>
              <h3>Stress Assessment</h3>
              <p>Evidence-based stress evaluation</p>
              <span className="badge">Coming Soon</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationTimerPage;
