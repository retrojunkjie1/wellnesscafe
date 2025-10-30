import React from "react";
import "./Page.css";
import Header from "../components/Header";
import PanoramicHero from "../components/PanoramicHero";

const EventsPage = () => (
  <div className="page events-page">
    <Header />
    <main className="container">
      <PanoramicHero />
      <div className="page-hero">
        <h1>Events & Meetings</h1>
        <p>
          Find today's NA/AA, yoga, and acuwellness sessions — nearby and
          online.
        </p>
      </div>
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

export default EventsPage;
