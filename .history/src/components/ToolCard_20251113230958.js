import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';

export default function ToolCard({ 
  title, 
  description, 
  icon, 
  path, 
  isPremium = false, 
  isLocked = false,
  gradient = 'from-orange-500 to-yellow-500'
}) {
  const content = (
    <div className={`relative h-full rounded-2xl border border-orange-500/20 p-6 backdrop-blur overflow-hidden group transition-all duration-300 ${
      isLocked 
        ? 'bg-slate-800/30 cursor-not-allowed opacity-60' 
        : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer'
    }`}>
      
      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl mb-3">{icon}</div>
          {isPremium && (
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border border-amber-400/50 text-xs font-semibold text-amber-200">
              Premium
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-orange-500/10 group-hover:border-orange-400/30 transition-colors">
          <span className="text-xs font-medium text-gray-400 group-hover:text-orange-300 transition-colors">
            {isLocked ? 'Upgrade to access' : 'Open Tool'}
          </span>
          {isLocked ? (
            <Lock size={16} className="text-gray-500" />
          ) : (
            <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-400 transition-all group-hover:translate-x-1" />
          )}
        </div>
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <Lock size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-300">Premium Feature</p>
          </div>
        </div>
      )}
    </div>
  );

  // If locked, don't make it a link
  if (isLocked) {
    return (
      <Link to="/upgrade" className="block">
        {content}
      </Link>
    );
  }

  // Otherwise, link to the tool path
  return (
    <Link to={path} className="block">
      {content}
    </Link>
  );
}