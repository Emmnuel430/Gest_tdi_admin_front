import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.body.getAttribute("data-bs-theme");
      setIsDarkMode(currentTheme === "dark");
    };

    // sync initial
    updateTheme();

    // observer
    const observer = new MutationObserver(updateTheme);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-bs-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook custom (best practice React)
export const useTheme = () => {
  return useContext(ThemeContext);
};
