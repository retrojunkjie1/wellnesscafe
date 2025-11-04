import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authEnabled = Boolean(auth);

  useEffect(() => {
    // If Firebase auth is not available, set loading to false immediately
    if (!auth) {
      console.warn("Firebase auth is disabled - running in offline mode");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (db) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          // detect provider role by ownership
          let role = userData.role || null;
          let providerIds = [];
          try {
            const q = query(
              collection(db, "providers"),
              where("ownerUid", "==", user.uid)
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
              role = role || "provider";
              providerIds = snap.docs.map((d) => d.id);
            }
          } catch (error_) {
            // eslint-disable-next-line no-console
            console.warn("provider-role detect failed", error_);
          }
          setUser({ ...user, ...userData, role, providerIds });
        } else {
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    if (!auth) throw new Error("auth-disabled");
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(async (email, password, additionalData = {}) => {
    if (!auth) throw new Error("auth-disabled");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    try {
      // Fire-and-forget email verification; errors are non-fatal
      await sendEmailVerification(userCredential.user);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("email verification send failed", e);
    }
    // Create user document in Firestore if available
    if (db) {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: new Date(),
        ...additionalData,
      });
    }
    return userCredential;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!auth) throw new Error("auth-disabled");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Check if user document exists, create if not (only if Firestore is available)
    if (db) {
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date(),
        });
      }
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    if (!auth) return; // already offline/no-op
    return signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      loginWithGoogle,
      logout,
      loading,
      authEnabled,
    }),
    [user, login, register, loginWithGoogle, logout, loading, authEnabled]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
