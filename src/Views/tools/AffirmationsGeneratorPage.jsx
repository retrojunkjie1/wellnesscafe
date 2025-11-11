import React from 'react';
import { Link } from 'react-router-dom';
import AffirmationsGenerator from '../../features/recovery/tools/AffirmationsGenerator';
import './ToolPage.css';

const AffirmationsGeneratorPage = () => {
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
          <h1>Daily Affirmations</h1>
          <p className="tool-description">
            Generate powerful affirmations across five categories designed to support your recovery, 
            build confidence, and cultivate inner peace. Save favorites and share inspiration with others.
          </p>
          
          <div className="tool-stats">
            <div className="stat-item">
              <span className="stat-value">100+</span>
              <span className="stat-label">Affirmations Library</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">5</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">∞</span>
              <span className="stat-label">Daily Inspiration</span>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">💪</span>
              <h3>Recovery Support</h3>
              <p>Affirmations specifically crafted for recovery journeys</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✨</span>
              <h3>5 Categories</h3>
              <p>Recovery, Confidence, Peace, Gratitude, Strength</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🎨</span>
              <h3>Beautiful Cards</h3>
              <p>Share affirmations as gorgeous visual cards</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">❤️</span>
              <h3>Save Favorites</h3>
              <p>Build your personal collection (5 free, unlimited premium)</p>
            </div>
          </div>
        </div>

        <div className="tool-component-wrapper">
          <AffirmationsGenerator />
        </div>

        <div className="tool-footer-cta">
          <h2>Transform Your Mindset with Affirmations</h2>
          <p>
            Affirmations are more than just positive thinking—they're a scientifically-supported 
            tool for rewiring neural pathways and building resilience. Regular practice can reduce 
            stress, increase self-esteem, and support lasting behavioral change.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-btn primary">
              Create Free Account
            </Link>
            <Link to="/tools" className="cta-btn secondary">
              Explore More Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffirmationsGeneratorPage;
