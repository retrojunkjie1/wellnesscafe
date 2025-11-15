// ============================================
// MENTAL HEALTH RESOURCES DATA
// ============================================
// Community mental health services and support
// Firestore-ready structure

export const mentalHealthResources = [
  {
    id: "mh-001",
    name: "NAMI (National Alliance on Mental Illness)",
    type: "Mental Health Advocacy & Support",
    category: "Peer Support",
    contact: {
      phone: "1-800-950-6264",
      phoneDisplay: "1-800-950-NAMI (6264)",
      website: "https://nami.org",
      email: "info@nami.org",
      textLine: "Text NAMI to 741741"
    },
    availability: "Mon-Fri 10am-10pm ET",
    services: [
      "Mental health education",
      "Support groups (free)",
      "Advocacy & policy work",
      "Crisis intervention training",
      "Family-to-Family classes",
      "Peer-to-Peer support",
      "Helpline & resources",
      "Community events"
    ],
    locations: "Nationwide chapters",
    languages: ["English", "Spanish"],
    specialties: [
      "Schizophrenia",
      "Bipolar disorder",
      "Major depression",
      "Anxiety disorders",
      "PTSD",
      "OCD",
      "Borderline personality disorder",
      "Family education"
    ],
    programs: {
      familyToFamily: "12-week education program for family members",
      peerToPeer: "10-week recovery education course",
      endingStigma: "Community presentations and awareness campaigns",
      inOurOwnVoice: "Presentations by people with lived experience"
    },
    cost: "Free support groups and many programs",
    insurance: "Not required for support services",
    target: "Individuals with mental illness and families",
    verified: true,
    rating: 4.8,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "mh-002",
    name: "Mental Health America (MHA)",
    type: "Mental Health Screening & Resources",
    category: "Self-Help & Screening",
    contact: {
      phone: "1-800-969-6642",
      website: "https://mhanational.org",
      screeningTool: "https://screening.mhanational.org"
    },
    availability: "Resources 24/7 online",
    services: [
      "Free mental health screening",
      "Educational resources",
      "Toolkit library",
      "Community programs",
      "Advocacy & policy",
      "Early intervention resources",
      "Workplace mental health",
      "Youth mental health programs"
    ],
    locations: "200+ local affiliates nationwide",
    languages: ["English", "Spanish", "Limited other languages"],
    specialties: [
      "Depression screening",
      "Anxiety assessment",
      "PTSD screening",
      "Bipolar test",
      "Eating disorder screening",
      "ADHD assessment",
      "Parent screening (postpartum)",
      "Youth mental health"
    ],
    programs: {
      screenings: "Anonymous online mental health tests",
      b4stage4: "Early intervention philosophy",
      collegeInitiative: "Campus mental health programs",
      peerServices: "Certified peer specialist training"
    },
    cost: "Free screening and resources",
    insurance: "Not required",
    target: "General public, all ages",
    verified: true,
    rating: 4.7,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "mh-003",
    name: "Psychology Today Therapist Finder",
    type: "Therapist Directory",
    category: "Provider Search",
    contact: {
      website: "https://psychologytoday.com/us/therapists",
      phone: "N/A (Directory only)"
    },
    availability: "24/7 online directory",
    services: [
      "Therapist search by location",
      "Filter by specialty",
      "Filter by insurance",
      "Psychiatrist finder",
      "Support group directory",
      "Treatment center finder",
      "Telehealth options",
      "Read provider profiles"
    ],
    locations: "United States, Canada, International",
    languages: ["Search by provider language"],
    specialties: [
      "All mental health conditions",
      "Specialized therapy types",
      "Age-specific providers",
      "LGBTQ+ affirming",
      "Cultural competency filters",
      "Faith-based counseling",
      "Relationship counseling",
      "Trauma specialists"
    ],
    programs: {
      verifiedProviders: "Licensed mental health professionals",
      filters: "Insurance, specialty, gender, ethnicity, religion",
      teletherapy: "Virtual therapy options"
    },
    cost: "Free to search (provider fees vary)",
    insurance: "Filter by accepted insurance",
    target: "Anyone seeking mental health care",
    verified: true,
    rating: 4.5,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "mh-004",
    name: "Open Path Collective",
    type: "Affordable Therapy Network",
    category: "Low-Cost Therapy",
    contact: {
      website: "https://openpathcollective.org",
      email: "info@openpathcollective.org"
    },
    availability: "Provider schedules vary",
    services: [
      "In-office therapy $30-$80/session",
      "Online therapy $40-$70/session",
      "Lifetime membership ($65 one-time)",
      "No insurance needed",
      "Licensed providers",
      "Individual therapy",
      "Couples counseling",
      "Family therapy"
    ],
    locations: "Nationwide network",
    languages: ["Provider-dependent (many languages available)"],
    specialties: [
      "Depression",
      "Anxiety",
      "Trauma",
      "Relationship issues",
      "Grief & loss",
      "Addiction",
      "LGBTQ+ issues",
      "Life transitions"
    ],
    programs: {
      membershipModel: "$65 lifetime fee for access to reduced-rate providers",
      affordableRates: "30-60% less than standard therapy fees",
      noInsurance: "Direct pay, no insurance hassles"
    },
    cost: "$65 lifetime membership + $30-$80 per session",
    insurance: "Not needed (out-of-pocket affordable rates)",
    target: "Individuals without insurance or high deductibles",
    verified: true,
    rating: 4.6,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "mh-005",
    name: "BetterHelp Online Therapy",
    type: "Teletherapy Platform",
    category: "Online Therapy",
    contact: {
      website: "https://betterhelp.com",
      phone: "N/A (Platform only)"
    },
    availability: "24/7 messaging, scheduled video/phone sessions",
    services: [
      "Licensed therapist matching",
      "Unlimited messaging",
      "Weekly live sessions (video/phone/chat)",
      "Worksheet & activity library",
      "Easy provider switching",
      "Financial assistance available",
      "Mobile app",
      "Encrypted platform"
    ],
    locations: "All 50 US states",
    languages: ["English", "Spanish", "Limited other languages"],
    specialties: [
      "Depression",
      "Anxiety",
      "Relationship issues",
      "Trauma & PTSD",
      "Grief",
      "Stress management",
      "Self-esteem",
      "Family conflicts"
    ],
    programs: {
      financialAid: "Reduced rates for financial hardship",
      couples: "BetterHelp for couples available",
      teens: "Teen Counseling platform (13-17)"
    },
    cost: "$65-$100/week (billed monthly)",
    insurance: "Some insurance plans accepted (FSA/HSA eligible)",
    target: "Adults 18+ seeking convenient therapy",
    verified: true,
    rating: 4.3,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "mh-006",
    name: "Community Mental Health Centers (CMHC)",
    type: "Federally Qualified Health Centers",
    category: "Community Clinics",
    contact: {
      website: "https://findahealthcenter.hrsa.gov",
      phone: "Contact local center"
    },
    availability: "Varies by location (most have extended hours)",
    services: [
      "Sliding scale fees",
      "No insurance required",
      "Psychiatry services",
      "Therapy & counseling",
      "Medication management",
      "Case management",
      "Substance abuse treatment",
      "Crisis services",
      "Peer support",
      "Family services"
    ],
    locations: "1,400+ centers nationwide",
    languages: ["Varies by center (most offer translation)"],
    specialties: [
      "Serious mental illness",
      "Co-occurring disorders",
      "Children & adolescents",
      "Geriatric mental health",
      "Homeless services",
      "Veterans programs",
      "LGBTQ+ affirming care",
      "Cultural competency"
    ],
    programs: {
      slidingScale: "Income-based fee reductions",
      fullServiceCare: "Comprehensive mental health and medical",
      emergencyAccess: "Walk-in and crisis services"
    },
    cost: "Sliding scale based on income (some free)",
    insurance: "Accepts Medicaid, Medicare, most insurance, or self-pay",
    target: "Underserved communities, low-income individuals",
    verified: true,
    rating: 4.4,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "mh-007",
    name: "DBSA (Depression and Bipolar Support Alliance)",
    type: "Peer Support Organization",
    category: "Peer Support",
    contact: {
      phone: "1-800-826-3632",
      website: "https://dbsalliance.org",
      email: "info@dbsalliance.org"
    },
    availability: "Support groups meet regularly",
    services: [
      "Free peer support groups",
      "Online support communities",
      "Educational resources",
      "Wellness tools",
      "Advocacy programs",
      "Conference & events",
      "Mental health education",
      "Family resources"
    ],
    locations: "400+ local chapters nationwide",
    languages: ["English", "Spanish resources available"],
    specialties: [
      "Major depression",
      "Bipolar disorder",
      "Treatment-resistant depression",
      "Mood disorders",
      "Suicide prevention",
      "Medication management support",
      "Family education",
      "Recovery support"
    ],
    programs: {
      supportGroups: "Peer-led, in-person and online",
      wellnessToolbox: "Self-management resources",
      conferences: "Annual patient conferences",
      advocacy: "Public policy and awareness"
    },
    cost: "Free support groups and resources",
    insurance: "Not required",
    target: "Individuals with mood disorders and families",
    verified: true,
    rating: 4.7,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "mh-008",
    name: "Anxiety and Depression Association of America (ADAA)",
    type: "Professional Organization & Resources",
    category: "Education & Provider Search",
    contact: {
      website: "https://adaa.org",
      providerDirectory: "https://adaa.org/finding-help"
    },
    availability: "Resources 24/7 online",
    services: [
      "Evidence-based information",
      "Therapist finder",
      "Support group finder",
      "Educational webinars",
      "Self-help tools",
      "Research articles",
      "Treatment information",
      "Blog & personal stories"
    ],
    locations: "Nationwide provider directory",
    languages: ["English", "Limited Spanish resources"],
    specialties: [
      "Generalized anxiety disorder",
      "Social anxiety",
      "Panic disorder",
      "OCD",
      "PTSD",
      "Phobias",
      "Depression",
      "Co-occurring disorders"
    ],
    programs: {
      findATherapist: "Directory of ADAA members",
      webinars: "Free educational sessions",
      selfHelp: "Evidence-based resources"
    },
    cost: "Free resources (provider fees vary)",
    insurance: "Provider-dependent",
    target: "Individuals with anxiety and depression",
    verified: true,
    rating: 4.6,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  }
];

