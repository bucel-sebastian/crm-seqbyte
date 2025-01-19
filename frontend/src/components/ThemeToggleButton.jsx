import React, { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa6";
import { Tooltip } from "@mui/material";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Tooltip title={theme === "light-mode" ? "Mod intunecat" : "Mod luminos"}>
      <button className="theme-toggle-button" onClick={toggleTheme}>
        {theme === "light-mode" ? (
          <>
            <FaSun />
          </>
        ) : (
          <>
            <FaMoon />
          </>
        )}
      </button>
    </Tooltip>
  );
};

export default ThemeToggleButton;
