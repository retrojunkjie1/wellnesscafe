import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">WellnessCafe</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/recovery">Recovery</Link></li>
        <li><Link to="/yoga">Yoga</Link></li>
        <li><Link to="/acuwellness">Acuwellness</Link></li>
        <li><Link to="/spiritual">Spiritual</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/assistance">Assistance</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;