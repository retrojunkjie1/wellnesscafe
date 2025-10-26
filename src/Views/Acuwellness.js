import React from 'react';
import PageTemplate from './PageTemplate';

const Acuwellness = () => {
  return (
    <PageTemplate
      pageType="acuwellness"
      title="Acuwellness"
      intro="Blending ancient Eastern medicine with modern science, Acuwellness restores the natural harmony between body and mind."
      features={[
        { title: 'Energy Balance', desc: 'Experience gentle acupuncture-inspired therapy to rebalance internal flow and release tension.' },
        { title: 'Eastern Healing', desc: 'Guided sessions combining meridian theory, breathing, and mindfulness for full-body restoration.' },
        { title: 'Holistic Approach', desc: 'Rooted in Qi harmony and preventive care — supporting long-term wellness transformation.' },
      ]}
      ctaText="Join an Acuwellness session today and discover balance beyond the physical."
    />
  );
};

export default Acuwellness;