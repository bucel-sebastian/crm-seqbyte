import React, { useContext } from "react";
import DashboardLayoutContext from "../../../context/DashboardLayoutContext";
import ThemeToggleButton from "../../ThemeToggleButton";
import UserMenu from "../../UserMenu";
import ThemeContext from "../../../context/ThemeContext";

import logoBlack from "../../../assets/images/logo_black.svg";
import logoWhite from "../../../assets/images/logo_white.svg";

function DashboardHeader() {
  const { theme } = useContext(ThemeContext);
  const { sidebarIsOpened, toggleSidebar } = useContext(DashboardLayoutContext);
  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="header-menu-container">
            <button
              className={`header-menu-button ${
                sidebarIsOpened && "sidebar-is-opened"
              }`}
              onClick={toggleSidebar}
            >
              <div className="header-menu-bar-container">
                <div className="header-menu-bar header-menu-bar-1"></div>
                <div className="header-menu-bar header-menu-bar-2"></div>
                <div className="header-menu-bar header-menu-bar-3"></div>
              </div>
            </button>
            <img
              className="header-logo"
              src={theme === "light-mode" ? logoBlack : logoWhite}
            />
          </div>
          <div className="header-user-menu">
            <UserMenu />
            <ThemeToggleButton />
          </div>
        </div>
      </header>
    </>
  );
}

export default DashboardHeader;
