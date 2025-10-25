import React from 'react';
import './ProductPage.css';

const ProductPage = () => {
  return (
    <section className="product-page">
      <div className="product-intro">
        <h1>Product</h1>
        <p>
          WellnessCafe blends routines, reflections, and gentle AI nudges to help you
          stay balanced every day.
        </p>
        <div className="product-bowl-container">
          <img src={require('../assets/images/wellnesscafe-bowl-v2.png')} alt="" className="product-bowl-image" />
        </div>
      </div>

      <div className="product-grid">
        <div className="product-card">
          <img src="/images/rituals.jpg" alt="Daily Rituals" />
          <h3>Daily Rituals</h3>
          <p>Guided breaths, micro-meditations, and gentle intentions. Simple, effective, yours.</p>
        </div>
        <div className="product-card">
          <img src="/images/checkin.jpg" alt="Smart Check-ins" />
          <h3>Smart Check-ins</h3>
          <p>Two-minute check-ins detect red flags early and offer supportive next steps.</p>
        </div>
        <div className="product-card">
          <img src="/images/community.jpg" alt="Community" />
          <h3>Community</h3>
          <p>Surface NA/AA and live wellness sessions with reminders tailored to you.</p>
        </div>
      </div>

      <div className="product-stats">
        <div><h2>2m</h2><p>Avg. check-in</p></div>
        <div><h2>+38%</h2><p>Goal adherence</p></div>
        <div><h2>95%</h2><p>Feel calmer</p></div>
      </div>
    </section>
  );
};

export default ProductPage;
