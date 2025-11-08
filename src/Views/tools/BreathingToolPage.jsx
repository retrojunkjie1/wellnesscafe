import React from 'react';
import { Link } from 'react-router-dom';
import BreathingTool from '../../features/recovery/tools/BreathingTool';
import './ToolPage.css';

const BreathingToolPage = () => {
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
          <h1>Mindful Breathing</h1>
          <p className="tool-description">
            Practice evidence-based breathing techniques to reduce stress, improve focus, 
            and regulate your nervous system. Voice-guided sessions with real-time mood tracking.
          </p>
          
          <div className="tool-stats">
            <div className="stat-item">
              <span className="stat-value">8,400+</span>
              <span className="stat-label">Sessions Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">78%</span>
              <span className="stat-label">Report Reduced Stress</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">4.8/5</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">🧠</span>
              <h3>Science-Backed</h3>
              <p>Based on research in neuroscience and mindfulness</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">😌</span>
              <h3>Stress Relief</h3>
              <p>Activates parasympathetic nervous system</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🎯</span>
              <h3>Better Focus</h3>
              <p>Improves concentration and mental clarity</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💤</span>
              <h3>Sleep Aid</h3>
              <p>Prepares mind and body for restful sleep</p>
            </div>
          </div>
        </div>

        {/* The actual breathing tool */}
        <div className="tool-container">
          <BreathingTool />
        </div>

        {/* Educational content */}
        <div className="tool-education">
          <h2>How Breathing Techniques Work</h2>
          <div className="education-content">
            <p>
              Controlled breathing is one of the most accessible and powerful tools for 
              self-regulation. By consciously changing your breathing pattern, you directly 
              influence your autonomic nervous system.
            </p>
            
            <h3>The Science</h3>
            <ul>
              <li><strong>4-7-8 Breathing:</strong> Slows heart rate, perfect for sleep preparation</li>
              <li><strong>Box Breathing:</strong> Used by Navy SEALs for stress management</li>
              <li><strong>Extended Exhale:</strong> Activates vagus nerve, calming anxiety</li>
              <li><strong>Coherent Breathing:</strong> Balances nervous system at 5-6 breaths/min</li>
            </ul>

            <h3>When to Use</h3>
            <div className="usage-scenarios">
              <div className="scenario">
                <strong>🌙 Before Bed:</strong> 4-7-8 pattern for 5-10 minutes
              </div>
              <div className="scenario">
                <strong>😰 During Anxiety:</strong> Extended exhale (4-4-6) for immediate relief
              </div>
              <div className="scenario">
                <strong>🎯 Before Performance:</strong> Box breathing (4-4-4-4) for focus
              </div>
              <div className="scenario">
                <strong>🧘 Daily Practice:</strong> Coherent breathing (5-5) for 10-20 minutes
              </div>
            </div>
          </div>
        </div>

        {/* Related tools */}
        <div className="related-tools">
          <h2>Other Wellness Tools</h2>
          <div className="tools-grid">
            <Link to="/tools/meditation" className="tool-card">
              <span className="tool-icon">🧘</span>
              <h3>Meditation Timer</h3>
              <p>Guided silent meditation with ambient sounds</p>
              <span className="badge">FREE</span>
            </Link>
            <Link to="/tools" className="tool-card">
              <span className="tool-icon">😊</span>
              <h3>Mood Check-In</h3>
              <p>Track your daily emotional state</p>
              <span className="badge">Coming Soon</span>
            </Link>
            <Link to="/tools" className="tool-card">
              <span className="tool-icon">💪</span>
              <h3>Affirmations</h3>
              <p>Daily positive affirmations generator</p>
              <span className="badge">Coming Soon</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingToolPage;
