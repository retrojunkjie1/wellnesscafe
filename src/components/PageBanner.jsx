import React from "react";
import PropTypes from "prop-types";
import "./PageBanner.css";

const normalizeBg = (src) => {
  if (!src) return "";
  let s = String(src).trim();
  const low = s.toLowerCase();
  if (low.startsWith("http://")) s = s.replace(/^http:\/\//i, "https://");
  // If relative without leading slash, make it absolute to work under ngrok/prod
  if (
    !low.startsWith("http://") &&
    !low.startsWith("https://") &&
    !s.startsWith("/")
  ) {
    s = `/${s.replace(/^\.\//, "")}`;
  }
  return s;
};

const PageBanner = ({ imageSrc, altText, overlayClasses = "", children }) => {
  // We intentionally avoid rendering a background image so the global site background stays consistent.
  // imageSrc is accepted for backward compatibility but not applied.
  const _bg = normalizeBg(imageSrc); // eslint-disable-line no-unused-vars
  return (
    <section className={`page-banner ${overlayClasses}`}>
      <div className="page-banner-inner">{children}</div>
    </section>
  );
};

PageBanner.propTypes = {
  imageSrc: PropTypes.string, // optional; background is unified globally
  altText: PropTypes.string,
  overlayClasses: PropTypes.string,
  children: PropTypes.node,
};

export default PageBanner;
