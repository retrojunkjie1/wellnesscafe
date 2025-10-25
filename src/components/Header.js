// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
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
          <li><Link to="/product">Product</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/company">Company</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/changelog">Changelog</Link></li>
        </ul>

        <div className="navbar-actions">
          <Link className="login-btn" to="/login">Login</Link>
          <Link className="trial-btn" to="/signup">Start free trial</Link>
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
