import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

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
};

export default ProtectedRoute;
