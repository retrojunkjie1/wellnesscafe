import React from 'react';
import './Page.css';
import Header from '../components/Header';

const SpiritualPage = () => (
  <div className="page">
    <Header />
    <main className="container">
      <div className="page-hero">
        <h1>Spiritual Counseling</h1>
        <p>Group circles and 1:1 guidance — gentle space to reconnect with meaning and self.</p>
      </div>
      <section className="section">
        <h2>Circles</h2>
        <p>Weekly circles with facilitators trained in mindful, nonjudgmental support.</p>
      </section>
      <section className="section">
        <h2>1:1 Sessions</h2>
        <p>Private sessions tailored to your traditions and preferences.</p>
      </section>
    </main>
  </div>
);

export default SpiritualPage;
