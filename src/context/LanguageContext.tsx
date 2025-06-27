// front_end/src/context/LanguageContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance"; // Make sure this path is correct
import axios from "axios";

interface Theme {
  primary: string;
  secondary: string;
  version?: number;
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  theme: Theme;
  setTheme: (newTheme: Theme, page?: string) => void;
  resetTheme: (page: string) => void;
  getScopedTheme: (page: string) => Theme;
  undoThemeChange: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [theme, setThemeState] = useState<Theme>({
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    version: 1
  });

  const defaultThemes: Record<string, Theme> = {
    default: { primary: "#3b82f6", secondary: "#8b5cf6", version: 1 },
    dashboard: { primary: "#10b981", secondary: "#f97316", version: 1 },
    analytics: { primary: "#ef4444", secondary: "#f59e0b", version: 1 }
  };

  const setTheme = (newTheme: Theme, _page?: string) => {
    setThemeState(newTheme);
  };

  const resetTheme = (page: string) => {
    setThemeState(defaultThemes[page] || defaultThemes.default);
  };

  const getScopedTheme = (page: string): Theme => {
    return defaultThemes[page] || theme;
  };

  const undoThemeChange = async () => {
    try {
      const res = await axiosInstance.post("/api/settings/undo-theme");
      setThemeState(res.data.reverted_to);
    } catch (err) {
      console.error("Undo theme change failed:", err);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);

    axios.get("/api/settings").then(res => {
      if (res.data.theme) setThemeState(res.data.theme);
      if (res.data.language) setLanguage(res.data.language);
    }).catch(err => {
      console.warn("Failed to load user settings:", err);
    });
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        resetTheme,
        getScopedTheme,
        undoThemeChange
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// ✅ Exportable hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
