import React, { useState } from "react";
import "./Page.css";
import "./ToolsPage.css";
import { Link } from "react-router-dom";
import PanoramicHero from "../components/PanoramicHero";
import BreathingTool from "../features/recovery/tools/BreathingTool";

const ToolsPage = () => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showTechniques, setShowTechniques] = useState(false);

  const breathingPresets = [
    {
      id: "stress",
      name: "Stress Relief",
      icon: "😌",
      inhale: 4,
      hold: 4,
      exhale: 6,
      cycles: 8,
      description:
        "Extended exhale activates your parasympathetic nervous system",
      benefits: ["Reduces anxiety", "Lowers heart rate", "Calms mind"],
    },
    {
      id: "focus",
      name: "Focus & Clarity",
      icon: "🎯",
      inhale: 4,
      hold: 4,
      exhale: 4,
      cycles: 10,
      description: "Box breathing used by Navy SEALs for mental clarity",
      benefits: [
        "Improves concentration",
        "Reduces mental fog",
        "Enhances decision-making",
      ],
    },
    {
      id: "sleep",
      name: "Sleep Preparation",
      icon: "😴",
      inhale: 4,
      hold: 7,
      exhale: 8,
      cycles: 6,
      description: "4-7-8 technique developed by Dr. Andrew Weil",
      benefits: [
        "Promotes relaxation",
        "Reduces racing thoughts",
        "Prepares body for sleep",
      ],
    },
    {
      id: "energy",
      name: "Energy Boost",
      icon: "⚡",
      inhale: 5,
      hold: 5,
      exhale: 5,
      cycles: 12,
      description: "Coherent breathing for balanced energy",
      benefits: [
        "Increases alertness",
        "Balances nervous system",
        "Improves mood",
      ],
    },
  ];

  const breathingTechniques = [
    {
      name: "Box Breathing",
      pattern: "4-4-4-4",
      description:
        "Equal parts inhale, hold, exhale, and pause. Used by military and first responders.",
      bestFor: "Stress management, mental clarity, pre-performance",
    },
    {
      name: "4-7-8 Breathing",
      pattern: "4-7-8",
      description:
        "Natural tranquilizer for the nervous system. Exhale is twice as long as inhale.",
      bestFor: "Insomnia, anxiety, anger management",
    },
    {
      name: "Resonant Breathing",
      pattern: "5-0-5",
      description:
        "Breathe at 5-6 breaths per minute. Maximizes heart rate variability.",
      bestFor: "Overall wellness, emotional regulation, cardiovascular health",
    },
    {
      name: "Pursed Lip Breathing",
      pattern: "2-0-4",
      description:
        "Slow, controlled breathing through pursed lips. Keeps airways open longer.",
      bestFor: "Shortness of breath, COPD, anxiety attacks",
    },
  ];

  const availableTools = [
    {
      id: "breathing",
      name: "Mindful Breathing",
      icon: "🌬️",
      status: "active",
      description: "Voice-guided breathing exercises with mood tracking",
      features: [
        "Voice guidance",
        "Mood tracking",
        "Progress analytics",
        "Multiple patterns",
      ],
      link: "/tools/breathing",
    },
    {
      id: "meditation",
      name: "Meditation Timer",
      icon: "🧘",
      status: "active",
      description: "Silent meditation with ambient sounds and interval bells",
      features: [
        "6 ambient sounds",
        "Customizable durations",
        "Interval bells",
        "Progress tracking",
      ],
      link: "/tools/meditation",
    },
    {
      id: "affirmations",
      name: "Daily Affirmations",
      icon: "✨",
      status: "active",
      description: "Generate powerful affirmations across 5 categories",
      features: [
        "100+ affirmations",
        "5 categories",
        "Save favorites",
        "Share cards",
      ],
      link: "/tools/affirmations",
    },
    {
      id: "stress-assessment",
      name: "Stress Assessment",
      icon: "📋",
      status: "active",
      description: "PSS-10 stress level assessment with personalized insights",
      features: [
        "Evidence-based PSS-10",
        "Instant results",
        "Personalized tips",
        "Track over time",
      ],
      link: "/tools/stress-assessment",
    },
    {
      id: "trigger",
      name: "Trigger Tracker",
      icon: "📊",
      status: "active",
      description: "Log and analyze triggers with pattern recognition",
      features: [
        "Visual timeline",
        "Pattern analysis",
        "Analytics dashboard",
        "Coping insights",
      ],
      link: "/tools/trigger-tracker",
    },
  ];

  const comingSoonTools = [
    {
      id: "cravings",
      name: "Urge Surfing",
      icon: "🌊",
      description:
        "Navigate cravings with guided meditation and distraction techniques",
      eta: "Coming Q1 2025",
      features: [
        "Guided meditation",
        "Timer & tracking",
        "Success strategies",
        "Community support",
      ],
    },
    {
      id: "intentions",
      name: "Daily Intentions",
      icon: "🌅",
      description:
        "Set meaningful goals with affirmations and progress tracking",
      eta: "Coming Q2 2025",
      features: [
        "Morning prompts",
        "Affirmations library",
        "Habit tracking",
        "Reflection journal",
      ],
    },
    {
      id: "gratitude",
      name: "Gratitude Journal",
      icon: "🙏",
      description: "Daily gratitude practice with mood correlation analysis",
      eta: "Coming Q2 2025",
      features: [
        "Daily prompts",
        "Photo attachments",
        "Mood insights",
        "Streak tracking",
      ],
    },
    {
      id: "sleep",
      name: "Sleep Hygiene",
      icon: "🛌",
      description: "Wind-down routines and sleep quality tracking",
      eta: "Coming Q2 2025",
      features: [
        "Sleep tracking",
        "Wind-down rituals",
        "Dream journal",
        "Quality insights",
      ],
    },
    {
      id: "check-in",
      name: "Quick Check-In",
      icon: "✓",
      description: "Fast daily wellness check-ins with trend analysis",
      eta: "In Development",
      features: [
        "30-second check-ins",
        "Trend visualization",
        "Weekly summaries",
        "Intervention alerts",
      ],
    },
  ];

  const stats = [
    { value: "8,400+", label: "Sessions Completed" },
    { value: "78%", label: "Report Reduced Stress" },
    { value: "4.8/5", label: "Average Rating" },
  ];

  return (
    <div className="page tools-page">
      <main className="container">
        <PanoramicHero />

        {/* Enhanced Hero Section */}
        <div className="tools-hero">
          <div className="tools-hero-content">
            <h1>Recovery Tools</h1>
            <p className="hero-subtitle">
              Evidence-based tools to support your daily wellness journey. Track
              progress, manage triggers, and build healthy habits—all in one
              place.
            </p>
            <div className="tools-stats">
              {stats.map((stat, i) => (
                <div key={i} className="stat-box">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why These Tools Section */}
        <section className="section why-tools">
          <div className="section-header-center">
            <h2>Why These Tools Work</h2>
            <p>
              Science-backed techniques proven to support recovery and mental
              wellness
            </p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🧠</div>
              <h3>Evidence-Based</h3>
              <p>
                Built on research from neuroscience, psychology, and addiction
                medicine
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📱</div>
              <h3>Always Accessible</h3>
              <p>
                Available 24/7 whenever you need support, no appointments
                necessary
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>Private & Secure</h3>
              <p>
                Your data is encrypted and never shared. Complete privacy
                guaranteed
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Track Progress</h3>
              <p>
                See your growth over time with detailed analytics and insights
              </p>
            </div>
          </div>
        </section>

        {/* Breathing Techniques Guide */}
        <section className="section techniques-guide">
          <div className="section-header-center">
            <h2>Choose Your Breathing Pattern</h2>
            <p>Quick presets based on what you need right now</p>
          </div>

          <div className="presets-grid">
            {breathingPresets.map((preset) => (
              <div
                key={preset.id}
                className={`preset-card ${
                  selectedPreset?.id === preset.id ? "selected" : ""
                }`}
                onClick={() => setSelectedPreset(preset)}
              >
                <div className="preset-icon">{preset.icon}</div>
                <h3>{preset.name}</h3>
                <div className="preset-pattern">
                  {preset.inhale}-{preset.hold}-{preset.exhale}
                </div>
                <p className="preset-description">{preset.description}</p>
                <ul className="preset-benefits">
                  {preset.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="techniques-expandable">
            <button
              className="expand-btn"
              onClick={() => setShowTechniques(!showTechniques)}
            >
              {showTechniques ? "▼" : "▶"} Learn About Different Breathing
              Techniques
            </button>
            {showTechniques && (
              <div className="techniques-list">
                {breathingTechniques.map((technique, i) => (
                  <div key={i} className="technique-item">
                    <div className="technique-header">
                      <h4>{technique.name}</h4>
                      <span className="technique-pattern">
                        {technique.pattern}
                      </span>
                    </div>
                    <p>{technique.description}</p>
                    <div className="technique-best-for">
                      <strong>Best for:</strong> {technique.bestFor}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Breathing Tool Section */}
        <section className="section breathing-tool-section" id="breathing-tool">
          <div className="tool-introduction">
            <h2>Start Your Practice</h2>
            <p>
              {selectedPreset
                ? `Try the ${selectedPreset.name} pattern below, or customize your own.`
                : "Select a preset above or configure your own breathing pattern below."}
            </p>
          </div>
          <div className="tool-container">
            <BreathingTool
              defaultInhale={selectedPreset?.inhale || 4}
              defaultHold={selectedPreset?.hold || 4}
              defaultExhale={selectedPreset?.exhale || 6}
              defaultCycles={selectedPreset?.cycles || 6}
            />
          </div>
        </section>

        {/* Available Tools Section */}
        <section className="section tools-catalog">
          <div className="section-header-center">
            <h2>Recovery Toolkit</h2>
            <p>Additional tools to support your wellness journey</p>
          </div>

          <div className="tools-grid">
            {availableTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.link}
                className="tool-card active-tool"
              >
                <div className="tool-icon">{tool.icon}</div>
                <div className="tool-status-badge">Active</div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <ul className="tool-features">
                  {tool.features.map((feature, i) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
                <div className="tool-cta">Try Now →</div>
              </Link>
            ))}

            {comingSoonTools.map((tool) => (
              <div key={tool.id} className="tool-card coming-soon-tool">
                <div className="tool-icon">{tool.icon}</div>
                <div className="tool-eta-badge">{tool.eta}</div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <ul className="tool-features">
                  {tool.features.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="section success-stories">
          <div className="section-header-center">
            <h2>Real Impact</h2>
            <p>How these tools are helping people in recovery</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "The breathing tool has become my go-to during moments of
                anxiety. The voice guidance keeps me focused, and I can see my
                progress over time."
              </p>
              <div className="testimonial-author">
                — Anonymous User, 6 months sober
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "I use the 4-7-8 pattern every night before bed. My sleep has
                improved dramatically, and I wake up feeling more rested."
              </p>
              <div className="testimonial-author">
                — Anonymous User, 1 year sober
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "Having these tools available 24/7 gives me confidence. I know I
                always have something to turn to when I'm struggling."
              </p>
              <div className="testimonial-author">
                — Anonymous User, 90 days sober
              </div>
            </div>
          </div>
        </section>

        {/* Professional Resources */}
        <section className="section professional-resources">
          <div className="resources-content">
            <h2>Need Additional Support?</h2>
            <p>
              These tools complement professional treatment. If you're in crisis
              or need immediate help:
            </p>
            <div className="crisis-resources">
              <div className="resource-item">
                <h3>988 Suicide & Crisis Lifeline</h3>
                <a href="tel:988" className="resource-link">
                  Call or Text 988
                </a>
                <p>24/7 confidential support for people in distress</p>
              </div>
              <div className="resource-item">
                <h3>SAMHSA National Helpline</h3>
                <a href="tel:1-800-662-4357" className="resource-link">
                  1-800-662-HELP (4357)
                </a>
                <p>Treatment referral and information service</p>
              </div>
              <div className="resource-item">
                <h3>Crisis Text Line</h3>
                <a href="sms:741741" className="resource-link">
                  Text HOME to 741741
                </a>
                <p>Free 24/7 support via text message</p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Links */}
        <section className="section additional-links">
          <div className="links-grid">
            <Link className="link-card" to="/trauma-education">
              <div className="link-icon">🎓</div>
              <h3>Trauma Education</h3>
              <p>
                Learn about trauma, the nervous system, and healing practices
              </p>
              <span className="link-action">Explore Resources →</span>
            </Link>
            <Link className="link-card" to="/assistance">
              <div className="link-icon">🤝</div>
              <h3>Get Assistance</h3>
              <p>Financial, housing, and healthcare support programs</p>
              <span className="link-action">Find Help →</span>
            </Link>
            <Link className="link-card" to="/recovery">
              <div className="link-icon">🌟</div>
              <h3>Recovery Resources</h3>
              <p>Comprehensive guide to recovery programs and support</p>
              <span className="link-action">Learn More →</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ToolsPage;
