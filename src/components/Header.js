// src/components/Header.js
import React from 'react';
import './Header.css';
import wellnessCafeBowl from '../assets/images/wellnesscafe-bowl-v1.png';
import wellnessCafelogo from '../assets/images/logo512.png';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={wellnessCafelogo} alt="WellnessCafe logo" className="navbar-logo" />
          <span className="brand-name">WellnessCafe</span>
        </div>

        <ul className="navbar-links">
          <li><a href="#product">Product</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#company">Company</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#changelog">Changelog</a></li>
        </ul>

        <div className="navbar-actions">
          <button className="login-btn">Login</button>
          <button className="trial-btn">Start free trial</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="announcement">✨ New: AI Wellness Integration Just Landed</div>
        <h1 className="hero-title">Think Better with WellnessCafe</h1>
        <p className="hero-subtitle">Never miss a moment of calm, balance, or connection.</p>
        <div className="hero-image">
          <img src={wellnessCafeBowl} alt="WellnessCafe glowing bowl" />
        </div>
      </section>
    </header>
  );
};

export default Header;
