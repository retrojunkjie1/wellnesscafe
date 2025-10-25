import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className="header">
    <div className="logo">WellnessCafe</div>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/product">Product</Link>
      <Link to="/tools">Tools</Link>
      <Link to="/events">Events</Link>
      <Link to="/spiritual">Spiritual</Link>
      <Link to="/blog">Blog</Link>
    </nav>
  </header>
);

export default Header;
