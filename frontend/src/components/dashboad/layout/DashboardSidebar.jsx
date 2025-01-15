import React, { useContext } from "react";
import DashboardLayoutContext from "../../../context/DashboardLayoutContext";
import SidebarMenu from "../../sidebar/SidebarMenu";

function DashboardSidebar() {
  const { sidebarIsOpened } = useContext(DashboardLayoutContext);
  return (
    <div className={`dashboard-sidebar ${sidebarIsOpened && "is-opened"}`}>
      <SidebarMenu />
    </div>
  );
}

export default DashboardSidebar;
