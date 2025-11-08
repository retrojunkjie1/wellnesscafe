import React from 'react';
import { Link } from 'react-router-dom';
import './YogaPage.css';

const Yoga = () => {
  const benefits = [
    {
      icon: '🧘',
      title: 'Stress Reduction',
      description: '98% of practitioners report significant decrease in anxiety and stress levels within 30 days of regular practice.'
    },
    {
      icon: '💪',
      title: 'Physical Strength',
      description: 'Build functional strength, improve flexibility, and enhance overall physical fitness through mindful movement.'
    },
    {
      icon: '🧠',
      title: 'Mental Clarity',
      description: 'Improve focus, concentration, and cognitive function through breathwork and meditation practices.'
    },
    {
      icon: '❤️',
      title: 'Emotional Balance',
      description: 'Regulate emotions, process trauma, and cultivate inner peace through somatic awareness and mindfulness.'
    },
    {
      icon: '🌟',
      title: 'Spiritual Growth',
      description: 'Connect with your higher self, discover life purpose, and experience deeper meaning through yoga philosophy.'
    },
    {
      icon: '😴',
      title: 'Better Sleep',
      description: 'Improve sleep quality and duration through relaxation techniques and nervous system regulation.'
    }
  ];

  const classTypes = [
    {
      badge: 'BEGINNER',
      title: 'Hatha Yoga',
      duration: '60 minutes',
      description: 'Perfect for beginners. Learn foundational poses, proper alignment, and basic breathing techniques in a gentle, supportive environment.',
      features: ['Basic poses', 'Alignment focus', 'Breath awareness', 'Flexibility building']
    },
    {
      badge: 'DYNAMIC',
      title: 'Vinyasa Flow',
      duration: '75 minutes',
      description: 'Dynamic, flowing sequences that link breath with movement. Build strength, stamina, and cardiovascular fitness while cultivating mindfulness.',
      features: ['Flowing sequences', 'Cardio workout', 'Strength building', 'Creative transitions']
    },
    {
      badge: 'RESTORATIVE',
      title: 'Yin Yoga',
      duration: '90 minutes',
      description: 'Slow-paced practice with poses held for 3-5 minutes. Release deep connective tissue tension, improve flexibility, and activate the parasympathetic nervous system.',
      features: ['Deep stretches', 'Prop supported', 'Meditative', 'Fascia release']
    },
    {
      badge: 'THERAPEUTIC',
      title: 'Yoga Therapy',
      duration: '60 minutes',
      description: 'Specialized practice for specific conditions including anxiety, depression, chronic pain, and PTSD. Work one-on-one with certified yoga therapists.',
      features: ['Personalized sequences', 'Trauma-informed', 'Medical conditions', 'Mental health support']
    },
    {
      badge: 'ADVANCED',
      title: 'Power Yoga',
      duration: '90 minutes',
      description: 'Intense, athletic practice combining strength training with yoga poses. Build muscle, burn calories, and challenge your physical and mental limits.',
      features: ['High intensity', 'Strength focus', 'Endurance building', 'Advanced poses']
    },
    {
      badge: 'GENTLE',
      title: 'Restorative Yoga',
      duration: '75 minutes',
      description: 'Deeply relaxing practice using props to support the body in passive poses. Perfect for recovery, stress relief, and nervous system healing.',
      features: ['Fully supported', 'Deep relaxation', 'Stress relief', 'Healing focus']
    }
  ];

  const instructors = [
    {
      name: 'Sarah Chen',
      title: 'E-RYT 500, Yoga Therapist',
      emoji: '🧘‍♀️',
      specialties: ['Trauma-Informed', 'Vinyasa', 'Meditation']
    },
    {
      name: 'Marcus Williams',
      title: 'E-RYT 200, Breathwork Specialist',
      emoji: '🧘‍♂️',
      specialties: ['Pranayama', 'Hatha', 'Philosophy']
    },
    {
      name: 'Priya Sharma',
      title: 'C-IAYT, Ayurveda Practitioner',
      emoji: '🧘',
      specialties: ['Yoga Therapy', 'Ayurveda', 'Yin']
    },
    {
      name: 'Alex Rodriguez',
      title: 'E-RYT 500, Power Yoga',
      emoji: '��‍♂️',
      specialties: ['Power Yoga', 'Strength', 'Ashtanga']
    }
  ];

  const schedule = [
    {
      day: 'Monday',
      classes: [
        { time: '7:00 AM', name: 'Morning Vinyasa Flow', instructor: 'Sarah Chen', level: 'All Levels' },
        { time: '12:00 PM', name: 'Gentle Hatha', instructor: 'Priya Sharma', level: 'Beginner' },
        { time: '6:00 PM', name: 'Power Yoga', instructor: 'Alex Rodriguez', level: 'Advanced' }
      ]
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '6:30 AM', name: 'Sunrise Meditation', instructor: 'Marcus Williams', level: 'All Levels' },
        { time: '5:30 PM', name: 'Yin Yoga', instructor: 'Priya Sharma', level: 'All Levels' },
        { time: '7:30 PM', name: 'Breathwork & Pranayama', instructor: 'Marcus Williams', level: 'All Levels' }
      ]
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '7:00 AM', name: 'Vinyasa Flow', instructor: 'Sarah Chen', level: 'Intermediate' },
        { time: '12:00 PM', name: 'Restorative Yoga', instructor: 'Priya Sharma', level: 'All Levels' },
        { time: '6:00 PM', name: 'Power Yoga', instructor: 'Alex Rodriguez', level: 'Advanced' }
      ]
    },
    {
      day: 'Thursday',
      classes: [
        { time: '6:30 AM', name: 'Morning Flow', instructor: 'Sarah Chen', level: 'All Levels' },
        { time: '5:30 PM', name: 'Therapeutic Yoga', instructor: 'Priya Sharma', level: 'Beginner' },
        { time: '7:00 PM', name: 'Meditation & Mindfulness', instructor: 'Marcus Williams', level: 'All Levels' }
      ]
    },
    {
      day: 'Friday',
      classes: [
        { time: '7:00 AM', name: 'Vinyasa Flow', instructor: 'Alex Rodriguez', level: 'Intermediate' },
        { time: '12:00 PM', name: 'Gentle Yoga', instructor: 'Priya Sharma', level: 'Beginner' },
        { time: '6:00 PM', name: 'Weekend Power Flow', instructor: 'Sarah Chen', level: 'All Levels' }
      ]
    }
  ];

  return (
    <div className="yoga-page">
      <section className="yoga-hero">
        <div className="yoga-hero-content">
          <h1>Ancient Wisdom Meets Modern Healing</h1>
          <p className="yoga-hero-subtitle">
            Transform your body, calm your mind, and elevate your spirit through the timeless practice of yoga. 
            Join thousands who have discovered balance, strength, and inner peace.
          </p>
          <div className="yoga-stats">
            <div className="yoga-stat">
              <span className="yoga-stat-number">10,000+</span>
              <span className="yoga-stat-label">Active Practitioners</span>
            </div>
            <div className="yoga-stat">
              <span className="yoga-stat-number">98%</span>
              <span className="yoga-stat-label">Stress Reduction</span>
            </div>
            <div className="yoga-stat">
              <span className="yoga-stat-number">50+</span>
              <span className="yoga-stat-label">Weekly Classes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="yoga-section">
        <div className="section-header">
          <span className="section-tag">Benefits</span>
          <h2 className="section-title">Transform Your Whole Being</h2>
          <p className="section-description">
            Yoga is more than exercise—it's a complete system for physical, mental, and spiritual wellness. 
            Experience profound changes in every aspect of your life.
          </p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <span className="benefit-icon">{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="yoga-section alternate">
        <div className="section-header">
          <span className="section-tag">Class Types</span>
          <h2 className="section-title">Find Your Perfect Practice</h2>
          <p className="section-description">
            From gentle restorative sessions to dynamic power flows, we offer diverse styles 
            to match your goals, experience level, and current needs.
          </p>
        </div>
        <div className="class-types">
          {classTypes.map((classType, index) => (
            <div key={index} className="class-type-card">
              <span className="class-badge">{classType.badge}</span>
              <h3>{classType.title}</h3>
              <p className="class-duration">⏱️ {classType.duration}</p>
              <p>{classType.description}</p>
              <ul className="class-features">
                {classType.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="yoga-section">
        <div className="section-header">
          <span className="section-tag">Our Teachers</span>
          <h2 className="section-title">Learn From Experienced Guides</h2>
          <p className="section-description">
            Our certified instructors bring decades of combined experience, advanced training, 
            and genuine passion for sharing the transformative power of yoga.
          </p>
        </div>
        <div className="instructors-grid">
          {instructors.map((instructor, index) => (
            <div key={index} className="instructor-card">
              <div className="instructor-image">
                <span>{instructor.emoji}</span>
              </div>
              <div className="instructor-info">
                <h3 className="instructor-name">{instructor.name}</h3>
                <p className="instructor-title">{instructor.title}</p>
                <div className="instructor-specialties">
                  {instructor.specialties.map((specialty, idx) => (
                    <span key={idx} className="specialty-tag">{specialty}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="yoga-section alternate">
        <div className="section-header">
          <span className="section-tag">Weekly Schedule</span>
          <h2 className="section-title">Join a Class Today</h2>
          <p className="section-description">
            Live virtual classes every day of the week. All times shown in your local timezone. 
            Drop-in anytime or purchase class packages for the best value.
          </p>
        </div>
        <div className="schedule-grid">
          {schedule.map((day, index) => (
            <div key={index} className="schedule-day">
              <div className="schedule-day-header">{day.day}</div>
              <div className="schedule-classes">
                {day.classes.map((classItem, idx) => (
                  <div key={idx} className="schedule-class">
                    <div className="schedule-time">{classItem.time}</div>
                    <div className="schedule-details">
                      <h4>{classItem.name}</h4>
                      <p className="schedule-instructor">with {classItem.instructor}</p>
                    </div>
                    <span className="schedule-level">{classItem.level}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="yoga-cta">
        <h2>Begin Your Yoga Journey Today</h2>
        <p>
          Whether you're new to yoga or deepening an established practice, our comprehensive 
          approach offers the tools, guidance, and community support you need to cultivate 
          balance, strength, and inner peace. Your first class is free.
        </p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn-primary-yoga">
            Start Free Trial
          </Link>
          <Link to="/events" className="btn-secondary-yoga">
            View Class Schedule
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Yoga;
