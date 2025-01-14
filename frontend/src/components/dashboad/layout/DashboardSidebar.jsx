import React, { useContext } from 'react'
import DashboardLayoutContext from '../../../context/DashboardLayoutContext'

function DashboardSidebar() {
    const { sidebarIsOpened }  = useContext(DashboardLayoutContext)
  return (
    <div className={`dashboard-sidebar ${sidebarIsOpened && 'is-opened'}`}>{sidebarIsOpened ? "Sidebar deschis" : "Sidebar inchis"}</div>
  )
}

export default DashboardSidebar