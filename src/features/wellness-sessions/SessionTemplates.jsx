// Session Templates - Browse and start pre-built wellness sessions
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { 
  SESSION_TEMPLATES, 
  TEMPLATE_CATEGORIES,
  createSessionFromTemplate 
} from '../../data/sessionTemplates';
import { getAiTemplates } from '../../api/getAiTemplates';
import AiSessionCard from '../../components/AiSessionCard';
import { normalizeAiSessionPlan } from '../../core/ai/convertAiSession';
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
  const [aiTemplates, setAiTemplates] = useState([]);
  const [loadingAI, setLoadingAI] = useState(true);
  const [testResult, setTestResult] = useState(null);

  // Fetch AI templates on mount
  useEffect(() => {
    async function loadAI() {
      setLoadingAI(true);
      const results = await getAiTemplates({
        // later: pass real userId, mood, timeOfDay here
        userId: currentUser?.uid,
        mood: "neutral",
        timeOfDay: "any"
      });
      setAiTemplates(results);
      setLoadingAI(false);
    }
    loadAI();
  }, [currentUser]);

  // Filter templates based on active category
  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') {
      return SESSION_TEMPLATES;
    }
    return SESSION_TEMPLATES.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  // DEBUG: Log filtered templates
  console.log('📋 Filtered templates:', filteredTemplates.length, filteredTemplates);

  // Test function for AI Session endpoint
  const testAiSession = async () => {
    try {
      console.log('🧪 Testing AI Session endpoint...');
      const {callAISession} = await import("../../utils/api");
      const data = await callAISession({
        mode: "templates",
        userId: "test",
        mood: "calm",
        count: 6
      });
      console.log('✅ AI Session Response:', data);
      setTestResult(data);
      return data;
    } catch (err) {
      console.error('❌ AI Session Test Error:', err);
      setTestResult({ error: err.message });
      return null;
    }
  };

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

    let sessionPlan;

    // Check if this is an AI template (has no id or has AI-specific structure)
    if (template.isAi || !template.id || template.summary || template.id?.startsWith('ai-')) {
      // Convert AI template to session plan format
      // If steps is a number, create basic step structure
      let stepsArray = template.steps || [];
      if (typeof template.steps === 'number') {
        // Generate basic steps based on intent
        stepsArray = [
          { kind: "check_in", title: "Check In", order: 1 },
          { kind: "breath", title: "Breathwork", order: 2 },
          { kind: "meditation", title: "Meditation", order: 3 }
        ].slice(0, template.steps);
      }
      
      const normalized = normalizeAiSessionPlan({
        ...template,
        userId: currentUser.uid,
        title: template.title,
        aiSummary: template.summary || template.title,
        totalMinutes: template.minutes || template.totalMinutes || 5,
        steps: stepsArray
      });
      sessionPlan = normalized;
    } else {
      // Regular template - create session from template
      sessionPlan = createSessionFromTemplate(template.id, currentUser.uid);
    }
    
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

      {/* =====================================
           ✨ AI GENERATED SESSIONS SECTION
         ===================================== */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            ✨ AI-Generated Sessions For You
          </h2>
          <button
            onClick={testAiSession}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            🧪 Test Endpoint
          </button>
        </div>
        {testResult && (
          <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-900">🧪 Test Results</h3>
              <button
                onClick={() => setTestResult(null)}
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                ✕ Close
              </button>
            </div>
            {testResult.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 font-semibold mb-2">❌ Error:</div>
                <div className="text-red-700 text-sm">{testResult.error}</div>
              </div>
            ) : (
              <div className="space-y-4">
                {testResult.sessionPlan?.templates && (
                  <div>
                    <div className="text-sm font-semibold text-purple-800 mb-2">
                      ✅ Success! Found {testResult.sessionPlan.templates.length} templates
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mt-3">
                      {testResult.sessionPlan.templates.map((template, idx) => (
                        <div
                          key={template.id || idx}
                          className="p-4 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{template.icon || "✨"}</span>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">
                                {template.title}
                              </div>
                              <div className="text-xs text-purple-600 font-semibold">
                                AI Generated
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                            {template.summary}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{template.steps || 0} steps</span>
                            <span>~{template.minutes || 0} min</span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                              {template.level || "All Levels"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-purple-700 hover:text-purple-900 mb-2">
                    📋 View Raw JSON
                  </summary>
                  <div className="mt-2 p-4 bg-slate-900 rounded-lg overflow-auto max-h-96">
                    <pre className="text-xs text-green-400 font-mono">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </div>
        )}
        {loadingAI && (
          <div className="text-slate-500 text-sm">
            Generating personalized sessions…
          </div>
        )}
        {!loadingAI && aiTemplates.length === 0 && (
          <div className="text-slate-500 text-sm">
            No AI sessions available right now.
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aiTemplates.map((t) => (
            <AiSessionCard 
              key={t.id || t.title}
              template={t}
              onStart={handleStartSession}
            />
          ))}
        </div>
      </div>

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
