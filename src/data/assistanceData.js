// ============================================
// ASSISTANCE PROGRAMS DATA - CENTRALIZED
// ============================================
// Comprehensive database of federal, state, and wellness resources
// Easily maintainable and ready for Firestore migration

export const assistancePrograms = [
  // ========== FOOD SECURITY ==========
  {
    id: "snap",
    category: "Food Security",
    icon: "🍽️",
    title: "SNAP (Food Stamps)",
    badge: "Food Security",
    description:
      "The Supplemental Nutrition Assistance Program helps families purchase healthy food. In 2024, over 42 million Americans receive SNAP benefits averaging $193 per person monthly.",
    eligibility: [
      "Gross income at or below 130% of poverty line",
      "Net income at or below 100% of poverty line",
      "U.S. citizen or qualified non-citizen",
      "Work requirements for able-bodied adults"
    ],
    links: {
      national: "https://www.fns.usda.gov/snap",
      apply: "https://www.benefits.gov/benefit/361",
      calculator: "https://www.fns.usda.gov/snap/eligibility"
    },
    type: "federal",
    priority: 1
  },
  {
    id: "wic",
    category: "Food Security",
    icon: "👶",
    title: "WIC (Women, Infants & Children)",
    badge: "Food Security",
    description:
      "Provides nutritious foods, nutrition education, and healthcare referrals for pregnant women, new mothers, and children under 5.",
    eligibility: [
      "Pregnant, breastfeeding, or postpartum women",
      "Children under age 5",
      "Income at or below 185% of poverty level",
      "Must be at nutritional risk"
    ],
    links: {
      national: "https://www.fns.usda.gov/wic",
      apply: "https://www.fns.usda.gov/wic/wic-how-apply",
      locator: "https://www.fns.usda.gov/wic/wic-state-agency-contacts"
    },
    type: "federal",
    priority: 2
  },

  // ========== HEALTHCARE ==========
  {
    id: "medicaid",
    category: "Healthcare",
    icon: "🏥",
    title: "Medicaid",
    badge: "Healthcare",
    description:
      "Medicaid provides free or low-cost health coverage to eligible adults, children, pregnant women, elderly adults, and people with disabilities. Coverage includes doctor visits, hospital stays, preventive care, mental health services, and substance abuse treatment.",
    eligibility: [
      "Income at or below 138% of federal poverty level (expansion states)",
      "Pregnant women and children may qualify at higher income levels",
      "Elderly and disabled individuals have different thresholds",
      "Coverage varies by state"
    ],
    links: {
      national: "https://www.medicaid.gov/",
      apply: "https://www.healthcare.gov/medicaid-chip/",
      findState: "https://www.medicaid.gov/state-overviews/"
    },
    type: "federal",
    priority: 1
  },
  {
    id: "medicare",
    category: "Healthcare",
    icon: "🩺",
    title: "Medicare",
    badge: "Healthcare",
    description:
      "Federal health insurance for people 65+, younger people with disabilities, and people with End-Stage Renal Disease.",
    eligibility: [
      "Age 65 or older",
      "Under 65 with certain disabilities",
      "Any age with ESRD or ALS"
    ],
    links: {
      national: "https://www.medicare.gov/",
      apply: "https://www.ssa.gov/benefits/medicare/",
      plans: "https://www.medicare.gov/plan-compare/"
    },
    type: "federal",
    priority: 2
  },
  {
    id: "chip",
    category: "Healthcare",
    icon: "👨‍👩‍👧",
    title: "CHIP (Children's Health Insurance)",
    badge: "Healthcare",
    description:
      "Low-cost health coverage for children in families that earn too much for Medicaid but can't afford private insurance.",
    eligibility: [
      "Children under age 19",
      "Income too high for Medicaid but can't afford private insurance",
      "Income limits vary by state"
    ],
    links: {
      national: "https://www.healthcare.gov/medicaid-chip/childrens-health-insurance-program/",
      apply: "https://www.insurekidsnow.gov/"
    },
    type: "federal",
    priority: 2
  },

  // ========== HOUSING ==========
  {
    id: "section8",
    category: "Housing",
    icon: "🏠",
    title: "Housing Choice Voucher (Section 8)",
    badge: "Housing",
    description:
      "HUD programs including Section 8 Housing Choice Vouchers help low-income families afford safe, decent housing. Wait times vary by location but assistance can cover 70% or more of rent costs.",
    eligibility: [
      "Income at or below 50% of area median income",
      "U.S. citizenship or eligible immigration status",
      "Pass background check (some exceptions)",
      "Local housing authority application required"
    ],
    links: {
      national: "https://www.hud.gov/topics/housing_choice_voucher_program_section_8",
      apply: "https://www.hud.gov/program_offices/public_indian_housing/pha/contacts",
      findPHA: "https://www.hud.gov/program_offices/public_indian_housing/pha/contacts"
    },
    type: "federal",
    priority: 1
  },
  {
    id: "publicHousing",
    category: "Housing",
    icon: "🏘️",
    title: "Public Housing",
    badge: "Housing",
    description:
      "Affordable rental housing for low-income families, elderly, and persons with disabilities through local housing agencies.",
    eligibility: [
      "Income limits vary by area (typically 50-80% of median)",
      "U.S. citizen or eligible immigrant",
      "Meet local housing authority criteria"
    ],
    links: {
      national: "https://www.hud.gov/topics/rental_assistance/phprog",
      apply: "https://www.hud.gov/program_offices/public_indian_housing/pha/contacts"
    },
    type: "federal",
    priority: 2
  },

  // ========== UTILITIES ==========
  {
    id: "liheap",
    category: "Utilities",
    icon: "💡",
    title: "LIHEAP (Utility Assistance)",
    badge: "Utilities",
    description:
      "Low Income Home Energy Assistance Program helps with heating and cooling bills, energy crisis situations, and weatherization. Average assistance is $500-800 annually, with priority for households with elderly, disabled, or young children.",
    eligibility: [
      "Income at or below 150% of poverty level (varies by state)",
      "Priority for households with vulnerable members",
      "Must be responsible for home heating/cooling costs",
      "Crisis assistance available year-round in many states"
    ],
    links: {
      national: "https://www.acf.hhs.gov/ocs/liheap",
      apply: "https://www.acf.hhs.gov/ocs/map/liheap-state-and-territory-contact-listing",
      findLocal: "https://liheapch.acf.hhs.gov/Grantee.htm"
    },
    type: "federal",
    priority: 1
  },
  {
    id: "weatherization",
    category: "Utilities",
    icon: "🏡",
    title: "Weatherization Assistance",
    badge: "Utilities",
    description:
      "Free home energy efficiency improvements including insulation, heating system repairs, and air sealing to reduce energy bills.",
    eligibility: [
      "Income at or below 200% of poverty level",
      "Priority for elderly, disabled, and families with children"
    ],
    links: {
      national: "https://www.energy.gov/scep/wap/weatherization-assistance-program",
      apply: "https://www.energy.gov/scep/wap/how-apply"
    },
    type: "federal",
    priority: 3
  },

  // ========== CHILDCARE & FAMILY ==========
  {
    id: "childcare",
    category: "Childcare",
    icon: "👶",
    title: "Childcare Subsidies (CCDF)",
    badge: "Childcare",
    description:
      "The Child Care and Development Fund (CCDF) helps working families afford childcare through vouchers, reduced copayments, or direct services. Subsidies can cover 70-90% of childcare costs for eligible families.",
    eligibility: [
      "Working, attending school, or in job training",
      "Income varies by state (typically 85% of state median)",
      "Children under 13 (or special needs up to 19)",
      "Immunization and health screening requirements"
    ],
    links: {
      national: "https://www.acf.hhs.gov/occ/map/ccdf-grantees",
      apply: "https://childcare.gov/",
      findLocal: "https://childcare.gov/consumer-education/get-help-paying-for-child-care"
    },
    type: "federal",
    priority: 2
  },
  {
    id: "tanf",
    category: "Cash Assistance",
    icon: "💵",
    title: "TANF (Temporary Cash Assistance)",
    badge: "Cash Assistance",
    description:
      "Temporary Assistance for Needy Families provides cash assistance and support services to help families achieve self-sufficiency.",
    eligibility: [
      "Families with children under 18",
      "Income and resource limits vary by state",
      "Work requirements apply",
      "Time limits on benefits (typically 60 months lifetime)"
    ],
    links: {
      national: "https://www.acf.hhs.gov/ofa/programs/tanf",
      apply: "https://www.acf.hhs.gov/ofa/map/about/state-tribal-territory/tanf-contacts",
      info: "https://www.benefits.gov/benefit/613"
    },
    type: "federal",
    priority: 3
  },

  // ========== VETERANS ==========
  {
    id: "va-benefits",
    category: "Veterans",
    icon: "🎖️",
    title: "VA Benefits",
    badge: "Veterans",
    description:
      "Veterans Affairs provides healthcare, disability compensation, education benefits (GI Bill), home loans, and vocational rehabilitation. Over 9 million veterans receive VA benefits with comprehensive support for service-connected conditions.",
    eligibility: [
      "Honorable discharge from military service",
      "Minimum service requirements vary by benefit",
      "Service-connected disabilities receive priority",
      "Income limits for some healthcare benefits"
    ],
    links: {
      national: "https://www.va.gov/",
      apply: "https://www.va.gov/resources/how-to-apply-for-va-benefits/",
      healthcare: "https://www.va.gov/health-care/",
      disability: "https://www.va.gov/disability/"
    },
    type: "federal",
    priority: 1
  },

  // ========== ADDICTION RECOVERY & WELLNESS ==========
  {
    id: "iop",
    category: "Addiction Recovery",
    icon: "🌿",
    title: "Intensive Outpatient Program (IOP)",
    badge: "Addiction Recovery",
    description:
      "Structured therapy and education for individuals in recovery. Combines group therapy, relapse prevention, and holistic wellness. Typically 9-12 hours per week of treatment while living at home.",
    eligibility: [
      "Diagnosis of substance use or co-occurring disorder",
      "Stable housing or sober living environment",
      "Commitment to 3–5 sessions weekly",
      "Completed detox if medically necessary"
    ],
    links: {
      info: "https://findtreatment.gov/",
      locator: "https://findtreatment.samhsa.gov/",
      samhsa: "https://www.samhsa.gov/find-help/national-helpline"
    },
    type: "wellness",
    priority: 1
  },
  {
    id: "php",
    category: "Addiction Recovery",
    icon: "🧠",
    title: "Partial Hospitalization Program (PHP)",
    badge: "Addiction Recovery",
    description:
      "Daytime structured treatment for addiction recovery and mental health support. Offers therapy, medication management, and relapse prevention. More intensive than IOP with 20+ hours weekly.",
    eligibility: [
      "Diagnosis requiring intensive care but not 24-hour supervision",
      "Ability to participate daily in structured sessions",
      "Medical clearance for participation"
    ],
    links: {
      info: "https://findtreatment.gov/",
      directory: "https://www.samhsa.gov/find-help",
      locator: "https://findtreatment.samhsa.gov/"
    },
    type: "wellness",
    priority: 1
  },
  {
    id: "sober-living",
    category: "Housing & Recovery",
    icon: "🏠",
    title: "Sober Living Homes",
    badge: "Recovery Housing",
    description:
      "Transitional housing for people in early recovery. Provides accountability, community, and structure post-treatment. Peer-run environments with house meetings, drug testing, and recovery support.",
    eligibility: [
      "Commitment to sobriety and abstinence",
      "Compliance with house rules and curfews",
      "Participation in recovery meetings (12-step or alternative)",
      "Employment or active job search (most homes)"
    ],
    links: {
      directory: "https://www.narronline.org/",
      soberLiving: "https://www.recovery.org/topics/sober-living-house/",
      locator: "https://www.samhsa.gov/find-help/recovery-housing"
    },
    type: "wellness",
    priority: 2
  },
  {
    id: "mat",
    category: "Addiction Recovery",
    icon: "💊",
    title: "Medication-Assisted Treatment (MAT)",
    badge: "Addiction Recovery",
    description:
      "Combines FDA-approved medications (Suboxone, Methadone, Naltrexone) with counseling and behavioral therapies for opioid and alcohol use disorders.",
    eligibility: [
      "Diagnosis of opioid or alcohol use disorder",
      "Medical evaluation and screening",
      "Participation in counseling",
      "Covered by most Medicaid and insurance plans"
    ],
    links: {
      locator: "https://www.samhsa.gov/medication-assisted-treatment/find-treatment",
      info: "https://www.samhsa.gov/medication-assisted-treatment",
      buprenorphine: "https://www.samhsa.gov/medication-assisted-treatment/find-treatment/treatment-practitioner-locator"
    },
    type: "wellness",
    priority: 1
  },
  {
    id: "trauma-care",
    category: "Trauma Support",
    icon: "🕊️",
    title: "Trauma & Recovery Services",
    badge: "Mental Health",
    description:
      "Specialized counseling, EMDR, group therapy, and mindfulness-based trauma recovery for adults healing from PTSD, complex trauma, and adverse childhood experiences.",
    eligibility: [
      "Diagnosis or history of trauma",
      "Participation in group or individual sessions",
      "Willingness to engage in evidence-based therapies"
    ],
    links: {
      info: "https://www.nctsn.org/",
      directory: "https://findtreatment.gov/",
      samhsa: "https://www.samhsa.gov/find-help/national-helpline"
    },
    type: "wellness",
    priority: 2
  },
  {
    id: "crisis-support",
    category: "Crisis Intervention",
    icon: "📞",
    title: "988 Suicide & Crisis Lifeline",
    badge: "Emergency Support",
    description:
      "24/7 free and confidential support for people in distress, suicide prevention, and mental health crisis resources. Call, text, or chat available.",
    eligibility: [
      "Anyone experiencing mental health crisis",
      "No insurance or payment required",
      "Available 24/7 nationwide"
    ],
    links: {
      call: "tel:988",
      website: "https://988lifeline.org/",
      chat: "https://988lifeline.org/chat/",
      text: "sms:988"
    },
    type: "wellness",
    priority: 1
  },
  {
    id: "samhsa-helpline",
    category: "Information & Referral",
    icon: "☎️",
    title: "SAMHSA National Helpline",
    badge: "Support Line",
    description:
      "1-800-662-HELP (4357) - Free, confidential, 24/7 treatment referral and information service for substance abuse and mental health.",
    eligibility: [
      "Anyone seeking information or treatment referrals",
      "Available in English and Spanish",
      "No cost, no insurance required"
    ],
    links: {
      call: "tel:1-800-662-4357",
      website: "https://www.samhsa.gov/find-help/national-helpline",
      locator: "https://findtreatment.gov/"
    },
    type: "wellness",
    priority: 1
  }
];