// ========== HELPER FUNCTIONS ==========

export const getResourcesByCategory = (category) => {
  return mentalHealthResources.filter(resource => resource.category === category);
};

export const getResourcesByType = (type) => {
  return mentalHealthResources.filter(resource => resource.type === type);
};

export const getFreeResources = () => {
  return mentalHealthResources.filter(resource => 
    resource.cost.toLowerCase().includes('free')
  );
};

export const getAffordableResources = () => {
  return mentalHealthResources.filter(resource => 
    resource.cost.toLowerCase().includes('sliding scale') ||
    resource.cost.toLowerCase().includes('affordable') ||
    resource.cost.toLowerCase().includes('low-cost')
  );
};

export const getOnlineResources = () => {
  return mentalHealthResources.filter(resource => 
    resource.type.toLowerCase().includes('online') ||
    resource.type.toLowerCase().includes('teletherapy') ||
    resource.availability.toLowerCase().includes('24/7 online')
  );
};

export const getPeerSupportResources = () => {
  return mentalHealthResources.filter(resource => 
    resource.category === 'Peer Support'
  );
};

export const searchMentalHealthResources = (query) => {
  const lowerQuery = query.toLowerCase();
  return mentalHealthResources.filter(resource =>
    resource.name.toLowerCase().includes(lowerQuery) ||
    resource.type.toLowerCase().includes(lowerQuery) ||
    resource.specialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
    resource.services.some(s => s.toLowerCase().includes(lowerQuery))
  );
};

