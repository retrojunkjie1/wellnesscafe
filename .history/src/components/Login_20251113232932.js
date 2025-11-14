import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, authEnabled } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await login(email, password);
      let dest = from;
      try {
        const uid = cred?.user?.uid;
        if (db && uid) {
          const q = query(
            collection(db, "providers"),
            where("ownerUid", "==", uid)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            dest = "/providers/dashboard";
          }
        }
      } catch (error_) {
        // eslint-disable-next-line no-console
        console.warn("provider-detect failed", error_);
      }
      navigate(dest, { replace: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Login error:", error);
      
      if (error.code === 'auth/user-not-found') {
        setError("No account found with this email address.");
      } else if (error.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (error.code === 'auth/invalid-email') {
        setError("Invalid email address format.");
      } else if (error.code === 'auth/user-disabled') {
        setError("This account has been disabled.");
      } else {
        setError("Failed to sign in. Please check your credentials and try again.");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      let dest = from;
      try {
        const uid = res?.user?.uid;
        if (db && uid) {
          const q = query(
            collection(db, "providers"),
            where("ownerUid", "==", uid)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            dest = "/providers/dashboard";
          }
        }
      } catch (error_) {
        // eslint-disable-next-line no-console
        console.warn("provider-detect failed", error_);
      }
      navigate(dest, { replace: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Google login error:", error);
      setError("Failed to sign in with Google.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your WellnessCafe account</p>

        {!authEnabled && (
          <output className="error-message">
            Sign-in is unavailable in this preview. Please try again later.
          </output>
        )}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || !authEnabled}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="google-button"
          disabled={loading || !authEnabled}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
          />
          <span style={{ marginLeft: 8 }}>Sign in with Google</span>
        </button>

        <p className="auth-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
