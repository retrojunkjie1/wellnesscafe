import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Lock,
  Zap,
  Users,
} from "lucide-react";
import "./PremiumToolCard.css";

/**
 * Premium Tool Card - Luxury micro-interactions and animations
 * Features: Hover effects, usage stats, recommendations, 3D transforms
 */
const PremiumToolCard = ({
  tool,
  isComingSoon = false,
  isRecommended = false,
  userStats = null,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Mock usage stats - would come from Firebase/context in production
  const stats = userStats || {
    lastUsed: tool.status === "active" ? "2 hours ago" : null,
    totalSessions:
      tool.status === "active" ? Math.floor(Math.random() * 50) + 5 : 0,
    avgRating: 4.8,
    weeklyUsage: Math.floor(Math.random() * 10) + 1,
  };

  const renderStatusBadge = () => {
    if (isComingSoon) {
      return (
        <div className="tool-badge coming-soon">
          <Lock size={14} />
          <span>{tool.eta || "Coming Soon"}</span>
        </div>
      );
    }
    if (isRecommended) {
      return (
        <div className="tool-badge recommended">
          <Sparkles size={14} />
          <span>Recommended for You</span>
        </div>
      );
    }
    if (stats.weeklyUsage > 5) {
      return (
        <div className="tool-badge popular">
          <TrendingUp size={14} />
          <span>Trending</span>
        </div>
      );
    }
    return null;
  };

  const CardContent = () => (
    <>
      {/* Shimmer Effect */}
      <div className="card-shimmer"></div>

      {/* Status Badge */}
      <div className="card-badges">{renderStatusBadge()}</div>

      {/* Icon Section */}
      <div className="tool-icon-section">
        <div className="tool-icon-wrapper">
          <span className="tool-icon" role="img" aria-label={tool.name}>
            {tool.icon}
          </span>
          {!isComingSoon && stats.totalSessions > 0 && (
            <div className="completion-badge">
              <CheckCircle size={20} />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="tool-content">
        <h3 className="tool-title">{tool.name}</h3>
        <p className="tool-description">{tool.description}</p>

        {/* Features List */}
        <ul className="tool-features">
          {tool.features.map((feature, index) => (
            <li key={index} className="feature-item">
              <Zap size={14} className="feature-icon" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Stats Section (only for active tools) */}
        {!isComingSoon && stats.totalSessions > 0 && (
          <div className="tool-stats">
            <div className="stat-item">
              <Clock size={16} />
              <span className="stat-label">Last used:</span>
              <span className="stat-value">{stats.lastUsed}</span>
            </div>
            <div className="stat-item">
              <Users size={16} />
              <span className="stat-label">Sessions:</span>
              <span className="stat-value">{stats.totalSessions}</span>
            </div>
            <div className="stat-item">
              <Star size={16} className="star-icon" />
              <span className="stat-value">{stats.avgRating}</span>
            </div>
          </div>
        )}

        {/* Progress Bar (for active tools with usage) */}
        {!isComingSoon && stats.weeklyUsage > 0 && (
          <div className="weekly-progress">
            <div className="progress-header">
              <span className="progress-label">This week</span>
              <span className="progress-count">{stats.weeklyUsage}/7 days</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(stats.weeklyUsage / 7) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="tool-footer">
        {isComingSoon ? (
          <button className="tool-button disabled" disabled>
            <Lock size={18} />
            <span>Coming Soon</span>
          </button>
        ) : (
          <button className="tool-button">
            <span>Start Session</span>
            <ArrowRight
              size={18}
              className={`arrow-icon ${isHovered ? "animated" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Hover Glow Effect */}
      {isHovered && !isComingSoon && <div className="card-glow"></div>}
    </>
  );

  if (isComingSoon) {
    return (
      <div
        className="premium-tool-card coming-soon-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent />
      </div>
    );
  }

  return (
    <Link
      to={tool.link}
      className={`premium-tool-card ${isRecommended ? "recommended-card" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent />
    </Link>
  );
};

export default PremiumToolCard;
