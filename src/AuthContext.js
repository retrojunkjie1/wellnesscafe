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
      // Enhanced email verification with action code settings
      const actionCodeSettings = {
        url: `${window.location.origin}/dashboard`,
        handleCodeInApp: true,
      };

      await sendEmailVerification(userCredential.user, actionCodeSettings);
      // eslint-disable-next-line no-console
      console.log("✅ Verification email sent successfully to:", email);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("❌ Email verification send failed:", e);

      // Specific error handling for better user feedback
      if (e.code === "auth/too-many-requests") {
        throw new Error(
          "Too many requests. Please wait a few minutes and check your email."
        );
      } else if (e.code === "auth/invalid-email") {
        throw new Error("Invalid email address. Please check and try again.");
      } else if (e.code === "auth/unauthorized-domain") {
        throw new Error(
          "Email verification is not configured for this domain. Please contact support."
        );
      }
      // Don't fail the signup for other errors, just warn
      // eslint-disable-next-line no-console
      console.warn("Non-fatal: Email verification may not have been sent");
    }
    // Create user document in Firestore if available
    if (db) {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: new Date(),
        emailVerificationSent: true,
        emailVerificationSentAt: new Date().toISOString(),
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