export const getResourceById = (id) => {
  return mentalHealthResources.find(resource => resource.id === id);
};

export const getVerifiedResources = () => {
  return mentalHealthResources.filter(resource => resource.verified);
};

export const getResourcesBySpecialty = (specialty) => {
  const lowerSpecialty = specialty.toLowerCase();
  return mentalHealthResources.filter(resource =>
    resource.specialties.some(s => s.toLowerCase().includes(lowerSpecialty))
  );
};

// ========== METADATA ==========

export const resourceCategories = [
  "Peer Support",
  "Self-Help & Screening",
  "Provider Search",
  "Low-Cost Therapy",
  "Online Therapy",
  "Community Clinics",
  "Education & Provider Search",
  "Crisis Intervention",
  "Advocacy & Education"
];

export const resourceTypes = [
  "Mental Health Advocacy & Support",
  "Mental Health Screening & Resources",
  "Therapist Directory",
  "Affordable Therapy Network",
  "Teletherapy Platform",
  "Federally Qualified Health Centers",
  "Peer Support Organization",
  "Professional Organization & Resources"
];

export const commonSpecialties = [
  "Depression",
  "Anxiety",
  "Bipolar Disorder",
  "PTSD",
  "OCD",
  "Trauma",
  "Schizophrenia",
  "Eating Disorders",
  "Substance Use Disorders",
  "ADHD",
  "Borderline Personality Disorder",
  "Relationship Issues",
  "Grief & Loss",
  "LGBTQ+ Issues"
];

export default mentalHealthResources;
