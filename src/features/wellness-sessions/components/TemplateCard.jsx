import React from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { INTENT_METADATA, STEP_KIND_METADATA } from "../../../domain/sessionPlan";
import { TEMPLATE_CATEGORIES } from "../../../data/sessionTemplates";

/**
 * TemplateCard - Display a session template preview
 * 
 * @param {Object} props
 * @param {import("../../../domain/sessionPlan").SessionPlan} props.template
 * @param {Function} props.onStart - Called when user clicks start
 */
const TemplateCard = ({ template, onStart }) => {
  const intentMeta = INTENT_METADATA[template.intent] || INTENT_METADATA.custom;
  const categoryMeta = TEMPLATE_CATEGORIES[template.category];

  // Get step icons
  const stepIcons = template.steps.map(
    (step) => STEP_KIND_METADATA[step.kind]?.icon || "•"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all overflow-hidden group"
    >
      {/* Header */}
      <div className="p-5 pb-4">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${categoryMeta?.color}15`,
              color: categoryMeta?.color,
            }}
          >
            {template.category && categoryMeta?.label}
            {template.difficulty && (
              <span className="opacity-75">• {template.difficulty}</span>
            )}
          </span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${intentMeta.color}20` }}
          >
            <span className="text-lg">{intentMeta.icon}</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {template.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
          {template.aiSummary}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            <span>{template.totalMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{template.steps.length} steps</span>
          </div>
        </div>

        {/* Step Preview */}
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1 text-slate-400">
            {stepIcons.slice(0, 5).map((icon, idx) => (
              <span key={idx} className="text-sm">
                {icon}
              </span>
            ))}
            {stepIcons.length > 5 && (
              <span className="text-xs ml-1">+{stepIcons.length - 5}</span>
            )}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={() => onStart(template)}
        className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 font-medium py-3.5 px-5 flex items-center justify-between transition-all group-hover:bg-indigo-600 group-hover:text-white"
      >
        <span>Start Session</span>
        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </motion.div>
  );
};

export default TemplateCard;
