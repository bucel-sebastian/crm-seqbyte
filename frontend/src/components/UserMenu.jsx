import React from "react";
import { useAuth } from "../context/AuthContext";

function UserMenu() {
  const { session, logout } = useAuth();
  return (
    <div>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default UserMenu;
