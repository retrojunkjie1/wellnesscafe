// src/hooks/useAffirmations.js
import { useEffect, useState, useCallback } from "react";
import { db, functions, onUid } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

const prefsDoc = (uid) => doc(db, "users", uid, "aff_prefs", "profile");
const favsCol = (uid) => collection(db, "users", uid, "affirmations");

// Fallback affirmations when Cloud Function is not available
const FALLBACK_AFFIRMATIONS = [
  "I am safe, grounded, and open to new possibilities today.",
  "I choose progress over perfection, one step at a time.",
  "I honor my journey and trust the process of healing.",
  "I am worthy of love, peace, and all good things.",
  "My recovery is a gift I give myself every single day.",
  "I am stronger than my struggles and braver than I know.",
  "I embrace each moment with courage and compassion.",
  "I am building a life I'm proud of, brick by brick.",
  "I trust myself to make healthy choices today.",
  "My past does not define my future.",
  "I am deserving of happiness and inner peace.",
  "Every day, I grow stronger in my recovery.",
];

export const useAffirmations = () => {
  const [uid, setUid] = useState(null);
  const [prefs, setPrefs] = useState({
    tone: "calm",
    topics: ["resilience", "self-worth"],
    style: "first-person",
    length: "<=20 words",
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state
  useEffect(() => {
    const unsubscribe = onUid(setUid);
    return () => unsubscribe();
  }, []);

  // Load preferences and subscribe to favorites
  useEffect(() => {
    if (!uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    const fetchPrefs = async () => {
      const snap = await getDoc(prefsDoc(uid));
      if (snap.exists()) {
        setPrefs(snap.data());
      }
    };

    fetchPrefs();

    const q = query(favsCol(uid), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  // Save preferences
  const savePrefs = useCallback(
    async (next) => {
      if (!uid) return;
      await setDoc(prefsDoc(uid), next, { merge: true });
      setPrefs(next);
    },
    [uid]
  );

  // Generate affirmation (Cloud Function or fallback)
  const generate = useCallback(
    async (mood) => {
      if (!uid) throw new Error("Not signed in");

      // Try Cloud Function first (if it exists)
      if (functions) {
        try {
          const call = httpsCallable(functions, "generateAffirmation");
          const { data } = await call({
            tone: prefs.tone,
            topics: prefs.topics,
            style: prefs.style,
            length: prefs.length,
            mood,
          });
          return data.text;
        } catch (err) {
          console.log(
            "Cloud Function not available, using fallback affirmations:",
            err.message
          );
          // Fall through to fallback
        }
      }

      // Fallback: return random affirmation
      const randomIndex = Math.floor(
        Math.random() * FALLBACK_AFFIRMATIONS.length
      );
      return FALLBACK_AFFIRMATIONS[randomIndex];
    },
    [uid, prefs]
  );

  // Save affirmation to favorites
  const saveAffirmation = useCallback(
    async (text, topics = []) => {
      if (!uid) return;
      await addDoc(favsCol(uid), {
        text,
        topics,
        createdAt: serverTimestamp(),
        favorite: true,
      });
    },
    [uid]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    async (id, isFav) => {
      if (!uid) return;
      await updateDoc(doc(db, "users", uid, "affirmations", id), {
        favorite: !isFav,
      });
    },
    [uid]
  );

  return {
    uid,
    prefs,
    savePrefs,
    items,
    loading,
    generate,
    saveAffirmation,
    toggleFavorite,
    fallbackAffirmations: FALLBACK_AFFIRMATIONS,
  };
};
