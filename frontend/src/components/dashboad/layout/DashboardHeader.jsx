import React, { useContext } from "react";
import DashboardLayoutContext from "../../../context/DashboardLayoutContext";
import ThemeToggleButton from "../../ThemeToggleButton";

function DashboardHeader() {
  const { sidebarIsOpened, toggleSidebar } = useContext(DashboardLayoutContext);
  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <div>
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
          </div>
          <div>
            <ThemeToggleButton />
          </div>
        </div>
      </header>
    </>
  );
}

export default DashboardHeader;
