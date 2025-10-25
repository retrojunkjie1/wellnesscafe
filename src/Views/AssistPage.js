import React from 'react';
import './Page.css';
import Header from '../components/Header';

const AssistPage = () => (
  <div className="page">
    <Header />
    <main className="container">
      <div className="page-hero">
        <h1>Government Assistance</h1>
        <p>Curated links to benefits, housing, food, and healthcare resources near you.</p>
      </div>
      <section className="two-col section">
        <div>
          <h2>Getting Started</h2>
          <p>We’ll help you find programs you may qualify for and organize the paperwork.</p>
        </div>
        <div>
          <h2>Local Guides</h2>
          <p>Community-sourced notes on what works and whom to contact.</p>
        </div>
      </section>
    </main>
  </div>
);

export default AssistPage;
