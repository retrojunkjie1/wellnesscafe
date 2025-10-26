import React from 'react';
import PageTemplate from './PageTemplate';

const Yoga = () => {
  return (
    <PageTemplate
      pageType="yoga"
      title="Yoga & Mindfulness"
      intro="Guided movement, breathwork, and meditation to restore balance and self-awareness through ancient wisdom."
      features={[
        { title: 'Flow Practice', desc: 'Personalized yoga sequences that adapt to your skill level and evolve with your wellness journey.' },
        { title: 'Sacred Breath', desc: 'Transform stress into serenity with guided breathwork sessions for emotional regulation and clarity.' },
        { title: 'Inner Stillness', desc: 'Cultivate presence and inner peace through meditation practices rooted in mindful awareness.' },
      ]}
      ctaText="Step into your practice and discover the transformative power of mindful movement."
    />
  );
};

export default Yoga;