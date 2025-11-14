import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function useTriggers(){
  const [triggers, setTriggers] = useState([]);
  const [uid, setUid] = useState(null);

  // Step 1 — Listen for authentication
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return unsub;
  }, []);

  // Step 2 — Load triggers for this specific user
  useEffect(() => {
    if(!uid) return;

    const q = query(
      collection(db, "triggers"),
      where("uid", "==", uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setTriggers(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return unsub;
  }, [uid]);

  return triggers;
}
