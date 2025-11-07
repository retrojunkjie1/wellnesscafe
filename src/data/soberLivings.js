// ============================================
// SOBER LIVING HOMES DATA
// ============================================
// Database of verified sober living environments
// Firestore-ready structure

export const soberLivings = [
  {
    id: "sober-001",
    name: "New Horizons Sober Living",
    type: "Structured Sober Living",
    level: "Level 2 - Monitored",
    address: {
      street: "1234 Recovery Road",
      city: "Los Angeles",
      state: "CA",
      zip: "90012",
      neighborhood: "Downtown",
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    contact: {
      phone: "(555) 111-2222",
      email: "info@newhorizonssober.com",
      website: "https://newhorizonssober.com"
    },
    housingDetails: {
      capacity: 12,
      bedrooms: 6,
      bathrooms: 3,
      roomTypes: ["Shared (2-person)", "Shared (3-person)"],
      furnished: true,
      parkingAvailable: true
    },
    pricing: {
      monthlyRent: 850,
      securityDeposit: 500,
      applicationFee: 50,
      utilities: "Included",
      acceptsHousing: ["Section 8", "Housing Vouchers"]
    },
    requirements: {
      minimumSobriety: "30 days",
      drugTesting: "Random weekly",
      meetingsRequired: "5 per week (12-step or alternative)",
      curfew: "11 PM weeknights, 1 AM weekends",
      choresRequired: true,
      employmentRequired: "Within 60 days",
      backgroundCheck: true
    },
    amenities: [
      "Wi-Fi Included",
      "Smart TV in Common Areas",
      "Fully Equipped Kitchen",
      "Laundry On-site",
      "Backyard & BBQ",
      "Gym Equipment",
      "Meditation Room",
      "Bike Storage",
      "Near Public Transit"
    ],
    services: [
      "House Manager On-site",
      "Weekly House Meetings",
      "Peer Accountability",
      "Recovery Support Groups",
      "Job Search Assistance",
      "Life Skills Workshops",
      "Case Management Referrals",
      "Alumni Network"
    ],
    rules: {
      substanceFree: true,
      noVisitorsAfter: "10 PM",
      guestsAllowed: "Day visits with approval",
      petsAllowed: false,
      smokingAllowed: "Designated outdoor area only"
    },
    gender: "Men Only",
    ageRange: "18+",
    lgbtqFriendly: true,
    languages: ["English", "Spanish"],
    rating: 4.7,
    verified: true,
    certification: ["NARR Certified", "State Licensed"],
    createdAt: "2024-02-01",
    updatedAt: "2025-01-06"
  },
  {
    id: "sober-002",
    name: "Serenity House Women's Residence",
    type: "Gender-Specific Sober Living",
    level: "Level 3 - Supervised",
    address: {
      street: "567 Peaceful Ave",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      neighborhood: "North Park",
      coordinates: { lat: 32.7157, lng: -117.1611 }
    },
    contact: {
      phone: "(555) 333-4444",
      email: "admissions@serenityhouse.org",
      website: "https://serenityhouse.org"
    },
    housingDetails: {
      capacity: 8,
      bedrooms: 4,
      bathrooms: 2,
      roomTypes: ["Private Room (+$200/mo)", "Shared (2-person)"],
      furnished: true,
      parkingAvailable: true
    },
    pricing: {
      monthlyRent: 900,
      securityDeposit: 600,
      applicationFee: 75,
      utilities: "Included",
      acceptsHousing: ["CalWORKs", "Section 8", "Scholarships Available"]
    },
    requirements: {
      minimumSobriety: "60 days",
      drugTesting: "Random 2x/week",
      meetingsRequired: "7 per week (IOP program required first 90 days)",
      curfew: "10 PM daily (extended with job proof)",
      choresRequired: true,
      employmentRequired: "Within 90 days",
      backgroundCheck: true
    },
    amenities: [
      "High-Speed Wi-Fi",
      "Smart TVs",
      "Gourmet Kitchen",
      "In-Unit Laundry",
      "Yoga Studio",
      "Garden & Outdoor Seating",
      "Study/Work Spaces",
      "Childcare Referrals",
      "Pet-Friendly (cats/small dogs)"
    ],
    services: [
      "Clinical Director On-site",
      "Daily Check-ins",
      "Weekly Therapy Groups",
      "Trauma-Informed Care",
      "Parenting Support Groups",
      "Career Counseling",
      "Financial Literacy Classes",
      "Transportation Assistance",
      "Alumni Mentorship"
    ],
    rules: {
      substanceFree: true,
      noVisitorsAfter: "9 PM",
      guestsAllowed: "Approved visitors only (no men in bedrooms)",
      petsAllowed: "Cats and small dogs (with deposit)",
      smokingAllowed: "No smoking anywhere on property"
    },
    gender: "Women Only",
    ageRange: "18+",
    childrenAllowed: "Case by case (supervised)",
    lgbtqFriendly: true,
    languages: ["English", "Spanish"],
    rating: 4.9,
    verified: true,
    certification: ["NARR Certified", "CARF Accredited", "Women's Recovery Network"],
    createdAt: "2024-01-20",
    updatedAt: "2025-01-05"
  },
  {
    id: "sober-003",
    name: "Freedom House Co-Ed Community",
    type: "Co-Ed Sober Living",
    level: "Level 2 - Monitored",
    address: {
      street: "890 Liberty Street",
      city: "Austin",
      state: "TX",
      zip: "78701",
      neighborhood: "East Austin",
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    contact: {
      phone: "(555) 555-6666",
      email: "info@freedomhousetx.com",
      website: "https://freedomhousetx.com"
    },
    housingDetails: {
      capacity: 16,
      bedrooms: 8,
      bathrooms: 4,
      roomTypes: ["Shared (2-person)", "Shared (4-person dormitory)"],
      furnished: true,
      parkingAvailable: "Street parking"
    },
    pricing: {
      monthlyRent: 650,
      securityDeposit: 400,
      applicationFee: 35,
      utilities: "Included",
      acceptsHousing: ["Housing Vouchers", "Payment Plans Available"]
    },
    requirements: {
      minimumSobriety: "14 days (with treatment center referral)",
      drugTesting: "Random weekly",
      meetingsRequired: "4 per week (any recovery program)",
      curfew: "Midnight daily",
      choresRequired: true,
      employmentRequired: "Within 45 days",
      backgroundCheck: "Limited (case-by-case)"
    },
    amenities: [
      "Wi-Fi",
      "Cable TV",
      "Community Kitchen",
      "Laundry Facilities",
      "Large Backyard",
      "BBQ Area",
      "Covered Parking (limited)",
      "Bus Line Access",
      "Bike Friendly"
    ],
    services: [
      "House Manager Available",
      "Weekly House Meetings",
      "Peer Support",
      "Community Outings",
      "Job Board",
      "Volunteer Opportunities",
      "Recovery Library",
      "Reentry Support (for formerly incarcerated)"
    ],
    rules: {
      substanceFree: true,
      noVisitorsAfter: "11 PM",
      guestsAllowed: "Common areas only",
      petsAllowed: false,
      smokingAllowed: "Designated outdoor area"
    },
    gender: "Co-Ed (Separate wings)",
    ageRange: "18+",
    lgbtqFriendly: true,
    languages: ["English", "Spanish"],
    rating: 4.5,
    verified: true,
    certification: ["State Licensed", "NARR Affiliate"],
    createdAt: "2024-03-15",
    updatedAt: "2025-01-03"
  },
  {
    id: "sober-004",
    name: "Veterans Recovery Residence",
    type: "Veterans-Specific",
    level: "Level 2 - Monitored",
    address: {
      street: "432 Service Drive",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      neighborhood: "Mission District",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    contact: {
      phone: "(555) 777-8888",
      email: "vets@recoveryresidence.org",
      website: "https://veteransrecoveryresidence.org"
    },
    housingDetails: {
      capacity: 10,
      bedrooms: 5,
      bathrooms: 3,
      roomTypes: ["Private Room", "Shared (2-person)"],
      furnished: true,
      parkingAvailable: true
    },
    pricing: {
      monthlyRent: 800,
      securityDeposit: 400,
      applicationFee: 0,
      utilities: "Included",
      acceptsHousing: ["VA Vouchers", "SSVF", "HUD-VASH", "GPD"]
    },
    requirements: {
      minimumSobriety: "30 days",
      drugTesting: "Random weekly",
      meetingsRequired: "5 per week (veteran-focused preferred)",
      curfew: "None (accountability-based)",
      choresRequired: true,
      employmentRequired: "Actively seeking or enrolled in VA services",
      backgroundCheck: "VA verification required"
    },
    amenities: [
      "High-Speed Wi-Fi",
      "TV & Gaming Room",
      "Full Kitchen",
      "Laundry On-site",
      "Outdoor Patio",
      "Gym Equipment",
      "Computer Lab",
      "Veterans Resource Library",
      "Secure Parking"
    ],
    services: [
      "Veteran House Manager",
      "VA Benefits Coordination",
      "Weekly Veteran Groups",
      "PTSD Peer Support",
      "Job Placement Assistance",
      "Education Benefits Help",
      "Transportation to VA Appointments",
      "Military Culture Environment",
      "Combat Veteran Mentors"
    ],
    rules: {
      substanceFree: true,
      noVisitorsAfter: "10 PM",
      guestsAllowed: "Pre-approved visits",
      petsAllowed: "Service animals only",
      smokingAllowed: "Designated outdoor area"
    },
    gender: "All Veterans",
    ageRange: "18+",
    lgbtqFriendly: true,
    languages: ["English"],
    rating: 4.8,
    verified: true,
    certification: ["NARR Certified", "VA Approved", "SSVF Partner"],
    createdAt: "2024-02-10",
    updatedAt: "2025-01-04"
  },
  {
    id: "sober-005",
    name: "Young Adults Recovery Home",
    type: "Age-Specific (Young Adults)",
    level: "Level 2 - Monitored",
    address: {
      street: "789 Youth Way",
      city: "Portland",
      state: "OR",
      zip: "97201",
      neighborhood: "Pearl District",
      coordinates: { lat: 45.5152, lng: -122.6784 }
    },
    contact: {
      phone: "(555) 999-0000",
      email: "info@youngadultsrecovery.org",
      website: "https://youngadultsrecovery.org"
    },
    housingDetails: {
      capacity: 10,
      bedrooms: 5,
      bathrooms: 2,
      roomTypes: ["Shared (2-person)"],
      furnished: true,
      parkingAvailable: "Limited street parking"
    },
    pricing: {
      monthlyRent: 700,
      securityDeposit: 500,
      applicationFee: 50,
      utilities: "Included",
      acceptsHousing: ["Parent/Guardian Co-sign", "Scholarships Available"]
    },
    requirements: {
      minimumSobriety: "30 days",
      drugTesting: "Random 2x/week",
      meetingsRequired: "5 per week (must include young adult meetings)",
      curfew: "11 PM weeknights, 1 AM weekends",
      choresRequired: true,
      employmentRequired: "School, work, or volunteer within 60 days",
      backgroundCheck: true
    },
    amenities: [
      "Gigabit Wi-Fi",
      "Gaming Consoles",
      "Modern Kitchen",
      "Laundry",
      "Rooftop Deck",
      "Workout Area",
      "Co-Working Spaces",
      "Music Practice Room",
      "Bike Storage"
    ],
    services: [
      "Young Adult House Manager",
      "Weekly Life Skills Groups",
      "Peer Mentorship",
      "College/Career Counseling",
      "Social Events (sober)",
      "Adventure Therapy Outings",
      "Technology Balance Support",
      "Family Therapy Referrals",
      "Dating in Recovery Workshops"
    ],
    rules: {
      substanceFree: true,
      noVisitorsAfter: "10 PM weeknights, 12 AM weekends",
      guestsAllowed: "Common areas with permission",
      petsAllowed: false,
      smokingAllowed: "No smoking or vaping"
    },
    gender: "Co-Ed (Separate floors)",
    ageRange: "18-30",
    lgbtqFriendly: true,
    languages: ["English"],
    rating: 4.6,
    verified: true,
    certification: ["NARR Certified", "Young Adult Recovery Network"],
    createdAt: "2024-04-01",
    updatedAt: "2025-01-02"
  }
];

// ========== HELPER FUNCTIONS ==========

export const getSoberLivingsByState = (state) => {
  return soberLivings.filter(home => home.address.state === state);
};

export const getSoberLivingsByGender = (gender) => {
  if (gender === 'All' || gender === 'Co-Ed') return soberLivings;
  return soberLivings.filter(home => 
    home.gender === gender || home.gender.includes('Co-Ed')
  );
};

export const getSoberLivingsByPrice = (maxPrice) => {
  return soberLivings.filter(home => home.pricing.monthlyRent <= maxPrice);
};

export const getSoberLivingsByLevel = (level) => {
  return soberLivings.filter(home => home.level.includes(level));
};

export const getVerifiedSoberLivings = () => {
  return soberLivings.filter(home => home.verified);
};

export const getNARRCertified = () => {
  return soberLivings.filter(home => 
    home.certification.some(cert => cert.includes('NARR'))
  );
};

export const getSoberLivingsAcceptingVouchers = () => {
  return soberLivings.filter(home => 
    home.pricing.acceptsHousing && home.pricing.acceptsHousing.length > 0
  );
};

export const searchSoberLivings = (query) => {
  const lowerQuery = query.toLowerCase();
  return soberLivings.filter(home =>
    home.name.toLowerCase().includes(lowerQuery) ||
    home.type.toLowerCase().includes(lowerQuery) ||
    home.amenities.some(a => a.toLowerCase().includes(lowerQuery)) ||
    home.services.some(s => s.toLowerCase().includes(lowerQuery))
  );
};

export const getSoberLivingById = (id) => {
  return soberLivings.find(home => home.id === id);
};

export const getHighRatedSoberLivings = (minRating = 4.5) => {
  return soberLivings.filter(home => home.rating >= minRating);
};

export const getSoberLivingsNearby = (lat, lng, radiusMiles = 25) => {
  const toRad = (value) => (value * Math.PI) / 180;
  
  return soberLivings.filter(home => {
    const coords = home.address.coordinates;
    const R = 3959;
    const dLat = toRad(coords.lat - lat);
    const dLon = toRad(coords.lng - lng);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) * Math.cos(toRad(coords.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= radiusMiles;
  });
};

export const getLGBTQFriendly = () => {
  return soberLivings.filter(home => home.lgbtqFriendly);
};

export const getPetFriendly = () => {
  return soberLivings.filter(home => home.rules.petsAllowed && home.rules.petsAllowed !== false);
};

// ========== METADATA ==========

export const soberLivingTypes = [
  "Structured Sober Living",
  "Gender-Specific Sober Living",
  "Co-Ed Sober Living",
  "Veterans-Specific",
  "Age-Specific (Young Adults)",
  "LGBTQ+ Specific",
  "Faith-Based",
  "Luxury Sober Living"
];

export const soberLivingLevels = [
  "Level 1 - Peer-Run",
  "Level 2 - Monitored",
  "Level 3 - Supervised",
  "Level 4 - Service Provider"
];

export const commonHousingVouchers = [
  "Section 8",
  "HUD-VASH (Veterans)",
  "SSVF (Veterans)",
  "GPD (Veterans)",
  "CalWORKs",
  "Housing Vouchers",
  "Rapid Re-Housing",
  "Transitional Housing Vouchers"
];

export default soberLivings;
