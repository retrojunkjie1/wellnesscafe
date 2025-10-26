import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">WellnessCafe</div>
      
      {/* Desktop Navigation */}
      <ul className="nav-links desktop-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/recovery">Recovery</Link></li>
        <li><Link to="/yoga">Yoga</Link></li>
        <li><Link to="/acuwellness">Acuwellness</Link></li>
        <li><Link to="/spiritual">Spiritual</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/assistance">Assistance</Link></li>
      </ul>

      {/* Mobile Hamburger Menu */}
      <div className="mobile-nav">
        <button className="hamburger-btn" onClick={toggleMenu}>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
        
        {/* Mobile Dropdown Menu */}
        <div className={`mobile-dropdown ${isMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-nav-links">
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/recovery" onClick={closeMenu}>Recovery</Link></li>
            <li><Link to="/yoga" onClick={closeMenu}>Yoga</Link></li>
            <li><Link to="/acuwellness" onClick={closeMenu}>Acuwellness</Link></li>
            <li><Link to="/spiritual" onClick={closeMenu}>Spiritual</Link></li>
            <li><Link to="/events" onClick={closeMenu}>Events</Link></li>
            <li><Link to="/assistance" onClick={closeMenu}>Assistance</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;