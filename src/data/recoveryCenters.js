// ============================================
// RECOVERY CENTERS DATA
// ============================================
// Comprehensive database of treatment facilities
// Firestore-ready structure

export const recoveryCenters = [
  {
    id: "center-001",
    name: "Serenity Recovery Center",
    type: "Residential Treatment",
    category: "Inpatient",
    address: {
      street: "123 Recovery Lane",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    contact: {
      phone: "(555) 123-4567",
      email: "info@serenityrecovery.org",
      website: "https://serenityrecovery.org"
    },
    services: [
      "Medical Detox",
      "30-Day Residential",
      "90-Day Extended Care",
      "Dual Diagnosis Treatment",
      "MAT (Medication-Assisted Treatment)",
      "Individual Therapy",
      "Group Therapy",
      "Family Counseling",
      "Aftercare Planning"
    ],
    specialties: [
      "Alcohol Use Disorder",
      "Opioid Addiction",
      "Co-occurring Mental Health",
      "Trauma-Informed Care"
    ],
    insurance: ["Medicaid", "Medicare", "Private Insurance", "Self-Pay"],
    amenities: ["Private Rooms", "Gym", "Meditation Garden", "Nutrition Program"],
    accreditation: ["CARF Accredited", "Joint Commission", "LegitScript Certified"],
    rating: 4.8,
    capacity: 45,
    gender: "All",
    ageRange: "18+",
    languages: ["English", "Spanish"],
    verified: true,
    createdAt: "2024-01-15",
    updatedAt: "2025-01-01"
  },
  {
    id: "center-002",
    name: "Hope Springs IOP",
    type: "Intensive Outpatient Program",
    category: "Outpatient",
    address: {
      street: "456 Wellness Blvd",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    contact: {
      phone: "(555) 987-6543",
      email: "admissions@hopesprings.org",
      website: "https://hopesprings.org"
    },
    services: [
      "IOP (9-12 hours/week)",
      "PHP (20+ hours/week)",
      "Evening Programs",
      "Weekend Groups",
      "Relapse Prevention",
      "Life Skills Training",
      "Employment Support",
      "Peer Support Groups"
    ],
    specialties: [
      "Stimulant Use Disorder",
      "Alcohol Addiction",
      "Young Adults (18-25)",
      "Professionals in Recovery"
    ],
    insurance: ["Medi-Cal", "Blue Cross", "Aetna", "UnitedHealthcare"],
    amenities: ["On-site Parking", "Coffee Bar", "Quiet Rooms", "Tech-Friendly"],
    accreditation: ["State Licensed", "NAADAC Member"],
    rating: 4.6,
    capacity: 60,
    gender: "All",
    ageRange: "18-65",
    languages: ["English", "Spanish", "Mandarin"],
    verified: true,
    createdAt: "2024-03-20",
    updatedAt: "2025-01-05"
  },
  {
    id: "center-003",
    name: "Phoenix Rising Women's Center",
    type: "Gender-Specific Treatment",
    category: "Residential",
    address: {
      street: "789 Healing Way",
      city: "Austin",
      state: "TX",
      zip: "78701",
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    contact: {
      phone: "(555) 456-7890",
      email: "info@phoenixrising.org",
      website: "https://phoenixrising.org"
    },
    services: [
      "Women-Only Program",
      "Trauma-Focused Treatment",
      "Childcare Available",
      "Prenatal/Postnatal Care",
      "Domestic Violence Recovery",
      "EMDR Therapy",
      "Art & Expressive Therapy",
      "Parenting Classes",
      "Job Readiness Training"
    ],
    specialties: [
      "Women's Health",
      "Trauma & PTSD",
      "Maternal Addiction",
      "Sexual Abuse Recovery"
    ],
    insurance: ["Medicaid", "CHIP", "Private Insurance", "Scholarships Available"],
    amenities: ["Childcare", "Private Rooms", "Yoga Studio", "Outdoor Spaces"],
    accreditation: ["CARF Accredited", "Women's Treatment Network"],
    rating: 4.9,
    capacity: 30,
    gender: "Women Only",
    ageRange: "18+",
    languages: ["English", "Spanish"],
    verified: true,
    createdAt: "2024-02-10",
    updatedAt: "2025-01-03"
  },
  {
    id: "center-004",
    name: "Veterans Path Recovery",
    type: "Veterans-Specific Program",
    category: "Residential",
    address: {
      street: "321 Honor Drive",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      coordinates: { lat: 32.7157, lng: -117.1611 }
    },
    contact: {
      phone: "(555) 321-0987",
      email: "vets@veteranspath.org",
      website: "https://veteranspath.org"
    },
    services: [
      "VA-Certified Treatment",
      "PTSD Specialized Care",
      "Combat Trauma Therapy",
      "TBI (Traumatic Brain Injury) Support",
      "Peer Veteran Counseling",
      "Equine Therapy",
      "Vocational Rehabilitation",
      "Benefits Assistance",
      "Military Culture Integration"
    ],
    specialties: [
      "Combat-Related PTSD",
      "Military Sexual Trauma",
      "Dual Diagnosis",
      "Veteran Reintegration"
    ],
    insurance: ["VA Benefits", "TRICARE", "Private Insurance"],
    amenities: ["Veterans-Only Environment", "Recreation Center", "Workshop Space"],
    accreditation: ["VA Certified", "CARF Accredited", "Joint Commission"],
    rating: 4.9,
    capacity: 40,
    gender: "All",
    ageRange: "18+",
    languages: ["English"],
    verified: true,
    createdAt: "2024-01-05",
    updatedAt: "2025-01-02"
  },
  {
    id: "center-005",
    name: "Clarity Adolescent Treatment",
    type: "Youth Treatment",
    category: "Residential",
    address: {
      street: "555 Youth Circle",
      city: "Portland",
      state: "OR",
      zip: "97201",
      coordinates: { lat: 45.5152, lng: -122.6784 }
    },
    contact: {
      phone: "(555) 234-5678",
      email: "admissions@clarityyouth.org",
      website: "https://clarityyouth.org"
    },
    services: [
      "Ages 13-17 Treatment",
      "Academic Support",
      "Family Therapy (Required)",
      "Peer Groups",
      "Adventure Therapy",
      "Technology Addiction Support",
      "Social Skills Training",
      "College Prep Counseling",
      "Aftercare & Alumni Program"
    ],
    specialties: [
      "Adolescent Substance Use",
      "Gaming/Internet Addiction",
      "Teen Depression & Anxiety",
      "School-Related Issues"
    ],
    insurance: ["Medicaid", "CHIP", "Most Private Insurance", "Financial Aid"],
    amenities: ["On-site School", "Sports Facilities", "Art Studio", "Music Room"],
    accreditation: ["State Licensed", "CARF Accredited", "Educational Accreditation"],
    rating: 4.7,
    capacity: 25,
    gender: "All",
    ageRange: "13-17",
    languages: ["English", "Spanish"],
    verified: true,
    createdAt: "2024-04-12",
    updatedAt: "2025-01-04"
  }
];

// ========== HELPER FUNCTIONS ==========

export const getCentersByState = (state) => {
  return recoveryCenters.filter(center => center.address.state === state);
};

export const getCentersByType = (type) => {
  return recoveryCenters.filter(center => center.type === type);
};

export const getCentersByCategory = (category) => {
  return recoveryCenters.filter(center => center.category === category);
};

export const getVerifiedCenters = () => {
  return recoveryCenters.filter(center => center.verified);
};

export const getCentersByInsurance = (insurance) => {
  return recoveryCenters.filter(center => 
    center.insurance.some(ins => ins.toLowerCase().includes(insurance.toLowerCase()))
  );
};

export const getCentersByGender = (gender) => {
  if (gender === 'All') return recoveryCenters;
  return recoveryCenters.filter(center => center.gender === gender || center.gender === 'All');
};

export const searchCenters = (query) => {
  const lowerQuery = query.toLowerCase();
  return recoveryCenters.filter(center =>
    center.name.toLowerCase().includes(lowerQuery) ||
    center.type.toLowerCase().includes(lowerQuery) ||
    center.specialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
    center.services.some(s => s.toLowerCase().includes(lowerQuery))
  );
};

export const getCenterById = (id) => {
  return recoveryCenters.find(center => center.id === id);
};

export const getHighRatedCenters = (minRating = 4.5) => {
  return recoveryCenters.filter(center => center.rating >= minRating);
};

export const getCentersNearby = (lat, lng, radiusMiles = 50) => {
  // Haversine formula for distance calculation
  const toRad = (value) => (value * Math.PI) / 180;
  
  return recoveryCenters.filter(center => {
    const coords = center.address.coordinates;
    const R = 3959; // Earth's radius in miles
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

// ========== METADATA ==========

export const centerTypes = [
  "Residential Treatment",
  "Intensive Outpatient Program",
  "Partial Hospitalization",
  "Gender-Specific Treatment",
  "Veterans-Specific Program",
  "Youth Treatment",
  "Executive/Professional",
  "Faith-Based Program"
];

export const centerCategories = [
  "Inpatient",
  "Outpatient",
  "Residential",
  "Detox",
  "Sober Living",
  "Aftercare"
];

export const commonInsurance = [
  "Medicaid",
  "Medicare",
  "Blue Cross Blue Shield",
  "Aetna",
  "UnitedHealthcare",
  "Cigna",
  "Humana",
  "Kaiser",
  "Private Insurance",
  "Self-Pay"
];

export default recoveryCenters;
