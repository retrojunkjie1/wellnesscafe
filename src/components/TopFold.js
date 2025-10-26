import React from 'react';
import {useNavigate} from 'react-router-dom';
import './TopFold.css';

const TopFold=()=>{
  const navigate=useNavigate();

  return(
    <section className="topfold-container">
      <nav className="topfold-navbar">
        <div className="nav-logo">WELLNESSCAFE</div>
        <ul className="nav-links">
          <li onClick={()=>navigate('/')}>Home</li>
          <li onClick={()=>navigate('/product')}>Product</li>
          <li onClick={()=>navigate('/tools')}>Tools</li>
          <li onClick={()=>navigate('/events')}>Events</li>
          <li onClick={()=>navigate('/spiritual')}>Spiritual</li>
          <li onClick={()=>navigate('/blog')}>Blog</li>
        </ul>
        <div className="nav-buttons">
          <button className="nav-btn sign-in" onClick={()=>navigate('/signin')}>Sign In</button>
          <button className="nav-btn download" onClick={()=>navigate('/product')}>Explore</button>
        </div>
      </nav>

      <div className="topfold-content">
        <h1 className="topfold-title">
          WellnessCafe — <span className="highlight">Clarity. Balance. Precision.</span>
        </h1>
        <p className="topfold-sub">
          Discover calm intelligence through design, ritual, and mindful innovation.
        </p>
        <button className="topfold-btn" onClick={()=>navigate('/product')}>
          Explore Product
        </button>
      </div>
    </section>
  );
};

export default TopFold;
