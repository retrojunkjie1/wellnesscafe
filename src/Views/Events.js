import React from "react";
import PageTemplate from "./PageTemplate";

const Events = () => {
  return (
    <PageTemplate
      pageType="events"
      title="Live Events, Workshops & Transformative Experiences"
      intro="Immerse yourself in powerful community experiences, expert-led workshops, and healing retreats designed to catalyze deep transformation. Connect with like-minded individuals while gaining practical tools for holistic wellness and personal growth."
      features={[
        {
          title: "Expert-Led Wellness Workshops",
          desc: "Interactive learning experiences with renowned practitioners covering yoga therapy, meditation mastery, nutritional healing, trauma-informed care, breathwork facilitation, and integrative wellness approaches. Gain practical skills and deepen your understanding of holistic health.",
        },
        {
          title: "Transformative Healing Retreats",
          desc: "Multi-day immersive retreats combining yoga, meditation, nature immersion, therapeutic practices, and community connection. Experience profound healing in sacred spaces designed for deep restoration, self-discovery, and lasting transformation.",
        },
        {
          title: "Community Support Circles & Groups",
          desc: "Regular facilitated gatherings for specific communities including recovery support, grief circles, parenting groups, creative expression sessions, and peer mentorship programs. Build authentic relationships and receive ongoing support in safe, moderated environments.",
        },
        {
          title: "Seasonal & Lunar Ceremonies",
          desc: "Align with natural cycles through seasonal rituals, full moon ceremonies, solstice celebrations, and lunar practice gatherings. Honor the Earth's rhythms while connecting with ancient wisdom and contemporary spiritual practices for deeper meaning and connection.",
        },
        {
          title: "Professional Development & Certification",
          desc: "Advanced training programs for wellness professionals including yoga teacher certifications, meditation instructor courses, holistic health coaching programs, and specialized certifications in trauma-informed care, breathwork, and integrative wellness modalities.",
        },
        {
          title: "Family & Couples Wellness Experiences",
          desc: "Shared healing experiences designed for families, couples, and loved ones including relationship workshops, family yoga sessions, parenting support groups, and intergenerational healing circles that strengthen bonds and promote collective wellness.",
        },
        {
          title: "Art & Expressive Therapy Workshops",
          desc: "Creative healing through art therapy, dance movement therapy, music therapy, writing workshops, and expressive arts practices. Discover new ways to process emotions, express creativity, and access inner wisdom through artistic exploration and therapeutic creation.",
        },
        {
          title: "Mindfulness & Meditation Intensives",
          desc: "Deep immersion in mindfulness practices, meditation retreats, silent retreats, and contemplative practices. Learn advanced meditation techniques, develop concentration, cultivate compassion, and integrate mindfulness into daily life for lasting peace and clarity.",
        },
        {
          title: "Holistic Health & Nutrition Programs",
          desc: "Comprehensive wellness education covering functional nutrition, herbal medicine, Ayurvedic principles, Traditional Chinese Medicine, and integrative health approaches. Learn to nourish body, mind, and spirit through food, herbs, and lifestyle practices.",
        },
        {
          title: "Virtual & Hybrid Event Experiences",
          desc: "Access transformative experiences from anywhere through live-streamed events, on-demand workshops, interactive virtual retreats, and hybrid programs that combine in-person and online participation. Experience community and learning regardless of location.",
        },
      ]}
      ctaText="Join our vibrant community of seekers and healers in transformative live experiences that will change your life. Whether you're looking for personal growth, professional development, or deep healing, our events offer the perfect environment for connection, learning, and transformation. Register today and step into your next chapter of wellness."
    />
  );
};

export default Events;
