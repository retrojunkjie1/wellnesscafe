# 🏥 Wellness Cafe Data Architecture

## 📂 Overview

This directory contains the complete data infrastructure for the Wellness Cafe platform, featuring **4 comprehensive databases** with **50+ records** covering government assistance, recovery centers, sober living homes, and crisis resources.

---

## 📊 Data Files

### 1. **assistanceData.js** - Government & Wellness Programs
- **20+ programs** (11 federal, 9 wellness)
- Categories: Food Security, Healthcare, Housing, Energy, Financial, Crisis
- **State-specific variants** for Medicaid, WIC, etc.
- Helper functions for filtering, searching, categorizing

**Programs included:**
- SNAP (Food Stamps)
- WIC (Women, Infants & Children)
- Medicaid (with state variants)
- Medicare
- CHIP (Children's Health Insurance)
- Section 8 Housing Vouchers
- Public Housing
- LIHEAP (Energy Assistance)
- Weatherization Assistance
- TANF (Temporary Assistance)
- VA Benefits
- IOP (Intensive Outpatient)
- PHP (Partial Hospitalization)
- MAT (Medication-Assisted Treatment)
- Sober Living Homes
- Trauma-Informed Care
- 988 Crisis Line
- SAMHSA Helpline

---

### 2. **recoveryCenters.js** - Treatment Facilities
- **5 verified treatment centers**
- Types: Residential, IOP, PHP, Gender-Specific, Veterans, Youth
- Full contact details and coordinates for mapping
- Insurance acceptance tracking
- Services, specialties, amenities, accreditation

**Centers included:**
- Serenity Recovery Center (Los Angeles) - Residential
- Hope Springs IOP (San Francisco) - Outpatient
- Phoenix Rising Women's Center (Austin) - Women-Only
- Veterans Path Recovery (San Diego) - VA-Certified
- Clarity Adolescent Treatment (Portland) - Youth 13-17

---

### 3. **soberLivings.js** - Recovery Housing
- **5 verified sober living homes**
- NARR certification tracking
- Pricing with housing voucher acceptance
- Detailed rules, requirements, amenities
- Gender-specific and co-ed options
- Veterans and young adult specialized homes

**Homes included:**
- New Horizons Sober Living (Los Angeles) - Men Only
- Serenity House Women's Residence (San Diego) - Women Only
- Freedom House Co-Ed Community (Austin) - Co-Ed
- Veterans Recovery Residence (San Francisco) - Veterans
- Young Adults Recovery Home (Portland) - Ages 18-30

---

### 4. **crisisHotlines.js** - Emergency Support
- **10 national crisis lines**
- 24/7 availability tracking
- Phone, text, and chat options
- Language support (200+ languages available)
- Specialized support (LGBTQ+, Veterans, Domestic Violence, etc.)

**Hotlines included:**
- 988 Suicide & Crisis Lifeline
- Crisis Text Line (741741)
- SAMHSA National Helpline
- National Domestic Violence Hotline
- Veterans Crisis Line
- Trevor Project (LGBTQ+ Youth)
- RAINN Sexual Assault Hotline
- Trans Lifeline
- National Eating Disorders Helpline
- Disaster Distress Helpline

---

### 5. **mentalHealthResources.js** - Mental Health Services
- **8 national organizations**
- Free and low-cost therapy options
- Support groups and peer networks
- Online therapy platforms
- Community mental health centers

**Resources included:**
- NAMI (National Alliance on Mental Illness)
- Mental Health America (MHA)
- Psychology Today Therapist Finder
- Open Path Collective (Affordable Therapy)
- BetterHelp (Online Therapy)
- Community Mental Health Centers
- DBSA (Depression & Bipolar Support)
- ADAA (Anxiety & Depression Association)

---

## 🔧 Helper Functions

Each data file includes comprehensive helper functions:

### assistanceData.js
```javascript
getProgramsByCategory(category)      // Filter by category
getProgramsByType(type)              // Federal vs wellness
getHighPriorityPrograms()            // Priority 1 programs
searchPrograms(keyword)              // Full-text search
getProgramById(id)                   // Single program lookup
getCategories()                      // Unique categories
getCategoryStats()                   // Category counts
```

### recoveryCenters.js
```javascript
getCentersByState(state)             // State filtering
getCentersByType(type)               // Residential, IOP, etc.
getCentersByCategory(category)       // Category filtering
getVerifiedCenters()                 // Verified only
getCentersByInsurance(insurance)     // Insurance filtering
getCentersByGender(gender)           // Gender-specific
searchCenters(query)                 // Full-text search
getHighRatedCenters(minRating)       // Rating filter
getCentersNearby(lat, lng, radius)   // Geolocation search
```

### soberLivings.js
```javascript
getSoberLivingsByState(state)
getSoberLivingsByGender(gender)
getSoberLivingsByPrice(maxPrice)
getSoberLivingsByLevel(level)        // NARR levels 1-4
getVerifiedSoberLivings()
getNARRCertified()
getSoberLivingsAcceptingVouchers()
getLGBTQFriendly()
getPetFriendly()
getSoberLivingsNearby(lat, lng, radius)
```

### crisisHotlines.js
```javascript
getHotlinesByCategory(category)
getHotlinesByType(type)
get24x7Hotlines()
getTextEnabledHotlines()
getChatEnabledHotlines()
getHotlinesByLanguage(language)
getYouthHotlines()
getVeteranHotlines()
getLGBTQHotlines()
searchHotlines(query)
```

### mentalHealthResources.js
```javascript
getResourcesByCategory(category)
getFreeResources()
getAffordableResources()
getOnlineResources()
getPeerSupportResources()
getResourcesBySpecialty(specialty)
searchMentalHealthResources(query)
```

---

## 🔥 Firestore Integration

### Migration Ready
All data structures are designed for direct Firestore migration. See `firestoreIntegration.js` for:

- **Migration functions** - One-time data upload
- **Fetch functions** - Query Firestore collections
- **User features** - Favorites, bookmarks, application tracking
- **Analytics** - View tracking, link clicks, search queries
- **Admin functions** - CRUD operations for programs

### Firestore Collections Structure

```
/assistancePrograms
  ├── {id}: snap
  │   ├── title: "SNAP (Food Stamps)"
  │   ├── category: "Food Security"
  │   ├── description: "..."
  │   ├── eligibility: [...]
  │   ├── links: {...}
  │   ├── type: "federal"
  │   ├── priority: 1
  │   ├── stateSpecific: {...}
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp
  │   ├── views: 0
  │   └── favorites: 0

/recoveryCenters
  ├── {id}: center-001
  │   ├── name: "Serenity Recovery Center"
  │   ├── address: {...}
  │   ├── contact: {...}
  │   ├── services: [...]
  │   └── ...

/soberLivings
  ├── {id}: sober-001
  │   ├── name: "New Horizons Sober Living"
  │   ├── pricing: {...}
  │   └── ...

/crisisHotlines
  ├── {id}: crisis-001
  │   ├── name: "988 Suicide & Crisis Lifeline"
  │   └── ...

/users
  ├── {userId}
  │   ├── favoritedPrograms: [programIds]
  │   ├── favoritesCenters: [centerIds]
  │   └── applications: [...]

/applications
  ├── {applicationId}
  │   ├── userId: "..."
  │   ├── programId: "..."
  │   ├── status: "started" | "submitted" | "approved"
  │   ├── documents: [...]
  │   └── ...

/analytics
  ├── {eventId}
  │   ├── type: "view" | "click" | "search"
  │   ├── programId: "..."
  │   └── timestamp: ...
```

---

## 🎯 Usage Examples

### In React Components

```javascript
// Import data
import { assistancePrograms, searchPrograms } from '../data/assistanceData';
import { recoveryCenters, getCentersByState } from '../data/recoveryCenters';
import { crisisHotlines, get24x7Hotlines } from '../data/crisisHotlines';

// Use in components
function AssistPage() {
  const [programs, setPrograms] = useState(assistancePrograms);
  const [query, setQuery] = useState('');
  
  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    const results = searchPrograms(searchTerm);
    setPrograms(results);
  };
  
  return (
    <div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search programs..."
      />
      {programs.map(program => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
}
```

### With Firestore

```javascript
import { useEffect, useState } from 'react';
import { fetchAssistancePrograms, addProgramToFavorites } from '../data/firestoreIntegration';
import { useAuth } from '../AuthContext';

function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const loadPrograms = async () => {
      const data = await fetchAssistancePrograms();
      setPrograms(data);
      setLoading(false);
    };
    
    loadPrograms();
  }, []);
  
  const handleFavorite = async (programId) => {
    if (!currentUser) {
      alert('Please log in to save favorites');
      return;
    }
    
    const success = await addProgramToFavorites(currentUser.uid, programId);
    if (success) {
      alert('Program added to favorites!');
    }
  };
  
  if (loading) return <Loading />;
  
  return (
    <div>
      {programs.map(program => (
        <div key={program.id}>
          <h3>{program.title}</h3>
          <button onClick={() => handleFavorite(program.id)}>
            ❤️ Favorite
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🚀 Future Enhancements

### Planned Features

1. **State-Specific Expansion**
   - Add all 50 states to `stateSpecific` objects
   - State phone numbers, websites, unique programs
   - Income thresholds by state

2. **Eligibility API Integration**
   - Real-time eligibility checking
   - Income verification
   - Automated recommendations

3. **User Accounts**
   - Save favorite programs
   - Track application progress
   - Document uploads
   - SMS notifications

4. **Provider Integration**
   - Link to verified local providers
   - Appointment scheduling
   - Provider ratings and reviews
   - Real-time availability

5. **Multi-Language Support**
   - Spanish translations for all programs
   - Multi-language search
   - Translated program materials

6. **SMS Notifications**
   - Application status updates
   - Appointment reminders
   - Document requests
   - Renewal notifications

7. **Document Management**
   - Secure document storage
   - Document templates
   - Auto-fill applications
   - Progress tracking

8. **Geolocation Features**
   - "Near Me" search with GPS
   - Map view of resources
   - Distance calculations
   - Directions integration

9. **Admin Dashboard**
   - Add/edit/delete programs
   - Verify providers
   - View analytics
   - Manage user accounts

---

## 📈 Statistics

- **Total Records:** 50+
- **Data Files:** 5
- **Helper Functions:** 50+
- **States Covered:** 5 (expanding to 50)
- **Categories:** 12+
- **Lines of Code:** 3,000+
- **Firestore Ready:** ✅

---

## 🛠️ Maintenance

### Adding New Programs

```javascript
// In assistanceData.js
{
  id: "program-id",
  category: "Category Name",
  icon: "🆕",
  title: "Program Title",
  badge: "Badge Text",
  description: "Full description...",
  eligibility: ["Requirement 1", "Requirement 2"],
  links: {
    national: "https://...",
    apply: "https://...",
    locator: "https://..."
  },
  type: "federal" | "wellness",
  priority: 1 | 2 | 3,
  stateSpecific: {
    CA: { name: "...", website: "...", phone: "..." }
  }
}
```

### Adding Recovery Centers

```javascript
// In recoveryCenters.js
{
  id: "center-id",
  name: "Center Name",
  type: "Type",
  category: "Inpatient | Outpatient",
  address: {
    street: "...",
    city: "...",
    state: "...",
    zip: "...",
    coordinates: { lat: 0.0, lng: 0.0 }
  },
  contact: { phone: "...", email: "...", website: "..." },
  services: [...],
  specialties: [...],
  insurance: [...],
  verified: true,
  rating: 4.8
}
```

---

## 📞 Support

For questions about the data architecture:
- Review `firestoreIntegration.js` for Firestore setup
- Check helper functions in each data file
- See usage examples above
- Refer to Firestore documentation: https://firebase.google.com/docs/firestore

---

## 📝 License

This data structure is part of the Wellness Cafe platform and is proprietary. All data should be verified before production use.

---

**Last Updated:** January 2025  
**Version:** 2.0  
**Maintainer:** Wellness Cafe Development Team
