// ============================================
// FIRESTORE INTEGRATION GUIDE
// ============================================
// Instructions for migrating data to Firestore
// and implementing dynamic features

import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

// ========================================
// 1. DATA MIGRATION TO FIRESTORE
// ========================================

/**
 * One-time function to upload assistance programs to Firestore
 * Run this once to populate your database
 */
export const migrateAssistanceProgramsToFirestore = async () => {
  try {
    const { assistancePrograms } = await import('./assistanceData');
    
    for (const program of assistancePrograms) {
      await setDoc(doc(db, "assistancePrograms", program.id), {
        ...program,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        favorites: 0
      });
    }
    
    // eslint-disable-next-line no-console
    console.log("✅ Migration complete: Assistance programs uploaded");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Migration failed:", error);
  }
};

/**
 * Migrate recovery centers
 */
export const migrateRecoveryCentersToFirestore = async () => {
  try {
    const { recoveryCenters } = await import('./recoveryCenters');
    
    for (const center of recoveryCenters) {
      await setDoc(doc(db, "recoveryCenters", center.id), {
        ...center,
        createdAt: center.createdAt || serverTimestamp(),
        updatedAt: center.updatedAt || serverTimestamp(),
        views: 0,
        inquiries: 0
      });
    }
    
    // eslint-disable-next-line no-console
    console.log("✅ Migration complete: Recovery centers uploaded");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Migration failed:", error);
  }
};

/**
 * Migrate sober living homes
 */
export const migrateSoberLivingsToFirestore = async () => {
  try {
    const { soberLivings } = await import('./soberLivings');
    
    for (const home of soberLivings) {
      await setDoc(doc(db, "soberLivings", home.id), {
        ...home,
        createdAt: home.createdAt || serverTimestamp(),
        updatedAt: home.updatedAt || serverTimestamp(),
        views: 0,
        inquiries: 0
      });
    }
    
    // eslint-disable-next-line no-console
    console.log("✅ Migration complete: Sober livings uploaded");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Migration failed:");
  }
};

/**
 * Migrate crisis hotlines
 */
export const migrateCrisisHotlinesToFirestore = async () => {
  try {
    const { crisisHotlines } = await import('./crisisHotlines');
    
    for (const hotline of crisisHotlines) {
      await setDoc(doc(db, "crisisHotlines", hotline.id), {
        ...hotline,
        createdAt: hotline.createdAt || serverTimestamp(),
        updatedAt: hotline.updatedAt || serverTimestamp(),
        clicks: 0
      });
    }
    
    // eslint-disable-next-line no-console
    console.log("✅ Migration complete: Crisis hotlines uploaded");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Migration failed:", error);
  }
};

// ========================================
// 2. FETCHING DATA FROM FIRESTORE
// ========================================

/**
 * Fetch all assistance programs
 */
export const fetchAssistancePrograms = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "assistancePrograms"));
    const programs = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    return programs;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching programs:", error);
    return [];
  }
};

/**
 * Fetch programs by category
 */
export const fetchProgramsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, "assistancePrograms"),
      where("category", "==", category),
      orderBy("priority", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching programs by category:", error);
    return [];
  }
};

/**
 * Fetch high-priority programs
 */
