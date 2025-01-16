import React from "react";
import { useAuth } from "../../context/AuthContext";

import SidebarMenuItem from "./SidebarMenuItem";

import menuItems from "../../utils/menuItems.json";

function SidebarMenu() {
  const { session } = useAuth();

  return (
    <div className="menu-container">
      <ul className="menu-list">
        {menuItems
          .filter((item) =>
            item?.permissionRoles
              ? item?.permissionRoles.includes(session.role)
                ? true
                : false
              : true
          )
          .map((item, index) => (
            <SidebarMenuItem item={item} session={session} key={index} />
          ))}
      </ul>
    </div>
  );
}

export default SidebarMenu;
