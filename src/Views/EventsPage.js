import React from 'react';
import './Page.css';
// Header is provided by Layout

const EventsPage = () => (
  <div className="page">
    <main className="container">
      <div className="page-hero">
        <h1>Events & Meetings</h1>
        <p>Find today’s NA/AA, yoga, and acuwellness sessions — nearby and online.</p>
      </div>
      <section className="two-col section">
        <div>
          <h2>Today</h2>
          <p>We’ll soon list meetings and wellness events based on your interests and location.</p>
        </div>
        <div>
          <h2>Reminders</h2>
          <p>Opt-in reminders so you never miss the gatherings that keep you grounded.</p>
        </div>
      </section>
    </main>
  </div>
);

export default EventsPage;
