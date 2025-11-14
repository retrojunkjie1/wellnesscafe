import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function useMoods(){
  const [moods, setMoods] = useState([]);
  const [uid, setUid] = useState(null);

  // Listen for user login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return unsub;
  }, []);

  // Fetch moods for this user
  useEffect(() => {
    if(!uid) return;

    const q = query(
      collection(db, "moods"),
      where("uid", "==", uid)
    );

    const unsub = onSnapshot(q, snapshot => {
      setMoods(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });

    return unsub;
  }, [uid]);

  return moods;
}
