import React from 'react';
import PageTemplate from './PageTemplate';

const Events = () => {
  return (
    <PageTemplate
      title="Live Events & Workshops"
      intro="Immersive community experiences, transformative workshops, and healing retreats that connect body, mind, and soul."
      features={[
        { title: 'Transformative Workshops', desc: 'Interactive learning experiences covering holistic wellness, emotional healing, and personal growth practices.' },
        { title: 'Healing Retreats', desc: 'Multi-day immersive journeys designed for deep restoration, connection, and life-changing transformation.' },
        { title: 'Community Circles', desc: 'Regular support gatherings and peer connection sessions that foster authentic relationships and shared healing.' },
      ]}
      ctaText="Join our vibrant community and experience the power of collective healing and growth."
    />
  );
};

export default Events;