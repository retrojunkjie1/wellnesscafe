import React from "react";

const AiSessionCard = ({ template, onStart }) => {
  return (
    <div className="bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{template.icon || "✨"}</span>
        <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
          AI Generated
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {template.title}
      </h3>
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
        {template.summary}
      </p>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
        <span>{template.steps?.length || 3} steps</span>
        <span>~{template.minutes || 5} min</span>
      </div>
      <button
        onClick={()=>onStart(template)}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        Start Session
      </button>
    </div>
  );
};

export default AiSessionCard;

