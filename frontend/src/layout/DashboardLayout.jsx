import React, { useContext } from "react";
import { Outlet } from "react-router";
import DashboardHeader from "../components/dashboad/layout/DashboardHeader";
import DashboardSidebar from "../components/dashboad/layout/DashboardSidebar";

import DashboardLayoutContext from "../context/DashboardLayoutContext";

function DashboardLayout() {
  const { sidebarIsOpened } = useContext(DashboardLayoutContext);

  return (
    <div>
      <DashboardHeader />
      <div>
        <DashboardSidebar />

        <main
          className={`dashboard-main ${sidebarIsOpened && "sidebar-is-opened"}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
