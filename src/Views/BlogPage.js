import React from 'react';
import './BlogPage.css';

const BlogPage = () => {
  return (
    <section className="blog-page">
      <div className="blog-header">
        <h1>Blog</h1>
        <p>
          Stories and studies on balance, community, and healing. New posts weekly.
        </p>
        <div className="blog-bowl-container">
          <img src={require('../assets/images/wellnesscafe-bowl-v2.png')} alt="" className="blog-bowl-image" />
        </div>
      </div>

      <div className="blog-grid">
        <div className="blog-card">
          <img src="/images/rituals.jpg" alt="Tiny Rituals" />
          <div className="blog-content">
            <h3>5 Tiny Rituals for Busy Days</h3>
            <p>Short practices that soothe your nervous system in under two minutes.</p>
          </div>
        </div>

        <div className="blog-card">
          <img src="/images/community.jpg" alt="Community Building" />
          <div className="blog-content">
            <h3>How Community Builds Resilience</h3>
            <p>Why showing up together matters — even when it's just a quick check-in.</p>
          </div>
        </div>

        <div className="blog-card">
          <img src="/images/checkin.jpg" alt="Design for Calm" />
          <div className="blog-content">
            <h3>Designing for Calm</h3>
            <p>Principles we use to make interfaces that don't overwhelm.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPage;