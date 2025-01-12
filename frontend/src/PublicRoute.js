import React from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
