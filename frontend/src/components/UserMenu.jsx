import React from "react";
import { useAuth } from "../context/AuthContext";
import Tooltip from "@mui/material/Tooltip";

import { FaCircleUser, FaRightFromBracket } from "react-icons/fa6";

function UserMenu() {
  const { session, logout } = useAuth();

  const displayUserName = () => {
    if (session.first_name === "" || session.last_name === "") {
      return session.email;
    }
    return `${session.first_name} ${session.last_name}`;
  };

  return (
    <div className="dashboard-header-user-menu">
      <div className="dashboad-header-user-details">
        <div className="dashboad-header-user-details-icon">
          <FaCircleUser />
        </div>
        <div className="dashboad-header-user-details-name">
          <p>
            <strong>{displayUserName()}</strong>
          </p>
          <span>{session.role}</span>
        </div>
      </div>
      <Tooltip title="Iesi din cont">
        <button
          className="dashboard-header-user-logout-button"
          type="button"
          onClick={logout}
        >
          <FaRightFromBracket />
        </button>
      </Tooltip>
    </div>
  );
}

export default UserMenu;
