import React from 'react';
import './Page.css';
import Header from '../components/Header';

const AboutPage = () => (
  <div className="page">
    <Header />
    <main className="container">
      <div className="page-hero">
        <h1>About WellnessCafe</h1>
        <p>A small team with a big heart — building tools that feel like a friend.</p>
        <div className="about-bowl-container">
          <img src={require('../assets/images/wellnesscafe-bowl-v2.png')} alt="" className="about-bowl-image" />
        </div>
      </div>
      <section className="card-grid section">
        <div className="p-card">
          <h3>Why we started</h3>
          <p>We’ve walked the path and know the power of tiny, consistent steps and community support.</p>
        </div>
        <div className="p-card">
          <h3>Our approach</h3>
          <p>Tiny rituals, gentle AI, and community. No overwhelm — just practical care that fits your day.</p>
        </div>
        <div className="p-card">
          <h3>What matters</h3>
          <p>Calm, consistency, connection. Your agency and privacy come first.</p>
        </div>
      </section>
      <div className="cta-banner">
        Have a story or idea to share? We’re listening.
        <a className="btn" href="/contact">Say hello</a>
      </div>
    </main>
  </div>
);

export default AboutPage;
