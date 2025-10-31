import React from 'react';
import './Page.css';
import PanoramicHero from '../components/PanoramicHero';
import Header from '../components/Header';
import GlassSection from '../components/GlassSection';

const AssistPage = () => {
  const assistanceItems = [
    {
      key: 'government-aid',
      icon: '🏛️',
      title: 'Government Aid',
      desc: 'Connect with Colorado behavioral health programs.'
    },
    {
      key: 'funding-grants',
      icon: '💰',
      title: 'Funding & Grants',
      desc: 'Financial support for providers and clients.'
    },
    {
      key: 'policies-laws',
      icon: '📜',
      title: 'Policies & Laws',
      desc: 'Stay updated with ASAM 4th Edition standards.'
    },
    {
      key: 'crisis-resources',
      icon: '📞',
      title: 'Crisis Resources',
      desc: 'Find 988 and local crisis support hotlines.'
    }
  ];

  return (
    <div className="page">
      <Header />
      <main className="container">
        <PanoramicHero />
        <GlassSection
          title="Assistance & Resources"
          subtitle="Discover funding, policy updates, and verified state wellness programs."
          items={assistanceItems}
        />
        <section className="two-col section">
          <div>
            <h2>Getting Started</h2>
            <p>We'll help you find programs you may qualify for and organize the paperwork.</p>
          </div>
          <div>
            <h2>Local Guides</h2>
            <p>Community-sourced notes on what works and whom to contact.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AssistPage;
