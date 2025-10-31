import React from "react";
import "./Page.css";
import Header from "../components/Header";
import PanoramicHero from "../components/PanoramicHero";
import GlassSection from "../components/GlassSection";

const EventsPage = () => {
  const eventTypes = [
    {
      key: 'na-aa-meetings',
      icon: '🤝',
      title: 'NA/AA Meetings',
      desc: 'Find recovery meetings nearby and online.'
    },
    {
      key: 'yoga-sessions',
      icon: '🧘',
      title: 'Yoga & Meditation',
      desc: 'Join mindful movement and breathing classes.'
    },
    {
      key: 'acuwellness',
      icon: '🌿',
      title: 'AcuWellness Sessions',
      desc: 'Experience Eastern energy alignment practices.'
    },
    {
      key: 'community-events',
      icon: '🎉',
      title: 'Community Gatherings',
      desc: 'Connect at local wellness and social events.'
    }
  ];

  return (
    <div className="page events-page">
      <Header />
      <main className="container">
        <PanoramicHero />
        <GlassSection
          title="Events & Meetings"
          subtitle="Find today's NA/AA, yoga, and acuwellness sessions — nearby and online."
          items={eventTypes}
        />
        <section className="two-col section">
          <div>
            <h2>Today</h2>
            <p>
              We'll soon list meetings and wellness events based on your interests
              and location.
            </p>
          </div>
          <div>
            <h2>Reminders</h2>
            <p>
              Opt-in reminders so you never miss the gatherings that keep you
              grounded.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EventsPage;
