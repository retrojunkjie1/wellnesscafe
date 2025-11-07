// ============================================
// CRISIS HOTLINES & MENTAL HEALTH RESOURCES
// ============================================
// 24/7 crisis support and mental health services
// Firestore-ready structure

export const crisisHotlines = [
  {
    id: "crisis-001",
    name: "988 Suicide & Crisis Lifeline",
    type: "National Crisis Line",
    category: "Suicide Prevention",
    contact: {
      phone: "988",
      phoneDisplay: "988 (call or text)",
      international: "1-800-273-8255",
      website: "https://988lifeline.org",
      chat: "https://988lifeline.org/chat"
    },
    availability: "24/7/365",
    services: [
      "Suicide prevention",
      "Crisis counseling",
      "Emotional support",
      "Mental health resources",
      "Referrals to local services",
      "Follow-up care coordination"
    ],
    languages: ["English", "Spanish", "200+ languages via interpreter"],
    specialties: [
      "Suicide ideation",
      "Self-harm",
      "Mental health crisis",
      "Substance abuse crisis",
      "Trauma response"
    ],
    accessibility: {
      tty: "Use your preferred relay service or dial 711 then 988",
      deaf: "ASL video phone available",
      veterans: "Press 1 for Veterans Crisis Line"
    },
    target: "All ages",
    free: true,
    confidential: true,
    certified: ["SAMHSA Certified", "National Suicide Prevention Lifeline Network"],
    rating: 5.0,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "crisis-002",
    name: "Crisis Text Line",
    type: "Text-Based Crisis Support",
    category: "Mental Health Crisis",
    contact: {
      phone: "Text HOME to 741741",
      phoneDisplay: "Text: 741741",
      website: "https://crisistextline.org",
      international: "Available in US, Canada, UK, Ireland"
    },
    availability: "24/7/365",
    services: [
      "Anonymous text support",
      "Crisis counseling via SMS",
      "De-escalation techniques",
      "Safety planning",
      "Resource referrals",
      "No judgment, just help"
    ],
    languages: ["English", "Spanish (text 'HOLA' to 741741)"],
    specialties: [
      "Anxiety",
      "Depression",
      "Suicidal thoughts",
      "Self-harm",
      "Relationship issues",
      "LGBTQ+ support",
      "Bullying",
      "Eating disorders"
    ],
    accessibility: {
      textOnly: true,
      averageResponseTime: "Under 5 minutes"
    },
    target: "All ages (especially youth)",
    free: true,
    confidential: true,
    certified: ["SAMHSA Approved", "Nancy Lublin Foundation"],
    rating: 4.9,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "crisis-003",
    name: "SAMHSA National Helpline",
    type: "Substance Abuse Treatment Referral",
    category: "Addiction Support",
    contact: {
      phone: "1-800-662-4357",
      phoneDisplay: "1-800-662-HELP (4357)",
      website: "https://samhsa.gov/find-help/national-helpline",
      tty: "1-800-487-4889"
    },
    availability: "24/7/365",
    services: [
      "Treatment facility referrals",
      "Support group information",
      "Community-based organizations",
      "Information on mental health and substance use",
      "Local resources",
      "Insurance guidance"
    ],
    languages: ["English", "Spanish"],
    specialties: [
      "Substance use disorders",
      "Alcohol addiction",
      "Drug addiction",
      "Mental health disorders",
      "Co-occurring disorders",
      "Treatment navigation"
    ],
    accessibility: {
      tty: "1-800-487-4889",
      deaf: "TTY available"
    },
    target: "Individuals and family members",
    free: true,
    confidential: true,
    certified: ["SAMHSA Official", "Federal Government Resource"],
    rating: 4.8,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "crisis-004",
    name: "National Domestic Violence Hotline",
    type: "Domestic Violence Support",
    category: "Domestic Violence",
    contact: {
      phone: "1-800-799-7233",
      phoneDisplay: "1-800-799-SAFE (7233)",
      text: "Text START to 88788",
      website: "https://thehotline.org",
      chat: "https://thehotline.org/chat"
    },
    availability: "24/7/365",
    services: [
      "Crisis intervention",
      "Safety planning",
      "Emergency shelter information",
      "Legal advocacy referrals",
      "Emotional support",
      "Resources for abusers seeking help"
    ],
    languages: ["English", "Spanish", "200+ languages via interpreter"],
    specialties: [
      "Intimate partner violence",
      "Emotional abuse",
      "Physical abuse",
      "Sexual abuse",
      "Financial abuse",
      "Digital abuse",
      "Stalking"
    ],
    accessibility: {
      tty: "1-800-787-3224",
      videophone: "855-812-1001"
    },
    target: "Survivors of domestic violence and concerned parties",
    free: true,
    confidential: true,
    certified: ["National Coalition Against Domestic Violence", "HHS Funded"],
    rating: 4.9,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "crisis-005",
    name: "Veterans Crisis Line",
    type: "Veterans Mental Health Support",
    category: "Veterans Support",
    contact: {
      phone: "988 (Press 1)",
      phoneDisplay: "988 then Press 1",
      text: "Text 838255",
      website: "https://veteranscrisisline.net",
      chat: "https://veteranscrisisline.net/chat"
    },
    availability: "24/7/365",
    services: [
      "Confidential crisis support",
      "Suicide prevention",
      "PTSD support",
      "TBI resources",
      "VA healthcare navigation",
      "Military family support"
    ],
    languages: ["English", "Spanish", "Other languages via interpreter"],
    specialties: [
      "Combat-related PTSD",
      "Military sexual trauma",
      "Veteran suicide prevention",
      "Transition stress",
      "Service-connected disabilities",
      "Military family issues"
    ],
    accessibility: {
      tty: "1-800-799-4889",
      deaf: "TTY available"
    },
    target: "Veterans, service members, National Guard, Reservists, families",
    free: true,
    confidential: true,
    certified: ["VA Official", "DOD Supported"],
    rating: 4.9,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "crisis-006",
    name: "Trevor Project Lifeline",
    type: "LGBTQ+ Youth Support",
    category: "LGBTQ+ Crisis",
    contact: {
      phone: "1-866-488-7386",
      phoneDisplay: "1-866-488-7386",
      text: "Text START to 678678",
      website: "https://thetrevorproject.org",
      chat: "https://thetrevorproject.org/chat"
    },
    availability: "24/7/365",
    services: [
      "LGBTQ+ crisis intervention",
      "Suicide prevention",
      "Coming out support",
      "Identity exploration",
      "Family conflict mediation",
      "Resource referrals"
    ],
    languages: ["English", "Spanish"],
    specialties: [
      "LGBTQ+ youth crisis",
      "Gender identity",
      "Sexual orientation",
      "Coming out struggles",
      "Family rejection",
      "Bullying & harassment",
      "Conversion therapy trauma"
    ],
    accessibility: {
      chat: "Preferred for deaf/HOH",
      text: "SMS available"
    },
    target: "LGBTQ+ youth under 25",
    free: true,
    confidential: true,
    certified: ["The Trevor Project", "LGBTQ+ Crisis Center"],
    rating: 4.9,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "crisis-007",
    name: "RAINN National Sexual Assault Hotline",
    type: "Sexual Assault Support",
    category: "Sexual Violence",
    contact: {
      phone: "1-800-656-4673",
      phoneDisplay: "1-800-656-HOPE (4673)",
      website: "https://rainn.org",
      chat: "https://hotline.rainn.org/online"
    },
    availability: "24/7/365",
    services: [
      "Crisis counseling",
      "Sexual assault survivor support",
      "Local healthcare referrals",
      "Law enforcement guidance",
      "Legal advocacy information",
      "Long-term therapy referrals"
    ],
    languages: ["English", "Spanish"],
    specialties: [
      "Sexual assault",
      "Rape",
      "Child sexual abuse",
      "Incest",
      "Sexual harassment",
      "Forensic exam support",
      "Reporting assistance"
    ],
    accessibility: {
      chat: "Available for deaf/HOH"
    },
    target: "Sexual assault survivors and loved ones",
    free: true,
    confidential: true,
    certified: ["RAINN Official", "National Partnership with 1000+ local centers"],
    rating: 4.8,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "crisis-008",
    name: "Trans Lifeline",
    type: "Transgender Support",
    category: "Transgender Crisis",
    contact: {
      phone: "1-877-565-8860",
      phoneDisplay: "1-877-565-8860 (US), 1-877-330-6366 (Canada)",
      website: "https://translifeline.org"
    },
    availability: "24/7/365",
    services: [
      "Peer support by trans people",
      "Crisis intervention",
      "Gender identity support",
      "Transition guidance",
      "Family issues",
      "Non-judgmental space"
    ],
    languages: ["English", "Spanish", "Other languages when available"],
    specialties: [
      "Transgender crisis support",
      "Gender dysphoria",
      "Coming out",
      "Medical transition support",
      "Discrimination & violence",
      "Family rejection",
      "Suicidal ideation"
    ],
    accessibility: {
      staffedByTransPeople: true,
      noActiveRescue: "Non-intervention policy (won't call police without consent)"
    },
    target: "Transgender and questioning individuals",
    free: true,
    confidential: true,
    certified: ["Trans-Led Organization", "Community Supported"],
    rating: 4.9,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "crisis-009",
    name: "National Eating Disorders Association Helpline",
    type: "Eating Disorder Support",
    category: "Eating Disorders",
    contact: {
      phone: "1-800-931-2237",
      phoneDisplay: "1-800-931-2237",
      text: "Text NEDA to 741741",
      website: "https://nationaleatingdisorders.org",
      chat: "Online chat available"
    },
    availability: "Mon-Thu 9am-9pm ET, Fri 9am-5pm ET",
    services: [
      "Eating disorder support",
      "Treatment referrals",
      "Support group information",
      "Insurance guidance",
      "Recovery resources",
      "Family support"
    ],
    languages: ["English", "Spanish"],
    specialties: [
      "Anorexia nervosa",
      "Bulimia nervosa",
      "Binge eating disorder",
      "ARFID",
      "Orthorexia",
      "Body dysmorphia",
      "Exercise addiction"
    ],
    accessibility: {
      chat: "Preferred for deaf/HOH",
      text: "24/7 via Crisis Text Line partnership"
    },
    target: "Individuals with eating disorders and loved ones",
    free: true,
    confidential: true,
    certified: ["NEDA Official", "National Eating Disorders Organization"],
    rating: 4.7,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  },
  {
    id: "crisis-010",
    name: "Disaster Distress Helpline",
    type: "Disaster Mental Health",
    category: "Disaster Response",
    contact: {
      phone: "1-800-985-5990",
      phoneDisplay: "1-800-985-5990",
      text: "Text TalkWithUs to 66746",
      website: "https://samhsa.gov/disaster-preparedness"
    },
    availability: "24/7/365",
    services: [
      "Disaster-related distress support",
      "Trauma counseling",
      "Natural disaster response",
      "Pandemic support",
      "Community crisis intervention",
      "Local mental health referrals"
    ],
    languages: ["English", "Spanish", "100+ languages via interpreter"],
    specialties: [
      "Natural disaster trauma",
      "Community violence",
      "Pandemic stress",
      "Mass casualty events",
      "Environmental disasters",
      "Terrorism response"
    ],
    accessibility: {
      tty: "1-800-846-8517"
    },
    target: "Anyone experiencing distress related to disasters",
    free: true,
    confidential: true,
    certified: ["SAMHSA Official", "Federal Emergency Management"],
    rating: 4.6,
    verified: true,
    createdAt: "2024-01-01",
    updatedAt: "2025-01-01"
  }
];

