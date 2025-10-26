import React from 'react';
import './HomePage.css';
import TopFold from '../components/TopFold';

const HomePage = () => {
  return (
    <div className="homepage">
      <TopFold />

      {/* === LUXURY FEATURES === */}
      <section className="features-grid">
        <div className="feature-card">
          <h3>Addiction Recovery</h3>
          <p>AI-assisted relapse prevention, progress tracking, and real-time emotional monitoring.</p>
        </div>

        <div className="feature-card">
          <h3>Yoga & Mindfulness</h3>
          <p>Guided movement, breathwork, and meditation to restore balance and self-awareness.</p>
        </div>

        <div className="feature-card">
          <h3>Acuwellness</h3>
          <p>Blending Eastern Medicine and modern therapy — your path to energetic harmony.</p>
        </div>

        <div className="feature-card">
          <h3>Spiritual Counseling</h3>
          <p>Private or group sessions exploring purpose, healing, and transformation.</p>
        </div>

        <div className="feature-card">
          <h3>Live Events</h3>
          <p>Community wellness workshops and retreats for body, mind, and connection.</p>
        </div>

        <div className="feature-card">
          <h3>Government Assistance</h3>
          <p>Find and connect with financial and recovery programs tailored to your region.</p>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="cta-section">
        <h2>Join the Movement</h2>
        <p>Experience a smarter, more mindful way to relax, recover, and reconnect.</p>
        <button className="cta-button">Explore WellnessCafe</button>
      </section>
    </div>
  );
};

export default HomePage;
