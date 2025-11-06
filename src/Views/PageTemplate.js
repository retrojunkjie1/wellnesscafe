import React from "react";
import PropTypes from "prop-types";
import Header from "../components/Header";
import "./PageTemplate.css";
import productImage from "../assets/images/WellnessCafe-Product-v1.png";
import journalImage from "../assets/images/wellnesscafe-journal-vs1.png";
import bowlImage from "../assets/images/wellnesscafe-bowl-v1.png";
import { Link } from "react-router-dom";

const PageTemplate = ({ title, intro, features, ctaText, pageType }) => {
  const getPageImage = () => {
    switch (pageType) {
      case "recovery":
      case "assistance":
        return journalImage;
      case "yoga":
      case "spiritual":
        return bowlImage;
      case "acuwellness":
      case "events":
      default:
        return productImage;
    }
  };

  const getGradientClass = () => {
    switch (pageType) {
      case "recovery":
        return "gradient-recovery";
      case "yoga":
        return "gradient-yoga";
      case "acuwellness":
        return "gradient-acuwellness";
      case "spiritual":
        return "gradient-spiritual";
      case "events":
        return "gradient-events";
      case "assistance":
        return "gradient-assistance";
      default:
        return "gradient-default";
    }
  };

  return (
    <div className={`page luxury-page ${getGradientClass()}`}>
      <Header image={getPageImage()} title={title} />

      {/* === LUXURY HERO SECTION === */}
      <section className="page-hero luxury-hero">
        <div className="hero-container">
          <div className="hero-content-wrapper">
            <div className="hero-text-content">
              <h1 className="luxury-page-title">{title}</h1>
              <p className="luxury-page-intro">{intro}</p>
            </div>
            <div className="hero-image-content">
              <img
                src={getPageImage()}
                alt={`${title} Wellness`}
                className="luxury-page-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      <section className="page-features">
        {features.map((feature) => {
          const content = (
            <>
              {feature.icon ? (
                <div className="wellness-icon-card wellness-icon-sm">
                  {feature.icon}
                </div>
              ) : null}
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </>
          );
          return feature.to ? (
            <Link key={feature.title} to={feature.to} className="feature-card" aria-label={feature.title}>
              {content}
            </Link>
          ) : (
            <div key={feature.title} className="feature-card">
              {content}
            </div>
          );
        })}
      </section>

      {/* === CTA SECTION === */}
      <section className="page-cta">
        <p>{ctaText}</p>
        <button className="cta-button">Explore More</button>
      </section>
    </div>
  );
};

PageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      title: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ).isRequired,
  ctaText: PropTypes.string.isRequired,
  pageType: PropTypes.string.isRequired,
};

export default PageTemplate;