// ========== HELPER FUNCTIONS ==========

export const getHotlinesByCategory = (category) => {
  return crisisHotlines.filter(hotline => hotline.category === category);
};

export const getHotlinesByType = (type) => {
  return crisisHotlines.filter(hotline => hotline.type === type);
};

export const get24x7Hotlines = () => {
  return crisisHotlines.filter(hotline => hotline.availability === "24/7/365");
};

export const getTextEnabledHotlines = () => {
  return crisisHotlines.filter(hotline => hotline.contact.text);
};

export const getChatEnabledHotlines = () => {
  return crisisHotlines.filter(hotline => hotline.contact.chat);
};

export const getHotlinesByLanguage = (language) => {
  return crisisHotlines.filter(hotline => 
    hotline.languages.some(lang => lang.toLowerCase().includes(language.toLowerCase()))
  );
};

export const searchHotlines = (query) => {
  const lowerQuery = query.toLowerCase();
  return crisisHotlines.filter(hotline =>
    hotline.name.toLowerCase().includes(lowerQuery) ||
    hotline.category.toLowerCase().includes(lowerQuery) ||
    hotline.specialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
    hotline.services.some(s => s.toLowerCase().includes(lowerQuery))
  );
};

export const getHotlineById = (id) => {
  return crisisHotlines.find(hotline => hotline.id === id);
};

