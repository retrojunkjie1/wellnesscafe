import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useAIWidget } from "../App";
import "./Navbar.css";
import RadioPlayer from "./RadioPlayer.jsx";
import GetHelpNow from "./GetHelpNow";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const aiWidgetRef = useAIWidget();
  // location hook removed (unused after navbar style unification)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const next = !prev;
      // Robust body scroll lock for iOS Safari as well
      document.documentElement.style.overflow = next ? "hidden" : "";
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleGetHelp = (prompt) => {
    closeMenu(); // Close mobile menu first
    if (aiWidgetRef?.current) {
      aiWidgetRef.current.openWithPrompt(prompt);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-brand">
        <Link to="/" className="nav-logo" aria-label="Go to homepage">
          WELLNESSCAFE
        </Link>
        <div className="nav-under">
          <RadioPlayer variant="navbar" />
        </div>
      </div>

      {/* Desktop Navigation */}
      <ul className="nav-links desktop-nav">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/news">News</Link>
        </li>
        <li>
          <Link to="/recovery">Recovery</Link>
        </li>
        <li>
          <Link to="/tools">Tools</Link>
        </li>
        <li>
          <Link to="/providers">Providers</Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
          <Link to="/assistance">Assistance</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>

      {/* Auth Buttons */}
      <div className="auth-buttons">
        {user ? (
          <>
            <Link
              to={
                user.role === "provider" ? "/providers/dashboard" : "/dashboard"
              }
              className="auth-btn dashboard-btn"
            >
              Dashboard
            </Link>
            <button onClick={handleLogout} className="auth-btn logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-btn login-btn">
              Login
            </Link>
            <Link to="/signup" className="auth-btn signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="mobile-nav">
        <button
          className="hamburger-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`hamburger-line ${isMenuOpen ? "active" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${isMenuOpen ? "active" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${isMenuOpen ? "active" : ""}`}
          ></span>
        </button>

        {/* Mobile Dropdown Menu */}
        <div
          id="mobile-menu"
          className={`mobile-dropdown ${isMenuOpen ? "open" : ""}`}
          role="dialog"
          aria-modal="true"
        >
          <button
            className={`mobile-backdrop ${isMenuOpen ? "show" : ""}`}
            onClick={closeMenu}
            aria-label="Close menu overlay"
          />
          <ul className="mobile-nav-links">
            <li className="mobile-help-item">
              <GetHelpNow
                variant="mobile"
                context="crisis"
                onOpenAI={handleGetHelp}
              />
            </li>
            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/news" onClick={closeMenu}>
                News
              </Link>
            </li>
            <li>
              <Link to="/recovery" onClick={closeMenu}>
                Recovery
              </Link>
            </li>
            <li>
              <Link to="/tools" onClick={closeMenu}>
                Tools
              </Link>
            </li>
            <li>
              <Link to="/providers" onClick={closeMenu}>
                Providers
              </Link>
            </li>
            <li>
              <Link to="/events" onClick={closeMenu}>
                Events
              </Link>
            </li>
            <li>
              <Link to="/assistance" onClick={closeMenu}>
                Assistance
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu}>
                About
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    to={
                      user.role === "provider"
                        ? "/providers/dashboard"
                        : "/dashboard"
                    }
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" onClick={closeMenu}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
