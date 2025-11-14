import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import DashboardHeader from "../components/DashboardHeader";
import PremiumToolCard from "../components/PremiumToolCard";
import "./ToolsPage.css";

/**
 * Premium Tools Page - Luxury Dashboard Experience
 * Features: DashboardHeader with wellness scores, PremiumToolCard grid with 3D effects
 */
export default function ToolsPage() {
  const { user } = useContext(AuthContext);
  
  // Get user's display name for personalization
  const userName = user?.displayName || user?.email?.split('@')[0] || "Friend";

  // Premium Recovery Tools Suite - Complete with features
  const tools = [
    {
      name: "Aurora Breathing",
      icon: "🌊",
      description: "Immersive guided breathing with visual aurora animations and binaural soundscapes.",
      features: [
        "Box breathing patterns",
        "Aurora visual feedback",
        "Progress tracking"
      ],
      link: "/tools/breathing",
      status: "active"
    },
    {
      name: "Meditation Timer",
      icon: "🧘",
      description: "Customizable meditation sessions with ambient sounds, intervals, and completion tracking.",
      features: [
        "Custom durations",
        "Interval bells",
        "Session history"
      ],
      link: "/tools/meditation",
      status: "active"
    },
    {
      name: "AI Affirmations",
      icon: "✨",
      description: "Dynamic affirmations powered by AI, personalized to your recovery journey and needs.",
      features: [
        "AI-generated content",
        "Category filtering",
        "Daily rotation"
      ],
      link: "/tools/affirmations",
      status: "active"
    },
    {
      name: "Stress Assessment",
      icon: "📊",
      description: "Science-based stress evaluation with personalized insights and coping recommendations.",
      features: [
        "PSS-10 assessment",
        "Instant insights",
        "Trend analysis"
      ],
      link: "/tools/stress-assessment",
      status: "active"
    },
    {
      name: "Gratitude Journal",
      icon: "📝",
      description: "Daily gratitude practice with prompts, streaks, and mood correlation analytics.",
      features: [
        "Daily prompts",
        "Streak tracking",
        "Mood insights"
      ],
      link: "/tools/gratitude-journal",
      status: "active"
    },
    {
      name: "Emotion Tracker",
      icon: "💭",
      description: "Track emotional patterns with intensity mapping, triggers, and visualization tools.",
      features: [
        "Intensity scales",
        "Pattern recognition",
        "Visual heatmaps"
      ],
      link: "/tools/emotion-tracker",
      status: "active"
    },
    {
      name: "Trigger Journal",
      icon: "🎯",
      description: "Document triggers with context, coping strategies, and effectiveness tracking.",
      features: [
        "Trigger logging",
        "Coping strategies",
        "Success metrics"
      ],
      link: "/tools/trigger-journal",
      status: "active"
    },
    {
      name: "Weekly Review",
      icon: "📅",
      description: "Structured weekly reflection on progress, challenges, and commitments for growth.",
      features: [
        "Progress tracking",
        "Goal setting",
        "Insight summaries"
      ],
      link: "/tools/weekly-review",
      status: "active"
    }
  ];

  // Determine which tools to recommend (example logic)
  const recommendedTools = ["Aurora Breathing", "AI Affirmations"];

  return (
    <div className="tools-page-premium">
      {/* Premium Dashboard Header */}
      <DashboardHeader userName={userName} />

      {/* Tools Section */}
      <div className="tools-section-container">
        <div className="tools-section-header">
          <h2 className="tools-section-title">
            Your Recovery Toolkit
          </h2>
          <p className="tools-section-subtitle">
            Premium wellness tools designed for your journey to healing and growth
          </p>
        </div>

        {/* Premium Tool Cards Grid */}
        <div className="premium-tools-grid">
          {tools.map((tool, index) => (
            <PremiumToolCard
              key={index}
              tool={tool}
              isRecommended={recommendedTools.includes(tool.name)}
              isComingSoon={tool.status === "coming-soon"}
            />
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="tools-footer-info">
          <div className="info-card">
            <span className="info-emoji">💡</span>
            <div className="info-content">
              <h4>Pro Tip</h4>
              <p>Consistency is key! Try using at least one tool daily for the best results.</p>
            </div>
          </div>
          <div className="info-card">
            <span className="info-emoji">🎯</span>
            <div className="info-content">
              <h4>Track Progress</h4>
              <p>Your wellness score updates automatically based on your tool usage and engagement.</p>
            </div>
          </div>
          <div className="info-card">
            <span className="info-emoji">🌟</span>
            <div className="info-content">
              <h4>Unlock Achievements</h4>
              <p>Complete challenges and maintain streaks to earn badges and rewards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
