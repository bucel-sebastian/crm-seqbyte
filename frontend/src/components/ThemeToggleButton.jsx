import React, { useContext } from "react";
import ThemeContext from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === "light-mode" ? "dark-mode" : "light-mode"} mode
    </button>
  );
};

export default ThemeToggleButton;
