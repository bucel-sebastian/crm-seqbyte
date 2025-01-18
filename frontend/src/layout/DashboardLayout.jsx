import React, { useContext } from "react";
import { Outlet } from "react-router";
import DashboardHeader from "../components/dashboad/layout/DashboardHeader";
import DashboardSidebar from "../components/dashboad/layout/DashboardSidebar";

import DashboardLayoutContext from "../context/DashboardLayoutContext";

import { ToastContainer, Bounce } from "react-toastify";

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
          <div className="dashboard-main-content">
            <Outlet />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Bounce}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
