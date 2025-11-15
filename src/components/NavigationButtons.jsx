import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavigationButtons.css";

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  const buildLabel = () => {
    const p = location.pathname;
    const routeNames = {
      "/providers": "Providers",
      "/providers/directory": "Provider Directory",
      "/providers/benefits": "Provider Benefits",
      "/providers/apply": "Provider Application",
      "/providers/testimonials": "Testimonials",
      "/providers/expectations": "Expectations",
      "/providers/dashboard": "Provider Dashboard",
      "/providers/admin/import": "Admin Import",
      "/assistance": "Assistance Directory",
      "/events": "Events & Workshops",
      "/blog": "Blog",
      "/news": "News",
      "/tools": "Tools",
      "/product": "Product",
      "/about": "About",
      "/recovery": "Recovery",
      "/yoga": "Yoga",
      "/acuwellness": "Acuwellness",
      "/spiritual": "Spiritual",
      "/dashboard": "Dashboard",
    };
    if (routeNames[p]) return routeNames[p];
    // handle dynamic states like /resources/soberLivingHomes/:state
    if (p.startsWith("/resources/soberLivingHomes/")) {
      const slug = p.split("/").at(-1) || "";
      const name = slug
        .split("-")
        .map((w) => (w ? (w.at(0) || "").toUpperCase() + w.slice(1) : ""))
        .join(" ");
      return `Sober Homes – ${name}`;
    }
    // assistance detail /assistance/:slug
    if (p.startsWith("/assistance/")) {
      const slug = p.split("/").at(-1) || "";
      const name = slug
        .split("-")
        .map((w) => (w ? (w.at(0) || "").toUpperCase() + w.slice(1) : ""))
        .join(" ");
      return `Assistance – ${name}`;
    }
    // generic fallback from path
    const parts = p.split("/").filter(Boolean);
    const last = parts.at(-1) || "";
    if (!last) return "Page";
    return last
      .split("-")
      .map((w) => (w ? (w.at(0) || "").toUpperCase() + w.slice(1) : ""))
      .join(" ");
  };

  const label = buildLabel();

  // Don't show on homepage
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="nav-buttons-container" aria-label="Quick navigation">
      <button
        className="nav-btn nav-back"
        onClick={handleBack}
        aria-label="Go back"
        title="Go back"
      >
        ←
      </button>
      <div className="nav-current" aria-current="page" title={label}>
        {label}
      </div>
      <button
        className="nav-btn nav-forward"
        onClick={handleForward}
        aria-label="Go forward"
        title="Go forward"
      >
        →
      </button>
    </nav>
  );
};

export default NavigationButtons;
