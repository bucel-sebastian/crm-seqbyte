import React, { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa6";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
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
  );
};

export default ThemeToggleButton;
