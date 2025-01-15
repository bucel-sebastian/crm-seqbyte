import React from "react";
import { useAuth } from "../../context/AuthContext";

import {
  FaHouseChimney,
  FaBriefcase,
  FaUserTie,
  FaGear,
  FaFileInvoiceDollar,
} from "react-icons/fa6";
import SidebarMenuItem from "./SidebarMenuItem";

function SidebarMenu() {
  const { session } = useAuth();
  const menuItems = [
    {
      name: "Acasă",
      url: "/dashboard",
      icon: <FaHouseChimney />,
    },
    {
      name: "Companii",
      url: null,
      icon: <FaBriefcase />,
      needsPrimaryAccount: true,
      submenu: [
        {
          name: "Toate companiile",
          url: "/dashboard/companies",
        },
        {
          name: "Companie noua",
          url: "/dashboard/companies/new",
        },
      ],
    },
    {
      name: "Clienți",
      url: null,
      icon: <FaUserTie />,
      needsPrimaryAccount: false,
      submenu: [
        {
          name: "Toți clienți",
          url: "/dashboard/clients",
        },
        {
          name: "Client nou",
          url: "/dashboard/clients/new",
        },
      ],
    },
    {
      name: "Financiar",
      url: null,
      icon: <FaFileInvoiceDollar />,
      needsPrimaryAccount: false,
      submenu: [
        {
          name: "Toate facturile",
          url: "/dashboard/invoices",
        },
        {
          name: "Factură nouă",
          url: "/dashboard/invoices/new",
        },
        {
          name: "Serii facturi",
          url: "/dashboard/invoices/series",
        },
      ],
    },
    {
      name: "Setări",
      url: null,
      icon: <FaGear />,
      needsPrimaryAccount: true,
      submenu: [
        {
          name: "Utilizatori",
          url: "/dashboard/invoices",
        },
        {
          name: "Factură nouă",
          url: "/dashboard/invoices/new",
        },
        {
          name: "Serii facturi",
          url: "/dashboard/invoices/series",
        },
      ],
    },
  ];

  return (
    <div className="menu-container">
      <ul className="menu-list">
        {menuItems
          .filter((item) =>
            item?.needsPrimaryAccount
              ? item?.needsPrimaryAccount === session.is_primary_account
                ? true
                : false
              : true
          )
          .map((item, index) => (
            <SidebarMenuItem item={item} key={index} />
          ))}
      </ul>
    </div>
  );
}

export default SidebarMenu;
