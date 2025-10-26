import React from 'react';
import PageTemplate from './PageTemplate';

const Assistance = () => {
  return (
    <PageTemplate
      title="Government Assistance"
      intro="Navigate financial, housing, healthcare, and recovery programs with personalized guidance tailored to your region and needs."
      features={[
        { title: 'Financial Pathways', desc: 'Discover and access government programs, benefits, and financial assistance opportunities designed for your situation.' },
        { title: 'Housing Solutions', desc: 'Find suitable housing assistance programs, transitional living options, and supportive community resources.' },
        { title: 'Healthcare Navigation', desc: 'Connect with healthcare programs, addiction treatment resources, and mental health support services.' },
      ]}
      ctaText="Access the support you deserve and take confident steps toward stability and wellness."
    />
  );
};

export default Assistance;