// ========== HELPER FUNCTIONS ==========

/**
 * Get programs by category
 */
export const getProgramsByCategory = (category) => {
  return assistancePrograms.filter(program => program.category === category);
};

/**
 * Get programs by type (federal/wellness)
 */
export const getProgramsByType = (type) => {
  return assistancePrograms.filter(program => program.type === type);
};

/**
 * Get high priority programs
 */
export const getHighPriorityPrograms = () => {
  return assistancePrograms.filter(program => program.priority === 1);
};

/**
 * Search programs by keyword
 */
export const searchPrograms = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  return assistancePrograms.filter(program => 
    program.title.toLowerCase().includes(lowerKeyword) ||
    program.description.toLowerCase().includes(lowerKeyword) ||
    program.category.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * Get program by ID
 */
export const getProgramById = (id) => {
  return assistancePrograms.find(program => program.id === id);
};

/**
 * Get all unique categories
 */
export const getCategories = () => {
  return [...new Set(assistancePrograms.map(program => program.category))];
};

/**
 * Get programs count by category
 */
export const getCategoryStats = () => {
  const stats = {};
  assistancePrograms.forEach(program => {
    stats[program.category] = (stats[program.category] || 0) + 1;
  });
  return stats;
};

// ========== CATEGORY METADATA ==========
export const categoryInfo = {
  "Food Security": {
    description: "Nutrition assistance programs for individuals and families",
    icon: "🍽️",
    color: "#4ade80"
  },
  "Healthcare": {
    description: "Medical coverage and health services",
    icon: "🏥",
    color: "#3b82f6"
  },
  "Housing": {
    description: "Affordable housing and rental assistance",
    icon: "🏠",
    color: "#f59e0b"
  },
  "Utilities": {
    description: "Energy bill assistance and home weatherization",
    icon: "💡",
    color: "#eab308"
  },
  "Childcare": {
    description: "Childcare subsidies and family support",
    icon: "👶",
    color: "#ec4899"
  },
  "Veterans": {
    description: "Benefits and services for military veterans",
    icon: "🎖️",
    color: "#8b5cf6"
  },
  "Addiction Recovery": {
    description: "Treatment programs and recovery support services",
    icon: "🌿",
    color: "#10b981"
  },
  "Housing & Recovery": {
    description: "Sober living and transitional housing",
    icon: "🏡",
    color: "#14b8a6"
  },
  "Trauma Support": {
    description: "Trauma-informed therapy and healing services",
    icon: "🕊️",
    color: "#6366f1"
  },
  "Crisis Intervention": {
    description: "24/7 emergency mental health support",
    icon: "📞",
    color: "#ef4444"
  },
  "Cash Assistance": {
    description: "Temporary financial assistance for families",
    icon: "💵",
    color: "#059669"
  },
  "Information & Referral": {
    description: "Helplines and resource navigation",
    icon: "☎️",
    color: "#0891b2"
  }
};

export default assistancePrograms;
