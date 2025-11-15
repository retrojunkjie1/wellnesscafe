// Session Templates - Browse and start pre-built wellness sessions
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { 
  SESSION_TEMPLATES, 
  TEMPLATE_CATEGORIES,
  createSessionFromTemplate 
} from '../../data/sessionTemplates';
import './SessionTemplates.css';

// Step type icons mapping
const STEP_ICONS = {
  check_in: '📝',
  breath: '🫁',
  meditation: '🧘',
  journal: '✍️',
  affirmation: '💫',
  visualization: '🔮',
  movement: '🏃',
  gratitude: '🙏',
};

// Category icons
const CATEGORY_ICONS = {
  quick: '⚡',
  morning: '☀️',
  evening: '🌙',
  crisis: '🆘',
  focus: '🎯',
};

const SessionTemplates = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter templates based on active category
  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') {
      return SESSION_TEMPLATES;
    }
    return SESSION_TEMPLATES.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  // DEBUG: Log filtered templates
  console.log('📋 Filtered templates:', filteredTemplates.length, filteredTemplates);

  // Handle starting a session
  const handleStartSession = (template) => {
    // Check authentication
    if (!currentUser) {
      navigate('/login', { 
        state: { from: '/sessions/templates', message: 'Please login to start a session' } 
      });
      return;
    }

    setIsLoading(true);

    // Create session from template
    const sessionPlan = createSessionFromTemplate(template.id, currentUser.uid);
    
    if (!sessionPlan) {
      console.error('Failed to create session from template');
      setIsLoading(false);
      return;
    }

    // Navigate to active session with the plan
    setTimeout(() => {
      navigate('/sessions/active', { 
        state: { sessionPlan } 
      });
      setIsLoading(false);
    }, 300);
  };

  // Render category filter button
  const renderCategoryButton = (key, category) => {
    const isActive = activeCategory === key;
    return (
      <button
        key={key}
        className={`filter-button ${isActive ? 'active' : ''}`}
        onClick={() => setActiveCategory(key)}
        aria-pressed={isActive}
      >
        <span className="filter-icon">{CATEGORY_ICONS[key] || '📋'}</span>
        {category.label}
      </button>
    );
  };

  // Render template card
  const renderTemplateCard = (template) => {
    console.log('🎨 Rendering template card:', template.id, template.title); // DEBUG
    const categoryInfo = TEMPLATE_CATEGORIES[template.category];
    
    return (
      <div key={template.id} className="template-card">
        {/* Card Header */}
        <div className="template-card-header">
          <span className={`template-category-badge ${template.category}`}>
            <span>{CATEGORY_ICONS[template.category]}</span>
            <span>{categoryInfo?.label || template.category}</span>
          </span>
          <span className="template-difficulty">{template.difficulty}</span>
        </div>

        {/* Icon */}
        <div className="template-icon">
          {getTemplateIcon(template)}
        </div>

        {/* Title & Description */}
        <h3 className="template-title">{template.title}</h3>
        <p className="template-description">{template.aiSummary}</p>

        {/* Stats */}
        <div className="template-stats">
          <div className="template-stat">
            <span className="template-stat-icon">⏱️</span>
            <span>{template.totalMinutes} min</span>
          </div>
          <div className="template-stat">
            <span className="template-stat-icon">📊</span>
            <span>{template.steps.length} steps</span>
          </div>
        </div>

        {/* Step Preview Icons */}
        <div className="template-steps-preview">
          {template.steps.map((step, idx) => (
            <div key={idx} className="step-icon" title={step.title || step.kind}>
              {STEP_ICONS[step.kind] || '•'}
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          className="template-start-button"
          onClick={() => handleStartSession(template)}
          disabled={isLoading}
        >
          <span>Start Session</span>
          <span>→</span>
        </button>
      </div>
    );
  };

  // Get template icon based on intent
  const getTemplateIcon = (template) => {
    const intentIcons = {
      calm_anxiety: '😌',
      sleep_reset: '😴',
      morning_reset: '🌅',
      evening_winddown: '🌆',
      grounding: '🌿',
      craving_wave: '🌊',
      custom: '✨',
    };
    return intentIcons[template.intent] || '🔮';
  };

  return (
    <div className="session-templates-page">
      {/* Hero Section */}
      <div className="templates-hero">
        <h1 className="templates-hero-title">Wellness Session Templates</h1>
        <p className="templates-hero-subtitle">
          Pre-built guided sessions ready to start
        </p>
        <p className="templates-hero-description">
          Choose from expertly crafted wellness routines designed for anxiety relief, 
          better sleep, morning energy, crisis support, and focused productivity.
        </p>
      </div>

      {/* Category Filters */}
      <div className="templates-filters">
        <button
          className={`filter-button ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
          aria-pressed={activeCategory === 'all'}
        >
          <span className="filter-icon">📋</span>
          All Templates
        </button>
        {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) =>
          renderCategoryButton(key, category)
        )}
      </div>

      {/* Templates Count */}
      <div className="templates-count">
        <strong>{filteredTemplates.length}</strong> {filteredTemplates.length === 1 ? 'template' : 'templates'} available
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="templates-grid">
          {filteredTemplates.map((template) => renderTemplateCard(template))}
        </div>
      ) : (
        <div className="templates-empty">
          <div className="templates-empty-icon">😔</div>
          <div className="templates-empty-text">No templates found</div>
          <div className="templates-empty-subtext">Try selecting a different category</div>
        </div>
      )}

      {/* Info Section */}
      <div className="templates-info-section">
        <h2 className="templates-info-title">Why Use Session Templates?</h2>
        <div className="templates-info-content">
          <p>
            Our professionally designed session templates provide structured wellness experiences 
            that you can start instantly. Each template combines proven techniques from mindfulness, 
            breathwork, and cognitive behavioral therapy.
          </p>
          <ul className="templates-info-list">
            <li>No setup required - just click and start</li>
            <li>Evidence-based practices for maximum benefit</li>
            <li>Perfect for building consistent wellness habits</li>
            <li>Guided step-by-step through each session</li>
            <li>Track your progress over time</li>
          </ul>
          <p>
            <strong>Pro Tip:</strong> Try different templates to discover which techniques work 
            best for you. Many users find that morning and evening routines create powerful bookends 
            for their day.
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="templates-loading" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div className="templates-loading-spinner" />
        </div>
      )}
    </div>
  );
};

export default SessionTemplates;
