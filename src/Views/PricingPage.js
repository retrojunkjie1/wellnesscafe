import React from 'react';
import './Page.css';
import Header from '../components/Header';

const PricingPage = () => (
  <div className="page">
    <Header />
    <main className="container">
      <div className="page-hero">
        <h1>Pricing</h1>
        <p>Start free and upgrade when you’re ready. Every plan includes privacy-first check-ins and core rituals.</p>
      </div>
      <section className="pricing section">
        <div className="plan">
          <h3>Free</h3>
          <div className="price">$0</div>
          <ul>
            <li>Daily rituals & 2‑min check‑ins</li>
            <li>Basic insights</li>
            <li>Community access</li>
          </ul>
          <a className="ghost-btn cta" href="/signup">Get started</a>
        </div>
        <div className="plan">
          <h3>Plus</h3>
          <div className="price">$9/mo</div>
          <ul>
            <li>Deeper insights</li>
            <li>Weekly progress reviews</li>
            <li>Priority events</li>
            <li>Custom reminders</li>
          </ul>
          <a className="wellcafe-button cta" href="/signup">Try Plus</a>
        </div>
        <div className="plan">
          <h3>Pro</h3>
          <div className="price">$19/mo</div>
          <ul>
            <li>All Plus features</li>
            <li>Advanced analytics</li>
            <li>Priority support</li>
          </ul>
          <a className="wellcafe-button cta" href="/signup">Go Pro</a>
        </div>
      </section>
      <section className="section">
        <h2>Team & Clinics</h2>
        <p>Contact us for organization pricing with admin dashboards and anonymized trends.</p>
      </section>
    </main>
  </div>
);

export default PricingPage;
