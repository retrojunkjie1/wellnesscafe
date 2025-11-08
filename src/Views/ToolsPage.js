import React from "react";
import "./Page.css";
// Header is provided by Layout
import { Link } from "react-router-dom";
import PanoramicHero from "../components/PanoramicHero";
import BreathingTool from "../features/recovery/tools/BreathingTool";

const ToolsPage = () => (
  <div className="page">
    <main className="container">
      <PanoramicHero />
      <div className="page-hero">
        <h1>Recovery Tools</h1>
        <p>
          Trigger tracker, cravings log, intentions, breath timer — simple tools
          to support your day.
        </p>
      </div>

      {/* Breathing Tool Section */}
      <section className="section" style={{maxWidth: '800px', margin: '0 auto'}}>
        <BreathingTool defaultInhale={4} defaultHold={4} defaultExhale={6} defaultCycles={6} />
      </section>

      <section className="two-col section">
        <div>
          <h2>Tracker</h2>
          <p>
            Log triggers and patterns to learn what helps most. Private by
            default.
          </p>
        </div>
        <div>
          <h2>Cravings</h2>
          <p>
            Quick guided flows for urges: breathe, distract, connect, reflect.
          </p>
        </div>
      </section>
      <section className="card-grid section">
        <Link className="p-card link" to="/trauma-education">
          <h3>Trauma Education</h3>
          <p>
            Curated videos and guides on trauma, the nervous system, and
            supportive practices.
          </p>
          <span className="ghost-btn">Explore</span>
        </Link>
      </section>
    </main>
  </div>
);

export default ToolsPage;
