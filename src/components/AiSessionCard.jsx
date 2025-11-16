import React from "react";

const AiSessionCard = ({ template, onStart }) => {
  const stepsCount = Array.isArray(template.steps) ? template.steps.length : (template.steps || 3);
  const minutes = template.minutes || template.totalMinutes || 5;
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.4)',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      width: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
        <span style={{fontSize: '1.5rem'}}>{template.icon || "✨"}</span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#9333ea',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          AI Generated
        </span>
      </div>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: '0.5rem',
        margin: 0
      }}>
        {template.title || template.tagline || "Wellness Session"}
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: '#475569',
        marginBottom: '1rem',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {template.summary || template.aiSummary || "A personalized wellness session designed for you."}
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#64748b',
        marginBottom: '1rem'
      }}>
        <span>{stepsCount} steps</span>
        <span>~{minutes} min</span>
      </div>
      <button
        onClick={()=>onStart(template)}
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          backgroundColor: '#9333ea',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#7e22ce'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#9333ea'}
      >
        Start Session
      </button>
    </div>
  );
};

export default AiSessionCard;

