import React from "react";
import ToolCard from "../components/ToolCard";

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Wellness Tools
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard
            title="Breathing Exercise"
            description="Practice guided breathing patterns for calmness and equilibrium."
            link="/tools/breathing"
          />

          <ToolCard
            title="Meditation Timer"
            description="Set timers with sound cues to support stillness and focus."
            link="/tools/meditation"
          />

          <ToolCard
            title="Affirmation Generator"
            description="Generate recovery-focused affirmations personalized to your needs."
            link="/tools/affirmations"
          />

          <ToolCard
            title="Stress Assessment"
            description="Check in with your stress levels and receive insights and recommendations."
            link="/tools/stress-assessment"
          />

          <ToolCard
            title="Gratitude Journal"
            description="Document moments of gratitude and reflect on psychological safety."
            link="/tools/gratitude-journal"
          />

          <ToolCard
            title="Emotion Tracker"
            description="Track emotional intensity and patterns across your recovery journey."
            link="/tools/emotion-tracker"
          />

          <ToolCard
            title="Trigger Journal"
            description="Document triggers, context, and coping strategies to enhance resilience."
            link="/tools/trigger-journal"
          />

          <ToolCard
            title="Weekly Review"
            description="Reflect on progress, setbacks, and new commitments."
            link="/tools/weekly-review"
          />
        </div>
      </div>
    </div>
  );
}
