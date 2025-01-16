import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./context/AuthContext";

import menuItems from "./utils/menuItems.json";

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  console.log("Session", session, location);

  const hasPermission = (role) => {
    for (const item of menuItems) {
      if (item.url === location.pathname) {
        if (item?.permissionRoles) {
          console.log("intra", item?.permissionRoles);
          if (!item?.permissionRoles?.includes(role)) {
            console.log("aici", item?.permissionRoles);
            return false;
          }
        }
      }

      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.url === location.pathname) {
            if (!subItem?.permissionRoles?.includes(role)) {
              console.log("aici acolo");
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(session.role)) {
    return <Navigate to="/404" replace />;
  }

  return children;
}

export default ProtectedRoute;
