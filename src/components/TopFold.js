import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TopFold.css";
import heroPanorama from "../assets/images/Aspen-6.png";

const TopFold = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Animated counter for stats
  const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
        setCount(Math.floor(end * easeOutQuart));
        if (percentage < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [end, duration]);

    return (
      <span>
        {count}
        {suffix}
      </span>
    );
  };

  return (
    <section className="topfold-container">
      {/* Panoramic Hero Background */}
      <div className="panoramic-background">
        <img
          src={heroPanorama}
          alt="WellnessCafe Hero Panorama"
          className="hero-panorama-image"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Hero Content with Animations */}
      <div className={`topfold-content ${isVisible ? "visible" : ""}`}>
        <div className="topfold-titlebox">
          <h1 className="topfold-title">
            WellnessCafe —{" "}
            <span className="highlight gradient-text">Clarity. Balance. Precision.</span>
          </h1>
          <p className="topfold-sub">
            Discover calm intelligence through design, ritual, and mindful
            innovation. Your comprehensive wellness platform for recovery,
            mindfulness, and personal growth.
          </p>
        </div>
        <div className="topfold-features">
          {[
            { icon: "🧠", label: "AI-Powered Recovery", path: "/recovery" },
            { icon: "🧘", label: "Guided Mindfulness", path: "/yoga" },
            { icon: "🌿", label: "Acuwellness", path: "/acuwellness" },
            { icon: "👥", label: "Community Support", path: "/events" }
          ].map((feature, idx) => (
            <button
              key={idx}
              className="feature-item"
              onClick={() => navigate(feature.path)}
            >
              <span className="feature-icon wellness-icon">{feature.icon}</span>
              <span>{feature.label}</span>
            </button>
          ))}
        </div>
        <div className="topfold-stats">
          <div className="stat-item">
            <span className="stat-number">
              <AnimatedCounter end={10} suffix="K+" />
            </span>
            <span className="stat-label">Active Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              <AnimatedCounter end={500} suffix="+" />
            </span>
            <span className="stat-label">Weekly Sessions</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              <AnimatedCounter end={95} suffix="%" />
            </span>
            <span className="stat-label">Success Rate</span>
          </div>
        </div>
        <button className="topfold-btn pulse-btn" onClick={() => navigate("/signup")}>
          <span>Start Your Journey</span>
          <span className="btn-arrow">→</span>
        </button>

        {/* Trust Badges */}
        <div className="trust-badges">
          <span className="badge">🔒 HIPAA Compliant</span>
          <span className="badge">✓ Verified Providers</span>
          <span className="badge">🌟 5-Star Rated</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default TopFold;
