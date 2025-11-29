import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme =
  | "theme-green"
  | "theme-blue"
  | "theme-orange"
  | "theme-purple"
  | "theme-red"
  | "theme-teal";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("app-theme") as Theme;
    return savedTheme || "theme-green";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all existing theme classes
    root.classList.remove(
      "theme-green",
      "theme-blue",
      "theme-orange",
      "theme-purple",
      "theme-red",
      "theme-teal"
    );

    // Add the new theme class
    root.classList.add(theme);

    // Save to local storage
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
