import React from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router";

function IndexRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
}

export default IndexRoute;