export const fetchHighPriorityPrograms = async () => {
  try {
    const q = query(
      collection(db, "assistancePrograms"),
      where("priority", "==", 1),
      limit(6)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching high-priority programs:", error);
    return [];
  }
};

/**
 * Fetch single program by ID
 */
export const fetchProgramById = async (programId) => {
  try {
    const docRef = doc(db, "assistancePrograms", programId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Increment view count
      await updateDoc(docRef, {
        views: (docSnap.data().views || 0) + 1
      });
      
      return { ...docSnap.data(), id: docSnap.id };
    } else {
      // eslint-disable-next-line no-console
      console.log("Program not found");
      return null;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching program:", error);
    return null;
  }
};

/**
 * Fetch recovery centers by state
 */
export const fetchRecoveryCentersByState = async (state) => {
  try {
    const q = query(
      collection(db, "recoveryCenters"),
      where("address.state", "==", state),
      where("verified", "==", true),
      orderBy("rating", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching recovery centers:", error);
    return [];
  }
};

/**
 * Fetch sober living homes by filters
 */
export const fetchSoberLivingsByFilters = async (filters) => {
  try {
    let q = collection(db, "soberLivings");
    
    if (filters.state) {
      q = query(q, where("address.state", "==", filters.state));
    }
    
    if (filters.gender) {
      q = query(q, where("gender", "in", [filters.gender, "Co-Ed", "All"]));
    }
    
    if (filters.maxPrice) {
      q = query(q, where("pricing.monthlyRent", "<=", filters.maxPrice));
    }
    
    if (filters.verified) {
      q = query(q, where("verified", "==", true));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching sober livings:", error);
    return [];
  }
};

// ========================================
// 3. USER FAVORITES & BOOKMARKS
// ========================================

/**
 * Add program to user favorites
 */
export const addProgramToFavorites = async (userId, programId) => {
  try {
    const userRef = doc(db, "users", userId);
    
    await updateDoc(userRef, {
      favoritedPrograms: arrayUnion(programId),
      updatedAt: serverTimestamp()
    });
    
    // Increment favorites count on program
    const programRef = doc(db, "assistancePrograms", programId);
    await updateDoc(programRef, {
      favorites: (await getDoc(programRef)).data().favorites + 1
    });
    
    // eslint-disable-next-line no-console
    console.log("✅ Program added to favorites");
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error adding to favorites:", error);
    return false;
  }
};

/**
 * Remove program from favorites
 */
export const removeProgramFromFavorites = async (userId, programId) => {
  try {
    const userRef = doc(db, "users", userId);
    
    await updateDoc(userRef, {
      favoritedPrograms: arrayRemove(programId),
      updatedAt: serverTimestamp()
    });
    
    // eslint-disable-next-line no-console
    console.log("✅ Program removed from favorites");
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error removing from favorites:", error);
    return false;
  }
};

/**
 * Fetch user's favorite programs
 */
export const fetchUserFavorites = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return [];
    
    const favoriteIds = userSnap.data().favoritedPrograms || [];
    
    // Fetch all favorited programs
    const favorites = await Promise.all(
      favoriteIds.map(id => fetchProgramById(id))
    );
    
    return favorites.filter(program => program !== null);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching favorites:", error);
    return [];
  }
};

// ========================================
// 4. APPLICATION TRACKING
// ========================================

/**
 * Create new application record
 */
export const createApplication = async (userId, programId, applicationData) => {
  try {
    const applicationRef = await addDoc(collection(db, "applications"), {
      userId,
      programId,
      status: "started", // started, in-progress, submitted, approved, denied
      submittedAt: null,
      completedAt: null,
      documents: [],
      notes: applicationData.notes || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // eslint-disable-next-line no-console
    console.log("✅ Application created:", applicationRef.id);
    return applicationRef.id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating application:", error);
    return null;
  }
};

/**
 * Update application status
 */
export const updateApplicationStatus = async (applicationId, status, notes = "") => {
  try {
    const applicationRef = doc(db, "applications", applicationId);
    
    const updates = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (status === "submitted") {
      updates.submittedAt = serverTimestamp();
    }
    
    if (status === "approved" || status === "denied") {
      updates.completedAt = serverTimestamp();
    }
    
    if (notes) {
      updates.notes = notes;
    }
    
    await updateDoc(applicationRef, updates);
    
    // eslint-disable-next-line no-console
    console.log("✅ Application status updated");
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating application:", error);
    return false;
  }
};

/**
 * Fetch user's applications
 */
export const fetchUserApplications = async (userId) => {
  try {
    const q = query(
      collection(db, "applications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching applications:", error);
    return [];
  }
};

// ========================================
// 5. ANALYTICS & TRACKING
// ========================================

/**
 * Track program view
 */
export const trackProgramView = async (programId) => {
  try {
    const programRef = doc(db, "assistancePrograms", programId);
    await updateDoc(programRef, {
      views: (await getDoc(programRef)).data().views + 1,
      lastViewed: serverTimestamp()
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error tracking view:", error);
  }
};

/**
 * Track external link clicks
 */
export const trackLinkClick = async (programId, linkType) => {
  try {
    await addDoc(collection(db, "analytics"), {
      type: "link_click",
      programId,
      linkType, // "apply", "national", "locator", etc.
      timestamp: serverTimestamp()
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error tracking link click:", error);
  }
};

/**
 * Track search queries
 */
export const trackSearch = async (query, resultsCount) => {
  try {
    await addDoc(collection(db, "analytics"), {
      type: "search",
      query,
      resultsCount,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error tracking search:", error);
  }
};

// ========================================
// 6. ADMIN FUNCTIONS
// ========================================

/**
 * Add new program (admin only)
 */
export const addNewProgram = async (programData) => {
  try {
    const docRef = await addDoc(collection(db, "assistancePrograms"), {
      ...programData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
      favorites: 0
    });
    
    // eslint-disable-next-line no-console
    console.log("✅ Program added:", docRef.id);
    return docRef.id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error adding program:", error);
    return null;
  }
};

/**
 * Update existing program (admin only)
 */
export const updateProgram = async (programId, updates) => {
  try {
    const programRef = doc(db, "assistancePrograms", programId);
    await updateDoc(programRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    // eslint-disable-next-line no-console
    console.log("✅ Program updated");
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating program:", error);
    return false;
  }
};

/**
 * Delete program (admin only)
 */
export const deleteProgram = async (programId) => {
  try {
    await deleteDoc(doc(db, "assistancePrograms", programId));
    // eslint-disable-next-line no-console
    console.log("✅ Program deleted");
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting program:", error);
    return false;
  }
};

// ========================================
// 7. USAGE EXAMPLES IN COMPONENTS
// ========================================

/**
 * Example: Use in AssistPage.js
 * 
 * import { useEffect, useState } from 'react';
 * import { fetchAssistancePrograms, fetchProgramsByCategory } from '../data/firestoreIntegration';
 * 
 * function AssistPage() {
 *   const [programs, setPrograms] = useState([]);
 *   const [loading, setLoading] = useState(true);
 *   
 *   useEffect(() => {
 *     const loadPrograms = async () => {
 *       setLoading(true);
 *       const data = await fetchAssistancePrograms();
 *       setPrograms(data);
 *       setLoading(false);
 *     };
 *     
 *     loadPrograms();
 *   }, []);
 *   
 *   if (loading) return <Loading />;
 *   
 *   return (
 *     <div>
 *       {programs.map(program => (
 *         <ProgramCard key={program.id} program={program} />
 *       ))}
 *     </div>
 *   );
 * }
 */

/**
 * Example: User favorites functionality
 * 
 * import { addProgramToFavorites, fetchUserFavorites } from '../data/firestoreIntegration';
 * import { useAuth } from '../AuthContext';
 * 
 * function ProgramCard({ program }) {
 *   const { currentUser } = useAuth();
 *   const [isFavorite, setIsFavorite] = useState(false);
 *   
 *   const handleFavorite = async () => {
 *     if (!currentUser) {
 *       alert('Please log in to save favorites');
 *       return;
 *     }
 *     
 *     const success = await addProgramToFavorites(currentUser.uid, program.id);
 *     if (success) {
 *       setIsFavorite(true);
 *     }
 *   };
 *   
 *   return (
 *     <div className="program-card">
 *       <h3>{program.title}</h3>
 *       <button onClick={handleFavorite}>
 *         {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
 *       </button>
 *     </div>
 *   );
 * }
 */

export default {
  // Migration
  migrateAssistanceProgramsToFirestore,
  migrateRecoveryCentersToFirestore,
  migrateSoberLivingsToFirestore,
  migrateCrisisHotlinesToFirestore,
  
  // Fetching
  fetchAssistancePrograms,
  fetchProgramsByCategory,
  fetchHighPriorityPrograms,
  fetchProgramById,
  fetchRecoveryCentersByState,
  fetchSoberLivingsByFilters,
  
  // Favorites
  addProgramToFavorites,
  removeProgramFromFavorites,
  fetchUserFavorites,
  
  // Applications
  createApplication,
  updateApplicationStatus,
  fetchUserApplications,
  
  // Analytics
  trackProgramView,
  trackLinkClick,
  trackSearch,
  
  // Admin
  addNewProgram,
  updateProgram,
  deleteProgram
};
