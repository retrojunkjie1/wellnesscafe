import React from "react";
import PropTypes from "prop-types";
import "./Header.css";
import defaultImage from "../assets/images/wellnesscafe-bowl-v2.png";
import logo from "../logo.svg";
import { Link } from "react-router-dom";

const Header = ({ image = defaultImage, title = "Wellnesscafe" }) => {
  return (
    <>
      <header className="header-container">
        <div className="header-content">
          <div className="tagline">
            <Link to="/" aria-label="Go to homepage" className="tagline-left">
              <img src={logo} alt="Holding company" className="tagline-icon-img" />
            </Link>
            <span className="tagline-text" aria-hidden="true"></span>
            <Link to="/" aria-label="Brand mark" className="tagline-right">
              <img src="/logo192.png" alt="Brand icon" className="tagline-icon-right-img" />
            </Link>
          </div>

          <div className="main-content">
            <div className="header-text">
              <div className="header-glass">
                <h1 className="header-line line1">
                  Holding <span className="highlight">Company.</span>
                </h1>
                <h1 className="header-line line2">
                  AI SaaS <span className="highlight">Investor.</span>
                </h1>
                <h1 className="header-line line3">
                  Wellnesscafe <span className="highlight">ai.</span>
                </h1>
              </div>
            </div>

            <div className="header-image">
              <div className="image-wrapper">
                <img
                  src={image}
                  alt={`${title} wellness`}
                  className="wellness-image"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

Header.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
};

Header.defaultProps = {
  image: defaultImage,
  title: "Wellnesscafe",
};

export default Header;
