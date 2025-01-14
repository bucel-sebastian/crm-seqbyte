import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();
  console.log("Session", session);
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
