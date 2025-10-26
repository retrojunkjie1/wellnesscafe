import React from 'react';
import {useNavigate} from 'react-router-dom';
import './TopFold.css';

const TopFold=()=>{
  const navigate=useNavigate();
  return(
    <section className="topfold-container">
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
      <div className="topfold-gradient"></div>
    </section>
  );
};

export default TopFold;
