import React from 'react';
import PageTemplate from './PageTemplate';

const Spiritual = () => {
  return (
    <PageTemplate
      pageType="spiritual"
      title="Spiritual Counseling"
      intro="Sacred group circles, personalized guidance, and meaningful rituals for purpose, healing, and soul transformation."
      features={[
        { title: 'Sacred Community', desc: 'Join guided group sessions where vulnerability becomes strength and shared wisdom illuminates the path forward.' },
        { title: 'Soul Guidance', desc: 'One-on-one spiritual counseling that honors your unique journey and helps you discover your authentic truth.' },
        { title: 'Ritual & Ceremony', desc: 'Meaningful ceremonies and rituals that honor life transitions and deepen your connection to purpose.' },
      ]}
      ctaText="Embark on a sacred journey of spiritual discovery and soulful transformation."
    />
  );
};

export default Spiritual;