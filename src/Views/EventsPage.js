import React from 'react';
import './EventsPage.css';

const EventsPage = () => {
  return (
    <section className="events-page">
      <div className="events-header">
        <h1>Events & Meetings</h1>
        <p>
          Find today's NA/AA, yoga, and acuwellness sessions — nearby and online.
        </p>
      </div>

      <div className="events-grid">
        <div className="event-card">
          <img src="/images/naaa.jpg" alt="Recovery group" />
          <div className="event-content">
            <h3>Today</h3>
            <p>We'll soon list meetings and wellness events based on your interests and location.</p>
          </div>
        </div>

        <div className="event-card">
          <img src="/images/reminder.jpg" alt="Reminders" />
          <div className="event-content">
            <h3>Reminders</h3>
            <p>Opt-in reminders so you never miss the gatherings that keep you grounded.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsPage;
