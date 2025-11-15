import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const PremiumRoute = ({children}) => {
  const {user, loading} = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isPremium) return <Navigate to="/upgrade" replace />;
  return children;
};

export default PremiumRoute;
