// src/core/masterSteps.js

export const MASTER_STEPS = [
    {id: 1, key: "awareness", label: "Awareness"},
    {id: 2, key: "identification", label: "Identification"},
    {id: 3, key: "regulation", label: "Regulation"},
    {id: 4, key: "processing", label: "Processing"},
    {id: 5, key: "integration", label: "Integration"},
    {id: 6, key: "action", label: "Action"},
    {id: 7, key: "reflection", label: "Reflection"}
  ];
  
  // Internal mapping of step kinds → master category
  export const STEP_CATEGORY_MAP = {
    check_in: "awareness",
    breath: "regulation",
    meditation: "processing",
    reflection: "reflection",
    movement: "action",
    journaling: "processing",
    intention: "identification"
  };
  
  export const getMasterCategory = (stepKind) => {
    return STEP_CATEGORY_MAP[stepKind] || "awareness";
  };
  