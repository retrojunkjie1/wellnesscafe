import React, { useState } from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";

const ProtectedRoute = ({ children, roles, requireVerified }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [resendMsg, setResendMsg] = useState("");

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional email verification gate
  if (requireVerified && !user?.emailVerified) {
    const onResend = async () => {
      try {
        if (auth?.currentUser) {
          await sendEmailVerification(auth.currentUser);
          setResendMsg("Verification email sent. Please check your inbox.");
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("resend verification failed", e);
        setResendMsg("Could not send verification email. Try again later.");
      }
    };
    return (
      <div className="container max-w-[720px] mx-auto my-12 px-4">
        <h2>Please verify your email</h2>
        <p>
          We sent a verification link to <strong>{user?.email}</strong>. Verify
          your email to continue.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button type="button" className="btn" onClick={onResend}>
            Resend verification
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => window.location.reload()}
          >
            I verified — Refresh
          </button>
        </div>
        {resendMsg && <p className="text-gray-600 mt-2">{resendMsg}</p>}
      </div>
    );
  }

  // Optional role-based guard
  if (roles && Array.isArray(roles) && roles.length > 0) {
    const hasProviderOwnership =
      Array.isArray(user?.providerIds) && user.providerIds.length > 0;
    const role = user?.role || (hasProviderOwnership ? "provider" : null);
    const allowed = role ? roles.includes(role) : false;
    if (!allowed) {
      // Not authorized for this route; redirect to dashboard/home
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  requireVerified: PropTypes.bool,
};

export default ProtectedRoute;
