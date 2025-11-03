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
  const bg = normalizeBg(imageSrc);
  return (
    <section
      className={`page-banner ${overlayClasses}`}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Visually-hidden img for accessibility since background images aren't announced */}
      {bg ? (
        <img
          src={bg}
          alt={altText || ""}
          className="sr-only"
          aria-hidden={false}
        />
      ) : null}
      <div className="page-banner-inner">{children}</div>
    </section>
  );
};

PageBanner.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  altText: PropTypes.string,
  overlayClasses: PropTypes.string,
  children: PropTypes.node,
};

export default PageBanner;
