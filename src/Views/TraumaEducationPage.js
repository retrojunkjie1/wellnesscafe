import React from 'react';
import './Page.css';
import Header from '../components/Header';

const resources = [
  {
    title: 'Video: Understanding Trauma (YouTube)',
    url: 'https://youtu.be/U1phkNFsPZs?si=ZirV8IoMsHfcG1J0',
    type: 'Video'
  },
  {
    title: 'VA PTSD: Continuing Education',
    url: 'https://www.ptsd.va.gov/professional/continuing_ed/index.asp',
    type: 'Guide'
  },
  {
    title: 'Video: Trauma & Nervous System (YouTube)',
    url: 'https://youtu.be/hEZKA_Z_L9M?si=7i6J4ne8IfTA7p7A',
    type: 'Video'
  },
  {
    title: 'Video: Healing Practices (YouTube)',
    url: 'https://youtu.be/5IqBQO2h2to?si=hzWh0Pl-fvTK6LT1',
    type: 'Video'
  }
];

const TraumaEducationPage = () => (
  <div className="page">
    <Header />
    <main className="container">
      <div className="page-hero">
        <h1>Trauma Education</h1>
        <p>Curated videos and guides on trauma, the nervous system, and supportive practices.</p>
      </div>

      <section className="card-grid section">
        {resources.map((r, idx) => (
          <div className="p-card" key={idx}>
            <h3>{r.title}</h3>
            <p>{r.type}</p>
            <a className="ghost-btn" href={r.url} target="_blank" rel="noreferrer">Open</a>
          </div>
        ))}
      </section>

      <div className="cta-banner">
        Have a trusted resource to add? Contact us and we’ll review it for the list.
        <a className="btn" href="/contact">Suggest a resource</a>
      </div>
    </main>
  </div>
);

export default TraumaEducationPage;
