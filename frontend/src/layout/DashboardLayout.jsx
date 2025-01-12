import React from "react";
import { Outlet } from "react-router";

function DashboardLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default DashboardLayout;
