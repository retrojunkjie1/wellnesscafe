import React from "react";
import PageTemplate from "./PageTemplate";

const Acuwellness = () => {
  return (
    <PageTemplate
      pageType="acuwellness"
      title="Acuwellness: Ancient Healing for Modern Wellness"
      intro="Experience the profound healing power of acupuncture, acupressure, and traditional Chinese medicine integrated with modern wellness practices. Restore balance, release blockages, and cultivate optimal health through time-tested Eastern healing wisdom."
      features={[
        {
          title: "Traditional Acupuncture & Meridian Therapy",
          desc: "Experience precise acupuncture treatments targeting specific meridian points to restore energy flow (Qi), release blockages, and promote natural healing. Treatments address pain, stress, digestive issues, hormonal balance, and chronic conditions through gentle, effective needle therapy.",
        },
        {
          title: "Acupressure & Self-Care Techniques",
          desc: "Learn powerful self-care acupressure techniques you can practice at home. Master point stimulation for headaches, anxiety, insomnia, menstrual discomfort, and immune system support. Access guided tutorials and daily acupressure routines for ongoing wellness maintenance.",
        },
        {
          title: "Chinese Herbal Medicine & Nutrition",
          desc: "Discover personalized herbal formulas and dietary recommendations based on traditional Chinese medicine principles. Address specific health concerns with time-tested herbal combinations, dietary therapy, and seasonal eating practices that nourish body and spirit.",
        },
        {
          title: "Cupping & Gua Sha Therapy",
          desc: "Experience traditional cupping therapy to improve circulation, release muscle tension, and promote detoxification. Learn Gua Sha techniques for facial rejuvenation, lymphatic drainage, and musculoskeletal pain relief using ancient stone tools.",
        },
        {
          title: "Qi Gong & Movement Medicine",
          desc: "Practice gentle Qi Gong exercises that cultivate internal energy, improve balance, and enhance meditation. Learn flowing movements that combine breath, intention, and posture to strengthen the body's natural healing capacity and promote longevity.",
        },
        {
          title: "Tui Na Therapeutic Massage",
          desc: "Receive therapeutic massage based on traditional Chinese techniques that work with meridians and energy points. Address musculoskeletal issues, improve circulation, and restore balance through deep tissue work, joint mobilization, and energy balancing techniques.",
        },
        {
          title: "Five Element Constitutional Assessment",
          desc: "Receive a comprehensive assessment based on traditional Five Element theory to understand your unique constitutional type. Learn how Wood, Fire, Earth, Metal, and Water elements influence your health and receive personalized recommendations for optimal well-being.",
        },
        {
          title: "Seasonal Wellness & Preventive Care",
          desc: "Align with natural cycles through seasonal wellness practices, dietary adjustments, and lifestyle recommendations. Learn to prevent illness, maintain balance, and cultivate resilience through harmony with nature's rhythms and the changing seasons.",
        },
        {
          title: "Emotional Freedom & Trauma Release",
          desc: "Address emotional patterns and trauma through acupuncture protocols specifically designed for anxiety, depression, PTSD, and emotional healing. Combine needle therapy with counseling support for comprehensive emotional wellness and nervous system regulation.",
        },
        {
          title: "Integrative Wellness Consultations",
          desc: "Receive comprehensive consultations that combine Eastern and Western approaches to health. Work with licensed practitioners who understand both traditional Chinese medicine and modern medical systems to create truly holistic treatment plans.",
        },
      ]}
      ctaText="Embark on a journey of deep healing and balance through the ancient wisdom of Acuwellness. Our experienced practitioners blend traditional techniques with modern understanding to address your unique health concerns. Discover the transformative power of Eastern medicine and step into optimal wellness today."
    />
  );
};

export default Acuwellness;
