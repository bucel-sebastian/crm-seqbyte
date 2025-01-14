import { createContext,  useState } from "react";

const DashboardLayoutContext = createContext(null);

const getInitialSidebarState = () => {
    const sidebarIsOpenedLocalStorage = localStorage.getItem('sidebarIsOpened');
    return sidebarIsOpenedLocalStorage ? JSON.parse(sidebarIsOpenedLocalStorage) : true;
};

export const DashboardLayoutProvider = ({children}) => {
    const [sidebarIsOpened, setSidebarIsOpened] = useState(getInitialSidebarState);
    
    const toggleSidebar = () => {
        setSidebarIsOpened(prevState => {
            const newState = !prevState;
            localStorage.setItem('sidebarIsOpened', newState);
            return newState;
        })
    }

    return (<DashboardLayoutContext.Provider value={{sidebarIsOpened, toggleSidebar}}>{children}</DashboardLayoutContext.Provider>)
}

export default DashboardLayoutContext;