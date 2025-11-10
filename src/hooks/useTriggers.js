// src/hooks/useTriggers.js
import { useEffect, useMemo, useState, useCallback } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { format, parseISO } from "date-fns";

/**
 * Custom hook for managing user trigger entries in Firestore
 * Data structure: users/{uid}/triggers/{docId}
 *
 * @returns {Object} - Hook state and methods
 */
export const useTriggers = () => {
  const [uid, setUid] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user UID
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setError("Firebase auth not configured");
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUid(user ? user.uid : null);
      if (!user) {
        setItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to triggers collection
  useEffect(() => {
    if (!uid || !db) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const triggersRef = collection(db, "users", uid, "triggers");
      const q = query(triggersRef, orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const arr = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          setItems(arr);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error("Error fetching triggers:", err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up triggers listener:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [uid]);

  // Add a new trigger entry
  const add = useCallback(
    async (payload) => {
      if (!uid) throw new Error("Not signed in");
      if (!db) throw new Error("Firebase not configured");

      const now = new Date();
      const base = {
        timestamp: payload.timestamp ? payload.timestamp : now.toISOString(),
        category: payload.category || "General",
        emotion: payload.emotion || "",
        intensity: Number(payload.intensity || 0),
        situation: payload.situation || "",
        thought: payload.thought || "",
        action: payload.action || "",
        copingStrategy: payload.copingStrategy || "",
        outcomeRating: Number(payload.outcomeRating || 0),
        notes: payload.notes || "",
        tags: payload.tags || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        const triggersRef = collection(db, "users", uid, "triggers");
        await addDoc(triggersRef, base);
      } catch (err) {
        console.error("Error adding trigger:", err);
        throw err;
      }
    },
    [uid]
  );

  // Update an existing trigger entry
  const update = useCallback(
    async (id, patch) => {
      if (!uid) throw new Error("Not signed in");
      if (!db) throw new Error("Firebase not configured");

      try {
        const docRef = doc(db, "users", uid, "triggers", id);
        await updateDoc(docRef, {
          ...patch,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error updating trigger:", err);
        throw err;
      }
    },
    [uid]
  );

  // Analytics computed from trigger entries
  const analytics = useMemo(() => {
    const countByTag = {};
    const countByDOW = {};
    const effectiveness = [];
    const emotionFreq = {};
    const categoryFreq = {};

    items.forEach((it) => {
      // Tag frequency
      (it.tags || []).forEach((t) => {
        countByTag[t] = (countByTag[t] || 0) + 1;
      });

      // Day of week frequency
      const d = it.timestamp ? new Date(it.timestamp) : null;
      if (d && !isNaN(d.getTime())) {
        const k = d.getDay();
        countByDOW[k] = (countByDOW[k] || 0) + 1;
      }

      // Coping effectiveness over time
      if (typeof it.outcomeRating === "number" && it.timestamp) {
        effectiveness.push({
          date: it.timestamp,
          score: it.outcomeRating,
        });
      }

      // Emotion frequency
      if (it.emotion) {
        emotionFreq[it.emotion] = (emotionFreq[it.emotion] || 0) + 1;
      }

      // Category frequency
      if (it.category) {
        categoryFreq[it.category] = (categoryFreq[it.category] || 0) + 1;
      }
    });

    // Convert to arrays for charts
    const tagSeries = Object.keys(countByTag)
      .map((t) => ({ tag: t, count: countByTag[t] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 tags

    const dowMap = {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat",
    };
    const dowSeries = Object.keys(countByDOW)
      .map((k) => ({ day: dowMap[k], count: countByDOW[k] }))
      .sort((a, b) => {
        const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return order.indexOf(a.day) - order.indexOf(b.day);
      });

    const effSeries = effectiveness
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((e) => {
        try {
          return {
            date: format(parseISO(e.date), "MMM d"),
            score: e.score,
          };
        } catch {
          return null;
        }
      })
      .filter((e) => e !== null);

    const emotionSeries = Object.keys(emotionFreq)
      .map((e) => ({ emotion: e, count: emotionFreq[e] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 emotions

    const categorySeries = Object.keys(categoryFreq)
      .map((c) => ({ category: c, count: categoryFreq[c] }))
      .sort((a, b) => b.count - a.count);

    return {
      tagSeries,
      dowSeries,
      effSeries,
      emotionSeries,
      categorySeries,
      totalEntries: items.length,
      avgIntensity:
        items.length > 0
          ? (
              items.reduce((sum, it) => sum + (it.intensity || 0), 0) /
              items.length
            ).toFixed(1)
          : 0,
      avgOutcome:
        items.length > 0
          ? (
              items.reduce((sum, it) => sum + (it.outcomeRating || 0), 0) /
              items.length
            ).toFixed(1)
          : 0,
    };
  }, [items]);

  return {
    uid,
    items,
    loading,
    error,
    add,
    update,
    analytics,
  };
};
