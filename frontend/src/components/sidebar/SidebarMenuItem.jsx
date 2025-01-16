import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  FaHouseChimney,
  FaBriefcase,
  FaUserTie,
  FaGear,
  FaFileInvoiceDollar,
} from "react-icons/fa6";

const icons = {
  FaHouseChimney: FaHouseChimney,
  FaBriefcase: FaBriefcase,
  FaUserTie: FaUserTie,
  FaFileInvoiceDollar: FaFileInvoiceDollar,
  FaGear: FaGear,
};

function SidebarMenuItem({ item, session, key }) {
  const [submenuIsOpened, setSubmenuIsOpened] = useState(false);
  const [submenuHeight, setSubmenuHeight] = useState(0);
  const submenuRef = useRef(null);
  let location = useLocation();

  const IconComponent = icons[item.icon];

  useEffect(() => {
    if (submenuIsOpened) {
      setSubmenuHeight(submenuRef.current.scrollHeight);
    } else {
      setSubmenuHeight(0);
    }
  }, [submenuIsOpened]);

  if (item.url !== null) {
    return (
      <li className="menu-list-item">
        <Link
          className={`menu-list-item-link ${
            location.pathname === item.url ? "is-active" : ""
          }`}
          to={item.url}
        >
          {IconComponent && <IconComponent />}
          <span>{item.name}</span>
        </Link>
      </li>
    );
  }
  return (
    <li className="menu-list-item menu-list-item-with-submenu">
      <button
        className="menu-list-item-link"
        type="button"
        onClick={() => setSubmenuIsOpened((prevState) => !prevState)}
      >
        {IconComponent && <IconComponent />}
        <span>{item.name}</span>
      </button>
      <div
        className={`submenu-container ${
          submenuIsOpened ? "submenu-is-opened" : ""
        }`}
        style={{ height: submenuHeight }}
        ref={submenuRef}
      >
        <ul className="submenu-list">
          {item.submenu
            .filter((submenuItem) =>
              submenuItem?.permissionRoles
                ? submenuItem?.permissionRoles.includes(session.role)
                  ? true
                  : false
                : true
            )
            .map((submenuItem, index) => (
              <li className="submenu-list-item" key={index}>
                <Link
                  className={`submenu-list-item-link ${
                    location.pathname === submenuItem.url ? "is-active" : ""
                  }`}
                  to={submenuItem.url}
                >
                  {submenuItem.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </li>
  );
}

export default SidebarMenuItem;
