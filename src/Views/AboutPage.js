import React from 'react';
import './Page.css';
import Header from '../components/Header';

const AboutPage = () => (
  <div className="page">
    <Header />
    <main className="container">
      <div className="page-hero">
        <h1>About WellnessCafe</h1>
        <p>A small team with a big heart — building tools that feel like a friend.</p>
      </div>
      <section className="section">
        <h2>Why we started</h2>
        <p>We’ve walked the path and know the power of tiny, consistent steps and community support.</p>
      </section>
    </main>
  </div>
);

export default AboutPage;
