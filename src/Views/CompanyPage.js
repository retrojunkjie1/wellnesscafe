import React from 'react';
import './Page.css';
import Header from '../components/Header';

const CompanyPage = () => (
  <div className="page">
    <Header />
    <main className="container">
      <div className="page-hero">
        <h1>Company</h1>
        <p>We’re building gentle, accessible wellness for everyone — with care, science, and community.</p>
      </div>
      <section className="card-grid section">
        <div className="p-card">
          <h3>Our Mission</h3>
          <p>Help people feel better a little each day through tiny rituals, supportive nudges, and community.</p>
        </div>
        <div className="p-card">
          <h3>Principles</h3>
          <p>Privacy-first, evidence-informed, inclusive by design. You own your journey and your data.</p>
        </div>
        <div className="p-card">
          <h3>Impact</h3>
          <p>We measure calm, consistency, and connection — not just clicks and time spent.</p>
        </div>
      </section>
    </main>
  </div>
);

export default CompanyPage;
