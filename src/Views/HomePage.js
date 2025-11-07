import React from "react";
import { Helmet } from "react-helmet-async";
import "./HomePage.css";
import TopFold from "../components/TopFold";
import wellnessBowlV1 from "../assets/images/wellnesscafe-bowl-v1.png";
import wellnessJournal from "../assets/images/wellnesscafe-journal-vs1.png";
import wellnessProductV1 from "../assets/images/WellnessCafe-Product-v1.png";
import wellnessBowlV2 from "../assets/images/wellnesscafe-bowl-v2.png";
import { Link } from "react-router-dom";
import TopStories from "../components/TopStories";

const HomePage = () => {
  // date used in previous static tiles; no longer needed
  return (
    <>
      <Helmet>
        <title>WellnessCafe - AI-Powered Wellness & Recovery Platform</title>
        <meta name="description" content="Transform your wellness journey with AI-powered recovery support, mindfulness, acuwellness, and verified practitioner network. HIPAA compliant." />
        <meta name="keywords" content="wellness, recovery, addiction support, mindfulness, yoga, acupuncture, mental health" />
        <meta property="og:title" content="WellnessCafe - Wellness Platform" />
        <meta property="og:description" content="Your comprehensive wellness platform for recovery, mindfulness, and personal growth" />
        <meta property="og:image" content="%PUBLIC_URL%/logo512.png" />
        <meta property="og:url" content="https://wellnesscafe.net" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <div className="homepage">
      <TopFold />

      {/* === LUXURY FEATURES === */}
      <section className="features-grid">
        <Link to="/recovery" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-image">
              <img src={wellnessBowlV2} alt="Addiction Recovery" />
            </div>
            <h3>Addiction Recovery</h3>
            <p>
              AI-assisted relapse prevention, progress tracking, and real-time
              emotional monitoring.
            </p>
          </div>
        </Link>

        <Link to="/yoga" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-image">
              <img src={wellnessJournal} alt="Yoga & Mindfulness" />
            </div>
            <h3>Yoga & Mindfulness</h3>
            <p>
              Guided movement, breathwork, and meditation to restore balance and
              self-awareness.
            </p>
          </div>
        </Link>

        <Link to="/acuwellness" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-image">
              <img src={wellnessBowlV1} alt="Acuwellness" />
            </div>
            <h3>Acuwellness</h3>
            <p>
              Blending Eastern Medicine and modern therapy — your path to
              energetic harmony.
            </p>
          </div>
        </Link>

        <Link to="/spiritual" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-image">
              <img src={wellnessProductV1} alt="Spiritual Counseling" />
            </div>
            <h3>Spiritual Counseling</h3>
            <p>
              Private or group sessions exploring purpose, healing, and
              transformation.
            </p>
          </div>
        </Link>

        <Link to="/events" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-image">
              <img src="/logo192.png" alt="Live Events" />
            </div>
            <h3>Live Events</h3>
            <p>
              Community wellness workshops and retreats for body, mind, and
              connection.
            </p>
          </div>
        </Link>

        <Link to="/assistance" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-image">
              <img src="/logo512.png" alt="Government Assistance" />
            </div>
            <h3>Government Assistance</h3>
            <p>
              Find and connect with financial and recovery programs tailored to
              your region.
            </p>
          </div>
        </Link>
      </section>

      {/* === VIDEO SHOWCASE === */}
      <section className="video-showcase">
        <div className="video-container">
          <h2>Experience WellnessCafe</h2>
          <div className="video-wrapper">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="WellnessCafe Introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="video-description">
            Discover how WellnessCafe combines ancient wisdom with modern
            technology to support your wellness journey.
          </p>
        </div>
      </section>

      {/* === TOP STORIES (from curated news) === */}
      <TopStories limit={3} />

      {/* === IMAGE GALLERY === */}
      <section className="gallery-section">
        <h2>WellnessCafe Community</h2>
        <div className="gallery-grid">
          <figure className="gallery-card">
            <img src="/images/checkin.jpg" alt="Daily Check-in" />
            <figcaption>Daily Check-in</figcaption>
          </figure>
          <figure className="gallery-card">
            <img src="/images/community.jpg" alt="Community Support" />
            <figcaption>Community Support</figcaption>
          </figure>
          <figure className="gallery-card">
            <img src="/images/naaa.jpg" alt="Support Groups" />
            <figcaption>Support Groups</figcaption>
          </figure>
          <figure className="gallery-card">
            <img src="/images/reminder.jpg" alt="Wellness Reminders" />
            <figcaption>Wellness Reminders</figcaption>
          </figure>
          <figure className="gallery-card">
            <img src="/images/rituals.jpg" alt="Daily Rituals" />
            <figcaption>Daily Rituals</figcaption>
          </figure>
          <figure className="gallery-card">
            <img src={wellnessBowlV2} alt="Wellness Bowl" />
            <figcaption>Wellness Bowl</figcaption>
          </figure>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="cta-section">
        <h2>Join the Movement</h2>
        <p>
          Experience a smarter, more mindful way to relax, recover, and
          reconnect.
        </p>
        <Link to="/signup">
          <button className="cta-button">Start Your Journey Free</button>
        </Link>
      </section>
    </div>
    </>
  );
};

export default HomePage;
