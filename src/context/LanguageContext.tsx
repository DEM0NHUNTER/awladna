// front_end/src/context/LanguageContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";

interface Theme {
  primary: string;
  secondary: string;
  version: number;
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  theme: Theme;
  setTheme: (newTheme: Theme, page: string) => void;
  resetTheme: (page: string) => void;
  getScopedTheme: (page: string) => Theme;
  undoThemeChange: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState<Theme>({
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    version: 1
  });

  const resetTheme = async (page: string) => {
    const defaultThemes = {
      default: { primary: "#3b82f6", secondary: "#8b5cf6", version: 1 },
      dashboard: { primary: "#10b981", secondary: "#f97316", version: 1 },
      analytics: { primary: "#ef4444", secondary: "#f59e0b", version: 1 }
    };

    setTheme(defaultThemes[page] || defaultThemes.default);
  };

  const getScopedTheme = (page: string): Theme => {
    return theme[page] || theme;
  };

  const undoThemeChange = async () => {
    try {
      const res = await axiosInstance.post("/api/settings/undo-theme");
      setTheme(res.data.reverted_to);
    } catch (err) {
      console.error("Undo failed", err);
    }
  };

  useEffect(() => {
    axios.get("/api/settings").then(res => {
      if (res.data.theme) {
        setTheme(res.data.theme);
      }
      if (res.data.language) {
        setLanguage(res.data.language);
      }
    });
  }, []);

  return (
    <LanguageContext.Provider value={{
      language, setLanguage, theme, setTheme, resetTheme, getScopedTheme, undoThemeChange
    }}>
      {children}
    </LanguageContext.Provider>
  );
};