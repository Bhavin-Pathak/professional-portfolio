import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Detect OS dark preference safely
const getSystemDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

// eslint-disable-next-line react/prop-types
export function ThemeProvider({ children }) {
  // mode: 'dark' | 'light' | 'system'
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("theme-mode") || "dark"; } catch { return "dark"; }
  });

  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("theme-mode") || "dark";
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return getSystemDark();
    } catch { return true; }
  });

  useEffect(() => {
    const applyDark = (dark) => {
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);
    };

    try { localStorage.setItem("theme-mode", mode); } catch { /* fail silently */ }

    if (mode === "system") {
      // Apply current system preference immediately
      applyDark(getSystemDark());
      // Listen for OS-level changes
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e) => applyDark(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      applyDark(mode === "dark");
    }
  }, [mode]);

  // Cycle: dark → light → system → dark
  const cycleMode = () =>
    setMode((prev) => {
      if (prev === "dark") return "light";
      if (prev === "light") return "system";
      return "dark";
    });

  return (
    <ThemeContext.Provider value={{ isDark, mode, cycleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
