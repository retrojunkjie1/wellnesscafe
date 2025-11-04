import React from "react";
import PropTypes from "prop-types";
import defaultHero from "../assets/images/HomePage-header-v1.png";

const PanoramicHero = ({ src, alt }) => {
  const imgSrc = src || defaultHero;
  const imgAlt = alt || "WellnessCafe background";
  return (
    <div className="panoramic-background">
      <img src={imgSrc} alt={imgAlt} className="hero-panorama-image" />
    </div>
  );
};

PanoramicHero.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

export default PanoramicHero;
