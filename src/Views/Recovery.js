import React from 'react';
import PageTemplate from './PageTemplate';

const Recovery = () => {
  return (
    <PageTemplate
      title="Recovery Support"
      intro="AI-powered recovery tools, progress tracking, and compassionate community support for sustainable healing and transformation."
      features={[
        { title: 'Intelligent Tracking', desc: 'Daily check-ins with AI insights that recognize patterns, celebrate progress, and guide your journey forward.' },
        { title: 'Prevention & Care', desc: 'Proactive alerts and personalized coping strategies tailored to your unique recovery patterns and triggers.' },
        { title: 'Healing Circle', desc: 'Connect with others walking similar paths in a safe, moderated space built for authentic support and growth.' },
      ]}
      ctaText="Take the next step in your recovery journey with compassionate, intelligent support."
    />
  );
};

export default Recovery;