export const getVerifiedHotlines = () => {
  return crisisHotlines.filter(hotline => hotline.verified);
};

export const getFreeHotlines = () => {
  return crisisHotlines.filter(hotline => hotline.free);
};

export const getYouthHotlines = () => {
  return crisisHotlines.filter(hotline => 
    hotline.target.toLowerCase().includes('youth') || 
    hotline.target.toLowerCase().includes('under 25')
  );
};

export const getVeteranHotlines = () => {
  return crisisHotlines.filter(hotline => 
    hotline.category === 'Veterans Support' ||
    hotline.target.toLowerCase().includes('veteran')
  );
};

export const getLGBTQHotlines = () => {
  return crisisHotlines.filter(hotline => 
    hotline.category.includes('LGBTQ') ||
    hotline.specialties.some(s => s.toLowerCase().includes('lgbtq'))
  );
};

// ========== METADATA ==========

export const hotlineCategories = [
  "Suicide Prevention",
  "Mental Health Crisis",
  "Addiction Support",
  "Domestic Violence",
  "Veterans Support",
  "LGBTQ+ Crisis",
  "Sexual Violence",
  "Transgender Crisis",
  "Eating Disorders",
  "Disaster Response",
  "Child Abuse",
  "Elder Abuse"
];

export const hotlineTypes = [
  "National Crisis Line",
  "Text-Based Crisis Support",
  "Substance Abuse Treatment Referral",
  "Domestic Violence Support",
  "Veterans Mental Health Support",
  "LGBTQ+ Youth Support",
  "Sexual Assault Support",
  "Transgender Support",
  "Eating Disorder Support",
  "Disaster Mental Health"
];

export const communicationMethods = [
  "Phone",
  "Text/SMS",
  "Online Chat",
  "Video Phone",
  "TTY/TDD",
  "Email (non-urgent)"
];

export default crisisHotlines;
