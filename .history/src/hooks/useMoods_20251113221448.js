import { useEffect, useMemo, useState, useCallback } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { format, parseISO } from "date-fns";

const path = (uid) => collection(db, "users", uid, "moods");

export const useMoods = () => {
  const [uid, setUid] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onUid(setUid);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) {
      setItems([]);
      setLoading(false);
      return;
    }
    const q = query(path(uid), orderBy("timestamp", "desc"));
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

  const add = useCallback(
    async (payload) => {
      if (!uid) throw new Error("Not signed in");
      const body = {
        timestamp: payload.timestamp || new Date().toISOString(),
        score: Number(payload.score || 5), // 1–10
        emoji: payload.emoji || "", // optional quick pick
        notes: payload.notes || "",
        tags: payload.tags || [],
        createdAt: serverTimestamp(),
      };
      await addDoc(path(uid), body);
    },
    [uid]
  );

  const analytics = useMemo(() => {
    // daily average for last 14 entries (or last 14 days if you want)
    const series = items
      .slice()
      .reverse()
      .map((m) => ({
        date: format(parseISO(m.timestamp), "MMM d"),
        score: m.score,
      }));
    const avg = series.length
      ? Math.round(
          (series.reduce((a, b) => a + b.score, 0) / series.length) * 10
        ) / 10
      : 0;
    return { series, avg };
  }, [items]);

  return { uid, items, loading, add, analytics };
};
