import React from 'react';
import './Header.css';
import founderImage from '../assets/images/wellnesscafe-bowl-v2.png'; // Replace with your actual image path

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-text">
        <h1 className="header-line line1">
          Holding <span className="highlight">Company.</span>
        </h1>
        <h1 className="header-line line2">
          AI SaaS <span className="highlight">Investor.</span>
        </h1>
        <h1 className="header-line line3">
          Webcafe <span className="highlight">AI.</span>
        </h1>
      </div>
      <div className="header-image">
        <img src={founderImage} alt="WellnessCafe Founder" />
      </div>
    </header>
  );
};

export default Header;
