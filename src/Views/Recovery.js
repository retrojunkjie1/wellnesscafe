import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './RecoveryPage.css';

// Placeholder for icons - replace with actual icons from a library like react-icons
const FaIcon = ({ name, className }) => <i className={`fa ${name} ${className}`}></i>;

const RecoveryPage = () => {
  const [activeTab, setActiveTab] = useState('understanding');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'understanding':
        return <UnderstandingAddiction />;
      case 'treatments':
        return <TreatmentOptions />;
      case 'coping':
        return <ToolsAndCoping />;
      case 'resources':
        return <SupportResources />;
      default:
        return <UnderstandingAddiction />;
    }
  };

  return (
    <div className="recovery-page">
      <Helmet>
        <title>Evidence-Based Addiction Recovery - Wellness Cafe</title>
        <meta
          name="description"
          content="A comprehensive, evidence-based guide to addiction recovery. Explore treatment options, coping strategies, and find support resources to start your journey."
        />
      </Helmet>

      {/* Hero Section */}
      <header className="recovery-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-title">
            <h1 className="title-main">Your Path to Recovery Starts Here</h1>
            <p className="title-sub">An Evidence-Based Guide to Overcoming Addiction</p>
          </div>
          <p className="hero-description">
            Navigating the journey of recovery can be challenging, but you are not alone. This guide provides comprehensive, research-backed information on understanding addiction, exploring effective treatments, and finding the support you need.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">40-60%</span>
              <span className="stat-label">Success Rate with Evidence-Based Care</span>
            </div>
            <div className="stat">
              <span className="stat-number">20M+</span>
              <span className="stat-label">Americans in Recovery</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support Available</span>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => document.getElementById('emergency-resources')?.scrollIntoView({ behavior: 'smooth' })}>
              Get Help Now
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Guide
            </button>
          </div>
        </div>
      </header>

      {/* Emergency Banner */}
      <div className="emergency-banner">
        <FaIcon name="fa-exclamation-triangle" className="emergency-icon" />
        <p>If you are in a crisis or life-threatening situation, call 911 immediately.</p>
      </div>

      {/* Sticky Tabs */}
      <nav className="tabs-container" id="tabs">
        <button className={`tab ${activeTab === 'understanding' ? 'active' : ''}`} onClick={() => setActiveTab('understanding')}>
          Understanding Addiction
        </button>
        <button className={`tab ${activeTab === 'treatments' ? 'active' : ''}`} onClick={() => setActiveTab('treatments')}>
          Treatment Options
        </button>
        <button className={`tab ${activeTab === 'coping' ? 'active' : ''}`} onClick={() => setActiveTab('coping')}>
          Tools & Coping
        </button>
        <button className={`tab ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
          Support Resources
        </button>
      </nav>

      {/* Tab Content */}
      <main>
        {renderContent()}
      </main>

      {/* CTA Section */}
      <section className="recovery-cta">
        <h2>Ready to Take the First Step?</h2>
        <p>Your journey to a healthier, substance-free life is unique. We're here to support you.</p>
        <div className="cta-buttons">
          <button className="btn-primary-large">Find a Treatment Center</button>
          <button className="btn-secondary-large">Talk to a Counselor</button>
        </div>
        <p className="cta-note">All communications are 100% confidential and secure.</p>
      </section>
    </div>
  );
};

const UnderstandingAddiction = () => (
  <section className="content-section" id="understanding">
    <div className="section-header">
      <h2>Understanding Addiction: A Brain Disease</h2>
      <p>Addiction is a treatable, chronic medical disease involving complex interactions among brain circuits, genetics, the environment, and an individual’s life experiences.</p>
    </div>
    {/* Placeholder for detailed content */}
  </section>
);

const TreatmentOptions = () => (
  <section className="content-section" id="treatments">
    <div className="section-header">
      <h2>Evidence-Based Treatment Options</h2>
      <p>Recovery is possible with the right support. Explore scientifically-proven treatment methods.</p>
    </div>
    {/* Placeholder for detailed content */}
  </section>
);

const ToolsAndCoping = () => (
  <section className="content-section" id="coping">
    <div className="section-header">
      <h2>Tools & Coping Strategies</h2>
      <p>Develop healthy habits and coping mechanisms to manage cravings and prevent relapse.</p>
    </div>
    {/* Placeholder for detailed content */}
  </section>
);

const SupportResources = () => (
  <section className="content-section" id="resources">
    <div className="section-header">
      <h2>Find Support and Resources</h2>
      <p>You are not alone. Connect with communities and services dedicated to helping you succeed.</p>
    </div>
    <div id="emergency-resources">
      {/* Placeholder for detailed content */}
    </div>
  </section>
);

export default RecoveryPage;
