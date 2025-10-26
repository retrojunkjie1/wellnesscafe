import React from 'react';
import Header from '../components/Header';
import './PageTemplate.css';

const PageTemplate = ({ title, intro, features, ctaText }) => {
  return (
    <div className="page">
      <Header />

      {/* === HERO SECTION === */}
      <section className="page-hero">
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>

      {/* === FEATURES SECTION === */}
      <section className="page-features">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* === CTA SECTION === */}
      <section className="page-cta">
        <p>{ctaText}</p>
        <button className="cta-button">Explore More</button>
      </section>
    </div>
  );
};

export default PageTemplate;